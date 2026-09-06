import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { poisonBubbleMarks } from "./hazardSurface";
import { parseAsciiLevel } from "./levels";
import { MazeTerrain } from "../ui/game/MazeTerrain";
import { HAZARD_ART } from "../artCatalog";

describe("contained hazard surfaces", () => {
  it("keeps varied bubble motion deterministic, slow and inside its periodic tile", () => {
    expect(poisonBubbleMarks("ame")).toEqual(poisonBubbleMarks("ame"));
    expect(poisonBubbleMarks("ame")).not.toEqual(poisonBubbleMarks("alex"));
    for (const seed of ["ame", "alex", "", "moonbeam-moat"]) {
      const marks = poisonBubbleMarks(seed);
      expect(new Set(marks.map(m => m.duration)).size).toBe(marks.length);
      for (const m of marks) {
        expect(m.duration).toBeGreaterThanOrEqual(3.8);
        expect(m.duration).toBeLessThanOrEqual(6.2);
        // Includes1.23×scale and70% own-box lift/45% lateral drift.
        expect(m.x - m.radius * 2.4).toBeGreaterThan(0);
        expect(m.x + m.radius * 2.4).toBeLessThan(3.6);
        expect(m.y - m.radius * 2.7).toBeGreaterThan(0);
        expect(m.y + m.radius * 1.8).toBeLessThan(3.6);
      }
    }
  });
  it("renders connected hazards without blur/morphology or mark owners for absent hazards", () => {
    const level = parseAsciiLevel({ id: "hazard-proof", name: "Hazard proof", objective: "Proof", map: ["########", "#@.~^%E#", "#..~~%%#", "########"] });
    const markup = renderToStaticMarkup(<MazeTerrain level={level} camera={{ left: 0, top: 0, right: 7, bottom: 3, width: 8, height: 4 }} />);
    expect(markup).not.toMatch(/feMorphology|feGaussianBlur|hazard-inset/);
    for (const kind of ["water", "lava", "poison"]) {
      expect(markup).toMatch(new RegExp(`class="terrain-${kind}"[^>]+clip-path=`));
      expect(markup).toMatch(new RegExp(`class="terrain-${kind}-fx"[^>]+clip-path=`));
    }
    const dry = { ...level, terrain: level.terrain.map(row => row.map(t => ["water", "lava", "poison"].includes(t) ? "floor" as const : t)) };
    const dryMarkup = renderToStaticMarkup(<MazeTerrain level={dry} camera={{ left: 0, top: 0, right: 7, bottom: 3, width: 8, height: 4 }} />);
    expect(dryMarkup).not.toMatch(/class="(?:water-ripple-marks|lava-shimmer-marks|poison-bubble)"/);
    for (const kind of ["water", "lava", "poison"] as const) {
      expect(dryMarkup).not.toContain(HAZARD_ART[kind].src);
      expect(dryMarkup).not.toMatch(new RegExp(`<pattern[^>]+id="[^"]+-${kind}(?:-fx)?"`));
    }
  });
});
