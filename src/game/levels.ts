import type {
  AnimalSpecies,
  CageStyle,
  EnemyStyle,
  KeyColor,
  LevelDefinition,
  LevelObject,
  LevelSource,
  Point,
  TerrainThemeId,
  TerrainKind,
  WeaponStyle,
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
  readonly terrainThemeId?: TerrainThemeId;
  readonly weaponStyle?: WeaponStyle;
  readonly enemyStyle?: EnemyStyle;
  readonly enemyStylesByPower?: Readonly<Partial<Record<number, EnemyStyle>>>;
  readonly cageStyle?: CageStyle;
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
  w: "puppy",
  d: "duckling",
  h: "hedgehog",
  n: "fawn",
  a: "red-panda",
};

/**
 * Parses the compact authoring format used by the tutorial levels and tests.
 * Interactive characters always sit on ordinary floor terrain. Lowercase `o`
 * authors a ground hole and `j` places the spring-boots pickup.
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

      if (character === "~" || character === "^" || character === "o") {
        terrainRow.push(
          character === "~" ? "water" : character === "^" ? "lava" : "hole",
        );
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
        const power = Number(character);
        const style = options.enemyStylesByPower?.[power] ?? options.enemyStyle;
        addObject({
          kind: "enemy",
          at,
          power,
          ...(style === undefined ? {} : { style }),
        });
        continue;
      }

      if (character === "s") {
        addObject({
          kind: "sword",
          at,
          ...(options.weaponStyle === undefined ? {} : { style: options.weaponStyle }),
        });
        continue;
      }

      if (character === "u") {
        addObject({ kind: "boots", at });
        continue;
      }

      if (character === "j") {
        addObject({ kind: "spring-boots", at });
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
        addObject({
          kind: "animal",
          at,
          species: animalSpecies,
          ...(options.cageStyle === undefined ? {} : { cageStyle: options.cageStyle }),
        });
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
    terrainThemeId: options.terrainThemeId,
    introducedMechanics: options.introducedMechanics,
  };
}

export const MOVEMENT_LEVEL = parseAsciiLevel({
  id: "little-star-trail",
  name: "Little Star Trail",
  objective: "Follow the paths to the star!",
  terrainThemeId: "sunny-stone",
  weaponStyle: "star-sword",
  enemyStyle: "goblin",
  cageStyle: "golden-heart",
  introducedMechanics: ["movement", "exit", "animal-rescue"],
  map: [
    "#########",
    "#wc.d...#",
    "#####.#.#",
    "#.....#.#",
    "#.#####.#",
    "#.#.....#",
    "#.#.#####",
    "#E#...s@#",
    "#########",
  ],
});

export const SWORD_AND_KEY_LEVEL = parseAsciiLevel({
  id: "shiny-sword",
  name: "Shiny Sword",
  objective: "Find the sword and star key!",
  terrainThemeId: "rose-courtyard",
  weaponStyle: "flower-sabre",
  enemyStyle: "goblin",
  cageStyle: "storybook-wood",
  introducedMechanics: ["sword", "enemy", "red-key", "red-door"],
  map: [
    "###########",
    "#E#...1.#.#",
    "#.#.#.#.#.#",
    "#.#.#.#...#",
    "#.#.#.###.#",
    "#.#h#.#f#s#",
    "#.###.#.#.#",
    "#.R.#r#...#",
    "###.#.#.###",
    "#q....#..@#",
    "###########",
  ],
});

export const SPLASHY_BOOTS_LEVEL = parseAsciiLevel({
  id: "splashy-boots",
  name: "Splashy Boots",
  objective: "Grow your Power and cross the water!",
  terrainThemeId: "moonlit-moat",
  weaponStyle: "moon-wand",
  enemyStyle: "blueberry-slime",
  cageStyle: "moon-silver",
  introducedMechanics: ["potion", "stronger-enemy", "boots", "water", "blue-key"],
  map: [
    "#############",
    "#u.....~..dn#",
    "#.#####~#####",
    "#...#...#...#",
    "###.#.###.#B#",
    "#..6#..b..#.#",
    "#.#########.#",
    "#...#@#E....#",
    "###3#.#######",
    "#...#.......#",
    "#.#######s#.#",
    "#..p......#a#",
    "#############",
  ],
});

export const TOASTY_TOES_LEVEL = parseAsciiLevel({
  id: "toasty-toes",
  name: "Toasty Toes",
  objective: "Use everything to reach the star!",
  terrainThemeId: "ember-keep",
  weaponStyle: "leaf-blade",
  enemyStyle: "mushroom-imp",
  enemyStylesByPower: { 9: "pebble-golem" },
  cageStyle: "garden-vine",
  introducedMechanics: ["lava", "two-key-colors", "power-chain"],
  map: [
    "#############",
    "#....9#...p.#",
    "#.###.#.###.#",
    "#b#...#s..#.#",
    "#.#^#####.#.#",
    "#.#^..#@..#.#",
    "#.###.#####3#",
    "#.#w#u#6....#",
    "#B#h#.#.#####",
    "#...#...#...#",
    "###.#####.#.#",
    "#c..r....R#E#",
    "#############",
  ],
});

export const RAINBOW_PICNIC_LEVEL = parseAsciiLevel({
  id: "rainbow-picnic",
  name: "Rainbow Picnic",
  objective: "Pack your boots and open both rainbow gates!",
  terrainThemeId: "star-garden",
  weaponStyle: "sun-mallet",
  enemyStyle: "blueberry-slime",
  enemyStylesByPower: { 4: "pebble-golem" },
  cageStyle: "golden-heart",
  introducedMechanics: ["water", "two-key-colors", "power-chain"],
  map: [
    "###############",
    "#...~~#...B...#",
    "#.###.#.#####.#",
    "#.#...#..E#b..#",
    "#.#.#######.#.#",
    "#u#r....#...#.#",
    "#.#####.#.###.#",
    "#.#.....R.#@#.#",
    "#.#.#####.#.###",
    "#.#.#...#d#...#",
    "#.#.#.#.#####.#",
    "#.#.#2#.p.#s..#",
    "#4###.###.#.###",
    "#......n#....f#",
    "###############",
  ],
});

export const MOONBEAM_MOAT_LEVEL = parseAsciiLevel({
  id: "moonbeam-moat",
  name: "Moonbeam Moat",
  objective: "Splash past the moonlit moat and its three gates!",
  terrainThemeId: "moonbeam-castle",
  weaponStyle: "moon-wand",
  enemyStyle: "moon-bat",
  cageStyle: "moon-silver",
  introducedMechanics: ["water", "lava", "three-key-colors"],
  map: [
    "###############",
    "#q#..B#......@#",
    "#.#.#.#s#######",
    "#.#.#.#.....p.#",
    "#a#.#.#######.#",
    "#.#y#.#..3....#",
    "#w#.#.#.#######",
    "#...#b#..6....#",
    "#.###.#######.#",
    "#.Y.#...#...#u#",
    "###.###.#r#.#.#",
    "#...#E#.#.#.#.#",
    "#^###.#R#.#~#.#",
    "#^....#...#~..#",
    "###############",
  ],
});

export const WISHING_WOODS_LEVEL = parseAsciiLevel({
  id: "wishing-woods",
  name: "Wishing Woods",
  objective: "Follow the three wishes through water and warm sparkles!",
  terrainThemeId: "wishing-woods",
  weaponStyle: "leaf-blade",
  enemyStyle: "mushroom-imp",
  enemyStylesByPower: { 9: "pebble-golem" },
  cageStyle: "garden-vine",
  introducedMechanics: [
    "mixed-hazards",
    "three-key-colors",
    "power-chain",
    "optional-miniboss",
    "spring-boots",
    "ground-holes",
    "required-backtracking",
  ],
  map: [
    "#################",
    "#r.......9..#~..#",
    "#.#########.#~#.#",
    "#...#.oo.b#...#.#",
    "#.#.#.###.#####.#",
    "#j#.R...#...#..u#",
    "#######.###.#.###",
    "#....E#..h#.#.#c#",
    "#.#########B#.#9#",
    "#.#d.....y#.#.#.#",
    "#.#####.#.#.#5#.#",
    "#^#.Y...#...#...#",
    "#^#.###########.#",
    "#...#.....#...#.#",
    "#####.###.#2#.#.#",
    "#@.....s#...#..p#",
    "#################",
  ],
});

export const AMES_GRAND_PARADE_LEVEL = parseAsciiLevel({
  id: "ames-grand-parade",
  name: "Ame's Grand Parade",
  objective: "Gather every colour and lead the grand parade home!",
  terrainThemeId: "parade-courtyard",
  weaponStyle: "sun-mallet",
  enemyStyle: "goblin",
  enemyStylesByPower: {
    4: "blueberry-slime",
    7: "moon-bat",
    9: "pebble-golem",
  },
  cageStyle: "storybook-wood",
  introducedMechanics: [
    "all-mechanics",
    "long-power-chain",
    "spring-boots",
    "ground-holes",
    "required-backtracking",
    "perfect-rescue-challenge",
  ],
  map: [
    "#################",
    "#n#....~~....u.j#",
    "#.#.#########.###",
    "#.#.#Y..#@..#...#",
    "#.#r#.#.###.###.#",
    "#.#.#.#.#...#.9.#",
    "#.#.#.#.#s###.#.#",
    "#...#.#.#.#...#a#",
    "#.###.#^#.#.#####",
    "#R#..y#^#.#p....#",
    "#o#.###.#.#####.#",
    "#o#.#f..#..2..#7#",
    "#.#.###.#####.#.#",
    "#.#.B.#.#..p..#.#",
    "#.###.#.#.#####.#",
    "#b....#E#...4...#",
    "#################",
  ],
});

export const SPRINGSTEP_SKY_HOLLOW_LEVEL = parseAsciiLevel({
  id: "springstep-sky-hollow",
  name: "Springstep Sky Hollow",
  objective: "Explore the side paths, then bounce across the starry holes!",
  terrainThemeId: "springstep-hollow",
  weaponStyle: "star-sword",
  enemyStyle: "blueberry-slime",
  enemyStylesByPower: { 8: "pebble-golem" },
  cageStyle: "moon-silver",
  introducedMechanics: [
    "required-backtracking",
    "mixed-hazards",
    "spring-boots",
    "ground-holes",
    "power-chain",
    "perfect-rescue-challenge",
  ],
  map: [
    "###################",
    "#...#...oo.......q#",
    "#.#.#.#######.#####",
    "#.#b#.#E....#.....#",
    "#.###8#####.#####.#",
    "#.#...#..^^.#..~~~#",
    "#.#.###.#####.###.#",
    "#.#...#...#u..#.#.#",
    "#.###.###B#.###.#.#",
    "#.........#.#.#...#",
    "#.#########.#.#.###",
    "#h#@..#...#.#.#...#",
    "#####.#.#.#.#.###.#",
    "#s....#.#.4.#...#.#",
    "#.#####.#####.#.#.#",
    "#.#p....#.....#j#.#",
    "#.###.###.#.#####.#",
    "#...1.#d..#.......#",
    "###################",
  ],
});

export const LANTERNLIGHT_LABYRINTH_LEVEL = parseAsciiLevel({
  id: "lanternlight-labyrinth",
  name: "Lanternlight Labyrinth",
  objective: "Explore to find the star. Rescue little friends if you can!",
  terrainThemeId: "lantern-ruins",
  weaponStyle: "flower-sabre",
  enemyStyle: "moon-bat",
  enemyStylesByPower: {
    2: "blueberry-slime",
    5: "mushroom-imp",
    7: "goblin",
    9: "pebble-golem",
  },
  cageStyle: "golden-heart",
  introducedMechanics: [
    "large-maze",
    "exploration-map",
    "fog-of-war",
    "all-mechanics",
    "spring-boots",
    "ground-holes",
    "required-backtracking",
    "perfect-rescue-challenge",
  ],
  map: [
    "#########################",
    "#E9.#.........#.........#",
    "###.#.#####.#.#.#######.#",
    "#j#o#.#...#.#...#...#...#",
    "#.#o#.#.#.#.#####.#.#.###",
    "#...#w#.#.#.p.#u#.#...#y#",
    "#.#####.#.###.#.#.#####.#",
    "#.......#.....#.#.#...#.#",
    "###############.#.#.#.#.#",
    "#..p#....r#.....#.Y.#...#",
    "#.###.#.###.#.#########.#",
    "#.....#...#.#.#.........#",
    "#.#######.#.#.#.#########",
    "#.......#.#.#.#.....#...#",
    "#######.#.#.#.#####.#.#.#",
    "#s#...2.#.#.#.~~..#...#.#",
    "#.#.#####R#.#####.#####.#",
    "#......d#...#...5.#.7...#",
    "#.###########.#####.#####",
    "#...#......^^.#...#.....#",
    "###.#.#.#######.#.#####.#",
    "#@#.#.#h#.....#.#.#...#.#",
    "#.#.#.###.###.#.#.#.#.#.#",
    "#...#......b#.B.#...#...#",
    "#########################",
  ],
});

export const CURATED_LEVELS: readonly LevelDefinition[] = [
  MOVEMENT_LEVEL,
  SWORD_AND_KEY_LEVEL,
  SPLASHY_BOOTS_LEVEL,
  RAINBOW_PICNIC_LEVEL,
  TOASTY_TOES_LEVEL,
  MOONBEAM_MOAT_LEVEL,
  WISHING_WOODS_LEVEL,
  AMES_GRAND_PARADE_LEVEL,
  SPRINGSTEP_SKY_HOLLOW_LEVEL,
  LANTERNLIGHT_LABYRINTH_LEVEL,
];

export function getCuratedLevel(id: string): LevelDefinition | undefined {
  return CURATED_LEVELS.find((level) => level.id === id);
}
