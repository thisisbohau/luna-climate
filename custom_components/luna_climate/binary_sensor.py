"""The household's home/away state, as Luna sees it."""

from __future__ import annotations

from typing import Any

from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .engine import LunaEngine
from .entity import LunaGlobalEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: Any,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the home/away sensor."""
    engine: LunaEngine = entry.runtime_data.engine
    async_add_entities([LunaHome(engine)])


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
