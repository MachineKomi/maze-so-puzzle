import { describe, expect, it } from "vitest";
import { getJumpPresentationMotion } from "./jumpPresentation";

describe("Spring Boots jump presentation", () => {
  it("has one readable single-hole arc, independent of walking pace", () => {
    expect(getJumpPresentationMotion()).toEqual({
      holeCount: 1, durationMs: 460, apexPercent: -58, descentPercent: -30,
    });
  });
});
