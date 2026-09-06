# V22-PLAY-01 — player pace and stationary cage rescue

Prepared 2026-09-05 by Astra from PT45/PT48 and current repository inspection.
Status: build-ready bounded brief; implementation and independent review pending.

Current authorization, 2026-09-06: PLAY-A is complete in published v0.22.3
`b834a8e`; do not rerun it. PLAY-B is authorized to actual Sol in isolated
`C:/GameDev/maze-game-play-b` / `codex/v22-play-b`, starting `c77e7d7`.
Astra independently reviews. [Sol preflight](../reviews/2026-09-06-play-b-sol-preflight.md)
is incorporated into the implementation contract. Candidate cap: at most +900
gzip9 JS / zero CSS, public/assets/decoded-image/dependencies against v0.22.3;
record exact measured allocation and request review before exceeding the cap.
Old active runs must fail closed with clear updated-maze copy if the rules
fingerprint changes; durable progress/history/unlocks remain. Stop and report
any authored/generated cage with no legal adjacent rescue approach; do not
silently weaken jump legality, solver limits, or save plausibility.
Sol is the proposed sole runtime writer; Astra reviews each seam before promotion.
The newly received v0.22.1 iPad movement failure puts V22-PERF-02 ahead of this
brief in the runtime queue. Pace is not a substitute for fixing movement lag.
Read the current [joint state](../JOINT_ORCHESTRATION_STATE.md), rather than
assuming a dated source SHA is still the checkout. Start after ART-HOTFIX-01's
accepted checkpoint. Physical playtesting remains open but does not block this
work under the Human's latest continuation instruction.

## Outcome and scope

Alex needs time to steer, Amelia needs a comfortable middle pace, and an adult
tester wants to move quickly. All three should solve exactly the same puzzles.
Separately, rescuing a friend must keep Ame beside the cage, like a door or
battle, instead of overlapping the captive and cage artwork.

Deliver two independently reviewable commits/seams:

1. **PLAY-A: Chill / Regular / Zippy**, with one shared input/travel policy.
2. **PLAY-B: stationary adjacent rescue**, with consistent rules, presentation,
   solver, route metrics and save compatibility.

No new characters, controller system, zoom, audio overhaul, hole redesign,
campaign expansion, loot economy or broad UI rewrite. Preserve the approved
desktop/iPad composition and the accepted R1 live-input fixes. Later Plans
08/02/05 consume these seams; V22-HOLE-01 separately changes crossing depth.

## PLAY-A — acceptance contract

- Exactly three modes: **Chill**, **Regular** (default), **Zippy**. Initial tuning
  proposal is 320 / 200 / 120 ms per ordinary tile respectively, versus the
  inspected 160 ms baseline. These are engineering starting values, not claimed
  family acceptance; adjust from actual travel inspection before publication.
- A deliberate first input is acknowledged immediately in every mode. The first
  tile and held tiles use the same selected ordinary travel cadence; do not
  reintroduce a quick first hop followed by a keyboard-repeat pause.
- One policy feeds keyboard, board tap/drag, ThumbPad and later controller
  consumers. Late callbacks attempt at most one due action; no catch-up queue.
  Changing pace does not change tile legality, Power, step counts, rewards,
  solver paths, content fingerprints or difficulty.
- Expose a compact, labelled cycle control with its current value in the existing
  gameplay controls/settings surface. Keep it discoverable without obscuring the
  thumb pad or shrinking the maze. Keyboard activation and accessible value
  announcement must work. Do not generate a new icon or redesign navigation.
- Persist as a comfort preference separate from campaign progress. Missing,
  malformed or unknown values safely use Regular; denied storage still permits
  in-memory use and follows the existing preference save-failure convention.
  Reset Progress does not reset pace.
- An in-flight segment finishes with its captured duration. A pace change cannot
  teleport the actor/camera, reschedule elapsed ticks, or replay old intent.
  Apply the new policy to subsequent accepted steps; clear stale input on settings
  entry/exit using the existing menu lifecycle. Do not change pace automatically
  in response to quality, motion or a selected character.
- Full, Reduced and Static keep the same intended input cadence. Special
  interaction/cinematic durations retain their own accessible contracts, rather
  than scaling every effect, sound and jump with the pace multiplier.
- Actor, camera and followers remain coordinated, including turns and reversals.
  Audit the fixed `MAX_TRAVEL_LAG_MS` against Chill: it must not silently speed up
  the deliberately slower single tile. Keep the existing bounded travel owner;
  do not add per-frame React updates or a second animation scheduler.

Current seams: `src/movementControls.ts`, `src/tileTravel.ts`,
`src/ui/game/useSceneTravel.ts`, App's ordinary duration refs and all three held
repeat schedulers; `src/motion.ts`, `src/ui/PresentationProvider.tsx` and the
existing settings/controls surface. Audit current callers before changing APIs.

## PLAY-B — acceptance contract

- Contact from an adjacent ordinary legal tile with an unresolved animal returns
  a genuinely changed state and one rescue event, but `moved: false`, unchanged
  position and unchanged movement-step count. Award rescue/collection progress
  exactly once. No synthetic `moved` event and no save write every animation frame.
- Open the cage and reveal its friend at the cage's world tile. Keep Ame visible
  at her origin throughout; the newly rescued follower must not be initialized
  inside her. Join the existing follower path cleanly after the reveal, without
  duplicating the friend or collapsing all existing followers onto one point.
- A released gesture ends after rescue. A genuinely held eligible gesture may
  move again only after the actual final presentation unlock; steering during
  the pause determines the next step. Turning away and entering the cleared tile
  are both valid. Menus, blur, hidden pages and source takeover still cancel safely.
- Loose consumables/equipment remain walk-over pickups. Door/combat behaviour
  remains unchanged except a directly necessary shared save-validation correction.
- A jump must not rescue a cage remotely from the far side of a pit. Audit all
  authored and representative generated rescue approaches before selecting the
  safe landing rule. Prefer blocking an unresolved occupied landing with truthful
  feedback and no rescue/jump event if another legal approach exists. If this
  blocks a required rescue route, resolve that specific content/landing dependency
  explicitly and re-solve it; do not silently enter the cage, stand on a hole,
  rescue from range or globally alter jump distance in this slice.

Current seams: `src/game/engine.ts` animal branch, App's rescue/jump sequencing,
follower trail/placement helpers, solver and reachability state signatures,
`src/session.ts`, content identity, metrics, hints and the normal saved-run fixtures.
The solver already admits stationary *state changes*: preserve that principle.
Its ordinary signature and reachability currently omit rescue IDs; ensure those
paths do not discard the newly necessary rescue-then-enter transition.

## Rules, records and saves

Pace alone does not invalidate any run. Stationary rescue changes the interaction
grammar: record a deliberate rules/content compatibility transition before
shipping PLAY-B, covering authored **and generated** levels. Current gameplay
fingerprints contain layout/content revision but no global rules revision;
generator revision is separately assigned. Choose the smallest explicit tested
versioning seam, not an untracked behavioural change behind unchanged identity.

Preserve campaign IDs/order, durable completions, unlocked mazes, friends, rewards,
currencies and historical bests. Old active runs may be resumed only with proven
compatibility; otherwise fail closed for that run with clear copy, never reset
the player's durable progress. Compare best steps only under the matching rules.
Do not add a save-schema version solely to store an unrelated comfort preference.
Audit `src/navigation.ts`: a zero-step run can still contain a newly rescued friend
or another stationary interaction. Replacement/switch protection must reflect
actual changed progress, not only `steps > 0`.

`session.ts` currently counts collected + rescued + opened objects against
movement steps, although doors are already stationary. Correct that movement-only
bound for stationary interactions, retaining the separate object/resource/Power,
position and identity validation. Add zero-step/adjacent-door/rescue saves and
tampered-state counterexamples; do not simply remove save plausibility checks.

Recompute ordinary/perfect routes, hint replay and metrics for all sixteen mazes.
Keep required paths rescue-free and perfect paths complete. Route inputs and
movement steps are distinct quantities; report both when the rule changes them.
Do not increase solver timeouts/state caps merely to hide a regression.

## Verification and publication

- Unit tests: all modes, preference fallback/storage failure, immediate first
  move, identical legal routes, no catch-up, late callback, mid-travel mode change,
  shared cadence and Chill lag budget. Engine tests cover rescue from all four
  sides, repeat contact, turning away, resolved entry, consumables and pit landing.
- Integration: normal saved runs, release/steer while a rescue is presented,
  keyboard/board/pad takeover, cancelled/hidden-page sequences, Full/Reduced/Static,
  plus cage/follower and old/current save recovery. Reuse semantic fixtures and
  solver-derived routes; do not invent unavailable authored test cases.
- Inspect visible travel at all three paces in a short corridor and frequent-turn
  route, then Zippy in a large maze with followers. Capture a bounded fresh and
  sustained comparison for input/persistence pressure. Classify desktop timings
  honestly; they cannot prove affected-iPad comfort or device performance.
- Run serial project/build, fixture, performance-contract and locked desktop
  checks. Measure each seam's gzip/public delta; there is very little JS headroom.
  Ask root for a named measured allocation before exceeding it; no blanket budget
  increase or new dependency. Art tests need only rerun if art tooling/assets change.
- Update the gameplay/design/architecture/controls contracts, metrics, PT45/PT48,
  joint state and execution prompt with exact implementation and review evidence.
  Commit/push each meaningful checkpoint. Never call an unreviewed candidate a
  release, or conflate source push with verified Vercel publication.
- After independent acceptance, make a clearly versioned playable checkpoint
  with current web **and Windows** artifacts for family testing, preserving the
  earlier v0.22.1 comparison and the separate Tessera patch receipt. Add P6 pace
  and P7 stationary rescue checks to the cumulative checklist only when playable.

## Open questions and handoff

No Human answer is required before implementation. Family pace tuning belongs
to D02 in [HUMAN_DECISIONS](../HUMAN_DECISIONS.md). Engineering owns any discovered
pit-landing/content conflict and must record its resolution before PLAY-B ships.
Do not treat absence of feedback as acceptance, or block PLAY-A on a PLAY-B issue.

Execution instruction: implement PLAY-A first in an isolated branch from the
accepted current main; return its exact diff/tests/visual evidence for Astra's
review. Then implement PLAY-B against the accepted seam, with its own save/route
evidence. A substantial unsafe seam warrants a bounded correction, not broad
rewriting of the successful UI or another art-direction approval round.

[Cumulative playtest checks](../PLAYTEST_CHECKLIST.md) ·
[Human decisions](../HUMAN_DECISIONS.md).
