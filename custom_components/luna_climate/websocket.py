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
from homeassistant.helpers.dispatcher import async_dispatcher_connect

from .const import (
    DOMAIN,
    GLOBAL_AWAY_TEMP,
    MAX_BLOCK_TEMP,
    MAX_TEMP,
    MIN_BLOCK_TEMP,
    SET_BOOST_OFFSET,
    SET_HYSTERESIS,
    SET_MIN_CYCLE,
    SIGNAL_OPEN_UI,
    VALUE_MAX,
    VALUE_OFF,
)
from .engine import LunaEngine
from .schedule import DAY_TYPES, ScheduleError

WS_ZONES = f"{DOMAIN}/zones"
WS_GET_SCHEDULE = f"{DOMAIN}/schedule/get"
WS_SET_SCHEDULE = f"{DOMAIN}/schedule/set"
WS_SUBSCRIBE_UI = f"{DOMAIN}/subscribe_ui"


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
        "source": resolved.source,
        "value": resolved.value,
        "target": resolved.target,
        "current_temperature": engine.measured_temperature(zone),
        "current_humidity": engine.measured_humidity(zone),
        "heating": engine.zone_is_heating(zone),
        "away": resolved.source == "away",
        "boost_ends_at": boost_until.isoformat() if boost_until else None,
        "schedules": engine.get_schedules(zone_id),
        "batteries": engine.battery_status(zone_id),
        "battery_low": engine.battery_low(zone_id),
        "settings": {
            key: engine.store.setting(zone_id, key)
            for key in (
                SET_HYSTERESIS,
                SET_MIN_CYCLE,
                SET_BOOST_OFFSET,
            )
        },
        "devices": {
            "thermostats": zone.thermostats,
            "temp_sensors": zone.temp_sensors,
            "linked_devices": zone.linked_devices,
            "away_enabled": zone.away_enabled,
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
    websocket_api.async_register_command(hass, _ws_subscribe_ui)


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

    glob: dict[str, Any] = {}
    for engine in _engines(hass):
        glob = {
            "away_temp": engine.store.global_setting(GLOBAL_AWAY_TEMP),
            "day_types": engine.day_types(),
            "workday_entity": engine.workday_entity,
            "workday_offset": engine.workday_offset,
        }
        break

    presence: dict[str, Any] = {"entities": [], "everyone_away": False}
    for engine in _engines(hass):
        presence = {
            "entities": list(engine.presence_entities),
            "everyone_away": engine.everyone_away,
        }
        break

    connection.send_result(
        msg["id"],
        {
            "zones": zones,
            "presence": presence,
            "precomfort_active": precomfort,
            "global": glob,
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
    """Return one zone's two day schedules and the surrounding day types."""
    engine = _find_zone(hass, msg["zone_id"])
    if engine is None:
        connection.send_error(msg["id"], "not_found", "Unknown zone")
        return
    connection.send_result(msg["id"], _schedule_result(engine, msg["zone_id"]))


def _schedule_result(engine: LunaEngine, zone_id: str) -> dict[str, Any]:
    return {"schedules": engine.get_schedules(zone_id), "day_types": engine.day_types()}


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_SET_SCHEDULE,
        vol.Required("zone_id"): str,
        vol.Required("schedules"): {vol.In(DAY_TYPES): list},
    }
)
@websocket_api.async_response
async def _ws_set_schedule(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Replace one or both of a zone's day schedules."""
    engine = _find_zone(hass, msg["zone_id"])
    if engine is None:
        connection.send_error(msg["id"], "not_found", "Unknown zone")
        return
    try:
        await engine.async_set_schedules(msg["zone_id"], msg["schedules"])
    except ScheduleError as err:
        connection.send_error(msg["id"], "invalid_schedule", str(err))
        return
    connection.send_result(msg["id"], _schedule_result(engine, msg["zone_id"]))


@websocket_api.websocket_command({vol.Required("type"): WS_SUBSCRIBE_UI})
@callback
def _ws_subscribe_ui(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Stream "open this zone's detail view" requests to the frontend.

    The card bundle subscribes on every page. A request carries the user
    who pressed the device-page button and only reaches that user's
    connections; presses without a user (an automation) go nowhere.
    """

    @callback
    def _forward(request: dict[str, Any]) -> None:
        user_id = request.get("user_id")
        if user_id is None or connection.user is None or connection.user.id != user_id:
            return
        connection.send_message(
            websocket_api.event_message(
                msg["id"],
                {"zone_id": request["zone_id"], "entity_id": request.get("entity_id")},
            )
        )

    connection.subscriptions[msg["id"]] = async_dispatcher_connect(
        hass, SIGNAL_OPEN_UI, _forward
    )
    connection.send_result(msg["id"])
