# LOOT-03 first implementation dispatch

Programme completed a read-only audit of09d5475 during0.22.16 qualification.
Astra adopts this order under the [authorized plan](../plans/LOOT-03-physical-collection-and-progression.md).
No runtime changes, tests or browser jobs were delegated; nothing below is shipped.

Deliver authored Gold/Science as one complete vertical slice, not merely slower
disposable particles: source resolution, durable ledger, claims, presentation
and completion banking. Current owner seams are `game/engine.ts` (`movePlayer`),
`game/types.ts`, `session.ts` (`sanitizeGameState`, read/write),
`vfx/RewardLayer.tsx`, `vfx/rewardPhysics.ts`, `mapNotices.ts`, `App.tsx` completion
projection and `progress.ts` receipts.

1. Pure ledger/reducers first: atomically resolve each authored source and create
   its exact integer drop amount, without simultaneous currency credit. Stable
   run/source/drop IDs, tombstones and bounded coalescing must conserve credited
   plus pending value even when the24-token visual pool is full.
2. Explicit v3 migration/conservation before enabling the writer. Current saves
   equate currency to all resolved authored treasures. Recognize the exact prior
   rules-3 content fingerprint before advancing rules identity; blindly bumping
   it would invalidate otherwise valid runs. Preserve runId, already credited
   treasures and defeated enemies, with no retroactive rewards.
3. Protect failed/future active saves. Current `readActiveRunResult` removes
   unsupported snapshots, including the schema99 case in `session.test.ts`.
   The new schema/key must preserve failed migration inputs and future bytes,
   refuse unsafe writes and never fall through into stale legacy data. This
   active-run issue is separate from Book03's protected newer **profile** store.
4. Own `grounded → claiming → credited` in semantic reducers. Minimum750ms
   admission, settled bounces and finite range follow the plan. Once accepted,
   a claim completes despite movement away. Hidden pages, interrupted rendering,
   unavailable Canvas and mode changes settle accepted claims through that same
   owner; distant grounded value survives. Reject stale run/drop callbacks.
5. Safe landing and attraction are separate: exclude hazards/pits/start/exit and
   unresolved objects, and require a legal local claim path instead of a radius
   through walls/locked doors. Jumps and portals cannot sweep untravelled space.
   Keep optional drops outside required-goal solver/hint signatures.
6. Adapt Canvas and announcements together: opening says what dropped; actual
   credit says collected. Decorative cleanup cannot erase ledger value. Share
   the finite budget with Power particles and keep gameplay input responsive.
7. Settle accepted claims into the current run before constructing/refreshing
   pending completion. Preserve `completion:${runId}`, denied profile-write
   recovery and explicit Stay. Explain optional remaining loot before deliberate
   Next/restart/maze-change abandonment.

Power remains immediate under current authority: the engine commits conserved
enemy Power, while `createCombatVictoryPlan` presents per-bash transfers. Potion
Power is also immediate. Neither becomes optional physical loot.

Campaign active runs are durable; generated/tester runs deliberately are not.
Use the same live ledger there without claiming generated reload persistence
unless recipe/run persistence is explicitly implemented and qualified.

Proof covers conservation, duplicate/stale commands, saturation, claiming versus
grounded restore, v3/fingerprint/future/malformed migration, completion/retry/Stay,
doors/hazards/jumps/portals, all comfort modes and ordinary/perfect route invariance;
then real source/pixel review and paired moving cost against the frozen predecessor.

Then final-defeat enemy Gold/Science with independent versioned RNG and bounded
Power-band tables; mixed chests and explicit disguised/revealed Mimics; recognition
XP through completion; rare eggs after usable protected Plan10 inventory. Dormant
rewardRules and old65/35 chest prototypes are not production authority. Preserve
DELIGHT-02B/LEARN-01, connected HOLE-02 and Plan08 in the wider roadmap.
