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
    expect(result.processedTransitions).toBeLessThanOrEqual(4);
  });

  it("reaches beyond a stationary rescue gate without rescue-order explosion", () => {
    const level = parseAsciiLevel({
      id: "reachability-rescue-gate",
      name: "Reachability Rescue Gate",
      objective: "Test rescue traversal.",
      map: ["#####", "#@qE#", "#...#", "#...#", "#####"],
    });
    const result = getEngineReachability(level, createInitialGameState(level));

    expect(result.complete).toBe(true);
    expect(result.positions).toContain("2,1");
    expect(result.positions).toContain("3,1");
  });

  it("bounds low-limit work while counting dominated rescue-order states", () => {
    const level = parseAsciiLevel({
      id: "reachability-rescue-order",
      name: "Reachability Rescue Order",
      objective: "Test dominance churn.",
      objectIds: {
        "1,1": "reachability-rescue-order-animal-bunny-left",
        "5,1": "reachability-rescue-order-animal-bunny-right",
      },
      map: [
        "#######",
        "#q...q#",
        "#.....#",
        "#..@..#",
        "#.....#",
        "#..E..#",
        "#######",
      ],
    });
    const limited = getEngineReachability(level, createInitialGameState(level), 12);
    expect(limited.complete).toBe(false);
    expect(limited.visitedStates).toBe(12);
    expect(limited.processedTransitions).toBeLessThanOrEqual(48);

    const complete = getEngineReachability(level, createInitialGameState(level));
    expect(complete.complete).toBe(true);
    expect(complete.positions).toHaveLength(25);
    expect(complete.visitedStates).toBeGreaterThan(complete.positions.size);
    expect(complete.processedTransitions).toBeGreaterThanOrEqual(complete.visitedStates);
  });

  it("exhausts every authored campaign state graph within the approved budget", () => {
    for (const level of CURATED_LEVELS) {
      const result = getEngineReachability(level, createInitialGameState(level));
      expect(result.complete, level.name).toBe(true);
      expect(result.visitedStates, level.name).toBeLessThan(100_000);
      expect(result.processedTransitions, level.name).toBeLessThanOrEqual(400_000);
    }
  }, 120_000);
});
