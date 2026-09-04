# Project audit

Audit date: 2026-09-04
Audited build: 0.20.0 FP-ART-OST web/Windows playable preview
Plan 03 publication update: 2026-09-04

This is a housekeeping snapshot for the current playable prototype. It records
what was actually checked, separates product choices from defects, and keeps the
remaining work ordered by risk. It is not a substitute for clean-machine and
real-device testing. On 2026-09-04 the integrated 0.20.0 suite passed 423 tests
across 38 files plus strict TypeScript and the Vite production build; art,
performance-contract and locked desktop checks also passed. Browser QA covered
the approved front door, contextual OST requests and recoverable completion
flow without console errors. Unsigned 0.20.0 portable and setup artifacts were
built and byte-verified, and the portable executable passed a responsive
six-second launch smoke in an isolated preview data namespace. Physical-device
touch/listening/feel, clean-machine installation, signing, qualified low-end
performance and the broader manual walkthrough remain open. Older sections are
kept as clearly labelled historical evidence.

Pass 07A measured product baseline commit
`a34de2f783d2f11c2b543541b4f46ffdf8b13fe0`. It reproduces the 0.19.0 static
bundle/asset totals, records per-file hashes and decoded-image concerns, defines
semantic S01–S11 fixtures, adds report validation and an allocation ledger, and
gates unallocated compressed JS/CSS or public-runtime growth. A five-run Edge
production-preview cohort was completed but is explicitly contaminated and
report-only because the active work session prevented a clean-host attestation.
The audit rejected the first S04 row because its route prelude did not reach the
claimed solver state. A fresh five-run manager cohort now verifies exact
semantic position, steps 18→26, and 529 minimap tiles in every S04 sample. The
Tauri row is inventory-only with zero timing samples and remains pending. Its
launch helper is explicitly a native-window proxy, not WebView-visible or
interactive evidence.
No production optimization or media change is claimed. Exact evidence classes
and remaining hardware gates are in `PERFORMANCE_BUDGETS.md`.

## Plan 03-R1 front-door and premium-utility publication

Human decision v9 promotes exactly the reviewed seven premium navigation
stickers, environment-only title background, Home Splash B, controlled exact
wordmark and Ame-face icon. The 12-file Web map and 19-file platform-icon set
are recorded at
`source-assets/publication/mgjrpg-02-plan03-r1-runtime-map.json`. Navigation,
title background, Web favicon and Tauri icon pointers are active; the layered
home hero and 1024/512 wordmarks are dormant, unpreloaded Plan-01 consumers.
Every prior file remains present for rollback and eight newly superseded paths
enter the retirement ledger with zero Plan-12 eligibility.

The R1 runtime set adds 1,708,073 encoded public bytes and 14,636,960 decoded
RGBA bytes as a non-concurrent upper-bound sum. A named allocation covers that
growth and +845 gzip-9 JavaScript bytes. The shared inventory also reports the
separate in-progress OST relocation; that unrelated growth is neither assigned
to art nor treated as a clean R1 baseline.

## Plan 03-R2 home composition publication

Human decision v10 promotes the exact generated Logo B and larger-tea-skeleton
Home Splash v02 through deterministic green-matte extraction. The existing
combined title/home route now uses the illustrated `Maze so Puzzle` wordmark
and transparent bottom-right hero over the active environment without the
former cream overlay. Redundant eyebrow/subtitle copy is removed; the exact
screen-reader heading remains.

R2 adds three versioned runtime files / 1,527,888 encoded bytes / 6,641,664
decoded bytes as a non-concurrent upper-bound sum. Hero v01 and both controlled
logo v05 sizes remain rollback holds. No generative transparency output, old
asset deletion, new route, or gameplay change is included.

## Current Plan 03 static-art publication

On 2026-09-04 the Human closed the art-review and completeness gates and
directed publication of the latest approved production masters without
regenerating alternatives or reopening unchanged art decisions. The
forward-only decision is
`source-assets/calibrations/mgjrpg-02/v06/human-decision.json`; it hash-binds
the explicit 144-row runtime map at
`source-assets/publication/mgjrpg-02-plan03-runtime-map.json`. One hundred rows
are active and 44 are dormant catalogue-only art. Dormant entries add no
gameplay, placement, preload, animation, or progress behavior.

Every selected source is joined by exact generation run ID to one new
no-overwrite runtime derivative and strict-v2 source record. The measured
per-file hashes, dimensions, alpha state, encoder facts, and totals are in
`source-assets/publication/mgjrpg-02-plan03-publication-report.json`; the
publisher's separate non-writing check rebuilds and byte-compares all selected
derivatives. The generated runtime projection is
`../src/generated/mgjrpg02Art.ts`. The general manifest remains generated
rather than hand-edited. The separate technical
project-publication provenance review is
`source-assets/reviews/mgjrpg-02-rights-provenance-v01.json`; it expressly is
not external legal advice, trademark clearance, or a public-label/rating
decision.

The publication map replaces 100 prior runtime art authorities. Their exact
files remain in place and their former source records are marked superseded;
all enter `source-assets/retirement/asset-retirement-ledger.json` as
`rollback-hold`, with no Plan 12 eligibility. Together with 16 earlier orphan
candidates, the ledger now holds 116 files / 37,066,556 encoded bytes /
168,329,216 decoded-RGBA bytes. No file is deleted or moved. Rollback means
restoring catalogue pointers and the one-way semantic resolver, not rewriting
prompt history or discarding the approved sources.

The semantic publication boundaries are explicit. `green-tea-skeleton` is a
dormant rescue-and-collect friend and never an enemy. `bubble-ring-blade`
replaces the misleading Bubble Bow weapon identity, while a one-way historical
alias preserves old saved content; this art-semantic rename does not change the
gameplay fingerprint or authored content revision. The approved Batch 15 Normal
Boots source is published as the current `splash-boots` pickup and replaces the
old boots delivery rather than creating a second dormant footwear family.
Violet Moon remains the active third portal pair, while Sunny Diamond and
Violet Spade Bloom are dormant. The platform app icon and every Batch 21 title,
home, and generated
logo study remain source-only for Plan 11; generated lettering is not wordmark
authority. Batch 22's 15 selected premium achievement stickers use 256 px
transparent WebP delivery, while their smaller PNGs remain proof-only.

The final derivative set measures 9,366,734 encoded bytes and 107,937,792
decoded-RGBA bytes as an all-files upper bound. Active rows account for
7,068,346 / 92,471,296 bytes; dormant rows account for 2,298,388 / 15,466,496
bytes. Relative to exact turn-start commit `0fce054`, runtime image count moves
125 → 269, encoded image bytes 39,173,427 → 48,540,161, theoretical decoded
bytes 183,011,232 → 290,949,024, and dist 144 / 89,932,709 → 288 /
99,373,682. The scoped allocation and clean-tree comparison are in
`PERFORMANCE_BUDGETS.md`.

The audit caught one pre-commit processing defect rather than accepting its
pixels: four sparse dressing overlays had been flattened by an RGB-only terrain
helper. Their rejected hashes and the bounded RGBA-preserving correction are in
`source-assets/publication/mgjrpg-02-plan03-transparent-dressing-defect.json`.
All four corrected derivatives have nontrivial straight alpha and clear seam
gutters; approved source art was not redesigned. The report also names 56
non-Ame actor rows whose semantic face/eye/ground landmarks remain deliberately
unfabricated. They are safe for the registered static catalogue and live review,
but Plan 05 animation and automated cage-face masking must add manual landmark
authority first.

Production-preview inspection is recorded in
`source-assets/publication/mgjrpg-02-plan03-visual-integration-report.json`.
Ten actual-size captures cover 1920 × 1080 TV-class, 1280 × 720 desktop,
1194 × 834 and 1024 × 768 tablet, 844 × 390 compact phone, and the supported
568 × 320 minimum landscape presentation. A normal non-tester six-step finish
also exercised the live completion reward, then verified My First Maze and
Twinkle Toes as mixed earned/locked Adventure Book identities. Sampled live
mazes and the scrolled Book showed zero visible broken images, legacy art URLs,
or browser warning/error entries. A separate HTTP exercise returned 200 for
every one of the 144 versioned runtime-map URLs and exactly 9,366,734 bytes. The publisher's
temporary rebuild is byte-identical for all 144 outputs, and the focused
lifecycle contract reconciles the 116-item ledger with the manifest and proves
that no held file was moved, deleted, made reachable, or placed under a live
public archive.

The exact candidate passed `npm run check` with 407/407 tests across 35 files,
strict TypeScript, and the production build; it also passed the shared
performance contract, locked desktop compilation, and a no-bundle release
build. The release executable stayed responsive and was inspected in Rose Heart
Roundabout with the published Ame, portal, cage, science pickup, terrain, and
navigation/sound art. An earlier full-suite attempt made during cold Rust/linker
compilation exceeded four fixed gameplay-solver timeouts; the same generator
case reproduced in the untouched starting commit under contention, and all
affected files passed after that load ended. This chronology is retained in the
validation report instead of being mistaken for an art regression.

## Historical Plan 03 art foundation: identity approved, rendering gate open

This section is retained verbatim as the 2026-09-03 pre-publication audit.
Words such as “current,” “pending,” and “open” below describe that checkpoint
and are superseded by the 2026-09-04 publication record above.

This implementation began from accepted Plan 06 checkpoint
`ee176f52ab79e08e818fc919f44b7723f9fc9865`. It does not revise the historical
release evidence below. A concurrent doc-only playtest commit advanced `main`
to `ab20f28372c93e341b13e3cf2d2c94ea71703bb2` during final evidence capture;
the runtime tree is identical between those commits and those playtest files
remain outside Plan 03. On 2026-09-03 the Human approved Candidate C as the
canonical static Ame v02 design direction. It remains source/proof-only: the
active runtime continues to use `/assets/ame.png` and no public art byte changed.
Runtime promotion, live proof, the separate licence/rights review and remaining
Plan 03 family gates are still open.

On 2026-09-03 the Human additionally supplied the private PPBA pre-production
specification as a craft reference. Its current authority was inspected at
`dacc8cf644d24d56aae34ba757efb4fac5f9d341`; the exact source set and
adopt/adapt/reject boundary are recorded in
`research/2026-09-03-ppba-art-craft-synthesis.md`. The Art Bible, Plan 03,
prompt authority, Ame model sheet, game vision, and roadmap now describe a
proposed `mgjrpg-02` canary calibration. The PPBA craft transfer imported no
asset or prompt and changed no Maze pixels or runtime. A contemporaneous
Candidate C approval-state reconciliation updated metadata, schema, validation,
proof-generation, source-record, and manifest contracts only; no `public/`
asset, catalogue pointer, runtime byte, or package content changed. Broad
production remains blocked on the consolidated canary decision.

The Human then explicitly directed Maze to adopt PPBA's colour-aware contour
*craft* within the proposed `mgjrpg-02` /
`storybook-local-contour-v1` profile. Stable contour sections now derive from
their nearest enclosed Maze material, darken/richen through Maze's deep-plum
family, and reserve darkest ink for facial, occlusion, critical-separation, or
accessibility need. Uniform black perimeters, pixel-level rainbow switching,
halos, and muddy pale edges fail. Field cutouts receive no cream sticker edge;
semantic UI/reward signals may; terrain/hazards use material boundaries and
seams without enclosing actor contours. No PPBA pixel, prompt, palette, motif,
layout, identity, brand, or runtime dependency was imported.

The Human rejected the v08 comparison as meaningful style-choice evidence on
2026-09-03. It is retained truthfully as a deterministic demonstration of the
discarded post-process approach: its treatment left historical interiors
substantially unchanged and its added contours read nearly black at delivery
size. That rejection does not reopen Candidate C's approved identity. The v11
packet then compared three independently authored rendering directions: A —
Luminous Storybook Cel, B — Soft Jewel Gouache, and C — Chunky Enamel Adventure.
The Human narrowed those options to A for most core/current-family sprites, C
for the traditional slime, sword lizard man, and green-tea-drinking skeleton,
and B concepts for future enemies except the A wholesome succubus. Future-enemy
production must transfer those concepts into A's chunky clarity, high chroma,
and material-local linework with restrained B colour/shading influence. Paired
teleporters retain their top-down flower-petal floor-pad category rather than an
upright portal-door design.

For Ame, the Human preferred Direction B but requested one fresh, non-edit base
because its source-size surface showed subtle accumulated AI-edit texture; the
prior B candidate was explicitly allowed as fallback. The bounded v14 packet
contains two independent fresh studies, neither derived from prior B or from the
other. Both drift Candidate C's locked construction, so the current
art-direction recommendation is to retain prior Direction B pending explicit
Human confirmation. The v14 future-enemy hybrid is direction evidence pending
simplification, and the flower-pad hybrid confirms category while requiring a
quieter, shallower production pass. All remain source/proof-only.

Candidate C's approved face, age, golden-blonde shoulder-length layered hair, blue
eyes, proportions, costume, backpack, pose, silhouette, registration, and
emotional identity are not under reconsideration. The current work is a
source-only surface calibration. The active Ame pointer and every other runtime
art URL remain unchanged, no old asset is retired, and the intended public and
decoded-runtime byte delta for this gate is zero.

| Area | Current evidence | Status |
| --- | --- | --- |
| Visual authority | `ART_BIBLE.md`, `characters/AME_MODEL_SHEET.md`, plus the PPBA craft-synthesis record | Original magical-girl JRPG grammar, static-family standards, golden-blonde/blue-eye Ame invariants, Maze-native colour-aware contour tokens and delivered-size widths, registration, optical-size, lighting/animation/performance handoffs, and approval rules are explicit |
| Catalogue contract | Backwards-compatible rich metadata in `src/artCatalog.ts`; one object-identical authority per lock pair | Current IDs, URLs, defaults, preload membership, and gameplay fingerprints remain unchanged; Ame v01, lock motifs, hazard cues, geometry, source IDs, and versions are test-covered |
| Provenance | 126 schema-validated records plus deterministic `docs/source-assets/manifest.json` | 125 historical runtime records and one source-only Ame v02 record awaiting runtime-publish/rights approval keep runtime, source, and release approval independent; Candidate C's design approval is recorded in the model sheet and game authority without inventing unknown dates, prompts, tools, seeds, or rights |
| Pipeline | Pinned Pillow/jsonschema requirements; immutable-source preflight; named extraction/registration profiles; no-overwrite derivatives; deterministic proofs | Candidate C builds are source-only, WebP lossless, budgeted, hash-verified, and reproducible; a second build refuses overwrite rather than silently replacing evidence |
| Visual canaries | v08 rejected-decision evidence, v11 authored A/B/C narrowing evidence, and the bounded source-only `v14` response packet | v08 is not an art authority. v11 records the Human's family-specific recipe. v14 compares prior Direction B Ame against two fresh independent attempts, plus an enemy-family hybrid and flower-floor-pad category study; it is pending Human and contains no production master. |
| Runtime/performance | Shared Plan 07A inventory and feature allocation | Public runtime remains 89,394,012 B and catalog assets remain 139 / 89,330,098 B; source masters and ignored proofs add zero decoded runtime image memory |
| Human gate | Separate identity, v11 narrowing, and v14 bounded-response evidence in `characters/AME_MODEL_SHEET.md` and the versioned review record | Candidate C identity/construction approved 2026-09-03 and remains locked. The recommended prior-B Ame fallback and narrowed family recipe still require explicit rendering-gate confirmation; runtime catalogue acceptance, broad family production, rights review, asset retirement and Plan 01 remain gated. |

Earlier pre-v14 gate evidence was 51/51 art-pipeline tests, 23/23 focused catalogue/asset
tests, 400/400 integrated tests across 34 files plus production build, locked
desktop compile, periodic terrain/dressing checks, four performance scenario
fixtures, and the shared deterministic budget check. The first full-suite run
was rejected after three solver tests timed out under concurrent build/server
load; all 397 completed assertions passed, the isolated files passed, and the
uncontended exact rerun passed in full. `art:check` reports zero errors and 398
explicit warnings: 374 suppressed legacy-gap/pending-rights warnings, 18 existing
alpha-border findings, three unreferenced Phase-2 sources, one recovered-v01
exact-prompt gap, one honest limitation on full semantic catalogue-to-record
cross-validation, and one deliberate `mgjrpg-02` Human-gate warning.
Those results remain predecessor evidence; they neither validate nor approve
the current `v14` rendering recommendation.

The v11 evidence remains separate: 12 immutable generator originals plus one
seven-source deterministic comparison layout, exact prompt/run bindings, a
34-file proof index, 60/60 art-pipeline tests, and `art:check` with zero errors
and the same 398 disclosed warnings. The source set adds 22,908,808 encoded
bytes and a 75,489,608-byte decoded upper bound to tracked production evidence;
the ignored proof packet adds 7,025,018 encoded bytes. Public/runtime and
catalogue-pointer deltas remain exactly zero. These checks make the choice
auditable; they do not select a direction, approve opaque concept-board alpha,
prove terrain periodicity, or authorise broad production.

Current v14 evidence adds four immutable generator originals totaling 6,440,962
encoded bytes and a 25,160,256-byte decoded-RGBA upper bound. Its ignored packet
contains 48 hash-bound proof files plus its deterministic index, totaling
8,847,297 encoded bytes; proof PNGs have a 62,134,064-byte decoded upper bound.
The v14 selection and full art-pipeline suites pass 8/8 and 68/68 respectively;
the recursive packet validator reports zero errors and the in-app browser loads
all 36 packet images at 1280 x 720 without overflow or console diagnostics.
These figures are source/review cost only. The v14 runtime asset count, active
catalogue pointers, transfer bytes, and decoded runtime image residency all
change by exactly zero. Evidence integrity does not imply Human approval.

The final shared-tree check also preserves unrelated concurrent evidence
honestly: focused catalogue/assets tests pass 23/23, the production build and
locked desktop compile pass, while `npm run check` stops at 399/400 because the
OST transition still references 13 deleted root-level MP3 paths. Performance
contracts validate 11 scenarios and nine allocation owners; JS (120,894 B) and
CSS (29,206 B) remain within their allocations, but current public bytes exceed
the historical allocation by 48,994,642 B because of that same delivered OST.
The current inventory is 167 runtime assets / 138,324,740 B and 172 dist files /
138,927,331 B. These are pre-existing/concurrent audio findings, not Plan 03 art
regressions and not authority to edit the OST in this task.

## Accepted Plan 06 gameplay-systems checkpoint (pre-03M evidence)

This candidate was implemented from manager checkpoint
`555cdd622a98bd77585f2e60f1096712392d71b3`; the historical 0.19.0 evidence
below is preserved and does not validate this later implementation candidate.

| Area | Current evidence | Status |
| --- | --- | --- |
| Content identity | Every level has a positive content revision and deterministic gameplay fingerprint; repeated semantic roles require explicit IDs | A golden tuple test binds all 16 identities; current authored content is revision 2 except corrected Chapter 15 revision 3 |
| Persistence | Progress schema v4 stores stable unlocked IDs/campaign version and revision-scoped current/historical records; active runs use schema v2 and exact revision/fingerprint | Legacy/future access is preserved safely; stale runs explain their restart; save/reset failures are surfaced |
| Campaign solvability | Engine solver derives zero-rescue ordinary and exact-all-rescue perfect solutions for all 16 mazes | Route expectations are 6–201 ordinary and 6–211 perfect; the final 397-test gate and 4/4 semantic scenario fixtures pass |
| Challenge quality | Later ordinary routes are 181, 149, 201, 161, 28, 103, 44, and 61 inputs | Chapters 12, 13, 15, and 16 remove substantial corridor endurance; Chapters 9–11 remain child-test risks |
| Hint/recovery | Required Path has four replayable tiers from exact engine transitions; blocker modal is third-repeat escalation | Portal/multi-hole and zero-rescue fixtures pass; production-preview QA confirmed tier-4 reload persistence and modal input gating, while child/device review remains pending |
| Rewards | Gold and Science copy describes keepsakes without implying a shop | No economy, inventory expansion, or progression gate was added |
| Static budget | Source-matched production build and external inventory | 119,779 B gzip-9 JavaScript, 29,206 B CSS, 89,394,012 B public runtime, and 144 dist files / 89,929,629 B pass the approved Plan 06 allocation; timing remains report-only |

The maintained design contract, complete experience matrix, route rubric, and
family playtest protocol are in `GAMEPLAY_DESIGN_SPEC.md`.

## Current 0.20.0 FP-ART-OST preview status

| Area | Current evidence | Status |
| --- | --- | --- |
| Automated gate | Full suite, TypeScript and production build | 423/423 tests passed; art validation has zero errors; performance contracts pass |
| Static art | Approved `mgjrpg-02` publication and Plan 03-R2 front door | Refreshed active consumers render; dormant catalogue art remains unplaced until its gameplay owner |
| Soundtrack | 42 delivered originals in six semantic pools | All hosted URLs pass; five current contexts are wired, Garden is reserved for Plan 10, and Plan 07B owns final crossfades/prefetch/listening |
| Completion/doors | Pending win, exactly-once progress receipt and stationary door contracts | Automated tests pass; browser Chapter 1 Stay/re-entry/Next journey passed |
| Hosting | GitHub source commit `45dfda2`; canonical Vercel production | Browser build run 33897322239 passed; hosted bundle reports 0.20.0 and all 42 OST paths respond |
| Desktop artifacts | Unsigned portable and NSIS setup | Both report 0.20.0 and byte-match build outputs; portable smoke passed; exact evidence is in `release/FP-ART-OST-v0.20.0-manifest.json` |

## Historical 0.19.0 release status

| Area | Current evidence | Status |
| --- | --- | --- |
| Automated gate | Full unit/integration suite plus strict TypeScript and Vite production compilation | `npm run check` passed 316 tests across 27 files; production JavaScript is 117.04 KB gzipped |
| Dependencies | JavaScript dependency vulnerability and tree review | `npm audit --audit-level=moderate` reports zero vulnerabilities; `npm ls` is clean |
| Desktop compile | Locked Rust/Tauri dependency graph | `cargo check --locked` passed |
| Absolute size policy | Shared solver validation and procedural dimension selection | Every board above 24×24 is rejected; odd generated topology ranges from 9×9 through 23×23 |
| Room-based design | Later Surprise Mazes plus rebuilt Lanternlight Labyrinth | 2×2–4×4 procedural rooms cluster treasure, rescues and Power-gated guardians; Lanternlight is 23×23 with a five-object monster/treasure chamber |
| Hole-gate variety | Engine event paths, generated gates, and authored routes | One-, two-, and three-hole straight jumps are all covered; Lanternlight adds a four-way centre-hole junction, and longer jumps scale duration/height without changing engine movement |
| Living terrain | Shared traced geometry plus animated SVG overlays | Water carries cool ripple bands; lava uses internal flowing veins and hot-core pulses without a raised edge; poison bubbles rise and pop on staggered loops |
| Lock magic | Typed colour/motif palette plus transient presentation | Heart, Star, and Sun keys/doors glow in their matching colours; an opened door blooms and releases 18 deterministic motif particles while input is briefly held |
| Soundtrack | Thirteen full OST tracks plus one reserved friendship cue | A seeded shuffle bag plays every full song once per cycle on maze changes, avoids immediate repeats, and home music begins from the first permitted title-screen gesture |
| Procedural records | Maze Select and Adventure Book | Copy explicitly identifies fresh seeded generation; the Book keeps up to six recent record cards rather than presenting an infinite fixed list |
| Responsive browser QA | 1280×720 desktop and 1024×768 iPad | Live water/lava rendering, key glow, door burst, poison animation contracts, and fixed-stage fit passed; browser warning/error logs are empty |
| Hosting | GitHub `main` is connected to the Vercel Hobby project at `https://maze-so-puzzle.vercel.app/` | Release commit `288e653` auto-deployed; the canonical bundle reports 0.19.0 and contains all water, lava, poison, and door-magic effect contracts |
| Desktop artifacts | Unsigned 0.19.0 portable executable and NSIS setup | Both built and byte-verified; the portable launch smoke passed, and exact sizes and SHA-256 values are recorded in `RELEASE_CHECKLIST.md` |

## Historical 0.18.0 release status

The 0.18.0 clearer-rewards release remains recorded in the changelog and
release checklist. It is superseded by the current 0.20.0 preview.

## Historical 0.17.0 release status

The 0.17.0 illustrated-keepsake release remains recorded in the changelog and
release checklist. It is superseded by the current 0.20.0 preview.

## Historical 0.14.0 release status

The 0.14.0 compact-room and procedural-scrapbook release remains recorded in
the changelog and release checklist. It is superseded by the current 0.20.0 preview.

## Historical 0.13.0 release status

The 0.13.0 Puzzlewild read-together story release remains recorded in the
changelog and release checklist. It is superseded by the current 0.20.0 preview.

## Historical 0.12.0 release status

The 0.12.0 exploration-reward, prerequisite-help, lighting, and Power-99 release
remains recorded in the changelog and release checklist. It is superseded by
the current 0.20.0 preview rather than deleted.

## Historical 0.10.3 release status

The 0.10.3 browser and Windows evidence remains in the release checklist and
changelog. It is superseded by the current 0.20.0 preview rather than deleted.

## Historical 0.10.2 release status

| Area | Current evidence | Status |
| --- | --- | --- |
| Automated gate | Engine, solver, generated/authored levels, exploration, progress, assets, audio, navigation, pointer controls, held cadence, follower trails, visual variants, rescue-record migration, terrain topology, Spring Boots, poison, Antidote Leaf, pure combat presentation, and fixed-stage scaling | 260 of 260 tests across 19 files passed; strict TypeScript/Vite, zero-vulnerability audit/tree, and locked Cargo passed |
| Landscape phones | The complete 960 × 540 logical game scales uniformly into the safe viewport; extra-wide screens letterbox instead of stretching or negotiating a second card layout | 932×430, 844×390, 740×360, 667×375, and 568×320 all retained identical normalized maze/sidebar/row geometry, exact 16:9, and no document overflow. Physical-device repeat remains |
| iPad-size layout | Classic and modern iPads use the same fixed composition as desktop, centred inside vertical letterboxing | 1366×1024, 1180×820, and 1024×768 passed exact bounds/order checks; the iPad perfect-rescue friend rendered over 110 px tall with no reward/action collision. Physical-iPad gesture/pinch/listening checks remain |
| Pointer movement | All input paths move once immediately, allow 220 ms to release for one square, then accelerate smoothly from 160 ms to a capped 100 ms repeat; direction changes reset the ramp | Focused cadence and corner regressions cover tile intent, queued steering, approach-direction choice, wobble tolerance, and strict one-tile safety; final physical-touch feel remains |
| Exploration policy | The shared rule enables a 6 x 6 camera and fog minimap whenever either maze dimension exceeds 6; even-window bias, edge clamping, and reveal accumulation are unit-covered | Focused tests pass and the public 15 x 15 camera rendered the 6 x 6 view; the complete follow/minimap movement pass remains manual |
| Tester access | The title build label opens a direct twelve-maze picker, and exact `?debug=mazes` opens the same picker automatically; tester runs retain the non-saving preview mode | Canonical 0.10.2 exact-query check shows all twelve entries. Full canonical completion/isolation remains a manual follow-up |
| Terrain geometry | Maze terrain is one globally aligned SVG surface with connected wall/water/lava regions, rounded convex/concave bends, periodic textures, a camera gutter, stronger floor/wall contrast, and no hazard outlines or shadows; holes use flat transparent overlays | All ten floor/wall files pass 1024 px opacity/repeat-boundary checks after Poisson correction; local Maze 2, garden, and ruin sampling found no seams, mirrored bands, or ghost masonry |
| Visual catalogue | Ten unique terrain themes with dominant-colour plus measured-lightness compatibility, five weapons, five friendly enemy looks, eight pet species, four opaque AI-generated front cage layers, Spring Boots, a ground-hole overlay, and two sparse terrain dressings are selected through typed IDs and local assets | Tests reject gold with green/sage or rose in both directions, require every floor to lead its wall by at least eight lightness points, and cover both floor- and wall-dressing preload; both dressing files pass 512 px RGBA/transparent-edge checks |
| Pet followers | Rescued friends occupy distinct recent visible footprints behind Ame with bounded loop-free trail state | Pure trail regressions pass and one rescued follower was verified through normal local controls; multi-follower, reduced-motion, and physical-device feel checks remain |
| Story pacing | Authored sizes run 9, 11, 13, 15, 13, 15, 17, 17, 19, 25, 21, and 23; friend totals grow 1, 2, 3…, 4, 5 | All twelve ordinary and perfect-rescue routes are solver-validated. Twilight and Moonlit require every authored prerequisite off the bare exit route; Moonlit's leaf precedes a connected poison gate |
| Surprise Maze variants | Generated presentation remains deterministic; size varies by seed across unlocked odd 9–29 bands, water/lava form connected post-boots clusters, and eligible adventure seeds add branch prerequisites plus post-Spring-Boots holes | A 500-seed adventure stress audit spanning every odd size found zero ordinary/perfect failures; 353 samples had exactly one Spring Boots pickup before connected holes |
| Optional Power puzzles | Wishing Woods, Ame's Grand Parade, Springstep Sky Hollow, and Lanternlight separate progression/rescue requirements across branches | Solver-verified ordinary/all-pets routes are 114/148, 116/136, 190/214, and 290/322 steps respectively |
| Audio and presentations | Five full OST songs are assigned per maze with stable session mapping and immediate-repeat avoidance; jump, rescue, clash, sparks, impact, Power, and win cues support short event presentations | The four-layer jump boing and semantic three-clash sound schedule have focused tests. Local browser timing observed all three contacts, a conserved 1→0 / 2→3 Power transfer, the 2.22 s cleanup, and no runtime warning after a clean reload. Physical listening/reduced-motion feel remains manual |
| Hosting | GitHub `main` is connected to the Vercel Hobby production project at `https://maze-so-puzzle.vercel.app/` | Commit `65fe554` auto-deployed Ready; the canonical alias reports 0.10.2, lists all twelve tester mazes, keeps fixed normalized geometry at 1024×768, 844×390, and 568×320, and has no production warning/error logs |
| Desktop artifacts | Unsigned 0.10.2 portable executable and NSIS installer are staged in `release/` | Both match final Tauri outputs, report 0.10.2, are SHA-256 recorded, and the portable app stayed responsive with the correct title for five seconds; clean-machine install and signing remain |

## Historical 0.5.1 implementation status

| Area | Final evidence | Status |
| --- | --- | --- |
| Automated suite | Engine, solver, every authored level, generated levels, exploration, progress, active-session validation, assets, audio, and navigation | 122 of 122 passed; strict TypeScript and production Vite build passed |
| Child onboarding | Fresh-profile production check at 1280 x 720 showed the safe first arrow on both the board and D-pad; it disappeared after one move | Passed without a forced tutorial modal |
| Refresh recovery | A production-browser move saved step 1; a full reload returned to `Resume maze`, and restoring placed Ame at the saved state | Passed; malformed and inconsistent snapshots have focused fail-closed tests |
| Celebration | A perfect 34-step first clear displayed all three friends, 30 gold, two new stickers, and both actions | Passed at 1280 x 720 with `clientHeight` equal to `scrollHeight` (501 px) |
| Lanternlight progression | Exhaustive reachable-state search rejects any authored state that can attack underpowered after finding the sword | Passed; ordinary/perfect finale routes are now 280/312 steps |
| Load performance | Art warming is deduplicated and limited to the current level, with reward art deferred until idle | Unit-covered; broader low-end device profiling remains |
| CI parity | Browser verification remains on Linux; locked Tauri compilation also runs on `windows-latest` | Workflow is present on `origin/main`; individual hosted-run status is reported by the README badge rather than inferred here |
| Windows artifacts | Tauri 0.5.1 executable and NSIS installer were built, staged, source-compared, and hashed; the portable app remained responsive with the correct title for five seconds | Passed locally; clean-machine install and signing remain |

## Historical 0.5.0 implementation status

| Area | Final evidence | Status |
| --- | --- | --- |
| Story campaign | 96 tests cover all nine authored levels, including ordinary and all-three-rescue solutions for the 25 x 25 **Lanternlight Labyrinth** | 96 of 96 passed; production TypeScript and Vite build passed |
| Exploration view | Production browser rendered exactly 49 camera tiles at 1280 x 720 and 960 x 540; after leaving the edge, Ame occupied the centred camera tile | Passed at the checked landscape sizes; broader real-device matrix remains |
| Fog-of-war map | Production browser rendered all 625 minimap cells; travel grew revealed tiles from 49 to 63, retained 14 remembered tiles, and left 562 masked | Passed, including reset on maze switch and discovered-only landmark text |
| Tester preview | Normal URL exposed zero tester controls; exact `?debug=mazes` exposed one, cycled and wrapped all nine mazes, and a 26-move tester completion left displayed gold unchanged | Passed; preview completion showed no reward panel and explicit non-saving copy |
| Music | All six local MP3s are present in the production bundle and music controls produced no browser console errors | Packaging passed; listening/autoplay checks still belong in the device matrix |
| Release artifacts | Tauri 0.5.0 executable and NSIS installer were built, staged, compared, hashed, and the portable executable remained responsive in a hidden five-second launch | Passed; clean-machine installer testing and code signing remain |

## Last verified 0.4.0 candidate status

| Area | Current evidence | Status |
| --- | --- | --- |
| Unit suite | 87 tests cover the engine, solver, generator, eight story levels, progress schema v3, achievements, protected navigation, synthesized-audio safeguards, and local music control | 87 of 87 passed in the final run; `npm run check` completed the production build |
| Story campaign | Eight authored levels from 9 x 9 through 17 x 17, with solver routes spanning 26 to 114 steps; every ordinary exit and all-three-rescues route is validated | Implemented and solver-verified; final human play-through pending |
| Title experience | AI-illustrated title screen, story continuation, Adventure Book, surprise-maze shortcut, sound control, and reduced-motion-aware flourishes | Production bundle verified at 1280 x 720; broader manual matrix remains |
| Adventure Book | Species totals, overall stats, stickers, rescue medals, nine stat-driven badges, and per-story-maze clear/step/rescue records | Browser structure, visuals, current-run record, and keyboard focus verified |
| Saves | Schema v3 records richer statistics and defensively migrates v1/v2 data without inventing unknown historical species | Automated coverage present; browser-profile upgrade test pending |
| Input | Immediate keyboard and primary-pointer movement, deterministic held-key cadence, latest-direction buffering, D-pad press-and-hold, and cancellation on focus or visibility loss | Source review plus production-browser checks confirmed synchronous key movement and one move per D-pad tap; real-device hold/cancel testing and focused controller automation remain |
| Visual polish | Correctly tiled floor, wall, water, and lava textures; restrained outer rounding and rounded inner wall joins; larger icon-led rescue/inventory UI; Ame visibly holds her sword after collecting it | Implemented in the production bundle; broader device visual review remains |
| Audio | Synthesized action/UI cues plus locally bundled looping music for title, early story, later story, and surprise mazes; overlapping voices and closed contexts are bounded and guarded | Automated music/control coverage present; browser and WebView2 listening pass pending |
| Title asset | PNG master archived; 256,684-byte WebP derivative served in-game | Production bundle verified; source-only art excluded |
| Dependencies | `npm audit` and `npm ls` | 0 vulnerabilities; dependency tree clean |
| Desktop compile | `cargo check --locked` through `npm run check:desktop` | Passed without errors |
| Windows package | Tauri 0.4.0 portable executable and NSIS installer | Built and staged with 0.4.0 filenames; source and staged hashes match; hidden five-second portable smoke launch stayed responsive with the correct title |

## Last fully verified 0.2.0 baseline

| Area | Evidence captured in this audit | Result |
| --- | --- | --- |
| Unit tests | Vitest suite covering movement, combat, items, hazards, rescues, authored levels, generation, saves, and rewards | 49 of 49 passed in the final 0.2.0 housekeeping run |
| Browser build | `npm test` and `npm run build`, now combined by `npm run check` | Passed |
| Desktop compile | Locked Cargo check, now exposed as `npm run check:desktop` | Passed |
| JavaScript dependency tree | `npm ls` | Clean; optional platform packages were the only unmet optional dependencies |
| JavaScript security audit | `npm audit` | 0 known vulnerabilities across 109 installed dependencies |
| JavaScript update check | `npm outdated --json` | No outdated direct packages reported |
| Post-fix generated-maze stress check | 1,920 mazes covering all 24 difficulty/size combinations | No generation failures; every ordinary solution rescued 0 animals and every perfect-rescue solution rescued 3 |
| Generator determinism check | 96 repeated generations | Byte-for-byte deterministic |
| Image assets | Production paths, dimensions, and alpha/transparency expectations | Present and valid |
| Browser layout spot check | 1280 x 720 rendered game | No page overflow; heading order, nearby-cell text, right-click guard, dialog focus trap, Escape, and focus restoration verified |
| Windows package | Final portable executable and NSIS installer | Built successfully; portable app remained responsive in a smoke launch |
| Tauri permissions | `core:default` capability and local-only content security policy | Appropriately narrow for the current app |

These results preserve the last verified 0.2.0 baseline for comparison. The
0.4.0 evidence above remains as a historical release baseline. The verified
0.5.0 candidate and the broader unfinished manual matrix are recorded separately.

## Version 0.9.1 implementation snapshot

- Held touch, mouse, keyboard/WASD, and D-pad movement now share one cadence:
  an immediate first tile, a 220 ms release window, and a smooth 160–100 ms
  acceleration curve. Direction changes restart the curve.
- Corner forgiveness is resolved from the latest live state. It may take one
  safe perpendicular floor tile when the intended tile is a wall, uses pointer
  offset or Ame's approach direction to disambiguate, and never crosses water,
  lava, holes, unresolved doors, or enemies.
- All ten AI-generated floor/wall paintings were rebuilt from retained masters
  using periodic-plus-smooth Poisson correction. Runtime periods now span 3–4.2
  maze tiles rather than presenting oversized slabs, and every repeat passes a
  wrap-transition validation against ordinary local detail.
- Active themes combine an explicit dominant-colour matrix with calibrated
  texture lightness. Gold/yellow is rejected with rose/pink and green/sage in
  either direction, the bright sandstone wall is excluded, Maze 2 uses
  rose-brick paths against darker mossy ruins, and all ten story pairs are
  unique with floors at least eight lightness points above walls.
- Two native-transparent ImageGen dressing atlases add sparse garden detail to
  Star Garden/Wishing Woods and subordinate ivy to Lantern Ruins. They stay
  world-aligned, render beneath interactive content, and pass RGBA/edge checks.
- The integrated 0.9.1 source passes 215 tests across 16 files plus strict
  TypeScript/Vite. Dependency review, locked Cargo compilation, terrain scripts,
  and unsigned 0.9.1 Windows packaging/hash/smoke gates pass. Public deployment
  and the remaining manual/device matrix are still open release gates.

## Historical version 0.9.0 implementation snapshot

- Spring Boots and ground holes are first-class engine/solver concepts. One
  input can jump a consecutive one- or two-square run only when a safe non-hole
  landing exists; the event carries its start, crossed squares, and landing for
  the short UI arc and boing cue. Old active runs migrate on unchanged levels;
  traversal levels whose topology changed are discarded without touching the
  player's separate campaign progress.
- Springstep Sky Hollow extends the campaign to ten authored mazes. Wishing
  Woods, Ame's Grand Parade, Springstep, and Lanternlight now use explicit
  branches and out-and-back prerequisites; their ordinary/all-pets solutions are
  114/148, 116/136, 190/214, and 290/322 steps.
- Eligible ≥13 adventure generators can put requirements on dead-end branches
  and add safe one- or two-square hole runs beyond the Spring Boots. A 500-seed
  adventure stress audit found zero ordinary or all-pet failures; 353 samples
  contained Spring Boots and holes in the required order.
- Every terrain material has a dominant-colour family, and an explicit
  compatibility matrix prevents clashing floor/wall combinations such as a
  sunny yellow floor with a green or sage wall.
- Five full OST tracks receive stable per-maze assignments for a session and
  avoid the immediately previous song when an alternative exists. The short
  friendship cue remains excluded from looping BGM.
- Jump, friend-rescue, combat-clash, sparks, impact, Power-tick/power-up, win,
  and loss cues join the synthesized sound set. Cancellable combat and rescue
  presentations briefly lock input, show the state change clearly, hand back to
  exactly one normal player/follower, and collapse under reduced motion.
- The integrated 0.9.0 web source passes 204 tests across 15 files plus strict
  TypeScript/Vite. Dependency review, locked Cargo compilation, and the unsigned
  0.9.0 Windows packaging/hash/smoke gates pass. Public deployment and the
  remaining manual/device matrix are still open release gates.

## Historical version 8.0 implementation snapshot

- The exploration camera is now 6 x 6. Its even-sized window uses a stable
  upper-left centre bias, clamps at every edge, and feeds the same accumulated
  reveal state used by the fog-of-war minimap.
- Surprise Maze dimensions vary deterministically rather than climbing in a
  straight line. Unlocked seed bands cover readable odd sizes from 9 through 29;
  generated topology never reaches 30 tiles in either dimension.
- Growing and adventure generators can place connected water or lava regions of
  2–4 tiles after the matching boots. Placement reserves required progression
  cells and is accepted only after ordinary and perfect-rescue solver checks.
- A primary mouse or touch pointer now acts as a continuous directional control:
  press moves immediately, hold repeats, dragging changes direction, and release
  or recentering stops movement. A strict one-tile assist can round an ordinary
  wall corner, but never pathfinds, crosses a hazard, or bypasses a door or foe.
- Rescued animals visibly follow Ame along distinct recent footprints. This trail
  is bounded, loop-free presentation state and does not alter collision or saves.
- The four cage styles use opaque AI-generated front layers over the existing pet
  art. Terrain contrast is stronger, connected hazards have no outline, lip,
  drop shadow, or filter, and the phone/iPad playfield uses nearly the full
  landscape height.
- The integrated 0.8.0 web source and unsigned Windows package are locally
  verified, and the canonical Vercel build passed its initial production smoke.
  Physical-device touch/listening/feel, clean-machine installation, signing, and
  the broader production walkthrough remain separate release gates.

## Version 7.0 web implementation snapshot

- Each of the nine story mazes has its own paired floor-and-wall theme, one
  illustrated weapon, and three distinct optional pets. The full local catalogue
  contains five weapons, five friendly enemy looks, eight pets, and four cages.
- The picture-first board and inventory resolve variants from typed IDs, and Ame
  visibly carries the selected level weapon after collecting it.
- Surprise Maze seeds deterministically select their terrain, weapon, enemy, and
  cage variants from a presentation-only stream, preserving puzzle determinism.
- Wishing Woods adds an optional Power 9 pebble-golem guarding its kitten. The
  ordinary exit remains unchanged; a perfect rescue uses the weapon, Power 2 foe,
  potion, Power 5 foe, and a short backtrack to challenge it at Power 11.
- This remains a web release. The downloadable Windows executable and installer
  remain at their last verified 0.5.1 version.

## Version 6 web implementation snapshot

- Every grid whose width or height exceeds the seven-tile field of view now uses
  the same player-centred camera and fog-of-war minimap. This includes every
  current story and generated maze, while the engine and solver remain on full
  global coordinates.
- The small title-screen build label is the secret entry to a direct authored
  maze picker. Exact `?debug=mazes` opens that picker automatically. Selected
  runs are tester previews and must not create active-session saves or mutate
  rewards, records, gold, unlocks, or normal story progress.
- Floor, walls, water, and lava render through continuous world-coordinate SVG
  patterns rather than independently textured grid cells. Connected terrain
  boundaries support rounded convex and concave corners, holes, diagonal-touch
  resolution, and a camera gutter that avoids false curves at the view edge.
- AI-generated floor and wall materials show smaller details at a useful maze
  scale. Periodic Poisson correction keeps their joins unobtrusive without
  introducing mirrored cross-bands or double-exposed masonry;
  water and lava use matching periodic derivatives, connected shapes, a shallow
  flat floor-colour lip, and no cast shadow.
- The GitHub `main` branch is the production source for the Vercel Hobby site at
  `https://maze-so-puzzle.vercel.app/`. This is a web release: the downloadable
  Windows executable and installer remain at their last verified 0.5.1 version.

## Version 5 implementation snapshot

- **Lanternlight Labyrinth** extends the story to nine authored mazes. The first
  eight remain at the readable 9 x 9 through 17 x 17 sizes, while the new finale
  is a 25 x 25 exploration level.
- The large level renders through an explicit player-centred 7 x 7 camera. Camera
  offsets affect only presentation; the engine, objects, and solver retain global
  level coordinates.
- A persistent fog-of-war minimap separates the current field of view, remembered
  explored tiles, and unvisited mystery.
- An exact `?debug=mazes` tester entry point exposes quick authored-level cycling.
  Tester runs are previews and must not grant rewards or mutate progress.
- The locally bundled OST introduced in 0.4.0 remains part of the offline browser
  and Tauri bundle.

## Version 5.1 polish snapshot

- Normal authored runs now survive refreshes and app restarts through a narrow,
  defensively validated active-session schema; tester and Surprise Maze runs do
  not write it.
- The opening offers a one-step visual coach, coarse-pointer D-pad buttons meet
  a 44 px minimum, and the movement repeat cadence is 64 ms.
- The minimap outlines the current camera window, while the completion card fits
  the complete first-clear reward at the default landscape size without scroll.
- Lanternlight's progression has a forced early Power pickup and a final goblin
  immediately before the exit. Exhaustive state exploration now guards every
  authored level against reachable underpowered combat traps.
- Level-scoped art preloads replace the previous eager all-art warm-up, and the
  hosted CI configuration now checks the locked Windows/Tauri compile path.
- Background music pauses on page hide and resumes only the same current,
  previously active, unmuted player; disposal and track changes cancel resuming.

## Version 4 implementation snapshot

- The campaign has eight story mazes scaled from 9 x 9 through 17 x 17 for clearer
  characters and objects. Validated ordinary routes span 26 to 114 steps, and
  every level separately proves that all three optional friends can be rescued.
- Input now responds immediately, buffers the latest turn during its short
  cadence, repeats held keyboard directions consistently, and supports D-pad
  press-and-hold without turning pointer input into pathfinding.
- Floor, wall, water, and lava art tiles at a maze-appropriate scale. Wall shapes
  use gentler outer corners and rounded inner joins, while the side panel favours
  larger rescue and inventory icons over repeated labels.
- Ame swaps to an original sword-held sprite as soon as the sword is collected.
- The title screen uses original AI-generated key art. Its editable PNG master is
  archived at `docs/source-assets/title-background-v1.png`; the app serves the substantially
  smaller `public/assets/title-background-v1.webp` derivative.
- The Adventure Book presents meaningful progress without exposing save internals:
  distinct mazes solved, total completions, generated-maze activity, gold,
  perfect rescues and streaks, bunny/fox/kitten totals, collectibles, nine
  stat-driven badges, and per-level best records.
- Progress schema v3 stores the richer records. Migration preserves known v1/v2
  facts, marks formerly unrecorded source/species history as unknown, sanitizes
  malformed values, and never fabricates achievement progress.
- Synthesized audio includes title, menu, selection, achievement, and stamp cues,
  with a voice cap, safe node cleanup, and recovery from a closed context. Four
  locally bundled music tracks now cover the title, story, and surprise mazes.

## Historical version 4 product-rule snapshot

The rules below record the version 4 implementation era and are retained as
historical evidence. They are not current authority where the maintained design
specifications or later candidate sections above differ.

- Equal Power wins. This is intentional, child-friendly, covered by a unit test,
  and documented in the README.
- Primary mouse and touch pointers use the same continuous directional control.
  Press moves one square immediately, hold repeats, drag steers, and release or
  recentering stops. A one-tile wall-only corner assist may choose a safe open
  side step; it never pathfinds or assists onto hazards or through blockers.
- Portrait orientation shows a turn-sideways message. Landscape is the intended
  play mode rather than an accidental limitation.
- Each maze's one to five animal rescues are bonus goals; reaching the maze exit
  must not require collecting them.
- Any maze wider or taller than 6 tiles uses the 6 x 6 exploration camera and
  fog minimap. Maze dimensions and presentation are no longer separate opt-ins.
- Generated mazes vary by seed across unlocked odd 9–29 size bands. The current
  topology cap is 29, connected 2–4 tile water/lava regions are introduced only
  after splash boots, and hole runs are introduced only after Spring Boots while
  keeping ordinary and perfect routes solvable.
- A directional move cannot enter a hole. With Spring Boots it crosses the full
  consecutive run in one engine transition only when the first non-hole landing
  square is safe; this remains directional assistance rather than pathfinding.
- The authored campaign deliberately varies 9, 11, 13, 15, 13, 15, 17, 17, 19,
  25, 21, and 23 tiles rather than making every story maze monotonically larger.
- Theme selection must pass the dominant-colour compatibility matrix; in
  particular, yellow/gold floors cannot pair with green/sage walls.
- The unsigned Windows files are suitable for local testing. SmartScreen may
  warn on machines that did not build them; the current verified files are
  0.10.3. Earlier artifact records remain historical evidence.

## Hardening completed during housekeeping

- Surprise-maze animals are placed away from the critical exit route. Generation
  now proves both an ordinary zero-rescue win and a separate all-three-rescues
  win, including a regression seed that previously made rescues mandatory.
- Ordinary and perfect-rescue solver modes use objective-specific state
  signatures, avoiding needless rescue-state expansion in the ordinary search.
- Structural validation rejects unknown terrain values and solver state limits
  are normalized before search.
- Generated-maze progress IDs use a longer, versioned seed identity to make
  accidental save-key collisions much less likely.
- Saved level IDs are trimmed and reserved JavaScript object keys are rejected;
  replay lookup checks own properties only.
- Non-primary pointers no longer move Ame. Keyboard movement uses deterministic
  held-key timing, a single latest-turn buffer, and lifecycle cleanup, while the
  D-pad supports the same immediate press-and-hold rhythm.
- Primary pointer intent and the wall-only corner assist are isolated in
  `pointerControls.ts`; follower trail state is isolated in `followerTrail.ts`.
  Focused regressions cover direction changes, cancellation inputs, even-window
  camera behavior, generated size bands, and connected hazard placement.
- Dialogs now receive focus, contain keyboard focus, respond to Escape where
  appropriate, restore focus, and make the background inert while open.
- The rendered page has a logical top-level heading, control-state semantics,
  and a current textual description of Ame's adjacent maze cells.
- Home and Adventure Book preserve the active run, cross-maze switches are
  confirmed once movement has begun, and modal keyboard input cannot move Ame
  behind the confirmation.
- Big Maze remains available as an optional roomier board view while retaining a
  compact Power/item/rescue HUD and an overlaid feedback toast.

The 0.10.3 source passes 267 tests across 20 files, strict TypeScript, and the
Vite production build. Desktop 1280×720, iPad 1194×834, and landscape-phone
844×390 browser checks have no page overflow, overlap, console warning/error,
or broken visible image. The dependency audit/tree and locked Cargo check pass,
and the unsigned 0.10.3 Windows pair is built and hashed, with a passing portable
launch smoke. Reset
entry points and their warning were checked without invoking the destructive
action; the pickup toast and v4 front-only cage were visually verified. Unchecked
physical-device, listening/feel, broader production, clean-install, and signing
items in `RELEASE_CHECKLIST.md` remain requirements.

## Prioritized remaining work

### P0 - release hygiene and future packaged builds

- Perform the remaining physical-device browser matrix in `RELEASE_CHECKLIST.md`
  against the exact 0.10.3 build, and separately repeat the
  portable and installer matrix on a clean Windows account before wider sharing.
- Before any new Windows release, install, launch, save, upgrade, and uninstall
  on a clean Windows x64 machine.
- Code-sign any future Windows executable and installer, or explicitly label the
  files unsigned and document the expected SmartScreen warning.
- Choose and add a source-code and asset licence before inviting reuse or
  redistribution beyond the current all-rights-reserved public prototype. This
  is an owner decision and was deliberately not guessed during housekeeping.
- Verify the recorded staged SHA-256 values against any copies uploaded for
  testers.

### P1 - next quality pass

- Qualify Plan 07 timing variance on a clean reference host, then run all four
  required viewports, the defined low-end profile, Lighthouse, ten-minute heap,
  and current-build Tauri/WebView2 cohorts before promoting any timing gate.
- Add automated browser interaction tests for keyboard movement, directional
  pointer movement, dialog focus trapping and restoration, reward persistence,
  the stronger-enemy comparison, and a full maze completion.
- Add automated accessibility checks and a richer screen-reader representation
  of nearby maze cells; the visual grid should not be the only spatial model.
- Test 200% browser zoom and Windows text scaling, including Big Maze mode and
  the 6 x 6 camera/minimap on early, generated, and 25 x 25 mazes.
- Add visual-regression snapshots for the minimum 960 x 540 window, the default
  1280 x 720 window, 1920 x 1080, and the portrait guidance screen.
- Repeat drag steering, recenter/release cancellation, touch targets, D-pad hold,
  no-page-pan, and no-pinch checks on Amelia's actual iPad. Responsive browser
  emulation and unit tests cannot replace that physical-device check.

### P2 - maintainability and polish

- Add browser-level regression coverage for camera following, minimap fog and
  remembered tiles, build-label/query tester-picker entry, direct authored-level
  selection, and preview completion isolation.
- Consolidate repeated responsive CSS rules after the current visual design
  settles; this reduces cascade surprises without changing the look.
- The unused original `floor.png` and `wall.png` are preserved under
  `docs/source-assets/legacy-v1/`, keeping 828 KB of source-only art out of the
  production bundle.
- Define retention or cleanup behaviour for superseded generated-maze best-result
  IDs when a future generator version changes its progress-key namespace.
- Add Rust formatting and Clippy to the documented toolchain. Those components
  were unavailable in this audit environment, so no formatting or Clippy result
  is claimed here.
- Retry the Rust dependency update check on a reliable network; the audit's
  `cargo update --dry-run` attempt timed out while contacting crates.io.

## Housekeeping notes

- Build outputs are ignored through `.gitignore`: `dist/`, `src-tauri/target/`,
  coverage, Vite cache files, logs, and `node_modules/`.
- Current source metadata and `release/` records are aligned at 0.10.3. GitHub
  `main` commit `3f61cbd` is verified live on the canonical Vercel site.
- The Tauri content security policy is local-only. Inline style permission is
  currently needed because the UI uses dynamic positioning and CSS variables.
- AI artwork provenance and regeneration prompts are documented in
  `AI_ASSET_PROMPTS.md`, including the title screen, paired terrain materials,
  character/item variants, Spring Boots, the ground hole, sparse garden/ivy
  dressing, magical poison, the Antidote Leaf, and optimized runtime derivatives.
