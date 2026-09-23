"""Config and options flow."""

from __future__ import annotations

from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType

from custom_components.luna_climate.const import DOMAIN


async def _create_entry(hass: HomeAssistant):
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    assert result["type"] is FlowResultType.FORM
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Luna Climate"
    assert result["options"] == {"zones": []}
    await hass.async_block_till_done()
    return hass.config_entries.async_entries(DOMAIN)[0]


async def test_user_flow_creates_single_entry(hass: HomeAssistant) -> None:
    """One entry acts as the hub; a second one is refused."""
    await _create_entry(hass)
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] in ("single_instance_allowed", "already_configured")


async def test_options_add_edit_remove_zone(hass: HomeAssistant) -> None:
    """Zones are managed through the options flow, with validation."""
    entry = await _create_entry(hass)

    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] is FlowResultType.MENU
    assert result["menu_options"] == ["add_zone"]

    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "add_zone"}
    )
    # Neither a thermostat nor a linked device.
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"name": "Empty"}
    )
    assert result["errors"] == {"base": "no_devices"}

    # A linked device with nothing to measure against.
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"name": "Bad", "linked_devices": ["input_boolean.towel"]}
    )
    assert result["errors"] == {"temp_sensors": "sensor_required"}

    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "name": "Bad",
            "linked_devices": ["input_boolean.towel"],
            "temp_sensors": ["sensor.bad_temp"],
        },
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    zones = entry.options["zones"]
    assert len(zones) == 1
    zone_id = zones[0]["zone_id"]
    assert zones[0]["name"] == "Bad"

    # Edit it.
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["menu_options"] == ["add_zone", "edit_zone", "remove_zone"]
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "edit_zone"}
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"zone_id": zone_id}
    )
    assert result["step_id"] == "edit_zone_details"
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "name": "Badezimmer",
            "linked_devices": ["input_boolean.towel"],
            "temp_sensors": ["sensor.bad_temp"],
        },
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert entry.options["zones"][0]["name"] == "Badezimmer"
    assert entry.options["zones"][0]["zone_id"] == zone_id

    # Remove it.
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "remove_zone"}
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"zone_id": zone_id}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert entry.options["zones"] == []
