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
