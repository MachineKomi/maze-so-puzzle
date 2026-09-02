import { describe, expect, it } from "vitest";
import { createInitialGameState } from "./engine";
import { CURATED_LEVELS, parseAsciiLevel } from "./levels";
import { getEngineReachability } from "./reachability";

describe("engine reachability evidence", () => {
  it("reports when its state budget truncates exploration", () => {
    const level = parseAsciiLevel({
      id: "reachability-budget",
      name: "Reachability budget",
      objective: "Exit",
      map: ["#####", "#@.E#", "#...#", "#...#", "#####"],
    });
    const result = getEngineReachability(level, createInitialGameState(level), 1);

    expect(result.complete).toBe(false);
    expect(result.visitedStates).toBe(1);
  });

  it("exhausts every authored campaign state graph within the approved budget", () => {
    for (const level of CURATED_LEVELS) {
      const result = getEngineReachability(level, createInitialGameState(level));
      expect(result.complete, level.name).toBe(true);
      expect(result.visitedStates, level.name).toBeLessThan(100_000);
    }
  }, 120_000);
});
