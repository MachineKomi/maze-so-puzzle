# LOOT-03 — physical collection and lasting adventure progress

**September7 implementation readiness:** [source-owner audit and first-slice dispatch](../reviews/2026-09-07-loot03-readiness.md)
identifies the v3/rules-3 migration and future active-save protections to build
before enabling physical authored-reward claims. Book/MOVE/HAZARD0.22.16 is now
[published](../reviews/2026-09-07-v02216-public-verification.md); execute A next.
The audit refines A's dependency order; it does not claim loot
implementation or introduce a new Human gate.

Execution authorized by the Human's [2026-09-06 intake](../user-playtests/2026-09-06-physical-loot-and-account-level.md).
This instruction supersedes the older presentation-only reward scope and Plan14's
ideation-only status for the bounded account-level feature below. It does not
authorize every proposed RPG system. Astra owns runtime; actual Sol independently
reviews. HAZARD-02 qualifies first, then execute these independently releasable
slices without waiting for another general execution prompt.

## Intent and actual starting point

Make each reward feel like a small physical discovery: a clear burst, tumbling
weight, two or three diminishing bounces, a readable pause and a satisfying pull
into Ame. The player should notice what dropped and choose to approach distant
loot. Delight must preserve clear movement, mathematical puzzles, safe saves,
comfort settings and frame time. Counts are real, not decorative promises.

Current `engine.ts` credits authored Gold/Science immediately. `rewardPhysics.ts`
starts homing within240ms and forces a short expiry; `RewardLayer` may be canceled
on blur, resize, jump, portal and quality changes. Its collision model only excludes
walls. None of those owners is suitable for authoritative collectible state.
`session.ts` also validates currency against collected authored objects, so adding
credits without a schema migration would invalidate legitimate saves. Power per
bash is already conserved by the battle engine and remains on that rule clock.

Sol's independent source/plan review identified these ownership and persistence
dependencies. The sequence below adopts them; it is not a claim that physical
loot, mixed chests, Mimic lifecycle or account XP is already implemented.

## A. Honest physical pickups, existing authored rewards

1. Add a bounded, versioned run-owned drop ledger, stable source/drop IDs, kind,
   exact value, safe landing and `grounded → claiming → credited` transitions.
   Resolving an authored Gold/Science source creates drops; it does not also
   credit them. Cosmetic particles never own currency or persistence.
2. Deterministically choose reachable ordinary floor around the source. Exclude
   walls, hazards, pits, start/exit and unresolved objects. Coalesce values where
   space is small; never put a mandatory pickup in danger or behind an inaccessible
   obstacle. Maintain exact value conservation with at most24 visual tokens and
   at most64 pending value bundles per run. Coalescing must preserve source IDs.
3. Start tuning at350–550ms outward travel, two diminishing bounces and a250ms
   settled interval; acquisition cannot start before750ms from emission. Apply
   broad directional spread, individual angular velocity and damping. These are
   bounded starting values to verify at actual field scale, not final Human feel.
4. Start with a1.75tile vacuum radius. Outside it, attraction is zero; within it,
   acceleration increases as distance falls. An accepted claim completes over a
   clamped250–700ms. Moving away after acceptance does not revoke that claim.
   Gameplay input never waits for animation; distant grounded rewards persist.
5. Credit only through the authoritative claim-completion reducer, exactly once.
   Reduced/Static, hidden pages, resize or an unavailable renderer settle accepted
   claims through that same reducer. Grounded drops survive those events. Persist
   semantic transitions, not per-frame coordinates. Portal/jump cannot invent a
   claim or silently lose unclaimed drops; normalize visual landing after restore.
6. Migrate current active-run v3 to a new schema/key, retaining already-credited
   authored rewards and legacy resolved enemies without retroactive awards.
   Retry, reload, campaign change and malformed/future saves require explicit
   tests. Preserve old input on migration failure; never silently reset a family.
7. Pending optional loot does not prevent a win. Completion offers the established
   Stay/Next choice and a clear remaining-loot cue; settle accepted claims before
   the existing completion receipt. Leaving intentionally abandons optional
   grounded loot, with no double bank on replay or repeated completion.
8. Polish original small Canvas glyphs: dimensional Gold star, distinct Science
   token and existing Power point, crisp silhouettes, short bounded trails and
   sparse sparkles. No emoji, big images, blur/filter stack or per-token React
   render loop. One bounded overlay clock, shared glyph cache, lower-cost Lite,
   composed static alternative. Power retains immediate per-hit rule credit;
   visual timing must not imply that a solvability-critical reward is left behind.

Acceptance: exact conservation/once-only claims and completion; out-of-range
items visibly stay; bounce/settle before attraction; safe reachable landing;
wall/door/hazard/pit/portal/jump interactions; save/reload/blur/resize and all modes;
real phone/desktop renders, long emission saturation and paired moving traces.
Take a baseline before runtime edits. Publish the qualified authored-reward slice
without claiming the additional enemy economy has shipped.

## B. Enemy reward tables, then chest and Mimic lifecycle

Use independent deterministic random channels keyed by run, level, source,
reward kind and rules version. No frame RNG or reload reroll. Freeze explicit
bounded monotonic reward tables by enemy Power band in code/tests and the design
spec; start small, measure campaign totals and adjust before qualification.

Gold/Science spawn only on final enemy defeat; Power still comes from each bash.
Legacy resolved enemies do not receive new drops. Every award uses A's drop and
completion owners. Prove best/worst totals and deterministic replay for authored
and generated mazes, including long campaigns and upgraded enemies.

Next add mixed Gold AND/OR Science chest bundles with one opening/source ID.
Use the approved closed/good-open/revealed art. Model disguised Mimics explicitly;
do not call a visible ordinary enemy a surprise chest. Benign Mimic chests use the
normal chest bundle; revealed Mimics award their richer bundle only on defeat.
Prove the Mimic table strictly exceeds its comparable ordinary enemy/chest
reward and remains solver-safe. The reveal must explain any danger before
irreversible punishment in a cosy child-facing game. Plan09 owns ecology/ranges;
do not expand to24 mazes simply to demonstrate this mechanic.

## C. Rainbow XP crystals and account-level recognition

The Human explicitly requested holographic crystals and persistent player/account
levels. Implement a small recognition feature, not combat stats or a new skill
tree. Default policy: levels recognize adventure and unlock presentation, while
per-maze Power puzzles retain their existing mathematics. [Q03](../HUMAN_REVIEW_QUEUE.md)
records the optional direction check; no answer is needed to build that default.

Add the next profile schema at the established profile key, with fail-closed old
build behavior and a migration preserving all discoveries, achievements, settings
and receipts. Crystals enter A's ledger; run XP banks through the established
completion receipt exactly once, rather than writing profile XP on each particle.
Document retry/leave/banking semantics in the UI and spec. Choose an explicit,
bounded, auditable level curve and qualification totals; show current level,
progress and a restrained level-up celebration in Book/completion. Render a small
original rainbow-faceted crystal whose silhouette remains distinct in grayscale.

## D. Very rare friend eggs with a usable durable home

Rare egg rewards require Plan10's protected visible inventory/queue and ownership
before enabling the drop table. An egg may never appear as an unbankable tease or
be lost because Garden is unfinished. Implement the minimal usable egg inventory
and existing completion ownership, then add a documented very-low chest chance,
duplicate policy, capacity behavior and deterministic save-safe outcome. No second
hidden species lottery. Default is to wait for that usable ownership, not to make
invisible stockpiles; Q06 lets the Human steer timing without blocking A–C.

## Following dependencies and delivery discipline

After the reward foundation and high-impact reward slices, resume DELIGHT-02B
collection/victory celebrations, LEARN-01 readable reasoning, then remaining
campaign/Garden/co-op and release roadmap. Account recognition does not imply
learning outcomes; educational success still needs family observation. Preserve
Plan09's32friends/12guardians and Plan10's explicit ownership contracts.

Each slice gets source tests, real rendered independent Sol review, performance
and save qualification, meaningful commit/push and one qualified Git deployment.
Claude is optional bounded advice. Keep unresolved Human beauty/device/feel items
in the queue; never invent agreement. Record artifacts in the local ledger, retain
failures, and use the Vercel docs-only guard for closure. No deletion or archiving
without explicit approval. Neither compilation nor headless browser evidence
constitutes Windows/iPad release acceptance.
