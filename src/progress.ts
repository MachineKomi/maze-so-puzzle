/**
 * Persistent, UI-agnostic player rewards and campaign progress.
 *
 * All state transitions in this module are pure. The two storage helpers are
 * deliberately defensive so the game remains playable when localStorage is
 * unavailable, full, or contains an older/corrupt save.
 */

import {
  ANIMALS_PER_LEVEL,
  ANIMAL_SPECIES,
  type AnimalSpecies,
} from "./game/types";
import {
  CAMPAIGN_ORDER_VERSION,
  CURRENT_CAMPAIGN_ORDER,
  HISTORICAL_CAMPAIGN_ORDERS,
  campaignOrderForVersion,
  contiguousUnlockedCount,
  migrateCampaignAccess,
} from "./campaign";

export const PLAYER_PROGRESS_SCHEMA_VERSION = 5 as const;
export const PLAYER_PROGRESS_STORAGE_KEY = "maze-so-puzzle-progress-v5";
export const VERSION_FOUR_PLAYER_PROGRESS_STORAGE_KEY = "maze-so-puzzle-progress-v4";
export const VERSION_THREE_PLAYER_PROGRESS_STORAGE_KEY = "maze-so-puzzle-progress-v3";
export const VERSION_TWO_PLAYER_PROGRESS_STORAGE_KEY = "maze-so-puzzle-progress-v2";
export const LEGACY_PLAYER_PROGRESS_STORAGE_KEY = "maze-so-puzzle-progress-v1";
/** Legacy/default rescue target for callers and saves created before variable pet counts. */
export const ANIMALS_PER_MAZE = ANIMALS_PER_LEVEL;

export type ProgressLevelSource = "curated" | "generated";

export type StickerId =
  | "first-star"
  | "animal-friend"
  | "surprise-sparkle";

export type RescueMedalId =
  | "perfect-rescue-5"
  | "perfect-rescue-10"
  | "perfect-rescue-15";

export type BadgeId =
  | "maze-explorer-5"
  | "maze-explorer-10"
  | "maze-explorer-20"
  | "surprise-explorer-3"
  | "mighty-adventurer"
  | "twinkle-toes"
  | "bunny-buddy-10"
  | "fox-friend-10"
  | "kitten-pal-10";

export interface LabelMetadata {
  readonly label: string;
  readonly shortLabel: string;
  readonly description: string;
  readonly icon: string;
}

export const REWARD_LABELS = {
  gold: {
    label: "Gold stars",
    shortLabel: "Gold",
    description: "A cheerful keepsake total from solved mazes, rescues, and discoveries.",
    icon: "\u2605",
  },
  completion: {
    label: "Maze solved",
    shortLabel: "Solved",
    description: "Gold for reaching the sparkling exit.",
    icon: "\u2728",
  },
  firstCompletion: {
    label: "First-time bonus",
    shortLabel: "New maze",
    description: "Extra gold for solving a maze for the first time.",
    icon: "\u2726",
  },
  animalRescue: {
    label: "Animal rescue bonus",
    shortLabel: "Rescue",
    description: "Extra gold for every animal friend brought to safety.",
    icon: "\u2665",
  },
  perfectRescue: {
    label: "Perfect rescue bonus",
    shortLabel: "All friends!",
    description: "Bonus gold for rescuing every friend in one maze.",
    icon: "\u2605",
  },
} as const satisfies Readonly<Record<string, LabelMetadata>>;

export const STICKER_LABELS: Readonly<Record<StickerId, LabelMetadata>> = {
  "first-star": {
    label: "My First Maze",
    shortLabel: "First Star",
    description: "Solve the first story maze.",
    icon: "\u2b50",
  },
  "animal-friend": {
    label: "Animal Friend",
    shortLabel: "Animal Friend",
    description: "Rescue every animal friend in one maze.",
    icon: "\ud83d\udc3e",
  },
  "surprise-sparkle": {
    label: "Surprise Explorer",
    shortLabel: "Surprise",
    description: "Solve a freshly generated surprise maze.",
    icon: "\u2728",
  },
};

export const ACHIEVEMENT_LABELS: Readonly<Record<RescueMedalId, LabelMetadata>> = {
  "perfect-rescue-5": {
    label: "Helping Paw Medal",
    shortLabel: "5 perfect rescues",
    description: "Rescue every friend in five different mazes.",
    icon: "\ud83e\udd49",
  },
  "perfect-rescue-10": {
    label: "Rainbow Rescue Medal",
    shortLabel: "10 perfect rescues",
    description: "Rescue every friend in ten different mazes.",
    icon: "\ud83e\udd48",
  },
  "perfect-rescue-15": {
    label: "Golden Guardian Medal",
    shortLabel: "15 perfect rescues",
    description: "Rescue every friend in fifteen different mazes.",
    icon: "\ud83e\udd47",
  },
};

/** Alias for UIs that present achievements specifically as medals. */
export const MEDAL_LABELS = ACHIEVEMENT_LABELS;

export const BADGE_LABELS: Readonly<Record<BadgeId, LabelMetadata>> = {
  "maze-explorer-5": {
    label: "Pathfinder Patch",
    shortLabel: "5 mazes",
    description: "Solve five different mazes.",
    icon: "\ud83e\udded",
  },
  "maze-explorer-10": {
    label: "Maze Mapper Badge",
    shortLabel: "10 mazes",
    description: "Solve ten different mazes.",
    icon: "\ud83d\uddfa\ufe0f",
  },
  "maze-explorer-20": {
    label: "Grand Explorer Badge",
    shortLabel: "20 mazes",
    description: "Solve twenty different mazes.",
    icon: "\ud83c\udf08",
  },
  "surprise-explorer-3": {
    label: "Surprise Scout",
    shortLabel: "3 surprises",
    description: "Solve three different surprise mazes.",
    icon: "\ud83c\udf81",
  },
  "mighty-adventurer": {
    label: "Mighty Adventurer",
    shortLabel: "15 power",
    description: "Finish a maze with 15 power or more.",
    icon: "\ud83d\udcaa",
  },
  "twinkle-toes": {
    label: "Twinkle Toes",
    shortLabel: "30 steps",
    description: "Finish a maze in 30 steps or fewer.",
    icon: "\ud83d\udc63",
  },
  "bunny-buddy-10": {
    label: "Bunny Buddy",
    shortLabel: "10 bunnies",
    description: "Rescue ten bunny friends.",
    icon: "\ud83d\udc30",
  },
  "fox-friend-10": {
    label: "Fox Friend",
    shortLabel: "10 foxes",
    description: "Rescue ten fox friends.",
    icon: "\ud83e\udd8a",
  },
  "kitten-pal-10": {
    label: "Kitten Pal",
    shortLabel: "10 kittens",
    description: "Rescue ten kitten friends.",
    icon: "\ud83d\udc31",
  },
};

export type AnimalRescueTotals = Readonly<Record<AnimalSpecies, number>>;

export interface LevelBestResult {
  readonly completions: number;
  /** Competitive records below describe only `gameplayFingerprint`. */
  readonly bestSteps: number | null;
  readonly contentRevision?: number;
  readonly gameplayFingerprint?: string;
  readonly bestPower: number | null;
  readonly bestRescuedCount: number;
  /** Rescue target for the latest known version of this maze. */
  readonly totalRescueCount: number;
  /** True only for a completion of the current gameplay fingerprint. */
  readonly perfectRescue: boolean;
  /** Null only when a v2 save did not record how this maze was created. */
  readonly source: ProgressLevelSource | null;
  /** Species from the best documented rescue attempt; v2 history remains unknown. */
  readonly bestRescuedSpecies: readonly AnimalSpecies[];
  /** Earlier-layout accomplishments remain visible but never compete as current. */
  readonly historicalBestSteps?: number | null;
  readonly historicalBestPower?: number | null;
  readonly historicalBestRescuedCount?: number;
  readonly historicalBestRescuedSpecies?: readonly AnimalSpecies[];
  readonly historicalPerfectRescue?: boolean;
}

export interface PlayerProgress {
  readonly schemaVersion: typeof PLAYER_PROGRESS_SCHEMA_VERSION;
  readonly unlockedLevelCount: number;
  /** May be newer than this build; unknown future versions are preserved. */
  readonly campaignOrderVersion: number;
  /** Stable story IDs; count remains as a compatibility/display cache. */
  readonly unlockedLevelIds: readonly string[];
  readonly gold: number;
  readonly sciencePoints: number;
  readonly stickers: readonly StickerId[];
  readonly medals: readonly RescueMedalId[];
  readonly badges: readonly BadgeId[];
  readonly bestResultsByLevel: Readonly<Record<string, LevelBestResult>>;
  /** Number of distinct maze IDs solved at least once. */
  readonly totalMazesCompleted: number;
  /** Includes successful replays. */
  readonly totalCompletions: number;
  /** Successful generated-maze runs known to v3; migrated unknown history is not guessed. */
  readonly generatedCompletions: number;
  /** Distinct generated maze IDs known to v3. */
  readonly generatedMazesCompleted: number;
  /** Includes rescues on successful replays. */
  readonly totalAnimalsRescued: number;
  /** Known cumulative species rescues; v2 partial-rescue species are deliberately not guessed. */
  readonly rescuesBySpecies: AnimalRescueTotals;
  /** Number of distinct mazes in which every available friend was rescued. */
  readonly perfectRescueMazeCount: number;
  /** Consecutive first-time maze completions on which every friend was rescued. */
  readonly currentPerfectRescueStreak: number;
  readonly bestPerfectRescueStreak: number;
  /** Bounded durable receipts prevent a resumed pending exit from crediting twice. */
  readonly completionReceipts: readonly string[];
}

export interface LevelRewardInput {
  readonly levelId: string;
  readonly source: ProgressLevelSource;
  /** Zero-based for story mazes; pass -1 for generated mazes. */
  readonly campaignIndex: number;
  readonly rescuedCount: number;
  /** Defaults to the legacy three-friend target when omitted. */
  readonly totalRescueCount?: number;
  readonly firstCompletion: boolean;
}

export interface GoldBreakdown {
  readonly completion: number;
  readonly firstCompletion: number;
  readonly animalRescue: number;
  readonly perfectRescue: number;
}

export interface CalculatedLevelReward {
  readonly levelId: string;
  readonly gold: number;
  readonly goldBreakdown: GoldBreakdown;
  readonly stickerIds: readonly StickerId[];
}

export interface LevelCompletionInput {
  /** Stable active-run ID used for exactly-once durable credit. */
  readonly completionId?: string;
  readonly levelId: string;
  readonly source: ProgressLevelSource;
  /** Zero-based for story mazes; pass -1 for generated mazes. */
  readonly campaignIndex: number;
  readonly rescuedCount: number;
  /** Defaults to the legacy three-friend target when omitted. */
  readonly totalRescueCount?: number;
  /** Unknown entries and duplicates are ignored at the persistence boundary. */
  readonly rescuedSpecies?: readonly AnimalSpecies[];
  readonly steps: number;
  readonly power: number;
  readonly contentRevision?: number;
  readonly gameplayFingerprint?: string;
  /** Optional treasures collected during this completed run. */
  readonly bonusGold?: number;
  readonly sciencePoints?: number;
}

export interface ProgressStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const STICKER_IDS: readonly StickerId[] = [
  "first-star",
  "animal-friend",
  "surprise-sparkle",
];

export const BADGE_IDS: readonly BadgeId[] = [
  "maze-explorer-5",
  "maze-explorer-10",
  "maze-explorer-20",
  "surprise-explorer-3",
  "mighty-adventurer",
  "twinkle-toes",
  "bunny-buddy-10",
  "fox-friend-10",
  "kitten-pal-10",
];

/** Ordered thresholds used both by the state transition and collection UI. */
export const RESCUE_MILESTONES: readonly Readonly<{
  count: number;
  id: RescueMedalId;
}>[] = [
  { count: 5, id: "perfect-rescue-5" },
  { count: 10, id: "perfect-rescue-10" },
  { count: 15, id: "perfect-rescue-15" },
];

const MEDAL_IDS = RESCUE_MILESTONES.map((milestone) => milestone.id);
const MAX_COMPLETION_RECEIPTS = 512;

function safeCompletionId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const id = value.trim();
  return id.length >= 8 && id.length <= 180 && /^[a-zA-Z0-9:-]+$/.test(id) ? id : null;
}

function sanitizeCompletionReceipts(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const receipts = value.flatMap((candidate) => {
    const id = safeCompletionId(candidate);
    return id ? [id] : [];
  });
  return [...new Set(receipts)].slice(-MAX_COMPLETION_RECEIPTS);
}

function emptyRescueTotals(): Record<AnimalSpecies, number> {
  const totals = {} as Record<AnimalSpecies, number>;
  for (const species of ANIMAL_SPECIES) totals[species] = 0;
  return totals;
}

function nonNegativeInteger(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.floor(value))
    : fallback;
}

function rescuedAnimalCount(value: unknown): number {
  return Math.min(ANIMAL_SPECIES.length, nonNegativeInteger(value));
}

function totalRescueCount(value: unknown): number {
  if (value === undefined) return ANIMALS_PER_MAZE;
  return Math.min(ANIMAL_SPECIES.length, nonNegativeInteger(value));
}

function rescuedCountForTarget(value: unknown, target: number): number {
  return Math.min(target, rescuedAnimalCount(value));
}

function isPerfectRescue(rescuedCount: number, target: number): boolean {
  return target > 0 && rescuedCount >= target;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function ownValue(record: Record<string, unknown>, key: string): unknown {
  return Object.hasOwn(record, key) ? record[key] : undefined;
}

function isStickerId(value: unknown): value is StickerId {
  return typeof value === "string" && STICKER_IDS.includes(value as StickerId);
}

function isMedalId(value: unknown): value is RescueMedalId {
  return typeof value === "string" && MEDAL_IDS.includes(value as RescueMedalId);
}

function isBadgeId(value: unknown): value is BadgeId {
  return typeof value === "string" && BADGE_IDS.includes(value as BadgeId);
}

function isAnimalSpecies(value: unknown): value is AnimalSpecies {
  return typeof value === "string" && ANIMAL_SPECIES.includes(value as AnimalSpecies);
}

function isLevelSource(value: unknown): value is ProgressLevelSource {
  return value === "curated" || value === "generated";
}

function uniqueKnownIds<T extends string>(
  value: unknown,
  guard: (candidate: unknown) => candidate is T,
): T[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter(guard))];
}

function mergeUnique<T extends string>(existing: readonly T[], added: readonly T[]): T[] {
  return [...new Set([...existing, ...added])];
}

function knownSpecies(value: unknown, maximum: number = ANIMAL_SPECIES.length): AnimalSpecies[] {
  if (!Array.isArray(value)) return [];
  const unique = new Set(value.filter(isAnimalSpecies));
  return ANIMAL_SPECIES.filter((species) => unique.has(species)).slice(0, maximum);
}

function safeLevelId(value: string): string {
  const trimmed = value.trim();
  if (
    trimmed.length === 0
    || trimmed === "__proto__"
    || trimmed === "prototype"
    || trimmed === "constructor"
  ) {
    throw new TypeError("A level completion needs a safe, non-empty levelId.");
  }
  return trimmed;
}

function medalsForPerfectRescueCount(count: number): RescueMedalId[] {
  return RESCUE_MILESTONES
    .filter((milestone) => count >= milestone.count)
    .map((milestone) => milestone.id);
}

interface BadgeMetrics {
  readonly totalMazesCompleted: number;
  readonly generatedMazesCompleted: number;
  readonly rescuesBySpecies: AnimalRescueTotals;
  readonly bestResultsByLevel: Readonly<Record<string, LevelBestResult>>;
}

function badgesForMetrics(metrics: BadgeMetrics): BadgeId[] {
  const badges: BadgeId[] = [];
  if (metrics.totalMazesCompleted >= 5) badges.push("maze-explorer-5");
  if (metrics.totalMazesCompleted >= 10) badges.push("maze-explorer-10");
  if (metrics.totalMazesCompleted >= 20) badges.push("maze-explorer-20");
  if (metrics.generatedMazesCompleted >= 3) badges.push("surprise-explorer-3");

  const results = Object.values(metrics.bestResultsByLevel);
  if (results.some((result) => Math.max(
    result.bestPower ?? 0,
    result.historicalBestPower ?? 0,
  ) >= 15)) {
    badges.push("mighty-adventurer");
  }
  if (results.some((result) => (
    (result.bestSteps !== null && result.bestSteps > 0 && result.bestSteps <= 30)
    || (result.historicalBestSteps !== null
      && result.historicalBestSteps !== undefined
      && result.historicalBestSteps > 0
      && result.historicalBestSteps <= 30)
  ))) {
    badges.push("twinkle-toes");
  }
  if (metrics.rescuesBySpecies.bunny >= 10) badges.push("bunny-buddy-10");
  if (metrics.rescuesBySpecies.fox >= 10) badges.push("fox-friend-10");
  if (metrics.rescuesBySpecies.kitten >= 10) badges.push("kitten-pal-10");
  return badges;
}

export function createDefaultPlayerProgress(unlockedLevelCount = 1): PlayerProgress {
  const unlockedLevelIds = migrateCampaignAccess({
    previousOrder: HISTORICAL_CAMPAIGN_ORDERS[1]!,
    currentOrder: CURRENT_CAMPAIGN_ORDER,
    unlockedCount: Math.max(1, nonNegativeInteger(unlockedLevelCount, 1)),
  });
  return {
    schemaVersion: PLAYER_PROGRESS_SCHEMA_VERSION,
    unlockedLevelCount: contiguousUnlockedCount(CURRENT_CAMPAIGN_ORDER, unlockedLevelIds),
    campaignOrderVersion: CAMPAIGN_ORDER_VERSION,
    unlockedLevelIds,
    gold: 0,
    sciencePoints: 0,
    stickers: [],
    medals: [],
    badges: [],
    bestResultsByLevel: {},
    totalMazesCompleted: 0,
    totalCompletions: 0,
    generatedCompletions: 0,
    generatedMazesCompleted: 0,
    totalAnimalsRescued: 0,
    rescuesBySpecies: emptyRescueTotals(),
    perfectRescueMazeCount: 0,
    currentPerfectRescueStreak: 0,
    bestPerfectRescueStreak: 0,
    completionReceipts: [],
  };
}

function sanitizeBestResults(
  value: unknown,
  includeVersionThreeFields: boolean,
): Record<string, LevelBestResult> {
  const results: Record<string, LevelBestResult> = {};
  if (!isRecord(value)) return results;

  for (const [levelId, candidate] of Object.entries(value)) {
    const normalizedLevelId = levelId.trim();
    if (
      normalizedLevelId.length === 0
      || normalizedLevelId === "__proto__"
      || normalizedLevelId === "prototype"
      || normalizedLevelId === "constructor"
      || !isRecord(candidate)
    ) {
      continue;
    }

    const completions = nonNegativeInteger(ownValue(candidate, "completions"));
    if (completions === 0) continue;

    const bestSteps = ownValue(candidate, "bestSteps");
    const bestPower = ownValue(candidate, "bestPower");
    const bestRescuedCount = rescuedAnimalCount(ownValue(candidate, "bestRescuedCount"));
    const rescueTarget = includeVersionThreeFields
      ? totalRescueCount(ownValue(candidate, "totalRescueCount"))
      : ANIMALS_PER_MAZE;
    const storedPerfectRescue = ownValue(candidate, "perfectRescue");
    const source = ownValue(candidate, "source");
    const contentRevision = ownValue(candidate, "contentRevision");
    const gameplayFingerprint = ownValue(candidate, "gameplayFingerprint");
    const historicalBestSteps = ownValue(candidate, "historicalBestSteps");
    const historicalBestPower = ownValue(candidate, "historicalBestPower");
    const historicalBestRescuedCount = rescuedAnimalCount(
      ownValue(candidate, "historicalBestRescuedCount"),
    );
    const historicalPerfectRescue = ownValue(candidate, "historicalPerfectRescue") === true;
    results[normalizedLevelId] = {
      completions,
      bestSteps: typeof bestSteps === "number" && Number.isFinite(bestSteps)
        ? nonNegativeInteger(bestSteps)
        : null,
      bestPower: typeof bestPower === "number" && Number.isFinite(bestPower)
        ? nonNegativeInteger(bestPower)
        : null,
      bestRescuedCount,
      totalRescueCount: rescueTarget,
      perfectRescue: (includeVersionThreeFields && storedPerfectRescue === true)
        || isPerfectRescue(bestRescuedCount, rescueTarget),
      source: includeVersionThreeFields && isLevelSource(source)
        ? source
        : null,
      bestRescuedSpecies: includeVersionThreeFields
        ? knownSpecies(ownValue(candidate, "bestRescuedSpecies"), bestRescuedCount)
        : [],
      ...(typeof contentRevision === "number" && Number.isInteger(contentRevision) && contentRevision > 0
        ? { contentRevision }
        : {}),
      ...(typeof gameplayFingerprint === "string" && gameplayFingerprint.trim().length > 0
        ? { gameplayFingerprint: gameplayFingerprint.trim() }
        : {}),
      ...(historicalBestSteps === null
        ? { historicalBestSteps: null }
        : typeof historicalBestSteps === "number" && Number.isFinite(historicalBestSteps)
          ? { historicalBestSteps: nonNegativeInteger(historicalBestSteps) }
          : {}),
      ...(historicalBestPower === null
        ? { historicalBestPower: null }
        : typeof historicalBestPower === "number" && Number.isFinite(historicalBestPower)
          ? { historicalBestPower: nonNegativeInteger(historicalBestPower) }
          : {}),
      ...(historicalBestRescuedCount > 0
        ? { historicalBestRescuedCount }
        : {}),
      ...(historicalBestRescuedCount > 0
        ? {
            historicalBestRescuedSpecies: knownSpecies(
              ownValue(candidate, "historicalBestRescuedSpecies"),
              historicalBestRescuedCount,
            ),
          }
        : {}),
      ...(historicalPerfectRescue ? { historicalPerfectRescue: true } : {}),
    };
  }

  return results;
}

function sanitizeRescueTotals(value: unknown): Record<AnimalSpecies, number> {
  const totals = emptyRescueTotals();
  if (!isRecord(value)) return totals;
  for (const species of ANIMAL_SPECIES) {
    totals[species] = Object.hasOwn(value, species)
      ? nonNegativeInteger(value[species])
      : 0;
  }
  return totals;
}

function sanitizeProgressObject(
  value: Record<string, unknown>,
  includeVersionThreeFields: boolean,
  includeCompletionReceipts = false,
): PlayerProgress {
  const bestResultsByLevel = sanitizeBestResults(
    ownValue(value, "bestResultsByLevel"),
    includeVersionThreeFields,
  );
  const results = Object.values(bestResultsByLevel);
  const perfectResultsInSave = Object.values(bestResultsByLevel)
    .filter((result) => result.perfectRescue || result.historicalPerfectRescue)
    .length;
  const bestRescuesInSave = results
    .reduce((sum, result) => sum + Math.max(
      result.bestRescuedCount,
      result.historicalBestRescuedCount ?? 0,
    ), 0);
  const perfectRescueMazeCount = Math.max(
    perfectResultsInSave,
    nonNegativeInteger(ownValue(value, "perfectRescueMazeCount")),
  );
  const currentPerfectRescueStreak = Math.min(
    perfectRescueMazeCount,
    nonNegativeInteger(ownValue(value, "currentPerfectRescueStreak")),
  );
  const bestPerfectRescueStreak = Math.min(
    perfectRescueMazeCount,
    Math.max(
      currentPerfectRescueStreak,
      nonNegativeInteger(ownValue(value, "bestPerfectRescueStreak")),
    ),
  );
  const storedMedals = uniqueKnownIds(ownValue(value, "medals"), isMedalId);
  const rescuesBySpecies = includeVersionThreeFields
    ? sanitizeRescueTotals(ownValue(value, "rescuesBySpecies"))
    : emptyRescueTotals();
  const knownSpeciesRescues = ANIMAL_SPECIES
    .reduce((sum, species) => sum + rescuesBySpecies[species], 0);
  const totalMazesCompleted = results.length;
  const totalCompletions = results.reduce((sum, result) => sum + result.completions, 0);
  const knownGeneratedResults = results.filter((result) => result.source === "generated");
  const knownCuratedResults = results.filter((result) => result.source === "curated");
  const maximumGeneratedCompletions = totalCompletions
    - knownCuratedResults.reduce((sum, result) => sum + result.completions, 0);
  const maximumGeneratedMazes = totalMazesCompleted - knownCuratedResults.length;
  const generatedCompletions = includeVersionThreeFields
    ? Math.min(
      maximumGeneratedCompletions,
      Math.max(
        knownGeneratedResults.reduce((sum, result) => sum + result.completions, 0),
        nonNegativeInteger(ownValue(value, "generatedCompletions")),
      ),
    )
    : 0;
  const generatedMazesCompleted = includeVersionThreeFields
    ? Math.min(
      maximumGeneratedMazes,
      Math.max(
        knownGeneratedResults.length,
        nonNegativeInteger(ownValue(value, "generatedMazesCompleted")),
      ),
    )
    : 0;
  const badgeMetrics: BadgeMetrics = {
    totalMazesCompleted,
    generatedMazesCompleted,
    rescuesBySpecies,
    bestResultsByLevel,
  };
  const storedBadges = includeVersionThreeFields
    ? uniqueKnownIds(ownValue(value, "badges"), isBadgeId)
    : [];

  const storedUnlocked = Math.max(1, nonNegativeInteger(ownValue(value, "unlockedLevelCount"), 1));
  const rawUnlockedIds = ownValue(value, "unlockedLevelIds");
  const explicitIds = Array.isArray(rawUnlockedIds)
    ? [...new Set(rawUnlockedIds.flatMap((candidate) => {
        if (typeof candidate !== "string") return [];
        const id = candidate.trim();
        return id.length > 0
          && id !== "__proto__"
          && id !== "prototype"
          && id !== "constructor"
          ? [id]
          : [];
      }))]
    : [];
  const rawCampaignOrderVersion = ownValue(value, "campaignOrderVersion");
  const storedCampaignOrderVersion = typeof rawCampaignOrderVersion === "number"
    && Number.isSafeInteger(rawCampaignOrderVersion)
    && rawCampaignOrderVersion >= 1
    ? rawCampaignOrderVersion
    : 1;
  const futureCampaignOrder = storedCampaignOrderVersion > CAMPAIGN_ORDER_VERSION;
  const previousOrder = campaignOrderForVersion(storedCampaignOrderVersion)
    ?? HISTORICAL_CAMPAIGN_ORDERS[1]!;
  const unlockedLevelIds = futureCampaignOrder
    ? [...new Set([CURRENT_CAMPAIGN_ORDER[0]!, ...explicitIds])]
    : migrateCampaignAccess({
      previousOrder,
      currentOrder: CURRENT_CAMPAIGN_ORDER,
      unlockedCount: storedUnlocked,
      completedLevelIds: Object.keys(bestResultsByLevel),
      ...(includeVersionThreeFields && explicitIds.length > 0
        ? { unlockedLevelIds: explicitIds }
        : {}),
    });
  const unlockedLevelCount = futureCampaignOrder
    ? Math.max(storedUnlocked, contiguousUnlockedCount(CURRENT_CAMPAIGN_ORDER, unlockedLevelIds))
    : contiguousUnlockedCount(CURRENT_CAMPAIGN_ORDER, unlockedLevelIds);
  return {
    schemaVersion: PLAYER_PROGRESS_SCHEMA_VERSION,
    unlockedLevelCount,
    campaignOrderVersion: futureCampaignOrder
      ? storedCampaignOrderVersion
      : CAMPAIGN_ORDER_VERSION,
    unlockedLevelIds,
    gold: nonNegativeInteger(ownValue(value, "gold")),
    sciencePoints: nonNegativeInteger(ownValue(value, "sciencePoints")),
    stickers: uniqueKnownIds(ownValue(value, "stickers"), isStickerId),
    medals: mergeUnique(storedMedals, medalsForPerfectRescueCount(perfectRescueMazeCount)),
    badges: mergeUnique(storedBadges, badgesForMetrics(badgeMetrics)),
    bestResultsByLevel,
    totalMazesCompleted,
    totalCompletions,
    generatedCompletions,
    generatedMazesCompleted,
    totalAnimalsRescued: Math.max(
      bestRescuesInSave,
      knownSpeciesRescues,
      nonNegativeInteger(ownValue(value, "totalAnimalsRescued")),
    ),
    rescuesBySpecies,
    perfectRescueMazeCount,
    currentPerfectRescueStreak,
    bestPerfectRescueStreak,
    completionReceipts: includeCompletionReceipts
      ? sanitizeCompletionReceipts(ownValue(value, "completionReceipts"))
      : [],
  };
}

function sanitizeVersionTwo(value: Record<string, unknown>): PlayerProgress {
  return sanitizeProgressObject(value, false);
}

function sanitizeVersionThree(value: Record<string, unknown>): PlayerProgress {
  return sanitizeProgressObject(value, true);
}

function sanitizeVersionFive(value: Record<string, unknown>): PlayerProgress {
  return sanitizeProgressObject(value, true, true);
}

/**
 * Pure migration/sanitization entry point. Numeric values are the original v1
 * format, whose only datum was the number of unlocked story levels.
 */
export function migratePlayerProgress(value: unknown): PlayerProgress {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length === 0) return createDefaultPlayerProgress();

    try {
      return migratePlayerProgress(JSON.parse(trimmed) as unknown);
    } catch {
      const legacyUnlocked = Number(trimmed);
      return Number.isFinite(legacyUnlocked)
        ? createDefaultPlayerProgress(legacyUnlocked)
        : createDefaultPlayerProgress();
    }
  }

  if (typeof value === "number") {
    return createDefaultPlayerProgress(value);
  }

  if (!isRecord(value)) return createDefaultPlayerProgress();

  const schemaVersion = ownValue(value, "schemaVersion");
  if (schemaVersion === PLAYER_PROGRESS_SCHEMA_VERSION) {
    return sanitizeVersionFive(value);
  }

  if (schemaVersion === 4 || schemaVersion === 3) {
    return sanitizeVersionThree(value);
  }

  if (schemaVersion === 2) {
    return sanitizeVersionTwo(value);
  }

  // Be generous to any experimental v1 object saves, while retaining support
  // for the released v1 numeric format.
  if (schemaVersion === 1 || Object.hasOwn(value, "unlocked")) {
    const unlockedLevelCount = ownValue(value, "unlockedLevelCount");
    const unlocked = ownValue(value, "unlocked");
    return createDefaultPlayerProgress(
      typeof unlockedLevelCount === "number"
        ? unlockedLevelCount
        : typeof unlocked === "number"
          ? unlocked
          : 1,
    );
  }

  return createDefaultPlayerProgress();
}

/** Calculate the deterministic prizes for one successful maze attempt. */
export function calculateLevelReward(input: LevelRewardInput): CalculatedLevelReward {
  const levelId = safeLevelId(input.levelId);
  const rescueTarget = totalRescueCount(input.totalRescueCount);
  const rescuedCount = rescuedCountForTarget(input.rescuedCount, rescueTarget);
  const perfect = isPerfectRescue(rescuedCount, rescueTarget);
  const campaignTier = input.source === "curated" && input.campaignIndex >= 0
    ? Math.min(5, Math.floor(nonNegativeInteger(input.campaignIndex) / 5))
    : 0;
  const completion = input.source === "curated" ? 10 + campaignTier * 2 : 8;
  const firstCompletion = input.firstCompletion ? 5 : 0;
  const animalRescue = rescuedCount * 3;
  const perfectRescue = perfect ? 6 : 0;
  const stickerIds: StickerId[] = [];

  if (input.firstCompletion && input.source === "curated" && input.campaignIndex === 0) {
    stickerIds.push("first-star");
  }
  if (perfect) {
    stickerIds.push("animal-friend");
  }
  if (input.firstCompletion && input.source === "generated") {
    stickerIds.push("surprise-sparkle");
  }

  return {
    levelId,
    gold: completion + firstCompletion + animalRescue + perfectRescue,
    goldBreakdown: {
      completion,
      firstCompletion,
      animalRescue,
      perfectRescue,
    },
    stickerIds,
  };
}

/**
 * Apply a completed maze to a save without mutating either argument. First
 * completion is derived from the save so callers cannot accidentally award it
 * twice.
 */
export function applyLevelCompletion(
  progress: PlayerProgress,
  input: LevelCompletionInput,
): PlayerProgress {
  const current = migratePlayerProgress(progress);
  const completionId = safeCompletionId(input.completionId);
  if (completionId && current.completionReceipts.includes(completionId)) return current;
  const levelId = safeLevelId(input.levelId);
  const rescueTarget = totalRescueCount(input.totalRescueCount);
  const rescuedCount = rescuedCountForTarget(input.rescuedCount, rescueTarget);
  const perfect = isPerfectRescue(rescuedCount, rescueTarget);
  const rescuedSpecies = knownSpecies(input.rescuedSpecies, rescuedCount);
  const existing = Object.hasOwn(current.bestResultsByLevel, levelId)
    ? current.bestResultsByLevel[levelId]
    : undefined;
  const firstCompletion = existing === undefined;
  const source = existing?.source ?? input.source;
  const canonicalCampaignIndex = source === "curated"
    ? (CURRENT_CAMPAIGN_ORDER as readonly string[]).indexOf(levelId)
    : -1;
  const campaignIndex = canonicalCampaignIndex >= 0
    ? canonicalCampaignIndex
    : input.campaignIndex;
  const reward = calculateLevelReward({
    levelId,
    source,
    campaignIndex,
    rescuedCount,
    totalRescueCount: rescueTarget,
    firstCompletion,
  });
  const steps = nonNegativeInteger(input.steps);
  const power = nonNegativeInteger(input.power);
  const suppliedContentRevision = typeof input.contentRevision === "number"
    && Number.isInteger(input.contentRevision)
    && input.contentRevision > 0
    ? input.contentRevision
    : undefined;
  const suppliedGameplayFingerprint = typeof input.gameplayFingerprint === "string"
    && input.gameplayFingerprint.trim().length > 0
    ? input.gameplayFingerprint.trim()
    : undefined;
  const contentRevision = suppliedContentRevision ?? existing?.contentRevision;
  const gameplayFingerprint = suppliedGameplayFingerprint ?? existing?.gameplayFingerprint;
  // A legacy route has no identity with which to prove comparability. Once a
  // current completion supplies identity, treat that old best as history just
  // like an explicitly different fingerprint instead of stamping it current.
  const contentChanged = existing !== undefined
    && suppliedGameplayFingerprint !== undefined
    && (
      existing.gameplayFingerprint !== suppliedGameplayFingerprint
      || (suppliedContentRevision !== undefined
        && existing.contentRevision !== suppliedContentRevision)
    );
  const historicalStepCandidates = [existing?.historicalBestSteps, existing?.bestSteps]
    .filter((value): value is number => value !== null && value !== undefined);
  const historicalBestSteps = contentChanged
    ? historicalStepCandidates.length > 0
      ? Math.min(...historicalStepCandidates)
      : null
    : existing?.historicalBestSteps;
  const historicalPowerCandidates = [
    existing?.historicalBestPower,
    ...(contentChanged ? [existing?.bestPower] : []),
  ].filter((value): value is number => value !== null && value !== undefined);
  const historicalBestPower = contentChanged
    ? historicalPowerCandidates.length > 0
      ? Math.max(...historicalPowerCandidates)
      : null
    : existing?.historicalBestPower;
  let historicalBestRescuedCount = existing?.historicalBestRescuedCount;
  let historicalBestRescuedSpecies = existing?.historicalBestRescuedSpecies;
  if (contentChanged && existing) {
    const archivedCount = historicalBestRescuedCount ?? 0;
    if (
      existing.bestRescuedCount > archivedCount
      || (existing.bestRescuedCount === archivedCount
        && existing.bestRescuedSpecies.length > (historicalBestRescuedSpecies?.length ?? 0))
    ) {
      historicalBestRescuedCount = existing.bestRescuedCount;
      historicalBestRescuedSpecies = existing.bestRescuedSpecies;
    }
  }
  const historicalPerfectRescue = contentChanged
    ? (existing?.historicalPerfectRescue ?? false) || (existing?.perfectRescue ?? false)
    : existing?.historicalPerfectRescue;
  const hadEverPerfectRescue = (existing?.perfectRescue ?? false)
    || (existing?.historicalPerfectRescue ?? false);
  const newlyPerfectRescue = !hadEverPerfectRescue && perfect;
  const perfectRescueMazeCount = current.perfectRescueMazeCount + (newlyPerfectRescue ? 1 : 0);
  const currentPerfectRescueStreak = firstCompletion
    ? perfect
      ? current.currentPerfectRescueStreak + 1
      : 0
    : current.currentPerfectRescueStreak;
  const knownUnlockedCount = source === "curated" && campaignIndex >= 0
    ? Math.min(CURRENT_CAMPAIGN_ORDER.length, Math.max(
      contiguousUnlockedCount(CURRENT_CAMPAIGN_ORDER, current.unlockedLevelIds),
      Math.floor(campaignIndex) + 2,
    ))
    : contiguousUnlockedCount(CURRENT_CAMPAIGN_ORDER, current.unlockedLevelIds);
  const futureCampaignOrder = current.campaignOrderVersion > CAMPAIGN_ORDER_VERSION;
  const unlockedLevelCount = futureCampaignOrder
    ? Math.max(current.unlockedLevelCount, knownUnlockedCount)
    : knownUnlockedCount;
  const knownUnlockedIds = source === "curated"
    ? CURRENT_CAMPAIGN_ORDER.slice(0, knownUnlockedCount)
    : current.unlockedLevelIds;
  const unlockedLevelIds = futureCampaignOrder
    ? mergeUnique(current.unlockedLevelIds, knownUnlockedIds)
    : knownUnlockedIds;
  const currentExisting = contentChanged ? undefined : existing;
  const previousBestRescuedCount = currentExisting?.bestRescuedCount ?? 0;
  const previousBestSpecies = currentExisting?.bestRescuedSpecies ?? [];
  const hasCompleteCurrentSpeciesRecord = rescuedSpecies.length === rescuedCount;
  const bestRescuedSpecies = rescuedCount > previousBestRescuedCount
    || (rescuedCount === previousBestRescuedCount
      && (rescuedSpecies.length > previousBestSpecies.length
        || (hasCompleteCurrentSpeciesRecord
          && rescuedSpecies.some((species) => !previousBestSpecies.includes(species)))))
    ? rescuedSpecies
    : [...previousBestSpecies];

  const bestResult: LevelBestResult = {
    completions: (existing?.completions ?? 0) + 1,
    bestSteps: currentExisting?.bestSteps === null || currentExisting?.bestSteps === undefined
      ? steps
      : Math.min(currentExisting.bestSteps, steps),
    bestPower: currentExisting?.bestPower === null || currentExisting?.bestPower === undefined
      ? power
      : Math.max(currentExisting.bestPower, power),
    bestRescuedCount: Math.max(previousBestRescuedCount, rescuedCount),
    totalRescueCount: rescueTarget,
    perfectRescue: (currentExisting?.perfectRescue ?? false) || perfect,
    source,
    bestRescuedSpecies,
    ...(contentRevision === undefined ? {} : { contentRevision }),
    ...(gameplayFingerprint === undefined ? {} : { gameplayFingerprint }),
    ...(historicalBestSteps === undefined ? {} : { historicalBestSteps }),
    ...(historicalBestPower === undefined ? {} : { historicalBestPower }),
    ...(historicalBestRescuedCount === undefined ? {} : { historicalBestRescuedCount }),
    ...(historicalBestRescuedSpecies === undefined ? {} : { historicalBestRescuedSpecies }),
    ...(historicalPerfectRescue === undefined ? {} : { historicalPerfectRescue }),
  };
  const bestResultsByLevel = {
    ...current.bestResultsByLevel,
    [levelId]: bestResult,
  };
  const results = Object.values(bestResultsByLevel);
  const totalMazesCompleted = results.length;
  const totalCompletions = results.reduce((sum, result) => sum + result.completions, 0);
  const generatedResults = results.filter((result) => result.source === "generated");
  const generatedCompletions = Math.max(
    current.generatedCompletions + (source === "generated" ? 1 : 0),
    generatedResults.reduce((sum, result) => sum + result.completions, 0),
  );
  const generatedMazesCompleted = Math.max(
    current.generatedMazesCompleted,
    generatedResults.length,
  );
  const rescuesBySpecies = { ...current.rescuesBySpecies };
  for (const species of rescuedSpecies) {
    rescuesBySpecies[species] += 1;
  }
  const badges = mergeUnique(
    current.badges,
    badgesForMetrics({
      totalMazesCompleted,
      generatedMazesCompleted,
      rescuesBySpecies,
      bestResultsByLevel,
    }),
  );

  return {
    schemaVersion: PLAYER_PROGRESS_SCHEMA_VERSION,
    unlockedLevelCount,
    campaignOrderVersion: futureCampaignOrder
      ? current.campaignOrderVersion
      : CAMPAIGN_ORDER_VERSION,
    unlockedLevelIds,
    gold: current.gold + reward.gold + nonNegativeInteger(input.bonusGold),
    sciencePoints: current.sciencePoints + nonNegativeInteger(input.sciencePoints),
    stickers: mergeUnique(current.stickers, reward.stickerIds),
    medals: mergeUnique(
      current.medals,
      medalsForPerfectRescueCount(perfectRescueMazeCount),
    ),
    badges,
    bestResultsByLevel,
    totalMazesCompleted,
    totalCompletions,
    generatedCompletions,
    generatedMazesCompleted,
    totalAnimalsRescued: current.totalAnimalsRescued + rescuedCount,
    rescuesBySpecies,
    perfectRescueMazeCount,
    currentPerfectRescueStreak,
    bestPerfectRescueStreak: Math.max(
      current.bestPerfectRescueStreak,
      currentPerfectRescueStreak,
    ),
    completionReceipts: completionId
      ? [...current.completionReceipts, completionId].slice(-MAX_COMPLETION_RECEIPTS)
      : current.completionReceipts,
  };
}

function browserStorage(): ProgressStorage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

/** Save a sanitized v5 snapshot. Returns false instead of throwing on failure. */
export function writePlayerProgress(
  progress: PlayerProgress,
  storage: ProgressStorage | null | undefined = undefined,
): boolean {
  const target = storage === undefined ? browserStorage() : storage;
  if (target === null) return false;

  try {
    target.setItem(
      PLAYER_PROGRESS_STORAGE_KEY,
      JSON.stringify(migratePlayerProgress(progress)),
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Read v5 progress, falling back through v4, v3, v2 and the released numeric v1 save.
 * Successful legacy migrations are transparently copied to the v5 key. Every
 * storage and parsing failure returns a fresh default.
 */
export function readPlayerProgress(
  storage: ProgressStorage | null | undefined = undefined,
): PlayerProgress {
  const target = storage === undefined ? browserStorage() : storage;
  if (target === null) return createDefaultPlayerProgress();

  try {
    const storedV5 = target.getItem(PLAYER_PROGRESS_STORAGE_KEY);
    if (storedV5 !== null) {
      try {
        const parsed = JSON.parse(storedV5) as unknown;
        if (isRecord(parsed) && (
          parsed.schemaVersion === PLAYER_PROGRESS_SCHEMA_VERSION
          || parsed.schemaVersion === 4
          || parsed.schemaVersion === 3
          || parsed.schemaVersion === 2
        )) {
          const migrated = migratePlayerProgress(parsed);
          if (parsed.schemaVersion !== PLAYER_PROGRESS_SCHEMA_VERSION) writePlayerProgress(migrated, target);
          return migrated;
        }
      } catch {
        // A usable legacy save may still be present below.
      }
    }

    const priorV4 = target.getItem(VERSION_FOUR_PLAYER_PROGRESS_STORAGE_KEY);
    if (priorV4 !== null) {
      try {
        const parsed = JSON.parse(priorV4) as unknown;
        if (isRecord(parsed) && parsed.schemaVersion === 4) {
          const migrated = migratePlayerProgress(parsed);
          writePlayerProgress(migrated, target);
          return migrated;
        }
      } catch {
        // Continue to older released formats.
      }
    }

    const priorV3 = target.getItem(VERSION_THREE_PLAYER_PROGRESS_STORAGE_KEY);
    if (priorV3 !== null) {
      try {
        const parsed = JSON.parse(priorV3) as unknown;
        if (isRecord(parsed) && parsed.schemaVersion === 3) {
          const migrated = migratePlayerProgress(parsed);
          writePlayerProgress(migrated, target);
          return migrated;
        }
      } catch {
        // Continue to older released formats.
      }
    }

    const storedV2 = target.getItem(VERSION_TWO_PLAYER_PROGRESS_STORAGE_KEY);
    if (storedV2 !== null) {
      try {
        const parsed = JSON.parse(storedV2) as unknown;
        if (isRecord(parsed) && parsed.schemaVersion === 2) {
          const migrated = migratePlayerProgress(parsed);
          writePlayerProgress(migrated, target);
          return migrated;
        }
      } catch {
        // A usable v1 save may still be present below.
      }
    }

    const storedV1 = target.getItem(LEGACY_PLAYER_PROGRESS_STORAGE_KEY);
    if (storedV1 === null) return createDefaultPlayerProgress();

    const migrated = migratePlayerProgress(storedV1);
    writePlayerProgress(migrated, target);
    return migrated;
  } catch {
    return createDefaultPlayerProgress();
  }
}
