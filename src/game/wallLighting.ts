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
  stone: { height: .12, bevel: .05, highlight: "#fff1cf", shade: "#63507c", side: "#675379", sideOpacity: .36 },
  pale: { height: .11, bevel: .045, highlight: "#fff0ca", shade: "#55664d", side: "#51604e", sideOpacity: .42 },
  dark: { height: .13, bevel: .055, highlight: "#bbabda", shade: "#51445f", side: "#382e50", sideOpacity: .32 },
  foliage: { height: .085, bevel: .045, highlight: "#d4e9ae", shade: "#48624e", side: "#425d49", sideOpacity: .34 },
  crystal: { height: .12, bevel: .045, highlight: "#efdaff", shade: "#70578f", side: "#513c75", sideOpacity: .36 },
  bramble: { height: .10, bevel: .045, highlight: "#edb9d0", shade: "#785272", side: "#53344f", sideOpacity: .32 },
} as const;
export const WALL_LIGHTING_REVISION = "04a-v1";
export type WallLightingProfileId = keyof typeof WALL_LIGHTING_PROFILES;

function point(p: Point): string {
  return `${Number(p.x.toFixed(5))} ${Number(p.y.toFixed(5))}`;
}
function quad(a: Point, b: Point, c: Point, d: Point) {
  return `M${point(a)}L${point(b)}L${point(c)}L${point(d)}Z`;
}

/** Two signed compound paths, independent of cell count. Convex arcs use three
 * broad sectors; masks use the exact original silhouette.
 * Side faces are screen-down and INSIDE the footprint, never on walkable floor. */
export function buildWallLighting(geometry: RoundedTerrainGeometry, toLight: Point,
  profile: typeof WALL_LIGHTING_PROFILES[WallLightingProfileId]) {
  const lit: string[] = [], shade: string[] = [];
  for (const edge of geometry.edges) {
    const { normal, entry, exit } = edge;
    const lift = normal.y > 0 ? profile.height : 0;
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
      const lift = ny > .01 ? profile.height : 0;
      const at = (angle: number, r: number) => ({ x: center.x + Math.cos(angle) * r,
        y: center.y + Math.sin(angle) * r - lift });
      const innerRadius = radius - sign * profile.bevel;
      const d = `M${point(at(a, radius))}A${radius} ${radius} 0 0 ${sweep} ${point(at(b, radius))}L${point(at(b, innerRadius))}A${innerRadius} ${innerRadius} 0 0 ${1 - sweep} ${point(at(a, innerRadius))}Z`;
      const response = nx * toLight.x + ny * toLight.y;
      if (sweep && response > .1) lit.push(d);
      else if (response < -.1) shade.push(d);
    }
  }
  return { lit: lit.join(""), shade: shade.join("") };
}
