import type {
  AnimalSpecies,
  CageStyle,
  EnemyStyle,
  TerrainThemeId,
  WeaponStyle,
} from "./game/types";

export interface SpriteArt {
  readonly src: string;
  readonly label: string;
}

export const TERRAIN_COLOR_FAMILIES = [
  "gold",
  "rose",
  "blue",
  "green",
  "earth",
  "violet",
  "sage",
  "indigo",
] as const;

export type TerrainColorFamily = (typeof TERRAIN_COLOR_FAMILIES)[number];

export interface TerrainTextureArt extends SpriteArt {
  /** Width and height of one seamless image repeat, measured in maze tiles. */
  readonly periodTiles: number;
  readonly fallbackColor: string;
  /** Dominant hue used to prevent clashing floor/wall combinations. */
  readonly dominantColor: TerrainColorFamily;
  /**
   * Perceived lightness of the production texture on a 0–100 scale. This is
   * calibrated from the texture itself rather than inferred from its hue.
   */
  readonly visualLightness: number;
}

export interface TerrainDressingArt extends SpriteArt {
  /** Width and height of the sparse transparent repeat, in maze tiles. */
  readonly periodTiles: number;
  /** Decorations should enrich the material without competing with gameplay. */
  readonly opacity: number;
}

export interface TerrainThemeArt {
  readonly id: TerrainThemeId;
  readonly label: string;
  readonly floor: TerrainTextureArt;
  readonly wall: TerrainTextureArt;
  readonly floorDressing?: TerrainDressingArt;
  readonly wallDressing?: TerrainDressingArt;
}

export const DEFAULT_TERRAIN_THEME_ID: TerrainThemeId = "sunny-stone";
export const DEFAULT_WEAPON_STYLE: WeaponStyle = "star-sword";
export const DEFAULT_ENEMY_STYLE: EnemyStyle = "goblin";
export const DEFAULT_ANIMAL_SPECIES: AnimalSpecies = "bunny";
export const DEFAULT_CAGE_STYLE: CageStyle = "golden-heart";

/**
 * A deliberately small art-directed palette matrix. Generated mazes select a
 * complete theme, so keeping every authored theme inside this matrix prevents
 * accidental combinations such as a yellow floor beside a green wall.
 */
export const COMPATIBLE_WALL_COLORS = {
  gold: ["violet", "indigo"],
  rose: ["violet", "sage", "indigo"],
  blue: ["violet", "green", "indigo"],
  green: ["green", "violet", "indigo"],
  earth: ["green", "sage", "violet", "indigo"],
  violet: ["gold", "rose", "blue", "earth"],
  sage: ["rose", "blue", "earth"],
  indigo: ["gold", "rose", "blue", "green", "earth"],
} as const satisfies Readonly<Record<TerrainColorFamily, readonly TerrainColorFamily[]>>;

export function areTerrainColorsCompatible(
  floorColor: TerrainColorFamily,
  wallColor: TerrainColorFamily,
): boolean {
  return (COMPATIBLE_WALL_COLORS[floorColor] as readonly TerrainColorFamily[]).includes(wallColor);
}

/** Minimum visual separation needed to read maze paths at phone and tablet scale. */
export const MIN_TERRAIN_LIGHTNESS_DELTA = 8;

export function areTerrainTexturesCompatible(
  floor: TerrainTextureArt,
  wall: TerrainTextureArt,
): boolean {
  return areTerrainColorsCompatible(floor.dominantColor, wall.dominantColor) &&
    floor.visualLightness - wall.visualLightness >= MIN_TERRAIN_LIGHTNESS_DELTA;
}

const FLOORS = {
  sunnyStone: {
    src: "/assets/floor-v3.png",
    label: "Sunny stone path",
    periodTiles: 3.4,
    fallbackColor: "#f8d991",
    dominantColor: "gold",
    visualLightness: 81,
  },
  roseBrick: {
    src: "/assets/floor-rose-brick-v1.png",
    label: "Rose courtyard bricks",
    periodTiles: 4.2,
    fallbackColor: "#efb8ad",
    dominantColor: "rose",
    visualLightness: 82,
  },
  moonSlate: {
    src: "/assets/floor-moon-slate-v1.png",
    label: "Moonlit slate",
    periodTiles: 3.8,
    fallbackColor: "#aeb9d8",
    dominantColor: "blue",
    visualLightness: 69,
  },
  meadowGrass: {
    src: "/assets/floor-meadow-grass-v1.png",
    label: "Flower meadow grass",
    periodTiles: 3.6,
    fallbackColor: "#81c95d",
    dominantColor: "green",
    visualLightness: 73,
  },
  woodlandDirt: {
    src: "/assets/floor-woodland-dirt-v1.png",
    label: "Woodland pebble trail",
    periodTiles: 3.8,
    fallbackColor: "#d9a36f",
    dominantColor: "earth",
    visualLightness: 68,
  },
} as const satisfies Readonly<Record<string, TerrainTextureArt>>;

const WALLS = {
  lavenderStone: {
    src: "/assets/wall-v3.png",
    label: "Lavender stone wall",
    periodTiles: 3.4,
    fallbackColor: "#7775b6",
    dominantColor: "violet",
    visualLightness: 56,
  },
  sandstone: {
    src: "/assets/wall-sandstone-v1.png",
    label: "Golden sandstone wall",
    periodTiles: 4.2,
    fallbackColor: "#e5af58",
    dominantColor: "gold",
    visualLightness: 83,
  },
  mossyRuin: {
    src: "/assets/wall-mossy-ruin-v1.png",
    label: "Mossy storybook ruins",
    periodTiles: 4,
    fallbackColor: "#91a96e",
    dominantColor: "sage",
    visualLightness: 71,
  },
  darkDungeon: {
    src: "/assets/wall-dark-dungeon-v1.png",
    label: "Moon-dark dungeon wall",
    periodTiles: 4,
    fallbackColor: "#3d3a63",
    dominantColor: "indigo",
    visualLightness: 19,
  },
  hedge: {
    src: "/assets/wall-hedge-v1.png",
    label: "Flowering garden hedge",
    periodTiles: 3.6,
    fallbackColor: "#3f9c55",
    dominantColor: "green",
    visualLightness: 60,
  },
} as const satisfies Readonly<Record<string, TerrainTextureArt>>;

export const TERRAIN_DRESSING_ART = {
  garden: {
    src: "/assets/terrain-dressing-garden-v1.png",
    label: "Tiny garden flowers and moss",
    periodTiles: 13,
    opacity: 0.16,
  },
  vines: {
    src: "/assets/terrain-dressing-vines-v1.png",
    label: "Soft ivy and moss",
    periodTiles: 13,
    opacity: 0.17,
  },
} as const satisfies Readonly<Record<string, TerrainDressingArt>>;

export const TERRAIN_THEMES = {
  "sunny-stone": {
    id: "sunny-stone",
    label: "Sunny Stone Trail",
    floor: FLOORS.sunnyStone,
    wall: WALLS.lavenderStone,
  },
  "rose-courtyard": {
    id: "rose-courtyard",
    label: "Rose Courtyard",
    floor: FLOORS.roseBrick,
    wall: WALLS.mossyRuin,
  },
  "moonlit-moat": {
    id: "moonlit-moat",
    label: "Moonlit Moat",
    floor: FLOORS.moonSlate,
    wall: WALLS.hedge,
  },
  "ember-keep": {
    id: "ember-keep",
    label: "Ember Keep",
    floor: FLOORS.roseBrick,
    wall: WALLS.darkDungeon,
  },
  "star-garden": {
    id: "star-garden",
    label: "Star Garden",
    floor: FLOORS.meadowGrass,
    wall: WALLS.hedge,
    floorDressing: TERRAIN_DRESSING_ART.garden,
  },
  "moonbeam-castle": {
    id: "moonbeam-castle",
    label: "Moonbeam Castle",
    floor: FLOORS.moonSlate,
    wall: WALLS.darkDungeon,
  },
  "wishing-woods": {
    id: "wishing-woods",
    label: "Wishing Woods",
    floor: FLOORS.woodlandDirt,
    wall: WALLS.hedge,
    floorDressing: TERRAIN_DRESSING_ART.garden,
  },
  "parade-courtyard": {
    id: "parade-courtyard",
    label: "Parade Courtyard",
    floor: FLOORS.roseBrick,
    wall: WALLS.lavenderStone,
  },
  "springstep-hollow": {
    id: "springstep-hollow",
    label: "Springstep Hollow",
    floor: FLOORS.moonSlate,
    wall: WALLS.lavenderStone,
  },
  "lantern-ruins": {
    id: "lantern-ruins",
    label: "Lantern Ruins",
    floor: FLOORS.sunnyStone,
    wall: WALLS.darkDungeon,
    wallDressing: TERRAIN_DRESSING_ART.vines,
  },
} as const satisfies Readonly<Record<TerrainThemeId, TerrainThemeArt>>;

export const WEAPON_ART = {
  "star-sword": { src: "/assets/sword.png", label: "Star Sword" },
  "flower-sabre": { src: "/assets/weapon-flower-sabre-v1.png", label: "Flower Sabre" },
  "moon-wand": { src: "/assets/weapon-moon-wand-v1.png", label: "Moon Wand" },
  "leaf-blade": { src: "/assets/weapon-leaf-blade-v1.png", label: "Leaf Blade" },
  "sun-mallet": { src: "/assets/weapon-sun-mallet-v1.png", label: "Sun Mallet" },
} as const satisfies Readonly<Record<WeaponStyle, SpriteArt>>;

export const ENEMY_ART = {
  goblin: { src: "/assets/goblin.png", label: "Garden Goblin" },
  "blueberry-slime": { src: "/assets/enemy-blueberry-slime-v1.png", label: "Blueberry Slime" },
  "mushroom-imp": { src: "/assets/enemy-mushroom-imp-v1.png", label: "Mushroom Imp" },
  "moon-bat": { src: "/assets/enemy-moon-bat-v1.png", label: "Moon Bat" },
  "pebble-golem": { src: "/assets/enemy-pebble-golem-v1.png", label: "Pebble Golem" },
} as const satisfies Readonly<Record<EnemyStyle, SpriteArt>>;

export const ANIMAL_ART = {
  bunny: { src: "/assets/animal-bunny.png", label: "Bunny" },
  fox: { src: "/assets/animal-fox.png", label: "Fox" },
  kitten: { src: "/assets/animal-kitten.png", label: "Kitten" },
  puppy: { src: "/assets/animal-puppy-v1.png", label: "Puppy" },
  duckling: { src: "/assets/animal-duckling-v1.png", label: "Duckling" },
  hedgehog: { src: "/assets/animal-hedgehog-v1.png", label: "Hedgehog" },
  fawn: { src: "/assets/animal-fawn-v1.png", label: "Fawn" },
  "red-panda": { src: "/assets/animal-red-panda-v1.png", label: "Red Panda" },
} as const satisfies Readonly<Record<AnimalSpecies, SpriteArt>>;

export const CAGE_ART = {
  "golden-heart": { src: "/assets/cage-golden-heart-front-v2.png", label: "Golden Heart Cage" },
  "storybook-wood": { src: "/assets/cage-storybook-wood-front-v2.png", label: "Storybook Wooden Cage" },
  "moon-silver": { src: "/assets/cage-moon-silver-front-v2.png", label: "Moon Silver Cage" },
  "garden-vine": { src: "/assets/cage-garden-vine-front-v2.png", label: "Garden Vine Cage" },
} as const satisfies Readonly<Record<CageStyle, SpriteArt>>;

function hasOwn<T extends object>(catalog: T, key: PropertyKey): key is keyof T {
  return Object.hasOwn(catalog, key);
}

export function resolveTerrainTheme(
  id: unknown,
): TerrainThemeArt {
  return typeof id === "string" && hasOwn(TERRAIN_THEMES, id)
    ? TERRAIN_THEMES[id]
    : TERRAIN_THEMES[DEFAULT_TERRAIN_THEME_ID];
}

export function resolveWeaponArt(
  style: unknown,
): SpriteArt {
  return typeof style === "string" && hasOwn(WEAPON_ART, style)
    ? WEAPON_ART[style]
    : WEAPON_ART[DEFAULT_WEAPON_STYLE];
}

export function resolveEnemyArt(
  style: unknown,
): SpriteArt {
  return typeof style === "string" && hasOwn(ENEMY_ART, style)
    ? ENEMY_ART[style]
    : ENEMY_ART[DEFAULT_ENEMY_STYLE];
}

export function resolveAnimalArt(
  species: unknown,
): SpriteArt {
  return typeof species === "string" && hasOwn(ANIMAL_ART, species)
    ? ANIMAL_ART[species]
    : ANIMAL_ART[DEFAULT_ANIMAL_SPECIES];
}

export function resolveCageArt(
  style: unknown,
): SpriteArt {
  return typeof style === "string" && hasOwn(CAGE_ART, style)
    ? CAGE_ART[style]
    : CAGE_ART[DEFAULT_CAGE_STYLE];
}
