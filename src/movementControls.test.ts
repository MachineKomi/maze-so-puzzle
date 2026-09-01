import { describe, expect, it } from "vitest";
import {
  HELD_MOVE_INITIAL_DELAY_MS,
  IDLE_HELD_MOVE_CADENCE,
  advanceHeldMoveCadence,
  beginHeldMoveCadence,
  heldMoveRepeatDelay,
} from "./movementControls";

describe("held movement cadence", () => {
  it("leaves a comfortable gap after the immediate first tile", () => {
    expect(HELD_MOVE_INITIAL_DELAY_MS).toBeGreaterThanOrEqual(200);
    expect(HELD_MOVE_INITIAL_DELAY_MS).toBeGreaterThan(heldMoveRepeatDelay(0));
  });

  it("accelerates smoothly to a capped cruising speed", () => {
    const delays = Array.from({ length: 15 }, (_, index) => heldMoveRepeatDelay(index));
    expect(delays[0]).toBe(160);
    expect(delays.at(-1)).toBe(100);
    expect(delays.every((delay, index) => index === 0 || delay <= delays[index - 1]!)).toBe(true);
    expect(delays.every((delay) => delay >= 100)).toBe(true);
    expect(new Set(delays.slice(0, 10)).size).toBeGreaterThanOrEqual(7);
  });

  it("resets acceleration whenever the requested direction changes", () => {
    let cadence = beginHeldMoveCadence("right");
    for (let index = 0; index < 8; index += 1) {
      cadence = advanceHeldMoveCadence(cadence, "right").cadence;
    }
    expect(advanceHeldMoveCadence(cadence, "right").nextDelayMs).toBeLessThan(140);

    const turned = advanceHeldMoveCadence(cadence, "up");
    expect(turned.nextDelayMs).toBe(heldMoveRepeatDelay(0));
    expect(turned.cadence).toEqual({ direction: "up", repeatCount: 1 });
  });

  it("starts predictably from the shared idle state", () => {
    expect(advanceHeldMoveCadence(IDLE_HELD_MOVE_CADENCE, "left")).toEqual({
      cadence: { direction: "left", repeatCount: 1 },
      nextDelayMs: 160,
    });
  });
});
