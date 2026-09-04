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
  "pitter-patter-parasol": { motion: "waddle", flourish: "❉", greeting: "Pitter-patter, rain or shine" },
  lanternling: { motion: "sway", flourish: "✦", greeting: "A tiny light for the way" },
  "emberdown-phoenix": { motion: "prance", flourish: "✦", greeting: "Warm sparks and brave feathers" },
  "meadowstep-faunling": { motion: "prance", flourish: "❀", greeting: "Dances where flowers grow" },
  "minerva-moon-owl": { motion: "sway", flourish: "✦", greeting: "A very wise little hoot" },
  "tessera-dolphin": { motion: "hop", flourish: "❉", greeting: "Leaps through moonlit ripples" },
  "mallowmusk-aroma-wisp": { motion: "sway", flourish: "☁", greeting: "A funny puff with a kind heart" },
  "breezeling-sylph": { motion: "sway", flourish: "❀", greeting: "A giggle on the breeze" },
  "griffin-cub": { motion: "prance", flourish: "✦", greeting: "Proud paws, tiny wings" },
  "emberbelly-dragonling": { motion: "waddle", flourish: "✦", greeting: "A warm and rumbly friend" },
  "cloudstep-pegasus": { motion: "prance", flourish: "☁", greeting: "Trots on little clouds" },
  "three-tumble-cerberus": { motion: "scamper", flourish: "♥", greeting: "Three times the tail wags" },
  "riddlekit-sphinx": { motion: "sway", flourish: "✦", greeting: "Knows a tiny clever riddle" },
  "tidecurl-hippocamp": { motion: "sway", flourish: "❉", greeting: "Carries a pocket of sea breeze" },
  "ripplecap-kappa": { motion: "waddle", flourish: "❉", greeting: "A cucumber-loving ripple pal" },
  "rainbow-horn-unicorn": { motion: "prance", flourish: "✦", greeting: "Makes every path more magical" },
  "green-tea-skeleton": { motion: "sway", flourish: "♪", greeting: "Tea tastes better with friends" },
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
