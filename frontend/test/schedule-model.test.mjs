// Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import * as M from "../.test-build/schedule-model.js";

const stored = [
  { weekdays: [0, 1, 2, 3, 4], start: "06:00", value: 21 },
  { weekdays: [0, 1, 2, 3, 4], start: "08:30", value: "off" },
  { weekdays: [0, 1, 2, 3, 4, 5, 6], start: "17:00", value: 21.5 },
  { weekdays: [0, 1, 2, 3, 4, 5, 6], start: "22:30", value: 18 },
  { weekdays: [5, 6], start: "08:00", value: "max" },
];

test("round trip keeps the stored schedule", () => {
  const week = M.toWeek(stored);
  assert.equal(week[0].length, 4);
  assert.equal(week[5].length, 3);
  const back = M.fromWeek(week);
  const norm = (s) => JSON.stringify([...s].sort((a, b) => a.start.localeCompare(b.start) || a.weekdays[0] - b.weekdays[0]));
  assert.equal(norm(back), norm(stored));
});

test("editing one day splits it out of a shared block", () => {
  const week = M.toWeek(stored);
  week[2] = M.moveStart(week[2], 0, 7 * 60);
  const back = M.fromWeek(week);
  const six = back.find((b) => b.start === "06:00");
  const seven = back.find((b) => b.start === "07:00");
  assert.deepEqual(six.weekdays, [0, 1, 3, 4]);
  assert.deepEqual(seven.weekdays, [2]);
});

test("a day never gets two blocks at the same start", () => {
  const week = M.toWeek(stored);
  const keys = M.fromWeek(week).flatMap((b) => b.weekdays.map((d) => `${d}@${b.start}`));
  assert.equal(new Set(keys).size, keys.length);
});

test("dragging is bounded by neighbours and snapped", () => {
  const day = M.toWeek(stored)[0]; // 06:00, 08:30, 17:00, 22:30
  assert.equal(M.moveStart(day, 1, 5 * 60)[1].start, 6 * 60 + 15);
  assert.equal(M.moveStart(day, 1, 20 * 60)[1].start, 17 * 60 - 15);
  assert.equal(M.moveStart(day, 1, 9 * 60 + 7)[1].start, 9 * 60); // snapped to 15 min
  assert.equal(M.moveStart(day, 0, -50)[0].start, 0);
  assert.equal(M.moveStart(day, 3, 2000)[3].start, 1440 - 15);
});

test("split, insert and remove", () => {
  const day = M.toWeek(stored)[0];
  const split = M.splitBlock(day, 1); // 08:30-17:00 -> mid 12:45
  assert.equal(split.blocks.length, 5);
  assert.equal(split.blocks[2].start, 12 * 60 + 45);
  assert.equal(split.index, 2);
  assert.equal(M.insertAt(day, 6 * 60 + 5, 20), undefined); // too close to 06:00
  const ins = M.insertAt(day, 12 * 60, 20);
  assert.equal(ins.blocks[ins.index].start, 720);
  assert.equal(M.removeBlock(day, 0).length, 3);
  assert.equal(M.splitBlock([{ start: 0, value: 20 }, { start: 15, value: 21 }], 0), undefined);
});

test("carry-in comes from the previous day with blocks", () => {
  const week = M.toWeek(stored);
  assert.equal(M.carryIn(week, 0), 18); // Sunday's last block
  week[6] = [];
  assert.equal(M.carryIn(week, 0), 18); // Saturday's last
  const lone = M.toWeek([{ weekdays: [3], start: "10:00", value: 22 }]);
  assert.equal(M.carryIn(lone, 3), 22); // a week ago
  assert.equal(M.carryIn(M.toWeek([]), 0), undefined);
});

test("clock helpers", () => {
  assert.equal(M.toClock(0), "00:00");
  assert.equal(M.toClock(1439), "23:59");
  assert.equal(M.toMinutes("22:30"), 1350);
  assert.equal(M.clampTemp(30), 25);
  assert.equal(M.clampTemp(21.3), 21.5);
});
