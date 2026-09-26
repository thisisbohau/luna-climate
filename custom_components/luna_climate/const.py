"""Constants for the Luna Climate integration."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "luna_climate"

# Everything user visible is prefixed with "luna" so it is easy to spot
# among the stock integrations.
BRAND: Final = "Luna"
MANUFACTURER: Final = "Luna Climate"

STORAGE_KEY: Final = f"{DOMAIN}.store"
STORAGE_VERSION: Final = 1

# --- config entry options -------------------------------------------------

CONF_ZONES: Final = "zones"
CONF_ZONE_ID: Final = "zone_id"
CONF_NAME: Final = "name"
CONF_THERMOSTATS: Final = "thermostats"
CONF_TEMP_SENSORS: Final = "temp_sensors"
CONF_LINKED_DEVICES: Final = "linked_devices"
CONF_PRESENCE_ENTITIES: Final = "presence_entities"
CONF_HUMIDITY_SENSORS: Final = "humidity_sensors"
CONF_AWAY_ENABLED: Final = "away_enabled"
#: A binary_sensor / input_boolean saying whether a day is a workday.
CONF_WORKDAY_ENTITY: Final = "workday_entity"
#: Which day that entity describes: "tomorrow" (e.g. the Workday
#: integration with days_offset: 1) or "today".
CONF_WORKDAY_OFFSET: Final = "workday_offset"
WORKDAY_TOMORROW: Final = "tomorrow"
WORKDAY_TODAY: Final = "today"

# --- runtime settings (stored in the Store, editable via entities) --------

SET_HYSTERESIS: Final = "hysteresis"
SET_MIN_CYCLE: Final = "min_cycle_minutes"
SET_BOOST_OFFSET: Final = "boost_offset"

GLOBAL_AWAY_TEMP: Final = "away_temp"
GLOBAL_PRECOMFORT_TIMEOUT: Final = "precomfort_timeout"

DEFAULT_AWAY_TEMP: Final = 16.0
DEFAULT_HYSTERESIS: Final = 0.3
DEFAULT_MIN_CYCLE: Final = 10
DEFAULT_BOOST_OFFSET: Final = 2.0
DEFAULT_PRECOMFORT_TIMEOUT: Final = 120

# --- schedule block values ------------------------------------------------

VALUE_OFF: Final = "off"
VALUE_MAX: Final = "max"

#: Temperature applied for a ``max`` block. Clamped per device to whatever
#: that device actually accepts as ``max_temp``.
MAX_TEMP: Final = 27.0

#: Range accepted for a numeric schedule block.
MIN_BLOCK_TEMP: Final = 18.0
MAX_BLOCK_TEMP: Final = 25.0

#: Hard limits for the zone climate entity (away temp may go below the
#: block minimum, boost may go above it).
ZONE_MIN_TEMP: Final = 5.0
ZONE_MAX_TEMP: Final = MAX_TEMP

# --- zone modes -----------------------------------------------------------

MODE_AUTO: Final = "auto"
MODE_MANUAL: Final = "manual"
ZONE_MODES: Final = [MODE_AUTO, MODE_MANUAL]

# --- services -------------------------------------------------------------

SERVICE_BOOST: Final = "boost"
SERVICE_CANCEL_BOOST: Final = "cancel_boost"
SERVICE_COOL_FOR: Final = "cool_for"
SERVICE_START_PRECOMFORT: Final = "start_precomfort"
SERVICE_SET_SCHEDULE: Final = "set_schedule"
SERVICE_GET_SCHEDULE: Final = "get_schedule"
SERVICE_CLEAR_PRECOMFORT: Final = "clear_precomfort"
SERVICE_SET_TARGET: Final = "set_target"
SERVICE_RESUME_SCHEDULE: Final = "resume_schedule"

ATTR_ZONE_ID: Final = "zone_id"
ATTR_DURATION: Final = "duration"
ATTR_TEMPERATURE: Final = "temperature"
ATTR_SCHEDULE: Final = "schedule"
ATTR_WORKDAY: Final = "workday"
ATTR_FREE: Final = "free"
ATTR_VALUE: Final = "value"

# --- dispatcher -----------------------------------------------------------

SIGNAL_UPDATE: Final = f"{DOMAIN}_update"
#: Fired when someone asks for a zone's detail view (the device page button).
SIGNAL_OPEN_UI: Final = f"{DOMAIN}_open_ui"

# --- battery --------------------------------------------------------------

#: A percentage battery below this counts as low. Flag-style batteries
#: (Tado) are low when their flag says so.
BATTERY_WARN_THRESHOLD: Final = 5
