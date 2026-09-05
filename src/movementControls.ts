import type { Direction } from "./game/types";

/**
 * Input commits exact squares; presentation spends the same time travelling
 * the first square as every repeated square. No fast first hop followed by a
 * keyboard-style repeat pause. A future acceleration curve must preserve this
 * continuous handoff and be judged in actual play, not by delay values alone.
 */
export const STEP_TRAVEL_MS = 160;
export const HELD_MOVE_INITIAL_DELAY_MS = STEP_TRAVEL_MS;

export const HELD_MOVE_START_REPEAT_MS = STEP_TRAVEL_MS;
export const HELD_MOVE_FASTEST_REPEAT_MS = 160;
export const HELD_MOVE_ACCELERATION_STEPS = 16;

export interface HeldMoveCadence {
  readonly direction: Direction | null;
  readonly repeatCount: number;
}

export const IDLE_HELD_MOVE_CADENCE: HeldMoveCadence = {
  direction: null,
  repeatCount: 0,
};

/** Returns the delay after a repeated move. `repeatCount` is zero based. */
export function heldMoveRepeatDelay(_repeatCount: number): number {
  return STEP_TRAVEL_MS;
}

/**
 * Advances a hold after one repeated movement attempt. Changing direction
 * resets the acceleration; a one-tile corner correction does not, because the
 * caller supplies the player's requested direction rather than the correction.
 */
export function advanceHeldMoveCadence(
  cadence: HeldMoveCadence,
  requestedDirection: Direction,
): { readonly cadence: HeldMoveCadence; readonly nextDelayMs: number } {
  const repeatCount = cadence.direction === requestedDirection
    ? cadence.repeatCount
    : 0;
  return {
    cadence: {
      direction: requestedDirection,
      repeatCount: repeatCount + 1,
    },
    nextDelayMs: heldMoveRepeatDelay(repeatCount),
  };
}

export function beginHeldMoveCadence(direction: Direction): HeldMoveCadence {
  return { direction, repeatCount: 0 };
}
