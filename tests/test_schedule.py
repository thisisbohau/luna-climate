"""Schedule parsing and block evaluation, without Home Assistant running."""

from __future__ import annotations

import datetime as dt

import pytest

from custom_components.luna_climate.schedule import (
    DAY_FREE,
    DAY_WORKDAY,
    ScheduleError,
    active_block,
    from_weekly,
    parse_day,
    parse_schedules,
    schedules_as_dict,
)

TZ = dt.timezone(dt.timedelta(hours=2))

SCHEDULES = parse_schedules(
    {
        DAY_WORKDAY: [
            {"start": "06:00", "value": 21},
            {"start": "08:30", "value": "off"},
            {"start": "17:00", "value": 21.5},
            {"start": "22:30", "value": 18},
        ],
        DAY_FREE: [
            {"start": "08:00", "value": "max"},
            {"start": "23:00", "value": 18},
        ],
    }
)


def weekdays(day: dt.date) -> str:
    """Monday to Friday are workdays."""
    return DAY_WORKDAY if day.weekday() < 5 else DAY_FREE


def at(day: int, hour: int, minute: int = 0) -> dt.datetime:
    """A moment in the week of Monday 2026-09-21, local time."""
    return dt.datetime(2026, 9, 21 + day, hour, minute, tzinfo=TZ)


@pytest.mark.parametrize(
    ("moment", "expected", "day_type"),
    [
        (at(0, 7), 21.0, DAY_WORKDAY),
        (at(0, 9), "off", DAY_WORKDAY),
        (at(0, 18), 21.5, DAY_WORKDAY),
        (at(0, 23), 18.0, DAY_WORKDAY),
        # Monday before its first block: Sunday's (free day) last block.
        (at(0, 3), 18.0, DAY_FREE),
        (at(5, 12), "max", DAY_FREE),
        # Saturday before 08:00: Friday's (workday) last block carries over.
        (at(5, 7), 18.0, DAY_WORKDAY),
        (at(0, 6, 0), 21.0, DAY_WORKDAY),  # a block applies from its first minute
        (at(0, 5, 59), 18.0, DAY_FREE),
    ],
)
def test_active_block(moment: dt.datetime, expected, day_type: str) -> None:
    """The block in force at a given moment, including midnight carry-over."""
    block = active_block(SCHEDULES, weekdays, moment)
    assert block is not None
    assert block.value == expected
    assert block.day_type == day_type


def test_day_type_decides_the_schedule() -> None:
    """A holiday Monday runs the free-day schedule."""
    holiday = at(0, 0).date()

    def with_holiday(day: dt.date) -> str:
        return DAY_FREE if day == holiday else weekdays(day)

    block = active_block(SCHEDULES, with_holiday, at(0, 7))
    assert block is not None
    assert block.value == 18.0  # still Sunday's 23:00 block
    assert block.end == at(0, 8)
    assert active_block(SCHEDULES, with_holiday, at(0, 9)).value == "max"


def test_next_change_crosses_into_the_next_day_type() -> None:
    """Friday night ends at Saturday's first block, from the free schedule."""
    block = active_block(SCHEDULES, weekdays, at(4, 23))
    assert block is not None
    assert block.end == at(5, 8)
    morning = active_block(SCHEDULES, weekdays, at(0, 7))
    assert morning is not None
    assert morning.end == at(0, 8, 30)


def test_empty_schedule() -> None:
    """No blocks means nothing is in force."""
    assert active_block(parse_schedules({}), weekdays, at(0, 12)) is None


def test_one_empty_day_type_inherits() -> None:
    """With no free-day blocks, the weekend keeps Friday's last block."""
    only_work = parse_schedules({DAY_WORKDAY: [{"start": "06:00", "value": 21}]})
    block = active_block(only_work, weekdays, at(6, 15))
    assert block is not None
    assert block.value == 21.0
    assert block.start == at(4, 6)


@pytest.mark.parametrize(
    "raw",
    [
        {DAY_WORKDAY: [{"start": "06:00", "value": 30}]},
        {DAY_WORKDAY: [{"start": "25:00", "value": 20}]},
        {DAY_FREE: [{"start": "06:00", "value": 20}, {"start": "06:00", "value": 21}]},
        {DAY_WORKDAY: [{"start": "06:00", "value": True}]},
        {"monday": [{"start": "06:00", "value": 20}]},
        {DAY_WORKDAY: "not a list"},
        "not a mapping",
    ],
)
def test_invalid_schedules_are_rejected(raw) -> None:
    """Bad input fails loudly instead of producing a surprising schedule."""
    with pytest.raises(ScheduleError):
        parse_schedules(raw)


def test_round_trip() -> None:
    """Serialising and parsing again yields the same schedules."""
    stored = schedules_as_dict(SCHEDULES)
    assert schedules_as_dict(parse_schedules(stored)) == stored


def test_half_degree_rounding() -> None:
    """Temperatures are kept to half degrees."""
    assert parse_day([{"start": "06:00", "value": "21.3"}])[0].value == 21.5


def test_from_weekly() -> None:
    """The old weekday format splits into a workday and a free-day schedule."""
    old = [
        {"weekdays": [0, 1, 2, 3, 4], "start": "06:00", "value": 21},
        {"weekdays": [0, 1, 2, 3, 4, 5, 6], "start": "22:30", "value": 18},
        {"weekdays": [5, 6], "start": "08:00", "value": "max"},
    ]
    assert from_weekly(old) == {
        DAY_WORKDAY: [
            {"start": "06:00", "value": 21.0},
            {"start": "22:30", "value": 18.0},
        ],
        DAY_FREE: [
            {"start": "08:00", "value": "max"},
            {"start": "22:30", "value": 18.0},
        ],
    }
    assert from_weekly([]) == {DAY_WORKDAY: [], DAY_FREE: []}
    # Only a Sunday block: the free schedule falls back to Sunday.
    assert from_weekly([{"weekdays": [6], "start": "09:00", "value": 20}])[DAY_FREE] == [
        {"start": "09:00", "value": 20.0}
    ]


def test_daylight_saving_changes() -> None:
    """Blocks keep their wall-clock times across both clock changes."""
    from zoneinfo import ZoneInfo

    vienna = ZoneInfo("Europe/Vienna")
    day = [{"start": "02:30", "value": 18}, {"start": "06:00", "value": 21}]
    schedules = parse_schedules({DAY_WORKDAY: day, DAY_FREE: day})
    # Autumn: 25 Oct 2026, 03:00 CEST becomes 02:00 CET.
    autumn = active_block(schedules, weekdays, dt.datetime(2026, 10, 25, 7, 0, tzinfo=vienna))
    assert autumn is not None
    assert autumn.value == 21.0
    assert autumn.start == dt.datetime(2026, 10, 25, 6, 0, tzinfo=vienna)
    assert autumn.end == dt.datetime(2026, 10, 26, 2, 30, tzinfo=vienna)

    # Spring: 29 Mar 2026, 02:00 CET jumps to 03:00 CEST, so 02:30 never
    # happens on the wall clock. The block must still take effect that
    # night rather than being skipped or raising.
    before = active_block(schedules, weekdays, dt.datetime(2026, 3, 29, 1, 59, tzinfo=vienna))
    after = active_block(schedules, weekdays, dt.datetime(2026, 3, 29, 4, 0, tzinfo=vienna))
    assert before is not None and before.value == 21.0
    assert after is not None and after.value == 18.0
