"""Global night window.

Stored and exposed only. Like the night mode switch and night temperature,
this is here for the AC automations to read; the engine does not act on it.
"""

from __future__ import annotations

import datetime as dt
from typing import Any

from homeassistant.components.time import TimeEntity
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import GLOBAL_NIGHT_END, GLOBAL_NIGHT_START
from .engine import LunaEngine
from .entity import LunaGlobalEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: Any,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the night window times."""
    engine: LunaEngine = entry.runtime_data.engine
    async_add_entities(
        [
            LunaNightTime(engine, GLOBAL_NIGHT_START, "night_start", "mdi:weather-night"),
            LunaNightTime(engine, GLOBAL_NIGHT_END, "night_end", "mdi:weather-sunset-up"),
        ]
    )


class LunaNightTime(LunaGlobalEntity, TimeEntity):
    """One edge of the global night window."""

    _attr_entity_category = EntityCategory.CONFIG

    def __init__(
        self, engine: LunaEngine, setting_key: str, translation_key: str, icon: str
    ) -> None:
        """Set up the time entity."""
        super().__init__(engine, setting_key)
        self._setting_key = setting_key
        self._attr_translation_key = translation_key
        self._attr_icon = icon

    @property
    def native_value(self) -> dt.time | None:
        """Stored time of day."""
        raw = self.store.global_setting(self._setting_key)
        try:
            parts = [int(part) for part in str(raw).split(":")]
        except ValueError:
            return None
        while len(parts) < 3:
            parts.append(0)
        return dt.time(parts[0], parts[1], parts[2])

    async def async_set_value(self, value: dt.time) -> None:
        """Store a new time of day."""
        self.store.set_global_setting(self._setting_key, value.strftime("%H:%M:%S"))
        await self.store.async_save()
        self.async_write_ha_state()
