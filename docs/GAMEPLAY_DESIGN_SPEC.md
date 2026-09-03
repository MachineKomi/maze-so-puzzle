# Gameplay design specification

Status: implemented gameplay authority for the sixteen-maze campaign on 2026-09-02. This document turns the manager-reviewed Plan 06 into maintained rules and testable contracts. `docs/plans/06-game-design-gameplay-ux-mechanics-plan.md` remains the decision record; source and tests remain runtime authority.

## Player promise

Maze so Puzzle is a child-friendly spatial puzzle adventure in which Ame becomes capable, not invulnerable through punishment. A fair maze shows a useful question, lets the player form a plan, changes meaning when a tool or key is found, and rewards the return trip with a short route or an “aha.” It must never confuse long walking with deep thinking.

The invariant rules are:

- Equal Power wins. Stronger enemies block safely; they never hurt, reset, or remove progress.
- Every maze has one generic weapon capability, expressed through visual variants.
- Matching keys are reusable. Boots gate water/lava, the Antidote Leaf gates poison, and Spring Boots jump straight over a complete contiguous hole run.
- Portal pairs persist and always connect the same two semantic objects.
- Ordinary completion can rescue zero friends. Perfect completion rescues exactly every available friend.
- Required Path hints target an ordinary zero-rescue solution. Optional friends and treasure are never presented as prerequisites.
- Authored and generated mazes stay at or below 24×24; current Surprise Maze size bands remain deterministic.
- Gold and Science Points are visible keepsakes and completion records, not promises of a shop or spendable economy.

### Rescue-and-collect friend roster

Friends are kind optional rescues during a maze and persistent collectable companions for the Friend Garden. “Friend” is the rules term: it includes ordinary animals and small, child-friendly mythic beings. Neither group is a combat reward, equipment class, required objective, or source of automatic maze solutions. Existing authored levels continue to use the current catalogue until their versioned content and save migrations explicitly opt into an expanded roster.

The ordinary-animal family is Bunny, Fox, Kitten, Puppy, Duckling, Hedgehog, Fawn, Red Panda, Otter, Lamb, Capybara, Chinchilla, Alpaca, Penguin, and Koala.

The planned mythic-friend family is Ripplecap Kappa Hatchling, Pitter-Patter Parasol, Mallowmusk Aroma Wisp, Lanternling, Breezeling Sylph, Griffin Cub, Emberbelly Dragonling, Cloudstep Pegasus Foal, Three-Tumble Cerberus Pup, Riddlekit Sphinx, Tidecurl Hippocamp Foal, Emberdown Phoenix Chick, Meadowstep Faunling, Minerva Moon-Owl, and Tessera Dolphin. These are original Maze so Puzzle interpretations of broad folklore, fantasy-JRPG, Greek, and Roman ideas. They must not reproduce franchise designs or turn cultural source material into horror caricature.

Art and content rules for this roster:

- Every friend needs a distinct stable ID, display name, source/provenance record, cage-safe face area, and readable 40/56/84 px silhouette before catalogue admission.
- A mythic friend and a similarly named enemy remain separate identities. In particular, Ripplecap Kappa Hatchling is a garden companion and must not reuse the enemy Kappa's record, sprite, behaviour, or narrative role.
- Lore cues stay species-specific. Do not distribute leaves, hearts, stars, gems, ribbons, or other motifs across the roster merely to make a design seem magical.
- Feeding and care are affectionate garden presentation. They do not introduce hunger punishment, neglect states, injury, death, compulsory chores, or spend-to-maintain systems.

## Difficulty model and measurable rubric

Difficulty is multidimensional. The maintained report in `src/game/metrics.ts` measures engine-derived ordinary and perfect routes, rescue cost, raw branch coordinates, required state changes, physical retraversal, longest non-event run, and route-activity density. Raw branches are not automatically meaningful decisions, and the analyzer reports prerequisite depth as unavailable until a counterfactual dependency analysis exists. Solver results are design evidence, not a substitute for child observation.

| Dimension | 0–1 introductory | 2–3 developing | 4–5 mastery | Automated signal | Human signal |
| --- | --- | --- | --- | --- | --- |
| Rule load | Move/exit; one visible pickup | Two recalled capabilities | Three or more recalled capabilities | Required event sequence; causal depth pending | Can explain the next need in own words |
| Choice load | One route or one safe fork | Several distinguishable branches | Interlocking rooms/portals with state changes | Raw branch points, interpreted with route traces | Pauses to plan rather than random-walks |
| Inference | Direct affordance | Key/tool visible before its gate | Return to a remembered blocker after state change | Meaningful state changes and ordered events | Predicts what a pickup changes |
| Memory/orientation | Whole maze visible | Fog with short, named landmarks | Portal/room graph and remembered blockers | Quiet run, retraversal ratio | Uses landmarks or map without adult navigation |
| Execution burden | Under 40 moves | 40–120 moves | 120–210 only with recurring decisions | Ordinary/perfect moves and longest quiet run | No visible fatigue from repeated corridors |
| Optional mastery | One nearby friend | Meaningful rescue detour | Route planning across several optional rooms | Rescue cost; ordinary 0/perfect all | Understands “finish now” versus “help friends” |

Campaign guardrails:

- No authored ordinary route exceeds 210 inputs; no maintained later-maze quiet run exceeds 48 inputs.
- Route growth alone cannot justify a difficulty increase. A later maze needs a new inference, combined prerequisite, changed-state return, portal graph, or optional optimization.
- A route with more than 25% retraversal or a quiet run above 30 is a review trigger, not an automatic failure. The designer must identify the changed-state payoff or shorten it.
- Every content change reruns ordinary/perfect solutions and the exact metric expectations. A shorter route is rejected if it bypasses the mechanic being taught.

### Before/after campaign report

The baseline is the reviewed Plan 06 audit. “After” is the current engine-derived zero-rescue ordinary route and exact all-rescue route.

| Ch | Maze | Size | Before ordinary/perfect | After ordinary/perfect | Raw branches / required changes | Physical retraversal / non-event run | Design reading |
| ---: | --- | --- | ---: | ---: | ---: | ---: | --- |
| 1 | Little Star Trail | 6×6 | 26 / 34 | 6 / 6 | 2 / 0 | 0% / 6 | Whole-board movement prototype; no camera stack |
| 2 | Shiny Sword | 11×11 | 37 / 53 | 37 / 53 | 5 / 4 | 0% / 7 | Weapon → fair fight → reusable key |
| 3 | Splashy Boots | 13×13 | 64 / 80 | 64 / 80 | 4 / 7 | 0% / 13 | Potion/Power and water traversal |
| 4 | Rainbow Picnic | 15×15 | 80 / 92 | 80 / 92 | 7 / 9 | 0% / 13 | Two reusable-key loops |
| 5 | Toasty Toes | 13×13 | 69 / 77 | 69 / 77 | 5 / 10 | 0% / 9 | Lava recall and Power ordering |
| 6 | Moonbeam Moat | 15×15 | 92 / 104 | 92 / 104 | 3 / 11 | 0% / 13 | Three-colour route planning |
| 7 | Wishing Woods | 17×17 | 117 / 150 | 117 / 150 | 8 / 13 | 3% / 15 | Optional strong-guardian rescue |
| 8 | Ame’s Grand Parade | 17×17 | 120 / 140 | 120 / 140 | 8 / 15 | 2% / 14 | Mixed-mechanic recall |
| 9 | Springstep Sky Hollow | 19×19 | 193 / 217 | 181 / 195 | 14 / 8 | 35% / 42 | Spring Boots unlock a state-gated hole shortcut; still a child-test focus |
| 10 | Lanternlight Labyrinth | 23×23 | 173 / 216 | 149 / 204 | 17 / 9 | 30% / 48 | Room shortcut reduces ordinary endurance; rescue room remains substantial |
| 11 | Twilight Treasure Loop | 21×21 | 235 / 245 | 201 / 211 | 12 / 14 | 24% / 24 | Exit follows the blue-door chain; dense prerequisites remain the challenge |
| 12 | Moonlit Friendship Quest | 23×23 | 231 / 241 | 161 / 171 | 13 / 14 | 17% / 20 | Cross-map shortcut preserves leaf/tool/key ordering |
| 13 | Rose Heart Roundabout | 13×13 | 105 / 117 | 28 / 42 | 13 / 2 | 18% / 11 | Compact two-portal literacy and one key gate |
| 14 | Clover Comeback Carnival | 17×17 | 103 / 177 | 103 / 177 | 10 / 8 | 20% / 27 | Portal/Power comeback with expensive optional mastery |
| 15 | Friendship Crown Vault | 17×17 | 231 / 260 | 44 / 56 | 35 / 9 | 0% / 9 | Three-pair relay; all three reusable-key doors required; five rescues optional |
| 16 | Rainbow Power Parade | 17×17 | 411 / 411 | 61 / 77 | 39 / 11 | 2% / 9 | Power-99 loop, Sunny Key return, compact optional rooms |

Chapters 9 and 10 remain the principal endurance risks. Both are below baseline and have functional shortcuts, but their physical retraversal and non-event runs require direct child testing before any claim that the friction is solved.

## Sixteen-level progression and hint matrix

Hint tiers are Goal (remind the current need), Principle (state the rule), Direction (name the next meaningful landmark and broad direction), and Step (give the next engine-valid input). Repeating a hint at an unchanged state advances through those four tiers; changing meaningful state starts a fresh ladder. The sequence is saved with the active run.

| Ch | Puzzle intent and mechanic stage | Complexity / likely friction | Route quality and rescue role | Required-path hint emphasis |
| ---: | --- | --- | --- | --- |
| 1 | Introduce four-way movement, exit, and an optional friend | Very low; whole 6×6 board visible | Six inputs; friend is an equal-cost optional branch | Point toward the star; never mention the kitten as required |
| 2 | Introduce weapon, equal-Power combat, key/door | Low; first ordered chain | Short changed-state chain; two rescue detours | Weapon, then fair enemy, then matching key/door |
| 3 | Introduce potion growth, boots, water | Low-medium; two capability gates | Compact stateful route; three rescues add 16 | Name current missing capability before direction |
| 4 | Apply reusable keys across multiple doors | Medium; colour/shape matching | Two loops, low dead travel | Identify the next required colour, not the nearest friend |
| 5 | Recall boots at lava and sequence Power | Medium; familiar rule in new skin | Dense events with short quiet spans | “Warm lava uses the same boots rule” before coordinates |
| 6 | Master three key colours and route order | Medium-high; working-memory load | Three gates, restrained retraversal | One current colour/prerequisite at a time |
| 7 | Distinguish optional strong guardian from required route | Medium-high; temptation and recovery | Ordinary skips guardian; perfect adds meaningful 33 | Required Path explicitly leaves guardian/friend optional |
| 8 | Recall mixed mechanics without a new rule | Medium-high | Stable 120-input mastery course | Re-anchor to the next required state change |
| 9 | Introduce Spring Boots and complete-hole-run jump | High; current endurance risk | State-gated shortcut, 14 rescue inputs | Principle tier explains “straight across the whole run” |
| 10 | Read rooms and return through a shortcut | High; room orientation and rescue cost | Ordinary 149; optional room drives most perfect cost | Name functional room/landmark, not raw coordinates alone |
| 11 | Deep prerequisite chain and changed exit meaning | High; 201 inputs but frequent events | Fourteen required state changes, four optional friends | Next prerequisite only; avoid revealing later chain |
| 12 | Combine leaf, poison, boots, Spring Boots, keys | High but denser than baseline | 70 ordinary inputs removed; rescues cost 10 | Engine route ensures leaf precedes poison and boots precede hazards |
| 13 | Introduce persistent portal pairs in a compact board | Medium; novel topology | 28 ordinary / 42 perfect | Explain matching flower pair, then next step through it |
| 14 | Apply three portal pairs to a comeback Power route | High; expensive perfect detours | Ordinary remains purposeful; rescue mastery is optional | Distinguish “come back stronger” from “wrong way” |
| 15 | Master a three-pair quadrant relay plus three reusable keys | High reasoning, low execution burden | 44 ordinary / 56 perfect; three doors required | State current quadrant, portal motif, and next key/door |
| 16 | Plan Power 99, retrieve Sunny Key, return to guardian | High synthesis with short loops | 61 ordinary / 77 perfect; 0/5 rescue split | Track next safe Power target or Sunny Key return; never route via friends |

## Per-level experience and semantic asset opportunities

These are semantic hooks for the art, audio, lighting, VFX, animation, UI, and controls tracks. This gameplay track does not create or restyle assets.

| Ch | Learning habit | Fair “aha” | Wonder / surprise | Joke / payoff | Functional landmark | Optional discovery | Healthy replay reason | Later-track opportunities |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Try a direction, observe | Star is only a few choices away | A friend waits beside the first path | “Tiny trail, enormous hero” beat | Start garden and visible star | First kitten | Rescue without extra distance | Gentle first-step sound; no fog; direction affordance |
| 2 | Read capability before blocker | Equal Power is enough | Weapon visibly changes Ame | Baddie’s confidence pops at equality | Sword nook / coloured door | Two side cages | Perfect route and faster key order | Power comparison audio; weapon hold pose; key motif UI |
| 3 | Predict what equipment changes | Boots turn water into path | Splash crossing | Dry-socks quip | Boot shore | Three waterside friends | Fewer false starts | Crossing sound, hazard boundary, blocker icon |
| 4 | Remember reusable keys | One key answers several doors | Picnic route unfolds | Sandwich-shaped detour copy | Picnic clearing | Three guests | Optimize door order | Key-return sparkle; readable junction landmarks |
| 5 | Transfer a learned rule | Water boots also solve lava | Warm path opens | “Toast, not toes” | Ember bridge | Three warm nooks | Cleaner Power sequence | Heat-safe feedback; familiar boots badge |
| 6 | Externalize colour order | Keys do not disappear | Moonbeam gates align | Poggle’s nearly-correct map note | Three-colour hub | Three moat friends | Alternate key order | Strong colour+shape semantics; map markers |
| 7 | Leave and return intentionally | Strong guardian is optional now | Woods guardian remembers Ame | Guardian’s tiny treasure hoard | Guardian fork | Kitten miniboss rescue | Return at higher Power / perfect run | Nonmodal Power marker; changed-state return cue |
| 8 | Recall without prompts | Mixed rules form one parade route | Mechanic parade | Sprig announces the wrong parade order | Parade crossroads | Three spectators | Smooth mastery route | Layered musical/event callbacks |
| 9 | Inspect landing beyond holes | One input clears the complete run | First boing shortcut | Spring Boots “do not do corners” | Star-hole bridge | Three sky cages | Find shorter spring route | Landing preview, jump cadence, distinct hole landmark |
| 10 | Chunk space into rooms | A room link replaces a long loop | Treasure/monster room reveal | Monster guarding stationery | Lantern room names | Rich rescue/treasure room | Perfect-room sweep | Room-name copy, ambient audio zones, later lighting cue |
| 11 | Hold a prerequisite plan | Blue-door return completes the chain | Twilight exit appears after work | Mimic’s “definitely normal chest” | Blue-door/exit chamber | Four side-trail friends | Optimize 14-event chain | Blocker history, clue visibility, landmark labels |
| 12 | Combine old rules calmly | Shortcut collapses the return | Moonlit mixed-hazard crossing | Leaf treated as heroic salad | Poison garden / moon bridge | Five close detours | Ten-input perfect delta | Hazard-specific audio and accessible status copy |
| 13 | Build a portal mental model | Matching flowers preserve pairs | First whoosh to distant garden | Sprig waves at the wrong flower | Rose portal motifs | Three roundabout friends | Portal order and perfect route | Pair-name audio; persistent map link semantics |
| 14 | Revisit a blocker with new Power | Portal makes comeback practical | Three-garden travel | Baddie asks if Ame has an appointment | Clover return gate | Four remote cages | Large perfect-route challenge | Changed-state reminder, Power breadcrumb, portal sound identities |
| 15 | Plan a quadrant graph | H → C → M relay leads to key corridor | Three-room flower relay | Crown vault protected by very polite doors | Four quadrants / three motifs | Five species across rooms | 44-step clean route or five-friend 56 | Portal graph map semantics; key-corridor fanfare; room audio |
| 16 | Plan safe Power thresholds | The hub changes from blocked to traversable | Rainbow Guardian at 99 | Guardian’s Power sign is comically specific | Central hub / Sunny Door / guardian | Five friends and a star chest | Power-route optimization; perfect rescue | Power milestones, return cue, guardian audio/VFX, optional-room ambience |

## Companion-track coordination

| Expert track | Gameplay contract supplied here | Boundary / joint acceptance |
| --- | --- | --- |
| UI and responsive UX | Required versus optional goal, hint tier, blocker requirement, save status | UI owns placement and focus; Path and Rescue must remain distinguishable at every viewport |
| Graphics and VFX | Semantic pickup, block, portal, rescue, door, treasure, and victory events | Effects acknowledge committed state and retain static/reduced-motion equivalents |
| Art direction | Semantic object IDs, functional landmark roles, Power and pair meaning | Art cannot become the only rule cue or change capability by variant |
| Lighting and wall depth | FOV/reveal semantics and clue-first visibility | Lighting preserves player, exit, blocker, answer, portal-pair, and hint-marker legibility |
| Limited animation | Exact event order, input-inert presentation boundaries, final static state | Animation never changes solver timing; held input cannot resume behind a teaching beat |
| Performance / desktop | Deterministic workloads, fixed seeds, fingerprints, scenario checkpoints | Track owns budgets/instrumentation; gameplay correctness cannot be weakened for timing |

The controls/handheld concept is deliberately not implemented here. Its later
integration point is cardinal intent into the same engine transition, with the
empty-floor-only assist and hint/recovery semantics preserved across devices.

## Hint and reachability contract

`src/game/reachability.ts` and `src/game/hints.ts` use `movePlayer` and the stateful solver as the transition authority. There is no parallel geometric flood-fill in the UI. This matters because one input may traverse a full Spring-Boots hole run or warp between persistent portal endpoints. Exhaustive reachability reports whether its state budget completed; truncated searches are never presented as exact evidence.

For a current game state:

1. Solve from that exact state with `avoidAnimals: true`.
2. Identify the next meaningful required event on that route.
3. Derive all four hint tiers from the same route and current state.
4. Key the replay ladder by a stable state signature; persist only a bounded map of tier counts.
5. If the state is invalid or no required solution exists, give a safe recovery message and never fabricate a coordinate.

Acceptance: portal and multi-hole fixtures must prove that reachability, next step, and hint text agree with engine transitions; Required Path must finish with zero rescues on every authored level.

## Feedback, recovery, and input assists

- The first capability collision uses immediate HUD feedback. The second repeat adds a persistent directional marker. A modal explanation is reserved for the third repeat at the same unresolved blocker. Resolving it clears the repetition.
- The first encounter with a stronger enemy may explain Power comparison. Repeats remain safe and use HUD feedback rather than reopening the same modal loop.
- Corner assistance can resolve only to non-exit ordinary floor that is empty or contains a previously resolved non-portal object. It cannot finish a maze, collect an item, rescue a friend, open a door, enter a hazard, start combat, take a portal, or trigger a Spring-Boots jump. Every accepted assist still becomes one ordinary engine input.
- Help and hints are always on demand. Nothing times out, and no action sequence requires speed.
- Leaving for Home or the Adventure Book preserves a validated authored run; choosing a different maze retains the existing confirmation boundary.

## Rewards, optional goals, and replayability

Gold and Science Points communicate “I found something” and “I was curious.” They are banked on completion and displayed as keepsake totals. No copy should imply they will buy equipment, unlock progression, or be spent later. A future use requires a separately approved economy specification and migration.

Replay reasons are explicit but non-coercive: rescue every friend, improve the current-layout best route, discover optional treasure, or replay a favourite story. Best steps are scoped to the maze gameplay fingerprint. When content changes, the old best moves to `historicalBestSteps`; a current-layout record starts fresh without deleting completions, rewards, rescues, badges, or historical accomplishment.

## Identity, migration, and authored-map editing

- Every level has a positive `contentRevision` and deterministic `gameplayFingerprint` over gameplay-relevant structure.
- Authored objects receive semantic IDs based on level, kind, and intrinsic qualifier. Every repeated semantic role must declare explicit coordinate-to-ID mappings, and a golden campaign identity test binds all authored revisions to fingerprints. IDs are never intended as display order.
- Active runs use schema v2 and require an exact level ID, revision, and fingerprint. A mismatch fails closed by removing only the stale active run, preserves durable progress, and shows a non-modal explanation. Storage failures are surfaced rather than claiming a save or reset succeeded.
- Progress uses schema v4 with campaign order version 2 and stable `unlockedLevelIds`. Legacy numeric unlocks migrate through historical order. Counts are compatibility/display caches and are clamped to the current campaign length.
- Current-layout route records store revision/fingerprint. On fingerprint change, the previous step best becomes labelled historical evidence and cannot compete with the revised route.
- Map editing order: establish IDs/revision tests; edit map; increment revision; update fingerprint-derived expectations, solver routes, metric report, scenarios, story/docs; exercise legacy and current saves. Never silently reuse a revision for changed gameplay.

## Family playtest protocol

Recruit children near the intended reading/development range with a supervising adult. Do not coach unless a safety or consent boundary requires it. Record behaviour, not a judgement of the child.

Sessions:

1. First-time onboarding: Chapter 1, then Chapter 2.
2. Mechanic comprehension: Chapters 3, 7, 9, and 13.
3. Synthesis: one of Chapters 10–12 and Chapters 15–16.
4. Replay: one perfect-rescue attempt and two fixed Surprise seeds.
5. Adult review: save/resume, hint ladder, blocker feedback, readable objectives, and whether help felt easy to give.

Observe: first confident input; explanation of the goal; distinguish exit versus friend; recognition of equal Power; whether a player predicts boots/leaf/Spring Boots; landmark language; random-walk streaks; repeat blocker collisions; hint tier used; adult interventions; visible fatigue; delight, jokes repeated, and desire to replay.

Ask the child, without leading: “What are you trying to do?”, “What changed when you picked that up?”, “What might you try next?”, “Was anything annoying rather than tricky?”, “Do you want the star now or to help friends first?”, and “Which place do you remember?” Ask the adult: “When did you feel you had to intervene?”, “Could you explain the rule from the screen?”, and “Did hints preserve the child’s ownership?”

Success criteria:

- At least 80% of first-time children identify the Chapter 1 star goal and make a purposeful first input without adult navigation.
- At least 80% explain that friends are optional after one ordinary completion prompt; no child is told a friend is required by Required Path.
- At least 75% predict the effect of each introduced traversal tool before the second use.
- Median repeated collisions per blocker stay at two or fewer; fewer than 10% of blockers reach the modal tier.
- At least 70% of hint users resume purposeful play before tier 4; tier 4 always matches an engine-valid input.
- No observed route contains two minutes of unbroken corridor repetition without a decision, event, landmark, or self-chosen optional goal.
- At least 70% choose a voluntary replay, rescue, or Surprise Maze; adults rate intervention burden as acceptable.

These thresholds are release evidence gates, not claims already satisfied. Child, physical-device, and WebView2 sessions remain manual until recorded.

## Performance and rollback

Gameplay additions must use Plan 07A measurement. If compressed JS, CSS, or runtime-public bytes exceed the checkpoint baseline, `scripts/performance/feature-allocations.json` must contain a finite gameplay allocation with owner, reason, evidence path, review date, and rollback point. Correctness and save integrity cannot be traded for bytes.

### Plan 06 static allocation evidence

The manager-reviewed production build used `npm run build` from checkpoint `555cdd622a98bd77585f2e60f1096712392d71b3` plus the complete Plan 06 candidate. The provenance marker records runtime-input SHA-256 `6c1f0894266a5580d16f5b6f08980b7259efac83398710f9ed743f10adc43ebb` and dist fingerprint SHA-256 `ad257b4f26069e46dc141ded38c9bbb1e246ae11ba6385b84663c8686d4dfd42`. The deterministic gzip-9 gate measured 119,779 B JavaScript, 29,206 B CSS, and 89,394,012 B public runtime files: deltas of +3,959 B, +99 B, and 0 B from the Plan 07A baseline. The ledger allocation is 4,020 B JavaScript and 128 B CSS, leaving only 61 B and 29 B of compression tolerance. A source-matched external inventory records 144 dist files / 89,929,629 B at `C:\Users\hellb\AppData\Local\Temp\maze-so-puzzle-performance\plan06-manager-final-20260902-2146\inventory.json`, SHA-256 `25984a8678b5f89e6d7d28b4940426f7a7b3a185d6053d93c563dbf521a8dc87`. Timing remains contaminated/report-only; these static values do not claim a loading or frame-time improvement.

Rollback points are independently reversible: progressive-hint presentation can revert while retaining engine reachability; feedback escalation can revert while retaining safe blockers; map revisions can revert as one content batch only if revision/fingerprint and route-record handling revert with them. Never roll back schema readers before all known older saves remain accepted.

## Evidence basis

The design uses contingent and fading support rather than automatic answers; see [Wood, Bruner & Ross (1976)](https://doi.org/10.1111/j.1469-7610.1976.tb00381.x) and [Renkl, Atkinson & Große (2004)](https://doi.org/10.1023/B:TRUC.0000021815.74806.F6), accessed 2026-09-02. Cognitive-load separation follows [Sweller (1988)](https://doi.org/10.1207/s15516709cog1202_4), accessed 2026-09-02. Child-relevant landmarking is supported by [Lingwood et al. (2015)](https://doi.org/10.3389/fpsyg.2015.00174), accessed 2026-09-02. The route rubric treats T-junction/search statistics as partial proxies, following [Yokota et al. (2019)](https://doi.org/10.11239/jsmbe.57.58) and [Valenzuela et al. (2025)](https://doi.org/10.1016/j.entcom.2025.100925), accessed 2026-09-02. On-demand hints are deliberately measured because hints can impair as well as help performance; see [O’Rourke, Ballweber & Popović (2014)](https://doi.org/10.1145/2556325.2566248) and [Wauck & Fu (2017)](https://doi.org/10.1145/3025171.3025224), accessed 2026-09-02. Objective, input, and difficulty-accessibility requirements are adapted from [Microsoft XAG 107](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/107), [XAG 108](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/108), and [XAG 109](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/109), accessed 2026-09-02.
