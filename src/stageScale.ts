/** Legacy fixed-stage reference only. The live shell uses ui/game/layout.ts;
 * engine tiles, camera coordinates and pointer cadence are independent of this helper. */
export const LOGICAL_STAGE_WIDTH = 960;
export const LOGICAL_STAGE_HEIGHT = 540;
export const LOGICAL_STAGE_ASPECT_RATIO = LOGICAL_STAGE_WIDTH / LOGICAL_STAGE_HEIGHT;

export interface ScaledStageSize {
  readonly scale: number;
  readonly width: number;
  readonly height: number;
}

export function calculateStageScale(availableWidth: number, availableHeight: number): number {
  if (
    !Number.isFinite(availableWidth)
    || !Number.isFinite(availableHeight)
    || availableWidth <= 0
    || availableHeight <= 0
  ) {
    return 0;
  }

  return Math.min(
    availableWidth / LOGICAL_STAGE_WIDTH,
    availableHeight / LOGICAL_STAGE_HEIGHT,
  );
}

export function getScaledStageSize(availableWidth: number, availableHeight: number): ScaledStageSize {
  const scale = calculateStageScale(availableWidth, availableHeight);
  return {
    scale,
    width: LOGICAL_STAGE_WIDTH * scale,
    height: LOGICAL_STAGE_HEIGHT * scale,
  };
}
