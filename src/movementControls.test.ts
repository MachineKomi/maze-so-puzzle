import { describe, expect, it } from "vitest";
import {
  HELD_MOVE_INITIAL_DELAY_MS,
  HELD_MOVE_ACCELERATION_STEPS,
  HELD_MOVE_FASTEST_REPEAT_MS,
  HELD_MOVE_START_REPEAT_MS,
  IDLE_HELD_MOVE_CADENCE,
  advanceHeldMoveCadence,
  beginHeldMoveCadence,
  heldMoveRepeatDelay,
} from "./movementControls";

describe("held movement cadence", () => {
  it("leaves a comfortable gap after the immediate first tile", () => {
    expect(HELD_MOVE_INITIAL_DELAY_MS).toBe(320);
    expect(HELD_MOVE_INITIAL_DELAY_MS).toBeGreaterThan(heldMoveRepeatDelay(0));
  });

  it("accelerates smoothly to a capped cruising speed", () => {
    const delays = Array.from({ length: 21 }, (_, index) => heldMoveRepeatDelay(index));
    expect(HELD_MOVE_START_REPEAT_MS).toBe(260);
    expect(HELD_MOVE_FASTEST_REPEAT_MS).toBe(160);
    expect(HELD_MOVE_ACCELERATION_STEPS).toBe(16);
    expect(delays).toEqual([
      260, 259, 256, 251, 244, 237, 228, 219, 210, 201, 192,
      183, 176, 169, 164, 161, 160, 160, 160, 160, 160,
    ]);
    expect(delays.every((delay, index) => index === 0 || delay <= delays[index - 1]!)).toBe(true);
    expect(delays.every((delay) => delay >= HELD_MOVE_FASTEST_REPEAT_MS)).toBe(true);
    expect(new Set(delays.slice(0, HELD_MOVE_ACCELERATION_STEPS)).size)
      .toBeGreaterThanOrEqual(14);
  });

  it("resets acceleration whenever the requested direction changes", () => {
    let cadence = beginHeldMoveCadence("right");
    for (let index = 0; index < 8; index += 1) {
      cadence = advanceHeldMoveCadence(cadence, "right").cadence;
    }
    expect(advanceHeldMoveCadence(cadence, "right").nextDelayMs).toBeLessThan(230);

    const turned = advanceHeldMoveCadence(cadence, "up");
    expect(turned.nextDelayMs).toBe(heldMoveRepeatDelay(0));
    expect(turned.cadence).toEqual({ direction: "up", repeatCount: 1 });
  });

  it("starts predictably from the shared idle state", () => {
    expect(advanceHeldMoveCadence(IDLE_HELD_MOVE_CADENCE, "left")).toEqual({
      cadence: { direction: "left", repeatCount: 1 },
      nextDelayMs: 260,
    });
  });
});
