import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { LevelDefinition } from "./game/types";

const loadedSources: string[] = [];

class FakeImage {
  decoding = "auto";
  private source = "";

  get src(): string {
    return this.source;
  }

  set src(value: string) {
    this.source = value;
    loadedSources.push(value);
  }
}

function levelWithRelevantArt(): LevelDefinition {
  return {
    schemaVersion: 1,
    id: "preload-test",
    name: "Preload Test",
    objective: "Test only the required art.",
    source: "curated",
    width: 4,
    height: 2,
    initialPower: 2,
    start: { x: 1, y: 1 },
    exit: { x: 2, y: 1 },
    terrain: [
      ["wall", "wall", "wall", "wall"],
      ["wall", "floor", "water", "wall"],
    ],
    objects: [
      { id: "enemy", kind: "enemy", at: { x: 1, y: 1 }, power: 1 },
      { id: "sword", kind: "sword", at: { x: 1, y: 1 } },
      { id: "key", kind: "key", at: { x: 1, y: 1 }, color: "red" },
      { id: "door", kind: "door", at: { x: 2, y: 1 }, color: "red" },
      { id: "bunny", kind: "animal", at: { x: 2, y: 1 }, species: "bunny" },
    ],
  };
}

beforeEach(() => {
  loadedSources.length = 0;
  vi.resetModules();
  vi.stubGlobal("Image", FakeImage);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("art preloading", () => {
  it("loads common gameplay art plus only the supplied level's terrain and objects", async () => {
    const { ASSETS, preloadLevelArt } = await import("./assets");

    preloadLevelArt(levelWithRelevantArt());
    preloadLevelArt(levelWithRelevantArt());

    expect(new Set(loadedSources)).toEqual(new Set([
      ASSETS.ame,
      ASSETS.portrait,
      ASSETS.goal,
      ASSETS.floor,
      ASSETS.wall,
      ASSETS.coinPouch,
      ASSETS.water,
      ASSETS.goblin,
      ASSETS.sword,
      ASSETS.ameSword,
      ASSETS.key,
      ASSETS.door,
      ASSETS.animalBunny,
      ASSETS.animalCage,
    ]));
    expect(loadedSources).toHaveLength(new Set(loadedSources).size);
    expect(loadedSources).not.toContain(ASSETS.titleBackground);
    expect(loadedSources).not.toContain(ASSETS.lava);
    expect(loadedSources).not.toContain(ASSETS.potion);
    expect(loadedSources).not.toContain(ASSETS.boots);
    expect(loadedSources).not.toContain(ASSETS.animalFox);
    expect(loadedSources).not.toContain(ASSETS.rewardTrailSticker);
  });

  it("deduplicates shared sources across different level preloads", async () => {
    const { ASSETS, preloadLevelArt } = await import("./assets");
    const secondLevel: LevelDefinition = {
      ...levelWithRelevantArt(),
      id: "second-preload-test",
      terrain: [
        ["wall", "wall", "wall", "wall"],
        ["wall", "floor", "lava", "wall"],
      ],
      objects: [
        { id: "potion", kind: "potion", at: { x: 1, y: 1 }, amount: 2 },
        { id: "boots", kind: "boots", at: { x: 2, y: 1 } },
      ],
    };

    preloadLevelArt(levelWithRelevantArt());
    const afterFirstLevel = loadedSources.length;
    preloadLevelArt(secondLevel);

    expect(loadedSources.slice(afterFirstLevel)).toEqual([
      ASSETS.lava,
      ASSETS.potion,
      ASSETS.boots,
    ]);
    expect(loadedSources).toHaveLength(new Set(loadedSources).size);
  });

  it("schedules reward art once through requestIdleCallback when available", async () => {
    const idleTasks: Array<() => void> = [];
    const requestIdleCallback = vi.fn((callback: (deadline: {
      readonly didTimeout: boolean;
      timeRemaining(): number;
    }) => void) => {
      idleTasks.push(() => callback({ didTimeout: false, timeRemaining: () => 12 }));
      return idleTasks.length;
    });
    vi.stubGlobal("requestIdleCallback", requestIdleCallback);
    const { ASSETS, preloadRewardArt } = await import("./assets");

    preloadRewardArt();
    preloadRewardArt();

    expect(requestIdleCallback).toHaveBeenCalledOnce();
    expect(requestIdleCallback).toHaveBeenCalledWith(expect.any(Function), { timeout: 1_500 });
    expect(loadedSources).toHaveLength(0);

    idleTasks[0]?.();
    expect(new Set(loadedSources)).toEqual(new Set([
      ASSETS.goal,
      ASSETS.coinPouch,
      ASSETS.animalBunny,
      ASSETS.animalFox,
      ASSETS.animalKitten,
      ASSETS.rewardTrailSticker,
      ASSETS.rewardBraveMedal,
      ASSETS.rewardSplashSticker,
      ASSETS.rewardRescueMedal,
    ]));
  });

  it("uses a short fallback timer when idle callbacks are unavailable in a browser", async () => {
    const timerTasks: Array<() => void> = [];
    const setTimeout = vi.fn((callback: () => void) => {
      timerTasks.push(callback);
      return timerTasks.length;
    });
    vi.stubGlobal("window", { setTimeout });
    const { ASSETS, preloadRewardArt } = await import("./assets");

    preloadRewardArt();
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 450);
    expect(loadedSources).toHaveLength(0);

    timerTasks[0]?.();
    expect(loadedSources).toContain(ASSETS.rewardTrailSticker);
    expect(loadedSources).toContain(ASSETS.rewardRescueMedal);
  });

  it("loads Adventure Book art immediately and remains safe without Image", async () => {
    const { ASSETS, preloadAchievementArt } = await import("./assets");

    preloadAchievementArt();
    preloadAchievementArt();

    expect(new Set(loadedSources)).toEqual(new Set([
      ASSETS.goal,
      ASSETS.coinPouch,
      ASSETS.animalBunny,
      ASSETS.animalFox,
      ASSETS.animalKitten,
      ASSETS.rewardTrailSticker,
      ASSETS.rewardBraveMedal,
      ASSETS.rewardSplashSticker,
      ASSETS.rewardRescueMedal,
    ]));
    expect(loadedSources).toHaveLength(new Set(loadedSources).size);

    vi.resetModules();
    vi.stubGlobal("Image", undefined);
    const withoutImage = await import("./assets");
    expect(() => withoutImage.preloadLevelArt(levelWithRelevantArt())).not.toThrow();
    expect(() => withoutImage.preloadRewardArt()).not.toThrow();
    expect(() => withoutImage.preloadAchievementArt()).not.toThrow();
  });
});
