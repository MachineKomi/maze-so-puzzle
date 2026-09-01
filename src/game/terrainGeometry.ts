import type { CameraWindow } from "./exploration";
import type { LevelDefinition, TerrainKind } from "./types";

/** The corner radius used by the terrain renderer, measured in maze tiles. */
export const DEFAULT_TERRAIN_CORNER_RADIUS = 0.12;

/** Inclusive integer cell bounds in stable maze/world coordinates. */
export interface CellUnionBounds {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
}

export type CellPredicate = (x: number, y: number) => boolean;

export type TerrainPredicate = (
  terrain: TerrainKind,
  x: number,
  y: number,
) => boolean;

/** A single SVG path whose subpaths must be filled using the even-odd rule. */
export interface RoundedCellUnionPath {
  readonly d: string;
  readonly fillRule: "evenodd";
  readonly loopCount: number;
}

type TerrainGrid = Pick<LevelDefinition, "width" | "height" | "terrain">;
type TerrainCamera = Pick<CameraWindow, "left" | "top" | "right" | "bottom">;

interface Point {
  readonly x: number;
  readonly y: number;
}

interface Edge {
  readonly start: Point;
  readonly end: Point;
  /** E, S, W, N in SVG's downward-positive coordinate system. */
  readonly direction: 0 | 1 | 2 | 3;
}

interface RoundedCorner {
  readonly entry: Point;
  readonly exit: Point;
  readonly radius: number;
  readonly sweep: 0 | 1;
}

// Larger radii can cross a one-cell feature and change the source grid's
// topology. Half a tile is the maximum safe radius for a cell union.
const MAX_CELL_CORNER_RADIUS = 0.5;

const EMPTY_PATH: RoundedCellUnionPath = {
  d: "",
  fillRule: "evenodd",
  loopCount: 0,
};

function pointKey(point: Point): string {
  return `${point.x},${point.y}`;
}

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function pointsEqual(first: Point, second: Point): boolean {
  return first.x === second.x && first.y === second.y;
}

function assertInteger(value: number, label: string): void {
  if (!Number.isInteger(value)) {
    throw new RangeError(`${label} must be an integer.`);
  }
}

function validateBounds(bounds: CellUnionBounds): void {
  assertInteger(bounds.left, "Cell bounds left");
  assertInteger(bounds.top, "Cell bounds top");
  assertInteger(bounds.right, "Cell bounds right");
  assertInteger(bounds.bottom, "Cell bounds bottom");
  if (bounds.right < bounds.left || bounds.bottom < bounds.top) {
    throw new RangeError("Cell bounds must contain at least one cell.");
  }
}

function validateRadius(radius: number): void {
  if (!Number.isFinite(radius) || radius < 0) {
    throw new RangeError("Corner radius must be a finite non-negative number.");
  }
}

function isInsideBounds(bounds: CellUnionBounds, x: number, y: number): boolean {
  return x >= bounds.left
    && x <= bounds.right
    && y >= bounds.top
    && y <= bounds.bottom;
}

function collectOccupiedCells(
  bounds: CellUnionBounds,
  isOccupied: CellPredicate,
): ReadonlySet<string> {
  const occupied = new Set<string>();
  for (let y = bounds.top; y <= bounds.bottom; y += 1) {
    for (let x = bounds.left; x <= bounds.right; x += 1) {
      if (isOccupied(x, y)) occupied.add(cellKey(x, y));
    }
  }
  return occupied;
}

/**
 * Emit exposed unit edges clockwise around every occupied cell. Keeping the
 * occupied material on the right makes outer loops clockwise and hole loops
 * counter-clockwise in SVG's downward-positive coordinate system.
 */
function collectBoundaryEdges(
  bounds: CellUnionBounds,
  occupied: ReadonlySet<string>,
): readonly Edge[] {
  const edges: Edge[] = [];
  const hasCell = (x: number, y: number) => (
    isInsideBounds(bounds, x, y) && occupied.has(cellKey(x, y))
  );

  for (let y = bounds.top; y <= bounds.bottom; y += 1) {
    for (let x = bounds.left; x <= bounds.right; x += 1) {
      if (!occupied.has(cellKey(x, y))) continue;

      if (!hasCell(x, y - 1)) {
        edges.push({ start: { x, y }, end: { x: x + 1, y }, direction: 0 });
      }
      if (!hasCell(x + 1, y)) {
        edges.push({ start: { x: x + 1, y }, end: { x: x + 1, y: y + 1 }, direction: 1 });
      }
      if (!hasCell(x, y + 1)) {
        edges.push({ start: { x: x + 1, y: y + 1 }, end: { x, y: y + 1 }, direction: 2 });
      }
      if (!hasCell(x - 1, y)) {
        edges.push({ start: { x, y: y + 1 }, end: { x, y }, direction: 3 });
      }
    }
  }

  return edges;
}

function chooseNextEdge(
  incomingDirection: Edge["direction"],
  candidates: readonly number[],
  edges: readonly Edge[],
): number {
  // At a diagonal-only contact there are two legal continuations. Taking the
  // right turn first keeps the two orthogonally disconnected regions as two
  // loops instead of producing a self-touching figure-eight path.
  const turnPriority = [1, 0, 3, 2] as const;
  for (const wantedTurn of turnPriority) {
    const candidate = candidates.find((index) => (
      (edges[index]!.direction - incomingDirection + 4) % 4 === wantedTurn
    ));
    if (candidate !== undefined) return candidate;
  }
  throw new Error("Cell-union boundary contains an untraceable vertex.");
}

function traceBoundaryLoops(edges: readonly Edge[]): readonly (readonly Point[])[] {
  const outgoingByPoint = new Map<string, number[]>();
  edges.forEach((edge, index) => {
    const key = pointKey(edge.start);
    const outgoing = outgoingByPoint.get(key);
    if (outgoing) outgoing.push(index);
    else outgoingByPoint.set(key, [index]);
  });

  const unused = new Set(edges.map((_, index) => index));
  const loops: Point[][] = [];

  while (unused.size > 0) {
    const firstIndex = unused.values().next().value as number;
    const firstEdge = edges[firstIndex]!;
    const loop: Point[] = [firstEdge.start];
    let edgeIndex = firstIndex;

    for (let safety = 0; safety <= edges.length; safety += 1) {
      const edge = edges[edgeIndex]!;
      unused.delete(edgeIndex);
      loop.push(edge.end);

      if (pointsEqual(edge.end, loop[0]!)) break;

      const candidates = (outgoingByPoint.get(pointKey(edge.end)) ?? [])
        .filter((candidate) => unused.has(candidate));
      if (candidates.length === 0) {
        throw new Error("Cell-union boundary ended before returning to its start.");
      }
      edgeIndex = candidates.length === 1
        ? candidates[0]!
        : chooseNextEdge(edge.direction, candidates, edges);

      if (safety === edges.length) {
        throw new Error("Cell-union boundary exceeded its finite edge count.");
      }
    }

    loops.push(loop.slice(0, -1));
  }

  return loops;
}

function removeCollinearPoints(loop: readonly Point[]): readonly Point[] {
  return loop.filter((point, index) => {
    const previous = loop[(index - 1 + loop.length) % loop.length]!;
    const next = loop[(index + 1) % loop.length]!;
    const incomingX = point.x - previous.x;
    const incomingY = point.y - previous.y;
    const outgoingX = next.x - point.x;
    const outgoingY = next.y - point.y;
    return incomingX * outgoingY - incomingY * outgoingX !== 0;
  });
}

function segmentLength(first: Point, second: Point): number {
  return Math.abs(second.x - first.x) + Math.abs(second.y - first.y);
}

function unitVector(first: Point, second: Point): Point {
  const length = segmentLength(first, second);
  return {
    x: (second.x - first.x) / length,
    y: (second.y - first.y) / length,
  };
}

function roundedCorners(loop: readonly Point[], radius: number): readonly RoundedCorner[] {
  return loop.map((point, index) => {
    const previous = loop[(index - 1 + loop.length) % loop.length]!;
    const next = loop[(index + 1) % loop.length]!;
    const incoming = unitVector(previous, point);
    const outgoing = unitVector(point, next);
    const effectiveRadius = Math.min(
      radius,
      MAX_CELL_CORNER_RADIUS,
      segmentLength(previous, point) / 2,
      segmentLength(point, next) / 2,
    );
    const turn = incoming.x * outgoing.y - incoming.y * outgoing.x;

    return {
      entry: {
        x: point.x - incoming.x * effectiveRadius,
        y: point.y - incoming.y * effectiveRadius,
      },
      exit: {
        x: point.x + outgoing.x * effectiveRadius,
        y: point.y + outgoing.y * effectiveRadius,
      },
      radius: effectiveRadius,
      // Positive cross products are visually clockwise in SVG coordinates.
      sweep: turn > 0 ? 1 : 0,
    };
  });
}

function formatNumber(value: number): string {
  const rounded = Math.abs(value) < 0.0000005 ? 0 : Number(value.toFixed(6));
  return String(rounded);
}

function formatPoint(point: Point): string {
  return `${formatNumber(point.x)} ${formatNumber(point.y)}`;
}

function loopPath(loop: readonly Point[], radius: number): string {
  const corners = roundedCorners(removeCollinearPoints(loop), radius);
  if (corners.length === 0) return "";

  const commands = [`M ${formatPoint(corners[0]!.entry)}`];
  corners.forEach((corner, index) => {
    if (corner.radius > 0) {
      const formattedRadius = formatNumber(corner.radius);
      commands.push(
        `A ${formattedRadius} ${formattedRadius} 0 0 ${corner.sweep} ${formatPoint(corner.exit)}`,
      );
    } else {
      commands.push(`L ${formatPoint(corner.exit)}`);
    }

    const nextEntry = corners[(index + 1) % corners.length]!.entry;
    if (!pointsEqual(corner.exit, nextEntry)) {
      commands.push(`L ${formatPoint(nextEntry)}`);
    }
  });
  commands.push("Z");
  return commands.join(" ");
}

/**
 * Trace the union of all occupied orthogonal cells as one rounded SVG path.
 *
 * The returned subpaths contain no internal cell edges. Holes and diagonally
 * touching components remain independent loops and are resolved by the even-odd
 * fill rule. Coordinates are never rebased, so patterns remain anchored to the
 * same world position as a camera moves.
 */
export function createRoundedCellUnionPath(
  bounds: CellUnionBounds,
  isOccupied: CellPredicate,
  radius = DEFAULT_TERRAIN_CORNER_RADIUS,
): RoundedCellUnionPath {
  validateBounds(bounds);
  validateRadius(radius);

  const occupied = collectOccupiedCells(bounds, isOccupied);
  if (occupied.size === 0) return EMPTY_PATH;

  const loops = traceBoundaryLoops(collectBoundaryEdges(bounds, occupied));
  return {
    d: loops.map((loop) => loopPath(loop, radius)).filter(Boolean).join(" "),
    fillRule: "evenodd",
    loopCount: loops.length,
  };
}

function validateTerrainCamera(level: TerrainGrid, camera: TerrainCamera): void {
  if (!Number.isInteger(level.width) || !Number.isInteger(level.height)
    || level.width < 1 || level.height < 1) {
    throw new RangeError("Terrain grid dimensions must be positive integers.");
  }
  validateBounds(camera);
  if (camera.left < 0 || camera.top < 0
    || camera.right >= level.width || camera.bottom >= level.height) {
    throw new RangeError("Terrain camera must stay inside the terrain grid.");
  }
}

/**
 * Trace selected terrain around a camera using a one-cell offscreen gutter.
 * The gutter prevents a region continuing beyond the camera from acquiring an
 * artificial rounded edge at the viewport boundary.
 */
export function createRoundedTerrainPath(
  level: TerrainGrid,
  camera: TerrainCamera,
  selection: TerrainKind | TerrainPredicate,
  radius = DEFAULT_TERRAIN_CORNER_RADIUS,
): RoundedCellUnionPath {
  validateTerrainCamera(level, camera);
  const matches: TerrainPredicate = typeof selection === "function"
    ? selection
    : (terrain) => terrain === selection;
  const gutterBounds: CellUnionBounds = {
    left: Math.max(0, camera.left - 1),
    top: Math.max(0, camera.top - 1),
    right: Math.min(level.width - 1, camera.right + 1),
    bottom: Math.min(level.height - 1, camera.bottom + 1),
  };

  return createRoundedCellUnionPath(
    gutterBounds,
    (x, y) => {
      const terrain = level.terrain[y]?.[x];
      return terrain === undefined ? false : matches(terrain, x, y);
    },
    radius,
  );
}
