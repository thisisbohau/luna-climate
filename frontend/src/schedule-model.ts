/**
 * Editing model for a zone's two day schedules (workday and free day).
 *
 * Storage keeps "HH:MM" start times; the editor works on sorted lists of
 * `{ start (minutes), value }` per day type and converts back on save.
 * Within a day starts are unique by construction, which is exactly the
 * rule the integration enforces.
 */

import type { DayType, ScheduleBlock, Schedules } from "./types";

export type BlockValue = ScheduleBlock["value"];

export interface DayBlock {
  /** Minutes since midnight. */
  start: number;
  value: BlockValue;
}

export type Plan = Record<DayType, DayBlock[]>;

export const DAY_TYPES: DayType[] = ["workday", "free"];

export function otherType(kind: DayType): DayType {
  return kind === "workday" ? "free" : "workday";
}

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

function toDay(blocks: ScheduleBlock[] | undefined): DayBlock[] {
  const day: DayBlock[] = [];
  for (const block of blocks ?? []) {
    const start = toMinutes(block.start);
    if (!day.some((b) => b.start === start)) day.push({ start, value: block.value });
  }
  return day.sort((a, b) => a.start - b.start);
}

export function toPlan(schedules: Partial<Schedules> | undefined): Plan {
  return { workday: toDay(schedules?.workday), free: toDay(schedules?.free) };
}

export function fromPlan(plan: Plan): Schedules {
  const out = (blocks: DayBlock[]) => blocks.map((b) => ({ start: toClock(b.start), value: b.value }));
  return { workday: out(plan.workday), free: out(plan.free) };
}

export function clonePlan(plan: Plan): Plan {
  return { workday: plan.workday.map((b) => ({ ...b })), free: plan.free.map((b) => ({ ...b })) };
}

export function plansEqual(a: Plan, b: Plan): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * What most likely runs at 00:00 before a day's first block: the evening
 * before usually has the same day type, so its last block; failing that,
 * the other schedule's. (The real answer depends on what yesterday was.)
 */
export function carryIn(plan: Plan, kind: DayType): BlockValue | undefined {
  for (const k of [kind, otherType(kind)]) {
    const blocks = plan[k];
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
