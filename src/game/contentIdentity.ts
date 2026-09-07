import type { LevelDefinition, LevelObject, TerrainKind } from "./types";

/** Bump when engine semantics change without changing authored level data. */
export const GAMEPLAY_RULES_REVISION = 6;

function stableObject(object: LevelObject): readonly unknown[] {
  const common = [object.id, object.kind, object.at.x, object.at.y] as const;
  switch (object.kind) {
    case "chest": return [...common,object.family,object.mimicChance,object.power,object.rewardRules];
    case "enemy": return [...common, object.power];
    case "potion": return [...common, object.amount];
    case "key":
    case "door": return [...common, object.color];
    case "animal": return [...common, object.species];
    case "portal": return [...common, object.pair];
    case "treasure": return [...common, object.currency, object.amount];
    default: return common;
  }
}

/** Small deterministic browser-safe hash; this is an integrity label, not cryptography. */
export function fingerprintText(value: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `g-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function gameplayFingerprintForRules(input: {
  readonly contentRevision: number;
  readonly width: number;
  readonly height: number;
  readonly initialPower: number;
  readonly start: { readonly x: number; readonly y: number };
  readonly exit: { readonly x: number; readonly y: number };
  readonly terrain: readonly (readonly TerrainKind[])[];
  readonly objects: readonly LevelObject[];
}, rulesRevision: number): string {
  return fingerprintText(JSON.stringify([
    rulesRevision,
    input.contentRevision,
    input.width,
    input.height,
    input.initialPower,
    input.start.x,
    input.start.y,
    input.exit.x,
    input.exit.y,
    input.terrain,
    [...input.objects].sort((left, right) => (
      left.id < right.id ? -1 : left.id > right.id ? 1 : 0
    )).map(stableObject),
  ]));
}

export function gameplayFingerprint(input: Parameters<typeof gameplayFingerprintForRules>[0]): string {
  return gameplayFingerprintForRules(input, GAMEPLAY_RULES_REVISION);
}

export function hasCurrentGameplay(level: LevelDefinition, revision: number, fingerprint: string): boolean {
  return level.contentRevision === revision && level.gameplayFingerprint === fingerprint;
}
