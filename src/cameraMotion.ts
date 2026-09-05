import type { CSSProperties } from "react";
import type { CameraWindow } from "./game/exploration";
import type { LevelDefinition, Point } from "./game/types";

/** Individual translate percentages resolve against the full world's own box. */
export function cameraWorldTranslation(
  grid: Pick<LevelDefinition, "width" | "height">,
  camera: Pick<CameraWindow, "left" | "top">,
): string {
  return `${(-camera.left / grid.width * 100).toFixed(7)}% ${(-camera.top / grid.height * 100).toFixed(7)}%`;
}

/** Places a world tile on the full-maze plane rather than in the current crop. */
export function worldLayerStyle(point: Point, level: LevelDefinition): CSSProperties {
  return {
    left: `${(point.x / level.width) * 100}%`,
    top: `${(point.y / level.height) * 100}%`,
    width: `${100 / level.width}%`,
    height: `${100 / level.height}%`,
  };
}

/** Keep the full-maze layout origin stable. The travel owner applies the whole
 * sampled camera offset via translate, including first paint and Static mode.
 * Rebasing left/top per tile would invalidate layout of the moving world. */
export function cameraWorldStyle(
  level: LevelDefinition,
  camera: CameraWindow,
): CSSProperties {
  return {
    left: "0%",
    top: "0%",
    width: `${(level.width / camera.width) * 100}%`,
    height: `${(level.height / camera.height) * 100}%`,
  };
}
