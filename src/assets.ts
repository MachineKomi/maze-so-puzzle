import {
  ANIMAL_ART,
  CAGE_ART,
  DEFAULT_CAGE_STYLE,
  DEFAULT_ENEMY_STYLE,
  DEFAULT_TERRAIN_THEME_ID,
  DEFAULT_WEAPON_STYLE,
  ENEMY_ART,
  TERRAIN_THEMES,
  WEAPON_ART,
  resolveAnimalArt,
  resolveCageArt,
  resolveEnemyArt,
  resolveTerrainTheme,
  resolveWeaponArt,
} from "./artCatalog";
import type { LevelDefinition, TerrainKind } from "./game/types";

export const ASSETS = {
  titleBackground: "/assets/title-background-v1.webp",
  ame: "/assets/ame.png",
  ameSword: "/assets/ame-sword.png",
  portrait: "/assets/ame-portrait.png",
  goblin: ENEMY_ART[DEFAULT_ENEMY_STYLE].src,
  sword: WEAPON_ART[DEFAULT_WEAPON_STYLE].src,
  potion: "/assets/potion.png",
  boots: "/assets/boots.png",
  springBoots: "/assets/spring-boots-v1.png",
  key: "/assets/star-key.png",
  door: "/assets/star-door.png",
  goal: "/assets/goal.png",
  floor: TERRAIN_THEMES[DEFAULT_TERRAIN_THEME_ID].floor.src,
  wall: TERRAIN_THEMES[DEFAULT_TERRAIN_THEME_ID].wall.src,
  water: "/assets/water-v2.png",
  lava: "/assets/lava-v2.png",
  hole: "/assets/ground-hole-v1.png",
  animalBunny: ANIMAL_ART.bunny.src,
  animalFox: ANIMAL_ART.fox.src,
  animalKitten: ANIMAL_ART.kitten.src,
  animalPuppy: ANIMAL_ART.puppy.src,
  animalDuckling: ANIMAL_ART.duckling.src,
  animalHedgehog: ANIMAL_ART.hedgehog.src,
  animalFawn: ANIMAL_ART.fawn.src,
  animalRedPanda: ANIMAL_ART["red-panda"].src,
  animalCage: CAGE_ART[DEFAULT_CAGE_STYLE].src,
  cageStorybookWood: CAGE_ART["storybook-wood"].src,
  cageMoonSilver: CAGE_ART["moon-silver"].src,
  cageGardenVine: CAGE_ART["garden-vine"].src,
  weaponFlowerSabre: WEAPON_ART["flower-sabre"].src,
  weaponMoonWand: WEAPON_ART["moon-wand"].src,
  weaponLeafBlade: WEAPON_ART["leaf-blade"].src,
  weaponSunMallet: WEAPON_ART["sun-mallet"].src,
  enemyBlueberrySlime: ENEMY_ART["blueberry-slime"].src,
  enemyMushroomImp: ENEMY_ART["mushroom-imp"].src,
  enemyMoonBat: ENEMY_ART["moon-bat"].src,
  enemyPebbleGolem: ENEMY_ART["pebble-golem"].src,
  coinPouch: "/assets/coin-pouch.png",
  rewardTrailSticker: "/assets/reward-trail-sticker.png",
  rewardBraveMedal: "/assets/reward-brave-medal.png",
  rewardSplashSticker: "/assets/reward-splash-sticker.png",
  rewardRescueMedal: "/assets/reward-rescue-medal.png",
} as const;

const COMMON_GAMEPLAY_ART = [
  ASSETS.ame,
  ASSETS.portrait,
  ASSETS.goal,
  ASSETS.coinPouch,
] as const;

const TERRAIN_ART: Readonly<Partial<Record<TerrainKind, string>>> = {
  water: ASSETS.water,
  lava: ASSETS.lava,
  hole: ASSETS.hole,
};

const STATIC_OBJECT_ART = {
  potion: [ASSETS.potion],
  boots: [ASSETS.boots],
  "spring-boots": [ASSETS.springBoots],
  key: [ASSETS.key],
  door: [ASSETS.door],
} as const;

const REWARD_ART = [
  ASSETS.goal,
  ASSETS.coinPouch,
  ASSETS.rewardTrailSticker,
  ASSETS.rewardBraveMedal,
  ASSETS.rewardSplashSticker,
  ASSETS.rewardRescueMedal,
] as const;

const ACHIEVEMENT_ART = [
  ...REWARD_ART,
  ...Object.values(ANIMAL_ART).map((art) => art.src),
] as const;
const preloadedSources = new Set<string>();
let rewardPreloadScheduled = false;

interface IdleScheduler {
  requestIdleCallback?: (
    callback: (deadline: { readonly didTimeout: boolean; timeRemaining(): number }) => void,
    options?: { readonly timeout: number },
  ) => number;
}

function preloadSources(sources: Iterable<string>): void {
  if (typeof Image === "undefined") return;

  for (const source of sources) {
    if (preloadedSources.has(source)) continue;
    preloadedSources.add(source);

    const image = new Image();
    image.decoding = "async";
    image.src = source;
  }
}

/**
 * Warm only the art that can appear in one playable level. Shared player/UI
 * art is always included, while hazards, items, enemies, and animal species
 * are selected from the supplied level definition.
 */
export function preloadLevelArt(level: LevelDefinition): void {
  const sources = new Set<string>(COMMON_GAMEPLAY_ART);
  const theme = resolveTerrainTheme(level.terrainThemeId);
  sources.add(theme.floor.src);
  sources.add(theme.wall.src);

  for (const row of level.terrain) {
    for (const terrain of row) {
      const terrainSource = TERRAIN_ART[terrain];
      if (terrainSource !== undefined) sources.add(terrainSource);
    }
  }

  for (const object of level.objects) {
    switch (object.kind) {
      case "animal":
        sources.add(resolveAnimalArt(object.species).src);
        sources.add(resolveCageArt(object.cageStyle).src);
        break;
      case "enemy":
        sources.add(resolveEnemyArt(object.style).src);
        break;
      case "sword":
        sources.add(resolveWeaponArt(object.style).src);
        break;
      case "potion":
      case "boots":
      case "spring-boots":
      case "key":
      case "door":
        for (const source of STATIC_OBJECT_ART[object.kind]) sources.add(source);
        break;
    }
  }

  preloadSources(sources);
}

/**
 * Warm completion-modal art outside the critical interaction path. Browsers
 * with requestIdleCallback defer the work until idle; other browsers use a
 * short timer so level art can paint first. Repeated calls schedule once.
 */
export function preloadRewardArt(): void {
  if (rewardPreloadScheduled) return;
  rewardPreloadScheduled = true;

  const scheduler = globalThis as typeof globalThis & IdleScheduler;
  if (typeof scheduler.requestIdleCallback === "function") {
    scheduler.requestIdleCallback(() => preloadSources(REWARD_ART), { timeout: 1_500 });
    return;
  }

  if (typeof window !== "undefined") {
    window.setTimeout(() => preloadSources(REWARD_ART), 450);
    return;
  }

  preloadSources(REWARD_ART);
}

/** Warm the complete bitmap set used by the Adventure Book. */
export function preloadAchievementArt(): void {
  preloadSources(ACHIEVEMENT_ART);
}
