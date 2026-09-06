import type { Point } from "./game/types";

export interface JumpPresentationMotion {
  readonly holeCount: number;
  readonly durationMs: number;
  readonly apexPercent: number;
  readonly descentPercent: number;
}

/**
 * One input crosses one hole. Pace changes walking, never jump reach or the
 * readable arc; the engine remains the sole movement authority.
 */
export function getJumpPresentationMotion(): JumpPresentationMotion {
  return {
    holeCount: 1,
    durationMs: 460,
    apexPercent: -58,
    descentPercent: -30,
  };
}
export interface JumpTravel {
  readonly from: Point;
  readonly to: Point;
  readonly startedAt: number;
  readonly durationMs: number;
}

/** Presentation-only ground path; the camera uses the same sampled point.
 * Smooth endpoints avoid a landing correction. Height/pose stays local to Ame. */
export function jumpGroundPosition(jump: JumpTravel, now: number): Point {
  const t = Math.max(0, Math.min(1, (now - jump.startedAt) / jump.durationMs));
  const progress = t * t * (3 - 2 * t);
  return { x: jump.from.x + (jump.to.x - jump.from.x) * progress,
    y: jump.from.y + (jump.to.y - jump.from.y) * progress };
}
