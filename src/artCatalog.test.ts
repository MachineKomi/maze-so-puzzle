import { describe, expect, it } from "vitest";
import {
  ACHIEVEMENT_ART,
  ADDITIONAL_FRIEND_ART,
  AME_ART,
  ANIMAL_ART,
  CAGE_ART,
  DEFAULT_ANIMAL_SPECIES,
  DEFAULT_CAGE_STYLE,
  DEFAULT_ENEMY_STYLE,
  DEFAULT_KEY_COLOR,
  DEFAULT_TERRAIN_THEME_ID,
  DEFAULT_WEAPON_STYLE,
  DOOR_ART,
  ENEMY_ART,
  FRONT_DOOR_ART,
  FLOORS,
  FUTURE_ENEMY_ART,
  FUTURE_FRIEND_ART,
  FUTURE_HAZARD_ART,
  FUTURE_ITEM_ART,
  FUTURE_PORTAL_ART,
  GOAL_ART,
  MGJRPG02_ART,
  MIMIC_ART,
  NAVIGATION_ART,
  HAZARD_ART,
  KEY_ART,
  KEY_COLOR_LABELS,
  KEY_MOTIF_LABELS,
  LOCK_PAIR_ART,
  MIN_TERRAIN_LIGHTNESS_DELTA,
  PORTAL_ART,
  PICKUP_ART,
  STORY_ART,
  TERRAIN_DRESSING_ART,
  TERRAIN_THEMES,
  TREASURE_CATALOG_ART,
  WALLS,
  WEAPON_ART,
  areTerrainColorsCompatible,
  areTerrainTexturesCompatible,
  resolveAnimalArt,
  resolveCageArt,
  resolveDoorArt,
  resolveEnemyArt,
  resolveKeyArt,
  resolveLockPairArt,
  resolvePortalArt,
  resolveTerrainTheme,
  resolveWeaponArt,
  type ArtReference,
  type SpriteArt,
} from "./artCatalog";
import {
  ANIMAL_SPECIES,
  CAGE_STYLE_IDS,
  ENEMY_STYLE_IDS,
  PORTAL_PAIR_IDS,
  TERRAIN_THEME_IDS,
  WEAPON_STYLE_IDS,
} from "./game/types";

const KEY_COLORS = ["red", "blue", "yellow"] as const;

function sorted(values: readonly string[]): readonly string[] {
  return [...values].sort((first, second) => first.localeCompare(second));
}

function expectArtReferences(entries: readonly ArtReference[]): void {
  for (const entry of entries) {
    expect(entry.src).toMatch(/^\/assets\/(?:[a-z0-9-]+\/)*[a-z0-9-]+\.(?:png|webp)$/);
    expect(entry.label.trim().length).toBeGreaterThan(0);
  }
  expect(new Set(entries.map((entry) => entry.src)).size).toBe(entries.length);
}

function expectRichSpriteArt(entry: SpriteArt): void {
  expect(entry.id).toMatch(/^[a-z0-9-]+$/);
  expect(entry.artVersion).toBeGreaterThan(0);
  expect(entry.recipeVersion).toMatch(/^[a-z0-9-]+$/);
  expect(entry.sourceRecordId).toMatch(/^[a-z0-9-]+$/);
  expect(entry.runtimeStatus).toBe("active");
  expect(entry.alphaMode).toBe("straight");
  expect(entry.variants).toHaveLength(1);
  expect(entry.variants[0]?.src).toBe(entry.src);
  expect(entry.variants[0]?.width).toBeGreaterThan(0);
  expect(entry.variants[0]?.height).toBeGreaterThan(0);

  const [pivotX, pivotY] = entry.geometry.pivot;
  const [x, y, width, height] = entry.geometry.visibleBounds;
  const normalized = [pivotX, pivotY, x, y, width, height, ...entry.geometry.safeInset];
  expect(normalized.every((value) => value >= 0 && value <= 1)).toBe(true);
  expect(x + width).toBeLessThanOrEqual(1);
  expect(y + height).toBeLessThanOrEqual(1);
}

describe("art catalog", () => {
  it("exhaustively covers every canonical style and species ID", () => {
    expect(sorted(Object.keys(TERRAIN_THEMES))).toEqual(sorted(TERRAIN_THEME_IDS));
    expect(sorted(Object.keys(WEAPON_ART))).toEqual(sorted(WEAPON_STYLE_IDS));
    expect(sorted(Object.keys(ENEMY_ART))).toEqual(sorted(ENEMY_STYLE_IDS));
    expect(sorted(Object.keys(ANIMAL_ART))).toEqual(sorted(ANIMAL_SPECIES));
    expect(sorted(Object.keys(CAGE_ART))).toEqual(sorted(CAGE_STYLE_IDS));
    expect(sorted(Object.keys(KEY_ART))).toEqual(sorted(KEY_COLORS));
    expect(sorted(Object.keys(DOOR_ART))).toEqual(sorted(KEY_COLORS));
    expect(sorted(Object.keys(LOCK_PAIR_ART))).toEqual(sorted(KEY_COLORS));
    expect(sorted(Object.keys(KEY_COLOR_LABELS))).toEqual(sorted(KEY_COLORS));
    expect(sorted(Object.keys(KEY_MOTIF_LABELS))).toEqual(sorted(KEY_COLORS));
    expect(sorted(Object.keys(PORTAL_ART))).toEqual(sorted(PORTAL_PAIR_IDS));
  });

  it("provides a unique labelled sprite for every gameplay variant", () => {
    expectArtReferences(Object.values(WEAPON_ART));
    expectArtReferences(Object.values(ENEMY_ART));
    expectArtReferences(Object.values(ANIMAL_ART));
    expectArtReferences(Object.values(CAGE_ART));
    expectArtReferences(Object.values(KEY_ART));
    expectArtReferences(Object.values(DOOR_ART));
    expectArtReferences(Object.values(TERRAIN_DRESSING_ART));
    for (const dressing of Object.values(TERRAIN_DRESSING_ART)) {
      expect(dressing.periodTiles).toBeGreaterThanOrEqual(10);
      expect(dressing.opacity).toBeGreaterThan(0);
      expect(dressing.opacity).toBeLessThanOrEqual(0.2);
    }
  });

  it("uses the complete transparent front-cage layer for every rescue style", () => {
    for (const cage of Object.values(CAGE_ART)) {
      expect(cage.src).toMatch(/^\/assets\/mgjrpg-02\/cages\/[a-z0-9-]+-v\d+-structure-field-256-r01\.webp$/);
    }
  });

  it("pairs each lock color with dedicated matching key and door art", () => {
    const projections = {
      red: {
        color: KEY_COLOR_LABELS.red,
        motif: KEY_MOTIF_LABELS.red,
        key: { src: KEY_ART.red.src, label: KEY_ART.red.label },
        door: { src: DOOR_ART.red.src, label: DOOR_ART.red.label },
      },
      blue: {
        color: KEY_COLOR_LABELS.blue,
        motif: KEY_MOTIF_LABELS.blue,
        key: { src: KEY_ART.blue.src, label: KEY_ART.blue.label },
        door: { src: DOOR_ART.blue.src, label: DOOR_ART.blue.label },
      },
      yellow: {
        color: KEY_COLOR_LABELS.yellow,
        motif: KEY_MOTIF_LABELS.yellow,
        key: { src: KEY_ART.yellow.src, label: KEY_ART.yellow.label },
        door: { src: DOOR_ART.yellow.src, label: DOOR_ART.yellow.label },
      },
    };
    expect(projections).toEqual({
      red: {
        color: "Rose",
        motif: "Heart",
        key: { src: MGJRPG02_ART["key-rose-heart"].src, label: "Rose Heart Key" },
        door: { src: MGJRPG02_ART["door-rose-heart"].src, label: "Rose Heart Door" },
      },
      blue: {
        color: "Blue",
        motif: "Star",
        key: { src: MGJRPG02_ART["key-blue-star"].src, label: "Blue Star Key" },
        door: { src: MGJRPG02_ART["door-blue-star"].src, label: "Blue Star Door" },
      },
      yellow: {
        color: "Sunny",
        motif: "Sun",
        key: { src: MGJRPG02_ART["key-sunny-sun"].src, label: "Sunny Sun Key" },
        door: { src: MGJRPG02_ART["door-sunny-sun"].src, label: "Sunny Sun Door" },
      },
    });

    for (const color of KEY_COLORS) {
      const pair = LOCK_PAIR_ART[color];
      expect(KEY_ART[color]).toBe(pair.key);
      expect(DOOR_ART[color]).toBe(pair.door);
      expect(KEY_COLOR_LABELS[color]).toBe(pair.colorLabel);
      expect(KEY_MOTIF_LABELS[color]).toBe(pair.motifLabel);
    }
  });

  it("records measured geometry for current Ame and every lock-pair cutout", () => {
    const richArt = [
      AME_ART,
      ...KEY_COLORS.flatMap((color) => [KEY_ART[color], DOOR_ART[color]]),
    ];
    for (const art of richArt) expectRichSpriteArt(art);
    expect(new Set(richArt.map((art) => art.id)).size).toBe(richArt.length);

    expect(AME_ART).toMatchObject({
      id: "ame",
      artVersion: 2,
      src: MGJRPG02_ART.ame.src,
      geometry: {
        class: "grounded-actor",
        pivot: [0.5, 0.9],
        visibleBounds: MGJRPG02_ART.ame.geometry.visibleBounds,
        faceBox: [0.39, 0.19, 0.25, 0.2],
        gripPoint: [0.66, 0.58],
        forwardAxisDegrees: 0,
      },
    });
    expect(KEY_ART.red.geometry.visibleBounds)
      .toEqual(MGJRPG02_ART["key-rose-heart"].geometry.visibleBounds);
    expect(KEY_ART.blue.geometry.visibleBounds)
      .toEqual(MGJRPG02_ART["key-blue-star"].geometry.visibleBounds);
    expect(KEY_ART.yellow.geometry.visibleBounds)
      .toEqual(MGJRPG02_ART["key-sunny-sun"].geometry.visibleBounds);
    expect(DOOR_ART.red.geometry.visibleBounds)
      .toEqual(MGJRPG02_ART["door-rose-heart"].geometry.visibleBounds);
    expect(DOOR_ART.blue.geometry.visibleBounds)
      .toEqual(MGJRPG02_ART["door-blue-star"].geometry.visibleBounds);
    expect(DOOR_ART.yellow.geometry.visibleBounds)
      .toEqual(MGJRPG02_ART["door-sunny-sun"].geometry.visibleBounds);
    expect(KEY_ART.red.geometry.visualCenter)
      .toEqual(MGJRPG02_ART["key-rose-heart"].geometry.visualCenter);
    expect(KEY_ART.blue.geometry.visualCenter)
      .toEqual(MGJRPG02_ART["key-blue-star"].geometry.visualCenter);
    expect(KEY_ART.yellow.geometry.visualCenter)
      .toEqual(MGJRPG02_ART["key-sunny-sun"].geometry.visualCenter);
    expect(DOOR_ART.red.geometry.baseline)
      .toEqual(MGJRPG02_ART["door-rose-heart"].geometry.baseline);
    expect(DOOR_ART.blue.geometry.baseline)
      .toEqual(MGJRPG02_ART["door-blue-star"].geometry.baseline);
    expect(DOOR_ART.yellow.geometry.baseline)
      .toEqual(MGJRPG02_ART["door-sunny-sun"].geometry.baseline);
    expect(DOOR_ART.red.geometry.motifBox)
      .toEqual(MGJRPG02_ART["door-rose-heart"].geometry.motifBox);
    expect(DOOR_ART.blue.geometry.motifBox)
      .toEqual(MGJRPG02_ART["door-blue-star"].geometry.motifBox);
    expect(DOOR_ART.yellow.geometry.motifBox)
      .toEqual(MGJRPG02_ART["door-sunny-sun"].geometry.motifBox);
  });

  it("gives every traversal hazard a static non-colour accessibility cue", () => {
    expect(sorted(Object.keys(HAZARD_ART))).toEqual(["hole", "lava", "poison", "water"]);
    expect(new Set(Object.values(HAZARD_ART).map((hazard) => hazard.patternCue)).size).toBe(4);

    for (const hazard of Object.values(HAZARD_ART)) {
      expect(hazard.src).toMatch(/^\/assets\/mgjrpg-02\/hazards\/[a-z0-9-]+\.webp$/);
      expect(hazard.fallbackColor).toMatch(/^#[0-9a-f]{6}$/i);
      expect(hazard.visualLightness).toBeGreaterThanOrEqual(0);
      expect(hazard.visualLightness).toBeLessThanOrEqual(100);
      expect(hazard.reducedMotionCue.trim().length).toBeGreaterThan(0);
      expect(hazard.runtimeStatus).toBe("active");
    }
    expect(HAZARD_ART.water.periodTiles).toBe(4.6);
    expect(HAZARD_ART.lava.periodTiles).toBe(4.6);
    expect(HAZARD_ART.poison.periodTiles).toBe(4.2);
    expect(HAZARD_ART.hole.periodTiles).toBeNull();
  });

  it("provides calibrated pattern metadata for every readable theme", () => {
    const color = /^#[0-9a-f]{6}$/i;
    const textureSources = new Set<string>();

    for (const id of TERRAIN_THEME_IDS) {
      const theme = TERRAIN_THEMES[id];
      expect(theme.id).toBe(id);
      expect(theme.label.trim().length).toBeGreaterThan(0);

      for (const texture of [theme.floor, theme.wall]) {
        expect(texture.src).toMatch(/^\/assets\/mgjrpg-02\/terrain\/[a-z0-9-]+\.webp$/);
        expect(texture.label.trim().length).toBeGreaterThan(0);
        expect(texture.periodTiles).toBeGreaterThanOrEqual(3);
        expect(texture.periodTiles).toBeLessThanOrEqual(4.5);
        expect(texture.fallbackColor).toMatch(color);
        expect(texture.dominantColor).toMatch(/^(gold|rose|blue|green|earth|violet|sage|indigo)$/);
        expect(texture.visualLightness).toBeGreaterThanOrEqual(0);
        expect(texture.visualLightness).toBeLessThanOrEqual(100);
        textureSources.add(texture.src);
      }

      for (const treatment of [theme.floorTreatment, theme.wallTreatment]) {
        expect(treatment.brightness).toBeGreaterThanOrEqual(0.9);
        expect(treatment.brightness).toBeLessThanOrEqual(1.15);
        expect(treatment.saturation).toBeGreaterThanOrEqual(0.9);
        expect(treatment.saturation).toBeLessThanOrEqual(1.15);
        expect(treatment.contrast).toBeGreaterThanOrEqual(0.9);
        expect(treatment.contrast).toBeLessThanOrEqual(1.1);
      }

      // Theme-specific rendering must never recreate the old blanket wall
      // darkening that crushed already-dark stone and hedge textures.
      expect(theme.wallTreatment.brightness).toBeGreaterThanOrEqual(0.98);

      expect(areTerrainTexturesCompatible(theme.floor, theme.wall), theme.label).toBe(true);
      expect(
        theme.floor.visualLightness - theme.wall.visualLightness,
        `${theme.label} should keep its path visibly lighter than its walls.`,
      ).toBeGreaterThanOrEqual(MIN_TERRAIN_LIGHTNESS_DELTA);
    }

    expect(new Set(TERRAIN_THEME_IDS.map((id) => TERRAIN_THEMES[id].floor.src)).size).toBe(7);
    const activeWalls = new Set<string>(
      TERRAIN_THEME_IDS.map((id) => TERRAIN_THEMES[id].wall.src),
    );
    expect(activeWalls.size).toBe(6);
    expect(activeWalls.has(MGJRPG02_ART["wall-golden-sandstone"].src)).toBe(false);
    expect(new Set(TERRAIN_THEME_IDS.map((id) => {
      const theme = TERRAIN_THEMES[id];
      return `${theme.floor.src}|${theme.wall.src}`;
    })).size).toBe(TERRAIN_THEME_IDS.length);
    expect(textureSources.size).toBe(13);
  });

  it("gently lifts dark-dungeon walls instead of crushing their detail", () => {
    for (const theme of Object.values(TERRAIN_THEMES)) {
      if (theme.wall.src !== MGJRPG02_ART["wall-dark-dungeon"].src) continue;
      expect(theme.wallTreatment.brightness).toBeGreaterThanOrEqual(1.1);
      expect(theme.wallTreatment.contrast).toBeLessThanOrEqual(1);
    }
  });

  it("rejects yellow with green or pink in either floor/wall direction", () => {
    expect(areTerrainColorsCompatible("gold", "green")).toBe(false);
    expect(areTerrainColorsCompatible("gold", "sage")).toBe(false);
    expect(areTerrainColorsCompatible("green", "gold")).toBe(false);
    expect(areTerrainColorsCompatible("sage", "gold")).toBe(false);
    expect(areTerrainColorsCompatible("gold", "rose")).toBe(false);
    expect(areTerrainColorsCompatible("rose", "gold")).toBe(false);
  });

  it("replaces the reported bright pink/yellow pair with gentle readable palettes", () => {
    expect(TERRAIN_THEMES["rose-courtyard"]).toMatchObject({
      floor: { dominantColor: "rose" },
      wall: { dominantColor: "sage" },
    });
    expect(TERRAIN_THEMES["moonlit-moat"]).toMatchObject({
      floor: { dominantColor: "blue" },
      wall: { dominantColor: "green" },
    });
  });

  it("resolves every valid ID to its stable catalog entry object", () => {
    for (const id of TERRAIN_THEME_IDS) expect(resolveTerrainTheme(id)).toBe(TERRAIN_THEMES[id]);
    for (const id of WEAPON_STYLE_IDS) expect(resolveWeaponArt(id)).toBe(WEAPON_ART[id]);
    for (const id of ENEMY_STYLE_IDS) expect(resolveEnemyArt(id)).toBe(ENEMY_ART[id]);
    for (const id of ANIMAL_SPECIES) expect(resolveAnimalArt(id)).toBe(ANIMAL_ART[id]);
    for (const id of CAGE_STYLE_IDS) expect(resolveCageArt(id)).toBe(CAGE_ART[id]);
    for (const color of KEY_COLORS) {
      expect(resolveKeyArt(color)).toBe(KEY_ART[color]);
      expect(resolveDoorArt(color)).toBe(DOOR_ART[color]);
      expect(resolveLockPairArt(color)).toBe(LOCK_PAIR_ART[color]);
    }
    for (const pair of PORTAL_PAIR_IDS) expect(resolvePortalArt(pair)).toBe(PORTAL_ART[pair]);
  });

  it("activates additional friends while keeping later mechanics catalogued and dormant", () => {
    const dormantEntries = [
      ...Object.values(FUTURE_ENEMY_ART),
      ...Object.values(FUTURE_PORTAL_ART),
      ...Object.values(FUTURE_ITEM_ART),
      ...Object.values(FUTURE_HAZARD_ART),
      MIMIC_ART["classic-mimic"].revealed,
      MIMIC_ART["classic-mimic"].closed,
      MIMIC_ART["classic-mimic"]["good-open"],
      MIMIC_ART["candy-mimic"].closed,
      MIMIC_ART["candy-mimic"]["good-open"],
      WALLS.sandstone,
    ];

    expect(Object.values(ADDITIONAL_FRIEND_ART)).toHaveLength(17);
    expect(Object.values(ADDITIONAL_FRIEND_ART).every((entry) => entry.runtimeStatus === "active")).toBe(true);
    expect(dormantEntries).toHaveLength(27);
    expect(dormantEntries.every((entry) => entry.runtimeStatus === "dormant")).toBe(true);
    expect(ADDITIONAL_FRIEND_ART["green-tea-skeleton"].family).toBe("friend");
    expect(Object.hasOwn(FUTURE_ENEMY_ART, "green-tea-skeleton")).toBe(false);
    expect(Object.hasOwn(ANIMAL_ART, "green-tea-skeleton")).toBe(true);
    expect(Object.hasOwn(ENEMY_ART, "classic-slime")).toBe(false);
    expect(Object.hasOwn(PORTAL_ART, "sunny-diamond")).toBe(false);
    expect(PICKUP_ART.boots).toBe(MGJRPG02_ART["splash-boots"]);
    expect(Object.hasOwn(FUTURE_ITEM_ART, "normal-boots")).toBe(false);
    expect(MIMIC_ART["candy-mimic"].revealed).toBe(ENEMY_ART["candy-mimic"]);
    expect(FUTURE_ENEMY_ART.succubus.label).toBe("Public label pending");
    expect(FUTURE_ENEMY_ART.cultist.label).toBe("Public label pending");
  });

  it("publishes one complete active navigation and achievement family", () => {
    expect(Object.keys(NAVIGATION_ART)).toEqual([
      "nav-home", "nav-mazes", "nav-book", "nav-help", "nav-sound", "nav-muted", "nav-restart",
    ]);
    expect(Object.values(NAVIGATION_ART).every((entry) => entry.runtimeStatus === "active")).toBe(true);
    expect(Object.values(NAVIGATION_ART).map((entry) => entry.artVersion)).toEqual([4, 5, 3, 3, 4, 3, 3]);
    expect(new Set(Object.values(NAVIGATION_ART).map((entry) => entry.src)).size).toBe(7);
    expect(Object.values(ACHIEVEMENT_ART)).toHaveLength(15);
    expect(Object.values(ACHIEVEMENT_ART).every((entry) => entry.runtimeStatus === "active")).toBe(true);
    expect(new Set(Object.values(ACHIEVEMENT_ART).map((entry) => entry.src)).size).toBe(15);
  });

  it("publishes the approved layered front door through active semantic entries", () => {
    expect(FRONT_DOOR_ART.titleEnvironment.runtimeStatus).toBe("active");
    expect(FRONT_DOOR_ART.titleEnvironment.loadingPhase).toBe("title-critical");
    expect(FRONT_DOOR_ART.titleEnvironment.fallbackSrc).toBe("/assets/title-background-v1.webp");
    expect(FRONT_DOOR_ART.homeHeroSplash.runtimeStatus).toBe("active");
    expect(FRONT_DOOR_ART.gameLogo.default.runtimeStatus).toBe("active");
    expect(FRONT_DOOR_ART.gameLogo.compact.runtimeStatus).toBe("active");
    expect(FRONT_DOOR_ART.gameLogo.default.fallbackText).toBe("Maze so Puzzle");
    expect(FRONT_DOOR_ART.appIconAme.runtimeStatus).toBe("active");
  });

  it("projects every generated Plan 03 derivative through one semantic catalogue", () => {
    const catalogued = [
      AME_ART,
      ...Object.values(STORY_ART),
      ...Object.values(FLOORS),
      ...Object.values(WALLS),
      ...Object.values(TERRAIN_DRESSING_ART),
      ...Object.values(HAZARD_ART),
      ...Object.values(FUTURE_HAZARD_ART),
      ...Object.values(ANIMAL_ART),
      ...Object.values(FUTURE_FRIEND_ART),
      ...Object.values(ENEMY_ART).filter((entry) => entry !== ENEMY_ART.goblin),
      ...Object.values(FUTURE_ENEMY_ART),
      ...Object.values(WEAPON_ART),
      ...Object.values(CAGE_ART),
      ...Object.values(KEY_ART),
      ...Object.values(DOOR_ART),
      ...Object.values(PORTAL_ART).filter((entry) => entry !== PORTAL_ART["violet-moon"]),
      ...Object.values(FUTURE_PORTAL_ART),
      GOAL_ART,
      ...Object.values(PICKUP_ART),
      ...Object.values(TREASURE_CATALOG_ART),
      ...Object.values(FUTURE_ITEM_ART),
      MIMIC_ART["classic-mimic"].revealed,
      MIMIC_ART["classic-mimic"].closed,
      MIMIC_ART["classic-mimic"]["good-open"],
      MIMIC_ART["candy-mimic"].closed,
      MIMIC_ART["candy-mimic"]["good-open"],
      ...Object.values(NAVIGATION_ART),
      ...Object.values(ACHIEVEMENT_ART),
      FRONT_DOOR_ART.titleEnvironment,
      FRONT_DOOR_ART.homeHeroSplash,
      FRONT_DOOR_ART.gameLogo.default,
      FRONT_DOOR_ART.gameLogo.compact,
      FRONT_DOOR_ART.appIconAme,
    ];
    const catalogueSources = new Set(catalogued.map((entry) => entry.src));
    const generatedSources = new Set(Object.values(MGJRPG02_ART).map((entry) => entry.src));
    const generatedEntries = Object.values(MGJRPG02_ART);

    expect(MGJRPG02_ART).toHaveProperty("ame");
    expect(generatedSources.size).toBe(151);
    expect(generatedEntries.filter((entry) => entry.runtimeStatus === "active")).toHaveLength(124);
    expect(generatedEntries.filter((entry) => entry.runtimeStatus === "dormant")).toHaveLength(27);
    expect(catalogueSources).toEqual(generatedSources);
  });

  it("uses stable defaults for absent, legacy, and untrusted IDs", () => {
    expect(resolveTerrainTheme(undefined)).toBe(TERRAIN_THEMES[DEFAULT_TERRAIN_THEME_ID]);
    expect(resolveTerrainTheme("not-a-theme")).toBe(TERRAIN_THEMES[DEFAULT_TERRAIN_THEME_ID]);
    expect(resolveWeaponArt(null)).toBe(WEAPON_ART[DEFAULT_WEAPON_STYLE]);
    expect(resolveWeaponArt("not-a-weapon")).toBe(WEAPON_ART[DEFAULT_WEAPON_STYLE]);
    expect(resolveWeaponArt("bubble-bow")).toBe(WEAPON_ART["bubble-ring-blade"]);
    expect(resolveEnemyArt(undefined)).toBe(ENEMY_ART[DEFAULT_ENEMY_STYLE]);
    expect(resolveEnemyArt("not-an-enemy")).toBe(ENEMY_ART[DEFAULT_ENEMY_STYLE]);
    expect(resolveAnimalArt(undefined)).toBe(ANIMAL_ART[DEFAULT_ANIMAL_SPECIES]);
    expect(resolveAnimalArt("not-an-animal")).toBe(ANIMAL_ART[DEFAULT_ANIMAL_SPECIES]);
    expect(resolveCageArt(null)).toBe(CAGE_ART[DEFAULT_CAGE_STYLE]);
    expect(resolveCageArt("not-a-cage")).toBe(CAGE_ART[DEFAULT_CAGE_STYLE]);
    expect(resolveKeyArt(undefined)).toBe(KEY_ART[DEFAULT_KEY_COLOR]);
    expect(resolveKeyArt("not-a-key-color")).toBe(KEY_ART[DEFAULT_KEY_COLOR]);
    expect(resolveDoorArt(null)).toBe(DOOR_ART[DEFAULT_KEY_COLOR]);
    expect(resolveDoorArt("not-a-door-color")).toBe(DOOR_ART[DEFAULT_KEY_COLOR]);
    expect(resolveLockPairArt(undefined)).toBe(LOCK_PAIR_ART[DEFAULT_KEY_COLOR]);
    expect(resolveLockPairArt("not-a-lock-color")).toBe(LOCK_PAIR_ART[DEFAULT_KEY_COLOR]);
    expect(resolvePortalArt("not-a-portal")).toBe(PORTAL_ART["rose-heart"]);
  });
});
