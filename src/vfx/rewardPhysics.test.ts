import { describe, expect, it } from "vitest";
import { createCombatVictoryPlan } from "../combatPresentation";
import { advanceRewardToken, makeRewardTokens, REWARD_CAP, rewardProjection, rewardSeed, rewardSpaceOpen } from "./rewardPhysics";
import type { TerrainKind } from "../game/types";

const terrain = ["#####", "#...#", "###.#", "#...#", "#####"].map(row => [...row].map(c => c === "#" ? "wall" : "floor")) as TerrainKind[][];
const emission = { kind: "gold" as const, at: { x: 1, y: 1 }, amount: 8, seed: 23 };
describe("committed reward representatives", () => {
  it("partitions every small and huge amount exactly without per-point particles", () => {
    for (const amount of [1, 2, 3, 8, 99, 123456, Number.MAX_SAFE_INTEGER]) for (const slots of [0, 1, 2, 3, 4, 5, 6, 7, 8]) {
      const tokens = makeRewardTokens({ ...emission, amount }, 0, slots);
      expect(tokens.length).toBeLessThanOrEqual(Math.min(slots, amount, 8));
      if (slots) expect(tokens.reduce((sum, token) => sum + token.value, 0)).toBe(amount);
      expect(tokens.every(token => Number.isSafeInteger(token.value) && token.value > 0)).toBe(true);
    }
  });
  it("has deterministic presentation-only seeds and replay", () => {
    expect(rewardSeed("run:chest1")).toBe(rewardSeed("run:chest1"));
    expect(rewardSeed("run:chest1")).not.toBe(rewardSeed("run:chest2"));
    expect(makeRewardTokens(emission, 0, 8)).toEqual(makeRewardTokens(emission, 0, 8));
    expect(makeRewardTokens({ ...emission, amount: 0 }, 0, 8)).toEqual([]);
  });
  it("keeps bounces inside corners/corridors across uneven frame intervals", () => {
    let bounces = 0, collected = 0;
    for (let seed = 0; seed < 80; seed++) {
      const tokens = makeRewardTokens({ ...emission, seed }, 0, 8);
      let previous = 0;
      for (let time = 7; time < 1200; time += time % 3 ? 17 : 49) {
        for (const token of tokens) {
          advanceRewardToken(token, terrain, { x: 2.5, y: 1.5 }, previous, time);
          expect(rewardSpaceOpen(terrain, token.x, token.y)).toBe(true);
          expect(Number.isFinite(token.x + token.y + token.vx + token.vy)).toBe(true);
        }
        previous = time;
      }
      expect(tokens.every(token => token.arrived || token.expired)).toBe(true);
      bounces += tokens.filter(token => token.bounced).length;
      collected += tokens.filter(token => token.arrived).length;
    }
    expect(bounces).toBeGreaterThan(100); expect(collected).toBeGreaterThan(100);
  });
  it("expires stalls and unreachable recipients without fake collection", () => {
    const token = makeRewardTokens(emission, 0, 1)[0]!;
    advanceRewardToken(token, terrain, { x: 1.5, y: 3.5 }, 0, 121);
    expect(token.expired).toBe(true); expect(token.arrived).toBe(false);
    const blocked = makeRewardTokens(emission, 0, 1)[0]!;
    for (let t = 8; t < 1100; t += 8) advanceRewardToken(blocked, terrain, { x: 1.5, y: 3.5 }, t - 8, t);
    expect(blocked.expired).toBe(true); expect(blocked.arrived).toBe(false);
  });
  it("reserves one shared finite pool for overlapping types", () => {
    for (const cap of Object.values(REWARD_CAP)) {
      const tokens = [];
      for (const kind of ["gold", "science", "power", "gold", "power"] as const)
        tokens.push(...makeRewardTokens({ ...emission, kind }, 0, cap - tokens.length));
      expect(tokens.length).toBe(cap);
    }
  });
  it("projects fractional camera travel without changing its owner", () => {
    expect(rewardProjection({ x: 5, y: 7 }, { left: 2.5, top: 4, width: 6, height: 6 }, { width: 600, height: 600 }))
      .toEqual({ x: 250, y: 300 });
  });
  it("keeps zero-Power clashes empty and grouped deadlines/value conservation exact", () => {
    for (const amount of [1, 2, 3, 19, 99, 500]) {
      const plan = createCombatVictoryPlan({ powerBefore: 20, enemyPower: amount, powerAfter: 20 + amount });
      let before = 0, represented = 0;
      for (const clash of plan.clashes) {
        const steps = plan.transferSteps.filter(step => step.clashIndex === clash.index);
        const values = steps.map(step => { const delta = step.transferredPower - before; before = step.transferredPower; return delta; });
        const sum = values.reduce((a, b) => a + b, 0);
        const tokens = makeRewardTokens({ ...emission, kind: "power", amount: sum, values,
          arrivals: steps.map(step => step.atMs - clash.impactMs) }, clash.impactMs, 4);
        expect(tokens.reduce((a, t) => a + t.value, 0)).toBe(sum);
        expect(tokens.every(t => t.due - t.born >= 200)).toBe(true);
        represented += sum;
      }
      expect(represented).toBe(amount);
    }
  });
});
