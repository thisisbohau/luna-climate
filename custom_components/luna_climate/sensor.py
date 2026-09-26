"""Sensors: each zone's scheduled value and boost expiry, and the global
day type (workday or free day) that decides which schedule runs."""

from __future__ import annotations

import datetime as dt
from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from .const import VALUE_MAX, VALUE_OFF
from .engine import LunaEngine, ZoneConfig
from .entity import LunaGlobalEntity, LunaZoneEntity
from .schedule import DAY_TYPES


async def async_setup_entry(
    hass: HomeAssistant,
    entry: Any,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the sensors."""
    engine: LunaEngine = entry.runtime_data.engine
    entities: list[SensorEntity] = [LunaDayType(engine)]
    for zone in engine.zones.values():
        entities.append(LunaScheduledTemp(engine, zone))
        entities.append(LunaBoostEndsAt(engine, zone))
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
        block = self.engine.active_block(self.zone.zone_id)
        if block is None:
            return None
        return block.value

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Block boundaries, so automations need not parse the schedule."""
        block = self.engine.active_block(self.zone.zone_id)
        if block is None:
            return {"luna_block_start": None, "luna_block_end": None}
        return {
            "luna_day_type": block.day_type,
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


class LunaDayType(LunaGlobalEntity, SensorEntity):
    """Whether today runs the workday or the free-day schedule."""

    _attr_translation_key = "day_type"
    _attr_icon = "mdi:calendar-week"
    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = list(DAY_TYPES)

    def __init__(self, engine: LunaEngine) -> None:
        """Set up the sensor."""
        super().__init__(engine, "day_type")

    @property
    def native_value(self) -> str:
        """Today's day type."""
        return self.engine.day_type(dt_util.now().date())

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Tomorrow's type, and where the answer came from."""
        types = self.engine.day_types()
        return {
            "luna_yesterday": types["yesterday"],
            "luna_tomorrow": types["tomorrow"],
            "luna_from_entity": types["from_entity"],
            "luna_workday_entity": self.engine.workday_entity,
            "luna_workday_offset": self.engine.workday_offset,
        }

