import type { Point } from "./types";

/** The default number of maze tiles shown along each side of the camera. */
export const DEFAULT_FOV_SIZE = 6;

/** Stable, serializable coordinate key used by the explored-map fog of war. */
export type TileKey = `${number},${number}`;

export interface GridSize {
  readonly width: number;
  readonly height: number;
}

/** Use the player-following camera whenever the full grid exceeds its view. */
export function shouldUseExplorationView(grid: GridSize): boolean {
  return grid.width > DEFAULT_FOV_SIZE || grid.height > DEFAULT_FOV_SIZE;
}

/**
 * A world viewport. Integer callers retain inclusive last-cell origins in
 * right/bottom; continuous outer edges are left+width and top+height.
 * Width and height are clamped to the grid. Semantic coverage is centre-based.
 */
export interface CameraWindow {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly width: number;
  readonly height: number;
}

function assertPositiveInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`${label} must be a positive integer.`);
  }
}

function assertPointInGrid(grid: GridSize, point: Point): void {
  if (
    !Number.isInteger(point.x) ||
    !Number.isInteger(point.y) ||
    point.x < 0 ||
    point.y < 0 ||
    point.x >= grid.width ||
    point.y >= grid.height
  ) {
    throw new RangeError("The camera focus must be a tile inside the grid.");
  }
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

/** Convert a tile coordinate to its canonical explored-map key. */
export function toTileKey(point: Point): TileKey {
  return `${point.x},${point.y}`;
}

/**
 * Calculate a player-following camera window. Odd windows have one centre tile;
 * even windows place the player in the upper-left of the central four tiles so
 * the extra visible tile is consistently to the right and below. Near a level
 * boundary the window slides until it meets that boundary, preserving its
 * requested size whenever the grid permits it.
 */
export function getCameraWindow(
  grid: GridSize,
  focus: Point,
  fovSize: number | GridSize = DEFAULT_FOV_SIZE,
): CameraWindow {
  assertPositiveInteger(grid.width, "Grid width");
  assertPositiveInteger(grid.height, "Grid height");
  if (typeof fovSize === "number") assertPositiveInteger(fovSize, "Field-of-view size");
  else if (![fovSize.width,fovSize.height].every(n=>Number.isFinite(n)&&n>0)) throw new RangeError("Viewport axes must be finite and positive.");
  assertPointInGrid(grid, focus);

  const width = Math.min(grid.width, typeof fovSize === "number" ? fovSize : fovSize.width);
  const height = Math.min(grid.height, typeof fovSize === "number" ? fovSize : fovSize.height);
  const left = clamp(focus.x - Math.floor((width - 1) / 2), 0, grid.width - width);
  const top = clamp(focus.y - Math.floor((height - 1) / 2), 0, grid.height - height);

  return {
    left,
    top,
    right: left + width - 1,
    bottom: top + height - 1,
    width,
    height,
  };
}

/** Continuous extent is [left,left+width) × [top,top+height). The legacy right/
 * bottom fields name the last cell origin, not the continuous outer edge.
 * A tile becomes known when its CENTRE enters the viewport. Exclude numerical
 * slivers and never use the padded rendering gutter for map/Book discovery. */
export function visibleKeysInWindow(grid: GridSize, view: CameraWindow): readonly TileKey[] {
  const keys: TileKey[] = [];
  for (let y=Math.max(0,Math.ceil(view.top-.5-1e-7)); y<Math.min(grid.height,view.top+view.height-.5-1e-7); y++) {
    for (let x=Math.max(0,Math.ceil(view.left-.5-1e-7)); x<Math.min(grid.width,view.left+view.width-.5-1e-7); x++) keys.push(toTileKey({x,y}));
  }
  return keys;
}

/** Return every currently visible tile in stable row-major order. */
export function getVisibleTiles(
  grid: GridSize,
  focus: Point,
  fovSize = DEFAULT_FOV_SIZE,
): readonly Point[] {
  const window = getCameraWindow(grid, focus, fovSize);
  const tiles: Point[] = [];

  for (let y = window.top; y <= window.bottom; y += 1) {
    for (let x = window.left; x <= window.right; x += 1) {
      tiles.push({ x, y });
    }
  }

  return tiles;
}

/** Return the currently visible tile keys in stable row-major order. */
export function getVisibleTileKeys(
  grid: GridSize,
  focus: Point,
  fovSize = DEFAULT_FOV_SIZE,
): readonly TileKey[] {
  return getVisibleTiles(grid, focus, fovSize).map(toTileKey);
}

/**
 * Accumulate the current view into an explored-map set without mutating the
 * caller's set. Re-revealing a tile is idempotent.
 */
export function revealVisibleTiles(
  revealed: Iterable<TileKey>,
  grid: GridSize,
  focus: Point,
  fovSize = DEFAULT_FOV_SIZE,
): ReadonlySet<TileKey> {
  const next = new Set(revealed);
  for (const key of getVisibleTileKeys(grid, focus, fovSize)) {
    next.add(key);
  }
  return next;
}
