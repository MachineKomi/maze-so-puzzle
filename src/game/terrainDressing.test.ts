import { expect, it } from "vitest";
import { TERRAIN_DRESSING_ART } from "../artCatalog";
import { createDressingStamps } from "./terrainDressing";

it("keeps varied world marks reproducible and entirely inside their repeating cell", () => {
  for (const art of Object.values(TERRAIN_DRESSING_ART)) {
    const marks = createDressingStamps(art, "wishing-woods:floor");
    expect(marks).toEqual(createDressingStamps(art, "wishing-woods:floor"));
    expect(marks).not.toEqual(createDressingStamps(art, "lantern-ruins:wall"));
    expect(new Set(marks.map(m => m.frame)).size).toBeGreaterThan(1);
    for (const mark of marks) {
      const radius = mark.size / Math.sqrt(2);
      expect(Math.min(mark.x, mark.y) - radius).toBeGreaterThan(0);
      expect(Math.max(mark.x, mark.y) + radius).toBeLessThan(art.periodTiles);
    }
  }
});
