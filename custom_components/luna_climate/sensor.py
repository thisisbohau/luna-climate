"""Diagnostic sensors for each zone.

Notably ``battery_min``: it walks from every entity configured in the zone
to its device, then collects that device's battery entities. Two kinds turn
up in practice -- a percentage, and a plain "battery low" flag. Tado
devices behind TadoLocal only ever report the flag, and only while the
cloud metadata sync is reachable, so both shapes are surfaced separately
rather than being forced into one number.
"""

from __future__ import annotations

import datetime as dt
from typing import Any

from homeassistant.components.sensor import (
    RestoreSensor,
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.const import (
    PERCENTAGE,
    STATE_ON,
    STATE_UNAVAILABLE,
    STATE_UNKNOWN,
    EntityCategory,
    UnitOfTemperature,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from .const import (
    BATTERY_WARN_THRESHOLD,
    GLOBAL_NIGHT_END,
    GLOBAL_NIGHT_START,
    VALUE_MAX,
    VALUE_OFF,
)
from .engine import LunaEngine, ZoneConfig
from .entity import LunaZoneEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: Any,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the zone sensors."""
    engine: LunaEngine = entry.runtime_data.engine
    entities: list[SensorEntity] = []
    for zone in engine.zones.values():
        entities.append(LunaScheduledTemp(engine, zone))
        entities.append(LunaBoostEndsAt(engine, zone))
        entities.append(LunaBatteryMin(engine, zone))
        entities.append(LunaNightAvgTemp(engine, zone))
    async_add_entities(entities)


class LunaScheduledTemp(LunaZoneEntity, SensorEntity):
    """What the schedule alone says, ignoring away, boost and manual."""

    _attr_translation_key = "scheduled_temp"
    _attr_icon = "mdi:calendar-clock"

    def __init__(self, engine: LunaEngine, zone: ZoneConfig) -> None:
        """Set up the sensor."""
        super().__init__(engine, zone, "scheduled_temp")

    @property
    def native_value(self) -> str | float | None:
        """The current block's value."""
        from .schedule import active_block

        block = active_block(
            self.engine.schedule_blocks(self.zone.zone_id), dt_util.now()
        )
        if block is None:
            return None
        return block.value

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Block boundaries, so automations need not parse the schedule."""
        from .schedule import active_block

        block = active_block(
            self.engine.schedule_blocks(self.zone.zone_id), dt_util.now()
        )
        if block is None:
            return {"luna_block_start": None, "luna_block_end": None}
        return {
            "luna_block_start": block.start.isoformat(),
            "luna_block_end": block.end.isoformat() if block.end else None,
            "luna_is_off": block.value == VALUE_OFF,
            "luna_is_max": block.value == VALUE_MAX,
        }


class LunaBoostEndsAt(LunaZoneEntity, SensorEntity):
    """When the running boost expires."""

    _attr_translation_key = "boost_ends_at"
    _attr_icon = "mdi:timer-outline"
    _attr_device_class = SensorDeviceClass.TIMESTAMP

    def __init__(self, engine: LunaEngine, zone: ZoneConfig) -> None:
        """Set up the sensor."""
        super().__init__(engine, zone, "boost_ends_at")

    @property
    def native_value(self) -> dt.datetime | None:
        """Boost expiry, or ``None`` when no boost is running."""
        return self.engine.boost_ends_at(self.zone.zone_id)


class LunaBatteryMin(LunaZoneEntity, SensorEntity):
    """Lowest battery percentage among the zone's devices."""

    _attr_translation_key = "battery_min"
    _attr_device_class = SensorDeviceClass.BATTERY
    _attr_native_unit_of_measurement = PERCENTAGE
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, engine: LunaEngine, zone: ZoneConfig) -> None:
        """Set up the sensor."""
        super().__init__(engine, zone, "battery_min")

    def _collect(self) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
        """Return (percentage readings, low-battery flags) for the zone."""
        ent_reg = er.async_get(self.hass)
        dev_reg = dr.async_get(self.hass)

        device_ids: set[str] = set()
        for entity_id in self.zone.all_device_entities:
            entry = ent_reg.async_get(entity_id)
            if entry is not None and entry.device_id:
                device_ids.add(entry.device_id)

        percentages: list[dict[str, Any]] = []
        flags: list[dict[str, Any]] = []

        for device_id in device_ids:
            device = dev_reg.async_get(device_id)
            device_name = device.name_by_user or device.name if device else device_id
            for entry in er.async_entries_for_device(
                ent_reg, device_id, include_disabled_entities=False
            ):
                state = self.hass.states.get(entry.entity_id)
                if state is None or state.state in (
                    STATE_UNAVAILABLE,
                    STATE_UNKNOWN,
                ):
                    continue
                device_class = state.attributes.get("device_class")
                if device_class != SensorDeviceClass.BATTERY:
                    continue
                if entry.entity_id.startswith("binary_sensor."):
                    flags.append(
                        {
                            "entity_id": entry.entity_id,
                            "device": device_name,
                            "low": state.state == STATE_ON,
                        }
                    )
                    continue
                try:
                    level = float(state.state)
                except ValueError:
                    continue
                percentages.append(
                    {
                        "entity_id": entry.entity_id,
                        "device": device_name,
                        "level": level,
                    }
                )
        return percentages, flags

    @property
    def native_value(self) -> float | None:
        """Lowest reported percentage, or ``None`` if none is available."""
        percentages, _ = self._collect()
        if not percentages:
            return None
        return min(item["level"] for item in percentages)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Every battery found, plus a warning flag for the frontend."""
        percentages, flags = self._collect()
        lowest = min((item["level"] for item in percentages), default=None)
        return {
            "luna_batteries": percentages,
            "luna_battery_flags": flags,
            "luna_warn_threshold": BATTERY_WARN_THRESHOLD,
            "luna_battery_warning": bool(
                (lowest is not None and lowest < BATTERY_WARN_THRESHOLD)
                or any(item["low"] for item in flags)
            ),
        }


class LunaNightAvgTemp(LunaZoneEntity, RestoreSensor):
    """Mean measured temperature across the night window.

    Accumulates while inside the window and resets when a new night
    begins, so it is a measurement to tune the AC logic against rather
    than another target to set.
    """

    _attr_translation_key = "night_avg_temp"
    _attr_icon = "mdi:thermometer-lines"
    _attr_device_class = SensorDeviceClass.TEMPERATURE
    _attr_native_unit_of_measurement = UnitOfTemperature.CELSIUS
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_suggested_display_precision = 1

    def __init__(self, engine: LunaEngine, zone: ZoneConfig) -> None:
        """Set up the sensor."""
        super().__init__(engine, zone, "night_avg_temp")
        self._sum = 0.0
        self._count = 0
        self._was_night = False
        self._value: float | None = None

    async def async_added_to_hass(self) -> None:
        """Restore the last known average."""
        await super().async_added_to_hass()
        if (last := await self.async_get_last_sensor_data()) is not None:
            try:
                self._value = (
                    float(last.native_value) if last.native_value is not None else None
                )
            except (TypeError, ValueError):
                self._value = None

    def _in_night_window(self, now: dt.datetime) -> bool:
        start = _parse_time(self.store.global_setting(GLOBAL_NIGHT_START))
        end = _parse_time(self.store.global_setting(GLOBAL_NIGHT_END))
        if start is None or end is None:
            return False
        current = now.time()
        if start <= end:
            return start <= current < end
        # Window crosses midnight.
        return current >= start or current < end

    @property
    def native_value(self) -> float | None:
        """Running mean for the current night, or the last completed one."""
        now = dt_util.now()
        is_night = self._in_night_window(now)

        if is_night and not self._was_night:
            self._sum = 0.0
            self._count = 0

        if is_night:
            measured = self.engine.measured_temperature(self.zone)
            if measured is not None:
                self._sum += measured
                self._count += 1
            if self._count:
                self._value = round(self._sum / self._count, 2)

        self._was_night = is_night
        return self._value

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Whether the night window is currently open."""
        return {
            "luna_night_window_open": self._was_night,
            "luna_samples": self._count,
        }


def _parse_time(raw: Any) -> dt.time | None:
    try:
        parts = [int(part) for part in str(raw).split(":")]
    except ValueError:
        return None
    while len(parts) < 3:
        parts.append(0)
    try:
        return dt.time(parts[0], parts[1], parts[2])
    except ValueError:
        return None
