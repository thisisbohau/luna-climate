"""Night mode switch.

Purely a stored flag. The integration reads nothing back from it -- the
AC logic that consumes it lives in the user's own automations.
"""

from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .engine import LunaEngine, ZoneConfig
from .entity import LunaZoneEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: Any,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the night mode switches."""
    engine: LunaEngine = entry.runtime_data.engine
    async_add_entities(LunaNightMode(engine, zone) for zone in engine.zones.values())


class LunaNightMode(LunaZoneEntity, SwitchEntity):
    """Night mode flag for a zone."""

    _attr_translation_key = "night_mode"
    _attr_icon = "mdi:weather-night"

    def __init__(self, engine: LunaEngine, zone: ZoneConfig) -> None:
        """Set up the night mode switch."""
        super().__init__(engine, zone, "night_mode")

    @property
    def is_on(self) -> bool:
        """Whether night mode is enabled for this zone."""
        return bool(self.zone_state.get("night_mode", False))

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Enable night mode."""
        self.zone_state["night_mode"] = True
        await self.store.async_save()
        self.async_write_ha_state()

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Disable night mode."""
        self.zone_state["night_mode"] = False
        await self.store.async_save()
        self.async_write_ha_state()
