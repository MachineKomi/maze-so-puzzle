import type { CameraWindow } from "./exploration";
import type { Point } from "./types";

export const MAX_FOLLOWER_TRAIL_LENGTH = 24;

function pointKey(point: Point): string {
  return `${point.x},${point.y}`;
}

function pointsEqual(left: Point, right: Point): boolean {
  return left.x === right.x && left.y === right.y;
}

function isInsideWindow(point: Point, camera: CameraWindow): boolean {
  return point.x >= camera.left
    && point.x <= camera.right
    && point.y >= camera.top
    && point.y <= camera.bottom;
}

/** Record the square Ame just left, keeping a short loop-free breadcrumb trail. */
export function recordFollowerStep(
  trail: readonly Point[],
  previousPosition: Point,
): readonly Point[] {
  return [
    previousPosition,
    ...trail.filter((point) => !pointsEqual(point, previousPosition)),
  ].slice(0, MAX_FOLLOWER_TRAIL_LENGTH);
}

/** Pick distinct visible footprints for rescued pets, nearest friend first. */
export function getVisibleFollowerPoints(
  trail: readonly Point[],
  playerPosition: Point,
  camera: CameraWindow,
  count: number,
): readonly Point[] {
  const seen = new Set<string>();
  const result: Point[] = [];

  for (const point of trail) {
    if (result.length >= count) break;
    if (pointsEqual(point, playerPosition) || !isInsideWindow(point, camera)) continue;
    const key = pointKey(point);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(point);
  }

  return result;
}
