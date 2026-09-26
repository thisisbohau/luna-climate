# Luna Climate

A Home Assistant custom integration for zone-based heating control. It owns
its own schedules, so it does not depend on any scheduling still
sitting inside the devices themselves — which matters when the vendor cloud
is blocked and those schedules can no longer be edited.

Everything it adds is prefixed `luna` so it is easy to spot among the stock
integrations: domain `luna_climate`, services `luna_climate.*`, entity
attributes `luna_*`, websocket commands `luna_climate/*`.

**Status:** heating is complete. The air conditioning half is deliberately
not implemented; `luna_climate.cool_for` is registered but raises.

## Installation

Requires Home Assistant 2026.2 or later.

**With HACS:** HACS → ⋮ → **Custom repositories** → add this repository's
URL with type **Integration** → install **Luna Climate** → restart Home
Assistant.

**By hand:** copy `custom_components/luna_climate` into your Home Assistant
`config` folder and restart.

Then **Settings → Devices & Services → Add Integration → Luna Climate**.
Zones are added afterwards under **Configure**. The dashboard cards load
automatically; reload the browser once after installing or updating.

## Zones

A zone is a room. It can hold three kinds of device, in any combination:

| Role | What it is | What Luna does with it |
|---|---|---|
| **Thermostat** | A `climate` entity that regulates itself (a radiator valve, a wall thermostat) | Receives the zone's target temperature and is left to do its own regulation |
| **Temperature sensor** | What measures the room — a separate sensor, or a thermostat's own reading | Feeds `current_temperature` and the linked-device control loop |
| **Linked device** | A `switch` with no control loop of its own (a towel warmer, a panel heater) | Switched on and off against the measured temperature |

A zone needs at least one thermostat or one linked device. A zone with
linked devices needs a temperature sensor, because there is otherwise
nothing to regulate against; the config flow enforces both rules.

With no temperature sensor configured, the zone falls back to the mean of
its thermostats' own readings.

### Humidity

Each zone reports a humidity as the climate entity's standard
`current_humidity`, so HA's own dialogs show it too. The source, in order:

1. The zone's **humidity sensors**, if you pick any in the zone settings.
2. Otherwise, humidity sensors on the **same devices** as the zone's
   temperature sensors and thermostats. An Aqara sensor or a Tado valve
   usually carries one, so most zones need no extra setup.
3. Otherwise, the thermostats' own `current_humidity` attribute.

Several readings are averaged. A zone with none of these simply has no
humidity, and the cards leave it out.

## Schedule

Each zone has two day schedules, stored by the integration rather than on
the devices: one for **workdays** and one for **free days** (weekends and
holidays). Which one a day runs is decided for the whole house, see
[Workdays](#workdays).

A block carries a start time only and runs until the next block begins,
wrapping past midnight. Gaps and overlaps are therefore structurally
impossible, which is the main reason for this shape. Before a day's first
block, the previous day's last block is still running, whichever schedule
that day used.

```yaml
action: luna_climate.set_schedule
target:
  entity_id: climate.luna_wohnzimmer
data:
  workday:
    - {start: "05:30", value: 21}
    - {start: "08:00", value: "off"}
    - {start: "17:00", value: 21.5}
    - {start: "22:30", value: 18}
  free:                              # optional; leave out to keep it as is
    - {start: "08:00", value: 21}
    - {start: "23:00", value: 18}
```

`value` is one of:

| Value | Thermostats | Linked devices |
|---|---|---|
| `off` | Switched off | Switched off |
| `18`–`25` | Setpoint | On below target, off above, against the measured temperature |
| `max` | Setpoint 27 °C, clamped per device | On, unconditionally |

`max` is clamped to whatever each device reports as its own `max_temp`, so a
valve that tops out at 25 °C is not asked for 27 °C.

## What decides a zone's target

Highest priority first:

1. **Boost** — a temporary target with an expiry. Setting a target ends it; a second boost restarts the timer instead of stacking
2. **Manual mode** — the zone's own setpoint, schedule ignored
3. **Away** — nobody is home and the zone follows away mode. Away only ever lowers the target: an `off` block stays off
4. **Schedule** — the block in force right now

The active source is visible on the climate entity as `luna_source`.

### Workdays

Under **Configure → Workdays**, pick a `binary_sensor` or `input_boolean`
that is on for a workday. The [Workday](https://www.home-assistant.io/integrations/workday/)
integration is the usual choice, and it knows public holidays.

Also say which day it describes:

- **The next day** (the default; Workday with `days_offset: 1`). On
  Friday evening such a sensor already says "Saturday is free", yet Friday
  itself must keep running the workday schedule until midnight. So Luna
  records what the sensor said on each day, and today's schedule is what it
  said *yesterday*. The record is stored, so a restart does not lose it.
- **The current day** (Workday with `days_offset: 0`). The schedule
  follows the sensor directly.

Without a sensor, or before the first reading has been recorded, Monday to
Friday count as workdays.

`sensor.luna_climate_day_type` shows today's type (`workday` / `free`),
with tomorrow's in `luna_tomorrow` and whether the sensor decided it in
`luna_from_entity`. Each zone's climate entity carries `luna_day_type` too.

### Away

Home/away is one household-wide state. The presence entities are picked
once under **Configure → Presence** (`person`, `device_tracker`,
`input_boolean` or `binary_sensor`), and the house is away when *all* of
them are away. `person` and `device_tracker` count as home when they read
`home`; the others when they are `on`. With no presence entities the house
is never away. An unknown or unavailable tracker does not count as away,
because otherwise a restart would cool the house down.

`binary_sensor.luna_climate_home` shows the result: on while anyone is home.

Each zone decides whether it follows away mode with the **Follows home/away**
option under **Configure → Edit zone**. It is on by default. A bathroom that should stay on
schedule regardless can turn it off. The away temperature is one value for
the house: `number.luna_climate_away_temperature`.

> Upgrading from 0.3: presence entities used to be picked per zone. They are
> merged into the global list automatically, and zones that had none are set
> not to follow away mode, so nothing changes behaviour.

> Upgrading from 0.4, which is automatic:
> - each weekday schedule is split in two: the workday schedule comes from Monday (or the first weekday with blocks), the free-day schedule from Saturday (or Sunday)
> - the per-zone away temperatures become one global value, the most common of them
> - night mode, the night temperature, the night window and the lowest-battery sensor are removed along with their entities

### Precomfort

`luna_climate.start_precomfort` suppresses away mode across every zone, so
each one resumes its current schedule block. Intended for the wider
geofence that fires before you actually arrive.

It clears as soon as any presence entity turns on, or after
`number.luna_climate_precomfort_timeout` minutes if nobody arrives — so
driving past the outer fence and not coming home does not heat the house
all evening.

### Boost

```yaml
action: luna_climate.boost
target:
  entity_id: climate.luna_bad
data:
  duration: 30        # minutes
  # temperature: 24   # optional; otherwise current target + boost offset
```

When a boost expires the zone returns to whatever applies *at that moment* —
the current schedule block, not the one that was running when the boost
started. Boosts and precomfort are held in memory: restarting Home
Assistant ends them, and each zone returns to its schedule.

## Linked devices

A linked device has no feedback of its own, so Luna runs a bang-bang
controller for it:

- **Hysteresis** (default 0.3 °C) — on below `target − h`, off above
  `target + h`, untouched in between. In a zone that also has a radiator
  valve, the valve holds the room near target and the linked device sits
  near its threshold, so a wider deadband (0.5 °C) is worth trying.
- **Minimum cycle time** (default 10 min) — a state change requested inside
  the window is deferred, not dropped, and applied once the window expires.

The minimum cycle exists to damp Luna's own control loop, so the window
starts already expired after a restart. Home Assistant stamps restored
states with the restart time, so taking their `last_changed` at face value
would freeze every linked device for a full cycle after each restart —
possibly leaving one running that should be off.

Sensor placement matters more than any of these numbers. In a bathroom
heated only by a towel warmer, a sensor mounted near the warmer will satisfy
early and leave the room cold.

## Entities per zone

| Entity | Purpose |
|---|---|
| `climate.luna_<zone>` | The zone. Setting a temperature switches it to manual and ends any boost; `off` holds it off; `heat` resumes the schedule |
| `select.luna_<zone>_mode` | Schedule or manual |
| `number.luna_<zone>_boost_offset` | Added to the current target by `boost` |
| `number.luna_<zone>_hysteresis` | Linked-device deadband |
| `number.luna_<zone>_minimum_cycle_time` | Linked-device minimum cycle |
| `sensor.luna_<zone>_scheduled_temperature` | The block value alone, with `luna_block_start` / `luna_block_end` |
| `sensor.luna_<zone>_boost_ends_at` | Timestamp, empty when idle |
| `binary_sensor.luna_<zone>_battery` | On when any battery behind the zone is low; see below |
| `button.luna_<zone>_schedule_details` | On the zone's device page: opens the detail view and schedule editor in your browser |

For the whole house:

| Entity | Purpose |
|---|---|
| `binary_sensor.luna_climate_home` | On while anyone is home |
| `number.luna_climate_away_temperature` | What zones that follow away drop to |
| `sensor.luna_climate_day_type` | `workday` or `free` today |
| `number.luna_climate_precomfort_timeout` | How long precomfort waits for someone to arrive |

### Battery reporting

A zone's batteries rarely sit on the entities you configure. With
TadoLocal, a Tado zone's climate entity belongs to a *zone* device, and the
valves and wireless sensors in that zone are separate devices connected
via it. So Luna starts at the device of every entity configured in the zone
and walks down to every device registered via it, however deep, collecting
all battery entities on the way:

- a percentage (Aqara, Homematic and similar) is low below 5 %
- a flag (`binary_sensor` with device class battery, which is what Tado
  reports) is low when it is on

`binary_sensor.luna_<zone>_battery` is on as soon as any of them is low.
Its `luna_batteries` attribute lists every battery with its device name,
reading and verdict. The cards show a green battery icon when all is well
and an orange one when anything is low. Devices that finish loading after
Luna are picked up within a minute.

Tado's flag comes from the cloud metadata sync. With the bridge blocked from
the internet it may be stale or absent, so treat the valves' own low-battery
display as the final word.

## Dashboard cards

The integration ships four cards and loads them itself, so no dashboard
resource needs adding. After updating, reload the browser once.

### Detail view and schedule editor

Tapping a zone card opens its detail view; tapping the schedule strip opens
it on the schedule. The same view opens from **Settings → Devices &
services → Luna Climate → *zone* → Schedule & details**, and from any
`more-info` action on a Luna zone (such as holding the boost badge).

- **Overview** shows current and target temperature, humidity, the active
  source, boost buttons, home/away with the away temperature and today's
  day type, every thermostat, sensor and linked device with its state, the
  batteries with an overall status, and the zone's settings. Tap any row
  to open Home Assistant's own dialog for that entity.
- **Schedule** edits the two day schedules, opening on the one that runs
  today:
  - drag a handle to move a start time (15-minute steps; arrow keys work too)
  - tap a block to set Off, a temperature from 18 to 25 °, or Max, or to type
    exact times
  - **Add block** splits the selected block, **Remove** deletes it
  - **Copy to …** replaces the other schedule with this one
  - the hatched section at the start of the day is the evening before
    carrying over midnight

  Nothing is written until **Save**, and closing with unsaved changes asks
  first.

### `custom:luna-zone-card`

```yaml
type: custom:luna-zone-card
entity: climate.luna_wohnzimmer
boost_durations: [30, 60]   # optional, up to four buttons
show_schedule: true         # optional
show_stepper: true          # optional
show_humidity: true         # optional
```

- **Dial:** runs from Off on the left to Max on the right, the same values a
  schedule block can take. The white ring is the measured temperature and
  the coloured handle is the target. The bright stretch between them is the
  gap still to heat.
- **Colour** shows why the target is what it is: orange = schedule or
  manual, blue = away, deep orange = boost, grey = off.
- **Dragging** the handle or pressing − / + previews locally and sends one
  `set_target` when you let go (or 0.9 s after the last press). That pauses
  the schedule and ends any running boost. **Resume schedule** appears in
  the caption.
- **Schedule strip:** today's blocks, a marker for now, and the next change.
  "Now" is taken in Home Assistant's time zone, not the phone's.
- **Boost buttons** change to a progress bar with a live countdown; tap it to
  cancel.
- **Layout:** full width in the sections view, min half width. The dial stops
  growing at 380 px so the card stays compact in wide columns.

### `custom:luna-zone-compact-card`

The zone without the dial: mode, temperature and humidity as three tiles,
over the same schedule strip. Made for overview dashboards.

```yaml
type: custom:luna-zone-compact-card
entity: climate.luna_wohnzimmer
show_humidity: true   # optional
```

The temperature tile also shows where the zone is heading (`19.8° → 21.5°`);
at half width that target and the mode icon drop out to keep the tiles
readable. The humidity tile only appears when the zone has a humidity
reading. Tapping the header opens the zone's details.

### `custom:luna-boost-badge`

```yaml
type: custom:luna-boost-badge
entity: climate.luna_bad
duration: 30          # optional
show_humidity: true   # optional, shows "19.8° · 52%" while idle
hold_action:          # optional, default: opens the detail view
  action: more-info
```

Tap boosts, tap again cancels. A ring around the icon counts the boost down,
and an orange dot means a low battery somewhere in the zone.

### `custom:luna-badge-card`

The same pill, for any entity. Every text-like field takes a plain value or a
Jinja template, rendered live by Home Assistant:

```yaml
type: custom:luna-badge-card
entity: sensor.washing_machine
name: Washer                                               # small line
content: "{{ states('sensor.washer_remaining') }} min left" # bold line
icon: mdi:washing-machine
color: "{{ 'blue' if is_state('sensor.washing_machine', 'running') else 'grey' }}"
progress: "{{ states('sensor.washer_progress') }}"           # 0-100, ring
indicator: "{{ is_state('binary_sensor.washer_door', 'on') }}" # dot when truthy
indicator_color: amber
tap_action: { action: more-info }                           # standard actions
hold_action: { action: none }
double_tap_action: { action: none }
```

`color` takes Home Assistant's colour names (`orange`, `blue`, `teal`, …),
which follow your theme, or any CSS colour. Without `name` / `content`, the
card shows the entity's name and its formatted state.

All three cards have a visual editor, follow the active theme (light and
dark), and speak English and German. Colours can be overridden per theme
with `--luna-heat-color`, `--luna-boost-color`, `--luna-away-color`,
`--luna-off-color` and `--luna-max-color`.

### Building the cards

The compiled bundle is committed, so this is only needed when you change the
TypeScript in `frontend/src`:

```sh
cd frontend
npm install
npm run build      # typecheck, then bundle into custom_components/luna_climate/frontend/
```

## Services

| Service | What it does |
|---|---|
| `luna_climate.boost` | Raise a zone's target for a set time |
| `luna_climate.cancel_boost` | End a boost early |
| `luna_climate.start_precomfort` | Suppress away mode everywhere |
| `luna_climate.clear_precomfort` | End the precomfort period now |
| `luna_climate.set_target` | Hold a zone at `off`, `max` or a temperature; ends any boost |
| `luna_climate.resume_schedule` | Hand a zone back to its schedule |
| `luna_climate.set_schedule` | Replace a zone's workday and/or free-day schedule |
| `luna_climate.get_schedule` | Return a zone's two schedules (response service) |
| `luna_climate.cool_for` | Reserved for AC; not implemented |

## Websocket API

Used by the cards, and available to anything else:

- `luna_climate/zones` — every zone with state, schedule, settings and device lists
- `luna_climate/schedule/get` — `{zone_id}` → `{schedules: {workday, free}, day_types: {yesterday, today, tomorrow, from_entity}}`
- `luna_climate/schedule/set` — `{zone_id, schedules: {workday?, free?}}`, same result
- `luna_climate/subscribe_ui` — events asking this user's browser to open a
  zone's detail view (sent by the device-page button)

All logic lives in Python and every part of it is exposed as an entity, so a
card broken by a Home Assistant frontend update is a cosmetic problem rather
than a cold house.

## Design notes

- **Re-evaluation** runs every minute, plus on any change to a watched
  sensor, presence entity or linked device. A request arriving while an
  apply is in flight sets a dirty flag and the loop runs again, so a
  threshold crossed mid-apply is not missed until the next tick.
- **Structure vs. runtime state.** The config entry holds only which entity
  plays which role. Everything tunable is runtime state in a versioned
  store, so temperatures can be changed without reconfiguring anything and
  the block format can be migrated later.
- **A bad zone cannot stop the others.** Failures are caught per zone, and
  an unparseable schedule logs and yields no blocks rather than raising.

## Development

```sh
pip install -r requirements_test.txt
pytest                                   # 47 tests, inside a real Home Assistant
python -m script.hassfest --integration-path custom_components/luna_climate   # from a home-assistant/core checkout
```

The integration tests run Luna inside Home Assistant's own test framework
against a real `generic_thermostat` (standing in for a radiator valve with a
25 °C ceiling) and a real `input_boolean` towel warmer, and move the clock
through a whole day: block changes, drift correction, away, precomfort and
its timeout, boost expiry, manual control, the minimum cycle and the
deadband, a reload, zone removal, the websocket API and the card bundle.

GitHub Actions run hassfest, the HACS validation, the tests, and check that
the committed card bundle matches a fresh build.

## Releasing

1. Bump `version` in `custom_components/luna_climate/manifest.json` (it also
   busts the browser cache for the cards). If the cards changed, bump
   `frontend/package.json` and `VERSION` in `frontend/src/index.ts` too, then
   `npm run build` in `frontend/`.
2. Commit, tag `vX.Y.Z`, push the tag.
3. Create a GitHub release from the tag. HACS offers releases as updates.
