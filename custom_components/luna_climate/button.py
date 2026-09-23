"""The "Schedule & details" button on each zone's device page.

Pressing it opens the zone's detail view -- the same one the dashboard
cards open -- in the browser of the person who pressed it. The backend
cannot open a dialog itself, so the press is handed to the frontend
through a websocket subscription the card bundle holds on every page
(see ``websocket.py``), addressed to the pressing user.
"""

from __future__ import annotations

from typing import Any

from homeassistant.components.button import ButtonEntity
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import DOMAIN, SIGNAL_OPEN_UI
from .engine import LunaEngine, ZoneConfig
from .entity import LunaZoneEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: Any,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up one details button per zone."""
    engine: LunaEngine = entry.runtime_data.engine
    async_add_entities(LunaDetailsButton(engine, zone) for zone in engine.zones.values())


class LunaDetailsButton(LunaZoneEntity, ButtonEntity):
    """Opens the zone's detail view and schedule editor."""

    _attr_translation_key = "details"
    _attr_icon = "mdi:calendar-edit"
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, engine: LunaEngine, zone: ZoneConfig) -> None:
        """Set up the button."""
        super().__init__(engine, zone, "details")

    async def async_press(self) -> None:
        """Ask the presser's browser to open the detail view."""
        climate_id = er.async_get(self.hass).async_get_entity_id(
            "climate", DOMAIN, f"luna_{self.zone.zone_id}_climate"
        )
        async_dispatcher_send(
            self.hass,
            SIGNAL_OPEN_UI,
            {
                "zone_id": self.zone.zone_id,
                "entity_id": climate_id,
                "user_id": self._context.user_id if self._context else None,
            },
        )
