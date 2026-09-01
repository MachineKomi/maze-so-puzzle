import { describe, expect, it } from "vitest";
import {
  COMBAT_CLASH_COUNT,
  COMBAT_VICTORY_DURATION_MS,
  REDUCED_COMBAT_VICTORY_DURATION_MS,
  createCombatVictoryPlan,
  getCombatCuesBetween,
  getCombatPresentationFrame,
} from "./combatPresentation";

describe("combat victory presentation", () => {
  it("uses three distinct, child-readable bashes before celebrating", () => {
    const plan = createCombatVictoryPlan({
      powerBefore: 5,
      enemyPower: 9,
      powerAfter: 14,
    });

    expect(plan.durationMs).toBe(COMBAT_VICTORY_DURATION_MS);
    expect(plan.clashes).toHaveLength(COMBAT_CLASH_COUNT);
    expect(plan.clashes).toHaveLength(3);
    expect(plan.clashes.every((clash, index) => (
      clash.startMs < clash.impactMs
      && clash.impactMs < clash.endMs
      && (index === 0 || clash.startMs > plan.clashes[index - 1]!.endMs)
    ))).toBe(true);

    for (const clash of plan.clashes) {
      const kinds = plan.cues
        .filter((cue) => cue.clashIndex === clash.index)
        .map((cue) => cue.kind);
      expect(kinds).toEqual(expect.arrayContaining(["clash", "sparks", "impact"]));
    }
  });

  it("drains enemy Power stepwise and adds exactly the same amount to Ame", () => {
    const plan = createCombatVictoryPlan({
      powerBefore: 7,
      enemyPower: 17,
      powerAfter: 24,
    });

    expect(plan.transferSteps.length).toBeGreaterThanOrEqual(9);
    expect(plan.transferSteps.length).toBeLessThanOrEqual(18);
    expect(plan.transferSteps.every((step, index) => {
      const previous = plan.transferSteps[index - 1];
      return step.playerPower - plan.powerBefore === plan.enemyPower - step.enemyPower
        && step.transferredPower === step.playerPower - plan.powerBefore
        && step.enemyPower >= 0
        && (previous === undefined || step.transferredPower > previous.transferredPower);
    })).toBe(true);

    expect(plan.transferSteps.at(-1)).toMatchObject({
      transferredPower: 17,
      playerPower: 24,
      enemyPower: 0,
    });
  });

  it("keeps the conservation invariant at every sampled frame and ends exactly", () => {
    const plan = createCombatVictoryPlan({
      powerBefore: 11,
      enemyPower: 8,
      powerAfter: 19,
    });

    for (let elapsed = 0; elapsed <= plan.durationMs; elapsed += 13) {
      const frame = getCombatPresentationFrame(plan, elapsed);
      expect(frame.playerPower - plan.powerBefore).toBe(plan.enemyPower - frame.enemyPower);
      expect(frame.playerPower).toBeLessThanOrEqual(plan.powerAfter);
      expect(frame.enemyPower).toBeGreaterThanOrEqual(0);
    }

    expect(getCombatPresentationFrame(plan, plan.durationMs)).toMatchObject({
      phase: "complete",
      transferredPower: 8,
      playerPower: 19,
      enemyPower: 0,
      complete: true,
    });
  });

  it("still shows multiple impacts for a one-Power enemy", () => {
    const plan = createCombatVictoryPlan({
      powerBefore: 3,
      enemyPower: 1,
      powerAfter: 4,
    });

    expect(plan.clashes).toHaveLength(3);
    expect(plan.cues.filter((cue) => cue.kind === "impact")).toHaveLength(3);
    expect(plan.transferSteps).toEqual([
      expect.objectContaining({ clashIndex: 2, transferredPower: 1, playerPower: 4, enemyPower: 0 }),
    ]);
  });

  it("offers a short, static reduced-motion alternative", () => {
    const plan = createCombatVictoryPlan(
      { powerBefore: 4, enemyPower: 6, powerAfter: 10 },
      { reducedMotion: true },
    );

    expect(plan.reducedMotion).toBe(true);
    expect(plan.durationMs).toBe(REDUCED_COMBAT_VICTORY_DURATION_MS);
    expect(plan.durationMs).toBeLessThan(COMBAT_VICTORY_DURATION_MS / 4);
    expect(plan.clashes).toEqual([]);
    expect(plan.cues.some((cue) => cue.kind === "clash" || cue.kind === "impact")).toBe(false);
    expect(plan.transferSteps).toEqual([
      expect.objectContaining({ transferredPower: 6, playerPower: 10, enemyPower: 0 }),
    ]);
    expect(getCombatPresentationFrame(plan, 60)).toMatchObject({
      playerPower: 10,
      enemyPower: 0,
    });
  });

  it("exposes cue windows without replaying earlier sounds", () => {
    const plan = createCombatVictoryPlan({
      powerBefore: 5,
      enemyPower: 5,
      powerAfter: 10,
    });
    const firstWindow = getCombatCuesBetween(plan, -1, 500);
    const secondWindow = getCombatCuesBetween(plan, 500, 1000);

    expect(firstWindow.length).toBeGreaterThan(0);
    expect(secondWindow.length).toBeGreaterThan(0);
    expect(firstWindow.every((cue) => cue.atMs <= 500)).toBe(true);
    expect(secondWindow.every((cue) => cue.atMs > 500 && cue.atMs <= 1000)).toBe(true);
  });

  it("rejects impossible timelines rather than showing misleading numbers", () => {
    expect(() => createCombatVictoryPlan({
      powerBefore: 5,
      enemyPower: 4,
      powerAfter: 10,
    })).toThrow(/Power must be conserved/);
    expect(() => createCombatVictoryPlan({
      powerBefore: 5,
      enemyPower: 0,
      powerAfter: 5,
    })).toThrow(/greater than zero/);
    expect(() => createCombatVictoryPlan({
      powerBefore: 1.5,
      enemyPower: 2,
      powerAfter: 3.5,
    })).toThrow(/safe integer/);
  });
});
