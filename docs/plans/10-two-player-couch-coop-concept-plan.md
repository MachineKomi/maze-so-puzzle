# Plan 10 — two-player couch co-op concept plan

> **EXPLORATORY, NON-CANON, AND UNAPPROVED.** This document is research and concept planning only. It does not change the product authority, Plans 01–09, the implementation order, any shipped rule, or any campaign maze. Unless a statement is explicitly labelled **Current fact**, **Adopted constraint**, or **Human direction**, every recommendation, name, number, rule, score, and acceptance criterion below is an **exploratory recommendation — non-canon pending Amelia/Human approval**.

- **Status:** research, divergent brainstorming, and prototype-decision plan only
- **Prepared:** 2026-09-02
- **Implementation gate:** no work before Plan 09 unless the Human explicitly reprioritizes it
- **Repository evidence:** mechanics/playable audit baseline `a34de2f783d2f11c2b543541b4f46ffdf8b13fe0`; final document check at `555cdd622a98bd77585f2e60f1096712392d71b3`. The intervening commit adds Pass 07A performance evidence/infrastructure and no runtime `src/`, campaign, save, or controller implementation. Re-audit after Plan 09 remains mandatory.
- **Provisional leading pitch:** **Miri's Wishwing Courier**

## Evidence labels used throughout

- **Current fact** — observed in current source, tests, or the playable build. It may change as Plans 01–09 land.
- **Adopted constraint** — already established by the Human or the documented product authority.
- **Source finding** — directly supported by a cited external source.
- **Design inference** — an interpretation of evidence, not a sourced fact.
- **Exploratory recommendation** — non-canon pending Amelia/Human approval.
- **Open decision** — cannot become product canon without an explicit Human choice.

## 1. Executive recommendation

**Exploratory recommendation — non-canon pending Human approval.** Prototype, after Plan 09, a bounded flying-companion model called **Miri's Wishwing Courier**. Miri is a provisional original female wish-sprite. Ame keeps exclusive authority over movement, the camera, required items, the Bag, hazards, doors, guardian defeat, rescues, portals, the objective, and the exit. Miri flies through scenery only inside Ame's current camera window. She retrieves **Duo-only Wish Motes**, carries one at a time back to Ame, manages a small personal Focus meter, places rate-limited visible pings, wakes harmless environmental flourishes, and casts **Dazzle & Compare**, a friendly guardian spell that makes the exact Power comparison more legible but does not change either number.

This is deliberately stronger than a decorative pointer and deliberately weaker than unrestricted through-wall collection:

- Player 2 has spatial mastery, target choice, resource timing, courier handoffs, visible credit, jokes, and a short loop that can run alongside Ame's route planning.
- Player 1 remains the only person who can solve or alter the base maze. Miri cannot reach back into historical fog, collect a key behind its own door, fetch equipment across a hazard, erase backtracking, soften a required guardian, trigger a rescue, or finish the maze.
- Every current or future maze remains a complete solo experience. Leaving Duo removes only transient companion state; it never invalidates a run.
- The safe version requires no co-op search state in the maze solver because every core `GameState` transition is still an Ame transition. A later arithmetic-support or authored dual-role version would require a separate rules-and-solver specification.

The minimum lovable fallback is **Sprig's Co-Star Spark**: flight, Duo-only motes and handoffs, one ping, social reactions, and no base-object or guardian interaction. The ambitious future pitch is **Twin Trails**: optional sky-lane puzzles that can be played by two people or solved solo by swapping roles. Twin Trails is more like authored asymmetric co-op and is not a retrofit-sized feature.

The largest uncertainty is not technical. It is whether the protected permission set leaves Player 2 with enough meaningful judgment to choose the companion role voluntarily after the novelty of flying wears off. The cheapest useful test is a 10–20 minute Amelia-and-parent placeholder slice that combines a visible key-behind-door trap, a courier handoff, a Power-sequence guardian, and a portal camera relocation, then swaps roles. Zero puzzle bypass is a hard gate; Player 2 agency, idle time, laughter, communication, and voluntary role choice decide whether the safe model is lovable.

## 2. Locked context versus open questions

### 2.1 Locked or adopted context

| Status | Constraint and consequence for Plan 10 |
|---|---|
| **Human direction** | Couch co-op is an important candidate, not a predetermined answer. The flying female companion is a starting point to test honestly. |
| **Adopted constraint** | Single-player remains the default, complete experience. No authored or generated maze may require a second human. |
| **Adopted constraint** | Plan 10 is future exploration only. Plans 01–09 retain their order and scope; prototyping waits until Plan 09 unless the Human explicitly reprioritizes it. |
| **Adopted constraint** | Ame remains the route-taking hero. Player 1 normally owns Ame and the camera/view pane. |
| **Adopted constraint** | Ordinary completion and optional/perfect rescue routes must remain fair and solver-verified. Optional play must remain unmistakably optional. |
| **Adopted constraint** | Friendly guardians follow the Polite Sword Rule. Equal Power wins, stronger guardians are harmless, and a defeated guardian gives Ame its complete printed Power. |
| **Adopted constraint** | Required challenge comes from noticing, sequence, route, memory, and changed-state returns—not hidden exceptions, endurance, or another player doing the answer. |
| **Adopted constraint** | Full, reduced-motion, and static presentation must communicate the same game truth. Essential meaning cannot depend only on colour, sound, motion, or haptics. |
| **Current fact** | The current engine has one actor position and one Bag/Power/progression state. There is no companion, player seat, shared cooldown, or co-op action type. |
| **Current fact** | Every current authored maze uses a player-centred 6×6 camera. Current visibility is the whole camera rectangle; walls do not occlude it. Historical reveal is a larger off-camera set used by the minimap. |
| **Current fact** | Current source has 16 story mazes. Plan 09, only after the preceding plans, expands the campaign to 24 while preserving stable IDs and records. |
| **Current fact** | Current source has no Gamepad API implementation. Plan 08 is designed for one active controller owner, not two simultaneous players. |

### 2.2 Open decisions

1. Is the companion a new original girl such as provisional **Miri**, existing Sprig, a Poggle projection, or another original direction?
2. Does Amelia enjoy being Ame, being the companion, or swapping frequently? No design document can answer this.
3. Is the product called **Play Together**, **Duo**, **Companion Play**, or something else? Avoid “helper,” “easy player,” and “Player 2 assist” as identity labels.
4. May Player 2 ever change an existing base-maze object? This plan recommends **no** for the first shippable version.
5. Is any arithmetic guardian assistance desirable enough to justify a separate Duo rules/solver mode and separate records? This plan recommends **no** until a playtest proves the safe role is insufficient.
6. Are mid-maze join, mid-maze role swap, and keyboard-plus-mouse required in the first release, or may any of them follow two-controller support?
7. Should Solo and Duo best records have parallel lanes? This plan recommends equal, separate lanes once Duo can affect information or pacing.
8. Are Duo-only cosmetic discoveries worth durable recognition, or should they remain session-only so solo never feels incomplete?
9. Which of the three cheap future-compatible seams, if any, may Plan 08/01/06 avoid closing without being asked to implement co-op?

## 3. Current-state repository audit

### 3.1 Audit boundary and moving-tree warning

**Current fact.** The mechanics, tests, and playable audit began at commit `a34de2f783d2f11c2b543541b4f46ffdf8b13fe0` while Pass 07A work was moving in the shared worktree. That concurrent work was committed as `555cdd622a98bd77585f2e60f1096712392d71b3` before final Plan 10 QA. The complete delta contains performance docs/evidence/scripts plus CI, documentation, ignore, and package-script wiring; it contains no runtime `src/`, level/campaign, save, progress, solver, UI, art, or controller implementation change. Plan 10 did not edit those files.

**Current workspace observation.** A later uncommitted working-tree snapshot contained incomplete Plan 06 work across levels, hints, solver, progress, session, and related UI/tests. It was still failing focused tests during a read-only check and was neither stable nor adopted authority. The current facts and playable observations below therefore remain frozen to the cited committed audit baseline; its eventual landed result must be re-audited at Gate 0. Plan 10 did not edit, repair, or reinterpret that concurrent work.

**Current fact.** The now-landed `docs/PERFORMANCE_BUDGETS.md` is the Pass 07A measurement/evidence contract: deterministic byte/provenance gates are active; timing evidence is contaminated/report-only; clean browser, low-end, memory, and Tauri/WebView2 cohorts remain pending. Final Gameplay, Art, UI/UX, Lighting, VFX, Controls/Steam Deck, and Animation implementation specifications anticipated by Plans 01–09 had not landed at final QA. This plan therefore distinguishes present implementation from adopted future contracts and must be rebaselined after Plan 09.

#### Authority-read ledger

The planning audit read in full: `docs/GAME_VISION_AND_DESIGN_SPEC.md`; the integrated roadmap; Plans 01–09 (including Plan 04's lighting/scene contract); current `README.md`, `docs/ARCHITECTURE.md`, and `docs/STORY_BIBLE.md`; and the landed Pass 07A performance budget/evidence contract. No separate final Gameplay, Art, UI/UX, Lighting, VFX, Animation, or Controls implementation specification was present in the current docs inventory.

Relevant source/test domains inspected were the level/type/generator model, pure engine and solver, exploration/camera/reveal, session/save sanitizer, progress/records/rewards, held movement, pointer/touch steering, App presentation/input/modal orchestration, art catalogue, terrain/scene/CSS layering, and their focused tests. The playable debug audit then exercised early, middle, portal, and final routes. This ledger records scope, not an assertion that the moving repository will remain unchanged; Gate 0 requires the same audit against final Plan 09 authority.

### 3.2 Present architecture and state authority

| Area | Current fact | Co-op consequence |
|---|---|---|
| App | React 19/Vite shared by web and Tauri; much orchestration remains in `src/App.tsx`. | Companion logic cannot be a second ad hoc input loop or DOM-side mutation. |
| Engine | `movePlayer(level, state, direction)` is a pure, immutable, one-cardinal-attempt transition. | Any stateful P2 mechanic needs a typed command and legality boundary; safe presentation-only P2 actions can stay outside core state. |
| Game state | One `position`, Power, equipment, keys, object sets, rescues, doors, treasure, status, and steps. | “Shared Bag” currently means Ame's one state, not a designed multiplayer inventory. |
| Object model | Enemy, sword, Boots, Spring Boots, Antidote Leaf, potion, key, door, animal, portal, and treasure. Exit is a coordinate, not an object. | No current object is companion-eligible. P2 must not be granted implicit access by object kind. |
| Solver | Breadth-first search replays the exact engine transition and signs one Ame state. Perfect mode adds animals; ordinary mode does not. | Any P2 change to Power, required items, doors, fog, position, or resolved objects invalidates the current solver model. |
| Camera | Presentation only; world coordinates remain authoritative. Current view is a clamped 6×6 rectangle. | P2 may be camera-bound without becoming a second camera. DOM mounting is not a rules predicate. |
| Reveal | Immutable union of all camera rectangles Ame has visited. No line-of-sight calculation exists. | “Already revealed” permits off-camera reach and erases backtracking; use current camera, not historical reveal alone. |
| Save | Active-run schema stores the one game state plus revealed tiles; curated normal playing runs only. | Companion position/device identity must not be required to resume. Ad hoc P2 pickup or Power edits currently fail validation. |
| Progress | One best-record structure per level, no Solo/Duo dimension. | Any mechanically meaningful Duo result needs an intentional migration and record policy. |
| Input | Arrow/WASD, board pointer/touch steering, on-screen arrows; held movement is immediate, then 320 ms, then 260→160 ms repeats. | Mouse is presently P1 board steering. Duo mouse mode must explicitly transfer board-pointer ownership to P2. |
| Controller | No `navigator.getGamepads`, connection events, seats, glyphs, or disconnect model. | A future passing Plan 08 still does not imply simultaneous controllers. |
| Performance | Landed Pass 07A counts 139 catalog assets/89.33 MB, blocks unallocated compressed JS/CSS/public growth, and keeps timing report-only pending clean cohorts. | P2 flight must use a scene-local transform/store, not React state on every animation frame; code/assets need explicit ledger allocation plus qualified runtime evidence. |

### 3.3 Exact gameplay rules that companion permissions must preserve

- Cardinal movement only. Out-of-bounds and walls block.
- Water and lava both require Splash Boots. Poison requires the Antidote Leaf.
- A Spring jump is one straight input over the complete contiguous hole run to the first non-hole landing; Ame cannot turn or stop in the air.
- A key is reusable. A matching door opens permanently; the key is not consumed.
- Ame needs a weapon before a friendly guardian comparison. If `AmePower < GuardianPower`, nothing changes and Ame stays one square away. If `AmePower >= GuardianPower`, the guardian is resolved, Ame gains the guardian's complete printed Power, and Ame still stays on her original square until the next input.
- Portals are permanent matched pairs. Entering one relocates Ame to its twin in the same movement transition. The portal never becomes resolved.
- A rescue happens once when Ame enters the animal's cell. Rescues are not Bag items.
- Equipment, keys, potions, and treasure are collected when Ame enters their cells. Treasure banks only at completion under current progress rules.
- Entering the exit coordinate wins immediately. There is no separate exit object or companion-safe “touch goal” verb.

### 3.4 Save and solver hazards

**Current fact.** Active-run validation reconstructs Power from initial Power, collected potions, and defeated guardians; it derives equipment, keys, and treasure from collected IDs; it rejects inconsistent resolved objects and illegal positions. A zero-step P2 pickup can also contradict the current resolved-object/step assumptions. Permanent Power softening, P2 collection directly into the Bag, or UI-only object deletion is therefore not merely risky design—it conflicts with current persistence authority.

**Design inference.** The safest first co-op layer is one whose critical-state projection is identical to solo:

```text
projectCoreState(after any P2 action) = projectCoreState(before that P2 action)
```

Motes, pings, target readouts, cosmetic flourishes, and companion presentation may change. Position, reveal, base object resolution, Power, equipment, keys, doors, rescues, treasure, status, and exit state may not.

### 3.5 Playable audit

The current Vite build was inspected through `?debug=mazes` using the installed Playwright workflow and the in-app browser. Tester runs explicitly suppress persistence and rewards.

| Representative route | Observed current behavior | Plan 10 implication |
|---|---|---|
| **Early — Shiny Sword (11×11)** | Starts at Power 2 with a 6×6 view. The first 36/121 tiles reveal a spear, key, cage, and walls; wall bumps do not advance the movement step count. | A square camera can show an item across a wall or gate. “Visible” cannot imply “safe for P2 to collect.” |
| **Middle — Moonlit Friendship Quest (23×23)** | Starts with 36/529 revealed (7%); two legal moves shifted the camera and increased history to 42/529 while the off-camera landmarks remained listed. Bag needs weapon, three traversal tools, and three keys. | Historical reveal is materially wider than the current view and would erase route/backtracking if used as P2 reach. |
| **Portal — Rose Heart Roundabout (15×15)** | An actual 20-step debug route entered the Rose Heart Portal at column 6, row 6 and emerged at column 9, row 14. The camera relocated, feedback said the flower found its twin, and global reveal reached 108/225 (48%). | P2 must never pull the camera or stay stranded at the departure view. A portal transition needs deterministic docking/repositioning. |
| **Final — Rainbow Power Parade (21×21)** | Starts at 36/441 revealed (8%) beside the weapon, a locked Sunny door, Power 2 and Power 99 guardians, a potion, treasure, and a later Power 20 guardian. The stated job is sequence and backtrack to Power 99. | Unrestricted pickup or any unconditional Power reduction can erase the finale's defining puzzle. Current forced rescues are a known Plan 06 defect, not a co-op design opportunity. |

Seven focused mechanics suites passed 174/174 tests during the audit: engine, exploration, levels, session, progress, pointer controls, and held movement. That establishes a reliable current baseline, not approval for future exceptions.

At final-head QA, the same seven-suite command produced 172 passes and two explicit per-case timeouts in the existing `Friendship Crown Vault` level analysis (5-second and 10-second limits), with no assertion mismatch; an isolated rerun again exceeded the fixed 10-second limit. Because `a34de2f..555cdd6` contains no `src/` or test change, this is recorded as host-load/timing evidence rather than a new gameplay result. Gate 0 must rerun the full baseline on the then-qualified host; Plan 10 does not alter a timeout or test to obtain green output.

### 3.6 Current defects not to design around

- Current hint reachability is App-local flood fill and does not correctly model portals or complete multi-hole jumps. Plan 06 owns the engine-consistent replacement.
- Current hint priority can prefer an optional rescue before portal guidance. Plan 06 owns required-versus-optional hint truth.
- Current modal/input policy is fragmented, and some movement can leak behind overlays. Plans 01 and 08 own the consolidated interaction policy.
- Current keyboard/on-screen movement receives pointer corner assistance despite documentation saying pointer-only. Plan 08 owns the correction.
- Current finale forces all rescues despite the adopted optional-rescue contract. Plan 06 owns the level/solver correction.

No Plan 10 rule may depend on any of those temporary defects.

## 4. Research, precedents, and tooling record

All external sources in this section were accessed on **2026-09-02**. Official manuals and platform specifications are strong evidence that a feature or API rule exists, but not that Maze so Puzzle families will enjoy it. The cited family and co-op studies are informative but often small, adult-heavy, custom-game, or older; their findings are design warnings and hypotheses, not universal truths.

### 4.1 Cooperation and mixed-skill play

| Source finding | Evidence strength and limit | Design inference for Maze so Puzzle |
|---|---|---|
| Cooperative games commonly use complementary abilities, teammate-only actions, shared or intertwined goals, role-specific switches, scouting, protection, and shared-resource management. [Rocha & Mascarenhas, *Game Mechanics for Cooperative Games*](https://fenix.tecnico.ulisboa.pt/downloadFile/395138343981/artigo.pdf) (accessed 2026-09-02). | Design framework and game analysis, not a family trial. | Give P2 exclusive verbs and visible credit, but do not make a critical shared consumable. |
| In an observational co-op study, waiting and obstruction were frequently associated with camera behavior; the study also treated laughter, strategy negotiation, helping, complementary responsibility, and getting in the way as meaningful co-op behaviors. [Seif El-Nasr et al., *Understanding and Evaluating Cooperative Games*](https://doi.org/10.1145/1753326.1753363) (accessed 2026-09-02). | 60 participants/25 sessions across four games; not child-specific. | Camera tether conflict is a primary playtest metric, not polish. Instrument social behavior, not completion alone. |
| A controlled custom-game study found greater interdependence produced more communication and less frustration, while shared control reduced competence and autonomy. [Emmerich & Masuch, *The Impact of Game Patterns...*](https://doi.org/10.1145/3116595.3116606) (accessed 2026-09-02). | One experimental game. | Players should own different decisions; do not let both seats steer Ame or one menu cursor. |
| Designed asymmetry can improve social engagement when the direction and timing of dependence are deliberate. [Harris et al., *To Asymmetry and Beyond!*](https://doi.org/10.1145/3290605.3300239) and [Beam Me Round, Scotty](https://uwaterloo.ca/games-institute/sites/default/files/uploads/documents/johnharris_beam-me-round-scotty.pdf) (accessed 2026-09-02). | Custom adult studies, not proof for children. | Create explicit request/response moments instead of permanently making one role subordinate. |
| Deliberately unequal roles can still be equitable in mixed-visual-ability pairs. [Metatla et al., *Exploring Asymmetric Roles in Mixed-Ability Gaming*](https://doi.org/10.1145/3411764.3445494) (accessed 2026-09-02). | 13 pairs and a specific disability context. | Equal dignity does not require identical mechanics or difficulty. It does require understandable, attributable contribution. |
| A tiny parent-child video study observed tension when the less-skilled player's execution blocked the more-skilled player, compounded by camera dependence. [Aarsand & Aronsson, *You Have to Die!*](https://doi.org/10.1145/2307096.2307147) (accessed 2026-09-02). | Only two dyads. Use as a warning, not a statistic. | P2 failure should lose a short opportunity, not block Ame's route; P1 camera motion should not punish P2. |
| Six adult-child pairs using strongly asymmetric roles shared information and learned roles when contributions were salient; subtle optional help was often missed and adults could find an intentionally simple role boring. [*Promoting Family Play through Asymmetric Game Design*](https://publikationen.bibliothek.kit.edu/1000170481/152879727) (accessed 2026-09-02). | Small, week-long, asynchronous study. | Make support invitations visible and valuable. “Simple” cannot mean empty. |
| Positive family-game interviews describe shifting leadership, spectating, conversation, and management of collaboration as part of family play. [*Gaming as Family Time*](https://doi.org/10.1145/3474678) (accessed 2026-09-02). | Parent-heavy sample recruited for positive experiences. | Make role swap easy and celebrate both roles; do not assign the child the “lesser” seat. |
| Video ethnography of naturally occurring virtual-game play among sibling pairs/groups aged roughly 4–9 describes collaborative expertise as something children build through comments, response cries, embodied timing, and shifting “sidekick/co-player” positioning. [Ågren, *Animation in children's gameplay: collaborative action and sibling play*](https://doi.org/10.1080/10749039.2022.2152050) (accessed 2026-09-02). | Small qualitative sibling-play evidence, not an asymmetric-role intervention or outcome trial. | For child/child play, observe negotiated leadership, uptake, ignored requests, teasing/blame, and role language; do not assume an adult mediator will repair an unclear permission rule. |
| Joint media guidance emphasizes clear participant roles, understandable goals, and adult attention-guiding. [Joan Ganz Cooney Center, *The New Coviewing*](https://joanganzcooneycenter.org/publication/the-new-coviewing-designing-for-learning-through-joint-media-engagement/) (accessed 2026-09-02). | Synthesis/cases, not a controlled co-op game trial. | Onboarding should say what each person owns without shaming or over-instructing. |

### 4.2 Mechanic precedents — principles only

These references are not licences to copy a character, visual identity, name, level, or signature mechanic.

| Precedent | Observed source fact | Principle, not copy |
|---|---|---|
| **Super Mario Galaxy 2 — Co-Star Luma** | Nintendo's manual describes a pointer-controlled P2 who collects coins/Star Bits, shoots, and affects some enemies; the developer interview describes expanding P2 beyond merely stopping enemies and includes carrying items to Mario. [Official manual](https://csassets.nintendo.com/noaext/image/private/t_KA_PDF/Wii_Super_Mario_Galaxy2_Eng?_a=DATAg1AAZAA0) and [Iwata Asks](https://iwataasks.nintendo.com/interviews/wii/supermariogalaxy2/1/5/) (accessed 2026-09-02). | Pointer flight and courier delight can work, but Maze so Puzzle's route-gating items make equivalent permissions unsafe. |
| **Child of Light — Igniculus** | The official manual assigns Aurora to keyboard and Igniculus to mouse or a second controller; Igniculus heals, blinds exploration creatures, slows a battle target, and consumes a replenishing Light Meter. [Official manual](https://cdn.akamai.steamstatic.com/steam/apps/256290/manuals/ChildOfLight-en.pdf?t=1397825798) (accessed 2026-09-02). | Mouse/controller asymmetry and a bounded support economy are strong precedents; exact effects must fit this game's harmless guardian arithmetic. |
| **Super Mario Odyssey — Cappy** | Official support permits starting/stopping co-op in a menu and switching roles; P1 controls Mario and P2 controls Cappy. [Nintendo support](https://en-americas-support.nintendo.com/app/answers/detail/a_id/27785/p/988/c/950) (accessed 2026-09-02). | Drop-in/out and role switching are product features, not merely input plumbing. |
| **Kirby and the Forgotten Land — Bandana Waddle Dee** | Nintendo describes a camera that follows Kirby while actively keeping P2 visible, and discusses parent-child help. [Ask the Developer, Vol. 4 Part 4](https://www.nintendo.com/us/whatsnew/ask-the-developer-vol-4-kirby-and-the-forgotten-land-part-4/) (accessed 2026-09-02). | P1 camera authority still requires explicit P2 recovery rules and family testing. |
| **Never Alone — Nuna and Fox** | Official material divides traversal abilities, allows solo role switching, a second controller to join, and return to solo. [Official site](https://www.neveralonegame.com/never-alone) and [manual](https://dlassets-ssl.xboxlive.com/public/content/fa4cd99a-6a3e-4d5f-a37c-5963f7374b94/GameManual/b66743bc-5815-42f3-9c00-f4f684f430e4/en-IL/index.html) (accessed 2026-09-02). | Deep asymmetric puzzles need authored role rules or solo switching; they are not a cheap retrofit. |
| **Rayman Legends — Murfy** | Ubisoft describes Murfy cutting ropes, moving environmental elements, and revealing paths while other players run and jump, with drop-in/out. [Official Nintendo product page](https://www.nintendo.com/en-gb/Games/Wii-U-games/Rayman-Legends-592895.html) (accessed 2026-09-02). | Environmental support can be satisfying when the invitation and outcome are legible; invisible optional hooks will be missed. |
| **Pikmin 4 — Pebble Pitcher** | Nintendo describes a Story-mode P2 pointer that throws pebbles and can use helpful items; co-op is entered/exited from Options. [Official site](https://pikmin4.nintendo.com/) and [support](https://en-americas-support.nintendo.com/app/answers/detail/a_id/62458/p/988/c/120) (accessed 2026-09-02). | A deliberately light assist role should be labelled honestly and not confused with full asymmetric Duo. |
| **Captain Toad: Treasure Tracker** | Nintendo distinguishes fuller two-player exploration from a lighter pointer role that shoots turnips and stops foes. [Official page](https://www.nintendo.com/en-gb/Games/Nintendo-Switch-games/Captain-Toad-Treasure-Tracker-1348071.html) (accessed 2026-09-02). | Minimum assist and recommended Duo may be separate promises rather than one ambiguous toggle. |
| **Chicory, Spiritfarer, and Pode** | Official pages describe P2 painting alongside the hero, Daffodil joining gentle parallel activities, and two distinct puzzle abilities usable cooperatively or by solo switching. [Chicory](https://www.chicorygame.com/), [Spiritfarer](https://thunderlotusgames.com/games/spiritfarer/), and [Pode](https://podegame.com/) (accessed 2026-09-02). | Creative expression, parallel tasks, and solo role parity are richer alternatives to “P2 weakens enemy.” They also demand content and feedback scope. |

### 4.3 Input, platform, and accessibility sources

- **Source finding.** `Gamepad.index` is connection-order/lifetime identity only; disconnect leaves a `null` slot and later connections reuse vacancies. `Gamepad.id` is not a unique controller identity. Only `mapping === "standard"` guarantees the canonical layout, and `getGamepads()` may remain empty until a gamepad gesture. [W3C Gamepad](https://www.w3.org/TR/gamepad/) and [MDN, Using the Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API) (accessed 2026-09-02).
- **Source finding.** Native Steam Input enumerates controller handles that are stable within the active Steam Input/provider runtime and supports multiple controllers; they are not proposed as persistent human identity across sessions. Steam-emulated input may appear as a generic gamepad, and Valve warns local multiplayer to handle conventional and Steam Input paths without double input. [Valve `ISteamInput`](https://partner.steamgames.com/doc/api/isteaminput?language=english), [Getting Started for Developers](https://partner.steamgames.com/doc/features/steam_controller/getting_started_for_devs), and [Steam Deck FAQ](https://partner.steamgames.com/doc/steamhardware/steamdeck/faq?l=english) (accessed 2026-09-02).
- **Source finding.** Pointer capture only applies to an active pointer/button contact and is released at pointer end; it is a drag tool, not a button-free hover-flight solution. Pointer Lock hides the cursor, uses relative motion, normally requires activation, and has compatibility/accessibility concerns. [W3C Pointer Events](https://www.w3.org/TR/pointerevents/), [W3C Pointer Lock 2.0](https://www.w3.org/TR/pointerlock-2/), and [MDN Pointer Lock](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API) (accessed 2026-09-02).
- **Source finding.** Microsoft's controller-removal guidance uses explicit “Press A” rebinding and recommends pausing when the active controller is removed while allowing unaffected players to continue where practical. [Microsoft XR-115](https://learn.microsoft.com/en-us/gaming/gdk/docs/store/policies/xr/xr115?view=gdk-2604) (accessed 2026-09-02).
- **Source finding.** Xbox Accessibility Guidelines recommend multimodal cues, digital alternatives to analog tasks, avoidance of mandatory rapid/held/chorded inputs, independently adjustable haptics, visible focus, destructive confirmation, and reduced visual motion. [XAG 103](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/103), [107](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/107), [110](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/110), [115](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/115), and [117](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/117) (accessed 2026-09-02).
- **Source finding.** WCAG requires alternatives to dragging, prohibits colour-only meaning, supports keyboard operation where path gesture is not intrinsic, and calls for reduced interaction-triggered animation. [WCAG Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html), [Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html), [Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html), and [Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions) (accessed 2026-09-02).

### 4.4 Skills and tooling record

1. The installed `product-brainstorming` workflow was used first to frame jobs, deliberately diverge, provoke weak assumptions, and postpone selection.
2. The installed `synthesize-research` workflow was then used to separate repository facts, Human constraints, external source findings, design inference, confidence, and contradiction.
3. The installed `write-spec` workflow was used only after divergence to make prototype rules, gates, acceptance criteria, and rollback precise.
4. The user-scoped skill installer searched the official curated catalogue for local multiplayer, game controls, child UX, cooperative game design, playtesting, and accessibility. The existing Playwright skill was already installed; no specialist match materially improved this task. The documented experimental catalogue path was unavailable. **No skill was installed**, because a generic or adjacent skill would add process without relevant authority. No repository dependency changed.
5. The installed Playwright workflow and in-app browser inspected the current debug build at early, middle, portal, and final levels. Temporary browser artifacts were removed; no test package was added to the repository.
6. Focused mechanics tests passed 174/174 at the mechanics/playable audit baseline. The final-head rerun passed 172 and hit the two documented `Friendship Crown Vault` per-case timeouts with no assertion mismatch. No implementation, asset, existing-plan edit, dependency, deployment, or publication was performed.

## 5. Player jobs and design principles

### 5.1 Functional, emotional, and social jobs

| Pairing / role | Functional job | Emotional job | Social job | Failure to avoid |
|---|---|---|---|---|
| **Player 1 as Ame** | Choose the route, move, own the camera, collect every base item, reason about prerequisites, complete interactions, and decide when to ask for hints. | Feel brave, clever, and responsible for the adventure. | Name the plan, pace the shared screen, invite a handoff, acknowledge P2's contribution. | Feeling that P2 solved, fetched, or weakened away the maze. |
| **Player 2 as companion** | Patrol the current view, choose a useful companion opportunity, retrieve Duo-only motes, hand them to Ame, ping, time a safe guardian readout, and create delight. | Feel nimble, magical, funny, skilful, and visibly needed. | Notice something, propose it, respond to Ame, celebrate, and occasionally wait by choice rather than because there is nothing to do. | Becoming a decorative cursor, an adult's laser pointer, or an unlimited shortcut. |
| **Child Ame + adult companion** | Child owns route and inputs; adult can surface information but cannot collect/solve/advance it. | Child remains the hero. Adult can contribute without taking the controller. | Adult asks (“Want a sparkle here?”) rather than commands. | Constant adult pings or instructions becoming remote-control parenting. |
| **Child companion + adult Ame** | Adult moves at a pace that exposes opportunities; child flies, chooses targets, carries, and gets attributed payoffs. | Child masters a magical role rather than receiving a consolation role. | Adult requests help and waits for the child's answer. | Adult dragging the camera so quickly that the child only snaps and follows. |
| **Two children** | Each has exclusive verbs; neither can spend/delete the other's critical state. | Both can be funny and proud without one being “the baby role.” | Negotiate route pace, mote handoffs, pings, and guardian timing. | Shared-resource grief, menu fights, camera tug-of-war, or blame for blocking progress. |
| **Role swap** | Atomically exchange actor-to-seat bindings at a safe state; the world state does not reset. | Let both try the glamorous and thoughtful parts. | Reveal balance problems and encourage empathy for the other job. | Treating a swap as a difficulty demotion or forcing it on a child. |

### 5.2 Design principles

**Exploratory recommendations — non-canon pending Human approval.**

1. **Ame owns the answer.** Required topology, movement, Bag, Power, doors, hazards, rescues, portals, and exit remain P1 authority.
2. **The companion owns a real loop.** Movement alone is not agency. P2 needs target choice, timing, a bounded personal economy, visible authorship, and a short mastery curve.
3. **Interdependence is beneficial, never mandatory.** P2 can make the moment clearer, funnier, or more efficient within the companion layer. P2 absence never blocks a base path.
4. **Permissions prevent grief.** Good intentions are not a rules system. P2 cannot consume critical resources, move Ame, change the camera, dismiss story, spend hints, alter saves, or trigger victory.
5. **Support is reversible and additive.** Prefer pings, charging new opportunities, readouts, momentary presentation, and Duo-only motes over permanent base-state edits.
6. **Contribution is explicit.** A request, target outline, named result, and short acknowledgement make help legible. Invisible buffs and subtle optional hooks are weak family communication design.
7. **P2 failure costs seconds, not the run.** A missed mote or expired cheer can be tried again. It cannot strand an item, lose currency, close a route, or create blame.
8. **P1 cannot punish P2 accidentally.** Camera shifts clamp or dock the companion predictably. There is no health, fall, death, long respawn, or lost carried critical item.
9. **Quiet remains allowed.** Companion opportunities have density caps and calm intervals. Co-op must not turn a noticing puzzle into constant particle chasing.
10. **Both roles work without colour, sound, motion, haptics, analog precision, holds, chords, or rapid taps.** Every analog action has a D-pad/digital alternative.
11. **The shared screen has one UI pilot.** Both may request pause; one named authority owns global focus and destructive confirmations.
12. **Solo is not lesser; Duo is not invalid.** Completion, rescues, unlocks, and rewards are equally real. Comparable records may have separate lanes without value judgment.

## 6. Divergent concept space

No concept in this section is approved. The names are working labels. Concepts deliberately differ in the source of agency, not merely the companion's costume.

### 6.1 Unfenced Wishflight

This is the Human's permissive proposal in its strongest form and is included as a serious stress case, not a straw person.

- **Fantasy:** a provisional original girl wish-sprite flies anywhere in Ame's view, crosses walls/hazards, collects visible base objects, and magically reduces guardian Power.
- **P1 loop:** route and move Ame while calling out pickups or guardians for P2.
- **P2 loop:** sweep the camera for objects, collect directly into the shared Bag, and soften the next guardian.
- **Cooperation moments:** “Fetch that key,” quick collection races, and combined guardian encounters.
- **Meaningful-decision cadence:** every 2–6 seconds; very high activity.
- **Domination/grief prevention:** camera tether and cooldowns help, but do not solve the core permission problem. P2 can still erase P1's decisions; P1 can still drag P2 away.
- **Existing-maze effect:** severe. Keys behind their doors, equipment across hazards, potion/guardian sequencing, backtracking, optional branches, and the finale can all collapse merely because objects share a 6×6 rectangle.
- **Solo compatibility:** solo remains possible, but Duo becomes a materially different and often much easier ruleset.
- **Technical scope:** core engine commands, solver, hints, session validation, progress schema, records, object ownership, combat arithmetic, input seats, camera, and presentation.
- **Largest likely failure:** it is immediately busy and delightful, then makes Ame's route puzzle feel unnecessary.

### 6.2 Starpost Courier

- **Fantasy:** a tiny magical courier can carry one eligible thing but cannot own critical progression.
- **P1 loop:** expose a useful area, keep planning, and meet the courier for a handoff.
- **P2 loop:** choose one eligible target, fly to it, reserve/pick it up, protect the carry as the camera moves, and return to Ame.
- **Cooperation moments:** deciding which target matters and creating a rendezvous.
- **Meaningful-decision cadence:** roughly every 6–15 seconds when opportunities are present.
- **Domination/grief prevention:** a one-item capacity, no dropping onto arbitrary cells, deterministic return-to-origin, and an allow-list that excludes all base progression. P1 never has to accept a critical change.
- **Existing-maze effect:** safe when eligibility means new Duo-only motes; increasingly destructive if it includes existing treasure, rescues, or Bag items.
- **Solo compatibility:** full; Duo-only targets are absent or inert in solo.
- **Technical scope:** companion position, reservation/carry/handoff state, overlay placement, camera recovery, input seats, and join/leave cleanup. Base-item carrying additionally requires engine/save/solver work.
- **Largest likely failure:** if only harmless objects are eligible, the courier may feel like a separate collectible minigame rather than help with Ame's adventure.

### 6.3 Poggle's Pocket Maplight

This concept uses an existing Puzzlewild character direction: Poggle projects a controllable magical maplight rather than becoming a second physical hero.

- **Fantasy:** Player 2 is Poggle's hovering lamp of scholarship, circling already-known places and stamping “look,” “later,” or “we need...” symbols.
- **P1 loop:** move and solve; decide whether to follow a mark or ask for the next Hint tier.
- **P2 loop:** inspect the current view/minimap, compare visible prerequisites, place one high-value mark, and clear or revise it as the plan changes.
- **Cooperation moments:** P2 notices a key/door relationship or return route; P1 explains or revises the route.
- **Meaningful-decision cadence:** every 10–25 seconds, concentrated around planning beats.
- **Domination/grief prevention:** one mark at a time, a 5-second replace cooldown, P1-owned Hint advancement, and a P1 “quiet pings” preference.
- **Existing-maze effect:** little mechanical impact; information pacing can still be flattened if the maplight reveals hidden topology or computes answers, so it may mark only current/previously revealed facts.
- **Solo compatibility:** current minimap and hints remain complete; no P2-only clue.
- **Technical scope:** seat-aware pings, map/viewport transforms, semantic object labels, accessible marker vocabulary, and optional Poggle presentation.
- **Largest likely failure:** an experienced adult turns it into a laser pointer and quarterbacks the child, while a child P2 finds the long planning intervals too quiet.

### 6.4 Friendship Loom

- **Fantasy:** P2 weaves a bounded ribbon of friendship magic, choosing when to dazzle, encourage, calm, or reveal a guardian's weakness.
- **P1 loop:** build Power and position Ame; invite a spell at the right encounter.
- **P2 loop:** gather or regenerate Focus, select a visible legal target, choose/spend a spell, and time it with Ame.
- **Cooperation moments:** request/cast/response windows and explicit shared guardian ceremonies.
- **Meaningful-decision cadence:** every 6–15 seconds when Focus/opportunities are balanced well.
- **Domination/grief prevention:** P2-owned noncritical Focus, hard target predicates, no stacking, refunds on invalid targets, and P1 core-state authority.
- **Existing-maze effect:** information/presentation spells are safe; any numeric or pass-through spell can rewrite the Power sequence and needs its own solver mode.
- **Solo compatibility:** all base guardians remain unchanged; solo never needs Focus.
- **Technical scope:** from moderate for non-arithmetic target effects to very high for arithmetic state, save, replay, solver, hints, and record separation.
- **Largest likely failure:** the safe spell feels fake because current guardians do not attack, while a consequential spell breaks the puzzle.

### 6.5 Sprig's Mischief Garden

This concept uses existing Puzzlewild character **Sprig**. Sprig is an established baby cloud-dragon and is not recast as the provisional female companion.

- **Fantasy:** Player 2 controls mischievous Sprig, who tickles flowers, wakes wall faces, sniffs out Duo-only jokes, and carries tiny cloudberries back to Ame.
- **P1 loop:** explore and choose route; slow down near a curious scene if desired.
- **P2 loop:** find visual opportunities in the current camera, try context reactions, collect harmless motes, and trigger comic acknowledgements.
- **Cooperation moments:** shared surprise, “come look at this,” and a courier return.
- **Meaningful-decision cadence:** every 5–12 seconds in decorated spaces, with intentional quiet gaps.
- **Domination/grief prevention:** Sprig cannot touch base objects, spam is capped per opportunity, and P1 can keep moving without losing anything.
- **Existing-maze effect:** puzzle-neutral; needs a deterministic generic fallback where no authored flourish exists.
- **Solo compatibility:** every scene remains complete without the extra reaction; no collectible total implies solo incompleteness.
- **Technical scope:** companion overlay, environmental opportunity catalogue, presentation/audio, seat input, and lifecycle; no core solver change.
- **Largest likely failure:** delightful for five minutes but too parallel and inconsequential for a full campaign role.

### 6.6 Pass the Star

- **Fantasy:** a magical cape or star token passes between two explorers. One person moves Ame; the other is a visible planner/maplight, and they swap at safe pauses or self-chosen intervals.
- **P1 loop:** execute a short route segment and narrate the decision.
- **P2 loop:** watch, mark a plan, operate the map/hint request, and ask to swap.
- **Cooperation moments:** plan-execute-review, voluntary teaching, and role exchange.
- **Meaningful-decision cadence:** a substantial choice every 20–60 seconds rather than continuous action.
- **Domination/grief prevention:** atomic swap at neutral input; no mid-action controller stealing; no fixed “adult is planner” assignment.
- **Existing-maze effect:** none; it formalizes a family behavior already possible by passing a controller.
- **Solo compatibility:** identical.
- **Technical scope:** low to moderate—role prompts, seat swap, one maplight marker, and safe neutral gates.
- **Largest likely failure:** it is not simultaneous co-op and can formalize waiting rather than eliminate it.

### 6.7 Sprig's Co-Star Spark

- **Fantasy:** a deliberately minimal flying co-star gathers Duo-only sparks, delivers them to Ame, pings a visible spot, cheers, and reacts to the world.
- **P1 loop:** play the unchanged maze and occasionally make room for a handoff.
- **P2 loop:** free-fly, choose a spark, carry one, return, ping, and emote.
- **Cooperation moments:** courier rendezvous, one-at-a-time pings, and shared celebration.
- **Meaningful-decision cadence:** every 8–18 seconds, depending on mote density.
- **Domination/grief prevention:** no base-state authority; one ping; no camera movement; no shared consumable; all transient state dissolves safely.
- **Existing-maze effect:** none beyond bounded presentation overlays.
- **Solo compatibility:** exact base parity.
- **Technical scope:** smallest genuine simultaneous version: seats, flight/tether, mote/handoff overlay, join/leave, prompts, and accessibility.
- **Largest likely failure:** P2 correctly describes the job as “chasing dots while you play the real game.”

### 6.8 Twin Trails

This ambitious alternative explicitly challenges the premise that unrestricted wall flight is essential.

- **Fantasy:** Ame walks the ground route while the companion follows a separate visible sky-lane/perch network. The two align at optional constellation mechanisms. In solo, the player can swap roles at safe perches.
- **P1 loop:** solve the base route and choose whether to detour toward an optional joint alignment.
- **P2 loop:** navigate a different graph, rotate/charge perches, read sky symbols, and rendezvous with Ame.
- **Cooperation moments:** simultaneous alignment, divided observation, mutually requested route timing, and role-specific discoveries.
- **Meaningful-decision cadence:** every 3–10 seconds in authored segments.
- **Domination/grief prevention:** base route never depends on the sky lane; missed alignment resets locally; solo role-swap proves no second human is required.
- **Existing-maze effect:** generic overlays would be weak; satisfying lanes require authored content and a new content grammar. Existing mazes can remain unchanged while selected future/optional versions receive lanes.
- **Solo compatibility:** mandatory for approval through safe role switching; no reward may require a second human.
- **Technical scope:** second navigation graph, authored optional mechanisms, solo swap, dual-action rules, content validator, solver extension, save, camera, UI, art, VFX, and performance.
- **Largest likely failure:** it becomes an entire second game layered onto maze content and delays the core roadmap for a feature Amelia may not prefer.

### 6.9 Rescue Chorus

- **Fantasy:** P2 briefly embodies or calls on already-rescued friends, each with a playful noncritical verb—sniff, hum, sparkle, fan, or giggle.
- **P1 loop:** rescue normally and request a friend reaction when an opportunity appears.
- **P2 loop:** choose a friend, perform its verb on an allowed target, manage a short recharge, and rotate personalities.
- **Cooperation moments:** choosing “who could help?” and celebrating a previously rescued friend.
- **Meaningful-decision cadence:** every 6–15 seconds after at least one friend is available.
- **Domination/grief prevention:** verbs cannot alter required state, recharges are personal, and a no-rescue level still gives a default companion action.
- **Existing-maze effect:** can reuse animal art and emotional context, but linking useful power to optional rescues risks making rescue feel required.
- **Solo compatibility:** solo retains every route and reward; no friend verb contains exclusive information.
- **Technical scope:** character roster, per-species reactions, target rules, presentation catalogue, many assets/animations, and save policy if roster selection persists.
- **Largest likely failure:** combinatorial art/scope grows while the underlying verbs remain shallow, and “optional” rescues become socially pressured.

### 6.10 Miri's Wishwing Courier

This is the hybrid recommended for a placeholder prototype, not approved character or product canon.

- **Fantasy:** **Miri** (working name, she/her), an original wish-sprite, darts through the current view, catches one Wish Mote, delivers it to Ame as Friendship Focus, marks a shared idea, wakes harmless flourishes, and makes a guardian comparison sparkle clearly.
- **P1 loop:** solve and move Ame, pace the camera, respond to a ping or handoff, and choose the real route/interaction.
- **P2 loop:** choose among a mote, an environmental opportunity, a ping, or a guardian readout; fly, act, return, and spend/regain Focus.
- **Cooperation moments:** camera-space negotiation, courier rendezvous, explicit “look/later” proposals, and timed guardian celebration.
- **Meaningful-decision cadence:** target 4–10 seconds during active exploration, with deliberate calm intervals and no penalty for missing an opportunity.
- **Domination/grief prevention:** all base-state permissions remain with Ame; P2 owns only transient Focus; one ping and one carried mote; target/cast cooldowns; no camera, menu, hint-tier, or save authority.
- **Existing-maze effect:** base transition graph is identical. Duo overlays derive independently from stable level/revision/camera facts and never occupy, hide, or resolve a base object.
- **Solo compatibility:** complete. Join and leave can occur mid-maze at safe states, and reload always resumes valid solo play.
- **Technical scope:** seat-aware input, continuous companion presentation, deterministic overlay opportunity scheduler, Focus/mote/ping state, non-arithmetic target readout, join/leave/menu UI, records metadata, accessibility, art/VFX/audio, and performance qualification.
- **Largest likely failure:** after puzzle permissions are protected, the four small verbs may still feel like side work rather than a co-authored adventure. This is the central prototype question.

## 7. Flying-helper collection stress test

### 7.1 Five collection models

| Model | Exact proposed rule | What it preserves | What it risks | Disposition |
|---|---|---|---|---|
| **C1 — optional only** | P2 may collect new Duo-only Wish Motes. Existing treasure may be marked but not collected. A separately reviewed easy-Duo variant could allow explicitly tagged base treasure, never by kind-wide default. | Required route, Bag, hazards, Power, solver, exit, and save. | Existing treasure is still route/reward content; allowing it reduces optional exploration and changes currency/records. | **Recommended only for new Duo-only motes.** Base treasure remains Ame-only in the first version. |
| **C2 — carry a visible base item** | P2 reserves one visible item, displays it as carried, and hands it to Ame. Until handoff a ghost anchor remains at origin; leave/disconnect returns it there. | Prevents literal item stranding when implemented correctly. | If handoff grants the item away from origin, it still bypasses the route/gate. If it does not, the “carry” is deceptive decoration. | **Reject for every existing base object.** Use this fantasy for Duo-only motes. |
| **C3 — collect required item into shared Bag** | A legal P2 touch immediately applies the same object resolution/equipment/key/Power event as Ame entry. | High P2 immediacy. | Maximum puzzle erasure; current save/steps/solver conflict; key-behind-own-door, hazard, Spring, portal, and backtracking bypass. | **Reject.** Not in minimum, recommended, or ambitious pitch. |
| **C4 — touch then cooperative handoff** | P2 “attunes” an item; P1 must accept or meet P2 before it resolves. | Adds a visible social beat and avoids unilateral collection. | A handoff anywhere still bypasses reaching the object's cell. Requiring Ame at the origin preserves rules but adds ceremony without useful agency. | **Use only for Duo-only motes.** Reject for existing required items. |
| **C5 — no collection; reveal/mark/charge/transform opportunity** | P2 may ping an already-visible fact, charge a separate Duo overlay, or change presentation. P2 cannot reveal a tile or change a base object's identity, location, resolved state, or value. | Core state and solver identity; easy drop-out. | Can feel inconsequential or become quarterbacking if markers compute the answer. | **Recommended base-object policy.** Test agency, density, and rate limits. |

### 7.2 What “visible to Player 1” means

| Candidate definition | Current correspondence | Design consequence |
|---|---|---|
| **Inside the camera rectangle** | Exact current `currentView`: every cell in the clamped 6×6 `CameraWindow`, including cells across walls. | Stable semantic rule and the correct starting boundary, but not permission to collect or cast through a gate. |
| **Already revealed by exploration** | Historical union of every camera rectangle Ame has visited. | Too broad. P2 could operate off-camera, erase backtracking, and become invisible to the other player. |
| **Currently rendered** | Usually the current rectangle, but objects can be presentation-filtered during combat/rescue and future optimization may virtualize nodes. | DOM/performance implementation is not a deterministic rules contract. Reject as authority. |
| **Unobscured line of sight** | No such reveal rule exists; current walls do not occlude the camera rectangle. | Invents a new visibility language and can disagree with the board/minimap. Use a separate line-of-effect predicate only for a spell that needs it. |
| **Recommended exact rule** | `inside(currentCameraWindow, cell) && revealedTiles.has(cellKey)`, evaluated from semantic state while free gameplay is active. Current reveal makes the second term redundant but defensive. | Keeps both players on the same live screen and remains independent of DOM mounting. Every state-affecting action then needs its own stricter target rule. |

**Exploratory recommendation — non-canon pending Human approval.** Define the shared live-visibility predicate as:

```text
liveVisible(cell) =
  game.status == "playing"
  AND topInteractionContext == "free-gameplay"
  AND cell is inside getCameraWindow(level, Ame.position)
  AND revealedTiles contains cell
```

This predicate means the players can talk about the same thing. It does **not** grant P2 permission. Base-object permission remains false. A state-affecting future spell must additionally pass range, line-of-effect, and engine-reachability rules.

### 7.3 Mechanic-by-mechanic effect of collection choices

In the table, “carry/direct/handoff” refers to C2–C4 when applied to an existing base object.

| Existing rule/content | C1: Duo-only mote | C2: carry base item | C3: direct Bag | C4: handoff base item | C5: mark/charge only |
|---|---|---|---|---|---|
| **Key behind its own door** | Safe; mote is separate. | Fetches the key across the door unless eligibility forbids it. A ghost anchor does not restore the puzzle. | Immediately unlocks its own gate. | Handoff away from origin still unlocks it; origin-only handoff is mechanically pointless. | May mark “key” or “door” only if live-visible; never matches/opens automatically. |
| **Weapons** | Safe. | Removes the need to reach the weapon and can expose all nearby guardians early. | Same, plus current state derivation conflict. | Same unless Ame must reach origin. | May show “find a polite sword first”; cannot grant or move it. |
| **Power potions** | Safe. | Delivers Power around gates and changes guardian order. | Directly rewrites sequence. | Still rewrites sequence at handoff. | May show printed amount; no arithmetic mutation. |
| **Splash Boots / water / lava** | Safe. | Fetches immunity across the hazard it teaches. | Makes hazard gates meaningless. | Same at any remote handoff. | P2 may fly visually over hazard but cannot grant immunity, carry Ame, or mark unseen landing. |
| **Antidote Leaf / poison** | Safe. | Fetches the answer across poison/door/topology. | Removes observation/return lesson. | Same. | Can react to a live-visible Leaf/poison symbol; does not name an unseen route. |
| **Spring Boots / hole jumps** | Safe. | Fetches the Boots across holes or eliminates their detour. | Bypasses straight-jump lesson. | Same. | Cannot reveal beyond current view or move a landing. A ping may identify an already-visible landing cell but never execute/alter the jump. |
| **Portals** | Mote dissolves or remains carried through a deterministic companion dock; no portal activation. | A base item can be transported between portal regions without Ame reaching its origin. | Bag update can bypass the entire portal relationship. | Handoff after camera warp still bypasses portal backtracking. | P2 cannot enter/trigger a portal. When Ame warps, P2 docks at destination and may mark only the new live view. |
| **Guardian Power order** | No effect. | Potions/weapons or a guardian-linked item can arrive early. | Direct item/Power collection changes reachability; direct guardian collection is nonsensical. | Same sequencing risk. | Readout uses exact current/base numbers. Any arithmetic spell is a separate rejected/ambitious rule below. |
| **Required backtracking** | Motes expire locally; no route change. | Courier collapses return trips. | Immediate collapse. | Turns return into waiting for P2. | Current-view pings can support memory; historical off-camera action is forbidden. |
| **Optional rescues/cages** | Separate and safe. | Rescue is not an item; carrying an animal/cage would contradict current entry-triggered rescue. | Direct rescue makes optional route and perfect record trivial. | Handoff rescue is tonally and mechanically incoherent. | P2 may celebrate or ping a live-visible cage; only Ame entry rescues. |
| **Treasure/currencies** | Recommended: new session/Duo mote only. | Base treasure courier changes optional exploration and banked rewards, even if not required. | Direct reward farming/route erasure. | Social but still a route shortcut. | Marking is safe. A later explicitly tagged easy-Duo treasure policy needs separate records and content audit. |
| **Fog/topology** | Placement occurs only after a camera window becomes live; no reveal mutation. | “Already revealed” carry allows invisible off-camera work. | Direct action may expose object knowledge without shared view. | Same. | Mark target must be live-visible; P2 never writes `revealedTiles`. |
| **Hints/minimap** | Motes do not enter Hint search. | Carry can make the current hint wrong or obsolete. | Existing solver/hint path invalid. | Same after handoff. | P2 may request a hint; P1 owns advancing it. A mark contains no computed path fact beyond visible labels. |
| **Solver/session validity** | Core projection identical; solver ignores overlay. | Requires object-reservation/carry state, action interleaving, save cleanup, and new search. | Requires full multiplayer engine/solver/save semantics. | Same, plus acceptance/rendezvous semantics. | Core solver remains authoritative if every P2 command satisfies projection identity. |
| **Objective/exit** | No interaction. | Cannot be carried. | A P2 exit touch would win without Ame; forbidden. | No valid handoff model. | P2 cannot target, occupy for effect, charge, or trigger the exit. |

### 7.4 Non-negotiable safety invariants for any flying model

1. P2 never writes `revealedTiles` and never obtains object/topology data outside `liveVisible`.
2. P2 never resolves, reserves, hides, relocates, or changes the value of a base object in the safe pitches.
3. P2 never enters the base engine as a substitute `position`; only Ame can trigger terrain, doors, guardians, pickups, animals, portals, or exit.
4. P2 carry capacity contains only a typed `DuoMoteId`, never a `LevelObject.id`.
5. Join, leave, disconnect, role swap, portal, restart, maze change, story, victory, and reload have total cleanup rules. No transient object can remain stranded.
6. Duo overlay placement uses a separate deterministic seed/namespace and can never occupy the exit, a base object, a modal anchor, or an essential label.
7. If an explicitly pitched easy-Duo variant later relaxes one invariant, the UI names the trade-off before play, records are separate, and a dedicated rules/solver/save specification precedes implementation.

## 8. Friendly guardian assistance stress test

All guardians remain friendly. Verbs are dazzle, encourage, calm, tickle, reveal, or lend courage—not damage. Each proposal below is complete enough to reject or prototype precisely.

### 8.1 Common targeting vocabulary

- **Aim:** mouse places Miri's board reticle over a guardian and clicks. Controller context highlights/selects the nearest eligible guardian inside that proposal's stated range, ties by companion-to-target distance then stable semantic ID. It never cycles through offscreen targets. A visible ring always exposes which guardian A would use.
- **Visible target:** unresolved guardian cell passes `liveVisible`.
- **Line of effect:** a supercover grid ray from Miri to the guardian crosses no wall or unopened door. If Miri currently overlaps a wall cell, casting is blocked until she exits it.
- **State-affecting target:** in addition to line of effect, at least one cardinal engagement cell adjacent to the guardian must be reachable by Ame under the current immutable state without collecting, defeating, opening, or changing anything. The guardian's occupied cell itself need not be player-reachable. This prevents numeric magic across a visible gate while matching the engine's adjacent comparison rule.
- **Feedback:** target ring + named icon + text/equation. Colour, motion, audio, and haptics are redundant accents only.

### 8.2 Proposal A — Dazzle & Compare (recommended safe spell)

| Required detail | Exact exploratory rule |
|---|---|
| Fantasy | Miri tosses harmless star-confetti; the guardian proudly shows the comparison and either “Ready together” or “Let's come back.” |
| Target/aim | Mouse: the one visible guardian under the board reticle. Controller: the one previewed nearest eligible guardian inside the full stated range, ties by distance then stable ID. |
| Walls/line of sight | Common line-of-effect rule. It cannot target through a wall/closed door. |
| Range | `distance(MiriQ256, guardianCenter) ≤ 0.60 tile` at cast for mouse and controller; camera tether is an additional bound. |
| Resource/cooldown | Costs 1 Friendship Focus only after sword, visibility, range, line, target, and cooldown legality all pass. No-sword/invalid attempts cost 0, create no active Dazzle/cooldown, and show the exact rejection. Per-guardian cooldown 180 unpaused companion ticks; recast while active is rejected without cost. |
| Stacking | None. One Dazzle per guardian; a second cast cannot intensify or extend it until expiry. |
| Duration | Six presentation seconds or until that guardian resolves/leaves the live view. Duration has no engine meaning. |
| Minimum Power floor | Not applicable: guardian Power never changes. |
| Temporary/permanent | Temporary readout/presentation only. |
| Exact equation | `GuardianEffective = GuardianBase`; `AmeCheck = AmePower`; `canWin = hasSword && AmePower >= GuardianBase`; on normal defeat `AmeAfter = AmePower + GuardianBase`. |
| Static/reduced feedback | Static: outlined star badge beside the guardian with `2 < 4 — Later` or `4 ≥ 4 — Ready`; no orbit. Reduced: one 120 ms opacity change, no travel, shake, spin, or pulse. Full: short confetti arc within the same semantic lifetime. |
| Weapon/sequence bypass | None. Without a weapon the badge reads “A polite sword comes first.” All engine and Hint transitions remain solo-identical. |
| Absence/disconnect | Badge expires immediately or at its normal visual timeout; no state changes, refunds, save work, or rollback. |

**Design judgment.** This is mechanically safe but may not feel powerful. It belongs in the prototype because that weakness is the central honest question.

### 8.3 Proposal B — Ready-Set-Giggle (ceremonial timing support)

| Required detail | Exact exploratory rule |
|---|---|
| Fantasy | Miri tickles/distracts a guardian just as Ame politely meets it, producing a shared joke and P2 credit. |
| Target/aim | Same as Proposal A, but legal only when `hasSword && AmePower >= GuardianBase`. |
| Walls/range | Common line-of-effect; ≤2.0 tiles. |
| Resource/cooldown | Costs 1 Focus; 5-second global cooldown. Invalid/too-early attempts cost 0 and show the exact unmet condition. |
| Stacking | None. |
| Duration | The next legal encounter with that guardian or 5 seconds, whichever comes first. |
| Minimum Power floor | Not applicable; no numeric change. |
| Temporary/permanent | Temporary presentation flag only. |
| Exact equation | Identical to base: `AmePower >= GuardianBase`; `AmeAfter = AmePower + GuardianBase`. P2 changes only the presentation flavour and attribution. |
| Static/reduced feedback | Static “Miri is ready” badge and a two-portrait victory stamp. Reduced: badge swap/short opacity. Full: tiny tickle squiggle/guardian laugh. |
| Weapon/sequence bypass | Legality begins only after the base comparison is already a win; no lesson or order bypass. |
| Absence/disconnect | Pending flag cancels; Ame can still resolve the guardian normally. |

**Design judgment.** Safe and socially attributable, but it risks becoming a quick-time flourish. Never require precise timing, repeated tapping, or a P2 success for normal combat.

### 8.4 Proposal C — Courage Link (ambitious/easy-Duo arithmetic)

| Required detail | Exact exploratory rule |
|---|---|
| Fantasy | Miri lends temporary courage to Ame rather than hurting or shrinking a friendly guardian. |
| Target/aim | One visible, line-of-effect, **state-affecting target**; Ame must have a weapon. |
| Walls/range | Common state-affecting rule; ≤2.0 tiles. |
| Resource/cooldown | Spend 1 or 2 Focus. Cooldown is four successful Ame movement events, not wall-clock time, so rules are deterministic. |
| Stacking | No stacking. `boost` is the maximum single active link and never adds across casts. |
| Duration | Consumed by the next comparison with that guardian or expires after three Ame action attempts. |
| Minimum enemy Power floor | Not applicable; guardian number never changes. |
| Temporary/permanent | Courage is temporary; a resulting guardian defeat and Power transfer are permanent. |
| Exact equation | `boost = min(FocusSpent, 2, certifiedAssistCap(contentRevision, stateSignature, guardianId))`; `AmeCheck = AmePower + boost`; `GuardianEffective = GuardianBase`; if win, `AmeAfter = AmePower + GuardianBase`. |
| Static/reduced feedback | Equation displays `Ame 3 + Miri 1 ≥ Guardian 4`; a distinct bracket/portrait identifies temporary courage. Reduced/static use no connecting beam. |
| Weapon/sequence bypass | **Yes by definition whenever boost changes a loss to a win.** `certifiedAssistCap` must default to 0 and may be nonzero only under a separate Duo rules/search specification. Most Power-sequence guardians are expected to certify at 0. |
| Absence/disconnect | An unused link expires on a deterministic tick; Focus is transient. A guardian already resolved cannot be undone, which is why save/solver/record work is mandatory. |

**Design judgment.** Do not include this in minimum or recommended co-op. If playtesting proves arithmetic essential, present it as a separately approved **Duo Adventure** ruleset, not a hidden buff.

### 8.5 Proposal D — Soften the Mood (temporary guardian reduction)

| Required detail | Exact exploratory rule |
|---|---|
| Fantasy | Miri calms a guardian so its displayed Power temporarily falls. |
| Target/aim | One visible state-affecting guardian; weapon required for any comparison. |
| Walls/range | Common state-affecting rule; ≤2.0 tiles. |
| Resource/cooldown | Spend 1–2 Focus; six Ame action attempts cooldown. |
| Stacking | Nonstacking; maximum reduction wins, never sums. |
| Duration | Next comparison or three Ame action attempts. |
| Minimum Power floor | `GuardianEffective = max(1, GuardianBase - min(FocusSpent, 2))`. |
| Temporary/permanent | Number reduction is temporary; a defeat remains permanent. |
| Exact arithmetic dilemma | If win transfers `GuardianBase`, early defeat yields the full future Power and strongly bypasses sequence. If win transfers `GuardianEffective`, it violates the established complete-Power transfer and creates a different downstream sequence. Neither is compatible by default. |
| Static/reduced feedback | Exact struck/temporary equation plus “returns after 3 turns”; no colour-only minus sign. |
| Weapon/sequence bypass | Yes. It can bypass both a weapon/Power lesson and future ordering even with range/LOS restrictions. |
| Absence/disconnect | Unused reduction expires. A committed defeat cannot be safely reverted. |

**Disposition:** reject. “Temporary” does not make a permanently earlier guardian defeat temporary.

### 8.6 Rejected anti-pattern E — Permanent calming or unconditional `-1`

This is not a runnable candidate ability; the complete hypothetical below exists only so “just reduce it by one” cannot re-enter scope without its known semantics.

| Required detail | Exact rejected hypothetical |
|---|---|
| Target/aim | One `liveVisible`, state-affecting guardian selected by the common deterministic aim rule. |
| Walls/range | Common line/state-affecting rule; hypothetical range 2.0 tiles. |
| Resource/cooldown | Spend 1 Focus; once per stable guardian ID; no recharge can undo the permanent result. |
| Stacking | Nonstacking; the guardian can be reduced at most once. |
| Duration | Permanent through defeat, save, reload, and return. |
| Minimum Power floor | `NewGuardianPower = max(1, GuardianBase - 1)`; floor 1. |
| Temporary/permanent | Permanent. |
| Exact equation | Future comparisons and transfer would need to choose between changed `NewGuardianPower` and the original complete printed Power; either choice changes the established sequence/truth. |
| Static/reduced feedback | Exact original/new equation and persistent semantic badge in every mode; motion/audio cannot carry the change. |
| Weapon/sequence bypass | Can invalidate a required Power ordering, weapon lesson, record comparison, Hint path, solver, and save reconstruction. |
| Absence/disconnect | Cannot roll back after commit without invalidating later encounters; if uncommitted it cancels/refunds. |
| Disposition | **Rejected for every pitch.** A range, cost, cooldown, and floor make it bounded, not compatible. |

### 8.7 Proposal F — Friendship Cheer (minimum-safe post-result participation)

| Required detail | Exact exploratory rule |
|---|---|
| Fantasy | After Ame politely succeeds, the companion makes the guardian's bow/laugh/celebration a shared moment. This is acknowledgement, not a hidden buff. |
| Target/aim | The already-accepted `enemy-defeated` semantic event is the sole target. P2 may press context once during its generous presentation; there is no reticle or alternate target. |
| Walls/line of sight | Not applicable. The engine already established Ame's legal adjacency and result; the Cheer cannot be armed before that result. |
| Range | Event-bound, not spatial. If the companion was docked/disconnected, no prompt is shown. |
| Resource/cooldown | No Focus cost. Once per stable guardian semantic ID. |
| Stacking | None; later/repeated presses are idempotent no-ops. |
| Duration | The current encounter presentation only; it never prolongs the presentation lock. |
| Minimum Power floor | Guardian base Power remains structurally at least 1 and is not read or changed by the Cheer. |
| Temporary/permanent | Temporary presentation/contribution credit only. |
| Exact equation | The result is already fixed: `AmeAfter = AmeBefore + GuardianBase`; Cheer adds `0` and never changes `GuardianBase` or resolution. |
| Static/reduced feedback | Static: two-portrait star/bow badge plus `Cheered together`; Reduced: one short opacity change; Full may add a small laugh/spark. Sound/haptic optional. |
| Weapon/sequence bypass | Impossible, because legality and state commit precede the P2 opportunity. |
| Absence/disconnect | Ordinary encounter presentation completes with no delay, missing reward, message, or penalty. |

**Design judgment.** This is safe attribution for the minimum pitch. It is not sufficient guardian gameplay by itself and must not be counted as a successful tactical choice unless the playtest's meaningful-action definition is met.

## 9. Camera, flight region, tether, and presentation locks

### 9.1 Recommended exact flight contract

**Exploratory recommendation — non-canon pending Human approval.**

```text
FlightRegion = current CameraWindow converted to world-space tile bounds,
               inset by 0.20 tile on all four sides.

Companion may occupy = any continuous point in FlightRegion,
                        including over wall, water, lava, poison, and hole cells.

Companion may affect base maze = never in minimum/recommended.

Companion may target a Duo opportunity = liveVisible(target.cell)
                                         AND target is not exit/base object overlap
                                         AND context-specific range/line rules pass.
```

The 0.20-tile inset is a tuning hypothesis. It leaves the full current view legible and gives a clear edge without letting the sprite disappear under clipping. The final value must be measured against Plan 01's finished MazeViewport and couch-distance art.

### 9.2 Camera authority and recovery

1. Ame's semantic position is the sole camera focus except for already-adopted presentation focus such as a Spring-jump midpoint. P2 input never pans, zooms, biases, delays, or requests the camera automatically.
2. When Ame moves and the camera window changes, retain Miri's world position if it remains inside the new `FlightRegion`.
3. Otherwise clamp Miri to the mathematically nearest point in the new region. If the camera displacement is greater than 1.5 tiles, or the transition is a portal, jump, level load, restart, or resume, use **dock recovery** instead: choose the first unclipped point 0.65 tile from Ame in fixed order NE → NW → SE → SW; if none fits, component-wise clamp NE to the legal region.
4. Full-motion presentation may show a ≤180 ms “starfold” from the old edge to the dock. Reduced motion uses a ≤100 ms opacity swap. Static mode repositions immediately with a persistent P2 shape/label. Interaction is locked for the semantic transition, regardless of visual duration.
5. P2 never becomes offscreen. There is no death, falling, delayed respawn, health, lost currency, or chase-back timer.
6. A carried Duo mote remains attached through an ordinary camera shift. Portal/jump dock recovery keeps it. Leaving, disconnect, restart, maze change, Home, or reload dissolves it; the deterministic overlay scheduler may offer a later mote. No reward is lost.

### 9.3 Edge and leash feedback

- The hard boundary is a static bracket/ring at the contacted edge plus a short `P2 edge` text/icon status. It is not colour-only.
- Full motion may compress the trail slightly. No elastic camera pull, shake, bloom flash, or repeated pulse.
- An optional seat-specific haptic can fire at most once per 800 ms while pressing outward; it is independently adjustable/off and never the only cue.
- Digital D-pad flight stops on the exact boundary and does not repeat a blocked buzz.
- Mouse absolute flight clamps to the board edge. Moving the system cursor outside the board stops flight without moving the camera.

### 9.4 Preventing visual obstruction

- Companion body target size: provisional maximum 0.60 tile; input reticle can be larger without adding opaque art.
- Render order: above terrain/decorative motes, below Ame, unresolved base objects, object Power/key labels, objective markers, focus rings, dialogs, and HUD.
- Companion art uses a distinct silhouette plus `P2`/shape outline; it cannot rely on hue.
- When within 0.45 tile of Ame or an unresolved base object, the body shifts to a smaller side silhouette/halo while the P2 position ring remains. No object becomes unclickable or visually hidden.
- The actor layer uses `pointer-events: none`; the board's semantic input surface owns events.
- One carried mote, one ping, and at most three opportunity accents are visible. Ambient density cannot scale with every tile.

### 9.5 Modal and lifecycle behavior

| State transition | Exact companion behavior |
|---|---|
| Story, Help, Hint, picker, feedback dialog, pause, confirmation, Book, victory | Freeze semantic companion input, clear buttons/velocity/target, and dock or show a small static portrait. P2 cannot advance or dismiss the global surface. |
| Short movement bump | Flight may remain visually responsive, but P2 context actions wait until the shared free-gameplay policy permits them. No queued cast replays. |
| Combat/rescue/door/portal/jump presentation | Cancel pending target, lock actions, preserve only harmless carried mote, then neutral-gate on return. |
| Window blur/hidden/pointer cancel | Clear movement/action state and exit any optional pointer lock/capture. Resume requires a neutral sample/new pointer movement. |
| P1 disconnect | Freeze both actors and open the Ame rebind layer. P2 cannot continue manipulating the scene without camera authority. |
| P2 disconnect | Pre-empt gameplay on that tick; clear input, cargo, ping, target, and pending effects; preserve the in-memory run's Focus and consumed/offered overlay ledger with timers stopped; show a nonmodal notice and continue valid solo immediately. Rejoin in the same run restores that Focus and cannot refill by reconnecting. |
| Mid-maze join | Allowed only in free gameplay with `status == playing`; spawn docked after the joining source returns neutral and produces a fresh A/click. A press during story/dialog/presentation may show `Join when play resumes` but does not claim the seat, cannot dismiss, and must be released/repressed when safe. |
| P2 leave | Available from P2's isolated pause panel; clear the same active cargo/effect/input state as disconnect, preserve current-run Focus/overlay ledger dormant in memory, and resume solo. Restart, new maze, Home run replacement, or reload discards that dormant state. |
| Role swap | Home, maze boundary, or safe pause only; never live free movement. P1 selects/approves `Swap roles`, P2 confirms within 10 seconds, both inputs neutral, and no presentation/target/carry is active. Exchange logical bindings, keep world/core state and Ame camera, then show each seat's new prompt. |

### 9.6 Can P2 ever reveal a tile?

**Exploratory recommendation — no.** Minimum and recommended P2 never alter reveal, extend the camera, inspect off-camera object data, or light a minimap fog cell. Even a “scout” concept may only annotate facts already in the current or historical reveal set. A future easy/scout variant that reveals topology is a different maze rule and must be named, recorded separately, and solver/hint-reviewed.

## 10. Input, seating, controller, mouse, and platform analysis

### 10.1 Logical seats, not Gamepad indices

**Exploratory recommendation — non-canon pending Human approval.** The game owns two transient logical seats:

```text
AmeSeat       -> exactly one active input binding
CompanionSeat -> zero or one active input binding

RuntimeDeviceToken = { provider, currentIndex, connectionGeneration }
```

- Never persist `Gamepad.index`, `Gamepad.id`, controller order, raw state, or a human identity.
- A newly exposed pad begins unassigned and unarmed. It must reach neutral, then produce a fresh A rising edge to claim a visible seat.
- Duplicate `id` values are expected. Index holes/reuse are expected. A held A used to expose/connect a pad cannot also join, cast, or confirm.
- First release is fail-closed: only `mapping === "standard"` or an explicitly named, separately qualified adapter may claim. Unknown/empty mappings are shown as detected-but-unsupported and never inherit Xbox indices or calibration guesses.
- Use exactly one controller gameplay provider per runtime: explicitly active native Steam Input owns all controller actions; otherwise Web Gamepad owns them. Do not merge providers or deduplicate by `id`. Keyboard/mouse remains a separate provider.
- Native Steam Input handles are stable only inside their provider/runtime lifecycle; they are not persisted human/controller identity across restart/reconnect.

### 10.2 Join ownership

1. Single-player is the home-screen default. The device/input group that activates Begin/Continue owns `AmeSeat`.
2. A separate, visible **Play Together — Press A to join** invitation appears only after P1 is known. One neutral, unassigned standard pad with a fresh A edge claims `CompanionSeat`. If two or more unassigned pads produce qualifying A edges in the same sample, none claims; show `One at a time`, consume those edges, and require release plus a fresh press. Index never breaks the tie.
3. Another pad cannot steal either seat by drift or ordinary input. With both seats occupied, extra pads remain visibly unassigned.
4. A seat change is explicit through **Controllers and roles**. It uses neutral/release gates and seat-specific glyphs.
5. Keyboard is a logical device group; mouse can be a separate companion binding only after an explicit join action. Touch never silently claims P2.

### 10.3 Proposed gameplay mappings

| Action | Ame — keyboard | Companion — mouse/keyboard fallback | Ame — Xbox | Companion — Xbox |
|---|---|---|---|---|
| Move/fly | Arrow keys or WASD, exact cardinal Ame movement | Absolute board-local mouse hover; optional I/J/K/L digital flight | D-pad or left stick resolves one cardinal direction under Plan 08 | Left stick continuous flight; D-pad four-cardinal continuous flight, with simultaneous orthogonals normalized if supported and no diagonal requirement |
| Context / mote / flourish / guardian action | Movement-triggered; no new action | Left click on a legal target; `Space` for nearest legal context target in digital mode | Existing gameplay keeps A unbound unless final controls contract changes | A context action |
| Ping | P1 does not place companion ping | Left click on empty live-visible cell, or `Q` in digital mode | No dedicated P1 ping | Y places/replaces the one ping |
| Dock/recall | — | Right click on board or `R`; board-only context menu suppressed in Duo | — | B docks; B never exits a global menu while gameplay is free |
| Pause | Escape | Escape requests the same pause | Menu | Menu requests pause |
| Hint | Existing P1 Hint control | P2 can only display “Ask Poggle?” request | Y under final Plan 08 mapping if retained | X requests Hint; P1 advances/opens it |
| Role swap | P1 selects/approves in the safe global surface | P2 may request, then gives the final confirmation | P1 selects/approves | P2 may request, then confirms within 10 seconds |

Final button choices must reconcile with the accepted Plan 08 mapping; the table defines ownership, not permission to rewrite Plan 08 now.

#### P2 flight normalization hypothesis

- Sample controller intent in one fixed 60 Hz companion simulation; it is presentation/support state, not a second Ame engine turn.
- Left stick uses Plan 08's qualified radial deadzone (prototype default 0.24), remaps the remaining magnitude to `0..1`, normalizes diagonal speed, caps at a provisional 3.25 tiles/second, and quantizes the authoritative companion point to 1/256 tile before target tests.
- D-pad/IJKL supplies exact cardinal unit intent at adjustable full speed. Two simultaneous orthogonal digital directions may combine to a normalized diagonal; no target or route requires it.
- Opposite digital directions cancel. On source loss, blur, modal, pause, or seat change, intent becomes zero immediately; no last-vector drift or queued context action survives.
- Mouse absolute position does not use velocity/deadzone. It maps through the current measured viewport/world transform, clamps to the same region, and needs a separate click to act.
- Flight speed/deadzone are accessibility settings, not difficulty. Target snap/radius makes every action possible with cardinal-only movement.

### 10.4 Keyboard P1 plus mouse P2

- Joining this configuration explicitly changes board pointer ownership: board mouse/touch steering for Ame is disabled while mouse controls P2. Ame remains fully controllable by Arrow/WASD/on-screen controls. Leaving Duo restores normal P1 pointer steering after neutral/pointer release.
- Mouse flight is **absolute**, not a held drag. Convert `clientX/clientY` through Plan 01's measured MazeViewport rectangle and world/camera transform. CSS pixels, logical stage pixels, and tile coordinates cannot be assumed equal.
- Pointer capture is not the default because hover flight has no active button. It may support an optional drag mode only, with a non-drag alternative.
- Pointer Lock is optional advanced input at most. It hides the cursor, complicates UI/magnification, needs activation, and is not sufficiently portable to be a first-release requirement.
- `pointerleave`: set velocity/action to neutral and keep the last clamped companion point. After exactly 60 unpaused companion ticks outside, dock; no gameplay action occurs. Re-entry moves the companion only after a new event and cannot act until a separate click.
- Board click is consumed by the companion context layer only while free Duo mouse gameplay owns it. It cannot bubble into Ame steering or UI activation. UI chrome remains ordinary clickable UI and temporarily freezes companion flight while the cursor is outside the board.
- Right-click recall suppresses `contextmenu` only on the Duo board surface. Dialog/UI right clicks retain normal browser behavior.
- Resize, scale change, modal, story, pause, blur, hidden, `pointercancel`, and lost capture clear buttons/velocity/target. The first move after return only updates position; an action requires a separate click.
- Touch keeps the current solo contract. Two fingers do not reliably identify two humans and compete with UI/scroll. A touch device may run Duo only with separately qualified controllers; no two-finger P2 v1.

### 10.5 Two external Xbox controllers

- The controller that began/continued remains Ame. The other presses A on the explicit join invitation.
- Both are polled in one lifecycle loop; normalization preserves source device and seat instead of collapsing to “last controller wins.”
- P1 D-pad/left stick uses Plan 08's exact cardinal cadence. P2 analog flight is continuous presentation, while D-pad provides equal digital access.
- Prompts name `Ame` and `P2 companion` and use per-seat glyph/shape. A global “controller mode” is insufficient.
- P2 disconnect does not pause Ame; P1 disconnect does. Replacements claim only the named missing seat after neutral + A.

### 10.6 Steam Deck built-in plus one external controller

- Do not assume Deck built-in is index 0. Whichever device actually began as Ame remains P1.
- Typical intended path: Deck built-in controls Ame; external standard pad presses A to join P2. The reverse is valid if the external pad started the game.
- Steam-emulated devices may all look Xbox-like. Use the assigned runtime device token and per-seat prompt, not USB identity.
- Built-in trackpad/mouse can be P2 only through the explicit mouse join flow; Steam's Gamepad-with-Mouse template is not assumed and must not double-dispatch.

### 10.7 Steam Deck plus two external controllers

- Only two seats exist. First valid unassigned A edge after P1 claims P2; the third pad stays unassigned and is shown in the Controllers panel.
- Reassignment is explicit. Neither lowest index nor most recent input chooses a new owner.
- The hardware matrix must test Deck built-in, USB, Bluetooth, connection in each order, sleep/reconnect, Steam Input on/off, duplicate virtual/physical entries, and overlay/suspend return.

### 10.8 Hybrid controller plus mouse/keyboard

- Valid examples: controller Ame + mouse companion; keyboard Ame + controller companion; controller Ame + IJKL companion.
- One gamepad endpoint cannot occupy both actors. A specifically named **Partitioned keyboard** preset may assign non-overlapping Arrow/WASD versus IJKL/Space/Q/R key sets to two people on one physical keyboard; ordinary keyboard bindings never split implicitly. Keyboard and mouse are separate logical groups only because the UI explicitly binds them, not because a browser identifies the humans.
- Mouse motion never steals controller prompts for Ame. Prompt modality is per seat.
- Controller plus keyboard duplicate input for the same seat may be allowed as an accessibility group, but it cannot leak into the other seat.
- A keyboard+mouse role swap activates a previewed mirrored capability preset: the prior mouse player becomes Ame using the existing board-pointer steering, and the prior keyboard player becomes companion using IJKL/Space/Q/R. Both must confirm the preview. If either binding cannot perform its new role, Swap is unavailable until Controllers and roles rebinds sources; raw devices are never blindly exchanged.

### 10.9 Menu, pause, and destructive authority

- Either player can request pause. Pause freezes both semantic action contexts and clears held state.
- P1/Ame owns global menu focus, navigation, and every destructive confirmation (restart, reset, Home/maze replacement). Opening input cannot confirm the new surface.
- P2 has a visually separate companion panel with only **Resume/request**, **Leave Duo**, **Request role swap**, and companion help/settings. P2 cannot move the global focus cursor.
- P1's Companion options contain **Dismiss marker** and a per-run **Hide P2 markers** toggle. Either clears the current ping; hiding rejects new ping presentation with `Ame has hidden markers` but does not disable P2's other job. P1 alone changes this setting, and it resets on new run/reload.
- P2's Leave action removes only their transient seat and needs a clear undo/rejoin path, not a destructive save warning.
- If P1 is disconnected, the only active surface is the Ame rebind layer; no other pad claims through drift. If P2 explicitly selects **Continue solo as Ame**, clear P2 input/cargo/ping/targets/effects, leave dormant Focus/overlay ledger in the run, neutral-gate that source into `AmeSeat`, and resume with unchanged core/camera state. If P2 is disconnected, solo play remains live after the notice.

### 10.10 Plan 08's contribution to the three workspace-wide seams

These are recommendations recorded here only; they do **not** ask Plan 08 to implement seats or co-op. Section 17 limits the whole Plan 10 request to exactly three optional seams. Plan 08 contributes only to the first:

1. Preserve **per-device provenance and lifecycle before solo ownership policy**: a normalized action envelope retains an opaque runtime source token, modality, phase/rising edge, magnitude, timestamp, mapping/capability, connection generation, and neutral state. Input/UI contexts remain routeable so the solo implementation may still select exactly one owner without irreversibly collapsing every pad into “last input.”
2. The other two workspace-wide seams—a reusable MazeViewport transform/actor layer and versioned semantic IDs/events/persistence—belong to the final UI/gameplay architecture, not to Plan 08 implementation.

Plan 08 remains a one-player implementation with one active owner. Even seam 1 may be retrofitted after Plan 09; preserving provenance while Plan 08 is already touching normalization is merely the cheapest opportunity.

## 11. Product flow, persistence, records, rewards, and accessibility

### 11.1 Enable, join, leave, and onboarding

**Exploratory recommendation — non-canon pending Human approval.**

- Home screen retains its current primary Solo Begin/Continue. A secondary **Play together** invitation appears once Ame's input is known.
- P2 joins with explicit A or **Join as companion** mouse action. Mid-maze join is allowed only in free gameplay. Joining never restarts, changes difficulty, or edits base state.
- Pause menu offers **Invite companion**, **Controllers and roles**, and **Return to solo**. The wording never says “need help?”, “easy player,” or “less skilled.”
- Two short role cards say: **Ame chooses the path and carries the Adventure Bag**; **Miri/Sprig flies in this view, delivers wish-magic, and notices moments together**.
- A 20–30 second practice on the home/playfield teaches flight, edge, one mote, handoff, ping, and dock. It can be skipped by either role without disabling controls.
- Role swap is available at home, maze boundary, or safe pause. P2 may request; P1 selects/approves the global action; P2 confirms within 10 seconds; both inputs must be neutral. It swaps logical bindings, not world characters or progress.
- P2 can leave instantly. The companion dissolves/docks, the toast says **Solo adventure continues**, and Ame never loses progress.

### 11.2 Ownership of pickups and resources

- **Base shared adventure state:** exclusively Ame-triggered. Equipment, keys, potions, treasure/currencies, rescues, guardian Power, doors, portals, goal, and exit remain current engine rules.
- **Companion Focus:** role-owned, transient integer, capacity 3. First P2 join in a run seeds 2. Leave/disconnect preserves its current value dormant in memory and stops regeneration; same-run rejoin restores it. Restart/new maze/Home run replacement/reload discards the session, and the next join seeds 2. It is never spent by P1 or required. Invalid actions cost 0.
- **Wish Mote:** Duo-only overlay, one carried at a time. Context action within 0.30 tile picks it up; entering 0.75 tile of Ame while free gameplay is active completes an automatic handoff and adds 1 Focus up to capacity. No P1 button/precision chord is required.
- **Regeneration:** if Focus is 0 and no mote is available, regain 1 after 10 seconds of free gameplay. This is a presentation/support timer only; no base state depends on waiting. Tune or replace after playtest.
- **Shared critical consumables:** none. P2 cannot spend keys, currency, hints, or future campaign resources.

### 11.3 Deterministic opportunity scheduling

The recommended prototype uses a typed ephemeral overlay, not random DOM decoration:

```text
duoSessionSeed = hash(levelStableId, contentRevision, generatedSeedOrZero,
                      "duo-safe-v1")
cameraWindowId = (left, top, width, height)
visitOrdinal = 0 initially; increment once only when the committed cameraWindowId
               changes to a different identity
offerOrdinal = incremented for each offer within that visit
moteId = hash(duoSessionSeed, cameraWindowId, visitOrdinal, offerOrdinal, "mote")

eligible cells = row-major live-visible cells
                 minus exit/objective
                 minus cells with base objects
                 minus Ame cell / essential labels / active effects
candidate order = deterministic keyed permutation of eligible cells using moteId
```

- Ephemeral scheduler state is `{duoSessionSeed, currentCameraWindowId, visitOrdinal, offerOrdinal, activeMote, offeredMoteIds, consumedMoteIds, activatedFlourishIds, quietUntilTick}`. It is created on first P2 join in a run, remains dormant through leave/disconnect, and resets on restart, new maze, Home run replacement, or reload.
- Active mote cap is 1; carried cap is 1; flourish accents cap at 2. No mote spawns while Focus is 3, while a mote is active/carried, or outside free gameplay.
- When the conditions become true, set `quietUntilTick = currentTick + 480`; spawn the first eligible candidate **exactly** at that tick. If there is no eligible candidate, no mote spawns and zero-Focus regeneration fires at tick 600 instead.
- An uncarried mote expires when its cell is no longer `liveVisible`, on leave/disconnect, or on run replacement. Its stable ID remains in `offeredMoteIds` and never respawns in that run. Pickup creates cargo; successful handoff moves the ID to `consumedMoteIds`. Cargo cleared by leave/disconnect is not a base loss and its offer ID is not repeated.
- After handoff/expiry, the next offer uses a new `offerOrdinal` and another 480-tick quiet period. Re-entering a camera window creates a new `visitOrdinal`, so it can offer a different stable ID but never a previously offered one.
- Surprise Mazes derive `duoSessionSeed` from their fixed generated level identity through this **separate PRNG namespace**; companion scheduling cannot consume or perturb topology/object randomness.

Missed/expired opportunities have no save, record arithmetic, or reward consequence. The event log records seed inputs/IDs so a prototype run is reproducible.

### 11.4 Completion, records, rewards, achievements

- Completion, unlocks, story stars, rescues, perfect status, treasure bank, ordinary achievements, and campaign progression are fully valid and equally celebrated in Solo and Duo.
- A successful join sets participation metadata `duoEverJoined = true`, but joining and immediately leaving does not move a performance record. The first accepted event in the fixed `recordableCompanionAction` set—`mote-pickup`, `mote-handoff`, `ping-place`, `dazzle`, `ready-set-giggle`, `flourish`, or `friendship-cheer`—sets `togetherMeaningful = true`; leaving cannot clear it. Flight, dock, pause, Hint request, join/leave/swap, and every rejected action are excluded. This deterministic record flag is intentionally less strict than the observer-coded “meaningful action” used in playtesting.
- **Recommended record policy:** store parallel **Solo** and **Together** best-step/Power/rescue summaries under `{levelStableId, contentRevision, participationLane, rulesetVersion}`. Runs with `togetherMeaningful` use `participationLane = together`; no-action joins remain `solo`. Display both with equal visual weight; neither is labelled assisted, lesser, invalid, or non-canon. Existing records migrate to Solo.
- Minimum Co-Star Spark could technically share records because it cannot change core state. Prefer the parallel structure if minimum may later grow, so semantics do not silently change.
- Arithmetic-support/easy-Duo records must be separate by rules version and never overwrite safe Duo/Solo bests.
- Duo-only motes/flourishes give session celebration, not Gold/Science or a required collection checklist. A future additive “played together” sticker may exist, but no campaign completion or mastery requires it.
- P2 receives visible victory credit: companion name/portrait, one contribution summary such as motes delivered/pings answered, and an equal celebration pose. P1 owns Next/Replay/Home focus.

### 11.5 Active run save/resume

- Save base run exactly under the accepted post-Plan09 core state. Do not save controller index/id, raw input, companion continuous position, target, cooldown presentation, or carried mote.
- Persist only versioned participation metadata if records need it: `rulesetVersion`, `duoEverJoined`, and `togetherMeaningful`. Keep preferences (motion, sensitivity, haptics) separate from progress/reset.
- Reload resumes valid solo play immediately. The home/game screen says **Press A / join to bring the companion back**. P2 can rejoin later.
- Transient Focus starts at the normal initial amount after resume. Nothing required was lost; no apology or warning implies the run is damaged.
- An ambitious state-affecting companion version needs a new atomic save schema, sanitizer, migration, and rollback reader before implementation.

### 11.6 Hints, difficulty, and the 24-level campaign

- P2 can place a visible request **Ask Poggle?** P1 decides whether to open/advance Hint. P2 does not spend a tier, compute a route, or reveal an answer.
- Safe Duo does not silently change maze difficulty, guardian numbers, hazards, or reward bands. The social information advantage is acknowledged through Together records, not punished.
- Every one of the future 24 campaign mazes and every Surprise Maze must pass its solo ordinary/perfect solvers without any companion.
- Plan 09 authors no P2 gate, spawn, line, dialogue dependency, or reward. After Plan 09, the generic overlay is tested across all final level IDs/revisions; authored flourishes are optional later polish.
- Any future Twin Trails content must be solvable solo through role swap and needs a separate content/rules specification.

### 11.7 Accessibility policy

1. P1 and P2 identity uses text (`Ame`, `P2`), silhouette, outline/pattern, and optional colour. No “blue player” only copy.
2. Companion target legality, carried state, Focus/cooldown, tether edge, cast result, pause owner, disconnect, and join state each have static icon/text truth.
3. Sound and per-seat haptics are optional accents. Haptics are off/adjustable independently of motion and never required.
4. Full motion may glide/orbit/trail. Reduced motion removes orbit, elastic leash, shake, blur, and long travel. Static mode uses immediate reposition, persistent rings/badges, and opacity/state swaps only.
5. Analog flight has D-pad/digital flight, adjustable sensitivity/deadzone, and no mandatory precision path. Context targets use generous snap/reticle thresholds.
6. No essential rapid tap, hold, simultaneous chord, stick click, drag, pointer lock, or reaction-time window.
7. Mouse flight requires no held button. A keyboard digital fallback exists. Touch is not coerced into a two-player gesture.
8. Both players may request pause. Only P1 controls destructive confirmations, with safe default + explicit navigation + fresh confirmation.
9. Essential prompts remain readable at TV distance and at 200% text zoom under the accepted UI contract. Companion effects cannot cover labels or focus.
10. Onboarding can be replayed, read aloud, and completed without audio, motion, or controller vibration.

## 12. Weighted concept comparison

**Exploratory decision aid — non-canon pending Human approval.** Scores are a design-team hypothesis on a 1–5 scale, not playtest evidence: `5` means excellent/low concern, `3` means conditional, and `1` means incompatible/high concern. For **implementation and regression safety**, a higher score means safer. Weighted total is `sum(score × weight) / 5`; weights total 100.

The weighting intentionally makes puzzle integrity and Player 2 agency the two largest criteria. That keeps an exciting maze-breaking helper and a perfectly safe decorative cursor from winning for opposite bad reasons.

| Criterion | Weight | Why this weight |
|---|---:|---|
| Player 1 fun and agency | 9 | Ame must remain the hero and route owner. |
| Player 2 fun and agency | 14 | The primary experiential risk is an empty companion role. |
| Cooperation and communication | 13 | Parallel solo play is not the intended delight. |
| Preservation of puzzle integrity | 15 | Route, equipment, hazard, Power, and return sequencing define the game. |
| Parent/child and child/child suitability | 10 | The role must work across leadership and motor-skill differences without shame. |
| Reuse of existing mazes | 9 | No maze may require P2; a 24-level retrofit must remain practical. |
| Input clarity | 7 | Two local seats, mouse ownership, and menu authority are substantial risks. |
| Implementation and regression safety | 7 | Higher means fewer new rules/save/solver surfaces. |
| Accessibility | 5 | Both jobs need redundant, low-motor-load feedback and alternatives. |
| Performance | 3 | Important, but controllable if the companion remains scene-local and budgeted. |
| Art/VFX/animation opportunity | 3 | Identity matters, but visual charm cannot compensate for a weak job. |
| Drop-in/drop-out resilience | 5 | Family play must recover instantly when a player wanders away or a pad drops. |
| **Total** | **100** | |

| Concept | P1 | P2 | Coop | Integrity | Family | Reuse | Input | Safety | Access | Perf | Art | Drop | **Weighted /100** |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 6.1 Unfenced Wishflight | 2 | 4 | 3 | 1 | 3 | 2 | 4 | 1 | 3 | 4 | 5 | 3 | **53.6** |
| 6.2 Starpost Courier | 4 | 5 | 5 | 4 | 5 | 4 | 4 | 3 | 4 | 4 | 5 | 4 | **86.6** |
| 6.3 Poggle's Pocket Maplight | 5 | 3 | 4 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 3 | 5 | **90.6** |
| 6.4 Friendship Loom | 4 | 5 | 5 | 3 | 4 | 3 | 4 | 2 | 3 | 4 | 5 | 2 | **75.4** |
| 6.5 Sprig's Mischief Garden | 5 | 4 | 4 | 5 | 5 | 3 | 4 | 3 | 4 | 4 | 5 | 5 | **85.2** |
| 6.6 Pass the Star | 4 | 2 | 4 | 5 | 3 | 5 | 5 | 5 | 5 | 5 | 2 | 5 | **81.4** |
| 6.7 Sprig's Co-Star Spark | 5 | 3 | 3 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 4 | 5 | **88.6** |
| 6.8 Twin Trails | 5 | 5 | 5 | 4 | 4 | 2 | 3 | 1 | 3 | 3 | 5 | 2 | **75.0** |
| 6.9 Rescue Chorus | 4 | 5 | 5 | 4 | 4 | 3 | 3 | 2 | 3 | 3 | 5 | 2 | **76.4** |
| 6.10 Miri's Wishwing Courier | 4 | 5 | 5 | 5 | 5 | 5 | 4 | 3 | 4 | 4 | 5 | 5 | **92.4** |

### 12.1 Interpretation and confidence

- **Poggle's Pocket Maplight** is the highest-scoring single-source concept because it is safe, clear, reusable, accessible, and resilient. Its `3` for P2 agency is nevertheless a possible ship-stopper: a parent can become a back-seat director and a child can become a cursor.
- **Starpost Courier** is the strongest standalone physical/cooperation loop. Its score depends on the strict Duo-only cargo rule; permitting base items would lower integrity, reuse, safety, and drop-out scores sharply.
- **Sprig's Co-Star Spark** is the best small surface. Its numerical strength conceals the qualitative question “would either person choose P2 for the next maze?”
- **Unfenced Wishflight** demonstrates that high activity and visual freedom do not equal good cooperation when P2 can remove Ame's decisions.
- **Twin Trails** has the highest long-term co-op ceiling but pays for a second traversal grammar, authored optional content, separate search, and larger save/test scope.
- **Miri's Wishwing Courier** is a designed hybrid of courier, maplight, flourish, and strictly non-arithmetic guardian theatre. It scores highest because each verb covers another verb's dead time while the base-state permission boundary remains closed.

Confidence is **medium** for repository and platform risk, because those rules are inspectable; **low-to-medium** for general family-design inference, because the studies are small or context-specific; and **low** for the scores themselves, because no Maze so Puzzle dyad has played these roles. The matrix selects what to prototype, not what to ship.

## 13. Complete shortlisted interaction matrix

**Exploratory normative matrix — non-canon pending Human approval.** This table is the complete interaction contract for the three converged pitches. “Cannot” means the command is rejected deterministically with no core-state, step, reveal, reward, or save mutation. The columns are:

- **Minimum:** Sprig's Co-Star Spark.
- **Recommended:** Miri's Wishwing Courier.
- **Ambitious:** Twin Trails, including only separately certified Courage Link cells.

| Surface | Minimum lovable — Sprig's Co-Star Spark | Recommended — Miri's Wishwing Courier | Ambitious — Twin Trails |
|---|---|---|---|
| **Walls and camera boundary** | Sprig may visually cross/occupy walls and hazards inside the Section 9 `FlightRegion`; Ame alone moves the camera. Outward movement clamps with P2 edge feedback. | Same. Miri's target ray cannot cast through a wall/closed door even though her body may be over a wall. | P2 does **not** need unrestricted wall flight: movement follows an authored/generated optional sky-thread/perch graph clipped to Ame's camera. No body blocking and no camera influence. |
| **Fog and unrevealed cells** | Never reads, displays, targets, marks, or reveals an unrevealed cell. A live target must satisfy `liveVisible`. | Same. Dazzle, motes, and flourishes exist only after the view is revealed by Ame. | Same for base topology. A sky-thread node may appear only when its underlying cell is revealed; revealing it never reveals neighbouring base tiles. |
| **Keys and doors** | Cannot collect, carry, reserve, match, unlock, open, or close. May place the one neutral ping on a live-visible symbol. | Same. No Wish Mote may overlap a key/door or use its stable object ID. | Same. Optional duet glyphs may animate near a door but can never change the door reducer or be required to pass it. |
| **Weapons and Power** | Cannot collect weapon/potion, change Power, compute an unseen route, or affect a guardian comparison. | Dazzle shows the exact current equation; `GuardianEffective = GuardianBase`. It cannot grant a weapon, potion, Power, or victory. | Base pickups remain Ame-only. A separately versioned, solver-certified Courage Link may add displayed temporary courage to the comparison at explicitly certified guardians; default `assistCap = 0`. |
| **Boots, water, lava, Antidote Leaf, poison** | P2 may fly over these as presentation but cannot pick up gear, shield/carry Ame, bridge terrain, suppress poison, or imply that Ame can follow. | Same. Environmental flourishes cannot alter collision or hazard kind. | P2's optional sky path may cross them visually; it never transfers immunity or changes Ame's legal movement. Optional mechanisms cannot replace a base traversal item. |
| **Spring holes and jumps** | Cannot trigger, steer, catch, carry, redirect, shorten, or reveal a landing. Dock/lock during Ame's jump presentation. | Same; carried Duo mote remains attached through deterministic dock recovery. | Same base rule. A sky-thread flourish may mirror the jump only after the engine commits it; it cannot be a landing or solver edge. |
| **Portals** | Cannot activate or traverse independently. Ame's warp docks P2 beside the destination after the reveal update. | Same. Any live target at the origin expires; a carried Duo mote stays attached because it is not a base item. | Same for base portals. Optional sky state atomically relocates/resets to the destination-safe node; no origin view or cross-region item transport remains. |
| **Enemies / friendly guardians** | May add Section 8.7 Friendship Cheer only after the engine has already accepted Ame's victory; equation and reward remain base. | May Dazzle & Compare under Section 8.2, optional Ready-Set-Giggle under 8.3, and post-result Cheer under 8.7. None changes target, Power, sword requirement, resolution, transfer, or sequence. | Adds Section 8.4 Courage Link only where a separate rule certificate permits it. Cannot move, farm, permanently soften, or defeat a guardian; a committed Ame encounter remains atomic. |
| **Treasure and currencies** | Cannot touch existing treasure/currency. May catch a deterministic session-only Co-Star glimmer. | Cannot touch base treasure/currency. May carry one Duo-only Wish Mote and hand it to Ame for transient Focus, cap 3. | May collect explicitly typed optional Duo discoveries. Base currency remains Ame-only unless a later separately approved reward/rules mode says otherwise. |
| **Cages and rescued friends** | Can ping a live-visible cage and celebrate after Ame's normal entry resolves it. Cannot open, move, or rescue. | Same; a flourish may use the rescued friend's approved reaction after the base event. | Same base rule. A rescued friend may cosmetically skin the optional P2 role only after chronology/content review; no specialty becomes a rescue prerequisite. |
| **Objective and exit** | Never an eligible target. P2 position/click cannot set `won`, satisfy an objective, or advance a maze. | Same. Opportunity placement excludes exit/objective labels and cells. | Same. Optional duet completion is never the base objective and automatically releases on leave. Only Ame's legal position can win. |
| **Hints and minimap markers** | One neutral `Look` ping for 300 unpaused ticks on a live-visible cell; maximum one active. P2 can request Hint, but P1 alone opens/advances tiers. | Same `Look` rule: it must be placed while live-visible and contains no computed readiness/route fact. If the camera moves, the existing ping may remain as an inert revealed-cell minimap marker until its original expiry; P2 cannot place or retarget it offscreen. | Same, plus optional sky-thread clue symbols already exposed by Ame. No P2 mark runs Hint search, names an unseen item, or mutates fog. |
| **VFX, sounds, environmental flourishes** | Emote, Co-Star glimmer, guardian/victory Cheer, and at most two harmless flourish accents. Every result has icon/shape/text truth. | Wish Mote/carry/handoff, Focus, semantic pings, Dazzle equation, Cheer, and tagged harmless flourishes. Sound/haptic optional; reduced/static parity mandatory. | Richer thread/perch, duet, friend, and Courage feedback under the same semantic-event and motion-mode contracts. No effect may hide a base label or exceed the performance ledger. |
| **Story, dialogs, menus, victory** | Dock and freeze. Either seat requests pause; P1 owns global focus, dismissal, navigation, and destructive confirmation. P2 may emote/ready only where explicitly offered. | Same. A join press over a modal is consumed only to show `Join when play resumes`; it does not claim/dismiss, and a fresh neutral-gated press is required in free gameplay. Victory names both roles while P1 owns Next/Replay/Home. | Same. Optional-role selection/loadout occurs at a safe P1-owned surface with a P2 confirmation, never over story or battle. |
| **Surprise Mazes** | Co-Star overlays use a separate seed namespace and never change topology, objects, digest, solver, or reward. | Wish Motes/flourishes do the same; `duo-v1` randomness never consumes the generator stream. | Falls back to recommended behavior until a generated sky-thread and any `assistCap` are independently solver-certified. No generated maze requires P2. |
| **Controller disconnect** | P2 loss clears active motion/mark/cargo/effects and continues solo; the in-memory run constellation/overlay ledger remains dormant. P1 loss pauses/rebinds. No index is trusted after reconnect. | Same; preserve the current run's integer Focus and offer/consume ledger, stop regeneration, clear cargo/target/ping/pending effects, and restore that Focus on rejoin. Reload/new maze seeds a fresh Focus 2. | Cancel/refund uncommitted latch/Courage and reset to orbit; preserve current-run Focus, completed discovery IDs, and sticky rules classification in memory. Committed atomic results finish. Reload resumes Solo, preserves only approved completed IDs/classification/core results, and resets node/Focus/uncommitted state. |
| **Pause, join, leave, return to solo** | Join in safe free play and spawn beside Ame. Pause freezes both. Leave clears active state, retains dormant current-run session values, and causes no rewind/modal. Reload starts Solo and resets the optional session. | Same. Role swap only at home/maze boundary/safe pause with P1 selection/approval, P2 confirm, and neutral gate. | Same lifecycle guarantee. Current-run completed discoveries/classification persist in memory; uncommitted latch/Courage cancels. Reload resumes Solo, persists only approved completed discovery IDs/classification/committed core results, and resets companion node/Focus to defaults. |

### 13.1 Deterministic command ordering

For every pitch, simultaneous input is not a race between DOM handlers:

```text
1. apply connection/disconnection, blur/hidden, modal, provider, seat-generation,
   and other lifecycle changes; clear invalid held state;
2. sample/route fresh edges from still-valid sources;
3. if either bound seat requested Pause, enter Pause now and discard all gameplay
   edges from this sample;
4. otherwise apply at most one Plan-08-ordered Ame engine command;
5. recompute immutable core state, reveal, camera, presentation lock, companion
   clamp/dock, deterministic expiries/regeneration, and automatic mote handoff;
6. revalidate and apply at most one P2 semantic command against that result, or
   reject it with a named reason;
7. advance the overlay scheduler once and emit semantic events in the same order
   for Full, Reduced, and Static modes.
```

Within P2, simultaneous fresh edges resolve `dock > Hint request > ping > context`; lower-priority edges are consumed, while flight intent may update only if the resulting context remains free. P1 ordering remains the accepted Plan 08 rule. Automatic handoff occurs before a same-sample P2 context command, so newly handed-off Focus may legally fund that command. Targets use stable semantic IDs; equal-distance candidates sort by distance and then ID. A stale command is a no-op, not a late action against a replaced object.

For mouse context, the clicked semantic target must pass its own radius/ray rules. For controller/Space context, build previewable candidates and choose by declared class priority `Duo mote > guardian action > environmental flourish`, then distance, then stable ID; the target ring/rejection label shows the result before the edge. Cargo handoff remains automatic and precedes this list. Moving Miri changes the nearest candidate, so the priority is predictable without a target-cycling chord.

All rules-language seconds use **unpaused 60 Hz companion ticks**: Dazzle lifetime 360, Dazzle cooldown 180, Ready-Set-Giggle window/cooldown 300, ping lifetime 300, ping replacement 120, flourish cooldown 180, opportunity quiet period 480, and zero-Focus regeneration 600. Pause/absence stops these clocks. Millisecond starfold/fade/animation values are presentation-only and never decide legality. Any ambitious arithmetic action commits atomically with its Ame encounter or remains uncommitted and refundable.

## 14. Three converged pitches

All three pitches are **exploratory, non-canon, unapproved, and deferred until after Plan 09**. Section 13 is the normative per-pitch interaction matrix; each pitch below adds its emotional promise, moment-to-moment loop, product treatment, architecture, content cost, rollback, and gates.

### 14.1 Minimum lovable co-op — Sprig's Co-Star Spark

#### Emotional pitch and character direction

Sprig, the existing baby cloud-dragon, becomes a tiny co-star who can swoop anywhere Ame can currently see, catch stray friendship glimmers, race them back for a shared constellation, point at a funny or useful place, wake one harmless world reaction, and cheer every brave success. The fantasy is not “the grown-up helps the child” or “the little player watches.” It is two friends noticing different things at once: Ame owns the adventure, while Sprig makes the shared screen answer back. Sprig is provisional because story chronology and his approved final character model may make him unavailable or confusing in some levels; a neutral Co-Star Spark can carry the same mechanics if that conflict survives Plan 09.

#### Thirty-second and five-minute loops

**Thirty seconds:** scan the current camera → choose a glimmer, ping, or flourish → fly with analog or digital input → catch/activate it → carry the glimmer within 0.75 tile of Ame for an automatic handoff → receive a named shared sparkle → choose whether to dock or look again.

**Five minutes:** across several camera windows, P2 alternates three action families—courier handoff, communication ping, and harmless reaction—then contributes a guardian Cheer or an automatic rescue reaction after Ame resolves the corresponding event and appears in the victory summary. Quiet windows are allowed, but the overlay scheduler supplies at most one glimmer after the minimum quiet period so P2 is not idle for an entire traversal leg.

#### Exact abilities and constraints

1. **Fly:** continuous scene-local movement inside the Section 9 region, including over walls/hazards. No reveal, camera, collision, or engine call.
2. **Catch and carry:** A/left-click on one live-visible `co-star-glimmer` within 0.30 tile. Capacity one. It is a typed overlay ID, never a level-object ID.
3. **Handoff:** automatically completes within 0.75 tile of Ame in free gameplay; adds one pip to a session-only constellation and clears cargo. It does not modify Bag, reward, steps, save, or record arithmetic.
4. **Ping:** one five-second neutral marker on a live-visible cell; replacing it is allowed only after a two-second anti-spam cooldown. It contains no computed route answer.
5. **Flourish:** A/left-click on one tagged live-visible presentation opportunity within 0.60 tile. Each opportunity is idempotent; global cooldown three seconds; effect has no collision/object/reveal result.
6. **Cheer:** Section 8.7 after an accepted guardian defeat. A rescue may receive an automatic companion reaction, but it is not a target/action and cannot delay or alter rescue.
7. **Dock:** B/right-click/R sets Sprig to the deterministic orbit beside Ame and clears movement intent, not the ping or completed constellation.
8. **Forbidden:** every base interaction listed in Section 13, hint advancement, global menu navigation, Power comparison before victory, and all exit/objective actions.

Companion motion is sampled on a fixed 60 Hz presentation simulation, normalized for diagonals, provisional maximum 3.25 tiles/second, radial analog deadzone 0.24, and position quantization to 1/256 tile before targeting. D-pad flight is a full digital alternative, not a slower consolation. These numbers are prototype hypotheses and must be tuned against the final Plan 01 scale and Plan 08 feel.

#### Interaction matrix capsule

The **Minimum** column of Section 13 is binding: Sprig touches only typed Duo overlays; cannot change fog, base objects, guardians, hazards, portals, rescues, hints, objectives, rewards, or victory; docks through presentations and warps; uses independently seeded Surprise overlays; and removes the active companion actor atomically into valid solo play while any explicitly retained session ledger remains dormant.

#### Camera and tether

Section 9 applies without exception. Ame is the only focus. Retain Sprig's world point across a small camera shift; otherwise nearest-point clamp; use dock recovery for portal, jump, load, resume, or displacement over 1.5 tiles. Full motion may starfold for at most 180 ms; reduced/static use opacity/instant relocation. Sprig never reveals a tile, dies, falls, pulls the camera, or forces Ame to wait.

#### PC and controller mappings

- **Keyboard + mouse:** Ame uses Arrow/WASD; explicit Mouse Companion join transfers board-pointer steering from Ame to P2. Absolute hover flies; left-click catches/activates or places the neutral ping on empty space; right-click docks; `Space`, `Q`, and `R` are digital alternatives. Escape requests pause.
- **Two pads / Deck combinations:** P1 keeps the accepted Plan 08 movement/menu map. P2 left stick/D-pad flies, A performs context, Y pings, B docks, X requests Hint, and Menu requests pause. First deliberate owner is Ame; a different neutral pad presses A to join. No index assumption.
- **Hybrid:** the same logical actions apply per bound source. Prompts remain per-seat. One source cannot drive both roles accidentally.

#### Join, leave, role, and menu UX

Home offers **Play together** after Solo Begin/Continue remains primary. Mid-maze join is allowed only in free gameplay and spawns beside Ame. P2 leave/disconnect removes active transients, preserves dormant current-run session values, and leaves a nonmodal rejoin invitation. Either seat requests pause; P1 owns the one global menu focus and every destructive/route-changing choice. P2 may request role swap; P1 selects/approves it and P2 confirms, with both neutral at home, maze boundary, or safe pause.

#### Solo parity, persistence, records, and rewards

The core-state projection, solver graph, hints, rewards, and completion are unchanged by a companion command. Glimmers and constellation pips are session presentation only and do not create a completion checklist. Reload resumes solo; no controller or P2 position is persisted. A join with no meaningful action remains eligible for Solo; the first accepted glimmer/handoff/actionable ping marks the run Together for the equal parallel display described in Section 11. If this pitch later gains any route/reward effect, its rules version also separates before that change ships.

#### Required UI, art, VFX, animation, and audio

- One final companion board sprite/silhouette, P2 outline/pattern, small dock form, carried-glimmer state, and victory/guardian/reaction poses under final safe-bounds contracts.
- Seat-specific join card, role card, focus-free P2 status, one marker, carry badge, constellation summary, disconnect toast, and Controllers/roles surface.
- Semantic glimmer/catch/handoff/ping/flourish/Cheer events with Full/Reduced/Static variants. Optional per-seat chime/haptic; no required audio.
- One density-bounded overlay family reusable across levels. No story portrait/dialogue line is assumed until chronology is approved.

#### Technical architecture

```text
Device lifecycle -> normalized ActionEnvelope(sourceToken, phase, value)
                 -> transient SeatRegistry
                 -> ContextOwner (Ame / Companion / Global UI)
                 -> AmeCommand -> existing engine
                 -> CompanionCommand -> ephemeral CompanionRuntime

CameraWindow + revealedTiles + semantic events
                 -> independently seeded DuoOverlayScheduler
                 -> scene-local Actor/Overlay presentation
```

The companion reducer is deterministic and projection-safe: after every P2 command, the current core `GameState` and `revealedTiles` are identical. Flight updates a scene-local store/transform and must not rerender the whole App at polling frequency. The renderer consumes the same ordered semantic event for every motion mode. Debug assertions reject any `LevelObject.id` presented to a companion collection command.

#### Level/content implications

No current or Plan 09 level data changes. Generic overlay eligibility is derived from stable level/revision/camera facts and excludes base-object, exit, objective, Ame, and label cells. Later hand-authored flourish tags are optional presentation polish only. Surprise generation and its solver/digest remain unchanged.

#### Risks and rollback

- **Risk:** P2 is active but not consequential. **Rollback/response:** do not ship it merely because it is safe; either add the recommended bounded Focus/readout loop or abandon simultaneous co-op.
- **Risk:** Sprig's chronology or size conflicts. **Rollback:** retain the mechanics behind a neutral Co-Star Spark or approved new companion without changing saves/rules.
- **Risk:** particles overwhelm the calm board. **Rollback:** reduce overlay caps or disable flourishes independently.
- **Risk:** mouse ownership surprises P1. **Rollback:** require explicit Mouse Companion selection and preserve controller-only Duo.

#### Acceptance criteria

The minimum is worth shipping only if all of the following hold after Plan 09:

- Existing engine, solver, session, progress, input, and campaign suites stay green; a P2-command invariant suite proves zero core-state/reveal mutation.
- Across all 24 authored and representative Surprise mazes, no overlay occupies/hides a base object/exit/label and every join/leave/portal/modal state returns safely to solo.
- The qualified two-pad, Deck, keyboard/mouse, hybrid, disconnect, reconnect, duplicate, non-standard, and focus test matrix passes.
- Full/Reduced/Static expose the same action/result order; digital-only P2 can perform every action.
- The family prototype gates in Section 16 pass, including at least eight meaningful P2 actions from three families per five-minute role block, no involuntary idle interval over 30 seconds, no takeover, and desire to continue.

#### Estimated implementation phases after approval

1. Rebaseline accepted Plans 01–09 and freeze the minimum rules envelope.
2. Add seat/device diagnostics and context ownership behind a disabled feature flag.
3. Add placeholder companion runtime, camera tether, and overlay scheduler.
4. Add glimmer/handoff, ping, flourish, join/leave/menu, and deterministic tests.
5. Run the family slice; stop or revise at its decision gate.
6. Only after a positive gate, produce approved character/UI/VFX/audio assets and performance/accessibility qualification.
7. Run full campaign/platform regression and Human ship approval.

### 14.2 Recommended co-op — Miri's Wishwing Courier

#### Emotional pitch and character direction

Miri (working name, she/her) is a tiny original wish-sprite who treats Ame's moving window as a magical little sky. She spots a wish, loops through scenery, brings it home to refill her own friendship magic, points without ordering, and turns each friendly guardian comparison into a two-person “are we ready?” moment. Ame is still the person who understands and completes the maze; Miri owns the rhythm around that understanding. A child can feel wonderfully quick and magical as Miri, while a parent can offer bounded support without silently taking the puzzle away.

Miri's visual identity, name, species, relationship, proportions, age coding, palette, and story availability are all open art/story decisions. The mechanic requires a clear small female companion silhouette, one carry state, one dock state, readable emotion at board scale, and no resemblance to a protected precedent; it does not require “fairy,” wings, a wand, or any specific costume.

#### Thirty-second and five-minute loops

**Thirty seconds:** scan live view → choose a Wish Mote, useful ping, harmless flourish, or visible guardian → fly → perform the bounded action → courier the mote to Ame or spend one Focus on Dazzle → say/see the exact shared result → reposition as Ame moves the camera.

**Five minutes:** Miri manages a three-point personal Focus rhythm across multiple windows: carry a mote when below cap, use one well-timed Dazzle to make a Power decision legible, place or revise one semantic ping, wake a laugh-worthy flourish, dock through a portal/jump, and contribute to a victory. The choices are which opportunity matters, when to spend, whether to return now, and what to communicate—not which required item to steal from the route.

#### Exact abilities and constraints

1. **Fly/dock:** the same deterministic movement and camera contract as the minimum pitch.
2. **Wish Mote courier:** one live-visible Duo-only mote, pickup radius 0.30 tile, capacity one, automatic handoff within 0.75 tile of Ame. Handoff adds exactly 1 Focus, capped at 3; an over-cap mote is not spawned/eligible.
3. **Focus:** transient integer `0..3`, seeded 2 on the first P2 join of a run under Section 11's exact preserve/reset policy. Dazzle and optional Ready-Set-Giggle each cost 1 only on accepted activation. If Focus is 0 and no legal mote opportunity exists, one point regenerates after 600 unpaused free-gameplay ticks; it cannot exceed 1 through regeneration. Leave/disconnect resets regeneration progress to 0 while preserving the integer, so reconnect cannot manufacture Focus.
4. **Dazzle & Compare:** exactly Section 8.2—visible unresolved guardian, Miri within 0.60 tile, supercover line not crossing wall/closed door, one Focus after all legality checks, nonstacking, 360-tick semantic lifetime, 180-tick per-guardian cooldown, and unchanged base equation.
5. **Ready-Set-Giggle:** exactly Section 8.3, optional and nonessential. It becomes legal only after the base engine says the guardian is already winnable; it changes only the encounter presentation and P2 credit. A missed/absent press never delays Ame.
6. **Semantic ping:** one neutral `Look` marker, 300-tick lifetime, 120-tick replacement cooldown. It must be placed on a `liveVisible` cell at Miri's point with controller Y or a mouse click on empty eligible space. It computes no readiness or route fact. If Ame moves the camera, the already-placed marker may remain inert on the revealed minimap until its original expiry; P2 cannot place, move, or retarget it offscreen.
7. **Environmental flourish:** one typed, idempotent live-visible opportunity within 0.60 tile, three-second global cooldown, no base event/state effect.
8. **Forbidden:** base collection/reservation/attunement, reveal/scouting, camera control, arithmetic change, movement of Ame/guardian/object, Hint advance, global menu focus, rescue, portal, objective, and exit.

#### Interaction matrix capsule

The **Recommended** column of Section 13 is binding. In particular, flight permission through wall art is never interaction permission; guardian magic is an equation/readiness presentation; cargo is a `DuoMoteId`; all base collectibles/currency/rescues remain Ame entry events; and P2 absence projects immediately to a normal solo state.

#### Camera and tether

Section 9 applies exactly. Miri stays within the inset current camera rectangle; she may occupy a wall point but must leave it before a line-of-effect cast. Camera shift preserves, clamps, or docks by the fixed geometry; it never waits for her. At proximity to Ame or an essential object, her body becomes the small side silhouette/halo beneath labels. Modals, presentations, blur, pause, story, and victory clear motion and targets. Miri never reveals even one tile.

#### PC and controller mappings

The Section 10 mappings are normative. On PC, Arrow/WASD controls Ame and explicit Mouse Companion transfers the board pointer to absolute P2 flight: left-click performs context on a legal target or pings empty space, right-click docks, `Space/Q/R` provide digital equivalents, and all board actions stop on pointer exit/blur/modal. With two pads or Deck/external combinations, P2 left stick/D-pad flies, A performs context, Y places/replaces the deterministic semantic ping, B docks, X asks for Hint, and Menu requests pause; P1 retains the accepted Plan 08 map. Prompts identify role and source independently.

No default pointer lock or hover capture is used. CSS-to-world mapping always uses the measured MazeViewport transform. UI chrome remains clickable UI, never a cast surface. Initial touch Duo is unsupported; solo touch stays intact.

#### Join, leave, role, and menu UX

- **Home:** Solo Continue/Begin remains primary; **Play together** opens a short two-role card and `Press A / Join with mouse` invitation. Optional per-run `Open join` versus `Invite only` prevents repeated uninvited joins.
- **Mid-maze:** join only in free gameplay. A join edge during a dialog/story is consumed only to show `Join when play resumes`; it cannot dismiss or reserve the seat. The source must release and produce a fresh neutral-gated join edge at the next free boundary.
- **Leave/disconnect:** immediate nonblocking solo continuation; companion transients clean up; **Companion can rejoin** toast. P1 disconnect pauses/rebinds instead. P2 may explicitly choose `Continue solo as Ame` from the P1-loss surface, but there is no automatic promotion.
- **Menus:** either requests pause with a fresh edge; P1 owns global focus/destructive confirmation. P2's isolated actions are Resume request, Leave, role-swap request, help, and personal settings.
- **Swap:** home/maze boundary/safe pause only, P1 initiates, P2 confirms inside ten seconds, both sources neutral, bindings swap atomically, Miri docks, camera remains on Ame.

#### Solo parity, persistence, records, and rewards

All completion, rescues, unlocks, story, Gold/Science, stickers, badges, and achievement credit are fully valid and awarded once. Duo is never “practice” or “assisted.” Motes/Focus have no base reward value.

For prototype telemetry, joining sets `duoEverJoined`; the first accepted event in Section 11's fixed `recordableCompanionAction` enum sets `togetherMeaningful`, and that flag cannot downgrade when P2 leaves. Product policy should present parallel **Solo** and **Together** summaries keyed by `{levelStableId, contentRevision, participationLane, rulesetVersion}` if Human approves Duo, because social information and pacing differ and later rules must not silently reinterpret old bests. Existing records migrate as Solo; completion/rewards aggregate normally and cannot be farmed twice. A future Courage/mechanical variant additionally changes `rulesetVersion` permanently for that run.

Active-run save remains base state plus only approved versioned participation metadata. Never persist device, index/id, Miri coordinates, input, target, cooldown visual, or carried mote. Reload resumes valid Solo with default transient Focus and a join invitation. A missing P2 never loses progress or an earned campaign object.

#### Required UI, art, VFX, animation, and audio

- Approved original companion model sheet, world sprite, silhouette/outline/pattern, idle/flight/dock/carry/cast/cheer/victory states, portrait, and static/reduced variants under Plan 03/05 safe bounds.
- Role/join/controller surfaces; small companion status with Focus `0..3`, cargo, current ping, action/cooldown text; target legality/rejection copy; equal victory contribution line.
- Wish Mote, pickup, carry, handoff, Focus, Dazzle equation, semantic pings, harmless environmental responses, recovery/dock, join/leave, disconnect, and role-swap event treatments under Plan 02/04 contracts.
- Optional seat-local voicelets/chimes/haptics only after story/tone and audio-access review. Every semantic result has static icon/text/shape parity.
- Density budgets: one mote, one ping, one carry, at most two flourish accents and one guardian effect active; effects render under critical labels and never add idle whole-App work.

#### Technical architecture

Use the minimum architecture plus an ephemeral deterministic `CompanionRulesState`:

```text
CompanionRulesState = {
  sessionTick,
  positionQ256,
  focus: 0..3,
  carriedDuoMoteId?: string,
  activePing?: { cell, expiresAtTick },
  activeMote?: { moteId, cell },
  overlayScheduler: {
    duoSessionSeed, currentCameraWindowId, visitOrdinal, offerOrdinal,
    offeredMoteIds, consumedMoteIds, activatedFlourishIds, quietUntilTick
  },
  activeDazzle?: { guardianId, expiresAtTick },
  pendingGiggle?: { guardianId, expiresAtTick },
  target?: semanticId,
  cooldownUntilTickByAbilityAndTarget,
  participation
}
```

It is not the current `GameState` and cannot contain a `LevelObject.id` in cargo. Commands are `flight-intent`, `context`, `ping`, `dock`, `pause-request`, and lifecycle commands. `context` resolves against a typed eligibility table and a stable target sorter after the P1 transition. Fixed simulation ticks, not `Date.now()`, govern Focus regeneration and cooldown legality; pause freezes them. The core-state projection assertion runs after every companion command in development/test.

Scene movement updates outside App-level React state; semantic actions enter a reducer/log. The same events drive Full/Reduced/Static. Overlay opportunity randomness derives from a separate stable namespace, so replaying the same level/revision/run/camera visit produces the same candidates without perturbing topology or solver seeds. The feature is versioned and kill-switchable at the mode boundary.

#### Level/content implications

No existing level requires annotations. The first release should use generic safe-cell overlays across the final 24-level set, then optionally add a small number of approved typed flourish anchors per level without changing solver data. Guardian Dazzle reads current printed facts and adds no content exception. Every campaign/Surprise maze must still solve ordinarily/perfectly with P2 absent; every base-object allow-list test must remain empty.

#### Risks and rollback

- **Side-game risk:** Motes feel detached from Ame's important choices. **Response:** test whether pings/Dazzle create actual request-response; never “fix” it by granting base collection without a new approval/spec.
- **Quarterback risk:** adult P2 spams prescriptive pings. **Response:** one active marker, cooldown, P1 dismiss/mute, and request-led Dazzle copy.
- **Camera risk:** fast Ame movement repeatedly clamps P2. **Response:** tune speed/orbit and reduce flourish density; if still poor, test Twin Trails/Maplight rather than camera tug.
- **Complexity risk:** four verbs overload a young P2. **Response:** progressive onboarding and one-button contextual mode; minimum pitch is an independent rollback tier.
- **Character risk:** Miri is not loved or conflicts with lore. **Response:** mechanics use a character-neutral actor contract; Human can substitute an approved original/existing character before asset production.
- **Technical/performance risk:** dual polling and flight cause renders/effect load. **Response:** scene-local motion, caps, telemetry, performance gate, and per-verb kill switches.

Rollback order is reversible: disable authored flourishes → disable Ready-Set-Giggle → disable Dazzle/Focus → fall back to Co-Star Spark → disable Play Together. Because no layer owns base state, every rollback preserves active solo saves.

#### Acceptance criteria

In addition to the minimum criteria:

- For every accepted companion command, tests prove `projectCoreState(after) == projectCoreState(before)` and unchanged `revealedTiles`; invalid/stale targets spend no Focus.
- Dazzle tests cover no sword, `<`, `==`, `>`, wall/door block, range boundary, overlapping guardians/tie sort, camera loss, pause, disconnect, reduced/static, and exact equation. It never changes movement/hint/solver output.
- Mote tests cover cap, deterministic ID/placement, one cargo, handoff radius, portal/jump docking, leave/reload cleanup, same-tick Ame conflict, and no overlap with every base kind/exit.
- All controller/source lifecycle cases in Sections 10 and 13 pass without double actions, owner theft, join-edge leakage, focus fights, pause loops, or persisted index identity.
- The Section 16 prototype clears every hard integrity gate and agency threshold; then a six-family formative round covers child-as-Ame, child-as-Miri, two children, mixed input, and Reduced/Static before production approval.
- Final scene-local companion work stays within the accepted post-Plan09 performance budgets on representative low/medium/high devices and Steam Deck, with no new idle whole-App render loop.

#### Estimated implementation phases after approval

1. Re-audit frozen Plans 01–09; Human locks character placeholder, permission envelope, records label, and prototype hypothesis.
2. Build disabled seat/input/context diagnostic harness and cross-platform controller matrix.
3. Build placeholder Miri runtime, exact camera/tether, join/leave, and invariant logger.
4. Add deterministic Wish Mote/courier/Focus and semantic ping; run the integrity fixture.
5. Add Dazzle & Compare and optional safe flourish/Cheer; verify equation, motion modes, and core projection.
6. Run Amelia-and-parent slice and role swap; make the first stop/go/revise decision.
7. If positive, conduct six-family formative tests and accessibility/input variants; make the production approval decision.
8. Only then make final UI/art/VFX/animation/audio, versioned persistence/records, full 24-level/Surprise QA, performance qualification, and release review.

### 14.3 Ambitious co-op — Twin Trails

#### Emotional pitch and character direction

Twin Trails challenges the assumption that Player 2 needs free wall-crossing flight. Ame lays down the lived story of the maze on the ground; beside it, the companion follows an optional constellation of sky-thread perches that only comes alive where Ame has explored. P2 chooses branches, latches a friendly signal, and invites Ame to complete optional duet discoveries. Sometimes a rescued Puzzlewild friend can appear as the companion's approved skin or flourish partner. The roles feel more like two distinct instruments playing one melody, while the whole authored maze and every reward-critical route remain a complete one-person piece.

The default character can remain an approved Miri-like original or become an approved existing friend after chronology review. Character-specific specialties are a future content layer, not part of the first Twin Trails rules proof. No borrowed name, silhouette, terminology, or signature precedent mechanic is acceptable.

#### Thirty-second and five-minute loops

**Thirty seconds:** Ame moves and reveals a sky-thread fork → P2 chooses one connected perch → A latches a `Look`, `Echo`, or `Courage` opportunity → Ame decides whether to route beneath/near the optional echo point → the pair completes a small duet or lets it expire harmlessly → both continue.

**Five minutes:** P2 traverses several optional branches, chooses which constellation to pursue, communicates a rendezvous, activates one noncritical two-step duet, and—in explicitly certified content only—spends bounded Focus on a Courage Link. Ame keeps solving the base keys/hazards/Power route. In solo, the same optional thread may be completed by safe-pause role switching and latched states, or ignored entirely.

#### Exact abilities and constraints

1. **Sky-thread traversal:** `SkyThreadGraph(contentRevision)` is a separate optional overlay of stable nodes/edges. A P2 move selects only a connected node that is revealed, inside the current camera, and not presentation-locked. P2 has no base collision or arbitrary world coordinate.
2. **Deterministic selection:** stick/D-pad direction chooses the connected edge with smallest angular difference, then shortest edge, then lexical node ID. Mouse clicks only a connected visible node; no teleport past a branch. Movement animation never changes the already-committed node.
3. **Perch latch:** A on an eligible node creates one optional latch for ten accepted Ame action attempts or until camera loss/leave. One latch globally; replacing it releases the prior one. A latch cannot open/close/move/reveal/resolve a base object.
4. **Duet discovery:** a latch may expose a separate `duo-discovery` echo on a base-legal, already-revealed cell. Ame may enter that cell normally to complete an optional constellation stamp; expiry or P2 absence removes the echo. It grants no campaign gate, Bag object, currency, solver edge, or required mastery credit.
5. **Pings/flourishes/Focus:** the recommended safe verbs remain, adjusted to graph nodes. Duo discoveries or motes refill transient Focus to cap 3.
6. **Courage Link:** Section 8.4 only. `authoredAssistCap` defaults 0; a nonzero value requires an explicit content-revision certificate from the separately approved Duo rules/search model. Sword remains mandatory and full guardian Power transfer remains intact.
7. **Solo role switch:** at a safe pause, one person may bind the companion, set a latch, return to Ame, and act before the generous action-attempt expiry. Optional discoveries may also be ignored. No real-time simultaneous timing is required.
8. **Drop-out release:** leaving clears/latches optional state or returns it to a declared neutral node. Every reachable state projects to a finishable base state.
9. **Forbidden:** all Section 13 base interactions, required co-op switches, body blocking, shared camera, P2 death/health, hidden topology, and any Courage use without a matching certificate.

#### Interaction matrix capsule

The **Ambitious** column of Section 13 is binding. The important distinction is that P2's traversal grammar is an optional graph, not unrestricted through-wall reach. Base items, hazards, rescues, portals, objective, and exit remain Ame-only; Surprise Mazes fall back to recommended safe behavior unless their overlay and assist caps have separate solver certificates.

#### Camera and tether

Ame remains sole camera authority. The available subgraph is `nodes whose underlying cell is liveVisible`; historical off-camera nodes may appear only on a P1-opened minimap as inert known markers. If Ame shifts the view and P2's node remains available, retain it. Otherwise select the closest available node to Ame by world distance then ID; for portal/jump/load or no available node, dock at a synthetic noninteractive orbit node. Full motion may trace the committed edge; Reduced/Static use a short fade/instant node change. No camera pan waits for a thread animation.

#### PC and controller mappings

- **Mouse P2:** hover may highlight only connected nodes; left-click commits a highlighted node or its context; click on empty space places the permitted ping; right-click docks. UI and board ownership follow Section 10.
- **Digital/analog P2:** left stick/D-pad selects/moves along graph edges with the deterministic angle rule; A activates the node; Y handles ping; B docks; X requests Hint; Menu requests pause. There is no mandatory fine analog steering.
- **Ame and seating:** unchanged Plan 08 map and Section 10 explicit claims. A role swap changes device-to-logical-role binding, not the maze actor or camera authority.

#### Join, leave, role, and menu UX

The recommended flow applies, plus a short `Twin Trail` role card explaining that optional constellations are skippable and never the exit. Joining initializes at the orbit node; it does not retroactively spawn a required opportunity. Leaving releases every optional latch before the next Ame command and continues solo. P1 owns optional-loadout choice and every global/destructive surface; P2 confirms their selected companion presentation. Solo role-switch controls appear only while an optional latch is relevant and never imply that switching is required for campaign completion.

#### Solo parity, persistence, records, and rewards

Every base completion, rescue, reward, and achievement is available without entering a sky thread. Duo discoveries may provide an additive friendship album only if the Human explicitly accepts that some optional recognition is easier socially; it can never unlock a maze, ending, core sticker, equipment, currency economy, or perfect result. A solo player must be able to obtain the same optional discovery through role switch if it is durable.

Twin Trails needs a versioned Duo snapshot plus a sanitizer that drops safely to the base projection. Records use `{levelStableId, contentRevision, participationLane, rulesetVersion}`. Leaving cannot relabel a Courage-altered run as safe/solo. Exact low-risk reload policy: validate and preserve committed core results, completed durable Duo discovery IDs, and sticky rules/participation classification; cancel/refund every uncommitted latch/Courage reservation; discard companion node/cursor/targets/cooldowns; reset transient Focus to 2; and resume Solo. P2 may rejoin from the neutral orbit. Any richer restoration must be defined in the separately approved Twin Trails rules/save specification.

#### Required UI, art, VFX, animation, and audio

Everything in the recommended pitch, plus a legible optional sky-thread/perch grammar, connected-node focus, branch selection, latch lifetime expressed without timing pressure, duet echo, solo-switch affordance, optional character skins/reactions, and explicit safe-versus-certified Courage equations. Full/Reduced/Static must show identical graph connectivity and latch state. The layer needs its own contrast/density/occlusion/performance budget and cannot visually resemble maze walls, doors, portal paths, or objective routes.

#### Technical architecture and separate solver requirement

Twin Trails adds a versioned rules domain:

```text
DuoRulesState = {
  companionNodeId,
  latch?: { nodeId, kind, remainingAmeAttempts },
  completedDuoDiscoveryIds,
  focus,
  activeCourage?: { guardianId, boost, remainingAttempts },
  rulesetVersion
}

SearchState = { coreGameState, duoRulesState, camera/reveal abstraction }
```

The separate specification must define command priority, graph reach, live-camera eligibility, solo role-switch transitions, disconnect/reset projection, save sanitization, Hint interaction, record classification, and `certifiedAssistCap`. Continuous animation is abstracted away; the search uses reachable semantic nodes/targets. For every level/revision and generated certificate it must prove:

1. ordinary and perfect Solo remain solvable under the unchanged core engine;
2. approved Duo objectives are solvable by two players and by solo role switch if durable;
3. every reachable Duo state can still reach a valid base completion after immediate P2 departure;
4. no required item/object can be reserved, stranded, hidden, or made dependent on a latch;
5. any nonzero Courage cap cannot bypass the required weapon or invalidate declared route/Power lessons; and
6. hints, active-run validation, and records replay the same versioned transition semantics.

#### Level/content implications

This is authored expansion work. Each supported level needs an optional graph, safe discovery placement, visual-readability pass, chronology/character review, solo-switch test, drop-out proof, and performance budget. The 24 base levels cannot be delayed or rewritten for it. A small later “Twin Trails set” is more realistic than annotating everything at once. Surprise Mazes use the recommended safe fallback until a graph generator and joint verifier exist; absence of a certificate forces `assistCap = 0` and no persistent duet discovery.

#### Risks and rollback

- **Leash/camera frustration:** the optional graph may disappear just as P2 chooses. Roll back individual branches, increase latch generosity, or fall back to camera-local Wishwing flight.
- **Optional-content economics:** high art/authoring cost may serve few players. Ship a deliberately small expansion or do not build it.
- **False optionality:** visible duet rewards can make solo feel incomplete. Give parity through role switch, avoid progress rewards, and test copy/placement.
- **Arithmetic contamination:** even certified Courage can teach a different sequence. Keep it a separately named ruleset or remove all nonzero caps.
- **Cognitive load:** graph, maze, pings, Focus, and roles can crowd the screen. Stage mechanics and allow Co-Star/Recommended mode as a simpler selectable tier.
- **Save/search risk:** version churn can strand optional state. Core-first sanitization and kill-switch projection must be proven before content.

Rollback is layered: set every `assistCap` to 0 → disable durable discoveries/latches → run recommended Wishwing verbs on generic camera overlays → disable Twin Trails mode. The core save remains readable at every step.

#### Acceptance criteria

- A separate Human-approved rules/solver/save specification exists before implementation; no Courage or persistent duet state is accepted through a presentation-only shortcut.
- Every supported level/revision has Solo, Duo, drop-out-from-every-reachable-state, solo-role-switch, Hint, save/reload, and record certificates.
- No optional graph node overlaps or visually impersonates a base gate/object/route; all nodes obey reveal/camera and motion-mode truth.
- P2 can make at least three distinct strategic choices in a representative five-minute segment without blocking Ame; solo switch completes any durable optional content without real-time precision.
- Disconnect at every latch/Courage phase returns to finishable Solo deterministically; committed arithmetic remains correctly versioned and displayed.
- Full input, accessibility, performance, 24-level fallback, generated fallback, and family-playtest matrices pass before any content-wide rollout.

#### Estimated implementation phases after approval

1. Separate concept approval and rules/solver/save specification after the recommended prototype evidence exists.
2. Build semantic sky-thread graph and search abstraction on one debug fixture only.
3. Prove solo switch, arbitrary drop-out, save sanitization, and `assistCap = 0` baseline.
4. Author one optional duet and conduct mixed-skill family testing.
5. Decide whether Courage is still needed; if yes, certify a single noncritical case and compare against non-arithmetic play.
6. Produce final graph/duet UI and presentation for a small content set.
7. Certify each level/revision; provide recommended-mode fallback elsewhere and on Surprise Mazes.
8. Only after a second Human gate, expand content or character-specialty scope.

### 14.4 Opinionated exploratory recommendation

Choose **Miri's Wishwing Courier** for the post-Plan09 placeholder prototype—not for production approval yet.

It is better than unrestricted flying collection because permission is explicit: moving over a wall never grants the right to collect through it; every key, weapon, potion, traversal item, treasure, cage, portal, guardian result, objective, and exit remains an Ame/engine transition. The solver's base graph stays honest, the finale's Power ordering survives, and P2 can leave without undoing anything.

It is better than a purely cosmetic helper because P2 owns four interlocking decisions: where to fly, which transient opportunity to pursue, when to return/spend Focus, and what to communicate. Courier movement creates a physical request/rendezvous; ping creates a social proposal; Dazzle creates a shared reasoning beat; flourishes provide humour during calm traversal. Contribution has a named result and visible victory credit.

The largest remaining uncertainty is whether those safe decisions feel connected enough to Ame's real puzzle to sustain pride after novelty. The cheapest discriminating test is the Section 15 integrity fixture with placeholder geometry, a key visibly trapped behind its own door, one Power-order choice, one portal camera relocation, three motes, one ping, and Dazzle. Swap child and adult after five minutes. If P2 cannot meet the agency/communication/replay gates without base-object permission, do not disguise the result with final art; revise toward authored Twin Trails or stop.

## 15. Recommended placeholder vertical slice

**Exploratory prototype design — non-canon, not authorization to implement, and deferred until after Plan 09 plus a Human prototype approval.** The slice tests whether a protected companion role is genuinely cooperative and whether the permission boundary survives the exact traps that make unrestricted flight dangerous. It does not merely prove that two pointers can move.

### 15.1 Representative mazes and scenario

Use two debug/test-only segments with persistence, campaign rewards, progression writes, achievements, and final art disabled:

1. **Co-op Integrity Lab (purpose-built fixture, 6–8 minutes).** A compact camera-follow maze composes already-supported mechanics without entering the campaign:
   - an immediately visible key on the far side of its own matching door;
   - initial Ame Power 2, a legally reachable weapon, and guardians printed 2, 4, and 7: the intended no-potion chain is `2 + 2 = 4`, `4 + 4 = 8`, then `8 + 7 = 15`; Power 4/7 are visible before readiness. A visible optional `+1` potion sits behind a normal Ame-only side route to test that P2 cannot fetch/reorder it;
   - Splash Boots across a water/lava decision, Antidote Leaf/poison, and Spring Boots before a two-hole straight jump;
   - one optional treasure branch and one cage/rescue;
   - three deterministic Duo-only Wish Motes in safe cells;
   - one harmless flourish opportunity;
   - one portal whose destination shifts the camera; and
   - an exit visible early but reachable only by Ame's valid route.
2. **Frozen real-maze check (2–4 minutes).** Reuse the accepted post-Plan09 equivalent of current **Rose Heart Roundabout** for a real portal/backtracking camera recovery and the accepted equivalent of **Rainbow Power Parade** for one high/low Power-order view. The researcher may start at a validated debug checkpoint. This is a regression/transfer check, not a campaign edit.

The fixture must keep base values/objects distinguishable from P2 overlays and include automated assertions for every critical object. If Plans 06/09 materially change these mechanics, select equivalent final levels and document the substitution before the prototype; do not preserve obsolete current quirks.

### 15.2 Placeholder Player 2 and minimum prototype surface

- P2 is a flat circle with a star-shaped cutout/badge, `P2` text, and high-contrast outline/pattern. It is intentionally not a character concept or art test.
- Cargo is one small patterned diamond attached to the placeholder; Focus is three labelled static pips.
- A legal target uses a solid shape ring + text; illegal uses a crossed icon + exact reason such as `Ame carries keys` or `A polite sword comes first`. Colour and animation are optional reinforcement.
- Full prototype motion is simple translation/fade. Reduced and Static are implemented from the same event/state immediately, so accessibility truth is testable before polish.
- The board keeps one companion, one ping, one mote, one guardian equation, and at most one flourish accent active.

### 15.3 Minimum controls and actions under test

P1 needs existing movement, Hint/menu, and normal base interactions only. P2 needs:

- analog and D-pad/digital flight;
- context action for one Duo mote, handoff, one flourish, and Dazzle;
- one semantic/neutral ping;
- dock/recall;
- pause request;
- explicit join, leave, reconnect, and one safe role swap.

Keep the **same input arrangement for both role blocks** so role and device are not confounded; two external standard Xbox controllers are the preferred first-session arrangement. If time remains after the debrief, run a separate unscored 60–90 second Arrow/WASD + explicit Mouse Companion join/flight/context smoke. The later six-family round counterbalances keyboard/mouse, Deck/hybrid, role order, and Reduced/Static; the first dyad's role metrics never mix input schemes.

### 15.4 Prototype conditions

The primary condition is the recommended safe pitch: three Wish Motes, Focus start 2/cap 3, Dazzle with no arithmetic, one ping, one flourish, exact tether and drop-out.

At the end, and only if the main route is complete, run a two-minute **Co-Star baseline** with Focus, Dazzle, and flourish disabled while flight, one glimmer handoff, one ping, and social reaction remain. Ask both players which version gave P2 clearer choices and felt more connected. In the one-dyad session this always follows Recommended and is therefore learning/order-biased; it is a qualitative probe only. The six-family round counterbalances Recommended-first versus Co-Star-first.

Do not prototype remote/base treasure delivery, required items, origin attunement, arithmetic assistance, or an easy-Duo mode in this first test. Section 7 already resolves their rule consequences; including them would confound the largest uncertainty—whether the safe recommended job adds genuine agency beyond the minimum/cosmetic pole.

### 15.5 Deterministic assertions and instrumentation

Every logged row uses the same monotonic simulation tick and includes:

```text
sessionAnonId, levelStableId, contentRevision, condition, tick,
seat, runtimeSourceTokenHash, inputModality,
commandType, commandPhase, worldQ256,
targetSemanticId, targetKind, eligibilityResult, rejectionReason,
cameraWindow, companionRecoveryKind,
coreStateDigestBefore, coreStateDigestAfter,
revealDigestBefore, revealDigestAfter,
companionStateDigestBefore, companionStateDigestAfter
```

Log/derive:

- Ame moves, wall bumps, steps, pickups, doors, hazards, jumps, portals, guardians, rescues, Hint requests, exit, and puzzle-decision owner;
- P2 movement time, accepted/rejected target actions by type, mote pickup/handoff, Focus spend/regeneration, Dazzle equation, ping placed/replaced/dismissed, flourish, dock/clamp/starfold, join/leave/swap/pause/reconnect;
- idle intervals, camera-wait intervals, time outside useful range, simultaneous seat actions, P2 actions P1 responds to within ten seconds, and accidental global UI attempts;
- observer tags: plan, question, request, answer, thanks, laugh/delight, pride, adult directive, physical takeover, ignored request, disagreement, P1 waiting for P2, P2 waiting for camera, and who noticed/decided/acted on each puzzle beat; and
- hard assertions: P2 never changes any base object/reveal/Power/equipment/key/door/position/step/rescue/treasure/status/exit field; overlay seed cannot change core level digest; every leave/disconnect checkpoint remains solo-solvable.

A **meaningful P2 action** is one that either changes an optional companion state with a visible purpose (mote pickup/handoff, Focus choice, valid Dazzle, distinct flourish) or communicates a proposal that P1 acknowledges/acts on within ten seconds. Raw flight, repeated input, rejected spam, passive camera following, and repeated identical pings do not count.

### 15.6 Prototype acceptance and failure thresholds

These thresholds are decision signals for the prototype, not scientific claims or a production quality bar.

| Measure | Advance signal | Revise/reject signal | Decision supported |
|---|---|---|---|
| Critical integrity | **0** required-item, door, equipment, hazard, Spring, portal, guardian-order, rescue, objective, exit, fog, Hint, or reward bypasses; **0** core/reveal invariant failures | Any single violation | Immediately reject the responsible permission; safe pitch cannot advance until zero. |
| Soft locks / stranded state | **0** from action, camera move, portal, modal, join/leave, disconnect, swap, restart, or reload | Any reachable nonfinishable/stranded state | Stop; repair lifecycle or remove mechanic. |
| P2 agency | At least **8 meaningful actions** from at least **3 action families** per five-minute role block | Fewer than 8 or only one repeated family | Add a bounded optional decision loop or reject; do not grant required-object access as the first fix. |
| P2 idle | Median involuntary idle gap `<12 s`; no involuntary gap `>30 s` | Any repeated camera-caused `>30 s` gap | Adjust density/tether/role model; consider non-flight alternative. |
| Camera conflict | At most **2** forced tether recoveries per block and **0** camera tug; recovery is understood after one occurrence | Repeated recovery dominates talk or P1 changes route only to rescue P2 | Tighten orbit/speed or reject camera-bound flight. |
| Control/UI clarity | Both state their job after 60 seconds; at most **1** accidental global UI action; no join edge advances a modal | Repeated same-rule failure `>2`, menu fight, owner theft, or pause loop | Revise mapping/onboarding/authority before content polish. |
| Cooperation | At least **3** spontaneous task-relevant exchanges per block and one P1 response to a P2 proposal | Mostly parallel silence or adult monologue | Strengthen request-response moments or abandon the verb. |
| Domination | No physical takeover. When the adult is companion, they direct `<50%` of child-Ame route decisions. When the child is companion, the child owns most companion-target choices and adult-Ame acknowledges at least one proposal. | Takeover, blame, ignored child choice, adult-companion remote-directs the route, or adult-Ame chooses every P2 action | Make support request-led/less prescriptive; retest. |
| Delight/pride | At least one spontaneous laugh/delight and one unsolicited pride statement overall | Either calls role “just following/clicking” or no attributed contribution | Do not call it lovable; revise or stop. |
| Role desirability | Both willingly swap; at least one chooses companion for another run; at least one asks for another maze now | Swap refused because a role is lesser/dull, or second maze declined for role reasons | Fails the core product opportunity regardless of technical success. |
| Recommended versus Co-Star baseline | Recommended produces clearer P2 choices/connection without overload; interpret first dyad cautiously because order is fixed | No perceived gain, more confusion, or preference for the thinner role | Remove unnecessary verbs or reject the hybrid; counterbalance the comparison in the six-family round. |

## 16. Amelia-and-family playtest protocol

**Exploratory research protocol — non-canon and not authorization to recruit, record, or implement.** Obtain normal parent/guardian consent and use the project's accepted privacy/telemetry process before any study. The first Amelia-and-parent session is formative and directional; it cannot validate “families” as a population.

### 16.1 First 15–18 minute session

| Time | Activity | Researcher behavior |
|---:|---|---|
| 0:00–2:00 | Neutral onboarding and free flight in a safe start area | Read one standard script: “Ame chooses the path and carries Adventure things. The companion flies in this view, brings wish-magic, and shares ideas. Neither job is the easy job.” Demonstrate join/dock once. |
| 2:00–7:00 | Block A: Amelia chooses first role; parent takes the other | Do not steer the route or suggest verbs after the first 30 seconds. Intervene only for safety, instrumentation failure, or a 45-second total stall. |
| 7:00–7:30 | Separate quick questions/ratings | Ask each without the other answering first; collect simple 1–5 fun/clarity and one free response. |
| 7:30–8:00 | Safe-pause role swap | Observe whether prompts/authority are understood; do not move controllers for them. |
| 8:00–13:00 | Block B: reversed roles, including portal/recovery | Same input arrangement and neutral observation. Ensure the child experiences both camera authority and tether response. |
| 13:00–15:00 | Brief Co-Star baseline | Disable Focus/Dazzle/flourish only; explain the thinner rule and treat preference as order-biased. Stop if the main route overran. |
| 15:00–18:00 | Separate debrief, joint favourite moment, “another maze?” | Ask open questions before revealing design intent. Optional input smoke follows metrics only. Invite a doodle/name/personality idea after mechanics feedback, so art charm does not mask job quality. |

If Amelia strongly prefers the companion first, honour that choice. Do not force child-as-Ame as the opening condition merely for counterbalancing; record order and swap once. The adult is instructed not to take the child's controller, answer for them, or narrate every solution.

### 16.2 Questions after each role block

Ask separately and without proposing an answer:

1. “What was your job?”
2. “Tell me about one choice you made.”
3. “When did you need the other player?”
4. “Did the other player do anything you did not want?”
5. “Was there a time you had nothing useful to do?”
6. “What did your sparkle/ping/guardian magic change?”
7. “Which role would you choose next, and why?”
8. “Would you play another maze now?”

Ask Amelia afterward: “What kind of magical friend would you want?”, “What should make the friend laugh or feel proud?”, and “Was anything too babyish, too busy, or bossy?” Those answers inform later character direction; they do not override the integrity assertions.

### 16.3 Observable behaviours

The observer records actions, not inferred feelings:

- who first notices each key/door/equipment/hazard/guardian/portal/optional branch;
- who proposes the plan, who accepts/rejects it, and who executes each part;
- spontaneous request, answer, thanks, joke/laugh, pride statement, celebration, teaching, negotiation, and role-protective language;
- adult directive, repeated command, solution recital, ignored child request, blame, sigh, physical takeover, or child waiting for permission;
- P1 waiting voluntarily for a desired handoff versus P1 being blocked; P2 choosing to dock versus having no legal action; and
- whether role swap is eager, neutral, resisted for attachment, or resisted because one role feels lesser.

Video/audio is unnecessary if it increases privacy burden; synchronized event logs plus timestamped researcher notes can answer the first gate. If recording is later approved, code participants anonymously and never persist controller identity.

### 16.4 Decision map and next sample

- **Any integrity/soft-lock failure:** reject or remove the exact permission first. Do not average it against fun.
- **Integrity passes, P2 agency fails:** add or change a bounded optional loop, opportunity pacing, or request-response grammar. Do not jump to keys, equipment, treasure, rescues, or Power arithmetic.
- **Agency passes, camera fails:** tune speed/dock/inset once, then compare Poggle Maplight or Twin Trails. Do not let P2 pull the camera.
- **Cooperation fails through adult dominance:** make pings request-driven, less prescriptive, or P1-acknowledged; adjust onboarding; retest with roles reversed.
- **Controls fail:** fix source ownership/glyphs/neutral gates before evaluating the fantasy.
- **Both roles pass all prototype signals:** authorize only a **six-family formative round**, not production.

That next round should deliberately include child-as-Ame/adult-as-companion, child-as-companion/adult-as-Ame, two children, role swapping, two pads, keyboard/mouse, Steam Deck/external where available, and at least one Reduced or Static feedback session. Track age/experience descriptively without claiming statistical generalization. Production work requires a later Human decision based on converging behavioural evidence, technical integrity, performance, and art/story fit.

## 17. Architecture and Plans 01–09 compatibility

### 17.1 At most three cheap, non-derailing seams

**Exploratory recommendations only — non-canon pending root-manager/Human review. Do not edit Plans 01–09 to add them.** These seams preserve optionality; they are not co-op work, seats, companion rules, content, or UI.

| # | Optional seam current work should avoid closing | What current work may do—no more | Safe post-Plan09 retrofit? |
|---:|---|---|---|
| **1** | **Per-device input provenance before solo ownership policy.** Normalized semantic actions retain an opaque runtime device token, modality, phase/edge, magnitude, timestamp, mapping/capability, connection generation, and neutral state; gameplay/menu/pointer context routing does not irreversibly erase the source. | Plan 08 may still choose exactly one sticky solo owner and implement no seats/join UI. Preserve separability between per-pad normalization/lifecycle and that one-owner policy. | **Yes.** Moderate controller/input refactor if provenance was discarded. Cheapest while Plan 08 already builds enumeration/normalization; not worth derailing it. |
| **2** | **Reusable MazeViewport world transform and actor/overlay layer.** Camera-to-world conversion, clipping, revision, and safe render ordering are exposed to a declared optional world actor; camera math does not assume exactly one sprite. The actor layer can be `pointer-events:none`. | Plan 01/02/04/05 may ship only Ame and current effects. No companion node, asset, CSS, transform loop, or placeholder is added. | **Yes.** Moderate UI/VFX regression risk after Plan 09; safest if the final MazeViewport already has a single transform authority for existing effects. |
| **3** | **Stable semantic identity/events and versioned extensibility.** Level/object IDs, content revision, semantic outcomes, save migrations, and record keys remain explicit; pure gameplay transition authority is not hidden in DOM presentation. | Plan 06/09 implement only solo rules, solvers, saves, hints, and records. No Duo field, command, reward, solver state, or overlay tag is added. | **Yes.** Core Plan 06/09 authority already needs most of this. Actual participation/ruleset schema migration waits until prototype approval. If stable identity is lost, retrofit becomes the riskiest seam. |

All three can be retrofitted after Plan 09. Seam 1 is merely cheaper during input work; seam 2 is merely cheaper during scene consolidation; seam 3 largely restates already-needed solo authority. If accepting a seam would delay an accepted Plan 01–09 milestone, reject it now and record the retrofit debt here.

### 17.2 Dependencies on final contracts

| Authority / plan | Plan 10 dependency after completion | Why prototype must wait |
|---|---|---|
| **Plan 01 — UI/UX** | Final MazeViewport measurement/transform/clip; top-overlay precedence; board versus chrome pointer ownership; focus, modal, TV-distance, and responsive contracts. | Mouse P2 and camera tether cannot be specified against moving coordinate/focus authority. |
| **Plan 02 — graphics/VFX** | Semantic effect ownership, busy/presentation lease, density, safe ordering, and Full/Reduced/Static event parity. | Companion actions cannot leak through combat/rescue/portal presentations or obscure truth. |
| **Plan 03 — art direction** | Approved companion identity, silhouettes, scale, labels, safe bounds, story fit, and visual non-copy review. | Placeholder mechanics should select the job before final character cost/emotional attachment. |
| **Plan 04 — lighting** | Final scene layering, occlusion/contrast, highlight limits, and camera visual focus. | A flying bright actor and pings can compete with objective/guardian/lighting cues. |
| **Plan 05 — animation** | Motion-mode semantics, animation budgets, pose/state contract, and recovery/transition rules. | Dock/starfold/carry/cast must not invent a fourth animation authority. |
| **Plan 06 — gameplay/UX/mechanics** | Stable pure engine, object IDs, corrected rescues, exact Hint search, session validation, progress/reward policy, presentation events, and save schemas. | P2 permissions must be tested against the final rules rather than current known defects. |
| **Plan 07 — performance** | Accepted asset/runtime budgets, representative devices, measurement scripts, idle-render rules, and Steam Deck evidence. | Continuous P2 flight/controller polling and effects need a real budget baseline. |
| **Plan 08 — controls** | Final semantic actions, contexts, glyphs, deadzones/repeat, multi-pad enumeration lifecycle, Tauri/web behavior, Steam Input qualification, disconnect/rebind, and accessibility. | One-controller passing behavior is not a two-seat architecture; the final baseline reveals the true delta. |
| **Plan 09 — 24 mazes** | Frozen stable level/revision set, generator contracts, ordinary/perfect solver certificates, progression/records, and representative final mechanics. | The overlay and invariant audit must cover the actual campaign, not a moving 16-level sample. |
| **Story Bible / final specs** | Companion chronology, relationship, tone, guardian language, victory credit, and no conflict with Ame/Poggle/Sprig. | A mechanic can survive a character swap; story canon should not be created by a placeholder. |

### 17.3 What requires a separate rules-and-solver specification

Any one of these crosses the safe presentation boundary and requires a separately approved, versioned co-op rules/search/save/hint/record specification before implementation:

- P2 collects, reserves, moves, attunes remotely, or resolves any existing base object;
- P2 changes Ame Power, guardian Power/effective comparison, equipment, key/door state, hazard legality, rescue, treasure/currency, objective, exit, or steps;
- P2 creates/reveals topology, moves Ame/camera, enters a portal as an independent rules actor, changes a Spring landing, or produces a route Hint;
- P2 owns a persistent resource/object whose absence can block or alter completion;
- any Duo overlay becomes required, reward-critical, or a generated-maze constraint; or
- Twin Trails graph/latch/Courage state enters saves or authored content.

The specification must model semantic P2 targets, command ordering, camera/reveal eligibility, disconnect/drop-out from every reachable state, solo switching where needed, Hint correctness, save migration/sanitization, record lanes, and ordinary/perfect/Duo certificates. Continuous coordinates should be abstracted to finite eligible targets/nodes for search; presentation must never be the only legality implementation.

### 17.4 What must not enter current scope

Plans 01–09 must not add a second player seat, join prompt, companion actor, companion asset, P2 polling/command, mote/Focus/ping, co-op menu, Together record, Duo save field, co-op level tag, sky thread, arithmetic assist, co-op solver, family telemetry, new dependency, or test-only co-op fixture. Plan 09 must not author even an “optional” P2 gate or companion dialogue. Plan 08 must not claim that two simultaneously assigned pads work merely because multiple pads enumerate.

Do not alter current content, sequence, tests, specifications, release scope, or acceptance criteria for speculative co-op. No implementation estimate in this document is a commitment.

### 17.5 Recommended timing and approval gates

**Exploratory recommendation — non-canon pending Human approval.** Wait until Plan 09 is integrated, accepted, and performance/control evidence is green. Then:

1. re-audit final authority, campaign, source, tests, save/progress, controls, assets, and performance;
2. ask the Human to approve only the placeholder prototype, named risky hypothesis, data collection, and temporary debug fixture;
3. run the one-dyad slice and make an integrity/agency decision;
4. if positive, run the six-family formative round; and
5. only then ask for a product-canon/production-roadmap decision.

This places the prototype immediately after the Plan 09 rebaseline and before any new campaign expansion or final companion art commitment. A negative result should close or substantially reframe Plan 10 without disturbing Plans 01–09.

## 18. Consolidated persistence, records, rewards, and accessibility policy

**Exploratory policy — non-canon pending Human approval.** Section 11 is normative; this table makes the release consequences auditable in one place.

| Concern | Proposed policy | Testable invariant |
|---|---|---|
| Solo default/parity | Solo remains the primary Begin/Continue and the complete ordinary/perfect experience for every authored/generated maze. | Removing all companion inputs/content never removes a valid route, reward, rescue, ending, or Hint. |
| Participation classification | `duoEverJoined` records a join; `togetherMeaningful` becomes sticky on the first accepted event in Section 11's fixed `recordableCompanionAction` enum. | Join-and-immediate-leave does not relabel a best; a recordable Together action cannot be relabelled Solo by leaving; observer judgment never changes a record. |
| Records | Equal side-by-side Solo and Together performance summaries by stable level/revision/rules version; future arithmetic mode has another rules version. | One lane never overwrites another; UI does not say assisted/invalid/lesser. |
| Completion/rewards | Same completion, unlocks, rescues, story, Gold/Science, normal stickers/badges/achievements; award once. Duo-only recognition is additive and never required. | Switching/joining cannot double-award or create a progression dependency. |
| Companion resources | Focus, motes, ping, target, cooldown, and coordinates are transient in recommended mode. Base Bag/resources remain Ame-owned. | Reload/P2 loss cannot lose or strand a required item or currency. |
| Active-run save/resume | Validate and resume the core run as Solo first; store only approved versioned participation metadata. Offer P2 rejoin. | Missing/unsupported companion state still yields a valid solo snapshot; no device/index/input is persisted. |
| Roles | Devices bind to logical roles transiently; safe role swap exchanges bindings, not world state. | Swap cannot move Ame, change camera position, duplicate an action, or change record/reward state. |
| Difficulty/hints | Safe Duo changes no maze values. Either may request attention; P1 alone opens/advances Hint. | Companion command cannot enter route search or spend/advance Hint state. |
| Accessibility truth | Text + icon/shape/pattern accompanies all essential state; analog has digital alternative; audio/haptics/motion/colour are optional. | Full, Reduced, and Static emit the same semantic state/event order and both roles remain operable without precision/timing. |
| Motor/cognitive access | Adjustable flight speed/deadzone, remapping seam, one-button context option, no mandatory hold/chord/rapid tap/hover/right-stick precision. | Digital-only and single-context-button test routes cover all required P2 actions. |
| Visual/auditory access | P2 never covers labels/Ame/object truth; TV-distance/200% text; per-seat prompts; optional sound/haptic; no colour-only owner/cooldown. | Automated/visual QA plus reduced/static family session finds no missing state or focus theft. |
| Disconnect/drop-out | P2 removal is immediate Solo; P1 removal pauses/rebinds; pause freezes both; reload starts with unassigned companion. | Every lifecycle checkpoint projects to a deterministic finishable core state. |

Touch-only two-human play, voice dependence, pointer lock, exclusive Duo progression, and mandatory real-time co-action are outside the first product promise.

## 19. Risks, rejected ideas, and rollback

### 19.1 Leading risks

| Risk | Early evidence | Mitigation / decision gate |
|---|---|---|
| Protected P2 role is still dull | Meaningful-action rate, idle gaps, role-choice/replay answers | Prototype before art; reject safe mode if bounded loops cannot create pride. |
| Companion work feels detached | Few P1 responses to motes/pings/Dazzle; “side game” language | Strengthen request/rendezvous/readiness, not critical permissions. Consider authored Twin Trails only after a new gate. |
| Adult quarterbacking | Directive/ignored-request/decision-owner tags | Rate-limit/personalize pings, make insight request-led, reframe onboarding, test role swap. |
| P1 camera punishes P2 | Clamp/dock count, P2 waiting, route changes solely for recovery | Tune flight speed/region/dock; compare Maplight/Twin Trails; never add camera tug. |
| Too many verbs for a young P2 | Repeated failures, inability to state job, unused abilities | Progressive reveal and one-button context; rollback to Co-Star Spark. |
| P2 overlays obscure puzzle truth | Occlusion, misidentification, TV-distance/static QA | Strict layer/density/safe-cell rules; per-verb visibility kill switch. |
| Input seat instability / double input | Reconnect, Steam virtual+physical, index order, menu-focus tests | Explicit neutral+A binding, runtime generation token, one provider/seat, P1 global authority. |
| Browser/Deck performance | frame/poll/render/event budgets on final matrix | Scene-local transform, fixed caps, no App render loop, asset ledger, disable flourish layers first. |
| Character/lore mismatch | Amelia/story/art review after mechanics pass | Character-neutral system contract; defer final identity; Sprig/Poggle/new original remain choices. |
| Together records feel punitive | Family wording/comprehension review | Equal lanes, shared progression, no lesser labels; no-action join remains Solo. |
| Optional Duo recognition makes Solo incomplete | Players treat album/glimmers as mastery | Session-only first; solo role parity if durable; never gate progress/perfect. |
| Plans 01–09 continue to move | post-Plan09 audit differs from this evidence | Rebaseline and invalidate obsolete assumptions before prototype approval. |

### 19.2 Explicitly rejected for minimum/recommended

1. Unrestricted collection of visible base items, even within the camera.
2. Direct collection into the shared Bag by P2.
3. Remote carrying/handoff of keys, weapons, potions, Boots, Leaf, treasure, rescues, or any required/base object.
4. Base treasure courier by default; it remains a route/reward and can hide optional bypass behind the word “optional.”
5. Permanent guardian reduction, unconditional `-1`, “damage,” or a temporary softening whose early defeat is permanent.
6. Hidden Courage/Power boost in the safe mode; any arithmetic version is separately named, recorded, saved, and solver-certified.
7. P2 revealing fog/topology, targeting historical off-camera cells during play, or automatically computing Hint routes.
8. Shared camera control, camera bias toward P2, split focus, or waiting for P2 before Ame can pan.
9. Two players steering Ame, two global menu pilots, or P2 destructive confirmation.
10. Shared keys/currency/Hint/Focus whose misuse can create blame or block the run.
11. Required P2 switches, timing gates, health/death, item loss, body blocking, or failure that stops Ame.
12. Splitting one physical controller between two people as a default, two-finger touch-as-two-humans, or mandatory pointer lock/capture.
13. Persisting Gamepad index/id/order; guessing unknown mappings; assigning on connection/drift; naive deduplication by ID.
14. Companion effects that rely on colour, sound, haptic, movement, precision hover, hold, chord, rapid tap, or a reaction window.
15. Copying a precedent's character, identity, language, look, level, or signature mechanic.
16. Adding speculative hooks, content, dependencies, assets, fields, tests, or acceptance requirements to Plans 01–09.

### 19.3 Rollback strategy

The safe architecture must make co-op a feature-flagged projection over untouched base authority. Rollback is ordered and recoverable:

1. disable individual flourish/audio/haptic/particle families;
2. disable Ready-Set-Giggle, then Dazzle/Focus while keeping courier/ping;
3. fall back from Miri's Wishwing Courier to Co-Star Spark;
4. remove persistent Together presentation while retaining shared completion data;
5. disable mid-maze join or mouse P2 if a platform-specific issue remains;
6. disable **Play together** entirely and resume every accepted active run as Solo; and
7. for Twin Trails, zero `assistCap`, release latches, project/sanitize core save, and fall back to safe Wishwing or Solo.

No rollback may delete or reinterpret a user's base completion, rescue, reward, or Solo record. If a material companion-only durable artifact is ever approved, its reader must tolerate disabled/unknown rules versions and preserve data for possible re-enable rather than silently corrupting it.

## 20. Explicit decisions required from Amelia and the Human

Nothing in this table is approved by writing this plan.

### 20.1 Amelia's experience and character questions

| Decision evidence needed from Amelia | Why her answer matters | Current exploratory default |
|---|---|---|
| Which role does she choose first, after a swap, and for another maze? | Direct evidence of role dignity/appeal. | Do not predict; let her choose without calling either role easier. |
| Which P2 actions felt like real help versus busywork? | Selects courier/ping/Dazzle/flourish mix. | Retain only actions she can describe as choices with visible results. |
| Did camera motion ever make the companion feel lost or rushed? | Determines whether flight survives. | Ame remains camera authority; change P2 recovery/model, not that rule. |
| Did a ping feel useful, bossy, confusing, or funny? | Controls dominance and communication. | One rate-limited semantic ping, P1 dismissible. |
| New girl wish-sprite, Sprig, Poggle magic, or another friend? What personality? | Shapes emotional ownership after mechanics pass. | Miri is a working placeholder only. |
| Which jokes, reactions, carry moment, and victory credit created pride? | Guides art/VFX/audio investment. | Fund final presentation only after the role passes. |

Amelia's preferences are crucial product evidence, but a delighted request to collect a key or weaken a guardian is not by itself rules approval; the Human must decide whether to create a separately explained mode with the documented trade-offs.

### 20.2 Human product/rules decisions

| Open decision requiring Human approval | Plan's exploratory recommendation | Consequence of a different choice |
|---|---|---|
| Approve any post-Plan09 prototype? | Approve only the placeholder Wishwing integrity slice after re-audit. | Without approval, Plan 10 remains a document and closes with no implementation. |
| Leading mode | Prototype Miri's Wishwing Courier; retain Co-Star and Twin Trails as rollback/future. | Another pitch needs its own rewritten gates and scope; scores are not canon. |
| Companion identity | Test neutral geometry first; select new original Miri-like direction versus Sprig/Poggle only after role evidence. | Existing character changes chronology/art dependency; new character adds story/model scope. |
| Base-object permission | None for minimum/recommended, including existing treasure and rescues. | Any relaxation requires allow-list/content audit; required/remote interaction requires separate rules/solver/save/records. |
| Guardian arithmetic | None in recommended; Dazzle equation only. | Courage/softening creates a distinct Duo ruleset, solver, save, record, UI, content-certificate, and difficulty promise. |
| Flight definition | Current camera + revealed, 0.20-tile inset; no LOS for visibility, separate LOS for spells; never reveals. | Historical/off-camera/LOS visibility changes role, Hint/fog grammar, and test surface. |
| Mid-maze join/leave | Join in safe free play; immediate return to Solo. | Boundary-only join is simpler but reduces couch delight; mandatory P2 is disallowed. |
| Role swapping | Home/maze boundary/safe pause, request + confirm + neutral. | No swap weakens family parity; live swap needs more state/presentation risk. |
| Records | Equal parallel Solo/Together lanes after the first accepted `recordableCompanionAction`; shared completion/rewards once. | Shared-only obscures different social pacing; punitive labels/reward reductions contradict the intended dignity. |
| Durable Duo collection | None initially; motes/Focus/session constellation only. | Durable album needs solo parity, migration, reset, reward, and completion-pressure review. |
| First-release PC/platform promise | Two standard pads plus keyboard-Ame/mouse-P2; qualify Deck/external and hybrid; no touch-only Duo. | Reducing configurations lowers scope; unknown mappings/touch need separate design, not guessing. |
| Join privacy/control | Optional per-run Open join/Invite only; P1 owns destructive/global UI. | Always-open can invite sibling grief; dual focus reintroduces menu fights. |
| The three architecture seams | Record as optional non-derailing advice only; accept only where free/cheap. | All are retrofittable after Plan 09; rejecting now delays but does not kill the concept. |
| Formative evidence threshold | One dyad can authorize only a six-family round; production needs a second Human gate. | Shipping from one delightful session would overclaim both family fit and platform robustness. |
| Ambitious future | Revisit Twin Trails only after safe prototype evidence identifies an unmet need. | Early authoring risks delaying the campaign and building optional content before role-market proof. |

## 21. Possible implementation sequence—only after approval and Plan 09

This is **not an implementation plan, estimate, commitment, or authorization**. It is the safest possible ordering if—and only if—Plan 09 is complete, the repository is re-audited, and the Human explicitly approves the next gate.

### Gate 0 — rebaseline and decision freeze

- Read the final gameplay, UI, art, VFX, lighting, animation, controls, save/progress/solver, performance, story, and 24-level authority.
- Re-run full tests and browser/controller/performance audits; replace obsolete current facts in a new approved spec, not by silently treating this exploration as canon.
- Human freezes the prototype pitch, exact permission envelope, configurations, telemetry/privacy, and stop conditions.

### Gate 1 — diagnostic input and scene proof

- Behind a disabled debug feature flag, prove two transient sources, explicit seats, neutral claims, per-context dispatch, one global UI pilot, measured MazeViewport transform, and scene-local placeholder motion.
- No P2 world action, record, save, asset, or campaign content yet.
- Stop if Plan 08 provider duplication, focus, or performance cannot meet the input matrix cleanly.

### Gate 2 — integrity-only placeholder slice

- Add the typed ephemeral companion reducer, camera/tether, join/leave/drop-out, overlay seed namespace, invariant digests, and base-object deny-by-construction.
- Build the debug-only Co-op Integrity Lab using existing mechanics/placeholders; no authored campaign modification or reward.
- Prove zero core/reveal mutation and solo finishability at every lifecycle checkpoint.

### Gate 3 — recommended risky interaction

- Add Wish Mote/carry/handoff/Focus, one ping, one harmless flourish, and Dazzle & Compare with exact equation and fixed-tick rules.
- Add only enough static/reduced feedback, prompts, and logging to make the test honest. Do not generate final character art.
- Run all mechanic traps and representative final mazes before involving a child.

### Gate 4 — Amelia-and-parent decision

- Run Section 16's 15–18 minute role-swap protocol.
- Integrity failure rejects the permission. Agency/camera/dominance failure revises the role or stops. Passing authorizes only the formative round.
- Record Amelia's character/fantasy preferences after mechanics questions.

### Gate 5 — six-family formative evidence

- Cover child/adult role directions, two children, two pads, keyboard/mouse, Deck/hybrid as available, and Reduced/Static/digital alternatives.
- Re-run thresholds and qualitative synthesis; validate that the role is understandable, desirable, non-shaming, and not dependent on one highly engaged parent.
- Human makes an explicit production/no-production/ambitious-research decision.

### Gate 6 — production specification, if approved

- Write a new canonical implementation specification that supersedes the approved parts of this exploration, with requirements/acceptance traceability and locked names/rules.
- Version persistence/record lanes/rewards; finalize menus/onboarding/accessibility; commission approved character/UI/VFX/animation/audio; allocate performance/asset budgets.
- Keep every feature independently kill-switchable and base-save-projection-safe.

### Gate 7 — implementation and qualification, if approved

- Implement minimum vertical slice first, then recommended verbs one at a time with invariant/property/lifecycle tests.
- Qualify all 24 authored levels, Surprise generation, ordinary/perfect solvers, saves/migrations, hints, rewards, controller matrices, web/Tauri, Steam Deck, performance, Full/Reduced/Static, keyboard/mouse, and role-swap/drop-out.
- Conduct final family/usability regression and Human release approval. Roll back any verb that fails without weakening the base permission boundary.

### Gate 8 — ambitious research, separately approved

- Only after released/sustained evidence shows the safe companion needs deeper shared puzzle work, write the Twin Trails rules/solver/save/content proposal.
- Prototype one optional graph with `assistCap = 0`; certify solo switch and arbitrary drop-out before any character/content expansion or Courage test.
- Treat it as a future expansion, never a patch hidden inside the recommended mode.

---

**End state of Plan 10:** one opinionated prototype recommendation, two bounded alternatives, explicit rejection/solver boundaries, and measurable Human decision gates—still exploratory and non-canon. Until a Human approves Gate 0/1 after Plan 09, the correct implementation action is **none**.
