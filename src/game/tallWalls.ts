import { createRectilinearUnionGeometry, type RoundedTerrainGeometry } from "./terrainGeometry";
import type { LevelDefinition, Point } from "./types";

/** Fixed dollhouse projection P(x,y,z)=(x+.18z,y-z). Equal exposed cap
 * widths, with a bounded foreground overlap. Logical terrain never changes. */
export const TALL_WALL_HEIGHT = .81;
export const WALL_REAR_OVERLAP = .28;
export const WALL_CAP_WIDTH = 1 - TALL_WALL_HEIGHT + WALL_REAR_OVERLAP;
// Halfway between the north wall's front foot and the south wall's rear foot.
export const FIELD_GROUND_Y = (1 + TALL_WALL_HEIGHT - WALL_REAR_OVERLAP) / 2;
export const TALL_WALL_SKEW = .18;
export const TALL_WALL_REVISION = "04c-balanced-v2";
const p = (p: Point) => `${Number(p.x.toFixed(5))} ${Number(p.y.toFixed(5))}`;
const quad = (a: Point, b: Point, c: Point, d: Point) => `M${p(a)}L${p(b)}L${p(c)}L${p(d)}Z`;

function boundarySegments(geometry: RoundedTerrainGeometry, visit: (a: Point, b: Point, normal: Point) => void) {
  for (const edge of geometry.edges) visit(edge.entry, edge.exit, edge.normal);
  for (const c of geometry.corners) {
    if (!c.radius) continue;
    const sign = c.sweep ? 1 : -1;
    const angle = Math.atan2(c.entry.y - c.center.y, c.entry.x - c.center.x);
    const at = (t: number) => ({ x: c.center.x + c.radius * Math.cos(angle + sign * t * Math.PI / 2), y: c.center.y + c.radius * Math.sin(angle + sign * t * Math.PI / 2) });
    for (let i = 0; i < 5; i++) {
      const a = angle + sign * (i + .5) / 5 * Math.PI / 2;
      visit(at(i / 5), at((i + 1) / 5), { x: sign * Math.cos(a), y: sign * Math.sin(a) });
    }
  }
}

export function createTallWallGeometry(level: Pick<LevelDefinition, "width" | "height" | "terrain">, _base: RoundedTerrainGeometry, toLight: Point) {
  const h = TALL_WALL_HEIGHT, dx = h * TALL_WALL_SKEW;
  const wall = (x: number, y: number) => level.terrain[y]?.[x] === "wall";
  const inset = (1 - WALL_CAP_WIDTH) / 2;
  const columns = Array.from({ length: level.width }, (_, x) => [x, x + inset, x + 1 - inset]).flat().concat(level.width);
  const rows = Array.from({ length: level.height }, (_, y) => [y, y + h - WALL_REAR_OVERLAP]).flat().concat(level.height);
  // Close the exterior strips beyond the viewport, including the rounded
  // corners and lifted south cap. Interior cap edges/feet stay identical.
  columns[0] = -dx - .13;
  columns[columns.length - 1] = level.width + .13;
  rows[0] = -.13;
  rows[rows.length - 1] = level.height + h + .13;
  const cap = createRectilinearUnionGeometry(columns, rows, (sx, sy) => {
    const x = Math.floor(sx / 3), y = Math.floor(sy / 2);
    return wall(x, y) && (y === 0 || sy % 2 === 1 || wall(x, y - 1))
      && (x === 0 || sx % 3 !== 0 || wall(x - 1, y) && (y === 0 || sy % 2 === 1 || wall(x - 1, y - 1)))
      && (x === level.width - 1 || sx % 3 !== 2 || wall(x + 1, y) && (y === 0 || sy % 2 === 1 || wall(x + 1, y - 1)));
  }, .13);
  const lift = (v: Point) => ({ x: v.x + dx, y: v.y - h });
  const shades: string[][] = Array.from({ length: 5 }, () => []), rims: string[] = [];
  boundarySegments(cap, (a, b, normal) => {
    const response = normal.x * toLight.x + normal.y * toLight.y;
    if (-TALL_WALL_SKEW * normal.x + normal.y > .001) {
      const bucket = Math.min(4, Math.max(0, Math.round((1 - response) * 2)));
      shades[bucket]!.push(quad(a, b, lift(b), lift(a)));
    }
    if (response > .25) rims.push(`M${p(lift(a))}L${p(lift(b))}`);
  });
  const shadow: string[] = [];
  const cast = { x: -toLight.x * .30, y: -toLight.y * .30 };
  boundarySegments(cap, (a, b, normal) => {
    if (normal.x * cast.x + normal.y * cast.y > .001) shadow.push(quad(a, b, { x: b.x + cast.x, y: b.y + cast.y }, { x: a.x + cast.x, y: a.y + cast.y }));
  });
  return { cap, footprint: cap, dx, height: h,
    sides: shades.map(paths => paths.join("")), rim: rims.join(""), shadow: shadow.join("") };
}
