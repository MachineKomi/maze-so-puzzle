import {
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  ASSETS,
  preloadAchievementArt,
  preloadLevelArt,
  preloadRewardArt,
} from "./assets";
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
  MUSIC_TRACKS,
  configureMusic,
  disposeMusic,
  setMusicMuted,
  setMusicPageHidden,
  startMusicFromUserGesture,
} from "./music";
import { getNextStoryIndex, shouldConfirmMazeSwitch } from "./navigation";
import { clearActiveRun, readActiveRun, writeActiveRun } from "./session";

const DIRECTION_ICONS: Record<Direction, string> = {
  up: "▲",
  down: "▼",
  left: "◀",
  right: "▶",
};

const COLOR_LABELS: Record<KeyColor, string> = {
  red: "Rose",
  blue: "Blue",
  yellow: "Sunny",
};

const ANIMAL_LABELS: Record<AnimalSpecies, string> = {
  bunny: "Bunny",
  fox: "Fox",
  kitten: "Kitten",
};

const MOVE_CADENCE_MS = 64;
const BUMP_CADENCE_MS = 45;
const HELD_KEY_DELAY_MS = 105;
const HELD_KEY_REPEAT_MS = 64;
const BUILD_VERSION = "0.6.0";
const DEBUG_MAZE_QUERY = "mazes";

interface Feedback {
  readonly icon: string;
  readonly text: string;
  readonly tone: "plain" | "good" | "careful";
  readonly sound: SoundName;
}

interface CompletionCelebration {
  readonly reward: CalculatedLevelReward;
  readonly newStickerIds: readonly StickerId[];
  readonly newMedalIds: readonly RescueMedalId[];
  readonly newBadgeIds: readonly BadgeId[];
  readonly rescuedSpecies: readonly AnimalSpecies[];
  readonly totalGold: number;
  readonly testerRun: boolean;
}

type AppScreen = "title" | "game" | "achievements";
type RunMode = "normal" | "tester";

interface PendingAdventure {
  readonly level: LevelDefinition;
  readonly sound: "select" | "title";
}

function feedbackFor(events: readonly GameEvent[]): Feedback {
  const event = [...events].reverse().find((item) => item.type !== "moved") ?? events[0];
  if (!event) return { icon: "👣", text: "Move one square.", tone: "plain", sound: "step" };

  switch (event.type) {
    case "level-won":
      return { icon: "✨", text: "Maze solved!", tone: "good", sound: "win" };
    case "combat-lost":
      return { icon: "☁️", text: "That goblin is stronger. Try again!", tone: "careful", sound: "lose" };
    case "enemy-defeated":
      return {
        icon: "⭐",
        text: `Goblin scooted away! ${event.powerBefore} + ${event.enemyPower} = ${event.powerAfter}`,
        tone: "good",
        sound: "power",
      };
    case "potion-collected":
      return {
        icon: "🧡",
        text: `Power potion! ${event.powerBefore} + ${event.amount} = ${event.powerAfter}`,
        tone: "good",
        sound: "power",
      };
    case "animal-rescued":
      return {
        icon: "💖",
        text: `${ANIMAL_LABELS[event.species]} is free! What a lovely friend!`,
        tone: "good",
        sound: "rescue",
      };
    case "sword-collected":
      return { icon: "🗡️", text: "Shiny sword found!", tone: "good", sound: "pickup" };
    case "boots-collected":
      return { icon: "🥾", text: "Splashy boots found!", tone: "good", sound: "pickup" };
    case "key-collected":
      return {
        icon: "🔑",
        text: `${COLOR_LABELS[event.color]} star key found!`,
        tone: "good",
        sound: "pickup",
      };
    case "door-opened":
      return { icon: "✨", text: "The star door opened!", tone: "good", sound: "unlock" };
    case "blocked":
      switch (event.reason) {
        case "needs-sword":
          return { icon: "🗡️", text: "Find the sword first!", tone: "careful", sound: "bump" };
        case "needs-boots":
          return {
            icon: "🥾",
            text: event.terrain === "lava" ? "Boots make lava safe!" : "Boots keep toes dry!",
            tone: "careful",
            sound: "bump",
          };
        case "needs-key":
          return {
            icon: "🔑",
            text: `Find the ${event.color ? COLOR_LABELS[event.color].toLowerCase() : "matching"} star key!`,
            tone: "careful",
            sound: "bump",
          };
        case "wall":
        case "out-of-bounds":
          return { icon: "🌸", text: "Boop! A wall.", tone: "plain", sound: "bump" };
        case "game-over":
          return { icon: "✨", text: "Choose a button below.", tone: "plain", sound: "bump" };
      }
    case "moved":
      return { icon: "👣", text: "One step closer!", tone: "plain", sound: "step" };
  }
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
    case "enemy": return `friendly goblin with Power ${object.power}`;
    case "sword": return "shiny sword";
    case "boots": return "protective boots";
    case "potion": return `Power potion worth ${object.amount}`;
    case "key": return `${COLOR_LABELS[object.color]} star key`;
    case "door": return `${COLOR_LABELS[object.color]} locked door`;
    case "animal": return `caged ${ANIMAL_LABELS[object.species].toLowerCase()}`;
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
    return `${label}: open path`;
  });
  return `Ame is at column ${state.position.x + 1}, row ${state.position.y + 1}. ${nearby.join(". ")}.`;
}

function previewKind(level: LevelDefinition, state: GameState, direction: Direction): "go" | "stop" | "danger" {
  const target = targetFor(state, direction);
  const terrain = getTerrainAt(level, target);
  if (!terrain || terrain === "wall") return "stop";
  if ((terrain === "water" || terrain === "lava") && !state.hasBoots) return "stop";
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
  switch (species) {
    case "bunny": return ASSETS.animalBunny;
    case "fox": return ASSETS.animalFox;
    case "kitten": return ASSETS.animalKitten;
  }
}

function spriteFor(object: Exclude<LevelObject, { kind: "animal" }>): string {
  switch (object.kind) {
    case "enemy": return ASSETS.goblin;
    case "sword": return ASSETS.sword;
    case "boots": return ASSETS.boots;
    case "potion": return ASSETS.potion;
    case "key": return ASSETS.key;
    case "door": return ASSETS.door;
  }
}

function classForObject(object: LevelObject): string {
  const color = object.kind === "key" || object.kind === "door" ? ` color-${object.color}` : "";
  return `maze-object object-${object.kind}${color}`;
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

const MazeTerrain = memo(function MazeTerrain({
  level,
  camera,
}: {
  readonly level: LevelDefinition;
  readonly camera: CameraWindow;
}) {
  const walls = createRoundedTerrainPath(level, camera, "wall", 0.13);
  const water = createRoundedTerrainPath(level, camera, "water", 0.16);
  const lava = createRoundedTerrainPath(level, camera, "lava", 0.16);

  return (
    <>
      <svg
        className="maze-terrain-svg"
        viewBox={`${camera.left} ${camera.top} ${camera.width} ${camera.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern id="maze-floor-pattern" patternUnits="userSpaceOnUse" width="5.2" height="5.2">
            <image href={ASSETS.floor} x="0" y="0" width="5.2" height="5.2" preserveAspectRatio="none" />
          </pattern>
          <pattern id="maze-wall-pattern" patternUnits="userSpaceOnUse" width="5.2" height="5.2">
            <image href={ASSETS.wall} x="0" y="0" width="5.2" height="5.2" preserveAspectRatio="none" />
          </pattern>
          <pattern id="maze-water-pattern" patternUnits="userSpaceOnUse" width="4.6" height="4.6">
            <image href={ASSETS.water} x="0" y="0" width="4.6" height="4.6" preserveAspectRatio="none" />
          </pattern>
          <pattern id="maze-lava-pattern" patternUnits="userSpaceOnUse" width="4.6" height="4.6">
            <image href={ASSETS.lava} x="0" y="0" width="4.6" height="4.6" preserveAspectRatio="none" />
          </pattern>
        </defs>

        <rect x={camera.left} y={camera.top} width={camera.width} height={camera.height} fill="url(#maze-floor-pattern)" />
        {water.d && <path d={water.d} fill="url(#maze-water-pattern)" fillRule={water.fillRule} stroke="#edc875" strokeWidth="0.11" strokeLinejoin="round" />}
        {lava.d && <path d={lava.d} fill="url(#maze-lava-pattern)" fillRule={lava.fillRule} stroke="#efbf70" strokeWidth="0.11" strokeLinejoin="round" />}
        {walls.d && <path d={walls.d} fill="url(#maze-wall-pattern)" fillRule={walls.fillRule} />}
      </svg>
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
      <div className="maze-map-heading"><span aria-hidden="true">🗺️</span><strong>My map</strong><small>{exploredPercent}%</small></div>
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
          const object = seen ? visibleObjectByTile.get(tileKey) : undefined;
          const isPlayer = pointsEqual(position, point);
          const isExit = seen && pointsEqual(level.exit, point);
          return (
            <i
              key={tileKey}
              className={`minimap-tile ${seen ? `map-${terrain} ${inView ? "in-view" : "remembered"}` : "map-fog"}`}
            >
              {isExit && <b className="map-marker marker-exit" />}
              {object && <b className={`map-marker marker-${object.kind}${object.kind === "door" || object.kind === "key" ? ` marker-${object.color}` : ""}`} />}
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
        ? <div className="maze-map-nudge"><span>✨</span> Walk to reveal the maze!</div>
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
  switch (id) {
    case "first-star": return ASSETS.rewardTrailSticker;
    case "animal-friend": return ASSETS.rewardRescueMedal;
    case "surprise-sparkle": return ASSETS.rewardSplashSticker;
  }
}

function medalArt(id: RescueMedalId): string {
  return id === "perfect-rescue-10" ? ASSETS.rewardBraveMedal : ASSETS.rewardRescueMedal;
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

function musicTrackForLevel(level: LevelDefinition): string {
  if (level.source === "generated") return MUSIC_TRACKS.surprise;
  const index = CURATED_LEVELS.findIndex((candidate) => candidate.id === level.id);
  return index >= 4 ? MUSIC_TRACKS.laterStory : MUSIC_TRACKS.earlyStory;
}

function App() {
  const [initialRun] = useState(() => readActiveRun(CURATED_LEVELS));
  const initialLevel = initialRun
    ? CURATED_LEVELS.find((candidate) => candidate.id === initialRun.levelId) ?? CURATED_LEVELS[0]!
    : CURATED_LEVELS[0]!;
  const [screen, setScreen] = useState<AppScreen>("title");
  const [hasActiveRun, setHasActiveRun] = useState(initialRun !== null);
  const [pendingAdventure, setPendingAdventure] = useState<PendingAdventure | null>(null);
  const [testerPickerOpen, setTesterPickerOpen] = useState(debugMazeQueryEnabled);
  const [bigMaze, setBigMaze] = useState(false);
  const [level, setLevel] = useState<LevelDefinition>(initialLevel);
  const [game, setGame] = useState<GameState>(() => initialRun?.game ?? createInitialGameState(initialLevel));
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
    icon: "✨",
    text: initialRun ? initialLevel.objective : "Help Ame find the star!",
    tone: "plain",
    sound: "step",
  });
  const [previewDirection, setPreviewDirection] = useState<Direction | null>(null);
  const [lastEvents, setLastEvents] = useState<readonly GameEvent[]>([]);
  const [movePulse, setMovePulse] = useState(0);
  const [bumpPulse, setBumpPulse] = useState(0);
  const [muted, setMuted] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [progress, setProgress] = useState<PlayerProgress>(readPlayerProgress);
  const [completion, setCompletion] = useState<CompletionCelebration | null>(null);
  const [restartArmed, setRestartArmed] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const inputLocked = useRef(false);
  const inputUnlockTimer = useRef<number | undefined>(undefined);
  const queuedDirection = useRef<Direction | null>(null);
  const attemptMoveRef = useRef<(direction: Direction) => void>(() => undefined);
  const heldKeys = useRef(new Map<string, Direction>());
  const heldKeyOrder = useRef<string[]>([]);
  const heldKeyTimer = useRef<number | undefined>(undefined);
  const dpadHoldDirection = useRef<Direction | null>(null);
  const dpadHoldPointerId = useRef<number | null>(null);
  const dpadHoldTimer = useRef<number | undefined>(undefined);
  const lastBumpSoundAt = useRef(0);
  const restartTimer = useRef<number | undefined>(undefined);
  const rewardSoundTimer = useRef<number | undefined>(undefined);
  const modalReturnFocus = useRef<HTMLElement | null>(null);
  const titlePlayRef = useRef<HTMLButtonElement>(null);
  const achievementsHeadingRef = useRef<HTMLHeadingElement>(null);
  const mutedRef = useRef(muted);
  const [testerToolsRequested] = useState(debugMazeQueryEnabled);

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
  const cameraWindow = useMemo(
    () => explorationMode ? getCameraWindow(level, game.position, DEFAULT_FOV_SIZE) : fullLevelWindow(level),
    [explorationMode, game.position, level],
  );
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
  const visibleObjects = useMemo(
    () => activeObjects.filter((object) => isInsideWindow(object.at, cameraWindow)),
    [activeObjects, cameraWindow],
  );
  const animalObjects = useMemo(
    () => ANIMAL_SPECIES.map((species) => level.objects.find(
      (object): object is Extract<LevelObject, { kind: "animal" }> => object.kind === "animal" && object.species === species,
    )).filter((object): object is Extract<LevelObject, { kind: "animal" }> => object !== undefined),
    [level],
  );
  const rescuedSpecies = useMemo(
    () => animalObjects.filter((object) => game.rescuedAnimalIds.includes(object.id)).map((object) => object.species),
    [animalObjects, game.rescuedAnimalIds],
  );
  const objectKinds = useMemo(() => new Set(level.objects.map((object) => object.kind)), [level]);
  const keyColors = useMemo(
    () => [...new Set(level.objects.flatMap((object) => object.kind === "key" ? [object.color] : []))],
    [level],
  );
  const mazeStatus = useMemo(() => describeMazePosition(level, game), [game, level]);
  const runInProgress = hasActiveRun && game.status === "playing";
  const modalOpen = testerPickerOpen
    || pendingAdventure !== null
    || (screen === "game" && (helpOpen || game.status !== "playing"));

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
    if (dpadHoldTimer.current !== undefined) {
      window.clearTimeout(dpadHoldTimer.current);
      dpadHoldTimer.current = undefined;
    }
  }, []);

  const clearHeldInput = useCallback(() => {
    heldKeys.current.clear();
    heldKeyOrder.current = [];
    queuedDirection.current = null;
    if (heldKeyTimer.current !== undefined) {
      window.clearTimeout(heldKeyTimer.current);
      heldKeyTimer.current = undefined;
    }
    clearDpadHold();
  }, [clearDpadHold]);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    const syncMusicVisibility = () => {
      setMusicPageHidden(document.visibilityState !== "visible");
    };
    syncMusicVisibility();
    document.addEventListener("visibilitychange", syncMusicVisibility);
    return () => document.removeEventListener("visibilitychange", syncMusicVisibility);
  }, []);

  useEffect(() => {
    const focusTimer = window.setTimeout(() => {
      if (screen === "title") titlePlayRef.current?.focus();
      else if (screen === "achievements") achievementsHeadingRef.current?.focus();
      else boardRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(focusTimer);
  }, [screen]);

  const loadLevel = useCallback((nextLevel: LevelDefinition) => {
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
    setLevel(nextLevel);
    setGame(createInitialGameState(nextLevel));
    setRevealedTiles(isExplorationLevel(nextLevel)
      ? revealVisibleTiles([], nextLevel, nextLevel.start, DEFAULT_FOV_SIZE)
      : new Set());
    setLastEvents([]);
    setPreviewDirection(null);
    setMovePulse(0);
    setBumpPulse(0);
    setCompletion(null);
    setPendingAdventure(null);
    setFeedback({ icon: "✨", text: nextLevel.objective, tone: "plain", sound: "step" });
    setRestartArmed(false);
  }, [clearHeldInput]);

  const attemptMove = useCallback((direction: Direction) => {
    const unavailable = (
      screen !== "game"
      || pendingAdventure !== null
      || testerPickerOpen
      || helpOpen
      || game.status !== "playing"
    );
    if (unavailable) {
      queuedDirection.current = null;
      return;
    }
    if (inputLocked.current) {
      queuedDirection.current = direction;
      return;
    }
    queuedDirection.current = null;
    inputLocked.current = true;
    const result = movePlayer(level, game, direction);
    if (result.state.status !== "playing") {
      modalReturnFocus.current = document.activeElement instanceof HTMLElement
        && document.activeElement !== document.body
        ? document.activeElement
        : boardRef.current;
    }
    const hasInteraction = result.events.some((event) => event.type !== "moved");
    const nextFeedback = hasInteraction
      ? feedbackFor(result.events)
      : { icon: "✨", text: level.objective, tone: "plain" as const, sound: "step" as const };
    setGame(result.state);
    if (result.moved && explorationMode) {
      setRevealedTiles((revealed) => revealVisibleTiles(
        revealed,
        level,
        result.state.position,
        DEFAULT_FOV_SIZE,
      ));
    }
    setLastEvents(result.events);
    setFeedback(nextFeedback);
    setPreviewDirection(direction);
    if (nextFeedback.sound !== "bump" || performance.now() - lastBumpSoundAt.current >= 200) {
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
          testerRun: true,
        });
      } else {
        const firstCompletion = progress.bestResultsByLevel[level.id] === undefined;
        const reward = calculateLevelReward({
          levelId: level.id,
          source: level.source,
          campaignIndex,
          rescuedCount: resultRescuedSpecies.length,
          firstCompletion,
        });
        const nextProgress = applyLevelCompletion(progress, {
          levelId: level.id,
          source: level.source,
          campaignIndex,
          rescuedCount: resultRescuedSpecies.length,
          rescuedSpecies: resultRescuedSpecies,
          steps: result.state.steps,
          power: result.state.power,
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
          testerRun: false,
        });
        if (newStickerIds.length > 0 || newMedalIds.length > 0 || newBadgeIds.length > 0) {
          rewardSoundTimer.current = window.setTimeout(() => {
            playSound(newBadgeIds.length > 0 ? "stamp" : "reward", mutedRef.current);
            rewardSoundTimer.current = undefined;
          }, 520);
        }
      }
    }

    if (inputUnlockTimer.current !== undefined) window.clearTimeout(inputUnlockTimer.current);
    inputUnlockTimer.current = window.setTimeout(() => {
      inputLocked.current = false;
      inputUnlockTimer.current = undefined;
      const nextDirection = queuedDirection.current;
      queuedDirection.current = null;
      if (nextDirection) attemptMoveRef.current(nextDirection);
    }, result.moved ? MOVE_CADENCE_MS : BUMP_CADENCE_MS);
  }, [campaignIndex, explorationMode, game, helpOpen, level, muted, pendingAdventure, progress, screen, testerPickerOpen, testerRun]);

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
          heldKeyTimer.current = undefined;
          return;
        }
        attemptMoveRef.current(direction);
        scheduleHeldMove(HELD_KEY_REPEAT_MS);
      }, delay);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (pendingAdventure !== null || testerPickerOpen) return;
      if (
        event.key === "Escape"
        && screen === "game"
        && bigMaze
        && !helpOpen
        && game.status === "playing"
      ) {
        event.preventDefault();
        setBigMaze(false);
        return;
      }
      const direction = directionForKey(event.key);
      if (!direction || screen !== "game" || helpOpen || testerPickerOpen || game.status !== "playing") return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      event.preventDefault();
      if (event.repeat) return;
      const keyId = event.code || event.key;
      if (heldKeys.current.has(keyId)) return;
      heldKeys.current.set(keyId, direction);
      heldKeyOrder.current = [...heldKeyOrder.current.filter((item) => item !== keyId), keyId];
      attemptMoveRef.current(direction);
      scheduleHeldMove(HELD_KEY_DELAY_MS);
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const direction = directionForKey(event.key);
      if (!direction) return;
      const keyId = event.code || event.key;
      heldKeys.current.delete(keyId);
      heldKeyOrder.current = heldKeyOrder.current.filter((item) => item !== keyId);
      if (heldKeyOrder.current.length > 0) scheduleHeldMove(HELD_KEY_REPEAT_MS);
      else if (heldKeyTimer.current !== undefined) {
        window.clearTimeout(heldKeyTimer.current);
        heldKeyTimer.current = undefined;
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
  }, [bigMaze, clearHeldInput, game.status, helpOpen, pendingAdventure, screen, testerPickerOpen]);

  useEffect(() => {
    if (screen !== "game" || helpOpen || testerPickerOpen || pendingAdventure !== null || game.status !== "playing") {
      clearHeldInput();
    }
  }, [clearHeldInput, game.status, helpOpen, pendingAdventure, screen, testerPickerOpen]);

  useEffect(() => () => {
    if (inputUnlockTimer.current !== undefined) window.clearTimeout(inputUnlockTimer.current);
    if (heldKeyTimer.current !== undefined) window.clearTimeout(heldKeyTimer.current);
    if (restartTimer.current !== undefined) window.clearTimeout(restartTimer.current);
    if (rewardSoundTimer.current !== undefined) window.clearTimeout(rewardSoundTimer.current);
    disposeMusic();
  }, []);

  const directionFromPointer = useCallback((clientX: number, clientY: number): Direction | null => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const cellWidth = rect.width / cameraWindow.width;
    const cellHeight = rect.height / cameraWindow.height;
    const centerX = rect.left + (game.position.x - cameraWindow.left + 0.5) * cellWidth;
    const centerY = rect.top + (game.position.y - cameraWindow.top + 0.5) * cellHeight;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    if (Math.abs(dx) < cellWidth * 0.34 && Math.abs(dy) < cellHeight * 0.34) return null;
    if (Math.abs(dx / cellWidth) >= Math.abs(dy / cellHeight)) return dx < 0 ? "left" : "right";
    return dy < 0 ? "up" : "down";
  }, [cameraWindow, game.position.x, game.position.y]);

  const onBoardPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") setPreviewDirection(directionFromPointer(event.clientX, event.clientY));
  };

  const onBoardPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    const direction = directionFromPointer(event.clientX, event.clientY);
    if (direction) attemptMove(direction);
  };

  const scheduleDpadRepeat = useCallback((delay: number) => {
    if (dpadHoldTimer.current !== undefined) window.clearTimeout(dpadHoldTimer.current);
    const repeat = () => {
      const direction = dpadHoldDirection.current;
      if (!direction) {
        dpadHoldTimer.current = undefined;
        return;
      }
      attemptMoveRef.current(direction);
      dpadHoldTimer.current = window.setTimeout(repeat, HELD_KEY_REPEAT_MS);
    };
    dpadHoldTimer.current = window.setTimeout(repeat, delay);
  }, []);

  const startDpadHold = (event: ReactPointerEvent<HTMLButtonElement>, direction: Direction) => {
    if (!event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    clearDpadHold();
    dpadHoldDirection.current = direction;
    dpadHoldPointerId.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    attemptMoveRef.current(direction);
    scheduleDpadRepeat(HELD_KEY_DELAY_MS);
  };

  const stopDpadHold = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (dpadHoldPointerId.current !== event.pointerId) return;
    clearDpadHold();
  };

  const armRestart = () => {
    if (restartArmed) {
      playSound("select", muted);
      loadLevel(level);
      return;
    }
    playSound("bump", muted);
    setRestartArmed(true);
    setFeedback({ icon: "↻", text: "Tap restart once more.", tone: "plain", sound: "bump" });
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
    setScreen("game");
    playSound("select", muted);
  };

  const replayLevel = () => {
    playSound("select", muted);
    setHasActiveRun(true);
    loadLevel(level);
  };

  const closeHelp = () => {
    setHelpOpen(false);
    playSound("menu", muted);
  };

  const closePendingAdventure = () => {
    setPendingAdventure(null);
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

  const enterTesterLevel = (nextLevel: LevelDefinition) => {
    setTesterPickerOpen(false);
    enterLevel(nextLevel, "select", "tester");
    setFeedback({
      icon: "🛠️",
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
    configureMusic({ trackUrl: MUSIC_TRACKS.title });
    setMusicMuted(muted);
    if (!muted) void startMusicFromUserGesture();
    setHelpOpen(false);
    setTesterPickerOpen(false);
    setBigMaze(false);
    setScreen("title");
    playSound("menu", muted);
  };

  const showAchievements = () => {
    preloadAchievementArt();
    configureMusic({ trackUrl: MUSIC_TRACKS.title });
    setMusicMuted(muted);
    if (!muted) void startMusicFromUserGesture();
    setHelpOpen(false);
    setBigMaze(false);
    setScreen("achievements");
    playSound("achievement", muted);
  };

  const toggleSound = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    setMusicMuted(nextMuted);
    if (!nextMuted) {
      const track = screen === "game" ? musicTrackForLevel(level) : MUSIC_TRACKS.title;
      configureMusic({ trackUrl: track });
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
  const shownPreviewDirection = previewDirection ?? suggestedMoveDirection;
  const previewTarget = shownPreviewDirection ? targetFor(game, shownPreviewDirection) : null;
  const previewState = shownPreviewDirection ? previewKind(level, game, shownPreviewDirection) : null;
  const lostEvent = lastEvents.find((event): event is Extract<GameEvent, { type: "combat-lost" }> => event.type === "combat-lost");
  const ownedCollectibles = [
    ...progress.stickers.slice(-3).map((id) => ({ id, label: STICKER_LABELS[id].label, art: stickerArt(id) })),
    ...progress.medals.slice(-2).map((id) => ({ id, label: ACHIEVEMENT_LABELS[id].label, art: medalArt(id) })),
  ];
  const newCollectibles = completion ? [
    ...completion.newStickerIds.map((id) => ({ id, label: STICKER_LABELS[id].label, art: stickerArt(id), icon: null, kind: "New sticker" })),
    ...completion.newMedalIds.map((id) => ({ id, label: ACHIEVEMENT_LABELS[id].label, art: medalArt(id), icon: null, kind: "New medal" })),
    ...completion.newBadgeIds.map((id) => ({ id, label: BADGE_LABELS[id].label, art: null, icon: BADGE_LABELS[id].icon, kind: "New badge" })),
  ] : [];

  return (
    <main className="app-frame">
      <section className={`game-stage screen-${screen}`} aria-label="Maze so Puzzle game">
        {screen === "title" ? (
          <TitleScreen
            progress={progress}
            activeRun={runInProgress ? { name: level.name, steps: game.steps } : null}
            blocked={pendingAdventure !== null || testerPickerOpen}
            muted={muted}
            playRef={titlePlayRef}
            onPlay={runInProgress ? resumeRun : continueStory}
            onSurprise={() => requestEnterLevel(makeSurprise(), "title")}
            onAchievements={showAchievements}
            onOpenTester={openTesterPicker}
            onToggleSound={toggleSound}
          />
        ) : screen === "achievements" ? (
          <AchievementsScreen
            progress={progress}
            unlocked={unlocked}
            activeRun={runInProgress ? { levelId: level.id, name: level.name, steps: game.steps } : null}
            blocked={pendingAdventure !== null || testerPickerOpen}
            headingRef={achievementsHeadingRef}
            muted={muted}
            onHome={showTitle}
            onResume={resumeRun}
            onPlayLevel={requestEnterLevel}
            onSurprise={() => requestEnterLevel(makeSurprise())}
            onToggleSound={toggleSound}
          />
        ) : (
          <>
        <h1 className="sr-only">Maze so Puzzle: For Ame to Solve!</h1>
        <div className="ambient-star star-one" aria-hidden="true">✦</div>
        <div className="ambient-star star-two" aria-hidden="true">✧</div>

        <div className={`game-layout${bigMaze ? " big-maze" : ""}`} inert={modalOpen ? true : undefined} aria-hidden={modalOpen || undefined}>
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
                    aria-label={`${level.name}. Power ${game.power}. ${rescuedSpecies.length} of 3 friends rescued. ${game.hasSword ? "Sword found." : objectKinds.has("sword") ? "Sword not found." : ""} ${game.hasBoots ? "Boots found." : objectKinds.has("boots") ? "Boots not found." : ""} ${game.keys.length} of ${keyColors.length} keys found.`}
                  >
                    <strong>{level.name}</strong>
                    <span>★ {game.power}</span>
                    <span>💖 {rescuedSpecies.length}/3</span>
                    {objectKinds.has("sword") && <span className={game.hasSword ? "found" : "missing"}>🗡 {game.hasSword ? "✓" : "–"}</span>}
                    {objectKinds.has("boots") && <span className={game.hasBoots ? "found" : "missing"}>🥾 {game.hasBoots ? "✓" : "–"}</span>}
                    {keyColors.length > 0 && <span className={game.keys.length === keyColors.length ? "found" : "missing"}>🔑 {game.keys.length}/{keyColors.length}</span>}
                  </div>
                )}
                {explorationMode && <span className="exploration-view-pill" title="Ame explores seven tiles at a time">🗺 7 × 7 view</span>}
                {testerToolsEnabled && (
                  <button
                    className="tester-skip-button"
                    onClick={openTesterPicker}
                    title="Open the tester maze picker"
                    aria-label={`Open tester maze picker. Current maze ${campaignIndex >= 0 ? campaignIndex + 1 : "is a surprise"} of ${CURATED_LEVELS.length}. Tester rewards and progress are off.`}
                  >🛠 <span>Pick maze</span></button>
                )}
                <button className="big-maze-button" aria-pressed={bigMaze} onClick={toggleBigMaze} title="Make the maze larger">{bigMaze ? "↙ Normal" : "⛶ Big maze"}</button>
                <button className="surprise-button" onClick={() => requestEnterLevel(makeSurprise())} title="Make a new solvable maze">✦ New maze</button>
                <div className="step-pill" aria-label={`${game.steps} steps`}><span>👣</span>{game.steps}</div>
              </div>
            </div>

            <div
              ref={boardRef}
              className={`maze-board${explorationMode ? " exploration-camera" : ""} ${bumpPulse % 2 ? "bump-a" : "bump-b"}`}
              style={{
                gridTemplateColumns: `repeat(${cameraWindow.width}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${cameraWindow.height}, minmax(0, 1fr))`,
                "--grid-size": cameraWindow.width,
              } as CSSProperties}
              role="application"
              aria-label="Maze board. Use arrow keys, W A S D, the arrow buttons, or click in a direction from Ame."
              aria-describedby="maze-status"
              aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight W A S D"
              tabIndex={0}
              onPointerMove={onBoardPointerMove}
              onPointerLeave={() => setPreviewDirection(null)}
              onPointerDown={onBoardPointerDown}
              onContextMenu={(event) => event.preventDefault()}
            >
              <MazeTerrain level={level} camera={cameraWindow} />

              {previewTarget && shownPreviewDirection && isInsideWindow(previewTarget, cameraWindow) && (
                <div
                  className={`move-preview move-preview-layer preview-${previewState}`}
                  style={cameraLayerStyle(previewTarget, cameraWindow)}
                  aria-hidden="true"
                >
                  <span className="preview-arrow">{previewState === "danger" ? "!" : previewState === "stop" ? "×" : DIRECTION_ICONS[shownPreviewDirection]}</span>
                </div>
              )}

              {visibleObjects.map((object) => (
                <div
                  className="object-layer"
                  key={object.id}
                  style={cameraLayerStyle(object.at, cameraWindow)}
                  aria-hidden="true"
                >
                  {object.kind === "animal" ? (
                    <div className="animal-stack">
                      <img className="animal-sprite" src={animalArt(object.species)} alt="" draggable={false} />
                      <img className="animal-cage" src={ASSETS.animalCage} alt="" draggable={false} />
                    </div>
                  ) : (
                    <img className={classForObject(object)} src={spriteFor(object)} alt="" draggable={false} />
                  )}
                  {object.kind === "enemy" && <span className="power-badge enemy-power">{object.power}</span>}
                  {object.kind === "potion" && <span className="item-amount">+{object.amount}</span>}
                </div>
              ))}

              <div
                className={`player-layer ${movePulse % 2 ? "move-a" : "move-b"}`}
                style={cameraLayerStyle(game.position, cameraWindow)}
                aria-hidden="true"
              >
                <img className="player-sprite" src={game.hasSword ? ASSETS.ameSword : ASSETS.ame} alt="" draggable={false} />
                <span className="power-badge player-power">{game.power}</span>
              </div>
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
                  compact
                />
              </div>
            )}

            <p className="sr-only" id="maze-status">{mazeStatus}</p>

            <div className={`feedback-bar tone-${feedback.tone}`} aria-live="polite" aria-atomic="true">
              <span className="feedback-icon" aria-hidden="true">{feedback.icon}</span>
              <span>{feedback.text}</span>
            </div>
          </section>

          <aside className="sidebar" aria-label="Ame and adventure bag">
            <div className="brand-and-wallet">
              <header className="brand-block">
                <span className="brand-kicker">A gentle adventure for Ame</span>
                <h2 className="brand-title">Maze so <em>Puzzle!</em></h2>
                <p>For Ame to Solve</p>
              </header>
              <div className="wallet-pill" title="Gold stars will buy cute outfits and portrait frames in a future build.">
                <img className="wallet-pouch" src={ASSETS.coinPouch} alt="" />
                <span className="wallet-copy"><small>Gold stars</small><strong>{progress.gold}</strong></span>
              </div>
            </div>

            <section className="hero-card">
              <div className="portrait-wrap">
                <img src={ASSETS.portrait} alt="Ame, a smiling blonde adventurer with a lavender backpack" />
                <span className="portrait-spark sparkle-a" aria-hidden="true">✦</span>
                <span className="portrait-spark sparkle-b" aria-hidden="true">✧</span>
              </div>
              <div className="hero-copy">
                <span className="tiny-label">Ame's Power</span>
                <strong className="big-power">{game.power}</strong>
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
                />
              )}
              <div className="adventure-details">
                <section className="objective-card">
                  <span className="objective-icon" aria-hidden="true">★</span>
                  <div><span className="tiny-label">Right now</span><strong>{level.objective}</strong></div>
                </section>

                <section className="rescue-card" aria-label={`${rescuedSpecies.length} of 3 animal friends rescued`}>
                  <div className="rescue-heading">
                    <div><span className="tiny-label">Optional adventure</span><strong>Rescue the friends</strong></div>
                    <span className="rescue-count">{rescuedSpecies.length}/3</span>
                  </div>
                  <div className="rescue-list">
                    {animalObjects.map((animal) => {
                      const rescued = game.rescuedAnimalIds.includes(animal.id);
                      return (
                        <div className={`rescue-friend ${rescued ? "rescued" : ""}`} key={animal.id} aria-label={`${ANIMAL_LABELS[animal.species]}: ${rescued ? "rescued" : "waiting in the maze"}`} title={`${ANIMAL_LABELS[animal.species]}: ${rescued ? "rescued" : "waiting in the maze"}`}>
                          <div className="rescue-icon">
                            <img src={animalArt(animal.species)} alt="" />
                            {!rescued && <img className="cage-mini" src={ASSETS.animalCage} alt="" />}
                          </div>
                          {rescued && <b className="rescue-check" aria-hidden="true">✓</b>}
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
                    {objectKinds.has("sword") && <InventorySlot label="Sword" image={ASSETS.sword} found={game.hasSword} />}
                    {objectKinds.has("boots") && <InventorySlot label="Boots" image={ASSETS.boots} found={game.hasBoots} />}
                    {keyColors.map((color) => (
                      <InventorySlot key={color} label={`${COLOR_LABELS[color]} key`} image={ASSETS.key} found={game.keys.includes(color)} color={color} />
                    ))}
                    {!objectKinds.has("sword") && !objectKinds.has("boots") && keyColors.length === 0 && (
                      <div className="empty-bag"><span>🎒</span><strong>Bag ready!</strong></div>
                    )}
                  </div>
                  {ownedCollectibles.length > 0 && (
                    <div className="collection-strip owned-collection" aria-label="Ame's stickers and medals">
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
                    : <><span className="desktop-controls-copy">Arrow keys · WASD · click</span><span className="touch-controls-copy">Tap an arrow, or tap beside Ame</span></>}
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

            <nav className="level-dots" aria-label="Story mazes">
              {CURATED_LEVELS.map((candidate, index) => (
                <button
                  key={candidate.id}
                  className={candidate.id === level.id ? "active" : ""}
                  disabled={index >= unlocked}
                  onClick={() => requestEnterLevel(candidate)}
                  aria-label={`${candidate.name}${index >= unlocked ? ", locked" : ""}`}
                  aria-current={candidate.id === level.id ? "step" : undefined}
                  title={candidate.name}
                >{index >= unlocked ? "◆" : index + 1}</button>
              ))}
            </nav>

            <footer className="utility-row">
              <button onClick={showTitle}><span>⌂</span> Home</button>
              <button onClick={showAchievements}><span>★</span> Book</button>
              <button onClick={(event) => {
                modalReturnFocus.current = event.currentTarget;
                setHelpOpen(true);
                playSound("menu", muted);
              }}><span>?</span> Help</button>
              <button aria-label={muted ? "Turn sound on" : "Turn sound off"} aria-pressed={!muted} onClick={toggleSound}><span>{muted ? "♪" : "♫"}</span> Sound</button>
              <button aria-pressed={restartArmed} className={restartArmed ? "restart-armed" : ""} onClick={armRestart}><span>↻</span> {restartArmed ? "Again!" : "Restart"}</button>
            </footer>
          </aside>
        </div>

        {helpOpen && (
          <Modal title="How to help Ame" onClose={closeHelp} returnFocus={modalReturnFocus.current}>
            <div className="help-grid">
              <HelpStep icon="👣" title="Move" copy="One square at a time." />
              <HelpStep icon="🗡️" title="Find the sword" copy="Then goblins can scoot." />
              <HelpStep icon="⭐" title="Check Power" copy="Match or beat a goblin. Its Power joins Ame!" />
              <HelpStep icon="🔑" title="Match keys" copy="Keys open same-colour doors." />
              <HelpStep icon="🥾" title="Wear boots" copy="Cross water and warm lava." />
              <HelpStep icon="💖" title="Rescue friends" copy="Three are hiding in every maze." />
              {explorationMode && <HelpStep icon="🗺️" title="Fill the map" copy="Exploring reveals each part." />}
            </div>
            <button className="primary-button" onClick={closeHelp}>Let's explore!</button>
          </Modal>
        )}

        {game.status === "won" && completion && (
          <Modal title="Maze solved!" celebratory returnFocus={modalReturnFocus.current}>
            <div className="celebration-burst" aria-hidden="true">
              {Array.from({ length: 12 }, (_, index) => <i className="confetti-piece" style={{ "--i": index } as CSSProperties} key={index} />)}
            </div>
            <div className="win-summary">
              <img className="win-star-art" src={ASSETS.goal} alt="A sparkling golden star portal" />
              <div><strong>Wonderful, Ame!</strong><span>The star was found in {game.steps} steps.</span></div>
            </div>
            <div className="rescued-result-row" aria-label={`${completion.rescuedSpecies.length} animal friends rescued`}>
              {ANIMAL_SPECIES.map((species) => {
                const rescued = completion.rescuedSpecies.includes(species);
                return (
                  <div className={`rescued-result ${rescued ? "rescued" : ""}`} key={species}>
                    <img src={animalArt(species)} alt={ANIMAL_LABELS[species]} />
                    <span>{rescued ? "Safe!" : "Next time"}</span>
                  </div>
                );
              })}
            </div>
            {completion.rescuedSpecies.length === 3 && <div className="perfect-banner">💖 Perfect rescue! All three friends are safe!</div>}
            {completion.testerRun ? (
              <div className="tester-preview-banner" role="status">
                <span aria-hidden="true">🛠️</span>
                <div><strong>Tester preview complete</strong><small>Nothing was saved and rewards stayed unchanged.</small></div>
              </div>
            ) : (
              <div className="reward-panel">
                <img className="reward-pouch" src={ASSETS.coinPouch} alt="A pouch of gold star coins" />
                <div className="reward-copy">
                  <span>Maze reward</span>
                  <strong>+{completion.reward.gold} gold stars</strong>
                  <small className="reward-breakdown">Solve {completion.reward.goldBreakdown.completion} · Friends {completion.reward.goldBreakdown.animalRescue}{completion.reward.goldBreakdown.perfectRescue > 0 ? ` · All three ${completion.reward.goldBreakdown.perfectRescue}` : ""}{completion.reward.goldBreakdown.firstCompletion > 0 ? ` · New maze ${completion.reward.goldBreakdown.firstCompletion}` : ""}</small>
                </div>
                <span className="reward-badge">Total {completion.totalGold}</span>
              </div>
            )}
            {!completion.testerRun && newCollectibles.length > 0 && (
              <div className="collection-strip reward-new" aria-label="New rewards">
                {newCollectibles.map((item) => (
                  <div className="collection-pop" key={item.id}>
                    {item.art
                      ? <img className="modal-reward-art" src={item.art} alt="" />
                      : <span className="modal-reward-icon" aria-hidden="true">{item.icon}</span>}
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

        {game.status === "lost" && (
          <Modal title="A little too strong!" returnFocus={modalReturnFocus.current}>
            <img className="modal-art goblin-art" src={ASSETS.goblin} alt="A friendly green goblin" />
            {lostEvent && <div className="power-equation"><span>{lostEvent.playerPower}</span><b>&lt;</b><span>{lostEvent.enemyPower}</span></div>}
            <p className="modal-lead">Find more Power, then come back. This maze will start fresh.</p>
            <div className="modal-actions">
              <button className="primary-button" onClick={replayLevel}>Try again</button>
              <button className="secondary-button" onClick={showTitle}>Choose a maze</button>
            </div>
          </Modal>
        )}

          </>
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
                    <small>{candidate.width} × {candidate.height}{isExplorationLevel(candidate) ? " · 7 × 7 view" : ""}</small>
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

      </section>

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
  onOpenTester,
  onToggleSound,
}: TitleScreenProps) {
  const solvedIds = Object.keys(progress.bestResultsByLevel);
  const storySolved = CURATED_LEVELS.filter((level) => solvedIds.includes(level.id)).length;
  const hasProgress = solvedIds.length > 0 || progress.gold > 0 || progress.unlockedLevelCount > 1;
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
      >{muted ? "♪" : "♫"}</button>

      <div className="title-copy">
        <span className="title-eyebrow">A gentle adventure for Ame</span>
        <h1 id="game-title">Maze so <em>Puzzle!</em></h1>
        <p className="title-subtitle">For Ame to Solve!</p>
        <p className="title-welcome">Follow the paths, grow Ame's Power, and help every little friend find their way home.</p>

        <div className="title-actions">
          <button ref={playRef} className="title-play-button" onClick={onPlay}>
            <span aria-hidden="true">★</span>
            <span>
              <strong>{activeRun ? "Resume maze" : hasProgress ? "Continue adventure" : "Begin adventure"}</strong>
              <small>{activeRun ? `${activeRun.name} · ${activeRun.steps} ${activeRun.steps === 1 ? "step" : "steps"}` : hasProgress ? `Story maze ${nextStoryNumber} awaits` : "A lovely first maze awaits"}</small>
            </span>
          </button>
          <div className="title-secondary-actions">
            <button onClick={onAchievements}><span aria-hidden="true">🏅</span> Ame's adventure book</button>
            <button onClick={onSurprise}><span aria-hidden="true">✦</span> Surprise maze</button>
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
      >Playable build {BUILD_VERSION} <span aria-hidden="true">🛠</span></button>
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
  onToggleSound,
}: AchievementsScreenProps) {
  const solvedIds = Object.keys(progress.bestResultsByLevel);
  const classifiedRescues = ANIMAL_SPECIES.reduce(
    (total, species) => total + progress.rescuesBySpecies[species],
    0,
  );
  const unclassifiedRescues = Math.max(0, progress.totalAnimalsRescued - classifiedRescues);
  const collectibles = [
    ...(["first-star", "animal-friend", "surprise-sparkle"] as const).map((id) => ({
      id,
      label: STICKER_LABELS[id].label,
      description: STICKER_LABELS[id].description,
      art: stickerArt(id),
      icon: null,
      owned: progress.stickers.includes(id),
      kind: "Sticker",
    })),
    ...(["perfect-rescue-5", "perfect-rescue-10", "perfect-rescue-15"] as const).map((id) => ({
      id,
      label: ACHIEVEMENT_LABELS[id].label,
      description: ACHIEVEMENT_LABELS[id].description,
      art: medalArt(id),
      icon: null,
      owned: progress.medals.includes(id),
      kind: "Medal",
    })),
    ...BADGE_IDS.map((id) => ({
      id,
      label: BADGE_LABELS[id].label,
      description: BADGE_LABELS[id].description,
      art: null,
      icon: BADGE_LABELS[id].icon,
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
          <button aria-label={muted ? "Turn sound on" : "Turn sound off"} aria-pressed={!muted} onClick={onToggleSound}>{muted ? "♪" : "♫"}</button>
          {activeRun && <button className="book-resume" onClick={onResume}>▶ Resume</button>}
          <button onClick={onSurprise}>✦ New maze</button>
        </div>
      </header>

      <div className="book-scroll" role="region" aria-label="Adventure book pages" tabIndex={0}>
        <section className="book-stats" aria-label="Adventure totals">
          <article><img src={ASSETS.goal} alt="" /><span><b>{progress.totalMazesCompleted}</b><small>mazes solved</small></span></article>
          <article><img src={ASSETS.coinPouch} alt="" /><span><b>{progress.gold}</b><small>gold stars</small></span></article>
          <article><img src={ASSETS.rewardRescueMedal} alt="" /><span><b>{progress.totalAnimalsRescued}</b><small>friends helped</small></span></article>
          <article><img src={ASSETS.rewardBraveMedal} alt="" /><span><b>{progress.perfectRescueMazeCount}</b><small>perfect rescues</small></span></article>
          <article><span className="book-stat-icon" aria-hidden="true">↻</span><span><b>{progress.totalCompletions}</b><small>happy finishes</small></span></article>
          <article><span className="book-stat-icon" aria-hidden="true">✦</span><span><b>{progress.generatedMazesCompleted}</b><small>surprise stars</small></span></article>
        </section>

        <section className="friend-ledger" aria-labelledby="friend-ledger-title">
          <div className="book-section-heading"><div><span>Rescue roll-call</span><h2 id="friend-ledger-title">Little friends helped</h2></div><b>{progress.totalAnimalsRescued} total</b></div>
          <div className="friend-ledger-grid">
            {ANIMAL_SPECIES.map((species) => (
              <article key={species}>
                <img src={animalArt(species)} alt="" />
                <span><strong>{ANIMAL_LABELS[species]}</strong><b>{progress.rescuesBySpecies[species]}</b><small>recorded rescues</small></span>
              </article>
            ))}
            {unclassifiedRescues > 0 && (
              <article className="past-rescues"><span className="book-stat-icon" aria-hidden="true">♡</span><span><strong>Earlier friends</strong><b>{unclassifiedRescues}</b><small>before the roll-call began</small></span></article>
            )}
          </div>
        </section>

        <section className="badge-shelf" aria-labelledby="badge-shelf-title">
          <div className="book-section-heading"><div><span>Sticker, medal and badge shelf</span><h2 id="badge-shelf-title">Ame's shiny collection</h2></div><b>{collectibles.filter((item) => item.owned).length}/{collectibles.length}</b></div>
          <div className="badge-grid">
            {collectibles.map((item) => (
              <article className={`badge-card ${item.owned ? "earned" : "locked"}`} key={item.id}>
                <div className="badge-art-wrap">
                  {item.art
                    ? <img src={item.art} alt="" />
                    : <b className="badge-icon" aria-hidden="true">{item.icon}</b>}
                  {item.owned && <span aria-hidden="true">✓</span>}
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
              const hasUnknownRescues = rescueCount > documentedSpecies.length;
              const isActive = activeRun?.levelId === storyLevel.id;
              return (
                <button
                  className={`maze-record-card ${result ? "cleared" : "open"}${isActive ? " active-run" : ""}`}
                  key={storyLevel.id}
                  disabled={locked}
                  onClick={() => isActive ? onResume() : onPlayLevel(storyLevel)}
                  aria-label={`${storyLevel.name}. ${locked ? "Locked" : isActive ? `Current maze, ${activeRun.steps} ${activeRun.steps === 1 ? "step" : "steps"}` : result ? `Cleared, best ${result.bestSteps ?? 0} steps, ${rescueCount} friends rescued${hasUnknownRescues ? ", species not recorded in the earlier save" : ""}` : "Ready to play"}`}
                >
                  <span className="record-number">{locked ? "◆" : isActive ? "▶" : index + 1}</span>
                  <span className="record-copy"><strong>{locked ? "A mystery maze" : storyLevel.name}</strong><small>{locked ? "Keep adventuring to unlock" : isActive ? "Current maze · tap to resume" : `${storyLevel.width} × ${storyLevel.height}`}</small></span>
                  <span className="record-best">{result ? <><b>{result.bestSteps ?? "—"}</b><small>best steps</small></> : <><b>{locked ? "🔒" : "New"}</b><small>{locked ? "locked" : "ready"}</small></>}</span>
                  <span className="record-friends" aria-hidden="true">
                    {ANIMAL_SPECIES.map((species) => (
                      <img
                        className={documentedSpecies.includes(species) ? "saved" : hasUnknownRescues ? "saved-unknown" : ""}
                        key={species}
                        src={animalArt(species)}
                        alt=""
                      />
                    ))}
                  </span>
                </button>
              );
            })}
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
  readonly color?: KeyColor;
}

function InventorySlot({ label, image, found, color }: InventorySlotProps) {
  return (
    <div
      className={`inventory-slot ${found ? "found" : "missing"}${color ? ` color-${color}` : ""}`}
      aria-label={`${label}: ${found ? "found" : "not found"}`}
      title={`${label}: ${found ? "found" : "not found"}`}
    >
      <div className="slot-image"><img src={image} alt="" /></div>
      {found && <b aria-label="found">✓</b>}
    </div>
  );
}

function HelpStep({ icon, title, copy }: { readonly icon: string; readonly title: string; readonly copy: string }) {
  return <div className="help-step"><span aria-hidden="true">{icon}</span><div><strong>{title}</strong><p>{copy}</p></div></div>;
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
