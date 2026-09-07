import type { CSSProperties } from "react";
import type { CameraWindow } from "./game/exploration";
import type { LevelDefinition, Point } from "./game/types";

/** A small retained paint window, independent of total maze area. Geometry and
 * texture phase stay in world coordinates; only its viewport is rebased. */
export function boundedWorldWindow(
  grid: Pick<LevelDefinition, "width" | "height">,
  camera: CameraWindow,
  previous?: CameraWindow,
): CameraWindow {
  const width = Math.min(grid.width, Math.ceil(camera.width) + 4);
  const height = Math.min(grid.height, Math.ceil(camera.height) + 4);
  const axis = (at: number, view: number, size: number, limit: number, prior?: number) => {
    if (prior !== undefined && at >= prior + (prior > 0 ? .25 : 0)
      && at + view <= prior + size - (prior + size < limit ? .25 : 0)) return prior;
    return Math.max(0, Math.min(limit - size, Math.round(at) - 2));
  };
  const left = axis(camera.left, camera.width, width, grid.width, previous?.width === width ? previous.left : undefined);
  const top = axis(camera.top, camera.height, height, grid.height, previous?.height === height ? previous.top : undefined);
  if (previous?.left === left && previous.top === top && previous.width === width && previous.height === height) return previous;
  return { left, top, width, height, right: left + width - 1, bottom: top + height - 1 };
}

/** Individual translate percentages resolve against the full world's own box. */
export function cameraWorldTranslation(
  grid: Pick<LevelDefinition, "width" | "height">,
  camera: Pick<CameraWindow, "left" | "top">,
  origin: Pick<CameraWindow, "left" | "top"> = { left: 0, top: 0 },
): string {
  return `${((origin.left - camera.left) / grid.width * 100).toFixed(7)}% ${((origin.top - camera.top) / grid.height * 100).toFixed(7)}%`;
}

/** Places a world tile on the full-maze plane rather than in the current crop. */
export function worldLayerStyle(point: Point, level: LevelDefinition): CSSProperties {
  return {
    left: `calc((${point.x} - var(--world-left, 0)) * var(--world-tile-x, ${100 / level.width}%))`,
    top: `calc((${point.y} - var(--world-top, 0)) * var(--world-tile-y, ${100 / level.height}%))`,
    width: `var(--world-tile-x, ${100 / level.width}%)`,
    height: `var(--world-tile-y, ${100 / level.height}%)`,
  };
}

/** The travel owner atomically sets the retained origin and translation before
 * paint. React owns only the size, which stays stable throughout ordinary play. */
export function cameraWorldStyle(
  level: LevelDefinition,
  camera: CameraWindow,
): CSSProperties {
  return {
    left: "0%",
    top: "0%",
    width: `${(Math.min(level.width, Math.ceil(camera.width) + 4) / camera.width) * 100}%`,
    height: `${(Math.min(level.height, Math.ceil(camera.height) + 4) / camera.height) * 100}%`,
  };
}
