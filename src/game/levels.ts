import type {
  AnimalSpecies,
  KeyColor,
  LevelDefinition,
  LevelObject,
  LevelSource,
  Point,
  TerrainKind,
} from "./types";

export interface AsciiLevelOptions {
  readonly id: string;
  readonly name: string;
  readonly objective: string;
  readonly map: readonly string[];
  readonly initialPower?: number;
  readonly potionAmount?: number;
  readonly source?: LevelSource;
  readonly seed?: string;
  readonly introducedMechanics?: readonly string[];
}

type WithoutId<T> = T extends { readonly id: string } ? Omit<T, "id"> : never;
type LevelObjectInput = WithoutId<LevelObject>;

const KEY_COLORS: Readonly<Record<string, KeyColor>> = {
  r: "red",
  b: "blue",
  y: "yellow",
};

const DOOR_COLORS: Readonly<Record<string, KeyColor>> = {
  R: "red",
  B: "blue",
  Y: "yellow",
};

const ANIMAL_SPECIES: Readonly<Record<string, AnimalSpecies>> = {
  c: "kitten",
  f: "fox",
  q: "bunny",
};

/**
 * Parses the compact authoring format used by the tutorial levels and tests.
 * Interactive characters always sit on ordinary floor terrain.
 */
export function parseAsciiLevel(options: AsciiLevelOptions): LevelDefinition {
  const height = options.map.length;
  if (height === 0) {
    throw new Error(`Level "${options.id}" has no rows.`);
  }

  const firstRow = options.map[0];
  if (firstRow === undefined || firstRow.length === 0) {
    throw new Error(`Level "${options.id}" has an empty first row.`);
  }

  const width = firstRow.length;
  if (options.map.some((row) => row.length !== width)) {
    throw new Error(`Level "${options.id}" has rows with different widths.`);
  }

  const terrain: TerrainKind[][] = [];
  const objects: LevelObject[] = [];
  let start: Point | undefined;
  let exit: Point | undefined;
  let objectNumber = 0;

  const addObject = (object: LevelObjectInput): void => {
    objectNumber += 1;
    objects.push({
      ...object,
      id: `${options.id}-${object.kind}-${objectNumber}`,
    } as LevelObject);
  };

  for (let y = 0; y < height; y += 1) {
    const sourceRow = options.map[y];
    if (sourceRow === undefined) {
      throw new Error(`Level "${options.id}" is missing row ${y}.`);
    }

    const terrainRow: TerrainKind[] = [];
    for (let x = 0; x < width; x += 1) {
      const character = sourceRow[x];
      if (character === undefined) {
        throw new Error(`Level "${options.id}" is missing cell ${x},${y}.`);
      }

      const at = { x, y };
      if (character === "#") {
        terrainRow.push("wall");
        continue;
      }

      if (character === "~" || character === "^") {
        terrainRow.push(character === "~" ? "water" : "lava");
        continue;
      }

      terrainRow.push("floor");
      if (character === ".") {
        continue;
      }

      if (character === "@") {
        if (start !== undefined) {
          throw new Error(`Level "${options.id}" has more than one start.`);
        }
        start = at;
        continue;
      }

      if (character === "E") {
        if (exit !== undefined) {
          throw new Error(`Level "${options.id}" has more than one exit.`);
        }
        exit = at;
        continue;
      }

      if (/^[1-9]$/.test(character)) {
        addObject({ kind: "enemy", at, power: Number(character) });
        continue;
      }

      if (character === "s") {
        addObject({ kind: "sword", at });
        continue;
      }

      if (character === "u") {
        addObject({ kind: "boots", at });
        continue;
      }

      if (character === "p") {
        addObject({ kind: "potion", at, amount: options.potionAmount ?? 2 });
        continue;
      }

      const keyColor = KEY_COLORS[character];
      if (keyColor !== undefined) {
        addObject({ kind: "key", at, color: keyColor });
        continue;
      }

      const doorColor = DOOR_COLORS[character];
      if (doorColor !== undefined) {
        addObject({ kind: "door", at, color: doorColor });
        continue;
      }

      const animalSpecies = ANIMAL_SPECIES[character];
      if (animalSpecies !== undefined) {
        addObject({ kind: "animal", at, species: animalSpecies });
        continue;
      }

      throw new Error(
        `Level "${options.id}" contains unknown character "${character}" at ${x},${y}.`,
      );
    }
    terrain.push(terrainRow);
  }

  if (start === undefined || exit === undefined) {
    throw new Error(`Level "${options.id}" needs exactly one start and exit.`);
  }

  return {
    schemaVersion: 1,
    id: options.id,
    name: options.name,
    objective: options.objective,
    source: options.source ?? "curated",
    seed: options.seed,
    width,
    height,
    initialPower: options.initialPower ?? 2,
    start,
    exit,
    terrain,
    objects,
    introducedMechanics: options.introducedMechanics,
  };
}

export const MOVEMENT_LEVEL = parseAsciiLevel({
  id: "little-star-trail",
  name: "Little Star Trail",
  objective: "Follow the paths to the star!",
  introducedMechanics: ["movement", "exit", "animal-rescue"],
  map: [
    "#############",
    "#@#c....#f..#",
    "#.###.#.###.#",
    "#.....#.....#",
    "###########.#",
    "#.......#...#",
    "###.#.###.###",
    "#...#.#...#.#",
    "#.###.#.###.#",
    "#...#.#.#...#",
    "#.#.###.###.#",
    "#q#........E#",
    "#############",
  ],
});

export const SWORD_AND_KEY_LEVEL = parseAsciiLevel({
  id: "shiny-sword",
  name: "Shiny Sword",
  objective: "Find the sword and star key!",
  introducedMechanics: ["sword", "enemy", "red-key", "red-door"],
  map: [
    "###############",
    "#@#..r..R.#f..#",
    "#.#.###1#.###.#",
    "#.#...#.#.....#",
    "#.###.#.#####.#",
    "#...#c#.#...#.#",
    "###s###.#.#.#.#",
    "#.#...#.#.#q#.#",
    "#.###.#.#.###.#",
    "#...#...#.#...#",
    "###.#####.#.###",
    "#.......#...#.#",
    "#.#######.###.#",
    "#............E#",
    "###############",
  ],
});

export const SPLASHY_BOOTS_LEVEL = parseAsciiLevel({
  id: "splashy-boots",
  name: "Splashy Boots",
  objective: "Grow your Power and cross the water!",
  introducedMechanics: ["potion", "stronger-enemy", "boots", "water", "blue-key"],
  map: [
    "#################",
    "#@#f......6...#.#",
    "#.#######.###.#.#",
    "#.#...#...#b#u#.#",
    "#.#.#.#3###.#~#.#",
    "#...#.#...#.~~#.#",
    "#####.#s#.#B###.#",
    "#.....#c#.#.#...#",
    "#.#######.#.#.###",
    "#....p....#.#...#",
    "###########.###.#",
    "#.#.....#q#...#.#",
    "#.#.#.#.#.###.#.#",
    "#.#.#.#...#...#.#",
    "#.#.#.#####.###.#",
    "#...#..........E#",
    "#################",
  ],
});

export const TOASTY_TOES_LEVEL = parseAsciiLevel({
  id: "toasty-toes",
  name: "Toasty Toes",
  objective: "Use everything to reach the star!",
  introducedMechanics: ["lava", "two-key-colors", "power-chain"],
  map: [
    "###################",
    "#@.....p..#.......#",
    "#########.#.#####.#",
    "#...#..c#.#...#...#",
    "#.#.#.###.#####.###",
    "#s#...#...#...#...#",
    "#.#####.###B#.###.#",
    "#.......#b..#...#.#",
    "#3#######.#.###.#.#",
    "#.#.......#.#...#.#",
    "#.#.#####.#.###.#.#",
    "#.#q#^^.#.#...#.#.#",
    "#.###^#.#####.#.#.#",
    "#.#...#...9.#.#.#.#",
    "#.#.#######.#.#.#.#",
    "#.#u#.....#.#.#...#",
    "#6#.#.#.###.#.###.#",
    "#...#f#..r..R.#..E#",
    "###################",
  ],
});

export const RAINBOW_PICNIC_LEVEL = parseAsciiLevel({
  id: "rainbow-picnic",
  name: "Rainbow Picnic",
  objective: "Pack your boots and open both rainbow gates!",
  introducedMechanics: ["water", "two-key-colors", "power-chain"],
  map: [
    "#####################",
    "#@#.....#4........#.#",
    "#.#.###.#.#####.#.#.#",
    "#.#E#R..#.....#.#.#.#",
    "#.###.#####.###.#.#.#",
    "#...#.#...#.#B..#...#",
    "###.#.#.#.#.#.#####.#",
    "#f#s#...#r..#.#...#.#",
    "#.#.#.#######.#.###.#",
    "#.#.#...#.....#.....#",
    "#.#.###.#.#########.#",
    "#.#...#.#~~~#u....#.#",
    "#.###.#####.#.###.#.#",
    "#..q#..p..#.....#.#.#",
    "#.#######.#######.###",
    "#.#.....#.......#..b#",
    "#.#.#.#########.###.#",
    "#...#.........#2..#.#",
    "#.#########.#####.#.#",
    "#........c#.........#",
    "#####################",
  ],
});

export const MOONBEAM_MOAT_LEVEL = parseAsciiLevel({
  id: "moonbeam-moat",
  name: "Moonbeam Moat",
  objective: "Splash past the moonlit moat and its three gates!",
  introducedMechanics: ["water", "lava", "three-key-colors"],
  map: [
    "#####################",
    "#@..#.......#....y..#",
    "###.#.#.###.#####.#.#",
    "#...#.#..B#.6.....#.#",
    "#.###.###.#########.#",
    "#.#...#.#.#...#..E#.#",
    "#.###.#.#.#.#.#.###.#",
    "#s..#...#...#b#....Y#",
    "###.#.#######.#######",
    "#...#.#.....#......~#",
    "#.###.#.###.#######~#",
    "#.#...#.R.#u.....^^^#",
    "#.#######.#########.#",
    "#p......#...#c..#...#",
    "#######.#.#.###.#.###",
    "#....q#.#.#...#.#...#",
    "#.#####.#####.#.###.#",
    "#.#...#.#...#r#...#.#",
    "#.#.#.#.#.#.#.#.#.#.#",
    "#...#....3#...#f#...#",
    "#####################",
  ],
});

export const WISHING_WOODS_LEVEL = parseAsciiLevel({
  id: "wishing-woods",
  name: "Wishing Woods",
  objective: "Follow the three wishes through water and warm sparkles!",
  introducedMechanics: ["mixed-hazards", "three-key-colors", "power-chain"],
  map: [
    "#######################",
    "#@#....s..#c.........f#",
    "#.###.###.#######.#####",
    "#.....#q#...#.....#...#",
    "#######.###.#.#####.#.#",
    "#.....#.#...#.......#.#",
    "###.#.#.#.###########.#",
    "#...#...#.#.......#...#",
    "#.###.###.#.#^###.#.#.#",
    "#.#...#..2#.#^..#r..#.#",
    "#.###.#.###.###.#####.#",
    "#...#.#.#.#.#.#.#...#.#",
    "#.#.###.#.#.#.#.#.###.#",
    "#.#p....#.....#.#....R#",
    "#.#############.#.#####",
    "#.#..........~~.#b#..E#",
    "#.#.###.#########.#.###",
    "#.#.#..u#..B..#...#..Y#",
    "#.#.#.###.###.#.###.#.#",
    "#.#.#.#.#...#...#...#.#",
    "#.###.#.###.#########.#",
    "#5....#.......9....y..#",
    "#######################",
  ],
});

export const AMES_GRAND_PARADE_LEVEL = parseAsciiLevel({
  id: "ames-grand-parade",
  name: "Ame's Grand Parade",
  objective: "Gather every colour and lead the grand parade home!",
  introducedMechanics: ["all-mechanics", "long-power-chain", "perfect-rescue-challenge"],
  map: [
    "#######################",
    "#@#.........#..~~~..#.#",
    "#.###.###.#.#.#.###.#.#",
    "#...#..c#.#.#.#.#...#.#",
    "###.#.###.#.#.#.#.###.#",
    "#.#.#f#...#q#.#u#..b..#",
    "#.#.###.#####.#.#####.#",
    "#.#s..#.......#.#.#...#",
    "#.###.#.#######.#.#.###",
    "#.....#...#...#.#.#..7#",
    "#.#########.#.#.#.###.#",
    "#p....#.....#R..#...#.#",
    "#####.#.#########.###.#",
    "#.#...#r..#.......#...#",
    "#.#.#####.#.#######.###",
    "#.#..4....#^......#.#.#",
    "#.#########^#####.#.#.#",
    "#.#.......#^#..E#B..#.#",
    "#.#.#.#####.#.#######.#",
    "#..9#..y....#......9..#",
    "#.###################.#",
    "#......Y.......p......#",
    "#######################",
  ],
});

export const CURATED_LEVELS: readonly LevelDefinition[] = [
  MOVEMENT_LEVEL,
  SWORD_AND_KEY_LEVEL,
  SPLASHY_BOOTS_LEVEL,
  TOASTY_TOES_LEVEL,
  RAINBOW_PICNIC_LEVEL,
  MOONBEAM_MOAT_LEVEL,
  WISHING_WOODS_LEVEL,
  AMES_GRAND_PARADE_LEVEL,
];

export function getCuratedLevel(id: string): LevelDefinition | undefined {
  return CURATED_LEVELS.find((level) => level.id === id);
}
