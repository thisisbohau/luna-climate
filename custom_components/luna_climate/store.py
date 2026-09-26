"""Persistent state for Luna Climate.

Schedules and the runtime tunables live here rather than in the config
entry options. Options hold structure -- which entity plays which role in
which zone -- and change rarely. Everything the user adjusts day to day
(schedules, target temperatures, hysteresis) is runtime state, exposed as
``number``/``select`` entities and persisted through this store.

Older layouts are upgraded in place on load (see ``_upgrade``), so nobody
loses a schedule when the format changes.
"""

from __future__ import annotations

import contextlib
import datetime as dt
import logging
from collections import Counter
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import (
    DEFAULT_AWAY_TEMP,
    DEFAULT_BOOST_OFFSET,
    DEFAULT_HYSTERESIS,
    DEFAULT_MIN_CYCLE,
    DEFAULT_PRECOMFORT_TIMEOUT,
    GLOBAL_AWAY_TEMP,
    GLOBAL_PRECOMFORT_TIMEOUT,
    MODE_AUTO,
    SET_BOOST_OFFSET,
    SET_HYSTERESIS,
    SET_MIN_CYCLE,
    STORAGE_KEY,
    STORAGE_VERSION,
)
from .schedule import DAY_FREE, DAY_WORKDAY, from_weekly

_LOGGER = logging.getLogger(__name__)

#: How many days of workday-sensor history to keep. Only yesterday is ever
#: needed; a few more cover a restart that spans a weekend.
WORKDAY_LOG_DAYS = 10


def default_zone_state() -> dict[str, Any]:
    """Runtime state for a freshly created zone."""
    return {
        "schedules": {DAY_WORKDAY: [], DAY_FREE: []},
        "mode": MODE_AUTO,
        "manual_temp": 21.0,
        "settings": {
            SET_HYSTERESIS: DEFAULT_HYSTERESIS,
            SET_MIN_CYCLE: DEFAULT_MIN_CYCLE,
            SET_BOOST_OFFSET: DEFAULT_BOOST_OFFSET,
        },
    }


def default_global_state() -> dict[str, Any]:
    """Runtime state shared by every zone."""
    return {
        GLOBAL_AWAY_TEMP: DEFAULT_AWAY_TEMP,
        GLOBAL_PRECOMFORT_TIMEOUT: DEFAULT_PRECOMFORT_TIMEOUT,
        # date (ISO) -> the workday entity's last reading on that date
        "workday_log": {},
    }


def _upgrade(data: dict[str, Any]) -> bool:
    """Bring an older store layout up to date. Returns True if changed.

    * weekday-based ``schedule`` lists become ``schedules`` with a workday
      and a free-day list
    * the per-zone away temperatures collapse into one global value, the
      most common one (the lowest on a tie, as the cheaper choice)
    * night mode, night temperature and the night window are dropped
    """
    changed = False
    zones: dict[str, Any] = data.setdefault("zones", {})
    glob: dict[str, Any] = data.setdefault("global", {})

    away_values: list[float] = []
    for state in zones.values():
        if "schedule" in state:
            state["schedules"] = from_weekly(state.pop("schedule"))
            changed = True
        if state.pop("night_mode", None) is not None:
            changed = True
        settings = state.get("settings") or {}
        if "away_temp" in settings:
            with contextlib.suppress(TypeError, ValueError):
                away_values.append(float(settings.pop("away_temp")))
            changed = True
        if settings.pop("night_temp", None) is not None:
            changed = True

    if away_values and GLOBAL_AWAY_TEMP not in glob:
        counts = Counter(away_values)
        best = max(counts.values())
        glob[GLOBAL_AWAY_TEMP] = min(v for v, n in counts.items() if n == best)
        changed = True

    for key in ("night_start", "night_end"):
        if glob.pop(key, None) is not None:
            changed = True

    if changed:
        _LOGGER.info(
            "Upgraded Luna Climate storage: workday/free-day schedules, "
            "global away temperature, night mode removed"
        )
    return changed


class LunaStore:
    """Thin wrapper around the HA Store with defaults applied on read."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, STORAGE_KEY
        )
        self._data: dict[str, Any] = {"zones": {}, "global": default_global_state()}
        self.upgraded = False

    async def async_load(self) -> None:
        """Load persisted state, upgrading and filling in missing defaults."""
        raw = await self._store.async_load()
        if raw:
            self._data = raw
        self.upgraded = _upgrade(self._data)
        merged_global = default_global_state()
        merged_global.update(self._data.get("global") or {})
        self._data["global"] = merged_global
        if self.upgraded:
            await self.async_save()

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
        for day_type in (DAY_WORKDAY, DAY_FREE):
            state["schedules"].setdefault(day_type, [])
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

    # -- workday history ---------------------------------------------------

    def workday_reading(self, day: dt.date) -> bool | None:
        """The workday entity's last reading on ``day``, if one was seen."""
        value = self._data["global"]["workday_log"].get(day.isoformat())
        return value if isinstance(value, bool) else None

    def record_workday(self, day: dt.date, value: bool) -> bool:
        """Remember today's reading. Returns True if anything changed."""
        log: dict[str, bool] = self._data["global"]["workday_log"]
        key = day.isoformat()
        if log.get(key) is value:
            return False
        log[key] = value
        for old in sorted(log)[:-WORKDAY_LOG_DAYS]:
            del log[old]
        return True
