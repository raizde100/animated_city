import test from "node:test";
import assert from "node:assert/strict";
import { simulate, defaultPolicies } from "./simulation";
test("the baseline starts with the configured economy and no released time", () => {
  const e = simulate(1, defaultPolicies);
  assert.equal(e.gdp, 1_000_000);
  assert.equal(e.workers, 50);
  assert.equal(e.businesses, 10);
  assert.equal(e.industries, 4);
  assert.equal(e.freed, 0);
  assert.equal(e.cumulativeFreed, 0);
});
test("tax receipts finance spending and a nonnegative retained treasury", () => {
  const e = simulate(12, defaultPolicies),
    untaxed = simulate(12, { ...defaultPolicies, tax: 0 });
  assert.ok(e.taxes > 0 && e.investment > 0 && e.treasury > 0);
  assert.ok(e.infrastructure > 0 && e.education > 0);
  assert.equal(untaxed.taxes, 0);
  assert.equal(untaxed.investment, 0);
  assert.equal(untaxed.treasury, 0);
});
test("technology releases capacity which creates businesses and industries", () => {
  const manual = simulate(20, { ...defaultPolicies, technology: 0 }),
    connected = simulate(20, { ...defaultPolicies, technology: 100 });
  assert.ok(connected.productivity > manual.productivity);
  assert.ok(connected.cumulativeFreed > manual.cumulativeFreed);
  assert.ok(connected.gdp > manual.gdp);
  assert.ok(connected.businesses > 10 && connected.industries > 4);
  assert.ok(connected.hours < simulate(1, defaultPolicies).hours * 1.6);
});
test("education has a slower effect and materially improves long-term productivity", () => {
  const low = { ...defaultPolicies, education: 0 },
    high = { ...defaultPolicies, education: 100 };
  const early = simulate(3, high).productivity - simulate(3, low).productivity;
  const late = simulate(20, high).productivity - simulate(20, low).productivity;
  assert.ok(late > early && late > 0);
});
test("time is clamped, deterministic, and all policy extremes stay finite", () => {
  assert.deepEqual(simulate(99, defaultPolicies), {
    ...simulate(20, defaultPolicies),
    year: 99,
  });
  for (const tax of [0, 40])
    for (const n of [0, 100]) {
      const e = simulate(20, {
        tax,
        technology: n,
        infrastructure: n,
        education: n,
      });
      for (const v of Object.values(e)) assert.ok(Number.isFinite(v) && v >= 0);
      assert.ok(e.freed <= 8000 && e.businesses <= 36 && e.industries <= 14);
    }
  assert.deepEqual(
    simulate(12.5, defaultPolicies),
    simulate(12.5, defaultPolicies),
  );
});
test("without technology or public investment there is no released capacity or new markets", () => {
  const e = simulate(20, {
    tax: 0,
    technology: 0,
    infrastructure: 0,
    education: 0,
  });
  assert.equal(e.productivity, 100);
  assert.equal(e.freed, 0);
  assert.equal(e.cumulativeFreed, 0);
  assert.equal(e.businesses, 10);
  assert.equal(e.industries, 4);
});
