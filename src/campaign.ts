export const CAMPAIGN_ORDER_VERSION = 2 as const;

/** Shipped pre-gameplay-pass order, retained so v1-v3 saves migrate by identity. */
const ORIGINAL_CAMPAIGN_ORDER = [
    "little-star-trail", "shiny-sword", "splashy-boots", "rainbow-picnic",
    "toasty-toes", "moonbeam-moat", "wishing-woods", "ames-grand-parade",
    "springstep-sky-hollow", "lanternlight-labyrinth", "twilight-treasure-loop",
    "moonlit-friendship-quest", "rose-heart-roundabout", "clover-comeback-carnival",
    "friendship-crown-vault", "rainbow-power-parade",
  ] as const;

export const HISTORICAL_CAMPAIGN_ORDERS: Readonly<Record<number, readonly string[]>> = {
  1: ORIGINAL_CAMPAIGN_ORDER,
  2: ORIGINAL_CAMPAIGN_ORDER,
} as const;

export const CURRENT_CAMPAIGN_ORDER = [...ORIGINAL_CAMPAIGN_ORDER] as const;

export function campaignOrderForVersion(version: number): readonly string[] | null {
  if (!Number.isSafeInteger(version) || version < 1) return null;
  return HISTORICAL_CAMPAIGN_ORDERS[version] ?? null;
}

export interface CampaignAccessInput {
  readonly previousOrder: readonly string[];
  readonly currentOrder: readonly string[];
  readonly unlockedCount: number;
  readonly completedLevelIds?: readonly string[];
  readonly unlockedLevelIds?: readonly string[];
}

/**
 * Migrates positional access through inserted/appended chapters without revoking
 * completed records. A completed former finale opens the first chapter after it.
 */
export function migrateCampaignAccess(input: CampaignAccessInput): readonly string[] {
  if (input.currentOrder.length === 0) return [];
  const normalizedUnlockedCount = Math.max(0, Math.floor(input.unlockedCount));
  const explicit = new Set(input.unlockedLevelIds ?? []);
  const openLegacy = explicit.size > 0
    ? explicit
    : new Set(input.previousOrder.slice(0, Math.max(1, normalizedUnlockedCount)));
  const completed = new Set(input.completedLevelIds ?? []);
  const open = new Set<string>();

  for (const id of input.currentOrder) {
    if (openLegacy.has(id) || completed.has(id)) open.add(id);
  }
  open.add(input.currentOrder[0]!);

  for (const completedId of completed) {
    const index = input.currentOrder.indexOf(completedId);
    if (index >= 0 && index + 1 < input.currentOrder.length) open.add(input.currentOrder[index + 1]!);
  }

  const frontierIndex = explicit.size > 0
    ? Math.max(...[...explicit].map((id) => input.currentOrder.indexOf(id)))
    : (() => {
        const legacyFrontier = input.previousOrder[
          Math.min(input.previousOrder.length - 1, Math.max(0, normalizedUnlockedCount - 1))
        ];
        return legacyFrontier ? input.currentOrder.indexOf(legacyFrontier) : -1;
      })();
  if (frontierIndex >= 0) {
    for (let index = 0; index <= frontierIndex; index += 1) open.add(input.currentOrder[index]!);
  }
  return input.currentOrder.filter((id) => open.has(id));
}

export function contiguousUnlockedCount(order: readonly string[], unlockedIds: readonly string[]): number {
  const open = new Set(unlockedIds);
  let count = 0;
  while (count < order.length && open.has(order[count]!)) count += 1;
  return Math.max(1, Math.min(order.length, count));
}
