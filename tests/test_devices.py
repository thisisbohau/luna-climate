"""Battery and humidity discovery through the device registry."""

from __future__ import annotations

import datetime as dt

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)

from custom_components.luna_climate.const import DOMAIN


def _device(
    hass: HomeAssistant,
    entry: MockConfigEntry,
    name: str,
    via: dr.DeviceEntry | None = None,
) -> dr.DeviceEntry:
    registry = dr.async_get(hass)
    kwargs = {"via_device": next(iter(via.identifiers))} if via else {}
    return registry.async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={(entry.domain, name)},
        name=name,
        **kwargs,
    )


def _entity(hass, entry, device, domain, key, device_class, state, unit=None):
    reg = er.async_get(hass)
    ent = reg.async_get_or_create(
        domain, entry.domain, key, device_id=device.id, config_entry=entry,
        original_device_class=device_class,
    )
    attrs = {"device_class": device_class} if device_class else {}
    if unit:
        attrs["unit_of_measurement"] = unit
    hass.states.async_set(ent.entity_id, state, attrs)
    return ent.entity_id


async def _setup_luna(hass: HomeAssistant, zone: dict) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN,
        minor_version=3,
        options={"zones": [zone], "presence_entities": []},
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_battery_comes_from_devices_linked_to_the_zone(hass: HomeAssistant) -> None:
    """TadoLocal's shape: the zone's climate entity sits on a zone device,
    the valves and the wireless sensor are separate devices connected via
    it, and they carry the batteries. All of them count, nothing else does.
    """
    tado = MockConfigEntry(domain="tado_local", title="Tado")
    tado.add_to_hass(hass)
    zone_dev = _device(hass, tado, "zone 1")
    climate = er.async_get(hass).async_get_or_create(
        "climate", "tado_local", "zone1", device_id=zone_dev.id, config_entry=tado
    )
    hass.states.async_set(climate.entity_id, "heat", {"temperature": 20, "current_temperature": 20.5})

    valve_a = _device(hass, tado, "VA123", via=zone_dev)
    valve_b = _device(hass, tado, "VA456", via=zone_dev)
    sensor = _device(hass, tado, "SU789", via=zone_dev)
    flag_a = _entity(hass, tado, valve_a, "binary_sensor", "ba", "battery", "off")
    flag_b = _entity(hass, tado, valve_b, "binary_sensor", "bb", "battery", "off")
    flag_s = _entity(hass, tado, sensor, "binary_sensor", "bs", "battery", "off")
    # Not a battery, on a linked device: ignored.
    _entity(hass, tado, valve_a, "sensor", "serial", None, "VA123")

    # Another Tado zone's valve: must not leak into this zone.
    other_zone = _device(hass, tado, "zone 2")
    other_valve = _device(hass, tado, "VA999", via=other_zone)
    _entity(hass, tado, other_valve, "binary_sensor", "bo", "battery", "on")

    # An Aqara sensor with a percentage, used as the zone's thermometer.
    aqara = MockConfigEntry(domain="aqara", title="Aqara")
    aqara.add_to_hass(hass)
    aqara_dev = _device(hass, aqara, "living sensor")
    temp = _entity(hass, aqara, aqara_dev, "sensor", "t", "temperature", "21.0", "°C")
    pct = _entity(hass, aqara, aqara_dev, "sensor", "b", "battery", "87", "%")

    await _setup_luna(
        hass,
        {
            "zone_id": "wz",
            "name": "Wohnzimmer",
            "thermostats": [climate.entity_id],
            "temp_sensors": [temp],
            "linked_devices": [],
        },
    )

    status = "binary_sensor.luna_wohnzimmer_battery"
    state = hass.states.get(status)
    assert state.state == "off"  # all good
    found = {b["entity_id"] for b in state.attributes["luna_batteries"]}
    assert found == {flag_a, flag_b, flag_s, pct}
    assert state.attributes["luna_low_count"] == 0
    names = {b["device"] for b in state.attributes["luna_batteries"]}
    assert names == {"VA123", "VA456", "SU789", "living sensor"}
    assert hass.states.get("climate.luna_wohnzimmer").attributes["luna_battery_low"] is False

    # One valve reports low: the zone goes low right away.
    hass.states.async_set(flag_b, "on", {"device_class": "battery"})
    await hass.async_block_till_done()
    state = hass.states.get(status)
    assert state.state == "on"
    assert state.attributes["luna_low_count"] == 1
    assert hass.states.get("climate.luna_wohnzimmer").attributes["luna_battery_low"] is True

    # A percentage below the threshold counts as low too.
    hass.states.async_set(flag_b, "off", {"device_class": "battery"})
    hass.states.async_set(pct, "4", {"device_class": "battery", "unit_of_measurement": "%"})
    await hass.async_block_till_done()
    assert hass.states.get(status).state == "on"
    hass.states.async_set(pct, "60", {"device_class": "battery", "unit_of_measurement": "%"})
    await hass.async_block_till_done()
    assert hass.states.get(status).state == "off"


async def test_devices_registered_later_are_found(hass: HomeAssistant, freezer) -> None:
    """TadoLocal may finish loading after Luna: the next tick picks it up."""
    tado = MockConfigEntry(domain="tado_local", title="Tado")
    tado.add_to_hass(hass)
    zone_dev = _device(hass, tado, "zone 1")
    climate = er.async_get(hass).async_get_or_create(
        "climate", "tado_local", "zone1", device_id=zone_dev.id, config_entry=tado
    )
    hass.states.async_set(climate.entity_id, "heat", {"temperature": 20, "current_temperature": 20.5})
    await _setup_luna(
        hass,
        {"zone_id": "k", "name": "Kitchen", "thermostats": [climate.entity_id],
         "temp_sensors": [], "linked_devices": []},
    )
    status = "binary_sensor.luna_kitchen_battery"
    assert hass.states.get(status).attributes["luna_battery_count"] == 0

    valve = _device(hass, tado, "VA1", via=zone_dev)
    flag = _entity(hass, tado, valve, "binary_sensor", "b1", "battery", "on")
    async_fire_time_changed(hass, dt_util.utcnow() + dt.timedelta(minutes=1, seconds=1))
    await hass.async_block_till_done()
    state = hass.states.get(status)
    assert state.attributes["luna_battery_count"] == 1
    assert state.state == "on"

    # And from then on its changes arrive immediately.
    hass.states.async_set(flag, "off", {"device_class": "battery"})
    await hass.async_block_till_done()
    assert hass.states.get(status).state == "off"


async def test_humidity_comes_from_the_zone_devices(hass: HomeAssistant) -> None:
    """A zone finds its temperature sensor's humidity without extra config."""
    aqara = MockConfigEntry(domain="aqara", title="Aqara")
    aqara.add_to_hass(hass)
    dev = _device(hass, aqara, "bath sensor")
    temp = _entity(hass, aqara, dev, "sensor", "t", "temperature", "21.0", "°C")
    hum = _entity(hass, aqara, dev, "sensor", "h", "humidity", "63", "%")
    hass.states.async_set("climate.valve", "heat", {"temperature": 20, "current_temperature": 20.5})

    await _setup_luna(
        hass,
        {"zone_id": "bath", "name": "Bath", "thermostats": ["climate.valve"],
         "temp_sensors": [temp], "linked_devices": []},
    )
    assert hass.states.get("climate.luna_bath").attributes["current_humidity"] == 63
    hass.states.async_set(hum, "58", {"device_class": "humidity", "unit_of_measurement": "%"})
    await hass.async_block_till_done()
    assert hass.states.get("climate.luna_bath").attributes["current_humidity"] == 58


async def test_humidity_falls_back_to_the_thermostat(hass: HomeAssistant) -> None:
    """With no humidity sensor anywhere, the thermostat's own reading is used."""
    hass.states.async_set(
        "climate.valve", "heat", {"temperature": 20, "current_temperature": 20.5, "current_humidity": 48}
    )
    await _setup_luna(
        hass,
        {"zone_id": "k", "name": "Kitchen", "thermostats": ["climate.valve"],
         "temp_sensors": [], "linked_devices": []},
    )
    state = hass.states.get("climate.luna_kitchen")
    assert state.attributes["current_humidity"] == 48
    assert state.attributes["current_temperature"] == 20.5
    # No batteries known: all good, and nothing listed.
    battery = hass.states.get("binary_sensor.luna_kitchen_battery")
    assert battery.state == "off"
    assert battery.attributes["luna_batteries"] == []
