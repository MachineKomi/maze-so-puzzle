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
import { MGJRPG02_ART } from "./generated/mgjrpg02Art";

/**
 * Immutable, source-backed Plan 03 delivery records. Runtime catalogues below
 * are semantic projections of this generated authority; filenames never
 * decide identity, status, or ordering.
 */
export { MGJRPG02_ART };

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
  | "icon"
  | "periodic-tile"
  | "portrait";

export interface ArtGeometry {
  readonly class: ArtGeometryClass;
  readonly pivot: NormalizedPoint;
  /** Alpha-visible bounds, normalized as x, y, width, height. */
  readonly visibleBounds: NormalizedRect;
  /** Canonical reserved inset, ordered top, right, bottom, left. */
  readonly safeInset: NormalizedInsets;
  readonly faceBox?: NormalizedRect;
  readonly eyeLine?: number;
  readonly groundLine?: number;
  readonly floatCenter?: NormalizedPoint;
  readonly visualCenter?: NormalizedPoint;
  readonly gripPoint?: NormalizedPoint;
  readonly forwardAxisDegrees?: number;
  /** Weapon canvas size relative to the registered Ame canvas. */
  readonly heldScale?: number;
  /** Clockwise CSS rotation applied after the approved source construction. */
  readonly heldRotationDegrees?: number;
  /** Local actor-stack order; Ame's body occupies layer 2. */
  readonly zOrder?: number;
  readonly baseline?: number;
  readonly openBay?: NormalizedRect;
  readonly motifBox?: NormalizedRect;
  readonly apertureBox?: NormalizedRect;
  readonly rimBox?: NormalizedRect;
  readonly voidBox?: NormalizedRect;
  readonly opticalBounds?: NormalizedRect;
  readonly modifierBox?: NormalizedRect;
  readonly tileFootprint?: NormalizedRect;
  readonly stateFamilyId?: string;
  readonly stateAnchorBox?: NormalizedRect;
}

export interface HeldWeaponGeometry extends ArtGeometry {
  readonly class: "weapon";
  readonly gripPoint: NormalizedPoint;
  readonly forwardAxisDegrees: number;
  readonly heldScale: number;
  readonly heldRotationDegrees: number;
  readonly zOrder: number;
}

export interface WeaponArt extends ArtReference {
  readonly geometry: HeldWeaponGeometry;
  readonly runtimeStatus: "active";
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
  readonly sourceRecordId: string;
  readonly runtimeStatus: Extract<RuntimeArtStatus, "active" | "dormant">;
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
  readonly sourceRecordId: string;
  readonly runtimeStatus: "active";
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

export const FLOORS = {
  sunnyStone: {
    ...MGJRPG02_ART["floor-sunny-stone"],
    label: "Sunny stone path",
    periodTiles: 3.4,
    fallbackColor: "#f8d991",
    dominantColor: "gold",
    visualLightness: 81,
  },
  roseBrick: {
    ...MGJRPG02_ART["floor-rose-brick"],
    label: "Rose courtyard bricks",
    periodTiles: 4.2,
    fallbackColor: "#efb8ad",
    dominantColor: "rose",
    visualLightness: 82,
  },
  moonSlate: {
    ...MGJRPG02_ART["floor-moon-slate"],
    label: "Moonlit slate",
    periodTiles: 3.8,
    fallbackColor: "#aeb9d8",
    dominantColor: "blue",
    visualLightness: 69,
  },
  meadowGrass: {
    ...MGJRPG02_ART["floor-meadow-grass"],
    label: "Flower meadow grass",
    periodTiles: 3.6,
    fallbackColor: "#81c95d",
    dominantColor: "green",
    visualLightness: 73,
  },
  woodlandDirt: {
    ...MGJRPG02_ART["floor-woodland-dirt"],
    label: "Woodland pebble trail",
    periodTiles: 3.8,
    fallbackColor: "#d9a36f",
    dominantColor: "earth",
    visualLightness: 68,
  },
  pearlShell: {
    ...MGJRPG02_ART["floor-pearl-shell"],
    label: "Pearl shell mosaic",
    periodTiles: 4.1,
    fallbackColor: "#cfe6eb",
    dominantColor: "blue",
    visualLightness: 83,
  },
  peachLeafstone: {
    ...MGJRPG02_ART["floor-peach-leafstone"],
    label: "Peach leaf-stone path",
    periodTiles: 4.1,
    fallbackColor: "#f5c6af",
    dominantColor: "rose",
    visualLightness: 81,
  },
} as const satisfies Readonly<Record<string, TerrainTextureArt>>;

export const WALLS = {
  lavenderStone: {
    ...MGJRPG02_ART["wall-lavender-stone"],
    label: "Lavender stone wall",
    periodTiles: 3.4,
    fallbackColor: "#7775b6",
    dominantColor: "violet",
    visualLightness: 56,
  },
  sandstone: {
    ...MGJRPG02_ART["wall-golden-sandstone"],
    label: "Golden sandstone wall",
    periodTiles: 4.2,
    fallbackColor: "#e5af58",
    dominantColor: "gold",
    visualLightness: 83,
  },
  mossyRuin: {
    ...MGJRPG02_ART["wall-mossy-ruin"],
    label: "Mossy storybook ruins",
    periodTiles: 4,
    fallbackColor: "#91a96e",
    dominantColor: "sage",
    visualLightness: 71,
  },
  darkDungeon: {
    ...MGJRPG02_ART["wall-dark-dungeon"],
    label: "Moon-dark dungeon wall",
    periodTiles: 4,
    fallbackColor: "#3d3a63",
    dominantColor: "indigo",
    visualLightness: 19,
  },
  hedge: {
    ...MGJRPG02_ART["wall-hedge"],
    label: "Flowering garden hedge",
    periodTiles: 3.6,
    fallbackColor: "#3f9c55",
    dominantColor: "green",
    visualLightness: 60,
  },
  amethystCrystal: {
    ...MGJRPG02_ART["wall-amethyst-crystal"],
    label: "Amethyst crystal wall",
    periodTiles: 4.1,
    fallbackColor: "#6d4a9b",
    dominantColor: "violet",
    visualLightness: 33,
  },
  berryBramble: {
    ...MGJRPG02_ART["wall-berry-bramble"],
    label: "Enchanted berry bramble",
    periodTiles: 4.1,
    fallbackColor: "#4c284d",
    dominantColor: "indigo",
    visualLightness: 21,
  },
} as const satisfies Readonly<Record<string, TerrainTextureArt>>;

export const TERRAIN_DRESSING_ART = {
  garden: {
    ...MGJRPG02_ART["terrain-dressing-garden"],
    label: "Tiny garden flowers and moss",
    periodTiles: 13,
    opacity: 0.16,
  },
  vines: {
    ...MGJRPG02_ART["terrain-dressing-vines"],
    label: "Soft ivy and moss",
    periodTiles: 13,
    opacity: 0.17,
  },
  crystal: {
    ...MGJRPG02_ART["terrain-dressing-crystal"],
    label: "Pearls and crystal glints",
    periodTiles: 14,
    opacity: 0.08,
  },
  autumn: {
    ...MGJRPG02_ART["terrain-dressing-autumn"],
    label: "Tiny leaves and acorn confetti",
    periodTiles: 14,
    opacity: 0.09,
  },
} as const satisfies Readonly<Record<string, TerrainDressingArt>>;

export type HazardKind = Extract<TerrainKind, "water" | "lava" | "poison" | "hole">;

export interface HazardArt extends ArtReference {
  readonly id: string;
  readonly sourceRecordId: string;
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
    ...MGJRPG02_ART["terrain-water"],
    id: "terrain-water",
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
    ...MGJRPG02_ART["terrain-lava"],
    id: "terrain-lava",
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
    ...MGJRPG02_ART["terrain-poison"],
    id: "terrain-poison",
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
    ...MGJRPG02_ART["ground-hole"],
    id: "ground-hole",
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

/** Candidate C identity with the Human-approved Fresh B-led 01 rendering. */
export const AME_ART = {
  id: "ame",
  family: "character",
  label: "Ame",
  artVersion: MGJRPG02_ART.ame.artVersion,
  recipeVersion: MGJRPG02_ART.ame.recipeVersion,
  src: MGJRPG02_ART.ame.src,
  variants: [{
    src: MGJRPG02_ART.ame.src,
    width: MGJRPG02_ART.ame.width,
    height: MGJRPG02_ART.ame.height,
    format: "webp",
    usage: "field",
    minDisplayPx: 40,
    maxDisplayPx: 103,
  }],
  geometry: {
    class: "grounded-actor",
    pivot: MGJRPG02_ART.ame.geometry.pivot,
    visibleBounds: MGJRPG02_ART.ame.geometry.visibleBounds,
    safeInset: MGJRPG02_ART.ame.geometry.safeInset,
    faceBox: [0.39, 0.19, 0.25, 0.20],
    eyeLine: 0.28,
    groundLine: 0.90,
    gripPoint: [0.66, 0.58],
    forwardAxisDegrees: 0,
  },
  alphaMode: MGJRPG02_ART.ame.alphaMode,
  view: "front-three-quarter",
  lightProfile: "neutral-albedo",
  castsRuntimeShadow: true,
  sourceRecordId: MGJRPG02_ART.ame.sourceRecordId,
  runtimeStatus: "active",
} as const satisfies SpriteArt;

export const WEAPON_ART = {
  "star-sword": MGJRPG02_ART["star-sword"],
  "flower-sabre": MGJRPG02_ART["flower-sabre"],
  "moon-wand": MGJRPG02_ART["moon-wand"],
  "leaf-blade": MGJRPG02_ART["leaf-blade"],
  "sun-mallet": MGJRPG02_ART["sun-mallet"],
  "comet-spear": MGJRPG02_ART["comet-spear"],
  "bubble-ring-blade": MGJRPG02_ART["bubble-ring-blade"],
  "cupcake-mace": MGJRPG02_ART["cupcake-mace"],
} as const satisfies Readonly<Record<WeaponStyle, WeaponArt>>;

export const ENEMY_ART = {
  goblin: { src: "/assets/goblin.png", label: "Garden Goblin" },
  "blueberry-slime": MGJRPG02_ART["blueberry-slime"],
  "mushroom-imp": MGJRPG02_ART["mushroom-imp"],
  "moon-bat": MGJRPG02_ART["moon-bat"],
  "pebble-golem": MGJRPG02_ART["pebble-golem"],
  "acorn-knight": MGJRPG02_ART["acorn-knight"],
  "bubble-dragon": MGJRPG02_ART["bubble-dragon"],
  "candy-mimic": MGJRPG02_ART["candy-mimic"],
  "cloud-gremlin": MGJRPG02_ART["cloud-gremlin"],
  "pumpkin-sprite": MGJRPG02_ART["pumpkin-sprite"],
  "clockwork-crab": MGJRPG02_ART["clockwork-crab"],
  "jelly-sorcerer": MGJRPG02_ART["jelly-sorcerer"],
} as const satisfies Readonly<Record<EnemyStyle, ArtReference>>;

export const ANIMAL_ART = {
  bunny: MGJRPG02_ART.bunny,
  fox: MGJRPG02_ART.fox,
  kitten: MGJRPG02_ART.kitten,
  puppy: MGJRPG02_ART.puppy,
  duckling: MGJRPG02_ART.duckling,
  hedgehog: MGJRPG02_ART.hedgehog,
  fawn: MGJRPG02_ART.fawn,
  "red-panda": MGJRPG02_ART["red-panda"],
  otter: MGJRPG02_ART.otter,
  lamb: MGJRPG02_ART.lamb,
  capybara: MGJRPG02_ART.capybara,
  chinchilla: MGJRPG02_ART.chinchilla,
  alpaca: MGJRPG02_ART.alpaca,
  penguin: MGJRPG02_ART.penguin,
  koala: MGJRPG02_ART.koala,
} as const satisfies Readonly<Record<AnimalSpecies, ArtReference>>;

export const CAGE_ART = {
  "golden-heart": MGJRPG02_ART["golden-heart"],
  "storybook-wood": MGJRPG02_ART["storybook-wood"],
  "moon-silver": MGJRPG02_ART["moon-silver"],
  "garden-vine": MGJRPG02_ART["garden-vine"],
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

type PublishedLockId =
  | "key-rose-heart"
  | "key-blue-star"
  | "key-sunny-sun"
  | "door-rose-heart"
  | "door-blue-star"
  | "door-sunny-sun";

function publishedLockSprite(id: PublishedLockId, kind: "key" | "door"): SpriteArt {
  const published = MGJRPG02_ART[id];
  const isDoor = kind === "door";
  return {
    id: published.id,
    family: "lock",
    label: published.label,
    artVersion: published.artVersion,
    recipeVersion: published.recipeVersion,
    src: published.src,
    variants: [{
      src: published.src,
      width: published.width,
      height: published.height,
      format: "webp",
      usage: "field",
      minDisplayPx: 40,
      maxDisplayPx: 103,
    }],
    geometry: published.geometry,
    alphaMode: published.alphaMode,
    view: isDoor ? "front" : "front-three-quarter",
    lightProfile: "neutral-albedo",
    castsRuntimeShadow: true,
    sourceRecordId: published.sourceRecordId,
    runtimeStatus: "active",
  };
}

/** Single semantic source of runtime truth for matching key/door pairs. */
export const LOCK_PAIR_ART = {
  red: {
    id: "red",
    label: "Rose Heart",
    colorLabel: "Rose",
    paletteToken: "lock-rose",
    motifLabel: "Heart",
    motifToken: "heart",
    glyph: "♥",
    key: publishedLockSprite("key-rose-heart", "key"),
    door: publishedLockSprite("door-rose-heart", "door"),
  },
  blue: {
    id: "blue",
    label: "Blue Star",
    colorLabel: "Blue",
    paletteToken: "lock-blue",
    motifLabel: "Star",
    motifToken: "star",
    glyph: "★",
    key: publishedLockSprite("key-blue-star", "key"),
    door: publishedLockSprite("door-blue-star", "door"),
  },
  yellow: {
    id: "yellow",
    label: "Sunny Sun",
    colorLabel: "Sunny",
    paletteToken: "lock-sunny",
    motifLabel: "Sun",
    motifToken: "sun",
    glyph: "☀",
    key: publishedLockSprite("key-sunny-sun", "key"),
    door: publishedLockSprite("door-sunny-sun", "door"),
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
  "rose-heart": { ...MGJRPG02_ART["rose-heart"], motif: "♥" },
  "mint-clover": { ...MGJRPG02_ART["mint-clover"], motif: "four-leaf clover" },
  "violet-moon": { src: "/assets/portal-violet-moon-v1.png", label: "Violet Moon Portal", motif: "☾" },
} as const satisfies Readonly<Record<PortalPairId, ArtReference & { readonly motif: string }>>;

export const PICKUP_ART = {
  potion: MGJRPG02_ART["power-potion"],
  boots: MGJRPG02_ART["splash-boots"],
  springBoots: MGJRPG02_ART["spring-boots"],
  antidoteLeaf: MGJRPG02_ART["antidote-leaf"],
} as const satisfies Readonly<Record<string, ArtReference & { readonly runtimeStatus: "active" }>>;

export const TREASURE_CATALOG_ART = {
  "gold-bag": MGJRPG02_ART["gold-bag"],
  "gold-chest": MGJRPG02_ART["gold-chest"],
  "science-gears": MGJRPG02_ART["science-gears"],
  "science-beaker": MGJRPG02_ART["science-beaker"],
} as const satisfies Readonly<Record<string, ArtReference & { readonly runtimeStatus: "active" }>>;

export const GOAL_ART = MGJRPG02_ART.goal;

export const STORY_ART = {
  amePortrait: MGJRPG02_ART["ame-portrait"],
  // Professor Poggle and Sprig were explicitly retained in this cutover.
  professorPoggle: { src: "/assets/story-professor-poggle-v1.webp", label: "Professor Poggle" },
  sprig: { src: "/assets/story-sprig-v1.webp", label: "Sprig" },
} as const satisfies Readonly<Record<string, ArtReference>>;

/**
 * Approved catalogue-only art. These records are intentionally absent from
 * gameplay unions, generator pools, level placement, progression, and balance.
 */
export const FUTURE_FRIEND_ART = {
  "pitter-patter-parasol": MGJRPG02_ART["pitter-patter-parasol"],
  lanternling: MGJRPG02_ART.lanternling,
  "emberdown-phoenix": MGJRPG02_ART["emberdown-phoenix"],
  "meadowstep-faunling": MGJRPG02_ART["meadowstep-faunling"],
  "minerva-moon-owl": MGJRPG02_ART["minerva-moon-owl"],
  "tessera-dolphin": MGJRPG02_ART["tessera-dolphin"],
  "mallowmusk-aroma-wisp": MGJRPG02_ART["mallowmusk-aroma-wisp"],
  "breezeling-sylph": MGJRPG02_ART["breezeling-sylph"],
  "griffin-cub": MGJRPG02_ART["griffin-cub"],
  "emberbelly-dragonling": MGJRPG02_ART["emberbelly-dragonling"],
  "cloudstep-pegasus": MGJRPG02_ART["cloudstep-pegasus"],
  "three-tumble-cerberus": MGJRPG02_ART["three-tumble-cerberus"],
  "riddlekit-sphinx": MGJRPG02_ART["riddlekit-sphinx"],
  "tidecurl-hippocamp": MGJRPG02_ART["tidecurl-hippocamp"],
  "ripplecap-kappa": MGJRPG02_ART["ripplecap-kappa"],
  "rainbow-horn-unicorn": MGJRPG02_ART["rainbow-horn-unicorn"],
  "green-tea-skeleton": MGJRPG02_ART["green-tea-skeleton"],
} as const satisfies Readonly<Record<string, ArtReference & { readonly runtimeStatus: "dormant" }>>;

export const FUTURE_ENEMY_ART = {
  "classic-slime": MGJRPG02_ART["classic-slime"],
  // Internal semantic ID is stable; Plan 09/Human review still owns the public label.
  succubus: { ...MGJRPG02_ART.succubus, label: "Public label pending" },
  kappa: MGJRPG02_ART.kappa,
  cyclops: MGJRPG02_ART.cyclops,
  lamia: MGJRPG02_ART.lamia,
  "soda-slime": MGJRPG02_ART["soda-slime"],
  minotaur: MGJRPG02_ART.minotaur,
  "lizard-swordsman": MGJRPG02_ART["lizard-swordsman"],
  "lizard-spearman": MGJRPG02_ART["lizard-spearman"],
  "t-rex": MGJRPG02_ART["t-rex"],
  "orc-chieftain": MGJRPG02_ART["orc-chieftain"],
  "warrior-skeleton": MGJRPG02_ART["warrior-skeleton"],
  cultist: MGJRPG02_ART.cultist,
} as const satisfies Readonly<Record<string, ArtReference & { readonly runtimeStatus: "dormant" }>>;

export const FUTURE_PORTAL_ART = {
  "sunny-diamond": { ...MGJRPG02_ART["sunny-diamond"], motif: "diamond bloom" },
  "violet-spade-bloom": { ...MGJRPG02_ART["violet-spade-bloom"], motif: "spade bloom" },
} as const satisfies Readonly<Record<string, ArtReference & { readonly runtimeStatus: "dormant"; readonly motif: string }>>;

export const FUTURE_ITEM_ART = {
  "science-magnifying-glass": MGJRPG02_ART["science-magnifying-glass"],
  "science-telescope": MGJRPG02_ART["science-telescope"],
  "science-book": MGJRPG02_ART["science-book"],
  "ice-skates": MGJRPG02_ART["ice-skates"],
  "hard-leather-work-boots": MGJRPG02_ART["hard-leather-work-boots"],
} as const satisfies Readonly<Record<string, ArtReference & { readonly runtimeStatus: "dormant" }>>;

export const FUTURE_HAZARD_ART = {
  "floor-spikes-overlay": MGJRPG02_ART["floor-spikes-overlay"],
} as const satisfies Readonly<Record<string, ArtReference & { readonly runtimeStatus: "dormant" }>>;

/**
 * State-family view for future Mimic consumers. Candy's revealed state is the
 * exact ENEMY_ART object (not a second catalogue authority or delivery copy).
 */
export const MIMIC_ART = {
  "classic-mimic": {
    revealed: MGJRPG02_ART["classic-mimic-revealed"],
    closed: MGJRPG02_ART["classic-mimic-closed"],
    "good-open": MGJRPG02_ART["classic-mimic-good-open"],
  },
  "candy-mimic": {
    revealed: ENEMY_ART["candy-mimic"],
    closed: MGJRPG02_ART["candy-mimic-closed"],
    "good-open": MGJRPG02_ART["candy-mimic-good-open"],
  },
} as const;

export const NAVIGATION_ART = {
  "nav-home": MGJRPG02_ART["nav-home"],
  "nav-mazes": MGJRPG02_ART["nav-mazes"],
  "nav-book": MGJRPG02_ART["nav-book"],
  "nav-help": MGJRPG02_ART["nav-help"],
  "nav-sound": MGJRPG02_ART["nav-sound"],
  "nav-muted": MGJRPG02_ART["nav-muted"],
  "nav-restart": MGJRPG02_ART["nav-restart"],
} as const satisfies Readonly<Record<string, ArtReference & { readonly runtimeStatus: "active" }>>;

export const ACHIEVEMENT_ART = {
  "first-star": MGJRPG02_ART["reward-trail-sticker"],
  "animal-friend": MGJRPG02_ART["reward-animal-friend-sticker"],
  "surprise-sparkle": MGJRPG02_ART["reward-surprise-sparkle-sticker"],
  "perfect-rescue-5": MGJRPG02_ART["reward-helping-paw-medal"],
  "perfect-rescue-10": MGJRPG02_ART["reward-rainbow-rescue-medal"],
  "perfect-rescue-15": MGJRPG02_ART["reward-golden-guardian-medal"],
  "maze-explorer-5": MGJRPG02_ART["badge-pathfinder"],
  "maze-explorer-10": MGJRPG02_ART["badge-maze-mapper"],
  "maze-explorer-20": MGJRPG02_ART["badge-grand-explorer"],
  "surprise-explorer-3": MGJRPG02_ART["badge-surprise-scout"],
  "mighty-adventurer": MGJRPG02_ART["badge-mighty-adventurer"],
  "twinkle-toes": MGJRPG02_ART["badge-twinkle-toes"],
  "bunny-buddy-10": MGJRPG02_ART["badge-bunny-buddy"],
  "fox-friend-10": MGJRPG02_ART["badge-fox-friend"],
  "kitten-pal-10": MGJRPG02_ART["badge-kitten-pal"],
} as const satisfies Readonly<Record<string, ArtReference & { readonly runtimeStatus: "active" }>>;

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
): WeaponArt {
  // Compatibility for pre-publication snapshots and external level records.
  // Bubble Bow is no longer a canonical gameplay identity and is not exposed
  // as a second catalogue entry; it resolves one-way to the approved ring blade.
  const canonicalStyle = style === "bubble-bow" ? "bubble-ring-blade" : style;
  return typeof canonicalStyle === "string" && hasOwn(WEAPON_ART, canonicalStyle)
    ? WEAPON_ART[canonicalStyle]
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
