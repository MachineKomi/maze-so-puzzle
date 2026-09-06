import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AME_ART } from "../artCatalog";
import { CURATED_LEVELS } from "./levels";
import { createRectilinearUnionGeometry, createRoundedCellUnionGeometry } from "./terrainGeometry";
import { createTallWallGeometry, TALL_WALL_HEIGHT } from "./tallWalls";
import { MazeTerrain } from "../ui/game/MazeTerrain";

describe("tall wall sections", () => {
  it("measures height against visible standing Ame without changing her art", () => {
    expect(TALL_WALL_HEIGHT).toBeCloseTo(.92 * (AME_ART.geometry.groundLine - AME_ART.geometry.visibleBounds[1]) * 1.15);
    expect(TALL_WALL_HEIGHT).toBeLessThan(1);
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
  it("keeps every raised cap boundary out of non-wall cell interiors across the campaign", () => {
    for (const level of CURATED_LEVELS) {
      const camera = { left: 0, top: 0, right: level.width - 1, bottom: level.height - 1, width: level.width, height: level.height };
      const wall = (x: number, y: number) => level.terrain[y]?.[x] === "wall";
      const base = createRoundedCellUnionGeometry(camera, wall, .13);
      const tall = createTallWallGeometry(level, base, { x: 0, y: -1 });
      for (const edge of tall.cap.edges) for (let i = 0; i <= 10; i++) {
        const x = edge.entry.x + (edge.exit.x - edge.entry.x) * i / 10 + tall.dx;
        const y = edge.entry.y + (edge.exit.y - edge.entry.y) * i / 10 - tall.height;
        expect(wall(Math.floor(x), Math.floor(y)), `${level.id}: ${x},${y}`).toBe(true);
      }
      expect(tall.sides).toHaveLength(5);
      const html = renderToStaticMarkup(<MazeTerrain level={level} camera={camera} />);
      expect(html).toContain('data-wall-lighting="04b-section-v1"');
      expect(html).toContain('class="terrain-tall-walls"');
      expect(html).not.toContain('class="terrain-wall-contour"');
      expect(html).not.toContain('class="terrain-wall-side"');
    }
  });
});
