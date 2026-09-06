import { createRectilinearUnionGeometry, type RoundedTerrainGeometry } from "./terrainGeometry";
import type { LevelDefinition, Point } from "./types";

/** A fixed dollhouse section, measured against the unchanged standing Ame art.
 * P(x,y,z)=(x+.18z,y-z). Full height is 1.15 × Ame's visible standing height.
 * Trim the rear/east cap where it would cover ANY non-wall cell. This is visual
 * receiver protection, not walkability: hazards retain their own surfaces/rules. */
export const TALL_WALL_HEIGHT = .92 * (.90 - .060546875) * 1.15;
export const TALL_WALL_SKEW = .18;
export const TALL_WALL_REVISION = "04b-section-v1";
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

export function createTallWallGeometry(level: Pick<LevelDefinition, "width" | "height" | "terrain">, base: RoundedTerrainGeometry, toLight: Point) {
  const h = TALL_WALL_HEIGHT, dx = h * TALL_WALL_SKEW;
  const wall = (x: number, y: number) => level.terrain[y]?.[x] === "wall";
  // Both cuts leave the projected cap inside its blocked ground cell. Adjacent
  // wall cells keep full caps, traced as one union without internal cell seams.
  const columns = Array.from({ length: level.width }, (_, x) => [x, x + 1 - dx - .015]).flat().concat(level.width);
  const rows = Array.from({ length: level.height }, (_, y) => [y, y + h + .015]).flat().concat(level.height);
  const cap = createRectilinearUnionGeometry(columns, rows, (sx, sy) => {
    const x = Math.floor(sx / 2), y = Math.floor(sy / 2);
    return wall(x, y) && (sy % 2 === 1 || wall(x, y - 1))
      && (sx % 2 === 0 || wall(x + 1, y) && (sy % 2 === 1 || wall(x + 1, y - 1)));
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
  const cast = { x: -toLight.x * .18, y: -toLight.y * .18 };
  boundarySegments(base, (a, b, normal) => {
    if (normal.x * cast.x + normal.y * cast.y > .001) shadow.push(quad(a, b, { x: b.x + cast.x, y: b.y + cast.y }, { x: a.x + cast.x, y: a.y + cast.y }));
  });
  return { cap, dx, height: h, sides: shades.map(paths => paths.join("")), rim: rims.join(""), shadow: shadow.join("") };
}
