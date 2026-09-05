import { MazeTerrain, lightVector } from "./ui/game/MazeTerrain";
import { MiniMap } from "./ui/game/MiniMap";
import { cameraLayerStyle, cameraNoticeStyle, isInsideWindow } from "./ui/game/sceneGeometry";
import { describeObject } from "./ui/game/descriptions";
import { FrontDoorScreen } from "./ui/screens/FrontDoorScreen";
import { TitleScreen } from "./ui/screens/HomeScreen";
import { AchievementsScreen } from "./ui/screens/AdventureBook";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  ASSETS,
  BADGE_ART,
  MEDAL_ART,
  STICKER_ART,
  TREASURE_ART,
  preloadLevelArt,
} from "./assets";
import {
  combatPowerNotice,
  pickupToastFor,
  type MapPickupToast,
} from "./mapNotices";
import { createDoorBurstParticles, LOCK_MAGIC_EFFECTS } from "./magicEffects";
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
} from "./artCatalog";
import {
  createInitialGameState,
  getObjectAt,
  getTerrainAt,
  isObjectResolved,
  movePlayer,
  pointsEqual,
  stayAfterPendingCompletion,
} from "./game/engine";
import { heldWeaponStyle } from "./heldWeaponPresentation";
import { hasCurrentGameplay } from "./game/contentIdentity";
import { generateSurpriseMaze, type MazeDifficulty } from "./game/generator";
import { CURATED_LEVELS } from "./game/levels";
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
import { getProgressiveHint, hintStateKey } from "./game/hints";
import { getRequiredPath } from "./game/reachability";
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
  BADGE_LABELS,
  STICKER_LABELS,
  applyLevelCompletion,
  calculateLevelReward,
  readPlayerProgress,
  writePlayerProgress,
  type BadgeId,
  type CalculatedLevelReward,
  type LevelCompletionInput,
  type PlayerProgress,
  type RescueMedalId,
  type StickerId,
} from "./progress";
import { playSound, type SoundName } from "./sound";
import { createCurrentMusicTransport } from "./musicTransport";
import { setMusicPageHidden } from "./music";
import { CatalogueImage, PresentationArt } from "./ui/CatalogueImage";
import { resolveUiArt, type UiArt } from "./ui/art";
import { DialogShell as Modal } from "./ui/dialogs/DialogShell";
import { StoryDialog } from "./ui/dialogs/StoryDialog";
import { SoundDialog } from "./ui/SoundDialog";
import { usePresentation } from "./ui/PresentationProvider";
import { getCurrentInputBlock, type UiInteractionState } from "./ui/interactionState";
import { PlayShell } from "./ui/game/PlayShell";
import { usePowerGuidance } from "./ui/game/usePowerGuidance";
import { MazeViewport, measuredFlight } from "./ui/game/MazeViewport";
import { AdventureHud, type ArtDetail } from "./ui/game/AdventureHud";
import { buildAdventureHudModel } from "./ui/game/hudModel";
import { getNextStoryIndex, shouldConfirmMazeSwitch } from "./navigation";
import { cameraWorldStyle, worldLayerStyle } from "./cameraMotion";
import { getJumpPresentationMotion } from "./jumpPresentation";
import { resetAllGameProgressResult } from "./resetProgress";
import {
  clearActiveRun,
  createActiveRunId,
  readActiveRunResult,
  writeActiveRun,
} from "./session";
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
  storyForLevel,
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

const ANIMAL_LABELS = Object.fromEntries(ANIMAL_SPECIES.map(species => [species, resolveAnimalArt(species).label])) as Record<AnimalSpecies, string>;

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
const DOOR_OPEN_PRESENTATION_MS = 1_320;
const REDUCED_PRESENTATION_MS = 180;

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

interface CompletionCelebration {
  readonly completionId: string;
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

type AppScreen = "front-door" | "title" | "game" | "achievements";
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
  readonly itemArt: UiArt;
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

interface DoorOpeningPresentation {
  readonly objectId: string;
  readonly color: KeyColor;
  readonly at: Point;
  readonly doorSrc: string;
}

interface TreasurePresentation {
  readonly id: number;
  readonly currency: "gold" | "science";
  readonly amount: number;
  readonly at: Point;
}

function prefersReducedMotion(): boolean {
  return document.documentElement.dataset.motion === "reduced"
    || document.documentElement.dataset.quality === "static";
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

function enemyLabelForEvent(level: LevelDefinition, objectId: string): string {
  const object = level.objects.find((candidate) => candidate.id === objectId);
  return resolveEnemyArt(object?.kind === "enemy" ? object.style : undefined).label;
}

function targetFor(state: GameState, direction: Direction): Point {
  const delta = DIRECTION_DELTAS[direction];
  return { x: state.position.x + delta.x, y: state.position.y + delta.y };
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
    itemArt: resolveUiArt(spriteFor(object))!,
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

function debugMazeQueryEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("debug") === DEBUG_MAZE_QUERY;
}

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
  const chapter = Math.max(1, progress.unlockedLevelIds.length) + (solvedSurprises >= 2 ? 1 : 0);
  const sizes = [9, 11, 13, 15, 17] as const;
  const size = sizes[Math.min(sizes.length - 1, chapter - 1)] ?? 9;
  const difficulty: MazeDifficulty = chapter >= 5 ? "adventure" : chapter >= 3 ? "growing" : "gentle";
  return { size, difficulty };
}

function completionInputFor(
  level: LevelDefinition,
  game: GameState,
  campaignIndex: number,
  completionId: string,
): LevelCompletionInput {
  const animalObjects = level.objects.filter(
    (object): object is Extract<LevelObject, { kind: "animal" }> => object.kind === "animal",
  );
  const rescuedSpecies = animalObjects
    .filter((object) => game.rescuedAnimalIds.includes(object.id))
    .map((object) => object.species);
  return {
    completionId,
    levelId: level.id,
    source: level.source,
    campaignIndex,
    rescuedCount: rescuedSpecies.length,
    totalRescueCount: animalObjects.length,
    rescuedSpecies,
    steps: game.steps,
    power: game.power,
    contentRevision: level.contentRevision,
    gameplayFingerprint: level.gameplayFingerprint,
    bonusGold: game.goldStarsCollected,
    sciencePoints: game.sciencePointsCollected,
  };
}

function pendingCompletionFor(
  level: LevelDefinition,
  game: GameState,
  progress: PlayerProgress,
  campaignIndex: number,
  runId: string,
  testerRun: boolean,
): CompletionCelebration {
  const completionId = `completion:${runId}`;
  const input = completionInputFor(level, game, campaignIndex, completionId);
  const rescuedSpecies = input.rescuedSpecies ?? [];
  if (testerRun) {
    return {
      completionId,
      reward: {
        levelId: level.id,
        gold: 0,
        goldBreakdown: { completion: 0, firstCompletion: 0, animalRescue: 0, perfectRescue: 0 },
        stickerIds: [],
      },
      newStickerIds: [],
      newMedalIds: [],
      newBadgeIds: [],
      rescuedSpecies,
      totalGold: progress.gold,
      bonusGold: game.goldStarsCollected,
      sciencePoints: game.sciencePointsCollected,
      testerRun: true,
    };
  }

  const firstCompletion = progress.bestResultsByLevel[level.id] === undefined;
  const reward = calculateLevelReward({
    levelId: level.id,
    source: level.source,
    campaignIndex,
    rescuedCount: rescuedSpecies.length,
    totalRescueCount: input.totalRescueCount,
    firstCompletion,
  });
  const projected = applyLevelCompletion(progress, input);
  return {
    completionId,
    reward,
    newStickerIds: projected.stickers.filter((id) => !progress.stickers.includes(id)),
    newMedalIds: projected.medals.filter((id) => !progress.medals.includes(id)),
    newBadgeIds: projected.badges.filter((id) => !progress.badges.includes(id)),
    rescuedSpecies,
    totalGold: projected.gold,
    bonusGold: game.goldStarsCollected,
    sciencePoints: game.sciencePointsCollected,
    testerRun: false,
  };
}

function App() {
  const [musicTransport] = useState(createCurrentMusicTransport);
  const { motion, preferences } = usePresentation();
  const [soundOpen, setSoundOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [artDetail, setArtDetail] = useState<ArtDetail | null>(null);
  const [initialRunResult] = useState(() => readActiveRunResult(CURATED_LEVELS));
  const initialRun = initialRunResult.snapshot;
  const initialLevel = initialRun
    ? CURATED_LEVELS.find((candidate) => candidate.id === initialRun.levelId) ?? CURATED_LEVELS[0]!
    : CURATED_LEVELS[0]!;
  const [screen, setScreen] = useState<AppScreen>("front-door");
  const [hasActiveRun, setHasActiveRun] = useState(initialRun !== null);
  const [pendingAdventure, setPendingAdventure] = useState<PendingAdventure | null>(null);
  const [testerPickerOpen, setTesterPickerOpen] = useState(debugMazeQueryEnabled);
  const [levelPickerOpen, setLevelPickerOpen] = useState(false);
  const [bigMaze, setBigMaze] = useState(false);
  const [level, setLevel] = useState<LevelDefinition>(initialLevel);
  const [game, setGame] = useState<GameState>(() => initialRun?.game ?? createInitialGameState(initialLevel));
  const [runId, setRunId] = useState(() => initialRun?.runId ?? createActiveRunId());
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
  const [hintUsesByState, setHintUsesByState] = useState<Readonly<Record<string, number>>>(() => initialRun?.hintUsesByState ?? {});
  const [storyOpen, setStoryOpen] = useState(false);
  const [blockerHint, setBlockerHint] = useState<BlockerHint | null>(null);
  const [guidedObjectId, setGuidedObjectId] = useState<string | null>(null);
  const [resetProgressOpen, setResetProgressOpen] = useState(false);
  const [resetProgressError, setResetProgressError] = useState(false);
  const [saveWarning, setSaveWarning] = useState<"run" | "progress" | null>(null);
  const [tooStrongEncounter, setTooStrongEncounter] = useState<TooStrongEncounter | null>(null);
  const [progress, setProgress] = useState<PlayerProgress>(readPlayerProgress);
  const [completion, setCompletion] = useState<CompletionCelebration | null>(null);
  const [restartArmed, setRestartArmed] = useState(false);
  const [battlePresentation, setBattlePresentation] = useState<BattlePresentation | null>(null);
  const [rescuePresentation, setRescuePresentation] = useState<RescuePresentation | null>(null);
  const [jumpPresentation, setJumpPresentation] = useState<JumpPresentation | null>(null);
  const [portalPresentation, setPortalPresentation] = useState<PortalPresentation | null>(null);
  const [doorOpeningPresentation, setDoorOpeningPresentation] = useState<DoorOpeningPresentation | null>(null);
  const [treasurePresentation, setTreasurePresentation] = useState<TreasurePresentation | null>(null);
  const [presentedPower, setPresentedPower] = useState<number | null>(null);
  const [presentedEnemyPower, setPresentedEnemyPower] = useState<number | null>(null);
  const appFrameRef = useRef<HTMLElement>(null);
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
  const strongEnemyBumps = useRef(new Map<string, number>());
  const presentationTimers = useRef(new Set<number>());
  const presentationSequence = useRef(0);
  const treasureTimer = useRef<number | undefined>(undefined);
  const modalReturnFocus = useRef<HTMLElement | null>(null);
  const frontDoorPlayRef = useRef<HTMLButtonElement>(null);
  const titlePlayRef = useRef<HTMLButtonElement>(null);
  const achievementsHeadingRef = useRef<HTMLHeadingElement>(null);
  const mutedRef = useRef(muted);
  const [testerToolsRequested] = useState(debugMazeQueryEnabled);

  useEffect(() => musicTransport.subscribe(snapshot => setMuted(snapshot.muted)), [musicTransport]);
  useEffect(() => {
    if (screen !== "front-door" && screen !== "title") return;
    musicTransport.setContext("title");
    const beginTitleMusic = () => { void musicTransport.startFromUserGesture(); };
    window.addEventListener("pointerdown", beginTitleMusic, { once: true });
    window.addEventListener("keydown", beginTitleMusic, { once: true });
    return () => {
      window.removeEventListener("pointerdown", beginTitleMusic);
      window.removeEventListener("keydown", beginTitleMusic);
    };
  }, [musicTransport, screen]);

  const campaignIndex = CURATED_LEVELS.findIndex((candidate) => candidate.id === level.id);
  const isSurprise = campaignIndex === -1;
  const explorationMode = isExplorationLevel(level);
  const testerRun = runMode === "tester";
  const testerToolsEnabled = testerToolsRequested || testerRun;

  useEffect(() => {
    if (game.status !== "won" || completion !== null) return;
    setCompletion(pendingCompletionFor(level, game, progress, campaignIndex, runId, testerRun));
  }, [campaignIndex, completion, game, level, progress, runId, testerRun]);
  const unlockedLevelIds = new Set(progress.unlockedLevelIds);
  const unlockedStoryLevels = CURATED_LEVELS.filter((candidate) => unlockedLevelIds.has(candidate.id));
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
  const mazeStatus = useMemo(() => describeMazePosition(level, game), [game, level]);
  const runInProgress = hasActiveRun && (game.status === "playing" || game.status === "won");
  const displayedPower = presentedPower ?? game.power;
  const displayedGold = progress.gold + (game.status === "playing" ? game.goldStarsCollected : 0);
  const displayedScience = progress.sciencePoints + (game.status === "playing" ? game.sciencePointsCollected : 0);
  const presentationActive = battlePresentation !== null
    || rescuePresentation !== null
    || jumpPresentation !== null
    || portalPresentation !== null
    || doorOpeningPresentation !== null;
  const uiState: UiInteractionState = {
    screen,
    topOverlay: resetProgressOpen ? "reset" : testerPickerOpen ? "tester"
      : levelPickerOpen ? "maze-picker" : pendingAdventure ? "switch"
      : moreOpen ? "more" : soundOpen ? "sound" : artDetail ? "detail" : storyOpen ? "story"
      : screen !== "game" ? null : helpOpen ? "help" : hintOpen ? "hint"
      : blockerHint ? "blocker" : tooStrongEncounter ? "too-strong"
      : presentationActive ? null : game.status === "won" ? "completion"
      : game.status === "lost" ? "lost" : null,
  };
  const inputBlock = getCurrentInputBlock(uiState);
  const modalOpen = inputBlock.backgroundInert;
  const hudModel = useMemo(() => buildAdventureHudModel(level, game), [level, game]);
  const powerGuidance = usePowerGuidance(level, game, tooStrongEncounter?.event.objectId);

  useEffect(() => {
    if (runMode === "tester") return;
    if (!hasActiveRun || level.source !== "curated") {
      const cleared = clearActiveRun();
      setSaveWarning((current) => cleared && current === "run"
        ? null
        : !cleared && hasActiveRun && current !== "progress" ? "run" : current);
      return;
    }
    const saved = writeActiveRun({
      runId,
      mode: "normal",
      level,
      game,
      revealedTiles,
      hintUsesByState,
    });
    setSaveWarning((current) => saved && current === "run"
      ? null
      : !saved && current !== "progress" ? "run" : current);
  }, [game, hasActiveRun, hintUsesByState, level, revealedTiles, runId, runMode]);

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
    setDoorOpeningPresentation(null);
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

  const showMapNotice = useCallback((
    notice: Omit<MapPickupToast, "id">,
    durationMs = 1_850,
  ) => {
    if (mapPickupTimer.current !== undefined) {
      window.clearTimeout(mapPickupTimer.current);
    }
    const toastId = mapPickupSequence.current + 1;
    mapPickupSequence.current = toastId;
    setMapPickupToast({ id: toastId, ...notice });
    mapPickupTimer.current = window.setTimeout(() => {
      setMapPickupToast((current) => current?.id === toastId ? null : current);
      mapPickupTimer.current = undefined;
    }, durationMs);
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
    setDoorOpeningPresentation(null);
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
      showMapNotice(
        combatPowerNotice(event, from),
        prefersReducedMotion() ? 900 : 1_550,
      );
    }, Math.max(100, duration - 30));
    return duration;
  }, [clearPresentationWork, schedulePresentationTimer, showMapNotice]);

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
    setDoorOpeningPresentation(null);
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
    setDoorOpeningPresentation(null);
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
    setDoorOpeningPresentation(null);
    setPresentedPower(null);
    setPresentedEnemyPower(null);
    setPortalPresentation({ pair: event.pair, from: event.from, to: event.to });
    playSound("portal", mutedRef.current);
    schedulePresentationTimer(sequence, () => setPortalPresentation(null), Math.max(100, duration - 25));
    return duration;
  }, [clearPresentationWork, schedulePresentationTimer]);

  const beginDoorOpeningPresentation = useCallback((
    event: Extract<GameEvent, { type: "door-opened" }>,
    door: Extract<LevelObject, { kind: "door" }>,
  ): number => {
    clearPresentationWork();
    const sequence = presentationSequence.current;
    const duration = prefersReducedMotion() ? REDUCED_PRESENTATION_MS : DOOR_OPEN_PRESENTATION_MS;
    setBattlePresentation(null);
    setRescuePresentation(null);
    setJumpPresentation(null);
    setPortalPresentation(null);
    setPresentedPower(null);
    setPresentedEnemyPower(null);
    setDoorOpeningPresentation({
      objectId: event.objectId,
      color: event.color,
      at: door.at,
      doorSrc: resolveDoorArt(event.color).src,
    });
    playSound("doorOpen", mutedRef.current);
    schedulePresentationTimer(sequence, () => setDoorOpeningPresentation(null), Math.max(100, duration - 25));
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
      if (screen === "front-door") frontDoorPlayRef.current?.focus();
      else if (screen === "title") titlePlayRef.current?.focus();
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
    setRunId(createActiveRunId());
    setPlayerTrail([nextLevel.start]);
    setRevealedTiles(isExplorationLevel(nextLevel)
      ? revealVisibleTiles([], nextLevel, nextLevel.start, DEFAULT_FOV_SIZE)
      : new Set());
    setMovePulse(0);
    setBumpPulse(0);
    setCompletion(null);
    setTooStrongEncounter(null);
    setHintOpen(false);
    setHintUsesByState({});
    setBlockerHint(null);
    setGuidedObjectId(null);
    blockerBumps.current.clear();
    strongEnemyBumps.current.clear();
    setPendingAdventure(null);
    setFeedback({ icon: ASSETS.goal, text: nextLevel.objective, tone: "plain", sound: "step" });
    setRestartArmed(false);
  }, [cancelPresentations, clearHeldInput]);

  const attemptMove = useCallback((requestedDirection: Direction, lateralOffset = 0) => {
    const unavailable = (
      !inputBlock.gameplayInputAllowed
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
        if (count >= 3) setBlockerHint(nextHint);
        if (count >= 2) setGuidedObjectId(nextHint.itemId);
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
      showMapNotice(nextPickupToast);
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
    const openedDoorEvent = result.events.find(
      (event): event is Extract<GameEvent, { type: "door-opened" }> => event.type === "door-opened",
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
      const priorBumps = strongEnemyBumps.current.get(tooStrongEvent.objectId) ?? 0;
      strongEnemyBumps.current.set(tooStrongEvent.objectId, priorBumps + 1);
      // Every safe collision requires a fresh deliberate press. Otherwise one
      // held input floods the live region and bump audio at accelerated cadence.
      clearHeldInput();
      if (enemy && priorBumps === 0) {
        const art = resolveEnemyArt(enemy.style);
        setTooStrongEncounter({ event: tooStrongEvent, enemySrc: art.src, enemyLabel: art.label });
      } else if (enemy) {
        setFeedback({
          icon: resolveEnemyArt(enemy.style).src,
          text: `${resolveEnemyArt(enemy.style).label}: ${tooStrongEvent.enemyPower} Power. Ame is safe at ${tooStrongEvent.playerPower}; explore, then return.`,
          tone: "plain",
          sound: "bump",
        });
      }
      playSound("bump", mutedRef.current);
    } else if (rescuedEvent) {
      clearHeldInput();
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
    } else if (jumpedEvent && !openedDoorEvent) {
      presentationDuration = beginJumpPresentation(jumpedEvent, nextFeedback.sound);
    } else if (portalEvent) {
      clearHeldInput();
      presentationDuration = beginPortalPresentation(portalEvent);
    } else if (openedDoorEvent) {
      clearHeldInput();
      const door = level.objects.find(
        (object): object is Extract<LevelObject, { kind: "door" }> => (
          object.kind === "door" && object.id === openedDoorEvent.objectId
        ),
      );
      if (door && jumpedEvent) {
        const jumpDuration = beginJumpPresentation(jumpedEvent, "jump");
        const jumpSequence = presentationSequence.current;
        const doorDuration = prefersReducedMotion() ? REDUCED_PRESENTATION_MS : DOOR_OPEN_PRESENTATION_MS;
        schedulePresentationTimer(
          jumpSequence,
          () => beginDoorOpeningPresentation(openedDoorEvent, door),
          Math.max(100, jumpDuration - 20),
        );
        presentationDuration = Math.max(100, jumpDuration - 20) + doorDuration;
      } else if (door) {
        presentationDuration = beginDoorOpeningPresentation(openedDoorEvent, door);
      }
    }
    if (!defeatedEvent && !tooStrongEvent && !rescuedEvent && !jumpedEvent && !portalEvent && !openedDoorEvent && (nextFeedback.sound !== "bump" || performance.now() - lastBumpSoundAt.current >= 200)) {
      playSound(nextFeedback.sound, muted);
      if (nextFeedback.sound === "bump") lastBumpSoundAt.current = performance.now();
    }
    if (result.moved) setMovePulse((value) => value + 1);
    else setBumpPulse((value) => value + 1);

    if (result.state.status === "won") {
      const pending = pendingCompletionFor(
        level,
        result.state,
        progress,
        campaignIndex,
        runId,
        testerRun,
      );
      setCompletion(pending);
      musicTransport.setContext("victory");
      if (!mutedRef.current) void musicTransport.startFromUserGesture();
      if (pending.newStickerIds.length > 0 || pending.newMedalIds.length > 0 || pending.newBadgeIds.length > 0) {
        rewardSoundTimer.current = window.setTimeout(() => {
          playSound(pending.newBadgeIds.length > 0 ? "stamp" : "reward", mutedRef.current);
          rewardSoundTimer.current = undefined;
        }, presentationDuration + 520);
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
  }, [beginBattlePresentation, beginDoorOpeningPresentation, beginJumpPresentation, beginPortalPresentation, beginRescuePresentation, campaignIndex, clearHeldInput, explorationMode, game, guidedObjectId, level, inputBlock.gameplayInputAllowed, muted, progress, runId, schedulePresentationTimer, screen, showMapNotice, testerRun]);

  const dismissStory = useCallback(() => {
    setStoryOpen(false);
    musicTransport.setContext("maze");
    if (!mutedRef.current) void musicTransport.startFromUserGesture();
    playSound("select", mutedRef.current);
  }, [level, musicTransport]);

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
      if (modalOpen) return;
      if (
        event.key === "Escape"
        && screen === "game"
        && bigMaze
        && game.status === "playing"
      ) {
        event.preventDefault();
        setBigMaze(false);
        return;
      }
      if (event.defaultPrevented) return;
      if (event.target instanceof HTMLElement && event.target.closest("input, select, textarea, a, [contenteditable='true']")) return;
      const direction = directionForKey(event.key);
      if (!direction || screen !== "game" || modalOpen || game.status !== "playing") return;
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
  }, [bigMaze, clearHeldInput, dismissStory, game.status, helpOpen, hintOpen, modalOpen, pendingAdventure, screen, storyOpen, testerPickerOpen, tooStrongEncounter]);

  useEffect(() => {
    if (inputBlock.clearHeldInput || game.status !== "playing") {
      clearHeldInput();
    }
  }, [clearHeldInput, game.status, inputBlock.clearHeldInput]);

  useEffect(() => () => {
    clearPresentationWork();
    if (inputUnlockTimer.current !== undefined) window.clearTimeout(inputUnlockTimer.current);
    if (heldKeyTimer.current !== undefined) window.clearTimeout(heldKeyTimer.current);
    if (pointerHoldTimer.current !== undefined) window.clearTimeout(pointerHoldTimer.current);
    if (restartTimer.current !== undefined) window.clearTimeout(restartTimer.current);
    if (rewardSoundTimer.current !== undefined) window.clearTimeout(rewardSoundTimer.current);
    musicTransport.dispose();
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
    if (!inputBlock.gameplayInputAllowed) return;
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
    if (!inputBlock.gameplayInputAllowed) return;
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
    const opensStory = mode === "normal"
      && nextLevel.source === "curated"
      && storyForLevel(nextLevel.id) !== undefined;
    musicTransport.setContext(opensStory ? "story" : "maze");
    musicTransport.setMuted(muted);
    if (!muted) void musicTransport.startFromUserGesture();
    setRunMode(mode);
    loadLevel(nextLevel);
    setStoryOpen(opensStory);
    setHasActiveRun(true);
    setScreen("game");
    playSound(sound, muted);
  };

  const resumeRun = () => {
    preloadLevelArt(level);
    musicTransport.setContext(game.status === "won" ? "victory" : "maze");
    musicTransport.setMuted(muted);
    if (!muted) void musicTransport.startFromUserGesture();
    setPendingAdventure(null);
    setStoryOpen(false);
    setScreen("game");
    playSound("select", muted);
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
    const key = hintStateKey(game);
    setHintUsesByState((uses) => ({ ...uses, [key]: Math.min(4, (uses[key] ?? 0) + 1) }));
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
    setResetProgressError(false);
    setResetProgressOpen(true);
    playSound("menu", muted);
  };

  const closeResetProgress = () => {
    setResetProgressError(false);
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
    clearHeldInput();
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

  const enterHome = () => {
        musicTransport.setContext("title");
    musicTransport.setMuted(muted);
    if (!muted) void musicTransport.startFromUserGesture();
    setScreen("title");
    playSound("title", muted);
  };

  const showTitle = () => {
    cancelPresentations();
    clearHeldInput();
    if (inputUnlockTimer.current !== undefined) window.clearTimeout(inputUnlockTimer.current);
    inputUnlockTimer.current = undefined;
    inputLocked.current = false;
        musicTransport.setContext("title");
    musicTransport.setMuted(muted);
    if (!muted) void musicTransport.startFromUserGesture();
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
    musicTransport.setContext("adventure-book");
    musicTransport.setMuted(muted);
    if (!muted) void musicTransport.startFromUserGesture();
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

    const resetResult = resetAllGameProgressResult();
    if (!resetResult.cleared) {
      setResetProgressError(true);
      return;
    }
    setProgress(resetResult.progress);
    setRunMode("normal");
    setHasActiveRun(false);
    setResetProgressOpen(false);
    loadLevel(firstLevel);
    showTitle();
  };

  const stayHere = () => {
    if (game.status !== "won") return;
    setGame(stayAfterPendingCompletion(level, game));
    setCompletion(null);
    musicTransport.setContext("maze");
    musicTransport.setMuted(muted);
    if (!muted) void musicTransport.startFromUserGesture();
    playSound("select", muted);
    window.setTimeout(() => boardRef.current?.focus(), 0);
  };

  const nextLevel = () => {
    if (testerRun) {
      const nextIndex = campaignIndex >= 0 ? (campaignIndex + 1) % CURATED_LEVELS.length : 0;
      enterLevel(CURATED_LEVELS[nextIndex]!, "select", "tester");
      return;
    }
    if (game.status !== "won" || !completion) return;
    const nextProgress = applyLevelCompletion(
      progress,
      completionInputFor(level, game, campaignIndex, completion.completionId),
    );
    const progressSaved = writePlayerProgress(nextProgress);
    setSaveWarning((current) => progressSaved && current === "progress"
      ? null
      : !progressSaved ? "progress" : current);
    if (!progressSaved) return;
    setProgress(nextProgress);
    const runCleared = clearActiveRun();
    setSaveWarning((current) => runCleared && current === "run"
      ? null
      : !runCleared && current !== "progress" ? "run" : current);
    setCompletion(null);
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
    ? getRequiredPath(level, game)?.[0] ?? null
    : null;
  const currentHintKey = hintStateKey(game);
  // Solver-backed help is intentionally on demand. Running this search during
  // every ordinary render/movement commit makes larger mazes feel sticky.
  const currentHint = useMemo(() => hintOpen
    ? getProgressiveHint(
      level,
      game,
      Math.max(0, (hintUsesByState[currentHintKey] ?? 1) - 1),
    )
    : null,
  [game, hintOpen, hintUsesByState, currentHintKey, level]);
  const newCollectibles = completion ? [
    ...completion.newStickerIds.map((id) => ({ id, label: STICKER_LABELS[id].label, art: stickerArt(id), kind: "New sticker" })),
    ...completion.newMedalIds.map((id) => ({ id, label: ACHIEVEMENT_LABELS[id].label, art: medalArt(id), kind: "New medal" })),
    ...completion.newBadgeIds.map((id) => ({ id, label: BADGE_LABELS[id].label, art: badgeArt(id), kind: "New badge" })),
  ] : [];
  const allFriendsRescued = completion !== null
    && completion.rescuedSpecies.length === animalObjects.length;
  const nextMazeLabel = completion?.testerRun
    ? "Next test maze"
    : campaignIndex + 1 < CURATED_LEVELS.length ? "Next maze" : "Surprise maze";
  const treasureFlightStyle = treasurePresentation ? (() => {
    const board = boardRef.current;
    const target = appFrameRef.current?.querySelector<HTMLElement>(`[data-ui-anchor="${treasurePresentation.currency}"]`);
    const shell = appFrameRef.current?.querySelector<HTMLElement>(".play-shell");
    if (!board || !target || !shell) return undefined;
    return measuredFlight(board.getBoundingClientRect(), target.getBoundingClientRect(), shell.getBoundingClientRect(),
      (treasurePresentation.at.x - cameraWindow.left + .5) / cameraWindow.width,
      (treasurePresentation.at.y - cameraWindow.top + .5) / cameraWindow.height) as CSSProperties;
  })() : undefined;
  const openSound = (trigger?: HTMLElement) => {
    modalReturnFocus.current = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    clearHeldInput();
    setSoundOpen(true);
  };
  const openArtDetail = (detail: ArtDetail, trigger: HTMLElement) => {
    modalReturnFocus.current = trigger;
    clearHeldInput();
    setArtDetail(detail);
  };

  const utilityActions: import("./ui/game/AdventureHud").UtilityAction[] = [
              { id: "home", label: "Home", art: ASSETS.navHome, run: showTitle },
              { id: "mazes", label: "Mazes", art: ASSETS.navMazes, run: openLevelPicker },
              { id: "book", label: "Book", art: ASSETS.navBook, run: showAchievements },
              { id: "help", label: "Help", art: ASSETS.navHelp, run: trigger => { modalReturnFocus.current = trigger; setHelpOpen(true); } },
              { id: "sound", label: "Sound", art: muted ? ASSETS.navMuted : ASSETS.navSound, run: openSound },
              { id: "restart", label: restartArmed ? "Again!" : "Restart", art: ASSETS.navRestart, pressed: restartArmed, run: armRestart },
              ...(levelStory ? [{ id: "story", label: "Story", art: ASSETS.navBook, run: openStory }] : []),
              { id: "big-maze", label: bigMaze ? "Normal" : "Big maze", pressed: bigMaze, run: toggleBigMaze },
              ...(testerToolsEnabled ? [{ id: "tester", label: "Pick maze", art: ASSETS.navMazes, run: openTesterPicker }] : []),
  ];

  return (
    <main ref={appFrameRef} className="app-frame">
      <div className="game-stage-slot">
        <section className={`game-stage screen-${screen}`} aria-label="Maze so Puzzle game" data-motion={motion} data-quality={preferences.quality}>
        {saveWarning && (
          <p className="save-warning" role="alert">
            {saveWarning === "progress"
              ? "Ame’s Adventure Book couldn’t be saved on this device. Keep the game open and try another maze after checking storage access."
              : "This maze couldn’t be saved on this device. You can keep playing, but closing the game may restart this maze."}
          </p>
        )}
        {screen === "front-door" ? (
          <FrontDoorScreen
            playRef={frontDoorPlayRef}
            muted={muted}
            onPlay={enterHome}
            blocked={modalOpen}
          />
        ) : screen === "title" ? (
          <TitleScreen
            progress={progress}
            updatedMazeRestarted={initialRunResult.discardedUpdatedRun}
            activeRun={runInProgress ? { name: level.name, steps: game.steps } : null}
            blocked={modalOpen}
            muted={muted}
            playRef={titlePlayRef}
            onPlay={runInProgress ? resumeRun : continueStory}
            onSurprise={() => requestEnterLevel(makeSurprise(), "title")}
            onAchievements={showAchievements}
            onChooseMaze={(trigger) => openLevelPicker(trigger)}
            onRequestReset={openResetProgress}
            onOpenTester={openTesterPicker}
            onToggleSound={() => openSound()}
          />
        ) : screen === "achievements" ? (
          <AchievementsScreen
            progress={progress}
            unlockedLevelIds={progress.unlockedLevelIds}
            activeRun={runInProgress ? { levelId: level.id, name: level.name, steps: game.steps } : null}
            blocked={modalOpen}
            headingRef={achievementsHeadingRef}
            muted={muted}
            onHome={showTitle}
            onResume={resumeRun}
            onPlayLevel={requestEnterLevel}
            onSurprise={() => requestEnterLevel(makeSurprise())}
            onRequestReset={openResetProgress}
            onToggleSound={() => openSound()}
            onDetail={openArtDetail}
          />
        ) : (
          <>
        <h1 className="sr-only">Maze so Puzzle: For Ame to Solve!</h1>
        <div className="ambient-star star-one" aria-hidden="true">✦</div>
        <div className="ambient-star star-two" aria-hidden="true">✧</div>

        <PlayShell big={bigMaze} blocked={modalOpen}>
          {treasurePresentation && (
            <div className={`treasure-flight treasure-flight-${treasurePresentation.currency}`} style={treasureFlightStyle} aria-hidden="true">
              <CatalogueImage src={treasurePresentation.currency === "gold" ? ASSETS.treasureGoldChest : ASSETS.treasureScienceGears} alt="" />
              {Array.from({ length: 8 }, (_, index) => <i key={index} style={{ "--mote": index } as CSSProperties}>{treasurePresentation.currency === "gold" ? "★" : "✦"}</i>)}
              <b>+{treasurePresentation.amount}</b>
            </div>
          )}
          <MazeViewport name={level.name}>
            <div
              ref={boardRef}
              data-focus-id="maze-board"
              data-scene-slot="board"
              className={`maze-board${explorationMode ? " exploration-camera" : ""} ${bumpPulse % 2 ? "bump-a" : "bump-b"}${battlePresentation ? " battle-active" : ""}${rescuePresentation ? " rescue-active" : ""}${jumpPresentation ? " jump-active" : ""}${portalPresentation ? " portal-active" : ""}${doorOpeningPresentation ? " door-opening-active" : ""}`}
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
              <div className="camera-world" data-scene-slot="world" style={cameraWorldStyle(level, cameraWindow)} aria-hidden="true">
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
                    data-key-color={object.kind === "key" || object.kind === "door" ? object.color : undefined}
                    key={object.id}
                    style={worldLayerStyle(object.at, level)}
                  >
                    {object.kind === "animal" ? (
                      <div
                        className="animal-stack"
                        data-flourish={animalPersonality(object.species).flourish}
                      >
                        <CatalogueImage usage="field" className="animal-sprite" src={animalArt(object.species)} alt="" draggable={false} />
                        <CatalogueImage usage="field" className="animal-cage" src={resolveCageArt(object.cageStyle).src} alt="" draggable={false} />
                      </div>
                    ) : (
                      <CatalogueImage usage="field" className={classForObject(object)} src={spriteFor(object)} alt="" draggable={false} />
                    )}
                    {object.kind === "enemy" && <span className="power-badge enemy-power">{object.power}</span>}
                    {object.kind === "potion" && <span className="item-amount">+{object.amount}</span>}
                    {object.kind === "treasure" && <span className="item-amount treasure-amount">+{object.amount}</span>}
                    {(object.kind === "key" || object.kind === "door") && (
                      <span className={`object-color-name color-name-${object.color}`}>{KEY_MOTIF_LABELS[object.color]}</span>
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
                        <CatalogueImage usage="field" src={animalArt(animal.species)} alt="" draggable={false} />
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

              {doorOpeningPresentation && isInsideWindow(doorOpeningPresentation.at, cameraWindow) && (
                <div
                  data-scene-slot="effects"
                  className={`door-opening-presentation door-magic-${doorOpeningPresentation.color}`}
                  data-key-color={doorOpeningPresentation.color}
                  data-sfx-cue="colour-lock-chime-and-magic-burst"
                  style={{
                    ...cameraLayerStyle(doorOpeningPresentation.at, cameraWindow),
                    "--magic-core": LOCK_MAGIC_EFFECTS[doorOpeningPresentation.color].core,
                    "--magic-glow": LOCK_MAGIC_EFFECTS[doorOpeningPresentation.color].glow,
                    "--magic-pale": LOCK_MAGIC_EFFECTS[doorOpeningPresentation.color].pale,
                  } as CSSProperties}
                  aria-hidden="true"
                >
                  <span className="door-opening-halo" />
                  <CatalogueImage usage="field" className="door-opening-sprite" src={doorOpeningPresentation.doorSrc} alt="" draggable={false} />
                  <b className="door-opening-motif">{LOCK_MAGIC_EFFECTS[doorOpeningPresentation.color].symbols[0]}</b>
                  <span className="door-opening-particles">
                    {createDoorBurstParticles(doorOpeningPresentation.color).map((particle, index) => (
                      <i
                        style={{
                          "--burst-x": particle.x,
                          "--burst-y": particle.y,
                          "--burst-delay": `${particle.delayMs}ms`,
                          "--burst-scale": particle.scale,
                        } as CSSProperties}
                        key={`${particle.glyph}-${index}`}
                      >{particle.glyph}</i>
                    ))}
                  </span>
                </div>
              )}

              {battlePresentation && isInsideWindow(battlePresentation.at, cameraWindow) && (
                <div
                  data-scene-slot="effects"
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
                    <CatalogueImage usage="field" className="battle-sprite" src={ASSETS.ame} alt="" draggable={false} />
                    {game.hasSword && <CatalogueImage usage="field" className="battle-held-weapon" src={weaponArt.src} alt="" draggable={false} style={heldWeaponStyle(weaponArt, "battle")} />}
                    <span className="power-badge player-power">{displayedPower}</span>
                  </div>
                  <div className="battle-combatant battle-enemy" style={cameraLayerStyle(battlePresentation.at, cameraWindow)}>
                    <CatalogueImage usage="field" className="battle-sprite" src={battlePresentation.enemySrc} alt="" draggable={false} />
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
                  data-scene-slot="effects"
                  className="rescue-presentation"
                  data-animal-motion={animalPersonality(rescuePresentation.species).motion}
                  data-flourish={animalPersonality(rescuePresentation.species).flourish}
                  data-sfx-cue="cage-pop-and-friend-cheer"
                  style={cameraLayerStyle(rescuePresentation.at, cameraWindow)}
                  aria-hidden="true"
                >
                  <CatalogueImage usage="field" className="rescue-presentation-pet" src={animalArt(rescuePresentation.species)} alt="" draggable={false} />
                  <span className="rescue-cage-half cage-half-left"><CatalogueImage usage="field" src={rescuePresentation.cageSrc} alt="" draggable={false} /></span>
                  <span className="rescue-cage-half cage-half-right"><CatalogueImage usage="field" src={rescuePresentation.cageSrc} alt="" draggable={false} /></span>
                  <span className="rescue-happy-burst">
                    {Array.from({ length: 7 }, (_, index) => (
                      <i style={{ "--heart-index": index } as CSSProperties} key={index}>{index % 2 ? "✦" : "♥"}</i>
                    ))}
                  </span>
                </div>
              )}

              {jumpPresentation && (
                <div
                  data-scene-slot="effects"
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
                    <CatalogueImage usage="field" className="jump-presentation-sprite" src={ASSETS.ame} alt="" draggable={false} />
                    <CatalogueImage usage="field" className="jump-presentation-boots" src={ASSETS.springBoots} alt="" draggable={false} />
                    {game.hasSword && <CatalogueImage usage="field" className="jump-presentation-weapon" src={weaponArt.src} alt="" draggable={false} />}
                    <span className="power-badge player-power">{displayedPower}</span>
                    <i className="jump-spring-squash" />
                  </div>
                </div>
              )}

              {portalPresentation && (
                <div
                  data-scene-slot="effects"
                  className={`portal-presentation portal-${portalPresentation.pair}`}
                  style={cameraLayerStyle(portalPresentation.to, cameraWindow)}
                  data-sfx-cue="magic-flower-whoosh"
                  aria-hidden="true"
                >
                  <CatalogueImage usage="field" className="portal-presentation-pad" src={resolvePortalArt(portalPresentation.pair).src} alt="" draggable={false} />
                  <span className="portal-presentation-rings"><i /><i /><i /></span>
                  <div className="portal-presentation-body">
                    <CatalogueImage usage="field" className="portal-presentation-sprite" src={ASSETS.ame} alt="" draggable={false} />
                    {game.hasSword && <CatalogueImage usage="field" className="portal-presentation-weapon" src={weaponArt.src} alt="" draggable={false} style={heldWeaponStyle(weaponArt, "portal")} />}
                    <span className="power-badge player-power">{displayedPower}</span>
                  </div>
                  <span className="portal-presentation-sparkles">✦ <b>{resolvePortalArt(portalPresentation.pair).motif}</b> ✦</span>
                </div>
              )}

              <div
                data-scene-slot="actors"
                className={`player-layer ${movePulse % 2 ? "move-a" : "move-b"}${game.position.y === cameraWindow.top ? " camera-edge-top" : ""}${battlePresentation || jumpPresentation || portalPresentation ? " presentation-hidden" : ""}${displayedPower >= 99 ? " power-legendary" : ""}`}
                style={cameraLayerStyle(game.position, cameraWindow)}
                aria-hidden="true"
              >
                <CatalogueImage usage="field" className="player-sprite" src={ASSETS.ame} alt="" draggable={false} />
                {game.hasSword && <CatalogueImage usage="field" className="player-held-weapon" src={weaponArt.src} alt="" draggable={false} style={heldWeaponStyle(weaponArt, "field")} />}
                <span className="power-badge player-power">{displayedPower}</span>
              </div>

              {mapPickupToast && (!mapPickupToast.at || isInsideWindow(mapPickupToast.at, cameraWindow)) && (
                <div
                  className={`map-pickup-toast notice-${mapPickupToast.kind ?? "pickup"}${mapPickupToast.at ? " notice-anchored" : ""}`}
                  key={mapPickupToast.id}
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  style={mapPickupToast.at ? cameraNoticeStyle(mapPickupToast.at, cameraWindow) : undefined}
                >
                  {mapPickupToast.icon && <CatalogueImage src={mapPickupToast.icon} alt="" />}
                  <strong>{mapPickupToast.text}</strong>
                </div>
              )}
            </div>

            <p className="sr-only" id="maze-status">{mazeStatus}</p>

            <div className="sr-only" data-scene-slot="feedback" aria-live={mapPickupToast || feedback.sound === "step" || feedback.sound === "select" ? "off" : "polite"} aria-atomic="true">
              <CatalogueImage className="feedback-icon" src={feedback.icon} alt="" />
              <span>{feedback.text}</span>
            </div>
          </MazeViewport>
          <AdventureHud model={hudModel} name={level.name}
            chapter={isSurprise ? "Surprise maze" : `Story maze ${campaignIndex + 1} of ${CURATED_LEVELS.length}`}
            power={displayedPower} gold={displayedGold} science={displayedScience} steps={game.steps}
            tester={testerRun} suggested={suggestedMoveDirection}
            map={<MiniMap level={level} position={game.position} camera={cameraWindow}
              revealed={revealedTiles} currentView={explorationMode ? currentViewTiles : new Set(level.terrain.flatMap((row,y) => row.map((_,x) => toTileKey({x,y}))))}
              objects={activeObjects.filter(object => object.kind !== "treasure")} highlightedObjectId={guidedObjectId} />}
            onHint={openHint} onDetail={openArtDetail} onMove={attemptMove} onRead={clearHeldInput} startHold={startDpadHold} stopHold={stopDpadHold}
            feedback={feedback.sound !== "step" && feedback.sound !== "select" && <p className={`feedback-bar tone-${feedback.tone}`}><CatalogueImage src={feedback.icon} alt="" /><span>{feedback.text}</span></p>}
            actions={utilityActions}
            onMore={trigger => { modalReturnFocus.current = trigger; clearHeldInput(); setMoreOpen(true); }}
          />
        </PlayShell>

        {storyOpen && levelStory && (
          <StoryDialog title={`Chapter ${levelStory.chapter}: ${levelStory.title}`}
            returnFocus={modalReturnFocus.current} onBegin={dismissStory}
            turns={[{ id: `chapter-${levelStory.chapter}`, speaker: STORY_SPEAKER_LABELS[levelStory.speaker], portrait: storySpeakerArt(levelStory.speaker),
              line: <>{levelStory.intro.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<blockquote>“{levelStory.quote}”</blockquote></> }]}
            learning={<div className="story-thinking-strip"><strong>Puzzle power: {levelStory.puzzlePower}</strong><p>{levelStory.tryThis}</p></div>} />
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

        {hintOpen && currentHint && (
          <Modal title="A little hint" variant="hint" onClose={closeHint} returnFocus={modalReturnFocus.current}>
            <p className="hint-objective"><strong>Right now:</strong> {hudModel.objective}</p>
            <div className="hint-card">
              <CatalogueImage className="hint-spark" src={ASSETS.navHelp} alt="" />
              <p>{currentHint.text}</p>
              <small>Hint {currentHint.tier + 1} of 4 · ask again for a little more help</small>
            </div>
            <button className="primary-button" onClick={closeHint}>Got it!</button>
          </Modal>
        )}

        {blockerHint && (
          <Modal title="You need something!" variant="blocker" onClose={closeBlockerHint} returnFocus={modalReturnFocus.current}>
            <div className="blocker-hint-card">
              <PresentationArt art={blockerHint.itemArt} label={blockerHint.itemName} />
              <div>
                <strong>{blockerHint.message}</strong>
                <p>{blockerHint.count >= 3
                  ? "I’ve marked it with a sparkle on your map!"
                  : "Try another path and come back when you find it."}</p>
              </div>
            </div>
            <button className="primary-button" onClick={closeBlockerHint}>I’ll go find it!</button>
          </Modal>
        )}

        {game.status === "won" && completion && !presentationActive && (
          <Modal title="Maze solved!" variant="celebration" returnFocus={modalReturnFocus.current}>
            <div className="celebration-burst" aria-hidden="true">
              {Array.from({ length: 12 }, (_, index) => <i className="confetti-piece" style={{ "--i": index } as CSSProperties} key={index} />)}
            </div>
            <div className="win-summary">
              <CatalogueImage className="win-star-art" src={ASSETS.goal} alt="A sparkling golden star portal" />
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
                    <CatalogueImage src={animalArt(animal.species)} alt={ANIMAL_LABELS[animal.species]} decoding="async" />
                    <span>{rescued ? animalPersonality(animal.species).greeting : "Next time"}</span>
                  </div>
                );
              })}
            </div>
            {animalObjects.length > 0 && completion.rescuedSpecies.length === animalObjects.length && <div className="perfect-banner"><CatalogueImage src={ASSETS.rewardAnimalFriendSticker} alt="" /> Perfect rescue! Every friend is safe!</div>}
            {levelStory && (
              <div className="story-outro-card">
                <CatalogueImage src={storySpeakerArt(levelStory.speaker)} alt="" />
                <div>
                  <small>Chapter {levelStory.chapter} complete · {levelStory.puzzlePower}</small>
                  <p>{levelStory.outro}</p>
                </div>
              </div>
            )}
            {completion.testerRun ? (
              <div className="tester-preview-banner" role="status">
                <CatalogueImage src={ASSETS.navMazes} alt="" />
                <div><strong>Tester preview complete</strong><small>Nothing was saved and rewards stayed unchanged.</small></div>
              </div>
            ) : (
              <div className="reward-panel">
                <CatalogueImage className="reward-pouch" src={ASSETS.coinPouch} alt="A pouch of gold star coins" />
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
                    <CatalogueImage className="modal-reward-art" src={item.art} alt="" />
                    <div><small>{item.kind}</small><strong>{item.label}</strong></div>
                  </div>
                ))}
              </div>
            )}
            <div className="modal-actions">
              {allFriendsRescued ? (
                <>
                  <button className="primary-button" onClick={nextLevel}>{nextMazeLabel} <span>→</span></button>
                  <button className="secondary-button" onClick={stayHere}>Stay here</button>
                </>
              ) : (
                <>
                  <button className="primary-button" onClick={stayHere}>Stay here</button>
                  <button className="secondary-button" onClick={nextLevel}>{nextMazeLabel} <span>→</span></button>
                </>
              )}
              <button className="secondary-button" aria-pressed={restartArmed} onClick={armRestart}>
                {restartArmed ? "Yes, restart" : "Restart"}
              </button>
            </div>
          </Modal>
        )}

        {tooStrongEncounter && (
          <Modal title="Too strong!" variant="blocker" onClose={dismissTooStrongEncounter} returnFocus={modalReturnFocus.current} footer={<div className="modal-actions"><button className="primary-button" onClick={dismissTooStrongEncounter}>I’ll go get stronger.</button><button onClick={() => { dismissTooStrongEncounter(); openHint(document.querySelector<HTMLElement>(".maze-board")!); }}>Show Required Path</button></div>}>
            <div className="encounter-overview"><PresentationArt art={tooStrongEncounter.enemySrc} label={tooStrongEncounter.enemyLabel} compact />
            <div className="power-equation too-strong-equation" aria-label={`Ame has Power ${tooStrongEncounter.event.playerPower}, which is less than ${tooStrongEncounter.enemyLabel} with Power ${tooStrongEncounter.event.enemyPower}`}>
              <span className="power-side ame-side"><small>Ame</small><strong>{tooStrongEncounter.event.playerPower}</strong></span>
              <b aria-hidden="true">&lt;</b>
              <span className="power-side enemy-side"><small>{tooStrongEncounter.enemyLabel}</small><strong>{tooStrongEncounter.event.enemyPower}</strong></span>
            </div></div>
            <p className="modal-lead">Ame stayed safely one square away. Find more Power, then come back!</p>
            <div className="power-opportunities" data-search-state={powerGuidance ? "complete" : "pending"} data-search-exhausted={powerGuidance?.exhausted} aria-busy={!powerGuidance}>{powerGuidance?.opportunities.map(object => <article key={object.id} data-opportunity-id={object.id}><CatalogueImage src={spriteFor(object)} alt={object.kind === "enemy" ? resolveEnemyArt(object.style).label : "Power Potion"} displayPx={64} /><strong>{object.kind === "enemy" ? "Fight weaker monsters" : "Find a Power Potion"}</strong><p>{object.kind === "enemy" ? `${resolveEnemyArt(object.style).label} · Power ${object.power}` : "A helpful potion is still in this maze."}</p></article>)}</div>
          </Modal>
        )}

          </>
        )}

        {moreOpen && <Modal title="More adventures" onClose={() => setMoreOpen(false)} returnFocus={modalReturnFocus.current}>
          <h3>{level.name}</h3><p>{hudModel.objective}</p>
          <div className="more-actions">{utilityActions.map(action => <button key={action.id} data-focus-id={action.id} aria-pressed={action.pressed} onClick={event => { if (action.id !== "restart") setMoreOpen(false); action.run((modalReturnFocus.current ?? event.currentTarget) as HTMLButtonElement); }}>{action.art && <CatalogueImage art={action.art} alt="" />}<span>{action.label}</span></button>)}</div>
          <h3>Bag details</h3><div className="more-actions">{hudModel.slots.map(slot => <button key={slot.id} data-focus-id={`bag:${slot.id}`} onClick={() => { setMoreOpen(false); openArtDetail({art:slot.art,label:slot.label,description:`${slot.found ? "Found." : "Still to find."} ${slot.description}`},modalReturnFocus.current as HTMLButtonElement); }}><CatalogueImage art={slot.art} alt="" /><span>{slot.label} · {slot.found ? "Found" : "Not found"}</span></button>)}</div>
          <h3>Friends details · optional</h3><div className="more-actions">{hudModel.friends.map(friend => <button key={friend.id} data-focus-id={`friend:${friend.id}`} onClick={() => { setMoreOpen(false); openArtDetail({art:friend.art as import("./ui/art").UiArt,label:friend.label,description:friend.rescued ? "Safe with Ame!" : "Waiting in the maze. Friends are optional."},modalReturnFocus.current as HTMLButtonElement); }}><CatalogueImage art={friend.art as import("./ui/art").UiArt} alt="" /><span>{friend.label} · {friend.rescued ? "Rescued" : "Waiting"}</span></button>)}</div>
        </Modal>}
        {soundOpen && <SoundDialog transport={musicTransport} onClose={() => setSoundOpen(false)} returnFocus={modalReturnFocus.current} />}
        {artDetail && <Modal title={artDetail.label} variant="celebration" onClose={() => setArtDetail(null)} returnFocus={modalReturnFocus.current}>
          <PresentationArt art={artDetail.art} label={artDetail.label} /><p className="modal-lead">{artDetail.description}</p>
          <button className="primary-button" onClick={() => setArtDetail(null)}>Back to the adventure</button>
        </Modal>}
        {screen === "game" && game.status === "lost" && <Modal title="Let's try again" onClose={() => loadLevel(level)}><p>A fresh start is ready.</p><button className="primary-button" onClick={() => loadLevel(level)}>Restart</button></Modal>}
        {levelPickerOpen && (
          <Modal title="Choose a maze" onClose={closeLevelPicker} returnFocus={modalReturnFocus.current}>
            <p className="modal-lead level-picker-lead">Replay any unlocked story maze and bring home friends you missed.</p>
            <div className="level-picker-list" aria-label="Unlocked story mazes">
              {unlockedStoryLevels.map((candidate) => {
                const index = CURATED_LEVELS.findIndex((storyLevel) => storyLevel.id === candidate.id);
                const result = progress.bestResultsByLevel[candidate.id];
                const currentResult = result && hasCurrentGameplay(
                  candidate,
                  result.contentRevision ?? 0,
                  result.gameplayFingerprint ?? "",
                ) ? result : undefined;
                const friendTotal = candidate.objects.filter((object) => object.kind === "animal").length;
                const earlierBest = [
                  result?.historicalBestSteps,
                  !currentResult ? result?.bestSteps : undefined,
                ].filter((steps): steps is number => typeof steps === "number")
                  .reduce<number | undefined>((best, steps) => best === undefined ? steps : Math.min(best, steps), undefined);
                return (
                  <button key={candidate.id} className={candidate.id === level.id ? "current" : ""} onClick={() => {
                    setLevelPickerOpen(false);
                    requestEnterLevel(candidate, screen === "title" ? "title" : "select");
                  }}>
                    <b>{index + 1}</b>
                    <span>
                      <strong>{candidate.name}</strong>
                      <small>{currentResult
                        ? `Best ${currentResult.bestSteps ?? "—"} steps · Friends ${currentResult.bestRescuedCount}/${friendTotal}${earlierBest !== undefined && earlierBest !== null ? ` · Earlier ${earlierBest}` : ""}`
                        : result
                          ? `New layout ready · Earlier best ${earlierBest ?? "—"} steps`
                          : `${candidate.width} × ${candidate.height} · New`}</small>
                      <em>{storyForLevel(candidate.id)?.puzzlePower}</em>
                    </span>
                    <i aria-hidden="true">{currentResult?.perfectRescue ? "★" : "→"}</i>
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
            <CatalogueImage className="modal-art" src={ASSETS.portrait} alt="Ame smiling with her adventure backpack" />
            <p className="modal-lead">
              <strong>{level.name}</strong> is waiting at {game.steps} {game.steps === 1 ? "step" : "steps"}.
              Starting <strong>{pendingAdventure.level.name}</strong> will restart this run.
            </p>
            {resetProgressError && (
              <p className="modal-lead" role="alert">
                We couldn’t finish forgetting the saved adventure on this device, so this screen has not changed. Please try again.
              </p>
            )}
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
            <CatalogueImage className="modal-art" src={ASSETS.portrait} alt="Ame smiling with her adventure backpack" />
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
        <CatalogueImage src={ASSETS.portrait} alt="" />
        <strong>Turn me sideways</strong>
        <span>Ame's maze likes landscape mode.</span>
      </div>
    </main>
  );
}

function HelpStep({ image, title, copy }: { readonly image: string; readonly title: string; readonly copy: string }) {
  return <div className="help-step"><CatalogueImage src={image} alt="" /><div><strong>{title}</strong><p>{copy}</p></div></div>;
}

export default App;
