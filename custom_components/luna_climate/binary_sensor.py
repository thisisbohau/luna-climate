"""Binary sensors: the household's home/away state, and each zone's
battery status."""

from __future__ import annotations

from typing import Any

from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
)
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import BATTERY_WARN_THRESHOLD
from .engine import LunaEngine, ZoneConfig
from .entity import LunaGlobalEntity, LunaZoneEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: Any,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the home/away sensor and the zone battery sensors."""
    engine: LunaEngine = entry.runtime_data.engine
    entities: list[BinarySensorEntity] = [LunaHome(engine)]
    entities.extend(LunaZoneBattery(engine, zone) for zone in engine.zones.values())
    async_add_entities(entities)


class LunaHome(LunaGlobalEntity, BinarySensorEntity):
    """On while anyone is home; off once every presence tracker says away.

    This is the single home/away signal every zone follows. Precomfort does
    not change it -- it only stops zones from acting on it -- so automations
    can still tell that nobody is actually in yet.
    """

    _attr_translation_key = "home"
    _attr_device_class = BinarySensorDeviceClass.PRESENCE

    def __init__(self, engine: LunaEngine) -> None:
        """Set up the sensor."""
        super().__init__(engine, "home")

    @property
    def is_on(self) -> bool:
        """True while anyone is home."""
        return not self.engine.everyone_away

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Which trackers decide, and whether precomfort is running."""
        until = self.engine.precomfort_until if self.engine.precomfort_active else None
        return {
            "luna_presence_entities": list(self.engine.presence_entities),
            "luna_precomfort_active": self.engine.precomfort_active,
            "luna_precomfort_until": until.isoformat() if until else None,
        }


class LunaZoneBattery(LunaZoneEntity, BinarySensorEntity):
    """On when any battery behind the zone is low.

    Covers every device the zone uses *and* every device connected via
    them -- with TadoLocal that is where the valves and wireless sensors
    live -- so the zone gives one answer for all its hardware.
    """

    _attr_translation_key = "zone_battery"
    _attr_device_class = BinarySensorDeviceClass.BATTERY
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, engine: LunaEngine, zone: ZoneConfig) -> None:
        """Set up the sensor."""
        super().__init__(engine, zone, "battery")

    @property
    def is_on(self) -> bool:
        """True when at least one battery is low."""
        return self.engine.battery_low(self.zone.zone_id)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Every battery found, with its reading and verdict."""
        batteries = self.engine.battery_status(self.zone.zone_id)
        return {
            "luna_batteries": batteries,
            "luna_battery_count": len(batteries),
            "luna_low_count": sum(1 for item in batteries if item["low"]),
            "luna_warn_threshold": BATTERY_WARN_THRESHOLD,
        }
