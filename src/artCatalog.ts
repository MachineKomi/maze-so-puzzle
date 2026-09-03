import type {
  AnimalSpecies,
  CageStyle,
  EnemyStyle,
  KeyColor,
  PortalPairId,
  TerrainKind,
  TerrainThemeId,
  WeaponStyle,
} from "./game/types";

/** Small compatibility surface used by legacy catalogue families and consumers. */
export interface ArtReference {
  readonly src: string;
  readonly label: string;
}

export type ArtFamily =
  | "character"
  | "friend"
  | "enemy"
  | "weapon"
  | "item"
  | "cage"
  | "lock"
  | "portal"
  | "reward"
  | "terrain"
  | "dressing"
  | "hazard"
  | "story"
  | "navigation"
  | "brand";

export type RuntimeArtStatus = "active" | "dormant" | "deprecated" | "superseded";
export type RuntimeArtUsage = "optical" | "field" | "presentation";
export type NormalizedPoint = readonly [x: number, y: number];
export type NormalizedRect = readonly [x: number, y: number, width: number, height: number];
export type NormalizedInsets = readonly [top: number, right: number, bottom: number, left: number];

export interface RuntimeArtVariant {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly format: "png" | "webp" | "jpg";
  readonly usage: RuntimeArtUsage;
  readonly minDisplayPx: number;
  readonly maxDisplayPx: number;
}

export type ArtGeometryClass =
  | "grounded-actor"
  | "floating-actor"
  | "caged-friend"
  | "weapon"
  | "item"
  | "door-cage"
  | "standing-portal-goal"
  | "floor-portal"
  | "ground-overlay"
  | "icon";

export interface ArtGeometry {
  readonly class: ArtGeometryClass;
  readonly pivot: NormalizedPoint;
  /** Alpha-visible bounds, normalized as x, y, width, height. */
  readonly visibleBounds: NormalizedRect;
  /** Canonical reserved inset, ordered top, right, bottom, left. */
  readonly safeInset: NormalizedInsets;
  readonly faceBox?: NormalizedRect;
  readonly gripPoint?: NormalizedPoint;
  readonly forwardAxisDegrees?: number;
}

/**
 * Rich runtime contract adopted by source-backed canaries. Legacy families
 * remain ArtReference records until their geometry can be measured rather
 * than guessed. `src` is the compatibility rendition used by current callers.
 */
export interface SpriteArt extends ArtReference {
  readonly id: string;
  readonly family: ArtFamily;
  readonly artVersion: number;
  readonly recipeVersion: string;
  readonly variants: readonly RuntimeArtVariant[];
  readonly geometry: ArtGeometry;
  readonly alphaMode: "opaque" | "straight";
  readonly view: "top-down" | "front" | "front-three-quarter";
  readonly lightProfile: "neutral-albedo" | "upper-left-soft" | "emissive";
  readonly castsRuntimeShadow: boolean;
  readonly motifToken?: string;
  readonly paletteToken?: string;
  readonly sourceRecordId: string;
  readonly runtimeStatus: RuntimeArtStatus;
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

export interface TerrainTextureArt extends ArtReference {
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

export interface TerrainDressingArt extends ArtReference {
  /** Width and height of the sparse transparent repeat, in maze tiles. */
  readonly periodTiles: number;
  /** Decorations should enrich the material without competing with gameplay. */
  readonly opacity: number;
}

export interface TerrainRenderTreatment {
  /** Small, material-specific correction applied after the source texture. */
  readonly brightness: number;
  readonly saturation: number;
  readonly contrast: number;
}

export interface TerrainThemeArt {
  readonly id: TerrainThemeId;
  readonly label: string;
  readonly floor: TerrainTextureArt;
  readonly wall: TerrainTextureArt;
  readonly floorTreatment: TerrainRenderTreatment;
  readonly wallTreatment: TerrainRenderTreatment;
  readonly floorDressing?: TerrainDressingArt;
  readonly wallDressing?: TerrainDressingArt;
}

export const DEFAULT_TERRAIN_THEME_ID: TerrainThemeId = "sunny-stone";
export const DEFAULT_WEAPON_STYLE: WeaponStyle = "star-sword";
export const DEFAULT_ENEMY_STYLE: EnemyStyle = "goblin";
export const DEFAULT_ANIMAL_SPECIES: AnimalSpecies = "bunny";
export const DEFAULT_CAGE_STYLE: CageStyle = "golden-heart";
export const DEFAULT_KEY_COLOR: KeyColor = "blue";

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
  pearlShell: {
    src: "/assets/floor-pearl-shell-v1.png",
    label: "Pearl shell mosaic",
    periodTiles: 4.1,
    fallbackColor: "#cfe6eb",
    dominantColor: "blue",
    visualLightness: 83,
  },
  peachLeafstone: {
    src: "/assets/floor-peach-leafstone-v1.png",
    label: "Peach leaf-stone path",
    periodTiles: 4.1,
    fallbackColor: "#f5c6af",
    dominantColor: "rose",
    visualLightness: 81,
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
  amethystCrystal: {
    src: "/assets/wall-amethyst-crystal-v1.png",
    label: "Amethyst crystal wall",
    periodTiles: 4.1,
    fallbackColor: "#6d4a9b",
    dominantColor: "violet",
    visualLightness: 33,
  },
  berryBramble: {
    src: "/assets/wall-berry-bramble-v1.png",
    label: "Enchanted berry bramble",
    periodTiles: 4.1,
    fallbackColor: "#4c284d",
    dominantColor: "indigo",
    visualLightness: 21,
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
  crystal: {
    src: "/assets/terrain-dressing-crystal-v1.png",
    label: "Pearls and crystal glints",
    periodTiles: 14,
    opacity: 0.08,
  },
  autumn: {
    src: "/assets/terrain-dressing-autumn-v1.png",
    label: "Tiny leaves and acorn confetti",
    periodTiles: 14,
    opacity: 0.09,
  },
} as const satisfies Readonly<Record<string, TerrainDressingArt>>;

export type HazardKind = Extract<TerrainKind, "water" | "lava" | "poison" | "hole">;

export interface HazardArt extends ArtReference {
  readonly id: string;
  /** Null for a single-tile overlay rather than a periodic fill. */
  readonly periodTiles: number | null;
  /** Alpha-weighted mean sRGB colour of the inspected runtime asset. */
  readonly fallbackColor: string;
  /** Alpha-weighted mean CIE L* rounded to the nearest whole number. */
  readonly visualLightness: number;
  /** Static, non-colour feature that remains readable without animation. */
  readonly patternCue: "ripple-cells" | "molten-swirls" | "bubble-clusters" | "dark-void-rim";
  readonly reducedMotionCue: string;
  readonly alphaMode: "opaque" | "straight";
  readonly runtimeStatus: RuntimeArtStatus;
}

/**
 * Accessibility metadata for the four current traversal hazards. Pattern
 * periods match the live SVG treatment; colour and lightness were measured
 * from the checked-in runtime pixels rather than inferred from their names.
 */
export const HAZARD_ART = {
  water: {
    id: "terrain-water",
    src: "/assets/water-v2.png",
    label: "Sparkling water",
    periodTiles: 4.6,
    fallbackColor: "#4eddbf",
    visualLightness: 81,
    patternCue: "ripple-cells",
    reducedMotionCue: "Large linked ripple cells with pale crossing highlights",
    alphaMode: "opaque",
    runtimeStatus: "active",
  },
  lava: {
    id: "terrain-lava",
    src: "/assets/lava-v2.png",
    label: "Warm lava",
    periodTiles: 4.6,
    fallbackColor: "#fc834f",
    visualLightness: 68,
    patternCue: "molten-swirls",
    reducedMotionCue: "Thick looping molten bands with bright ember dots",
    alphaMode: "opaque",
    runtimeStatus: "active",
  },
  poison: {
    id: "terrain-poison",
    src: "/assets/terrain-poison-v1.png",
    label: "Purple poison",
    periodTiles: 4.2,
    fallbackColor: "#bb85e5",
    visualLightness: 64,
    patternCue: "bubble-clusters",
    reducedMotionCue: "Scattered round bubbles over irregular violet eddies",
    alphaMode: "opaque",
    runtimeStatus: "active",
  },
  hole: {
    id: "ground-hole",
    src: "/assets/ground-hole-v1.png",
    label: "Ground hole",
    periodTiles: null,
    fallbackColor: "#5f3f43",
    visualLightness: 30,
    patternCue: "dark-void-rim",
    reducedMotionCue: "Solid dark centre enclosed by a chunky earthen stone rim",
    alphaMode: "straight",
    runtimeStatus: "active",
  },
} as const satisfies Readonly<Record<HazardKind, HazardArt>>;

export const TERRAIN_THEMES = {
  "sunny-stone": {
    id: "sunny-stone",
    label: "Sunny Stone Trail",
    floor: FLOORS.sunnyStone,
    wall: WALLS.lavenderStone,
    floorTreatment: { brightness: 1.02, saturation: 0.96, contrast: 1 },
    wallTreatment: { brightness: 1.02, saturation: 1, contrast: 1 },
  },
  "rose-courtyard": {
    id: "rose-courtyard",
    label: "Rose Courtyard",
    floor: FLOORS.roseBrick,
    wall: WALLS.mossyRuin,
    floorTreatment: { brightness: 1.02, saturation: 0.96, contrast: 1 },
    wallTreatment: { brightness: 1.02, saturation: 0.98, contrast: 1 },
  },
  "moonlit-moat": {
    id: "moonlit-moat",
    label: "Moonlit Moat",
    floor: FLOORS.moonSlate,
    wall: WALLS.hedge,
    floorTreatment: { brightness: 1.04, saturation: 0.94, contrast: 1 },
    wallTreatment: { brightness: 0.99, saturation: 1.06, contrast: 1.02 },
  },
  "ember-keep": {
    id: "ember-keep",
    label: "Ember Keep",
    floor: FLOORS.roseBrick,
    wall: WALLS.darkDungeon,
    floorTreatment: { brightness: 1.02, saturation: 0.96, contrast: 1 },
    wallTreatment: { brightness: 1.12, saturation: 0.94, contrast: 0.96 },
  },
  "star-garden": {
    id: "star-garden",
    label: "Star Garden",
    floor: FLOORS.meadowGrass,
    wall: WALLS.hedge,
    floorTreatment: { brightness: 1.06, saturation: 1.08, contrast: 1.02 },
    wallTreatment: { brightness: 0.98, saturation: 1.08, contrast: 1.02 },
    floorDressing: TERRAIN_DRESSING_ART.garden,
  },
  "moonbeam-castle": {
    id: "moonbeam-castle",
    label: "Moonbeam Castle",
    floor: FLOORS.moonSlate,
    wall: WALLS.darkDungeon,
    floorTreatment: { brightness: 1.04, saturation: 0.94, contrast: 1 },
    wallTreatment: { brightness: 1.13, saturation: 0.92, contrast: 0.95 },
  },
  "wishing-woods": {
    id: "wishing-woods",
    label: "Wishing Woods",
    floor: FLOORS.woodlandDirt,
    wall: WALLS.hedge,
    floorTreatment: { brightness: 1.04, saturation: 0.98, contrast: 1 },
    wallTreatment: { brightness: 0.99, saturation: 1.07, contrast: 1.02 },
    floorDressing: TERRAIN_DRESSING_ART.garden,
  },
  "parade-courtyard": {
    id: "parade-courtyard",
    label: "Parade Courtyard",
    floor: FLOORS.roseBrick,
    wall: WALLS.lavenderStone,
    floorTreatment: { brightness: 1.02, saturation: 0.96, contrast: 1 },
    wallTreatment: { brightness: 1.01, saturation: 1, contrast: 1 },
  },
  "springstep-hollow": {
    id: "springstep-hollow",
    label: "Springstep Hollow",
    floor: FLOORS.moonSlate,
    wall: WALLS.lavenderStone,
    floorTreatment: { brightness: 1.04, saturation: 0.94, contrast: 1 },
    wallTreatment: { brightness: 1.01, saturation: 1, contrast: 1 },
  },
  "lantern-ruins": {
    id: "lantern-ruins",
    label: "Lantern Ruins",
    floor: FLOORS.sunnyStone,
    wall: WALLS.darkDungeon,
    floorTreatment: { brightness: 1.02, saturation: 0.96, contrast: 1 },
    wallTreatment: { brightness: 1.13, saturation: 0.92, contrast: 0.95 },
    wallDressing: TERRAIN_DRESSING_ART.vines,
  },
  "pearl-grotto": {
    id: "pearl-grotto",
    label: "Pearl Grotto",
    floor: FLOORS.pearlShell,
    wall: WALLS.amethystCrystal,
    floorTreatment: { brightness: 1.02, saturation: 0.94, contrast: 0.98 },
    wallTreatment: { brightness: 1.08, saturation: 0.96, contrast: 0.96 },
    floorDressing: TERRAIN_DRESSING_ART.crystal,
  },
  "harvest-bramble": {
    id: "harvest-bramble",
    label: "Harvest Bramble",
    floor: FLOORS.peachLeafstone,
    wall: WALLS.berryBramble,
    floorTreatment: { brightness: 1.01, saturation: 0.94, contrast: 0.98 },
    wallTreatment: { brightness: 1.15, saturation: 0.92, contrast: 0.92 },
    floorDressing: TERRAIN_DRESSING_ART.autumn,
  },
} as const satisfies Readonly<Record<TerrainThemeId, TerrainThemeArt>>;

/**
 * Current shipped Ame, retained as historical runtime art after Candidate C's
 * v2 identity/model-sheet design approval. The versioned v2 derivative,
 * live-context review, rights review, and catalogue switch remain pending.
 * Visible bounds were measured at alpha >= 8 on the 512 x 512 PNG.
 */
export const AME_ART = {
  id: "ame",
  family: "character",
  label: "Ame",
  artVersion: 1,
  recipeVersion: "pre-mgjrpg-unversioned",
  src: "/assets/ame.png",
  variants: [{
    src: "/assets/ame.png",
    width: 512,
    height: 512,
    format: "png",
    usage: "field",
    minDisplayPx: 1,
    maxDisplayPx: 512,
  }],
  geometry: {
    class: "grounded-actor",
    pivot: [0.5, 0.9],
    visibleBounds: [0.23828125, 0.013671875, 0.51953125, 0.951171875],
    safeInset: [0.08, 0.08, 0.06, 0.08],
    gripPoint: [0.69, 0.607],
    forwardAxisDegrees: 0,
  },
  alphaMode: "straight",
  view: "front-three-quarter",
  lightProfile: "upper-left-soft",
  castsRuntimeShadow: true,
  sourceRecordId: "ame-v01-source",
  runtimeStatus: "active",
} as const satisfies SpriteArt;

export const WEAPON_ART = {
  "star-sword": { src: "/assets/sword.png", label: "Star Sword" },
  "flower-sabre": { src: "/assets/weapon-flower-sabre-v1.png", label: "Flower Sabre" },
  "moon-wand": { src: "/assets/weapon-moon-wand-v1.png", label: "Moon Wand" },
  "leaf-blade": { src: "/assets/weapon-leaf-blade-v1.png", label: "Leaf Blade" },
  "sun-mallet": { src: "/assets/weapon-sun-mallet-v1.png", label: "Sun Mallet" },
  "comet-spear": { src: "/assets/weapon-comet-spear-v1.png", label: "Comet Spear" },
  "bubble-bow": { src: "/assets/weapon-bubble-bow-v1.png", label: "Bubble Bow" },
  "cupcake-mace": { src: "/assets/weapon-cupcake-mace-v1.png", label: "Cupcake Mace" },
} as const satisfies Readonly<Record<WeaponStyle, ArtReference>>;

export const ENEMY_ART = {
  goblin: { src: "/assets/goblin.png", label: "Garden Goblin" },
  "blueberry-slime": { src: "/assets/enemy-blueberry-slime-v1.png", label: "Blueberry Slime" },
  "mushroom-imp": { src: "/assets/enemy-mushroom-imp-v1.png", label: "Mushroom Imp" },
  "moon-bat": { src: "/assets/enemy-moon-bat-v1.png", label: "Moon Bat" },
  "pebble-golem": { src: "/assets/enemy-pebble-golem-v1.png", label: "Pebble Golem" },
  "acorn-knight": { src: "/assets/enemy-acorn-knight-v1.png", label: "Acorn Knight" },
  "bubble-dragon": { src: "/assets/enemy-bubble-dragon-v1.png", label: "Bubble Dragon" },
  "candy-mimic": { src: "/assets/enemy-candy-mimic-v1.png", label: "Candy Mimic" },
  "cloud-gremlin": { src: "/assets/enemy-cloud-gremlin-v1.webp", label: "Cloud Gremlin" },
  "pumpkin-sprite": { src: "/assets/enemy-pumpkin-sprite-v1.webp", label: "Pumpkin Sprite" },
  "clockwork-crab": { src: "/assets/enemy-clockwork-crab-v1.webp", label: "Clockwork Crab" },
  "jelly-sorcerer": { src: "/assets/enemy-jelly-sorcerer-v1.webp", label: "Jelly Sorcerer" },
} as const satisfies Readonly<Record<EnemyStyle, ArtReference>>;

export const ANIMAL_ART = {
  bunny: { src: "/assets/animal-bunny.png", label: "Bunny" },
  fox: { src: "/assets/animal-fox.png", label: "Fox" },
  kitten: { src: "/assets/animal-kitten.png", label: "Kitten" },
  puppy: { src: "/assets/animal-puppy-v1.png", label: "Puppy" },
  duckling: { src: "/assets/animal-duckling-v1.png", label: "Duckling" },
  hedgehog: { src: "/assets/animal-hedgehog-v1.png", label: "Hedgehog" },
  fawn: { src: "/assets/animal-fawn-v1.png", label: "Fawn" },
  "red-panda": { src: "/assets/animal-red-panda-v1.png", label: "Red Panda" },
  otter: { src: "/assets/animal-otter-v1.png", label: "Otter" },
  lamb: { src: "/assets/animal-lamb-v1.png", label: "Lamb" },
  capybara: { src: "/assets/animal-capybara-v1.png", label: "Capybara" },
  chinchilla: { src: "/assets/animal-chinchilla-v1.webp", label: "Chinchilla" },
  alpaca: { src: "/assets/animal-alpaca-v1.webp", label: "Alpaca" },
  penguin: { src: "/assets/animal-penguin-v1.webp", label: "Penguin" },
  koala: { src: "/assets/animal-koala-v1.webp", label: "Koala" },
} as const satisfies Readonly<Record<AnimalSpecies, ArtReference>>;

export const CAGE_ART = {
  "golden-heart": { src: "/assets/cage-golden-heart-front-v5.webp", label: "Golden Heart Cage" },
  "storybook-wood": { src: "/assets/cage-storybook-wood-front-v5.webp", label: "Storybook Wooden Cage" },
  "moon-silver": { src: "/assets/cage-moon-silver-front-v5.webp", label: "Moon Silver Cage" },
  "garden-vine": { src: "/assets/cage-garden-vine-front-v5.webp", label: "Garden Vine Cage" },
} as const satisfies Readonly<Record<CageStyle, ArtReference>>;

export interface LockPairArt {
  readonly id: KeyColor;
  readonly label: string;
  readonly colorLabel: string;
  readonly paletteToken: "lock-rose" | "lock-blue" | "lock-sunny";
  readonly motifLabel: "Heart" | "Star" | "Sun";
  readonly motifToken: "heart" | "star" | "sun";
  readonly glyph: "♥" | "★" | "☀";
  readonly key: SpriteArt;
  readonly door: SpriteArt;
}

function legacyLockSprite(
  id: string,
  label: string,
  src: string,
  kind: "key" | "door",
  visibleBounds: NormalizedRect,
  sourceRecordId = `${id}-v01-source`,
): SpriteArt {
  const isDoor = kind === "door";
  return {
    id,
    family: "lock",
    label,
    artVersion: 1,
    recipeVersion: "pre-mgjrpg-unversioned",
    src,
    variants: [{
      src,
      width: 512,
      height: 512,
      format: "png",
      usage: "field",
      minDisplayPx: 1,
      maxDisplayPx: 512,
    }],
    geometry: {
      class: isDoor ? "door-cage" : "item",
      pivot: isDoor ? [0.5, 0.94] : [0.5, 0.55],
      visibleBounds,
      safeInset: isDoor ? [0.06, 0.06, 0.06, 0.06] : [0.1, 0.1, 0.1, 0.1],
    },
    alphaMode: "straight",
    view: isDoor ? "front" : "front-three-quarter",
    lightProfile: "upper-left-soft",
    castsRuntimeShadow: true,
    sourceRecordId,
    runtimeStatus: "active",
  };
}

/**
 * Single source of runtime truth for key/door pairs. Visible bounds were
 * measured at alpha >= 8 on each current 512 x 512 PNG.
 */
export const LOCK_PAIR_ART = {
  red: {
    id: "red",
    label: "Rose Heart",
    colorLabel: "Rose",
    paletteToken: "lock-rose",
    motifLabel: "Heart",
    motifToken: "heart",
    glyph: "♥",
    key: legacyLockSprite(
      "key-rose-heart",
      "Rose Heart Key",
      "/assets/key-rose-heart-v1.png",
      "key",
      [0.142578125, 0.021484375, 0.71484375, 0.94140625],
    ),
    door: legacyLockSprite(
      "door-rose-heart",
      "Rose Heart Door",
      "/assets/door-rose-heart-v1.png",
      "door",
      [0.052734375, 0.00390625, 0.892578125, 0.96484375],
    ),
  },
  blue: {
    id: "blue",
    label: "Blue Star",
    colorLabel: "Blue",
    paletteToken: "lock-blue",
    motifLabel: "Star",
    motifToken: "star",
    glyph: "★",
    key: legacyLockSprite(
      "key-blue-star",
      "Blue Star Key",
      "/assets/star-key.png",
      "key",
      [0.115234375, 0.025390625, 0.732421875, 0.935546875],
      "key-blue-star-v01-source",
    ),
    door: legacyLockSprite(
      "door-blue-star",
      "Blue Star Door",
      "/assets/star-door.png",
      "door",
      [0.076171875, 0.03125, 0.84765625, 0.935546875],
      "door-blue-star-v01-source",
    ),
  },
  yellow: {
    id: "yellow",
    label: "Sunny Sun",
    colorLabel: "Sunny",
    paletteToken: "lock-sunny",
    motifLabel: "Sun",
    motifToken: "sun",
    glyph: "☀",
    key: legacyLockSprite(
      "key-sunny-sun",
      "Sunny Sun Key",
      "/assets/key-sunny-sun-v1.png",
      "key",
      [0.115234375, 0.0078125, 0.771484375, 0.951171875],
    ),
    door: legacyLockSprite(
      "door-sunny-sun",
      "Sunny Sun Door",
      "/assets/door-sunny-sun-v1.png",
      "door",
      [0.076171875, 0.00390625, 0.84765625, 0.96484375],
    ),
  },
} as const satisfies Readonly<Record<KeyColor, LockPairArt>>;

/** Child-readable compatibility projections shared by hints and accessible text. */
export const KEY_COLOR_LABELS = {
  red: LOCK_PAIR_ART.red.colorLabel,
  blue: LOCK_PAIR_ART.blue.colorLabel,
  yellow: LOCK_PAIR_ART.yellow.colorLabel,
} as const satisfies Readonly<Record<KeyColor, string>>;

/** Shape labels remain a non-colour cue and project from the same pair authority. */
export const KEY_MOTIF_LABELS = {
  red: LOCK_PAIR_ART.red.motifLabel,
  blue: LOCK_PAIR_ART.blue.motifLabel,
  yellow: LOCK_PAIR_ART.yellow.motifLabel,
} as const satisfies Readonly<Record<KeyColor, string>>;

export const KEY_ART = {
  red: LOCK_PAIR_ART.red.key,
  blue: LOCK_PAIR_ART.blue.key,
  yellow: LOCK_PAIR_ART.yellow.key,
} as const satisfies Readonly<Record<KeyColor, SpriteArt>>;

export const DOOR_ART = {
  red: LOCK_PAIR_ART.red.door,
  blue: LOCK_PAIR_ART.blue.door,
  yellow: LOCK_PAIR_ART.yellow.door,
} as const satisfies Readonly<Record<KeyColor, SpriteArt>>;

export const PORTAL_ART = {
  "rose-heart": { src: "/assets/portal-rose-heart-v1.png", label: "Rose Heart Portal", motif: "♥" },
  "mint-clover": { src: "/assets/portal-mint-clover-v1.png", label: "Mint Clover Portal", motif: "♣" },
  "violet-moon": { src: "/assets/portal-violet-moon-v1.png", label: "Violet Moon Portal", motif: "☾" },
} as const satisfies Readonly<Record<PortalPairId, ArtReference & { readonly motif: string }>>;

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
): ArtReference {
  return typeof style === "string" && hasOwn(WEAPON_ART, style)
    ? WEAPON_ART[style]
    : WEAPON_ART[DEFAULT_WEAPON_STYLE];
}

export function resolveEnemyArt(
  style: unknown,
): ArtReference {
  return typeof style === "string" && hasOwn(ENEMY_ART, style)
    ? ENEMY_ART[style]
    : ENEMY_ART[DEFAULT_ENEMY_STYLE];
}

export function resolveAnimalArt(
  species: unknown,
): ArtReference {
  return typeof species === "string" && hasOwn(ANIMAL_ART, species)
    ? ANIMAL_ART[species]
    : ANIMAL_ART[DEFAULT_ANIMAL_SPECIES];
}

export function resolveCageArt(
  style: unknown,
): ArtReference {
  return typeof style === "string" && hasOwn(CAGE_ART, style)
    ? CAGE_ART[style]
    : CAGE_ART[DEFAULT_CAGE_STYLE];
}

export function resolveKeyArt(color: unknown): SpriteArt {
  return typeof color === "string" && hasOwn(KEY_ART, color)
    ? KEY_ART[color]
    : KEY_ART[DEFAULT_KEY_COLOR];
}

export function resolveDoorArt(color: unknown): SpriteArt {
  return typeof color === "string" && hasOwn(DOOR_ART, color)
    ? DOOR_ART[color]
    : DOOR_ART[DEFAULT_KEY_COLOR];
}

export function resolveLockPairArt(color: unknown): LockPairArt {
  return typeof color === "string" && hasOwn(LOCK_PAIR_ART, color)
    ? LOCK_PAIR_ART[color]
    : LOCK_PAIR_ART[DEFAULT_KEY_COLOR];
}

export function resolvePortalArt(pair: unknown): ArtReference & { readonly motif: string } {
  return typeof pair === "string" && hasOwn(PORTAL_ART, pair)
    ? PORTAL_ART[pair]
    : PORTAL_ART["rose-heart"];
}
