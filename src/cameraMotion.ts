import type { CSSProperties } from "react";
import type { CameraWindow } from "./game/exploration";
import type { LevelDefinition, Point } from "./game/types";

/** Places a world tile on the full-maze plane rather than in the current crop. */
export function worldLayerStyle(point: Point, level: LevelDefinition): CSSProperties {
  return {
    left: `${(point.x / level.width) * 100}%`,
    top: `${(point.y / level.height) * 100}%`,
    width: `${100 / level.width}%`,
    height: `${100 / level.height}%`,
  };
}

/** Sizes and offsets the full-maze plane so the selected camera window exactly
 * fills the square board. CSS transitions can then interpolate the offset. */
export function cameraWorldStyle(
  level: LevelDefinition,
  camera: CameraWindow,
): CSSProperties {
  return {
    left: `${(-camera.left / camera.width) * 100}%`,
    top: `${(-camera.top / camera.height) * 100}%`,
    width: `${(level.width / camera.width) * 100}%`,
    height: `${(level.height / camera.height) * 100}%`,
  };
}
