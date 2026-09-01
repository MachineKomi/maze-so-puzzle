/**
 * Pure timing data for the child-friendly combat victory set piece.
 *
 * Keeping this separate from React and Web Audio makes the presentation easy
 * to test: every displayed frame conserves Power, every clash has matching
 * cues, and the final frame must agree with the engine event exactly.
 */

export const COMBAT_CLASH_COUNT = 3;
export const COMBAT_VICTORY_DURATION_MS = 2220;
export const REDUCED_COMBAT_VICTORY_DURATION_MS = 180;

export interface CombatVictoryInput {
  readonly powerBefore: number;
  readonly enemyPower: number;
  readonly powerAfter: number;
}

export interface CombatPresentationOptions {
  readonly reducedMotion?: boolean;
}

export interface CombatClashBeat {
  /** Zero-based, so it can be used directly by rendering code. */
  readonly index: number;
  readonly startMs: number;
  readonly impactMs: number;
  readonly endMs: number;
  readonly transferStartMs: number;
  readonly transferEndMs: number;
}

export interface CombatTransferStep {
  readonly atMs: number;
  readonly clashIndex: number;
  readonly transferredPower: number;
  readonly playerPower: number;
  readonly enemyPower: number;
}

export type CombatPresentationCueKind =
  | "clash"
  | "sparks"
  | "impact"
  | "power-start"
  | "power-tick"
  | "victory";

export interface CombatPresentationCue {
  readonly atMs: number;
  readonly kind: CombatPresentationCueKind;
  readonly clashIndex?: number;
}

export type CombatPresentationPhase =
  | "windup"
  | "clash"
  | "transfer"
  | "victory"
  | "complete";

export interface CombatPresentationFrame {
  readonly elapsedMs: number;
  readonly phase: CombatPresentationPhase;
  readonly activeClashIndex: number | null;
  /** Smooth 0..1 progress through the active clash, useful for CSS variables. */
  readonly clashProgress: number;
  /** A smooth 0..1..0 pulse peaking on contact. */
  readonly clashPulse: number;
  readonly transferredPower: number;
  readonly playerPower: number;
  readonly enemyPower: number;
  readonly complete: boolean;
}

export interface CombatVictoryPlan extends CombatVictoryInput {
  readonly reducedMotion: boolean;
  readonly durationMs: number;
  readonly clashes: readonly CombatClashBeat[];
  readonly transferSteps: readonly CombatTransferStep[];
  readonly cues: readonly CombatPresentationCue[];
}

const STANDARD_CLASHES: readonly CombatClashBeat[] = [
  {
    index: 0,
    startMs: 120,
    impactMs: 330,
    endMs: 560,
    transferStartMs: 350,
    transferEndMs: 630,
  },
  {
    index: 1,
    startMs: 570,
    impactMs: 760,
    endMs: 990,
    transferStartMs: 780,
    transferEndMs: 1060,
  },
  {
    index: 2,
    startMs: 1020,
    impactMs: 1200,
    endMs: 1500,
    transferStartMs: 1220,
    transferEndMs: 1730,
  },
] as const;

const MAX_TRANSFER_STEPS_PER_CLASH = 6;

function assertPower(name: string, value: number): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`${name} must be a non-negative safe integer.`);
  }
}

function smoothstep(progress: number): number {
  const clamped = Math.min(1, Math.max(0, progress));
  return clamped * clamped * (3 - 2 * clamped);
}

function buildTransferSteps(
  input: CombatVictoryInput,
  clashes: readonly CombatClashBeat[],
): readonly CombatTransferStep[] {
  const steps: CombatTransferStep[] = [];
  let transferredBeforeClash = 0;

  clashes.forEach((clash, clashIndex) => {
    // Each bash drains roughly a third. Rounding cumulative targets instead of
    // individual portions guarantees that every point is transferred exactly.
    const targetTransferred = clashIndex === clashes.length - 1
      ? input.enemyPower
      : Math.floor(input.enemyPower * ((clashIndex + 1) / clashes.length));
    const amountThisClash = targetTransferred - transferredBeforeClash;
    const visibleStepCount = Math.min(amountThisClash, MAX_TRANSFER_STEPS_PER_CLASH);
    let lastTransferred = transferredBeforeClash;

    for (let stepIndex = 1; stepIndex <= visibleStepCount; stepIndex += 1) {
      const progress = stepIndex / visibleStepCount;
      const isLastStep = stepIndex === visibleStepCount;
      const remainingSteps = visibleStepCount - stepIndex;
      const transferredPower = isLastStep
        ? targetTransferred
        : Math.min(
          targetTransferred - remainingSteps,
          Math.max(
            lastTransferred + 1,
            transferredBeforeClash + Math.round(amountThisClash * smoothstep(progress)),
          ),
        );
      lastTransferred = transferredPower;
      steps.push({
        atMs: Math.round(
          clash.transferStartMs
            + (clash.transferEndMs - clash.transferStartMs) * progress,
        ),
        clashIndex: clash.index,
        transferredPower,
        playerPower: input.powerBefore + transferredPower,
        enemyPower: input.enemyPower - transferredPower,
      });
    }

    transferredBeforeClash = targetTransferred;
  });

  return steps;
}

function buildStandardCues(
  clashes: readonly CombatClashBeat[],
  transferSteps: readonly CombatTransferStep[],
): readonly CombatPresentationCue[] {
  return [
    ...clashes.flatMap((clash) => [
      { atMs: clash.impactMs - 35, kind: "clash" as const, clashIndex: clash.index },
      { atMs: clash.impactMs, kind: "sparks" as const, clashIndex: clash.index },
      { atMs: clash.impactMs + 45, kind: "impact" as const, clashIndex: clash.index },
    ]),
    {
      atMs: clashes[0]?.transferStartMs ?? 0,
      kind: "power-start" as const,
    },
    ...transferSteps.map((step) => ({
      atMs: step.atMs,
      kind: "power-tick" as const,
      clashIndex: step.clashIndex,
    })),
    { atMs: 1900, kind: "victory" as const },
  ].sort((left, right) => left.atMs - right.atMs);
}

/**
 * Creates the complete deterministic timeline for one engine victory event.
 * The engine contract transfers the defeated enemy's full Power to Ame; an
 * inconsistent input is rejected rather than showing misleading numbers.
 */
export function createCombatVictoryPlan(
  input: CombatVictoryInput,
  options: CombatPresentationOptions = {},
): CombatVictoryPlan {
  assertPower("powerBefore", input.powerBefore);
  assertPower("enemyPower", input.enemyPower);
  assertPower("powerAfter", input.powerAfter);
  if (input.enemyPower === 0) {
    throw new RangeError("enemyPower must be greater than zero.");
  }
  if (input.powerAfter - input.powerBefore !== input.enemyPower) {
    throw new RangeError(
      "Combat Power must be conserved: powerAfter must equal powerBefore + enemyPower.",
    );
  }

  if (options.reducedMotion === true) {
    const transferStep: CombatTransferStep = {
      atMs: 60,
      clashIndex: 0,
      transferredPower: input.enemyPower,
      playerPower: input.powerAfter,
      enemyPower: 0,
    };
    return {
      ...input,
      reducedMotion: true,
      durationMs: REDUCED_COMBAT_VICTORY_DURATION_MS,
      clashes: [],
      transferSteps: [transferStep],
      cues: [
        { atMs: 35, kind: "power-start" },
        { atMs: transferStep.atMs, kind: "power-tick" },
        { atMs: 95, kind: "victory" },
      ],
    };
  }

  const transferSteps = buildTransferSteps(input, STANDARD_CLASHES);
  return {
    ...input,
    reducedMotion: false,
    durationMs: COMBAT_VICTORY_DURATION_MS,
    clashes: STANDARD_CLASHES,
    transferSteps,
    cues: buildStandardCues(STANDARD_CLASHES, transferSteps),
  };
}

/** Returns the exact visible numbers and motion phase at an elapsed time. */
export function getCombatPresentationFrame(
  plan: CombatVictoryPlan,
  elapsedMs: number,
): CombatPresentationFrame {
  const elapsed = Number.isFinite(elapsedMs)
    ? Math.min(plan.durationMs, Math.max(0, elapsedMs))
    : 0;
  let transferredPower = 0;
  for (const step of plan.transferSteps) {
    if (step.atMs > elapsed) break;
    transferredPower = step.transferredPower;
  }

  const activeClash = plan.clashes.find(
    (clash) => elapsed >= clash.startMs && elapsed <= clash.endMs,
  );
  const complete = elapsed >= plan.durationMs;
  let phase: CombatPresentationPhase;
  if (complete) phase = "complete";
  else if (activeClash !== undefined) phase = "clash";
  else if (plan.reducedMotion || transferredPower > 0) phase = "transfer";
  else phase = "windup";

  const lastTransferAt = plan.transferSteps.at(-1)?.atMs ?? 0;
  if (!complete && elapsed > lastTransferAt) phase = "victory";

  const clashProgress = activeClash === undefined
    ? 0
    : (elapsed - activeClash.startMs) / (activeClash.endMs - activeClash.startMs);

  return {
    elapsedMs: elapsed,
    phase,
    activeClashIndex: activeClash?.index ?? null,
    clashProgress,
    clashPulse: activeClash === undefined ? 0 : Math.sin(Math.PI * clashProgress),
    transferredPower,
    playerPower: plan.powerBefore + transferredPower,
    enemyPower: plan.enemyPower - transferredPower,
    complete,
  };
}

/** Useful when an animation-frame integrator wants to emit only newly due cues. */
export function getCombatCuesBetween(
  plan: CombatVictoryPlan,
  fromExclusiveMs: number,
  toInclusiveMs: number,
): readonly CombatPresentationCue[] {
  const from = Number.isFinite(fromExclusiveMs) ? fromExclusiveMs : -1;
  const to = Number.isFinite(toInclusiveMs) ? toInclusiveMs : plan.durationMs;
  if (to <= from) return [];
  return plan.cues.filter((cue) => cue.atMs > from && cue.atMs <= to);
}
