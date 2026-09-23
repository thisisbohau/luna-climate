"""Config and options flow for Luna Climate.

A single config entry acts as the hub. Zones and the household's presence
trackers live in ``entry.options`` and are managed through the options
flow: add, edit and remove zones, and pick who counts for home/away.

Only structural configuration lives here -- which entity plays which role.
Everything tunable (temperatures, hysteresis, the night window) is a
runtime entity so it can be changed without reconfiguring anything.
"""

from __future__ import annotations

import uuid
from typing import Any

import voluptuous as vol
from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.core import callback
from homeassistant.helpers import selector

from .const import (
    CONF_AWAY_ENABLED,
    CONF_HUMIDITY_SENSORS,
    CONF_LINKED_DEVICES,
    CONF_NAME,
    CONF_PRESENCE_ENTITIES,
    CONF_TEMP_SENSORS,
    CONF_THERMOSTATS,
    CONF_ZONE_ID,
    CONF_ZONES,
    DOMAIN,
)

ZONE_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_NAME): selector.TextSelector(),
        vol.Optional(CONF_THERMOSTATS, default=[]): selector.EntitySelector(
            selector.EntitySelectorConfig(domain="climate", multiple=True)
        ),
        vol.Optional(CONF_TEMP_SENSORS, default=[]): selector.EntitySelector(
            selector.EntitySelectorConfig(
                domain=["sensor", "climate"],
                device_class="temperature",
                multiple=True,
            )
        ),
        vol.Optional(CONF_LINKED_DEVICES, default=[]): selector.EntitySelector(
            selector.EntitySelectorConfig(
                domain=["switch", "input_boolean"], multiple=True
            )
        ),
        vol.Optional(CONF_HUMIDITY_SENSORS, default=[]): selector.EntitySelector(
            selector.EntitySelectorConfig(
                domain="sensor", device_class="humidity", multiple=True
            )
        ),
        vol.Optional(CONF_AWAY_ENABLED, default=True): selector.BooleanSelector(),
    }
)

PRESENCE_SELECTOR = selector.EntitySelector(
    selector.EntitySelectorConfig(
        domain=["input_boolean", "person", "device_tracker", "binary_sensor"],
        multiple=True,
    )
)


def _validate_zone(user_input: dict[str, Any]) -> dict[str, str]:
    """Return per-field errors for a zone definition."""
    errors: dict[str, str] = {}
    thermostats = user_input.get(CONF_THERMOSTATS) or []
    linked = user_input.get(CONF_LINKED_DEVICES) or []
    sensors = user_input.get(CONF_TEMP_SENSORS) or []

    if not thermostats and not linked:
        errors["base"] = "no_devices"
    elif linked and not sensors and not thermostats:
        # A linked device has no loop of its own, so without a reading
        # there is nothing to regulate against.
        errors[CONF_TEMP_SENSORS] = "sensor_required"
    return errors


class LunaConfigFlow(ConfigFlow, domain=DOMAIN):
    """Create the single Luna Climate hub entry."""

    VERSION = 1
    MINOR_VERSION = 2

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle the initial step."""
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()
        if user_input is None:
            return self.async_show_form(step_id="user", data_schema=vol.Schema({}))
        return self.async_create_entry(
            title="Luna Climate",
            data={},
            options={CONF_ZONES: [], CONF_PRESENCE_ENTITIES: []},
        )

    @staticmethod
    @callback
    def async_get_options_flow(entry: ConfigEntry) -> LunaOptionsFlow:
        """Return the options flow."""
        return LunaOptionsFlow()


class LunaOptionsFlow(OptionsFlow):
    """Add, edit and remove zones."""

    def __init__(self) -> None:
        """Set up the flow."""
        self._editing: str | None = None

    @property
    def _zones(self) -> list[dict[str, Any]]:
        return list(self.config_entry.options.get(CONF_ZONES, []))

    @property
    def _presence(self) -> list[str]:
        return list(self.config_entry.options.get(CONF_PRESENCE_ENTITIES, []))

    async def _async_save(
        self,
        zones: list[dict[str, Any]] | None = None,
        presence: list[str] | None = None,
    ) -> ConfigFlowResult:
        return self.async_create_entry(
            data={
                CONF_ZONES: self._zones if zones is None else zones,
                CONF_PRESENCE_ENTITIES: self._presence if presence is None else presence,
            }
        )

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Show the top-level menu."""
        menu = ["add_zone"]
        if self._zones:
            menu += ["edit_zone", "remove_zone"]
        menu.append("presence")
        return self.async_show_menu(step_id="init", menu_options=menu)

    # -- presence ---------------------------------------------------------

    async def async_step_presence(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Pick the trackers that decide whether anyone is home.

        One list for the whole house: when every one of them is off, all
        zones that follow away drop to their away temperature.
        """
        if user_input is not None:
            return await self._async_save(
                presence=list(user_input.get(CONF_PRESENCE_ENTITIES) or [])
            )
        schema = vol.Schema(
            {vol.Optional(CONF_PRESENCE_ENTITIES, default=[]): PRESENCE_SELECTOR}
        )
        return self.async_show_form(
            step_id="presence",
            data_schema=self.add_suggested_values_to_schema(
                schema, {CONF_PRESENCE_ENTITIES: self._presence}
            ),
        )

    # -- add --------------------------------------------------------------

    async def async_step_add_zone(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Define a new zone."""
        errors: dict[str, str] = {}
        if user_input is not None:
            errors = _validate_zone(user_input)
            if not errors:
                zones = self._zones
                zones.append({CONF_ZONE_ID: uuid.uuid4().hex, **user_input})
                return await self._async_save(zones)
        return self.async_show_form(
            step_id="add_zone", data_schema=ZONE_SCHEMA, errors=errors
        )

    # -- edit -------------------------------------------------------------

    async def async_step_edit_zone(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Pick a zone to edit."""
        if user_input is not None:
            self._editing = user_input[CONF_ZONE_ID]
            return await self.async_step_edit_zone_details()
        return self.async_show_form(
            step_id="edit_zone", data_schema=self._zone_picker()
        )

    async def async_step_edit_zone_details(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit the selected zone."""
        zones = self._zones
        current = next(
            (zone for zone in zones if zone[CONF_ZONE_ID] == self._editing), None
        )
        if current is None:
            return self.async_abort(reason="unknown_zone")

        errors: dict[str, str] = {}
        if user_input is not None:
            errors = _validate_zone(user_input)
            if not errors:
                current.update(user_input)
                return await self._async_save(zones)

        return self.async_show_form(
            step_id="edit_zone_details",
            data_schema=self.add_suggested_values_to_schema(ZONE_SCHEMA, current),
            errors=errors,
            description_placeholders={"zone": current[CONF_NAME]},
        )

    # -- remove -----------------------------------------------------------

    async def async_step_remove_zone(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Remove a zone."""
        if user_input is not None:
            zones = [
                zone
                for zone in self._zones
                if zone[CONF_ZONE_ID] != user_input[CONF_ZONE_ID]
            ]
            return await self._async_save(zones)
        return self.async_show_form(
            step_id="remove_zone", data_schema=self._zone_picker()
        )

    def _zone_picker(self) -> vol.Schema:
        options = [
            selector.SelectOptionDict(
                value=zone[CONF_ZONE_ID], label=zone[CONF_NAME]
            )
            for zone in self._zones
        ]
        return vol.Schema(
            {
                vol.Required(CONF_ZONE_ID): selector.SelectSelector(
                    selector.SelectSelectorConfig(
                        options=options, mode=selector.SelectSelectorMode.DROPDOWN
                    )
                )
            }
        )
