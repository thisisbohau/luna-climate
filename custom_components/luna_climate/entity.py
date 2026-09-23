"""Shared entity plumbing for Luna Climate."""

from __future__ import annotations

from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity import Entity

from .const import BRAND, DOMAIN, MANUFACTURER, SIGNAL_UPDATE
from .engine import LunaEngine, ZoneConfig
from .store import LunaStore


class LunaZoneEntity(Entity):
    """Base for every entity belonging to a zone."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, engine: LunaEngine, zone: ZoneConfig, key: str) -> None:
        """Set up the entity."""
        self.engine = engine
        self.zone = zone
        self._attr_unique_id = f"luna_{zone.zone_id}_{key}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, zone.zone_id)},
            name=f"{BRAND} {zone.name}",
            manufacturer=MANUFACTURER,
            model="Climate Zone",
        )

    @property
    def store(self) -> LunaStore:
        """The shared runtime store."""
        return self.engine.store

    @property
    def zone_state(self) -> dict:
        """Runtime state for this entity's zone."""
        return self.store.zone(self.zone.zone_id)

    async def async_added_to_hass(self) -> None:
        """Subscribe to engine updates."""
        await super().async_added_to_hass()
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, SIGNAL_UPDATE, self.async_write_ha_state
            )
        )

    async def async_persist(self) -> None:
        """Save the store and re-apply control."""
        await self.store.async_save()
        await self.engine.async_apply_all()


class LunaGlobalEntity(Entity):
    """Base for entities that are not tied to a single zone."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, engine: LunaEngine, key: str) -> None:
        """Set up the entity."""
        self.engine = engine
        self._attr_unique_id = f"luna_global_{key}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, "global")},
            name=f"{BRAND} Climate",
            manufacturer=MANUFACTURER,
            model="Controller",
        )

    @property
    def store(self) -> LunaStore:
        """The shared runtime store."""
        return self.engine.store

    async def async_added_to_hass(self) -> None:
        """Subscribe to engine updates."""
        await super().async_added_to_hass()
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, SIGNAL_UPDATE, self.async_write_ha_state
            )
        )

    async def async_persist(self) -> None:
        """Save the store and re-apply control."""
        await self.store.async_save()
        await self.engine.async_apply_all()
