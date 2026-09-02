import { describe, expect, it } from "vitest";
import { createInitialGameState, movePlayer } from "./engine";
import { getProgressiveHint, hintStateKey, nextHintTier } from "./hints";
import { CURATED_LEVELS, parseAsciiLevel } from "./levels";
import { getEngineReachability, getRequiredPath } from "./reachability";

describe("engine-consistent progressive hints", () => {
  it("uses a compact deterministic persistence key even with long semantic IDs", () => {
    const level = parseAsciiLevel({ id: "hint-key", name: "Hint key", objective: "Exit", map: ["#####", "#@.E#", "#...#", "#...#", "#####"] });
    const state = {
      ...createInitialGameState(level),
      collectedObjectIds: Array.from({ length: 100 }, (_, index) => `very-long-semantic-object-identity-${index}`),
    };
    expect(hintStateKey(state)).toBe(hintStateKey({ ...state }));
    expect(hintStateKey(state).length).toBeLessThan(50);
    expect(hintStateKey({ ...state, power: state.power + 1 })).not.toBe(hintStateKey(state));
  });

  it("replays all four tiers and never routes ordinary help through a rescue", () => {
    const level = parseAsciiLevel({ id: "hint-choice", name: "Choice", objective: "Exit", map: ["#######", "#q...E#", "#.#.###", "#@....#", "#.....#", "#.....#", "#######"] });
    const state = createInitialGameState(level);
    expect([0, 1, 2, 3, 3].map(nextHintTier)).toEqual([0, 1, 2, 3, 3]);
    for (let tier = 0; tier < 4; tier += 1) {
      expect(getProgressiveHint(level, state, tier).targetObjectId).toBeUndefined();
    }
    let cursor = state;
    for (const direction of getRequiredPath(level, state) ?? []) cursor = movePlayer(level, cursor, direction).state;
    expect(cursor.status).toBe("won");
    expect(cursor.rescuedAnimalIds).toHaveLength(0);
  });

  it("names the star and optionality in a movement-only onboarding state", () => {
    const level = parseAsciiLevel({
      id: "hint-onboarding",
      name: "Onboarding",
      objective: "Find the star",
      map: ["######", "#...E#", "#....#", "#....#", "#@q..#", "######"],
    });
    const hint = getProgressiveHint(level, createInitialGameState(level), 0);
    expect(hint.text).toContain("sparkling exit");
    expect(hint.text).toContain("optional adventures");
    expect(hint.text).not.toContain("optional friend");
  });

  it("never describes unavoidable optional treasure as a required goal", () => {
    const level = parseAsciiLevel({
      id: "hint-treasure",
      name: "Treasure corridor",
      objective: "Exit",
      map: ["#####", "#@kE#", "#...#", "#...#", "#####"],
    });
    const hint = getProgressiveHint(level, createInitialGameState(level), 0);
    expect(hint.text).toContain("sparkling exit");
    expect(hint.text).not.toContain("required goal is the treasure");
  });

  it("does not retarget an already resolved object when a route crosses it again", () => {
    const level = parseAsciiLevel({
      id: "hint-resolved",
      name: "Resolved landmark",
      objective: "Exit",
      map: ["#######", "#E.s@.#", "#.....#", "#.....#", "#######"],
    });
    let state = movePlayer(level, createInitialGameState(level), "left").state;
    state = movePlayer(level, state, "right").state;

    const hint = getProgressiveHint(level, state, 0);
    expect(hint.text).toContain("sparkling exit");
    expect(hint.text).not.toContain("maze weapon");
  });

  it("explains the complete-hole-run rule immediately before a required jump", () => {
    const level = parseAsciiLevel({
      id: "hint-hole-principle",
      name: "Hole principle",
      objective: "Exit",
      map: ["#########", "#@j..ooE#", "#.......#", "#########", "#########", "#########", "#########", "#########", "#########"],
    });
    let state = createInitialGameState(level);
    for (const direction of ["right", "right", "right"] as const) {
      state = movePlayer(level, state, direction).state;
    }

    expect(getProgressiveHint(level, state, 0).text).toContain("complete run of holes");
    const principle = getProgressiveHint(level, state, 1).text;
    expect(principle).toContain("complete row of holes");
    expect(principle).toContain("first safe landing");
  });

  it("uses portal and complete multi-hole engine transitions", () => {
    const portal = parseAsciiLevel({
      id: "hint-portal",
      name: "Portal",
      objective: "Exit",
      objectIds: {
        "2,1": "hint-portal-portal-entry",
        "5,1": "hint-portal-portal-exit",
      },
      map: ["#########", "#@H##HE.#", "#.......#", "#########", "#########", "#########", "#########", "#########", "#########"],
    });
    expect(getRequiredPath(portal, createInitialGameState(portal))).toEqual(["right", "right"]);

    const holes = parseAsciiLevel({ id: "hint-holes", name: "Holes", objective: "Exit", map: ["#########", "#@j..ooE#", "#.......#", "#########", "#########", "#########", "#########", "#########", "#########"] });
    let state = movePlayer(holes, createInitialGameState(holes), "right").state;
    state = movePlayer(holes, state, "right").state;
    state = movePlayer(holes, state, "right").state;
    const reachability = getEngineReachability(holes, state);
    expect(reachability.positions.has("5,1")).toBe(false);
    expect(reachability.positions.has("6,1")).toBe(false);
    expect(reachability.positions.has("7,1")).toBe(true);
  });

  it("always gives a valid immediate direction from each authored start", () => {
    for (const level of CURATED_LEVELS) {
      const state = createInitialGameState(level);
      const route = getRequiredPath(level, state);
      expect(route?.[0], level.name).toBeDefined();
      const hint = getProgressiveHint(level, state, 2);
      expect(hint.text, level.name).toContain(`Explore ${route?.[0]} from here`);
      expect(movePlayer(level, state, route![0]!).state, level.name).not.toBe(state);
    }
  }, 120_000);
});
