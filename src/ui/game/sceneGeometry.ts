import type { CSSProperties } from "react";
import type { Point } from "../../game/types";
import type { CameraWindow } from "../../game/exploration";

export function isInsideWindow(point: Point, camera: CameraWindow): boolean {
  return point.x >= camera.left
    && point.x <= camera.right
    && point.y >= camera.top
    && point.y <= camera.bottom;
}

export function cameraLayerStyle(point: Point, camera: CameraWindow): CSSProperties {
  return {
    left: `${((point.x - camera.left) / camera.width) * 100}%`,
    top: `${((point.y - camera.top) / camera.height) * 100}%`,
    width: `${100 / camera.width}%`,
    height: `${100 / camera.height}%`,
  };
}

export function cameraNoticeStyle(point: Point, camera: CameraWindow): CSSProperties {
  return {
    left: `${((point.x - camera.left + 0.5) / camera.width) * 100}%`,
    top: `${((point.y - camera.top + 0.18) / camera.height) * 100}%`,
  };
}
