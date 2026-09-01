import type { Direction } from "./game/types";

/**
 * A held input still moves once immediately, then pauses long enough that a
 * young player can release after a single square. Sustained movement eases up
 * to corridor speed over the next few steps instead of jumping straight to
 * full speed.
 */
export const HELD_MOVE_INITIAL_DELAY_MS = 220;

const HELD_MOVE_START_REPEAT_MS = 160;
const HELD_MOVE_FASTEST_REPEAT_MS = 100;
const HELD_MOVE_ACCELERATION_STEPS = 10;

export interface HeldMoveCadence {
  readonly direction: Direction | null;
  readonly repeatCount: number;
}

export const IDLE_HELD_MOVE_CADENCE: HeldMoveCadence = {
  direction: null,
  repeatCount: 0,
};

/** Returns the delay after a repeated move. `repeatCount` is zero based. */
export function heldMoveRepeatDelay(repeatCount: number): number {
  const progress = Math.min(
    1,
    Math.max(0, repeatCount) / HELD_MOVE_ACCELERATION_STEPS,
  );
  // Smoothstep keeps the first few repeats gentle and avoids a sudden speed
  // change as the cadence reaches its cruising rate.
  const easedProgress = progress * progress * (3 - 2 * progress);
  return Math.round(
    HELD_MOVE_START_REPEAT_MS
      + (HELD_MOVE_FASTEST_REPEAT_MS - HELD_MOVE_START_REPEAT_MS) * easedProgress,
  );
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
