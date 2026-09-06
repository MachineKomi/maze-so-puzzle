# PLAY-B stationary rescue preflight

Sol, 2026-09-06. Read-only review against frozen v0.22.3 source
`b834a8e6775ec024fc9f854c7a7ced8c096b6627`. This record recommends the next
bounded implementation; it is not implementation, approval, a release claim or
physical-device acceptance. No source or test command was run for this review.

## Verdict and smallest safe seam

I found no reason to withhold engineering authorization for PLAY-B after the
v0.22.3 release work completes and sole runtime ownership is explicit. The plan
is build-ready, but the animal branch cannot be changed in isolation: stationary
rescue alters traversal state, follower placement, saved-state plausibility and
the meaning of route counts.

- In `src/game/engine.ts`, resolve an adjacent unresolved animal before emitting
  movement or jump events. Ordinary contact should return one changed state and
  one `animal-rescued` event with `moved: false`, unchanged position and unchanged
  movement steps. A second input may enter the now-resolved tile normally.
- An unresolved animal at the landing beyond a hole should leave state unchanged
  and emit one truthful blocked event, with no `hole-jumped`, rescue or movement
  event. Add a narrow blocked reason in `src/game/types.ts` and user-facing copy
  in App; do not disguise the cage as a wall or change global jump distance.
- `src/App.tsx` should advance the cosmetic procession for the rescue state even
  though the engine did not move. Existing rescue presentation already opens the
  cage at the animal's world tile and keeps Ame visible at her origin. Preserve
  its 900 ms Full/Lite and 180 ms Reduced/Static final unlock; pace must not scale
  it. A still-held source uses the accepted 320/200/120 ms cadence only for its
  next post-unlock step, while a released source schedules nothing.
- In `src/game/followerTrail.ts`, add only the new follower with a stationary join
  anchor at the cage. Hide that slot under the existing rescue overlay, reveal it
  at the cage, then let its first real movement go to Ame's prior origin and into
  the existing trail. Do not recreate the procession, duplicate the new ID or
  collapse existing followers onto one point. Retain the current gather-on-load
  fallback rather than adding persisted cosmetic trail state in this slice.

## Traversal and compatibility risks

`src/game/solver.ts` currently omits rescue IDs from ordinary progression
signatures. With stationary rescue, that makes the changed rescue state appear
identical and discards the necessary rescue-then-enter edge. Rescue IDs must be
part of traversal signatures regardless of perfect-rescue mode; `avoidAnimals`
should continue rejecting newly rescued transitions. `src/game/reachability.ts`
must consume the corrected signature without raising its state budget.

PLAY-B is a global rules change for authored and generated mazes. The smallest
explicit compatibility seam is a global gameplay-rules revision included in
`src/game/contentIdentity.ts` fingerprint serialization. Old active runs should
fail closed through the existing updated-maze path, while durable progress,
unlocks, rewards and historical bests remain intact. Do not increment every
layout revision or add a save-schema field solely for this rule.

`src/session.ts` cannot merely delete its current
`collected + rescued + opened <= steps` check. Bound movement pickups by movement
steps, then retain conservative stationary plausibility: resolved stationary
objects must lie within the reachable distance envelope, opened doors must have
their derived matching key, and defeated enemies must imply the weapon. Keep
all existing identity, resource, Power, position, terrain and sorted-ID checks.
This must admit a legal zero-step adjacent rescue while rejecting remote rescues,
doors, enemies and impossible resource combinations.

`src/navigation.ts` also treats `steps > 0` as the only changed-run signal. Pass
an explicit engine-state progress flag so a zero-step rescue cannot be silently
replaced by another maze.

Finally, `src/game/metrics.ts` must report route inputs and actual movement steps
separately. A perfect route now uses one input to rescue and another to enter, but
only the latter is a movement step. Existing metric fields may remain for
compatibility only if their input semantics are stated and explicit movement-step
fields are added. Recompute ordinary and perfect routes for all sixteen authored
mazes and representative generated cohorts; do not hide a failure by increasing
solver timeouts or caps.

## Minimum verification

- Engine: rescue from all four sides; unchanged position/steps; exactly one
  event; repeated contact; turn away; resolved entry; loose pickups unchanged;
  one-to-three-hole unresolved landings blocked with no jump; resolved landing
  still legal.
- Followers/presentation: zero, one and many existing followers; no duplicate or
  collapse; cage reveal and next-step join; keyboard, board and ThumbPad release,
  hold, steering and source takeover; menu, blur and hidden cancellation; Full,
  Reduced and Static geometry.
- Solver/reachability/hints: a synthetic cage gate requiring rescue then entry;
  ordinary `avoidAnimals` remains rescue-free; perfect routes rescue all friends;
  all authored state graphs complete under current caps.
- Saves/navigation: valid zero-step adjacent rescue and existing door/combat
  cases; reload; stale-rules active run rejection with durable progress retained;
  remote/tampered stationary IDs and resource counterexamples; confirmation before
  replacing a zero-step changed run.
- Metrics/generation: record input and movement-step deltas for all authored
  ordinary/perfect routes and a bounded representative generator cohort, including
  the largest supported size and any animal adjacent to a hole-run landing.

## Proposed allocation, not approval

Proposed named allocation: **V22-PLAY-01B stationary-rescue, at most +900 bytes
of JavaScript gzip-9, with 0 CSS, public/media, decoded-image, dependency or asset
growth**. This is a review estimate, not an approved allowance. Stop and report
the measured cause before exceeding it; record the final exact delta rather than
claiming unused headroom.

Recommended engineering decisions are: use a truthful `caged-friend` landing
block; reveal the new friend at the cage and join on the next move; invalidate old
active runs through the rules fingerprint; and preserve the current presentation
timings and later physical/family acceptance gate. None requires a new Human
decision under the current PLAY-B plan.
