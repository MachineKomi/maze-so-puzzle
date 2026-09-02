export interface JumpPresentationMotion {
  readonly holeCount: number;
  readonly durationMs: number;
  readonly apexPercent: number;
  readonly descentPercent: number;
}

/**
 * Longer Spring Boots jumps travel farther, stay airborne longer, and rise a
 * little higher. The engine remains tile-authoritative; this only tunes the
 * cheerful presentation layered over the completed move.
 */
export function getJumpPresentationMotion(holeCount: number): JumpPresentationMotion {
  const normalizedCount = Math.max(1, Math.min(3, Math.floor(holeCount)));
  return {
    holeCount: normalizedCount,
    durationMs: 460 + (normalizedCount - 1) * 125,
    apexPercent: -58 - (normalizedCount - 1) * 17,
    descentPercent: -30 - (normalizedCount - 1) * 10,
  };
}
