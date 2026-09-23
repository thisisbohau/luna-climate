"""The zone climate entity.

Every zone gets one, whatever it contains -- a radiator valve, a towel
warmer, or both. Setting a temperature here switches the zone to manual
mode, which is the behaviour people expect from a thermostat dial.
"""

from __future__ import annotations

from typing import Any

from homeassistant.components.climate import (
    ClimateEntity,
    ClimateEntityFeature,
    HVACAction,
    HVACMode,
)
from homeassistant.const import ATTR_TEMPERATURE, UnitOfTemperature
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import (
    VALUE_OFF,
    ZONE_MAX_TEMP,
    ZONE_MIN_TEMP,
)
from .engine import (
    SOURCE_AWAY,
    SOURCE_BOOST,
    LunaEngine,
    ZoneConfig,
)
from .entity import LunaZoneEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: Any,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up one climate entity per zone."""
    engine: LunaEngine = entry.runtime_data.engine
    async_add_entities(
        LunaZoneClimate(engine, zone) for zone in engine.zones.values()
    )


class LunaZoneClimate(LunaZoneEntity, ClimateEntity):
    """A heating zone."""

    _attr_name = None
    _attr_temperature_unit = UnitOfTemperature.CELSIUS
    _attr_target_temperature_step = 0.5
    _attr_min_temp = ZONE_MIN_TEMP
    _attr_max_temp = ZONE_MAX_TEMP
    _attr_hvac_modes = [HVACMode.HEAT, HVACMode.OFF]
    _attr_supported_features = (
        ClimateEntityFeature.TARGET_TEMPERATURE
        | ClimateEntityFeature.TURN_ON
        | ClimateEntityFeature.TURN_OFF
    )

    def __init__(self, engine: LunaEngine, zone: ZoneConfig) -> None:
        """Set up the zone climate entity."""
        super().__init__(engine, zone, "climate")

    @property
    def current_temperature(self) -> float | None:
        """Measured temperature of the zone."""
        return self.engine.measured_temperature(self.zone)

    @property
    def current_humidity(self) -> float | None:
        """Measured humidity of the zone, when it has a source for one."""
        return self.engine.measured_humidity(self.zone)

    @property
    def target_temperature(self) -> float | None:
        """Resolved target, whatever is driving it right now."""
        return self.engine.resolve(self.zone).target

    @property
    def hvac_mode(self) -> HVACMode:
        """Whether the zone is meant to heat at all."""
        resolved = self.engine.resolve(self.zone)
        return HVACMode.OFF if resolved.is_off else HVACMode.HEAT

    @property
    def hvac_action(self) -> HVACAction:
        """Whether anything in the zone is actually heating."""
        if self.engine.resolve(self.zone).is_off:
            return HVACAction.OFF
        return (
            HVACAction.HEATING
            if self.engine.zone_is_heating(self.zone)
            else HVACAction.IDLE
        )

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Expose why the zone is doing what it is doing."""
        resolved = self.engine.resolve(self.zone)
        boost_until = self.engine.boost_ends_at(self.zone.zone_id)
        boost_started = self.engine.boost_started_at(self.zone.zone_id)
        attrs: dict[str, Any] = {
            "luna_zone_id": self.zone.zone_id,
            "luna_zone_name": self.zone.name,
            "luna_source": resolved.source,
            "luna_value": resolved.value,
            "luna_mode": self.zone_state["mode"],
            "luna_away": resolved.source == SOURCE_AWAY,
            "luna_boost_active": resolved.source == SOURCE_BOOST,
            "luna_boost_ends_at": boost_until.isoformat() if boost_until else None,
            "luna_boost_started_at": (
                boost_started.isoformat() if boost_started else None
            ),
            "luna_precomfort_active": self.engine.precomfort_active,
            "luna_thermostats": self.zone.thermostats,
            "luna_temp_sensors": self.zone.temp_sensors,
            "luna_linked_devices": self.zone.linked_devices,
        }
        if resolved.block is not None:
            attrs["luna_block_start"] = resolved.block.start.isoformat()
            attrs["luna_block_end"] = (
                resolved.block.end.isoformat() if resolved.block.end else None
            )
        return attrs

    async def async_set_temperature(self, **kwargs: Any) -> None:
        """Set a manual target, switching the zone out of auto.

        27 °C and above means max. Any running boost ends.
        """
        temperature = kwargs.get(ATTR_TEMPERATURE)
        if temperature is None:
            return
        await self.engine.async_set_manual(self.zone.zone_id, temperature)

    async def async_set_hvac_mode(self, hvac_mode: HVACMode) -> None:
        """Hold the zone off, or hand it back to its schedule."""
        if hvac_mode == HVACMode.OFF:
            await self.engine.async_set_manual(self.zone.zone_id, VALUE_OFF)
        else:
            # Turning a zone back on returns it to its schedule; that is
            # nearly always what is wanted, and manual mode stays available
            # through the mode select.
            await self.engine.async_resume_schedule(self.zone.zone_id)

    async def async_turn_on(self) -> None:
        """Return the zone to its schedule."""
        await self.async_set_hvac_mode(HVACMode.HEAT)

    async def async_turn_off(self) -> None:
        """Hold the zone off."""
        await self.async_set_hvac_mode(HVACMode.OFF)
