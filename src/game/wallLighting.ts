import type { LevelDefinition, Point } from "./types";
import type { RoundedTerrainGeometry } from "./terrainGeometry";

/** Legacy bearings retained: no map, seed, fingerprint or save migration. */
export function resolveWallLight(level: Pick<LevelDefinition, "id" | "lightDirection">) {
  const fallback = (["top", "right", "bottom", "left"] as const)[
    [...level.id].reduce((sum, character) => sum + character.charCodeAt(0), 0) % 4
  ] ?? "top";
  const direction = level.lightDirection ?? fallback;
  const toLight = { top: { x: 0, y: -1 }, right: { x: 1, y: 0 },
    bottom: { x: 0, y: 1 }, left: { x: -1, y: 0 } }[direction];
  return { toLight, cast: { x: -toLight.x || 0, y: -toLight.y || 0 } };
}

/** Versioned, catalogue-selected material response. No asset/name inference. */
export const WALL_LIGHTING_PROFILES = {
  stone: { height: .25, bevel: .05, highlight: "#fff1cf", shade: "#63507c", side: "#675379", sideOpacity: .62 },
  pale: { height: .24, bevel: .045, highlight: "#fff0ca", shade: "#55664d", side: "#51604e", sideOpacity: .64 },
  dark: { height: .25, bevel: .055, highlight: "#c8b8e8", shade: "#665277", side: "#4e3d68", sideOpacity: .48 },
  foliage: { height: .20, bevel: .045, highlight: "#d4e9ae", shade: "#48624e", side: "#425d49", sideOpacity: .58 },
  crystal: { height: .26, bevel: .045, highlight: "#efdaff", shade: "#70578f", side: "#624786", sideOpacity: .58 },
  bramble: { height: .23, bevel: .045, highlight: "#edb9d0", shade: "#785272", side: "#664359", sideOpacity: .52 },
} as const;
export const WALL_LIGHTING_REVISION = "04a-r1";
export type WallLightingProfileId = keyof typeof WALL_LIGHTING_PROFILES;

function point(p: Point): string {
  return `${Number(p.x.toFixed(5))} ${Number(p.y.toFixed(5))}`;
}
function quad(a: Point, b: Point, c: Point, d: Point) {
  return `M${point(a)}L${point(b)}L${point(c)}L${point(d)}Z`;
}

/** The cap is W intersected with W shifted up. Its inward boundary band is the
 * union of BOTH contributing contour bands, clipped to that same intersection.
 * Original rear rims remain; the projected front rim follows the complete exact
 * arc, not a discontinuous per-normal lift. Each response is one nonzero-filled
 * path so coincident vertical strips cannot accumulate translucent paint. */
export function buildWallLighting(geometry: RoundedTerrainGeometry, toLight: Point,
  profile: { readonly height: number; readonly bevel: number }) {
  const lit: string[] = [], shade: string[] = [];
  for (const lift of [0, profile.height]) {
  for (const edge of geometry.edges) {
    const { normal, entry, exit } = edge;
    const a = { x: entry.x, y: entry.y - lift }, b = { x: exit.x, y: exit.y - lift };
    const c = { x: b.x - normal.x * profile.bevel, y: b.y - normal.y * profile.bevel };
    const d = { x: a.x - normal.x * profile.bevel, y: a.y - normal.y * profile.bevel };
    const response = normal.x * toLight.x + normal.y * toLight.y;
    if (response > .1) lit.push(quad(a, b, c, d));
    else if (response < -.1) shade.push(quad(a, b, c, d));
  }
  for (const corner of geometry.corners) {
    if (!corner.radius) continue;
    const { center, radius, sweep } = corner;
    const sign = sweep ? 1 : -1;
    const from = Math.atan2(corner.entry.y - center.y, corner.entry.x - center.x);
    // Three broad response sectors per exact canonical quarter arc; never a
    // pixel-dependent tessellation. Re-entrant corners stay shade/neutral.
    for (let i = 0; i < 3; i++) {
      const a = from + sign * i * Math.PI / 6, b = a + sign * Math.PI / 6;
      const nx = Math.cos((a + b) / 2) * sign, ny = Math.sin((a + b) / 2) * sign;
      const at = (angle: number, r: number) => ({ x: center.x + Math.cos(angle) * r,
        y: center.y + Math.sin(angle) * r - lift });
      const innerRadius = radius - sign * profile.bevel;
      const d = `M${point(at(a, radius))}A${radius} ${radius} 0 0 ${sweep} ${point(at(b, radius))}L${point(at(b, innerRadius))}A${innerRadius} ${innerRadius} 0 0 ${1 - sweep} ${point(at(a, innerRadius))}Z`;
      const response = nx * toLight.x + ny * toLight.y;
      if (sweep && response > .1) lit.push(d);
      else if (response < -.1) shade.push(d);
    }
  }
  }
  return { lit: lit.join(""), shade: shade.join("") };
}

/** Cardinal finite sweep: translated cap plus outward edge/arc ribbons. Render
 * the cap (evenodd) and ribbons (nonzero) inside ONE opacity group, then clip to
 * the receiver. This preserves holes without doubled overlap or detached corner
 * shadows. Supports the current cardinal light contract; no diagonal shortcut. */
export function buildWallCast(geometry: RoundedTerrainGeometry, cast: Point, height: number) {
  const distance = Math.min(.24, height * .85);
  const offset = { x: cast.x * distance, y: cast.y * distance };
  const shift = (p: Point) => ({ x: p.x + offset.x, y: p.y + offset.y });
  const ribbons: string[] = [];
  for (const { entry, exit, normal } of geometry.edges) {
    if (normal.x * cast.x + normal.y * cast.y > .01) {
      ribbons.push(quad(entry, shift(entry), shift(exit), exit));
    }
  }
  for (const { entry, exit, center, radius, sweep } of geometry.corners) {
    if (!radius) continue;
    const from = Math.atan2(entry.y - center.y, entry.x - center.x);
    const sign = sweep ? 1 : -1;
    const mid = from + sign * Math.PI / 4;
    if (sign * (Math.cos(mid) * cast.x + Math.sin(mid) * cast.y) <= .01) continue;
    ribbons.push(`M${point(entry)}L${point(shift(entry))}A${radius} ${radius} 0 0 ${sweep} ${point(shift(exit))}L${point(exit)}A${radius} ${radius} 0 0 ${1 - sweep} ${point(entry)}Z`);
  }
  return { offset, ribbons: ribbons.join("") };
}
