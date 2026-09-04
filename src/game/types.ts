export const DIRECTIONS = ["up", "down", "left", "right"] as const;
export const ABSOLUTE_MAZE_SIZE_LIMIT = 24;

export type Direction = (typeof DIRECTIONS)[number];

export interface Point {
  readonly x: number;
  readonly y: number;
}

export const DIRECTION_DELTAS: Readonly<Record<Direction, Point>> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export type TerrainKind = "wall" | "floor" | "water" | "lava" | "poison" | "hole";
export type LightDirection = "top" | "right" | "bottom" | "left";
export type TreasureCurrency = "gold" | "science";
export type TreasureStyle = "gold-bag" | "gold-chest" | "science-gears" | "science-beaker";
export type KeyColor = "red" | "blue" | "yellow";
export const PORTAL_PAIR_IDS = ["rose-heart", "mint-clover", "violet-moon"] as const;
export type PortalPairId = (typeof PORTAL_PAIR_IDS)[number];
export const ANIMAL_SPECIES = [
  "bunny",
  "fox",
  "kitten",
  "puppy",
  "duckling",
  "hedgehog",
  "fawn",
  "red-panda",
  "otter",
  "lamb",
  "capybara",
  "chinchilla",
  "alpaca",
  "penguin",
  "koala",
  "pitter-patter-parasol",
  "lanternling",
  "emberdown-phoenix",
  "meadowstep-faunling",
  "minerva-moon-owl",
  "tessera-dolphin",
  "mallowmusk-aroma-wisp",
  "breezeling-sylph",
  "griffin-cub",
  "emberbelly-dragonling",
  "cloudstep-pegasus",
  "three-tumble-cerberus",
  "riddlekit-sphinx",
  "tidecurl-hippocamp",
  "ripplecap-kappa",
  "rainbow-horn-unicorn",
  "green-tea-skeleton",
] as const;
export type AnimalSpecies = (typeof ANIMAL_SPECIES)[number];
export const ANIMALS_PER_LEVEL = 3;

export const TERRAIN_THEME_IDS = [
  "sunny-stone",
  "rose-courtyard",
  "moonlit-moat",
  "ember-keep",
  "star-garden",
  "moonbeam-castle",
  "wishing-woods",
  "parade-courtyard",
  "springstep-hollow",
  "lantern-ruins",
  "pearl-grotto",
  "harvest-bramble",
] as const;
export type TerrainThemeId = (typeof TERRAIN_THEME_IDS)[number];

export const WEAPON_STYLE_IDS = [
  "star-sword",
  "flower-sabre",
  "moon-wand",
  "leaf-blade",
  "sun-mallet",
  "comet-spear",
  "bubble-ring-blade",
  "cupcake-mace",
] as const;
export type WeaponStyle = (typeof WEAPON_STYLE_IDS)[number];

export const ENEMY_STYLE_IDS = [
  "goblin",
  "blueberry-slime",
  "mushroom-imp",
  "moon-bat",
  "pebble-golem",
  "acorn-knight",
  "bubble-dragon",
  "candy-mimic",
  "cloud-gremlin",
  "pumpkin-sprite",
  "clockwork-crab",
  "jelly-sorcerer",
] as const;
export type EnemyStyle = (typeof ENEMY_STYLE_IDS)[number];

export const CAGE_STYLE_IDS = [
  "golden-heart",
  "storybook-wood",
  "moon-silver",
  "garden-vine",
] as const;
export type CageStyle = (typeof CAGE_STYLE_IDS)[number];

interface ObjectBase {
  readonly id: string;
  readonly at: Point;
}

export interface EnemyObject extends ObjectBase {
  readonly kind: "enemy";
  readonly power: number;
  readonly style?: EnemyStyle;
}

export interface SwordObject extends ObjectBase {
  readonly kind: "sword";
  readonly style?: WeaponStyle;
}

export interface BootsObject extends ObjectBase {
  readonly kind: "boots";
}

export interface SpringBootsObject extends ObjectBase {
  readonly kind: "spring-boots";
}

export interface AntidoteLeafObject extends ObjectBase {
  readonly kind: "antidote-leaf";
}

export interface PotionObject extends ObjectBase {
  readonly kind: "potion";
  readonly amount: number;
}

export interface KeyObject extends ObjectBase {
  readonly kind: "key";
  readonly color: KeyColor;
}

export interface DoorObject extends ObjectBase {
  readonly kind: "door";
  readonly color: KeyColor;
}

export interface AnimalObject extends ObjectBase {
  readonly kind: "animal";
  readonly species: AnimalSpecies;
  readonly cageStyle?: CageStyle;
}

export interface PortalObject extends ObjectBase {
  readonly kind: "portal";
  readonly pair: PortalPairId;
}

export interface TreasureObject extends ObjectBase {
  readonly kind: "treasure";
  readonly currency: TreasureCurrency;
  readonly amount: number;
  readonly style: TreasureStyle;
}

export type LevelObject =
  | EnemyObject
  | SwordObject
  | BootsObject
  | SpringBootsObject
  | AntidoteLeafObject
  | PotionObject
  | KeyObject
  | DoorObject
  | AnimalObject
  | PortalObject
  | TreasureObject;

export type LevelSource = "curated" | "generated";

export interface LevelDefinition {
  readonly schemaVersion: 1;
  /** Authored traversal/content revision. Increment when a saved run is no longer replay-safe. */
  readonly contentRevision: number;
  /** Deterministic fingerprint of rules-relevant terrain, objects, start and exit. */
  readonly gameplayFingerprint: string;
  readonly id: string;
  readonly name: string;
  readonly objective: string;
  readonly source: LevelSource;
  readonly seed?: string;
  readonly width: number;
  readonly height: number;
  readonly initialPower: number;
  readonly start: Point;
  readonly exit: Point;
  readonly terrain: readonly (readonly TerrainKind[])[];
  readonly objects: readonly LevelObject[];
  readonly terrainThemeId?: TerrainThemeId;
  readonly lightDirection?: LightDirection;
  readonly introducedMechanics?: readonly string[];
}

export type GameStatus = "playing" | "won" | "lost";

/**
 * The complete serializable state of one level attempt. Arrays are kept sorted
 * by the engine so equivalent states have a stable representation.
 */
export interface GameState {
  readonly levelId: string;
  readonly position: Point;
  readonly power: number;
  readonly hasSword: boolean;
  readonly hasBoots: boolean;
  readonly hasSpringBoots: boolean;
  readonly hasAntidoteLeaf: boolean;
  readonly keys: readonly KeyColor[];
  readonly collectedObjectIds: readonly string[];
  readonly rescuedAnimalIds: readonly string[];
  readonly defeatedEnemyIds: readonly string[];
  readonly openedDoorIds: readonly string[];
  readonly goldStarsCollected: number;
  readonly sciencePointsCollected: number;
  /** False while an exit contact is pending or until Ame leaves after Stay here. */
  readonly exitArmed: boolean;
  readonly status: GameStatus;
  readonly steps: number;
}

export type BlockedReason =
  | "out-of-bounds"
  | "wall"
  | "needs-sword"
  | "needs-boots"
  | "needs-spring-boots"
  | "needs-antidote-leaf"
  | "needs-key"
  | "game-over";

export type GameEvent =
  | {
      readonly type: "blocked";
      readonly reason: BlockedReason;
      readonly target: Point;
      readonly terrain?: "water" | "lava" | "poison" | "hole";
      readonly color?: KeyColor;
    }
  | {
      readonly type: "moved";
      readonly from: Point;
      readonly to: Point;
    }
  | {
      readonly type: "sword-collected";
      readonly objectId: string;
    }
  | {
      readonly type: "boots-collected";
      readonly objectId: string;
    }
  | {
      readonly type: "spring-boots-collected";
      readonly objectId: string;
    }
  | {
      readonly type: "antidote-leaf-collected";
      readonly objectId: string;
    }
  | {
      readonly type: "hole-jumped";
      readonly from: Point;
      readonly over: readonly Point[];
      readonly to: Point;
    }
  | {
      readonly type: "key-collected";
      readonly objectId: string;
      readonly color: KeyColor;
    }
  | {
      readonly type: "potion-collected";
      readonly objectId: string;
      readonly amount: number;
      readonly powerBefore: number;
      readonly powerAfter: number;
    }
  | {
      readonly type: "animal-rescued";
      readonly objectId: string;
      readonly species: AnimalSpecies;
    }
  | {
      readonly type: "portal-warped";
      readonly pair: PortalPairId;
      readonly from: Point;
      readonly to: Point;
    }
  | {
      readonly type: "treasure-collected";
      readonly objectId: string;
      readonly currency: TreasureCurrency;
      readonly amount: number;
      readonly total: number;
    }
  | {
      readonly type: "door-opened";
      readonly objectId: string;
      readonly color: KeyColor;
    }
  | {
      readonly type: "enemy-defeated";
      readonly objectId: string;
      readonly enemyPower: number;
      readonly powerBefore: number;
      readonly powerAfter: number;
    }
  | {
      readonly type: "enemy-too-strong";
      readonly objectId: string;
      readonly playerPower: number;
      readonly enemyPower: number;
    }
  | {
      readonly type: "level-won";
      readonly steps: number;
      readonly power: number;
    };

export interface MoveResult {
  readonly state: GameState;
  /** True only when Ame's grid position changed; interactions can still update state. */
  readonly moved: boolean;
  readonly events: readonly GameEvent[];
}
