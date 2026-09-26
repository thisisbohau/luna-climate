// Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import * as M from "../.test-build/schedule-model.js";

const stored = {
  workday: [
    { start: "06:00", value: 21 },
    { start: "08:30", value: "off" },
    { start: "17:00", value: 21.5 },
    { start: "22:30", value: 18 },
  ],
  free: [
    { start: "08:00", value: "max" },
    { start: "23:00", value: 18.5 },
  ],
};

test("round trip keeps the stored schedules", () => {
  const plan = M.toPlan(stored);
  assert.equal(plan.workday.length, 4);
  assert.equal(plan.free.length, 2);
  assert.deepEqual(M.fromPlan(plan), stored);
});

test("editing one day type leaves the other alone", () => {
  const plan = M.toPlan(stored);
  plan.workday = M.moveStart(plan.workday, 0, 7 * 60);
  const back = M.fromPlan(plan);
  assert.equal(back.workday[0].start, "07:00");
  assert.deepEqual(back.free, stored.free);
  assert.ok(!M.plansEqual(plan, M.toPlan(stored)));
  assert.ok(M.plansEqual(M.clonePlan(M.toPlan(stored)), M.toPlan(stored)));
});

test("unsorted and duplicate input is normalised", () => {
  const plan = M.toPlan({ workday: [{ start: "17:00", value: 20 }, { start: "06:00", value: 21 }, { start: "06:00", value: 22 }] });
  assert.deepEqual(plan.workday.map((b) => b.start), [360, 1020]);
  assert.deepEqual(plan.free, []);
});

test("dragging is bounded by neighbours and snapped", () => {
  const day = M.toPlan(stored).workday; // 06:00, 08:30, 17:00, 22:30
  assert.equal(M.moveStart(day, 1, 5 * 60)[1].start, 6 * 60 + 15);
  assert.equal(M.moveStart(day, 1, 20 * 60)[1].start, 17 * 60 - 15);
  assert.equal(M.moveStart(day, 1, 9 * 60 + 7)[1].start, 9 * 60); // snapped to 15 min
  assert.equal(M.moveStart(day, 0, -50)[0].start, 0);
  assert.equal(M.moveStart(day, 3, 2000)[3].start, 1440 - 15);
});

test("split, insert and remove", () => {
  const day = M.toPlan(stored).workday;
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

test("carry-in is the evening before, same day type first", () => {
  const plan = M.toPlan(stored);
  assert.equal(M.carryIn(plan, "workday"), 18);
  assert.equal(M.carryIn(plan, "free"), 18.5);
  plan.free = [];
  assert.equal(M.carryIn(plan, "free"), 18); // falls back to the other schedule
  assert.equal(M.carryIn(M.toPlan({}), "workday"), undefined);
  assert.equal(M.otherType("workday"), "free");
});

test("clock helpers", () => {
  assert.equal(M.toClock(0), "00:00");
  assert.equal(M.toClock(1439), "23:59");
  assert.equal(M.toMinutes("22:30"), 1350);
  assert.equal(M.clampTemp(30), 25);
  assert.equal(M.clampTemp(21.3), 21.5);
});
