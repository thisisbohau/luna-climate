"""Persistent state for Luna Climate.

Schedules and the runtime tunables live here rather than in the config
entry options. Options hold structure -- which entity plays which role in
which zone -- and change rarely. Everything the user adjusts day to day
(target temperatures, hysteresis, night window) is runtime state, exposed
as ``number``/``time``/``select`` entities and persisted through this store.

The store is versioned from the start so the block format can be migrated
later without losing anyone's schedules.
"""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import (
    DEFAULT_AWAY_TEMP,
    DEFAULT_BOOST_OFFSET,
    DEFAULT_HYSTERESIS,
    DEFAULT_MIN_CYCLE,
    DEFAULT_NIGHT_END,
    DEFAULT_NIGHT_START,
    DEFAULT_NIGHT_TEMP,
    DEFAULT_PRECOMFORT_TIMEOUT,
    GLOBAL_NIGHT_END,
    GLOBAL_NIGHT_START,
    GLOBAL_PRECOMFORT_TIMEOUT,
    MODE_AUTO,
    SET_AWAY_TEMP,
    SET_BOOST_OFFSET,
    SET_HYSTERESIS,
    SET_MIN_CYCLE,
    SET_NIGHT_TEMP,
    STORAGE_KEY,
    STORAGE_VERSION,
)

_LOGGER = logging.getLogger(__name__)


def default_zone_state() -> dict[str, Any]:
    """Runtime state for a freshly created zone."""
    return {
        "schedule": [],
        "mode": MODE_AUTO,
        "manual_temp": 21.0,
        "night_mode": False,
        "settings": {
            SET_AWAY_TEMP: DEFAULT_AWAY_TEMP,
            SET_NIGHT_TEMP: DEFAULT_NIGHT_TEMP,
            SET_HYSTERESIS: DEFAULT_HYSTERESIS,
            SET_MIN_CYCLE: DEFAULT_MIN_CYCLE,
            SET_BOOST_OFFSET: DEFAULT_BOOST_OFFSET,
        },
    }


def default_global_state() -> dict[str, Any]:
    """Runtime state shared by every zone."""
    return {
        GLOBAL_NIGHT_START: DEFAULT_NIGHT_START,
        GLOBAL_NIGHT_END: DEFAULT_NIGHT_END,
        GLOBAL_PRECOMFORT_TIMEOUT: DEFAULT_PRECOMFORT_TIMEOUT,
    }


class LunaStore:
    """Thin wrapper around the HA Store with defaults applied on read."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, STORAGE_KEY
        )
        self._data: dict[str, Any] = {"zones": {}, "global": default_global_state()}

    async def async_load(self) -> None:
        """Load persisted state, filling in any missing defaults."""
        raw = await self._store.async_load()
        if raw:
            self._data = raw
        self._data.setdefault("zones", {})
        merged_global = default_global_state()
        merged_global.update(self._data.get("global") or {})
        self._data["global"] = merged_global

    async def async_save(self) -> None:
        """Persist current state."""
        await self._store.async_save(self._data)

    # -- zones ------------------------------------------------------------

    def zone(self, zone_id: str) -> dict[str, Any]:
        """Return runtime state for a zone, creating it on first access."""
        zones = self._data["zones"]
        if zone_id not in zones:
            zones[zone_id] = default_zone_state()
        state = zones[zone_id]
        # Fill in keys added by later versions of the integration.
        defaults = default_zone_state()
        for key, value in defaults.items():
            state.setdefault(key, value)
        settings = state["settings"]
        for key, value in defaults["settings"].items():
            settings.setdefault(key, value)
        return state

    def setting(self, zone_id: str, key: str) -> Any:
        """Return one runtime setting for a zone."""
        return self.zone(zone_id)["settings"][key]

    def set_setting(self, zone_id: str, key: str, value: Any) -> None:
        """Update one runtime setting for a zone."""
        self.zone(zone_id)["settings"][key] = value

    def drop_zone(self, zone_id: str) -> None:
        """Forget a zone that has been removed from the configuration."""
        self._data["zones"].pop(zone_id, None)

    def known_zone_ids(self) -> list[str]:
        """Zone ids currently held in the store."""
        return list(self._data["zones"])

    # -- global -----------------------------------------------------------

    def global_setting(self, key: str) -> Any:
        """Return one global runtime setting."""
        return self._data["global"][key]

    def set_global_setting(self, key: str, value: Any) -> None:
        """Update one global runtime setting."""
        self._data["global"][key] = value
