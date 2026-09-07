import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { CURATED_LEVELS } from "./levels";
import { createRectilinearUnionGeometry, createRoundedCellUnionGeometry } from "./terrainGeometry";
import { createTallWallGeometry, TALL_WALL_HEIGHT, WALL_REAR_OVERLAP, WALL_CAP_WIDTH, FIELD_GROUND_Y } from "./tallWalls";
import { resolveWallLight } from "./wallLighting";
import { gameplayFingerprint } from "./contentIdentity";
import type { LevelDefinition, LightDirection } from "./types";
import { MazeTerrain } from "../ui/game/MazeTerrain";

describe("tall wall sections", () => {
  it("balances exposed cap widths and grounds actors between actual foot edges", () => {
    const level = {...CURATED_LEVELS[0]!, width: 1, height: 1, terrain: [["wall"]]} as LevelDefinition;
    const base = createRoundedCellUnionGeometry({left:0,top:0,right:0,bottom:0},()=>true,.13);
    const g = createTallWallGeometry(level,base,{x:0,y:-1});
    const points = g.cap.edges.flatMap(e=>[e.start,e.end]);
    const width = Math.max(...points.map(p=>p.x))-Math.min(...points.map(p=>p.x));
    const depth = Math.max(...points.map(p=>p.y))-Math.min(...points.map(p=>p.y));
    expect(width).toBeCloseTo(depth); expect(width).toBeCloseTo(.47);
    expect(TALL_WALL_HEIGHT).toBeCloseTo(.81);
    const northFrontFoot = Math.max(...points.map(p=>p.y)) - 1;
    const southRearFoot = Math.min(...points.map(p=>p.y)) + 1;
    expect(FIELD_GROUND_Y).toBeCloseTo((northFrontFoot+southRearFoot)/2);
    expect(WALL_REAR_OVERLAP+.035/2).toBeLessThanOrEqual(.30);
    expect(WALL_CAP_WIDTH).toBeCloseTo(width);
  });
  it("preserves holes and diagonal separation when mapping thin physical strips", () => {
    const axis = [0, .08, 1, 1.09];
    const ring = createRectilinearUnionGeometry(axis, axis, (x, y) => x !== 1 || y !== 1, .13);
    expect(ring.loopCount).toBe(2);
    const diagonal = createRectilinearUnionGeometry(axis, axis, (x, y) => x === y, .13);
    expect(diagonal.loopCount).toBe(3);
    for (const g of [ring, diagonal]) {
      expect(g.d).not.toMatch(/NaN|Infinity/);
      for (const c of g.corners) expect(c.radius).toBeGreaterThanOrEqual(0);
    }
    expect(() => createRectilinearUnionGeometry([0, 1, 1], axis, () => true)).toThrow();
  });
  it("keeps sampled cap edges in the allowed cells and renders the campaign wall volume", () => {
    const local = Array.from({length:512},(_,mask)=>({...CURATED_LEVELS[0]!,id:`mask-${mask}`,width:3,height:3,
      terrain:Array.from({length:3},(_,y)=>Array.from({length:3},(_,x)=>mask & 1<<(y*3+x) ? "wall" : "floor"))} as LevelDefinition));
    for (const level of [...CURATED_LEVELS,...local]) {
      const camera = { left: 0, top: 0, right: level.width - 1, bottom: level.height - 1, width: level.width, height: level.height };
      const wall = (x: number, y: number) => level.terrain[y]?.[x] === "wall";
      const base = createRoundedCellUnionGeometry(camera, wall, .13);
      const tall = createTallWallGeometry(level, base, { x: 0, y: -1 });
      for (const edge of tall.cap.edges) for (let i = 0; i <= 10; i++) {
        const x = edge.entry.x + (edge.exit.x - edge.entry.x) * i / 10 + tall.dx;
        const y = edge.entry.y + (edge.exit.y - edge.entry.y) * i / 10 - tall.height;
        if(x<0 || y<0 || x>=level.width || y>=level.height) continue; // SVG viewport clips the exterior.
        const tileX=Math.floor(x),tileY=Math.floor(y);
        expect(wall(tileX,tileY) || (y-tileY >= .70 && wall(tileX,tileY+1)), `${level.id}: ${x},${y}`).toBe(true);
      }
      expect(tall.sides).toHaveLength(5);
      if(level.id.startsWith('mask-')) continue;
      const html = renderToStaticMarkup(<MazeTerrain level={level} camera={camera} />);
      expect(html).toContain('data-wall-lighting="04c-balanced-v1"');
      expect(html).toContain('class="terrain-tall-walls"');
      expect(html).toMatch(/class="terrain-wall"[^>]*fill="none"/);
      expect(html).not.toContain('class="terrain-wall-contour"');
      expect(html).not.toContain('class="terrain-wall-side"');
    }
  });
  it("supports all eight normalized light vectors", () => {
    const directions:LightDirection[]=['top','top-right','right','bottom-right','bottom','bottom-left','left','top-left'];
    const vectors=directions.map(lightDirection=>resolveWallLight({id:'test',lightDirection}));
    for(let i=0;i<8;i++) {
      const v=vectors[i]!,opposite=vectors[(i+4)%8]!;
      expect(Math.hypot(v.toLight.x,v.toLight.y)).toBeCloseTo(1);
      expect(v.cast.x).toBeCloseTo(opposite.toLight.x); expect(v.cast.y).toBeCloseTo(opposite.toLight.y);
    }
  });
  it("preserves every campaign gameplay fingerprint and input across all eight visual lights", () => {
    const directions: LightDirection[] = ['top','top-right','right','bottom-right','bottom','bottom-left','left','top-left'];
    for (const level of CURATED_LEVELS) {
      expect(gameplayFingerprint(level), level.id).toBe(level.gameplayFingerprint);
      const bounds = { left: 0, top: 0, right: level.width - 1, bottom: level.height - 1 };
      for (const lightDirection of directions) {
        const variant: LevelDefinition = { ...structuredClone(level), lightDirection };
        const before = structuredClone(variant);
        const label = `${level.id}: ${lightDirection}`;
        expect(gameplayFingerprint(variant), label).toBe(level.gameplayFingerprint);
        const base = createRoundedCellUnionGeometry(bounds, (x, y) => variant.terrain[y]?.[x] === "wall", .13);
        createTallWallGeometry(variant, base, resolveWallLight(variant).toLight);
        expect(variant, label).toEqual(before);
        expect(gameplayFingerprint(variant), label).toBe(level.gameplayFingerprint);
      }
    }
  });
});
