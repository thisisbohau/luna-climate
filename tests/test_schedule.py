"""Schedule parsing and block evaluation, without Home Assistant running."""

from __future__ import annotations

import datetime as dt

import pytest

from custom_components.luna_climate.schedule import (
    ScheduleError,
    active_block,
    parse_schedule,
    schedule_as_list,
)

TZ = dt.timezone(dt.timedelta(hours=2))
WEEKDAYS = [0, 1, 2, 3, 4]
WEEKEND = [5, 6]

SCHEDULE = parse_schedule(
    [
        {"weekdays": WEEKDAYS, "start": "06:00", "value": 21},
        {"weekdays": WEEKDAYS, "start": "08:30", "value": "off"},
        {"weekdays": WEEKDAYS, "start": "17:00", "value": 21.5},
        {"weekdays": WEEKDAYS, "start": "22:30", "value": 18},
        {"weekdays": WEEKEND, "start": "08:00", "value": "max"},
        {"weekdays": WEEKEND, "start": "23:00", "value": 18},
    ]
)


def at(day: int, hour: int, minute: int = 0) -> dt.datetime:
    """A moment in the week of Monday 2026-09-21, local time."""
    return dt.datetime(2026, 9, 21 + day, hour, minute, tzinfo=TZ)


@pytest.mark.parametrize(
    ("moment", "expected"),
    [
        (at(0, 7), 21.0),
        (at(0, 9), "off"),
        (at(0, 18), 21.5),
        (at(0, 23), 18.0),
        (at(0, 3), 18.0),  # Monday night wraps back to Sunday 23:00
        (at(5, 12), "max"),
        (at(6, 2), 18.0),  # Sunday night wraps back to Saturday 23:00
        (at(0, 6, 0), 21.0),  # a block applies from its first minute
        (at(0, 5, 59), 18.0),
    ],
)
def test_active_block(moment: dt.datetime, expected) -> None:
    """The block in force at a given moment, including midnight wraps."""
    block = active_block(SCHEDULE, moment)
    assert block is not None
    assert block.value == expected


def test_next_change_is_reported() -> None:
    """Each block knows when it ends."""
    block = active_block(SCHEDULE, at(0, 7))
    assert block is not None
    assert block.end == at(0, 8, 30)
    friday_night = active_block(SCHEDULE, at(4, 23))
    assert friday_night is not None
    assert friday_night.end == at(5, 8)


def test_empty_schedule() -> None:
    """No blocks means nothing is in force."""
    assert active_block([], at(0, 12)) is None


@pytest.mark.parametrize(
    "raw",
    [
        [{"weekdays": [0], "start": "06:00", "value": 30}],
        [{"weekdays": [0], "start": "25:00", "value": 20}],
        [
            {"weekdays": [0], "start": "06:00", "value": 20},
            {"weekdays": [0], "start": "06:00", "value": 21},
        ],
        [{"weekdays": [], "start": "06:00", "value": 20}],
        [{"weekdays": [0], "start": "06:00", "value": True}],
        [{"weekdays": [7], "start": "06:00", "value": 20}],
        "not a list",
    ],
)
def test_invalid_schedules_are_rejected(raw) -> None:
    """Bad input fails loudly instead of producing a surprising schedule."""
    with pytest.raises(ScheduleError):
        parse_schedule(raw)


def test_round_trip() -> None:
    """Serialising and parsing again yields the same schedule."""
    stored = schedule_as_list(SCHEDULE)
    assert schedule_as_list(parse_schedule(stored)) == stored


def test_half_degree_rounding() -> None:
    """Temperatures are kept to half degrees."""
    blocks = parse_schedule([{"weekdays": [0], "start": "06:00", "value": "21.3"}])
    assert blocks[0].value == 21.5


def test_daylight_saving_changes() -> None:
    """Blocks keep their wall-clock times across both clock changes."""
    from zoneinfo import ZoneInfo

    vienna = ZoneInfo("Europe/Vienna")
    blocks = parse_schedule(
        [
            {"weekdays": [0, 1, 2, 3, 4, 5, 6], "start": "02:30", "value": 18},
            {"weekdays": [0, 1, 2, 3, 4, 5, 6], "start": "06:00", "value": 21},
        ]
    )
    # Autumn: 25 Oct 2026, 03:00 CEST becomes 02:00 CET.
    autumn = active_block(blocks, dt.datetime(2026, 10, 25, 7, 0, tzinfo=vienna))
    assert autumn is not None
    assert autumn.value == 21.0
    assert autumn.start == dt.datetime(2026, 10, 25, 6, 0, tzinfo=vienna)
    assert autumn.end == dt.datetime(2026, 10, 26, 2, 30, tzinfo=vienna)

    # Spring: 29 Mar 2026, 02:00 CET jumps to 03:00 CEST, so 02:30 never
    # happens on the wall clock. The block must still take effect that
    # night rather than being skipped or raising.
    before = active_block(blocks, dt.datetime(2026, 3, 29, 1, 59, tzinfo=vienna))
    after = active_block(blocks, dt.datetime(2026, 3, 29, 4, 0, tzinfo=vienna))
    assert before is not None and before.value == 21.0
    assert after is not None and after.value == 18.0
