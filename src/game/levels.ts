import type {
  AnimalSpecies,
  CageStyle,
  EnemyStyle,
  KeyColor,
  LevelDefinition,
  LevelObject,
  LevelSource,
  Point,
  PortalPairId,
  TerrainThemeId,
  TerrainKind,
  LightDirection,
  WeaponStyle,
} from "./types";
import { gameplayFingerprint } from "./contentIdentity";

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
  readonly enemyTokens?: Readonly<Record<string, { readonly power: number; readonly style?: EnemyStyle }>>;
  readonly cageStyle?: CageStyle;
  readonly lightDirection?: LightDirection;
  readonly introducedMechanics?: readonly string[];
  readonly contentRevision?: number;
  /** Explicit semantic IDs by `x,y`; recommended for repeated same-kind objects. */
  readonly objectIds?: Readonly<Record<string, string>>;
}

type WithoutId<T> = T extends { readonly id: string } ? Omit<T, "id"> : never;
type LevelObjectInput = WithoutId<LevelObject>;

function semanticObjectBase(levelId: string, object: LevelObjectInput | LevelObject): string {
  const qualifier = object.kind === "enemy" ? `power-${object.power}`
    : object.kind === "potion" ? `plus-${object.amount}`
      : object.kind === "key" || object.kind === "door" ? object.color
        : object.kind === "animal" ? object.species
          : object.kind === "portal" ? object.pair
            : object.kind === "treasure" ? `${object.currency}-plus-${object.amount}`
              : "main";
  return `${levelId}-${object.kind}-${qualifier}`;
}

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

const PORTAL_PAIRS: Readonly<Record<string, PortalPairId>> = {
  H: "rose-heart",
  C: "mint-clover",
  M: "violet-moon",
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
  e: "otter",
  g: "lamb",
  m: "capybara",
  z: "chinchilla",
  t: "alpaca",
  P: "penguin",
  K: "koala",
};

/**
 * Friends intentionally placed in the hand-authored 16-maze campaign today.
 * Plan 09 owns the authored introduction curve for the expanded friend roster.
 */
export const AUTHORED_CAMPAIGN_ANIMAL_SPECIES = Object.freeze(
  [...new Set(Object.values(ANIMAL_SPECIES))],
) as readonly AnimalSpecies[];

/**
 * Parses the compact authoring format used by the tutorial levels and tests.
 * Interactive characters always sit on ordinary floor terrain. Lowercase `o`
 * authors a ground hole, `%` authors poison, `j` places spring boots, and `l`
 * places the antidote leaf that makes poison safe to cross. `H`, `C`, and `M`
 * author matching Rose Heart, Mint Clover, and Violet Moon portal pairs.
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

  const addObject = (object: LevelObjectInput): void => {
    const explicitId = options.objectIds?.[`${object.at.x},${object.at.y}`];
    objects.push({
      ...object,
      id: explicitId ?? semanticObjectBase(options.id, object),
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

      if (
        character === "~" ||
        character === "^" ||
        character === "%" ||
        character === "o"
      ) {
        terrainRow.push(
          character === "~"
            ? "water"
            : character === "^"
              ? "lava"
              : character === "%"
                ? "poison"
                : "hole",
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

      const tokenEnemy = options.enemyTokens?.[character];
      if (tokenEnemy !== undefined) {
        addObject({
          kind: "enemy",
          at,
          power: tokenEnemy.power,
          ...(tokenEnemy.style === undefined ? {} : { style: tokenEnemy.style }),
        });
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

      if (character === "l") {
        addObject({ kind: "antidote-leaf", at });
        continue;
      }

      if (character === "p") {
        addObject({ kind: "potion", at, amount: options.potionAmount ?? 2 });
        continue;
      }

      if (character === "k") {
        addObject({ kind: "treasure", at, currency: "gold", amount: 3, style: "gold-bag" });
        continue;
      }

      if (character === "x") {
        addObject({ kind: "treasure", at, currency: "gold", amount: 8, style: "gold-chest" });
        continue;
      }

      if (character === "i") {
        addObject({ kind: "treasure", at, currency: "science", amount: 2, style: "science-gears" });
        continue;
      }

      if (character === "v") {
        addObject({ kind: "treasure", at, currency: "science", amount: 4, style: "science-beaker" });
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

      const portalPair = PORTAL_PAIRS[character];
      if (portalPair !== undefined) {
        addObject({ kind: "portal", at, pair: portalPair });
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

  const objectsByCoordinate = new Map<string, LevelObject>(objects.map((object) => [
    `${object.at.x},${object.at.y}`,
    object,
  ] as const));
  for (const [coordinate, explicitId] of Object.entries(options.objectIds ?? {})) {
    const mappedObject = objectsByCoordinate.get(coordinate);
    if (!mappedObject) {
      throw new Error(`Level "${options.id}" maps object id "${explicitId}" to empty coordinate ${coordinate}.`);
    }
    if (
      explicitId.length === 0
      || explicitId !== explicitId.trim()
      || !explicitId.startsWith(`${options.id}-${mappedObject.kind}-`)
    ) {
      throw new Error(`Object id "${explicitId}" at ${coordinate} does not match its ${mappedObject.kind} role.`);
    }
  }
  const objectsByBase = new Map<string, LevelObject[]>();
  for (const object of objects) {
    const base = semanticObjectBase(options.id, object);
    objectsByBase.set(base, [...(objectsByBase.get(base) ?? []), object]);
  }
  for (const [base, matchingObjects] of objectsByBase) {
    if (matchingObjects.length <= 1) continue;
    for (const object of matchingObjects) {
      const coordinate = `${object.at.x},${object.at.y}`;
      if (options.objectIds?.[coordinate] === undefined) {
        throw new Error(`Repeated authored role "${base}" needs an explicit semantic id at ${coordinate}.`);
      }
    }
  }
  const objectIds = objects.map((object) => object.id);
  if (new Set(objectIds).size !== objectIds.length) {
    throw new Error(`Level "${options.id}" contains duplicate semantic object ids.`);
  }

  const contentRevision = options.contentRevision ?? 1;
  if (!Number.isSafeInteger(contentRevision) || contentRevision < 1) {
    throw new Error(`Level "${options.id}" needs a positive integer content revision.`);
  }
  const identityInput = {
    contentRevision,
    width,
    height,
    initialPower: options.initialPower ?? 2,
    start,
    exit,
    terrain,
    objects,
  };
  return {
    schemaVersion: 1,
    contentRevision,
    gameplayFingerprint: gameplayFingerprint(identityInput),
    id: options.id,
    name: options.name,
    objective: options.objective,
    source: options.source ?? "curated",
    seed: options.seed,
    width,
    height,
    initialPower: identityInput.initialPower,
    start,
    exit,
    terrain,
    objects,
    terrainThemeId: options.terrainThemeId,
    lightDirection: options.lightDirection,
    introducedMechanics: options.introducedMechanics,
  };
}

type AuthoredAsciiLevelOptions = AsciiLevelOptions & { readonly contentRevision: number };

function parseAuthoredLevel(options: AuthoredAsciiLevelOptions): LevelDefinition {
  return parseAsciiLevel(options);
}

export const MOVEMENT_LEVEL = parseAuthoredLevel({
  contentRevision: 2,
  id: "little-star-trail",
  name: "Little Star Trail",
  objective: "Follow the paths to the star!",
  terrainThemeId: "sunny-stone",
  weaponStyle: "star-sword",
  enemyStyle: "goblin",
  cageStyle: "golden-heart",
  introducedMechanics: ["movement", "exit", "animal-rescue"],
  map: [
    "######",
    "#...E#",
    "#.##.#",
    "#....#",
    "#@c.s#",
    "######",
  ],
});

export const SWORD_AND_KEY_LEVEL = parseAuthoredLevel({
  contentRevision: 2,
  id: "shiny-sword",
  name: "Shiny Sword",
  objective: "Find the sword and Rose Heart Key!",
  terrainThemeId: "rose-courtyard",
  weaponStyle: "comet-spear",
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
    "#.....#..@#",
    "###########",
  ],
});

export const SPLASHY_BOOTS_LEVEL = parseAuthoredLevel({
  contentRevision: 2,
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

export const TOASTY_TOES_LEVEL = parseAuthoredLevel({
  contentRevision: 2,
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

export const RAINBOW_PICNIC_LEVEL = parseAuthoredLevel({
  contentRevision: 2,
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

export const MOONBEAM_MOAT_LEVEL = parseAuthoredLevel({
  contentRevision: 2,
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

export const WISHING_WOODS_LEVEL = parseAuthoredLevel({
  contentRevision: 2,
  id: "wishing-woods",
  objectIds: {
    "9,1": "wishing-woods-enemy-north-watch",
    "15,8": "wishing-woods-enemy-kitten-guardian",
  },
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

export const AMES_GRAND_PARADE_LEVEL = parseAuthoredLevel({
  contentRevision: 2,
  id: "ames-grand-parade",
  objectIds: {
    "11,9": "ames-grand-parade-potion-north-garden",
    "11,13": "ames-grand-parade-potion-south-garden",
  },
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

export const SPRINGSTEP_SKY_HOLLOW_LEVEL = parseAuthoredLevel({
  contentRevision: 2,
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
    "#...#...oo........#",
    "#.#.#.#######.#####",
    "#.#b#.#E....#.....#",
    "#.###8####q.#####.#",
    "#.#...#..^^.#..~~~#",
    "#.#.###.#####.###.#",
    "#.#...#...#u..#.#.#",
    "#.###.###B#.###.#.#",
    "#.........o.#.#...#",
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

export const LANTERNLIGHT_LABYRINTH_LEVEL = parseAuthoredLevel({
  contentRevision: 2,
  id: "lanternlight-labyrinth",
  objectIds: {
    "2,1": "lanternlight-labyrinth-enemy-entry-imp",
    "5,13": "lanternlight-labyrinth-enemy-return-imp",
  },
  name: "Lanternlight Labyrinth",
  objective: "Explore to find the star. Rescue little friends if you can!",
  terrainThemeId: "lantern-ruins",
  weaponStyle: "flower-sabre",
  enemyStyle: "moon-bat",
  enemyStylesByPower: {
    1: "blueberry-slime",
    2: "blueberry-slime",
    4: "acorn-knight",
    6: "goblin",
    8: "moon-bat",
    5: "mushroom-imp",
    7: "goblin",
    9: "pebble-golem",
  },
  enemyTokens: {
    t: { power: 10, style: "pebble-golem" },
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
    "room-layout",
    "treasure-room",
    "monster-room",
    "come-back-stronger",
    "crossroad-jump",
  ],
  map: [
    "#######################",
    "#~1....E..#.....#.....#",
    "#~###..##.#.###.###.#.#",
    "#.....xt.v#k........#.#",
    "#.###.n.oe#f..#######.#",
    "#Y#y#.....#.....#...#.#",
    "#.#.#######.###.###.#.#",
    "#.....#.......#...#...#",
    "#####.#######.###.#####",
    "#.oo.8#..u#.....#.....#",
    "#.#####^#.###.#######.#",
    "#..j..^^#..4#.#.......#",
    "###########.###.#####.#",
    "#s...1...6......#...#.#",
    "#.#####.#..i#####.#.#.#",
    "#....@#.....#.....#...#",
    "#########.###.#########",
    "#.........#...#...#...#",
    "#.###.#####.###.#.#.#.#",
    "#.#.......#.#...#.#p#.#",
    "#.#.#####.#.#.###.###.#",
    "#.......#.....#.......#",
    "#######################",
  ],
});

export const TWILIGHT_TREASURE_LOOP_LEVEL = parseAuthoredLevel({
  contentRevision: 2,
  id: "twilight-treasure-loop",
  name: "Twilight Treasure Loop",
  objective: "Search the side trails for every tool, then unlock the twilight star!",
  terrainThemeId: "pearl-grotto",
  weaponStyle: "bubble-ring-blade",
  enemyStyle: "mushroom-imp",
  enemyStylesByPower: {
    4: "clockwork-crab",
    6: "candy-mimic",
    9: "pebble-golem",
  },
  cageStyle: "garden-vine",
  potionAmount: 3,
  introducedMechanics: [
    "large-maze",
    "exploration-map",
    "three-key-colors",
    "power-chain",
    "spring-boots",
    "ground-holes",
    "required-backtracking",
    "off-route-prerequisites",
    "optional-miniboss-rescue",
    "four-friend-challenge",
    "three-hole-jump",
  ],
  map: [
    "#####################",
    "#.#..k..#...#zy9.x..#",
    "#.###.#.#.#.#######.#",
    "#..i..#...#.....#...#",
    "###############.#.#.#",
    "#@#.......#..u#.#.#.#",
    "#.#.#.###.#.###.#.###",
    "#.#R#.#...#.#...#...#",
    "#.#.#.#.###.#.#####.#",
    "#.#.#.#.....#^#..6Y.#",
    "#.#.#4#####.#^#.###.#",
    "#.#.#...#...#E#.#bp.#",
    "#.#.###.#####.#.###.#",
    "#.#...#.....#B#...#o#",
    "#.###.#####.#.###.#o#",
    "#...#.....#.#.....#o#",
    "#.#.#####.#.#######.#",
    "#.#..g#..v#.~~#.....#",
    "#s#2###.#####.#.#####",
    "#q#.......rf#......j#",
    "#####################",
  ],
});

export const MOONLIT_FRIENDSHIP_QUEST_LEVEL = parseAuthoredLevel({
  contentRevision: 2,
  id: "moonlit-friendship-quest",
  objectIds: {
    "21,1": "moonlit-friendship-quest-potion-north-vial",
    "21,21": "moonlit-friendship-quest-potion-south-vial",
  },
  name: "Moonlit Friendship Quest",
  objective: "Remember every turning and gather the three keys for five moonlit friends!",
  terrainThemeId: "moonbeam-castle",
  weaponStyle: "moon-wand",
  enemyStyle: "moon-bat",
  enemyStylesByPower: {
    2: "jelly-sorcerer",
    4: "mushroom-imp",
    7: "goblin",
    8: "bubble-dragon",
    9: "pebble-golem",
  },
  cageStyle: "moon-silver",
  potionAmount: 3,
  introducedMechanics: [
    "large-maze",
    "exploration-map",
    "fog-of-war",
    "three-key-colors",
    "long-power-chain",
    "spring-boots",
    "ground-holes",
    "poison",
    "antidote-leaf",
    "required-backtracking",
    "off-route-prerequisites",
    "miniboss-key-guardian",
    "five-friend-challenge",
  ],
  map: [
    "#######################",
    "#E.k#.......#...x...#p#",
    "###.#####.#.#####.#.#.#",
    "#.#...#...#.......#.#.#",
    "#.###.#.###########.#.#",
    "#.rP#...........#.#.#.#",
    "#.#######.#.###.#.#.#.#",
    "#...i...#.#...#...#.#.#",
    "#.#####.#Y###.###.#.#.#",
    "#....2#.#B#K#..8#.#...#",
    "#####.#.#.#y###.#####.#",
    "#..v..#.#.#...#.....#.#",
    "#.#####.#.###9###.#.#.#",
    "#..s#R..#...#...#.#.#.#",
    "#.###.#####.###.#.###.#",
    "#.#...#..~#.....#.#^^.#",
    "#.#.#l#.#~#####.#.#.###",
    "#.#.#f#.#.....#.#.#7..#",
    "#.#.###.###.#j#o#.###.#",
    "#.#..4#%#h#.#d#o#.....#",
    "#.###.#%#u#.###.#######",
    "#..@#.....#.........bp#",
    "#######################",
  ],
});

export const ROSE_HEART_ROUNDABOUT_LEVEL = parseAuthoredLevel({
  contentRevision: 2,
  id: "rose-heart-roundabout",
  objectIds: {
    "9,3": "rose-heart-roundabout-portal-east-garden",
    "4,9": "rose-heart-roundabout-portal-west-garden",
  },
  name: "Rose Heart Roundabout",
  objective: "Ride the matching flower portals and bring the Rose Heart Key home!",
  terrainThemeId: "rose-courtyard",
  weaponStyle: "flower-sabre",
  enemyStyle: "goblin",
  cageStyle: "storybook-wood",
  introducedMechanics: [
    "paired-flower-portals",
    "portal-tutorial",
    "required-return-trip",
    "off-route-prerequisites",
  ],
  map: [
    "#############",
    "#ER...#.....#",
    "###.#.#.###.#",
    "#.....#..H..#",
    "#.###.#.###.#",
    "#...q.#..r..#",
    "###.#.#.#.###",
    "#...#.#.#...#",
    "#.###.#.###.#",
    "#@..H.#..cf.#",
    "#.....#..s1.#",
    "#..i..#.....#",
    "#############",
  ],
});

export const CLOVER_COMEBACK_CARNIVAL_LEVEL = parseAuthoredLevel({
  contentRevision: 2,
  id: "clover-comeback-carnival",
  objectIds: {
    "15,1": "clover-comeback-carnival-portal-mint-north",
    "3,7": "clover-comeback-carnival-portal-rose-west",
    "9,7": "clover-comeback-carnival-portal-rose-east",
    "1,9": "clover-comeback-carnival-portal-violet-west",
    "9,9": "clover-comeback-carnival-portal-mint-centre",
    "9,11": "clover-comeback-carnival-portal-violet-south",
  },
  name: "Clover Comeback Carnival",
  objective: "Explore every portal garden, then come back strong enough for the Moon Golem!",
  terrainThemeId: "springstep-hollow",
  weaponStyle: "star-sword",
  enemyStyle: "blueberry-slime",
  enemyStylesByPower: {
    4: "mushroom-imp",
    7: "moon-bat",
    9: "pebble-golem",
  },
  cageStyle: "golden-heart",
  potionAmount: 3,
  introducedMechanics: [
    "paired-flower-portals",
    "portal-relay",
    "come-back-stronger",
    "optional-miniboss-rescue",
    "spring-boots",
    "ground-holes",
    "required-backtracking",
    "four-friend-challenge",
  ],
  map: [
    "#################",
    "#@......#s..#..C#",
    "#######.###.#.###",
    "#q#...#.#j..#...#",
    "#.#.#.#.#.###.#.#",
    "#...#.#.#p..#4#2#",
    "#.###.#.###.###.#",
    "#..H#...#H......#",
    "#################",
    "#M..k...#C..#.9b#",
    "#######.###.#.###",
    "#..i..#.#M#o#...#",
    "#.###.#.#.#o###.#",
    "#...#..f#.#.#...#",
    "###.#####.#.#.#B#",
    "#c7....d#.....#E#",
    "#################",
  ],
});

export const FRIENDSHIP_CROWN_VAULT_LEVEL = parseAuthoredLevel({
  contentRevision: 3,
  id: "friendship-crown-vault",
  objectIds: {
    "6,1": "friendship-crown-vault-portal-rose-west",
    "9,1": "friendship-crown-vault-portal-rose-east",
    "14,7": "friendship-crown-vault-portal-mint-north",
    "6,9": "friendship-crown-vault-portal-violet-west",
    "9,9": "friendship-crown-vault-portal-violet-east",
    "15,9": "friendship-crown-vault-portal-mint-south",
  },
  name: "Friendship Crown Vault",
  objective: "Link all three portal flowers and unlock the friendship crown!",
  terrainThemeId: "moonbeam-castle",
  weaponStyle: "moon-wand",
  enemyStyle: "moon-bat",
  enemyStylesByPower: {
    2: "cloud-gremlin",
    4: "pumpkin-sprite",
    7: "goblin",
    9: "pebble-golem",
  },
  cageStyle: "moon-silver",
  potionAmount: 3,
  introducedMechanics: [
    "large-maze",
    "exploration-map",
    "fog-of-war",
    "paired-flower-portals",
    "three-portal-relay",
    "three-key-colors",
    "all-traversal-tools",
    "mixed-hazards",
    "spring-boots",
    "ground-holes",
    "required-backtracking",
    "optional-power-route",
    "five-friend-challenge",
  ],
  map: [
    "#################",
    "#@.s..H.#H...~.r#",
    "#.###...#..u.~..#",
    "#...t...#....~..#",
    "#.###...#....~..#",
    "#2......#....~d.#",
    "#..m....#....~..#",
    "#......y#....~C.#",
    "#################",
    "#EYBR.M.#M.bo.jC#",
    "#..###l.#...o...#",
    "#f.%#...#...o.h.#",
    "#..%#...#...o..4#",
    "#..%#...#...o...#",
    "#..%#...#...o...#",
    "#..%#...#...o...#",
    "#################",
  ],
});

export const RAINBOW_POWER_PARADE_LEVEL = parseAuthoredLevel({
  contentRevision: 2,
  id: "rainbow-power-parade",
  name: "Rainbow Power Parade",
  objective: "Build Power 99, bring home the Sunny Key, and return for the Rainbow Guardian!",
  terrainThemeId: "harvest-bramble",
  weaponStyle: "cupcake-mace",
  enemyStyle: "goblin",
  cageStyle: "garden-vine",
  potionAmount: 5,
  lightDirection: "left",
  enemyTokens: {
    K: { power: 12, style: "mushroom-imp" },
    L: { power: 20, style: "moon-bat" },
    N: { power: 40, style: "pebble-golem" },
    O: { power: 14, style: "blueberry-slime" },
    Z: { power: 99, style: "pebble-golem" },
  },
  introducedMechanics: [
    "large-maze",
    "exploration-map",
    "power-99",
    "rainbow-power",
    "boss-rescue",
    "come-back-stronger",
    "required-backtracking",
    "required-return-trip",
    "gold-star-treasures",
    "science-collectibles",
    "five-friend-challenge",
  ],
  map: [
    "#################",
    "#EYZ###.#..q....#",
    "###.###.#.#####.#",
    "#h....#.#.......#",
    "#.....s.2.......#",
    "#.###x..#...###.#",
    "#...c...#..p....#",
    "#@......#.......#",
    "####O#######4####",
    "#.......#.......#",
    "#.#####.#..K....#",
    "#.#yN...#....d..#",
    "#.......L.......#",
    "#..f....#.......#",
    "#.###...#...###.#",
    "#.......#.......#",
    "#################",
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
  TWILIGHT_TREASURE_LOOP_LEVEL,
  MOONLIT_FRIENDSHIP_QUEST_LEVEL,
  ROSE_HEART_ROUNDABOUT_LEVEL,
  CLOVER_COMEBACK_CARNIVAL_LEVEL,
  FRIENDSHIP_CROWN_VAULT_LEVEL,
  RAINBOW_POWER_PARADE_LEVEL,
];

export function getCuratedLevel(id: string): LevelDefinition | undefined {
  return CURATED_LEVELS.find((level) => level.id === id);
}
