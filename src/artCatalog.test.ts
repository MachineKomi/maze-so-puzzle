import { describe, expect, it } from "vitest";
import {
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
  KEY_ART,
  KEY_COLOR_LABELS,
  KEY_MOTIF_LABELS,
  MIN_TERRAIN_LIGHTNESS_DELTA,
  PORTAL_ART,
  TERRAIN_DRESSING_ART,
  TERRAIN_THEMES,
  WEAPON_ART,
  areTerrainColorsCompatible,
  areTerrainTexturesCompatible,
  resolveAnimalArt,
  resolveCageArt,
  resolveDoorArt,
  resolveEnemyArt,
  resolveKeyArt,
  resolvePortalArt,
  resolveTerrainTheme,
  resolveWeaponArt,
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

function expectSpriteArt(entries: readonly SpriteArt[]): void {
  for (const entry of entries) {
    expect(entry.src).toMatch(/^\/assets\/[a-z0-9-]+\.png$/);
    expect(entry.label.trim().length).toBeGreaterThan(0);
  }
  expect(new Set(entries.map((entry) => entry.src)).size).toBe(entries.length);
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
    expect(sorted(Object.keys(KEY_COLOR_LABELS))).toEqual(sorted(KEY_COLORS));
    expect(sorted(Object.keys(KEY_MOTIF_LABELS))).toEqual(sorted(KEY_COLORS));
    expect(sorted(Object.keys(PORTAL_ART))).toEqual(sorted(PORTAL_PAIR_IDS));
  });

  it("provides a unique labelled sprite for every gameplay variant", () => {
    expectSpriteArt(Object.values(WEAPON_ART));
    expectSpriteArt(Object.values(ENEMY_ART));
    expectSpriteArt(Object.values(ANIMAL_ART));
    expectSpriteArt(Object.values(CAGE_ART));
    expectSpriteArt(Object.values(KEY_ART));
    expectSpriteArt(Object.values(DOOR_ART));
    expectSpriteArt(Object.values(TERRAIN_DRESSING_ART));
    for (const dressing of Object.values(TERRAIN_DRESSING_ART)) {
      expect(dressing.periodTiles).toBeGreaterThanOrEqual(10);
      expect(dressing.opacity).toBeGreaterThan(0);
      expect(dressing.opacity).toBeLessThanOrEqual(0.2);
    }
  });

  it("uses the opaque front-bar cage layer for every rescue style", () => {
    for (const cage of Object.values(CAGE_ART)) {
      expect(cage.src).toMatch(/^\/assets\/cage-[a-z-]+-front-v4\.png$/);
    }
  });

  it("pairs each lock color with dedicated matching key and door art", () => {
    expect({
      red: {
        color: KEY_COLOR_LABELS.red,
        motif: KEY_MOTIF_LABELS.red,
        key: KEY_ART.red,
        door: DOOR_ART.red,
      },
      blue: {
        color: KEY_COLOR_LABELS.blue,
        motif: KEY_MOTIF_LABELS.blue,
        key: KEY_ART.blue,
        door: DOOR_ART.blue,
      },
      yellow: {
        color: KEY_COLOR_LABELS.yellow,
        motif: KEY_MOTIF_LABELS.yellow,
        key: KEY_ART.yellow,
        door: DOOR_ART.yellow,
      },
    }).toEqual({
      red: {
        color: "Rose",
        motif: "Heart",
        key: { src: "/assets/key-rose-heart-v1.png", label: "Rose Heart Key" },
        door: { src: "/assets/door-rose-heart-v1.png", label: "Rose Heart Door" },
      },
      blue: {
        color: "Blue",
        motif: "Star",
        key: { src: "/assets/star-key.png", label: "Blue Star Key" },
        door: { src: "/assets/star-door.png", label: "Blue Star Door" },
      },
      yellow: {
        color: "Sunny",
        motif: "Sun",
        key: { src: "/assets/key-sunny-sun-v1.png", label: "Sunny Sun Key" },
        door: { src: "/assets/door-sunny-sun-v1.png", label: "Sunny Sun Door" },
      },
    });
  });

  it("provides calibrated pattern metadata for every readable theme", () => {
    const color = /^#[0-9a-f]{6}$/i;
    const textureSources = new Set<string>();

    for (const id of TERRAIN_THEME_IDS) {
      const theme = TERRAIN_THEMES[id];
      expect(theme.id).toBe(id);
      expect(theme.label.trim().length).toBeGreaterThan(0);

      for (const texture of [theme.floor, theme.wall]) {
        expect(texture.src).toMatch(/^\/assets\/[a-z0-9-]+\.png$/);
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

    expect(new Set(TERRAIN_THEME_IDS.map((id) => TERRAIN_THEMES[id].floor.src)).size).toBe(5);
    const activeWalls = new Set<string>(
      TERRAIN_THEME_IDS.map((id) => TERRAIN_THEMES[id].wall.src),
    );
    expect(activeWalls.size).toBe(4);
    expect(activeWalls.has("/assets/wall-sandstone-v1.png")).toBe(false);
    expect(new Set(TERRAIN_THEME_IDS.map((id) => {
      const theme = TERRAIN_THEMES[id];
      return `${theme.floor.src}|${theme.wall.src}`;
    })).size).toBe(TERRAIN_THEME_IDS.length);
    expect(textureSources.size).toBe(9);
  });

  it("gently lifts dark-dungeon walls instead of crushing their detail", () => {
    for (const theme of Object.values(TERRAIN_THEMES)) {
      if (theme.wall.src !== "/assets/wall-dark-dungeon-v1.png") continue;
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
    }
    for (const pair of PORTAL_PAIR_IDS) expect(resolvePortalArt(pair)).toBe(PORTAL_ART[pair]);
  });

  it("uses stable defaults for absent, legacy, and untrusted IDs", () => {
    expect(resolveTerrainTheme(undefined)).toBe(TERRAIN_THEMES[DEFAULT_TERRAIN_THEME_ID]);
    expect(resolveTerrainTheme("not-a-theme")).toBe(TERRAIN_THEMES[DEFAULT_TERRAIN_THEME_ID]);
    expect(resolveWeaponArt(null)).toBe(WEAPON_ART[DEFAULT_WEAPON_STYLE]);
    expect(resolveWeaponArt("not-a-weapon")).toBe(WEAPON_ART[DEFAULT_WEAPON_STYLE]);
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
    expect(resolvePortalArt("not-a-portal")).toBe(PORTAL_ART["rose-heart"]);
  });
});
