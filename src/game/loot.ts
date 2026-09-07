import { enemyXp } from "./adventureXp";
import { enemyRewardAmount, enemyRewardRange, SIMULATION_RUN_ID } from "./enemyRewards";
import { chestIsResolved, chestPolicyErrors, chestReceipt, mimicRewardRanges } from "./chests";
import type { GameState, LevelDefinition, LevelObject, Point, TreasureCurrency } from "./types";

export type LootCurrency = TreasureCurrency | "xp";
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
  readonly sourceKind: "treasure" | "enemy" | "chest";
  readonly objectId: string;
  readonly currency: LootCurrency;
  readonly amount: number;
  readonly credited: number;
  readonly drops: readonly LootDrop[];
}
export interface LootLedger {
  readonly version: 3; readonly runId: string;
  readonly legacyRetiredEnemyIds: readonly string[];
  readonly legacyRetiredXpIds: readonly string[];
  readonly sources: readonly LootSource[];
}
export const emptyLoot = (runId = SIMULATION_RUN_ID): LootLedger => ({ version: 3, runId, legacyRetiredEnemyIds: [], legacyRetiredXpIds: [], sources: [] });
const currencies = ["gold", "science"] as const;
type RewardOrigin = Extract<LevelObject, { kind: "treasure" | "enemy" | "chest" }>;
const sourceKey = (object: RewardOrigin, currency: LootCurrency) => object.kind === "treasure"
  ? object.id : JSON.stringify([object.kind, object.id, currency]);
function channels(object: RewardOrigin, game?: GameState): readonly LootCurrency[] {
  if (object.kind === "treasure") return [object.currency];
  const noXp = game?.loot.legacyRetiredXpIds.includes(object.id)
    || object.kind === "chest" && game && chestReceipt(game, object.id)?.phase === "good-open";
  return noXp ? currencies : [...currencies, "xp"];
}
function rewardOrigins(level: LevelDefinition): RewardOrigin[] {
  return level.objects.filter((o): o is RewardOrigin => o.kind === "treasure" || o.kind === "enemy" || o.kind === "chest");
}
const resolved = (game: GameState, o: RewardOrigin) => o.kind === "treasure"
  ? game.collectedObjectIds.includes(o.id) : o.kind === "chest" ? chestIsResolved(game,o.id) : game.defeatedEnemyIds.includes(o.id);
function rewardAmount(level:LevelDefinition,game:GameState,o:RewardOrigin,currency:LootCurrency):number {
  if(o.kind==="treasure")return o.amount;
  if(currency==="xp")return enemyXp(o.power,o.kind==="chest");
  if(o.kind==="enemy")return enemyRewardAmount(game.loot.runId,level.id,o.id,o.power,currency);
  const receipt=chestReceipt(game,o.id);
  if(!receipt||receipt.phase==="revealed")throw Error("Chest rewards require a resolved receipt");
  return receipt.rewards.find(r=>r.currency===currency)!.amount;
}
function reservedLoot(level: LevelDefinition, game: GameState): number {
  return rewardOrigins(level).reduce((n,o) => n + channels(o,game).length * Number(!resolved(game,o)), 0);
}
const same = (a: Point, b: Point) => a.x === b.x && a.y === b.y;

export function authoredLootErrors(level: LevelDefinition): string[] {
  const treasures = level.objects.filter(o => o.kind === "treasure");
  const errors = rewardOrigins(level).reduce((n,o) => n + channels(o).length, 0) > LOOT_CAPACITY
    ? ["A level may contain at most 64 potential reward channels (three per enemy or chest, one per treasure)."] : [];
  const keys = rewardOrigins(level).flatMap(o=>channels(o).map(c=>sourceKey(o,c)));
  if (new Set(keys).size !== keys.length) errors.push("Reward channel identities must be unique.");
  let total = 0;
  for (const source of treasures) {
    if (!Number.isSafeInteger(source.amount) || source.amount <= 0 || !["gold","science"].includes(source.currency))
      errors.push(`Treasure ${source.id} must contain a positive safe integer of Gold or Science.`);
    total += source.amount;
  }
  for (const object of level.objects) if (object.kind === "enemy" && (!Number.isSafeInteger(object.power) || object.power < 1))
    errors.push(`Enemy ${object.id} must have positive safe integer Power.`);
  for (const object of level.objects) if (object.kind === "enemy" && Number.isSafeInteger(object.power) && object.power > 0)
    total += enemyXp(object.power) + currencies.reduce((n,c)=>n+enemyRewardRange(object.power,c)[1],0);
  for(const object of level.objects)if(object.kind==="chest"){
    errors.push(...chestPolicyErrors(object));
    total+=enemyXp(object.power,true)+currencies.reduce((n,c)=>n+mimicRewardRanges(object.power)[c][1],0);
  }
  if (!Number.isSafeInteger(total)) errors.push("Reward totals must remain safe integers.");
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
      case "chest": return chestIsResolved(game,o.id);
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

/** Admit a complete encounter atomically, reserving all future channels and
 * the remaining channel of this defeat. Accepted claims never merge. */
export function scatterTreasure(level: LevelDefinition, game: GameState,
  object: RewardOrigin): LootLedger {
  if (!resolved(game,object)) return game.loot;
  const requested = channels(object,game).filter(currency => !game.loot.sources.some(s => s.sourceId === sourceKey(object,currency)));
  if (!requested.length || game.loot.legacyRetiredEnemyIds.includes(object.id)) return game.loot;
  const paths = lootLandingPaths(level, game, object.at);
  if (!paths.length) throw Error(`Reward has no safe landing: ${object.id}`);
  let occupied = game.loot.sources.reduce((n,s) => n + s.drops.length, 0);
  const reserved = reservedLoot(level,game), sources = [...game.loot.sources];
  const usedLandings = new Set<Point[]>();
  for (const [channelIndex,currency] of requested.entries()) {
    const sourceId = sourceKey(object,currency);
    const amount = rewardAmount(level,game,object,currency);
    const unused = paths.filter(path => !usedLandings.has(path));
    const available = unused.length ? unused : paths;
    const slots = Math.min(4, amount, LOOT_CAPACITY - occupied - reserved - (requested.length-channelIndex-1),
      Math.max(1, available.length - (requested.length-channelIndex-1)));
    if (slots < 1) throw Error("Loot exceeds its reserved capacity");
    // Guarantee a readable near bundle and, when possible, a genuinely distant
    // bundle. Remaining directions vary by stable source identity, never frame RNG.
    let seed = 0; for (const c of sourceId) seed = (Math.imul(seed,31) + c.charCodeAt(0)) >>> 0;
    const rank = (p: Point[]) => { const a=p.at(-1)!; return ((Math.imul(a.x+1,73856093)^Math.imul(a.y+1,19349663)^seed)>>>0); };
    const near = available.filter(p => p.length === 2).sort((a,b) => rank(a)-rank(b))[0] ?? available[0]!;
    const far = available.filter(p => Math.hypot(p.at(-1)!.x-object.at.x,p.at(-1)!.y-object.at.y) > LOOT_RANGE)
      .sort((a,b) => rank(a)-rank(b))[0];
    const selected = [near, ...(far && far !== near ? [far] : []),
      ...available.filter(p => p !== near && p !== far).sort((a,b) => rank(a)-rank(b))].slice(0, slots);
    for (const path of selected) usedLandings.add(path);
    sources.push({ sourceId, sourceKind: object.kind, objectId: object.id, currency, amount, credited: 0,
      drops: selected.map((path,index) => ({ id: `${sourceId}/${index}`, at: path.at(-1)!, phase: "grounded",
        amount: Math.floor(amount/slots) + (index < amount%slots ? 1 : 0) })) });
    occupied += slots;
  }
  return { ...game.loot, sources: sources.sort((a,b) => a.sourceId < b.sourceId ? -1 : a.sourceId > b.sourceId ? 1 : 0) };
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
  return changed ? { ...game, loot: { ...game.loot, sources } } : game;
}

/** The sole credit reducer. IDs are namespaced by source inside the current run;
 * the UI command owner additionally guards runId. Restoration/interruption use
 * this same reducer, so no renderer cancellation can erase accepted value. */
export function finishLootClaims(game: GameState, ids?: ReadonlySet<string>): GameState {
  let gold = 0, science = 0, xp = 0;
  const sources = game.loot.sources.map(source => {
    const accepted = source.drops.filter(d => d.phase === "claiming" && (!ids || ids.has(d.id)));
    if (!accepted.length) return source;
    const amount = accepted.reduce((n,d) => n+d.amount,0), done = new Set(accepted.map(d => d.id));
    if (source.currency === "gold") gold += amount; else if (source.currency === "science") science += amount; else xp += amount;
    return { ...source, credited: source.credited + amount, drops: source.drops.filter(d => !done.has(d.id)) };
  });
  return gold || science || xp ? { ...game, loot: { ...game.loot, sources },
    goldStarsCollected: game.goldStarsCollected+gold, sciencePointsCollected: game.sciencePointsCollected+science, xpCollected: game.xpCollected+xp } : game;
}

/** Old runs already received these amounts. No retroactive pending drops. */
export function legacyCreditedLoot(level: LevelDefinition, game: GameState, runId = game.loot?.runId ?? SIMULATION_RUN_ID): LootLedger {
  return { ...emptyLoot(runId), legacyRetiredEnemyIds: [...game.defeatedEnemyIds].sort(), legacyRetiredXpIds: retiredXp(level,game),
    sources: level.objects.flatMap(o => o.kind === "treasure" && game.collectedObjectIds.includes(o.id)
    ? [{ sourceId: o.id, sourceKind: "treasure" as const, objectId: o.id, currency: o.currency, amount: o.amount, credited: o.amount, drops: [] }] : []) };
}

function retiredXp(level: LevelDefinition, game: GameState): string[] {
  return rewardOrigins(level).filter(o => o.kind !== "treasure" && resolved(game,o)).map(o=>o.id).sort();
}

/** v2 proves old Gold/Science only; resolved encounters never mint new XP. */
export function migratePreXpLoot(value: unknown, level: LevelDefinition, game: GameState): GameState | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const raw = value as Record<string,unknown>;
  if (raw.version !== 2) return null;
  const loot = validateLoot({ ...raw, version: 3, legacyRetiredXpIds: retiredXp(level,game) },level,game,2);
  return loot ? compactMigratedLoot(level,{...game,loot}) : null;
}

/** Validate v4's authored-only ledger without banking grounded value. */
export function migrateAuthoredLoot(value: unknown, level: LevelDefinition, game: GameState, runId: string): GameState | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const raw = value as Record<string,unknown>;
  if (raw.version !== 1 || !Array.isArray(raw.sources)) return null;
  const sources = raw.sources.map(s => s && typeof s === "object" && !Array.isArray(s)
    ? { ...s, sourceKind: "treasure", objectId: s.sourceId } : s);
  const loot = validateLoot({ ...emptyLoot(runId), legacyRetiredEnemyIds: game.defeatedEnemyIds, legacyRetiredXpIds: retiredXp(level,game), sources },level,game,1);
  if (!loot) return null;
  return compactMigratedLoot(level, { ...game, loot });
}

function compactMigratedLoot(level: LevelDefinition, game: GameState): GameState | null {
  const settled = finishLootClaims(game);
  let count = settled.loot.sources.reduce((n,s)=>n+s.drops.length,0);
  const reserved = reservedLoot(level,settled);
  // Only a saturated legacy ledger needs compaction. Preserve currency, source,
  // credited value and one legal existing landing/ID; never auto-bank grounded loot.
  const compacted = [...settled.loot.sources].sort((a,b)=>a.sourceId < b.sourceId ? -1 : 1).map(source=>{
    if (count+reserved <= LOOT_CAPACITY || source.drops.length < 2) return source;
    count -= source.drops.length-1;
    return { ...source, drops: [{ ...source.drops[0]!, amount: source.drops.reduce((n,d)=>n+d.amount,0) }] };
  });
  const result = { ...settled, loot: { ...settled.loot, sources: compacted } };
  return sanitizeLoot(result.loot,level,result) ? result : null;
}

export function lootClaimDuration(distance: number): number {
  return Math.round(250 + 450*Math.min(1,Math.max(0,distance/LOOT_RANGE))**2);
}

/** Validate conservation and exact authored attribution before accepting a save. */
export function sanitizeLoot(value: unknown, level: LevelDefinition, game: GameState): LootLedger | null {
  return validateLoot(value,level,game);
}
function validateLoot(value: unknown, level: LevelDefinition, game: GameState, legacyMode = 0): LootLedger | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  if (raw.version !== 3 || typeof raw.runId !== "string" || !/^(?:run|migrated)-[a-zA-Z0-9-]{8,160}$/.test(raw.runId)
    || !Array.isArray(raw.sources) || !Array.isArray(raw.legacyRetiredEnemyIds) || !Array.isArray(raw.legacyRetiredXpIds)) return null;
  const retired = raw.legacyRetiredEnemyIds;
  if (new Set(retired).size !== retired.length || retired.some(id => typeof id !== "string" || !game.defeatedEnemyIds.includes(id))) return null;
  const xpRetired = raw.legacyRetiredXpIds;
  const resolvedXpIds = retiredXp(level,game);
  if (new Set(xpRetired).size !== xpRetired.length || xpRetired.some(id => typeof id !== "string" || !resolvedXpIds.includes(id))) return null;
  const channelGame = { ...game, loot: { ...game.loot, legacyRetiredXpIds: xpRetired as string[] } };
  const expected = rewardOrigins(level).flatMap(object => (resolved(game,object) && !retired.includes(object.id))
    ? channels(object,channelGame).map(currency => ({ object, currency, sourceId: sourceKey(object,currency),
      amount: rewardAmount(level,{...game,loot:{...game.loot,runId:raw.runId as string}},object,currency) })) : []);
  if (raw.sources.length !== expected.length || expected.length > LOOT_CAPACITY) return null;
  const sources: LootSource[] = [], seen = new Set<string>();
  let count = 0, gold = 0, science = 0, xp = 0;
  for (const entry of raw.sources) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
    const source = entry as Record<string, unknown>;
    const channel = expected.find(c => c.sourceId === source.sourceId);
    if (!channel || seen.has(channel.sourceId) || source.currency !== channel.currency
      || source.objectId !== channel.object.id || source.sourceKind !== channel.object.kind
      || source.amount !== channel.amount || !Number.isSafeInteger(source.credited)
      || (source.credited as number) < 0 || !Array.isArray(source.drops)) return null;
    const { object, currency, amount, sourceId } = channel;
    seen.add(sourceId);
    const paths = lootLandingPaths(level, game, object.at), ids = new Set<string>(), drops: LootDrop[] = [];
    let pending = 0;
    for (const item of source.drops) {
      if (!item || typeof item !== "object" || Array.isArray(item)) return null;
      const drop = item as Record<string, unknown>, at = drop.at as Point | undefined;
      if (typeof drop.id !== "string" || ![0,1,2,3].some(i => drop.id === `${sourceId}/${i}`)
        || ids.has(drop.id) || !Number.isSafeInteger(drop.amount) || (drop.amount as number) <= 0
        || (drop.phase !== "grounded" && drop.phase !== "claiming") || !at
        || !Number.isSafeInteger(at.x) || !Number.isSafeInteger(at.y)
        || !paths.some(p => same(p.at(-1)!, at)) || ++count > LOOT_CAPACITY) return null;
      ids.add(drop.id); pending += drop.amount as number;
      drops.push({ id: drop.id, amount: drop.amount as number, at: { x: at.x, y: at.y }, phase: drop.phase });
    }
    const credited = source.credited as number;
    if (credited + pending !== amount) return null;
    if (currency === "gold") gold += credited; else if (currency === "science") science += credited; else xp += credited;
    sources.push({ sourceId, sourceKind: object.kind, objectId: object.id, currency, amount, credited, drops });
  }
  if (gold !== game.goldStarsCollected || science !== game.sciencePointsCollected || xp !== game.xpCollected) return null;
  const reserved = legacyMode === 1 ? level.objects.filter(o=>o.kind==="treasure"&&!game.collectedObjectIds.includes(o.id)).length
    : legacyMode === 2 ? rewardOrigins(level).reduce((n,o)=>n+(resolved(game,o)?0:o.kind==="treasure"?1:2),0) : reservedLoot(level,game);
  if (count + reserved > LOOT_CAPACITY) return null;
  return { version: 3, runId: raw.runId, legacyRetiredEnemyIds: [...retired].sort(), legacyRetiredXpIds: [...xpRetired].sort(), sources };
}
