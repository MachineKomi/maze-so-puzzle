import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { CURATED_LEVELS } from "./levels";
import { createRoundedCellUnionGeometry, type RoundedCorner, type RoundedTerrainGeometry } from "./terrainGeometry";
import { createTallWallGeometry } from "./tallWalls";
import type { LevelDefinition, Point } from "./types";
import { MazeForeground } from "../ui/game/MazeForeground";

type Rect = { left: number; top: number; right: number; bottom: number };
const EPS = 1e-8;
const inside = (p: Point, r: Rect) => p.x > r.left + EPS && p.x < r.right - EPS && p.y > r.top + EPS && p.y < r.bottom - EPS;
const box = (points: readonly Point[]): Rect => ({ left: Math.min(...points.map(p => p.x)), right: Math.max(...points.map(p => p.x)), top: Math.min(...points.map(p => p.y)), bottom: Math.max(...points.map(p => p.y)) });
const overlaps = (a: Rect, b: Rect) => a.right > b.left + EPS && a.left < b.right - EPS && a.bottom > b.top + EPS && a.top < b.bottom - EPS;

// Independent polygon/rectangle clipping checks the entire emitted face,
// including thin intersections between the old uniformly sampled cap points.
function clippedArea(polygon: readonly Point[], r: Rect): number {
  let points = [...polygon];
  for (const [axis, boundary, sign] of [["x", r.left, 1], ["x", r.right, -1], ["y", r.top, 1], ["y", r.bottom, -1]] as const) {
    const result: Point[] = [];
    for (let i = 0; i < points.length; i++) {
      const a = points[i]!, b = points[(i + 1) % points.length]!;
      const aIn = sign * (a[axis] - boundary) >= 0, bIn = sign * (b[axis] - boundary) >= 0;
      if (aIn) result.push(a);
      if (aIn !== bIn) {
        const t = (boundary - a[axis]) / (b[axis] - a[axis]);
        result.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      }
    }
    points = result;
  }
  return Math.abs(points.reduce((sum, a, i) => { const b = points[(i + 1) % points.length]!; return sum + a.x * b.y - b.x * a.y; }, 0)) / 2;
}

function sideQuads(paths: readonly string[]): Point[][] {
  return paths.flatMap(path => path.split("M").slice(1).map(part => {
    // Fail closed if the renderer stops emitting the documented quad grammar.
    expect(part).toMatch(/^-?[\d.]+ -?[\d.]+(?:L-?[\d.]+ -?[\d.]+){3}Z$/);
    const values = part.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
    return Array.from({ length: 4 }, (_, i) => ({ x: values[i * 2]!, y: values[i * 2 + 1]! }));
  }));
}

// Membership cannot change between exact intersections with a rectangle edge.
// These midpoint classifications cover analytic intervals, not a sample grid.
function intervalEnters(at: (t: number) => Point, events: readonly number[], r: Rect): boolean {
  const cuts = [0, 1, ...events.filter(t => t > 0 && t < 1)].sort((a, b) => a - b);
  return cuts.some((t, i) => inside(at(t), r) || i > 0 && inside(at((t + cuts[i - 1]!) / 2), r));
}
function lineEnters(a: Point, b: Point, r: Rect): boolean {
  const dx = b.x - a.x, dy = b.y - a.y;
  return intervalEnters(t => ({ x: a.x + dx * t, y: a.y + dy * t }), [
    ...(dx ? [(r.left - a.x) / dx, (r.right - a.x) / dx] : []),
    ...(dy ? [(r.top - a.y) / dy, (r.bottom - a.y) / dy] : []),
  ], r);
}
function arcEnters(c: RoundedCorner, r: Rect): boolean {
  if (!c.radius) return false;
  const start = Math.atan2(c.entry.y - c.center.y, c.entry.x - c.center.x), sign = c.sweep ? 1 : -1;
  const angles: number[] = [];
  for (const x of [r.left, r.right]) {
    const v = (x - c.center.x) / c.radius;
    if (Math.abs(v) <= 1) angles.push(Math.acos(v), -Math.acos(v));
  }
  for (const y of [r.top, r.bottom]) {
    const v = (y - c.center.y) / c.radius;
    if (Math.abs(v) <= 1) angles.push(Math.asin(v), Math.PI - Math.asin(v));
  }
  const tau = Math.PI * 2;
  return intervalEnters(t => ({ x: c.center.x + c.radius * Math.cos(start + sign * t * Math.PI / 2), y: c.center.y + c.radius * Math.sin(start + sign * t * Math.PI / 2) }),
    angles.map(angle => (((angle - start) * sign % tau + tau) % tau) / (Math.PI / 2)), r);
}

// Even-odd membership also catches a forbidden rectangle wholly enclosed by
// cap fill, where testing boundary intersections alone would incorrectly pass.
function capContains(g: RoundedTerrainGeometry, p: Point): boolean {
  let crossings = 0;
  for (const { entry: a, exit: b } of g.edges) {
    if ((a.y > p.y) !== (b.y > p.y) && a.x + (p.y - a.y) * (b.x - a.x) / (b.y - a.y) > p.x) crossings++;
  }
  for (const c of g.corners) {
    if (!c.radius || p.y < Math.min(c.entry.y, c.exit.y) || p.y >= Math.max(c.entry.y, c.exit.y)) continue;
    const signX = Math.sign(c.entry.x + c.exit.x - 2 * c.center.x);
    const x = c.center.x + signX * Math.sqrt(Math.max(0, c.radius ** 2 - (p.y - c.center.y) ** 2));
    if (x > p.x) crossings++;
  }
  return crossings % 2 === 1;
}

const localMasks = Array.from({ length: 512 }, (_, mask): LevelDefinition => ({
  ...CURATED_LEVELS[0]!, id: `coverage-mask-${mask}`, width: 3, height: 3,
  terrain: Array.from({ length: 3 }, (_, y) => Array.from({ length: 3 }, (_, x) => mask & 1 << (y * 3 + x) ? "wall" : "floor")),
}));
const cases = [...CURATED_LEVELS, ...localMasks];
function forbiddenCells(level: LevelDefinition): Rect[] {
  const result: Rect[] = [];
  for (let y = 0; y < level.height; y++) for (let x = 0; x < level.width; x++) {
    if (level.terrain[y]?.[x] !== "wall") result.push({ left: x, right: x + 1, top: y,
      // Human limit, deliberately independent of the implementation overlap.
      bottom: y + (level.terrain[y + 1]?.[x] === "wall" ? .70 : 1) });
  }
  return result;
}

describe("tall wall continuous geometry coverage", () => {
  it("detects face interiors, curved bulges and wholly enclosed forbidden regions", () => {
    const r = { left: .4, right: .6, top: .4, bottom: .6 };
    expect(clippedArea([{ x: 0, y: .49 }, { x: 1, y: .49 }, { x: 1, y: .51 }, { x: 0, y: .51 }], r)).toBeCloseTo(.004);
    const c = { entry: { x: 1, y: 0 }, exit: { x: 0, y: 1 }, center: { x: 0, y: 0 }, radius: 1, sweep: 1 as const };
    const bulge = { left: .706, right: .708, top: .706, bottom: .708 };
    expect(lineEnters(c.entry, c.exit, bulge)).toBe(false);
    expect(arcEnters(c, bulge)).toBe(true);
    const solid = createRoundedCellUnionGeometry({ left: 0, top: 0, right: 2, bottom: 2 }, () => true, .13);
    const ring = createRoundedCellUnionGeometry({ left: 0, top: 0, right: 2, bottom: 2 }, (x, y) => x !== 1 || y !== 1, .13);
    expect(capContains(solid, { x: 1.5, y: 1.5 })).toBe(true);
    expect(capContains(ring, { x: 1.5, y: 1.5 })).toBe(false);
  });

  it("keeps full side fills and true rounded cap fill inside walls or the allowed rear30% bands", () => {
    for (const level of cases) {
      const bounds = { left: 0, top: 0, right: level.width - 1, bottom: level.height - 1 };
      const base = createRoundedCellUnionGeometry(bounds, (x, y) => level.terrain[y]?.[x] === "wall", .13);
      const tall = createTallWallGeometry(level, base, { x: 0, y: -1 });
      const lift = (p: Point) => ({ x: p.x + tall.dx, y: p.y - tall.height });
      const cap: RoundedTerrainGeometry = { ...tall.cap,
        edges: tall.cap.edges.map(e => ({ ...e, start: lift(e.start), end: lift(e.end), entry: lift(e.entry), exit: lift(e.exit) })),
        corners: tall.cap.corners.map(c => ({ ...c, entry: lift(c.entry), exit: lift(c.exit), center: lift(c.center) })),
      };
      const faces = sideQuads(tall.sides).map(points => ({ points, bounds: box(points) }));
      for (const r of forbiddenCells(level)) {
        const label = `${level.id}: forbidden cell ${r.left},${r.top}`;
        expect(faces.some(face => overlaps(face.bounds, r) && clippedArea(face.points, r) > EPS), `${label}: side fill`).toBe(false);
        expect(cap.edges.some(e => lineEnters(e.entry, e.exit, r)), `${label}: cap line`).toBe(false);
        expect(cap.corners.some(c => arcEnters(c, r)), `${label}: true cap arc`).toBe(false);
        expect(capContains(cap, { x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2 }), `${label}: enclosed cap fill`).toBe(false);
      }
    }
  });

  it("clips the reused foreground volume only to directly adjacent rear bands", () => {
    for (const level of cases) {
      const html = renderToStaticMarkup(<MazeForeground level={level} volumeId="coverage-volume" style={{}} />);
      expect(html).toContain('href="#coverage-volume"');
      expect(html).toContain('clip-path="url(#coverage-volume-foreground)"');
      const d = html.match(/<clipPath id="coverage-volume-foreground"><path d="([^"]*)"/);
      expect(d, level.id).not.toBeNull();
      const bands = d![1]!.split("M").slice(1);
      let expected = 0;
      for (let y = 1; y < level.height; y++) for (let x = 0; x < level.width; x++)
        if (level.terrain[y]?.[x] === "wall" && level.terrain[y - 1]?.[x] !== "wall") expected++;
      expect(bands.length, level.id).toBe(expected);
      for (const band of bands) {
        const match = band.match(/^(-?[\d.]+) (-?[\d.]+)h1v([\d.]+)h-1Z$/);
        expect(match, `${level.id}: foreground grammar`).not.toBeNull();
        const x = Number(match![1]), top = Number(match![2]), depth = Number(match![3]), bottom = top + depth;
        const row = Math.round(bottom);
        expect(Number.isInteger(x) && x >= 0 && x < level.width && row >= 1 && row < level.height).toBe(true);
        expect(bottom).toBeCloseTo(row, 8);
        expect(depth > 0 && depth <= .30 + EPS).toBe(true);
        expect(top).toBeGreaterThanOrEqual(row - .30 - EPS);
        expect(level.terrain[row - 1]?.[x]).not.toBe("wall");
        expect(level.terrain[row]?.[x]).toBe("wall");
      }
    }
  });
});
