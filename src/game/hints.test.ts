import { describe, expect, it } from "vitest";
import { createInitialGameState, movePlayer } from "./engine";
import { getProgressiveHint, hintStateKey, nextHintTier } from "./hints";
import { CURATED_LEVELS, parseAsciiLevel } from "./levels";
import { getEngineReachability, getRequiredPath } from "./reachability";

describe("engine-consistent progressive hints", () => {
  it("uses generic tool pictures without adding hidden identity or early route metadata", () => {
    for (const [token, picture] of [["s", "sword"], ["u", "boots"], ["j", "springBoots"], ["r", "navHelp"], ["b", "navHelp"], ["y", "navHelp"]] as const) {
      // A required tool must actually unlock the exit route, not merely sit nearby.
      const suffix = token === "s" ? "1" : token === "u" ? "~" : token === "j" ? "o" : token.toUpperCase();
      const level = parseAsciiLevel({ id: `picture-${token}`, name: "Rule", objective: "Exit", initialPower: 1, map: ["#########", `#@${token}${suffix}.E###`, ...Array<string>(7).fill("#########")] });
      const initial = createInitialGameState(level);
      for (const tier of [0, 1] as const) {
        const hint = getProgressiveHint(level, initial, tier);
        expect(hint.picture, token).toBe(picture);
        expect(hint.targetObjectId).toBeUndefined();
        expect(hint.direction).toBeUndefined();
        expect(hint.text).not.toMatch(/\b(red|blue|yellow)\b/);
      }
    }
  });

  it("does not promise all requirements are met when a required route is unavailable", () => {
    const level = parseAsciiLevel({ id: "unreachable-hint", name: "Blocked", objective: "Exit", map: ["#####", "#@#E#", "#####"] });
    const hint = getProgressiveHint(level, createInitialGameState(level), 3);
    expect(hint.text).not.toContain("everything you need");
    expect(hint.direction).toBeUndefined();
    expect(hint.targetObjectId).toBeUndefined();
    expect(hint.picture).toBe("navHelp");
  });

  it("keeps unknown guardian values out of generic hint text and pictures", () => {
    const level = parseAsciiLevel({ id: "hidden-guardian", name: "Rule", objective: "Exit", initialPower: 150, enemyTokens: { M: { power: 125, style: "goblin" } }, map: ["#######", "#@M.E##", ...Array<string>(5).fill("#######")] });
    for (const tier of [0, 1]) {
      const hint = getProgressiveHint(level, { ...createInitialGameState(level), hasSword: true }, tier);
      expect(hint.text).not.toMatch(/125|goblin/i);
      expect(hint.picture).toBe("navHelp");
      expect(hint.direction).toBeUndefined();
      expect(hint.targetObjectId).toBeUndefined();
    }
  });
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

  it("explains the single-width rule immediately before a required jump", () => {
    const level = parseAsciiLevel({
      id: "hint-hole-principle",
      name: "Hole principle",
      objective: "Exit",
      map: ["#########", "#@j..o.E#", ...Array<string>(7).fill("#########")],
    });
    let state = createInitialGameState(level);
    for (const direction of ["right", "right", "right"] as const) {
      state = movePlayer(level, state, direction).state;
    }

    expect(getProgressiveHint(level, state, 0).text).toContain("single-hole crossing");
    const principle = getProgressiveHint(level, state, 1).text;
    expect(principle).toContain("one hole");
    expect(principle).toContain("clear landing");
  });

  it("uses portal and single-hole engine transitions", () => {
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

    const holes = parseAsciiLevel({ id: "hint-holes", name: "Holes", objective: "Exit", map: ["#########", "#@j..o.E#", "#########"] });
    let state = movePlayer(holes, createInitialGameState(holes), "right").state;
    state = movePlayer(holes, state, "right").state;
    state = movePlayer(holes, state, "right").state;
    const reachability = getEngineReachability(holes, state);
    expect(reachability.positions.has("5,1")).toBe(false);
    expect(reachability.positions.has("6,1")).toBe(true);
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

