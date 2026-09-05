import { describe, expect, it } from "vitest";
import {
  DEFAULT_STEP_TRAVEL_MS,
  IDLE_HELD_MOVE_CADENCE,
  MOVEMENT_PACE_MS,
  advanceHeldMoveCadence,
  beginHeldMoveCadence,
  heldMoveRepeatDelay,
  movementStepDuration,
} from "./movementControls";

describe("held movement cadence", () => {
  it("maps exactly three named paces onto one ordinary-step policy", () => {
    expect(MOVEMENT_PACE_MS).toEqual({ chill: 320, regular: 200, zippy: 120 });
    expect(DEFAULT_STEP_TRAVEL_MS).toBe(MOVEMENT_PACE_MS.regular);
  });

  it("hands each selected first tile into repeats with no acceleration ramp", () => {
    for (const pace of ["chill", "regular", "zippy"] as const) {
      const delays = Array.from({ length: 21 }, (_, index) => heldMoveRepeatDelay(index, pace));
      expect(delays.every(delay => delay === movementStepDuration(pace))).toBe(true);
    }
  });

  it("resets directional bookkeeping at a turn without a slow restart", () => {
    let cadence = beginHeldMoveCadence("right");
    for (let index = 0; index < 8; index += 1) {
      cadence = advanceHeldMoveCadence(cadence, "right", "regular").cadence;
    }
    const continuing = advanceHeldMoveCadence(cadence, "right", "zippy");
    const turned = advanceHeldMoveCadence(cadence, "up", "zippy");
    expect(turned.nextDelayMs).toBe(continuing.nextDelayMs);
    expect(turned.cadence).toEqual({ direction: "up", repeatCount: 1 });
  });

  it("starts predictably from the shared idle state", () => {
    expect(advanceHeldMoveCadence(IDLE_HELD_MOVE_CADENCE, "left", "chill")).toEqual({
      cadence: { direction: "left", repeatCount: 1 }, nextDelayMs: MOVEMENT_PACE_MS.chill,
    });
  });
});
