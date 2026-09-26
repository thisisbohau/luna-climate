/**
 * Client-side view of a zone's schedule for today.
 *
 * Mirrors the integration's model: blocks store a start time only and run
 * until the next block begins, wrapping past midnight. "Now" is taken in
 * Home Assistant's time zone rather than the browser's, so a phone set to
 * another zone still shows the house's day.
 */

import type { DayType, ScheduleData, TargetValue } from "./types";

export interface ZonedNow {
  /** Python convention: Monday = 0 ... Sunday = 6. */
  weekday: number;
  /** Minutes since local midnight. */
  minutes: number;
}

const WEEKDAYS: Record<string, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

export function zonedNow(timeZone: string, date = new Date()): ZonedNow {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
    return {
      weekday: WEEKDAYS[get("weekday")] ?? 0,
      minutes: Number(get("hour")) * 60 + Number(get("minute")),
    };
  } catch {
    return {
      weekday: (date.getDay() + 6) % 7,
      minutes: date.getHours() * 60 + date.getMinutes(),
    };
  }
}

function toMinutes(start: string): number {
  const [h, m] = start.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function blocksOf(data: ScheduleData, kind: DayType) {
  return (data.schedules[kind] ?? [])
    .map((b) => ({ start: toMinutes(b.start), value: b.value }))
    .sort((a, b) => a.start - b.start);
}

export interface Segment {
  start: number;
  end: number;
  value: TargetValue;
  current: boolean;
}

export interface DayView {
  segments: Segment[];
  current?: TargetValue;
  /** Next change: minutes from today's midnight (may exceed 1440). */
  nextAt?: number;
  nextValue?: TargetValue;
  /** Days until the next change: 0 = today, 1 = tomorrow, ... */
  nextDayOffset?: number;
  /** Which schedule today runs. */
  dayType?: DayType;
}

/**
 * Today's blocks as drawable segments, plus what is next.
 *
 * Today's blocks come from today's day type. Before the first one, the
 * last block of yesterday's schedule is still running; the next change
 * after today's last block is tomorrow's first block. Beyond tomorrow the
 * day types are not known, so today's type stands in.
 */
export function dayView(data: ScheduleData | undefined, now: ZonedNow): DayView {
  if (!data) return { segments: [] };
  const types = data.day_types;
  const today = blocksOf(data, types.today);
  const view: DayView = { segments: [], dayType: types.today };

  let carry: TargetValue | undefined;
  for (const kind of [types.yesterday, types.today, types.tomorrow]) {
    const blocks = blocksOf(data, kind);
    if (blocks.length) {
      carry = blocks[blocks.length - 1].value;
      break;
    }
  }
  if (carry === undefined) return view;

  const starts = [...today];
  if (!starts.length || starts[0].start > 0) starts.unshift({ start: 0, value: carry });

  view.segments = starts.map((b, i) => {
    const end = i + 1 < starts.length ? starts[i + 1].start : 1440;
    return { start: b.start, end, value: b.value, current: now.minutes >= b.start && now.minutes < end };
  });
  view.current = view.segments.find((s) => s.current)?.value;

  const laterToday = today.find((b) => b.start > now.minutes);
  if (laterToday) {
    view.nextAt = laterToday.start;
    view.nextValue = laterToday.value;
    view.nextDayOffset = 0;
    return view;
  }
  for (let ahead = 1; ahead <= 7; ahead++) {
    const day = blocksOf(data, ahead === 1 ? types.tomorrow : types.today);
    if (day.length) {
      view.nextAt = ahead * 1440 + day[0].start;
      view.nextValue = day[0].value;
      view.nextDayOffset = ahead;
      break;
    }
  }
  return view;
}

export function formatClock(minutes: number): string {
  const m = ((minutes % 1440) + 1440) % 1440;
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return `${hh < 10 ? "0" : ""}${hh}:${mm < 10 ? "0" : ""}${mm}`;
}
