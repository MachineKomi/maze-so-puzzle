import { getObjectAt, getTerrainAt, isObjectResolved, pointsEqual } from "./game/engine";
import {
  DIRECTION_DELTAS,
  type Direction,
  type GameState,
  type LevelDefinition,
  type Point,
} from "./game/types";

export interface PointerIntent {
  readonly direction: Direction;
  /** Offset on the axis perpendicular to `direction`, measured in tiles. */
  readonly lateralOffset: number;
}

export interface BoardRect {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

/** Keeps the visible drag guide attached to the pointer after the 1600×900
 * game stage is scaled to a phone, tablet, or desktop viewport. */
export function normalizedBoardPoint(
  clientX: number,
  clientY: number,
  rect: BoardRect,
): Point {
  const width = Math.max(1, rect.width);
  const height = Math.max(1, rect.height);
  return {
    x: Math.min(1, Math.max(0, (clientX - rect.left) / width)),
    y: Math.min(1, Math.max(0, (clientY - rect.top) / height)),
  };
}

/**
 * Converts a pointer offset from Ame into a cardinal intent. Keeping this in
 * tile units makes the control feel identical at every board size.
 */
export function pointerIntentFromTileOffset(
  dxTiles: number,
  dyTiles: number,
  deadZoneTiles = 0.34,
  previousDirection: Direction | null = null,
  axisHysteresis = 0.2,
): PointerIntent | null {
  const deadZone = Math.max(0, deadZoneTiles);
  if (dxTiles === 0 && dyTiles === 0) return null;
  if (Math.abs(dxTiles) < deadZone && Math.abs(dyTiles) < deadZone) return null;

  const absX = Math.abs(dxTiles);
  const absY = Math.abs(dyTiles);
  let useHorizontal = absX >= absY;

  if (previousDirection) {
    const previousHorizontal = previousDirection === "left" || previousDirection === "right";
    if (previousHorizontal !== useHorizontal) {
      const previousAxisMagnitude = previousHorizontal ? absX : absY;
      const challengerMagnitude = previousHorizontal ? absY : absX;
      const threshold = Math.max(0, axisHysteresis);
      if (
        previousAxisMagnitude >= deadZone
        && challengerMagnitude <= previousAxisMagnitude * (1 + threshold)
      ) {
        useHorizontal = previousHorizontal;
      }
    }
  }

  if (useHorizontal) {
    return {
      direction: dxTiles < 0 ? "left" : "right",
      lateralOffset: dyTiles,
    };
  }
  return {
    direction: dyTiles < 0 ? "up" : "down",
    lateralOffset: dxTiles,
  };
}

/** Anchored drag steering is independent of both Ame and camera translation.
 * The 8px neutral region remains usable on scaled touchscreens. */
export function pointerIntentFromDrag(
  origin: Point, current: Point, previousDirection: Direction | null,
): PointerIntent | null {
  const intent = pointerIntentFromTileOffset((current.x-origin.x)/40, (current.y-origin.y)/40, .20, previousDirection);
  return intent ? {direction:intent.direction,lateralOffset:Math.max(-1,Math.min(1,intent.lateralOffset))} : null;
}

function stepFrom(point: Point, direction: Direction): Point {
  const delta = DIRECTION_DELTAS[direction];
  return { x: point.x + delta.x, y: point.y + delta.y };
}

/**
 * Corner assistance deliberately accepts only ordinary floor. It will never
 * auto-steer Ame onto water/lava/poison or through an unresolved door or enemy, even
 * when the current inventory would technically make that interaction legal.
 */
function isSafeAssistTile(
  level: LevelDefinition,
  state: GameState,
  point: Point,
): boolean {
  if (getTerrainAt(level, point) !== "floor" || pointsEqual(point, level.exit)) return false;
  const object = getObjectAt(level, point);
  return !object || (object.kind !== "portal" && isObjectResolved(object, state));
}

function perpendicularDirections(
  intended: Direction,
): readonly [Direction, Direction] {
  return intended === "left" || intended === "right"
    ? ["up", "down"]
    : ["left", "right"];
}

function preferredPerpendicularFromOffset(
  intended: Direction,
  lateralOffset: number,
): Direction | null {
  // Tiny offsets are commonly pointer noise. With no meaningful preference,
  // refusing to guess is safer than choosing an arbitrary branch.
  if (Math.abs(lateralOffset) < 0.08) return null;
  if (intended === "left" || intended === "right") {
    return lateralOffset < 0 ? "up" : "down";
  }
  return lateralOffset < 0 ? "left" : "right";
}

const WRONG_SIDE_WOBBLE_TOLERANCE_TILES = 0.55;

/**
 * Applies a strictly one-tile corner assist for pointer, keyboard, and D-pad
 * requests. The intended tile
 * must itself be a wall, and both a side tile and the immediately-forward tile
 * must be safe. A single valid slip is accepted automatically; when both sides
 * work, the pointer's lateral offset or Ame's immediately previous movement
 * chooses. Otherwise the original direction is returned so the engine reports
 * the real blocker.
 */
export function resolvePointerMoveDirection(
  level: LevelDefinition,
  state: GameState,
  intended: Direction,
  lateralOffset: number,
  previousDirection: Direction | null = null,
): Direction {
  const intendedTarget = stepFrom(state.position, intended);
  if (getTerrainAt(level, intendedTarget) !== "wall") return intended;

  const candidates = perpendicularDirections(intended).filter((perpendicular) => {
    const sideTarget = stepFrom(state.position, perpendicular);
    if (!isSafeAssistTile(level, state, sideTarget)) return false;
    return isSafeAssistTile(level, state, stepFrom(sideTarget, intended));
  });
  if (candidates.length === 0) return intended;

  const preferred = preferredPerpendicularFromOffset(intended, lateralOffset);
  if (candidates.length === 1) {
    const candidate = candidates[0] ?? intended;
    // Forgive a modest wobble in the wrong direction, but never move opposite
    // a deliberate full-tile steering gesture just because that side is unsafe.
    return !preferred
      || candidate === preferred
      || Math.abs(lateralOffset) <= WRONG_SIDE_WOBBLE_TOLERANCE_TILES
      ? candidate
      : intended;
  }

  if (preferred && candidates.includes(preferred)) return preferred;
  if (previousDirection && candidates.includes(previousDirection)) return previousDirection;
  return intended;
}
