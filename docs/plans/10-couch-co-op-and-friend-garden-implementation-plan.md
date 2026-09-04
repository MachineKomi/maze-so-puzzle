# Plan 10 — Couch Co-op and Friend Garden Implementation Plan

> **Human-approved future implementation plan. No implementation is authorized before Plan 09 is accepted and closed.**
>
> **Prepared:** 2026-09-03
>
> **Product direction:** Puzzlewild Post — Special Delivery Duo, Special Delivery Routes, and the Friend Garden
>
> **Plan state:** implementation-ready planning; dormant behind the post–Plan 09 gate
>
> **Execution owner:** one root integration agent, with specialist review at the gates named below
>
> **Repository effect of this document:** planning only; no code, art, dependency, asset, save, level, or existing plan changes

## 0. Executive implementation decision

Maze so Puzzle will gain an optional two-player couch mode in which Player 1 remains Ame and owns the route, camera, Bag, guardians, rescues, exit, story, and shared menus. Player 2 chooses **Ponchi** or **Melty**, flies inside Ame's current camera, collects lost mail, marks points of interest with limited postal pings, carries one real maze pickup, delivers it or playfully keeps it away, and operates aerial mechanisms in a separate six-route cooperative campaign. The existing Solo Adventure remains the default, complete, intended puzzle experience.

The shared reward is a **Friend Garden** available in Solo or Duo. Delivered mail earns Friend Eggs; Solo players may also exchange earned Science Points for Eggs. Eggs disclose a bounded, non-monetized reward bag and can hatch rescued friend species without duplicates, fruit, toys, or Science. Ame and the Courier can hatch Eggs, feed and gently carry friends, jostle fruit from a tree, and play with three fixed toys. There are no needs, punishments, races, breeding, paid rewards, daily timers, or failure states.

The Human's newest chase rule is locked: **every portable maze item makes either Courier periodically tire, slow, and stop after a deterministic 10–20 seconds of active carrying.** The stop creates a fair, funny catch window and is accompanied by original anime-style tired symbols near the Courier's head. This replaces the concept specification's expanding whole-camera Return Ribbon as the standard catch mechanic. A non-mechanical dotted return-address trail may remain as feedback; a stronger catch assist may be tested only as an accessibility option.

Implementation begins with a greybox vertical slice after Plan 09. It must prove that lost-mail cooperation, item delivery/mischief, fatigue-and-catch play, a real two-person room, and a tiny Garden are delightful and recoverable before production characters, 24 mail overlays, durable economy migration, or six finished routes are commissioned.

### Product promise

> **Ame finds the way, the Courier finds the mail, and together they bring new friends home.**

```text
Solo Adventure (complete and unchanged) ───────────────────────────────┐
                                                                       │
Ordinary maze + optional Courier ─> delivered mail ─> Friend Eggs ────┤
Science earned in Solo ────────────> optional Egg exchange ────────────┤
                                                                       v
Special Delivery Routes ───────────> mail + route completion ─> Friend Garden
```

## 1. Authority, approval, and sequence

### 1.1 Authority order for Plan 10

When Plan 10 executes, resolve conflicts in this order:

1. The Human's latest explicit instructions, including the appearance and fatigue decisions recorded in this plan.
2. The integrated roadmap plus final post–Plan 09 maintained product specifications and current runtime contracts for implemented campaign, roster, content-ecology, and platform truth.
3. This implementation plan for approved co-op and Friend Garden direction.
4. `docs/plans/10-two-player-couch-coop-mail-carrier-friend-garden-concept-spec.md` for approved rationale and detailed research where this plan does not supersede it.
5. Plans 01–09 as historical implementation records.

This plan converts the previously exploratory concept into the approved Plan 10 direction. The earlier pitch and research documents remain useful decision history; they are not parallel implementation authorities.
Planning-era roster counts, catalogue IDs, and asset assumptions never override
the final versioned Plan-09 content roster or current source. Where this plan
specifies co-op/Garden behavior for that roster, adapt the behavior to stable
final IDs rather than retaining a stale count.

### 1.2 Explicit supersessions

This plan records four intentional authority changes:

- The Human's permissive ordinary-Duo decision supersedes earlier exploratory cautions against carrying progression items. In ordinary Duo, P2 may carry eligible keys, equipment, Power pickups, and treasure through walls, doors, and hazards. Separate records protect the authored Solo challenge.
- A separately labeled, optional **Special Delivery Routes** campaign may require two players. It never gates Solo Adventure, story completion, the rescue roster, the Friend Garden, or any solo reward.
- Science gains a spendable **available balance** for optional Friend Eggs while lifetime Science discovery remains permanent. This is a Plan 10 Garden-only economy exception and must be reconciled in maintained specifications during implementation.
- The newest fatigue-and-rest behavior supersedes the concept specification's normal-play Return Ribbon that eventually expanded Snatch across the camera. Standard play uses physical slowing and a stationary catch window instead.

The newest character direction also supersedes the concept draft's old palettes and Ponchi's instruction to avoid a white body. It does **not** waive the originality gate.

### 1.3 Hard start gate

Do not begin Plan 10 implementation until all of the following are true:

- Plan 09's 24-maze campaign is implemented, accepted, reviewed, and at a known clean checkpoint.
- Final Gameplay, Story, UI, Art, VFX, Lighting, Animation, Controls/Steam Deck, Save, Solver, and Performance contracts are available.
- The root manager confirms that Plan 10 will not collide with active overhaul branches or unreviewed migrations.
- The complete post–Plan 09 project gates pass, or any unrelated failure is documented and explicitly accepted before Plan 10 begins.

No seam recommendation in this plan is permission to interrupt or expand Plans 01–09. All seams may be retrofitted after Plan 09.

### 1.4 Phase gates that remain after concept approval

The product direction is approved. These are production gates, not invitations to reopen it casually:

- Human/Amelia approval of the greybox family playtest before production content.
- Human originality and actual-size art approval for Ponchi and Melty before either is activated in runtime.
- Final audit of post–Plan 09 Science supply, replay farming, the exact expanded
  rescue roster, and the working **5 Science per Egg** price. At the current
  planning point the intended roster is approximately 31 friends; derive the
  final count from versioned authority and obtain a Human decision on reasonable
  Solo/Duo full-roster Egg cadence before durable Garden migration.
- Validator/solver approval before any dedicated Duo route is considered shippable.
- Physical two-controller and Steam Deck evidence before platform claims.
- Final family testing showing that optional mischief produces shared amusement more often than distress.

## 2. Read-first execution gate

At the beginning of Plan 10—not from this September 2026 snapshot—the implementation owner must read completely:

1. `docs/GAME_VISION_AND_DESIGN_SPEC.md`.
2. `docs/plans/00-integrated-implementation-roadmap.md`.
3. This Plan 10 implementation plan.
4. The approved Plan 10 concept specification.
5. The final Gameplay Design, Story Bible, Art Bible, UI/UX, Graphics/VFX, Lighting, Animation, Controls/Steam Deck, Performance, Architecture, asset-pipeline, release, and accessibility documents.
6. The completed Plans 01–09 and their acceptance evidence where their contracts are consumed.
7. Current source and tests for engine transitions, levels, solver, reachability, hints, campaign, progress, session, reset, input context, controller polling, viewport/camera, presentation, assets, audio, VFX, animation, and performance.
8. Every final authored maze through the debug/test routes, including early, middle, portal, Spring, poison, large/fogged, penultimate, and final campaign cases.

Record a new execution-baseline commit, package version, test count, schema versions, level roster, rescue roster, Science supply, asset budgets, and known working-tree state. Never assume the version numbers or paths named in this planning snapshot are still current.

## 3. Current-state audit and post–Plan 09 assumptions

### 3.1 Facts observed while preparing this plan

- The current package identifies itself as version `0.19.0`, with React, Vite, TypeScript, Vitest, and a Windows Tauri shell.
- Current `GameState` and `movePlayer` are Ame-only. Pickup effects resolve as part of Ame's movement transition.
- The current solver, reachability, and hint systems share the solo transition authority and assume one actor and static authored topology.
- Current active-run persistence is schema version 2 and current profile progress is schema version 4. They contain no logical seats, Courier, mail, cargo provenance, fatigue, Garden, Egg, toy, spend ledger, or separate record lanes.
- Current Science is a lifetime, non-spendable count. Plan 10 must introduce available/spent ledgers without losing that lifetime record.
- Current pointer steering controls Ame. It cannot simultaneously steer the Courier without a deliberate Duo input context.
- Plan 08 is designed around one active controller even when multiple devices are enumerated. Passing Plan 08 therefore does not prove simultaneous local multiplayer.
- The current campaign is not yet the final 24-maze Plan 09 campaign. Mail quotas, overlays, Science economics, dedicated-route placement, and roster completion cannot be finalized against today's layouts.
- Current art and performance work is moving concurrently. Production Plan 10 assets must consume the final approved Art Bible, manifest, loading, provenance, and budget contracts rather than this snapshot.

These observations justify the architecture below; they are not frozen execution facts.

### 3.2 Contracts Plan 10 expects to consume

Plan 10 should extend, not duplicate:

- the final pure solo engine and pickup arithmetic;
- stable semantic object IDs, content revisions, and fingerprints;
- the final `MazeViewport` world-to-screen transform and actor/overlay layers;
- the final structured input context, semantic actions, one-per-frame gamepad snapshot, neutral gates, and presentation locks;
- the final presentation director, typed VFX events, animation manifest, audio lifecycle, and independent MotionMode/VfxQuality recipe matrix;
- the final versioned profile/session readers and explicit reset coverage;
- the final performance harness, feature allocation ledger, cache policy, and release evidence format;
- the final 24-level campaign order, rescue roster, Science placement, solver, and debug route catalogue; and
- the final versioned content-ecology manifest: enemy/friend/theme eligibility,
  authored placements and introductions, generated-selection profiles, terrain
  regions, loading intent, and campaign/generated coverage evidence.

If any expected seam does not exist after Plan 09, retrofit it narrowly inside Plan 10. Do not rewrite the application around speculative abstractions.

## 4. Locked product scope

### 4.1 Four connected experiences

| Experience | Players | Launch scope | Relationship to Solo |
|---|---:|---|---|
| **Solo Adventure** | 1 | Existing complete 24-maze campaign | Default path; base rules, authored routes, records, and difficulty remain intact |
| **Special Delivery Duo** | 2, drop-in/out | Courier overlay on every curated Solo maze | Deliberately permissive alternate rules; separate Duo records; never required |
| **Special Delivery Routes** | Exactly 2 | Six same-camera, co-op-only routes | Optional bonus campaign; cannot be continued alone; gates no solo content |
| **Friend Garden** | 1 or 2 | One Garden, Eggs, final rescued roster, fruit, three toys | Fully usable and completable alone; Duo accelerates rewards but owns no exclusive friend |

Ordinary Duo consumes each final Plan-09 level as authored: enemy and friend
semantic IDs, encounter placement, terrain theme/region assignment, story order,
Power, and rewards do not reroll or change because P2 joins. The Courier overlay
adds its own versioned content without becoming a second campaign-ecology
authority.

### 4.2 P0 launch scope

- Ponchi and Melty, both available immediately and mechanically identical.
- Two explicit logical seats across keyboard/mouse, two standard controllers, Steam Deck plus external controllers, and qualified hybrids.
- Drop-in ordinary Duo from home or free gameplay; instant recoverable return to Solo.
- Courier camera-bound flight, mail collection, hidden-mail cooperation, three-charge Ping, one-slot cargo, Offer, Snatch, Drop, deterministic fatigue, and Postmark Boop.
- Stable authored mail overlays for all 24 curated mazes; no Surprise Maze mail.
- Separate Solo, ordinary-Duo, and Special-Delivery-Route record lanes.
- One solo/Duo Friend Garden with atomic Egg, reward, fruit, toy, and resident persistence.
- Working Science exchange, transparent bounded reward bag, no duplicate friends, and one Welcome Egg.
- Six validated Special Delivery Routes using the three approved mechanism families.
- Full reduced-motion, non-colour, non-audio, D-pad, disconnect, recovery, and single-shared-menu-authority support.

### 4.3 Deliberate non-goals

- Online multiplayer, rollback networking, remote matchmaking, trading, or user-authored mail.
- Rebalancing ordinary Solo mazes around P2 or grading Duo as lesser completion.
- Split-screen, a second map, private clues, or simultaneous puzzles in different spaces.
- A second guardian-combat or Power-reduction system.
- P1 appearance selection in this release.
- General-purpose object physics, a physics engine, destructive throwing, or unrestricted dynamic terrain.
- Garden hunger, health, aging, breeding, evolution, sadness, neglect, death, offline simulation, races, shops, crafting, daily rewards, paid Eggs, rarity pressure, or FOMO.
- Tether traversal or required tether puzzles. A simple Garden-only tether toy remains backlog research after launch.
- Multiple Gardens, Garden decoration editing, more than three fixed launch toys, or bespoke AI per friend species.
- Touchscreen two-player mode. Touch remains a complete Solo input; a single touch surface is not a safe v1 two-seat device.

## 5. Player jobs and success principles

### 5.1 Ame / Seat 1

Ame navigates the grid, chooses the route, moves the camera, reveals hidden mail covers, resolves normal pickups, uses equipment and keys, handles guardians and Power, rescues friends, activates ground mechanisms, chooses the exit, and owns shared menus. Ame should feel like the protagonist and puzzle solver—not the slow character waiting for a flying adult to finish everything.

### 5.2 Ponchi or Melty / Seat 2

The Courier flies, searches, collects mail, pings, carries and negotiates over one pickup, operates aerial mechanisms, creates harmless jokes, and participates equally in Garden play. P2 should make a meaningful choice at least every 8–12 seconds during ordinary free play and should never be reduced to a decorative cursor.

### 5.3 Family principles

- A child playing Ame can receive quiet help without losing the lead role.
- A child playing the Courier receives immediate motion, collecting, pointing, comedy, and visible competence without owning the whole route.
- Two children may tease each other, but every valuable state is recoverable and P1 can always end Duo safely.
- Neither role is labeled easy, junior, helper, or assisted. UI says **Ame** and **Courier**.
- Role swapping is supported between mazes and from the Garden pause screen, not in the middle of a live puzzle room.
- The game never scores obstruction, rewards hostage time, shames incomplete mail, or moralizes about sibling play.
- Solo and Duo completions are both valid. Record lanes describe different rules, not worth.

## 6. Ordinary Special Delivery Duo rules

### 6.1 Entering, classification, and leaving

- The title/home screen keeps **Continue/Play Solo** as the primary default action and exposes a secondary **Add a Courier** panel.
- Seat 2 chooses Ponchi or Melty before joining; both are available from first launch.
- P2 may join an active resumable curated maze only during free gameplay, never during story, a modal, guardian/pickup presentation, jump, portal, rescue, or victory.
- The first accepted Seat 2 join permanently marks that active run `Duo`, even if P2 leaves before touching anything. It can never write to a Solo best-time/move lane.
- Joining does not reset Ame or move base objects. P2 docks beside Ame with empty cargo, zero run mail collected, and three ready Ping charges. Previously authored mail remains discoverable where backtracking permits.
- P1 may choose **End Duo** from pause. The game freezes and resolves the same cargo-recovery transaction used for a disconnect, then continues the run as one player while retaining the Duo record class and undelivered run mail.
- Ordinary Duo completion advances the same campaign, story, rescue, and canonical unlock state as Solo. Dedicated Duo routes do not.

### 6.2 Camera, reveal, and flight region

Ame is the sole camera authority. P2 never pans, widens, pulls, delays, vetoes, or independently scrolls the view.

```text
courierCanInteract(cell) =
  runStatus == playing
  AND interactionContext == freeGameplay
  AND currentCameraRectangle contains cell
  AND effectiveAmeReveal contains cell

effectiveAmeReveal =
  explorationMode ? AmeExplorationReveal : every in-bounds level cell
```

- The Courier may fly through and occupy wall, closed-door, water, lava, poison, Spring-hole, portal, and guardian cells. Those cells do not affect her.
- P2's centre is clamped to the live camera rectangle with an art-defined safe inset so sprite, cargo, and head cues remain visible.
- Flying never reveals a tile, topology, object, label, secret, minimap cell, or hint fact. Unrevealed cells are non-interactive and their contents are not rendered for P2.
- When Ame scrolls or takes a portal, P2 keeps normalized screen position and is clamped into the new camera. Full motion uses a very short visual glide; reduced motion snaps. This never changes rules position later than the current fixed tick.
- During modal or presentation locks, P2 docks near Ame, both seats' held input clears, and every continuous timer freezes. No intent replays after unlock.
- When overlapping Ame, a guardian, required object, clue, or objective, P2 and cargo become partially translucent with a high-contrast outline. P2 has no collision with Ame and cannot physically block her.

### 6.3 Lost mail overlay

Mail is a Plan 10 overlay with stable IDs and its own revision/fingerprint. It is not inserted into the Solo `LevelDefinition`, does not exist in Solo, and never alters Solo collision, solver validity, content identity, or save compatibility.

| Final maze maximum dimension | Total letters | Concealed target | Visible target |
|---|---:|---:|---:|
| 10 or less | 6 | 2 | 4 |
| 11–13 | 12 | 4 | 8 |
| 14–18 | 15 | 5 | 10 |
| 19–21 | 18 | 6 | 12 |
| 22–24 | 21 | 7 | 14 |

Final placement occurs only after Plan 09 freezes all 24 mazes. A content validator must enforce unique stable IDs/cells, the quota band, approximately one-third concealed, revealed floor placement, visual breathing room, and no overlap with start, exit, pickup, guardian, cage, portal, Spring, hazard, or another letter.

- Visible letters render only inside the live camera and effective Ame reveal.
- Concealed letters begin under an obvious, nonblocking search cover such as a mat, leaf pile, cushion, or parcel cover.
- Ame reveals a cover by stepping onto its floor cell. There is no new general Search verb.
- P2 may Ping a cover but cannot reveal it. Ame cannot collect a letter; walking over one gives a small “For your Courier” response.
- P2 collects when the Courier centre is within `0.40` tile of the letter centre. Mail enters the magical satchel and does not occupy cargo.
- Slot state is exactly `concealed | revealed | collected`. It survives active-run save and Garden detours.
- Collected mail banks only at successful maze completion. Restart or abandon forfeits that run's mail; disconnect, pause, save, and Garden detour do not.
- Mail returns on every completed Duo replay so P2's role does not disappear. The result screen celebrates the amount found without a failure grade.
- Surprise Mazes receive no mail in v1.

Victory uses one atomic completion transaction:

```text
combinedMail = savedMailRemainder + deliveredThisMaze
eggsAwarded  = floor(combinedMail / 15)
newRemainder = combinedMail mod 15
```

Track delivery by level, duration, and replay ordinal. If the shortest two mazes produce more than half of all mail Eggs in observed family play, or families farm them despite preferring other levels, rebalance their repeat yield without changing already-earned rewards.

### 6.4 Postal Ping and Postmark Boop

**Ping** has three independent charges. A Ping creates a visible marker at P2's current valid board position for three unpaused seconds; each spent charge returns after ten unpaused seconds. Three quick Pings are allowed. A fourth does nothing except show the exact recharge state. Pings reveal nothing, target nothing, and never mutate a puzzle.

Every Ping combines a postal shape, outline/pattern, seat/character identity, optional label, and optional sound/haptic. Reduced-motion mode uses a static outlined stamp marker for the same duration.

**Postmark Boop** is available while empty-handed within `0.75` tile of Ame. P2's context action creates a two-second cosmetic postal reaction with a four-second cooldown; Ame can boop back with Interact. It never moves either actor, changes Power, cancels an action, or writes progress.

### 6.5 Portable-item contract

The v1 allow-list is explicit:

- Polite Sword/weapon pickups;
- Splash Boots;
- Spring Boots;
- Antidote Leaf;
- potion or other authored Power pickup;
- reusable keys;
- Gold treasure; and
- Science treasure.

P2 cannot carry walls, doors, hazards, Spring terrain, portals, guardians, cages, rescued friends, objectives, the exit, mail, or anything already resolved into Ame's Bag/equipment/Power/reward state.

P2 has one cargo slot. Taking a portable item removes its visible world instance but applies **no pickup effect**. A held key opens nothing, held Boots protect nobody, held potion changes no Power, and held treasure awards no currency. The canonical Ame pickup resolver is the only authority that applies those effects.

Every portable object has one exactly-once disposition:

```text
atOrigin | carriedByCourier | droppedAt(cell) | resolvedByAme | closedUnclaimed
```

- P2 may Take an `atOrigin` or `droppedAt` item within `0.40` tile while empty-handed.
- P2 may Offer within `0.75` tile. Ame presses Interact to accept and run the canonical pickup resolver.
- Ame may Snatch without an Offer by pressing Interact inside the current catch radius. The normal radius is wall-ignoring `0.75` tile; it becomes `1.25` tiles while the Courier is stopped with fatigue.
- Drop chooses the nearest revealed, walkable, non-hazard, unoccupied, non-objective floor cell within one tile; equal candidates use stable distance then row/column ordering. If none exists, Drop fails and cargo stays held.
- Ame wins a same-tick origin-pickup race. Lifecycle/pause resolves before either player; Ame's movement and resulting base consequences resolve before P2 Take.
- Offer, Snatch, direct Ame pickup, and explicit recovery all call the same exactly-once pickup function. No second copy of item arithmetic is allowed.
- At victory, unresolved `carriedByCourier` and `droppedAt` objects become `closedUnclaimed` and grant nothing. Restart/abandon returns all authored pickups. Garden detour and active save preserve disposition.
- P2 may therefore fetch a key from behind its own door, carry Boots over their hazard, rescue optional Science, or steal the sword. This is an intentional ordinary-Duo rule, not a solver bug.

### 6.6 Cargo fatigue: fair mischief contract

Fatigue applies to **every real portable maze item**, not only an item the engine guesses Ame needs. This keeps the rule legible, avoids leaking solver knowledge, and prevents inconsistent character behavior. It does not apply to letters, Pings, Garden Eggs, fruit, toys, friends, or empty-handed flight.

The state belongs to the item, not the avatar:

```text
CargoFatigueState
  cycleIndex
  cycleCarryTicks
  restStartTicks
  phase: normal | warning | landing | resting | recovering
  phaseTicksRemaining
  landingSegmentTicks
  landingSegmentStep
```

Use the fixed 60 Hz Duo rules clock and the project's stable seeded hash:

```text
restStartTicks = 600 +
  stableHash(rulesVersion, runSeed, levelId, objectStableId, cycleIndex) mod 601
```

This schedules the start of the stationary rest at an inclusive deterministic interval of `600–1200` active carry ticks, or exactly `10.000–20.000` unpaused seconds. The visual/physical warning begins 120 ticks before that scheduled stop. Never use `Math.random`, wall-clock time, animation completion, or critical-item classification.

| Phase | Duration | Movement | Player actions and presentation |
|---|---:|---:|---|
| `normal` | Until `restStartTicks - 120` | Constant `85/100` of normal flight | All normal actions |
| `warning` | Exactly 60 ticks / 1.0 s | Constant `65/100` of normal flight | Head cue appears; Offer, Drop, Ping, pause, and Ame Snatch remain live |
| `landing` | Exactly 60 ticks / 1.0 s | Deterministic guided interpolation to the chosen perch; translation input is ignored | No new Take; Offer, Drop, Ping, pause, and Snatch remain live |
| `resting` | 120 ticks / 2.0 s | Exactly 0% | P2 cannot translate; Offer, Drop, Ping, pause, and Snatch remain live; Snatch radius is 1.25 tiles |
| `recovering` | 60 ticks / 1.0 s | `45/100` for ticks 1–30, then `65/100` for ticks 31–60; returns to `85/100` afterward | No buffered movement replays; normal catch radius returns |

At `warning`, select a **fatigue perch** inside the current camera from the canonical current-state Ame reachability graph with the carried item inactive. A normal candidate must be revealed; reachable within at most two legal Ame cardinal actions without consuming another unresolved pickup or triggering an exit/portal; non-hazardous for current Ame; unoccupied; and not an exit, portal, Spring hole, guardian, object, or moving-wall destination. Rank by Ame route distance, then squared Courier distance, row, and column. In ordinary Duo, Ame's current cell is the guaranteed exceptional fallback even though Ame occupies it; visually dock the Courier at the registered offset while treating the cargo centre as inside Snatch range.

Dedicated routes cannot use that fallback to cross a Courier-only postal ward. Every aerial connectivity zone in which required cargo may be held must author enough fatigue-safe rest anchors that at least one lies inside the same current Courier zone, is reachable by Ame within two legal actions, and has a collision-safe straight guided segment from every valid cargo position assigned to it. The route validator checks the entire segment against wards, headwinds marked impassable, moving walls, mechanisms, and dynamic zone states. Runtime perch selection stays inside the current zone. If corrupt/unvalidated state produces no route anchor, pause and offer Reset Duo Room; never glide cargo through the barrier.

Landing is rules movement, not animation easing. On initial landing entry set `phaseTicksRemaining = 60`, capture fixed-point `landingOrigin` and `perchCentre`, set `landingSegmentTicks = 60`, and `landingSegmentStep = 0`. On each landing tick, increment `landingSegmentStep`, compute each coordinate as `origin + roundHalfAwayFromZero((perch - origin) * landingSegmentStep / landingSegmentTicks)`, then decrement `phaseTicksRemaining`. At zero, the rules position is exactly the perch and the phase becomes `resting`.

If camera, topology, Ame movement, or a route-zone change invalidates the candidate/path before that tick's movement, choose a new legal destination, set the current fixed-point position as the new origin, set `landingSegmentTicks = phaseTicksRemaining`, reset `landingSegmentStep = 0`, and consume the invalidating tick as step 1 of that new segment. The phase end never moves. On cold resume during landing, use the docked position and saved `phaseTicksRemaining` through that same reset procedure. Ordinary Duo's Ame-cell fallback always exists; dedicated routes use their validated zone anchor or pause for room reset. Presentation may smooth between rules ticks but cannot alter path legality, endpoint, rounding, or timing.

After recovery, increment `cycleIndex`, reset `cycleCarryTicks`, derive the next 10–20 second rest-start tick, and continue. Carry ticks advance only while the item is held and free gameplay is running; the resting/recovering phase timers advance on that same unpaused rules clock but do not count toward the next cycle. Pause, modal, presentation, hidden page, Garden detour, and disconnect freeze everything. Drop immediately frees the Courier's movement but preserves that item's debt, phase, and remaining ticks; re-taking resumes them. A re-take during landing recomputes origin/perch over the remaining ticks. Switching avatar or device cannot reset fatigue. Resolution, run reset, or terminal run cleanup removes it.

Persist the stable Duo `runSeed`, cycle, rest-start tick, carry ticks, phase, and remaining phase ticks. Free-flight position remains transient. On a cold resume, dock P2 beside Ame. Resume `normal`, `warning`, or `recovering` from that dock; for `landing`, recompute a perch/origin and use the saved remaining ticks with the same integer interpolation; for `resting`, place P2 at a newly selected legal perch before input and resume the saved remaining rest ticks. This normalization is deterministic and never grants a timer reset.

During warning through rest, show a small original outlined sweat drop, soft breath marks, and a tired spiral/puff at the avatar's registered `headCueAnchor`, plus a readable **Catching her breath** state beside the P2 badge. `MotionMode: full` may pop/settle the symbols gently; `MotionMode: reduced` keeps them fixed. VFX quality changes density/detail only, and even `static` retains the outlined symbol/text for the exact same rules window. No skull, injury language, distress panting, rapid flash, or effect copied from an anime or game is permitted.

The old expanding Return Ribbon does not ship as a simultaneous standard mechanic. A dotted static **return-address trail** between Ame and the tired cargo may communicate the catch opportunity but has no range or pulling authority. The vertical slice may A/B test an optional motor-accessibility **Catch Assist** that expands reach; it remains off by default and must be explicitly approved if retained.

Dedicated routes may not contain a timer or precision sequence that assumes the Courier can avoid a fatigue cycle. Solvers treat fatigue as a finite delay; room designs must remain valid at the maximum rest-start interval plus the full rest/recovery sequence.

### 6.7 Recovery and end states

On P2 disconnect, confirmed P2 **Leave**, or P1 **End Duo**, freeze at the next lifecycle boundary and invoke the same recovery transaction. Offer Seat 1:

1. reconnect or reassign the Courier;
2. **Secure satchel and continue Solo**; or
3. restart the maze.

Secure Satchel preserves run mail until normal victory, then processes all `carriedByCourier` and `droppedAt` objects in stable object-ID order through the location-independent canonical Ame pickup resolver. Every item on the Plan 10 portable allow-list must be valid through this recovery path, including a key taken from behind its own door. Each object transitions exactly once. An unexpected future/invalid object type is corrupt state: keep the game paused and require a validated run restart or an explicit migration repair. Never return such an item to an authored origin unless the ordinary recovery solver proves Ame can currently reach it.

On P1 disconnect, Seat 2 gets authority only inside the constrained recovery surface: reconnect/reassign Ame, bind the remaining device to Ame and continue Solo through the same recovery, save and return home, or restart. P2 never silently inherits Ame, camera control, story control, or shared-menu authority.

Dedicated Duo routes never offer Continue Solo. A missing seat permits reconnect/reassign, reset current Duo room, or save and return to the Duo map.

## 7. Deterministic simulation and engine architecture

### 7.1 Preserve the Solo engine

Do not put continuous Courier coordinates into the canonical Solo `GameState`. Wrap it:

```ts
interface DuoRunState {
  readonly ame: GameState;
  readonly participation: "duo";
  readonly courier: CourierRulesState;
  readonly itemDispositions: readonly PortableItemDisposition[];
  readonly mail: MailRunState;
  readonly duoMechanisms?: DuoMechanismState;
  readonly rulesVersion: number;
}
```

Recommended new pure modules, adjusted to final post–Plan 09 conventions:

```text
src/coop/types.ts
src/coop/rulesClock.ts
src/coop/duoEngine.ts
src/coop/cargo.ts
src/coop/fatigue.ts
src/coop/mail.ts
src/coop/contentIdentity.ts
src/coop/ordinarySolver.ts
src/coop/hints.ts
src/coop/duoRouteEngine.ts
src/coop/duoRouteSolver.ts
src/coop/duoLevels.ts
```

Extract one narrow `resolvePortablePickup(level, state, objectId)`-style pure function from the then-current Solo movement engine. Ame's ground pickup, Offer, Snatch, and recovery all call it. Add a default-empty context identifying relocated/inactive object IDs so the Solo engine cannot collect an authored instance while P2 holds it. Solo passes the empty context and must retain identical behavior and fixtures.

### 7.2 Fixed clock and command ordering

Courier rules use a 60 Hz fixed step and integer/fixed-point tile coordinates. Visual interpolation may run per display frame, but ranges, cooldowns, mail, fatigue, mechanisms, hatching, and persistence events use integer ticks and squared fixed-point distances.

Resolve each tick in this stable order:

1. lifecycle, disconnect, pause, leave, reset, and recovery;
2. Seat 1 movement and direct base pickup;
3. base consequences, reveal, presentation lock, and camera update;
4. Seat 2 flight integration and clamp into the new camera;
5. Offer/Accept, Ame Snatch, then one P2 cargo command;
6. mail collection, Ping, Postmark Boop, and Duo mechanisms;
7. semantic presentation events; and
8. checkpoint/profile persistence requests.

At low display rates, process at most four fixed substeps per rendered frame. After a long stall, blur, or hidden interval, discard excess elapsed time and resume neutral; never burst, fast-forward fatigue, or replay held actions.

The simulation must be isolated from whole-application React state. Flight may update one compositor-friendly Courier layer per display frame. Only semantic state changes enter React/profile state, and no save write occurs per flight tick.

### 7.3 Rules events versus presentation

The reducer emits typed semantic events such as:

```text
mail-revealed, mail-collected, postal-ping,
cargo-taken, cargo-offered, cargo-snatched, cargo-dropped,
courier-winded, courier-resting, courier-recovered,
postmark-boop, egg-cracked, egg-hatched,
fruit-dropped, friend-fed, toy-reacted,
duo-switch-changed, duo-wall-moved
```

VFX, animation, sound, and haptics consume those events and can be disabled without changing outcomes. Presentation completion never advances a rules state.

## 8. Solver, validator, and hint contracts

### 8.1 Solo authority

The final Solo solver and transition engine remain authoritative and unchanged in meaning. Ordinary Duo never changes whether a base maze is a valid Solo level. Mail has no Solo solver presence.

### 8.2 Ordinary Duo projection

Ordinary Duo needs current-state recovery and hints because unrestricted cargo can relocate a required key, weapon, Boots, Leaf, potion, Gold, or Science. Do not search continuous flight frames. Project the state to:

- Ame's canonical progression state;
- current camera/effective reveal;
- sorted portable-item dispositions;
- current cargo identity;
- deterministic End-Duo recovery; and
- any active portal/camera region relevant to Courier interaction.

Within an ordinary camera rectangle, free Courier flight is abstracted as reachability to any currently interactable point. Fatigue, Ping, Boop, mail, velocity, and animation never affect eventual solvability.

Maintain two separate proofs. The **active-Duo progression proof** permits Ame moves, Courier Take, Offer/Deliver/Snatch, and safe Drop, but excludes End Duo/Secure Satchel so ordinary hints continue to teach cooperation rather than “turn the feature off.” The **recovery-safety proof** adds Secure Satchel and proves every allowed cargo state can continue safely. Optional Gold/Science cargo produces a concise possession notice and must not displace the maintained required-path hint. Hints name role ownership plainly—for example, “Melty has the blue key. Ask her to bring it close, or catch her when she gets tired.” Cargo cannot ship until every portable fixture type passes both appropriate proofs and every state has accurate role-aware guidance.

### 8.3 Dedicated Duo solver

Special Delivery Routes use a separate finite reducer, validator, solver, and hint system shared with runtime. Model P2 by authored aerial connectivity zones and interactable anchors rather than continuous coordinates. State includes:

- Ame's canonical progression;
- Courier zone and cargo;
- ground/air stamp states;
- sorting-flap states;
- wall anchor indices;
- room checkpoint;
- effective camera/reveal; and
- route objective state.

Generous simultaneous holds may be modeled as one joint semantic action once each seat can reach its control. Dynamic walls change an authored anchor index; they never mutate an arbitrary terrain array. The shared collision query forbids a wall transition into Ame, the Courier's required anchor, cargo, a mechanism, or an invalid topology.

First prove that every initial/checkpoint state can reach victory **without** using Reset. Then prove that every other reachable room state can either reach victory or execute **Reset Duo Room** exactly back to one of those already proven winning checkpoints. Reset's mere availability does not count as proof that the authored puzzle itself is solvable. No production route may exist only because a designer played it successfully once.

## 9. Two-seat input and platform contract

### 9.1 Extend Plan 08; do not fork it

Plan 10 consumes Plan 08's final one-snapshot polling, dead zones, button normalization, input context, neutral/release gates, connection generations, focus safety, and qualified-adapter policy. It must retain a pure intermediate `NormalizedDeviceState` containing normalized axes and button edges before role interpretation. Ame's resolver converts that state to one cardinal action; the Courier resolver consumes continuous stick magnitude and combined D-pad vectors. Do not feed P2 from a Plan 08 layer that has already discarded magnitude or arbitrated one cardinal. Plan 10 replaces the single active gameplay owner with an explicit two-seat router; it does not add a second poller or put raw Gamepad indices into `App.tsx`.

Recommended pure boundary:

```ts
type LogicalSeat = "ame" | "courier";

type DeviceToken =
  | { readonly kind: "gamepad"; readonly index: number; readonly connectionGeneration: number }
  | { readonly kind: "keyboard" }
  | { readonly kind: "mouse" };

interface NormalizedDeviceState {
  readonly device: DeviceToken;
  readonly axes: readonly number[];
  readonly buttons: Readonly<Record<string, ButtonEdgeAndHeldState>>;
}

interface SeatAssignment {
  readonly seat: LogicalSeat;
  readonly activeDevice?: DeviceToken;
  readonly standbyDevices: readonly DeviceToken[];
  readonly state: "arming" | "ready" | "disconnected";
}
```

One device token maps to at most one seat and each seat emits at most one command frame per tick. P2 has exactly one movement source. P1 may retain keyboard as an explicit standby alongside one active controller, but standby gameplay actions and prompt changes are ignored while the primary is ready. If the active source disappears, the lifecycle boundary pauses before gameplay; a standby source is promoted only after neutral input and a fresh explicit claim, then becomes the sole active source. Simultaneous contradictory input can therefore never need cross-device movement arbitration. A mid-maze join may not assign Mouse to P2 if doing so would take the final P1-capable source. Gamepad `index` and `id` are not durable identity. Indices may be reused and IDs may be duplicate or unspecified. Every connection receives a generation; every join/reconnect is explicit and neutral-gated; no hardware detail is saved.

Prompt/device modality is tracked per seat. P2 moving a mouse must not replace P1's Xbox glyphs, and P1 pressing a key must not change P2's mouse prompts. The single shared DOM focus always belongs to Seat 1. P2's compact identity/leave card uses an isolated logical selection highlight and P2 actions, announced through the final accessible live-region pattern, without stealing DOM focus or moving the shared focus graph.

### 9.2 Supported seating matrix

| Configuration | Seat 1 — Ame | Seat 2 — Courier | Required behavior |
|---|---|---|---|
| Keyboard + mouse | Arrow keys or WASD; Space/E Interact; Escape Pause | Absolute board-pointer target; primary click context action; secondary click Ping; middle/side button or visible HUD action Drop | Duo disables mouse steering for Ame; leaving board brakes P2 |
| Keyboard + standard controller | Keyboard owns Ame | Unassigned neutral pad presses A to join | Each physical source dispatches to one seat only |
| Controller + mouse/keyboard | Explicit standard pad owns Ame; keyboard may be an inert P1 standby until explicitly promoted | Mouse owns Courier; visible HUD supplies every mouse action | No source feeds both actors or two P1 command frames in one tick |
| Two Xbox-style pads | D-pad/left stick grid; A Interact; final Plan 08 menu controls | Left stick free flight; D-pad eight-way flight; A context; B Drop; X Ping; Menu pause request | First explicit claim owns Ame; neutral second pad presses A to join |
| Steam Deck built-in + one external | Either explicitly claims Ame | The other explicitly joins | Never infer that built-in controls must be P1 |
| Steam Deck + two external pads | Any selected standard pad | Any other selected standard pad | Built-in/third pad may remain unassigned and inert |
| Non-standard mapping | Cannot claim unless a named adapter has passed hardware qualification | Same | Visible explanation; never guess button positions |

Use Steam Input's plain **Gamepad** template. Keyboard/mouse emulation cannot represent two independent local gamepad seats reliably. Qualification must also prove that a physical device is not double-dispatched through both a native and virtual route.

### 9.3 Join, role selection, and duplicate detection

1. P1 selects **Add a Courier** or opens the home Duo card.
2. An unassigned input source becomes a candidate only on a fresh deliberate join edge: A on a standard pad or a clear **Join with mouse** click.
3. Both players release/centre their inputs. The candidate wiggles the stick or mouse while the UI shows the intended Courier token.
4. P1 confirms the displayed pairing. If the candidate mirrors Seat 1 during calibration, reject it as a likely duplicate and show concise Steam Input/device guidance.
5. P2 selects Ponchi or Melty with their own card controls; P1 confirms starting/returning to the shared maze.

An unassigned third controller, stick drift, repeated raw ID, same-poll duplicate, or previously disconnected index cannot join or change prompts. Role prompts combine seat number, name/portrait, shape, text, and glyph rather than colour alone.

Role swap is a transaction, not a token exchange. Freeze gameplay, return all held Garden objects or recover maze cargo at an allowed checkpoint, release both seat claims, neutral-gate every source, and ask each player to reclaim the desired role. Keyboard/mouse, controller/mouse, and gamepad/gamepad swaps follow the same explicit process. Never silently put the system mouse or a stale controller generation into the other seat.

### 9.4 Movement tuning and semantic actions

P1 remains exact cardinal grid movement. Plan 10 adds `Interact` to the final semantic action set; it is used for Snatch, Garden interactions, and Duo ground mechanisms. Solo remains movement-driven unless a separately approved Solo interaction requires it.

Initial P2 tuning targets for the greybox, subject to family test:

- `0.24` radial analogue dead zone, continuously remapped to full magnitude;
- normalized cardinal/diagonal magnitude;
- about `3.5` tiles/second at standard speed;
- about `18` tiles/second² acceleration and `24` tiles/second² braking;
- low/standard/high speed preferences with equivalent reachability;
- D-pad opposing inputs cancel; combined cardinals form a normalized diagonal; any held D-pad direction deterministically overrides analogue stick flight until all D-pad directions release; and
- cargo applies the separate 85% multiplier before fatigue phase multipliers.

Controller P2 mapping:

- Left stick or D-pad: flight.
- A: contextual Take, Offer, aerial mechanism, Egg/friend/fruit/toy interaction, or Boop when empty near Ame.
- B: safe Drop while holding; otherwise Back only in P2's own panel.
- X: Ping.
- Menu: request shared Pause.
- View or the final Plan 08 secondary menu action: open the P2 identity/leave card without moving shared focus.

If P2 sends mutually exclusive cargo commands on one tick, Interact wins over Drop; Ping may coexist. P1 movement plus Interact first moves/resolves consequences, then tests the buffered Interact from the new Ame cell.

Context targeting is pure, highlighted before confirmation, and stable by distance then semantic object ID. P1 priority is offered/snatchable cargo, then a Duo ground mechanism, then the current Garden target. P2 while holding prioritizes Offer to Ame, then a mechanism accepting that cargo; Drop remains a separate action. P2 while empty prioritizes an explicit aerial mechanism, then portable Take, then Garden interaction, with Postmark Boop last. Mail collection remains automatic and never steals Interact. Inside the Garden, an already held object's action wins, followed by Egg, friend, fruit, toy, and tree targets, using stable distance/ID ties. Tests cover every ambiguous overlap.

### 9.5 Mouse flight and pointer ownership

Mouse Courier is absolute target steering, not teleportation. Convert the pointer through the final measured board rectangle and `MazeViewport` scale into world coordinates; the flight reducer approaches that target with the same acceleration and brake rules as a stick.

- While mouse owns P2, the board pointer cannot steer Ame.
- Primary click invokes the current P2 context action. Secondary click invokes Ping. Visible P2 HUD actions provide **Put down**, **Pause**, and **Courier card/Leave** as applicable; middle/side buttons may be shortcuts but are never required.
- Moving over HUD or shared UI freezes the flight target; leaving the board brakes P2 to rest at the last legal point.
- Pause/modal/story/victory restores normal UI pointer behavior and freezes P2. Mouse P2 may hover and scroll shared surfaces, but cannot activate any shared control except the explicit Pause request; shared activation shows a brief **Ame chooses** response. The mouse may still activate P2-owned role/leave controls.
- Browser blur, `visibilitychange`, pointer cancellation, capture loss, or cursor exit zeroes intent and requires a fresh edge after return.
- Pointer lock may be prototyped but cannot be required. Escape releases it and pauses safely.
- Cursor visibility, board scaling, high-DPI displays, window resize, browser zoom, and Tauri window scale require explicit tests.

### 9.6 Pause and safe UI authority

Either player may request Pause, and Pause resolves before movement or cargo. Seat 1 alone moves shared focus and confirms story, victory, route choice, Science exchange, restart, End Duo, return home, reset, and any destructive action. Seat 2 may operate only its Courier choice, accessibility settings explicitly scoped to P2, reconnect, and leave card.

The sole exception occurs while no Seat 1 source is ready: Seat 2 owns only the constrained recovery surface described in Section 6.7, with a safe default and fresh confirmation. It cannot escape into normal shared menus or gameplay. If both seats disappear, the surface remains inert until one source explicitly claims a recovery role.

Every **shared or recovery** confirmation defaults to the safe action and requires a fresh edge from the currently authorized owner—normally Seat 1, or Seat 2 only inside the constrained no-P1 recovery surface. A P2-owned card may separately accept a fresh Seat 2 edge for Courier choice, P2-scoped settings, or confirmed Leave; Leave only opens the Seat-1-owned recovery transaction while P1 remains present and cannot confirm its next choice. The press that opened any surface cannot confirm it. Story, modal, victory, presentation, scene, and role transitions clear both seats' held/edge state and advance an input-context generation.

### 9.7 Motor-accessible catch behavior

P1's Snatch Interact receives a six-tick/100 ms proximity buffer: an Interact pressed just before Ame enters the catch radius may resolve when she arrives, but it cannot survive a presentation, pause, camera transfer, or input-context generation. An optional profile preference **Auto-snatch on contact** may remove the button timing requirement; it affects only an item already carried by P2 and classifies the run no differently. It is off by default and must be described as a motor option, not an easy mode.

### 9.8 Required real-device qualification

Do not claim two-player controller or Steam Deck support until tested with:

- two Xbox pads over USB+USB, Bluetooth+Bluetooth, and mixed USB/Bluetooth;
- Steam Deck built-in controls plus one external pad;
- a docked Deck plus two external pads with built-in deliberately unassigned;
- Steam Input on/off where supported and the plain Gamepad template;
- controller sleep, disconnect, replug, transport change, index reuse, overlay, suspend/resume, and device reorder;
- simultaneous opposite P1/P2 actions proving genuine independent routing rather than mere enumeration;
- stable per-seat glyphs during simultaneous keyboard/mouse/controller input and correct per-seat haptics after reassignment/index reuse;
- P2 voluntary Leave while empty, carrying, and in every fatigue phase;
- disconnect/reassignment during Story, victory, P2 card, Offer, landing, and a shared confirmation;
- mouse-P2 Pause/recovery, high-rate pointer-event coalescing to one target per rules tick, and complete hybrid journeys; and
- touch input remaining inert for both actors while Duo is active, with no accidental background action.

## 10. Special Delivery Routes: six-maze cooperative campaign

### 10.1 Campaign shape

Ship six optional, explicitly **Two Players Required** routes in their own map/list:

1. **First Delivery** — one obvious ground/air stamp pair and a short parcel handoff.
2. **Under the Welcome Mat** — hidden-mail cooperation and an untimed relay around one postal ward.
3. **Two Sides Stamp** — generous simultaneous controls in one visible room.
4. **Turning Post** — the first rail-bound wall turn with a nearby Reset Duo Room post.
5. **Parcel Priority** — two sorting-flap states and harmless mistiming loops.
6. **Grand Delivery** — combines the learned mechanisms without adding an unintroduced verb.

Both players always occupy and inspect the same maze/chamber. There is no split view, secret second board, remote role, or “solve your own half” sequence. Camera authority remains with Ame; authored rooms may use framing and chamber transitions so both interactables stay legible.

### 10.2 Launch mechanism families

**Ground-and-air stamp pairs:** Ame stands on/activates a ground stamp while P2 reaches an aerial stamp. A generous overlap window resolves a joint action. Neither player is asked for frame-perfect timing.

**Parcel relay and sorting flaps:** P2 carries a designated parcel through aerial access while Ame changes one or two clearly labeled routing flaps. A wrong state returns the parcel to a visible safe loop or checkpoint; it never destroys or hides it.

**Rail-bound wall turns:** P2 holds an aerial handle and Ame activates its ground control. A wall changes among a small authored set of anchor positions only after collision/solver checks. It cannot crush, overlap, strand, or mutate arbitrary topology.

Postal wards/headwinds may block or slow P2 where ordinary walls do not. They require strong non-colour shapes, static direction indicators, and no implication that P2 is hurt. Base hazards remain harmless to P2.

### 10.3 Route constraints

- Every room has a visible **Reset Duo Room** action restoring players, cargo, mail, mechanism states, and walls to a validated checkpoint.
- No required timing window is shorter than a comfortable communication delay or depends on evading the maximum cargo-fatigue cycle.
- Mail is optional unless a route explicitly teaches it as the stated goal. Optional mail never blocks route completion.
- A route may use a lower mail quota than its size band for visual clarity. Mail banks only when the whole route completes.
- Leaving/disconnect does not convert the route to Solo. Save-return preserves the route checkpoint and waits for two reassigned seats.
- Completion earns ordinary Garden fruit refresh and any delivered mail, but no friend/toy is exclusive to Duo Routes.

## 11. Friend Garden product contract

### 11.1 Access and scene lifecycle

The Garden unlocks once the profile has both a first curated Adventure completion and at least one successfully rescued friend species. Its first visit introduces one Welcome Egg, which therefore always has an eligible no-duplicate Friend result. If a player completes a maze before making a rescue, home shows a gentle locked teaser pointing toward the first rescue rather than instantiating an Egg that stalls on its third crack. It uses the familiar app shell and viewport; the main maze surface swaps to one large, open, maze-like garden map.

- **Visit Friend Garden** is available from home after unlock.
- A resumable curated Solo or ordinary-Duo maze may enter via Pause. The exact active run saves first; maze cargo docks and is inert in the Garden.
- **Return to Route** restores maze state, mode, mail, cargo, and live in-memory seats. If P2 is absent, show ordinary recovery before unpausing.
- A cold reload restores state but not device claims. Players explicitly reclaim seats.
- Surprise Maze detours remain excluded until those sessions are resumable. Dedicated routes visit from their map between routes, not from inside an active room.
- The Garden camera follows Ame under the same authority/tether rules. P2 flies inside the current Garden camera and can never tug it.
- Role swap is available from the Garden pause card after both players put down held objects and neutralize input.

### 11.2 Solo parity

Ame can do every consequential Garden action alone:

- bump, pick up, set down, and gently toss an Egg;
- greet/pet, feed, scoop, carry, set down, and safely toss a friend;
- bump the tree trunk to release ready fruit;
- collect and offer fruit;
- nudge each toy; and
- hatch every eligible friend and obtain every toy.

In Duo, the Courier can do the same actions in flight and can jostle the tree canopy. P2 reaches things differently and makes them funnier; P2 is never the only way to use the Garden.

### 11.3 Egg lifecycle

At most three physical Eggs appear in the nest. Overflow is a validated mailbox count and instantiates the next stable Egg ID when a nest slot opens. An Egg cannot fall out of bounds, break incorrectly, become sad, or be lost.

An Egg requires three accepted crack actions. Bump, set-down, or gentle toss each advance one; repeating the easiest action always works. Same-tick actions resolve Seat 1 then Seat 2. The third action commits at most one reward; a later same-tick action becomes a cosmetic duet flourish.

```text
queued -> rewardReserved -> rewardCommitted -> revealed
```

The deterministic bag card is reserved atomically on the first crack. The profile reward commits exactly once on the third crack before presentation. Reload resumes that exact outcome; it never rerolls or duplicates it.

### 11.4 Transparent eight-Egg reward bag

| Category in each eight-Egg bag | Count | Result |
|---|---:|---|
| New Friend | 5 | One successfully rescued species not already resident |
| New Toy | 1 | One unowned permanent launch toy |
| Fruit Bundle | 1 | Three universal fruit |
| Science Parcel | 1 | Two gifted available Science |

- The Welcome Egg is Egg ID 1, appears only after the unlock condition above, and consumes the first bag's guaranteed Friend card.
- Deterministic shuffle repair prevents consecutive non-Friend cards across bag boundaries while an eligible rescued friend remains.
- Friend selection is a deterministic no-duplicate permutation of `rescued species - Garden residents`.
- If a Friend card is reserved while no newly rescued species is eligible, the Egg waits at its third crack for a future rescue; it does not duplicate or reroll. Explain this warmly and point back to Adventure.
- Toy cards do not duplicate until all three are owned.
- Once every final species is rescued and resident, a Friend card becomes a choice of an unowned toy or fruit—never Science. Once toys are complete, Toy cards become fruit.
- A partially consumed bag keeps its pinned rules version and order across updates.

Every stable species in the final rescue roster—ordinary animal, mythic, yokai,
fantasy, Greek/Roman, unicorn, or another explicitly approved family—is equally
eligible after its first authored Solo-accessible rescue. Each can become exactly
one resident. No family receives hidden rarity, requires an Egg before rescue,
or is exclusive to co-op, Surprise Maze luck, or a dedicated Duo route. Plan 10
validates the final Plan-09 coverage contract; it does not conceal a missing
authored rescue by making that species independently Egg-eligible.

The UI may disclose the remaining category mix. It must not use rarity tiers, jackpots, paid currency, near-miss staging, countdowns, daily streaks, FOMO, or premium Eggs.

### 11.5 Science-funded Solo Eggs

The working exchange is **5 available Science for one Friend Egg**, subject to the Phase 0 post–Plan 09 supply/farming audit and a Human tuning gate.

```text
scienceAvailable = scienceDiscoveredLifetime
                 + scienceGiftedLifetime
                 - scienceSpentOnEggs
```

- `scienceDiscoveredLifetime` never decreases and preserves the existing keepsake/statistic.
- Science Parcels increment only `scienceGiftedLifetime`.
- An exchange increments only `scienceSpentOnEggs` and mints one stable Egg in the same atomic transaction.
- Seat 1 alone confirms the exchange. Copy frames it as powering the Garden Post/Observatory, not buying a creature.
- No real money, premium currency, advertising, or purchase pressure exists.
- If the post–Plan 09 audit shows that 5 causes trivial saturation or unreasonable grind, tune the price before public migration, never by silently changing a live partially completed reward bag.

### 11.6 Residents and care

There is one resident per final rescue-friend species, derived from the versioned
final roster rather than a planning-era numeric constant. Friends have no hunger,
health, aging, sadness decay, neglect reaction, abandonment dialogue, or offline
simulation.

Greeting creates a six-second follow response. Feeding consumes one fruit, shows hearts for three seconds, and makes the friend follow the feeding player for 20 unpaused seconds. This has no stat or penalty consequence. A toss is a predetermined magical soft-bounce arc to a safe endpoint and is portrayed as enjoyable, never painful.

One deterministic fixed-tick state machine serves all residents:

```text
Idle | WanderToWaypoint | InspectPlayerOrToy | Follow | Held | Tossed | Settle
```

Every final species has an explicit validated mapping to one of three parameter
presets: **cozy**, **curious**, and **bouncy**, plus a size-safe home waypoint and
interaction bounds. At most six residents may be in any autonomous locomoting
state at once, including Wander, moving Inspect, Follow, and Settle. A player-
driven Tossed arc temporarily consumes one of those six visual-motion slots and
pauses the least-recent eligible autonomous mover; Held residents run no AI. The
rest nap, sit, watch, or inspect in place. One scheduler and one interpolation
pass own them all. Durable state stores roster, not transient positions, hearts,
follow timers, or mood. Each visit places residents at deterministic home
waypoints from a visit seed.

### 11.7 Fruit and three fixed toys

V1 has one universal fruit and one reusable tree. Each successful curated Solo completion, ordinary curated-Duo completion, or Special Delivery Route completion advances a profile refresh serial and makes an empty tree hold exactly one ready fruit. Refreshes do not stack hidden fruit. Surprise completions do not refresh it in v1.

One Ame trunk bump or Courier canopy jostle releases the fruit and atomically marks the tree `notReady`. Both players may collect/feed it. Reload cannot duplicate it.

The three permanent authored toy pads are:

- soft moon ball;
- postal pinwheel; and
- picnic cushion.

A Toy card activates one unowned pad. Toys are not sold, lost, stacked, freely placed, or used as gameplay buffs.

Each player has one Garden care-hold slot, distinct from docked maze cargo. On disconnect, scene exit, or unresolved reassignment, an Egg returns to its nest with the same transaction state, a friend returns to its safe home waypoint, fruit returns to shared inventory, and a toy returns to its pad. Cleanup is stable-ID and exactly-once.

### 11.8 Garden boundary

Residents, feeding, toys, and care never change Ame's Power, equipment, Bag, guardian arithmetic, hazards, hints, mail quota, route unlock, story access, or Solo records. The Garden is an affectionate collection/reward space, not a hidden character-progression economy.

## 12. Persistence, migrations, and transactions

### 12.1 Versioning policy

At execution, inspect the final post–Plan 09 profile/session schemas and increment from those versions. Do not assume today's profile v4 or session v2 remains current. Preserve every historical reader required by project policy.

Use discriminated active-session variants for:

```text
SoloAdventureSession
OrdinaryDuoSession
SpecialDeliveryRouteSession
```

Every reward-bearing variant embeds one common session envelope containing `profileGenerationId`, monotonically reserved `runSerial`, stable run ID, source fingerprints, and optional `pendingCompletion { id, immutablePayload, digest, phase }`. Every valid pre-Plan-10 active run migrates to the Solo variant without changing gameplay state and receives/reserves its completion identity safely. Never infer that an old run was Duo.

No reward-bearing victory is exempt from the prepared/apply/acknowledge protocol. If Surprise Mazes remain non-resumable after Plan 09, they still write a minimal completion journal/envelope before applying their normal rewards; they simply carry no Plan 10 mail or Garden-detour state. If that preparation write fails, do not apply or present a committed reward—offer Retry or an honest return without claim.

### 12.2 Profile migration

The migration must:

- preserve canonical completion/unlock/rescue history;
- preserve every old record as the Solo lane;
- add ordinary-Duo and Special-Delivery-Route record lanes without relabeling old results;
- rename/migrate existing Science history to `scienceDiscoveredLifetime` without reducing it;
- initialize gifted and spent Science ledgers to zero;
- add the bounded Garden/mail/Egg aggregate in the same durable profile;
- initialize Courier choice safely without requiring a device; and
- extend explicit Reset Progress storage/key coverage and tests.

Garden validation failure may reset only the Garden/economy extension with clear recovery copy. It must never delete campaign completion, rescues, canonical Science discoveries, or records.

Each curated level has one shared completion summary—first-completed transaction/mode, completion count, unlock/rescue/reward facts, and any campaign-wide canonical flags—plus independent optional `soloBest` and `duoBest` records. A first completion in either mode applies shared progression rewards exactly once and never overwrites the other mode's best. Historical records migrate only to `soloBest`; a later Duo result cannot degrade it, and a later Solo result cannot overwrite `duoBest`.

### 12.3 Ordinary-Duo session state

Persist:

- base level ID/revision/fingerprint and Duo-overlay revision/fingerprint;
- `duoEverJoined` and rules version;
- persisted Duo `runSeed`;
- Courier choice;
- sorted portable-item dispositions and legal dropped cells;
- cargo fatigue cycle, rest-start tick, cycle carry ticks, phase, and remaining phase ticks;
- letter slot states and in-run satchel count;
- mechanism/checkpoint state where applicable.

Do not persist device tokens, Gamepad index/ID, logical seat claims, P2 velocity, raw input, current free-flight coordinate, current Ping marker/charges, Boop presentation, animation frame, VFX, or transient Garden AI. On cold resume, P2 docks beside Ame; unresolved cargo/fatigue state resumes after explicit role claim or enters recovery.

### 12.4 Atomic completion transaction

Maze victory is one idempotent profile operation covering:

- campaign completion/unlock;
- normal Gold/Science/rescue effects;
- correct record lane;
- delivered mail and Egg minting;
- Garden tree refresh serial; and
- any achievement/reward triggered by that completion.

Reserve a monotonically increasing `runSerial` in the profile when any reward-bearing run is created. Resumable curated/Special-Delivery runs keep it in their full session; a non-resumable Surprise run keeps the minimal identity/journal only. Pair it with a profile-generation ID that changes on explicit Reset Progress. Completion identity is derived from that generation and run serial, so an older/stale run can never become a new reward after later operations.

Commit in this exact order:

1. Write the common active-session envelope (or minimal Surprise completion journal) as `pendingCompletion` with stable ID, run serial, immutable reward payload, payload digest, source mode/rules/content fingerprints, and phase `prepared`.
2. Re-read/validate the profile generation and serial, then atomically apply the complete payload and advance `lastFinalizedRunSerial`/store its compact receipt. If the same or older serial is encountered, accept only an exact matching already-applied digest and award nothing again.
3. Mark the session receipt acknowledged if the storage architecture needs an intermediate state, then clear the active session only after confirmed profile persistence.

Session cleanup must never precede confirmed profile application. No bounded receipt eviction may make a stale `pendingCompletion` eligible again: the monotonic finalized run serial remains durable for the life of that profile generation. Tests replay an old pending session after enough later runs/Garden operations to exceed any compact receipt cache.

Egg reservation, Egg commit, Science exchange, tree harvest, held-object cleanup, cargo recovery, and reset use their durable object state plus a single atomic profile mutation; if the final storage boundary requires a journal, it follows the same prepared/apply/acknowledge order. Multi-tab/storage-event conflict handling must preserve one writer or reject/reload rather than last-write-win duplicate rewards.

### 12.5 Reset and data recovery

The explicit **Reset Progress** confirmation must name that it removes campaign progress, Duo records, delivered mail, Eggs, Garden residents, toys, fruit, and Science ledgers. Accessibility/control preferences and installed assets remain outside the reset as defined by their owning plans. A fresh Seat 1 confirmation is required; no hold or rapid input is required.

Rollback or feature disablement never deletes Plan 10 data. Readers and sanitizers remain capable of preserving it while entry points are hidden.

## 13. Character, art, animation, VFX, and audio contract

### 13.1 Shared character mechanics

Ponchi and Melty are launch choices with the same footprint, fixed-point movement, flight tuning, interaction radii, `cargoSocket`, `careHoldSocket`, `headCueAnchor`, fatigue timing, animations, and accessibility settings. Character selection is identity, never difficulty or power. Exhaustive tests must prove mechanical equivalence. Ame also receives a registered `careHoldSocket` for Garden objects; maze cargo and Garden care objects are mutually exclusive by scene.

Both use the final Art Bible's elevated front-three-quarter board view, actual-size silhouette tests, safe camera inset, and approved floating-actor pivot. Exact values follow the final contract; the current Art Bible's `.50/.84` pivot and `.10` inset are planning references, not permission to bypass re-audit.

### 13.2 Ponchi — Human-locked direction

Ponchi is a tiny original Puzzlewild postling with:

- short, soft-looking **white and light-brown fuzzy fur**;
- tiny cute bat wings;
- a practical magical mail satchel; and
- a cheeky, eager postal-rascal personality.

The recommended original construction is a warm-white majority coat with asymmetrical light-brown postal patches, broad envelope-fold ears, a pear/bean body, sparse silhouette tufts, a postage-stamp-shaped tail tip, ink-smudged paws, and mint/coral postal details. Short fuzz should read through two or three grouped masses and restrained edge tufts, not photographic micro-fur. Pale fur always receives a warm-plum contour so it remains legible on bright floors.

The Human's colour choice moves Ponchi closer to a known cluster of white fantasy courier-creature ingredients, so the originality review is mandatory. Ponchi must not use a forehead pom or antenna, a large/red round nose, koala/bear facial proportions, franchise speech or “kupo,” matching costume/iconography, or a copied silhouette. Production prompts, filenames, metadata, runtime copy, and marketing must not name Final Fantasy, Moogles, or use protected reference images. Inspiration belongs in planning/research history only; production direction is expressed in original Puzzlewild terms.

If the originality gate fails, keep the completed shared Courier mechanics and redesign Ponchi. Because both choices are approved launch scope, Melty-only release requires a new explicit Human scope decision and corresponding UI/copy/DoD revision; it is not an automatic rollback. Renaming an insufficiently original design is not an acceptable fix.

### 13.3 Melty — Human-locked direction

Melty is a small magical postal girl with:

- **blonde hair**;
- **light-green eyes**;
- **bronze/light-tanned skin**;
- tiny cute bat wings like Ponchi's;
- small friendly horns;
- a cute expressive devil tail; and
- a mailbag integrated into her postal silhouette.

Her tone is cute, confident, and cheeky rather than sinister, frightening, or sexualized. A coral/plum/cream postal coat or tunic, stamp-shaped hardware, crooked grin, raised brow, forward flight, and an expressive tail can sell her mischief. Maintain exact skin, hair, and iris references across frames and lighting states, but never make tiny eye colour the only identity cue.

Melty must remain clearly separate from Ame: do not reuse Ame's flower/braid, cape/backpack silhouette, star identity, transformation motifs, or mint/lavender palette hierarchy. She is not “small Ame.” Her horns, tail, wings, postal cut, colour hierarchy, and body language must read at actual game scale. Costume and poses remain age-appropriate and non-sexualized.

### 13.4 Model-sheet and approval gate

For each character, create an original model sheet before runtime art expansion. It must include:

- front-three-quarter elevated canonical pose;
- silhouette, value, and palette keys;
- exact colour swatches, including Ponchi's two fur colours and Melty's skin/hair/eyes;
- a compact annotated turnaround/attachment sheet: wings and satchel for both; Ponchi's ears/paws/fur/tail; Melty's horns/hands/skin/hair/eyes/tail;
- neutral, cheeky, tired, and delight expressions plus wing/ear/hair/tail secondary-motion envelopes as applicable;
- `cargoSocket`, `careHoldSocket`, `headCueAnchor`, pivot, ground/contact, and safe bounds;
- actual-size proofs at the final small, standard, and large board scales;
- grayscale, colour-vision, bright/dark/busy-floor, and alpha-fringe proofs; and
- an explicit originality/rights review record.

Human approval occurs on cleaned derivatives at real game size, not generator masters. No pose family, source manifest approval, or runtime pointer changes before that gate.

### 13.5 Minimum semantic character drawings

Keep Plan 05's limited-animation discipline. The default maximum is six field drawings per avatar:

- canonical neutral hover;
- flight wing-up and wing-down;
- one strong tired/rest key pose with drooped wings/shoulders and comic, non-distressed expression;
- recovery/delight pose; and
- Postmark Boop reaction.

Cargo remains a separately registered layer attached to `cargoSocket`; carry/offer uses that overlay and pose intent rather than rasterizing every item into character frames. Garden objects attach to `careHoldSocket`, with stable z-order in front of body/behind head cues and explicit checks against wings, Ame's held equipment, Courier cargo, and UI. An actual-size proof may earn at most one additional Offer drawing per avatar through an explicit Plan 05/performance allocation and Human gate. Tired symbols are original code-native SVG/VFX anchored to `headCueAnchor`; do not bake them into only one avatar.

### 13.6 Launch art inventory

Reuse final canonical Ame, maze art, meadow/garden dressing, and rescue-friend field sprites wherever possible. New launch assets are limited to:

- Ponchi and Melty model sheets and approved runtime renditions;
- one lost-letter family and collect/reveal variants;
- one or two conspicuous search-cover families;
- Friend Egg states: uncracked, crack 1, crack 2, open shell;
- nest/mailbox;
- one reusable fruit tree and one universal fruit;
- soft moon ball, postal pinwheel, and picnic cushion;
- any genuinely new postal mechanism art for the six Duo routes; and
- typed postal, fatigue, Egg, fruit, feeding, toy, and mechanism VFX.

Do not create a Garden-exclusive pose family for every resident species. Use
final rescue-friend sprites plus deterministic transform/wrapper motion and the
three explicit personality presets; a missing bespoke pose never makes an
otherwise eligible friend unavailable.

### 13.7 VFX motion/quality matrix

Every new semantic event supports the final independent cross-product of `MotionMode(full | reduced)` and `VfxQuality(full | lite | static)` through the presentation director. Every supported combination has identical semantics/timing even when a static-quality recipe collapses the visible difference between motion modes. Required effect families are:

- mail reveal and collect;
- postal Ping;
- cargo Take, Offer, Snatch, and Drop;
- Courier warning, landing/rest, and recovery;
- Postmark Boop;
- Egg crack and hatch/reward reveal;
- fruit drop and friend-feed hearts;
- toy reaction; and
- paired switch, sorting flap, headwind, and wall-turn feedback.

Rules own all timing. Effects have bounded nodes, finite cleanup, no animated blur/filter/shadow, no rapid flashes, and one dominant readable shape. Routine mail/cargo effects should stay inside final pickup-effect ceilings. Egg hatch is one normal set piece, not a reward spectacle designed to mimic a commercial loot box.

Reduced motion replaces travel, bounce, puff, spin, shake, and hatch arcs with state swaps, short fades where permitted, and static endpoint markers. It never changes flight reach, Ping duration, fatigue, catch radius, crack count, reward, or mechanism timing.

### 13.8 Audio and haptics

Optional redundant cues may include letter flutter/stamp, Ping stamp, satchel rustle, handoff/snatch pop, gentle fatigue puff, recovery chirp, Egg tap/crack/hatch chime, fruit plop, feeding chirp, and soft toy responses. Ponchi uses original chirps/postal nonsense and never franchise vocabulary.

All sounds use the final cancellable sound-run lifecycle and global voice budget. No rule requires audio. Haptics remain feature-detected, per-seat/preferences-aware, subtle, and nonessential; a failure or unavailable actuator cannot block either player.

### 13.9 Asset pipeline and loading

Extend the final rich art catalogue/resolver and animation registry; do not create a second asset truth. Every new source receives immutable originals, append-only prompt/process history, hashes, measured geometry, rights/originality notes, approval status, variants, loading phase, and rollback pointer under the final source-record schema. Build the manifest through the approved pipeline only. Before production, add one reviewed asset table assigning every Courier, letter, cover, Egg, nest, mailbox, fruit/tree, toy, tired mark, seat token, reward category, and route mechanism a stable ID, existing `ArtFamily`, geometry class, code-native-versus-raster owner, field/optical rendition, and loading phase. Route art is capped to one reusable visual kit for each of the three mechanism families unless a separate budget/approval gate expands it.

The on-demand role panel may load exactly two small static/optical thumbnails so the choice is visible. After selection, Maze Duo loads only the chosen Courier's field/animation pack, current mail/covers, current cargo, and current route mechanisms. It does not preload the unchosen field pack, Friend Garden, full rescue roster, or all route art at title. Garden loads only after entry is requested and includes owned residents/toys, chosen Courier, and Garden props. When the first Egg crack reserves an exact reward, queue that one friend/toy/reward rendition for Tier-1 decode without revealing the result; if decode is still unavailable at crack three, show the semantic static fallback and complete the committed reward without delay. Preserve one-rendition-per-consumer and the final decoded-cache/decode-slot limits.

## 14. Accessibility and family-safety contract

### 14.1 No single-channel rules

Every essential state combines at least two of shape, text, icon, outline/pattern, position, optional sound, and optional haptic. Colour, small eye detail, animation, audio, particle travel, or controller vibration is never the only source of meaning.

Required static equivalents include:

- seat assignment and disconnected state;
- Courier/cargo identity;
- Ping charges and location;
- concealed-cover discoverability;
- fatigue warning/rest/recovery;
- Snatch/Offer range and success;
- paired mechanism state;
- Egg crack/reward state;
- tree readiness and fruit count; and
- friend-held/following state.

### 14.2 Motion, vision, audio, and photosensitivity

- Reduced motion changes presentation only and preserves exact rules timing.
- A static-mode fallback removes continuous decorative bob/wing motion while retaining readable actor position.
- P2 overlap fades/clamps inward so neither avatar, cargo, tired symbols, guardians, objectives, nor clues are obscured.
- Search covers use high contrast and pattern; an optional **Clear search spots** setting strengthens outlines without revealing the letter.
- Captions/text states cover all sound-only ideas.
- No effect uses rapid full-screen flash, camera shake, or repeated high-contrast strobe.

### 14.3 Motor access

- P2 can complete flight with D-pad; analogue precision is never essential.
- No required chord, rapid tap, stick click, long hold, or pointer lock exists.
- P2 speed, acceleration, auto-brake, and haptics are independently adjustable.
- P1 receives the short Snatch buffer and optional Auto-snatch preference.
- Egg hatching accepts three repetitions of the easiest action; throwing is optional.
- Pausing freezes every timing challenge; dedicated mechanisms use generous windows or toggle/hold alternatives approved by the solver.

### 14.4 Family recovery without moralizing

P2 may tease, carry a needed object away, and make Ame chase. P2 cannot erase, consume, sell, hide outside the camera, strand, or receive a player-facing reward for that obstruction. Fatigue creates recurring catchable rests; P1 owns End Duo; disconnect and reset recover exact state. Copy does not call P2 naughty or tell families the “right” way to play.

If repeated family testing finds distress rather than shared comedy, the first rollback is an explicit **Letters & Deliveries** ordinary-Duo rules preset in which P2 may Take only after Ame requests/marks an item. Do not silently weaken the mechanic for every family or ship a known no-tears failure because parental supervision exists.

### 14.5 Garden care safety

Friends never become hungry, lonely, sick, old, injured, abandoned, or sad because a child leaves. Tossing is magical and welcomed; no fail animation resembles impact. Random rewards are earned-only, bounded, disclosed, duplicate-protected, and free of monetization or urgency.

## 15. Performance and resource contract

Phase 0 must rebaseline final Plan 07 budgets and allocate Plan 10 explicitly in the feature ledger before public code or art grows. Current provisional references—p95 frame work near 20 ms, low-end near 33.3 ms, no gameplay task above 50 ms, and no unexplained 10-minute heap growth above 10%—do not override the final post–Plan 09 contract.

Hard architecture rules:

- Call `navigator.getGamepads()` exactly once per visible animation frame for all pads.
- Polling, normalization, seat routing, and fixed simulation must not commit the whole React application at 60 Hz.
- Courier rendering uses one isolated compositor-friendly layer and transform/opacity updates; semantic events alone enter React.
- Hidden/unfocused state stops polling/simulation and never catches up elapsed time.
- Do not write a save for position, velocity, particles, wing frames, or every Garden AI tick.
- One Garden scheduler/interpolation pass handles all residents; at most six occupy any autonomous-or-tossed locomotion slot at once.
- No rigid-body engine, timer/rAF per resident, animated filter/blur/shadow, persistent particle emitter, or unbounded DOM-per-Ping history.
- Code-split Friend Garden and dedicated Duo-route content so Solo startup does not pay their full JS/art cost.
- Load only selected/owned/current art and preserve the final decoded-cache/decode-slot budgets.

Required performance evidence includes:

- ordinary Solo baseline before and after Plan 10 flags are compiled/enabled but unused;
- ordinary Duo on small and largest/fogged/portal mazes;
- two controllers with simultaneous continuous P2 flight and repeated P1 movement;
- both MotionMode values across all three VfxQuality values under VFX stress;
- Garden with the final roster visible and six active movers;
- 20 Garden enter/exit cycles;
- 100 start/cancel cycles for each new effect family or the owning soak harness;
- title-to-first-Solo asset/network/decode comparison;
- 10-minute Duo and Garden retained-heap runs; and
- web, Windows Tauri, and qualified Steam Deck evidence against final thresholds.

## 16. Telemetry and evaluation ethics

Plan 10 instrumentation is a local debug/playtest event stream unless a separate privacy-approved analytics system already exists. Do not add network analytics, names, voice recording, video recording, advertising IDs, or child profiling as an implementation shortcut.

Use stable anonymous session/test IDs and record only product events needed to answer the design risks:

- per-seat movement/meaningful-action/idle spans;
- camera edge clamp and overlap time;
- letter reveal/collect/deliver and incomplete count;
- Ping spend/recharge/empty attempt;
- cargo Take/Offer/Snatch/Drop/recovery and item type;
- fatigue interval, phase, catch during rest, and post-rest chase duration;
- End Duo, disconnect, reset, role swap, and solver-invalid state;
- Garden actions, reward source/category, visit duration, and return-to-maze request; and
- level duration/replay ordinal and mail-Egg source distribution.

Human observation notes laughter, smiles, reciprocal communication, domination, confusion, frustration, pride, requests for help, voluntary role swapping, and desire to play another maze. Obtain parent/guardian consent for any retained notes and store no identifying media in the repository.

## 17. Required greybox vertical slice

### 17.1 Purpose

The slice must test the riskiest social loop—**a useful item in P2's hands, cooperation turning into keep-away, the Courier visibly tiring, and Ame getting a fair catch**—not merely prove that two cursors move.

It begins only after Phase 1 and Plan 09 closure. Use placeholder shapes and final system assets already in the repository. Do not wait for or commission Ponchi/Melty production art.

### 17.2 Representative content

Select one final mid-campaign maze with:

- at least two camera regions;
- a reusable key and door;
- one equipment- or hazard-gated route;
- one optional Gold or Science pickup;
- meaningful backtracking; and
- enough open floor near a required item for a chase and fatigue perch.

Overlay 12–15 placeholder letters with about one third under conspicuous placeholder mats. Force deterministic test seeds yielding 10-, 15-, and 20-second fatigue rest starts across runs.

Add one separate single-camera Duo greybox room with a ground/air stamp pair, one P2-blocking headwind, one parcel relay, and a visible Reset Duo Room post. Add a tiny non-production Garden with one three-crack Egg, one existing placeholder/rescue friend, one fruit tree, and one fixed toy.

### 17.3 Minimum implemented actions

- P1 moves, reveals a cover, uses Interact to accept/Snatch cargo, activates one ground stamp, pauses, exits, and invokes recovery.
- P2 flies, collects mail, spends/recharges Pings, Boops Ame, takes/offers/drops one real key, triggers at least one fatigue cycle, activates one aerial stamp, jostles one fruit tree, and helps hatch one Egg.
- A P2 disconnect while holding the required key proves Reconnect, Secure Satchel, and Restart.
- Players swap roles and replay the key scene.
- The slice emits the local instrumentation events from Section 16 and detects any contradictory item disposition.

### 17.4 What the slice may fake

- Courier art is a winged circle/triangle with a visible cargo socket and name label.
- Tired symbols are simple original vector primitives.
- Mail placement and the one Duo room may be debug-only data.
- Egg/Garden state may live in a disposable prototype profile; no shipping migration is allowed before the continuation gate.
- VFX/audio may be minimal or absent if static state is fully legible.

It may not fake the real item pickup resolver, camera/reveal predicate, fixed fatigue timing, safe perch, Snatch, disconnect recovery, or exactly-once item state. Those are the risky proof.

## 18. Family playtest protocol and decision gates

### 18.1 Primary 15–20 minute session

Use Amelia and a parent as the primary creative session, then repeat with at least one additional parent/child or sibling pair before production approval.

1. Give only the one-line promise and a small control card. Do not teach the intended joke.
2. Play the ordinary maze for 5–7 minutes. The adult playing Courier should once help sincerely and once take a tempting key without saying whether it will be returned.
3. Let Ame negotiate, chase, catch during fatigue, or use a handoff. Do not force recovery unless needed.
4. Play the cooperative greybox room for 3–5 minutes.
5. Visit the Garden, crack one Egg, release fruit, and feed the friend.
6. Swap roles and replay the key/hidden-mail section for 3–4 minutes.
7. Ask each player separately: What was your job? What was funniest? What was annoying? When did you need the other player? Which role would you choose next? Would you play another maze?

Run one separate short accessibility pass with reduced motion/static cues and D-pad-only Courier flight. If Auto-snatch is being considered, test it as a named alternate condition rather than silently changing the primary run.

### 18.2 Quantitative success thresholds

Proceed to production only if:

- median time between P2 meaningful choices is at most 12 seconds during free play;
- P2 idle time is below 25%, excluding story/presentation locks;
- both roles initiate at least two reciprocal communications in the ordinary maze;
- both players perform a distinct essential action in the Duo room;
- every item/chase/disconnect path yields zero soft locks, duplicates, lost items, or solver-invalid states;
- the 10-, 15-, and 20-second fatigue seeds all create a realistic catch chance without making ordinary delivery laborious;
- catch occurs during or shortly after at least half of deliberate keep-away fatigue windows when Ame chooses to pursue;
- camera-edge conflict produces no more than two verbal complaints in a session;
- no player reports “P2 ruined it” as the dominant impression in either required family session;
- Garden interactions are understood without fear of hurting, neglecting, or losing a friend; and
- at least one player asks to hatch another Egg or play another maze.

### 18.3 Stop/change thresholds

Do not proceed unchanged if:

- distress, argument, or deliberate withdrawal follows keep-away in two sessions;
- P1 repeatedly stops solving merely to service P2's camera needs;
- P2 spends more than 25% of free play with no understood goal;
- tired cues are missed or mistaken for injury;
- the safe perch feels like visible teleportation or places cargo outside a fair approach;
- any MotionMode × VfxQuality condition communicates different catch timing;
- mail feels like cleanup rather than discovery;
- Garden rewards overshadow maze play or create pressure to farm; or
- players enjoy only the dedicated room, showing the overlay is not independently lovable.

### 18.4 Result-to-decision table

| Observed result | Product decision |
|---|---|
| Mail and mischievous cargo both land | Continue with full approved ordinary-Duo scope |
| Mail lands; keep-away repeatedly harms play | Ship cargo behind a selectable Letters & Deliveries preset or restrict Take to Ame-requested items |
| Cargo lands; mail feels like chores | Reduce quotas and make covers/collection more expressive before 24-maze authoring |
| Fatigue makes pursuit funny and fair | Keep it as sole standard catch closure; retain only visual return-address trail |
| Catch still requires excessive motor precision | Approve/tune optional Auto-snatch or Catch Assist; never widen standard range silently |
| P2 engages only in the Duo room | Prioritize dedicated routes; do not claim the overlay alone is shippable |
| Garden creates “one more maze” desire | Preserve reward cadence and simple care scope |
| Garden creates farming/reward anxiety | Slow Egg cadence and strengthen direct/disclosed reward presentation |
| Camera clamp is the main frustration | Tune docking/framing before adding any P2 verbs or production content |

The largest remaining uncertainty is social, not technical: **does stealing a useful item produce warm, negotiated mischief often enough to justify the frustration it can produce?** The forced-fatigue key scene is the cheapest honest test.

## 19. Phased implementation sequence

Relative sizes below are planning bands, not calendar commitments. Each phase ends in reviewable evidence and a checkpoint. Shared engine, schema, and UI work should land sequentially under one root integration owner; specialist art/content work begins only after its named gate.

```text
Plan 09 accepted
      ↓
0 Re-audit/freeze
      ↓
1 Pure seams + Solo invariance
      ↓
2 Greybox vertical slice
      ↓
3 Human family-play continuation gate
      ↓
4 Production Duo core + two-seat controls
      ↓
5 Atomic persistence/economy
      ↓
6 24 ordinary-maze mail overlays + product UI
      ↓
7 Approved Courier/presentation art
      ↓
8 Friend Garden
      ↓
9 Duo reducer/solver first, then six routes
      ↓
10 Integrated qualification, docs, release decision
```

### Phase 0 — Post–Plan 09 re-audit and authority freeze (`S`)

**Work**

- Execute the read-first gate and record final baseline.
- Play/audit all 24 mazes, every pickup/hazard/portal/Spring/rescue/victory path, every relevant menu, and final controller flows.
- Inventory final profile/session versions, storage keys, reset behavior, Science
  sources/replayability, versioned rescue roster and authored Solo coverage,
  content ecology, viewport/presentation/input/art/performance contracts, and
  current platform status.
- Model time and completions required for first Friend, several meaningful
  Garden visits, and the exact full roster through Solo Science and ordinary-Duo
  mail. Recalculate against the approximately 31 intended friends at this
  planning point and the exact final roster at execution; do not extrapolate the
  planning-snapshot cadence or create a hidden grind.
- Reconcile the approved Science spend exception and co-op-only route exception in maintained product authority without editing Plans 01–09.
- Pin Plan 10 rules/content version identifiers and local feature boundaries.

**Exit gate**

- Root review accepts a contradiction-free audit, affected-file map, migration
  strategy, final roster/coverage proof, Science model, completion-cadence model,
  and clean checkpoint.
- Human review confirms the working 5-Science price, mail-to-Egg cadence and
  fixed 5/1/1/1 reward bag—or explicitly changes them—before any durable Garden
  write. Expanding the roster alone is not permission to alter an approved
  reward rule silently.

### Phase 1 — Pure contracts, flags, and Solo invariance (`M`)

**Work**

- Add local build/runtime boundaries: `duoCore`, `duoCargo`, `friendGarden`, and `duoRoutes`.
- Define pure Duo types, fixed clock, fixed-point position, command order, seat-neutral actions, content versions, item dispositions, cargo fatigue, and validators.
- Extract the one canonical portable-pickup resolver and inactive/relocated-item context.
- Add no-op Solo adapters and golden fixtures across all final pickup types and representative mazes.
- Establish isolated Courier render/update boundary without shipping entry points.

**Exit gate**

- Flags off and flags-on-with-no-P2 produce identical Solo engine states, saves, hints, records, frames within owned presentation differences, performance, and test results.
- No profile migration or production asset is added.

### Phase 2 — Greybox vertical slice (`L`)

**Work**

- Implement two logical seats for the supported prototype pairings.
- Add placeholder camera-bound flight, mail/reveal, Ping, cargo, Offer/Snatch/Drop, exact fatigue/perch/rest, Boop, and recovery on one representative maze.
- Implement one reducer-backed Duo room and tiny disposable Garden.
- Add local instrumentation and deterministic seeds.
- Run automated state, refresh/reconnect, reduced-motion/static, and performance smoke tests.

**Exit gate**

- The slice meets technical no-soft-lock/no-duplicate invariants and is ready for the family protocol.

### Phase 3 — Human continuation gate (`Gate`)

**Work**

- Run Amelia-and-parent and one additional family pairing, including role swap and reduced/D-pad pass.
- Review local metrics and observations against Sections 18.2–18.4.
- Confirm standard fatigue without whole-camera Ribbon, optional motor assists, mail count direction, and whether permissive Take stays default.

**Exit gate**

- Human records **continue**, **revise and retest**, or **defer Plan 10**.
- No production character, 24-overlay authoring, profile economy migration, or six-route content begins without continue.

### Phase 4 — Production ordinary-Duo core and input (`XL`)

**Work**

- Complete the two-seat router across all supported pairings, explicit join/calibration, role card, neutral gates, input ownership, P1 Interact, pause authority, and disconnect/reassignment.
- Productionize the pure Duo reducer, flight/clamp/visibility, cargo provenance, fatigue, safe perch/drop, End Duo, Secure Satchel, and semantic events.
- Add the ordinary-Duo projected solver/hint/recovery model for every portable item type.
- Integrate final viewport, UI context, presentation locks, and isolated Courier layer.

**Exit gate**

- Every ordinary cargo state has an actionable accurate hint and deterministic recovery.
- No input configuration lets one physical event control both seats or Seat 2 confirm shared/destructive UI.
- All Solo regression and performance gates pass.

### Phase 5 — Versioned persistence and Garden economy core (`L`)

**Work**

- Add next-version profile/session discriminated migrations using final post–Plan 09 versions.
- Split record lanes while preserving canonical completion.
- Add profile-generation/run-serial completion identity, immutable pending-completion payloads, compact receipts, Duo sessions, cargo/fatigue/mail persistence, and reset coverage.
- Add Garden aggregate, Science lifetime/gifted/spent ledgers, bounded reward-bag engine, Egg transaction state, and corruption sanitizers behind hidden/debug surfaces.
- Inject crash-window and old-profile fixtures.

**Exit gate**

- All migrations are monotonic and idempotent; every simulated interruption awards exactly once.
- Garden corruption cannot erase campaign/rescue/Science history.
- Feature flags off preserve but do not expose new data.

### Phase 6 — Ordinary-Duo product and 24 mail overlays (`L`)

**Work**

- Author/validate stable mail overlays for all final curated mazes after layout freeze.
- Add home Add-a-Courier, in-maze join, role choice, P2 HUD, mail meter, result conversion, Duo records, End Duo/recovery, onboarding, and clear Solo/Duo mode language.
- Add completion-only banking, replay attribution, the exact `first curated completion AND first rescued species` Garden/Welcome-Egg trigger and onboarding teaser, and no-Surprise-mail behavior.
- Run each overlay through automated validators and geometry/play audits at final viewports using approved proxy bounds. Placeholder/proxy art cannot satisfy final visual acceptance.

**Exit gate**

- All 24 Solo levels remain byte/fixture-equivalent in Solo.
- All 24 Duo overlays have legal quotas, reveal/collect paths, stable identity, no critical obstruction, and complete save/replay tests. Final art-density/readability acceptance remains a Phase 7 gate.

### Phase 7 — Ponchi, Melty, and presentation integration (`L`)

**Work**

- Produce original model sheets, palette/silhouette/actual-size proofs, and rights/originality records.
- Obtain Human approval for both; only then build approved field renditions and limited semantic frames.
- Register cargo/care/head anchors, mail/covers, Ping/cargo/fatigue/Boop VFX, audio, haptics, prompts, and the complete motion-mode × VFX-quality recipe matrix.
- Add catalogue/source records, generated manifest, loading phases, hashes, budget ledger, and rollback pointers.
- Repeat final visual audits of all 24 mail overlays with approved production letters/covers and every required motion/quality combination.

**Exit gate**

- Mechanical-equivalence tests pass.
- Both characters read at all target sizes/terrains and pass originality, accessibility, clipping, alpha, load, memory, and rollback checks.
- If Ponchi fails originality, shared mechanics/saves remain intact while Ponchi is redesigned; any Melty-only release waits for a new explicit Human scope decision.

### Phase 8 — Friend Garden scene (`XL`)

**Work**

- Implement Garden scene lifecycle, home and pause entry/return, seat memory/reclaim, camera, safe bounds, and role swapping.
- Implement Egg physical states, transaction-backed hatching, reward reveal, mailbox/nest, Science exchange, residents, deterministic waypoint AI, care holds/cleanup, fruit/tree refresh, and three fixed toys.
- Integrate final roster sprites and minimal new Garden assets, UI, VFX/audio,
  all six MotionMode × VfxQuality combinations, and solo parity. Allocate every
  final species a deterministic size-safe home waypoint, interaction bounds and
  one of the three shared personality presets.
- Run exact-final-roster geometry/crowding/loading/decode and six-mover
  performance checks plus enter/exit, reload, reset, and care-safety tests.

**Exit gate**

- Every Garden reward/action is achievable Solo and Duo.
- No object, Egg, reward, friend, fruit, or Science can duplicate, reroll, disappear, or affect maze power.
- No care language or state implies neglect/failure.

### Phase 9 — Duo-route rules, proof, then six routes (`XL`)

**Work**

- Implement shared runtime/solver mechanisms first: stamp pair, relay/sorting flap, headwind/ward, wall anchors, checkpoints, and Reset Duo Room.
- Complete exact finite validator, solver, and role-aware hint ladder.
- Only after reducer/solver acceptance, author the six route packets in teaching order with stable content IDs and route records.
- Conduct design, accessibility, recovery, performance, and family playpasses on every reachable mechanism state.

**Exit gate**

- Validator proves every reachable room state wins or resets.
- Every route is understandable, same-camera, two-person, non-precision, no-soft-lock, and complete without granting an exclusive Garden reward.

### Phase 10 — Integrated qualification and release decision (`L`)

**Work**

- Run the full automated, migration, content, solver, visual, accessibility, performance, art-pipeline, web, Tauri, and hardware matrix.
- Repeat family sessions on production content with child-as-Ame, child-as-Courier, two-child, and role-swap pairings where available.
- Tune mail/Science/Egg cadence from observed behavior without changing earned state.
- Finalize maintained specs, controls guide, README, architecture, release checklist, test evidence, originality records, and rollback runbook.
- Stage flags in the order ordinary Duo → Garden → Duo Routes, with explicit go/no-go for each.

**Exit gate**

- Every Definition of Done item in Section 25 is evidenced.
- Human approves release scope and any disabled subfeature is honestly absent from product copy.

## 20. Definitive shipping interaction matrix

Unless a dedicated-route row explicitly overrides it through its validated mechanism reducer, these rules are exhaustive and deterministic.

| Existing element | Ordinary Special Delivery Duo | Special Delivery Routes | Friend Garden / Solo consequence |
|---|---|---|---|
| Ame movement | Existing exact grid transition | Existing grid transition plus validated ground mechanisms | Existing grid-style Garden movement; no campaign effect |
| Camera boundary | P1 alone moves camera; P2 clamps to inset | Same; rooms may use authored framing | Same; Garden follows Ame |
| Normal walls | P2 flies through/over | Fly-through unless tagged postal ward/headwind | Garden boundaries clamp; dressing is non-destructive |
| Closed doors | P2 flies through; cannot open door | Route definition may use a specific validated mechanism | No doors grant campaign state |
| Fog/unrevealed cells | P2 cannot render, reveal, inspect, Ping into, or interact | Same | Garden uses normal scene visibility; no campaign reveal |
| Visible letters | P2 alone collects at 0.40 tile | P2 collects unless tutorial goal says otherwise | Mail progress visible; no Garden letters |
| Hidden covers | Ame step reveals; P2 may Ping but not open | Same unless explicit route objective | None |
| Keys | P2 may Take/carry/Offer/Drop; no effect until Ame resolution | May be a required relay; validator owns state | Garden cannot use/consume maze keys |
| Door use | Ame's canonical key/door rule only | Ame or a validated route mechanism only | None |
| Weapon / Polite Sword | P2 may carry; no Power effect | Same if authored | Garden gives no combat bonus |
| Potion/Power pickup | P2 may carry; arithmetic applies only on Ame resolution | Same if authored | No Garden Power |
| Splash Boots, water, lava | P2 harmlessly crosses; may carry Boots; Ame rules unchanged | Same unless postal ward adds P2-only barrier | No hazard immunity reward |
| Antidote Leaf, poison | P2 harmlessly crosses; may carry Leaf; Ame rules unchanged | Same | None |
| Spring Boots, holes/jumps | P2 flies across and may carry Boots; cannot trigger Ame's jump | Same | No Spring behavior |
| Portals | P2 cannot activate; Ame portal moves camera then clamps P2/cargo | May be used only if reducer/solver models both zones | No cross-scene carry |
| Guardians/enemies | P2 may overlap visually but cannot weaken, distract, tickle, target, move, or resolve | No combat-support exception in v1 | Friends/Garden confer no combat effect |
| Gold/Science treasure | P2 may carry; awards only when Ame receives | Same | Science available may be exchanged by P1 in Garden UI |
| Cages/rescued friends | P2 cannot open, carry, or rescue; Ame owns resolution | Same | Rescued species becomes eligible for a no-duplicate resident |
| Objective/exit | P2 cannot collect, move, or trigger; Ame chooses finish | Both roles satisfy route objective; exit commits only valid solved state | Garden exit/Return is a scene command, not level completion |
| Minimap/hints | P2 movement reveals nothing; hints account for cargo and name roles | Separate Duo hint system | Garden has simple labels, no route hint |
| Ping | Marker only; reveals/mutates nothing | Same, including mechanisms already visible | May be permitted cosmetically, no reward |
| VFX/sound/flourish | Semantic feedback only | Same | Same; cannot change Egg/friend/fruit outcome |
| Story/dialog/presentation | P2 docks and freezes; Seat 1 advances | Same | Seat 1 controls shared dialog; care state freezes |
| Shared menus/victory | Either pauses; Seat 1 controls/confirm | Same; no Continue Solo | Seat 1 controls spend/reset/return; P2 own card only |
| Surprise Mazes | No Courier mail/Garden detour in v1; do not advertise Duo overlay until separately validated | Not part of route map | Garden still accessible from home |
| Save/reload | Persist rules state, not hardware/flight; reclaim seats | Persist room checkpoint; requires two seats | Persist durable roster/economy, not transient AI/positions |
| P2 disconnect | Pause; reconnect, Secure Satchel Solo, or restart | Reconnect, room reset, or save-return | Clean held object; Garden may continue Solo |
| P1 disconnect | P2 gets constrained recovery only; may bind remaining input to Ame and continue Solo | Constrained recovery; never continue route Solo | Remaining player may claim Ame after safe cleanup |
| Role swap | Between mazes or from Garden, never mid-puzzle | Between routes/validated checkpoints only | Supported after all held objects are safely returned |

## 21. System ownership and expected file surface

Exact paths must be reconciled against the post–Plan 09 tree. The separation of authority is mandatory even if names differ.

### 21.1 Ownership

| Owner | Owns | Must not own |
|---|---|---|
| Core gameplay | Canonical pickup resolution, Ame legality, portable-object inactivity context | Device indices, animation, Garden UI |
| Co-op rules | Fixed clock, flight rules state, cargo, fatigue, mail, Pings, Boop, ordinary projection | Raw polling, visual timers, profile storage APIs |
| Duo-route rules | Mechanism reducer, checkpoints, validator, solver, hints | Arbitrary DOM state or designer-only exceptions |
| Controls | Device normalization, logical seats, claims, neutral gates, semantic commands | Puzzle legality, menu markup, save migration |
| UI | Join/role/HUD/recovery/Garden/route surfaces and focus graph | Raw Gamepad parsing or duplicate rules clocks |
| Persistence | Schema readers/migrations, transaction IDs, sanitizer, reset coverage | Reward animation or runtime random rerolls |
| Garden | Reward bag, Egg transaction, resident AI, fruit/toys, scene runtime | Campaign Power/equipment or second profile authority |
| Presentation | Art resolver, animation clips, typed VFX, sound/haptics, complete motion/quality recipes | Rule timing or mutations |
| Content | Mail overlays, Duo route packets, stable IDs/revisions, authoring validators | Runtime one-off conditionals |
| Performance | Feature allocations, measurements, evidence, loading/cache gates | Silent budget exceptions |

### 21.2 Likely new modules

```text
src/coop/                    pure Duo contracts, reducer, cargo, fatigue, mail, solvers
src/coop/content/            24 mail overlays and six versioned route packets
src/garden/                  durable types, reward engine, scene reducer, AI, content
src/input/                   final two-seat extension if Plan 08 uses this boundary
src/ui/coop/                 join, role, HUD, recovery, route-map surfaces
src/ui/garden/               Garden scene/HUD/reward surfaces
```

Use the project's final conventions rather than creating these directories merely to match the plan.

### 21.3 Likely existing integration files

- `src/game/types.ts`, `engine.ts`, `solver.ts`, `hints.ts`, and `contentIdentity.ts` for narrow default-compatible seams.
- Final campaign/level registries for optional route catalogue references, not insertion into Solo order.
- Final progress, session, rescue, reset, and storage modules plus all historical-reader tests.
- Final input context, controller poller/normalizer, movement scheduler, pointer controls, and focus policy.
- `App.tsx` or its final routed scene shell only as an integration composition point, not a raw rules/poller home.
- Final viewport/camera, art catalogue/assets, animation, VFX, sound/music, CSS, and performance allocation files.
- New/updated tests colocated with every pure module and integration surface.

### 21.4 Single-writer rule

One integration owner lands engine, schema, campaign identity, and app-shell changes in sequence. Art source generation, content authoring, and specialist review may proceed after their gates, but no parallel agent may independently edit shared registries, schemas, `App`, or core engine. Each phase begins from the prior accepted checkpoint and ends with diff review against unrelated/user changes.

## 22. Relationship to Plans 01–09

| Prior plan | Plan 10 dependency | Plan 10 extension | What Plan 10 must not reopen |
|---|---|---|---|
| 01 UI/UX | Final scene shell, `MazeViewport`, modal/focus/responsive contracts | Add Courier join/HUD/recovery, Garden scene, Duo map, two-seat prompts | Global layout overhaul or duplicate modal system |
| 02 Graphics/VFX | Presentation director, effect budgets, independent MotionMode/VfxQuality recipes | Add typed postal/cargo/fatigue/Garden/mechanism events | Parallel particle engine or effect-owned rules |
| 03 Art direction | Approved Art Bible, source records, manifests, provenance and rollback | Original Ponchi/Melty and small postal/Garden tranche | Existing Ame/friend redesign or franchise-referential prompts |
| 04 Lighting/wall depth | Camera clip, occlusion, actor visibility, lighting states | Ensure flying actor/cargo/head cues remain readable | New lighting architecture |
| 05 Limited animation | Semantic clip manifest, cache/frame budgets | Equal Courier wing/fatigue/delight clips and simple Garden wrappers | Full animation system or bespoke frames for every friend |
| 06 Gameplay/UX | Final Solo rules, safety, hint and progression authority | Explicit alternate ordinary-Duo rules and Garden-only Science exception | Rebalance/alter Solo puzzles, guardian arithmetic, or hazards |
| 07 Performance | Final budgets, harness, loading/cache/media policy | Allocate two-seat simulation, selected Courier, Garden and Duo routes | Unmeasured budget growth or Solo startup preload |
| 08 Controls/Deck | Per-device normalization, semantic actions, one poll, neutral gates, controller UI | Replace one owner with two explicit seats; add continuous P2 flight and P1 Interact | Second poller, guessed mappings, unsupported platform claims |
| 09 24-maze campaign | Final layouts, roster, stable order/IDs, Science supply, solver/content tools | Author separate mail overlays and optional six-route catalogue | Insert Duo routes into Solo order or require P2 for solo completion |

Three future-compatible seams identified during exploration remain the only ones Plan 10 assumes: reusable viewport actor/overlay transforms, simultaneous raw device observation with transient seat tags, and versioned mode/rules identity in progress/session. All can be retrofitted now; none should have delayed Plans 01–09.

During Plan 10 implementation, update maintained product authority and guides, but do **not** rewrite Plans 01–09 to make them appear to have included co-op. Their historical decisions remain intact.

## 23. Verification matrix

### 23.1 Pure gameplay and property coverage

- Solo engine equivalence for all final pickup, door, Power, guardian, Boots,
  Leaf, poison, Spring, portal, rescue, treasure, hint, and victory fixtures.
  Parameterized enemy-family coverage includes every final geometry class and
  proves P2 overlap cannot hide, mutate, weaken, resolve or force eager loading
  of the full enemy catalogue.
- Every portable-item disposition transition; illegal transitions rejected.
- One canonical pickup effect through ground pickup, Offer, Snatch, Drop pickup, and recovery.
- Same-tick lifecycle/Ame/P2 priority and no double collection.
- Safe Drop/perch candidate predicates and stable tie-breaking across edge/camera/topology cases.
- Camera/reveal interaction predicate on exploration and small full-reveal levels.
- P2 never changes reveal, topology, hazards, guardian state, objectives, or exit.
- Ping three-charge burst, independent ten-second recharge, pause freeze, marker expiry, and no-spam behavior.
- Fatigue rest-start always 600–1200 ticks, deterministic by seed/item/cycle; exact integer landing interpolation/rounding and constant rational phase multipliers; current-reachability/two-move perch with Ame fallback; zero rest displacement; no buffered movement; pause/cold-resume/drop/re-take persistence; and no fatigue for excluded objects.
- Secure Satchel resolves every allow-listed type location-independently; corrupt unknown types pause for restart/repair rather than returning behind a gate. Run end, restart, Garden detour, voluntary Leave in every fatigue phase, and every disconnect path are exactly once and solver-valid.

### 23.2 Input and focus coverage

- Claim, confirm, neutral arm, swap, leave, disconnect, reconnect, index reuse, null holes, three pads, duplicate IDs, unsupported mapping, and probable duplicate rejection.
- Same-poll joins/actions and input-context generation boundaries.
- Unassigned or mirrored devices never dispatch.
- The same normalized stick/D-pad sample produces one exact cardinal Ame action but a magnitude-preserving normalized Courier vector; raw magnitude is not discarded before seat routing.
- Exactly one active source emits each seat's command frame; P1 standby input is inert until neutral promotion, including contradictory keyboard/controller samples and active-controller loss.
- Courier D-pad overrides stick while held and releases cleanly back to the current stick vector.
- P2 cannot drive shared focus or any shared activation other than Pause/recovery: cover Story advance, victory Next/Replay, route choice, Hint acknowledgement, ordinary menus, and destructive confirmations. P2 can confirm Courier choice/settings/Leave in its own card while P1 is connected, but that Leave edge cannot also choose the resulting shared recovery action.
- Per-seat prompts never flicker or cross-contaminate, P2's logical card never steals shared DOM focus, and haptics route only to the current device generation.
- Either-seat Pause wins before movement; opening press never confirms.
- D-pad eight-way normalized flight, analogue dead zone/magnitude, acceleration/braking, speed preference, fixed-point clamp, and camera transfer.
- Mouse board scaling, resize/zoom, leave-board brake, HUD interaction, context menu suppression only inside active board, blur/hidden/capture loss, and pointer ownership.
- Keyboard+mouse, keyboard+pad, pad+mouse, two mocked pads, and three-pad Deck-style browser flows.
- P1 Snatch buffer and optional Auto-snatch do not survive locks or change record classification.
- Role swap releases/neutral-gates/reclaims devices across pad/pad, keyboard/mouse, and controller/mouse rather than swapping stale tokens.
- Context target highlighting and priority are stable for overlapping cargo, mechanism, Ame, Egg, friend, fruit, toy, and tree.
- Touch is inert during Duo; high-rate mouse events coalesce to one target per rules tick.
- Simultaneous seat loss leaves the recovery surface inert; the first returning neutral source explicitly claims constrained authority. Losing a standby alone does not pause, while losing P1's active source pauses until a standby or replacement is claimed.

### 23.3 Mail/content coverage

- All 24 overlays pass stable ID, fingerprint, quota, concealed ratio, unique cell, floor/reveal, overlap, and visual-density validators.
- Base gameplay fingerprint changes invalidate/review only affected Duo overlays; mail revision does not invalidate Solo sessions.
- Reveal/collect/save/reload/restart/victory/replay and Garden-detour state.
- Completion-only banking and exact `floor/mod 15` boundaries at 0, 14, 15, 16, multiple Eggs, and transaction retry.
- Surprise Mazes instantiate no mail or resumable Duo state.

### 23.4 Solver and route coverage

- Ordinary projected hints for every cargo type at origin, carried, dropped, resolved, disconnected, and behind a relevant route gate.
- Solver comparison confirms all base levels remain valid Solo.
- Active-Duo progression proofs exclude End Duo/Secure Satchel; separate recovery-safety proofs include it. Optional treasure possession never replaces the required-path hint.
- Runtime and Duo-route solver share each mechanism transition.
- Every required-cargo aerial zone has a validated same-zone fatigue anchor, two-action Ame access, and collision-safe guided segment; landing never crosses a postal ward/headwind/moving wall.
- Exhaustive reachable-state traversal for stamp, relay/flap, headwind/ward, wall anchors, room reset, checkpoints, and combined rooms.
- Every initial/checkpoint state wins without Reset; every other reachable state wins or resets exactly to one of those winning checkpoints. Moving walls never overlap an actor/object or create invalid topology.
- Six route hints identify which role acts and avoid solutions dependent on precision or fatigue avoidance.

### 23.5 Persistence and crash coverage

- Every historical final post–Plan 09 profile/session fixture migrates exactly once and retains all progress.
- Old records enter Solo lane; no old run becomes Duo.
- Science discovered/gifted/spent formula, insufficient balance, exchange retry, and reset.
- Completion follows prepared pending payload → atomic profile application/finalized run serial → session acknowledgement/clear. Failures at each completion/Egg/Science/tree/cleanup window produce zero duplicate or lost durable rewards.
- A stale pending completion replayed after enough later operations to overflow any receipt cache remains rejected by profile generation/finalized run serial.
- Solo, ordinary Duo, Special Delivery Route, and minimal non-resumable Surprise completion journals all follow the common envelope/protocol; a failed preparation write applies no reward.
- A two-tab/storage-event race over run-serial reservation or completion makes the losing tab pause/reload before further reward-bearing play and cannot overwrite, lose, or duplicate the winning transaction.
- Partially consumed reward bag, pending third-crack Friend card, full roster, full toy set, and cross-version bag behavior.
- Garden-only corruption recovery never touches campaign/rescue/Science discovery/records.
- Feature flags disabled/re-enabled preserve all state.

### 23.6 Garden coverage

- Solo performs every Egg, friend, fruit, and toy action.
- Two same-tick crack actions commit one result; reload at all four Egg transaction states.
- Maximum three physical Eggs, stable mailbox overflow, no out-of-bounds/lost object.
- No duplicate resident/toy; every final stable friend ID is eligible only after
  an authored Solo-accessible rescue; ordinary/mythic families have identical
  chronology rules; no-eligible Friend wait; post-roster conversions.
- Garden/Welcome Egg unlock only after both first curated completion and first rescued species; Welcome Egg consumes the first Friend card and cannot begin ineligible. No consecutive non-Friend while eligible.
- One ready fruit per refresh, no stacking/duplication, correct eligible completion sources.
- All exact-final-roster residents visible without unsafe overlap or clipping,
  each with a validated shared personality preset/home waypoint/interaction
  bound; at most six autonomous-or-tossed locomotion slots, deterministic visit
  placement, bounded scheduler, and safe held/tossed/exit/disconnect cleanup.
- Care has no durable sadness/needs/offline mutation and no maze gameplay effect.

### 23.7 Visual/art/accessibility coverage

- Ponchi and Melty mechanical equivalence; `cargoSocket`, `careHoldSocket`, and `headCueAnchor` bounds on every applicable frame; stable held-object z-order/occlusion for Ame and both Couriers; and static fallback placement.
- Human-approved actual-size, silhouette, grayscale, colour-vision, bright/dark/busy-terrain, all motion/quality combinations, clipping, and overlap proofs at final target surfaces.
- Ponchi pale-fur alpha/fringe checks on white, black, grey, magenta, cyan, and representative terrain.
- Melty skin/hair/eye palette regression across lighting states.
- Tired symbols clamp inward and never obscure cargo, Ame, guardian, clue, or objective.
- Every effect combination in the motion-mode × VFX-quality matrix cleans up and preserves identical outcome timing.
- Catalogue/source-record/manifest/hash/rights approval, chosen-only loading, offline packaged decode, dedupe, and rollback pointer tests.

### 23.8 Integration, performance, and hardware coverage

- Final `npm test`, `npm run build`, art checks/tests, performance checks/browser harness, and desktop compile/check commands or their post–Plan 09 equivalents.
- 30/40/60/90/120 Hz render schedules produce equivalent fixed-tick semantic outcomes within defined position quantization.
- No idle whole-App renders, no per-flight save writes, no hidden-page catch-up, and final CPU/frame/memory/bundle/media budgets.
- Web and Windows Tauri browser flows across target resolutions and scale factors.
- Full Section 9.8 physical hardware matrix, with unrun rows labeled unverified.
- Controller-only and keyboard/mouse-only complete journeys through home, join, maze, story, hint, pause, disconnect, victory, Garden, Duo map, save/reload, and return.

## 24. Risks, rollback, and kill switches

### 24.1 Risk register

| Risk | Prevention/mitigation | First clean rollback |
|---|---|---|
| P2 trivializes authored Solo route | Explicit ordinary-Duo identity and separate records; Solo remains unchanged | Disable `duoCargo`; keep mail/Ping |
| Keep-away causes tears | Fatigue/rest, fair perch/radius, P1 End Duo, no obstruction score, family gate | Letters & Deliveries preset or Offer/request-only Take |
| Fatigue is too punitive | Only active carry ticks, item-owned debt, short phases, repeat playtest | Tune phase speed/duration within Human-approved 10–20 cadence |
| P2 feels like mail cleanup | Free flight, covers, Ping, cargo/mischief, Duo mechanisms, Garden | Reduce quotas; enrich cover/collection expression |
| Camera tether frustrates P2 | P1 authority, stable clamp, same-camera rooms, edge feedback | Narrow overlay to simpler orbit/docking while routes are revised |
| Valuable item soft-locks | One disposition truth, safe Drop/perch, solver hints, Secure Satchel | Disable cargo after resolving existing held state |
| Solver state explodes | Project ordinary flight; use finite aerial zones/anchor states | Ship ordinary Duo without `duoRoutes` |
| Mail farming dominates | Size bands, replay attribution, no Surprise mail, cadence audit | Reduce repeat yield on outlier short levels prospectively |
| Science economy becomes grindy/exploitable | Lifetime ledger, final supply audit, no money, bounded bag | Hide exchange while preserving ledgers; retune before exposure |
| Random Eggs feel manipulative | Disclosed 5/1/1/1 bag, first Friend, no streak/duplicate/FOMO | Replace future bags with deterministic choice track |
| Garden expands into second giant game | One scene/tree/fruit, three toys, one AI, no needs/races/stats | Disable `friendGarden` entry while preserving state |
| Garden AI harms performance | Six movers, waypoints, one scheduler, no physics | Reduce active movers or stage residents into static activities |
| Ponchi reads as derivative | Strong postal anatomy, prohibited features/vocabulary, model sheet and rights gate | Redesign and block two-character release; Melty-only requires new Human scope approval |
| Melty reads as mini-Ame or too mature | Distinct silhouette/palette/motifs, age-appropriate review | Rework Melty art without changing shared mechanics |
| Two pads enumerate but do not behave independently | Explicit claims/generation/calibration and physical matrix | Limit claims to verified configurations honestly |
| Schema crash duplicates rewards | Atomic profile transaction, stable operation IDs, retry ledger | Disable writers; retain readers and repair from ledger |
| Plan 10 regresses Solo startup/performance | Wrapper architecture, code splitting, chosen-only assets, flags | Disable `duoCore` entry points; keep readers/sanitizers |
| Six routes delay the whole feature | Reducer/solver before content; modular release gates | Release ordinary Duo/Garden first, keep `duoRoutes` off |

### 24.2 Kill-switch hierarchy

Use local build/runtime feature configuration owned in one typed module, not scattered environment checks or a remote live-ops service:

```text
duoCore
  └─ duoCargo
friendGarden
duoRoutes
```

Presentation may also have independent safe fallbacks for Courier animation, optional cargo VFX, Garden ambience, and individual art-family catalogue pointers.

- Turning off `duoCargo` first runs Secure Satchel for unresolved sessions, then keeps mail/Ping/Boop.
- Turning off `friendGarden` hides entry but preserves Eggs, residents, toys, fruit, mail remainder, and Science ledgers.
- Turning off `duoRoutes` preserves route saves/readers and offers safe return/retry-later; never converts them into Solo.
- Turning off `duoCore` hides joining and resolves any active ordinary-Duo session through an explicit recovery path; it never relabels a Duo record as Solo.
- Never remove shipped schema readers, transaction ledgers, reset coverage, or state sanitizers during rollback.

If Science exchange is permanently removed rather than temporarily disabled, release only pending/uncommitted exchange reservations back to available Science. A committed Egg keeps both its reward and its spend ledger. Any broader compensating refund requires an explicit Human-approved migration and may never silently remove a hatched resident, toy, or other committed reward.

## 25. Definition of Done

Plan 10 is complete only when all of the following are true.

### Solo integrity

- Solo remains the default primary path and every authored Solo maze is complete without P2.
- All final Solo engine, solver, hint, save, record, UI, input, presentation, performance, and content fixtures pass unchanged in meaning.
- No Duo/Garden art or JS bulk is eagerly loaded on the title-to-first-Solo path beyond accepted allocation.
- No Duo-only route, friend, toy, story beat, or required achievement is presented as missing Solo completion.

### Ordinary Duo

- Both Couriers are available, mechanically identical, approved, readable, and original.
- Two supported seats move simultaneously with deterministic ownership and stable prompts.
- Mail/reveal/Ping/cargo/fatigue/Snatch/Drop/Boop/camera/recovery rules match this plan on all 24 curated mazes.
- P2 can intentionally shortcut or tease without erasing, duplicating, stranding, or silently awarding an item.
- Every cargo state has a correct hint and a deterministic path to completion or recovery.
- Solo and Duo records are separate but equally valid.

### Friend Garden

- Garden unlock, Welcome Egg, mail conversion, Science exchange, reward bags, no-duplicate residents, fruit, three toys, care, and return-to-route are atomic and resumable.
- Every consequential Garden action works Solo and Duo.
- No failure/needs/neglect/paid/FOMO system exists, and Garden state grants no maze power.
- Final-roster/six-mover performance and all held-object cleanup paths pass.

### Special Delivery Routes

- All six routes use one shared screen and require meaningful actions from both roles.
- Runtime reducer, validator, solver, hints, checkpoints, and Reset Duo Room share exact mechanism authority.
- Every reachable state wins or resets; disconnect cannot create a false Solo continuation.
- The routes gate no Solo progression or exclusive Garden collection.

### Persistence and reliability

- Every historical profile/session migrates without loss; old records remain Solo.
- Completion, mail, Egg, Science, fruit, resident, toy, and cleanup operations survive every injected crash window exactly once.
- Feature disable/re-enable and Garden corruption recovery preserve canonical progress and all recoverable Plan 10 state.
- Explicit Reset Progress covers the new aggregate with clear, Seat-1-controlled confirmation.

### Accessibility, family play, and evidence

- Both MotionMode values across all three VfxQuality values, plus non-colour, non-audio, D-pad, keyboard/mouse, reconnect, and motor-assist paths, communicate identical rules.
- The required family sessions pass the agreed engagement, no-soft-lock, fair-catch, no-tears, cooperation, role-swap, and Garden-care thresholds.
- No platform, controller, Steam Deck, haptic, performance, or originality claim exceeds recorded evidence.
- All unverified physical rows remain labeled unverified rather than inferred from mocks.

### Project gates and documentation

- The full test/build/art/performance/desktop gates pass from a reviewed working tree.
- Maintained Game Vision, Gameplay, Story, Architecture, Controls/Steam Deck, Art/Animation/VFX, Performance, README, release checklist, and a durable co-op/Garden rules reference are updated to implemented truth.
- Plans 01–09 remain unedited historical records.
- Asset manifests, source records, provenance, rights/originality approvals, content fingerprints, feature allocations, migration fixtures, playtest evidence, and rollback runbook are complete.
- `git diff --check` passes and the root manager reviews the exact final file/change inventory before commit, push, deployment, or publication.
- After acceptance, the root release manager completes the required `FP-COOP`
  transaction from that exact clean, committed and pushed SHA: GitHub CI,
  Vercel production deployment/smoke, two-controller Tauri launch journey,
  versioned portable Windows build, manifest, SHA-256, playtest note and GitHub
  pre-release assets. Any blocker is recorded with a retry point; the Plan-10
  agent does not publish or relabel the build itself.

## 26. Maintained documentation changes during implementation

After the post–Plan 09 start gate—not while preparing this plan—Plan 10 should update implemented truth in:

- `docs/GAME_VISION_AND_DESIGN_SPEC.md` for the optional Duo/Garden product shape and co-op-only bonus exception;
- the maintained gameplay specification for exact mode, cargo, mail, Science, record, Garden, and solver rules;
- `docs/STORY_BIBLE.md` for Ponchi/Melty/Garden narrative facts and the Science exception;
- `docs/ARCHITECTURE.md` for wrapper reducers, two seats, profile transactions, loading, and solver boundaries;
- final Controls/Steam Deck documentation for simultaneous-seat qualification and mappings;
- final Art Bible, Animation, VFX, asset-pipeline, prompt-history, and source-record documents;
- final Performance budgets/evidence and release checklist;
- README for honest available modes/platform inputs; and
- a maintained `docs/COOP_AND_FRIEND_GARDEN_SPEC.md` (or final repository-equivalent) containing shipped rules without implementation-history noise.

Do not edit Plans 01–09 as part of this reconciliation.

## 27. Research and design provenance

This implementation plan synthesizes the approved concept research; it does not repeat the full literature review. The implementation-relevant source facts remain:

- The W3C Gamepad specification defines transient, first-come indices and permits index reuse after disconnect. **Implementation inference:** devices need explicit runtime seat claims plus connection generations, not saved index/ID identity. [W3C Gamepad](https://www.w3.org/TR/gamepad/) (accessed 2026-09-02).
- Valve's Steam Input guidance requires local multiplayer to accept simultaneous controller paths and warns about emulated/duplicated inputs. **Implementation inference:** two devices being enumerated is not proof; calibrate seats and test real Deck/external configurations. [Steam Input developer guide](https://partner.steamgames.com/doc/features/steam_controller/getting_started_for_devs), [gamepad-emulation practices](https://partner.steamgames.com/doc/features/steam_controller/steam_input_gamepad_emulation_bestpractices) (accessed 2026-09-02).
- UNICEF's RITEC work organizes child well-being around safety, autonomy, competence, relationships, creativity, and identity. **Design inference:** both roles need agency and recovery, while Garden care must avoid neglect pressure. [UNICEF RITEC Design Toolbox](https://www.unicef.org/childrightsandbusiness/workstreams/responsible-technology/online-gaming/ritec-design-toolbox) (accessed 2026-09-02).
- FTC and UK government material focuses randomized-reward concern on paid access, disclosure, overspending, and child protection. **Design inference:** earned-only Eggs still need disclosed bounded outcomes, no duplicates/streak manipulation, and no money/FOMO. [US FTC](https://www.ftc.gov/news-events/news/press-releases/2020/08/ftc-staff-issue-perspective-paper-video-game-loot-boxes-workshop), [UK DCMS](https://www.gov.uk/guidance/loot-boxes-in-video-games-update-on-improvements-to-industry-led-protections) (accessed 2026-09-02).
- Official SEGA Chao material demonstrates the appeal of hatching, care, personality, and a comfortable Garden. **Design inference:** retain affectionate interaction while deliberately excluding visual identity, races, breeding, stats, evolution, and needs. [SEGA](https://sonic.sega.jp/sonicadv2/0601/shots_e.html) (accessed 2026-09-02).
- Square Enix's own creator interview identifies recognizable Moogle ingredient lineage. **Design inference:** Ponchi's white/light-brown fuzzy bat-winged direction requires structural creative distance, franchise-free production prompts, and explicit originality review—not merely a new name. [Final Fantasy Portal / Square Enix](https://na.finalfantasy.com/topics/176) (accessed 2026-09-02).

Precedents establish principles only. No protected name, character, phrase, visual identity, level, or signature mechanic may be copied.

## 28. Human checkpoints still required

The Human has approved the overall product and the rules recorded here. Implementation should pause only at these concrete gates:

1. Accept/revise the Phase 0 Science supply audit and working 5-Science Egg price.
2. Accept/revise the greybox after the required Amelia/parent and second-family tests.
3. Approve Ponchi and Melty's original model sheets at real game size, including the exact fur/skin/hair/eyes/wings/horns/tail/satchel treatment.
4. Accept the final 24 mail-overlay audit and six route packets after validator evidence.
5. Approve the release composition after platform, accessibility, economy, family, performance, and rollback evidence.

No implementation, production art, source generation, level authoring, migration, dependency change, commit, push, deployment, or publication is performed by this plan document. Execution remains strictly after Plan 09 and begins at Phase 0.
