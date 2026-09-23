"""Websocket API for the Luna Climate panel and card.

Kept separate from the services so the frontend can read and write
schedules without round-tripping through the service registry, and so the
card has one call that returns everything it needs to render a zone.
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import (
    DOMAIN,
    GLOBAL_NIGHT_END,
    GLOBAL_NIGHT_START,
    MAX_BLOCK_TEMP,
    MAX_TEMP,
    MIN_BLOCK_TEMP,
    SET_AWAY_TEMP,
    SET_BOOST_OFFSET,
    SET_HYSTERESIS,
    SET_MIN_CYCLE,
    SET_NIGHT_TEMP,
    VALUE_MAX,
    VALUE_OFF,
)
from .engine import LunaEngine
from .schedule import ScheduleError

WS_ZONES = f"{DOMAIN}/zones"
WS_GET_SCHEDULE = f"{DOMAIN}/schedule/get"
WS_SET_SCHEDULE = f"{DOMAIN}/schedule/set"


def _engines(hass: HomeAssistant) -> list[LunaEngine]:
    return [
        entry.runtime_data.engine
        for entry in hass.config_entries.async_loaded_entries(DOMAIN)
        if getattr(entry, "runtime_data", None) is not None
    ]


def _find_zone(hass: HomeAssistant, zone_id: str) -> LunaEngine | None:
    for engine in _engines(hass):
        if zone_id in engine.zones:
            return engine
    return None


def _zone_payload(engine: LunaEngine, zone_id: str) -> dict[str, Any]:
    zone = engine.zones[zone_id]
    resolved = engine.resolve(zone)
    state = engine.store.zone(zone_id)
    boost_until = engine.boost_ends_at(zone_id)
    return {
        "zone_id": zone_id,
        "name": zone.name,
        "mode": state["mode"],
        "manual_temp": state["manual_temp"],
        "night_mode": state["night_mode"],
        "source": resolved.source,
        "value": resolved.value,
        "target": resolved.target,
        "current_temperature": engine.measured_temperature(zone),
        "current_humidity": engine.measured_humidity(zone),
        "heating": engine.zone_is_heating(zone),
        "away": resolved.source == "away",
        "boost_ends_at": boost_until.isoformat() if boost_until else None,
        "schedule": engine.get_schedule(zone_id),
        "settings": {
            key: engine.store.setting(zone_id, key)
            for key in (
                SET_AWAY_TEMP,
                SET_NIGHT_TEMP,
                SET_HYSTERESIS,
                SET_MIN_CYCLE,
                SET_BOOST_OFFSET,
            )
        },
        "devices": {
            "thermostats": zone.thermostats,
            "temp_sensors": zone.temp_sensors,
            "linked_devices": zone.linked_devices,
            "presence_entities": zone.presence_entities,
            "humidity_sensors": engine.humidity_sources(zone_id),
        },
    }


@callback
def async_register_websocket_api(hass: HomeAssistant) -> None:
    """Register the websocket commands, once."""
    if hass.data.get(f"{DOMAIN}_ws_registered"):
        return
    hass.data[f"{DOMAIN}_ws_registered"] = True

    websocket_api.async_register_command(hass, _ws_zones)
    websocket_api.async_register_command(hass, _ws_get_schedule)
    websocket_api.async_register_command(hass, _ws_set_schedule)


@websocket_api.websocket_command({vol.Required("type"): WS_ZONES})
@callback
def _ws_zones(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return every zone with everything the card needs to render it."""
    zones: list[dict[str, Any]] = []
    precomfort = False
    for engine in _engines(hass):
        precomfort = precomfort or engine.precomfort_active
        zones.extend(_zone_payload(engine, zone_id) for zone_id in engine.zones)

    night = {}
    for engine in _engines(hass):
        night = {
            "night_start": engine.store.global_setting(GLOBAL_NIGHT_START),
            "night_end": engine.store.global_setting(GLOBAL_NIGHT_END),
        }
        break

    connection.send_result(
        msg["id"],
        {
            "zones": zones,
            "precomfort_active": precomfort,
            "global": night,
            "limits": {
                "min_block_temp": MIN_BLOCK_TEMP,
                "max_block_temp": MAX_BLOCK_TEMP,
                "max_temp": MAX_TEMP,
                "special_values": [VALUE_OFF, VALUE_MAX],
            },
        },
    )


@websocket_api.websocket_command(
    {vol.Required("type"): WS_GET_SCHEDULE, vol.Required("zone_id"): str}
)
@callback
def _ws_get_schedule(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return one zone's schedule."""
    engine = _find_zone(hass, msg["zone_id"])
    if engine is None:
        connection.send_error(msg["id"], "not_found", "Unknown zone")
        return
    connection.send_result(
        msg["id"], {"schedule": engine.get_schedule(msg["zone_id"])}
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_SET_SCHEDULE,
        vol.Required("zone_id"): str,
        vol.Required("schedule"): list,
    }
)
@websocket_api.async_response
async def _ws_set_schedule(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Replace one zone's schedule."""
    engine = _find_zone(hass, msg["zone_id"])
    if engine is None:
        connection.send_error(msg["id"], "not_found", "Unknown zone")
        return
    try:
        await engine.async_set_schedule(msg["zone_id"], msg["schedule"])
    except ScheduleError as err:
        connection.send_error(msg["id"], "invalid_schedule", str(err))
        return
    connection.send_result(
        msg["id"], {"schedule": engine.get_schedule(msg["zone_id"])}
    )
