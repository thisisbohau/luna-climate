"""Zone mode select: auto (schedule) or manual."""

from __future__ import annotations

from typing import Any

from homeassistant.components.select import SelectEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import MODE_AUTO, ZONE_MODES
from .engine import LunaEngine, ZoneConfig
from .entity import LunaZoneEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: Any,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the zone mode selects."""
    engine: LunaEngine = entry.runtime_data.engine
    async_add_entities(LunaZoneMode(engine, zone) for zone in engine.zones.values())


class LunaZoneMode(LunaZoneEntity, SelectEntity):
    """Whether a zone follows its schedule or a fixed manual setpoint."""

    _attr_translation_key = "zone_mode"
    _attr_icon = "mdi:calendar-clock"
    _attr_options = ZONE_MODES

    def __init__(self, engine: LunaEngine, zone: ZoneConfig) -> None:
        """Set up the mode select."""
        super().__init__(engine, zone, "mode")

    @property
    def current_option(self) -> str:
        """The zone's current mode."""
        return self.zone_state.get("mode", MODE_AUTO)

    async def async_select_option(self, option: str) -> None:
        """Switch the zone between schedule and manual control."""
        self.zone_state["mode"] = option
        await self.async_persist()
