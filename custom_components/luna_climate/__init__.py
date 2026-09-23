"""The Luna Climate integration.

Zone-based heating control that owns its own weekly schedule, so it does
not depend on any scheduling left behind on the devices themselves.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.typing import ConfigType

from .const import CONF_ZONES, DOMAIN
from .engine import LunaEngine
from .frontend_assets import async_register_frontend
from .services import async_register_services
from .store import LunaStore
from .websocket import async_register_websocket_api

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

PLATFORMS: list[Platform] = [
    Platform.CLIMATE,
    Platform.NUMBER,
    Platform.SELECT,
    Platform.SENSOR,
    Platform.SWITCH,
    Platform.TIME,
]


@dataclass
class LunaRuntime:
    """Everything one config entry keeps alive."""

    store: LunaStore
    engine: LunaEngine


type LunaConfigEntry = ConfigEntry[LunaRuntime]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register what must exist independently of the config entry.

    Services and the websocket API are registered here rather than per
    entry, so an automation that calls a Luna service during startup gets
    a clear "zone not loaded" error instead of "service not found", and
    the dashboard cards load whether or not a zone is configured yet.
    """
    async_register_services(hass)
    async_register_websocket_api(hass)
    await async_register_frontend(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: LunaConfigEntry) -> bool:
    """Set up Luna Climate from a config entry."""
    store = LunaStore(hass)
    await store.async_load()

    engine = LunaEngine(hass, store)
    entry.runtime_data = LunaRuntime(store=store, engine=engine)

    zones = list(entry.options.get(CONF_ZONES, []))
    await engine.async_start(zones)

    # Forget runtime state for zones the user has deleted.
    configured = {zone["zone_id"] for zone in zones}
    for zone_id in store.known_zone_ids():
        if zone_id not in configured:
            store.drop_zone(zone_id)
    await store.async_save()

    _remove_stale_devices(hass, entry, configured)

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    entry.async_on_unload(entry.add_update_listener(_async_options_updated))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: LunaConfigEntry) -> bool:
    """Unload a config entry."""
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        await entry.runtime_data.engine.async_stop()
    return unloaded


def _remove_stale_devices(
    hass: HomeAssistant, entry: LunaConfigEntry, configured: set[str]
) -> None:
    """Drop devices -- and with them their entities -- of deleted zones.

    Without this a removed zone would leave a device full of unavailable
    entities behind in the registry.
    """
    registry = dr.async_get(hass)
    for device in dr.async_entries_for_config_entry(registry, entry.entry_id):
        zone_ids = {ident[1] for ident in device.identifiers if ident[0] == DOMAIN}
        if not zone_ids or "global" in zone_ids:
            continue
        if zone_ids.isdisjoint(configured):
            registry.async_update_device(
                device.id, remove_config_entry_id=entry.entry_id
            )


async def async_remove_config_entry_device(
    hass: HomeAssistant, entry: LunaConfigEntry, device: dr.DeviceEntry
) -> bool:
    """Allow deleting a zone's device from the UI only once the zone is gone."""
    configured = {zone["zone_id"] for zone in entry.options.get(CONF_ZONES, [])}
    zone_ids = {ident[1] for ident in device.identifiers if ident[0] == DOMAIN}
    return "global" not in zone_ids and zone_ids.isdisjoint(configured)


async def _async_options_updated(
    hass: HomeAssistant, entry: LunaConfigEntry
) -> None:
    """Reload when the zone configuration changes."""
    await hass.config_entries.async_reload(entry.entry_id)
