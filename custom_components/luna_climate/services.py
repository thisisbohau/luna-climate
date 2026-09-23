"""Services exposed by Luna Climate.

Zones are addressed by their climate entity, so automations and scripts can
use the normal entity picker rather than juggling internal zone ids.
"""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.const import ATTR_ENTITY_ID
from homeassistant.core import (
    HomeAssistant,
    ServiceCall,
    ServiceResponse,
    SupportsResponse,
    callback,
)
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import entity_registry as er

from .const import (
    ATTR_DURATION,
    ATTR_SCHEDULE,
    ATTR_TEMPERATURE,
    ATTR_VALUE,
    DOMAIN,
    SERVICE_BOOST,
    SERVICE_CANCEL_BOOST,
    SERVICE_CLEAR_PRECOMFORT,
    SERVICE_COOL_FOR,
    SERVICE_GET_SCHEDULE,
    SERVICE_RESUME_SCHEDULE,
    SERVICE_SET_SCHEDULE,
    SERVICE_SET_TARGET,
    SERVICE_START_PRECOMFORT,
    ZONE_MAX_TEMP,
    ZONE_MIN_TEMP,
)
from .engine import LunaEngine

_LOGGER = logging.getLogger(__name__)

TARGET_SCHEMA = {vol.Required(ATTR_ENTITY_ID): cv.entity_ids}

BOOST_SCHEMA = vol.Schema(
    {
        **TARGET_SCHEMA,
        vol.Optional(ATTR_DURATION, default=30): vol.All(
            vol.Coerce(float), vol.Range(min=1, max=480)
        ),
        vol.Optional(ATTR_TEMPERATURE): vol.All(
            vol.Coerce(float), vol.Range(min=ZONE_MIN_TEMP, max=ZONE_MAX_TEMP)
        ),
    }
)

COOL_FOR_SCHEMA = vol.Schema(
    {
        **TARGET_SCHEMA,
        vol.Optional(ATTR_DURATION, default=30): vol.All(
            vol.Coerce(float), vol.Range(min=1, max=480)
        ),
    }
)

SET_SCHEDULE_SCHEMA = vol.Schema(
    {**TARGET_SCHEMA, vol.Required(ATTR_SCHEDULE): list}
)

GET_SCHEDULE_SCHEMA = vol.Schema(TARGET_SCHEMA)
SET_TARGET_SCHEMA = vol.Schema(
    {**TARGET_SCHEMA, vol.Required(ATTR_VALUE): vol.Any(vol.Coerce(float), cv.string)}
)
TARGET_ONLY_SCHEMA = vol.Schema(TARGET_SCHEMA)


def _engines(hass: HomeAssistant) -> list[LunaEngine]:
    return [
        entry.runtime_data.engine
        for entry in hass.config_entries.async_loaded_entries(DOMAIN)
        if getattr(entry, "runtime_data", None) is not None
    ]


def _resolve_zones(
    hass: HomeAssistant, entity_ids: list[str]
) -> list[tuple[LunaEngine, str]]:
    """Map climate entity ids back to (engine, zone_id) pairs."""
    registry = er.async_get(hass)
    resolved: list[tuple[LunaEngine, str]] = []

    for entity_id in entity_ids:
        entry = registry.async_get(entity_id)
        if entry is None or entry.platform != DOMAIN:
            raise ServiceValidationError(
                f"{entity_id} is not a Luna Climate zone"
            )
        # Unique ids are "luna_<zone_id>_<key>".
        parts = entry.unique_id.split("_")
        if len(parts) < 3:
            raise ServiceValidationError(f"Cannot resolve a zone from {entity_id}")
        zone_id = parts[1]
        for engine in _engines(hass):
            if zone_id in engine.zones:
                resolved.append((engine, zone_id))
                break
        else:
            raise ServiceValidationError(f"Zone for {entity_id} is not loaded")
    return resolved


@callback
def async_register_services(hass: HomeAssistant) -> None:
    """Register every Luna Climate service, once."""
    if hass.services.has_service(DOMAIN, SERVICE_BOOST):
        return

    async def _boost(call: ServiceCall) -> None:
        for engine, zone_id in _resolve_zones(hass, call.data[ATTR_ENTITY_ID]):
            await engine.async_boost(
                zone_id,
                minutes=call.data[ATTR_DURATION],
                temperature=call.data.get(ATTR_TEMPERATURE),
            )

    async def _cancel_boost(call: ServiceCall) -> None:
        for engine, zone_id in _resolve_zones(hass, call.data[ATTR_ENTITY_ID]):
            await engine.async_cancel_boost(zone_id)

    async def _cool_for(call: ServiceCall) -> None:
        # Placeholder for the AC half: the timer and the zone plumbing are
        # here, the compressor logic is deliberately left to automations.
        _LOGGER.warning(
            "luna_climate.cool_for is not implemented yet; "
            "drive the AC from an automation on the night mode entities"
        )
        raise ServiceValidationError(
            "cool_for is not implemented yet in this version"
        )

    async def _start_precomfort(_call: ServiceCall) -> None:
        for engine in _engines(hass):
            await engine.async_start_precomfort()

    async def _clear_precomfort(_call: ServiceCall) -> None:
        for engine in _engines(hass):
            engine.clear_precomfort()
            await engine.async_apply_all()

    async def _set_target(call: ServiceCall) -> None:
        for engine, zone_id in _resolve_zones(hass, call.data[ATTR_ENTITY_ID]):
            try:
                await engine.async_set_manual(zone_id, call.data[ATTR_VALUE])
            except ValueError as err:
                raise ServiceValidationError(str(err)) from err

    async def _resume_schedule(call: ServiceCall) -> None:
        for engine, zone_id in _resolve_zones(hass, call.data[ATTR_ENTITY_ID]):
            await engine.async_resume_schedule(zone_id)

    async def _set_schedule(call: ServiceCall) -> None:
        for engine, zone_id in _resolve_zones(hass, call.data[ATTR_ENTITY_ID]):
            await engine.async_set_schedule(zone_id, call.data[ATTR_SCHEDULE])

    async def _get_schedule(call: ServiceCall) -> ServiceResponse:
        result: dict[str, Any] = {}
        for entity_id, (engine, zone_id) in zip(
            call.data[ATTR_ENTITY_ID],
            _resolve_zones(hass, call.data[ATTR_ENTITY_ID]),
            strict=True,
        ):
            result[entity_id] = engine.get_schedule(zone_id)
        return {"schedules": result}

    hass.services.async_register(DOMAIN, SERVICE_BOOST, _boost, BOOST_SCHEMA)
    hass.services.async_register(
        DOMAIN, SERVICE_CANCEL_BOOST, _cancel_boost, TARGET_ONLY_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_COOL_FOR, _cool_for, COOL_FOR_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_START_PRECOMFORT, _start_precomfort, vol.Schema({})
    )
    hass.services.async_register(
        DOMAIN, SERVICE_CLEAR_PRECOMFORT, _clear_precomfort, vol.Schema({})
    )
    hass.services.async_register(
        DOMAIN, SERVICE_SET_TARGET, _set_target, SET_TARGET_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_RESUME_SCHEDULE, _resume_schedule, TARGET_ONLY_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_SET_SCHEDULE, _set_schedule, SET_SCHEDULE_SCHEMA
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_GET_SCHEDULE,
        _get_schedule,
        GET_SCHEDULE_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )

