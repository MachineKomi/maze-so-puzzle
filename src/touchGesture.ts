import type { Direction } from "./game/types";

export interface TouchPoint {
  readonly x: number;
  readonly y: number;
}

/**
 * Treats a board drag as a tiny floating joystick. The finger must leave the
 * dead zone before a direction is chosen, which keeps ordinary taps from
 * becoming accidental steps.
 */
export function directionFromTouchDrag(
  origin: TouchPoint,
  current: TouchPoint,
  deadZone: number,
): Direction | null {
  const dx = current.x - origin.x;
  const dy = current.y - origin.y;
  if (Math.hypot(dx, dy) < Math.max(0, deadZone)) return null;

  if (Math.abs(dx) >= Math.abs(dy)) return dx < 0 ? "left" : "right";
  return dy < 0 ? "up" : "down";
}

/** A cell-relative dead zone stays comfortable on both phones and iPads. */
export function touchDeadZoneForCell(cellWidth: number, cellHeight: number): number {
  const shortestCellEdge = Math.min(cellWidth, cellHeight);
  return Math.max(10, Math.min(22, shortestCellEdge * 0.32));
}
