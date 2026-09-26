"""End-to-end tests: Luna Climate running inside Home Assistant.

The house used throughout:

* **Wohnzimmer** -- a radiator valve (a real ``generic_thermostat`` whose
  ``max_temp`` is 25, like a Tado valve), a temperature and a humidity
  sensor, and two presence toggles.
* **Bad** -- only a towel warmer (a real ``input_boolean``) and a
  temperature sensor; no thermostat, no presence.

Time is frozen on Wednesday 2026-09-23 in Europe/Vienna and moved forward
explicitly, so schedule changes happen exactly as they would at home.
"""

from __future__ import annotations

import datetime as dt
from typing import Any

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)

from custom_components.luna_climate.const import DOMAIN

TRV = "climate.trv_wohnzimmer"
TOWEL = "input_boolean.towel"
WZ = "climate.luna_wohnzimmer"
BAD = "climate.luna_bad"
AWAY = "number.luna_climate_away_temperature"
DAY_TYPE = "sensor.luna_climate_day_type"

WZ_DAY = [
    {"start": "06:00", "value": 21},
    {"start": "08:30", "value": "off"},
    {"start": "17:00", "value": 21.5},
    {"start": "22:30", "value": 18},
]
#: The free-day schedule used where the day type matters: a late start.
WZ_FREE = [
    {"start": "08:00", "value": 22},
    {"start": "23:00", "value": 18},
]
BAD_DAY = [
    {"start": "05:30", "value": 22},
    {"start": "08:00", "value": "off"},
    {"start": "18:00", "value": "max"},
    {"start": "22:00", "value": "off"},
]

ZONES = [
    {
        "zone_id": "wz",
        "name": "Wohnzimmer",
        "thermostats": [TRV],
        "temp_sensors": ["sensor.wz_temp"],
        "linked_devices": [],
        "presence_entities": ["input_boolean.david_home", "input_boolean.bettina_home"],
        "humidity_sensors": ["sensor.wz_hum"],
    },
    {
        "zone_id": "bad",
        "name": "Bad",
        "thermostats": [],
        "temp_sensors": ["sensor.bad_temp"],
        "linked_devices": [TOWEL],
        "presence_entities": [],
    },
]


# -- helpers ---------------------------------------------------------------


def local(hhmm: str, day: int = 23) -> dt.datetime:
    hour, minute = (int(x) for x in hhmm.split(":"))
    return dt.datetime(2026, 9, day, hour, minute, tzinfo=dt_util.get_time_zone("Europe/Vienna"))


async def goto(hass: HomeAssistant, freezer, hhmm: str, day: int = 23) -> None:
    """Move the clock and let every due timer fire."""
    moment = local(hhmm, day)
    freezer.move_to(moment)
    async_fire_time_changed(hass, moment)
    await hass.async_block_till_done()
    # The engine's minute tick schedules an apply as a task; let it land.
    async_fire_time_changed(hass, moment + dt.timedelta(seconds=1))
    await hass.async_block_till_done()


def trv(hass: HomeAssistant) -> tuple[str, float | None]:
    state = hass.states.get(TRV)
    return state.state, state.attributes.get("temperature")


def attr(hass: HomeAssistant, entity_id: str, name: str) -> Any:
    return hass.states.get(entity_id).attributes.get(name)


async def set_temp(hass: HomeAssistant, entity_id: str, value: float) -> None:
    hass.states.async_set(entity_id, str(value), {"unit_of_measurement": "°C", "device_class": "temperature"})
    await hass.async_block_till_done()


async def call(hass: HomeAssistant, service: str, data: dict | None = None, domain: str = DOMAIN, **kw):
    return await hass.services.async_call(domain, service, data or {}, blocking=True, **kw)


# -- the house -------------------------------------------------------------


@pytest.fixture
async def house(hass: HomeAssistant, freezer) -> MockConfigEntry:
    """A running Home Assistant with the two zones configured."""
    await hass.config.async_set_time_zone("Europe/Vienna")
    freezer.move_to(local("05:50"))
    # Always loaded in a real install; generic_thermostat relies on it.
    assert await async_setup_component(hass, "homeassistant", {})

    assert await async_setup_component(
        hass,
        "input_boolean",
        {
            "input_boolean": {
                "trv_valve": {"name": "TRV valve"},
                "towel": {"name": "Towel warmer"},
                "david_home": {"name": "David home", "initial": True},
                "bettina_home": {"name": "Bettina home", "initial": False},
            }
        },
    )
    await set_temp(hass, "sensor.wz_temp", 19.0)
    await set_temp(hass, "sensor.bad_temp", 20.0)
    hass.states.async_set("sensor.wz_hum", "55", {"unit_of_measurement": "%", "device_class": "humidity"})

    assert await async_setup_component(
        hass,
        "climate",
        {
            "climate": [
                {
                    "platform": "generic_thermostat",
                    "name": "TRV Wohnzimmer",
                    "unique_id": "trv_wohnzimmer",
                    "heater": "input_boolean.trv_valve",
                    "target_sensor": "sensor.wz_temp",
                    "min_temp": 5,
                    "max_temp": 25,
                    "target_temp": 18,
                    "target_temp_step": 0.5,
                    "initial_hvac_mode": "heat",
                }
            ]
        },
    )
    await hass.async_block_till_done()
    assert hass.states.get(TRV) is not None

    entry = MockConfigEntry(domain=DOMAIN, title="Luna Climate", data={}, options={"zones": ZONES})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    # The same day on both schedules, so most tests do not depend on the
    # day type; the workday tests set their own.
    await call(hass, "set_schedule", {"entity_id": WZ, "workday": WZ_DAY, "free": WZ_DAY})
    await call(hass, "set_schedule", {"entity_id": BAD, "workday": BAD_DAY, "free": BAD_DAY})
    await hass.async_block_till_done()
    return entry


# -- tests -----------------------------------------------------------------


async def test_entities_are_created_with_luna_prefix(hass: HomeAssistant, house) -> None:
    """Every zone gets its full set of entities, all prefixed luna."""
    registry = er.async_get(hass)
    expected = [
        WZ,
        "select.luna_wohnzimmer_mode",
        "number.luna_wohnzimmer_boost_offset",
        "number.luna_wohnzimmer_hysteresis",
        "number.luna_wohnzimmer_minimum_cycle_time",
        "sensor.luna_wohnzimmer_scheduled_temperature",
        "sensor.luna_wohnzimmer_boost_ends_at",
        "binary_sensor.luna_wohnzimmer_battery",
        "button.luna_wohnzimmer_schedule_details",
        BAD,
        AWAY,
        DAY_TYPE,
        "number.luna_climate_precomfort_timeout",
        "binary_sensor.luna_climate_home",
    ]
    for entity_id in expected:
        assert registry.async_get(entity_id) is not None, entity_id
        assert hass.states.get(entity_id) is not None, entity_id

    retired = [
        "switch.luna_wohnzimmer_night_mode",
        "number.luna_wohnzimmer_away_temperature",
        "number.luna_wohnzimmer_night_temperature",
        "sensor.luna_wohnzimmer_lowest_battery",
        "sensor.luna_wohnzimmer_night_average_temperature",
        "time.luna_climate_night_start",
        "time.luna_climate_night_end",
    ]
    for entity_id in retired:
        assert hass.states.get(entity_id) is None, entity_id

    assert attr(hass, WZ, "luna_zone_id") == "wz"
    assert attr(hass, WZ, "luna_zone_name") == "Wohnzimmer"


async def test_a_day_on_the_radiator_valve(hass: HomeAssistant, house, freezer) -> None:
    """The valve follows the schedule block by block, all day."""
    # 05:50 -- still last night's 18.0 block.
    await goto(hass, freezer, "05:51")
    assert trv(hass) == ("heat", 18.0)
    assert hass.states.get(WZ).attributes["temperature"] == 18.0

    await goto(hass, freezer, "06:00")
    assert trv(hass) == ("heat", 21.0)
    assert attr(hass, WZ, "luna_source") == "schedule"

    await goto(hass, freezer, "08:30")
    assert trv(hass)[0] == "off"
    assert hass.states.get(WZ).state == "off"

    await goto(hass, freezer, "17:00")
    assert trv(hass) == ("heat", 21.5)

    await goto(hass, freezer, "22:30")
    assert trv(hass) == ("heat", 18.0)

    # Tomorrow morning, the same again.
    await goto(hass, freezer, "06:00", day=24)
    assert trv(hass) == ("heat", 21.0)


async def test_drift_on_the_valve_is_corrected(hass: HomeAssistant, house, freezer) -> None:
    """Someone turns the valve by hand: the next tick puts it back."""
    await goto(hass, freezer, "17:05")
    assert trv(hass) == ("heat", 21.5)

    await call(hass, "set_temperature", {"entity_id": TRV, "temperature": 24}, domain="climate")
    assert trv(hass) == ("heat", 24.0)

    await goto(hass, freezer, "17:06")
    assert trv(hass) == ("heat", 21.5)

    # Turned off at the device: back on.
    await call(hass, "set_hvac_mode", {"entity_id": TRV, "hvac_mode": "off"}, domain="climate")
    await goto(hass, freezer, "17:07")
    assert trv(hass) == ("heat", 21.5)


async def test_max_is_clamped_to_the_valve(hass: HomeAssistant, house, freezer) -> None:
    """Max asks each device for no more than it can accept."""
    await goto(hass, freezer, "17:05")
    await call(hass, "set_target", {"entity_id": WZ, "value": "max"})
    assert trv(hass) == ("heat", 25.0)
    assert attr(hass, WZ, "luna_value") == "max"


async def test_towel_warmer_regulates_with_minimum_cycle(hass: HomeAssistant, house, freezer) -> None:
    """A linked device runs a bang-bang loop with deadband and minimum cycle."""
    # 05:50: Bad block 22.0, measured 20.0 -> on.
    await goto(hass, freezer, "05:51")
    assert hass.states.get(TOWEL).state == "on"

    # Inside the deadband (22 +- 0.3): left alone.
    await set_temp(hass, "sensor.bad_temp", 22.2)
    await goto(hass, freezer, "05:52")
    assert hass.states.get(TOWEL).state == "on"

    # Above it, but the warmer switched on only a minute ago: held.
    await set_temp(hass, "sensor.bad_temp", 22.6)
    await goto(hass, freezer, "05:53")
    assert hass.states.get(TOWEL).state == "on"

    # Ten minutes after it switched on, it may go off.
    await goto(hass, freezer, "06:02")
    assert hass.states.get(TOWEL).state == "off"

    # Cooling again straight away: the off is held too.
    await set_temp(hass, "sensor.bad_temp", 21.0)
    await goto(hass, freezer, "06:04")
    assert hass.states.get(TOWEL).state == "off"

    # Past the window but only just below target (inside the deadband): off.
    await set_temp(hass, "sensor.bad_temp", 21.8)
    await goto(hass, freezer, "06:13")
    assert hass.states.get(TOWEL).state == "off"

    # Clearly below: on.
    await set_temp(hass, "sensor.bad_temp", 21.0)
    await goto(hass, freezer, "06:14")
    assert hass.states.get(TOWEL).state == "on"

    # 08:00: off block.
    await goto(hass, freezer, "08:00")
    assert hass.states.get(TOWEL).state == "off"

    # 18:00: max -- on regardless of a warm room.
    await set_temp(hass, "sensor.bad_temp", 24.0)
    await goto(hass, freezer, "18:00")
    assert hass.states.get(TOWEL).state == "on"
    assert hass.states.get(BAD).attributes["temperature"] == 27.0

    # Boosting a zone that is already at max keeps it unconditional.
    await call(hass, "boost", {"entity_id": BAD, "duration": 30})
    assert attr(hass, BAD, "luna_value") == "max"
    await call(hass, "cancel_boost", {"entity_id": BAD})

    await goto(hass, freezer, "22:00")
    assert hass.states.get(TOWEL).state == "off"


async def test_missing_sensor_leaves_towel_alone(hass: HomeAssistant, house, freezer) -> None:
    """Without a reading there is nothing to regulate against."""
    await goto(hass, freezer, "05:51")
    assert hass.states.get(TOWEL).state == "on"
    hass.states.async_set("sensor.bad_temp", "unavailable")
    await goto(hass, freezer, "06:30")
    assert hass.states.get(TOWEL).state == "on"


async def test_away_precomfort_and_arrival(hass: HomeAssistant, house, freezer) -> None:
    """Everyone leaves, the geofence fires, someone arrives."""
    await goto(hass, freezer, "17:05")
    assert trv(hass) == ("heat", 21.5)

    await call(hass, "turn_off", {"entity_id": "input_boolean.david_home"}, domain="input_boolean")
    await goto(hass, freezer, "17:06")
    assert attr(hass, WZ, "luna_source") == "away"
    assert trv(hass) == ("heat", 16.0)
    # The towel zone has no presence and is never away.
    assert attr(hass, BAD, "luna_source") == "schedule"

    await call(hass, "start_precomfort")
    assert attr(hass, WZ, "luna_source") == "schedule"
    assert trv(hass) == ("heat", 21.5)

    await call(hass, "turn_on", {"entity_id": "input_boolean.bettina_home"}, domain="input_boolean")
    await goto(hass, freezer, "17:08")
    assert attr(hass, WZ, "luna_precomfort_active") is False
    assert trv(hass) == ("heat", 21.5)


async def test_precomfort_times_out(hass: HomeAssistant, house, freezer) -> None:
    """Driving past the outer fence without coming home does not heat all evening."""
    await goto(hass, freezer, "17:05")
    await call(hass, "turn_off", {"entity_id": "input_boolean.david_home"}, domain="input_boolean")
    await call(hass, "start_precomfort")
    assert trv(hass) == ("heat", 21.5)
    await goto(hass, freezer, "19:06")  # default timeout 120 min
    assert attr(hass, WZ, "luna_source") == "away"
    assert trv(hass) == ("heat", 16.0)


async def test_away_never_heats_an_off_block(hass: HomeAssistant, house, freezer) -> None:
    """Away only lowers: during an off block the valve stays off."""
    await call(hass, "turn_off", {"entity_id": "input_boolean.david_home"}, domain="input_boolean")
    await goto(hass, freezer, "09:00")
    assert trv(hass)[0] == "off"


async def test_unknown_tracker_is_not_away(hass: HomeAssistant, house, freezer) -> None:
    """A tracker that has not reported yet must not cool the house."""
    await goto(hass, freezer, "17:05")
    await call(hass, "turn_off", {"entity_id": "input_boolean.david_home"}, domain="input_boolean")
    hass.states.async_set("input_boolean.bettina_home", "unavailable")
    await goto(hass, freezer, "17:06")
    assert attr(hass, WZ, "luna_source") == "schedule"
    assert trv(hass) == ("heat", 21.5)


async def test_boost_ends_in_the_current_block(hass: HomeAssistant, house, freezer) -> None:
    """A boost started in one block returns to the block in force when it ends."""
    await goto(hass, freezer, "16:50")
    assert trv(hass)[0] == "off"  # 08:30 off block

    await call(hass, "boost", {"entity_id": WZ, "duration": 30})
    # Boosting from off goes to max, clamped to the valve.
    assert attr(hass, WZ, "luna_source") == "boost"
    assert trv(hass) == ("heat", 25.0)
    assert hass.states.get("sensor.luna_wohnzimmer_boost_ends_at").state != "unknown"

    await goto(hass, freezer, "17:21")
    assert attr(hass, WZ, "luna_source") == "schedule"
    assert trv(hass) == ("heat", 21.5)  # the 17:00 block, not the off block


async def test_boost_offset_and_no_stacking(hass: HomeAssistant, house, freezer) -> None:
    """Boost adds the zone's offset once; tapping again only restarts the timer."""
    await goto(hass, freezer, "17:05")
    await call(hass, "boost", {"entity_id": WZ, "duration": 30})
    assert trv(hass) == ("heat", 23.5)
    await call(hass, "boost", {"entity_id": WZ, "duration": 30})
    assert trv(hass) == ("heat", 23.5)
    await call(hass, "cancel_boost", {"entity_id": WZ})
    assert trv(hass) == ("heat", 21.5)


async def test_manual_via_climate_entity_and_resume(hass: HomeAssistant, house, freezer) -> None:
    """The zone's own climate entity behaves like a thermostat dial."""
    await goto(hass, freezer, "17:05")
    await call(hass, "boost", {"entity_id": WZ, "duration": 60})

    await call(hass, "set_temperature", {"entity_id": WZ, "temperature": 19.5}, domain="climate")
    assert attr(hass, WZ, "luna_source") == "manual"
    assert attr(hass, WZ, "luna_boost_active") is False  # setting a target ends the boost
    assert trv(hass) == ("heat", 19.5)
    assert hass.states.get("select.luna_wohnzimmer_mode").state == "manual"

    # A block change does not touch a manual zone.
    await goto(hass, freezer, "22:30")
    assert trv(hass) == ("heat", 19.5)

    await call(hass, "set_hvac_mode", {"entity_id": WZ, "hvac_mode": "off"}, domain="climate")
    assert trv(hass)[0] == "off"
    assert hass.states.get(WZ).state == "off"

    await call(hass, "set_hvac_mode", {"entity_id": WZ, "hvac_mode": "heat"}, domain="climate")
    assert attr(hass, WZ, "luna_source") == "schedule"
    assert trv(hass) == ("heat", 18.0)


async def test_mode_select_and_resume_service(hass: HomeAssistant, house, freezer) -> None:
    """Manual and schedule can be switched from the select and the services."""
    await goto(hass, freezer, "17:05")
    await call(hass, "set_target", {"entity_id": WZ, "value": 20})
    assert hass.states.get("select.luna_wohnzimmer_mode").state == "manual"
    await call(hass, "resume_schedule", {"entity_id": WZ})
    assert trv(hass) == ("heat", 21.5)
    await call(
        hass, "select_option", {"entity_id": "select.luna_wohnzimmer_mode", "option": "manual"}, domain="select"
    )
    assert trv(hass) == ("heat", 20.0)


async def test_tunables_change_behaviour(hass: HomeAssistant, house, freezer) -> None:
    """Numbers are live: the global away temperature takes effect at once."""
    await goto(hass, freezer, "17:05")
    await call(hass, "set_value", {"entity_id": AWAY, "value": 15.5}, domain="number")
    await call(hass, "turn_off", {"entity_id": "input_boolean.david_home"}, domain="input_boolean")
    await goto(hass, freezer, "17:06")
    assert trv(hass) == ("heat", 15.5)


async def test_state_survives_a_reload(hass: HomeAssistant, house, freezer) -> None:
    """Schedules and tunables persist across a restart of the entry."""
    await call(hass, "set_value", {"entity_id": AWAY, "value": 14}, domain="number")
    await call(hass, "set_schedule", {"entity_id": WZ, "free": WZ_FREE})

    assert await hass.config_entries.async_reload(house.entry_id)
    await hass.async_block_till_done()

    assert hass.states.get(AWAY).state == "14.0"

    def stored(day):
        return [{"start": b["start"], "value": b["value"] if b["value"] == "off" else float(b["value"])} for b in day]

    response = await call(hass, "get_schedule", {"entity_id": WZ}, return_response=True)
    # Setting only the free day left the workday schedule alone.
    assert response["schedules"][WZ] == {"workday": stored(WZ_DAY), "free": stored(WZ_FREE)}
    await goto(hass, freezer, "17:05")
    assert trv(hass) == ("heat", 21.5)


async def test_removing_a_zone_cleans_up(hass: HomeAssistant, house) -> None:
    """A removed zone leaves no device or entities behind."""
    devices = dr.async_get(hass)
    assert devices.async_get_device(identifiers={(DOMAIN, "bad")}) is not None

    hass.config_entries.async_update_entry(house, options={"zones": [ZONES[0]]})
    await hass.async_block_till_done()

    assert devices.async_get_device(identifiers={(DOMAIN, "bad")}) is None
    assert er.async_get(hass).async_get(BAD) is None
    assert hass.states.get(WZ) is not None
    assert devices.async_get_device(identifiers={(DOMAIN, "global")}) is not None


async def test_humidity_is_exposed(hass: HomeAssistant, house) -> None:
    """The zone reports its humidity as the standard climate attribute."""
    assert attr(hass, WZ, "current_humidity") == 55
    hass.states.async_set("sensor.wz_hum", "61", {"unit_of_measurement": "%", "device_class": "humidity"})
    await hass.async_block_till_done()
    assert attr(hass, WZ, "current_humidity") == 61
    assert attr(hass, BAD, "current_humidity") is None


async def test_services_reject_bad_input(hass: HomeAssistant, house) -> None:
    """Clear errors instead of silent failures."""
    with pytest.raises(ServiceValidationError):
        await call(hass, "boost", {"entity_id": TRV})  # not a Luna zone
    with pytest.raises(ServiceValidationError):
        await call(hass, "set_target", {"entity_id": WZ, "value": "warm"})
    with pytest.raises(ServiceValidationError):
        await call(hass, "cool_for", {"entity_id": WZ})
    with pytest.raises(ServiceValidationError):
        await call(hass, "set_schedule", {"entity_id": WZ, "workday": [{"start": "06:00", "value": 40}]})
    with pytest.raises(Exception):  # noqa: B017 - neither day type given
        await call(hass, "set_schedule", {"entity_id": WZ})


async def test_websocket_api(hass: HomeAssistant, house, hass_ws_client) -> None:
    """The API the cards use."""
    client = await hass_ws_client(hass)

    await client.send_json_auto_id({"type": "luna_climate/zones"})
    msg = await client.receive_json()
    assert msg["success"]
    zones = {z["zone_id"]: z for z in msg["result"]["zones"]}
    assert set(zones) == {"wz", "bad"}
    assert zones["wz"]["current_humidity"] == 55.0
    assert zones["wz"]["devices"]["humidity_sensors"] == ["sensor.wz_hum"]
    assert zones["wz"]["battery_low"] is False
    assert msg["result"]["global"]["day_types"]["today"] == "workday"
    assert msg["result"]["global"]["away_temp"] == 16.0

    await client.send_json_auto_id({"type": "luna_climate/schedule/get", "zone_id": "wz"})
    msg = await client.receive_json()
    assert msg["success"]
    assert len(msg["result"]["schedules"]["workday"]) == 4
    assert msg["result"]["day_types"] == {
        "yesterday": "workday", "today": "workday", "tomorrow": "workday", "from_entity": False,
    }

    await client.send_json_auto_id(
        {"type": "luna_climate/schedule/set", "zone_id": "wz", "schedules": {"free": WZ_FREE}}
    )
    msg = await client.receive_json()
    assert msg["success"]
    assert len(msg["result"]["schedules"]["free"]) == 2
    assert len(msg["result"]["schedules"]["workday"]) == 4

    await client.send_json_auto_id(
        {
            "type": "luna_climate/schedule/set",
            "zone_id": "wz",
            "schedules": {"workday": [{"start": "25:00", "value": 20}]},
        }
    )
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "invalid_schedule"

    await client.send_json_auto_id({"type": "luna_climate/schedule/get", "zone_id": "nope"})
    msg = await client.receive_json()
    assert msg["error"]["code"] == "not_found"


async def test_card_bundle_is_served(hass: HomeAssistant, house, hass_client) -> None:
    """The dashboard cards load without any manual resource."""
    from homeassistant.components.frontend import DATA_EXTRA_MODULE_URL

    urls = hass.data[DATA_EXTRA_MODULE_URL].urls
    url = next(u for u in urls if "luna-climate-cards.js" in u)
    client = await hass_client()
    resp = await client.get(url)
    assert resp.status == 200
    body = await resp.text()
    for tag in ("luna-zone-card", "luna-zone-compact-card", "luna-boost-badge", "luna-badge-card"):
        assert tag in body


async def test_unload(hass: HomeAssistant, house) -> None:
    """Unloading stops control and leaves services answering clearly."""
    assert await hass.config_entries.async_unload(house.entry_id)
    await hass.async_block_till_done()
    assert hass.states.get(WZ).state == "unavailable"
    assert hass.services.has_service(DOMAIN, "boost")
    with pytest.raises(ServiceValidationError):
        await call(hass, "boost", {"entity_id": WZ})


async def test_old_per_zone_presence_is_migrated(hass: HomeAssistant, house) -> None:
    """1.1 entries move presence to the household list without changing behaviour."""
    assert house.minor_version == 3
    assert house.options["workday_entity"] is None
    assert house.options["workday_offset"] == "tomorrow"
    assert house.options["presence_entities"] == [
        "input_boolean.david_home",
        "input_boolean.bettina_home",
    ]
    zones = {z["zone_id"]: z for z in house.options["zones"]}
    assert "presence_entities" not in zones["wz"]
    assert zones["wz"]["away_enabled"] is True  # had trackers
    assert zones["bad"]["away_enabled"] is False  # had none
    assert attr(hass, BAD, "luna_away_enabled") is False


async def test_home_sensor_and_person_entities(hass: HomeAssistant, house, freezer) -> None:
    """Person and device_tracker states count too: 'home' is home."""
    home = "binary_sensor.luna_climate_home"
    assert hass.states.get(home).state == "on"

    hass.config_entries.async_update_entry(
        house, options={**house.options, "presence_entities": ["person.david", "device_tracker.phone"]}
    )
    await hass.async_block_till_done()
    hass.states.async_set("person.david", "home")
    hass.states.async_set("device_tracker.phone", "not_home")
    await goto(hass, freezer, "17:05")
    assert hass.states.get(home).state == "on"
    assert trv(hass) == ("heat", 21.5)

    hass.states.async_set("person.david", "Work")  # a named zone is not home
    await goto(hass, freezer, "17:06")
    assert hass.states.get(home).state == "off"
    assert trv(hass) == ("heat", 16.0)

    # Precomfort lifts away for the zones but the sensor still says away.
    await call(hass, "start_precomfort")
    assert trv(hass) == ("heat", 21.5)
    assert hass.states.get(home).state == "off"
    assert hass.states.get(home).attributes["luna_precomfort_active"] is True

    hass.states.async_set("person.david", "home")
    await goto(hass, freezer, "17:07")
    assert hass.states.get(home).state == "on"
    assert hass.states.get(home).attributes["luna_precomfort_active"] is False


async def test_away_can_be_turned_off_per_zone(hass: HomeAssistant, house, freezer) -> None:
    """A zone that does not follow away keeps its schedule when everyone leaves."""
    zones = [dict(z) for z in house.options["zones"]]
    zones[0]["away_enabled"] = False
    hass.config_entries.async_update_entry(house, options={**house.options, "zones": zones})
    await hass.async_block_till_done()
    await call(hass, "turn_off", {"entity_id": "input_boolean.david_home"}, domain="input_boolean")
    await goto(hass, freezer, "17:06")
    assert hass.states.get("binary_sensor.luna_climate_home").state == "off"
    assert attr(hass, WZ, "luna_source") == "schedule"
    assert trv(hass) == ("heat", 21.5)


async def test_details_button_reaches_only_the_pressing_user(
    hass: HomeAssistant, house, hass_ws_client, hass_admin_user
) -> None:
    """The device-page button opens the detail view in the presser's browser."""
    from homeassistant.core import Context
    from pytest_homeassistant_custom_component.common import MockUser

    someone_else = MockUser(name="Bettina", is_owner=True).add_to_hass(hass)

    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "luna_climate/subscribe_ui"})
    msg = await client.receive_json()
    assert msg["success"]
    sub_id = msg["id"]

    button = "button.luna_wohnzimmer_schedule_details"
    assert hass.states.get(button) is not None

    # Pressed by someone else (or an automation): nothing arrives.
    await hass.services.async_call(
        "button", "press", {"entity_id": button}, blocking=True, context=Context(user_id=someone_else.id)
    )
    await hass.services.async_call("button", "press", {"entity_id": button}, blocking=True)

    # Pressed by this connection's user: the zone arrives.
    await hass.services.async_call(
        "button", "press", {"entity_id": button}, blocking=True, context=Context(user_id=hass_admin_user.id)
    )
    msg = await client.receive_json()
    assert msg["id"] == sub_id
    assert msg["type"] == "event"
    assert msg["event"] == {"zone_id": "wz", "entity_id": WZ}


# -- workday / free day ----------------------------------------------------


async def _use_workday_sensor(hass: HomeAssistant, house, entity_id: str, offset: str) -> None:
    await call(hass, "set_schedule", {"entity_id": WZ, "workday": WZ_DAY, "free": WZ_FREE})
    hass.config_entries.async_update_entry(
        house, options={**house.options, "workday_entity": entity_id, "workday_offset": offset}
    )
    await hass.async_block_till_done()


async def test_workday_sensor_for_the_next_day(hass: HomeAssistant, house, freezer) -> None:
    """A sensor that describes tomorrow: today is what it said yesterday.

    Wednesday: the sensor says Thursday is a holiday. Wednesday itself
    keeps the workday schedule to midnight; Thursday runs the free-day
    schedule, even after the sensor has moved on to talk about Friday and
    even across a restart.
    """
    sensor = "binary_sensor.workday_tomorrow"
    hass.states.async_set(sensor, "on")
    await _use_workday_sensor(hass, house, sensor, "tomorrow")

    await goto(hass, freezer, "07:00")
    assert trv(hass) == ("heat", 21.0)  # Wednesday, workday (no reading from Tuesday: Mon-Fri rule)
    assert hass.states.get(DAY_TYPE).state == "workday"
    assert attr(hass, DAY_TYPE, "luna_tomorrow") == "workday"

    # Evening: Thursday turns out to be a holiday.
    await goto(hass, freezer, "18:00")
    hass.states.async_set(sensor, "off")
    await goto(hass, freezer, "18:01")
    assert attr(hass, DAY_TYPE, "luna_tomorrow") == "free"
    assert hass.states.get(DAY_TYPE).state == "workday"  # Wednesday is still a workday
    assert trv(hass) == ("heat", 21.5)

    # Just after midnight the sensor starts describing Friday.
    await goto(hass, freezer, "00:00", day=24)
    hass.states.async_set(sensor, "on")
    await goto(hass, freezer, "00:01", day=24)
    assert hass.states.get(DAY_TYPE).state == "free"
    assert attr(hass, DAY_TYPE, "luna_from_entity") is True
    assert attr(hass, DAY_TYPE, "luna_tomorrow") == "workday"

    # Thursday morning: Wednesday's 22:30 block carries on until the free
    # day's first block at 08:00 -- no 06:00 workday start.
    await goto(hass, freezer, "06:30", day=24)
    assert trv(hass) == ("heat", 18.0)
    assert attr(hass, WZ, "luna_day_type") == "free"
    await goto(hass, freezer, "09:00", day=24)
    assert trv(hass) == ("heat", 22.0)  # the workday schedule would be off here

    # A restart does not forget what Wednesday's reading was.
    assert await hass.config_entries.async_reload(house.entry_id)
    await hass.async_block_till_done()
    await goto(hass, freezer, "09:05", day=24)
    assert hass.states.get(DAY_TYPE).state == "free"
    assert trv(hass) == ("heat", 22.0)

    # Friday is a workday again.
    await goto(hass, freezer, "06:00", day=25)
    assert hass.states.get(DAY_TYPE).state == "workday"
    assert trv(hass) == ("heat", 21.0)


async def test_workday_sensor_for_the_same_day(hass: HomeAssistant, house, freezer) -> None:
    """A sensor that describes today switches the schedule immediately."""
    sensor = "input_boolean.workday_today"
    hass.states.async_set(sensor, "off")
    await _use_workday_sensor(hass, house, sensor, "today")

    await goto(hass, freezer, "07:00")
    assert hass.states.get(DAY_TYPE).state == "free"
    assert trv(hass) == ("heat", 18.0)  # Tuesday's last block, until 08:00
    await goto(hass, freezer, "08:00")
    assert trv(hass) == ("heat", 22.0)

    hass.states.async_set(sensor, "on")
    await goto(hass, freezer, "09:00")
    assert hass.states.get(DAY_TYPE).state == "workday"
    assert trv(hass)[0] == "off"


async def test_without_a_sensor_weekends_are_free(hass: HomeAssistant, house, freezer) -> None:
    """With no workday sensor, Monday to Friday are workdays."""
    await call(hass, "set_schedule", {"entity_id": WZ, "workday": WZ_DAY, "free": WZ_FREE})
    await goto(hass, freezer, "09:00", day=25)  # Friday
    assert trv(hass)[0] == "off"
    await goto(hass, freezer, "09:00", day=26)  # Saturday
    assert hass.states.get(DAY_TYPE).state == "free"
    assert attr(hass, DAY_TYPE, "luna_from_entity") is False
    assert trv(hass) == ("heat", 22.0)


async def test_global_away_temperature(hass: HomeAssistant, house, freezer) -> None:
    """One away temperature for every zone that follows away."""
    zones = [dict(z) for z in house.options["zones"]]
    zones[1]["away_enabled"] = True
    hass.config_entries.async_update_entry(house, options={**house.options, "zones": zones})
    await hass.async_block_till_done()

    await call(hass, "set_value", {"entity_id": AWAY, "value": 17}, domain="number")
    await goto(hass, freezer, "05:51")
    await call(hass, "turn_off", {"entity_id": "input_boolean.david_home"}, domain="input_boolean")
    await goto(hass, freezer, "06:30")
    assert attr(hass, WZ, "luna_value") == 17.0
    assert attr(hass, BAD, "luna_value") == 17.0


async def test_upgrade_from_weekday_schedules(hass: HomeAssistant, hass_storage, freezer) -> None:
    """0.4 storage: weekday blocks, per-zone away and night mode are upgraded."""
    await hass.config.async_set_time_zone("Europe/Vienna")
    freezer.move_to(local("12:00"))
    hass_storage["luna_climate.store"] = {
        "version": 1,
        "minor_version": 1,
        "key": "luna_climate.store",
        "data": {
            "zones": {
                "wz": {
                    "schedule": [
                        {"weekdays": [0, 1, 2, 3, 4], "start": "06:00", "value": 21},
                        {"weekdays": [0, 1, 2, 3, 4, 5, 6], "start": "22:30", "value": 18},
                        {"weekdays": [5, 6], "start": "08:00", "value": 22},
                    ],
                    "mode": "auto",
                    "manual_temp": 21.0,
                    "night_mode": True,
                    "settings": {"away_temp": 15.0, "night_temp": 19.0, "hysteresis": 0.4},
                },
                "bad": {
                    "schedule": [],
                    "mode": "auto",
                    "manual_temp": 21.0,
                    "night_mode": False,
                    "settings": {"away_temp": 17.0, "night_temp": 20.0},
                },
                "kz": {
                    "schedule": [],
                    "mode": "auto",
                    "manual_temp": 21.0,
                    "settings": {"away_temp": 15.0},
                },
            },
            "global": {"night_start": "22:00:00", "night_end": "06:00:00", "precomfort_timeout": 90},
        },
    }
    hass.states.async_set("climate.valve", "heat", {"temperature": 20, "current_temperature": 20})
    zone = {"thermostats": ["climate.valve"], "temp_sensors": [], "linked_devices": []}
    entry = MockConfigEntry(
        domain=DOMAIN,
        minor_version=2,
        options={
            "zones": [
                {"zone_id": "wz", "name": "Wohnzimmer", **zone},
                {"zone_id": "bad", "name": "Bad", **zone},
                {"zone_id": "kz", "name": "Kinderzimmer", **zone},
            ],
            "presence_entities": [],
        },
    )
    entry.add_to_hass(hass)
    registry = er.async_get(hass)
    old = [
        ("switch", "luna_wz_night_mode"),
        ("number", "luna_wz_night_temp"),
        ("number", "luna_wz_away_temp"),
        ("sensor", "luna_wz_battery_min"),
        ("sensor", "luna_wz_night_avg_temp"),
        ("time", "luna_global_night_start"),
    ]
    old_ids = [
        registry.async_get_or_create(domain, DOMAIN, unique_id, config_entry=entry).entity_id
        for domain, unique_id in old
    ]

    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    for entity_id in old_ids:
        assert registry.async_get(entity_id) is None, entity_id
    assert entry.minor_version == 3

    response = await call(hass, "get_schedule", {"entity_id": "climate.luna_wohnzimmer"}, return_response=True)
    assert response["schedules"]["climate.luna_wohnzimmer"] == {
        "workday": [{"start": "06:00", "value": 21.0}, {"start": "22:30", "value": 18.0}],
        "free": [{"start": "08:00", "value": 22.0}, {"start": "22:30", "value": 18.0}],
    }
    # 15 twice, 17 once: the most common value wins.
    assert hass.states.get(AWAY).state == "15.0"
    assert hass.states.get("number.luna_climate_precomfort_timeout").state == "90.0"
    assert hass.states.get("number.luna_wohnzimmer_hysteresis").state == "0.4"

    saved = hass_storage["luna_climate.store"]["data"]
    assert "schedule" not in saved["zones"]["wz"]
    assert "night_mode" not in saved["zones"]["wz"]
    assert "night_start" not in saved["global"]
