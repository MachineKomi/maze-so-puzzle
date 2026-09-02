import {
  type AnimalSpecies,
  type EnemyStyle,
} from "./types";

export type AnimalMotion = "hop" | "waddle" | "prance" | "sway" | "snuggle" | "scamper";
export type EnemyMotion = "squish" | "flutter" | "stomp" | "skitter" | "swagger" | "bob" | "hop";

export interface AnimalPersonality {
  readonly motion: AnimalMotion;
  readonly flourish: "♥" | "✦" | "❀" | "♪" | "☁" | "❉";
  readonly greeting: string;
}

export interface EnemyPersonality {
  readonly motion: EnemyMotion;
  readonly flourish: "✦" | "☁" | "❀" | "⚙" | "◇" | "♬";
}

export const ANIMAL_PERSONALITIES: Readonly<Record<AnimalSpecies, AnimalPersonality>> = {
  bunny: { motion: "hop", flourish: "♥", greeting: "Bouncy and brave" },
  fox: { motion: "scamper", flourish: "✦", greeting: "Quick as a twinkle" },
  kitten: { motion: "sway", flourish: "♪", greeting: "Curious and clever" },
  puppy: { motion: "scamper", flourish: "♥", greeting: "Wiggly and loyal" },
  duckling: { motion: "waddle", flourish: "♪", greeting: "A cheerful little waddler" },
  hedgehog: { motion: "snuggle", flourish: "❀", greeting: "Cozy and kind" },
  fawn: { motion: "prance", flourish: "❀", greeting: "Gentle forest prancer" },
  "red-panda": { motion: "sway", flourish: "✦", greeting: "A fluffy balancing expert" },
  otter: { motion: "scamper", flourish: "♥", greeting: "Always ready to play" },
  lamb: { motion: "hop", flourish: "☁", greeting: "Soft, springy, and sweet" },
  capybara: { motion: "snuggle", flourish: "❀", greeting: "The calmest maze pal" },
  chinchilla: { motion: "sway", flourish: "✦", greeting: "Fluffy ears hear every secret" },
  alpaca: { motion: "prance", flourish: "❀", greeting: "Proudly leads the parade" },
  penguin: { motion: "waddle", flourish: "❉", greeting: "Waddles wherever friends go" },
  koala: { motion: "snuggle", flourish: "☁", greeting: "Sleepy, sweet, and steadfast" },
};

export const ENEMY_PERSONALITIES: Readonly<Record<EnemyStyle, EnemyPersonality>> = {
  goblin: { motion: "swagger", flourish: "✦" },
  "blueberry-slime": { motion: "squish", flourish: "◇" },
  "mushroom-imp": { motion: "bob", flourish: "❀" },
  "moon-bat": { motion: "flutter", flourish: "✦" },
  "pebble-golem": { motion: "stomp", flourish: "◇" },
  "acorn-knight": { motion: "swagger", flourish: "❀" },
  "bubble-dragon": { motion: "bob", flourish: "◇" },
  "candy-mimic": { motion: "squish", flourish: "♬" },
  "cloud-gremlin": { motion: "flutter", flourish: "☁" },
  "pumpkin-sprite": { motion: "hop", flourish: "❀" },
  "clockwork-crab": { motion: "skitter", flourish: "⚙" },
  "jelly-sorcerer": { motion: "squish", flourish: "✦" },
};

export function animalPersonality(species: AnimalSpecies): AnimalPersonality {
  return ANIMAL_PERSONALITIES[species];
}

export function enemyPersonality(style: EnemyStyle | undefined): EnemyPersonality {
  return ENEMY_PERSONALITIES[style ?? "goblin"];
}
