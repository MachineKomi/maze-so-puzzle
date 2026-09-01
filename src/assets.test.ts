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
    terrainThemeId: "star-garden",
    width: 4,
    height: 2,
    initialPower: 2,
    start: { x: 1, y: 1 },
    exit: { x: 2, y: 1 },
    terrain: [
      ["wall", "wall", "wall", "wall"],
      ["wall", "hole", "water", "wall"],
    ],
    objects: [
      { id: "enemy", kind: "enemy", at: { x: 1, y: 1 }, power: 1, style: "blueberry-slime" },
      { id: "sword", kind: "sword", at: { x: 1, y: 1 }, style: "flower-sabre" },
      { id: "key", kind: "key", at: { x: 1, y: 1 }, color: "red" },
      { id: "door", kind: "door", at: { x: 2, y: 1 }, color: "red" },
      { id: "spring-boots", kind: "spring-boots", at: { x: 1, y: 1 } },
      { id: "puppy", kind: "animal", at: { x: 2, y: 1 }, species: "puppy", cageStyle: "garden-vine" },
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
  it("uses the current seamless terrain asset revisions", async () => {
    const { ASSETS } = await import("./assets");

    expect({
      floor: ASSETS.floor,
      wall: ASSETS.wall,
      water: ASSETS.water,
      lava: ASSETS.lava,
      hole: ASSETS.hole,
    }).toEqual({
      floor: "/assets/floor-v3.png",
      wall: "/assets/wall-v3.png",
      water: "/assets/water-v2.png",
      lava: "/assets/lava-v2.png",
      hole: "/assets/ground-hole-v1.png",
    });
  });

  it("loads common gameplay art plus only the supplied level's terrain and objects", async () => {
    const { ASSETS, preloadLevelArt } = await import("./assets");
    const {
      resolveAnimalArt,
      resolveCageArt,
      resolveEnemyArt,
      resolveTerrainTheme,
      resolveWeaponArt,
    } = await import("./artCatalog");
    const theme = resolveTerrainTheme("star-garden");

    preloadLevelArt(levelWithRelevantArt());
    preloadLevelArt(levelWithRelevantArt());

    expect(new Set(loadedSources)).toEqual(new Set([
      ASSETS.ame,
      ASSETS.portrait,
      ASSETS.goal,
      ASSETS.coinPouch,
      theme.floor.src,
      theme.wall.src,
      ASSETS.water,
      ASSETS.hole,
      resolveEnemyArt("blueberry-slime").src,
      resolveWeaponArt("flower-sabre").src,
      ASSETS.key,
      ASSETS.door,
      ASSETS.springBoots,
      resolveAnimalArt("puppy").src,
      resolveCageArt("garden-vine").src,
    ]));
    expect(loadedSources).toHaveLength(new Set(loadedSources).size);
    expect(loadedSources).not.toContain(ASSETS.titleBackground);
    expect(loadedSources).not.toContain(ASSETS.floor);
    expect(loadedSources).not.toContain(ASSETS.wall);
    expect(loadedSources).not.toContain(ASSETS.lava);
    expect(loadedSources).not.toContain(ASSETS.goblin);
    expect(loadedSources).not.toContain(ASSETS.sword);
    expect(loadedSources).not.toContain(ASSETS.ameSword);
    expect(loadedSources).not.toContain(ASSETS.potion);
    expect(loadedSources).not.toContain(ASSETS.boots);
    expect(loadedSources).not.toContain(ASSETS.animalFox);
    expect(loadedSources).not.toContain(ASSETS.animalCage);
    expect(loadedSources).not.toContain(ASSETS.rewardTrailSticker);
  });

  it("falls back to the legacy default theme and variants when style metadata is absent", async () => {
    const { ASSETS, preloadLevelArt } = await import("./assets");
    const legacyLevel: LevelDefinition = {
      ...levelWithRelevantArt(),
      terrainThemeId: undefined,
      objects: [
        { id: "enemy", kind: "enemy", at: { x: 1, y: 1 }, power: 1 },
        { id: "sword", kind: "sword", at: { x: 1, y: 1 } },
        { id: "bunny", kind: "animal", at: { x: 2, y: 1 }, species: "bunny" },
      ],
    };

    preloadLevelArt(legacyLevel);

    expect(loadedSources).toContain(ASSETS.floor);
    expect(loadedSources).toContain(ASSETS.wall);
    expect(loadedSources).toContain(ASSETS.goblin);
    expect(loadedSources).toContain(ASSETS.sword);
    expect(loadedSources).not.toContain(ASSETS.ameSword);
    expect(loadedSources).toContain(ASSETS.animalBunny);
    expect(loadedSources).toContain(ASSETS.animalCage);
    expect(loadedSources).not.toContain(ASSETS.enemyBlueberrySlime);
    expect(loadedSources).not.toContain(ASSETS.weaponFlowerSabre);
    expect(loadedSources).not.toContain(ASSETS.animalPuppy);
    expect(loadedSources).not.toContain(ASSETS.cageGardenVine);
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
      ASSETS.animalPuppy,
      ASSETS.animalDuckling,
      ASSETS.animalHedgehog,
      ASSETS.animalFawn,
      ASSETS.animalRedPanda,
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
