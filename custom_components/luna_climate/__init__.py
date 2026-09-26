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
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.typing import ConfigType

from .const import (
    CONF_AWAY_ENABLED,
    CONF_PRESENCE_ENTITIES,
    CONF_WORKDAY_ENTITY,
    CONF_WORKDAY_OFFSET,
    CONF_ZONES,
    DOMAIN,
    WORKDAY_TOMORROW,
)
from .engine import LunaEngine
from .frontend_assets import async_register_frontend
from .services import async_register_services
from .store import LunaStore
from .websocket import async_register_websocket_api

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

PLATFORMS: list[Platform] = [
    Platform.BINARY_SENSOR,
    Platform.BUTTON,
    Platform.CLIMATE,
    Platform.NUMBER,
    Platform.SELECT,
    Platform.SENSOR,
]

#: Unique-id suffixes of entities earlier versions created and this one no
#: longer does: night mode (switch, temperature, average, window), the
#: per-zone away temperature (now global) and the lowest-battery sensor
#: (now a zone battery status).
REMOVED_ENTITY_SUFFIXES = (
    "_night_mode",
    "_night_temp",
    "_night_avg_temp",
    "_away_temp",
    "_battery_min",
)
REMOVED_GLOBAL_UNIQUE_IDS = ("luna_global_night_start", "luna_global_night_end")


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
    await engine.async_start(
        zones,
        list(entry.options.get(CONF_PRESENCE_ENTITIES, [])),
        entry.options.get(CONF_WORKDAY_ENTITY),
        entry.options.get(CONF_WORKDAY_OFFSET, WORKDAY_TOMORROW),
    )

    # Forget runtime state for zones the user has deleted.
    configured = {zone["zone_id"] for zone in zones}
    for zone_id in store.known_zone_ids():
        if zone_id not in configured:
            store.drop_zone(zone_id)
    await store.async_save()

    _remove_stale_devices(hass, entry, configured)
    _remove_retired_entities(hass, entry)

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    entry.async_on_unload(entry.add_update_listener(_async_options_updated))
    return True


async def async_migrate_entry(hass: HomeAssistant, entry: LunaConfigEntry) -> bool:
    """Upgrade the config entry options.

    1.1 -> 1.2: per-zone presence trackers move to one household list with
    a per-zone "follows away" switch. A zone that had trackers keeps
    following away; a zone that had none keeps ignoring it, so behaviour
    does not change underneath anyone.

    1.2 -> 1.3: the workday source is added, unset.
    """
    if entry.version > 1:
        return False
    if entry.version == 1 and entry.minor_version < 2:
        options = dict(entry.options)
        presence: list[str] = list(options.get(CONF_PRESENCE_ENTITIES, []))
        zones = []
        for raw in options.get(CONF_ZONES, []):
            zone = dict(raw)
            own = list(zone.pop(CONF_PRESENCE_ENTITIES, None) or [])
            for entity_id in own:
                if entity_id not in presence:
                    presence.append(entity_id)
            zone.setdefault(CONF_AWAY_ENABLED, bool(own))
            zones.append(zone)
        options[CONF_ZONES] = zones
        options[CONF_PRESENCE_ENTITIES] = presence
        hass.config_entries.async_update_entry(entry, options=options, minor_version=2)
        _LOGGER.info("Migrated Luna Climate presence to a single household list")
    if entry.version == 1 and entry.minor_version < 3:
        # 1.3 adds the workday source. No entity yet means Monday to Friday
        # count as workdays until one is picked.
        options = dict(entry.options)
        options.setdefault(CONF_WORKDAY_ENTITY, None)
        options.setdefault(CONF_WORKDAY_OFFSET, WORKDAY_TOMORROW)
        hass.config_entries.async_update_entry(entry, options=options, minor_version=3)
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


def _remove_retired_entities(hass: HomeAssistant, entry: LunaConfigEntry) -> None:
    """Remove registry entries of entities this version no longer provides.

    Otherwise they would linger as "no longer provided" in the UI.
    """
    registry = er.async_get(hass)
    for item in er.async_entries_for_config_entry(registry, entry.entry_id):
        unique_id = item.unique_id or ""
        if unique_id in REMOVED_GLOBAL_UNIQUE_IDS or (
            unique_id.startswith("luna_")
            and not unique_id.startswith("luna_global_")
            and unique_id.endswith(REMOVED_ENTITY_SUFFIXES)
        ):
            registry.async_remove(item.entity_id)


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
