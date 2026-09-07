import type { GameState, LevelDefinition, LevelObject, Point, TreasureCurrency } from "./types";

export const LOOT_CAPACITY = 64;
export const LOOT_SETTLE_MS = 750;
export const LOOT_RANGE = 1.75;
export interface LootDrop {
  readonly id: string;
  readonly amount: number;
  readonly at: Point;
  readonly phase: "grounded" | "claiming";
}
export interface LootSource {
  readonly sourceId: string;
  readonly currency: TreasureCurrency;
  readonly amount: number;
  readonly credited: number;
  readonly drops: readonly LootDrop[];
}
export interface LootLedger { readonly version: 1; readonly sources: readonly LootSource[] }
export const emptyLoot = (): LootLedger => ({ version: 1, sources: [] });
const same = (a: Point, b: Point) => a.x === b.x && a.y === b.y;

export function authoredLootErrors(level: LevelDefinition): string[] {
  const treasures = level.objects.filter(o => o.kind === "treasure");
  const errors = treasures.length > LOOT_CAPACITY ? ["A level may contain at most 64 authored reward sources."] : [];
  let total = 0;
  for (const source of treasures) {
    if (!Number.isSafeInteger(source.amount) || source.amount <= 0 || !["gold","science"].includes(source.currency))
      errors.push(`Treasure ${source.id} must contain a positive safe integer of Gold or Science.`);
    total += source.amount;
  }
  if (!Number.isSafeInteger(total)) errors.push("Authored reward totals must remain safe integers.");
  return errors;
}

/** Ordinary physical floor, including a source that has just been resolved.
 * Portals, start/exit and unresolved interactions are never drop destinations. */
export function lootFloor(level: LevelDefinition, game: GameState, at: Point): boolean {
  if (level.terrain[at.y]?.[at.x] !== "floor" || same(at, level.start) || same(at, level.exit)) return false;
  return level.objects.filter(o => same(o.at, at)).every(o => {
    switch (o.kind) {
      case "portal": return false;
      case "enemy": return game.defeatedEnemyIds.includes(o.id);
      case "animal": return game.rescuedAnimalIds.includes(o.id);
      case "door": return game.openedDoorIds.includes(o.id);
      default: return game.collectedObjectIds.includes(o.id);
    }
  });
}

/** Small cardinal flood, independent of solver and generator randomness. */
export function lootLandingPaths(level: LevelDefinition, game: GameState, from: Point): Point[][] {
  if (!lootFloor(level, game, from)) return [];
  const paths: Point[][] = [[from]], seen = new Set([`${from.x},${from.y}`]);
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i]!;
    if (path.length === 3) continue;
    const at = path.at(-1)!;
    for (const [dx, dy] of [[1,0],[0,1],[-1,0],[0,-1]]) {
      const next = { x: at.x + dx!, y: at.y + dy! }, key = `${next.x},${next.y}`;
      if (!seen.has(key) && lootFloor(level, game, next)) { seen.add(key); paths.push([...path, next]); }
    }
  }
  return paths.filter(path => lootFloor(level, game, path.at(-1)!));
}

export function pendingLoot(game: GameState): number {
  return game.loot.sources.reduce((n, s) => n + s.drops.reduce((m,d) => m + d.amount, 0), 0);
}

/** Reserve one bundle for each future source, coalescing units within the current
 * source when capacity is tight. Source attribution/accepted claims never merge.
 * Supported levels have at most64 authored sources; current campaign max is4. */
export function scatterTreasure(level: LevelDefinition, game: GameState,
  object: Extract<LevelObject, { kind: "treasure" }>): LootLedger {
  if (game.loot.sources.some(s => s.sourceId === object.id)) return game.loot;
  const paths = lootLandingPaths(level, game, object.at);
  if (!paths.length) throw Error(`Treasure has no safe landing: ${object.id}`);
  const occupied = game.loot.sources.reduce((n,s) => n + s.drops.length, 0);
  const reserved = level.objects.filter(o => o.kind === "treasure" && !game.collectedObjectIds.includes(o.id)).length;
  const slots = Math.min(4, object.amount, LOOT_CAPACITY - occupied - reserved, paths.length);
  if (slots < 1) throw Error("Authored loot exceeds its reserved capacity");
  // Guarantee a readable near bundle and, when possible, a genuinely distant
  // bundle. Remaining directions vary by stable source identity, never frame RNG.
  let seed = 0; for (const c of object.id) seed = (Math.imul(seed,31) + c.charCodeAt(0)) >>> 0;
  const rank = (p: Point[]) => { const a=p.at(-1)!; return ((Math.imul(a.x+1,73856093)^Math.imul(a.y+1,19349663)^seed)>>>0); };
  const near = paths.filter(p => p.length === 2).sort((a,b) => rank(a)-rank(b))[0] ?? paths[0]!;
  const far = paths.filter(p => Math.hypot(p.at(-1)!.x-object.at.x,p.at(-1)!.y-object.at.y) > LOOT_RANGE)
    .sort((a,b) => rank(a)-rank(b))[0];
  const selected = [near, ...(far && far !== near ? [far] : []),
    ...paths.filter(p => p !== near && p !== far).sort((a,b) => rank(a)-rank(b))].slice(0, slots);
  const source: LootSource = { sourceId: object.id, currency: object.currency, amount: object.amount, credited: 0,
    drops: selected.map((path,index) => ({ id: `${object.id}/${index}`, at: path.at(-1)!, phase: "grounded",
      amount: Math.floor(object.amount/slots) + (index < object.amount%slots ? 1 : 0) })) };
  return { version: 1, sources: [...game.loot.sources, source].sort((a,b) => a.sourceId.localeCompare(b.sourceId)) };
}

/** A swept glyph-sized straight route. Around-corner and through-door attraction
 * waits until Ame approaches a clear line; no invisible routed vacuum. */
export function lootLineClear(level: LevelDefinition, game: GameState, from: Point, to: Point): boolean {
  if (![from.x,from.y,to.x,to.y].every(Number.isFinite)) return false;
  const length = Math.hypot(to.x-from.x,to.y-from.y), count = Math.max(1, Math.ceil(length*20));
  for (let i=0;i<=count;i++) for (const dx of [-.45,.45]) for (const dy of [-.45,.45]) {
    const at = { x: Math.floor(from.x+.5+(to.x-from.x)*i/count+dx), y: Math.floor(from.y+.5+(to.y-from.y)*i/count+dy) };
    if (!lootFloor(level,game,at)) return false;
  }
  return true;
}

export function beginLootClaims(level: LevelDefinition, game: GameState,
  requests: readonly { id: string; elapsedMs: number }[], ground: Point = game.position): GameState {
  if (game.status !== "playing" || !Number.isFinite(ground.x+ground.y)) return game;
  let changed = false;
  const ready = new Set(requests.filter(r => Number.isFinite(r.elapsedMs) && r.elapsedMs >= LOOT_SETTLE_MS).map(r => r.id));
  const sources = game.loot.sources.map(source => ({ ...source, drops: source.drops.map(drop => {
    if (drop.phase !== "grounded" || !ready.has(drop.id)
      || Math.hypot(drop.at.x-ground.x,drop.at.y-ground.y) > LOOT_RANGE
      || !lootLineClear(level,game,drop.at,ground)) return drop;
    changed = true; return { ...drop, phase: "claiming" as const };
  }) }));
  return changed ? { ...game, loot: { version: 1, sources } } : game;
}

/** The sole credit reducer. IDs are namespaced by source inside the current run;
 * the UI command owner additionally guards runId. Restoration/interruption use
 * this same reducer, so no renderer cancellation can erase accepted value. */
export function finishLootClaims(game: GameState, ids?: ReadonlySet<string>): GameState {
  let gold = 0, science = 0;
  const sources = game.loot.sources.map(source => {
    const accepted = source.drops.filter(d => d.phase === "claiming" && (!ids || ids.has(d.id)));
    if (!accepted.length) return source;
    const amount = accepted.reduce((n,d) => n+d.amount,0), done = new Set(accepted.map(d => d.id));
    if (source.currency === "gold") gold += amount; else science += amount;
    return { ...source, credited: source.credited + amount, drops: source.drops.filter(d => !done.has(d.id)) };
  });
  return gold || science ? { ...game, loot: { version: 1, sources },
    goldStarsCollected: game.goldStarsCollected+gold, sciencePointsCollected: game.sciencePointsCollected+science } : game;
}

/** Old runs already received these amounts. No retroactive pending drops. */
export function legacyCreditedLoot(level: LevelDefinition, game: GameState): LootLedger {
  return { version: 1, sources: level.objects.flatMap(o => o.kind === "treasure" && game.collectedObjectIds.includes(o.id)
    ? [{ sourceId: o.id, currency: o.currency, amount: o.amount, credited: o.amount, drops: [] }] : []) };
}

export function lootClaimDuration(distance: number): number {
  return Math.round(250 + 450*Math.min(1,Math.max(0,distance/LOOT_RANGE))**2);
}

/** Validate conservation and exact authored attribution before accepting a save. */
export function sanitizeLoot(value: unknown, level: LevelDefinition, game: GameState): LootLedger | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  if (raw.version !== 1 || !Array.isArray(raw.sources)) return null;
  const expected = level.objects.filter(o => o.kind === "treasure" && game.collectedObjectIds.includes(o.id));
  if (raw.sources.length !== expected.length || expected.length > LOOT_CAPACITY) return null;
  const sources: LootSource[] = [], seen = new Set<string>();
  let count = 0, gold = 0, science = 0;
  for (const entry of raw.sources) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
    const source = entry as Record<string, unknown>;
    const object = expected.find(o => o.id === source.sourceId);
    if (object?.kind !== "treasure" || seen.has(object.id) || source.currency !== object.currency
      || source.amount !== object.amount || !Number.isSafeInteger(source.credited)
      || (source.credited as number) < 0 || !Array.isArray(source.drops)) return null;
    seen.add(object.id);
    const paths = lootLandingPaths(level, game, object.at), ids = new Set<string>(), drops: LootDrop[] = [];
    let pending = 0;
    for (const item of source.drops) {
      if (!item || typeof item !== "object" || Array.isArray(item)) return null;
      const drop = item as Record<string, unknown>, at = drop.at as Point | undefined;
      if (typeof drop.id !== "string" || ![0,1,2,3].some(i => drop.id === `${object.id}/${i}`)
        || ids.has(drop.id) || !Number.isSafeInteger(drop.amount) || (drop.amount as number) <= 0
        || (drop.phase !== "grounded" && drop.phase !== "claiming") || !at
        || !Number.isSafeInteger(at.x) || !Number.isSafeInteger(at.y)
        || !paths.some(p => same(p.at(-1)!, at)) || ++count > LOOT_CAPACITY) return null;
      ids.add(drop.id); pending += drop.amount as number;
      drops.push({ id: drop.id, amount: drop.amount as number, at: { x: at.x, y: at.y }, phase: drop.phase });
    }
    const credited = source.credited as number;
    if (credited + pending !== object.amount) return null;
    if (object.currency === "gold") gold += credited; else science += credited;
    sources.push({ sourceId: object.id, currency: object.currency, amount: object.amount, credited, drops });
  }
  if (gold !== game.goldStarsCollected || science !== game.sciencePointsCollected) return null;
  const reserved = level.objects.filter(o => o.kind === "treasure" && !seen.has(o.id)).length;
  if (count + reserved > LOOT_CAPACITY) return null;
  return { version: 1, sources };
}
