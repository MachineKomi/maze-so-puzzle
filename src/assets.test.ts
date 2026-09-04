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
  contentRevision: 1,
  gameplayFingerprint: "test-assets",
    id: "preload-test",
    name: "Preload Test",
    objective: "Test only the required art.",
    source: "curated",
    terrainThemeId: "star-garden",
    width: 4,
    height: 3,
    initialPower: 2,
    start: { x: 1, y: 1 },
    exit: { x: 2, y: 1 },
    terrain: [
      ["wall", "wall", "wall", "wall"],
      ["wall", "hole", "water", "wall"],
      ["wall", "poison", "floor", "wall"],
    ],
    objects: [
      { id: "enemy", kind: "enemy", at: { x: 1, y: 1 }, power: 1, style: "blueberry-slime" },
      { id: "sword", kind: "sword", at: { x: 1, y: 1 }, style: "flower-sabre" },
      { id: "key", kind: "key", at: { x: 1, y: 1 }, color: "red" },
      { id: "door", kind: "door", at: { x: 2, y: 1 }, color: "red" },
      { id: "portal", kind: "portal", at: { x: 2, y: 2 }, pair: "mint-clover" },
      { id: "spring-boots", kind: "spring-boots", at: { x: 1, y: 1 } },
      { id: "antidote-leaf", kind: "antidote-leaf", at: { x: 1, y: 2 } },
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
    const { MGJRPG02_ART } = await import("./artCatalog");

    expect({
      floor: ASSETS.floor,
      wall: ASSETS.wall,
      water: ASSETS.water,
      lava: ASSETS.lava,
      poison: ASSETS.poison,
      hole: ASSETS.hole,
      antidoteLeaf: ASSETS.antidoteLeaf,
      boots: ASSETS.boots,
    }).toEqual({
      floor: MGJRPG02_ART["floor-sunny-stone"].src,
      wall: MGJRPG02_ART["wall-lavender-stone"].src,
      water: MGJRPG02_ART["terrain-water"].src,
      lava: MGJRPG02_ART["terrain-lava"].src,
      poison: MGJRPG02_ART["terrain-poison"].src,
      hole: MGJRPG02_ART["ground-hole"].src,
      antidoteLeaf: MGJRPG02_ART["antidote-leaf"].src,
      boots: MGJRPG02_ART["splash-boots"].src,
    });
  });

  it("projects current Ame and hazard URLs from the typed art catalogue", async () => {
    const { ASSETS } = await import("./assets");
    const { AME_ART, HAZARD_ART } = await import("./artCatalog");

    expect(ASSETS.ame).toBe(AME_ART.src);
    expect({
      water: ASSETS.water,
      lava: ASSETS.lava,
      poison: ASSETS.poison,
      hole: ASSETS.hole,
    }).toEqual({
      water: HAZARD_ART.water.src,
      lava: HAZARD_ART.lava.src,
      poison: HAZARD_ART.poison.src,
      hole: HAZARD_ART.hole.src,
    });
  });

  it("exposes dedicated lock-pair assets while keeping blue compatibility aliases", async () => {
    const { ASSETS } = await import("./assets");
    const { MGJRPG02_ART } = await import("./artCatalog");

    expect({
      legacyKey: ASSETS.key,
      legacyDoor: ASSETS.door,
      roseKey: ASSETS.keyRoseHeart,
      roseDoor: ASSETS.doorRoseHeart,
      blueKey: ASSETS.keyBlueStar,
      blueDoor: ASSETS.doorBlueStar,
      sunnyKey: ASSETS.keySunnySun,
      sunnyDoor: ASSETS.doorSunnySun,
    }).toEqual({
      legacyKey: MGJRPG02_ART["key-blue-star"].src,
      legacyDoor: MGJRPG02_ART["door-blue-star"].src,
      roseKey: MGJRPG02_ART["key-rose-heart"].src,
      roseDoor: MGJRPG02_ART["door-rose-heart"].src,
      blueKey: MGJRPG02_ART["key-blue-star"].src,
      blueDoor: MGJRPG02_ART["door-blue-star"].src,
      sunnyKey: MGJRPG02_ART["key-sunny-sun"].src,
      sunnyDoor: MGJRPG02_ART["door-sunny-sun"].src,
    });
  });

  it("uses canonical ring-blade and paired sound-state assets", async () => {
    const { ASSETS } = await import("./assets");
    const { MGJRPG02_ART, NAVIGATION_ART, WEAPON_ART } = await import("./artCatalog");

    expect(ASSETS.weaponBubbleRingBlade).toBe(WEAPON_ART["bubble-ring-blade"].src);
    expect(ASSETS.weaponBubbleRingBlade).toBe(MGJRPG02_ART["bubble-ring-blade"].src);
    expect(ASSETS.navSound).toBe(NAVIGATION_ART["nav-sound"].src);
    expect(ASSETS.navMuted).toBe(NAVIGATION_ART["nav-muted"].src);
    expect(ASSETS.navMuted).not.toBe(ASSETS.navSound);
  });

  it("projects the active title environment without preloading dormant Plan 01 layers", async () => {
    const { ASSETS } = await import("./assets");
    const { FRONT_DOOR_ART } = await import("./artCatalog");

    expect(ASSETS.titleBackground).toBe(FRONT_DOOR_ART.titleEnvironment.src);
    expect(ASSETS.titleBackgroundFallback).toBe("/assets/title-background-v1.webp");
    expect(ASSETS.homeHeroSplash).toBe(FRONT_DOOR_ART.homeHeroSplash.src);
    expect(ASSETS.gameLogo).toBe(FRONT_DOOR_ART.gameLogo.default.src);
    expect(ASSETS.gameLogoCompact).toBe(FRONT_DOOR_ART.gameLogo.compact.src);
  });

  it("loads common gameplay art plus only the supplied level's terrain and objects", async () => {
    const { ASSETS, preloadLevelArt } = await import("./assets");
    const {
      resolveAnimalArt,
      resolveCageArt,
      resolveDoorArt,
      resolveEnemyArt,
      resolveKeyArt,
      resolvePortalArt,
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
      ASSETS.storyProfessorPoggle,
      ASSETS.storySprig,
      theme.floor.src,
      theme.wall.src,
      theme.floorDressing!.src,
      ASSETS.water,
      ASSETS.poison,
      ASSETS.hole,
      resolveEnemyArt("blueberry-slime").src,
      resolveWeaponArt("flower-sabre").src,
      resolveKeyArt("red").src,
      resolveDoorArt("red").src,
      resolvePortalArt("mint-clover").src,
      ASSETS.springBoots,
      ASSETS.antidoteLeaf,
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
    expect(loadedSources).not.toContain(ASSETS.keyBlueStar);
    expect(loadedSources).not.toContain(ASSETS.doorBlueStar);
    expect(loadedSources).not.toContain(ASSETS.keySunnySun);
    expect(loadedSources).not.toContain(ASSETS.doorSunnySun);
    expect(loadedSources).not.toContain(ASSETS.potion);
    expect(loadedSources).not.toContain(ASSETS.boots);
    expect(loadedSources).not.toContain(ASSETS.animalFox);
    expect(loadedSources).not.toContain(ASSETS.animalCage);
    expect(loadedSources).not.toContain(ASSETS.rewardTrailSticker);
  });

  it("preloads sparse wall dressing for its selected ruin theme", async () => {
    const { preloadLevelArt } = await import("./assets");
    const { resolveTerrainTheme } = await import("./artCatalog");
    const theme = resolveTerrainTheme("lantern-ruins");
    const ruinLevel: LevelDefinition = {
      ...levelWithRelevantArt(),
      id: "wall-dressing-preload-test",
      terrainThemeId: "lantern-ruins",
      terrain: [
        ["wall", "wall", "wall", "wall"],
        ["wall", "floor", "floor", "wall"],
      ],
      objects: [],
    };

    preloadLevelArt(ruinLevel);

    expect(theme.wallDressing).toBeDefined();
    expect(loadedSources).toContain(theme.wallDressing!.src);
    expect(theme.floorDressing).toBeUndefined();
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
      ASSETS.rewardAnimalFriendSticker,
      ASSETS.rewardSurpriseSparkleSticker,
      ASSETS.rewardHelpingPawMedal,
      ASSETS.rewardRainbowRescueMedal,
      ASSETS.rewardGoldenGuardianMedal,
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
    expect(loadedSources).toContain(ASSETS.rewardGoldenGuardianMedal);
  });

  it("loads only the Adventure Book opening shelf and remains safe without Image", async () => {
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
      ASSETS.rewardTrailSticker,
      ASSETS.rewardAnimalFriendSticker,
      ASSETS.rewardSurpriseSparkleSticker,
      ASSETS.rewardHelpingPawMedal,
      ASSETS.rewardRainbowRescueMedal,
      ASSETS.rewardGoldenGuardianMedal,
    ]));
    expect(loadedSources).toHaveLength(new Set(loadedSources).size);
    expect(loadedSources).not.toContain(ASSETS.animalCapybara);
    expect(loadedSources).not.toContain(ASSETS.animalKoala);

    vi.resetModules();
    vi.stubGlobal("Image", undefined);
    const withoutImage = await import("./assets");
    expect(() => withoutImage.preloadLevelArt(levelWithRelevantArt())).not.toThrow();
    expect(() => withoutImage.preloadRewardArt()).not.toThrow();
    expect(() => withoutImage.preloadAchievementArt()).not.toThrow();
  });

  it("gives every sticker, medal, and badge its own rendered art", async () => {
    const { BADGE_ART, MEDAL_ART, STICKER_ART } = await import("./assets");
    const stickerIds = ["first-star", "animal-friend", "surprise-sparkle"];
    const medalIds = ["perfect-rescue-5", "perfect-rescue-10", "perfect-rescue-15"];
    const badgeIds = [
      "maze-explorer-5",
      "maze-explorer-10",
      "maze-explorer-20",
      "surprise-explorer-3",
      "mighty-adventurer",
      "twinkle-toes",
      "bunny-buddy-10",
      "fox-friend-10",
      "kitten-pal-10",
    ];
    const allArt = [
      ...Object.values(STICKER_ART),
      ...Object.values(MEDAL_ART),
      ...Object.values(BADGE_ART),
    ];

    expect(Object.keys(STICKER_ART)).toEqual(stickerIds);
    expect(Object.keys(MEDAL_ART)).toEqual(medalIds);
    expect(Object.keys(BADGE_ART)).toEqual(badgeIds);
    expect(new Set(allArt).size).toBe(15);
    expect(allArt.every((source) => source.startsWith("/assets/"))).toBe(true);
  });
});
