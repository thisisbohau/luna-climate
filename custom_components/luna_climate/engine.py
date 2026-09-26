"""The Luna Climate control engine.

One engine instance owns every zone. It resolves what each zone should be
doing right now and pushes that out to the underlying devices.

Resolution order, highest priority first:

1. **Boost** -- a temporary target with an expiry.
2. **Manual mode** -- the zone's own setpoint, schedule ignored.
3. **Away** -- every household presence tracker says nobody is home, the
   zone follows away, and precomfort is not suppressing it. Lowers the
   target to the global away temperature; an off block stays off.
4. **Schedule** -- the block in force right now, from the zone's workday
   or free-day schedule depending on what kind of day it is.

The resolved value is one of ``off``, ``max`` or a target temperature.
Thermostats receive a setpoint and regulate themselves. Linked devices
(a towel warmer, a panel heater) have no internal loop, so the engine runs
a bang-bang controller for them against the zone's measured temperature,
with a deadband and a minimum cycle time.
"""

from __future__ import annotations

import datetime as dt
import logging
from dataclasses import dataclass, field
from typing import Any

from homeassistant.components.binary_sensor import BinarySensorDeviceClass
from homeassistant.components.climate import (
    ATTR_CURRENT_HUMIDITY,
    ATTR_CURRENT_TEMPERATURE,
    ATTR_HVAC_ACTION,
    ATTR_MAX_TEMP,
    ATTR_MIN_TEMP,
    SERVICE_SET_HVAC_MODE,
    SERVICE_SET_TEMPERATURE,
    HVACAction,
    HVACMode,
)
from homeassistant.components.climate import (
    DOMAIN as CLIMATE_DOMAIN,
)
from homeassistant.components.sensor import SensorDeviceClass
from homeassistant.const import (
    ATTR_ENTITY_ID,
    ATTR_TEMPERATURE,
    SERVICE_TURN_OFF,
    SERVICE_TURN_ON,
    STATE_HOME,
    STATE_OFF,
    STATE_ON,
    STATE_UNAVAILABLE,
    STATE_UNKNOWN,
)
from homeassistant.core import Event, HomeAssistant, State, callback, split_entity_id
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.event import (
    async_track_point_in_utc_time,
    async_track_state_change_event,
    async_track_time_interval,
)
from homeassistant.util import dt as dt_util

from .const import (
    BATTERY_WARN_THRESHOLD,
    CONF_AWAY_ENABLED,
    CONF_HUMIDITY_SENSORS,
    CONF_LINKED_DEVICES,
    CONF_NAME,
    CONF_TEMP_SENSORS,
    CONF_THERMOSTATS,
    CONF_ZONE_ID,
    GLOBAL_AWAY_TEMP,
    GLOBAL_PRECOMFORT_TIMEOUT,
    MAX_TEMP,
    MODE_AUTO,
    MODE_MANUAL,
    SET_BOOST_OFFSET,
    SET_HYSTERESIS,
    SET_MIN_CYCLE,
    SIGNAL_UPDATE,
    VALUE_MAX,
    VALUE_OFF,
    WORKDAY_TODAY,
    WORKDAY_TOMORROW,
    ZONE_MAX_TEMP,
    ZONE_MIN_TEMP,
)
from .schedule import (
    DAY_FREE,
    DAY_WORKDAY,
    ActiveBlock,
    Schedules,
    active_block,
    parse_schedules,
    schedules_as_dict,
)
from .store import LunaStore

_LOGGER = logging.getLogger(__name__)

#: How often the engine re-evaluates even with nothing changing. Cheap, and
#: it is what recovers a device that drifted away behind our back.
TICK = dt.timedelta(minutes=1)

#: States that mean "home": input_boolean / binary_sensor report ``on``,
#: person / device_tracker report ``home``.
HOME_STATES = frozenset({STATE_ON, STATE_HOME})

SOURCE_BOOST = "boost"
SOURCE_MANUAL = "manual"
SOURCE_AWAY = "away"
SOURCE_SCHEDULE = "schedule"
SOURCE_NONE = "none"


@dataclass
class ZoneConfig:
    """Structural configuration of a zone, from the config entry options."""

    zone_id: str
    name: str
    thermostats: list[str] = field(default_factory=list)
    temp_sensors: list[str] = field(default_factory=list)
    linked_devices: list[str] = field(default_factory=list)
    away_enabled: bool = True
    humidity_sensors: list[str] = field(default_factory=list)

    @classmethod
    def from_dict(cls, raw: dict[str, Any]) -> ZoneConfig:
        """Build from the stored options mapping."""
        return cls(
            zone_id=raw[CONF_ZONE_ID],
            name=raw[CONF_NAME],
            thermostats=list(raw.get(CONF_THERMOSTATS) or []),
            temp_sensors=list(raw.get(CONF_TEMP_SENSORS) or []),
            linked_devices=list(raw.get(CONF_LINKED_DEVICES) or []),
            away_enabled=bool(raw.get(CONF_AWAY_ENABLED, True)),
            humidity_sensors=list(raw.get(CONF_HUMIDITY_SENSORS) or []),
        )

    @property
    def all_device_entities(self) -> list[str]:
        """Every entity the zone controls or reads, in role order."""
        return [
            *self.thermostats,
            *self.temp_sensors,
            *self.linked_devices,
            *self.humidity_sensors,
        ]


@dataclass
class Resolved:
    """What a zone should be doing right now."""

    value: str | float
    source: str
    block: ActiveBlock | None = None

    @property
    def is_off(self) -> bool:
        """True when the zone should not heat at all."""
        return self.value == VALUE_OFF

    @property
    def is_max(self) -> bool:
        """True when the zone should heat unconditionally."""
        return self.value == VALUE_MAX

    @property
    def target(self) -> float | None:
        """The numeric target, or ``None`` when the zone is off."""
        if self.value == VALUE_OFF:
            return None
        if self.value == VALUE_MAX:
            return MAX_TEMP
        return float(self.value)


class LunaEngine:
    """Resolves and applies the desired state of every zone."""

    def __init__(self, hass: HomeAssistant, store: LunaStore) -> None:
        """Set up the engine."""
        self.hass = hass
        self.store = store
        self.zones: dict[str, ZoneConfig] = {}

        self._unsub_tick = None
        self._unsub_states = None
        self._boost_until: dict[str, dt.datetime] = {}
        self._boost_started: dict[str, dt.datetime] = {}
        self._boost_target: dict[str, str | float] = {}
        self._boost_timers: dict[str, Any] = {}
        self._precomfort_until: dt.datetime | None = None
        self._precomfort_timer = None
        self._last_switch: dict[str, dt.datetime] = {}
        self._pending_cycle: dict[str, Any] = {}
        self._applying = False
        self._dirty = False
        self._humidity_sources: dict[str, list[str]] = {}
        self._battery_sources: dict[str, list[str]] = {}
        self.presence_entities: list[str] = []
        self.workday_entity: str | None = None
        self.workday_offset: str = WORKDAY_TOMORROW

    # -- lifecycle --------------------------------------------------------

    async def async_start(
        self,
        zones: list[dict[str, Any]],
        presence: list[str] | None = None,
        workday_entity: str | None = None,
        workday_offset: str = WORKDAY_TOMORROW,
    ) -> None:
        """Start the engine for the given zones, presence and workday source."""
        self.workday_entity = workday_entity or None
        self.workday_offset = (
            workday_offset if workday_offset in (WORKDAY_TODAY, WORKDAY_TOMORROW)
            else WORKDAY_TOMORROW
        )
        self.set_zones(zones, presence)
        await self._async_record_workday()
        self._unsub_tick = async_track_time_interval(self.hass, self._on_tick, TICK)
        self._resubscribe()
        await self.async_apply_all()

    def set_zones(
        self, zones: list[dict[str, Any]], presence: list[str] | None = None
    ) -> None:
        """Replace the zone configuration and, if given, the presence list."""
        self.zones = {
            raw[CONF_ZONE_ID]: ZoneConfig.from_dict(raw) for raw in zones
        }
        if presence is not None:
            self.presence_entities = list(presence)
        self._resubscribe()

    async def async_stop(self) -> None:
        """Tear down every listener and timer."""
        for unsub in (self._unsub_tick, self._unsub_states, self._precomfort_timer):
            if unsub is not None:
                unsub()
        self._unsub_tick = None
        self._unsub_states = None
        self._precomfort_timer = None
        for timer in self._boost_timers.values():
            timer()
        self._boost_timers.clear()
        for timer in self._pending_cycle.values():
            timer()
        self._pending_cycle.clear()

    def _discover(self) -> bool:
        """Find each zone's humidity and battery entities.

        Returns True when anything changed. Re-run every tick, because the
        integrations that own those entities may finish loading after us.
        """
        humidity = {
            zone.zone_id: self._discover_humidity(zone) for zone in self.zones.values()
        }
        battery = {
            zone.zone_id: self._discover_batteries(zone) for zone in self.zones.values()
        }
        changed = humidity != self._humidity_sources or battery != self._battery_sources
        self._humidity_sources = humidity
        self._battery_sources = battery
        return changed

    def _resubscribe(self) -> None:
        """Watch every entity whose change could alter a zone's decision."""
        if self._unsub_states is not None:
            self._unsub_states()
            self._unsub_states = None

        self._discover()

        watched: set[str] = set(self.presence_entities)
        if self.workday_entity:
            watched.add(self.workday_entity)
        for zone in self.zones.values():
            watched.update(zone.temp_sensors)
            watched.update(zone.linked_devices)
            watched.update(self._humidity_sources.get(zone.zone_id, []))
            watched.update(self._battery_sources.get(zone.zone_id, []))
        if not watched:
            return
        self._unsub_states = async_track_state_change_event(
            self.hass, sorted(watched), self._on_state_change
        )

    # -- events -----------------------------------------------------------

    @callback
    def _on_tick(self, _now: dt.datetime) -> None:
        if self._discover():
            self._resubscribe()
        self.hass.async_create_task(self._async_tick())

    async def _async_tick(self) -> None:
        await self._async_record_workday()
        await self.async_apply_all()

    @callback
    def _on_state_change(self, event: Event) -> None:
        new: State | None = event.data.get("new_state")
        if new is None or new.state in (STATE_UNAVAILABLE, STATE_UNKNOWN):
            return
        entity_id = event.data["entity_id"]

        if entity_id == self.workday_entity:
            self.hass.async_create_task(self._async_record_workday())

        # Anyone arriving home cancels the precomfort grace period; it has
        # done its job.
        if (
            self._precomfort_until is not None
            and entity_id in self.presence_entities
            and new.state in HOME_STATES
        ):
            self.clear_precomfort()

        self.hass.async_create_task(self.async_apply_all())

    # -- resolution -------------------------------------------------------

    def schedules(self, zone_id: str) -> Schedules:
        """Parsed workday and free-day schedules for a zone."""
        try:
            return parse_schedules(self.store.zone(zone_id)["schedules"])
        except Exception:  # noqa: BLE001 - never let a bad block stop control
            _LOGGER.exception("Zone %s has an unreadable schedule", zone_id)
            return {DAY_WORKDAY: [], DAY_FREE: []}

    def active_block(self, zone_id: str, now: dt.datetime | None = None) -> ActiveBlock | None:
        """The schedule block in force for a zone, ignoring away/boost/manual."""
        return active_block(self.schedules(zone_id), self.day_type, now or dt_util.now())

    # -- workday / free day ------------------------------------------------

    def _workday_reading(self) -> bool | None:
        """The workday entity's current reading, or None if unusable."""
        if not self.workday_entity:
            return None
        state = self.hass.states.get(self.workday_entity)
        if state is None:
            return None
        if state.state == STATE_ON:
            return True
        if state.state == STATE_OFF:
            return False
        return None

    async def _async_record_workday(self) -> None:
        """Remember what the workday entity says today.

        With a sensor that describes *tomorrow*, today's day type is what it
        said yesterday -- which only survives a restart if it was written
        down. The last reading of each date wins.
        """
        reading = self._workday_reading()
        if reading is None:
            return
        if self.store.record_workday(dt_util.now().date(), reading):
            await self.store.async_save()

    def day_type_info(self, day: dt.date) -> tuple[str, bool]:
        """Return (day type, whether the workday entity decided it).

        The entity is read for the day it describes: with the "tomorrow"
        offset, the reading taken on the day before; with "today", the
        reading on the day itself. Readings from the past come from the
        stored log, the present from the live state. Without a usable
        reading, Monday to Friday count as workdays.
        """
        if self.workday_entity:
            today = dt_util.now().date()
            source = day - dt.timedelta(days=1) if self.workday_offset == WORKDAY_TOMORROW else day
            reading: bool | None = None
            if source == today:
                reading = self._workday_reading()
                if reading is None:
                    reading = self.store.workday_reading(today)
            elif source < today:
                reading = self.store.workday_reading(source)
            if reading is not None:
                return (DAY_WORKDAY if reading else DAY_FREE), True
        return (DAY_WORKDAY if day.weekday() < 5 else DAY_FREE), False

    def day_type(self, day: dt.date) -> str:
        """``workday`` or ``free`` for a date."""
        return self.day_type_info(day)[0]

    @property
    def everyone_away(self) -> bool:
        """True when every presence tracker says nobody is home.

        With no trackers configured the house is never away. A tracker that
        is unknown or unavailable counts as home -- otherwise a restart, or
        a phone that has not reported yet, would cool the house down.
        """
        if not self.presence_entities:
            return False
        for entity_id in self.presence_entities:
            state = self.hass.states.get(entity_id)
            if state is None or state.state in (STATE_UNAVAILABLE, STATE_UNKNOWN):
                return False
            if state.state in HOME_STATES:
                return False
        return True

    def is_away(self, zone: ZoneConfig) -> bool:
        """True when this zone should run its away temperature.

        Presence is global; each zone only decides whether it follows it.
        Precomfort suppresses away for every zone.
        """
        if not zone.away_enabled or self.precomfort_active:
            return False
        return self.everyone_away

    @property
    def precomfort_active(self) -> bool:
        """True while the precomfort grace period suppresses away mode."""
        if self._precomfort_until is None:
            return False
        if dt_util.utcnow() >= self._precomfort_until:
            self._precomfort_until = None
            return False
        return True

    def resolve(self, zone: ZoneConfig) -> Resolved:
        """Work out what this zone should be doing right now."""
        until = self._boost_until.get(zone.zone_id)
        if until is not None and dt_util.utcnow() < until:
            return Resolved(self._boost_target[zone.zone_id], SOURCE_BOOST)
        return self.resolve_base(zone)

    def resolve_base(self, zone: ZoneConfig) -> Resolved:
        """Resolve a zone as if no boost were running.

        Boost builds on this, so a second boost started while one is
        running adds to the underlying target rather than stacking.
        """
        state = self.store.zone(zone.zone_id)

        if state["mode"] == MODE_MANUAL:
            return Resolved(normalise_target(state["manual_temp"]), SOURCE_MANUAL)

        block = self.active_block(zone.zone_id)

        if self.is_away(zone):
            # Away only ever lowers the target. An off block (or no
            # schedule) stays off; a lower block keeps its own value.
            away = float(self.store.global_setting(GLOBAL_AWAY_TEMP))
            if block is None or block.value == VALUE_OFF:
                return Resolved(VALUE_OFF, SOURCE_AWAY, block)
            if block.value == VALUE_MAX:
                return Resolved(away, SOURCE_AWAY, block)
            return Resolved(min(away, float(block.value)), SOURCE_AWAY, block)

        if block is None:
            return Resolved(VALUE_OFF, SOURCE_NONE)
        return Resolved(block.value, SOURCE_SCHEDULE, block)

    def measured_temperature(self, zone: ZoneConfig) -> float | None:
        """Mean of the zone's temperature sensors, or ``None``.

        Falls back to the thermostats' own readings when no dedicated
        sensor is configured.
        """
        readings: list[float] = []
        for entity_id in zone.temp_sensors:
            state = self.hass.states.get(entity_id)
            if state is None:
                continue
            value = _as_float(state.state)
            if value is None:
                # A climate entity used as the zone's sensor reports its
                # reading as an attribute rather than as its state.
                value = _as_float(state.attributes.get(ATTR_CURRENT_TEMPERATURE))
            if value is not None:
                readings.append(value)

        if not readings:
            for entity_id in zone.thermostats:
                state = self.hass.states.get(entity_id)
                if state is None:
                    continue
                value = _as_float(state.attributes.get(ATTR_CURRENT_TEMPERATURE))
                if value is not None:
                    readings.append(value)

        if not readings:
            return None
        return round(sum(readings) / len(readings), 2)

    def _discover_humidity(self, zone: ZoneConfig) -> list[str]:
        """Find the humidity sensors a zone should report.

        Explicitly configured sensors win. Otherwise the zone borrows the
        humidity entities that live on the same devices as its temperature
        sensors and thermostats -- an Aqara sensor or a Tado valve exposed
        through TadoLocal both carry one -- so most zones need no extra
        configuration at all.
        """
        if zone.humidity_sensors:
            return list(zone.humidity_sensors)

        registry = er.async_get(self.hass)
        found: list[str] = []
        seen_devices: set[str] = set()
        for entity_id in [*zone.temp_sensors, *zone.thermostats]:
            entry = registry.async_get(entity_id)
            if entry is None or not entry.device_id or entry.device_id in seen_devices:
                continue
            seen_devices.add(entry.device_id)
            for candidate in er.async_entries_for_device(registry, entry.device_id):
                if candidate.domain != "sensor" or candidate.disabled_by is not None:
                    continue
                device_class = candidate.device_class or candidate.original_device_class
                if device_class == SensorDeviceClass.HUMIDITY and candidate.entity_id not in found:
                    found.append(candidate.entity_id)
        return found

    def humidity_sources(self, zone_id: str) -> list[str]:
        """The humidity entities in use for a zone, explicit or discovered."""
        return list(self._humidity_sources.get(zone_id, []))

    def _zone_devices(self, zone: ZoneConfig) -> list[str]:
        """Every device behind a zone, including devices linked *to* them.

        A zone's own entities often sit on a logical device rather than the
        hardware: TadoLocal puts each Tado zone's climate entity on a zone
        device, and the valves and sensors in that zone -- the ones with the
        batteries -- are separate devices connected via it. So the walk goes
        from each configured entity's device down to everything registered
        ``via_device`` it, however deep.
        """
        ent_reg = er.async_get(self.hass)
        dev_reg = dr.async_get(self.hass)
        found: list[str] = []
        for entity_id in zone.all_device_entities:
            entry = ent_reg.async_get(entity_id)
            if entry is not None and entry.device_id and entry.device_id not in found:
                found.append(entry.device_id)

        children: dict[str, list[str]] = {}
        for device in dev_reg.devices.values():
            if device.via_device_id:
                children.setdefault(device.via_device_id, []).append(device.id)
        queue = list(found)
        while queue:
            for child in children.get(queue.pop(0), []):
                if child not in found:
                    found.append(child)
                    queue.append(child)
        return found

    def _discover_batteries(self, zone: ZoneConfig) -> list[str]:
        """Battery entities (percentages and low flags) of a zone's devices."""
        ent_reg = er.async_get(self.hass)
        found: list[str] = []
        for device_id in self._zone_devices(zone):
            for entry in er.async_entries_for_device(ent_reg, device_id):
                if entry.domain not in ("sensor", "binary_sensor"):
                    continue
                device_class = entry.device_class or entry.original_device_class
                if device_class in (SensorDeviceClass.BATTERY, BinarySensorDeviceClass.BATTERY):
                    found.append(entry.entity_id)
        return found

    def battery_status(self, zone_id: str) -> list[dict[str, Any]]:
        """Every battery behind a zone with its reading and a low flag.

        A percentage is low below ``BATTERY_WARN_THRESHOLD``; a flag-style
        battery (Tado) is low when its flag is on. Unavailable entities are
        listed without a verdict.
        """
        dev_reg = dr.async_get(self.hass)
        ent_reg = er.async_get(self.hass)
        result: list[dict[str, Any]] = []
        for entity_id in self._battery_sources.get(zone_id, []):
            entry = ent_reg.async_get(entity_id)
            device = dev_reg.async_get(entry.device_id) if entry and entry.device_id else None
            name = (device.name_by_user or device.name) if device else entity_id
            state = self.hass.states.get(entity_id)
            item: dict[str, Any] = {"entity_id": entity_id, "device": name, "low": None}
            if state is not None and state.state not in (STATE_UNAVAILABLE, STATE_UNKNOWN):
                if entity_id.startswith("binary_sensor."):
                    item["low"] = state.state == STATE_ON
                else:
                    level = _as_float(state.state)
                    if level is not None:
                        item["level"] = level
                        item["low"] = level < BATTERY_WARN_THRESHOLD
            result.append(item)
        return result

    def battery_low(self, zone_id: str) -> bool:
        """True when any battery behind the zone is low."""
        return any(item["low"] for item in self.battery_status(zone_id))

    def measured_humidity(self, zone: ZoneConfig) -> float | None:
        """Mean relative humidity of the zone, or ``None``.

        Falls back to the thermostats' own ``current_humidity`` when no
        humidity sensor is known.
        """
        readings: list[float] = []
        for entity_id in self._humidity_sources.get(zone.zone_id, zone.humidity_sensors):
            state = self.hass.states.get(entity_id)
            if state is None:
                continue
            value = _as_float(state.state)
            if value is not None:
                readings.append(value)

        if not readings:
            for entity_id in zone.thermostats:
                state = self.hass.states.get(entity_id)
                if state is None:
                    continue
                value = _as_float(state.attributes.get(ATTR_CURRENT_HUMIDITY))
                if value is not None:
                    readings.append(value)

        if not readings:
            return None
        return round(sum(readings) / len(readings), 1)

    def zone_is_heating(self, zone: ZoneConfig) -> bool:
        """True when anything in the zone is currently calling for heat."""
        for entity_id in zone.thermostats:
            state = self.hass.states.get(entity_id)
            if state is None:
                continue
            action = state.attributes.get(ATTR_HVAC_ACTION)
            if action == HVACAction.HEATING:
                return True
        for entity_id in zone.linked_devices:
            state = self.hass.states.get(entity_id)
            if state is not None and state.state == STATE_ON:
                return True
        return False

    # -- application ------------------------------------------------------

    async def async_apply_all(self) -> None:
        """Re-evaluate and apply every zone.

        Runs under a lock so two overlapping triggers cannot issue
        conflicting commands. A request that arrives while an apply is in
        flight is not dropped -- it sets a dirty flag and the loop runs
        again, otherwise a temperature crossing its threshold mid-apply
        would go unnoticed until the next tick.
        """
        self._dirty = True
        if self._applying:
            return
        self._applying = True
        try:
            while self._dirty:
                self._dirty = False
                for zone in list(self.zones.values()):
                    try:
                        await self.async_apply_zone(zone)
                    except Exception:  # noqa: BLE001 - one bad zone must
                        # not stop the others from being controlled.
                        _LOGGER.exception("Failed to apply zone %s", zone.name)
        finally:
            self._applying = False
        async_dispatcher_send(self.hass, SIGNAL_UPDATE)

    async def async_apply_zone(self, zone: ZoneConfig) -> None:
        """Push a zone's resolved state out to its devices."""
        resolved = self.resolve(zone)
        await self._apply_thermostats(zone, resolved)
        await self._apply_linked_devices(zone, resolved)

    async def _apply_thermostats(self, zone: ZoneConfig, resolved: Resolved) -> None:
        for entity_id in zone.thermostats:
            state = self.hass.states.get(entity_id)
            if state is None or state.state == STATE_UNAVAILABLE:
                continue

            if resolved.is_off:
                if state.state != HVACMode.OFF:
                    await self._call(
                        CLIMATE_DOMAIN,
                        SERVICE_SET_HVAC_MODE,
                        {ATTR_ENTITY_ID: entity_id, "hvac_mode": HVACMode.OFF},
                    )
                continue

            target = resolved.target
            if target is None:
                continue
            # Respect what this particular device can actually accept; a
            # Tado valve tops out below our MAX.
            low = _as_float(state.attributes.get(ATTR_MIN_TEMP)) or ZONE_MIN_TEMP
            high = _as_float(state.attributes.get(ATTR_MAX_TEMP)) or ZONE_MAX_TEMP
            clamped = min(max(target, low), high)

            if state.state == HVACMode.OFF:
                await self._call(
                    CLIMATE_DOMAIN,
                    SERVICE_SET_HVAC_MODE,
                    {ATTR_ENTITY_ID: entity_id, "hvac_mode": HVACMode.HEAT},
                )

            current = _as_float(state.attributes.get(ATTR_TEMPERATURE))
            if current is None or abs(current - clamped) > 0.05:
                await self._call(
                    CLIMATE_DOMAIN,
                    SERVICE_SET_TEMPERATURE,
                    {ATTR_ENTITY_ID: entity_id, ATTR_TEMPERATURE: clamped},
                )

    async def _apply_linked_devices(
        self, zone: ZoneConfig, resolved: Resolved
    ) -> None:
        if not zone.linked_devices:
            return

        if resolved.is_off:
            desired: bool | None = False
        elif resolved.is_max:
            desired = True
        else:
            desired = self._bang_bang(zone, resolved)

        if desired is None:
            return

        for entity_id in zone.linked_devices:
            await self._set_switch(zone, entity_id, desired)

    def _bang_bang(self, zone: ZoneConfig, resolved: Resolved) -> bool | None:
        """Decide a linked device's state from the measured temperature.

        Returns ``None`` when the reading is missing or the temperature sits
        inside the deadband, meaning: leave the device where it is.
        """
        target = resolved.target
        measured = self.measured_temperature(zone)
        if target is None or measured is None:
            if measured is None:
                _LOGGER.debug(
                    "Zone %s has no temperature reading; leaving linked "
                    "devices untouched",
                    zone.name,
                )
            return None

        hysteresis = float(self.store.setting(zone.zone_id, SET_HYSTERESIS))
        if measured < target - hysteresis:
            return True
        if measured > target + hysteresis:
            return False
        return None

    async def _set_switch(
        self, zone: ZoneConfig, entity_id: str, desired: bool
    ) -> None:
        """Switch a linked device, honouring its minimum cycle time."""
        state = self.hass.states.get(entity_id)
        if state is None or state.state == STATE_UNAVAILABLE:
            return
        currently_on = state.state == STATE_ON
        if currently_on == desired:
            return

        min_cycle = dt.timedelta(
            minutes=float(self.store.setting(zone.zone_id, SET_MIN_CYCLE))
        )
        now = dt_util.utcnow()
        last = self._last_switch.get(entity_id)
        if last is None:
            # First sight of this device in this run. Home Assistant stamps
            # restored states with the restart time, so its last_changed
            # says nothing useful here -- taking it at face value would
            # freeze every linked device for a full cycle after each
            # restart, potentially leaving one running that should be off.
            # The window exists to damp our own control loop, so start it
            # already expired and enforce it only for our own changes.
            last = now - min_cycle
            self._last_switch[entity_id] = last

        elapsed = now - last
        if elapsed < min_cycle:
            # Defer rather than drop: dropping would strand the device in
            # the wrong state until something else happened to change.
            self._schedule_recheck(entity_id, now + (min_cycle - elapsed))
            _LOGGER.debug(
                "Holding %s for another %s (minimum cycle time)",
                entity_id,
                min_cycle - elapsed,
            )
            return

        # The device's own domain (switch.turn_on, input_boolean.turn_on),
        # so control does not depend on the core "homeassistant" helpers.
        await self._call(
            split_entity_id(entity_id)[0],
            SERVICE_TURN_ON if desired else SERVICE_TURN_OFF,
            {ATTR_ENTITY_ID: entity_id},
        )
        self._last_switch[entity_id] = now

    def _schedule_recheck(self, key: str, when: dt.datetime) -> None:
        """Re-evaluate once a minimum cycle window expires."""
        if key in self._pending_cycle:
            return

        @callback
        def _fire(_now: dt.datetime) -> None:
            self._pending_cycle.pop(key, None)
            self.hass.async_create_task(self.async_apply_all())

        self._pending_cycle[key] = async_track_point_in_utc_time(
            self.hass, _fire, when
        )

    async def _call(self, domain: str, service: str, data: dict[str, Any]) -> None:
        await self.hass.services.async_call(domain, service, data, blocking=False)

    # -- boost ------------------------------------------------------------

    def boost_ends_at(self, zone_id: str) -> dt.datetime | None:
        """When the current boost expires, or ``None``."""
        until = self._boost_until.get(zone_id)
        if until is None or dt_util.utcnow() >= until:
            return None
        return until

    def boost_started_at(self, zone_id: str) -> dt.datetime | None:
        """When the current boost started, or ``None`` when idle."""
        if self.boost_ends_at(zone_id) is None:
            return None
        return self._boost_started.get(zone_id)

    async def async_boost(
        self, zone_id: str, minutes: float, temperature: float | None = None
    ) -> None:
        """Boost a zone for a number of minutes.

        Without an explicit temperature the boost adds the zone's offset to
        its underlying target, ignoring any boost already running, so
        repeated taps restart the timer rather than ratcheting the
        temperature up. A zone that is off, or already at max, boosts to
        max.

        When the boost expires the zone returns to whatever is in force at
        that moment -- the *current* schedule block, not the one that was
        running when the boost started.
        """
        zone = self.zones.get(zone_id)
        if zone is None:
            raise ValueError(f"Unknown zone: {zone_id}")

        target: str | float
        if temperature is None:
            base = self.resolve_base(zone)
            if base.is_off or base.is_max or base.target is None:
                target = VALUE_MAX
            else:
                offset = float(self.store.setting(zone_id, SET_BOOST_OFFSET))
                target = min(base.target + offset, ZONE_MAX_TEMP)
        else:
            target = normalise_target(temperature)

        now = dt_util.utcnow()
        until = now + dt.timedelta(minutes=minutes)
        self._boost_started[zone_id] = now
        self._boost_until[zone_id] = until
        self._boost_target[zone_id] = target

        if (existing := self._boost_timers.pop(zone_id, None)) is not None:
            existing()

        @callback
        def _expire(_now: dt.datetime) -> None:
            self._drop_boost(zone_id)
            self.hass.async_create_task(self.async_apply_all())

        self._boost_timers[zone_id] = async_track_point_in_utc_time(
            self.hass, _expire, until
        )
        await self.async_apply_all()

    async def async_cancel_boost(self, zone_id: str) -> None:
        """End a boost early."""
        self._drop_boost(zone_id)
        await self.async_apply_all()

    def _drop_boost(self, zone_id: str) -> None:
        if (timer := self._boost_timers.pop(zone_id, None)) is not None:
            timer()
        self._boost_until.pop(zone_id, None)
        self._boost_started.pop(zone_id, None)
        self._boost_target.pop(zone_id, None)

    # -- manual control ---------------------------------------------------

    async def async_set_manual(self, zone_id: str, value: Any) -> None:
        """Hold a zone at a fixed value, pausing its schedule.

        ``value`` is ``off``, ``max`` or a temperature. Setting a target is
        an explicit instruction, so it also ends any running boost --
        otherwise the change would sit invisibly behind the boost until it
        expired.
        """
        if zone_id not in self.zones:
            raise ValueError(f"Unknown zone: {zone_id}")
        state = self.store.zone(zone_id)
        state["mode"] = MODE_MANUAL
        state["manual_temp"] = normalise_target(value)
        self._drop_boost(zone_id)
        await self.store.async_save()
        await self.async_apply_all()

    async def async_resume_schedule(self, zone_id: str) -> None:
        """Hand a zone back to its schedule."""
        if zone_id not in self.zones:
            raise ValueError(f"Unknown zone: {zone_id}")
        self.store.zone(zone_id)["mode"] = MODE_AUTO
        await self.store.async_save()
        await self.async_apply_all()

    # -- precomfort -------------------------------------------------------

    async def async_start_precomfort(self) -> None:
        """Suppress away mode so every zone resumes its current block.

        Triggered by the wider precomfort geofence. Cleared as soon as
        somebody actually arrives, or after the timeout if nobody does.
        """
        minutes = float(self.store.global_setting(GLOBAL_PRECOMFORT_TIMEOUT))
        self._precomfort_until = dt_util.utcnow() + dt.timedelta(minutes=minutes)

        if self._precomfort_timer is not None:
            self._precomfort_timer()

        @callback
        def _expire(_now: dt.datetime) -> None:
            self._precomfort_timer = None
            self._precomfort_until = None
            self.hass.async_create_task(self.async_apply_all())

        self._precomfort_timer = async_track_point_in_utc_time(
            self.hass, _expire, self._precomfort_until
        )
        await self.async_apply_all()

    @callback
    def clear_precomfort(self) -> None:
        """Drop the precomfort grace period."""
        if self._precomfort_timer is not None:
            self._precomfort_timer()
            self._precomfort_timer = None
        self._precomfort_until = None

    @property
    def precomfort_until(self) -> dt.datetime | None:
        """Expiry of the precomfort grace period, if one is running."""
        return self._precomfort_until

    # -- schedule editing -------------------------------------------------

    async def async_set_schedules(
        self, zone_id: str, raw: dict[str, list[dict[str, Any]]]
    ) -> None:
        """Replace one or both of a zone's day schedules and re-apply.

        Day types missing from ``raw`` are left as they are.
        """
        current = schedules_as_dict(self.schedules(zone_id))
        current.update(raw)
        parsed = parse_schedules(current)
        self.store.zone(zone_id)["schedules"] = schedules_as_dict(parsed)
        await self.store.async_save()
        await self.async_apply_all()

    def get_schedules(self, zone_id: str) -> dict[str, list[dict[str, Any]]]:
        """A zone's two day schedules in their stored form."""
        return schedules_as_dict(self.schedules(zone_id))

    def day_types(self) -> dict[str, Any]:
        """Day types for yesterday, today and tomorrow, for the frontend."""
        today = dt_util.now().date()
        result: dict[str, Any] = {}
        for label, delta in (("yesterday", -1), ("today", 0), ("tomorrow", 1)):
            kind, _from_entity = self.day_type_info(today + dt.timedelta(days=delta))
            result[label] = kind
        result["from_entity"] = self.day_type_info(today)[1]
        return result


def normalise_target(value: Any) -> str | float:
    """Coerce a manual or boost target to ``off``, ``max`` or a float.

    Anything at or above ``MAX_TEMP`` becomes ``max``, so a linked device
    runs unconditionally rather than regulating against an unreachable
    27 °C.
    """
    if isinstance(value, str):
        lowered = value.strip().lower()
        if lowered in (VALUE_OFF, VALUE_MAX):
            return lowered
        try:
            value = float(lowered)
        except ValueError as err:
            raise ValueError(f"Invalid target: {value!r}") from err
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ValueError(f"Invalid target: {value!r}")
    number = round(float(value) * 2) / 2
    if number >= MAX_TEMP:
        return VALUE_MAX
    return min(max(number, ZONE_MIN_TEMP), ZONE_MAX_TEMP)


def _as_float(value: Any) -> float | None:
    """Best-effort float conversion that never raises."""
    if value is None:
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None
