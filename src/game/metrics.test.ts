import { describe, expect, it } from "vitest";
import { CURATED_LEVELS, parseAsciiLevel } from "./levels";
import { campaignMetricReport, measureLevel } from "./metrics";

describe("campaign route-quality metrics", () => {
  it("measures every campaign level and enforces optional ordinary rescues", () => {
    const report = campaignMetricReport(CURATED_LEVELS);
    expect(Object.keys(report)).toHaveLength(16);
    for (const level of CURATED_LEVELS) {
      const metric = report[level.id]!;
      expect(metric.ordinaryInputs).toBeGreaterThan(0);
      expect(metric.perfectInputs).toBeGreaterThanOrEqual(metric.ordinaryInputs);
      expect(metric.ordinaryMovementSteps).toBeLessThanOrEqual(metric.ordinaryInputs);
      expect(metric.perfectMovementSteps).toBeLessThanOrEqual(metric.perfectInputs);
      expect(metric.ordinaryRescues).toBe(0);
      expect(metric.perfectRescues).toBe(level.objects.filter((item) => item.kind === "animal").length);
      expect(Number.isFinite(metric.routeActivityDensity)).toBe(true);
      expect(metric.prerequisiteDepth).toBeNull();
    }
    expect(CURATED_LEVELS.map((level) => report[level.id]!.ordinaryInputs))
      .toEqual([6, 38, 65, 82, 71, 95, 121, 124, 182, 151, 206, 165, 29, 105, 47, 62]);
    expect(CURATED_LEVELS.map((level) => report[level.id]!.perfectInputs))
      .toEqual([7, 52, 80, 91, 78, 108, 151, 141, 195, 207, 212, 170, 44, 177, 58, 75]);
    expect(CURATED_LEVELS.map((level) => report[level.id]!.ordinaryMovementSteps))
      .toEqual([6, 36, 62, 78, 66, 90, 115, 117, 179, 147, 199, 159, 28, 101, 44, 54]);
    expect(CURATED_LEVELS.map((level) => report[level.id]!.perfectMovementSteps))
      .toEqual([6, 48, 74, 84, 70, 100, 141, 131, 189, 199, 201, 159, 40, 169, 50, 62]);
    expect(CURATED_LEVELS.map((level) => report[level.id]!.rawBranchPoints))
      .toEqual([2, 6, 5, 8, 7, 6, 11, 11, 14, 18, 14, 16, 13, 10, 37, 40]);
    expect(CURATED_LEVELS.map((level) => report[level.id]!.meaningfulStateChanges))
      .toEqual([0, 4, 7, 9, 10, 11, 13, 15, 8, 9, 14, 14, 2, 8, 9, 11]);
    expect(CURATED_LEVELS.map((level) => report[level.id]!.retraversalMoves))
      .toEqual([0, 0, 0, 0, 0, 0, 4, 2, 64, 44, 49, 27, 5, 21, 0, 1]);
    expect(CURATED_LEVELS.map((level) => report[level.id]!.longestQuietRun))
      .toEqual([6, 8, 13, 13, 9, 14, 16, 15, 42, 48, 24, 20, 11, 27, 9, 9]);
    expect(Math.max(...CURATED_LEVELS.slice(8).map((level) => report[level.id]!.ordinaryInputs)))
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
      ordinaryInputs: 4,
      ordinaryMovementSteps: 3,
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
