import { describe, expect, it } from "vitest";
import {
  HELD_MOVE_INITIAL_DELAY_MS,
  HELD_MOVE_FASTEST_REPEAT_MS,
  IDLE_HELD_MOVE_CADENCE,
  STEP_TRAVEL_MS,
  advanceHeldMoveCadence,
  beginHeldMoveCadence,
  heldMoveRepeatDelay,
} from "./movementControls";
import { TAP_TRAVEL_MS } from "./tileTravel";

describe("held movement cadence", () => {
  it("hands the first animated tile into the repeat without a keyboard-repeat pause", () => {
    expect(HELD_MOVE_INITIAL_DELAY_MS).toBe(TAP_TRAVEL_MS);
    expect(HELD_MOVE_INITIAL_DELAY_MS).toBe(heldMoveRepeatDelay(0));
    expect(STEP_TRAVEL_MS).toBe(160);
  });

  it("uses the reviewed first-step and cruising cadence without a flash-then-crawl ramp", () => {
    const delays = Array.from({ length: 21 }, (_, index) => heldMoveRepeatDelay(index));
    expect(delays.every(delay => delay === STEP_TRAVEL_MS)).toBe(true);
    expect(delays.every(delay => delay >= HELD_MOVE_FASTEST_REPEAT_MS)).toBe(true);
  });

  it("resets directional bookkeeping at a turn without a slow restart", () => {
    let cadence = beginHeldMoveCadence("right");
    for (let index = 0; index < 8; index += 1) {
      cadence = advanceHeldMoveCadence(cadence, "right").cadence;
    }
    const continuing = advanceHeldMoveCadence(cadence, "right");
    const turned = advanceHeldMoveCadence(cadence, "up");
    expect(turned.nextDelayMs).toBe(continuing.nextDelayMs);
    expect(turned.cadence).toEqual({ direction: "up", repeatCount: 1 });
  });

  it("starts predictably from the shared idle state", () => {
    expect(advanceHeldMoveCadence(IDLE_HELD_MOVE_CADENCE, "left")).toEqual({
      cadence: { direction: "left", repeatCount: 1 }, nextDelayMs: STEP_TRAVEL_MS,
    });
  });
});
