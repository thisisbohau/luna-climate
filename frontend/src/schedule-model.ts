/**
 * Editing model for a weekly schedule.
 *
 * Storage is a flat list of blocks, each with a set of weekdays. Editing
 * is per day, so the editor works on seven sorted lists of
 * `{ start, value }` and converts back on save: blocks with the same start
 * and value on several days become one stored block with those weekdays.
 * Within a day starts are unique by construction, which is exactly the
 * rule the integration enforces.
 */

import type { ScheduleBlock } from "./types";

export type BlockValue = ScheduleBlock["value"];

export interface DayBlock {
  /** Minutes since midnight. */
  start: number;
  value: BlockValue;
}

export type Week = DayBlock[][];

export const STEP = 15;
export const DAY = 1440;
export const MIN_TEMP = 18;
export const MAX_TEMP = 25;

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function toClock(minutes: number): string {
  const m = Math.max(0, Math.min(DAY, Math.round(minutes)));
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function snap(minutes: number, step = STEP): number {
  return Math.round(minutes / step) * step;
}

export function toWeek(schedule: ScheduleBlock[] | undefined): Week {
  const week: Week = [[], [], [], [], [], [], []];
  for (const block of schedule ?? []) {
    const start = toMinutes(block.start);
    for (const day of block.weekdays) {
      if (day < 0 || day > 6) continue;
      if (!week[day].some((b) => b.start === start)) {
        week[day].push({ start, value: block.value });
      }
    }
  }
  for (const day of week) day.sort((a, b) => a.start - b.start);
  return week;
}

function sameValue(a: BlockValue, b: BlockValue): boolean {
  return typeof a === "number" && typeof b === "number" ? Math.abs(a - b) < 1e-9 : a === b;
}

export function fromWeek(week: Week): ScheduleBlock[] {
  const groups: Array<{ start: number; value: BlockValue; days: number[] }> = [];
  week.forEach((blocks, day) => {
    for (const b of blocks) {
      const group = groups.find((g) => g.start === b.start && sameValue(g.value, b.value));
      if (group) group.days.push(day);
      else groups.push({ start: b.start, value: b.value, days: [day] });
    }
  });
  groups.sort((a, b) => a.start - b.start || a.days[0] - b.days[0]);
  return groups.map((g) => ({ weekdays: g.days.sort((a, b) => a - b), start: toClock(g.start), value: g.value }));
}

export function cloneWeek(week: Week): Week {
  return week.map((day) => day.map((b) => ({ ...b })));
}

export function weeksEqual(a: Week, b: Week): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * What runs at 00:00 on `day` before its first block: the last block of the
 * most recent earlier day that has any (a week back at most, which may be
 * the same weekday a week ago).
 */
export function carryIn(week: Week, day: number): BlockValue | undefined {
  for (let back = 1; back <= 7; back++) {
    const blocks = week[(day - back + 7) % 7];
    if (blocks.length) return blocks[blocks.length - 1].value;
  }
  return undefined;
}

/** End of block `index` on a day: the next start, or midnight. */
export function blockEnd(blocks: DayBlock[], index: number): number {
  return index + 1 < blocks.length ? blocks[index + 1].start : DAY;
}

/** The range a block's start may move within without passing a neighbour. */
export function startBounds(blocks: DayBlock[], index: number): [number, number] {
  const lo = index > 0 ? blocks[index - 1].start + STEP : 0;
  const hi = index + 1 < blocks.length ? blocks[index + 1].start - STEP : DAY - STEP;
  return [lo, hi];
}

export function moveStart(blocks: DayBlock[], index: number, minutes: number): DayBlock[] {
  const [lo, hi] = startBounds(blocks, index);
  const next = blocks.map((b) => ({ ...b }));
  next[index].start = Math.max(lo, Math.min(hi, snap(minutes)));
  return next;
}

/**
 * Split block `index` in the middle. Returns the new list and the index of
 * the new block, or `undefined` when the block is too short to split.
 */
export function splitBlock(blocks: DayBlock[], index: number): { blocks: DayBlock[]; index: number } | undefined {
  const start = blocks[index].start;
  const end = blockEnd(blocks, index);
  const mid = snap((start + end) / 2);
  if (mid - start < STEP || end - mid < STEP) return undefined;
  const next = blocks.map((b) => ({ ...b }));
  next.splice(index + 1, 0, { start: mid, value: blocks[index].value });
  return { blocks: next, index: index + 1 };
}

/** Insert a block at a given time, splitting whatever runs there. */
export function insertAt(
  blocks: DayBlock[],
  minutes: number,
  value: BlockValue,
): { blocks: DayBlock[]; index: number } | undefined {
  const start = Math.max(0, Math.min(DAY - STEP, snap(minutes)));
  if (blocks.some((b) => Math.abs(b.start - start) < STEP)) return undefined;
  const next = [...blocks.map((b) => ({ ...b })), { start, value }].sort((a, b) => a.start - b.start);
  return { blocks: next, index: next.findIndex((b) => b.start === start) };
}

export function removeBlock(blocks: DayBlock[], index: number): DayBlock[] {
  return blocks.filter((_, i) => i !== index);
}

export function clampTemp(value: number): number {
  return Math.min(MAX_TEMP, Math.max(MIN_TEMP, Math.round(value * 2) / 2));
}
