"""Schedule model and evaluation for Luna Climate.

Deliberately free of any Home Assistant import so the block maths can be
exercised standalone.

A schedule is a flat list of blocks::

    {"weekdays": [0, 1, 2, 3, 4], "start": "06:00", "value": 21.0}

``weekdays`` uses Python's convention, Monday = 0 through Sunday = 6.

Blocks store a start time only. A block runs until the next block starts,
wrapping past midnight into the following day. That makes gaps and overlaps
structurally impossible, which is the main reason for choosing this shape
over storing explicit end times.

``value`` is one of:

* ``"off"``  -- heating off
* ``"max"``  -- unconditional maximum; linked devices run without regard to
  the measured temperature
* a float between ``MIN_BLOCK_TEMP`` and ``MAX_BLOCK_TEMP`` -- a regulated
  target temperature
"""

from __future__ import annotations

import datetime as dt
from collections.abc import Iterable
from dataclasses import dataclass
from typing import Any

from .const import MAX_BLOCK_TEMP, MIN_BLOCK_TEMP, VALUE_MAX, VALUE_OFF


class ScheduleError(ValueError):
    """Raised when a schedule payload cannot be parsed."""


BlockValue = str | float


@dataclass(frozen=True, slots=True)
class ScheduleBlock:
    """A single time block within a weekly schedule."""

    weekdays: tuple[int, ...]
    start: dt.time
    value: BlockValue

    def as_dict(self) -> dict[str, Any]:
        """Serialise back to the stored representation."""
        return {
            "weekdays": list(self.weekdays),
            "start": self.start.strftime("%H:%M"),
            "value": self.value,
        }


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


def _parse_weekdays(raw: Any) -> tuple[int, ...]:
    if raw is None:
        return (0, 1, 2, 3, 4, 5, 6)
    if not isinstance(raw, Iterable) or isinstance(raw, (str, bytes)):
        raise ScheduleError(f"Invalid weekdays: {raw!r}")
    days: set[int] = set()
    for item in raw:
        try:
            day = int(item)
        except (TypeError, ValueError) as err:
            raise ScheduleError(f"Invalid weekday: {item!r}") from err
        if not 0 <= day <= 6:
            raise ScheduleError(f"Weekday out of range: {day}")
        days.add(day)
    if not days:
        raise ScheduleError("A block needs at least one weekday")
    return tuple(sorted(days))


def parse_block(raw: Any) -> ScheduleBlock:
    """Parse one stored block."""
    if not isinstance(raw, dict):
        raise ScheduleError(f"Block must be a mapping, got {type(raw).__name__}")
    return ScheduleBlock(
        weekdays=_parse_weekdays(raw.get("weekdays")),
        start=_parse_time(raw.get("start")),
        value=_parse_value(raw.get("value")),
    )


def parse_schedule(raw: Any) -> list[ScheduleBlock]:
    """Parse and normalise a whole schedule.

    Blocks are returned sorted by start time. Two blocks that start at the
    same time on the same weekday are rejected -- the result would depend on
    list order, which is exactly the kind of thing that is impossible to
    debug six months later.
    """
    if raw is None:
        return []
    if not isinstance(raw, list):
        raise ScheduleError("Schedule must be a list of blocks")

    blocks = [parse_block(item) for item in raw]
    blocks.sort(key=lambda b: (b.start.hour, b.start.minute, b.weekdays))

    seen: set[tuple[int, int, int]] = set()
    for block in blocks:
        for day in block.weekdays:
            key = (day, block.start.hour, block.start.minute)
            if key in seen:
                raise ScheduleError(
                    f"Two blocks start at {block.start.strftime('%H:%M')} "
                    f"on weekday {day}"
                )
            seen.add(key)
    return blocks


def schedule_as_list(blocks: list[ScheduleBlock]) -> list[dict[str, Any]]:
    """Serialise a schedule for storage or for the frontend."""
    return [block.as_dict() for block in blocks]


@dataclass(frozen=True, slots=True)
class ActiveBlock:
    """The block in force at a given moment, with its boundaries."""

    value: BlockValue
    start: dt.datetime
    end: dt.datetime | None


def _starts_on(block: ScheduleBlock, day: dt.date) -> bool:
    return day.weekday() in block.weekdays


def active_block(
    blocks: list[ScheduleBlock], now: dt.datetime
) -> ActiveBlock | None:
    """Return the block in force at ``now``.

    Walks backwards day by day until a block start at or before ``now`` is
    found. Seven days back is enough to cover any schedule; if nothing turns
    up the schedule is empty and ``None`` is returned.
    """
    if not blocks:
        return None

    start_dt: dt.datetime | None = None
    value: BlockValue | None = None

    for delta in range(0, 8):
        day = (now - dt.timedelta(days=delta)).date()
        candidates = [
            block
            for block in blocks
            if _starts_on(block, day)
            and dt.datetime.combine(day, block.start, tzinfo=now.tzinfo) <= now
        ]
        if candidates:
            chosen = max(candidates, key=lambda b: b.start)
            start_dt = dt.datetime.combine(day, chosen.start, tzinfo=now.tzinfo)
            value = chosen.value
            break

    if start_dt is None or value is None:
        return None

    return ActiveBlock(value=value, start=start_dt, end=next_change(blocks, now))


def next_change(
    blocks: list[ScheduleBlock], now: dt.datetime
) -> dt.datetime | None:
    """Return when the schedule next changes value, or ``None``."""
    if not blocks:
        return None
    for delta in range(0, 8):
        day = (now + dt.timedelta(days=delta)).date()
        candidates = [
            dt.datetime.combine(day, block.start, tzinfo=now.tzinfo)
            for block in blocks
            if _starts_on(block, day)
        ]
        future = [moment for moment in candidates if moment > now]
        if future:
            return min(future)
    return None
