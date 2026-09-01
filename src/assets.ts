import type { LevelDefinition, LevelObject, TerrainKind } from "./game/types";

export const ASSETS = {
  titleBackground: "/assets/title-background-v1.webp",
  ame: "/assets/ame.png",
  ameSword: "/assets/ame-sword.png",
  portrait: "/assets/ame-portrait.png",
  goblin: "/assets/goblin.png",
  sword: "/assets/sword.png",
  potion: "/assets/potion.png",
  boots: "/assets/boots.png",
  key: "/assets/star-key.png",
  door: "/assets/star-door.png",
  goal: "/assets/goal.png",
  floor: "/assets/floor-v2.png",
  wall: "/assets/wall-v2.png",
  water: "/assets/water.png",
  lava: "/assets/lava.png",
  animalBunny: "/assets/animal-bunny.png",
  animalFox: "/assets/animal-fox.png",
  animalKitten: "/assets/animal-kitten.png",
  animalCage: "/assets/animal-cage.png",
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
  ASSETS.floor,
  ASSETS.wall,
  ASSETS.coinPouch,
] as const;

const TERRAIN_ART: Readonly<Partial<Record<TerrainKind, string>>> = {
  water: ASSETS.water,
  lava: ASSETS.lava,
};

const OBJECT_ART: Readonly<Record<Exclude<LevelObject["kind"], "animal">, readonly string[]>> = {
  enemy: [ASSETS.goblin],
  sword: [ASSETS.sword, ASSETS.ameSword],
  potion: [ASSETS.potion],
  boots: [ASSETS.boots],
  key: [ASSETS.key],
  door: [ASSETS.door],
};

const ANIMAL_ART = {
  bunny: ASSETS.animalBunny,
  fox: ASSETS.animalFox,
  kitten: ASSETS.animalKitten,
} as const;

const REWARD_ART = [
  ASSETS.goal,
  ASSETS.coinPouch,
  ASSETS.animalBunny,
  ASSETS.animalFox,
  ASSETS.animalKitten,
  ASSETS.rewardTrailSticker,
  ASSETS.rewardBraveMedal,
  ASSETS.rewardSplashSticker,
  ASSETS.rewardRescueMedal,
] as const;

const ACHIEVEMENT_ART = REWARD_ART;
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

  for (const row of level.terrain) {
    for (const terrain of row) {
      const terrainSource = TERRAIN_ART[terrain];
      if (terrainSource !== undefined) sources.add(terrainSource);
    }
  }

  for (const object of level.objects) {
    if (object.kind === "animal") {
      sources.add(ANIMAL_ART[object.species]);
      sources.add(ASSETS.animalCage);
      continue;
    }

    for (const source of OBJECT_ART[object.kind]) sources.add(source);
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
