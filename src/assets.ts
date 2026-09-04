import {
  ACHIEVEMENT_ART,
  AME_ART,
  ANIMAL_ART,
  CAGE_ART,
  DEFAULT_CAGE_STYLE,
  DEFAULT_ENEMY_STYLE,
  DEFAULT_KEY_COLOR,
  DEFAULT_TERRAIN_THEME_ID,
  DEFAULT_WEAPON_STYLE,
  DOOR_ART,
  ENEMY_ART,
  FRONT_DOOR_ART,
  HAZARD_ART,
  GOAL_ART,
  KEY_ART,
  NAVIGATION_ART,
  PICKUP_ART,
  PORTAL_ART,
  STORY_ART,
  TERRAIN_THEMES,
  TREASURE_CATALOG_ART,
  WEAPON_ART,
  resolveAnimalArt,
  resolveCageArt,
  resolveDoorArt,
  resolveEnemyArt,
  resolveKeyArt,
  resolvePortalArt,
  resolveTerrainTheme,
  resolveWeaponArt,
} from "./artCatalog";
import type { LevelDefinition, TerrainKind } from "./game/types";
import type { BadgeId, RescueMedalId, StickerId } from "./progress";

export const ASSETS = {
  titleBackground: FRONT_DOOR_ART.titleEnvironment.src,
  titleBackgroundFallback: FRONT_DOOR_ART.titleEnvironment.fallbackSrc,
  homeHeroSplash: FRONT_DOOR_ART.homeHeroSplash.src,
  homeHeroSplashFallback: FRONT_DOOR_ART.homeHeroSplash.fallbackSrc,
  gameLogo: FRONT_DOOR_ART.gameLogo.default.src,
  gameLogoCompact: FRONT_DOOR_ART.gameLogo.compact.src,
  gameLogoFallback: FRONT_DOOR_ART.gameLogo.default.fallbackSrc,
  ame: AME_ART.src,
  portrait: STORY_ART.amePortrait.src,
  goblin: ENEMY_ART[DEFAULT_ENEMY_STYLE].src,
  sword: WEAPON_ART[DEFAULT_WEAPON_STYLE].src,
  potion: PICKUP_ART.potion.src,
  boots: PICKUP_ART.boots.src,
  springBoots: PICKUP_ART.springBoots.src,
  key: KEY_ART[DEFAULT_KEY_COLOR].src,
  door: DOOR_ART[DEFAULT_KEY_COLOR].src,
  keyRoseHeart: KEY_ART.red.src,
  keyBlueStar: KEY_ART.blue.src,
  keySunnySun: KEY_ART.yellow.src,
  doorRoseHeart: DOOR_ART.red.src,
  doorBlueStar: DOOR_ART.blue.src,
  doorSunnySun: DOOR_ART.yellow.src,
  portalRoseHeart: PORTAL_ART["rose-heart"].src,
  portalMintClover: PORTAL_ART["mint-clover"].src,
  portalVioletMoon: PORTAL_ART["violet-moon"].src,
  goal: GOAL_ART.src,
  floor: TERRAIN_THEMES[DEFAULT_TERRAIN_THEME_ID].floor.src,
  wall: TERRAIN_THEMES[DEFAULT_TERRAIN_THEME_ID].wall.src,
  water: HAZARD_ART.water.src,
  lava: HAZARD_ART.lava.src,
  poison: HAZARD_ART.poison.src,
  hole: HAZARD_ART.hole.src,
  antidoteLeaf: PICKUP_ART.antidoteLeaf.src,
  animalBunny: ANIMAL_ART.bunny.src,
  animalFox: ANIMAL_ART.fox.src,
  animalKitten: ANIMAL_ART.kitten.src,
  animalPuppy: ANIMAL_ART.puppy.src,
  animalDuckling: ANIMAL_ART.duckling.src,
  animalHedgehog: ANIMAL_ART.hedgehog.src,
  animalFawn: ANIMAL_ART.fawn.src,
  animalRedPanda: ANIMAL_ART["red-panda"].src,
  animalOtter: ANIMAL_ART.otter.src,
  animalLamb: ANIMAL_ART.lamb.src,
  animalCapybara: ANIMAL_ART.capybara.src,
  animalChinchilla: ANIMAL_ART.chinchilla.src,
  animalAlpaca: ANIMAL_ART.alpaca.src,
  animalPenguin: ANIMAL_ART.penguin.src,
  animalKoala: ANIMAL_ART.koala.src,
  animalCage: CAGE_ART[DEFAULT_CAGE_STYLE].src,
  cageStorybookWood: CAGE_ART["storybook-wood"].src,
  cageMoonSilver: CAGE_ART["moon-silver"].src,
  cageGardenVine: CAGE_ART["garden-vine"].src,
  weaponFlowerSabre: WEAPON_ART["flower-sabre"].src,
  weaponMoonWand: WEAPON_ART["moon-wand"].src,
  weaponLeafBlade: WEAPON_ART["leaf-blade"].src,
  weaponSunMallet: WEAPON_ART["sun-mallet"].src,
  weaponCometSpear: WEAPON_ART["comet-spear"].src,
  weaponBubbleRingBlade: WEAPON_ART["bubble-ring-blade"].src,
  weaponCupcakeMace: WEAPON_ART["cupcake-mace"].src,
  enemyBlueberrySlime: ENEMY_ART["blueberry-slime"].src,
  enemyMushroomImp: ENEMY_ART["mushroom-imp"].src,
  enemyMoonBat: ENEMY_ART["moon-bat"].src,
  enemyPebbleGolem: ENEMY_ART["pebble-golem"].src,
  enemyAcornKnight: ENEMY_ART["acorn-knight"].src,
  enemyBubbleDragon: ENEMY_ART["bubble-dragon"].src,
  enemyCandyMimic: ENEMY_ART["candy-mimic"].src,
  enemyCloudGremlin: ENEMY_ART["cloud-gremlin"].src,
  enemyPumpkinSprite: ENEMY_ART["pumpkin-sprite"].src,
  enemyClockworkCrab: ENEMY_ART["clockwork-crab"].src,
  enemyJellySorcerer: ENEMY_ART["jelly-sorcerer"].src,
  coinPouch: TREASURE_CATALOG_ART["gold-bag"].src,
  treasureGoldBag: TREASURE_CATALOG_ART["gold-bag"].src,
  treasureGoldChest: TREASURE_CATALOG_ART["gold-chest"].src,
  treasureScienceGears: TREASURE_CATALOG_ART["science-gears"].src,
  treasureScienceBeaker: TREASURE_CATALOG_ART["science-beaker"].src,
  navHome: NAVIGATION_ART["nav-home"].src,
  navMazes: NAVIGATION_ART["nav-mazes"].src,
  navBook: NAVIGATION_ART["nav-book"].src,
  navHelp: NAVIGATION_ART["nav-help"].src,
  navSound: NAVIGATION_ART["nav-sound"].src,
  navMuted: NAVIGATION_ART["nav-muted"].src,
  navRestart: NAVIGATION_ART["nav-restart"].src,
  storyProfessorPoggle: STORY_ART.professorPoggle.src,
  storySprig: STORY_ART.sprig.src,
  rewardTrailSticker: ACHIEVEMENT_ART["first-star"].src,
  rewardAnimalFriendSticker: ACHIEVEMENT_ART["animal-friend"].src,
  rewardSurpriseSparkleSticker: ACHIEVEMENT_ART["surprise-sparkle"].src,
  rewardHelpingPawMedal: ACHIEVEMENT_ART["perfect-rescue-5"].src,
  rewardRainbowRescueMedal: ACHIEVEMENT_ART["perfect-rescue-10"].src,
  rewardGoldenGuardianMedal: ACHIEVEMENT_ART["perfect-rescue-15"].src,
  badgePathfinder: ACHIEVEMENT_ART["maze-explorer-5"].src,
  badgeMazeMapper: ACHIEVEMENT_ART["maze-explorer-10"].src,
  badgeGrandExplorer: ACHIEVEMENT_ART["maze-explorer-20"].src,
  badgeSurpriseScout: ACHIEVEMENT_ART["surprise-explorer-3"].src,
  badgeMightyAdventurer: ACHIEVEMENT_ART["mighty-adventurer"].src,
  badgeTwinkleToes: ACHIEVEMENT_ART["twinkle-toes"].src,
  badgeBunnyBuddy: ACHIEVEMENT_ART["bunny-buddy-10"].src,
  badgeFoxFriend: ACHIEVEMENT_ART["fox-friend-10"].src,
  badgeKittenPal: ACHIEVEMENT_ART["kitten-pal-10"].src,
} as const;

export const STICKER_ART: Readonly<Record<StickerId, string>> = {
  "first-star": ASSETS.rewardTrailSticker,
  "animal-friend": ASSETS.rewardAnimalFriendSticker,
  "surprise-sparkle": ASSETS.rewardSurpriseSparkleSticker,
};

export const MEDAL_ART: Readonly<Record<RescueMedalId, string>> = {
  "perfect-rescue-5": ASSETS.rewardHelpingPawMedal,
  "perfect-rescue-10": ASSETS.rewardRainbowRescueMedal,
  "perfect-rescue-15": ASSETS.rewardGoldenGuardianMedal,
};

export const BADGE_ART: Readonly<Record<BadgeId, string>> = {
  "maze-explorer-5": ASSETS.badgePathfinder,
  "maze-explorer-10": ASSETS.badgeMazeMapper,
  "maze-explorer-20": ASSETS.badgeGrandExplorer,
  "surprise-explorer-3": ASSETS.badgeSurpriseScout,
  "mighty-adventurer": ASSETS.badgeMightyAdventurer,
  "twinkle-toes": ASSETS.badgeTwinkleToes,
  "bunny-buddy-10": ASSETS.badgeBunnyBuddy,
  "fox-friend-10": ASSETS.badgeFoxFriend,
  "kitten-pal-10": ASSETS.badgeKittenPal,
};

const COMMON_GAMEPLAY_ART = [
  ASSETS.ame,
  ASSETS.portrait,
  ASSETS.goal,
  ASSETS.coinPouch,
  ASSETS.storyProfessorPoggle,
  ASSETS.storySprig,
] as const;

const TERRAIN_ART: Readonly<Partial<Record<TerrainKind, string>>> = {
  water: ASSETS.water,
  lava: ASSETS.lava,
  poison: ASSETS.poison,
  hole: ASSETS.hole,
};

const STATIC_OBJECT_ART = {
  potion: [ASSETS.potion],
  boots: [ASSETS.boots],
  "spring-boots": [ASSETS.springBoots],
  "antidote-leaf": [ASSETS.antidoteLeaf],
} as const;

export const TREASURE_ART = {
  "gold-bag": ASSETS.treasureGoldBag,
  "gold-chest": ASSETS.treasureGoldChest,
  "science-gears": ASSETS.treasureScienceGears,
  "science-beaker": ASSETS.treasureScienceBeaker,
} as const;

const REWARD_ART = [
  ASSETS.goal,
  ASSETS.coinPouch,
  ASSETS.rewardTrailSticker,
  ASSETS.rewardAnimalFriendSticker,
  ASSETS.rewardSurpriseSparkleSticker,
  ASSETS.rewardHelpingPawMedal,
  ASSETS.rewardRainbowRescueMedal,
  ASSETS.rewardGoldenGuardianMedal,
] as const;

const ACHIEVEMENT_ABOVE_FOLD_ART = [
  ...REWARD_ART,
  ANIMAL_ART.bunny.src,
  ANIMAL_ART.fox.src,
  ANIMAL_ART.kitten.src,
  ANIMAL_ART.puppy.src,
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
  if (theme.floorDressing) sources.add(theme.floorDressing.src);
  if (theme.wallDressing) sources.add(theme.wallDressing.src);

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
      case "key":
        sources.add(resolveKeyArt(object.color).src);
        break;
      case "door":
        sources.add(resolveDoorArt(object.color).src);
        break;
      case "portal":
        sources.add(resolvePortalArt(object.pair).src);
        break;
      case "treasure":
        sources.add(TREASURE_ART[object.style]);
        break;
      case "potion":
      case "boots":
      case "spring-boots":
      case "antidote-leaf":
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

/**
 * Warm only the Adventure Book's visible opening shelf. The remaining friend
 * portraits use native lazy loading, so opening the book does not eagerly
 * download the entire growing rescue catalogue on mobile.
 */
export function preloadAchievementArt(): void {
  preloadSources(ACHIEVEMENT_ABOVE_FOLD_ART);
}
