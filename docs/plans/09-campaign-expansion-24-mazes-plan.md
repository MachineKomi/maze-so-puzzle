# Plan 09 — expand the authored campaign from 16 to 24 mazes

Status: manager-authored implementation plan; execute only after Plans 01–08 and both Plan-07 passes are accepted

Owner: root integration agent

Prepared: 2026-09-02

Current planning baseline: 16 authored story mazes at manager baseline commit `5eed837`

## 1. Outcome

Expand the campaign to 24 authored, story-backed mazes:

- four new chapters inserted at deliberate learning and pacing points inside the existing journey; and
- four new chapters after the current final maze, forming a short encore arc beyond the restored Star Map.

The expansion should feel like the game discovered more imagination, not merely more length. Each addition must be fair, legibly solvable, funny, educational, visually and aurally distinctive, rewarding to explore, and worth replaying. Later chapters become more puzzly through meaningful inference and combination while remaining safe, intuitive, and recoverable for Ame, with optional family help welcomed.

This plan is executed by the root manager only after the specialist systems are stable, because the new content must use their final gameplay, art, layout, lighting, VFX, animation, controller, persistence, and performance contracts.

## 2. Read-first execution gate

At execution time, do not assume the repository still resembles the planning baseline. Begin from a clean, reviewed, pushed checkpoint after Plan 07B and read in full:

1. `docs/GAME_VISION_AND_DESIGN_SPEC.md`.
2. `docs/plans/00-integrated-implementation-roadmap.md`.
3. This plan.
4. The final `docs/GAMEPLAY_DESIGN_SPEC.md`, `docs/STORY_BIBLE.md`, `docs/ART_BIBLE.md`, Ame model sheet, UI/UX spec, Lighting spec, VFX Bible, Controls/Steam Deck spec, Animation spec, and Performance Budgets.
5. Current `README.md`, `docs/ARCHITECTURE.md`, `docs/AI_ASSET_PROMPTS.md`, `docs/PROJECT_AUDIT.md`, and `docs/RELEASE_CHECKLIST.md`.
6. Current levels, story, engine, solver, progress, session, navigation, achievements, rewards, assets/catalogue, audio, presentation, UI, and tests.

Before authoring a tile, verify that the following predecessor gates really exist and pass:

- stable semantic object IDs and content fingerprints;
- versioned campaign ordering and historical-order migration;
- campaign-length-safe unlock/Continue/chapter display logic;
- engine-transition reachability and tier-4 hint replay;
- zero-rescue ordinary and exact-perfect solver modes;
- current gameplay/experience metric tooling;
- final art/theme/light/VFX/animation catalogues and their validators;
- shared browser/controller/performance scenario harnesses; and
- clean `npm run check` and `npm run check:desktop` results.

If one is missing, implement and validate that foundation as the first bounded phase. Do not work around it with row-number IDs, array-index patches, copied flood fill, or scattered literal `24` values.

## 3. Locked content constraints

These constraints derive from Human decisions and predecessor contracts.

- Preserve existing level IDs and earned durable results.
- Keep the established engine-rule vocabulary unless the Human explicitly approves a separate mechanic specification. Default: add no new engine mechanic.
- Keep equal-Power wins, harmless stronger guardians, reusable matching keys, Boots/Leaf traversal gates, complete straight Spring jumps, persistent portal pairs, optional rescues, and deterministic content.
- Every new maze passes ordinary zero-rescue and exact-all-rescue solver modes.
- Every reachable valid player state should remain completable where practical; any intentional exception requires a documented fairness proof, short safe recovery, and clear disclosure.
- No required blind choice, hidden irreversible trap, soft lock, resource grind, or fact available only in transient story copy.
- Absolute authored dimensions remain at or below 24×24. Prefer odd 11–23 topologies where they support the design; size is not difficulty.
- Event gaps should normally remain at or below 25 directional inputs, and neutral retraversal should normally remain at or below 15%. Exceeding either requires a named, tested reason.
- Optional rescue or curiosity branches should feel meaningful without implying ordinary completion is inadequate.
- Each maze uses final assets/effects intelligently and preserves non-colour, non-motion, reduced/static, controller, and accessible equivalents.
- No copyrighted reference is copied. All new story, layouts, names, combinations, and presentation are original to Puzzlewild.

## 4. Canonical 24-chapter order

Insertions are anchored after stable existing level IDs. Their provisional IDs and names may be refined during the Phase-0 final audit, but their positions and learning roles are adopted unless current integrated evidence demands a documented change.

| Final slot | Entry | Status / anchor | Campaign role |
|---:|---|---|---|
| 1 | `little-star-trail` | Existing | Movement, goal, optional kindness. |
| 2 | `shiny-sword` | Existing | Weapon, Power comparison, key/door, camera introduction. |
| 3 | `poggle-pocket-map` — **Poggle's Pocket Map** | **New; after `shiny-sword`** | Supported minimap/landmark application and short weapon/key recall. |
| 4 | `splashy-boots` | Existing | Plan/return, Power growth, Boots/water. |
| 5 | `rainbow-picnic` | Existing | Sorting paired requirements. |
| 6 | `toasty-toes` | Existing | Cause/effect and lava transfer. |
| 7 | `moonbeam-moat` | Existing | Decompose a three-lock task. |
| 8 | `starcake-switchback` — **Starcake Switchback** | **New; after `moonbeam-moat`** | Celebratory key/hazard consolidation with a meaningful order choice and treasure surprise. |
| 9 | `wishing-woods` | Existing | Persistence and a voluntary stronger-guardian return. |
| 10 | `ames-grand-parade` | Existing | Track a changing multi-part plan. |
| 11 | `springstep-sky-hollow` | Existing | Predict complete Spring-jump landings. |
| 12 | `cloudberry-bounce-garden` — **Cloudberry Bounce Garden** | **New; after `springstep-sky-hollow`** | Compact Spring-Boots transfer with varied, visible landing consequences. |
| 13 | `lanternlight-labyrinth` | Existing | Room/landmark exploration and map modelling. |
| 14 | `twilight-treasure-loop` | Existing | Relevant clue versus delightful optional discovery. |
| 15 | `moonlit-friendship-quest` | Existing | Poison/Leaf observation and combined recall. |
| 16 | `glowleaf-moon-garden` — **Glowleaf Moon Garden** | **New; after `moonlit-friendship-quest`** | Poison/Leaf recall and mixed-traversal bridge before portals. |
| 17 | `rose-heart-roundabout` | Existing | Introduce paired portals. |
| 18 | `clover-comeback-carnival` | Existing | Revise a plan across portal gardens. |
| 19 | `friendship-crown-vault` | Existing | Combine portal pairs and established tools. |
| 20 | `rainbow-power-parade` | Existing former finale | Restore the Star Map through a fair Power-sequence mastery puzzle. |
| 21 | `tiny-rainbow-homecoming` — **Tiny Rainbow Homecoming** | **New, appended** | Post-finale victory-lap/decompression with multiple valid routes and a tiny-rainbow consequence. |
| 22 | `somewhere-else-island` — **Somewhere Else Island** | **New, appended** | Poggle's “Useful for Somewhere Else” map; compact portal-hub revision puzzle. |
| 23 | `starlight-observatory` — **Starlight Observatory** | **New, appended** | Constellation/science theme, mixed inference, and rich optional discovery; Science is not spent or required. |
| 24 | `wishlight-festival` — **Wishlight Festival** | **New, appended** | Joyful complete-vocabulary capstone with several valid orderings, earned shortcuts, optional mastery branches, and the largest celebration. |

Names are original working titles. Final IDs, once any durable test/save artifact ships, are immutable.

## 5. New-level design briefs

Initial budgets are hypotheses to validate through the final metric tool and playtesting. Directional inputs include stationary interactions where the predecessor spec distinguishes them from movement steps.

| Slot | Size / ordinary-input starting band | Puzzle and education | Signature wonder / humour / replay | Asset and presentation opportunity |
|---:|---|---|---|---|
| 3 | 11–13 square; 30–55 | Use a revealed landmark and minimap to choose between two short routes; recall weapon/key relation without adding a rule. | The Pocket Map comically points to itself, then a discovered shortcut makes the map visibly “right.” Replay offers rescue versus shortest route. | Quiet bright theme, early friend pair, literal map flourish, small Poggle reaction, restrained first map-discovery cue. |
| 8 | 15–17 square; 70–105 | Sort two or three known requirements and choose a useful order around a readable hub. | A tempting star-cake/treasure branch is genuinely optional; its route later reconnects through an existing key/door or changed-state shortcut, while the treasure remains only a reward rather than the answer or trigger. | Celebratory terrain, varied key/door art, treasure/SFX spotlight, comedic Sprig payoff, different weapon/enemy/cage family from neighbours. |
| 12 | 17–19 square; 90–140 | Predict several complete Spring-jump landings with different consequences; no mid-air turn and no endurance corridor. | A four-way bounce garden reveals that the same central geometry answers two axes; optional landing produces a friend celebration. | Airy/light theme, clear hole silhouettes, jump VFX/animation showcase, boing sound variation, intentional diagonal authored light. |
| 16 | 17–19 square; 100–150 | Recall Antidote Leaf and mixed traversal, distinguish poison from water/lava, then prepare for portal reasoning through a changed return. | A moon garden appears to repeat until distinct glowleaf landmarks make the safe plan click; optional path reveals a funny nocturnal friend tableau. | Poison static/motion showcase, Leaf pickup, contrasting hazard sound/shape, moonlit material/light, calm pre-portal pacing. |
| 21 | 15–17 square; 80–120 | Decompression: several valid route orders, short callbacks, and a clearly optional perfect route. | Sprig's promised tiny rainbow changes the celebration/mood without undoing the victory. Replay invites an alternate ordering. | Broad friend/weapon/theme variety, warm homecoming music or reserved friendship cue if qualified, gentle rainbow VFX, rich reduced tableau. |
| 22 | 17–19 square; 110–160 | Revise a portal-hub plan when Poggle's map is genuinely for somewhere else; each return should change available understanding or access. | The map's “mistake” becomes the solution. At least one portal relationship is inferable before use and satisfying after. | Portal-family showcase, Poggle expressions, distinct hub landmarks, controlled effect flavors and controller-friendly focus/Hint. |
| 23 | 19–21 square; 130–185 | Use relevant clues and constellation-like spatial relationships across known tools. Science is thematic recognition only, never a price or gate. | Optional discoveries illuminate a visual constellation/observatory display while the ordinary route remains complete. | Science treasures, night/crystal materials, light-angle composition, music contrast, optional VFX constellation payoff with static equivalent. |
| 24 | 21–23 square; 160–220 | Complete-vocabulary capstone with 3–4 meaningful route orders, visible prerequisites, earned shortcuts, and a fair final synthesis. | The player can explain several plans, choose one, see the world respond, and receive a character-led festival finale. Perfect rescue is an optional mastery route. | Curated best-of catalogue without motif soup, final Ame/friend/emotion frames, varied encounters, authored light, full VFX/audio tier, controller couch readability. |

## 6. Per-level required design packet

Before implementing each map, create a compact design packet in the gameplay/campaign spec or a generated review artifact containing:

1. Stable ID, content revision, insertion anchor, dimensions, story role, Puzzle Power, and one-sentence puzzle intent.
2. A route sketch showing start, exit, required gates/answers, changed-state shortcuts, optional rescue/reward branches, and major first reveals.
3. Mechanic lifecycle: question, supported answer, unaided recall, combination/mastery.
4. Ordinary zero-rescue and exact-perfect route summaries replayed through the engine.
5. Reasoning score, friction score, event gap, effective decisions, search expansion, prerequisite depth, false leads, total/neutral retraversal, clue lead, and per-rescue marginal cost.
6. Legible-solvability proof: required clues, progressive Hint route, recovery from representative and exhaustive reachable states where feasible, and any fairness exception.
7. Experience beat: signature surprise, aha, joke, optional curiosity, emotional reward, and healthy replay reason.
8. Final catalogue plan: terrain, weapon, enemy personalities/Power tiers, cages/friends, treasure, hazards, portal pairs, authored lighting, VFX flavors, animation/emotions, SFX, and music.
9. Static/reduced-motion and non-colour alternatives.
10. Neighbour comparison proving the chapter is not accidentally near-identical in mood, asset family, route grammar, or payoff.

Do not approve a map solely from ASCII appearance, route length, or one solver pass.

## 7. Campaign curve and pacing

The 24-level curve should breathe rather than rise monotonically by map size or move count.

- Chapters 1–3 establish movement, rules, map, and landmark confidence.
- Chapters 4–8 turn familiar tools into short planning/sorting loops and a celebratory consolidation.
- Chapters 9–12 develop perseverance, tracking, and precise Spring-jump prediction.
- Chapters 13–16 deepen map reasoning, clue relevance, poison observation, and mixed-rule recall.
- Chapters 17–20 teach, practise, combine, and master portals/Power sequencing.
- Chapters 21–24 decompress, reopen curiosity, then build toward a sophisticated but fair encore capstone.

Use difficulty alternation: a demanding chapter should often be followed by a shorter playful transfer or discovery chapter. Later difficulty increases decisions, prerequisite relationships, order flexibility, and synthesis. Do not increase every dimension at once.

Every chapter must include one quiet-enough planning interval around its important clue and one release/payoff. Avoid placing maximum visual effect, dense objective text, new rule, five rescue choices, and complicated map topology in the same first reveal.

## 8. Narrative and educational expansion

Update the Story Bible from 16 to 24 entries. Each new chapter retains the established compact read-together contract:

- two intro paragraphs, approximately 35–80 words together where practical;
- one speaker and an original funny quotation;
- one plainly named Puzzle Power;
- one optional child/adult `tryThis` prompt; and
- one warm, funny, or wondrous victory outro.

Renumber all existing entries from canonical order or derive display numbering so it cannot drift. Preserve each existing chapter's emotional meaning while updating transitions where an insertion changes adjacency.

The current `rainbow-power-parade` conclusion remains a real victory: the Star Map becomes whole. Its revised outro may reveal a gentle new possibility—a path of tiny rainbow light continuing beyond the map—but must not say the restoration failed or add another “last knot.”

Chapters 21–24 form an **Elsewhere Encore**:

1. celebrate the restored Puzzlewild;
2. discover that Poggle's “Useful for Somewhere Else” map is useful after all;
3. explore an observatory/constellation theme that honours curiosity without spending Science; and
4. host a Wishlight Festival whose final challenge demonstrates Ame's full Pathkeeper confidence.

Future-hook weather ideas may appear as story dressing or VFX only. Do not introduce ice, wind-arrow, cloud-bridge, or friend-ability engine mechanics without a separate approved spec and solver design.

## 9. Persistence, unlock, and returning-player migration

Campaign expansion must be ID- and revision-based.

### Fresh profiles

- Unlock from Chapter 1 in canonical order.
- Each normal authored completion unlocks the next canonical entry under the shared campaign-order contract.
- Continue chooses the appropriate earliest/current next story entry without a hard-coded campaign count.

### Existing partial profiles

- Preserve every existing completion, best record, perfect flag, rescue record, achievement, currency, species total, and active run by stable ID/revision rules.
- Preserve access to every original level already unlocked before migration.
- Unlock an inserted level when its stable predecessor anchor was completed or already passed under the historical order; never relock a previously available original level behind it.
- Make newly inserted entries visible as new rather than falsely completed.
- Resume a valid active run first. Otherwise preserve the profile's pre-migration next original chapter as Continue, and keep advancing through its already-reached historical arc rather than unexpectedly sending the family backwards to an insertion.
- Passed-anchor insertions remain unlocked, visibly New side adventures in Select/Book and never block that returning profile's original forward progression. After the former finale is completed, Continue flows to Chapter 21; the player may choose an inserted adventure at any time.

### Existing profiles that completed the former 16-level campaign

- Unlock all four inserted adventures and Chapter 21 immediately.
- Prefer Continue into Chapter 21 so the player's completed finale flows forward; mark the four inserted entries as clearly available new adventures in Maze Select/Book.
- Chapters 22–24 unlock normally from the encore arc.
- Preserve the old finale completion and all perfect/achievement records; do not manufacture completion for new IDs.

Add migration tests for every historical schema/order, fresh/partial/full completion, record-less legacy saves, inconsistent ordinal data, active run on every original region of the campaign, tester runs, and rollback. Version rollback must fail safe without reinterpreting one level/object as another.

Audit achievement meaning. Preserve existing badge IDs and earned state. If a “20 mazes” achievement changes from mixed activity to story-only reachability, document and approve the new description. Add a 24-chapter recognition only if the final art/reward system can do so coherently without pressure or an improvised placeholder.

## 10. Intelligent asset, sound, and effect use

The expansion should primarily showcase the final catalogue rather than demand eight bespoke asset sets.

- Generate a campaign adjacency report for terrain, weapon, enemy family, cage, friend species, hazard combination, portal use, light bearing, VFX flavor, music, and signature presentation.
- Avoid accidental same-family repetition in consecutive levels unless it is an intentional teaching comparison.
- Every active catalogue family should have a meaningful opportunity across 24 chapters, but never place an asset solely to satisfy coverage.
- Select music by pacing and emotional arc. Do not reuse the same track in an authored fixed pattern if the current music system intentionally shuffles; instead specify mood pools/cues within its final contract.
- Use the final animation tranche for authored emotional beats only where a registered pose exists. Unknown content falls back gracefully to static art.
- Treat the reserved friendship cue deliberately: qualify it for a fitting homecoming/rescue moment or leave/remove it through the final audio/performance decision; do not drift between “reserved” and “orphan.”
- Add a source/provenance record for any genuinely new art/audio. Do not create runtime-only assets.

## 11. Implementation phases

### Phase 0 — integrated audit and design freeze

- Rebaseline current campaign order, metrics, story, asset pacing, controller flow, Book capacity, and performance.
- Confirm all predecessor contracts and fix missing foundations first.
- Produce all eight design packets and a 24-row campaign experience/asset matrix before code maps.
- Review provisional names/IDs once; freeze IDs before any persisted/tested build.

Exit: design packets meet this plan and the current gameplay spec; no topology has changed.

### Phase 1 — campaign order and migration

- Add/finalize eight stable entries and versioned canonical order without maps going live to normal users until migration tests pass.
- Update progression, navigation, chapter display, reward tiers, records, active-run validation, tester discovery, and returning-player behaviour.
- Remove count literals that should derive from the canonical order.

Exit: full migration matrix passes with placeholder/test definitions behind a development boundary; no record/access loss.

### Phase 2 — four inserted chapters

- Implement slots 3, 8, 12, and 16 one at a time.
- For each: structural validation, ordinary/perfect/current-state Hint solver, metric delta, story, asset/light/effect selection, static/reduced mode, and neighbour comparison.
- Run formative child/family and controller/UI checks after each pair; adjust the smallest relevant design issue.

Exit: all four integrate without flattening adjacent chapters or relocking returning players.

### Phase 3 — four Elsewhere Encore chapters

- Implement slots 21–24 sequentially, validating the arc before increasing capstone complexity.
- Preserve Chapter 20's full payoff and ensure Chapter 21 feels like a welcome encore.
- Keep Science thematic/non-consumptive and use only approved mechanics.

Exit: 21–24 form a coherent curve; Chapter 24 has multiple fair orderings and optional mastery rather than a single endurance corridor.

### Phase 4 — story, UI, rewards, and catalogue integration

- Finalize all 24 Story entries, Book/Select/victory/Continue copy, numbering, unlock markers, record cards, badges, and help.
- Ensure 24 cards perform and controller-scroll correctly at TV, desktop, tablet, and phone sizes.
- Apply final authored light bearings, VFX flavors, music opportunities, registered animations, and accessible/static variants.

Exit: no placeholder copy/art/ID, false finale language, missing glyph, asset adjacency accident, or unsupported animation reference.

### Phase 5 — full validation, performance, and release authority

- Run all solver/migration/engine/story/catalogue/unit checks.
- Run every story maze in the shared browser scenario harness plus representative actual play paths, all modals, Book/Select, full/reduced MotionMode crossed with forced static quality/fallback, Normal/Big, and all input sources.
- Re-run relevant Plan-07 performance, asset/package, 24-card Book, Tauri, and Steam Deck/TV matrices; keep unavailable hardware honestly pending.
- Update all source-of-truth and release documents, version/changelog if the project uses them, and final artifact provenance.

Exit: the complete 24-maze candidate passes the Definition of Done below.

## 12. Expected implementation surface

Resolve exact paths at execution time. Likely owned changes include:

- `src/game/levels.ts` and adjacent level-definition/content tooling;
- level validation, solver, route metrics, reachability/hint, and campaign-report tests;
- `src/story.ts` and story tests;
- `src/progress.ts`, `src/session.ts`, `src/navigation.ts`, achievements/rewards, migrations, and tests;
- Maze Select, Adventure Book, Continue, victory, tester, and relevant UI view models/components;
- art/theme/light/VFX/animation/music selection metadata through existing typed catalogues;
- shared browser/controller/performance scenarios and fixtures;
- `docs/GAMEPLAY_DESIGN_SPEC.md`, `docs/STORY_BIBLE.md`, `docs/ARCHITECTURE.md`, README, project audit, release checklist, changelog/version documentation, and asset provenance if new media is added.

Do not put campaign ordering, story identity, or unlock truth in CSS or filename inference.

## 13. Validation matrix

### Automated

- Exactly 24 unique stable campaign IDs in the canonical order.
- Exactly one complete Story entry per campaign ID, with derived/correct chapter order and all compact-copy fields.
- Structural validation and absolute-size bounds for every map.
- Ordinary zero-rescue and exact-all-rescue solution for every authored level.
- Tier-4 current-state Hint route replays through the engine across representative and exhaustive feasible states, including portals and one/two/three-hole jumps.
- No soft lock or undisclosed irreversible state in reachable-state fixtures.
- Per-level metric budgets and documented exceptions.
- Campaign adjacency/asset coverage, no missing typed catalogue entry, intentional authored light, and no unapproved consecutive sameness.
- Fresh/partial/full/legacy/inconsistent/active-run campaign-order migrations.
- Continue, Next, Book totals, Maze Select, achievements, reward bands, tester isolation, and reset allow-list use canonical order/count.
- Static/reduced/full presentation and asset availability.
- Full project, desktop, art, performance, package, and documentation-link gates.

### Manual and family play

- At least one fresh-profile continuous curve sample and focused sessions for all eight new levels.
- Ame-and-parent co-play as a primary qualitative reference, with broader child/accessibility checks where available.
- Record goal comprehension, required/optional understanding, predictions, aha, confusion, blocker recovery, Hint tier, parental nudge/takeover, fun/difficulty/pride, surprise, laughter, favourite beat, voluntary replay, and desire to continue.
- Verify no new level's memorable quality depends solely on reading, hue, motion, sound, haptics, or a large display.
- Verify controller-only navigation across all 24 records and every new chapter flow.
- Verify actual-size art, minimap clues, objective fit, and Bag/friend maximum states at the common viewport matrix.

## 14. Risks and rollback

| Risk | Prevention | Rollback |
|---|---|---|
| Insertions corrupt ordinal saves or relock content | Historical-order migration, stable IDs, full matrix before live order | Disable new campaign revision; retain backward reader and original order. |
| New chapters flatten onboarding or difficulty | Neighbour comparison, mechanic lifecycle, alternating curve, family play | Remove/rework one entry behind campaign revision; never renumber surviving IDs. |
| More length replaces more thought | Reasoning/friction metrics and strict event/retraversal bands | Redesign topology; do not merely lower a numeric target. |
| Former finale feels invalidated | Preserve restoration, frame 21–24 as encore/new path | Revert transition copy/arc without altering completed record. |
| Fully complete players are sent backwards unexpectedly | Continue to Chapter 21; explicitly mark inserted adventures New | Revert selection policy while retaining unlock access. |
| Asset/VFX variety becomes clutter | One signature beat, adjacency matrix, quiet planning interval | Reduce accents/effects, not semantic clue or whole level. |
| New assets exceed media budget | Reuse final catalogue, source-first pipeline, measured exception | Catalogue pointer rollback and remove only proven unreferenced derivative. |
| 24-card UI or solver regresses performance | Shared harness, virtualization/lazy decode only if measured, stable fixtures | Optimize presentation/search without hiding content or changing rules. |
| Capstone becomes another corridor marathon | Multiple orderings, shortcuts, event-gap/decision budgets | Replace topology while preserving stable level ID through content revision. |

Every map revision has a content version. A rollback preserves durable accomplishments and never maps old object state onto a different same-kind object by position.

## 15. Definition of done

Plan 09 is complete only when:

1. the canonical campaign contains exactly 24 stable story entries in the adopted four-insert/four-append structure;
2. all previous completions, records, rewards, unlock access, achievements, currencies, rescues, and valid active runs migrate safely;
3. all 24 mazes pass zero-rescue ordinary, exact-perfect, legible-solvability, Hint replay, and approved route-quality gates;
4. each new maze has a distinct educational habit, fair aha, signature wonder beat, joke/payoff, optional discovery, and healthy replay reason;
5. the former finale remains a complete victory and the four-chapter Elsewhere Encore ends with a joyful, fair capstone;
6. final art, audio, lighting, VFX, animation, minimap, UI, controller, accessibility, reduced/static, and performance contracts are used coherently;
7. the 24-card Book/Select/Continue/victory flow works across the full viewport and input matrix;
8. full web and desktop checks pass, relevant Tauri/package/performance evidence is refreshed, and unavailable physical hardware checks are plainly labelled;
9. Story Bible, Gameplay spec, Architecture, README, audit, release, changelog/version, and any asset provenance all match the shipped source; and
10. the reviewed final commit is pushed and recoverable, with no temporary evidence, placeholder IDs, stale compatibility route, or unrelated change left behind.
