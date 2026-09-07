import { MIMIC_FAMILY_IDS, type MimicFamilyId } from "./rewardRules";
import type { GameState, LevelDefinition, LevelObject, TreasureCurrency } from "./types";

/** New encounters only. rewardRules.ts version1 remains pinned historical truth. */
export const CHEST_RULES_VERSION = 2 as const;
export interface ChestReceipt {
  readonly objectId: string;
  readonly family: MimicFamilyId;
  readonly rulesVersion: typeof CHEST_RULES_VERSION;
  readonly outcome: "good" | "mimic";
  readonly power: number;
  readonly rewards: readonly { readonly currency: TreasureCurrency; readonly amount: number }[];
  readonly phase: "good-open" | "revealed" | "defeated";
}
export type ChestObject = Extract<LevelObject, { kind: "chest" }>;
/** Preserve every replaced authored chest's eight-Gold floor; Science is additive. */
export const ORDINARY_MIXED_CHEST = { gold: [8,10], science: [2,4] } as const;
function roll(runId: string, levelId: string, objectId: string, channel: string, modulo: number): number {
  let hash=0x811c9dc5;
  for (const c of JSON.stringify([CHEST_RULES_VERSION,runId,levelId,objectId,channel])) hash=Math.imul(hash^c.charCodeAt(0),0x01000193);
  return (hash>>>0)%modulo;
}
/** Both currency minima exceed every ordinary chest roll and same-band enemy. */
export function mimicRewardRanges(power: number) {
  const band=power>=20?3:power>=9?2:power>=4?1:0;
  return {gold:[11+band,14+band],science:[6+band,8+band]} as const;
}
export function chestPolicyErrors(o: ChestObject): string[] {
  return (MIMIC_FAMILY_IDS as readonly string[]).includes(o.family) && o.rewardRules===2
    && Number.isSafeInteger(o.mimicChance)&&o.mimicChance>=0&&o.mimicChance<=100
    && Number.isSafeInteger(o.power)&&o.power>=1&&o.power<=1000 ? []
    : [`Chest ${o.id} needs a known family, rules2, integer chance0–100 and fixed Power1–1000.`];
}
/** First legal contact owns the roll. No renderer, reload or frame randomness. */
export function resolveChest(runId: string,levelId: string,o: ChestObject): ChestReceipt {
  const errors=chestPolicyErrors(o);if(errors.length)throw Error(errors.join(" "));
  const outcome=roll(runId,levelId,o.id,"outcome",100)<o.mimicChance?"mimic":"good";
  const ranges=outcome==="mimic"?mimicRewardRanges(o.power):ORDINARY_MIXED_CHEST;
  const rewards=(Object.entries(ranges) as [TreasureCurrency,readonly[number,number]][])
    .map(([currency,[min,max]])=>({currency,amount:min+roll(runId,levelId,o.id,`${outcome}:${currency}:amount`,max-min+1)}));
  return {objectId:o.id,family:o.family,rulesVersion:2,outcome,power:o.power,rewards,phase:outcome==="good"?"good-open":"revealed"};
}
export const chestReceipt=(game:GameState,id:string)=>game.chests.find(c=>c.objectId===id);
export const chestIsResolved=(game:GameState,id:string)=>{const r=chestReceipt(game,id);return !!r&&r.phase!=="revealed";};
export function commitChest(game:GameState,receipt:ChestReceipt):GameState {
  const prior=chestReceipt(game,receipt.objectId);
  if(prior){
    if(JSON.stringify(prior)===JSON.stringify(receipt))return game;
    if(prior.phase!=="revealed"||receipt.phase!=="defeated"
      ||JSON.stringify({...receipt,phase:prior.phase})!==JSON.stringify(prior))throw Error("Chest receipts are immutable and monotonic");
  } else if(receipt.phase==="defeated")throw Error("A Mimic must reveal before defeat");
  return {...game,chests:[...game.chests.filter(c=>c.objectId!==receipt.objectId),receipt].sort((a,b)=>a.objectId<b.objectId?-1:a.objectId>b.objectId?1:0)};
}
/** Validate exact committed identities/rolls; callers also prove earned Power. */
export function sanitizeChests(value:unknown,level:LevelDefinition,runId:string):ChestReceipt[]|null {
  if(!Array.isArray(value)||value.length>level.objects.filter(o=>o.kind==="chest").length)return null;
  const seen=new Set<string>(),result:ChestReceipt[]=[];
  for(const raw of value){
    if(!raw||typeof raw!=="object"||Array.isArray(raw))return null;
    const o=level.objects.find(o=>o.kind==="chest"&&o.id===raw.objectId);
    if(!o||o.kind!=="chest"||seen.has(o.id))return null;
    const expected=resolveChest(runId,level.id,o);
    if(raw.phase!==expected.phase&&!(expected.outcome==="mimic"&&raw.phase==="defeated"))return null;
    const receipt={...expected,phase:raw.phase};
    if(raw.family!==receipt.family||raw.rulesVersion!==2||raw.outcome!==receipt.outcome||raw.power!==receipt.power
      ||JSON.stringify(raw.rewards)!==JSON.stringify(receipt.rewards))return null;
    seen.add(o.id);result.push(receipt);
  }
  return result.sort((a,b)=>a.objectId<b.objectId?-1:1);
}
