# Game Design, Gameplay UX, and Mechanics Improvement Plan

| Field | Value |
|---|---|
| Status | Planning and research only; no gameplay change is authorized by this document |
| Prepared | 2026-09-02 |
| Repository | `C:\maze-game` |
| Inspected commit | `c6b6628b6e651d18161a4d1302935d3096f665c6` (`main`) |
| Initial working tree | Clean: `git status --short`, `git diff`, and `git diff --cached` produced no output before the audit began |
| Concurrent work | Other expert tracks subsequently created untracked files under `docs/plans/`; they were preserved and were not treated as shipped repository authority |
| Owner | Game rules, progression, level layouts, hint semantics, feedback behaviour, challenge design, reward meaning, and playtest criteria |

## 1. Outcome and approval boundaries

The campaign has a sound, child-safe rule core. Equal Power wins, stronger enemies are harmless, keys are reusable, traversal equipment is legible, portals are deterministic, and both ordinary and perfect-rescue routes are solver checked. The main problem is the shape of the difficulty curve: later chapters often replace inference with long, low-information corridors and neutral retraversal. The strongest example is the finale, whose current shortest solution is 411 directional inputs, has no measured junction decisions, repeats nearly half its moved positions, contains a 195-input stretch without a non-movement event, and forces all five supposedly optional rescues.

This plan therefore recommends preserving the rule vocabulary and redesigning how it is taught, arranged, and supported. It does **not** propose a new combat system, economy, camera presentation, art direction, lighting treatment, or VFX language.

The plan converges on eight decisions:

1. Make chapter 1 a genuine movement-and-goal lesson, preferably with a board no larger than 6×6 so the existing exploration rule naturally postpones camera, fog, and minimap onboarding until chapter 2. This is a map change and requires approval after the save-safety work in Phase 1.
2. Measure cognitive challenge separately from friction. Route length is a budget, not a difficulty score.
3. Keep the current mechanic order broadly intact, but give each mechanic a visible introduction, supported application, later recall, and combination/mastery beat.
4. Replace App-local coordinate reachability with engine-transition search shared with the solver. A hint route must be replayable through `movePlayer`, including portals and complete multi-hole Spring Boots jumps.
5. Separate required-path hints from optional rescue clues. An optional animal must never outrank the next required portal, key, or capability.
6. Replace repeated focus-stealing blocker modals with progressive, accessible feedback while preserving an explicit first explanation and the exact safe Power comparison.
7. Give Gold and Science honest present-tense meaning as records of achievement and curiosity. Do not create a shop or spend economy in this work.
8. Restore an ordinary zero-rescue solution to the finale. Retaining any forced rescue is an explicit product exception requiring approval and player-facing disclosure; retaining five is not recommended.

### 1.1 Locked rules

Unless a later product decision explicitly reopens one of these items, implementation must preserve:

- Equal Power wins; a stronger enemy never damages, moves, or resets Ame.
- One generic weapon capability, with visual variants that do not change rules.
- Reusable matching keys.
- Boots gate water and lava; Antidote Leaf gates poison.
- Spring Boots jump straight across the complete contiguous hole run and resolve the landing square.
- Portals are persistent pairs.
- Rescues are optional by default and do not gate the exit.
- Every authored and generated maze remains solver-valid in ordinary and perfect-rescue modes.
- Surprise Mazes remain deterministic for identical versioned inputs.
- The absolute 24×24 cap and current generated-size bounds of odd sizes 9–23.
- Child-safe tone, save integrity, input parity, reduced-motion/static equivalents, and accessibility.

### 1.2 Explicit non-goals

- No repository dependency, full currency economy, shop, equipment inventory, enemy damage, life system, fail state, or rescue penalty.
- No layout, artwork, lighting, or VFX redesign. This plan supplies semantic requirements and readable-state contracts to those owners.
- No remote telemetry requirement. The proposed measurements can be captured in a local tester overlay and a facilitator worksheet.
- No implementation or commit during this planning phase.

## 2. Authority, method, and evidence

### 2.1 Repository authority

The audit treated current source and tests as executable authority, then the README and architecture documentation, then the current Story Bible. Historical sections of `docs/PROJECT_AUDIT.md` were used only to identify drift. In particular:

- `docs/PROJECT_AUDIT.md` labels older material as historical, and some of it still describes 12 authored levels, a 25×25 authored maze, 9–29 generated bands, and a seven-tile exploration threshold.
- Current code, README, and architecture use a 24 absolute cap, generated odd sizes 9–23, a six-tile threshold, and 16 chapters.
- `docs/ARCHITECTURE.md` lists only 15 authored dimensions and claims portal-aware hint reachability, although `src/App.tsx` currently performs its own coordinate flood fill without portal transitions.
- `docs/STORY_BIBLE.md` retains an older version header, but its 16-chapter matrix and `src/story.ts` are the relevant current narrative references.

### 2.2 Files inspected

The audit covered the requested authority files and their relevant neighbours:

- Rules and content: `src/game/types.ts`, `engine.ts`, `levels.ts`, `solver.ts`, `generator.ts`, `exploration.ts`.
- Gameplay shell: `src/App.tsx`, especially movement, hint priority, reachability, blocker escalation, objectives, minimap, victory, and reward copy.
- Progression and persistence: `src/progress.ts`, `src/session.ts`, `src/navigation.ts`, `src/rescueRecords.ts`, and `src/resetProgress.ts`.
- Narrative and controls: `src/story.ts`, `src/pointerControls.ts`, and `src/movementControls.ts`.
- Tests: the corresponding `*.test.ts` files, including `engine`, `levels`, `solver`, `generator`, `exploration`, `portalLevelStats`, progress/session/navigation/story/control suites, and migration coverage.
- Documentation: `README.md`, `docs/ARCHITECTURE.md`, `docs/STORY_BIBLE.md`, and `docs/PROJECT_AUDIT.md`.

### 2.3 Verification baseline

- Focused campaign/solver/story checks: 76 tests passed.
- Focused progress/session/navigation/story/reset/rescue/control checks: 108 tests passed.
- A full `npm test` run under concurrent repository and browser work completed 310 of 316 tests. There were no assertion failures in completed tests; six cases timed out across three files, concentrated in generator/Spring Boots/finale/portal-stat work. The run took 163.27 seconds. A generator case that timed out in the shared run passed in isolation in 11.07 seconds.
- Interpretation: no current rule regression was found, but the timeout sensitivity is itself a performance and CI-budget risk. This plan does not call the full suite green.

### 2.4 Browser playtest coverage

The in-app browser was used at `http://127.0.0.1:1420/?debug=mazes`. The sessions intentionally sampled first-time presentation, required interactions, blocker recovery, portals, victory, and generated starts rather than pretending every long route was manually walked end to end.

| Chapter/sample | Coverage | Observed result |
|---|---|---|
| 1 | Start, pickup, hint, ordinary completion | The first view exposes 36/81 cells (44%), a cropped 6×6 board, camera/fog/minimap/reveal percentage, controls, inventory, an optional friend, and the goal at once. Sword pickup took one input; ordinary victory took 26 inputs and left the rescue as “Next time.” |
| 2 | Start, hint, ordinary completion | Weapon, animal, and Rose key are readable landmarks. The solver route used 37 directional inputs, while the UI reported 36 movement steps because stationary combat input is not counted as movement. This distinction must be explicit in metrics. |
| 3 | Start and hint | The exit, Power 6 enemy, blue key, and Power 3 enemy are initially visible, but the chapter labels five new ideas: potion/Power, stronger-enemy safety, Boots, water, and a second lock colour. |
| 7 | Start, equipment route, stronger-enemy collision | The Power 9 guardian correctly leaves Power 6 Ame safely one square away. The modal clearly shows `6 < 9`, but deliberate repeat collisions would reopen a full modal. |
| 10–12 | First view and first hint in each | Only 7–8% of each map is visible. First hints all point to a weapon. Chapter 10 formally teaches exploration although camera/fog/map have been active since chapter 1. |
| 13 | First hint and first portal traversal | First portal took 20 directional inputs to reach. Entering it warped to its persistent twin in one engine transition and produced coherent map feedback. The initial hint incorrectly prioritized an optional Bunny rather than the required portal chain. |
| 14 | First view and first hint | Initial hint again prioritized an optional Bunny. The first stateful event is 28 inputs away. |
| 15 | First view and first hint | The view shows several optional rewards/rescues; the first hint points to the weapon. Current ordinary route is 231 inputs despite being framed as portal mastery. |
| 16 | First view, repeated key blocker | Power 99 boss, Sunny door, weapon, several enemies, potion, and Science are visible immediately. Three collisions with the locked Sunny door each opened a full modal; the third also added a useful map marker. |
| Surprise A | Fresh generated start | About 10% visible, Science landmark, three rescues; first hint identified the weapon. |
| Surprise B | Fresh generated start | About 10% visible with no unresolved landmark in the starting view; first hint identified the weapon. |
| Surprise C | Fresh generated start | About 10% visible, Alpaca and Gold landmarks; first hint identified the weapon. |

The tester UI does not expose the exact timestamp-derived seed. This prevented precise reconstruction of those three clicks and motivates a debug-only seed field. It is not evidence for a required player-facing seed UI.

### 2.5 Evidence labels

- **E1 — executable:** source behaviour, solver replay, automated tests, or directly reproduced browser behaviour.
- **E2 — convergent research:** multiple relevant empirical or standards sources.
- **E3 — single/adjacent research:** one study, a related population, or practitioner evidence; validate locally.
- **H — design hypothesis:** a measurable recommendation derived from E1–E3, not yet child-validated.

## 3. Current rule and systems audit

### 3.1 Rules that are working

`src/game/engine.ts` is the correct semantic centre. It already provides the behaviours the campaign should build around:

- A matching key opens its door without consuming the key.
- Boots and Leaf gates are state checks, not damage hazards.
- Equal Power resolves an enemy; lower Power results in a stationary, safe block.
- Spring Boots scan the entire straight contiguous hole run, require a legal landing, and process the landing square.
- A portal entrance resolves to its paired endpoint in one move and remains usable.
- Rescues change rescue state but are not an exit prerequisite.

`src/game/solver.ts` is also correctly grounded: solver edges call `movePlayer`. The plan extends that authority rather than creating another traversal model.

### 3.2 First-chapter exploration overload

`src/game/exploration.ts` enables exploration for any dimension over six. Every authored map is at least 9×9, so the very first chapter begins with camera following, fog/reveal, a minimap, a map percentage, landmark discovery, and a map nudge. Those systems are individually useful, but they arrive before the player has demonstrated movement or goal comprehension. This is an onboarding sequencing problem, not a reason to remove exploration from the campaign.

The current reveal is a 6×6 square even through walls, with an upper-left bias when centring an even viewport, and map percentage counts the whole grid including border/wall cells. Preserve those semantics during the onboarding prototype unless separate evidence shows an orientation defect; do not use reveal percentage as a proxy for puzzle reasoning or child performance.

Preferred decision: make chapter 1 a compact ≤6×6 micro-maze using the existing rule. Show Ame, the exit star, and one short optional rescue branch in the same stable view; place the weapon no more than three inputs away if it remains. Target 10–20 ordinary directional inputs.

Fallback requiring separate approval: keep the 9×9 topology but add a scoped `explorationMode: "full-board-intro"` policy to chapter 1. This adds a special rule and is less desirable than using the existing threshold, but may be retained if a ≤6×6 layout cannot supply one satisfying decision at tested viewport sizes.

Chapter 2 should then introduce camera/minimap through one in-context, dismissible cue after the player moves—not a blocking tutorial card.

### 3.3 Hint and reachability mismatch

The hint reachability helper in `src/App.tsx` is a coordinate flood fill rather than an engine transition search. With Spring Boots, it treats individual hole cells as adjacent reachability and can conceptually stop or turn in the middle of a run. With portals, it marks the entrance coordinate but never adds the paired destination. `blockerHintFor` also selects unresolved items without proving the selected target is reachable under current rules.

The priority order places an animal before a portal once other blockers are absent. That is why chapters 13 and 14 initially hint at an optional rescue even though their stated lesson is portal reasoning. This weakens both objective clarity and the claim that rescues are optional.

### 3.4 Repeated interruption

Equipment and key collisions can open a full blocking modal, and every stronger-enemy collision opens one. Three-collision escalation adds a useful guided marker but does not reduce the preceding interruption: the third attempt still opens the same modal. The safe state and explicit comparison are excellent; focus theft is not required to preserve either.

### 3.5 Controls and meaningful intent

Keyboard, D-pad, pointer, and touch share the same movement cadence: immediate input, a 320 ms release window, then repeat at 260 ms accelerating to 160 ms. Preserve this baseline pending physical-device testing.

All input paths currently pass through `resolvePointerMoveDirection`. Its corner-assist “safe” predicate excludes unresolved doors and enemies, but can select an exit, portal, pickup, treasure, or rescue. Assistance may correct imprecise travel through ordinary floor; it must never decide an optional action, reward collection, warp, exit, blocker, hazard, or jump for the player.

### 3.6 Reward expectation debt

Current rewards are deterministic and already support replay:

- Curated solve: 10 Gold, increasing by 2 after each five campaign levels.
- Generated solve: 8 Gold.
- First clear of a unique level ID: +5 Gold.
- Each rescued friend on every completion: +3 Gold.
- All-current-friends completion: +6 Gold every time.
- Collected Gold and Science treasures bank only after a valid victory.

Replays can therefore improve best steps/Power/rescues and earn solve, rescue, perfect, and treasure rewards again. Species totals can be farmed on one maze, while perfect-maze medals correctly count distinct maze IDs. A perfect-rescue streak exists in data but is not surfaced; it should not become pressure-heavy child UX without evidence.

The problem is meaning, not arithmetic. `REWARD_LABELS.gold.description` promises future portrait frames and outfits, and the Story Bible mentions a future Science observatory. Neither exists. The plan removes the promise and gives the counters an honest present use: Gold records completed adventures and rescues; Science records curiosity and explored side paths. Surface both totals consistently in victory and the Adventure Book. Do not add prices, purchases, or sinks.

At present, the Adventure Book shows Gold but omits the Science total, while victory shows Science gained without the resulting total and the in-maze wallet is the only persistent Science view. The proposed consistency change corrects that information gap without changing reward values.

### 3.7 Save and content identity risk

Authored ASCII parsing assigns object IDs from one row-major global counter. Adding or moving any early object can renumber later objects. Active snapshots store level ID, object-ID state, and revealed coordinates, but no layout revision or content fingerprint. Validation catches missing or wrong-kind IDs; it can silently accept a same-kind replacement after renumbering and apply a rescue, enemy, or pickup state to the wrong object.

Route edits also make old `bestSteps` incomparable because progress records have no layout revision and retain the minimum forever. Adding a rescue can leave historical `perfectRescue: true` even when the new rescue set was never completed. These issues must be solved before any authored map edit ships.

### 3.8 Progression, story, and session behaviour

- A fresh profile unlocks only chapter 1. Completing authored chapter index `i` unlocks through `i + 2`, capped at 16; generated completions never unlock story chapters. Current App-side inference repairs inconsistent saves from authored results.
- Continue prefers a live active run; otherwise it selects the earliest unlocked unsolved authored chapter, with a documented legacy fallback for record-less v1 saves.
- Story onboarding appears on a normal authored `enterLevel`, but not on resume, tester mode, generated play, or the victory-screen replay action. The first maze’s glowing direction appears only at zero steps and before its first completion.
- Story cards are roughly 35–80 words and dismiss on ordinary inputs while preserving Tab/modifier behaviour. Keep narrative cards short and motivational; do not move prerequisite memory into a one-time card.
- A generated run can be resumed from Home/Book only within the same live React session and disappears on reload/app close. Current player-facing copy does not explain this.
- Surprise difficulty derives mainly from story unlock count, with a one-band boost after two distinct Surprise records. Keep the progression deterministic and test the jump between gentle/growing/adventure bands rather than silently retuning it.
- The Book displays six recent Surprise records in insertion order, not completion time. Existing records lack seed/options and cannot reconstruct their mazes; fresh timestamp seeds also grow result storage without a bound.
- Pointer assistance is described as pointer-only in architecture, but source applies the resolver to keyboard and D-pad requests too. Source/tests are authority; documentation and parity tests must reflect the real shared path.

## 4. Sixteen-level mechanic and progression matrix

Lifecycle codes: **I** introduce explicitly; **S** supported application with nearby clue; **R** unaided recall; **C** combine with another known rule; **M** mastery/transfer. “Incidental” means the mechanic appears but the chapter does not teach it clearly.

| Ch. | Current name / size | Puzzle intent | Movement, map, goal | Power and blockers | Traversal and state | Optional/replay | Current lifecycle issue | Ordinary / perfect inputs |
|---:|---|---|---|---|---|---|---|---:|
| 1 | Little Star, 9×9 | Learn directions | Movement/exit **I**; camera/fog/map incidental **I** | Weapon incidental | — | Rescue **I** | Six systems precede first navigation decision; weapon has no explicit purpose yet | 26 / 34 |
| 2 | Shiny, 11×11 | Compare and match | Movement **S**; camera/map should be **I** | Weapon, equal-Power combat, red key/door **I** | — | Two rescues **S** | Good short chain, but camera lesson is already late in practice | 37 / 53 |
| 3 | Splashy, 13×13 | Plan and return | Goal/path **R** | Potion, Power growth, stronger-safe block **I**; blue lock **I** | Boots/water **I** | Three rescues **S** | Five labels arrive together; stated return is not a meaningful revisit on the shortest path | 64 / 80 |
| 4 | Rainbow Picnic, 15×15 | Sort requirements | Goal **R** | Two key colours and Power chain **C** | Water/Boots **R** | Three rescues **R** | Five apparent decisions but much of the 80-input route is corridor travel | 80 / 92 |
| 5 | Toasty, 13×13 | Predict cause/effect | Goal **R** | Power and two locks **C** | Lava **I**, Boots across hazards **C** | Three rescues **R** | Good event density, only two route decision coordinates | 69 / 77 |
| 6 | Moonbeam, 15×15 | Break task into steps | Goal **R** | Three key colours **C** | Water/lava **C** | Three rescues **R** | Eleven critical events but only one measured decision coordinate | 92 / 104 |
| 7 | Wishing, 17×17 | Persevere and revise | Backtracking **I/S** | Optional Power 9 guardian **S**; three locks **C** | Spring Boots/holes **I**; mixed hazards **C** | Three rescues; optional miniboss | Strong optional Power puzzle; repeat blocker feedback is disruptive | 117 / 150 |
| 8 | Grand Parade, 17×17 | Keep track of a chain | Map **R** | Long key/Power chain **C** | Spring/hazards **R/C** | Three rescues, perfect route | Fifteen critical events but only four decision coordinates; needs a recurring hub | 120 / 140 |
| 9 | Springstep, 19×19 | Predict jump landing | Map **R** | Power/locks **R** | Multi-hole landing **M** | Three rescues | 193 inputs, 44-input event gap, 26% retraversal: endurance exceeds new inference | 193 / 217 |
| 10 | Lantern, 23×23 | Explore rooms and use a model | Camera/fog/map formally **I**; rooms **I** | Power/locks **C** | Spring/hazards **C** | Treasure and three rescues | Exploration is labelled nine chapters after it began; 61-input event gap and Fox costs +38 | 173 / 216 |
| 11 | Twilight, 21×21 | Select relevant clues | Map **R** | Three keys, optional miniboss **C** | Three-hole/off-route jump **M** | Four rescues/treasure | Relevant-clue idea is buried in 235 inputs and 21% retraversal | 235 / 245 |
| 12 | Moonlit, 23×23 | Observe a new hazard | Map **R** | Long Power chain/locks **C** | Poison/Leaf **I**; Spring/hazards **C** | Five rescues | New rule is clear, but each rescue costs only +2 and a 49-input gap adds dead travel | 231 / 241 |
| 13 | Rose, 15×15 | Make portal connections | Map **R** | Key loop **R** | Persistent portal pair **I** | Three rescues | First portal takes 20 inputs; initial hint points to optional Bunny | 105 / 117 |
| 14 | Clover, 17×17 | Revise a portal plan | Map **R** | Optional miniboss/locks **C** | Three-pair relay **S/C** | Four rescues | First event at input 28; perfect premium +74 and two individual rescues cost +62/+66 | 103 / 177 |
| 15 | Crown, 21×21 | Combine portal rules | Map **R** | Three keys, optional Power **C** | Three portal pairs with all traversal **M** | Five rescues | 231 inputs and 24% retraversal; rescue margins range from +1 to +16 | 231 / 260 |
| 16 | Rainbow Power Parade, 21×21 | Sequence Power growth and return | Map **R** | Power 99 boss, long combat ladder **M** | Mixed traversal **C** | Five rescues currently forced | Zero measured junctions; all five “optional” rescues unavoidable; ordinary=perfect | 411 / 411 |

## 5. Campaign measurements

### 5.1 Metric definitions used in the audit

- **O/P:** shortest solver directional inputs for ordinary/perfect-rescue victory. Inputs include stationary state-changing interactions; the player-facing step counter currently does not.
- **D:** decision visits / unique decision coordinates on the ordinary shortest route, excluding a direct reversal as a new choice.
- **F:** raw off-route, non-wall dead-end proxy. It is a topology warning, not automatically a good false lead.
- **P:** irreversible critical-route events: equipment/potion acquisition, combat resolution, keys, doors, and any forced rescue.
- **Ret:** percentage of moved route endpoints previously visited. The implementation metric will split state-enabled return from neutral retraversal.
- **Gap:** longest directional-input stretch without a non-movement event.
- **Bare→full:** shortest route after flattening hazards and removing progression objects while retaining portals, compared with the real ordinary route. A large difference with few decisions indicates gating/travel rather than rich topology.
- **Rescue Δ:** perfect minus ordinary, followed by current marginal costs for individual animals. Marginals are not additive when branches overlap.

### 5.2 Current campaign metric table

| Ch. | O/P | D visits/coords | F | P | Ret | Gap | Bare→full | Rescue Δ and marginal costs |
|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 1 | 26/34 | 1/1 | 1 | 1 | 0% | 25 | 26→26 | +8; Kitten +8 |
| 2 | 37/53 | 4/4 | 4 | 4 | 0% | 8 | 36→37 | +16; Hedgehog +12, Fox +4 |
| 3 | 64/80 | 2/2 | 2 | 7 | 0% | 14 | 62→64 | +16; +6/+8/+8 |
| 4 | 80/92 | 5/5 | 5 | 9 | 0% | 14 | 78→80 | +12; all +4 |
| 5 | 69/77 | 2/2 | 2 | 10 | 0% | 10 | 66→69 | +8; +4/+2/+4 |
| 6 | 92/104 | 1/1 | 1 | 11 | 0% | 13 | 90→92 | +12; +12/+6/+2 |
| 7 | 117/150 | 7/5 | 3 | 13 | 3.5% | 15 | 108→117 | +33; +12/+13/+8 |
| 8 | 120/140 | 5/4 | 3 | 15 | 1.7% | 15 | 114→120 | +20; +12/+4/+4 |
| 9 | 193/217 | 15/8 | 5 | 9 | 26.3% | 44 | 92→193 | +24; +8/+4/+12 |
| 10 | 173/216 | 18/13 | 8 | 9 | 32.9% | 61 | 56→173 | +43; +2/+5/+38 |
| 11 | 235/245 | 18/10 | 7 | 14 | 21.2% | 28 | 136→235 | +10; +2/+4/+2/+2 |
| 12 | 231/241 | 21/13 | 12 | 16 | 11.9% | 49 | 174→231 | +10; each rescue +2 |
| 13 | 105/117 | 10/6 | 3 | 4 | 31.7% | 28 | 36→105 | +12; +4/+6/+8 |
| 14 | 103/177 | 9/7 | 8 | 8 | 21.0% | 28 | 60→103 | +74; +4/+32/+62/+66 |
| 15 | 231/260 | 21/13 | 7 | 14 | 23.7% | 31 | 122→231 | +29; +16/+12/+4/+5/+1 |
| 16 | 411/411 | 0/0 | 0 | 28 | 49.5% | 195 | 4→411 | +0; every rescue unavoidable |

### 5.3 What the measurements mean

Chapters 1–8 mostly maintain short event gaps, but chapters 6 and 8 already show a “critical chain in a corridor” pattern: many required state changes with very few meaningful choices. Chapters 9–12 add length faster than inference. Chapters 13–15 introduce an excellent new spatial verb but spend too much of its teaching budget on reaching portals and walking old ground. Chapter 16 is structurally a linear state ladder: the huge Bare→full difference, zero decisions, 49.5% repeat rate, and 195-input gap show that its difficulty is endurance rather than planning.

Raw retraversal is not automatically bad. Returning to a familiar gate after obtaining a remembered key, seeing a shortcut reopen, or revisiting a hub with a changed model can create competence and anticipation. Returning through an unchanged corridor with no new view, choice, or consequence is neutral travel. The future analyzer must report both.

## 6. Implementation-ready challenge rubric

The analyzer should produce route facts, a **reasoning score**, and a separate **friction score**. It must run on an engine-replayed route; no metric may assume that adjacent coordinates are legal moves.

### 6.1 Canonical counters

1. **Directional inputs:** every call to a cardinal engine transition, including stationary combat, door, or blocker attempts when explicitly included in a test trace.
2. **Movement transitions:** successful state transitions that change the player coordinate. A portal warp is one movement transition, regardless of coordinate distance.
3. **Puzzle events:** state changes to weapon/equipment/key/Power/door/enemy/portal-discovery/rescue/treasure/exit. Required-path analysis excludes optional rescue/treasure from “progress events.”
4. **Effective decision state:** after excluding an immediate state-equivalent reversal and illegal/no-progress edges, the current state has at least two engine-valid successors that lead to meaningfully different regions, stateful events, or recoverable false leads. Parallel floor tiles that immediately merge without a distinct clue/event count once.
5. **False-lead recovery:** for each traversable branch not on any shortest ordinary route, report the minimum directional inputs to return to the choice or rejoin a viable route, and whether the branch contains a clue, optional reward, landmark, or shortcut. An empty dead end is friction, not reasoning.
6. **Prerequisite depth:** construct a dependency DAG from required state facts and report the longest chain, fan-out, and number of facts simultaneously worth remembering. Validate necessity by removing or forbidding each candidate fact and re-solving.
7. **Retraversal:** count repeated movement endpoints. Classify a repeated segment as **state-enabled** when a persistent capability, open door, cleared enemy, new key, or new route knowledge changes the available decisions since the preceding visit; otherwise classify it as **neutral**.
8. **Event gap:** longest directional-input interval between a required puzzle event, an effective decision, or first reveal of a functional landmark. Also report longest uninterrupted ordinary-floor corridor.
9. **Clue lead:** inputs between first reveal of a required gate/enemy/hazard and first reveal or acquisition of its answer. Report answer-before-question separately; neither order is automatically wrong.
10. **Rescue premium:** perfect minus ordinary, plus each animal’s marginal cost when all other rescues are optional. Report unavoidable rescues as a contract error unless explicitly allowed.
11. **Search effort:** solver states expanded, shortest-path length, and expanded-states/input ratio. This is a proxy for state-space complexity, not a child difficulty score.
12. **Hint dependence:** highest tier requested before the next required event, inputs after hint, repeated hint count, and success without a hint. Keep locally for test sessions unless consent authorizes research recording.
13. **Interruption load:** number and duration of focus-taking dialogs, facilitator interventions, repeated blocker bumps, and unintended assisted choices.

### 6.2 Reasoning score, 0–20

Score five axes from 0–4 using the computed facts and a short designer annotation. The score is for curve review, never a child grade.

| Axis | 0 | 2 | 4 |
|---|---|---|---|
| Branch reasoning | No effective choice | Several legible choices or one recoverable false lead | Repeated consequential choices with distinguishable evidence |
| Prerequisite planning | No dependency | Two-step dependency or small hub memory | Multi-stage dependency with visible, revisable plan |
| Spatial/state inference | Pure corridor | Infer one landing, return, or changed access | Repeated prediction across jumps/portals/state changes |
| Mechanic integration | One known verb | Two known verbs combined | Three or more verbs combined without a new-rule pile-up |
| Clue interpretation | Answer adjacent/automatic | Landmark or comparison must be used | Multiple relevant/irrelevant clues distinguished fairly |

Do not award points for route length, number of enemies, obscurity, or an unmarked dead end.

### 6.3 Friction score, 0–20

Score five independent 0–4 axes: neutral travel/event gap, neutral retraversal, interruption/recovery burden, orientation/clue invisibility, and optional-goal distortion. A friction score over 8 requires review; over 12 blocks release even if the reasoning score is high.

Examples of a 4 on an axis include: a >50-input required-path event gap, >35% neutral retraversal, three repeated blocking dialogs for the same learned concept, a required answer that is neither discovered nor hint-reachable, or a “perfect” route identical to ordinary because every rescue is forced.

### 6.4 Curve budgets

These are initial design hypotheses to validate with child sessions, not permanent universal constants.

| Campaign band | Target ordinary inputs | Max event gap | Effective-decision cadence | Neutral retraversal | Typical rescue marginal | Target reasoning score | Max friction score |
|---|---:|---:|---:|---:|---:|---:|---:|
| Ch. 1 | 10–20 | 8 | One clear optional branch | 0–5% | 4–8 | 2–4 | 3 |
| Ch. 2–3 | 25–55 | 12 | ≥1 per 15 inputs | ≤10% | 4–12 | 5–8 | 4 |
| Ch. 4–6 | 55–95 | 16 | ≥1 per 18 inputs | ≤15% | 4–15 | 8–11 | 5 |
| Ch. 7–8 | 80–120 | 20 | ≥1 per 20 inputs | ≤20% | 6–18; one stretch ≤25 | 11–13 | 6 |
| Ch. 9–12 | 100–170 | 25 | ≥1 per 20 inputs | 10–30%; neutral ≤15% | 6–20; one marquee ≤30 | 12–15 | 8 |
| Ch. 13 portal reset | 55–80 | 15 | First portal by input 5–8 | ≤25% | 4–12 | 8–11 | 5 |
| Ch. 14–15 | 90–190 | 25 | ≥1 per 20 inputs | 10–30%; neutral ≤15% | 6–25 | 13–17 | 8 |
| Ch. 16 | 160–220 | 25 | ≥8 effective decisions total | 15–30%; neutral ≤15% | 6–25, all optional | 16–18 | 9 |

The intentional drop at chapter 13 is good pedagogy: a new spatial verb gets a short, legible introduction before rising to combination and mastery. Difficulty need not increase monotonically every chapter; it should rise within each mechanic arc while friction remains bounded.

### 6.5 Target difficulty curve

| Ch. | Current curve diagnosis | Target cognitive beat | Target friction change |
|---:|---|---|---|
| 1 | Low inference, high onboarding load | Move, identify star, choose rescue or exit | Remove camera/map stack and halve travel |
| 2 | Appropriate compare/match chain | Equal Power + reusable matching key | Add map only after movement success |
| 3 | Too many labels, little real return | Visible safe blocker, short capability return | Split/sequence instruction, shorten |
| 4 | Moderate branch count, corridor-heavy | Two-order sorting hub | Compact branches |
| 5 | Good event density, low branching | Consequential lava/lock choice | Remove redundant corridor |
| 6 | Long required chain, one choice | Three-spoke dependency memory | Replace linear travel with hub return |
| 7 | Strong optional inference | Predict jump and voluntarily revisit guardian | Keep challenge, reduce modal repeat |
| 8 | Many events, few choices | Track a compact changing hub | Shorten neutral chain |
| 9 | Jump mastery obscured by endurance | Compare 2–3 landing outcomes | Cut 25–35%, cap gaps |
| 10 | Exploration lesson arrives late | Model rooms/shortcuts and landmarks | Cut long rescue tail and neutral return |
| 11 | Relevant clue buried in 235 inputs | Select one clue among meaningful alternatives | Reopen loops with shortcuts |
| 12 | Good new hazard, weak optionality | Observe poison answer, recall combined rules | Give rescues real branches; cap gap |
| 13 | Portal lesson delayed | One immediate out-and-back portal inference | Cut to 55–80; main hint prioritizes portal |
| 14 | Good relay idea, extreme rescue tails | Revise route across distinct portal gardens | Remove empty opener; cap one stretch rescue |
| 15 | Genuine integration plus long travel | Plan portal hub and three changed wings | Add wing shortcuts; cut to 130–190 |
| 16 | Linear 411-input endurance | Plan visible boss, Power tiers, and shortcut returns | Full topology redesign; optional rescues |

## 7. Per-level puzzle, friction, rescue, and hint plan

The changes below are layout/rule requirements, not final ASCII maps. Each changed map needs a one-page paper route sketch, engine-replayed metric report, and approval before it replaces an authored definition.

| Ch. | Puzzle intent and first-time comprehension | Complexity and route quality | Friction and landmarking | Rescue / hint analysis | Implementation-ready direction and acceptance |
|---:|---|---|---|---|---|
| 1 | Teach “move Ame to the star”; demonstrate that a friend is a choice, not a gate. Current first view teaches camera, fog, map, percentage, inventory, rescue, and controls together. | O/P 26/34; one decision; 25-input event gap. Length is disproportionate to its single inference. | Starting sword is clear, but exit is not part of one stable mental map. | Kitten costs +8. Current post-sword main hint talks about the optional Kitten before the star. | Preferred ≤6×6 full-board map, O 10–20, exit visible, one 4–8-input rescue branch, no camera/minimap. Main hint names star; Rescue clue names Kitten. Weapon either within 3 inputs with one-line purpose or deferred to ch. 2. |
| 2 | Teach weapon → equal Power → reusable matching key → door. This is the first strong causal chain. | O/P 37/53, four decisions, short event gap 8. Preserve the basic chain. | Camera/minimap can now be introduced after the first successful move. Weapon acquisition should remain within 3–5 inputs. | Hedgehog +12 and Fox +4 give two optional sizes. Hint correctly starts with weapon. | Keep topology recognizable; make first camera cue non-modal and show one gate and its matching key shape/colour within an early reveal cycle. O 25–45, gap ≤12. |
| 3 | Teach that a stronger foe is safe and revisitable after Power growth, then use Boots for water. Current chapter also introduces potion, blue lock, and multiple rescue choices. | O/P 64/80, two decisions, seven critical events, but no meaningful repeated coordinate on the shortest path despite “plan and return.” | Exit and multiple blockers are visible, which is useful; the lesson needs a shorter causal loop. | Three rescues cost +6/+8/+8. Required and optional guidance must remain separate. | Build a visible Power blocker with a nearby alternate branch and a concise revisit; place Boots/water as the second beat. Reduce simultaneous prose labels, O 40–60, ≥3 decisions, gap ≤12. |
| 4 | “Sort requirements”: remember which of two branches answers which visible gate. | O/P 80/92, five decisions, nine critical events, no retraversal. Adequate topology, excess corridor. | Use a visually and functionally distinct central hub; do not rely on decorative art alone. | All rescues are +4, readable small detours. Hint should reference the discovered matching gate/key, not a direction string. | Compact to a two-branch key hub that permits either colour branch first and visibly returns to paired gates. O 55–80, ≥5 decisions, gap ≤16. |
| 5 | Predict that Boots solve lava just as they solved water while maintaining key/Power planning. | O/P 69/77, ten events but two decisions. The new inference is good; route agency is low. | Lava itself is a strong functional landmark. | Marginals +4/+2/+4 are small but valid; avoid placing a rescue directly on the required line. | Preserve lava introduction and current event density. Add one consequential order choice or alternate return and remove a redundant corridor. O 55–80, ≥4 decisions. |
| 6 | Break a three-colour, two-hazard task into remembered subgoals. | O/P 92/104, eleven events, one decision coordinate. This is sequencing without planning. | A three-spoke hub can make each key answer a previously seen destination. | Rescue marginals +12/+6/+2 are uneven but tolerable; +2 needs a clearer optional branch or should move. | Rebuild as a landmarked three-spoke gate hub. Each spoke changes access or opens a short return. O 70–100, ≥5 decisions, neutral retraversal ≤15%. |
| 7 | Introduce complete-run Spring Boots and teach persistence through a voluntary Power 9 guardian revisit. | O/P 117/150; seven decision visits, 13 events, tiny retraversal. This is the best current optional Power puzzle. | Mixed hazards are readable; modal repetition interrupts deliberate testing. | Rescue premium +33 with marginals +12/+13/+8: a good stretch band. Main hint should teach landing; Rescue clue stays separate. | Preserve the guardian, safe comparison, clue, and return structure. Put first complete jump within an early supported chamber; convert learned repeat blockers to non-modal feedback. O 90–120, gap ≤20. |
| 8 | Recall all learned traversal and keep track of a changing state chain. | O/P 120/140; 15 critical events but four unique decision coordinates. | A recurring hub/checklist is more memorable than a long corridor chain. | +20 total, +12/+4/+4. Fine if each branch is visibly optional. | Compact around a hub whose exits visibly change as tools/keys are gained. Keep combined-rule demand, add ≥6 effective choices, avoid adding a new mechanic. |
| 9 | Master Spring Boots by predicting complete-run landing consequences. | O/P 193/217; 26.3% retraversal; gap 44; Bare 92→full 193. Travel hides the intended inference. | Hole runs should be functional landmarks with visible or inferable landing outcomes. | +24, marginals +8/+4/+12: reasonable. Hint must never imply stopping on a middle hole. | Cut route 25–35%. Use 2–3 short jump-choice chambers with distinct landing consequences and a compact reconnect. Target O 120–155, gap ≤20, neutral retraversal <15%, ≥1 decision/20 inputs. |
| 10 | Teach room/landmark-based exploration and a model of how prerequisites reopen space. | O/P 173/216; 32.9% retraversal; gap 61; Bare 56→full 173. | The chapter needs functional room identities and state-opened shortcuts; map systems are already familiar. | Perfect +43; one Fox costs +38, turning optional curiosity into an endurance surcharge. | Preserve room/map lesson and treasure chamber. Open shortcuts after prerequisites, cap gap 25, total retraversal <30%, neutral <15%. Move or reconnect the Fox branch so no normal rescue exceeds +30. O 120–165. |
| 11 | Distinguish relevant from tempting but optional clues. | O/P 235/245; 18 decision visits/10 coords, 21.2% retraversal; there is real choice, submerged in length. | A central spine with loops can make return knowledge visible. Retain one honest treasure-only branch as a deliberate irrelevant clue. | Perfect only +10; rescue marginals +2/+4/+2/+2 are almost incidental rather than choices. | Rebuild loops so completion of each prerequisite opens a short connector. Give 2–3 rescues actual 6–15-input detours. Target O 130–170, gap ≤25, ≥10 effective decisions. |
| 12 | Observe poison, infer Antidote Leaf, then recall combined traversal. | O/P 231/241; 21 visits/13 coords; gap 49. New rule introduction is delayed by bulk. | Poison and Leaf are strong functional landmarks if revealed in a fair question/answer order. | Five rescues each cost +2, so “optional” has almost no route meaning. | Put the first poison question and Leaf answer within the first 8–12 inputs/reveal cycle, then one supported crossing. Give later rescues modest branches (6–20), cap gap 25, O 130–170. |
| 13 | Introduce persistent paired portals with a simple connection, then a short return. | O/P 105/117; first portal at input 20; 31.7% retraversal; Bare 36→full 105. | The paired symbol is the landmark; decorative direction arrows are not required. | +12 is appropriate, but current main hint prioritizes Bunny over the portal. | Put first portal within 5–8 inputs, teach one short out-and-back, then a compact key loop. Target O 55–80, gap ≤15, total retraversal <25%. Main hint names discovered portal relation; Rescue clue owns Bunny. |
| 14 | Practise revising a plan through a three-pair portal relay. | O/P 103/177; first event 28; 21% retraversal. Core relay can be strong. | Give each portal garden a functional purpose—key, capability, shortcut, or optional stretch—rather than empty approach. | Perfect +74; two rescues cost +62/+66, far beyond a reasonable optional premium. Initial hint again names Bunny. | Delete the empty opener, build three compact distinct gardens, and cap at one marquee rescue of 20–30; others 6–18. Target O 90–130, P ≤160, gap ≤20. |
| 15 | Master portals by combining three pairs with prior traversal and key rules. | O/P 231/260; 21 visits/13 coords; 23.7% retraversal; Bare 122→full 231. | A portal hub with one shortcut per completed wing makes changed-state return satisfying. | Rescue marginals +16/+12/+4/+5/+1; +1 is effectively forced adjacency and should become a branch or clearly incidental encounter. | Use a central portal hub and 3 compact wings; each wing returns by a newly opened shortcut. Target O 130–190, gap ≤25, total retraversal 15–30% with neutral ≤15%, reasoning 15–17. |
| 16 | Demonstrate mastery by seeing the Power 99 boss early, planning a tiered growth route, and choosing optional friends before the final return. | O=P 411; 28 critical events, zero decisions, 49.5% retraversal, gap 195, Bare 4→411. Current challenge is corridor endurance. | Boss is a useful starting landmark, but the long ladder lacks changing hubs/shortcuts. | Automated tests explicitly special-case all five rescues as mandatory. This contradicts runtime “Optional adventure” and automatically grants perfect rewards. | High-risk full redesign. Place boss near the start; create 3–4 compact, order-aware loops using a clear 2→4→8→16→32→64 progression and about 10–12 purposeful encounters rather than 19. Each tier opens a shortcut back toward the boss. Put all 4–5 rescues on optional branches. Require a zero-rescue ordinary solution and exact-all-rescue perfect solution. Target O 160–220, gap ≤25, ≥8 decisions, total retraversal 15–30%, neutral ≤15%. |

### 7.1 Finale approval gate

The current finale behaviour is intentional in the narrow sense that `src/game/levels.test.ts` explicitly special-cases `rainbow-power-parade`, expects the ordinary solver to rescue all five animals, asserts more than 300 inputs, and records 19 enemies. It is not consistent with the campaign’s general rescue contract or with the player-facing “Optional adventure” label. Ordinary and perfect routes are both 411 inputs. Audit variants that left only one rescue at a time still found that animal unavoidable.

The recommended acceptance rule is unambiguous: every authored ordinary solution mode must be able to win while rescuing zero animals, and perfect mode must rescue the current total. If narrative ownership requests one required finale rescue, that becomes a separately approved mechanic exception with pre-play disclosure, dedicated story copy, and reward logic that excludes the required rescue from “perfect.” Five forced rescues should not be approved.

## 8. Evidence-ranked recommendations by implementation risk

Risk describes regression/migration/content exposure, not importance. Evidence rank uses §2.5. Items within each band are ordered by recommended sequence.

### 8.1 Low-risk changes

| ID | Recommendation | Evidence | Why now | Acceptance signal |
|---|---|---|---|---|
| L1 | Replace future-shop Gold copy and future-utility implication with present-tense achievement/curiosity meaning; show Gold and Science totals consistently. | E1 + E2 | Existing copy creates expectation debt; no arithmetic change is needed. | In child debrief, <20% ask what Gold can buy; every displayed total matches persisted totals. |
| L2 | State once before play and consistently at victory: the star completes the maze; friends are optional adventures. | E1 + E2 | Finale/current hints make optionality ambiguous. | ≥85% of child participants can explain that leaving a friend does not fail the maze. |
| L3 | Split “Path hint” from “Rescue clue” and remove animals/treasures from required-hint priority. | E1 + E2 | Reproduced in ch. 13–14; no map mutation. | No main hint selects an optional object; portal tutorial’s first path hint concerns the portal path. |
| L4 | Convert repeat blocker contacts to throttled, non-modal, screen-reader-live feedback; keep an explicit first teach and the exact safe Power equation. | E1 + E2 | Repeated full modals break flow while teaching nothing new. | Same learned blocker cannot open a modal loop; ≥90% can name the missing requirement. |
| L5 | Add debug-only exact Surprise seed/options display and entry, plus three fixed regression seeds. | E1 | Current timestamp seeds cannot be reproduced from tester UI. | A tester can copy a seed, regenerate byte-equivalent gameplay content, and attach it to a bug. |
| L6 | Add an offline campaign metric report and keep input count separate from movement steps. | E1 + E3 | Current tests freeze route lengths but do not explain route quality. | CI artifact/table reports all canonical counters for 16 levels without altering game state. |
| L7 | Correct story CTA logic so Surprise-only activity does not label an untouched campaign “Continue”; disclose that fresh Surprise runs are not saved after closing. | E1 | Current progression and live-session behaviour differ from the label. | New profile + Surprise completion still offers the correct chapter-1 campaign CTA; disclosure matches persistence. |
| L8 | Surface storage write failure as non-blocking accessible status with retry; preserve play state. | E1 + E2 | App currently ignores safe write failure returns. | Forced storage failure is visible, never claims success, and does not trap input. |
| L9 | Correct README/architecture/story metadata after implementation, including 16 dimensions, hint authority, species count, and historical audit status. | E1 | Documentation currently contradicts source. | Docs match source and generated invariants; historical facts remain labelled historical. |

### 8.2 Medium-risk changes

| ID | Recommendation | Evidence | Dependency / risk | Acceptance signal |
|---|---|---|---|---|
| M1 | Add stable semantic authored object IDs, monotonic content revisions, and gameplay fingerprints before editing maps. | E1 | Persistence schema and parser change; must ship/migrate before topology changes. | Same-kind insert/reorder cannot reinterpret an active snapshot; revision mismatch preserves durable progress. |
| M2 | Add shared engine-transition reachability/search and make hints consume it. | E1 + E2 | State projection and performance need careful tests. | Every emitted route replays through `movePlayer`; portal and 1/2/3-hole fixtures pass. |
| M3 | Restrict movement assistance to unambiguous ordinary floor and add all-input parity tests. | E1 + E2 | Feel can change for pointer users; validate on touch/controller. | Assist never chooses exit, portal, pickup, rescue, treasure, gate, enemy, hazard, or hole. |
| M4 | Replace chapter 1 with the ≤6×6 micro-maze and move camera/map introduction to chapter 2. | E1 + E2 + H | First content migration; may affect story pacing and records. | Ch. 1 meets §6 budgets and child comprehension targets; old active run is safely handled. |
| M5 | Compact chapters 3–8 around visible dependency hubs while retaining their mechanic order. | E1 + E2 + H | Multiple exact-route and object-order assertions change. | Each level meets its row in §7; reasoning stays level or rises while neutral travel falls. |
| M6 | Rebuild portal introduction/practice in chapters 13–14; main hints use portal semantics. | E1 + E2 + H | Portal route/state tests and rescue records change. | First ch. 13 portal by input 5–8; ch. 14 perfect premium ≤70 with only one stretch rescue ≤30. |
| M7 | Store versioned Surprise reconstruction metadata and bound recent-record presentation without deleting lifetime aggregates. | E1 + H | Progress migration and privacy/copy decisions. | Same stored seed/version/options reconstructs the level; retention migration loses no lifetime count. |
| M8 | If child testing shows totals need stronger meaning, add non-consumptive sticker/badge milestones using existing achievement patterns. | E1 + E2 + H | Could create pressure or farming; requires separate evidence review. | Children understand milestone as recognition, not spendable currency; no price/shop concepts. |

### 8.3 High-risk changes and rejected expansion

| ID | Recommendation / decision | Evidence | Approval gate | Acceptance signal |
|---|---|---|---|---|
| H1 | Reshape chapters 9–12 and 15 to increase reasoning density, shorten neutral travel, and reopen loops through state-earned shortcuts. | E1 + E2 + H | Approve per-level paper route and metric delta; migrate records. | All five meet §6/§7 budgets and solver contracts; child validation shows no loss of comprehension. |
| H2 | Fully redesign chapter 16 around a visible boss, compact Power-tier loops, shortcuts, and optional rescue branches. | E1 + E2 + H | Separate finale topology/story/reward approval. | Zero-rescue ordinary and all-rescue perfect routes; O 160–220; ≥8 decisions; no forced optional reward. |
| H3 | Persist generated active runs across app restarts. | E1 + H | **Deferred, not recommended in this plan.** Requires storage growth, generator-version retention, and migration design. | Only reconsider with demonstrated player need and a bounded storage policy. |
| H4 | Change the global FOV threshold or exploration model. | E1 + H | **Rejected for now.** Solve chapter-1 sequencing locally first. | Reopen only if child tests show a campaign-wide orientation failure after local fixes. |
| H5 | Add a spend economy/shop for Gold or Science. | E1 + E2 | **Rejected.** Material scope expansion and new expectation/pressure loop. | Requires a separate product specification, content budget, ethical review, and explicit approval. |

## 9. Onboarding and mechanic pedagogy

### 9.1 Teaching pattern

Every mechanic family should follow a four-beat sequence:

1. **Question:** the player sees a goal or safe blocker and has enough stable context to name the problem.
2. **Supported answer:** the relevant capability is nearby or already discovered; feedback marks the critical relation, not the full route.
3. **Unaided recall:** the mechanic returns after at least one chapter without repeating its full tutorial.
4. **Combination/mastery:** the mechanic interacts with a second known rule or transfers to a new spatial arrangement.

Support fades by chapter and by demonstrated success. A player who has already crossed water twice should get a short “Boots cross water” status on a mistaken contact, not the original tutorial. A player on a new device/profile may still request the review from Help.

### 9.2 Proposed mechanic arc

- **Ch. 1–3, foundations:** movement/goal/optional rescue; then camera/map + weapon/equal combat/key; then safe Power blocker and Boots/water. Do not teach camera in prose until it actually appears.
- **Ch. 4–6, sorting and hazards:** practise reusable keys and functional hubs; introduce lava as a transfer of Boots; combine three key colours without longer corridors.
- **Ch. 7–9, jumps:** introduce full-run Spring Boots; recall them in a changing hub; master landing prediction in short chambers.
- **Ch. 10–12, exploration and observation:** use already-known map systems for room models and relevant clues; introduce poison/Leaf as the one new family in ch. 12.
- **Ch. 13–15, portals:** short introduction, structured relay practice, then integration mastery. Portals remain persistent; never add one-use or stateful pairing rules.
- **Ch. 16, synthesis:** no new verb. Use visible Power milestones, compact returns, and optional mastery branches.

### 9.3 Cognitive-load rules

- One new rule family per chapter. New colour/name variants of an established reusable key are not new mechanics, but still add visual-memory load.
- Introduce no more than two new persistent facts before the next successful application.
- Keep story cards about motivation and tone; put current objective/prerequisite reminders in revisitable Help.
- Never require reading a transient modal to recover a rule. Every objective, key capability, Power comparison, and portal-pair explanation must be reviewable.
- A first-time teaching moment may briefly stop input when the concept cannot be safely inferred. Repeated known-concept feedback should not.

## 10. Engine-consistent hints and reachability

### 10.1 Architectural direction

Create a pure game module, tentatively `src/game/reachability.ts`, and move shared state-signature/search primitives out of `solver.ts` as needed. Both solver and hints must enumerate the four deterministic directions by calling `movePlayer(level, state, direction)`. Do not duplicate terrain, door, combat, hole, landing, or portal rules.

The search projection must include every fact that can change traversal: coordinate, Power, weapon/capabilities, keys, resolved enemies, opened/resolved gates, and other persistent rule state. Rescue/treasure/discovery state may be excluded from a required-path visited signature because it does not change traversal, while remaining available to a target predicate. The final route is always replayed from the exact input state before it is returned.

Recommended pure interfaces:

```ts
type HintGoal =
  | { kind: "required-path" }
  | { kind: "rescue"; animalId?: string };

type HintTier = 1 | 2 | 3 | 4;

interface HintPlan {
  goal: HintGoal;
  tier: HintTier;
  target: { kind: string; objectId?: string; coordinate?: Coordinate };
  reason: string;              // semantic copy key, not authored free text
  landmarkIds: string[];       // only discovered landmarks below tier 4
  route: Direction[];          // engine-replayed; UI need not display it
  firstDecisionIndex: number;
}

interface ReachabilityResult {
  reachableStates: ReadonlyMap<string, SearchNode>;
  pathTo(predicate: (state: GameState) => boolean): Direction[] | null;
}
```

Names may change during implementation, but the separation of goal, tier, semantic target, and replayable route is required.

### 10.2 Required-path target selection

1. Search from the current `GameState` for an ordinary victory using the solver’s actual transitions and optional-rescue policy.
2. Identify the first unresolved **required** consequential event on a shortest viable route or the first effective decision frontier when several viable routes exist.
3. Exclude animals and treasures from required-path candidates. If an ordinary route can only pass through a rescue, fail the content contract rather than silently treating the rescue as required.
4. Prefer already discovered functional landmarks at tiers 1–3. Never reveal an exact fogged coordinate merely because the object type has high static priority.
5. If multiple shortest routes differ, describe the shared goal/condition or nearest consequential junction rather than choosing a hidden arbitrary direction.
6. Before returning, replay the complete route through `movePlayer`; reject any mismatch in final state or target predicate.

### 10.3 Progressive hint ladder

- **Tier 1 — reorient:** restate the active required goal and the condition blocking it: “The star is the way out. Which open branch have you not tried?”
- **Tier 2 — connect a rule:** name the capability/comparison and a discovered functional landmark: “Spring Boots cross the whole row of holes; check where Ame would land.”
- **Tier 3 — narrow the region/decision:** identify the next consequential discovered junction or map region, not every step: “The Rose portal near the pond connects to the garden side.”
- **Tier 4 — show a segment:** only after explicit Help or continued no-progress, offer an exact engine-valid first segment/marker. Mark the capability or junction, not a distant hidden object, unless the player opts into an exact answer.

Tier state is per semantic goal and progress epoch. It de-escalates or resets after acquiring a relevant capability/key, resolving an enemy/door, reaching a new region, revealing a functional landmark, or making the hinted decision. Repeatedly opening Help may advance a tier; merely waiting should not auto-solve the puzzle.

“Rescue clue” uses the same ladder and search, but only after the player chooses that goal. Its copy always says that the star remains sufficient for completion.

### 10.4 Reachability acceptance fixtures

- Required target beyond a portal is found; portal entrance alone is not mistaken for arrival.
- Both portal endpoints remain usable; route replay can traverse a pair more than once when needed.
- One-, two-, and three-hole Spring runs land on the first non-hole square and cannot stop or turn mid-run.
- A run with no legal landing is unreachable.
- Landing on a door, equal/strong enemy, pickup, rescue, treasure, portal, or exit has exactly the engine result.
- Boots/Leaf/keys/weapon/Power gates match engine outcomes.
- A portal-only prerequisite, a middle-hole branch, and a portal-after-jump combination each have regression fixtures.
- Every plan returned by hint search replays to its stated target from the saved current state.
- Search returns within an agreed budget on all authored states and representative 23×23 generated seeds; performance results are deterministic and not frame-timed.

## 11. Progressive feedback, recovery, and controls

### 11.1 Blocker feedback state machine

Track contact by semantic requirement (for example `weapon`, `boots`, `leaf`, `key:red`, or `power:9`) within a **progress epoch**, not by raw coordinate alone.

| State | Player feedback | Input/focus rule |
|---|---|---|
| First encounter with a genuinely new mechanic | Compact explicit teaching card or anchored explanation; show exact safe relation, such as `Ame 6 < Pebble Golem 9` | One intentional pause is allowed; focus returns to board predictably; held movement is cancelled |
| Learned mechanic, first contact this epoch | Short anchored status plus polite audio/live-region cue: “Need Sunny Sun Key” or the Power equation | No modal; one announcement per press/hold; player remains in place |
| Second deliberate contact without progress | Repeat capability reminder and offer Path hint | No automatic focus move; no hidden-map reveal |
| Third contact or explicit Help | Tier-3 region clue, then opt-in tier-4 reachable marker/segment | Marker is engine-consistent and respects reduced motion; close never resumes a stale held input |

Start a new epoch only after meaningful progress: relevant item/key acquisition, enemy/door resolution, entry to a new functional region, or discovery of a relevant landmark. Walking away and immediately back does not erase the count. Collecting an unrelated optional reward does not falsely reset it.

### 11.2 Recovery requirements

- Blocked movement never mutates position, Power, inventory, rescue state, or route record.
- Stronger-enemy feedback always says Ame is safe; no red damage convention or loss wording.
- The current requirement and discovered clues remain reviewable in Help and in screen-reader spatial text.
- A guided marker clears when the semantic goal is resolved or becomes irrelevant, not only when one hard-coded object ID is collected.
- No blocker modal may repeat under a held key/stick. Release or a new deliberate press is required for another feedback event.
- Returning from any explanatory surface restores logical board focus and does not move Ame.
- Save failure, hint, blocker, and reward announcements use distinct polite/urgent live-region priorities so they do not overwrite each other.

### 11.3 Input-assistance contract

Movement assistance may select a neighbouring tile only when all of the following are true:

1. The requested direction is imprecise but the intended corridor continuation is unambiguous.
2. The selected tile is ordinary, already traversable floor with no unresolved object or transition.
3. The alternative does not cross water, lava, poison, a hole run, or a portal boundary.
4. The selection cannot exit, rescue, collect, fight, open a gate, earn a reward, or reveal a hidden choice.
5. Keyboard, D-pad, touch, pointer, and controller paths produce the same engine request once a direction is resolved.

Keep the current 320 ms initial release window and 260→160 ms repeat curve until the controls track’s physical-device tests produce contrary evidence. Log accidental double moves and assisted-choice corrections in child sessions; do not tune cadence from adult desktop play alone.

### 11.4 Accessibility and spatial-interface requirements

- Preserve the textual four-direction spatial description and discovered-landmark list; update both from the same semantic state as the visual board.
- Objectives, prerequisite explanations, and hint history must be revisitable without depending on memory of a dismissed card.
- Never encode key pairing, portal pairing, hazard requirement, required versus optional, or Power comparison by colour, motion, light, or sound alone.
- The 6×6 viewport must always provide a stable orientation statement: Ame position, discovered goal direction/region when appropriate, and adjacent actionable blockers.
- Provide equivalent Help, hint-tier, and recovery actions for keyboard, touch, pointer, controller, and assistive technology.
- Reduced motion removes pulsing/travel animation but leaves a static marker, text label, and semantic state.
- Validate at 200% zoom, narrow windows, keyboard-only, screen reader, reduced motion, high-contrast/forced-colours where supported, and controller-only before release.

## 12. Optional goals, rewards, and replayability

### 12.1 Optional-goal contract

The campaign should communicate one stable hierarchy:

1. **Required:** reach the star. Current required prerequisites belong to the Path objective.
2. **Optional:** rescue any friends the player chooses. The level remains a success with zero.
3. **Optional discovery:** Gold and Science treasures reward curiosity but never gate story progression.
4. **Replay mastery:** improve current-layout step record, try a perfect-rescue route, or replay/enter a Surprise seed.

The objective area may say “Reach the star” and “Optional: 0/3 friends” as separate semantic values. It must not merge them into a checklist that visually implies all are required. Victory celebrates what happened, offers missed friends as “another adventure,” and never labels an ordinary clear incomplete.

### 12.2 Present-tense reward meaning

Recommended copy intent, with final wording owned by the narrative/UI copy review:

- **Gold:** “A keepsake total for solved mazes, rescues, and discoveries.”
- **Science:** “A record of curious side paths and things Ame discovered.”

Show gained amount and resulting total for both at victory, and show both totals in the Adventure Book. Do not promise spending. Keep the existing numeric fields and deterministic reward calculation in the low-risk phase; arithmetic changes require a separate balance study.

Perfect-rescue medals remain distinct-maze accomplishments. Species rescue totals can continue recording joyful repeated rescues, but any badge copy must make clear that replays count. Do not surface the hidden loss-sensitive streak until child testing demonstrates that it motivates without pressure; the default decision is to leave it unsurfaced.

### 12.3 Replay and record fairness

- A current-layout step record is comparable only within the same content revision. Preserve historical accomplishments, but do not let an old route length suppress a new record.
- Replays never change chapter unlock order beyond the existing idempotent next-chapter rule.
- Tester runs mutate no progress, rewards, unlocks, active session, or records.
- Generated completions never unlock campaign chapters.
- “Continue” means resume a real active run or continue the authored story; Surprise-only history must not impersonate campaign progress.
- A generated maze’s deterministic identity includes generator version, seed, difficulty, and chosen size.

### 12.4 Surprise Maze quality and reproducibility

Current `surprise-v5` generation correctly uses seed-derived PRNG streams (with gameplay and visual streams separated), stays within odd sizes 9–23 and the absolute 24 cap, retries at most 50 candidate constructions, and returns only levels with ordinary zero-rescue and all-rescue solutions. Preserve those properties. Current tests establish same-run determinism but do not freeze representative cross-release gameplay digests, which is why fixed versioned seeds are part of the plan.

Add two quality layers:

1. **Debug reproducibility:** show/accept exact version, seed, difficulty, and size; attach them to local test reports.
2. **Generated challenge gates:** sample fixed seeds at each difficulty and report decision cadence, event gap, neutral retraversal, first functional landmark/choice, rescue premiums, and solve performance. These are generator QA distributions, not hard rejection of every unusual seed.

Suggested generated acceptance targets:

- 100% of returned samples retain ordinary zero-rescue and perfect-rescue solver validity.
- Same version/seed/options produce identical topology, objects, treasure values, and ID across repeated runs and supported platforms.
- At least 90% of fixed/session samples expose an actionable functional landmark or effective choice within eight directional inputs; starting views with neither are flagged for review.
- No returned sample exceeds the absolute cap or configured current size band.
- Controlled p50/p95 generation and solve time remain within an agreed UI/test budget; synchronous generation must not create an unexplained frozen state.
- Intentional generator algorithm changes bump the generator version/identity and update fixed golden digests; visual-only randomness remains isolated from gameplay identity.

Medium-risk replay improvement: store version, seed, difficulty, size, and completion timestamp for a bounded set of recent generated records so a player/tester can reconstruct a maze. Preserve lifetime aggregate counts separately. Do not delete existing unbounded records until a migration and retention policy is approved.

## 13. Save, migration, and object-identity plan

### 13.1 Stable authored identity

Before the first topology or object move, extend `LevelDefinition` with explicit authored content identity:

```ts
interface LevelDefinition {
  // existing fields...
  contentRevision: string;       // monotonic, never reused after release
  gameplayFingerprint: string;   // deterministic topology/object/rule digest
  objectIds: Readonly<Record<CoordinateKey, string>>;
}
```

The exact representation can differ, but every authored stateful object must receive a semantic ID such as `little-star.rescue.kitten` or `finale.enemy.power-32-east`. Moving that object preserves its ID. Changing its gameplay identity requires a new ID. IDs must describe the game role, not an asset filename, colour variant, animation, or row-major position.

Parsing an authored map should fail in development/test when a stateful object lacks an explicit ID, two IDs collide, an ID maps to the wrong kind, or a mapping points to an empty coordinate. Generated IDs remain versioned and seed-derived; do not hand-author them.

The fingerprint is calculated from all gameplay-relevant data: dimensions, terrain, start/exit, object kind and rule values, portal pairing, content revision, and any per-level exploration/rule flags. Exclude purely visual theme data so an art-only update does not invalidate a run. Tests should snapshot the fingerprint; an intentional gameplay edit updates the revision and expected digest together.

### 13.2 Active-run schema

Introduce an active-run schema that stores `levelId`, `contentRevision`, and `gameplayFingerprint` beside the state and revealed coordinates. On load:

1. Validate schema and semantic object IDs.
2. Compare revision and fingerprint with the current authored definition.
3. If both match, apply the state and reveal validation.
4. If either differs, discard **only** the active run, retain all durable progress/rewards/unlocks, and show a gentle non-modal message: “This maze was updated, so Ame restarted it. Your Adventure Book is safe.”

Never try to place the player coordinate into a changed topology. Never reuse a released revision for a rollback; if old geometry is restored after release, ship it as a new revision so stale states cannot masquerade as current.

### 13.3 Safe rollout sequence

The safest release sequence is two-stage:

1. **Identity release, no map edits:** add stable IDs/revisions/fingerprints and migrate current row-major IDs while topology is unchanged. Build an explicit baseline ID-to-semantic-ID table per authored level and test every stateful object.
2. **Content releases:** edit one approved level/group at a time, bump its revision, and let any remaining incompatible active run restart safely.

If two releases are impossible, do not guess at old same-kind IDs. Invalidate legacy active authored runs during the first content release while preserving durable progress, and disclose the one-time restart. This is less seamless but safer than a silent wrong rescue or enemy state.

### 13.4 Route-dependent progress schema

Add content revision to route-dependent records. A versioned record should distinguish:

- lifetime clear/unlock and cumulative reward/rescue achievements, which survive layout changes;
- current-revision best inputs/steps/Power/rescue count;
- historical best metadata, which may be displayed as “earlier maze version” but cannot compete with the current route;
- current-revision perfect-rescue status versus historical perfect completion.

Do not clear Gold, Science, chapter unlocks, distinct perfect-maze medals already earned, stickers, species totals, or lifetime completions when a layout changes. Do not carry an old `bestSteps` minimum or old perfect flag into the new layout’s competitive record. Bump the progress schema and update read/write/reset allow-lists and migration tests together.

### 13.5 Existing persistence edge cases to fix

- Active validation currently compares resolved-object count with movement steps. Stationary combat can resolve state without increasing the movement counter; replace that assumption with valid state/object checks or engine replay evidence.
- Navigation’s unsaved-run protection relies on `steps > 0`. A stationary state change at zero movement can still make a run dirty; derive a true dirty predicate from state/reveal divergence rather than the counter alone.
- A save write can fail safely but the App ignores the result. Expose a non-blocking status and retry path.
- Adding/removing animals can make historical `perfectRescue` stale. Current-revision perfect status must be recalculated against the revision’s exact semantic animal IDs.
- Old generated records do not contain reconstruction metadata. Migration must preserve them as historical aggregate/summary records rather than inventing seeds.

### 13.6 Migration acceptance

- A fixture that inserts a same-kind object earlier in row-major order cannot redirect a saved rescue, enemy, pickup, or door state.
- A moved semantic object keeps the correct state when topology/revision is unchanged in a migration fixture.
- A topology or fingerprint mismatch discards only the active run and preserves byte-equivalent durable progress after reserialization.
- Current-layout best and perfect status start fresh where required; historical completion remains visible/credited.
- Legacy v1/v2/v3 progress and active-run fixtures either migrate deterministically or fail closed with the documented narrow reset.
- Reset still removes every current and migrated persistence key, and tester/generated isolation remains intact.

## 14. Exact implementation surface and solver expectations

Not every file belongs in one change. The table defines ownership and expected impact so phases can be reviewed independently.

| File | Planned responsibility | Required tests / notes |
|---|---|---|
| `src/game/types.ts` | Stable object/content identity types; optional mechanic-lifecycle metadata; structured semantic target types if game-owned | Type fixtures; no new combat/equipment variants |
| `src/game/engine.ts` | Remain the sole movement authority; expose only a pure transition/event classification helper if sharing requires it | Existing rule suite unchanged; add landing-object and transition-event fixtures rather than duplicating logic |
| `src/game/levels.ts` | Stable semantic authored IDs, revisions/fingerprints, then approved ASCII/topology changes | `src/game/levels.test.ts`: identity completeness/uniqueness, route budgets, content digests, critical events, zero-rescue/perfect contracts |
| `src/game/solver.ts` | Share transition search/signature; support explicit rescue constraints/target predicates; report search facts | `src/game/solver.test.ts`: engine replay, zero-rescue and exact-all-rescue modes, forbidden/required object fixtures |
| New `src/game/reachability.ts` | Current-state engine-consistent reachable graph and path reconstruction | New `src/game/reachability.test.ts`: portals, complete hole runs, landing interactions, capability gates, determinism/performance |
| New `src/game/hints.ts` | Pure required/rescue goal selection, tier plan, progress epochs, semantic copy keys | New `src/game/hints.test.ts`: optional exclusion, tier reset/escalation, fog/discovery, portal and Spring targets, replay |
| New `src/game/campaignMetrics.ts` | Offline canonical route/decision/dependency/retraversal/gap/rescue/search report | New `src/game/campaignMetrics.test.ts`: hand-checkable toy maps plus 16-level snapshot/range assertions |
| `src/game/exploration.ts` | Prefer no semantic change: revised ≤6 chapter 1 naturally disables exploration; add scoped policy only if fallback approved | `src/game/exploration.test.ts`: boundary sizes and chapter-specific result; preserve global threshold |
| `src/game/generator.ts` | Preserve deterministic algorithm/bounds; optionally expose reconstruction metadata and quality report inputs | `src/game/generator.test.ts`: fixed versioned digests, bounds, zero/all rescue, representative quality and p50/p95 budget in controlled suite |
| `src/App.tsx` | Consume pure hint/blocker models; separate Path/Rescue; honest optional/reward/Surprise/CTA copy; non-modal recovery/save status | Prefer extracted pure view-model tests; avoid adding a React-test dependency just for this plan |
| New or extracted `src/blockerFeedback.ts` | Pure progress-epoch/contact state machine and semantic feedback result | `src/blockerFeedback.test.ts`: first/repeat/third, progress reset, held input throttle, strong-enemy safety |
| `src/pointerControls.ts` | Restrict assist to ordinary floor; clarify name/contract if shared by all inputs | `src/pointerControls.test.ts`: never auto-select exit/portal/pickup/rescue/treasure/gate/enemy/hazard/hole; prior-direction cases |
| `src/movementControls.ts` | No planned cadence change; integrate deliberate-release semantics if feedback needs it | `src/movementControls.test.ts`: preserve 320 ms and 260→160 ms; no repeat behind modal/status; input parity |
| `src/progress.ts` | Version route records; honest reward labels; optional generated reconstruction metadata; current/historical perfect semantics | `src/progress.test.ts`: all migrations, reward determinism, unlock idempotence, revision records, bounded recent metadata |
| `src/session.ts` | Store/validate revision/fingerprint/semantic IDs; safe active-only invalidation; correct stationary-event validation | `src/session.test.ts`: same-kind collision, mismatch, stationary state, revealed coords, generated/tester rules |
| `src/navigation.ts` | True dirty-run predicate and correct campaign Continue selection | `src/navigation.test.ts`: stationary dirty state, fresh/active/earliest unsolved/v1 fallback, Surprise-only history |
| `src/rescueRecords.ts` | Distinguish current layout from historical species/perfect facts if presentation requires | `src/rescueRecords.test.ts`: species drift and revision drift |
| `src/resetProgress.ts` | Include new schema keys/metadata | `src/resetProgress.test.ts`: current and legacy key coverage |
| `src/story.ts` | Only approved onboarding/finale/optional/reward wording; no new mechanic | `src/story.test.ts`: card length, dismiss/input behaviour, semantic claims match levels |
| `src/game/portalLevelStats.test.ts` | Revised portal route/usage/quality ranges | Keep portal persistence and pairing invariants; replace brittle old lengths only with approved deltas |
| `README.md`, `docs/ARCHITECTURE.md`, `docs/STORY_BIBLE.md`, `docs/PROJECT_AUDIT.md` | Post-implementation authority reconciliation and current metric record | Do not overwrite historical audit sections; label snapshots by commit/revision |

Presentation files such as `src/App.css` and visual assets belong to their companion tracks. This plan may provide state, copy, focus, and accessibility requirements but does not prescribe their layout or appearance.

### 14.1 Solver/content contract for every authored level

1. An engine-replayed ordinary route reaches the exit.
2. An explicit `maxRescues: 0` (or equivalent forbidden-animal predicate) route reaches the exit. “Ordinary” alone is insufficient if its shortest route happens to collect a friend.
3. An engine-replayed perfect route rescues exactly the current semantic animal set and reaches the exit.
4. Every intended required key/equipment/Power fact is proven by a declared necessity test or dependency report; optional objects are not accidentally necessary.
5. Spring paths use complete straight runs with legal landings; portals remain persistent pairs and can be traversed as often as the route requires.
6. No intended ordinary/perfect route resolves a stronger enemy while underpowered, and equal-Power victories remain valid.
7. Mechanic lifecycle metadata contains no mastery before introduction and includes at least one recall after support for every major family.
8. Route inputs, decisions, event gaps, neutral/state-enabled retraversal, rescue premiums, and search effort fall within an approved range or carry a written exception.
9. Exact route lengths are frozen only for final approved layouts. During iteration, use ranges and event-order assertions; record every intentional before/after delta.
10. Finale adds explicit zero-rescue and avoid-each-animal regression tests; perfect must differ from ordinary when animals exist.

### 14.2 Campaign progression/reward contract

- A fresh save unlocks only chapter 1.
- Completing authored chapter `i` unlocks exactly the next chapter, capped at 16; replay is idempotent.
- Generated and tester completions never unlock the authored campaign.
- Continue resumes an actual active run, otherwise selects the earliest unlocked unsolved authored chapter; legacy fallback remains intentional.
- Incomplete rescues never block victory, chapter unlock, or ordinary completion language.
- Tester runs mutate no rewards, records, sessions, rescue totals, or unlocks.
- Gold/Science found in a valid active run survive refresh and bank exactly once at victory.
- Same generated version/seed/options produce the same ID, gameplay, treasure opportunity, and first-clear identity.

## 15. Child-and-adult playtest protocol

This is a usability/game-design protocol, not clinical research. Confirm the intended age/reading range before recruitment. If no narrower product range is documented, recruit across approximately ages 6–10 and include emerging, typical, and confident readers; use a small age-5 exploratory session only with additional adult support and do not merge its results uncritically with older children.

### 15.1 Study structure

Use two complementary rounds:

1. **Formative round:** six children, balanced across age/reading/input familiarity, with one supervising adult each. Iterate only after all six complete the same build.
2. **Validation round:** 12–18 children on the release-candidate build. Include at least four controller-first, four touch/pointer-first, and four keyboard/D-pad sessions where those platforms are in scope.

For later mechanics, do not drop a true novice directly into chapter 16 and call confusion “difficulty.” Use either a longitudinal subset that plays the campaign over 3–4 short sessions or returning children who completed the prerequisite chapters. A cross-sectional participant may receive a prepared profile only after demonstrating the prior mechanic in a two-minute neutral warm-up.

Suggested assignment:

- Every participant: chapters 1–3 and one fixed gentle Surprise seed.
- Jump cohort: chapters 7 and 9.
- Exploration cohort: chapters 10–12.
- Portal cohort: chapters 13–15.
- Returning mastery cohort: chapter 16 and one fixed adventure/great Surprise seed.
- At least four longitudinal participants revisit one previously completed level for step/perfect-rescue replay motivation.

Use a balanced order within cohorts for A/B prototypes; do not compare a first exposure in one version against a replay in another.

### 15.2 Session safety and setup

- Obtain guardian consent and child assent in plain language. Say they can stop, skip, or take a break without consequence.
- Use pseudonymous participant IDs. Do not collect names in gameplay notes. Record video/audio or remote telemetry only with separate explicit consent.
- Limit a session to 35–45 minutes with a break offered at 20 minutes; stop earlier at distress, repeated self-criticism, or loss of interest.
- Record build commit, level content revisions, device, viewport/zoom, input method, accessibility settings, profile state, exact Surprise seed/options, and any known facilitator relationship.
- Use a clean tester profile with reward/progress mutation disabled for prototype comparisons, except when testing save/reward persistence itself.
- Seat the supervising adult where the child can ask for help, but brief them not to point, take the device, or name a solution unless the child requests it or safety requires it.

### 15.3 Facilitator script and intervention scale

Start with: “This is a test of the maze, not a test of you. Some parts may be unclear because we are still making them. Please show me what you think will happen. You can ask for help or stop whenever you want.”

Avoid continuous think-aloud, which adds reading and memory load. Ask at natural pauses or choices: “What are you trying now?” and “What do you think will happen?”

Code every intervention:

- **0:** none.
- **1:** reread visible text or ask a neutral orientation question.
- **2:** remind the child of a known rule without naming the route.
- **3:** give a direct next-goal/route clue.
- **4:** point, take control, or complete an action.

The adult may always intervene for comfort or safety; log it without framing it as failure.

### 15.4 Observation sheet

For each level, timestamp or input-index:

- time to first intentional move and whether it matches the stated goal;
- time/input to identify the exit, first required blocker, and its answer;
- each effective decision, stated prediction, reversal, and empty dead end;
- first use of camera/minimap/landmark list and whether it changes the plan;
- repeated neutral corridor traversal versus state-enabled return;
- accidental double move, unintended corner assist, or unintended interaction;
- blocker contacts, whether the child can name the requirement, and whether feedback interrupts or helps;
- hint open, chosen Path/Rescue goal, tier, resulting decision, and inputs to next progress event;
- rescue/treasure choice and whether the child believes it is required;
- visible frustration/recovery: pause, random movement, repeated same action, negative self-talk, disengagement, renewed plan, or delight;
- adult intervention level/reason and any temptation to intervene unasked;
- completion, ordinary/perfect route, input/movement counts, neutral retraversal, and replay choice.

Do not infer frustration from silence alone. Ask and corroborate.

### 15.5 Child questions

Ask in concrete, non-leading language:

1. “What are you trying to do in this maze?”
2. “What did you think would happen when you moved there?”
3. “What stopped Ame? Is Ame okay?”
4. “What could help with that water/lava/poison/door/enemy/holes?” Use only the blocker encountered.
5. “What does this portal symbol tell you?”
6. “Did the map help you decide, or did it just show where you had been?”
7. “Did the hint help you make a choice? Did it tell too much, too little, or about the wrong thing?”
8. “Do you have to rescue every friend to finish? How do you know?”
9. “What do Gold and Science mean to you? What do you expect to do with them?”
10. “Which part felt like figuring something out? Which part felt like just walking?”
11. “Would you replay this maze? What would you try differently?”
12. Use a simple 1–5 faces scale: “How fun was it?”, “How hard was it?”, and “How proud do you feel?” Keep fun and difficulty separate.

### 15.6 Supervising-adult questions

1. “When did you first want to help? What did you think the child had misunderstood?”
2. “Which text did the child read, skip, or ask you to read?”
3. “Did any feedback make you think Ame was hurt or the child had failed?”
4. “Could you tell which goals were required and optional before the child asked?”
5. “Did the map, landmarks, and objective give you enough language for a neutral reminder?”
6. “Were hints appropriately layered, or did they jump from vague to answer?”
7. “Which backtracking felt purposeful because something had changed? Which felt like dead travel?”
8. “Did controls ever cause an action the child did not intend?”
9. “What did the child think Gold and Science were for?”
10. “Would you be comfortable leaving the child to play independently? Where would you expect help to be needed?”

### 15.7 Success criteria

These are release-candidate thresholds. Report age/input strata and confidence intervals or raw counts; do not hide a subgroup failure inside the average.

| Area | Success criterion |
|---|---|
| Chapter 1 comprehension | ≥85% identify reaching the star as the main goal and make an intentional first move within 20 seconds without a direct adult instruction. |
| Exploration onboarding | ≥80% can explain by the end of ch. 2 that movement reveals the maze and can use the minimap/landmark list for one decision. |
| Mechanic introduction | ≥75% apply each new mechanic after at most tier-2 support; no participant believes a stronger enemy harms or resets Ame after the explanation. |
| Recall | ≥70% apply a mechanic unaided when it returns at least two chapters later; review Help raises this to ≥90% without direct route instruction. |
| Blocker recovery | ≥90% can name the missing capability/key/Power after feedback; ≤10% deliberately hit the same blocker more than twice without progress; zero state loss. |
| Hint quality | ≥75% make a meaningful next choice after tier 1–2; <20% require tier 4 in introduction chapters; no Path hint selects an optional rescue/treasure. Report no-hint completion separately. |
| Optional-goal clarity | ≥85% correctly state that rescues are optional; ordinary completers’ median satisfaction is ≥4/5 even when friends remain. |
| Controls | ≥90% of intended taps/presses produce one intended transition; accidental assisted decisions <5%; zero assisted exit/portal/rescue/reward/blocker/hazard choices. |
| Adult independence | Median intervention ≤2 in the first 10 minutes; direct level-3/4 takeover in ≤10% of introduction-level sessions. |
| Route quality | Revised authored levels meet approved event-gap/decision/neutral-retraversal ranges; ≥75% can name at least one later return that felt purposeful. |
| Finale | ≥70% form a correct two-step Power plan without tier 3; ≥80% finish within the session budget or voluntarily pause with a valid plan; ≥85% know rescues are optional. |
| Reward meaning | <20% spontaneously expect a purchase/shop after final copy; ≥75% describe Gold/Science as records/rewards for adventures or discovery. |
| Surprise | ≥90% encounter an actionable landmark or choice within eight inputs on fixed/session samples; exact seed reproduces every reported issue. |
| Child safety | Zero cases of feedback implying damage/loss contrary to rules; any distress triggers review regardless of aggregate threshold. |

A criterion miss produces a targeted design review, not an automatic addition of more text. Re-test the smallest plausible change. Any child-safety, save-integrity, forced-optional, or engine/hint mismatch is a blocker even if the aggregate usability thresholds pass.

## 16. Phased execution, dependencies, rollback, and release gates

### 16.1 Phase plan

| Phase | Scope | Dependencies | Exit criteria | Rollback point |
|---|---|---|---|---|
| 0. Decision lock and baseline | Approve locked rules, evidence rubric, Level-1 direction, finale zero-rescue contract, and metric definitions. Capture current fingerprints/routes and fixed Surprise seeds. | This plan and all companion plans reviewed together | Named owner approves open gates; baseline artifact is reproducible at inspected commit | No code/content change; revise plan only |
| 1. Safety and measurement foundation | Stable semantic IDs, content revision/fingerprint, progress/session migration, dirty predicate, campaign metrics, engine-shared reachability, fixed generator digests | Storage/version review; performance budget; no map edits | All identity/migration/hint replay tests pass; old active run is either safely migrated or narrowly restarted; metrics cover all 16 | Keep old content definitions; schema reader remains backward compatible; disable new hint UI while retaining pure search tests |
| 2. Low-risk semantics and recovery | Honest Gold/Science/Surprise/optional copy, Path vs Rescue hint model, progressive blocker state, save failure, CTA correction, assist restrictions | Phase 1 semantic IDs/search; UI/accessibility/control track interface agreement | Low-risk acceptance in §8; all input/accessibility focus tests; formative prototype with adults/internal child-safety review | Feature-gate new hint/feedback presentation; never fall back to inaccurate coordinate BFS—use tier-1 generic Help if search fails |
| 3. Onboarding and early/mid campaign | Ch. 1 ≤6×6 preferred design, ch. 2 map lesson, ch. 3–8 hub/route compaction | Phase 1 shipped or included; approved per-level sketches; story copy review | Solver/content contract; §7 budgets; formative child round passes ch. 1–3 and jump intro | Each level has independent revision/definition; restore prior geometry only under a new revision after release |
| 4. Reasoning-density campaign work | Ch. 9–12 and 13–15 redesigns; generated quality report and optional reconstruction metadata | Phase 3 mechanic evidence; portal hint fixtures; migration stable under prior revisions | Per-level metric deltas approved; all route/event/optional contracts; jump/exploration/portal cohorts pass | Ship/revert by level group, never all seven as one inseparable content toggle; preserve schema/history |
| 5. Finale | Ch. 16 topology, Power-tier pacing, optional rescue branches, finale story/reward reconciliation | Phase 4 curve stable; explicit product/narrative approval; returning-player testers | Finale criteria in §§7, 14, and 15; ordinary zero-rescue and perfect-all routes; no forced perfect reward | Finale-only revision and content switch; a rollback gets a new revision and keeps achievements |
| 6. Validation and authority reconciliation | Full validation cohort, physical-device/accessibility matrix, performance/CI budget, docs, release checklist | All companion tracks integrated on a frozen candidate | Master acceptance checklist below, full suite passes without unexplained timeouts, docs reflect shipped content | Stop release; fix smallest failed subsystem/level; do not weaken child-safety or solver assertions to make CI green |

### 16.2 Dependency order that must not be inverted

1. Define metrics and capture baseline before changing routes.
2. Add semantic IDs/revisions and a safe migration before moving any object or tile.
3. Make engine-consistent search pass fixtures before changing hint targeting or removing modal fallback.
4. Agree semantic state/focus contracts with UI, VFX, art, lighting, animation, and controls before those tracks bind presentation to temporary App-local flags.
5. Validate onboarding before using its comprehension assumptions in later-level tests.
6. Approve each late-level paper route and metric delta before writing the ASCII map.
7. Validate portal mastery before locking finale synthesis.
8. Reconcile documentation only after final shipped definitions and route metrics are stable.

### 16.3 Principal risks and mitigations

| Risk | Likelihood / impact | Mitigation | Release blocker |
|---|---|---|---|
| Same-kind ID reinterpretation corrupts active state | High / high once maps move | Semantic IDs + staged identity release + fingerprint mismatch restart | Yes |
| Shorter routes flatten challenge | Medium / high | Require reasoning score/decision/prerequisite delta, not length alone; child cohort comparison | Yes if reasoning falls without intended tutorial reset |
| Hint search diverges or becomes slow | Medium / high | One engine transition authority, replay result, projected signatures, deterministic performance fixtures | Yes |
| Non-modal blocker feedback becomes missable | Medium / medium | Explicit first teach, persistent review, live-region copy, progressive escalation, child/adult comprehension threshold | Yes if requirement comprehension <90% |
| Level-1 micro-maze feels trivial or cramped | Medium / medium | Prototype two ≤6 layouts and scoped-policy fallback; test one real optional choice | No automatic fallback; approval required |
| Old records feel lost after map revision | Medium / high | Preserve historical accomplishment and label current-layout competition separately | Yes if durable achievements/currency disappear |
| Finale loses celebratory scale when shortened | Medium / medium | Express mastery through visible boss, tier plan, callbacks, and optional branches—not corridor count; coordinate presentation with companion tracks | Yes if returning players rate mastery/satisfaction below target |
| Generated fixed seeds overfit quality | Medium / medium | Combine golden regressions with distribution samples and human Surprise sessions | No, unless solver/determinism contract fails |
| Test timeouts hide regressions | High / medium in current shared run | Separate deterministic correctness from controlled performance suite; set measured budgets; investigate, do not only raise timeouts | Yes for unexplained release-candidate failures |
| Companion tracks encode rules visually | Medium / high | Semantic event/state API and explicit ownership notes below | Yes if colour/motion/light/art becomes sole rule cue |

### 16.4 Master acceptance checklist

- All locked rules in §1.1 pass automated regression tests.
- All 16 levels pass engine-replayed zero-rescue ordinary and exact-all-rescue perfect modes.
- Revised levels meet approved input, event-gap, decision, retraversal, rescue-premium, and clue-lead ranges; exceptions are written and child-validated.
- Hints never contradict portal/multi-hole/landing behaviour and never make an optional target look required.
- First-time/repeat blocker feedback meets comprehension and interruption criteria across all inputs and assistive technology.
- Stable identities and revision mismatch behaviour prevent silent active-run reinterpretation.
- Durable progress, reward totals, unlocks, and historical accomplishments survive migrations; current-route competition is fair.
- Gold/Science/optional/Surprise copy describes only current behaviour.
- Surprise generation stays deterministic, solver-valid, bounded 9–23/absolute 24, and reproducible in tester mode.
- Formative issues are resolved and the validation cohort meets §15 thresholds by age/input stratum.
- Full automated suite and controlled performance suite pass without unexplained timeout-only “success.”
- README, architecture, Story Bible, project audit, and release checklist match the shipped source while preserving historical labels.

## 17. Coordination with all companion expert tracks

### 17.1 `01-ui-ux-layout-overhaul.md` — UI/UX layout

Gameplay owns the semantic model: required objective, optional objective, hint goal/tier, blocker requirement, progress epoch, reward meaning, save status, and input-inert state. UI owns placement, disclosure, responsive behaviour, component hierarchy, and visual focus treatment. Provide typed view models rather than asking UI to infer priority from inventory/object arrays. Jointly verify that Path hint and Rescue clue are distinguishable without making optional play feel lesser, the board retains focus after feedback, and no responsive layout hides the current requirement. This plan does not reopen that track’s layout decisions.

### 17.2 `02-graphics-vfx-overhaul.md` — graphics and VFX

Gameplay will emit semantic events such as `blocked:key`, `blocked:power`, `hint:region`, `portal:traverse`, `rescue:optional`, `save:failed`, and `reward:banked`. VFX may acknowledge those events but cannot decide their outcome, target, reward, or timing of input. Guided markers require static/reduced-motion equivalents and may not reveal a tier-4 target before the player opts in. Treasure/rescue celebration must not imply ordinary victory was incomplete.

### 17.3 `03-magical-girl-art-direction.md` — art direction

Keep one generic weapon capability regardless of visual variant. Semantic object IDs must not include asset filenames or lock persistence to a sprite. Required/optional, waiting/rescued, matching key/door, portal pair, and safe stronger-enemy states need readable static representations and non-colour cues. Art can strengthen functional landmarks, but metric/hint logic refers to stable semantic landmark IDs rather than decorative descriptions alone.

### 17.4 `04-lighting-wall-depth.md` — lighting and wall depth

Gameplay owns FOV, reveal, camera follow, line-independent square reveal, and map-state semantics. Lighting/depth must preserve the legibility of the player, exit, blocker, answer, portal pair, rescue, and guided target under every theme and viewport; it cannot turn a visible clue into accidental obscurity. Joint tests should compare clue first-reveal and input hit geometry before/after presentation changes. Do not change topology, collision, or the 6×6 gameplay viewport to solve a lighting problem.

### 17.5 `05-limited-sprite-animation.md` — limited animation

Animation is an acknowledgement of an already committed engine state, never a gate on solver timing or subsequent legal input. Stationary safe combat, complete Spring jump, portal traversal, rescue, pickup, door resolution, and blocker feedback all require a clear final static state. Held input must not resume behind a teaching animation/modal. Reduced motion may shorten/remove motion without changing event order, hint progress, step/input count, or landmark discovery.

### 17.6 `07-performance-web-tauri-plan.md` — web/Tauri performance and release engineering

The gameplay track supplies deterministic search/metric workloads, semantic save checkpoints, level-content fingerprints, generated-seed fixtures, and interaction scenarios; the performance track owns production instrumentation, budgets, render/persistence optimization, WebView2/Tauri packaging, and offline qualification. Hint search and campaign metrics must not run synchronously on every frame or movement commit. Any save coalescing must preserve close/visibility durability and the active-run contract. Generated worker/code-splitting changes must preserve versioned determinism and use the same engine implementation. Jointly set authored/generated p50/p95 search budgets, held-movement save budgets, tester isolation, and low-end-device release gates; gameplay rules must not be weakened merely to make a timeout disappear.

### 17.7 `08-controls-xbox-steam-deck-plan.md` — controller and handheld controls

All devices resolve an intended cardinal direction and then use the same engine transition and blocker state machine. The controls track owns mappings, glyphs, focus navigation, platform behaviour, deadzones, and physical-device tuning; gameplay owns which board actions are meaningful and therefore ineligible for assist. Jointly test the ordinary-floor-only assist contract, 320 ms/260→160 ms baseline, release-after-feedback rule, Help/Path/Rescue parity, portal/jump intent, Steam Deck resume/storage, and Xbox/keyboard/touch equivalence. Any cadence change requires child-device evidence and updates to movement tests.

### 17.7 Cross-track integration contract

Before implementation, all tracks should agree one semantic state/event interface and one acceptance matrix. No companion track should:

- add a new rule, required object, reward sink, forced rescue, hint priority, or route gate;
- bind gameplay identity to an asset, animation, colour, theme, or DOM coordinate;
- change input hit geometry or camera/FOV semantics without game-design review;
- make a transient visual effect the only evidence of progress or safety;
- invalidate saves or best records without the content-revision protocol.

Conversely, gameplay changes must supply stable semantic state early enough that the presentation tracks do not have to scrape `App.tsx` conditions or duplicate rule logic.

## 18. Research synthesis and sources

All sources below were accessed on **2026-09-02**. The plan distinguishes each source’s observed result from the design inference. Research is used to form testable hypotheses, not to overrule the current game’s child playtests.

### 18.1 Child-centred scaffolding and cognitive load

Wood, Bruner, and Ross’s tutoring study described effective scaffolding as reducing degrees of freedom, maintaining the goal, marking critical features, managing frustration, and demonstrating contingently. Sweller’s cognitive-load account warns that novice means–ends search can consume capacity that would otherwise support learning. Renkl and colleagues found value in fading worked solution steps rather than withdrawing support abruptly.

Inference for this campaign: chapter 1 should reduce simultaneous systems, the first application should mark the relevant relation, and help should fade across supported application → recall → combination. This does **not** imply removing choice or showing full solutions.

### 18.2 Progressive and layered hints

O’Rourke and colleagues’ large Refraction study is a warning that the presence of hints does not guarantee learning or performance and that hint presentation changes behaviour. Wauck and Fu’s spatial-puzzle study found exploration linked with experience and reported that players tended to prefer fewer hints than automatic/adaptive systems presented. Andersen and colleagues found tutorials most useful in the most complex of three games and of little benefit in simpler, discoverable games.

Inference: use on-demand, goal-specific tiers; preserve exploration; measure no-hint performance and post-hint decision quality; teach only a genuinely undiscoverable rule explicitly. Never auto-escalate from inactivity alone.

### 18.3 Spatial orientation, landmarking, and interface accessibility

Lingwood and colleagues studied 72 five-year-olds in a virtual route task and found that labelling or drawing attention to on-route junction landmarks reduced errors and/or trials to criterion. W3C navigation guidance emphasizes consistent structures, clear labels, orientation, and multiple ways to find content. Microsoft’s game accessibility guidance calls for equivalent input mechanisms, separately gradable difficulty dimensions, and reviewable objectives/prerequisites.

Inference: use functional named landmarks at real decisions, keep objective/prerequisite history reviewable, preserve equivalent controls, and separate cognitive puzzle help from physical input assistance. A decorative landmark with no route function should not inflate the decision metric.

### 18.4 Puzzle difficulty, backtracking, flow, and optional goals

Yokota and colleagues found human maze learning related to maze-cost measures and T-junction counts. Valenzuela and colleagues found search statistics useful as proxies for human maze/puzzle performance. These support adding branch and search metrics, but neither makes route length a sufficient difficulty measure. Larche and Dixon linked the skill–challenge relation/flow with the urge to continue in a complex mobile game; Ryan, Rigby, and Przybylski linked autonomy, competence, and intuitive controls with game motivation. Tian’s level-design thesis offers lower-confidence, practice-oriented support for multi-stage backtracking that changes the player’s context rather than merely repeating space.

Inference: report solution length, search effort, decision points, and changed-state return separately. Optional rescues support autonomy only when the player can genuinely decline them and ordinary success remains celebrated. Treat flow findings as adult/adjacent evidence and validate with children rather than chasing a universal score.

### 18.5 JRPG-style onboarding evidence boundary

The most relevant controlled evidence found concerns game tutorials generally, not child-focused JRPG campaigns. A practitioner interview with Final Fantasy XIV producer/director Naoki Yoshida describes easing early reaction/group demands before progressively increasing challenge, but it concerns an MMO and is not a controlled child study.

Inference: retain the JRPG-like rhythm of story motivation, safe early encounters, visible growth, and later synthesis, while testing the actual Ame campaign. Do not use genre convention to justify a long corridor, front-loaded tutorial, or forced optional content.

### 18.6 Source ledger

| Topic | Source and observed evidence | Design use / limitation | Accessed |
|---|---|---|---|
| Contingent scaffolding | Wood, Bruner & Ross (1976), [“The role of tutoring in problem solving”](https://doi.org/10.1111/j.1469-7610.1976.tb00381.x): preschool tutoring observations identify contingent support functions. | Supports goal maintenance, critical-feature marking, and frustration-aware help. Tutoring interaction is not identical to solo game play. | 2026-09-02 |
| Cognitive load | Sweller (1988), [“Cognitive load during problem solving: Effects on learning”](https://doi.org/10.1207/s15516709cog1202_4). | Supports reducing novice system stack and distinguishing productive inference from search burden. Foundational theory, not this game/age group. | 2026-09-02 |
| Fading support | Renkl, Atkinson & Große (2004), [“How fading worked solution steps works—A cognitive load perspective”](https://doi.org/10.1023/B:TRUC.0000021815.74806.F6). | Supports introduction → supported application → recall rather than permanent full help. Worked examples differ from spatial exploration. | 2026-09-02 |
| Educational-game hints | O’Rourke, Ballweber & Popović (2014), [“Hint Systems May Negatively Impact Performance in Educational Games”](https://grail.cs.washington.edu/wp-content/uploads/2015/08/orourke2014hsm.pdf), [DOI](https://doi.org/10.1145/2556325.2566248): approximately 50,000 Refraction players; hint variants did not guarantee improved performance. | Strong warning against automatic/bottom-out assumptions; measure persistence and performance separately. Refraction teaches fractions and is not a maze JRPG. | 2026-09-02 |
| Spatial-game hints | Wauck & Fu (2017), [“A data-driven, multidimensional approach to hint design in video games”](https://doi.org/10.1145/3025171.3025224): 25 participants; exploration related to experience and players tended to prefer fewer hints. | Supports on-demand tiers and experience measures. Small sample and not specifically children. | 2026-09-02 |
| Tutorials by complexity | Andersen et al. (2012), [“The Impact of Tutorials on Games of Varying Complexity”](https://centerforgamescience.org/files/projects/game-abtesting/chi2012/chi2012.pdf): over 45,000 players; benefit depended strongly on game complexity. | Supports experimentation for simple movement and explicit help for unusual Spring/portal rules. Player ages and games vary. | 2026-09-02 |
| Child landmarking | Lingwood et al. (2015), [“Encouraging 5-year olds to attend to landmarks”](https://doi.org/10.3389/fpsyg.2015.00174): 72 five-year-olds; attention to on-route junction landmarks improved route learning measures. | Strong age-relevant support for functional, named junction landmarks. The study used a six-turn virtual route, not changing-state mazes. | 2026-09-02 |
| Human maze measures | Yokota et al. (2019), [“Estimation of Parameters to Determine Maze Difficulty for Humans”](https://doi.org/10.11239/jsmbe.57.58): maze cost and T-junction count related to route-learning performance. | Supports junction/route-cost reporting. Does not cover portals, inventory gates, children, or enjoyment. | 2026-09-02 |
| Search proxies | Valenzuela et al. (2025), [“Using search algorithm statistics for assessing maze and puzzle difficulty”](https://doi.org/10.1016/j.entcom.2025.100925): BFS/A* statistics correlated with human steps and/or perceived difficulty in studied 2D maze/Sokoban tasks. | Supports solver expanded-state metrics as one axis, never the complete difficulty label. Different tasks/populations. | 2026-09-02 |
| Flow/frustration | Larche & Dixon (2020), [“The relationship between the skill-challenge balance, game expertise, flow and the urge to keep playing complex mobile games”](https://doi.org/10.1556/2006.2020.00070). | Supports measuring challenge and desire-to-continue, not equating more difficulty with more flow. Adult/mobile context limits transfer. | 2026-09-02 |
| Optionality/motivation | Ryan, Rigby & Przybylski (2006), [“The Motivational Pull of Video Games: A Self-Determination Theory Approach”](https://doi.org/10.1007/s11031-006-9051-8). | Supports competence, autonomy, and intuitive-control hypotheses behind honest optional goals. Does not prescribe rescue reward values. | 2026-09-02 |
| Input accessibility | Microsoft, [XAG 107: Input](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/107). | Normative support for equivalent digital/analog functions, manageable timing, and cancelable/alternative input. Not an empirical child study. | 2026-09-02 |
| Difficulty dimensions | Microsoft, [XAG 108: Game difficulty options](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/108). | Supports separating puzzle/memory/physical barriers and testing configurable support rather than flattening all challenge. Normative guidance. | 2026-09-02 |
| Objective clarity | Microsoft, [XAG 109: Objective clarity](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/109). | Supports reviewable goals/prerequisites and main/secondary separation. Normative guidance; presentation remains UI-owned. | 2026-09-02 |
| Navigation/orientation | W3C WAI, [“Interaction: navigating and finding”](https://www.w3.org/WAI/people-use-web/tools-techniques/navigation/). | Supports consistent structure, labelling, orientation, and multiple navigation strategies. Web guidance requires game-context adaptation. | 2026-09-02 |
| Meaningful backtracking | Tian (2024), [“Using Multi-staged Puzzles to Improve Backtracking in Level Design”](https://scholar.smu.edu/guildhall_leveldesign_etds/1/). | Suggests changed-state multi-stage returns can improve reported experience. Single level-design thesis and a different game: E3 only. | 2026-09-02 |
| JRPG/MMO onboarding practice | TIME (2015), [interview with Naoki Yoshida](https://time.com/3817373/final-fantasy-14-naoki-yoshida/). | Practitioner evidence for gentler early demands followed by progressive challenge. MMO, adult market, journalistic interview: low-confidence genre context only. | 2026-09-02 |

### 18.7 Evidence-to-decision trace

- **E1 + child scaffolding/load:** chapter 1 local simplification, not a global FOV rewrite.
- **E1 + hint studies:** separate goals and four opt-in tiers, with post-hint decision measures.
- **E1 + landmark study/accessibility guidance:** functional named junctions, reviewable objectives, multiple equivalent inputs.
- **E1 + maze/search studies:** decision/prerequisite/search metrics in addition to length.
- **E1 + flow/autonomy evidence:** reduce neutral travel and keep rescues genuinely optional; do not remove reasoning.
- **E1 + low-confidence backtracking practice:** favour state-enabled returns, but require local child validation.
- **Adjacent JRPG practice:** preserve safe early growth and later synthesis; no untested genre assumption becomes a rule.

## 19. Decision log, open gates, and planning audit trail

### 19.1 Converged decisions

- Preserve the existing game-rule vocabulary and child-safe combat contract.
- Treat reasoning challenge and friction as separate measured dimensions.
- Prefer a ≤6×6 chapter-1 micro-maze over a global FOV change or a chapter-specific exception.
- Teach camera/minimap in chapter 2, Spring landing prediction across chapters 7–9, poison in chapter 12, and portals across chapters 13–15.
- Use engine transitions for solver, reachability, hints, and route metrics.
- Split required Path hints from optional Rescue clues and use four progressive tiers.
- Replace learned repeat blocker modals with progressive non-modal feedback while preserving an explicit first explanation and safe Power equation.
- Keep rewards deterministic and make their current meaning honest; do not create a shop.
- Make every rescue optional in ordinary solutions, including the finale.
- Add content identity and route-record versioning before any layout edit.

### 19.2 Open approval gates

1. Approve the preferred ≤6×6 chapter-1 direction after two paper/prototype layouts, or explicitly approve the scoped full-board-intro fallback.
2. Confirm the zero-rescue finale contract. Any single narrative exception requires a separate proposal; five forced rescues are not a neutral default.
3. Approve the initial quantitative budgets as prototype targets, then recalibrate once the first six child sessions produce a baseline.
4. Decide whether Surprise reconstruction metadata/replay is worth the medium-risk progress migration; debug seed entry is recommended regardless.
5. Decide whether non-consumptive Gold/Science milestones are needed only after reward-meaning playtest results. No economy is approved.
6. Agree whether the identity foundation ships in its own release. If not, approve the documented one-time active-run restart rather than unsafe guessing.

### 19.3 Deferred or rejected ideas

- Global FOV/exploration rewrite: deferred; solve the observed onboarding problem locally first.
- New weapon behaviours, consumable keys, enemy harm, lives, rescue gates, one-use portals, or partial Spring jumps: rejected as unnecessary rule expansion.
- Full spend economy, outfits/frames shop, or Science facility: rejected from this scope.
- Auto-solving hints, automatic inactivity escalation, or marking undiscovered exact objects by default: rejected.
- Making rescues mandatory to increase emotion, route length, or finale scale: rejected absent explicit exception approval.
- Persisting all generated active runs or every generated record indefinitely: deferred pending demonstrated need and storage policy.
- Shortening every level indiscriminately: rejected; compact only neutral travel while preserving or increasing fair inference.

### 19.4 Skill/catalog audit

The requested product brainstorming, specification, and in-app browser workflows were used to separate repository facts from hypotheses, converge on approval gates, structure implementation/test contracts, and conduct the debug-maze playtest. The curated skill catalog was inspected through the skill-installer workflow. It contained no exact trusted game-design, level-design, playtesting, child-UX, or game-accessibility skill match, so no user-scoped skill was installed. No repository dependency was added. A separate visualization artifact was unnecessary because the mechanic matrix, metric table, and target curve are more directly reviewable as versioned Markdown tables.

### 19.5 Planning-phase deliverable boundary

This document is the only file this track is authorized to create or modify. It records plans and testable rules only. It does not edit any level, rule, copy string, save schema, style, asset, dependency, or test, and it does not create a commit.
