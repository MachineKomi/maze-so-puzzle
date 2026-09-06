import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createRoundedCellUnionGeometry, createRoundedCellUnionPath } from "./terrainGeometry";
import { buildWallCast, buildWallLighting, resolveWallLight, WALL_LIGHTING_PROFILES, WALL_LIGHTING_REVISION } from "./wallLighting";
import { WALLS } from "../artCatalog";
import { CURATED_LEVELS } from "./levels";
import { MazeTerrain } from "../ui/game/MazeTerrain";
import type { LevelDefinition, LightDirection } from "./types";

const bounds = { left: 0, top: 0, right: 2, bottom: 2 };
const profile = WALL_LIGHTING_PROFILES.stone;
const directions: LightDirection[] = ["top", "right", "bottom", "left"];
const fullWindow = (level: LevelDefinition) => ({ left: 0, top: 0, right: level.width - 1,
  bottom: level.height - 1, width: level.width, height: level.height });

describe("04-A wall shape and light", () => {
  it("preserves exact cardinal and every campaign legacy cast", () => {
    const casts = [{x:0,y:1},{x:-1,y:0},{x:0,y:-1},{x:1,y:0}];
    for (const level of [...CURATED_LEVELS, ...directions.map(lightDirection => ({ id: "fixture", lightDirection }))]) {
      const index = directions.indexOf(level.lightDirection ?? directions[[...level.id].reduce((s,c)=>s+c.charCodeAt(0),0)%4]!);
      const resolved = resolveWallLight(level);
      expect(resolved.cast).toEqual(casts[index]);
      expect(resolved.toLight.x + resolved.cast.x).toBe(0);
      expect(resolved.toLight.y + resolved.cast.y).toBe(0);
    }
  });
  it("keeps all 512 small silhouettes and outward normals exact", () => {
    for(let mask=0; mask<512; mask++) {
      const has = (x:number,y:number) => x>=0 && y>=0 && x<3 && y<3 && !!(mask & (1 << (y*3+x)));
      const g = createRoundedCellUnionGeometry(bounds, has, .13);
      expect(g.d).toBe(createRoundedCellUnionPath(bounds, has, .13).d);
      for(const e of g.edges) {
        const middle={x:(e.start.x+e.end.x)/2,y:(e.start.y+e.end.y)/2};
        expect(has(Math.floor(middle.x-e.normal.x*.1),Math.floor(middle.y-e.normal.y*.1))).toBe(true);
        expect(has(Math.floor(middle.x+e.normal.x*.1),Math.floor(middle.y+e.normal.y*.1))).toBe(false);
      }
      for(const direction of directions) {
        const p=buildWallLighting(g,resolveWallLight({id:"fixture",lightDirection:direction}).toLight,profile);
        expect(p.lit+p.shade).not.toMatch(/NaN|Infinity/);
        expect(Object.keys(p)).toHaveLength(2);
      }
    }
  });
  it("does not highlight opposing straight normals together", () => {
    const g = createRoundedCellUnionGeometry(bounds, (x,y)=>x===1 && y===1,.13);
    const top=buildWallLighting(g,{x:0,y:-1},profile), bottom=buildWallLighting(g,{x:0,y:1},profile);
    expect(top.lit).toBe(bottom.shade);
    expect(bottom.lit).toBe(top.shade);
    expect(top.lit).not.toBe(top.shade);
    expect(g.edges).toHaveLength(4);
    expect(g.corners).toHaveLength(4);
  });
  it("selects a versioned, bounded profile for every wall including dormant sandstone", () => {
    expect(WALL_LIGHTING_REVISION).toBe("04a-r1");
    for(const wall of Object.values(WALLS)) {
      const p=WALL_LIGHTING_PROFILES[wall.wallLightingProfile];
      expect(p).toBeDefined();
      expect(p.height).toBeGreaterThanOrEqual(.20); expect(p.height).toBeLessThanOrEqual(.28);
      expect(p.bevel).toBeGreaterThan(0); expect(p.bevel).toBeLessThan(.065);
    }
  });
  it("keeps both rear and projected-front canonical arc bands without sector-dependent lift", () => {
    const g = createRoundedCellUnionGeometry(bounds, (x,y)=>x===1 && y===1,.13);
    const top = buildWallLighting(g, { x:0, y:-1 }, profile);
    const bottom = buildWallLighting(g, { x:0, y:1 }, profile);
    // Same exact band endpoints as the masks: rear y=1 and front y=2-height.
    expect(top.lit).toContain("M1.13 1L1.87 1");
    expect(bottom.lit).toContain("M1.87 1.75L1.13 1.75");
    for (const p of [top, bottom]) {
      const flat = buildWallLighting(g, p === top ? {x:0,y:-1} : {x:0,y:1}, {...profile, height:0});
      // First complete contour remains exactly unchanged, including every arc.
      expect(p.lit.startsWith(flat.lit.slice(0, flat.lit.length / 2))).toBe(true);
      expect(p.shade.startsWith(flat.shade.slice(0, flat.shade.length / 2))).toBe(true);
    }
  });
  it("builds finite cardinal cast ribbons including rounded tip closures for all occupancies", () => {
    for(let mask=0; mask<512; mask++) {
      const g = createRoundedCellUnionGeometry(bounds,(x,y)=>x>=0&&y>=0&&x<3&&y<3&&!!(mask & (1<<(y*3+x))),.13);
      for (const direction of directions) {
        const {cast} = resolveWallLight({id:"fixture",lightDirection:direction});
        const result = buildWallCast(g,cast,profile.height);
        expect(Math.hypot(result.offset.x,result.offset.y)).toBeCloseTo(.2125);
        expect(result.ribbons).not.toMatch(/NaN|Infinity/);
        expect(result).toEqual(buildWallCast(g,cast,profile.height));
        expect((result.ribbons.match(/M/g) ?? []).length).toBeLessThanOrEqual(g.edges.length+g.corners.length);
      }
    }
    const isolated = createRoundedCellUnionGeometry(bounds,(x,y)=>x===1&&y===1,.13);
    const south = buildWallCast(isolated,{x:0,y:1},profile.height);
    expect(south.ribbons).toContain("M1.87 2L1.87 2.2125L1.13 2.2125L1.13 2Z");
    expect((south.ribbons.match(/A/g) ?? []).length).toBe(4);
  });
});

describe("04-A SVG ownership", () => {
  it("renders the exact wall silhouette, fixed side, bounded groups and no depth filter in every campaign", () => {
    for(const level of CURATED_LEVELS) {
      const html=renderToStaticMarkup(<MazeTerrain level={level} camera={fullWindow(level)} />);
      expect(html).toContain('data-wall-lighting="04a-r1"');
      expect(html).not.toContain('wall-depth');
      expect(html).not.toContain('mix-blend-mode');
      for (const owner of ['wall','wall-contact','wall-side','wall-shade','wall-highlight','wall-contour','wall-foot','wall-cast']) {
        expect(html.match(new RegExp(`class="terrain-${owner}"`, 'g'))?.length).toBe(1);
      }
      expect(html).toContain('maskContentUnits="userSpaceOnUse"');
      expect(html).toContain('clip-rule="evenodd"');
      const sides=html.match(/<mask[^>]*wall-side[\s\S]*?<\/mask>/)?.[0];
      expect(sides).toContain('translate(0 -');
      const flipped=renderToStaticMarkup(<MazeTerrain level={{...level,lightDirection:"top"}} camera={fullWindow(level)} />);
      const shift=flipped.match(/<mask[^>]*wall-side[\s\S]*?<\/mask>/)?.[0];
      expect(shift).toBe(sides);
      const cast = html.match(/<g class="terrain-wall-cast"[\s\S]*?<\/g>/)?.[0] ?? "";
      expect(cast.match(/<path/g)).toHaveLength(2);
      expect(cast).toContain('floor-clip');
      expect(cast).toContain('opacity="0.19"');
      expect(cast).not.toMatch(/filter=|mask=|animation/);
    }
  });
});
