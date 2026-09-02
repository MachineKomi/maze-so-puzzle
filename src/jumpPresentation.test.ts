import { describe, expect, it } from "vitest";
import { getJumpPresentationMotion } from "./jumpPresentation";

describe("Spring Boots jump presentation", () => {
  it("gives one-, two-, and three-hole jumps progressively longer, higher arcs", () => {
    const one = getJumpPresentationMotion(1);
    const two = getJumpPresentationMotion(2);
    const three = getJumpPresentationMotion(3);

    expect(one.holeCount).toBe(1);
    expect(two.durationMs).toBeGreaterThan(one.durationMs);
    expect(three.durationMs).toBeGreaterThan(two.durationMs);
    expect(two.apexPercent).toBeLessThan(one.apexPercent);
    expect(three.apexPercent).toBeLessThan(two.apexPercent);
  });

  it("clamps unexpected values to the supported visual range", () => {
    expect(getJumpPresentationMotion(0).holeCount).toBe(1);
    expect(getJumpPresentationMotion(99).holeCount).toBe(3);
  });
});
