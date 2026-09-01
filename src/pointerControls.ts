import { getObjectAt, getTerrainAt, isObjectResolved } from "./game/engine";
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

/**
 * Converts a pointer offset from Ame into a cardinal intent. Keeping this in
 * tile units makes the control feel identical at every board size.
 */
export function pointerIntentFromTileOffset(
  dxTiles: number,
  dyTiles: number,
  deadZoneTiles = 0.34,
): PointerIntent | null {
  const deadZone = Math.max(0, deadZoneTiles);
  if (dxTiles === 0 && dyTiles === 0) return null;
  if (Math.abs(dxTiles) < deadZone && Math.abs(dyTiles) < deadZone) return null;

  if (Math.abs(dxTiles) >= Math.abs(dyTiles)) {
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

function stepFrom(point: Point, direction: Direction): Point {
  const delta = DIRECTION_DELTAS[direction];
  return { x: point.x + delta.x, y: point.y + delta.y };
}

/**
 * Corner assistance deliberately accepts only ordinary floor. It will never
 * auto-steer Ame onto water/lava or through an unresolved door or enemy, even
 * when the current inventory would technically make that interaction legal.
 */
function isSafeAssistTile(
  level: LevelDefinition,
  state: GameState,
  point: Point,
): boolean {
  if (getTerrainAt(level, point) !== "floor") return false;
  const object = getObjectAt(level, point);
  if (!object || isObjectResolved(object, state)) return true;
  return object.kind !== "door" && object.kind !== "enemy";
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
