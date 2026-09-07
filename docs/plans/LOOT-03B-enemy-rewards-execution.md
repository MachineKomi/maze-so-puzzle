# LOOT-03 B — final-defeat Gold and Science

September7 candidate, not yet published. Live web remains0.22.19. Astra is the
sole runtime writer; Sol independently reviews. Parent authority:
[LOOT-03](LOOT-03-physical-collection-and-progression.md), latest Human execution
request and [queue](../HUMAN_REVIEW_QUEUE.md). This implements ordinary enemy
rewards first; mixed chests and the actual disguised Mimic lifecycle follow.

## Frozen reward contract — gameplay rules5

| Enemy Power | Gold | Science |
|---|---:|---:|
| 1–3 | 1–3 | 1–2 |
| 4–8 | 2–4 | 1–2 |
| 9–19 | 3–5 | 2–3 |
| 20+ | 4–6 | 2–4 |

Inclusive integer ranges. Both currencies drop at final defeat. Each roll uses
FNV-1a over the framed tuple `[5, runId, levelId, enemyId, currency]`; independent
channels cannot consume one another's RNG. A change to these tables or algorithm
requires a rules revision. Restart creates a new attempt; reload retains its
roll. Existing visible Candy Mimic is still an ordinary enemy in B and receives
this table. It does not claim the future richer disguised-Mimic contract.

The current50-enemy,16-maze campaign has an all-enemies supply envelope of
**100–200 Gold and63–116 Science**, additional to authored44 Gold/22 Science and
existing completion rewards. This is a theoretical all-enemies bound, not a
guaranteed ordinary-route award or claim that every dropped point is collected.
Maximum level potential channels is16 (Lanternlight); final Rainbow has15.
Supply is intentionally modest per encounter and does not buy Power, keys,
equipment, access or required progress. Plan10 must consume this changed Science
supply before setting future egg cadence; existing best-completion bonuses and
records remain unchanged. Tests freeze the envelope and supported generator
matrix before promotion.

## Delivery and dependencies

1. Keep rewards inside the successful pure engine defeat transaction. Resolve
   the enemy and existing immediate Power together, then scatter both channels
   against that provisional floor. Blocked/too-strong/revisited enemies award
   nothing. Solver signatures still ignore optional currency and collection time.
2. Loot ledger2 stores run identity, explicit source kind/object ID, channel keys,
   exact values and legacy-retired enemies. Reserve one pending bundle per future
   channel, including the second channel of the current defeat. Keep64 pending
   bundles and24/12 shared Full/Lite visible tokens. Prefer separate Gold/Science
   landings and coalesce value when corridor geometry or capacity is tight.
3. Active key/schema5 migrates exact v4/rules4 and v2/v3/rules3. Validate old v4's
   authored ledger before transforming; preserve grounded positions/values/IDs,
   settle accepted claims once, retire already-defeated enemies without reward.
   If a saturated historical ledger leaves insufficient new reservation space,
   coalesce only same-source grounded bundles at an existing legal landing/ID.
   No current campaign save needs this: every worst-case old ledger plus all
   potential enemy channels is below64. Never bank grounded value to make room.
   Bind ledger runId to the snapshot runId. Write5 before old-key cleanup, preserve
   protected/future/malformed bytes and denied-write originals. Reset includes all
   application-owned version keys. No save deletion/downgrade as a rollout repair.
4. The battle's pending source remains outside visual/claim admission until its
   presentation finishes. Existing Power bursts keep their typed per-bash timing.
   Afterward use the existing bounce/settle/ranged vacuum, trails, rotation,
   counters and interruption owner. Restored rewards remain grounded; no replay
   of the battle is required to preserve earned value.
5. Qualify deterministic bands, conservation/capacity, v4 mixed-phase migration,
   protection failures, unchanged puzzle routes, generated content, real browser
   defeat timing/approach/reload, Full/Lite/reduced/Static/fallback, completion
   retry and current camera behavior. Pair source-matched production movement
   against frozen19 without instrumenting qualification frame samples.
6. Sol reviews source and actual visuals independently. Update specs/backlog,
   commit/push the qualified version, use exact-head CI and the existing Git
   Vercel deployment path, then verify both public origins and real browser flows.

## Boundaries and rollback

Physical iPhone13/iPad8 comfort remains Q08/P19; local Chromium is not Apple/3GB
acceptance. B does not redesign camera/walls, add media/dependencies, implement XP,
eggs or chests, or change the16-maze order. A correction after publication must
retain schema5/rules5 reward receipts and migrations; reverting to a v4-only
writer risks abandoned new saves. Before qualification this candidate stays held.

## Artifact ownership

Reuse `dist` and installed tools. Four-file frozen19 entry snapshot in external
QA, sharing unchanged public media. Browser/trace packets remain outside the
repository and are inventoried in the [artifact ledger](../LOCAL_ARTIFACT_LEDGER.md).
No clone, media copy, native package, deletion or archive is authorized here.

## Candidate evidence checkpoint

734 tests across74 files and production build pass. Initial gzip9 JS173713
(+1302 over19); named1400-byte allocation brings the ceiling to173885, with
unchanged CSS/public/dependencies. Browser and paired performance are in flight.
No performance or publication acceptance follows from compilation alone.
