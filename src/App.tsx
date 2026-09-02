import {
  memo,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  ASSETS,
  BADGE_ART,
  MEDAL_ART,
  STICKER_ART,
  TREASURE_ART,
  preloadAchievementArt,
  preloadLevelArt,
  preloadRewardArt,
} from "./assets";
import {
  KEY_COLOR_LABELS,
  KEY_MOTIF_LABELS,
  resolveAnimalArt,
  resolveCageArt,
  resolveDoorArt,
  resolveEnemyArt,
  resolveKeyArt,
  resolvePortalArt,
  resolveTerrainTheme,
  resolveWeaponArt,
  type TerrainRenderTreatment,
} from "./artCatalog";
import {
  createInitialGameState,
  getObjectAt,
  getTerrainAt,
  isObjectResolved,
  movePlayer,
  pointsEqual,
} from "./game/engine";
import { generateSurpriseMaze, type MazeDifficulty } from "./game/generator";
import { CURATED_LEVELS } from "./game/levels";
import { createRoundedTerrainPath } from "./game/terrainGeometry";
import {
  DEFAULT_FOV_SIZE,
  getCameraWindow,
  getVisibleTileKeys,
  revealVisibleTiles,
  shouldUseExplorationView,
  toTileKey,
  type CameraWindow,
  type TileKey,
} from "./game/exploration";
import { getVisibleFollowerPoints, recordFollowerStep } from "./game/followerTrail";
import { animalPersonality, enemyPersonality } from "./game/visualPersonality";
import {
  ANIMAL_SPECIES,
  DIRECTION_DELTAS,
  type AnimalSpecies,
  type Direction,
  type GameEvent,
  type GameState,
  type KeyColor,
  type LevelDefinition,
  type LevelObject,
  type Point,
} from "./game/types";
import {
  ACHIEVEMENT_LABELS,
  BADGE_IDS,
  BADGE_LABELS,
  STICKER_LABELS,
  applyLevelCompletion,
  calculateLevelReward,
  readPlayerProgress,
  writePlayerProgress,
  type BadgeId,
  type CalculatedLevelReward,
  type PlayerProgress,
  type RescueMedalId,
  type StickerId,
} from "./progress";
import { playSound, type SoundName } from "./sound";
import {
  calculateStageScale,
  LOGICAL_STAGE_HEIGHT,
  LOGICAL_STAGE_WIDTH,
} from "./stageScale";
import {
  MUSIC_TRACKS,
  configureMusic,
  createMazeMusicPicker,
  createMusicRunSeed,
  disposeMusic,
  setMusicMuted,
  setMusicPageHidden,
  startMusicFromUserGesture,
} from "./music";
import { getNextStoryIndex, shouldConfirmMazeSwitch } from "./navigation";
import { getStoryRescueRecordDisplay } from "./rescueRecords";
import { cameraWorldStyle, worldLayerStyle } from "./cameraMotion";
import { getJumpPresentationMotion } from "./jumpPresentation";
import { resetAllGameProgress } from "./resetProgress";
import { clearActiveRun, readActiveRun, writeActiveRun } from "./session";
import {
  normalizedBoardPoint,
  pointerIntentFromTileOffset,
  resolvePointerMoveDirection,
  type PointerIntent,
} from "./pointerControls";
import {
  HELD_MOVE_INITIAL_DELAY_MS,
  IDLE_HELD_MOVE_CADENCE,
  advanceHeldMoveCadence,
  beginHeldMoveCadence,
  type HeldMoveCadence,
} from "./movementControls";
import {
  createCombatVictoryPlan,
  type CombatPresentationCueKind,
} from "./combatPresentation";
import {
  shouldDismissStoryForKey,
  storyForLevel,
  type StoryLore,
  type StorySpeaker,
} from "./story";

const DIRECTION_ICONS: Record<Direction, string> = {
  up: "▲",
  down: "▼",
  left: "◀",
  right: "▶",
};

const COLOR_LABELS: Readonly<Record<KeyColor, string>> = KEY_COLOR_LABELS;

function lockPairLabel(color: KeyColor): string {
  return `${COLOR_LABELS[color]} ${KEY_MOTIF_LABELS[color]}`;
}

const ANIMAL_LABELS: Record<AnimalSpecies, string> = {
  bunny: "Bunny",
  fox: "Fox",
  kitten: "Kitten",
  puppy: "Puppy",
  duckling: "Duckling",
  hedgehog: "Hedgehog",
  fawn: "Fawn",
  "red-panda": "Red panda",
  otter: "Otter",
  lamb: "Lamb",
  capybara: "Capybara",
  chinchilla: "Chinchilla",
  alpaca: "Alpaca",
  penguin: "Penguin",
  koala: "Koala",
};

const STORY_SPEAKER_LABELS: Readonly<Record<StorySpeaker, string>> = {
  ame: "Ame",
  poggle: "Professor Poggle",
  sprig: "Sprig",
};

function storySpeakerArt(speaker: StorySpeaker): string {
  if (speaker === "poggle") return ASSETS.storyProfessorPoggle;
  if (speaker === "sprig") return ASSETS.storySprig;
  return ASSETS.portrait;
}

const MOVE_CADENCE_MS = 64;
const BUMP_CADENCE_MS = 45;
const RESCUE_PRESENTATION_MS = 900;
const PORTAL_PRESENTATION_MS = 720;
const REDUCED_PRESENTATION_MS = 140;
const BUILD_VERSION = "0.17.0";
const DEBUG_MAZE_QUERY = "mazes";

const COMBAT_CUE_SOUNDS: Readonly<Record<CombatPresentationCueKind, SoundName>> = {
  clash: "combatClash",
  sparks: "combatSparks",
  impact: "combatImpact",
  "power-start": "combatPowerUp",
  "power-tick": "powerTick",
  victory: "combatVictory",
};

interface Feedback {
  readonly icon: string;
  readonly text: string;
  readonly tone: "plain" | "good" | "careful";
  readonly sound: SoundName;
}

interface MapPickupToast {
  readonly id: number;
  readonly icon: string;
  readonly text: string;
}

interface CompletionCelebration {
  readonly reward: CalculatedLevelReward;
  readonly newStickerIds: readonly StickerId[];
  readonly newMedalIds: readonly RescueMedalId[];
  readonly newBadgeIds: readonly BadgeId[];
  readonly rescuedSpecies: readonly AnimalSpecies[];
  readonly totalGold: number;
  readonly bonusGold: number;
  readonly sciencePoints: number;
  readonly testerRun: boolean;
}

type AppScreen = "title" | "game" | "achievements";
type RunMode = "normal" | "tester";

interface PendingAdventure {
  readonly level: LevelDefinition;
  readonly sound: "select" | "title";
}

interface PointerPoint {
  readonly x: number;
  readonly y: number;
}

interface ActiveBoardPointer {
  readonly pointerId: number;
  readonly pointerType: string;
  readonly origin: PointerPoint;
  readonly boardLeft: number;
  readonly boardTop: number;
  readonly boardWidth: number;
  readonly boardHeight: number;
  current: PointerPoint;
  direction: Direction | null;
}

interface TouchCursor {
  readonly origin: PointerPoint;
  readonly current: PointerPoint;
  readonly direction: Direction | null;
}

interface QueuedMoveIntent {
  readonly direction: Direction;
  readonly lateralOffset: number;
}

interface BattlePresentation {
  readonly objectId: string;
  readonly enemySrc: string;
  readonly enemyPower: number;
  readonly from: Point;
  readonly at: Point;
  readonly direction: Direction;
  readonly powerBefore: number;
  readonly powerAfter: number;
  readonly durationMs: number;
  readonly clashCount: number;
}

interface TooStrongEncounter {
  readonly event: Extract<GameEvent, { type: "enemy-too-strong" }>;
  readonly enemySrc: string;
  readonly enemyLabel: string;
}

interface BlockerHint {
  readonly key: string;
  readonly count: number;
  readonly itemId: string;
  readonly itemName: string;
  readonly itemSrc: string;
  readonly message: string;
}

interface RescuePresentation {
  readonly objectId: string;
  readonly species: AnimalSpecies;
  readonly at: Point;
  readonly cageSrc: string;
}

interface JumpPresentation {
  readonly from: Point;
  readonly to: Point;
  readonly holeCount: number;
  readonly durationMs: number;
  readonly apexPercent: number;
  readonly descentPercent: number;
}

interface PortalPresentation {
  readonly pair: Extract<LevelObject, { kind: "portal" }>["pair"];
  readonly from: Point;
  readonly to: Point;
}

interface TreasurePresentation {
  readonly id: number;
  readonly currency: "gold" | "science";
  readonly amount: number;
  readonly at: Point;
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function feedbackFor(events: readonly GameEvent[], level: LevelDefinition): Feedback {
  const event = [...events].reverse().find((item) => item.type !== "moved") ?? events[0];
  if (!event) return { icon: ASSETS.navMazes, text: "Move one square.", tone: "plain", sound: "step" };

  switch (event.type) {
    case "level-won":
      return { icon: ASSETS.goal, text: "Maze solved!", tone: "good", sound: "win" };
    case "enemy-too-strong":
      return {
        icon: ASSETS.potion,
        text: `That ${enemyLabelForEvent(level, event.objectId).toLowerCase()} is too strong just now.`,
        tone: "careful",
        sound: "bump",
      };
    case "enemy-defeated": {
      const enemyLabel = enemyLabelForEvent(level, event.objectId);
      return {
        icon: ASSETS.potion,
        text: `${enemyLabel} scooted away! ${event.powerBefore} + ${event.enemyPower} = ${event.powerAfter}`,
        tone: "good",
        sound: "power",
      };
    }
    case "potion-collected":
      return {
        icon: ASSETS.potion,
        text: `Power potion! ${event.powerBefore} + ${event.amount} = ${event.powerAfter}`,
        tone: "good",
        sound: "power",
      };
    case "animal-rescued":
      return {
        icon: resolveAnimalArt(event.species).src,
        text: `${ANIMAL_LABELS[event.species]} is free! What a lovely friend!`,
        tone: "good",
        sound: "rescue",
      };
    case "sword-collected": {
      const object = level.objects.find((candidate) => candidate.id === event.objectId);
      const weapon = resolveWeaponArt(object?.kind === "sword" ? object.style : undefined);
      return { icon: weapon.src, text: `${weapon.label} found!`, tone: "good", sound: "pickup" };
    }
    case "boots-collected":
      return { icon: ASSETS.boots, text: "Splashy boots found!", tone: "good", sound: "pickup" };
    case "spring-boots-collected":
      return { icon: ASSETS.springBoots, text: "Spring boots found! Boing!", tone: "good", sound: "pickup" };
    case "antidote-leaf-collected":
      return { icon: ASSETS.antidoteLeaf, text: "Antidote leaf found! Purple poison is safe now.", tone: "good", sound: "pickup" };
    case "hole-jumped": {
      const distanceLabel = event.over.length === 1
        ? "one hole"
        : `${event.over.length} holes`;
      return { icon: ASSETS.springBoots, text: `Boing! A lovely jump over ${distanceLabel}!`, tone: "good", sound: "jump" };
    }
    case "portal-warped":
      return {
        icon: resolvePortalArt(event.pair).src,
        text: `Whoosh! The ${resolvePortalArt(event.pair).label} found its twin!`,
        tone: "good",
        sound: "portal",
      };
    case "treasure-collected":
      return event.currency === "gold"
        ? { icon: ASSETS.treasureGoldChest, text: `Found ${event.amount} Gold Stars!`, tone: "good", sound: "treasure" }
        : { icon: ASSETS.treasureScienceGears, text: `Found ${event.amount} Science Points!`, tone: "good", sound: "science" };
    case "key-collected":
      return {
        icon: resolveKeyArt(event.color).src,
        text: `${lockPairLabel(event.color)} Key found!`,
        tone: "good",
        sound: "pickup",
      };
    case "door-opened":
      return { icon: resolveDoorArt(event.color).src, text: `The ${lockPairLabel(event.color)} Door opened!`, tone: "good", sound: "unlock" };
    case "blocked":
      switch (event.reason) {
        case "needs-sword":
          return { icon: ASSETS.sword, text: "Find the maze weapon first!", tone: "careful", sound: "bump" };
        case "needs-boots":
          return {
            icon: ASSETS.boots,
            text: event.terrain === "lava" ? "Boots make lava safe!" : "Boots keep toes dry!",
            tone: "careful",
            sound: "bump",
          };
        case "needs-spring-boots":
          return { icon: ASSETS.springBoots, text: "Find spring boots to hop across!", tone: "careful", sound: "bump" };
        case "needs-antidote-leaf":
          return { icon: ASSETS.antidoteLeaf, text: "Find the antidote leaf before crossing purple poison!", tone: "careful", sound: "bump" };
        case "needs-key":
          return {
            icon: event.color ? resolveKeyArt(event.color).src : ASSETS.key,
            text: `Find the ${event.color ? lockPairLabel(event.color) : "matching"} Key!`,
            tone: "careful",
            sound: "bump",
          };
        case "wall":
        case "out-of-bounds":
          return { icon: ASSETS.navMazes, text: "Boop! A wall.", tone: "plain", sound: "bump" };
        case "game-over":
          return { icon: ASSETS.navHelp, text: "Choose a button below.", tone: "plain", sound: "bump" };
      }
    case "moved":
      return { icon: ASSETS.navMazes, text: "One step closer!", tone: "plain", sound: "step" };
  }
}

function pickupToastFor(
  events: readonly GameEvent[],
  level: LevelDefinition,
): Omit<MapPickupToast, "id"> | null {
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const event = events[index]!;
    switch (event.type) {
      case "sword-collected": {
        const object = level.objects.find((candidate) => candidate.id === event.objectId);
        const weapon = resolveWeaponArt(object?.kind === "sword" ? object.style : undefined);
        return { icon: weapon.src, text: `Picked up the ${weapon.label}!` };
      }
      case "boots-collected":
        return { icon: ASSETS.boots, text: "Picked up the Splash Boots!" };
      case "spring-boots-collected":
        return { icon: ASSETS.springBoots, text: "Picked up the Spring Boots!" };
      case "antidote-leaf-collected":
        return { icon: ASSETS.antidoteLeaf, text: "Picked up the Antidote Leaf!" };
      case "potion-collected":
        return { icon: ASSETS.potion, text: `Picked up a Power Potion! +${event.amount} Power` };
      case "key-collected":
        return { icon: resolveKeyArt(event.color).src, text: `Picked up the ${resolveKeyArt(event.color).label}!` };
      case "treasure-collected":
        return event.currency === "gold"
          ? { icon: ASSETS.treasureGoldChest, text: `Collected ${event.amount} Gold Stars!` }
          : { icon: ASSETS.treasureScienceGears, text: `Collected ${event.amount} Science Points!` };
      default:
        break;
    }
  }
  return null;
}

function enemyLabelForEvent(level: LevelDefinition, objectId: string): string {
  const object = level.objects.find((candidate) => candidate.id === objectId);
  return resolveEnemyArt(object?.kind === "enemy" ? object.style : undefined).label;
}

function keyFor(point: Point): string {
  return `${point.x},${point.y}`;
}

function targetFor(state: GameState, direction: Direction): Point {
  const delta = DIRECTION_DELTAS[direction];
  return { x: state.position.x + delta.x, y: state.position.y + delta.y };
}

function describeObject(object: LevelObject): string {
  switch (object.kind) {
    case "enemy": return `${resolveEnemyArt(object.style).label.toLowerCase()} with Power ${object.power}`;
    case "sword": return resolveWeaponArt(object.style).label.toLowerCase();
    case "boots": return "protective boots";
    case "spring-boots": return "spring boots";
    case "antidote-leaf": return "antidote leaf";
    case "potion": return `Power potion worth ${object.amount}`;
    case "key": return resolveKeyArt(object.color).label.toLowerCase();
    case "door": return `${resolveDoorArt(object.color).label.toLowerCase()}, locked`;
    case "animal": return `caged ${ANIMAL_LABELS[object.species].toLowerCase()}`;
    case "portal": return `${resolvePortalArt(object.pair).label.toLowerCase()} magic flower`;
    case "treasure": return object.currency === "gold"
      ? `${object.amount} bonus Gold Stars`
      : `${object.amount} Science Points`;
  }
}

function describeMazePosition(level: LevelDefinition, state: GameState): string {
  const nearby = (["up", "right", "down", "left"] as const).map((direction) => {
    const target = targetFor(state, direction);
    const label = `${direction[0]?.toUpperCase()}${direction.slice(1)}`;
    const terrain = getTerrainAt(level, target);
    if (!terrain || terrain === "wall") return `${label}: wall`;
    if (pointsEqual(target, level.exit)) return `${label}: sparkling exit`;
    const object = getObjectAt(level, target);
    if (object && !isObjectResolved(object, state)) return `${label}: ${describeObject(object)}`;
    if (terrain === "water") return `${label}: water`;
    if (terrain === "lava") return `${label}: warm magical lava`;
    if (terrain === "poison") return `${label}: purple magical poison`;
    if (terrain === "hole") return `${label}: a hole to jump over`;
    return `${label}: open path`;
  });
  return `Ame is at column ${state.position.x + 1}, row ${state.position.y + 1}. ${nearby.join(". ")}.`;
}

function previewKind(level: LevelDefinition, state: GameState, direction: Direction): "go" | "stop" | "danger" {
  const target = targetFor(state, direction);
  const terrain = getTerrainAt(level, target);
  if (!terrain || terrain === "wall") return "stop";
  if ((terrain === "water" || terrain === "lava") && !state.hasBoots) return "stop";
  if (terrain === "poison" && !state.hasAntidoteLeaf) return "stop";
  if (terrain === "hole" && !state.hasSpringBoots) return "stop";
  const object = getObjectAt(level, target);
  if (!object || isObjectResolved(object, state)) return "go";
  if (object.kind === "door" && !state.keys.includes(object.color)) return "stop";
  if (object.kind === "enemy") {
    if (!state.hasSword) return "stop";
    if (state.power < object.power) return "danger";
  }
  return "go";
}

function animalArt(species: AnimalSpecies): string {
  return resolveAnimalArt(species).src;
}

function spriteFor(object: Exclude<LevelObject, { kind: "animal" }>): string {
  switch (object.kind) {
    case "enemy": return resolveEnemyArt(object.style).src;
    case "sword": return resolveWeaponArt(object.style).src;
    case "boots": return ASSETS.boots;
    case "spring-boots": return ASSETS.springBoots;
    case "antidote-leaf": return ASSETS.antidoteLeaf;
    case "potion": return ASSETS.potion;
    case "key": return resolveKeyArt(object.color).src;
    case "door": return resolveDoorArt(object.color).src;
    case "portal": return resolvePortalArt(object.pair).src;
    case "treasure": return TREASURE_ART[object.style];
  }
}

function blockerHintFor(
  level: LevelDefinition,
  state: GameState,
  event: Extract<GameEvent, { type: "blocked" }>,
  count: number,
): BlockerHint | null {
  let object: LevelObject | undefined;
  let action = "continue";
  if (event.reason === "needs-sword") {
    object = level.objects.find((candidate) => candidate.kind === "sword" && !isObjectResolved(candidate, state));
    action = "challenge this friend";
  } else if (event.reason === "needs-boots") {
    object = level.objects.find((candidate) => candidate.kind === "boots" && !isObjectResolved(candidate, state));
    action = event.terrain === "lava" ? "cross the warm lava" : "cross the water";
  } else if (event.reason === "needs-spring-boots") {
    object = level.objects.find((candidate) => candidate.kind === "spring-boots" && !isObjectResolved(candidate, state));
    action = "hop over the hole";
  } else if (event.reason === "needs-antidote-leaf") {
    object = level.objects.find((candidate) => candidate.kind === "antidote-leaf" && !isObjectResolved(candidate, state));
    action = "cross the purple poison";
  } else if (event.reason === "needs-key") {
    object = level.objects.find((candidate) => (
      candidate.kind === "key"
      && candidate.color === event.color
      && !isObjectResolved(candidate, state)
    ));
    action = `open the ${event.color ? lockPairLabel(event.color) : "matching"} Door`;
  }
  if (!object || object.kind === "animal" || object.kind === "enemy" || object.kind === "door" || object.kind === "portal" || object.kind === "treasure") return null;
  const itemName = object.kind === "sword"
    ? resolveWeaponArt(object.style).label
    : object.kind === "boots"
      ? "Splash Boots"
      : object.kind === "spring-boots"
        ? "Spring Boots"
        : object.kind === "antidote-leaf"
          ? "Antidote Leaf"
          : object.kind === "key"
            ? resolveKeyArt(object.color).label
            : "Power Potion";
  return {
    key: `${event.reason}:${event.target.x},${event.target.y}:${event.color ?? event.terrain ?? ""}`,
    count,
    itemId: object.id,
    itemName,
    itemSrc: spriteFor(object),
    message: `You need the ${itemName} to ${action}.`,
  };
}

function classForObject(object: LevelObject): string {
  return `maze-object object-${object.kind}`;
}

function isExplorationLevel(level: LevelDefinition): boolean {
  return shouldUseExplorationView(level);
}

function fullLevelWindow(level: LevelDefinition): CameraWindow {
  return {
    left: 0,
    top: 0,
    right: level.width - 1,
    bottom: level.height - 1,
    width: level.width,
    height: level.height,
  };
}

function isInsideWindow(point: Point, camera: CameraWindow): boolean {
  return point.x >= camera.left
    && point.x <= camera.right
    && point.y >= camera.top
    && point.y <= camera.bottom;
}

function cameraLayerStyle(point: Point, camera: CameraWindow): CSSProperties {
  return {
    left: `${((point.x - camera.left) / camera.width) * 100}%`,
    top: `${((point.y - camera.top) / camera.height) * 100}%`,
    width: `${100 / camera.width}%`,
    height: `${100 / camera.height}%`,
  };
}

function debugMazeQueryEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("debug") === DEBUG_MAZE_QUERY;
}

function terrainTreatmentFilter(treatment: TerrainRenderTreatment): string {
  return `brightness(${treatment.brightness}) saturate(${treatment.saturation}) contrast(${treatment.contrast})`;
}

function lightVector(level: LevelDefinition): { readonly x: number; readonly y: number } {
  const fallback = (["top", "right", "bottom", "left"] as const)[
    [...level.id].reduce((sum, character) => sum + character.charCodeAt(0), 0) % 4
  ] ?? "top";
  switch (level.lightDirection ?? fallback) {
    case "top": return { x: 0, y: 1 };
    case "right": return { x: -1, y: 0 };
    case "bottom": return { x: 0, y: -1 };
    case "left": return { x: 1, y: 0 };
  }
}

const MazeTerrain = memo(function MazeTerrain({
  level,
  camera,
}: {
  readonly level: LevelDefinition;
  readonly camera: CameraWindow;
}) {
  const patternPrefix = useId().replace(/:/g, "");
  const theme = resolveTerrainTheme(level.terrainThemeId);
  const floorPatternId = `${patternPrefix}-floor`;
  const wallPatternId = `${patternPrefix}-wall`;
  const waterPatternId = `${patternPrefix}-water`;
  const lavaPatternId = `${patternPrefix}-lava`;
  const poisonPatternId = `${patternPrefix}-poison`;
  const hazardInsetFilterId = `${patternPrefix}-hazard-inset`;
  const waterMaskId = `${patternPrefix}-water-mask`;
  const lavaMaskId = `${patternPrefix}-lava-mask`;
  const poisonMaskId = `${patternPrefix}-poison-mask`;
  const floorDressingPatternId = `${patternPrefix}-floor-dressing`;
  const wallDressingPatternId = `${patternPrefix}-wall-dressing`;
  const wallDepthFilterId = `${patternPrefix}-wall-depth`;
  const shadow = lightVector(level);
  const walls = createRoundedTerrainPath(level, camera, "wall", 0.13);
  const water = createRoundedTerrainPath(level, camera, "water", 0.16);
  const lava = createRoundedTerrainPath(level, camera, "lava", 0.16);
  const poison = createRoundedTerrainPath(level, camera, "poison", 0.16);
  const holes: Point[] = [];
  for (let y = camera.top; y <= camera.bottom; y += 1) {
    for (let x = camera.left; x <= camera.right; x += 1) {
      const point = { x, y };
      if (getTerrainAt(level, point) === "hole") holes.push(point);
    }
  }

  return (
    <>
      <svg
        className="maze-terrain-svg"
        viewBox={`${camera.left} ${camera.top} ${camera.width} ${camera.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern id={floorPatternId} patternUnits="userSpaceOnUse" width={theme.floor.periodTiles} height={theme.floor.periodTiles}>
            <rect width={theme.floor.periodTiles} height={theme.floor.periodTiles} fill={theme.floor.fallbackColor} />
            <image href={theme.floor.src} x="0" y="0" width={theme.floor.periodTiles} height={theme.floor.periodTiles} preserveAspectRatio="none" />
          </pattern>
          <pattern id={wallPatternId} patternUnits="userSpaceOnUse" width={theme.wall.periodTiles} height={theme.wall.periodTiles}>
            <rect width={theme.wall.periodTiles} height={theme.wall.periodTiles} fill={theme.wall.fallbackColor} />
            <image href={theme.wall.src} x="0" y="0" width={theme.wall.periodTiles} height={theme.wall.periodTiles} preserveAspectRatio="none" />
          </pattern>
          <pattern id={waterPatternId} patternUnits="userSpaceOnUse" width="4.6" height="4.6">
            <image href={ASSETS.water} x="0" y="0" width="4.6" height="4.6" preserveAspectRatio="none" />
          </pattern>
          <pattern id={lavaPatternId} patternUnits="userSpaceOnUse" width="4.6" height="4.6">
            <image href={ASSETS.lava} x="0" y="0" width="4.6" height="4.6" preserveAspectRatio="none" />
          </pattern>
          <pattern id={poisonPatternId} patternUnits="userSpaceOnUse" width="4.2" height="4.2">
            <image href={ASSETS.poison} x="0" y="0" width="4.2" height="4.2" preserveAspectRatio="none" />
          </pattern>
          <filter
            id={hazardInsetFilterId}
            x={camera.left - 0.2}
            y={camera.top - 0.2}
            width={camera.width + 0.4}
            height={camera.height + 0.4}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feMorphology in="SourceGraphic" operator="erode" radius="0.055" result="inset" />
            <feGaussianBlur in="inset" stdDeviation="0.022" />
          </filter>
          <filter id={wallDepthFilterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.055" />
          </filter>
          {water.d && (
            <mask
              id={waterMaskId}
              x={camera.left - 0.2}
              y={camera.top - 0.2}
              width={camera.width + 0.4}
              height={camera.height + 0.4}
              maskUnits="userSpaceOnUse"
              maskContentUnits="userSpaceOnUse"
            >
              <path d={water.d} fill="white" fillRule={water.fillRule} filter={`url(#${hazardInsetFilterId})`} />
            </mask>
          )}
          {lava.d && (
            <mask
              id={lavaMaskId}
              x={camera.left - 0.2}
              y={camera.top - 0.2}
              width={camera.width + 0.4}
              height={camera.height + 0.4}
              maskUnits="userSpaceOnUse"
              maskContentUnits="userSpaceOnUse"
            >
              <path d={lava.d} fill="white" fillRule={lava.fillRule} filter={`url(#${hazardInsetFilterId})`} />
            </mask>
          )}
          {poison.d && (
            <mask
              id={poisonMaskId}
              x={camera.left - 0.2}
              y={camera.top - 0.2}
              width={camera.width + 0.4}
              height={camera.height + 0.4}
              maskUnits="userSpaceOnUse"
              maskContentUnits="userSpaceOnUse"
            >
              <path d={poison.d} fill="white" fillRule={poison.fillRule} filter={`url(#${hazardInsetFilterId})`} />
            </mask>
          )}
          {theme.floorDressing && (
            <pattern
              id={floorDressingPatternId}
              patternUnits="userSpaceOnUse"
              width={theme.floorDressing.periodTiles}
              height={theme.floorDressing.periodTiles}
            >
              <image
                href={theme.floorDressing.src}
                x="0"
                y="0"
                width={theme.floorDressing.periodTiles}
                height={theme.floorDressing.periodTiles}
                preserveAspectRatio="none"
              />
            </pattern>
          )}
          {theme.wallDressing && (
            <pattern
              id={wallDressingPatternId}
              patternUnits="userSpaceOnUse"
              width={theme.wallDressing.periodTiles}
              height={theme.wallDressing.periodTiles}
            >
              <image
                href={theme.wallDressing.src}
                x="0"
                y="0"
                width={theme.wallDressing.periodTiles}
                height={theme.wallDressing.periodTiles}
                preserveAspectRatio="none"
              />
            </pattern>
          )}
        </defs>

        <rect
          className="terrain-floor"
          x={camera.left}
          y={camera.top}
          width={camera.width}
          height={camera.height}
          fill={`url(#${floorPatternId})`}
          style={{ filter: terrainTreatmentFilter(theme.floorTreatment) }}
        />
        {theme.floorDressing && (
          <rect
            className="terrain-floor-dressing"
            x={camera.left}
            y={camera.top}
            width={camera.width}
            height={camera.height}
            fill={`url(#${floorDressingPatternId})`}
            opacity={theme.floorDressing.opacity}
          />
        )}
        {water.d && <path className="terrain-water" d={water.d} fill={`url(#${waterPatternId})`} fillRule={water.fillRule} mask={`url(#${waterMaskId})`} />}
        {lava.d && <path className="terrain-lava" d={lava.d} fill={`url(#${lavaPatternId})`} fillRule={lava.fillRule} mask={`url(#${lavaMaskId})`} />}
        {poison.d && <path className="terrain-poison" d={poison.d} fill={`url(#${poisonPatternId})`} fillRule={poison.fillRule} mask={`url(#${poisonMaskId})`} />}
        {walls.d && (
          <path
            className="terrain-wall-depth"
            d={walls.d}
            fill="#332b58"
            fillRule={walls.fillRule}
            opacity="0.34"
            transform={`translate(${shadow.x * 0.10} ${shadow.y * 0.10})`}
            filter={`url(#${wallDepthFilterId})`}
          />
        )}
        {walls.d && (
          <path
            className="terrain-wall"
            d={walls.d}
            fill={`url(#${wallPatternId})`}
            fillRule={walls.fillRule}
            style={{ filter: terrainTreatmentFilter(theme.wallTreatment) }}
          />
        )}
        {walls.d && (
          <path
            className="terrain-wall-highlight"
            d={walls.d}
            fill="none"
            fillRule={walls.fillRule}
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="0.045"
            transform={`translate(${shadow.x * -0.025} ${shadow.y * -0.025})`}
          />
        )}
        {walls.d && theme.wallDressing && (
          <path
            className="terrain-wall-dressing"
            d={walls.d}
            fill={`url(#${wallDressingPatternId})`}
            fillRule={walls.fillRule}
            opacity={theme.wallDressing.opacity}
          />
        )}
      </svg>
      {holes.map((hole) => (
        <div className="terrain-hole-layer" style={cameraLayerStyle(hole, camera)} key={keyFor(hole)} aria-hidden="true">
          <img src={ASSETS.hole} alt="" draggable={false} />
        </div>
      ))}
      {isInsideWindow(level.exit, camera) && (
        <div className="goal-layer" style={cameraLayerStyle(level.exit, camera)} aria-hidden="true">
          <img className="goal-sprite" src={ASSETS.goal} alt="" draggable={false} />
        </div>
      )}
    </>
  );
});

interface MiniMapProps {
  readonly level: LevelDefinition;
  readonly position: Point;
  readonly camera: CameraWindow;
  readonly revealed: ReadonlySet<TileKey>;
  readonly currentView: ReadonlySet<TileKey>;
  readonly objects: readonly LevelObject[];
  readonly newExplorer?: boolean;
  readonly compact?: boolean;
  readonly highlightedObjectId?: string | null;
}

const MiniMap = memo(function MiniMap({
  level,
  position,
  camera,
  revealed,
  currentView,
  objects,
  newExplorer = false,
  compact = false,
  highlightedObjectId = null,
}: MiniMapProps) {
  const visibleObjectByTile = useMemo(() => new Map(
    objects.map((object) => [toTileKey(object.at), object] as const),
  ), [objects]);
  const exploredCount = useMemo(() => new Set([...revealed, ...currentView]).size, [currentView, revealed]);
  const exploredPercent = Math.round((exploredCount / (level.width * level.height)) * 100);

  return (
    <section
      className={`maze-map-card${compact ? " compact-map" : ""}`}
      aria-label={`Exploration map. ${exploredCount} of ${level.width * level.height} tiles revealed, ${exploredPercent} percent.`}
    >
      <div className="maze-map-heading"><img src={ASSETS.navMazes} alt="" /><strong>My map</strong><small>{exploredPercent}%</small></div>
      <div
        className="maze-minimap"
        style={{
          gridTemplateColumns: `repeat(${level.width}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${level.height}, minmax(0, 1fr))`,
        }}
        aria-hidden="true"
      >
        {level.terrain.flatMap((row, y) => row.map((terrain, x) => {
          const point = { x, y };
          const tileKey = toTileKey(point);
          const inView = currentView.has(tileKey);
          const seen = inView || revealed.has(tileKey);
          const candidate = visibleObjectByTile.get(tileKey);
          const guided = candidate?.id === highlightedObjectId;
          const object = seen || guided ? candidate : undefined;
          const isPlayer = pointsEqual(position, point);
          const isExit = seen && pointsEqual(level.exit, point);
          return (
            <i
              key={tileKey}
              className={`minimap-tile ${seen ? `map-${terrain} ${inView ? "in-view" : "remembered"}` : "map-fog"}`}
            >
              {isExit && <b className="map-marker marker-exit" />}
              {object && <b className={`map-marker marker-${object.kind}${object.kind === "door" || object.kind === "key" ? ` marker-${object.color}` : object.kind === "portal" ? ` marker-${object.pair}` : ""}${guided ? " guided-marker" : ""}`} />}
              {isPlayer && <b className="map-player" />}
            </i>
          );
        }))}
        <span
          className="map-camera-frame"
          style={{
            left: `${(camera.left / level.width) * 100}%`,
            top: `${(camera.top / level.height) * 100}%`,
            width: `${(camera.width / level.width) * 100}%`,
            height: `${(camera.height / level.height) * 100}%`,
          }}
        />
      </div>
      {newExplorer
        ? <div className="maze-map-nudge"><img src={ASSETS.goal} alt="" /> Walk to reveal the maze!</div>
        : <div className="maze-map-key"><span><i className="key-current" />Now</span><span><i className="key-seen" />Explored</span><span><i className="key-fog" />Mystery</span></div>}
      <p className="sr-only">
        Ame is at column {position.x + 1}, row {position.y + 1}.
        {pointsEqual(level.exit, position) || currentView.has(toTileKey(level.exit)) || revealed.has(toTileKey(level.exit))
          ? ` The sparkling exit is at column ${level.exit.x + 1}, row ${level.exit.y + 1}.`
          : " The exit has not been discovered yet."}
        {objects.some((object) => currentView.has(toTileKey(object.at)) || revealed.has(toTileKey(object.at)))
          ? ` Discovered landmarks: ${objects
            .filter((object) => currentView.has(toTileKey(object.at)) || revealed.has(toTileKey(object.at)))
            .map((object) => `${describeObject(object)} at column ${object.at.x + 1}, row ${object.at.y + 1}`)
            .join("; ")}.`
          : " No unresolved landmarks have been discovered yet."}
      </p>
    </section>
  );
});

function stickerArt(id: StickerId): string {
  return STICKER_ART[id];
}

function medalArt(id: RescueMedalId): string {
  return MEDAL_ART[id];
}

function badgeArt(id: BadgeId): string {
  return BADGE_ART[id];
}

function surpriseSettings(progress: PlayerProgress): { size: number; difficulty: MazeDifficulty } {
  const solvedSurprises = Object.keys(progress.bestResultsByLevel)
    .filter((levelId) => levelId.startsWith("surprise-"))
    .length;
  const chapter = Math.max(1, progress.unlockedLevelCount) + (solvedSurprises >= 2 ? 1 : 0);
  const sizes = [9, 11, 13, 15, 17] as const;
  const size = sizes[Math.min(sizes.length - 1, chapter - 1)] ?? 9;
  const difficulty: MazeDifficulty = chapter >= 5 ? "adventure" : chapter >= 3 ? "growing" : "gentle";
  return { size, difficulty };
}

function describeGeneratedRecord(levelId: string): string {
  const match = /-(movement|gentle|growing|adventure)-(\d+)$/.exec(levelId);
  if (match === null) return "Procedural maze";
  const difficulty = match[1] ?? "surprise";
  const size = Number(match[2]);
  return `${Number.isFinite(size) ? `${size} × ${size} · ` : ""}${difficulty[0]?.toUpperCase()}${difficulty.slice(1)}`;
}

function getHintReachableTiles(level: LevelDefinition, state: GameState): ReadonlySet<string> {
  const reachable = new Set<string>([keyFor(state.position)]);
  const queue = [state.position];
  for (let head = 0; head < queue.length; head += 1) {
    const point = queue[head];
    if (!point) continue;
    for (const direction of ["up", "right", "down", "left"] as const) {
      const delta = DIRECTION_DELTAS[direction];
      const next = { x: point.x + delta.x, y: point.y + delta.y };
      const nextKey = keyFor(next);
      if (reachable.has(nextKey)) continue;
      const terrain = getTerrainAt(level, next);
      if (!terrain || terrain === "wall") continue;
      if ((terrain === "water" || terrain === "lava") && !state.hasBoots) continue;
      if (terrain === "poison" && !state.hasAntidoteLeaf) continue;
      if (terrain === "hole" && !state.hasSpringBoots) continue;
      const object = getObjectAt(level, next);
      if (object && !isObjectResolved(object, state)) {
        if (object.kind === "door" && !state.keys.includes(object.color)) continue;
        if (object.kind === "enemy" && (!state.hasSword || state.power < object.power)) continue;
      }
      reachable.add(nextKey);
      queue.push(next);
    }
  }
  return reachable;
}

function hintFor(level: LevelDefinition, state: GameState): string {
  const unresolved = level.objects.filter((object) => !isObjectResolved(object, state));
  const reachable = getHintReachableTiles(level, state);
  const accessible = unresolved.filter((object) => reachable.has(keyFor(object.at)));
  const weapon = accessible.find((object) => object.kind === "sword");
  if (!state.hasSword && weapon) {
    return `Look along a side path for the ${resolveWeaponArt(weapon.style).label}. Ame needs it before she can challenge a baddie.`;
  }
  if (!state.hasAntidoteLeaf && accessible.some((object) => object.kind === "antidote-leaf")) {
    return "A bright green antidote leaf is hidden before the purple poison. Explore the branches you have not tried yet.";
  }
  if (!state.hasBoots && accessible.some((object) => object.kind === "boots")) {
    return "Find the splashy boots on another path before crossing water or warm lava.";
  }
  if (!state.hasSpringBoots && accessible.some((object) => object.kind === "spring-boots")) {
    return "The pink spring boots let Ame boing over holes. Check the side passages before the jump.";
  }
  const strongEnemy = unresolved.find((object) => (
    object.kind === "enemy"
    && object.power > state.power
    && ([object.at, ...Object.values(DIRECTION_DELTAS).map((delta) => ({
      x: object.at.x + delta.x,
      y: object.at.y + delta.y,
    }))]).some((point) => reachable.has(keyFor(point)))
  ));
  if (strongEnemy?.kind === "enemy") {
    return `${resolveEnemyArt(strongEnemy.style).label} has Power ${strongEnemy.power}. Find potions or defeat smaller baddies until Ame reaches ${strongEnemy.power}.`;
  }
  const missingKey = accessible.find((object) => object.kind === "key");
  if (missingKey?.kind === "key") {
    const lockName = lockPairLabel(missingKey.color);
    return `Look for the ${lockName} Key. Its colour and ${KEY_MOTIF_LABELS[missingKey.color].toLowerCase()} shape match only the ${lockName} Door.`;
  }
  const waitingFriend = accessible.find((object) => object.kind === "animal");
  if (waitingFriend?.kind === "animal") {
    return `${ANIMAL_LABELS[waitingFriend.species]} is still waiting in a cage. Try an unexplored branch before heading to the star.`;
  }
  const portal = accessible.find((object) => object.kind === "portal");
  if (portal?.kind === "portal") {
    const art = resolvePortalArt(portal.pair);
    return `Step on the ${art.label} to pop out of its matching ${art.motif} flower. Matching colours and shapes always travel together.`;
  }
  if (!state.hasSword && unresolved.some((object) => object.kind === "sword")) {
    return "The maze weapon is in another garden. Look for a matching magic flower or an unexplored turning.";
  }
  return "The way is ready now—follow the open passages toward the sparkling star.";
}

function App() {
  const [mazeMusicPicker] = useState(() => createMazeMusicPicker(createMusicRunSeed(), {
    previousTrackUrl: MUSIC_TRACKS.title,
  }));
  const [initialRun] = useState(() => readActiveRun(CURATED_LEVELS));
  const initialLevel = initialRun
    ? CURATED_LEVELS.find((candidate) => candidate.id === initialRun.levelId) ?? CURATED_LEVELS[0]!
    : CURATED_LEVELS[0]!;
  const [screen, setScreen] = useState<AppScreen>("title");
  const [hasActiveRun, setHasActiveRun] = useState(initialRun !== null);
  const [pendingAdventure, setPendingAdventure] = useState<PendingAdventure | null>(null);
  const [testerPickerOpen, setTesterPickerOpen] = useState(debugMazeQueryEnabled);
  const [levelPickerOpen, setLevelPickerOpen] = useState(false);
  const [bigMaze, setBigMaze] = useState(false);
  const [level, setLevel] = useState<LevelDefinition>(initialLevel);
  const [game, setGame] = useState<GameState>(() => initialRun?.game ?? createInitialGameState(initialLevel));
  const [playerTrail, setPlayerTrail] = useState<readonly Point[]>(() => [
    initialRun?.game.position ?? initialLevel.start,
  ]);
  const [runMode, setRunMode] = useState<RunMode>("normal");
  const [revealedTiles, setRevealedTiles] = useState<ReadonlySet<TileKey>>(
    () => isExplorationLevel(initialLevel)
      ? revealVisibleTiles(
        initialRun?.revealedTiles ?? [],
        initialLevel,
        initialRun?.game.position ?? initialLevel.start,
        DEFAULT_FOV_SIZE,
      )
      : new Set(),
  );
  const [feedback, setFeedback] = useState<Feedback>({
    icon: ASSETS.goal,
    text: initialRun ? initialLevel.objective : "Help Ame find the star!",
    tone: "plain",
    sound: "step",
  });
  const [mapPickupToast, setMapPickupToast] = useState<MapPickupToast | null>(null);
  const [movePulse, setMovePulse] = useState(0);
  const [bumpPulse, setBumpPulse] = useState(0);
  const [muted, setMuted] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [blockerHint, setBlockerHint] = useState<BlockerHint | null>(null);
  const [guidedObjectId, setGuidedObjectId] = useState<string | null>(null);
  const [resetProgressOpen, setResetProgressOpen] = useState(false);
  const [tooStrongEncounter, setTooStrongEncounter] = useState<TooStrongEncounter | null>(null);
  const [progress, setProgress] = useState<PlayerProgress>(readPlayerProgress);
  const [completion, setCompletion] = useState<CompletionCelebration | null>(null);
  const [restartArmed, setRestartArmed] = useState(false);
  const [battlePresentation, setBattlePresentation] = useState<BattlePresentation | null>(null);
  const [rescuePresentation, setRescuePresentation] = useState<RescuePresentation | null>(null);
  const [jumpPresentation, setJumpPresentation] = useState<JumpPresentation | null>(null);
  const [portalPresentation, setPortalPresentation] = useState<PortalPresentation | null>(null);
  const [treasurePresentation, setTreasurePresentation] = useState<TreasurePresentation | null>(null);
  const [presentedPower, setPresentedPower] = useState<number | null>(null);
  const [presentedEnemyPower, setPresentedEnemyPower] = useState<number | null>(null);
  const appFrameRef = useRef<HTMLElement>(null);
  const [stageScale, setStageScale] = useState(() => (
    typeof window === "undefined"
      ? 1
      : calculateStageScale(window.innerWidth, window.innerHeight)
  ));
  const boardRef = useRef<HTMLDivElement>(null);
  const inputLocked = useRef(false);
  const inputUnlockTimer = useRef<number | undefined>(undefined);
  const queuedMove = useRef<QueuedMoveIntent | null>(null);
  const attemptMoveRef = useRef<(direction: Direction, lateralOffset?: number) => void>(() => undefined);
  const pointerDirectionRef = useRef<(clientX: number, clientY: number, previousDirection?: Direction | null) => PointerIntent | null>(() => null);
  const lastMovedDirection = useRef<Direction | null>(null);
  const heldKeys = useRef(new Map<string, Direction>());
  const heldKeyOrder = useRef<string[]>([]);
  const heldKeyTimer = useRef<number | undefined>(undefined);
  const heldKeyCadence = useRef<HeldMoveCadence>(IDLE_HELD_MOVE_CADENCE);
  const dpadHoldDirection = useRef<Direction | null>(null);
  const dpadHoldPointerId = useRef<number | null>(null);
  const dpadHoldTimer = useRef<number | undefined>(undefined);
  const dpadHoldCadence = useRef<HeldMoveCadence>(IDLE_HELD_MOVE_CADENCE);
  const activeBoardPointer = useRef<ActiveBoardPointer | null>(null);
  const pointerHoldTimer = useRef<number | undefined>(undefined);
  const pointerHoldCadence = useRef<HeldMoveCadence>(IDLE_HELD_MOVE_CADENCE);
  const [touchCursor, setTouchCursor] = useState<TouchCursor | null>(null);
  const lastBumpSoundAt = useRef(0);
  const restartTimer = useRef<number | undefined>(undefined);
  const rewardSoundTimer = useRef<number | undefined>(undefined);
  const mapPickupTimer = useRef<number | undefined>(undefined);
  const mapPickupSequence = useRef(0);
  const blockerBumps = useRef(new Map<string, number>());
  const presentationTimers = useRef(new Set<number>());
  const presentationSequence = useRef(0);
  const treasureTimer = useRef<number | undefined>(undefined);
  const modalReturnFocus = useRef<HTMLElement | null>(null);
  const titlePlayRef = useRef<HTMLButtonElement>(null);
  const achievementsHeadingRef = useRef<HTMLHeadingElement>(null);
  const mutedRef = useRef(muted);
  const [testerToolsRequested] = useState(debugMazeQueryEnabled);

  useLayoutEffect(() => {
    const frame = appFrameRef.current;
    if (!frame) return undefined;

    const updateStageScale = () => {
      const styles = window.getComputedStyle(frame);
      const horizontalPadding = Number.parseFloat(styles.paddingLeft)
        + Number.parseFloat(styles.paddingRight);
      const verticalPadding = Number.parseFloat(styles.paddingTop)
        + Number.parseFloat(styles.paddingBottom);
      const availableWidth = Math.max(0, frame.clientWidth - horizontalPadding);
      const availableHeight = Math.max(0, frame.clientHeight - verticalPadding);
      const nextScale = calculateStageScale(availableWidth, availableHeight);

      setStageScale((currentScale) => (
        Math.abs(currentScale - nextScale) < 0.0001 ? currentScale : nextScale
      ));
    };

    updateStageScale();
    const resizeObserver = new ResizeObserver(updateStageScale);
    resizeObserver.observe(frame);
    window.addEventListener("resize", updateStageScale);
    window.visualViewport?.addEventListener("resize", updateStageScale);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateStageScale);
      window.visualViewport?.removeEventListener("resize", updateStageScale);
    };
  }, []);

  const musicTrackForLevel = useCallback(
    (nextLevel: LevelDefinition) => mazeMusicPicker.trackForMaze(nextLevel.id),
    [mazeMusicPicker],
  );

  useEffect(() => {
    if (screen !== "title" || muted) return undefined;
    mazeMusicPicker.noteTrackStarted(MUSIC_TRACKS.title);
    configureMusic({ trackUrl: MUSIC_TRACKS.title });
    setMusicMuted(false);

    const beginTitleMusic = () => {
      void startMusicFromUserGesture();
    };
    window.addEventListener("pointerdown", beginTitleMusic, { capture: true, once: true });
    window.addEventListener("keydown", beginTitleMusic, { capture: true, once: true });
    return () => {
      window.removeEventListener("pointerdown", beginTitleMusic, true);
      window.removeEventListener("keydown", beginTitleMusic, true);
    };
  }, [mazeMusicPicker, muted, screen]);

  const campaignIndex = CURATED_LEVELS.findIndex((candidate) => candidate.id === level.id);
  const isSurprise = campaignIndex === -1;
  const explorationMode = isExplorationLevel(level);
  const testerRun = runMode === "tester";
  const testerToolsEnabled = testerToolsRequested || testerRun;
  const inferredUnlocked = CURATED_LEVELS.reduce((highest, candidate, index) => (
    progress.bestResultsByLevel[candidate.id]
      ? Math.max(highest, index + 2)
      : highest
  ), 1);
  const unlocked = Math.min(
    CURATED_LEVELS.length,
    Math.max(progress.unlockedLevelCount, inferredUnlocked),
  );
  const cameraWindow = useMemo(() => {
    if (!explorationMode) return fullLevelWindow(level);
    const cameraFocus = jumpPresentation
      ? {
          x: Math.round((jumpPresentation.from.x + jumpPresentation.to.x) / 2),
          y: Math.round((jumpPresentation.from.y + jumpPresentation.to.y) / 2),
        }
      : game.position;
    return getCameraWindow(level, cameraFocus, DEFAULT_FOV_SIZE);
  }, [explorationMode, game.position, jumpPresentation, level]);
  const currentViewTiles = useMemo(
    () => explorationMode
      ? new Set(getVisibleTileKeys(level, game.position, DEFAULT_FOV_SIZE))
      : new Set<TileKey>(),
    [explorationMode, game.position, level],
  );
  const activeObjects = useMemo(
    () => level.objects.filter((object) => !isObjectResolved(object, game)),
    [game, level],
  );
  const worldObjects = useMemo(
    () => activeObjects.filter((object) => (
      object.id !== battlePresentation?.objectId
      && (!explorationMode || isInsideWindow(object.at, cameraWindow))
    )),
    [activeObjects, battlePresentation?.objectId, cameraWindow, explorationMode],
  );
  const animalObjects = useMemo(
    () => level.objects.filter(
      (object): object is Extract<LevelObject, { kind: "animal" }> => object.kind === "animal",
    ),
    [level],
  );
  const weaponObject = useMemo(
    () => level.objects.find(
      (object): object is Extract<LevelObject, { kind: "sword" }> => object.kind === "sword",
    ),
    [level],
  );
  const weaponArt = resolveWeaponArt(weaponObject?.style);
  const terrainTheme = resolveTerrainTheme(level.terrainThemeId);
  const mazeLight = lightVector(level);
  const levelStory = useMemo(() => storyForLevel(level.id), [level.id]);
  const rescuedSpecies = useMemo(
    () => animalObjects.filter((object) => game.rescuedAnimalIds.includes(object.id)).map((object) => object.species),
    [animalObjects, game.rescuedAnimalIds],
  );
  const followerPlacements = useMemo(() => {
    const rescuedAnimals = game.rescuedAnimalIds.flatMap((animalId) => {
      if (animalId === rescuePresentation?.objectId) return [];
      const animal = animalObjects.find((candidate) => candidate.id === animalId);
      return animal ? [animal] : [];
    });
    const availableTrail = getVisibleFollowerPoints(
      playerTrail,
      game.position,
      cameraWindow,
      rescuedAnimals.length,
    );

    return rescuedAnimals.flatMap((animal, index) => {
      const point = availableTrail[index];
      return point ? [{ animal, point }] : [];
    });
  }, [animalObjects, cameraWindow, game.position, game.rescuedAnimalIds, playerTrail, rescuePresentation?.objectId]);
  const objectKinds = useMemo(() => new Set(level.objects.map((object) => object.kind)), [level]);
  const keyColors = useMemo(
    () => [...new Set(level.objects.flatMap((object) => object.kind === "key" ? [object.color] : []))],
    [level],
  );
  const mazeStatus = useMemo(() => describeMazePosition(level, game), [game, level]);
  const runInProgress = hasActiveRun && game.status === "playing";
  const displayedPower = presentedPower ?? game.power;
  const displayedGold = progress.gold + (game.status === "playing" ? game.goldStarsCollected : 0);
  const displayedScience = progress.sciencePoints + (game.status === "playing" ? game.sciencePointsCollected : 0);
  const presentationActive = battlePresentation !== null
    || rescuePresentation !== null
    || jumpPresentation !== null
    || portalPresentation !== null;
  const modalOpen = resetProgressOpen
    || testerPickerOpen
    || levelPickerOpen
    || pendingAdventure !== null
    || storyOpen
    || (screen === "game" && (
      helpOpen
      || hintOpen
      || blockerHint !== null
      || tooStrongEncounter !== null
      || (game.status !== "playing" && !presentationActive)
    ));

  useEffect(() => {
    if (runMode === "tester") return;
    if (!hasActiveRun || level.source !== "curated" || game.status !== "playing") {
      clearActiveRun();
      return;
    }
    writeActiveRun({
      mode: "normal",
      level,
      game,
      revealedTiles,
    });
  }, [game, hasActiveRun, level, revealedTiles, runMode]);

  const clearDpadHold = useCallback(() => {
    dpadHoldDirection.current = null;
    dpadHoldPointerId.current = null;
    dpadHoldCadence.current = IDLE_HELD_MOVE_CADENCE;
    if (dpadHoldTimer.current !== undefined) {
      window.clearTimeout(dpadHoldTimer.current);
      dpadHoldTimer.current = undefined;
    }
  }, []);

  const clearBoardPointer = useCallback(() => {
    activeBoardPointer.current = null;
    queuedMove.current = null;
    pointerHoldCadence.current = IDLE_HELD_MOVE_CADENCE;
    setTouchCursor(null);
    if (pointerHoldTimer.current !== undefined) {
      window.clearTimeout(pointerHoldTimer.current);
      pointerHoldTimer.current = undefined;
    }
  }, []);

  const clearHeldInput = useCallback(() => {
    heldKeys.current.clear();
    heldKeyOrder.current = [];
    queuedMove.current = null;
    heldKeyCadence.current = IDLE_HELD_MOVE_CADENCE;
    lastMovedDirection.current = null;
    if (heldKeyTimer.current !== undefined) {
      window.clearTimeout(heldKeyTimer.current);
      heldKeyTimer.current = undefined;
    }
    clearDpadHold();
    clearBoardPointer();
  }, [clearBoardPointer, clearDpadHold]);

  const clearPresentationWork = useCallback(() => {
    presentationSequence.current += 1;
    presentationTimers.current.forEach((timer) => window.clearTimeout(timer));
    presentationTimers.current.clear();
  }, []);

  const cancelPresentations = useCallback(() => {
    clearPresentationWork();
    setBattlePresentation(null);
    setRescuePresentation(null);
    setJumpPresentation(null);
    setPortalPresentation(null);
    setPresentedPower(null);
    setPresentedEnemyPower(null);
  }, [clearPresentationWork]);

  const schedulePresentationTimer = useCallback((
    sequence: number,
    callback: () => void,
    delay: number,
  ) => {
    const timer = window.setTimeout(() => {
      presentationTimers.current.delete(timer);
      if (presentationSequence.current === sequence) callback();
    }, delay);
    presentationTimers.current.add(timer);
  }, []);

  const beginBattlePresentation = useCallback((
    event: Extract<GameEvent, { type: "enemy-defeated" }>,
    enemy: Extract<LevelObject, { kind: "enemy" }>,
    direction: Direction,
    from: Point,
  ): number => {
    clearPresentationWork();
    const sequence = presentationSequence.current;
    const reducedMotion = prefersReducedMotion();
    const plan = createCombatVictoryPlan({
      powerBefore: event.powerBefore,
      enemyPower: event.enemyPower,
      powerAfter: event.powerAfter,
    }, { reducedMotion });
    setRescuePresentation(null);
    setJumpPresentation(null);
    setPortalPresentation(null);
    setPresentedEnemyPower(event.enemyPower);
    setPresentedPower(event.powerBefore);
    setBattlePresentation({
      objectId: event.objectId,
      enemySrc: resolveEnemyArt(enemy.style).src,
      enemyPower: event.enemyPower,
      from,
      at: enemy.at,
      direction,
      powerBefore: event.powerBefore,
      powerAfter: event.powerAfter,
      durationMs: plan.durationMs,
      clashCount: plan.clashes.length,
    });

    plan.transferSteps.forEach((step) => {
      schedulePresentationTimer(sequence, () => {
        setPresentedPower(step.playerPower);
        setPresentedEnemyPower(step.enemyPower);
      }, step.atMs);
    });
    plan.cues.forEach((cue) => {
      schedulePresentationTimer(
        sequence,
        () => playSound(COMBAT_CUE_SOUNDS[cue.kind], mutedRef.current),
        cue.atMs,
      );
    });

    const duration = plan.durationMs;
    schedulePresentationTimer(sequence, () => {
      setPresentedPower(null);
      setPresentedEnemyPower(null);
      setBattlePresentation(null);
    }, Math.max(100, duration - 30));
    return duration;
  }, [clearPresentationWork, schedulePresentationTimer]);

  const beginRescuePresentation = useCallback((
    event: Extract<GameEvent, { type: "animal-rescued" }>,
    animal: Extract<LevelObject, { kind: "animal" }>,
  ): number => {
    clearPresentationWork();
    const sequence = presentationSequence.current;
    const duration = prefersReducedMotion() ? REDUCED_PRESENTATION_MS : RESCUE_PRESENTATION_MS;
    setBattlePresentation(null);
    setJumpPresentation(null);
    setPortalPresentation(null);
    setPresentedPower(null);
    setPresentedEnemyPower(null);
    setRescuePresentation({
      objectId: event.objectId,
      species: event.species,
      at: animal.at,
      cageSrc: resolveCageArt(animal.cageStyle).src,
    });
    if (duration === REDUCED_PRESENTATION_MS) playSound("friendRescue", mutedRef.current);
    else schedulePresentationTimer(sequence, () => playSound("friendRescue", mutedRef.current), 150);
    schedulePresentationTimer(sequence, () => setRescuePresentation(null), Math.max(100, duration - 30));
    return duration;
  }, [clearPresentationWork, schedulePresentationTimer]);

  const beginJumpPresentation = useCallback((
    event: Extract<GameEvent, { type: "hole-jumped" }>,
    landingSound: SoundName,
  ): number => {
    clearPresentationWork();
    const sequence = presentationSequence.current;
    const reducedMotion = prefersReducedMotion();
    const motion = getJumpPresentationMotion(event.over.length);
    const duration = reducedMotion ? REDUCED_PRESENTATION_MS : motion.durationMs;
    setBattlePresentation(null);
    setRescuePresentation(null);
    setPortalPresentation(null);
    setPresentedPower(null);
    setPresentedEnemyPower(null);
    setJumpPresentation({
      from: event.from,
      to: event.to,
      holeCount: motion.holeCount,
      durationMs: duration,
      apexPercent: motion.apexPercent,
      descentPercent: motion.descentPercent,
    });
    playSound("jump", mutedRef.current);
    if (!reducedMotion && motion.holeCount === 3) {
      schedulePresentationTimer(sequence, () => playSound("jump", mutedRef.current), Math.round(duration * 0.48));
    }
    if (landingSound !== "jump") {
      schedulePresentationTimer(
        sequence,
        () => playSound(landingSound, mutedRef.current),
        reducedMotion ? 45 : duration - 105,
      );
    }
    schedulePresentationTimer(sequence, () => setJumpPresentation(null), Math.max(100, duration - 20));
    return duration;
  }, [clearPresentationWork, schedulePresentationTimer]);

  const beginPortalPresentation = useCallback((
    event: Extract<GameEvent, { type: "portal-warped" }>,
  ): number => {
    clearPresentationWork();
    const sequence = presentationSequence.current;
    const duration = prefersReducedMotion() ? REDUCED_PRESENTATION_MS : PORTAL_PRESENTATION_MS;
    setBattlePresentation(null);
    setRescuePresentation(null);
    setJumpPresentation(null);
    setPresentedPower(null);
    setPresentedEnemyPower(null);
    setPortalPresentation({ pair: event.pair, from: event.from, to: event.to });
    playSound("portal", mutedRef.current);
    schedulePresentationTimer(sequence, () => setPortalPresentation(null), Math.max(100, duration - 25));
    return duration;
  }, [clearPresentationWork, schedulePresentationTimer]);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => () => {
    if (mapPickupTimer.current !== undefined) {
      window.clearTimeout(mapPickupTimer.current);
    }
  }, []);

  useEffect(() => {
    const syncMusicVisibility = () => {
      const hidden = document.visibilityState !== "visible";
      setMusicPageHidden(hidden);
      if (hidden) {
        cancelPresentations();
        clearHeldInput();
        if (inputUnlockTimer.current !== undefined) {
          window.clearTimeout(inputUnlockTimer.current);
          inputUnlockTimer.current = undefined;
        }
        if (rewardSoundTimer.current !== undefined) {
          window.clearTimeout(rewardSoundTimer.current);
          rewardSoundTimer.current = undefined;
        }
        inputLocked.current = false;
      }
    };
    syncMusicVisibility();
    document.addEventListener("visibilitychange", syncMusicVisibility);
    return () => document.removeEventListener("visibilitychange", syncMusicVisibility);
  }, [cancelPresentations, clearHeldInput]);

  useEffect(() => {
    const focusTimer = window.setTimeout(() => {
      if (screen === "title") titlePlayRef.current?.focus();
      else if (screen === "achievements") achievementsHeadingRef.current?.focus();
      else boardRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(focusTimer);
  }, [screen]);

  const loadLevel = useCallback((nextLevel: LevelDefinition) => {
    cancelPresentations();
    if (inputUnlockTimer.current !== undefined) {
      window.clearTimeout(inputUnlockTimer.current);
      inputUnlockTimer.current = undefined;
    }
    inputLocked.current = false;
    clearHeldInput();
    if (rewardSoundTimer.current !== undefined) {
      window.clearTimeout(rewardSoundTimer.current);
      rewardSoundTimer.current = undefined;
    }
    if (mapPickupTimer.current !== undefined) {
      window.clearTimeout(mapPickupTimer.current);
      mapPickupTimer.current = undefined;
    }
    mapPickupSequence.current += 1;
    setMapPickupToast(null);
    if (treasureTimer.current !== undefined) window.clearTimeout(treasureTimer.current);
    setTreasurePresentation(null);
    setLevel(nextLevel);
    setGame(createInitialGameState(nextLevel));
    setPlayerTrail([nextLevel.start]);
    setRevealedTiles(isExplorationLevel(nextLevel)
      ? revealVisibleTiles([], nextLevel, nextLevel.start, DEFAULT_FOV_SIZE)
      : new Set());
    setMovePulse(0);
    setBumpPulse(0);
    setCompletion(null);
    setTooStrongEncounter(null);
    setHintOpen(false);
    setBlockerHint(null);
    setGuidedObjectId(null);
    blockerBumps.current.clear();
    setPendingAdventure(null);
    setFeedback({ icon: ASSETS.goal, text: nextLevel.objective, tone: "plain", sound: "step" });
    setRestartArmed(false);
  }, [cancelPresentations, clearHeldInput]);

  const attemptMove = useCallback((requestedDirection: Direction, lateralOffset = 0) => {
    const unavailable = (
      screen !== "game"
      || pendingAdventure !== null
      || testerPickerOpen
      || helpOpen
      || hintOpen
      || storyOpen
      || blockerHint !== null
      || tooStrongEncounter !== null
      || game.status !== "playing"
    );
    if (unavailable) {
      queuedMove.current = null;
      return;
    }
    if (inputLocked.current) {
      queuedMove.current = { direction: requestedDirection, lateralOffset };
      return;
    }
    queuedMove.current = null;
    inputLocked.current = true;
    const direction = resolvePointerMoveDirection(
      level,
      game,
      requestedDirection,
      lateralOffset,
      lastMovedDirection.current,
    );
    const result = movePlayer(level, game, direction);
    const tooStrongEvent = result.events.find(
      (event): event is Extract<GameEvent, { type: "enemy-too-strong" }> => event.type === "enemy-too-strong",
    );
    const blockedEvent = result.events.find(
      (event): event is Extract<GameEvent, { type: "blocked" }> => event.type === "blocked",
    );
    if (blockedEvent) {
      const hintSeed = blockerHintFor(level, game, blockedEvent, 1);
      if (hintSeed) {
        const count = (blockerBumps.current.get(hintSeed.key) ?? 0) + 1;
        blockerBumps.current.set(hintSeed.key, count);
        const nextHint = { ...hintSeed, count };
        modalReturnFocus.current = boardRef.current;
        clearHeldInput();
        setBlockerHint(nextHint);
        if (count >= 3) setGuidedObjectId(nextHint.itemId);
      }
    }
    if (result.state.status !== "playing" || tooStrongEvent) {
      modalReturnFocus.current = document.activeElement instanceof HTMLElement
        && document.activeElement !== document.body
        ? document.activeElement
        : boardRef.current;
    }
    const hasInteraction = result.events.some((event) => event.type !== "moved");
    const nextFeedback = hasInteraction
      ? feedbackFor(result.events, level)
      : { icon: ASSETS.goal, text: level.objective, tone: "plain" as const, sound: "step" as const };
    setGame(result.state);
    if (guidedObjectId && result.state.collectedObjectIds.includes(guidedObjectId)) {
      setGuidedObjectId(null);
    }
    if (result.moved) {
      lastMovedDirection.current = direction;
      setPlayerTrail((trail) => recordFollowerStep(trail, game.position));
    }
    if (result.moved && explorationMode) {
      setRevealedTiles((revealed) => revealVisibleTiles(
        revealed,
        level,
        result.state.position,
        DEFAULT_FOV_SIZE,
      ));
    }
    setFeedback(nextFeedback);
    const nextPickupToast = pickupToastFor(result.events, level);
    if (nextPickupToast) {
      if (mapPickupTimer.current !== undefined) {
        window.clearTimeout(mapPickupTimer.current);
      }
      const toastId = mapPickupSequence.current + 1;
      mapPickupSequence.current = toastId;
      setMapPickupToast({ id: toastId, ...nextPickupToast });
      mapPickupTimer.current = window.setTimeout(() => {
        setMapPickupToast((current) => current?.id === toastId ? null : current);
        mapPickupTimer.current = undefined;
      }, 1_850);
    }
    const defeatedEvent = result.events.find(
      (event): event is Extract<GameEvent, { type: "enemy-defeated" }> => event.type === "enemy-defeated",
    );
    const rescuedEvent = result.events.find(
      (event): event is Extract<GameEvent, { type: "animal-rescued" }> => event.type === "animal-rescued",
    );
    const jumpedEvent = result.events.find(
      (event): event is Extract<GameEvent, { type: "hole-jumped" }> => event.type === "hole-jumped",
    );
    const portalEvent = result.events.find(
      (event): event is Extract<GameEvent, { type: "portal-warped" }> => event.type === "portal-warped",
    );
    const treasureEvent = result.events.find(
      (event): event is Extract<GameEvent, { type: "treasure-collected" }> => event.type === "treasure-collected",
    );
    if (treasureEvent) {
      const treasure = level.objects.find((object) => object.kind === "treasure" && object.id === treasureEvent.objectId);
      if (treasure?.kind === "treasure") {
        if (treasureTimer.current !== undefined) window.clearTimeout(treasureTimer.current);
        setTreasurePresentation({
          id: mapPickupSequence.current + 1,
          currency: treasureEvent.currency,
          amount: treasureEvent.amount,
          at: treasure.at,
        });
        treasureTimer.current = window.setTimeout(() => {
          setTreasurePresentation(null);
          treasureTimer.current = undefined;
        }, prefersReducedMotion() ? 180 : 1050);
      }
    }
    let presentationDuration = 0;
    if (defeatedEvent) {
      clearHeldInput();
      const enemy = level.objects.find(
        (object): object is Extract<LevelObject, { kind: "enemy" }> => (
          object.kind === "enemy" && object.id === defeatedEvent.objectId
        ),
      );
      if (enemy && jumpedEvent) {
        const jumpDuration = beginJumpPresentation(jumpedEvent, "jump");
        const jumpSequence = presentationSequence.current;
        const battleDuration = createCombatVictoryPlan({
          powerBefore: defeatedEvent.powerBefore,
          enemyPower: defeatedEvent.enemyPower,
          powerAfter: defeatedEvent.powerAfter,
        }, { reducedMotion: prefersReducedMotion() }).durationMs;
        const battleFrom = {
          x: enemy.at.x - DIRECTION_DELTAS[direction].x,
          y: enemy.at.y - DIRECTION_DELTAS[direction].y,
        };
        schedulePresentationTimer(
          jumpSequence,
          () => beginBattlePresentation(defeatedEvent, enemy, direction, battleFrom),
          Math.max(100, jumpDuration - 20),
        );
        presentationDuration = Math.max(100, jumpDuration - 20) + battleDuration;
      } else if (enemy) {
        presentationDuration = beginBattlePresentation(defeatedEvent, enemy, direction, game.position);
      }
    } else if (tooStrongEvent) {
      const enemy = level.objects.find(
        (object): object is Extract<LevelObject, { kind: "enemy" }> => (
          object.kind === "enemy" && object.id === tooStrongEvent.objectId
        ),
      );
      clearHeldInput();
      if (enemy) {
        const art = resolveEnemyArt(enemy.style);
        setTooStrongEncounter({ event: tooStrongEvent, enemySrc: art.src, enemyLabel: art.label });
      }
      playSound("bump", mutedRef.current);
    } else if (rescuedEvent) {
      const animal = level.objects.find(
        (object): object is Extract<LevelObject, { kind: "animal" }> => (
          object.kind === "animal" && object.id === rescuedEvent.objectId
        ),
      );
      if (animal && jumpedEvent) {
        const jumpDuration = beginJumpPresentation(jumpedEvent, "jump");
        const jumpSequence = presentationSequence.current;
        const rescueDuration = prefersReducedMotion() ? REDUCED_PRESENTATION_MS : RESCUE_PRESENTATION_MS;
        schedulePresentationTimer(
          jumpSequence,
          () => beginRescuePresentation(rescuedEvent, animal),
          Math.max(100, jumpDuration - 20),
        );
        presentationDuration = Math.max(100, jumpDuration - 20) + rescueDuration;
      } else if (animal) {
        presentationDuration = beginRescuePresentation(rescuedEvent, animal);
      }
    } else if (jumpedEvent) {
      presentationDuration = beginJumpPresentation(jumpedEvent, nextFeedback.sound);
    } else if (portalEvent) {
      clearHeldInput();
      presentationDuration = beginPortalPresentation(portalEvent);
    }
    if (!defeatedEvent && !tooStrongEvent && !rescuedEvent && !jumpedEvent && !portalEvent && (nextFeedback.sound !== "bump" || performance.now() - lastBumpSoundAt.current >= 200)) {
      playSound(nextFeedback.sound, muted);
      if (nextFeedback.sound === "bump") lastBumpSoundAt.current = performance.now();
    }
    if (result.moved) setMovePulse((value) => value + 1);
    else setBumpPulse((value) => value + 1);

    if (result.state.status === "won") {
      const resultAnimalObjects = level.objects.filter(
        (object): object is Extract<LevelObject, { kind: "animal" }> => object.kind === "animal",
      );
      const resultRescuedSpecies = resultAnimalObjects
        .filter((object) => result.state.rescuedAnimalIds.includes(object.id))
        .map((object) => object.species);
      if (testerRun) {
        setCompletion({
          reward: {
            levelId: level.id,
            gold: 0,
            goldBreakdown: { completion: 0, firstCompletion: 0, animalRescue: 0, perfectRescue: 0 },
            stickerIds: [],
          },
          newStickerIds: [],
          newMedalIds: [],
          newBadgeIds: [],
          rescuedSpecies: resultRescuedSpecies,
          totalGold: progress.gold,
          bonusGold: result.state.goldStarsCollected,
          sciencePoints: result.state.sciencePointsCollected,
          testerRun: true,
        });
      } else {
        const firstCompletion = progress.bestResultsByLevel[level.id] === undefined;
        const reward = calculateLevelReward({
          levelId: level.id,
          source: level.source,
          campaignIndex,
          rescuedCount: resultRescuedSpecies.length,
          totalRescueCount: resultAnimalObjects.length,
          firstCompletion,
        });
        const nextProgress = applyLevelCompletion(progress, {
          levelId: level.id,
          source: level.source,
          campaignIndex,
          rescuedCount: resultRescuedSpecies.length,
          totalRescueCount: resultAnimalObjects.length,
          rescuedSpecies: resultRescuedSpecies,
          steps: result.state.steps,
          power: result.state.power,
          bonusGold: result.state.goldStarsCollected,
          sciencePoints: result.state.sciencePointsCollected,
        });
        const newStickerIds = nextProgress.stickers.filter((id) => !progress.stickers.includes(id));
        const newMedalIds = nextProgress.medals.filter((id) => !progress.medals.includes(id));
        const newBadgeIds = nextProgress.badges.filter((id) => !progress.badges.includes(id));
        setProgress(nextProgress);
        writePlayerProgress(nextProgress);
        setCompletion({
          reward,
          newStickerIds,
          newMedalIds,
          newBadgeIds,
          rescuedSpecies: resultRescuedSpecies,
          totalGold: nextProgress.gold,
          bonusGold: result.state.goldStarsCollected,
          sciencePoints: result.state.sciencePointsCollected,
          testerRun: false,
        });
        if (newStickerIds.length > 0 || newMedalIds.length > 0 || newBadgeIds.length > 0) {
          rewardSoundTimer.current = window.setTimeout(() => {
            playSound(newBadgeIds.length > 0 ? "stamp" : "reward", mutedRef.current);
            rewardSoundTimer.current = undefined;
          }, presentationDuration + 520);
        }
      }
    }

    if (inputUnlockTimer.current !== undefined) window.clearTimeout(inputUnlockTimer.current);
    inputUnlockTimer.current = window.setTimeout(() => {
      inputLocked.current = false;
      inputUnlockTimer.current = undefined;
      const nextMove = queuedMove.current;
      queuedMove.current = null;
      if (nextMove) attemptMoveRef.current(nextMove.direction, nextMove.lateralOffset);
    }, presentationDuration || (result.moved ? MOVE_CADENCE_MS : BUMP_CADENCE_MS));
  }, [beginBattlePresentation, beginJumpPresentation, beginPortalPresentation, beginRescuePresentation, blockerHint, campaignIndex, clearHeldInput, explorationMode, game, guidedObjectId, helpOpen, hintOpen, level, muted, pendingAdventure, progress, schedulePresentationTimer, screen, storyOpen, testerPickerOpen, testerRun, tooStrongEncounter]);

  const dismissStory = useCallback(() => {
    setStoryOpen(false);
    playSound("select", mutedRef.current);
    window.setTimeout(() => boardRef.current?.focus(), 0);
  }, []);

  attemptMoveRef.current = attemptMove;

  useEffect(() => {
    const directionForKey = (key: string): Direction | undefined => ({
      ArrowUp: "up", w: "up", W: "up",
      ArrowDown: "down", s: "down", S: "down",
      ArrowLeft: "left", a: "left", A: "left",
      ArrowRight: "right", d: "right", D: "right",
    })[key] as Direction | undefined;

    const scheduleHeldMove = (delay: number) => {
      if (heldKeyTimer.current !== undefined) window.clearTimeout(heldKeyTimer.current);
      heldKeyTimer.current = window.setTimeout(() => {
        const keyId = heldKeyOrder.current.at(-1);
        const direction = keyId ? heldKeys.current.get(keyId) : undefined;
        if (!direction) {
          heldKeyCadence.current = IDLE_HELD_MOVE_CADENCE;
          heldKeyTimer.current = undefined;
          return;
        }
        const cadenceStep = advanceHeldMoveCadence(heldKeyCadence.current, direction);
        heldKeyCadence.current = cadenceStep.cadence;
        attemptMoveRef.current(direction);
        scheduleHeldMove(cadenceStep.nextDelayMs);
      }, delay);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (storyOpen) {
        if (shouldDismissStoryForKey(event)) {
          event.preventDefault();
          dismissStory();
        }
        return;
      }
      if (pendingAdventure !== null || testerPickerOpen) return;
      if (
        event.key === "Escape"
        && screen === "game"
        && bigMaze
        && !helpOpen
        && !hintOpen
        && tooStrongEncounter === null
        && game.status === "playing"
      ) {
        event.preventDefault();
        setBigMaze(false);
        return;
      }
      const direction = directionForKey(event.key);
      if (!direction || screen !== "game" || helpOpen || hintOpen || tooStrongEncounter !== null || testerPickerOpen || game.status !== "playing") return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      event.preventDefault();
      if (event.repeat) return;
      const keyId = event.code || event.key;
      if (heldKeys.current.has(keyId)) return;
      heldKeys.current.set(keyId, direction);
      heldKeyOrder.current = [...heldKeyOrder.current.filter((item) => item !== keyId), keyId];
      heldKeyCadence.current = beginHeldMoveCadence(direction);
      attemptMoveRef.current(direction);
      scheduleHeldMove(HELD_MOVE_INITIAL_DELAY_MS);
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const direction = directionForKey(event.key);
      if (!direction) return;
      const keyId = event.code || event.key;
      heldKeys.current.delete(keyId);
      heldKeyOrder.current = heldKeyOrder.current.filter((item) => item !== keyId);
      const fallbackKey = heldKeyOrder.current.at(-1);
      const fallbackDirection = fallbackKey ? heldKeys.current.get(fallbackKey) : undefined;
      if (fallbackDirection) {
        heldKeyCadence.current = beginHeldMoveCadence(fallbackDirection);
        attemptMoveRef.current(fallbackDirection);
        scheduleHeldMove(HELD_MOVE_INITIAL_DELAY_MS);
      } else {
        if (heldKeyTimer.current !== undefined) {
          window.clearTimeout(heldKeyTimer.current);
          heldKeyTimer.current = undefined;
        }
        heldKeyCadence.current = IDLE_HELD_MOVE_CADENCE;
      }
      if (queuedMove.current?.direction === direction) {
        queuedMove.current = null;
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") clearHeldInput();
    };
    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearHeldInput);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clearHeldInput);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [bigMaze, clearHeldInput, dismissStory, game.status, helpOpen, hintOpen, pendingAdventure, screen, storyOpen, testerPickerOpen, tooStrongEncounter]);

  useEffect(() => {
    if (screen !== "game" || helpOpen || hintOpen || storyOpen || tooStrongEncounter !== null || testerPickerOpen || pendingAdventure !== null || game.status !== "playing") {
      clearHeldInput();
    }
  }, [clearHeldInput, game.status, helpOpen, hintOpen, pendingAdventure, screen, storyOpen, testerPickerOpen, tooStrongEncounter]);

  useEffect(() => () => {
    clearPresentationWork();
    if (inputUnlockTimer.current !== undefined) window.clearTimeout(inputUnlockTimer.current);
    if (heldKeyTimer.current !== undefined) window.clearTimeout(heldKeyTimer.current);
    if (pointerHoldTimer.current !== undefined) window.clearTimeout(pointerHoldTimer.current);
    if (restartTimer.current !== undefined) window.clearTimeout(restartTimer.current);
    if (rewardSoundTimer.current !== undefined) window.clearTimeout(rewardSoundTimer.current);
    disposeMusic();
  }, [clearPresentationWork]);

  const moveDirectionFromPointer = useCallback((clientX: number, clientY: number, previousDirection: Direction | null = null): PointerIntent | null => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const cellWidth = rect.width / cameraWindow.width;
    const cellHeight = rect.height / cameraWindow.height;
    const centerX = rect.left + (game.position.x - cameraWindow.left + 0.5) * cellWidth;
    const centerY = rect.top + (game.position.y - cameraWindow.top + 0.5) * cellHeight;
    return pointerIntentFromTileOffset(
      (clientX - centerX) / cellWidth,
      (clientY - centerY) / cellHeight,
      undefined,
      previousDirection,
    );
  }, [cameraWindow, game.position]);

  pointerDirectionRef.current = moveDirectionFromPointer;

  const schedulePointerHoldRepeat = useCallback((delay: number) => {
    if (pointerHoldTimer.current !== undefined) window.clearTimeout(pointerHoldTimer.current);
    const repeat = () => {
      const pointer = activeBoardPointer.current;
      const intent = pointer
        ? pointerDirectionRef.current(pointer.current.x, pointer.current.y, pointer.direction)
        : null;
      const direction = intent?.direction ?? null;
      if (pointer) {
        pointer.direction = direction;
        if (pointer.pointerType === "touch") {
          setTouchCursor((cursor) => cursor && cursor.direction !== direction
            ? { ...cursor, direction }
            : cursor);
        }
      }
      if (!intent) {
        queuedMove.current = null;
        pointerHoldCadence.current = IDLE_HELD_MOVE_CADENCE;
        pointerHoldTimer.current = undefined;
        return;
      }
      const cadenceStep = advanceHeldMoveCadence(pointerHoldCadence.current, intent.direction);
      pointerHoldCadence.current = cadenceStep.cadence;
      attemptMoveRef.current(intent.direction, intent.lateralOffset);
      pointerHoldTimer.current = window.setTimeout(repeat, cadenceStep.nextDelayMs);
    };
    pointerHoldTimer.current = window.setTimeout(repeat, delay);
  }, []);

  const onBoardPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pointer = activeBoardPointer.current;
    if (!pointer || pointer.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();
    const current = { x: event.clientX, y: event.clientY };
    const intent = pointerDirectionRef.current(current.x, current.y, pointer.direction);
    const direction = intent?.direction ?? null;
    const directionChanged = direction !== pointer.direction;
    pointer.current = current;
    pointer.direction = direction;
    if (pointer.pointerType === "touch") {
      const boardRect = {
        left: pointer.boardLeft,
        top: pointer.boardTop,
        width: pointer.boardWidth,
        height: pointer.boardHeight,
      };
      setTouchCursor({
        origin: normalizedBoardPoint(pointer.origin.x, pointer.origin.y, boardRect),
        current: normalizedBoardPoint(current.x, current.y, boardRect),
        direction,
      });
    }
    if (!directionChanged) return;
    if (pointerHoldTimer.current !== undefined) {
      window.clearTimeout(pointerHoldTimer.current);
      pointerHoldTimer.current = undefined;
    }
    if (!direction) {
      queuedMove.current = null;
      pointerHoldCadence.current = IDLE_HELD_MOVE_CADENCE;
      return;
    }
    pointerHoldCadence.current = beginHeldMoveCadence(direction);
    attemptMoveRef.current(direction, intent?.lateralOffset);
    schedulePointerHoldRepeat(HELD_MOVE_INITIAL_DELAY_MS);
  };

  const onBoardPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    clearBoardPointer();
    const rect = event.currentTarget.getBoundingClientRect();
    const origin = { x: event.clientX, y: event.clientY };
    const intent = pointerDirectionRef.current(origin.x, origin.y);
    const direction = intent?.direction ?? null;
    const pointer: ActiveBoardPointer = {
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      origin,
      boardLeft: rect.left,
      boardTop: rect.top,
      boardWidth: rect.width,
      boardHeight: rect.height,
      current: origin,
      direction,
    };
    activeBoardPointer.current = pointer;
    event.currentTarget.setPointerCapture(event.pointerId);
    if (event.pointerType === "touch") {
      const localOrigin = normalizedBoardPoint(origin.x, origin.y, rect);
      setTouchCursor({ origin: localOrigin, current: localOrigin, direction });
    }
    if (!direction) return;
    pointerHoldCadence.current = beginHeldMoveCadence(direction);
    attemptMoveRef.current(direction, intent?.lateralOffset);
    schedulePointerHoldRepeat(HELD_MOVE_INITIAL_DELAY_MS);
  };

  const finishBoardPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pointer = activeBoardPointer.current;
    if (!pointer || pointer.pointerId !== event.pointerId) return;
    event.preventDefault();
    clearBoardPointer();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const scheduleDpadRepeat = useCallback((delay: number) => {
    if (dpadHoldTimer.current !== undefined) window.clearTimeout(dpadHoldTimer.current);
    const repeat = () => {
      const direction = dpadHoldDirection.current;
      if (!direction) {
        dpadHoldCadence.current = IDLE_HELD_MOVE_CADENCE;
        dpadHoldTimer.current = undefined;
        return;
      }
      const cadenceStep = advanceHeldMoveCadence(dpadHoldCadence.current, direction);
      dpadHoldCadence.current = cadenceStep.cadence;
      attemptMoveRef.current(direction);
      dpadHoldTimer.current = window.setTimeout(repeat, cadenceStep.nextDelayMs);
    };
    dpadHoldTimer.current = window.setTimeout(repeat, delay);
  }, []);

  const startDpadHold = (event: ReactPointerEvent<HTMLButtonElement>, direction: Direction) => {
    if (!event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    clearDpadHold();
    dpadHoldDirection.current = direction;
    dpadHoldPointerId.current = event.pointerId;
    dpadHoldCadence.current = beginHeldMoveCadence(direction);
    event.currentTarget.setPointerCapture(event.pointerId);
    attemptMoveRef.current(direction);
    scheduleDpadRepeat(HELD_MOVE_INITIAL_DELAY_MS);
  };

  const stopDpadHold = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (dpadHoldPointerId.current !== event.pointerId) return;
    const releasedDirection = dpadHoldDirection.current;
    clearDpadHold();
    if (queuedMove.current?.direction === releasedDirection) {
      queuedMove.current = null;
    }
  };

  const armRestart = () => {
    if (restartArmed) {
      playSound("select", muted);
      loadLevel(level);
      return;
    }
    playSound("bump", muted);
    setRestartArmed(true);
    setFeedback({ icon: ASSETS.navRestart, text: "Tap restart once more.", tone: "plain", sound: "bump" });
    if (restartTimer.current !== undefined) window.clearTimeout(restartTimer.current);
    restartTimer.current = window.setTimeout(() => setRestartArmed(false), 2200);
  };

  const makeSurprise = () => {
    const settings = surpriseSettings(progress);
    return generateSurpriseMaze({
      seed: `ame-${Date.now().toString(36)}`,
      size: settings.size,
      difficulty: settings.difficulty,
    });
  };

  const enterLevel = (
    nextLevel: LevelDefinition,
    sound: "select" | "title" = "select",
    mode: RunMode = "normal",
  ) => {
    preloadLevelArt(nextLevel);
    preloadRewardArt();
    configureMusic({ trackUrl: musicTrackForLevel(nextLevel) });
    setMusicMuted(muted);
    if (!muted) void startMusicFromUserGesture();
    setRunMode(mode);
    loadLevel(nextLevel);
    setStoryOpen(mode === "normal" && nextLevel.source === "curated");
    setHasActiveRun(true);
    setScreen("game");
    playSound(sound, muted);
  };

  const resumeRun = () => {
    preloadLevelArt(level);
    configureMusic({ trackUrl: musicTrackForLevel(level) });
    setMusicMuted(muted);
    if (!muted) void startMusicFromUserGesture();
    setPendingAdventure(null);
    setStoryOpen(false);
    setScreen("game");
    playSound("select", muted);
  };

  const replayLevel = () => {
    playSound("select", muted);
    setHasActiveRun(true);
    setStoryOpen(false);
    loadLevel(level);
  };

  const openStory = (trigger?: HTMLElement) => {
    if (!levelStory) return;
    modalReturnFocus.current = trigger
      ?? (document.activeElement instanceof HTMLElement ? document.activeElement : boardRef.current);
    clearHeldInput();
    setStoryOpen(true);
    playSound("menu", muted);
  };

  const closeHelp = () => {
    setHelpOpen(false);
    playSound("menu", muted);
  };

  const openHint = (trigger: HTMLElement) => {
    modalReturnFocus.current = trigger;
    setHintOpen(true);
    playSound("menu", muted);
  };

  const closeHint = () => {
    setHintOpen(false);
    setStoryOpen(false);
    playSound("menu", muted);
  };

  const closeBlockerHint = () => {
    setBlockerHint(null);
    playSound("menu", muted);
  };

  const dismissTooStrongEncounter = () => {
    setTooStrongEncounter(null);
    setFeedback({ icon: ASSETS.potion, text: "Let’s find more Power, then come back!", tone: "plain", sound: "menu" });
    playSound("menu", muted);
  };

  const closePendingAdventure = () => {
    setPendingAdventure(null);
    playSound("menu", muted);
  };

  const openResetProgress = (trigger: HTMLElement) => {
    modalReturnFocus.current = trigger;
    setResetProgressOpen(true);
    playSound("menu", muted);
  };

  const closeResetProgress = () => {
    setResetProgressOpen(false);
    playSound("menu", muted);
  };

  const openTesterPicker = () => {
    modalReturnFocus.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    setTesterPickerOpen(true);
    playSound("menu", muted);
  };

  const closeTesterPicker = () => {
    setTesterPickerOpen(false);
    playSound("menu", muted);
  };

  const openLevelPicker = (trigger?: HTMLElement) => {
    modalReturnFocus.current = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setLevelPickerOpen(true);
    playSound("menu", muted);
  };

  const closeLevelPicker = () => {
    setLevelPickerOpen(false);
    playSound("menu", muted);
  };

  const enterTesterLevel = (nextLevel: LevelDefinition) => {
    setTesterPickerOpen(false);
    setLevelPickerOpen(false);
    enterLevel(nextLevel, "select", "tester");
    setFeedback({
      icon: ASSETS.navMazes,
      text: `Tester preview: ${nextLevel.name}. Rewards stay unchanged.`,
      tone: "plain",
      sound: "select",
    });
  };

  const toggleBigMaze = () => {
    setBigMaze((value) => !value);
    playSound("select", muted);
  };

  const requestEnterLevel = (nextLevel: LevelDefinition, sound: "select" | "title" = "select") => {
    if (runInProgress && nextLevel.id === level.id) {
      resumeRun();
      return;
    }
    if (shouldConfirmMazeSwitch({
      hasActiveRun,
      status: game.status,
      steps: game.steps,
      currentLevelId: level.id,
    }, nextLevel.id)) {
      modalReturnFocus.current = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
      setPendingAdventure({ level: nextLevel, sound });
      playSound("menu", muted);
      return;
    }
    enterLevel(nextLevel, sound);
  };

  const continueStory = () => {
    const storyIndex = getNextStoryIndex(progress, CURATED_LEVELS.map((storyLevel) => storyLevel.id));
    const nextStory = CURATED_LEVELS[storyIndex] ?? CURATED_LEVELS[0];
    if (nextStory) enterLevel(nextStory, "title");
  };

  const showTitle = () => {
    cancelPresentations();
    clearHeldInput();
    if (inputUnlockTimer.current !== undefined) window.clearTimeout(inputUnlockTimer.current);
    inputUnlockTimer.current = undefined;
    inputLocked.current = false;
    mazeMusicPicker.noteTrackStarted(MUSIC_TRACKS.title);
    configureMusic({ trackUrl: MUSIC_TRACKS.title });
    setMusicMuted(muted);
    if (!muted) void startMusicFromUserGesture();
    setHelpOpen(false);
    setHintOpen(false);
    setStoryOpen(false);
    setBlockerHint(null);
    setTooStrongEncounter(null);
    setTesterPickerOpen(false);
    setBigMaze(false);
    setScreen("title");
    playSound("menu", muted);
  };

  const showAchievements = () => {
    cancelPresentations();
    clearHeldInput();
    if (inputUnlockTimer.current !== undefined) window.clearTimeout(inputUnlockTimer.current);
    inputUnlockTimer.current = undefined;
    inputLocked.current = false;
    preloadAchievementArt();
    mazeMusicPicker.noteTrackStarted(MUSIC_TRACKS.title);
    configureMusic({ trackUrl: MUSIC_TRACKS.title });
    setMusicMuted(muted);
    if (!muted) void startMusicFromUserGesture();
    setHelpOpen(false);
    setHintOpen(false);
    setTooStrongEncounter(null);
    setBigMaze(false);
    setScreen("achievements");
    playSound("achievement", muted);
  };

  const confirmResetProgress = () => {
    const firstLevel = CURATED_LEVELS[0];
    if (!firstLevel) return;

    setProgress(resetAllGameProgress());
    setRunMode("normal");
    setHasActiveRun(false);
    setResetProgressOpen(false);
    loadLevel(firstLevel);
    showTitle();
  };

  const toggleSound = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    setMusicMuted(nextMuted);
    if (!nextMuted) {
      void startMusicFromUserGesture();
      playSound("title", false);
    }
  };

  const nextLevel = () => {
    if (testerRun) {
      const nextIndex = campaignIndex >= 0 ? (campaignIndex + 1) % CURATED_LEVELS.length : 0;
      enterLevel(CURATED_LEVELS[nextIndex]!, "select", "tester");
      return;
    }
    if (campaignIndex >= 0 && campaignIndex + 1 < CURATED_LEVELS.length) {
      enterLevel(CURATED_LEVELS[campaignIndex + 1]!);
    } else {
      enterLevel(makeSurprise());
    }
  };

  const firstMoveNudge = campaignIndex === 0
    && runMode === "normal"
    && game.status === "playing"
    && game.steps === 0
    && progress.bestResultsByLevel[level.id] === undefined;
  const suggestedMoveDirection = firstMoveNudge
    ? (["left", "right", "up", "down"] as const).find(
      (direction) => previewKind(level, game, direction) === "go",
    ) ?? null
    : null;
  const currentHint = hintFor(level, game);
  const ownedCollectibles = [
    ...progress.stickers.slice(-3).map((id) => ({ id, label: STICKER_LABELS[id].label, art: stickerArt(id) })),
    ...progress.medals.slice(-2).map((id) => ({ id, label: ACHIEVEMENT_LABELS[id].label, art: medalArt(id) })),
    ...progress.badges.slice(-2).map((id) => ({ id, label: BADGE_LABELS[id].label, art: badgeArt(id) })),
  ];
  const newCollectibles = completion ? [
    ...completion.newStickerIds.map((id) => ({ id, label: STICKER_LABELS[id].label, art: stickerArt(id), kind: "New sticker" })),
    ...completion.newMedalIds.map((id) => ({ id, label: ACHIEVEMENT_LABELS[id].label, art: medalArt(id), kind: "New medal" })),
    ...completion.newBadgeIds.map((id) => ({ id, label: BADGE_LABELS[id].label, art: badgeArt(id), kind: "New badge" })),
  ] : [];
  const treasureFlightStyle = treasurePresentation ? (() => {
    const startX = 18 + ((treasurePresentation.at.x - cameraWindow.left + 0.5) / cameraWindow.width) * 626;
    const startY = 42 + ((treasurePresentation.at.y - cameraWindow.top + 0.5) / cameraWindow.height) * 438;
    const targetX = treasurePresentation.currency === "gold" ? 735 : 850;
    const targetY = 30;
    return {
      left: `${startX}px`,
      top: `${startY}px`,
      "--treasure-fly-x": `${targetX - startX}px`,
      "--treasure-fly-y": `${targetY - startY}px`,
    } as CSSProperties;
  })() : undefined;

  return (
    <main ref={appFrameRef} className="app-frame">
      <div
        className="game-stage-slot"
        style={{ "--stage-scale": stageScale } as CSSProperties}
      >
        <section
          className={`game-stage screen-${screen}`}
          aria-label="Maze so Puzzle game"
          data-logical-size={`${LOGICAL_STAGE_WIDTH}x${LOGICAL_STAGE_HEIGHT}`}
          style={screen === "game" ? { touchAction: "none", userSelect: "none", WebkitUserSelect: "none" } : undefined}
        >
        {screen === "title" ? (
          <TitleScreen
            progress={progress}
            activeRun={runInProgress ? { name: level.name, steps: game.steps } : null}
            blocked={pendingAdventure !== null || resetProgressOpen || testerPickerOpen || levelPickerOpen}
            muted={muted}
            playRef={titlePlayRef}
            onPlay={runInProgress ? resumeRun : continueStory}
            onSurprise={() => requestEnterLevel(makeSurprise(), "title")}
            onAchievements={showAchievements}
            onChooseMaze={(trigger) => openLevelPicker(trigger)}
            onRequestReset={openResetProgress}
            onOpenTester={openTesterPicker}
            onToggleSound={toggleSound}
          />
        ) : screen === "achievements" ? (
          <AchievementsScreen
            progress={progress}
            unlocked={unlocked}
            activeRun={runInProgress ? { levelId: level.id, name: level.name, steps: game.steps } : null}
            blocked={pendingAdventure !== null || resetProgressOpen || testerPickerOpen || levelPickerOpen}
            headingRef={achievementsHeadingRef}
            muted={muted}
            onHome={showTitle}
            onResume={resumeRun}
            onPlayLevel={requestEnterLevel}
            onSurprise={() => requestEnterLevel(makeSurprise())}
            onRequestReset={openResetProgress}
            onToggleSound={toggleSound}
          />
        ) : (
          <>
        <h1 className="sr-only">Maze so Puzzle: For Ame to Solve!</h1>
        <div className="ambient-star star-one" aria-hidden="true">✦</div>
        <div className="ambient-star star-two" aria-hidden="true">✧</div>

        <div className={`game-layout${bigMaze ? " big-maze" : ""}`} inert={modalOpen ? true : undefined} aria-hidden={modalOpen || undefined}>
          {treasurePresentation && (
            <div className={`treasure-flight treasure-flight-${treasurePresentation.currency}`} style={treasureFlightStyle} aria-hidden="true">
              <img src={treasurePresentation.currency === "gold" ? ASSETS.treasureGoldChest : ASSETS.treasureScienceGears} alt="" />
              {Array.from({ length: 8 }, (_, index) => <i key={index} style={{ "--mote": index } as CSSProperties}>{treasurePresentation.currency === "gold" ? "★" : "✦"}</i>)}
              <b>+{treasurePresentation.amount}</b>
            </div>
          )}
          <section className="maze-panel" aria-label={`${level.name} maze`}>
            <div className="maze-topline">
              <div>
                <span className="level-kicker">{isSurprise ? `${level.width} × ${level.height} surprise maze` : `Story maze ${campaignIndex + 1} of ${CURATED_LEVELS.length}${explorationMode ? ` · ${level.width} × ${level.height}` : ""}`}</span>
                <h2>{level.name}</h2>
              </div>
              <div className="maze-topline-actions">
                {bigMaze && (
                  <div
                    className="big-maze-hud"
                    aria-label={`${level.name}. Power ${displayedPower}. ${rescuedSpecies.length} of ${animalObjects.length} friends rescued. ${game.hasSword ? `${weaponArt.label} found.` : objectKinds.has("sword") ? `${weaponArt.label} not found.` : ""} ${game.hasBoots ? "Splash boots found." : objectKinds.has("boots") ? "Splash boots not found." : ""} ${game.hasSpringBoots ? "Spring boots found." : objectKinds.has("spring-boots") ? "Spring boots not found." : ""} ${game.hasAntidoteLeaf ? "Antidote leaf found." : objectKinds.has("antidote-leaf") ? "Antidote leaf not found." : ""} ${game.keys.length} of ${keyColors.length} keys found.`}
                  >
                    <strong>{level.name}</strong>
                    <span><img src={ASSETS.potion} alt="" /> {displayedPower}</span>
                    <span><img src={ASSETS.rewardAnimalFriendSticker} alt="" /> {rescuedSpecies.length}/{animalObjects.length}</span>
                    {objectKinds.has("sword") && <span className={game.hasSword ? "found" : "missing"} title={game.hasSword ? `${weaponArt.label} found` : `${weaponArt.label} not found`}><img src={weaponArt.src} alt="" /></span>}
                    {objectKinds.has("boots") && <span className={game.hasBoots ? "found" : "missing"} title={game.hasBoots ? "Splash boots found" : "Splash boots not found"}><img src={ASSETS.boots} alt="" /></span>}
                    {objectKinds.has("spring-boots") && <span className={game.hasSpringBoots ? "found" : "missing"} title={game.hasSpringBoots ? "Spring boots found" : "Spring boots not found"}><img src={ASSETS.springBoots} alt="" /></span>}
                    {objectKinds.has("antidote-leaf") && <span className={game.hasAntidoteLeaf ? "found" : "missing"} title={game.hasAntidoteLeaf ? "Antidote leaf found" : "Antidote leaf not found"}><img src={ASSETS.antidoteLeaf} alt="" /></span>}
                    {keyColors.length > 0 && <span className={game.keys.length === keyColors.length ? "found" : "missing"}><img src={ASSETS.key} alt="" /> {game.keys.length}/{keyColors.length}</span>}
                  </div>
                )}
                {explorationMode && <span className="exploration-view-pill" title="Ame explores six tiles at a time"><img src={ASSETS.navMazes} alt="" /> 6 × 6 view</span>}
                {testerToolsEnabled && (
                  <button
                    className="tester-skip-button"
                    onClick={openTesterPicker}
                    title="Open the tester maze picker"
                    aria-label={`Open tester maze picker. Current maze ${campaignIndex >= 0 ? campaignIndex + 1 : "is a surprise"} of ${CURATED_LEVELS.length}. Tester rewards and progress are off.`}
                  ><img src={ASSETS.navMazes} alt="" /><span>Pick maze</span></button>
                )}
                {levelStory && (
                  <button
                    className="story-replay-button"
                    onClick={(event) => openStory(event.currentTarget)}
                    aria-label={"Read chapter " + levelStory.chapter + ": " + levelStory.title}
                    title="Read this maze's story"
                  ><img src={ASSETS.navBook} alt="" /><span>Story</span></button>
                )}
                <button className="big-maze-button" aria-pressed={bigMaze} onClick={toggleBigMaze} title="Make the maze larger">{bigMaze ? "↙ Normal" : "⛶ Big maze"}</button>
                <button className="surprise-button" onClick={() => requestEnterLevel(makeSurprise())} title="Make a new solvable maze"><img src={ASSETS.rewardSurpriseSparkleSticker} alt="" /> New maze</button>
                <div className="step-pill" aria-label={`${game.steps} ${game.steps === 1 ? "step" : "steps"}`}><img src={ASSETS.boots} alt="" />{game.steps}</div>
              </div>
            </div>

            <div
              ref={boardRef}
              className={`maze-board${explorationMode ? " exploration-camera" : ""} ${bumpPulse % 2 ? "bump-a" : "bump-b"}${battlePresentation ? " battle-active" : ""}${rescuePresentation ? " rescue-active" : ""}${jumpPresentation ? " jump-active" : ""}${portalPresentation ? " portal-active" : ""}`}
              data-terrain-theme={terrainTheme.id}
              style={{
                gridTemplateColumns: `repeat(${cameraWindow.width}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${cameraWindow.height}, minmax(0, 1fr))`,
                "--grid-size": cameraWindow.width,
                "--cast-shadow-x": `${mazeLight.x * 5}px`,
                "--cast-shadow-y": `${mazeLight.y * 4}px`,
                backgroundColor: terrainTheme.floor.fallbackColor,
                touchAction: "none",
                ...(battlePresentation ? {
                  "--battle-focus-x": `${((battlePresentation.at.x - cameraWindow.left + 0.5) / cameraWindow.width) * 100}%`,
                  "--battle-focus-y": `${((battlePresentation.at.y - cameraWindow.top + 0.5) / cameraWindow.height) * 100}%`,
                  "--battle-duration": `${battlePresentation.durationMs}ms`,
                } : {}),
              } as CSSProperties}
              role="application"
              aria-label="Maze board. Use arrow keys, W A S D, the arrow buttons, or press and steer a mouse or finger in a direction from Ame."
              aria-describedby="maze-status"
              aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight W A S D"
              tabIndex={0}
              onPointerMove={onBoardPointerMove}
              onPointerDown={onBoardPointerDown}
              onPointerUp={finishBoardPointer}
              onPointerCancel={finishBoardPointer}
              onLostPointerCapture={finishBoardPointer}
              onContextMenu={(event) => event.preventDefault()}
            >
              <div className="camera-world" style={cameraWorldStyle(level, cameraWindow)} aria-hidden="true">
                <MazeTerrain level={level} camera={fullLevelWindow(level)} />

                {worldObjects.map((object) => (
                  <div
                    className={`object-layer object-kind-${object.kind}${object.at.y === cameraWindow.top ? " camera-edge-top" : ""}`}
                    data-animal-motion={object.kind === "animal" ? animalPersonality(object.species).motion : undefined}
                    data-flourish={object.kind === "animal"
                      ? animalPersonality(object.species).flourish
                      : object.kind === "enemy"
                        ? enemyPersonality(object.style).flourish
                        : undefined}
                    data-enemy-motion={object.kind === "enemy" ? enemyPersonality(object.style).motion : undefined}
                    key={object.id}
                    style={worldLayerStyle(object.at, level)}
                  >
                    {object.kind === "animal" ? (
                      <div
                        className="animal-stack"
                        data-flourish={animalPersonality(object.species).flourish}
                      >
                        <img className="animal-sprite" src={animalArt(object.species)} alt="" draggable={false} />
                        <img className="animal-cage" src={resolveCageArt(object.cageStyle).src} alt="" draggable={false} />
                      </div>
                    ) : (
                      <img className={classForObject(object)} src={spriteFor(object)} alt="" draggable={false} />
                    )}
                    {object.kind === "enemy" && <span className="power-badge enemy-power">{object.power}</span>}
                    {object.kind === "potion" && <span className="item-amount">+{object.amount}</span>}
                    {object.kind === "treasure" && <span className="item-amount treasure-amount">+{object.amount}</span>}
                    {(object.kind === "key" || object.kind === "door") && (
                      <span className={`object-color-name color-name-${object.color}`}>{KEY_MOTIF_LABELS[object.color]}</span>
                    )}
                    {object.kind === "portal" && (
                      <span className={`portal-pair-name portal-name-${object.pair}`}>{resolvePortalArt(object.pair).motif}</span>
                    )}
                  </div>
                ))}

                {followerPlacements.length > 0 && (
                  <div className="pet-followers">
                    {followerPlacements.map(({ animal, point }) => (
                      <div
                        className="pet-follower"
                        data-animal-motion={animalPersonality(animal.species).motion}
                        data-flourish={animalPersonality(animal.species).flourish}
                        style={worldLayerStyle(point, level)}
                        key={animal.id}
                      >
                        <img src={animalArt(animal.species)} alt="" draggable={false} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {touchCursor && (
                <div
                  className={`touch-joystick${touchCursor.direction ? " active" : ""}`}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    zIndex: 40,
                    inset: 0,
                    pointerEvents: "none",
                    "--touch-origin-x": `${touchCursor.origin.x * 100}%`,
                    "--touch-origin-y": `${touchCursor.origin.y * 100}%`,
                    "--touch-cursor-x": `${touchCursor.current.x * 100}%`,
                    "--touch-cursor-y": `${touchCursor.current.y * 100}%`,
                  } as CSSProperties}
                >
                  <i
                    className="touch-joystick-origin"
                    style={{ position: "absolute", left: "var(--touch-origin-x)", top: "var(--touch-origin-y)", transform: "translate(-50%, -50%)" }}
                  />
                  <i
                    className="touch-joystick-cursor"
                    style={{ position: "absolute", left: "var(--touch-cursor-x)", top: "var(--touch-cursor-y)", transform: "translate(-50%, -50%)" }}
                  >{touchCursor.direction ? DIRECTION_ICONS[touchCursor.direction] : "✦"}</i>
                </div>
              )}

              {battlePresentation && isInsideWindow(battlePresentation.at, cameraWindow) && (
                <div
                  className="battle-presentation battle-won"
                  data-sfx-cue="three-clashes-power-transfer-and-victory"
                  aria-hidden="true"
                  style={{
                    "--battle-x": `${DIRECTION_DELTAS[battlePresentation.direction].x * 46}%`,
                    "--battle-y": `${DIRECTION_DELTAS[battlePresentation.direction].y * 46}%`,
                    "--battle-back-x": `${DIRECTION_DELTAS[battlePresentation.direction].x * -46}%`,
                    "--battle-back-y": `${DIRECTION_DELTAS[battlePresentation.direction].y * -46}%`,
                    "--battle-recoil-x": `${DIRECTION_DELTAS[battlePresentation.direction].x * -24}%`,
                    "--battle-recoil-y": `${DIRECTION_DELTAS[battlePresentation.direction].y * -24}%`,
                    "--battle-duration": `${battlePresentation.durationMs}ms`,
                    "--power-flight-x": `${(battlePresentation.from.x - battlePresentation.at.x) * 100}%`,
                    "--power-flight-y": `${(battlePresentation.from.y - battlePresentation.at.y) * 100}%`,
                  } as CSSProperties}
                >
                  <div className="battle-combatant battle-ame" style={cameraLayerStyle(battlePresentation.from, cameraWindow)}>
                    <img className="battle-sprite" src={ASSETS.ame} alt="" draggable={false} />
                    {game.hasSword && <img className="battle-held-weapon" src={weaponArt.src} alt="" draggable={false} />}
                    <span className="power-badge player-power">{displayedPower}</span>
                  </div>
                  <div className="battle-combatant battle-enemy" style={cameraLayerStyle(battlePresentation.at, cameraWindow)}>
                    <img className="battle-sprite" src={battlePresentation.enemySrc} alt="" draggable={false} />
                    <span className="power-badge enemy-power">{presentedEnemyPower ?? battlePresentation.enemyPower}</span>
                  </div>
                  <div
                    className="battle-impact"
                    style={cameraLayerStyle({
                      x: (battlePresentation.from.x + battlePresentation.at.x) / 2,
                      y: (battlePresentation.from.y + battlePresentation.at.y) / 2,
                    }, cameraWindow)}
                  >
                    <b>✦</b>
                    {Array.from({ length: 12 }, (_, index) => (
                      <i style={{ "--spark-angle": `${index * 30}deg` } as CSSProperties} key={index} />
                    ))}
                  </div>
                  <span
                    className="battle-power-transfer"
                    style={cameraLayerStyle(battlePresentation.at, cameraWindow)}
                  >
                    {Array.from({ length: Math.max(3, battlePresentation.clashCount * 2) }, (_, index) => (
                      <i
                        style={{ "--mote-delay": `${385 + index * 220}ms` } as CSSProperties}
                        key={index}
                      >✦</i>
                    ))}
                  </span>
                </div>
              )}

              {rescuePresentation && isInsideWindow(rescuePresentation.at, cameraWindow) && (
                <div
                  className="rescue-presentation"
                  data-animal-motion={animalPersonality(rescuePresentation.species).motion}
                  data-flourish={animalPersonality(rescuePresentation.species).flourish}
                  data-sfx-cue="cage-pop-and-friend-cheer"
                  style={cameraLayerStyle(rescuePresentation.at, cameraWindow)}
                  aria-hidden="true"
                >
                  <img className="rescue-presentation-pet" src={animalArt(rescuePresentation.species)} alt="" draggable={false} />
                  <span className="rescue-cage-half cage-half-left"><img src={rescuePresentation.cageSrc} alt="" draggable={false} /></span>
                  <span className="rescue-cage-half cage-half-right"><img src={rescuePresentation.cageSrc} alt="" draggable={false} /></span>
                  <span className="rescue-happy-burst">
                    {Array.from({ length: 7 }, (_, index) => (
                      <i style={{ "--heart-index": index } as CSSProperties} key={index}>{index % 2 ? "✦" : "♥"}</i>
                    ))}
                  </span>
                </div>
              )}

              {jumpPresentation && (
                <div
                  className="jump-presentation"
                  data-sfx-cue="spring-boots-boing"
                  data-hole-count={jumpPresentation.holeCount}
                  style={{
                    ...cameraLayerStyle(jumpPresentation.from, cameraWindow),
                    "--jump-x": `${(jumpPresentation.to.x - jumpPresentation.from.x) * 100}%`,
                    "--jump-y": `${(jumpPresentation.to.y - jumpPresentation.from.y) * 100}%`,
                    "--jump-duration": `${jumpPresentation.durationMs}ms`,
                    "--jump-apex": `${jumpPresentation.apexPercent}%`,
                    "--jump-descent": `${jumpPresentation.descentPercent}%`,
                  } as CSSProperties}
                  aria-hidden="true"
                >
                  <i className="jump-presentation-shadow" />
                  <div className="jump-presentation-body">
                    <img className="jump-presentation-sprite" src={ASSETS.ame} alt="" draggable={false} />
                    <img className="jump-presentation-boots" src={ASSETS.springBoots} alt="" draggable={false} />
                    {game.hasSword && <img className="jump-presentation-weapon" src={weaponArt.src} alt="" draggable={false} />}
                    <span className="power-badge player-power">{displayedPower}</span>
                    <i className="jump-spring-squash" />
                  </div>
                </div>
              )}

              {portalPresentation && (
                <div
                  className={`portal-presentation portal-${portalPresentation.pair}`}
                  style={cameraLayerStyle(portalPresentation.to, cameraWindow)}
                  data-sfx-cue="magic-flower-whoosh"
                  aria-hidden="true"
                >
                  <img className="portal-presentation-pad" src={resolvePortalArt(portalPresentation.pair).src} alt="" draggable={false} />
                  <span className="portal-presentation-rings"><i /><i /><i /></span>
                  <div className="portal-presentation-body">
                    <img className="portal-presentation-sprite" src={ASSETS.ame} alt="" draggable={false} />
                    {game.hasSword && <img className="portal-presentation-weapon" src={weaponArt.src} alt="" draggable={false} />}
                    <span className="power-badge player-power">{displayedPower}</span>
                  </div>
                  <span className="portal-presentation-sparkles">✦ <b>{resolvePortalArt(portalPresentation.pair).motif}</b> ✦</span>
                </div>
              )}

              <div
                className={`player-layer ${movePulse % 2 ? "move-a" : "move-b"}${game.position.y === cameraWindow.top ? " camera-edge-top" : ""}${battlePresentation || jumpPresentation || portalPresentation ? " presentation-hidden" : ""}${displayedPower >= 99 ? " power-legendary" : ""}`}
                style={cameraLayerStyle(game.position, cameraWindow)}
                aria-hidden="true"
              >
                <img className="player-sprite" src={ASSETS.ame} alt="" draggable={false} />
                {game.hasSword && <img className="player-held-weapon" src={weaponArt.src} alt="" draggable={false} />}
                <span className="power-badge player-power">{displayedPower}</span>
              </div>

              {mapPickupToast && (
                <div className="map-pickup-toast" key={mapPickupToast.id} role="status" aria-live="polite" aria-atomic="true">
                  <img src={mapPickupToast.icon} alt="" />
                  <strong>{mapPickupToast.text}</strong>
                </div>
              )}
            </div>

            {explorationMode && bigMaze && (
              <div className="big-maze-minimap">
                <MiniMap
                  level={level}
                  position={game.position}
                  camera={cameraWindow}
                  revealed={revealedTiles}
                  currentView={currentViewTiles}
                  objects={activeObjects}
                  newExplorer={game.steps === 0}
                  highlightedObjectId={guidedObjectId}
                  compact
                />
              </div>
            )}

            <p className="sr-only" id="maze-status">{mazeStatus}</p>

            <div className={`feedback-bar tone-${feedback.tone}`} aria-live={mapPickupToast ? "off" : "polite"} aria-atomic="true">
              <img className="feedback-icon" src={feedback.icon} alt="" />
              <span>{feedback.text}</span>
            </div>
          </section>

          <aside className="sidebar" aria-label="Ame and adventure bag">
            <div className="brand-and-wallet">
              <div className={`wallet-pill${treasurePresentation?.currency === "gold" ? " receiving-treasure" : ""}`} title="Gold Stars found in mazes and earned from victories.">
                <img className="wallet-pouch" src={ASSETS.coinPouch} alt="" />
                <span className="wallet-copy"><small>Gold Stars</small><strong>{displayedGold}</strong></span>
              </div>
              <div className={`wallet-pill science-wallet${treasurePresentation?.currency === "science" ? " receiving-treasure" : ""}`} title="Science Points found while exploring curious side paths.">
                <img className="wallet-pouch" src={ASSETS.treasureScienceGears} alt="" />
                <span className="wallet-copy"><small>Science</small><strong>{displayedScience}</strong></span>
              </div>
            </div>

            <section
              className={`hero-card${battlePresentation ? " power-rising" : ""}${displayedPower >= 99 ? " power-legendary" : ""}`}
              style={battlePresentation
                ? { "--battle-duration": `${battlePresentation.durationMs}ms` } as CSSProperties
                : undefined}
            >
              <div className="portrait-wrap">
                <img src={ASSETS.portrait} alt="Ame, a smiling blonde adventurer with a lavender backpack" />
                <span className="portrait-spark sparkle-a" aria-hidden="true">✦</span>
                <span className="portrait-spark sparkle-b" aria-hidden="true">✧</span>
              </div>
              <div className="hero-copy">
                <span className="tiny-label">Ame's Power</span>
                <strong className="big-power">{displayedPower}</strong>
                <span className="power-help">Match or beat wins!</span>
              </div>
            </section>

            <div className={`adventure-dashboard${explorationMode ? " exploration-dashboard" : ""}`}>
              {explorationMode && !bigMaze && (
                <MiniMap
                  level={level}
                  position={game.position}
                  camera={cameraWindow}
                  revealed={revealedTiles}
                  currentView={currentViewTiles}
                  objects={activeObjects}
                  newExplorer={game.steps === 0}
                  highlightedObjectId={guidedObjectId}
                />
              )}
              <div className="adventure-details">
                <section className="objective-card">
                  <img className="objective-icon" src={ASSETS.goal} alt="" />
                  <div>
                    <span className="tiny-label">Right now</span>
                    <strong>{level.objective}</strong>
                    {levelStory && <small className="puzzle-power-line">Puzzle power: {levelStory.puzzlePower}</small>}
                  </div>
                  <button
                    className="objective-hint-button"
                    onClick={(event) => openHint(event.currentTarget)}
                    aria-label="Show a gentle hint for this maze"
                    title="Show a gentle hint"
                  ><img src={ASSETS.navHelp} alt="" /><b>Hint</b></button>
                </section>

                <section className="rescue-card" aria-label={`${rescuedSpecies.length} of ${animalObjects.length} animal friends rescued`}>
                  <div className="rescue-heading">
                    <div><span className="tiny-label">Optional adventure</span><strong>Rescue the friends</strong></div>
                    <span className="rescue-count">{rescuedSpecies.length}/{animalObjects.length}</span>
                  </div>
                  <div className={`rescue-list rescue-count-${Math.min(5, animalObjects.length)}`}>
                    {animalObjects.map((animal) => {
                      const rescued = game.rescuedAnimalIds.includes(animal.id);
                      return (
                        <div className={`rescue-friend ${rescued ? "rescued" : ""}`} key={animal.id} aria-label={`${ANIMAL_LABELS[animal.species]}: ${rescued ? "rescued" : "waiting in the maze"}`} title={`${ANIMAL_LABELS[animal.species]}: ${rescued ? "rescued" : "waiting in the maze"}`}>
                          <div className="rescue-icon">
                            <img src={animalArt(animal.species)} alt="" decoding="async" />
                            {!rescued && <img className="cage-mini" src={resolveCageArt(animal.cageStyle).src} alt="" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="bag-card" aria-label="Adventure bag">
                  <div className="section-heading">
                    <div><strong>Adventure bag</strong></div>
                    <span className="bag-count">{game.collectedObjectIds.length}</span>
                  </div>
                  <div className="inventory-grid">
                    {objectKinds.has("sword") && <InventorySlot label={weaponArt.label} image={weaponArt.src} found={game.hasSword} />}
                    {objectKinds.has("boots") && <InventorySlot label="Splash boots" image={ASSETS.boots} found={game.hasBoots} />}
                    {objectKinds.has("spring-boots") && <InventorySlot label="Spring boots" image={ASSETS.springBoots} found={game.hasSpringBoots} />}
                    {objectKinds.has("antidote-leaf") && <InventorySlot label="Antidote leaf" image={ASSETS.antidoteLeaf} found={game.hasAntidoteLeaf} />}
                    {keyColors.map((color) => (
                      <InventorySlot key={color} label={resolveKeyArt(color).label} image={resolveKeyArt(color).src} found={game.keys.includes(color)} />
                    ))}
                    {!objectKinds.has("sword") && !objectKinds.has("boots") && !objectKinds.has("spring-boots") && !objectKinds.has("antidote-leaf") && keyColors.length === 0 && (
                      <div className="empty-bag"><img src={ASSETS.coinPouch} alt="" /><strong>Bag ready!</strong></div>
                    )}
                  </div>
                  {ownedCollectibles.length > 0 && (
                    <div className="collection-strip owned-collection" aria-label="Ame's stickers, medals, and badges">
                      {ownedCollectibles.map((item) => (
                        <div className="collection-item owned" key={item.id} title={item.label}><img src={item.art} alt={item.label} /></div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </div>

            <section className="controls-card">
              <div className="controls-copy">
                <span className="tiny-label">{firstMoveNudge ? "Your first step" : "Move one square"}</span>
                <strong>
                  {firstMoveNudge
                    ? <>Try the glowing {suggestedMoveDirection ? DIRECTION_ICONS[suggestedMoveDirection] : "arrow"} button!</>
                    : <><span className="desktop-controls-copy">Arrow keys · WASD · click, hold or drag</span><span className="touch-controls-copy">Touch, hold or drag on the maze</span></>}
                </strong>
              </div>
              <div className="dpad" aria-label="Movement buttons">
                <button className={`dpad-up${suggestedMoveDirection === "up" ? " suggested-move" : ""}`} onPointerDown={(event) => startDpadHold(event, "up")} onPointerUp={stopDpadHold} onPointerCancel={stopDpadHold} onLostPointerCapture={stopDpadHold} onClick={(event) => { if (event.detail === 0) attemptMove("up"); }} aria-label="Move up">▲</button>
                <button className={`dpad-left${suggestedMoveDirection === "left" ? " suggested-move" : ""}`} onPointerDown={(event) => startDpadHold(event, "left")} onPointerUp={stopDpadHold} onPointerCancel={stopDpadHold} onLostPointerCapture={stopDpadHold} onClick={(event) => { if (event.detail === 0) attemptMove("left"); }} aria-label="Move left">◀</button>
                <span className="dpad-center" aria-hidden="true">✦</span>
                <button className={`dpad-right${suggestedMoveDirection === "right" ? " suggested-move" : ""}`} onPointerDown={(event) => startDpadHold(event, "right")} onPointerUp={stopDpadHold} onPointerCancel={stopDpadHold} onLostPointerCapture={stopDpadHold} onClick={(event) => { if (event.detail === 0) attemptMove("right"); }} aria-label="Move right">▶</button>
                <button className={`dpad-down${suggestedMoveDirection === "down" ? " suggested-move" : ""}`} onPointerDown={(event) => startDpadHold(event, "down")} onPointerUp={stopDpadHold} onPointerCancel={stopDpadHold} onLostPointerCapture={stopDpadHold} onClick={(event) => { if (event.detail === 0) attemptMove("down"); }} aria-label="Move down">▼</button>
              </div>
            </section>

            <footer className="utility-row">
              <button onClick={showTitle}><img src={ASSETS.navHome} alt="" /><span>Home</span></button>
              <button onClick={(event) => openLevelPicker(event.currentTarget)}><img src={ASSETS.navMazes} alt="" /><span>Mazes</span></button>
              <button onClick={showAchievements}><img src={ASSETS.navBook} alt="" /><span>Book</span></button>
              <button onClick={(event) => {
                modalReturnFocus.current = event.currentTarget;
                setHelpOpen(true);
                playSound("menu", muted);
              }}><img src={ASSETS.navHelp} alt="" /><span>Help</span></button>
              <button aria-label={muted ? "Turn sound on" : "Turn sound off"} aria-pressed={!muted} onClick={toggleSound}><img src={ASSETS.navSound} alt="" /><span>Sound</span></button>
              <button aria-pressed={restartArmed} className={restartArmed ? "restart-armed" : ""} onClick={armRestart}><img src={ASSETS.navRestart} alt="" /><span>{restartArmed ? "Again!" : "Restart"}</span></button>
            </footer>
          </aside>
        </div>

        {storyOpen && levelStory && (
          <StoryInterlude lore={levelStory} onBegin={dismissStory} />
        )}

        {helpOpen && (
          <Modal title="How to help Ame" onClose={closeHelp} returnFocus={modalReturnFocus.current}>
            <div className="help-grid">
              <HelpStep image={ASSETS.boots} title="Move" copy="Press, hold or drag on the maze—or tap an arrow. One square at a time." />
              <HelpStep image={weaponArt.src} title="Find a weapon" copy="Then baddies can scoot." />
              <HelpStep image={ASSETS.potion} title="Check Power" copy="Match or beat a baddie. Its Power joins Ame!" />
              <HelpStep image={ASSETS.key} title="Match keys" copy="Keys open doors with the same colour and shape." />
              <HelpStep image={ASSETS.boots} title="Wear boots" copy="Cross water and warm lava." />
              <HelpStep image={ASSETS.springBoots} title="Find spring boots" copy="Boing safely across holes in the path." />
              <HelpStep image={ASSETS.antidoteLeaf} title="Find the antidote leaf" copy="It makes purple poison safe to cross." />
              {objectKinds.has("portal") && <HelpStep image={ASSETS.portalRoseHeart} title="Match magic flowers" copy="Step on one flower to pop out of its matching colour and shape." />}
              <HelpStep image={ASSETS.animalBunny} title="Rescue friends" copy="Some mazes have one friend; big adventures can have five." />
              {explorationMode && <HelpStep image={ASSETS.navMazes} title="Fill the map" copy="Exploring reveals each part." />}
            </div>
            <button className="primary-button" onClick={closeHelp}>Let's explore!</button>
          </Modal>
        )}

        {hintOpen && (
          <Modal title="A little hint" onClose={closeHint} returnFocus={modalReturnFocus.current}>
            <div className="hint-card">
              <img className="hint-spark" src={ASSETS.navHelp} alt="" />
              <p>{currentHint}</p>
            </div>
            <button className="primary-button" onClick={closeHint}>Got it!</button>
          </Modal>
        )}

        {blockerHint && (
          <Modal title="You need something!" onClose={closeBlockerHint} returnFocus={modalReturnFocus.current}>
            <div className="blocker-hint-card">
              <img src={blockerHint.itemSrc} alt={blockerHint.itemName} />
              <div>
                <strong>{blockerHint.message}</strong>
                <p>{blockerHint.count >= 3
                  ? "I’ve marked it with a pulsing sparkle on your map!"
                  : "Try another path and come back when you find it."}</p>
              </div>
            </div>
            <button className="primary-button" onClick={closeBlockerHint}>I’ll go find it!</button>
          </Modal>
        )}

        {game.status === "won" && completion && !presentationActive && (
          <Modal title="Maze solved!" celebratory returnFocus={modalReturnFocus.current}>
            <div className="celebration-burst" aria-hidden="true">
              {Array.from({ length: 12 }, (_, index) => <i className="confetti-piece" style={{ "--i": index } as CSSProperties} key={index} />)}
            </div>
            <div className="win-summary">
              <img className="win-star-art" src={ASSETS.goal} alt="A sparkling golden star portal" />
              <div><strong>Wonderful, Ame!</strong><span>The star was found in {game.steps} {game.steps === 1 ? "step" : "steps"}.</span></div>
            </div>
            <div
              className="rescued-result-row"
              data-friend-count={animalObjects.length}
              style={{ "--friend-count": Math.max(1, animalObjects.length) } as CSSProperties}
              aria-label={`${completion.rescuedSpecies.length} of ${animalObjects.length} animal friends rescued`}
            >
              {animalObjects.map((animal) => {
                const rescued = completion.rescuedSpecies.includes(animal.species);
                return (
                  <div
                    className={`rescued-result ${rescued ? "rescued" : ""}`}
                    data-animal-motion={animalPersonality(animal.species).motion}
                    data-flourish={animalPersonality(animal.species).flourish}
                    key={animal.id}
                    title={animalPersonality(animal.species).greeting}
                  >
                    <img src={animalArt(animal.species)} alt={ANIMAL_LABELS[animal.species]} decoding="async" />
                    <span>{rescued ? animalPersonality(animal.species).greeting : "Next time"}</span>
                  </div>
                );
              })}
            </div>
            {animalObjects.length > 0 && completion.rescuedSpecies.length === animalObjects.length && <div className="perfect-banner"><img src={ASSETS.rewardAnimalFriendSticker} alt="" /> Perfect rescue! Every friend is safe!</div>}
            {levelStory && (
              <div className="story-outro-card">
                <img src={storySpeakerArt(levelStory.speaker)} alt="" />
                <div>
                  <small>Chapter {levelStory.chapter} complete · {levelStory.puzzlePower}</small>
                  <p>{levelStory.outro}</p>
                </div>
              </div>
            )}
            {completion.testerRun ? (
              <div className="tester-preview-banner" role="status">
                <img src={ASSETS.navMazes} alt="" />
                <div><strong>Tester preview complete</strong><small>Nothing was saved and rewards stayed unchanged.</small></div>
              </div>
            ) : (
              <div className="reward-panel">
                <img className="reward-pouch" src={ASSETS.coinPouch} alt="A pouch of gold star coins" />
                <div className="reward-copy">
                  <span>Maze reward</span>
                  <strong>+{completion.reward.gold} gold stars</strong>
                  <small className="reward-breakdown">Solve {completion.reward.goldBreakdown.completion} · Friends {completion.reward.goldBreakdown.animalRescue}{completion.reward.goldBreakdown.perfectRescue > 0 ? ` · Every friend ${completion.reward.goldBreakdown.perfectRescue}` : ""}{completion.reward.goldBreakdown.firstCompletion > 0 ? ` · New maze ${completion.reward.goldBreakdown.firstCompletion}` : ""}{completion.bonusGold > 0 ? ` · Found ${completion.bonusGold}` : ""}{completion.sciencePoints > 0 ? ` · Science +${completion.sciencePoints}` : ""}</small>
                </div>
                <span className="reward-badge">Total {completion.totalGold}</span>
              </div>
            )}
            {!completion.testerRun && newCollectibles.length > 0 && (
              <div className="collection-strip reward-new" aria-label="New rewards">
                {newCollectibles.map((item) => (
                  <div className="collection-pop" key={item.id}>
                    <img className="modal-reward-art" src={item.art} alt="" />
                    <div><small>{item.kind}</small><strong>{item.label}</strong></div>
                  </div>
                ))}
              </div>
            )}
            <div className="modal-actions">
              <button className="primary-button" onClick={nextLevel}>{completion.testerRun ? "Next test maze" : campaignIndex + 1 < CURATED_LEVELS.length ? "Next maze" : "Surprise maze"} <span>→</span></button>
              <button className="secondary-button" onClick={replayLevel}>Play again</button>
            </div>
          </Modal>
        )}

        {tooStrongEncounter && (
          <Modal title="Too strong!" returnFocus={modalReturnFocus.current}>
            <img className="modal-art too-strong-enemy-art" src={tooStrongEncounter.enemySrc} alt={`A friendly ${tooStrongEncounter.enemyLabel.toLowerCase()}`} />
            <div className="power-equation too-strong-equation" aria-label={`Ame has Power ${tooStrongEncounter.event.playerPower}, which is less than ${tooStrongEncounter.enemyLabel} with Power ${tooStrongEncounter.event.enemyPower}`}>
              <span className="power-side ame-side"><small>Ame</small><strong>{tooStrongEncounter.event.playerPower}</strong></span>
              <b aria-hidden="true">&lt;</b>
              <span className="power-side enemy-side"><small>{tooStrongEncounter.enemyLabel}</small><strong>{tooStrongEncounter.event.enemyPower}</strong></span>
            </div>
            <p className="modal-lead">Ame stayed safely one square away. Find more Power, then come back!</p>
            <button className="primary-button too-strong-action" onClick={dismissTooStrongEncounter}>I’ll go get stronger.</button>
          </Modal>
        )}

          </>
        )}

        {levelPickerOpen && (
          <Modal title="Choose a maze" onClose={closeLevelPicker} returnFocus={modalReturnFocus.current}>
            <p className="modal-lead level-picker-lead">Replay any unlocked story maze and bring home friends you missed.</p>
            <div className="level-picker-list" aria-label="Unlocked story mazes">
              {CURATED_LEVELS.slice(0, unlocked).map((candidate, index) => {
                const result = progress.bestResultsByLevel[candidate.id];
                const friendTotal = candidate.objects.filter((object) => object.kind === "animal").length;
                return (
                  <button key={candidate.id} className={candidate.id === level.id ? "current" : ""} onClick={() => {
                    setLevelPickerOpen(false);
                    requestEnterLevel(candidate, screen === "title" ? "title" : "select");
                  }}>
                    <b>{index + 1}</b>
                    <span>
                      <strong>{candidate.name}</strong>
                      <small>{result ? `Best ${result.bestSteps ?? "—"} steps · Friends ${result.bestRescuedCount}/${friendTotal}` : `${candidate.width} × ${candidate.height} · New`}</small>
                      <em>{storyForLevel(candidate.id)?.puzzlePower}</em>
                    </span>
                    <i aria-hidden="true">{result?.perfectRescue ? "★" : "→"}</i>
                  </button>
                );
              })}
              <button className="surprise-level-choice" onClick={() => {
                setLevelPickerOpen(false);
                requestEnterLevel(makeSurprise(), screen === "title" ? "title" : "select");
              }}>
                <b>✦</b><span><strong>Surprise Maze</strong><small>Procedurally generated · a fresh solvable maze every time</small></span><i aria-hidden="true">→</i>
              </button>
            </div>
          </Modal>
        )}

        {testerPickerOpen && (
          <Modal
            title="Tester maze picker"
            onClose={closeTesterPicker}
            returnFocus={modalReturnFocus.current}
          >
            <p className="modal-lead tester-picker-lead">
              Jump straight to any story maze. Tester runs never save rewards, stars, or progress.
            </p>
            <div className="tester-level-grid" aria-label="Story mazes available for testing">
              {CURATED_LEVELS.map((candidate, index) => (
                <button
                  key={candidate.id}
                  className={candidate.id === level.id && testerRun ? "current" : ""}
                  onClick={() => enterTesterLevel(candidate)}
                  aria-label={`Test story maze ${index + 1}: ${candidate.name}, ${candidate.width} by ${candidate.height}`}
                >
                  <b>{index + 1}</b>
                  <span>
                    <strong>{candidate.name}</strong>
                    <small>{candidate.width} × {candidate.height}{isExplorationLevel(candidate) ? " · 6 × 6 view" : ""}</small>
                  </span>
                  <i aria-hidden="true">→</i>
                </button>
              ))}
            </div>
            <button className="secondary-button tester-picker-close" onClick={closeTesterPicker}>Back to the adventure</button>
          </Modal>
        )}

        {pendingAdventure && (
          <Modal
            title="Start a different maze?"
            onClose={closePendingAdventure}
            returnFocus={modalReturnFocus.current}
          >
            <img className="modal-art" src={ASSETS.portrait} alt="Ame smiling with her adventure backpack" />
            <p className="modal-lead">
              <strong>{level.name}</strong> is waiting at {game.steps} {game.steps === 1 ? "step" : "steps"}.
              Starting <strong>{pendingAdventure.level.name}</strong> will restart this run.
            </p>
            <div className="modal-actions">
              <button className="primary-button" onClick={resumeRun}>Keep this maze</button>
              <button className="secondary-button" onClick={() => {
                const nextAdventure = pendingAdventure;
                enterLevel(nextAdventure.level, nextAdventure.sound);
              }}>Start the new maze</button>
            </div>
          </Modal>
        )}

        {resetProgressOpen && (
          <Modal
            title="Reset all progress?"
            onClose={closeResetProgress}
            returnFocus={modalReturnFocus.current}
          >
            <img className="modal-art" src={ASSETS.portrait} alt="Ame smiling with her adventure backpack" />
            <p className="modal-lead">
              This will forget every maze record, gold star, Science Point, rescued friend, sticker, medal, badge, and the current maze.
              You’ll begin again from Story Maze 1. This cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="primary-button" onClick={closeResetProgress}>Keep my adventure</button>
              <button className="secondary-button" onClick={confirmResetProgress}>Yes, reset everything</button>
            </div>
          </Modal>
        )}

        </section>
      </div>

      <div className="rotate-message" role="status">
        <img src={ASSETS.portrait} alt="" />
        <strong>Turn me sideways</strong>
        <span>Ame's maze likes landscape mode.</span>
      </div>
    </main>
  );
}

interface TitleScreenProps {
  readonly progress: PlayerProgress;
  readonly activeRun: { readonly name: string; readonly steps: number } | null;
  readonly blocked: boolean;
  readonly muted: boolean;
  readonly playRef: React.RefObject<HTMLButtonElement | null>;
  readonly onPlay: () => void;
  readonly onSurprise: () => void;
  readonly onAchievements: () => void;
  readonly onChooseMaze: (trigger: HTMLElement) => void;
  readonly onRequestReset: (trigger: HTMLElement) => void;
  readonly onOpenTester: () => void;
  readonly onToggleSound: () => void;
}

function TitleScreen({
  progress,
  activeRun,
  blocked,
  muted,
  playRef,
  onPlay,
  onSurprise,
  onAchievements,
  onChooseMaze,
  onRequestReset,
  onOpenTester,
  onToggleSound,
}: TitleScreenProps) {
  const solvedIds = Object.keys(progress.bestResultsByLevel);
  const storySolved = CURATED_LEVELS.filter((level) => solvedIds.includes(level.id)).length;
  const hasProgress = solvedIds.length > 0 || progress.gold > 0 || progress.sciencePoints > 0 || progress.unlockedLevelCount > 1;
  const nextStoryNumber = getNextStoryIndex(progress, CURATED_LEVELS.map((storyLevel) => storyLevel.id)) + 1;

  return (
    <section className="title-screen" aria-labelledby="game-title" inert={blocked ? true : undefined} aria-hidden={blocked || undefined}>
      <img
        className="title-background"
        src={ASSETS.titleBackground}
        alt=""
        aria-hidden="true"
        decoding="async"
        fetchPriority="high"
      />
      <div className="title-vignette" aria-hidden="true" />
      <div className="title-fireflies" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <i
            key={index}
            style={{
              "--firefly-x": `${7 + index * 7.2}%`,
              "--firefly-y": `${8 + index * 7}%`,
              "--firefly-size": `${3 + (index % 3) * 2}px`,
              "--firefly-speed": `${3.5 + (index % 4) * 0.7}s`,
              "--firefly-delay": `${index * -0.31}s`,
            } as CSSProperties}
          />
        ))}
      </div>

      <button
        className="title-sound"
        aria-label={muted ? "Turn sound on" : "Turn sound off"}
        aria-pressed={!muted}
        onClick={onToggleSound}
      ><img src={ASSETS.navSound} alt="" /></button>

      <div className="title-copy">
        <span className="title-eyebrow">A gentle adventure for Ame</span>
        <h1 id="game-title">Maze so <em>Puzzle!</em></h1>
        <p className="title-subtitle">For Ame to Solve!</p>
        <p className="title-welcome">Follow the paths, grow Ame's Power, and help every little friend find their way home.</p>

        <div className="title-actions">
          <button ref={playRef} className="title-play-button" onClick={onPlay}>
            <span aria-hidden="true"><img src={ASSETS.goal} alt="" /></span>
            <span>
              <strong>{activeRun || hasProgress ? "Continue" : "Begin adventure"}</strong>
              <small>{activeRun ? `${activeRun.name} · ${activeRun.steps} ${activeRun.steps === 1 ? "step" : "steps"}` : hasProgress ? `Story maze ${nextStoryNumber} awaits` : "A lovely first maze awaits"}</small>
            </span>
          </button>
          <div className="title-secondary-actions">
            <button onClick={(event) => onChooseMaze(event.currentTarget)}><img src={ASSETS.navMazes} alt="" /> Choose a maze</button>
            <button onClick={onAchievements}><img src={ASSETS.navBook} alt="" /> Ame's adventure book</button>
            <button onClick={onSurprise}><img src={ASSETS.rewardSurpriseSparkleSticker} alt="" /> Surprise maze</button>
            <button style={{ gridColumn: "1 / -1" }} onClick={(event) => onRequestReset(event.currentTarget)}><img src={ASSETS.navRestart} alt="" /> Reset progress</button>
          </div>
        </div>

        <div className="title-progress" aria-label="Saved adventure progress">
          <span><b>{storySolved}</b><small>story stars</small></span>
          <span><b>{progress.totalAnimalsRescued}</b><small>friends helped</small></span>
          <span><b>{progress.gold}</b><small>gold stars</small></span>
        </div>
      </div>

      <button
        className="title-version"
        onClick={onOpenTester}
        aria-label={`Playable build ${BUILD_VERSION}. Open the secret tester maze picker.`}
        title="Secret tester maze picker"
      >Playable build {BUILD_VERSION} <img src={ASSETS.navMazes} alt="" /></button>
    </section>
  );
}

interface AchievementsScreenProps {
  readonly progress: PlayerProgress;
  readonly unlocked: number;
  readonly activeRun: { readonly levelId: string; readonly name: string; readonly steps: number } | null;
  readonly blocked: boolean;
  readonly headingRef: React.RefObject<HTMLHeadingElement | null>;
  readonly muted: boolean;
  readonly onHome: () => void;
  readonly onResume: () => void;
  readonly onPlayLevel: (level: LevelDefinition) => void;
  readonly onSurprise: () => void;
  readonly onRequestReset: (trigger: HTMLElement) => void;
  readonly onToggleSound: () => void;
}

function AchievementsScreen({
  progress,
  unlocked,
  activeRun,
  blocked,
  headingRef,
  muted,
  onHome,
  onResume,
  onPlayLevel,
  onSurprise,
  onRequestReset,
  onToggleSound,
}: AchievementsScreenProps) {
  const solvedIds = Object.keys(progress.bestResultsByLevel);
  const classifiedRescues = ANIMAL_SPECIES.reduce(
    (total, species) => total + progress.rescuesBySpecies[species],
    0,
  );
  const unclassifiedRescues = Math.max(0, progress.totalAnimalsRescued - classifiedRescues);
  const surpriseResults = Object.entries(progress.bestResultsByLevel)
    .filter(([, result]) => result.source === "generated");
  const recentSurpriseResults = surpriseResults.slice(-6).reverse();
  const collectibles = [
    ...(["first-star", "animal-friend", "surprise-sparkle"] as const).map((id) => ({
      id,
      label: STICKER_LABELS[id].label,
      description: STICKER_LABELS[id].description,
      art: stickerArt(id),
      owned: progress.stickers.includes(id),
      kind: "Sticker",
    })),
    ...(["perfect-rescue-5", "perfect-rescue-10", "perfect-rescue-15"] as const).map((id) => ({
      id,
      label: ACHIEVEMENT_LABELS[id].label,
      description: ACHIEVEMENT_LABELS[id].description,
      art: medalArt(id),
      owned: progress.medals.includes(id),
      kind: "Medal",
    })),
    ...BADGE_IDS.map((id) => ({
      id,
      label: BADGE_LABELS[id].label,
      description: BADGE_LABELS[id].description,
      art: badgeArt(id),
      owned: progress.badges.includes(id),
      kind: "Badge",
    })),
  ];

  return (
    <section className="achievements-screen" aria-labelledby="adventure-book-title" inert={blocked ? true : undefined} aria-hidden={blocked || undefined}>
      <div className="book-sparkles" aria-hidden="true">✦　·　✧　·　✦</div>
      <header className="book-header">
        <button className="book-back" onClick={onHome}><span aria-hidden="true">←</span> Title</button>
        <div>
          <span>Ame's keepsake shelf</span>
          <h1 ref={headingRef} tabIndex={-1} id="adventure-book-title">Adventure Book</h1>
          <p>Every star, stamp, and friend from the journey.</p>
        </div>
        <div className="book-header-actions">
          <button aria-label={muted ? "Turn sound on" : "Turn sound off"} aria-pressed={!muted} onClick={onToggleSound}><img src={ASSETS.navSound} alt="" /></button>
          {activeRun && <button className="book-resume" onClick={onResume}><img src={ASSETS.goal} alt="" /> Resume</button>}
          <button onClick={onSurprise}><img src={ASSETS.rewardSurpriseSparkleSticker} alt="" /> New maze</button>
        </div>
      </header>

      <div className="book-scroll" role="region" aria-label="Adventure book pages" tabIndex={0}>
        <section className="book-stats" aria-label="Adventure totals">
          <article><img src={ASSETS.goal} alt="" /><span><b>{progress.totalMazesCompleted}</b><small>mazes solved</small></span></article>
          <article><img src={ASSETS.coinPouch} alt="" /><span><b>{progress.gold}</b><small>gold stars</small></span></article>
          <article><img src={ASSETS.rewardAnimalFriendSticker} alt="" /><span><b>{progress.totalAnimalsRescued}</b><small>friends helped</small></span></article>
          <article><img src={ASSETS.rewardHelpingPawMedal} alt="" /><span><b>{progress.perfectRescueMazeCount}</b><small>perfect rescues</small></span></article>
          <article><img src={ASSETS.rewardTrailSticker} alt="" /><span><b>{progress.totalCompletions}</b><small>happy finishes</small></span></article>
          <article><img src={ASSETS.rewardSurpriseSparkleSticker} alt="" /><span><b>{progress.generatedMazesCompleted}</b><small>surprise stars</small></span></article>
        </section>

        <section className="friend-ledger" aria-labelledby="friend-ledger-title">
          <div className="book-section-heading"><div><span>Rescue roll-call</span><h2 id="friend-ledger-title">Little friends helped</h2></div><b>{progress.totalAnimalsRescued} total</b></div>
          <div className="friend-ledger-grid">
            {ANIMAL_SPECIES.map((species) => (
              <article key={species}>
                <img src={animalArt(species)} alt="" loading="lazy" decoding="async" />
                <span><strong>{ANIMAL_LABELS[species]}</strong><b>{progress.rescuesBySpecies[species]}</b><small>recorded rescues</small></span>
              </article>
            ))}
            {unclassifiedRescues > 0 && (
              <article className="past-rescues"><img src={ASSETS.rewardAnimalFriendSticker} alt="" /><span><strong>Earlier friends</strong><b>{unclassifiedRescues}</b><small>before the roll-call began</small></span></article>
            )}
          </div>
        </section>

        <section className="badge-shelf" aria-labelledby="badge-shelf-title">
          <div className="book-section-heading"><div><span>Sticker, medal and badge shelf</span><h2 id="badge-shelf-title">Ame's shiny collection</h2></div><b>{collectibles.filter((item) => item.owned).length}/{collectibles.length}</b></div>
          <div className="badge-grid">
            {collectibles.map((item) => (
              <article className={`badge-card ${item.owned ? "earned" : "locked"}`} key={item.id}>
                <div className="badge-art-wrap">
                  <img src={item.art} alt="" loading="lazy" decoding="async" />
                </div>
                <div><small>{item.owned ? `Earned ${item.kind}` : `Locked ${item.kind}`}</small><strong>{item.label}</strong><p>{item.description}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="maze-records" aria-labelledby="maze-records-title">
          <div className="book-section-heading"><div><span>Story map</span><h2 id="maze-records-title">Maze records</h2></div><b>{CURATED_LEVELS.filter((item) => solvedIds.includes(item.id)).length}/{CURATED_LEVELS.length} cleared</b></div>
          <div className="maze-record-grid">
            {CURATED_LEVELS.map((storyLevel, index) => {
              const result = progress.bestResultsByLevel[storyLevel.id];
              const locked = index >= unlocked;
              const rescueCount = result?.bestRescuedCount ?? 0;
              const documentedSpecies = result?.bestRescuedSpecies ?? [];
              const storySpecies = storyLevel.objects.flatMap((object) => (
                object.kind === "animal" ? [object.species] : []
              ));
              const { documentedStorySpecies, hasUnknownRescues } = getStoryRescueRecordDisplay(
                storySpecies,
                rescueCount,
                documentedSpecies,
              );
              const isActive = activeRun?.levelId === storyLevel.id;
              return (
                <button
                  className={`maze-record-card ${result ? "cleared" : "open"}${isActive ? " active-run" : ""}`}
                  key={storyLevel.id}
                  disabled={locked}
                  onClick={() => isActive ? onResume() : onPlayLevel(storyLevel)}
                  aria-label={`${storyLevel.name}. ${locked ? "Locked" : isActive ? `Current maze, ${activeRun.steps} ${activeRun.steps === 1 ? "step" : "steps"}` : result ? `Cleared, best ${result.bestSteps ?? 0} steps, ${rescueCount} friends rescued${hasUnknownRescues ? ", some friend details came from an earlier version" : ""}` : "Ready to play"}`}
                >
                  <span className="record-number">{locked ? "◆" : isActive ? "▶" : index + 1}</span>
                  <span className="record-copy">
                    <strong>{locked ? "A mystery maze" : storyLevel.name}</strong>
                    <small>{locked ? "Keep adventuring to unlock" : isActive ? "Current maze · tap to resume" : `${storyLevel.width} × ${storyLevel.height}`}</small>
                    {!locked && <em className="record-skill">{storyForLevel(storyLevel.id)?.puzzlePower}</em>}
                  </span>
                  <span className="record-best">{result ? <><b>{result.bestSteps ?? "—"}</b><small>best {result.bestSteps === 1 ? "step" : "steps"}</small></> : locked ? <><img className="record-lock-art" src={ASSETS.doorBlueStar} alt="" /><small>locked</small></> : <><b>New</b><small>ready</small></>}</span>
                  <span className="record-friends" aria-hidden="true">
                    {storySpecies.map((species) => (
                      <img
                        className={documentedStorySpecies.includes(species) ? "saved" : hasUnknownRescues ? "saved-unknown" : ""}
                        key={species}
                        src={animalArt(species)}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="surprise-records" aria-labelledby="surprise-records-title">
          <div className="book-section-heading">
            <div><span>Procedural scrapbook</span><h2 id="surprise-records-title">Surprise Maze memories</h2></div>
            <b>{progress.generatedMazesCompleted} unique</b>
          </div>
          <div className="surprise-explainer">
            <img className="surprise-explainer-star" src={ASSETS.rewardSurpriseSparkleSticker} alt="" />
            <div>
              <strong>Freshly made, not a hidden fixed list</strong>
              <p>Surprise Mazes are generated from a new seed, so there can always be another one. The Book remembers completed adventures while the button makes a fresh puzzle.</p>
            </div>
            <button onClick={onSurprise}>Make a Surprise Maze</button>
          </div>
          {recentSurpriseResults.length > 0 && (
            <div className="surprise-record-grid" aria-label="Recent completed Surprise Maze records">
              {recentSurpriseResults.map(([levelId, result], index) => (
                <article key={levelId}>
                  <img src={index === 0 ? ASSETS.rewardTrailSticker : ASSETS.rewardSurpriseSparkleSticker} alt="" />
                  <div><strong>Surprise memory</strong><small>{describeGeneratedRecord(levelId)}</small></div>
                  <div><b>{result.bestSteps ?? "—"}</b><small>best steps</small></div>
                  <div><b>{result.bestRescuedCount}/{result.totalRescueCount}</b><small>friends</small></div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="maze-records" aria-labelledby="reset-progress-title">
          <div className="book-section-heading">
            <div><span>New beginning</span><h2 id="reset-progress-title">Reset the adventure</h2></div>
            <button className="secondary-button" onClick={(event) => onRequestReset(event.currentTarget)}><img src={ASSETS.navRestart} alt="" /> Reset progress</button>
          </div>
        </section>
      </div>
    </section>
  );
}

interface InventorySlotProps {
  readonly label: string;
  readonly image: string;
  readonly found: boolean;
}

function InventorySlot({ label, image, found }: InventorySlotProps) {
  return (
    <div
      className={`inventory-slot ${found ? "found" : "missing"}`}
      aria-label={`${label}: ${found ? "found" : "not found"}`}
      title={`${label}: ${found ? "found" : "not found"}`}
    >
      <div className="slot-image"><img src={image} alt="" /></div>
    </div>
  );
}

function HelpStep({ image, title, copy }: { readonly image: string; readonly title: string; readonly copy: string }) {
  return <div className="help-step"><img src={image} alt="" /><div><strong>{title}</strong><p>{copy}</p></div></div>;
}

function StoryInterlude({
  lore,
  onBegin,
}: {
  readonly lore: StoryLore;
  readonly onBegin: () => void;
}) {
  const speakerLabel = STORY_SPEAKER_LABELS[lore.speaker];

  return (
    <div
      className="story-backdrop"
      role="presentation"
      onPointerDown={(event) => {
        if (event.isPrimary && event.button === 0) onBegin();
      }}
    >
      <section
        className="story-card"
        role="dialog"
        aria-modal="true"
        aria-label={"Chapter " + lore.chapter + ": " + lore.title}
      >
        <div className="story-sparkles" aria-hidden="true"><i>✦</i><i>✧</i><i>★</i><i>✦</i></div>
        <div className="story-chapter-ribbon">
          <span>Read-together story</span>
          <b>Chapter {lore.chapter}</b>
        </div>
        <div className="story-body">
          <div className="story-speaker">
            <img src={storySpeakerArt(lore.speaker)} alt={speakerLabel} />
            <span>{speakerLabel}</span>
          </div>
          <div className="story-copy">
            <span className="story-eyebrow">The Puzzlewild Star Map</span>
            <h2>{lore.title}</h2>
            {lore.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <blockquote>“{lore.quote}”</blockquote>
          </div>
        </div>
        <div className="story-thinking-strip">
          <span className="story-thinking-icon" aria-hidden="true">✦</span>
          <div><small>Puzzle power</small><strong>{lore.puzzlePower}</strong></div>
          <p>{lore.tryThis}</p>
        </div>
        <button
          className="story-start-button"
          autoFocus
          onPointerDown={(event) => event.stopPropagation()}
          onClick={onBegin}
        >
          <span aria-hidden="true">★</span>
          Start the maze
        </button>
        <small className="story-skip-note">Tap anywhere, or press any key, to start right away.</small>
      </section>
    </div>
  );
}

interface ModalProps {
  readonly title: string;
  readonly children: React.ReactNode;
  readonly onClose?: () => void;
  readonly celebratory?: boolean;
  readonly returnFocus?: HTMLElement | null;
}

function Modal({ title, children, onClose, celebratory = false, returnFocus }: ModalProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const titleId = useId();

  useEffect(() => {
    const previousFocus = returnFocus
      ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    const firstControl = dialog.querySelector<HTMLElement>("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])");
    (firstControl ?? dialog).focus();
    return () => {
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [returnFocus]);

  const onDialogKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape" && onClose) {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const controls = [...dialog.querySelectorAll<HTMLElement>("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])")];
    const first = controls[0];
    const last = controls.at(-1);
    if (!first || !last) {
      event.preventDefault();
      dialog.focus();
    } else if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <section ref={dialogRef} className={`modal-card${celebratory ? " celebratory" : ""}`} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} onKeyDown={onDialogKeyDown}>
        {onClose && <button className="modal-close" onClick={onClose} aria-label={`Close ${title}`}>×</button>}
        <span className="modal-star" aria-hidden="true">✦</span>
        <h2 id={titleId}>{title}</h2>
        {children}
      </section>
    </div>
  );
}

export default App;
