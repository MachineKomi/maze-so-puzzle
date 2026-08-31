export const ASSETS = {
  titleBackground: "/assets/title-background-v1.webp",
  ame: "/assets/ame.png",
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

export function preloadGameArt(): void {
  Object.values(ASSETS).forEach((source) => {
    const image = new Image();
    image.decoding = "async";
    image.src = source;
  });
}
