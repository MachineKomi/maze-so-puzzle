import { describe, expect, it } from "vitest";
import { CURATED_LEVELS, parseAsciiLevel } from "./levels";
import { campaignMetricReport, measureLevel } from "./metrics";

describe("campaign route-quality metrics", () => {
  it("measures every campaign level and enforces optional ordinary rescues", () => {
    const report = campaignMetricReport(CURATED_LEVELS);
    expect(Object.keys(report)).toHaveLength(16);
    for (const level of CURATED_LEVELS) {
      const metric = report[level.id]!;
      expect(metric.ordinaryMoves).toBeGreaterThan(0);
      expect(metric.perfectMoves).toBeGreaterThanOrEqual(metric.ordinaryMoves);
      expect(metric.ordinaryRescues).toBe(0);
      expect(metric.perfectRescues).toBe(level.objects.filter((item) => item.kind === "animal").length);
      expect(Number.isFinite(metric.routeActivityDensity)).toBe(true);
      expect(metric.prerequisiteDepth).toBeNull();
    }
    expect(CURATED_LEVELS.slice(8).map((level) => report[level.id]!.ordinaryMoves))
      .toEqual([181, 149, 201, 161, 28, 103, 44, 61]);
    expect(CURATED_LEVELS.slice(8).map((level) => report[level.id]!.perfectMoves))
      .toEqual([195, 204, 211, 171, 42, 177, 56, 77]);
    expect(CURATED_LEVELS.map((level) => report[level.id]!.rawBranchPoints))
      .toEqual([2, 5, 4, 7, 5, 3, 8, 8, 14, 17, 12, 13, 13, 10, 35, 39]);
    expect(CURATED_LEVELS.map((level) => report[level.id]!.meaningfulStateChanges))
      .toEqual([0, 4, 7, 9, 10, 11, 13, 15, 8, 9, 14, 14, 2, 8, 9, 11]);
    expect(CURATED_LEVELS.map((level) => report[level.id]!.retraversalMoves))
      .toEqual([0, 0, 0, 0, 0, 0, 4, 2, 64, 44, 49, 27, 5, 21, 0, 1]);
    expect(CURATED_LEVELS.map((level) => report[level.id]!.longestQuietRun))
      .toEqual([6, 7, 13, 13, 9, 13, 15, 14, 42, 48, 24, 20, 11, 27, 9, 9]);
    expect(Math.max(...CURATED_LEVELS.slice(8).map((level) => report[level.id]!.ordinaryMoves)))
      .toBeLessThanOrEqual(210);
    expect(Math.max(...CURATED_LEVELS.slice(8).map((level) => report[level.id]!.longestQuietRun)))
      .toBeLessThanOrEqual(62);
  }, 120_000);

  it("separates required state changes from optional rewards and physical revisits", () => {
    const combat = parseAsciiLevel({
      id: "metric-combat",
      name: "Metric combat",
      objective: "Exit",
      map: ["######", "#@s2E#", "#....#", "#....#", "#....#", "######"],
    });
    expect(measureLevel(combat)).toMatchObject({
      ordinaryMoves: 4,
      meaningfulStateChanges: 2,
      retraversalMoves: 0,
    });

    const treasure = parseAsciiLevel({
      id: "metric-treasure",
      name: "Metric treasure",
      objective: "Exit",
      map: ["#####", "#@kE#", "#...#", "#...#", "#####"],
    });
    expect(measureLevel(treasure).meaningfulStateChanges).toBe(0);
  });
});
