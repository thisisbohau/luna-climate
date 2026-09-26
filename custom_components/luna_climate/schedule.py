"""Schedule model and evaluation for Luna Climate.

Deliberately free of any Home Assistant import so the block maths can be
exercised standalone.

Each zone has two day schedules, one for workdays and one for free days
(weekends and holidays)::

    {
        "workday": [{"start": "05:30", "value": 21.0}, ...],
        "free":    [{"start": "07:30", "value": 21.0}, ...],
    }

Which of the two a date runs is decided elsewhere (the workday sensor, see
``engine.py``); this module only needs a function that answers it.

Blocks store a start time only. A block runs until the next block starts,
wrapping past midnight into the following day -- so what runs between
midnight and a day's first block is the previous day's last block, whatever
type that day was. That makes gaps and overlaps structurally impossible,
which is the main reason for choosing this shape over explicit end times.

``value`` is one of:

* ``"off"``  -- heating off
* ``"max"``  -- unconditional maximum; linked devices run without regard to
  the measured temperature
* a float between ``MIN_BLOCK_TEMP`` and ``MAX_BLOCK_TEMP`` -- a regulated
  target temperature
"""

from __future__ import annotations

import datetime as dt
from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from .const import MAX_BLOCK_TEMP, MIN_BLOCK_TEMP, VALUE_MAX, VALUE_OFF

DAY_WORKDAY = "workday"
DAY_FREE = "free"
DAY_TYPES = (DAY_WORKDAY, DAY_FREE)

#: How far back the evaluation looks for the block that is still running.
#: A day with no blocks at all inherits from the day before, and so on.
LOOKBACK_DAYS = 7


class ScheduleError(ValueError):
    """Raised when a schedule payload cannot be parsed."""


BlockValue = str | float


@dataclass(frozen=True, slots=True)
class ScheduleBlock:
    """A single block within a day schedule."""

    start: dt.time
    value: BlockValue

    def as_dict(self) -> dict[str, Any]:
        """Serialise back to the stored representation."""
        return {"start": self.start.strftime("%H:%M"), "value": self.value}


Schedules = dict[str, list[ScheduleBlock]]
DayTypeFn = Callable[[dt.date], str]


def _parse_time(raw: Any) -> dt.time:
    if isinstance(raw, dt.time):
        return raw.replace(second=0, microsecond=0)
    if not isinstance(raw, str):
        raise ScheduleError(f"Invalid start time: {raw!r}")
    parts = raw.split(":")
    if len(parts) < 2:
        raise ScheduleError(f"Invalid start time: {raw!r}")
    try:
        hour = int(parts[0])
        minute = int(parts[1])
    except ValueError as err:
        raise ScheduleError(f"Invalid start time: {raw!r}") from err
    if not 0 <= hour <= 23 or not 0 <= minute <= 59:
        raise ScheduleError(f"Start time out of range: {raw!r}")
    return dt.time(hour=hour, minute=minute)


def _parse_value(raw: Any) -> BlockValue:
    if isinstance(raw, str):
        lowered = raw.strip().lower()
        if lowered in (VALUE_OFF, VALUE_MAX):
            return lowered
        try:
            raw = float(lowered)
        except ValueError as err:
            raise ScheduleError(f"Invalid block value: {raw!r}") from err
    if isinstance(raw, bool):
        raise ScheduleError(f"Invalid block value: {raw!r}")
    if isinstance(raw, (int, float)):
        value = round(float(raw) * 2) / 2
        if not MIN_BLOCK_TEMP <= value <= MAX_BLOCK_TEMP:
            raise ScheduleError(
                f"Block temperature {value} outside "
                f"{MIN_BLOCK_TEMP}-{MAX_BLOCK_TEMP}; use "
                f"'{VALUE_OFF}' or '{VALUE_MAX}' instead"
            )
        return value
    raise ScheduleError(f"Invalid block value: {raw!r}")


def parse_block(raw: Any) -> ScheduleBlock:
    """Parse one stored block."""
    if not isinstance(raw, dict):
        raise ScheduleError(f"Block must be a mapping, got {type(raw).__name__}")
    return ScheduleBlock(
        start=_parse_time(raw.get("start")), value=_parse_value(raw.get("value"))
    )


def parse_day(raw: Any) -> list[ScheduleBlock]:
    """Parse one day schedule, sorted by start time.

    Two blocks starting at the same minute are rejected -- the result would
    depend on list order, which is impossible to debug six months later.
    """
    if raw is None:
        return []
    if not isinstance(raw, list):
        raise ScheduleError("A day schedule must be a list of blocks")
    blocks = sorted((parse_block(item) for item in raw), key=lambda b: b.start)
    for earlier, later in zip(blocks, blocks[1:], strict=False):
        if earlier.start == later.start:
            raise ScheduleError(
                f"Two blocks start at {later.start.strftime('%H:%M')}"
            )
    return blocks


def parse_schedules(raw: Any) -> Schedules:
    """Parse both day schedules. Missing types are empty."""
    if raw is None:
        raw = {}
    if not isinstance(raw, dict):
        raise ScheduleError("Schedules must map day types to block lists")
    unknown = set(raw) - set(DAY_TYPES)
    if unknown:
        raise ScheduleError(
            f"Unknown day type(s): {', '.join(sorted(unknown))}; "
            f"expected {', '.join(DAY_TYPES)}"
        )
    parsed: Schedules = {}
    for day_type in DAY_TYPES:
        try:
            parsed[day_type] = parse_day(raw.get(day_type))
        except ScheduleError as err:
            raise ScheduleError(f"{day_type}: {err}") from err
    return parsed


def schedules_as_dict(schedules: Schedules) -> dict[str, list[dict[str, Any]]]:
    """Serialise both day schedules for storage or for the frontend."""
    return {
        day_type: [block.as_dict() for block in schedules.get(day_type, [])]
        for day_type in DAY_TYPES
    }


def from_weekly(raw: Any) -> dict[str, list[dict[str, Any]]]:
    """Convert the old weekday-based format into the two day schedules.

    Before 0.5 a block carried a list of weekdays. The workday schedule is
    taken from the first weekday (Monday first) that has blocks, the free
    schedule from Saturday or else Sunday. Anything unreadable is dropped
    rather than blocking startup.
    """
    by_day: dict[int, list[dict[str, Any]]] = {day: [] for day in range(7)}
    for item in raw or []:
        if not isinstance(item, dict):
            continue
        weekdays = item.get("weekdays")
        days = range(7) if weekdays is None else weekdays
        for day in days:
            if isinstance(day, int) and 0 <= day <= 6:
                by_day[day].append({"start": item.get("start"), "value": item.get("value")})

    def _first(days: tuple[int, ...]) -> list[dict[str, Any]]:
        for day in days:
            if by_day[day]:
                try:
                    return [b.as_dict() for b in parse_day(by_day[day])]
                except ScheduleError:
                    continue
        return []

    return {DAY_WORKDAY: _first((0, 1, 2, 3, 4)), DAY_FREE: _first((5, 6))}


@dataclass(frozen=True, slots=True)
class ActiveBlock:
    """The block in force at a given moment, with its boundaries."""

    value: BlockValue
    start: dt.datetime
    end: dt.datetime | None
    #: The day type the block belongs to.
    day_type: str


def _at(day: dt.date, time: dt.time, tzinfo: dt.tzinfo | None) -> dt.datetime:
    return dt.datetime.combine(day, time, tzinfo=tzinfo)


def active_block(
    schedules: Schedules, day_type: DayTypeFn, now: dt.datetime
) -> ActiveBlock | None:
    """Return the block in force at ``now``.

    Looks at today's schedule first; before today's first block, the last
    block of the most recent earlier day that has any is still running.
    """
    for delta in range(0, LOOKBACK_DAYS + 1):
        day = (now - dt.timedelta(days=delta)).date()
        kind = day_type(day)
        started = [
            block
            for block in schedules.get(kind, [])
            if _at(day, block.start, now.tzinfo) <= now
        ]
        if started:
            chosen = started[-1]
            return ActiveBlock(
                value=chosen.value,
                start=_at(day, chosen.start, now.tzinfo),
                end=next_change(schedules, day_type, now),
                day_type=kind,
            )
    return None


def next_change(
    schedules: Schedules, day_type: DayTypeFn, now: dt.datetime
) -> dt.datetime | None:
    """Return when the next block starts, or ``None`` with no blocks at all."""
    for delta in range(0, LOOKBACK_DAYS + 1):
        day = (now + dt.timedelta(days=delta)).date()
        for block in schedules.get(day_type(day), []):
            moment = _at(day, block.start, now.tzinfo)
            if moment > now:
                return moment
    return None
