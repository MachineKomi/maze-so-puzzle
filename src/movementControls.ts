import type { Direction } from "./game/types";
import type { MovementPace } from "./motion";

/**
 * Input commits exact squares; presentation spends the same time travelling
 * the first square as every repeated square. No fast first hop followed by a
 * keyboard-style repeat pause. A future acceleration curve must preserve this
 * continuous handoff and be judged in actual play, not by delay values alone.
 */
export const MOVEMENT_PACE_MS: Readonly<Record<MovementPace, number>> = {
  chill: 320,
  regular: 200,
  zippy: 120,
};
export const DEFAULT_STEP_TRAVEL_MS = MOVEMENT_PACE_MS.regular;

export function movementStepDuration(pace: MovementPace): number {
  return MOVEMENT_PACE_MS[pace];
}

export interface HeldMoveCadence {
  readonly direction: Direction | null;
  readonly repeatCount: number;
}

export const IDLE_HELD_MOVE_CADENCE: HeldMoveCadence = {
  direction: null,
  repeatCount: 0,
};

/** Returns the delay after a repeated move. `repeatCount` is zero based. */
export function heldMoveRepeatDelay(_repeatCount: number, pace: MovementPace): number {
  return movementStepDuration(pace);
}

/**
 * Advances a hold after one repeated movement attempt. Changing direction
 * resets the acceleration; a one-tile corner correction does not, because the
 * caller supplies the player's requested direction rather than the correction.
 */
export function advanceHeldMoveCadence(
  cadence: HeldMoveCadence,
  requestedDirection: Direction,
  pace: MovementPace,
): { readonly cadence: HeldMoveCadence; readonly nextDelayMs: number } {
  const repeatCount = cadence.direction === requestedDirection
    ? cadence.repeatCount
    : 0;
  return {
    cadence: {
      direction: requestedDirection,
      repeatCount: repeatCount + 1,
    },
    nextDelayMs: heldMoveRepeatDelay(repeatCount, pace),
  };
}

export function beginHeldMoveCadence(direction: Direction): HeldMoveCadence {
  return { direction, repeatCount: 0 };
}
