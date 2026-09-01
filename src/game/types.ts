export const DIRECTIONS = ["up", "down", "left", "right"] as const;

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

export type TerrainKind = "wall" | "floor" | "water" | "lava" | "hole";
export type KeyColor = "red" | "blue" | "yellow";
export const ANIMAL_SPECIES = [
  "bunny",
  "fox",
  "kitten",
  "puppy",
  "duckling",
  "hedgehog",
  "fawn",
  "red-panda",
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
] as const;
export type TerrainThemeId = (typeof TERRAIN_THEME_IDS)[number];

export const WEAPON_STYLE_IDS = [
  "star-sword",
  "flower-sabre",
  "moon-wand",
  "leaf-blade",
  "sun-mallet",
] as const;
export type WeaponStyle = (typeof WEAPON_STYLE_IDS)[number];

export const ENEMY_STYLE_IDS = [
  "goblin",
  "blueberry-slime",
  "mushroom-imp",
  "moon-bat",
  "pebble-golem",
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

export type LevelObject =
  | EnemyObject
  | SwordObject
  | BootsObject
  | SpringBootsObject
  | PotionObject
  | KeyObject
  | DoorObject
  | AnimalObject;

export type LevelSource = "curated" | "generated";

export interface LevelDefinition {
  readonly schemaVersion: 1;
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
  readonly keys: readonly KeyColor[];
  readonly collectedObjectIds: readonly string[];
  readonly rescuedAnimalIds: readonly string[];
  readonly defeatedEnemyIds: readonly string[];
  readonly openedDoorIds: readonly string[];
  readonly status: GameStatus;
  readonly steps: number;
}

export type BlockedReason =
  | "out-of-bounds"
  | "wall"
  | "needs-sword"
  | "needs-boots"
  | "needs-spring-boots"
  | "needs-key"
  | "game-over";

export type GameEvent =
  | {
      readonly type: "blocked";
      readonly reason: BlockedReason;
      readonly target: Point;
      readonly terrain?: "water" | "lava" | "hole";
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
      readonly type: "combat-lost";
      readonly objectId: string;
      readonly playerPower: number;
      readonly enemyPower: number;
      readonly enemyPowerAfter: number;
    }
  | {
      readonly type: "level-won";
      readonly steps: number;
      readonly power: number;
    };

export interface MoveResult {
  readonly state: GameState;
  readonly moved: boolean;
  readonly events: readonly GameEvent[];
}
