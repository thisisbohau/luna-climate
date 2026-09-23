"""Battery and humidity discovery through the device registry."""

from __future__ import annotations

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.luna_climate.const import DOMAIN


async def _device(hass: HomeAssistant, name: str) -> tuple[MockConfigEntry, dr.DeviceEntry]:
    entry = MockConfigEntry(domain="aqara", title=name)
    entry.add_to_hass(hass)
    device = dr.async_get(hass).async_get_or_create(
        config_entry_id=entry.entry_id, identifiers={("aqara", name)}, name=name
    )
    return entry, device


def _entity(hass, entry, device, domain, key, device_class, state, unit=None):
    reg = er.async_get(hass)
    ent = reg.async_get_or_create(
        domain, "aqara", key, device_id=device.id, config_entry=entry, original_device_class=device_class
    )
    attrs = {"device_class": device_class}
    if unit:
        attrs["unit_of_measurement"] = unit
    hass.states.async_set(ent.entity_id, state, attrs)
    return ent.entity_id


async def test_battery_and_humidity_come_from_the_zone_devices(hass: HomeAssistant) -> None:
    """A zone finds its devices' batteries and humidity without extra config."""
    s_entry, sensor_dev = await _device(hass, "bath sensor")
    temp = _entity(hass, s_entry, sensor_dev, "sensor", "t", "temperature", "21.0", "°C")
    hum = _entity(hass, s_entry, sensor_dev, "sensor", "h", "humidity", "63", "%")
    _entity(hass, s_entry, sensor_dev, "sensor", "b", "battery", "87", "%")

    v_entry, valve_dev = await _device(hass, "bath valve")
    reg = er.async_get(hass)
    valve = reg.async_get_or_create("climate", "aqara", "v", device_id=valve_dev.id, config_entry=v_entry)
    hass.states.async_set(valve.entity_id, "heat", {"temperature": 20, "current_temperature": 20.5})
    _entity(hass, v_entry, valve_dev, "sensor", "vb", "battery", "4", "%")
    low_flag = _entity(hass, v_entry, valve_dev, "binary_sensor", "vl", "battery", "off")

    entry = MockConfigEntry(
        domain=DOMAIN,
        options={
            "zones": [
                {
                    "zone_id": "bath",
                    "name": "Bath",
                    "thermostats": [valve.entity_id],
                    "temp_sensors": [temp],
                    "linked_devices": [],
                    "presence_entities": [],
                }
            ]
        },
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    battery = hass.states.get("sensor.luna_bath_lowest_battery")
    assert battery.state == "4.0"
    assert battery.attributes["luna_battery_warning"] is True
    assert {b["level"] for b in battery.attributes["luna_batteries"]} == {87.0, 4.0}
    assert battery.attributes["luna_battery_flags"] == [
        {"entity_id": low_flag, "device": "bath valve", "low": False}
    ]

    # Humidity came from the temperature sensor's device.
    assert hass.states.get("climate.luna_bath").attributes["current_humidity"] == 63
    hass.states.async_set(hum, "58", {"device_class": "humidity", "unit_of_measurement": "%"})
    await hass.async_block_till_done()
    assert hass.states.get("climate.luna_bath").attributes["current_humidity"] == 58


async def test_humidity_falls_back_to_the_thermostat(hass: HomeAssistant) -> None:
    """With no humidity sensor anywhere, the thermostat's own reading is used."""
    hass.states.async_set(
        "climate.valve", "heat", {"temperature": 20, "current_temperature": 20.5, "current_humidity": 48}
    )
    entry = MockConfigEntry(
        domain=DOMAIN,
        options={
            "zones": [
                {
                    "zone_id": "k",
                    "name": "Kitchen",
                    "thermostats": ["climate.valve"],
                    "temp_sensors": [],
                    "linked_devices": [],
                    "presence_entities": [],
                }
            ]
        },
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    state = hass.states.get("climate.luna_kitchen")
    assert state.attributes["current_humidity"] == 48
    assert state.attributes["current_temperature"] == 20.5
    # No batteries known: the sensor stays empty rather than inventing a value.
    assert hass.states.get("sensor.luna_kitchen_lowest_battery").state == "unknown"
