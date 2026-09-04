# Release checklist

Verification date: 2026-09-04
Plan 03 publication update: 2026-09-04

Use this checklist for the exact commit and artifacts that will be shared. A
successful earlier build does not validate files produced after another source,
dependency, configuration, or asset change.

Historical released status for 0.19.0: `npm run check` passed 316 tests across 27 files plus strict
TypeScript and the Vite production build. Production JavaScript is 117.04 KB
gzipped. The production-only npm audit reports zero vulnerabilities; `npm ls` is
clean, and locked Cargo compilation passes. Local browser QA at 1280 × 720 and
1024 × 768 verified pickup art, the complete cage, rescue, gameplay HUD, and
post-combat Power reward with no warning or error logs. The unsigned Windows portable and
setup builds were built, hashed, byte-compared, versioned, and smoke-tested.
Physical-device touch/listening/feel, accessibility, clean-machine installation,
signing, and the broader manual play-through remain deliberately unclaimed.
Earlier evidence is kept as historical release evidence.

## Playable 0.20.1 corrective FP-ART-OST checkpoint

- [x] Runtime source committed and pushed as
  `d6b11c026ead3d75565e10490c10307a5a14cfd0`.
- [x] `npm run check`: 423/423 tests across 38 files, strict TypeScript and the
  Vite production build passed.
- [x] `npm run art:test`: 111/111 passed; non-writing art validation reports
  zero errors and 420 already-classified non-blocking warnings.
- [x] Performance contracts/budgets, 4/4 scenario fixtures, package inventory,
  and `cargo check --locked` passed.
- [x] Active catalogue audit replaced the only genuine legacy-style story gaps,
  Professor Poggle and Sprig. Goblin and Violet Moon remain documented approved
  exceptions rather than accidental omissions.
- [x] Browser QA at 1280x720 and 844x390 covered the separate title screen,
  repaired Home hero, Adventure Book modes, both story portraits, flower-pad
  cleanup and the door-opening visibility assertion with zero console
  warnings/errors.
- [x] GitHub Browser build run
  [33906290349](https://github.com/MachineKomi/maze-so-puzzle/actions/runs/33906290349)
  passed for the runtime source commit.
- [x] The canonical Vercel index and `index-Dr4fqy07.js` returned HTTP 200,
  exposed build 0.20.1 and referenced all four new runtime-art paths; each path
  returned HTTP 200.
- [x] Tauri/NSIS build passed. Both staged artifacts byte-match their final
  build outputs and report file/product version 0.20.1.
- [x] The portable build remained live and responsive for six seconds with the
  expected window title in the isolated preview data namespace.
- [x] Exact sizes, hashes, toolchain, gates and known limitations are recorded
  in `release/FP-ART-OST-v0.20.1-manifest.json`; the family journey is in the
  adjacent playtest note.
- [ ] Physical iPad/TV/phone review, clean-machine installer test, signing,
  low-end/Tauri qualification and complete campaign playthrough remain pending.

## Historical playable 0.20.0 FP-ART-OST checkpoint

- [x] Runtime source committed and pushed as
  `45dfda27c9f7c60b1dd8c42fd0f9e06e1801f58c`.
- [x] `npm run check`: 423/423 tests across 38 files, strict TypeScript and the
  Vite production build passed.
- [x] `npm run art:test`: 111/111 passed; non-writing art validation reports
  zero errors and 420 already-classified non-blocking warnings.
- [x] Performance contracts/budgets and `cargo check --locked` passed.
- [x] Browser QA at 1280x720 covered the approved front door, story/maze/victory
  audio requests, Chapter 1 completion, **Stay here**, exit rearming, and the
  exactly-once **Next maze** commit with zero console warnings/errors.
- [x] GitHub Browser build run
  [33897322239](https://github.com/MachineKomi/maze-so-puzzle/actions/runs/33897322239)
  passed for the runtime source commit.
- [x] The canonical Vercel index and `index-CwB1ah1Q.js` returned HTTP 200 and
  exposed build 0.20.0, the new OST catalogue, Home hero, progress v5 and Stay
  flow. All 42 hosted MP3 paths returned a successful HEAD response.
- [x] Tauri/NSIS build passed. Both staged artifacts byte-match their final
  build outputs and report file/product version 0.20.0.
- [x] The portable build remained live and responsive for six seconds with the
  expected window title. It uses the isolated
  `com.ame.mazesopuzzle.preview` application-data namespace.
- [x] Exact sizes, hashes, toolchain, gates and known limitations are recorded
  in `release/FP-ART-OST-v0.20.0-manifest.json`; the family journey is in the
  adjacent playtest note.
- [ ] Physical iPad/TV/phone review, clean-machine installer test, signing,
  low-end/Tauri qualification and complete campaign playthrough remain pending.

## Unreleased Plan 03-R1 publication

- [x] Human decision v9 records exact approved run IDs, source paths, hashes and
  bounded runtime authority; rejected gallery alternatives remain historical.
- [x] Publish the seven navigation replacements atomically, activate the
  environment-only title background with legacy fallback, and activate the Ame
  Web/Tauri icon without changing bundle identity.
- [x] Catalogue Home Splash B and exact 1024/512 `Maze so Puzzle` wordmarks as
  dormant Plan-01-ready assets; do not preload or force them into the legacy
  combined title route.
- [x] Construct every final wordmark edge from vendored Fredoka/OFL glyph masks;
  use generated Logo B only as material evidence. Verify lowercase `so`, no
  subtitle and no yellow route line.
- [x] Preserve the previous seven navigation files and title background as
  rollback holds. Delete or archive none; Plan 12 eligibility remains false.
- [x] Complete deterministic rebuild, art/catalogue/full checks, performance
  checks, browser viewport matrix and native Tauri smoke. The exact R1 candidate
  passes in isolation; the shared tree's concurrent OST path/byte failures are
  separately owned and recorded. Commit/push evidence is the checkpoint that
  contains the R1 validation report.

## Unreleased Plan 03-R2 home composition

- [x] Record Human decision v10 for the exact Batch 24 generated Logo B and
  Batch 26 larger-tea-skeleton Home Splash v02 sources.
- [x] Extract alpha programmatically from each source's uniform green matte;
  reject generative transparency edits and preserve the immutable source pixels.
- [x] Publish three versioned responsive derivatives and activate their typed
  front-door pointers atomically, retaining v01/v05 rollback files.
- [x] Render the illustrated logo and transparent bottom-right hero on the
  existing combined route; remove the cream overlay and redundant visible
  eyebrow/subtitle while retaining the exact accessible heading.
- [ ] Repeat physical iPad and television review; browser viewports and native
  desktop checks are automation evidence, not substitutes for display hardware.

## Unreleased Plan 03 static-art publication

- [x] The Human's 2026-09-04 continuation closes the art-review and completeness
  gates and directs publication without alternative generations or reapproval
  of unchanged artwork. The forward-only decision at
  `source-assets/calibrations/mgjrpg-02/v06/human-decision.json` hash-binds the
  exact runtime map.
- [x] `source-assets/publication/mgjrpg-02-plan03-runtime-map.json` joins 144
  selected immutable generation runs to stable semantic IDs, strict-v2 record
  IDs, loading phases, and versioned public URLs: 100 active and 44 dormant.
  Dormant catalogue rows add no gameplay, placement, preload, or animation.
- [x] Run the no-overwrite publisher and its temporary-directory byte rebuild;
  retain the measured per-file and aggregate result in
  `source-assets/publication/mgjrpg-02-plan03-publication-report.json`.
- [x] Regenerate `source-assets/manifest.json`, then pass `npm run art:test` and
  non-writing `npm run art:check` with every strict-v2 record, recipe, prompt,
  run, reference, approval, rights, derivative, and rollback hash intact. The
  final run passed 99 art tests, 144/144 deterministic derivative rebuilds,
  zero manifest errors, and zero `mgjrpg-02` alpha-border findings. The 418
  non-blocking warnings are broken down in the validation report rather than
  suppressed.
- [x] The selected Plan 03 sources have a scoped technical project-publication
  provenance review at
  `source-assets/reviews/mgjrpg-02-rights-provenance-v01.json`. Its limitations
  remain explicit: it is not external legal advice, trademark clearance,
  permission for third-party reuse, or approval of gated public labels.
- [x] All 100 exact prior-path source records and their matching derivatives are
  marked `superseded`. The files remain byte-for-byte present and are recorded
  in the Plan 12 ledger as `rollback-hold`; none is moved, deleted, archived, or
  declared retirement-eligible by this pass. With 16 earlier candidates, the
  ledger contains 116 files / 37,066,556 encoded bytes / 168,329,216 decoded
  bytes and zero eligible entries.
- [x] Batch 22 publishes exactly 15 approved 256 × 256 transparent WebP reward
  derivatives. Animal Friend and Golden Guardian use the corrected candidate-B
  sources; their rejected candidate-A runs remain immutable rejection evidence.
  One runtime derivative per identity services the current 27–150 CSS-pixel
  range; 91/64/52/48/32 px PNGs remain ignored proof assets.
- [x] The Bubble Ring Blade replaces the Bubble Bow semantic weapon ID across
  type, level content, catalogue, labels, assets, and tests. A one-way resolver
  alias accepts the old ID in saved content; no content revision changes because
  art-style identity is excluded from the gameplay fingerprint.
- [x] The approved Batch 15 Normal Boots source publishes as the current
  `splash-boots` pickup behind `PICKUP_ART.boots`, replacing `/assets/boots.png`;
  it is not duplicated in the dormant future-item catalogue.
- [x] Green Tea Skeleton is catalogued only as a dormant rescue friend. Violet
  Moon remains the active third portal; Sunny Diamond and Violet Spade Bloom are
  dormant. No future/dormant art is inserted into gameplay by publication.
- [x] The current platform icons remain in place. The Ame-face app icon and all
  Batch 21 title, home, and generated-logo concepts remain source-only for Plan
  11; generated lettering is not exact wordmark authority.
- [x] Exercise the Adventure Book's mixed unlocked/locked cards and a normal
  non-tester victory reward at actual runtime size. My First Maze and Twinkle
  Toes used the same published semantic identities on both surfaces, retained
  clean cream cutlines and readable silhouettes, and produced no fallback,
  broken request, or console warning/error. The deterministic proof suite owns
  grayscale and 27–150 px optical-size assertions; physical TV-distance and
  reduced-motion feel remain external gates.
- [x] Pass strict TypeScript, the production build, `npm run perf:check`,
  `npm run check:desktop`, and the native no-bundle Tauri build/launch smoke for
  the exact candidate tree. The final literal `npm run check` passed all 407
  tests across 35 files, TypeScript, and the Vite build after the cold Rust/link
  work completed. An earlier concurrent-load attempt produced four fixed
  10/30-second gameplay-solver timeouts, including the same generator timeout
  in the unchanged starting commit; that resource-contention evidence remains
  recorded rather than hidden. Physical iPad/TV, signing, qualified Tauri
  performance, and clean-machine checks remain separate external gates. Exact evidence is in
  `source-assets/publication/mgjrpg-02-plan03-validation-report.json`.

## Historical Plan 03 art-foundation gate (superseded 2026-09-04)

The checked and unchecked boxes in this subsection preserve the 2026-09-03
pre-publication gate exactly. They are evidence of the sequence, not current
release requirements; the publication checklist above is current.

- [x] Work began from accepted Plan 06 checkpoint
  `ee176f52ab79e08e818fc919f44b7723f9fc9865`; its tracked tree was clean and
  the unrelated Agent 10 `docs/plans/10-*` and `docs/plans/assets/` files were
  left untouched. During final capture, a parallel doc-only playtest commit
  advanced `main` to `ab20f28372c93e341b13e3cf2d2c94ea71703bb2`; its three
  playtest documents contain no runtime change and remain outside this pass.
- [x] `docs/ART_BIBLE.md` defines the static world grammar, palette/contrast,
  lines, values, materials, perspective, proportions, motifs, family DNA,
  optical icons, source profiles, registration, alpha, versions, budgets,
  lighting/animation/performance handoffs, and rollback rules.
- [x] `docs/characters/AME_MODEL_SHEET.md` records Candidate C as the
  Human-approved design direction. It fixes golden-blonde/blue-eye swatches,
  face/hair/costume landmarks, front/side/back construction, eight expressions,
  pivot, safe zones, hand socket, secondary-motion envelopes, and proof sizes.
- [x] Current `/assets/ame.png` remains the active historical v01 pointer. No
  pending candidate, comparison, proof, or model-sheet study is in `public/`,
  and no approval-dependent Ame family was produced.
- [x] Candidate A, B, and C originals and both retained construction-study sets
  are immutable source evidence. Exact available prompts/output IDs/reference
  hashes are appended rather than rewriting historical prompt sections; unknown
  generator model/version/seed and owner licence review remain explicit.
- [x] The catalogue has a compatibility-preserving rich sprite contract for
  current Ame and lock canaries, one object-identical lock-pair authority, and
  measured static accessibility cues for all four hazards. Gameplay identity,
  defaults, URLs, labels, fingerprints, and level-scoped preload behaviour are
  unchanged.
- [x] Structured source records use independent runtime/source/approval states;
  the deterministic manifest inventories every current runtime image and source
  asset without treating repository first-seen time as generation time.
- [x] `npm run art:test` passed 51 tests; deterministic Candidate C derivatives
  and proofs regenerated; a second candidate build refused overwrite; and
  non-writing `npm run art:check` passed 126 records with zero errors and 398
  explicit historical/pending warnings. All
  Candidate C and wider-family canaries were inspected at source/actual size.
- [x] Completed in-app-browser review of current gameplay and the source-only
  Candidate C proof harness at 844x390, 960x540, and 1280x720; retain console and
  screenshot evidence under ignored `artifacts/art-proofs/`.
- [x] `npm run check` passed 400 tests across 34 files plus the production build
  on its uncontended rerun; `npm run check:desktop`, the shared performance
  contract/budget/evidence checks, scenario fixtures, final external inventory,
  and `git diff --check` passed. The first contended web run is retained as a
  rejected run because three solver tests exceeded timeouts; every completed
  assertion passed, and the isolated failing files plus exact rerun passed.
- [x] **Human/Ame:** approved Candidate C on 2026-09-03 after reviewing its face,
  age, golden-blonde shoulder-brushing layers, clearly blue irises, costume,
  silhouettes, expressions, registration, hand socket, and alpha/actual-size
  proofs. Actual Human wording: “I've reviewed the images and comparison sheets
  and I'm happy with the reccomendations.” Recorded outcome: Candidate C is the
  canonical static Ame v02 design direction.
- [x] The Human-supplied PPBA specification was inspected at exact commit
  `dacc8cf644d24d56aae34ba757efb4fac5f9d341`. Its craft/process lessons and
  explicit no-copy boundary are recorded in
  `research/2026-09-03-ppba-art-craft-synthesis.md`; no external pixel, prompt,
  identity, palette, UI skin, or runtime dependency was imported.
- [x] Preserve the completed v08 comparison packet at
  `artifacts/art-proofs/mgjrpg-02/v08/` as rejected decision evidence. The Human
  rejected its near-black delivery-size post-process contours and substantially
  unchanged historical interiors as a meaningful style choice; v08 is not a
  rendering authority and must not seed later art.
- [x] Archive the exact prompts, hashes, ordered reference roles, run record, and
  twelve immutable generator-original sheets for the source-only authored
  directions: A — Luminous Storybook Cel, B — Soft Jewel Gouache, and C — Chunky
  Enamel Adventure. Candidate C remains the sole approved Ame identity and
  construction authority; the rendering options may not change it.
- [x] Build and validate the consolidated `v11` comparison packet at
  `artifacts/art-proofs/mgjrpg-02/v11/`. Compare all three authored directions at
  source and actual delivery sizes, including contour/background close-ups,
  face preservation, alpha contamination, recognition, value grouping,
  material truth, family coherence, and encoded/decoded cost. Do not treat a
  cutout proof or sampler-sheet cell as a production master. The packet binds
  12 generator originals and the seven-source comparison layout, passes the
  authored-options integrity contract, and records that opaque RGB boards do
  not prove production alpha or terrain seams.
- [ ] Confirm the proposed `storybook-local-contour-v1` direction uses visibly
  lighter/brighter material-local contours through Maze's warm-gold,
  aubergine, blue-plum, russet-plum, leaf-plum, and cream-mauve families;
  reserves darkest ink for critical detail/contrast; remains continuous at
  authoritative delivered widths; and contains no uniform black edge, rainbow
  fragmentation, halo, matte contamination, or field-sprite sticker cutline.
  Confirm semantic UI uses clean cream sticker cutlines while terrain/hazards
  use material boundaries/seams rather than enclosing actor outlines.
- [x] Record the Human's `v11` narrowing exactly: Direction A for most core and
  current-family sprites; Direction C for the traditional slime, sword lizard
  man, and green-tea-drinking skeleton; Direction B future-enemy concepts except
  Direction A for the wholesome succubus; future enemies re-authored with A's
  chunky, high-chroma material-contour grammar and restrained B colour/shading;
  and retained top-down flower-petal floor-pad teleporters rather than upright
  portal doors.
- [x] Record Ame's Direction B preference, the request for a fresh non-edit base
  to avoid accumulated edit texture, and the explicitly permitted prior-B
  fallback. The bounded source-only `v14` packet compares that prior B against
  two independent fresh attempts; both drift Candidate C's locked construction,
  so prior B is the art-direction recommendation. The enemy hybrid remains
  direction evidence pending simplification, and the flower-pad hybrid confirms
  category rather than production pixels.
- [ ] Obtain explicit Human approval, narrowing, or rejection of the `v14`
  recommendation before broad family production. Selecting a rendering grammar
  does not approve checkerboard generator originals as runtime pixels. Do not
  reopen Candidate C identity, relabel historical `mgjrpg-01` sources, publish a
  candidate, switch a catalogue pointer, retire an old asset, or claim a runtime
  byte/residency change at this gate. The current `public/` and decoded-runtime
  art delta is exactly zero.
- [ ] Produce an approved versioned runtime
  derivative, obtain a public-byte allocation, switch the catalogue atomically,
  and release dependent Plan 03 static work. Plan 05 animation still waits for
  completed Plan 03 plus its UI, lighting, VFX, and controls predecessors.
- [ ] Broad friend, cage, enemy, weapon, navigation, hazard, terrain, reward,
  portrait, and story replacement phases remain gated; no old runtime file is
  deleted in this candidate.

## Unreleased gameplay-systems candidate

- [x] This accepted implementation candidate began from manager checkpoint
  `555cdd622a98bd77585f2e60f1096712392d71b3` on `main`. This section does not
  claim a public release or accepted hardware-timing cohort.
- [x] All 16 authored mazes have an engine-derived ordinary solution with zero
  rescues and a perfect solution with exactly every available friend.
- [x] Chapter 1 is a complete 6×6 whole-board onboarding maze; camera/fog begins
  only when a later maze exceeds six tiles.
- [x] The Power-99 finale is a 61-input ordinary / 77-input perfect hub-and-return
  plan with seven ordered guardians and five genuinely optional rescues.
- [x] Stable object identity, content revisions/fingerprints, campaign-order
  history, progress schema v4, active-run schema v2, and current-layout versus
  historical route records have migration coverage.
- [x] Required Path uses four replayable tiers and exact engine transitions;
  ordinary hint routes never prioritize optional content.
- [x] Corner assistance is restricted to safe, non-exit ordinary floor that
  cannot begin a new interaction. Blocker feedback reserves its modal for the
  third repeat, and stronger-enemy repeats remain safe without reopening it.
- [x] Fixed Surprise seeds, route-quality metrics, semantic performance
  checkpoints, and documentation-consistency surfaces are covered.
- [x] Final candidate validation on 2026-09-02: `npm run check` passed 397/397
  tests across 34 files plus TypeScript and the production build;
  `npm run perf:check` passed at 119,779 / 119,840 allocated gzip-9 JavaScript
  bytes, 29,206 / 29,235 CSS bytes, and exactly 89,394,012 public-runtime bytes;
  scenario fixtures passed 4/4; `npm run check:desktop` passed; and
  `git diff --check` passed.
- [x] A manager production-preview smoke check—not a performance timing
  cohort—confirmed modal input gating, a saved/reloaded one-step active run,
  tier-4 hint persistence, semantic rendering at 1024×768 and 844×390, and zero
  browser warning/error logs. Timing remains contaminated/report-only.
- [ ] Complete child/family sessions from `GAMEPLAY_DESIGN_SPEC.md`, including
  Chapters 1, 2, 3, 7, 9, 10–13, 15–16 and fixed Surprise seeds.
- [ ] Repeat physical iPad, landscape-phone, keyboard, mouse, touch, browser,
  WebView2, reduced-motion, and listening checks. Automated evidence is not a
  substitute for those device/child gates.

## 0.19.0 verification record

- [x] Version 0.19.0 is aligned in npm, Cargo, Tauri, and the visible label.
- [x] Water uses moving cool-white ripple bands; lava uses internal shimmer
  veins and pulsing hot cores without an outline or cast shadow; poison uses
  four staggered rising-and-popping bubble rhythms.
- [x] Heart, Star, and Sun keys and doors share distinct typed glow colours and
  motif cues. Door opening uses an 860 ms edge bloom and eighteen deterministic
  colour/motif particles, with a static reduced-motion treatment.
- [x] `npm run check`: 316/316 tests pass across 27 files; strict TypeScript and
  Vite production builds pass. `npm audit --omit=dev`: zero vulnerabilities;
  `npm ls` and `cargo check --locked` pass.
- [x] Local browser QA at 1280 × 720 walked onto live lava and water, inspected
  the Blue Star Key glow and opening burst, and verified poison animation
  contracts. A 1024 × 768 iPad viewport has no document overflow; warning and
  error logs are empty.
- [x] Release commit `288e653` was pushed to GitHub `main` and auto-deployed by
  Vercel. The canonical JavaScript is `index-DyaTff51.js`, reports 0.19.0, and
  its CSS/JavaScript contain all four new visual-effect contracts.
- [x] `Maze-so-Puzzle-0.19.0-portable.exe`: 97,871,360 bytes, file/product
  version 0.19.0, SHA-256
  `2E89AB011E20A6EB4C6E066D6221E21147BC8DBDED24A053C74472EEE6E73916`.
- [x] `Maze-so-Puzzle-0.19.0-setup.exe`: 91,784,124 bytes, file/product version
  0.19.0, SHA-256
  `5C1DA8D296EE241EA8FBD337072837C70CDBDCE44B2FF8FB164138C969F46069`.
- [x] Both staged binaries byte-match the final Tauri outputs. The portable app
  stayed responsive for five seconds with the correct window title.
- [ ] Clean-machine install, signing, and physical-device play testing remain
  owner/device checks.

## 0.18.0 verification record

- [x] Version 0.18.0 is aligned in npm, Cargo, Tauri, and the visible label.
- [x] Every pickup family maps to its real sprite, and the larger on-map notice
  keeps that sprite and text together through the complete float-and-fade.
- [x] Successful combat shows the exact `+X!` Power reward over Ame after the
  final transfer; browser QA observed `+1!` after a 2 + 1 = 3 battle.
- [x] Golden Heart, Storybook Wood, Moon Silver, and Garden Vine use distinct
  complete cage fronts with top/bottom rails, connected bars, central locks,
  and transparent openings. All runtime files are 512 × 512 lossless WebP with
  full alpha range.
- [x] `npm run check`: 314/314 tests pass across 26 files; strict TypeScript and
  Vite production builds pass. `npm audit --omit=dev`: zero vulnerabilities;
  `npm ls` and `cargo check --locked` pass.
- [x] Local browser QA at 1280 × 720 and 1024 × 768 covered pickup, cage,
  rescue, and combat-reward moments without warning or error logs.
- [x] Release commit `a05061e` was pushed to GitHub `main` and auto-deployed by
  Vercel. The canonical bundle reports 0.18.0; all four new cage WebPs return
  HTTP 200 and exactly match their local byte sizes.
- [x] `Maze-so-Puzzle-0.18.0-portable.exe`: 97,869,312 bytes, file/product
  version 0.18.0, SHA-256
  `582C7ACCDA45D71CDC2BB26A759B6F20EF3D8872868B87AFFE3A637FEB56C4E4`.
- [x] `Maze-so-Puzzle-0.18.0-setup.exe`: 91,782,678 bytes, file/product version
  0.18.0, SHA-256
  `BB791B1F4DE256EA3F1FD1A5D599D848D37BEE2446DF123832138EE89287D745`.
- [x] Both staged binaries byte-match the Tauri outputs. The portable app stayed
  responsive for five seconds with the correct window title.
- [ ] Clean-machine install, signing, and physical-device play testing remain
  owner/device checks.

## 0.17.0 verification record

- [x] Version 0.17.0 is aligned in npm, Cargo, Tauri, and the visible label.
- [x] All 15 sticker, medal, and badge IDs have distinct rendered art; all 14
  new runtime files are 512 × 512 transparent lossless WebP.
- [x] Adventure Book, title, help, in-game status, feedback, lock, and completion
  surfaces use illustrated local assets instead of functional emoji placeholders.
- [x] `npm run check`: 312/312 tests pass across 25 files; strict TypeScript and
  Vite production builds pass. `npm audit --omit=dev`: zero vulnerabilities;
  `npm ls` and `cargo check --locked` pass.
- [x] Desktop and iPad browser compositions are readable, new art remains crisp,
  and local browser warning/error logs are empty.
- [x] GitHub `main` release commit `512a02e` auto-deployed through Vercel. The
  canonical bundle reports 0.17.0; all 14 new achievement WebPs return HTTP 200
  with the expected media type and exact local byte sizes.
- [x] `Maze-so-Puzzle-0.17.0-portable.exe`: 97,084,416 bytes, file/product
  version 0.17.0, SHA-256
  `6BA5646F19190D508A72F9E1D4B6B6F464E1141C279EE0575F7218282779A7FD`.
- [x] `Maze-so-Puzzle-0.17.0-setup.exe`: 90,987,042 bytes, file/product version
  0.17.0, SHA-256
  `723B21F355BA941BE10B3EC180ABBB639C111780EC389BE45C47AFB8386E7F9D`.
- [x] Both staged binaries byte-match the Tauri outputs. The portable app stayed
  responsive for five seconds with the correct window title.
- [ ] Clean-machine install, signing, and physical-device play testing remain
  owner/device checks.

## 0.16.1 verification record

- [x] Version 0.16.1 is aligned in npm, Cargo, Tauri, and the visible label.
- [x] All thirteen full-length MP3s in `public/assets/ost/` appear exactly once
  in the maze playlist; the short friendship cue remains excluded.
- [x] The seeded shuffle bag uses every song before refilling, advances when a
  maze is entered or revisited, and avoids immediate repeats at title/Book and
  cycle boundaries. Muting and unmuting do not consume another song.
- [x] The title prepares the harbour theme without constructing media and starts
  it from the first browser-permitted pointer or keyboard gesture.
- [x] `npm run check`: 311/311 tests pass across 25 files; strict TypeScript and
  Vite production builds pass. `npm audit --omit=dev`: zero vulnerabilities;
  `npm ls` and `cargo check --locked` pass.
- [x] Local browser navigation produced no warnings or errors; audible listening
  remains a physical-device check.
- [x] GitHub `main` commit `44c1023` auto-deployed through Vercel. The canonical
  bundle reports 0.16.1, and all fourteen OST MP3s return HTTP 200 as
  `audio/mpeg` with live byte sizes matching the local files.
- [x] `Maze-so-Puzzle-0.16.1-portable.exe`: 92,971,520 bytes, file/product
  version 0.16.1, SHA-256
  `6A24526027B040C046B28775757BC89C0DEC9039DFF729FDCE12ABE43517F58B`.
- [x] `Maze-so-Puzzle-0.16.1-setup.exe`: 86,835,740 bytes, file/product version
  0.16.1, SHA-256
  `B9349B4C9D1811A6CF531C61664D185FD7C0E96C0A05215A71A4712F05667704`.
- [x] Both staged binaries byte-match the Tauri outputs. The portable app stayed
  responsive for five seconds with the correct window title.
- [ ] Clean-machine install, signing, and physical-device soundtrack listening
  remain owner/device checks.

## 0.16.0 verification record

- [x] Version 0.16.0 is aligned in npm, Cargo, Tauri, and the visible label.
- [x] All 15 friend species, 12 enemy looks, and 12 terrain themes appear in the
  authored campaign; exhaustive tests require a personality mapping for every
  typed friend and enemy ID.
- [x] Four new transparent character WebPs, four enemy WebPs, four seamless
  terrain PNGs, and two transparent dressing PNGs pass their reproducible asset
  processors and dimension/alpha/seam checks.
- [x] Large-maze exploration mounts only camera-window objects. A 21×23 browser
  sample mounted 7 visible object layers instead of all 19 level objects.
- [x] Desktop, iPad, portrait-phone, and landscape-phone browser QA has no page
  overflow or console warnings/errors. The 15-species Book grid remains crisp.
- [x] GitHub `main` commit `496edbb` auto-deployed through Vercel. The canonical
  JavaScript reports 0.16.0 and all fourteen new runtime assets return HTTP 200
  with the expected WebP/PNG content types and exact byte sizes.
- [x] `npm run check`: 311/311 tests pass across 25 files; strict TypeScript and
  Vite production builds pass. `npm audit --omit=dev`: zero vulnerabilities;
  `npm ls` and `cargo check --locked` pass.
- [x] `Maze-so-Puzzle-0.16.0-portable.exe`: 92,971,008 bytes, file/product
  version 0.16.0, SHA-256
  `40349805178DE843C3C72FC941EC21DF0DFB1C2FDABE425A930BDE47BC2239AC`.
- [x] `Maze-so-Puzzle-0.16.0-setup.exe`: 86,837,525 bytes, file/product version
  0.16.0, SHA-256
  `40DD871085A3F4031E132897FBD4B30FC77DC1799ED3BB587B24B1DF91493C62`.
- [x] Both staged binaries byte-match the Tauri outputs. The portable app stayed
  responsive for five seconds with the correct window title.
- [ ] Clean-machine install, signing, and the complete physical-device campaign
  remain owner/device checks.

## 0.15.0 verification record

- [x] Version 0.15.0 is aligned in npm, Cargo, Tauri, and the visible build label.
- [x] Engine movement leaps every consecutive hole in the chosen cardinal
  direction and lands on the first valid tile; it never turns during a jump.
- [x] Authored perfect-rescue routes exercise one-, two-, and three-hole jumps.
  Lanternlight includes a hole with all four neighbouring squares open, and
  Twilight Treasure Loop includes a three-hole gate.
- [x] Forty deterministic adventure seeds collectively produce all three hole
  run lengths, while every sampled ordinary and all-friends route remains safe.
- [x] Jump presentation duration and height increase with the emitted hole count;
  focused tests cover clamping, arc progression, three-hole traversal, and the
  straight four-way junction case.
- [x] Otter, Lamb, Capybara, Acorn Knight, Bubble Dragon, Candy Mimic, Comet
  Spear, Bubble Bow, and Cupcake Mace have unique typed catalogue IDs, labels,
  transparent 512×512 runtime PNGs, archived masters, and recorded prompts.
- [x] The campaign and generator exercise all 11 friend, 8 enemy, and 8 weapon
  styles without changing combat or save semantics.
- [x] `npm run check`: 309/309 tests pass across 24 files; strict TypeScript and
  the Vite production build pass.
- [x] `npm audit --audit-level=moderate`: zero vulnerabilities. `npm ls`: clean.
  `cargo check --locked`: passed.
- [x] Desktop 1280×720 keeps the fixed stage viewport-exact with no document
  overflow. All nine new production-preview sprite requests return HTTP 200 as
  `image/png`.
- [x] GitHub `main` commit `42775f7` auto-deployed through Vercel. The canonical
  title reports 0.15.0, its tester lists all 16 story mazes, the 1280×720
  document is viewport-exact, and every new sprite URL returns HTTP 200.
- [x] `Maze-so-Puzzle-0.15.0-portable.exe`: 87,775,744 bytes, file/product
  version 0.15.0, SHA-256
  `CABF7455078CA025BC2194059B3758843728DF97298CFED9DF986C7F4B6FF1AE`.
- [x] `Maze-so-Puzzle-0.15.0-setup.exe`: 81,614,537 bytes, file/product version
  0.15.0, SHA-256
  `7F935CCB84E41F04142587C920C5FF1EF6AADB6E5FF8A3722B3EEF7D77FB3AE1`.
- [x] Both staged binaries byte-match their final Tauri outputs. The portable
  app stayed responsive for five seconds and reported the correct window title.
- [ ] Clean-machine install, code signing, physical-device listening/feel, and
  the complete manual campaign remain owner/device checks.

## Historical 0.14.0 verification record

- [x] Version 0.14.0 is aligned in npm, Cargo, Tauri, and the visible build label.
- [x] `ABSOLUTE_MAZE_SIZE_LIMIT` is 24 and the structural validator rejects
  oversized authored or generated levels. Generated odd topology caps at 23.
- [x] Every authored maze is at most 23×23. Lanternlight Labyrinth is rebuilt at
  23×23 with ordinary/perfect routes of 173/217 inputs.
- [x] Later generated mazes carve deterministic 2×2–4×4 rooms and identify room,
  treasure-room, monster-room and return-stronger mechanics.
- [x] Lanternlight's upper chamber contains two rescues, two treasures and its
  Power 10 guardian; the ordinary route can still skip optional rescues.
- [x] Maze Select calls Surprise Mazes procedurally generated. The Adventure Book
  explains the infinite seeded catalogue and shows up to six recent records.
- [x] `npm run check`: 304/304 tests pass across 23 files; strict TypeScript and
  the Vite production build pass.
- [x] `npm audit --audit-level=moderate`: zero vulnerabilities. `npm ls`: clean.
  `cargo check --locked`: passed.
- [x] Desktop 1280×720 and iPad 1024×768 keep Lanternlight and the procedural
  scrapbook inside the fixed stage with no document overflow or browser errors.
- [x] GitHub `main` commit `0a6168b` auto-deployed through Vercel. The canonical
  title reports 0.14.0, its tester lists the 23×23 Lanternlight and every one of
  the 16 story mazes, and the live Adventure Book includes the procedural
  Surprise Maze scrapbook. The 1280×720 production document has no overflow.
- [x] `Maze-so-Puzzle-0.14.0-portable.exe`: 85,587,456 bytes, file/product
  version 0.14.0, SHA-256
  `608BB7648D210FF3FA54C8030D3E4CC0F05B96752A70021DE9BE072521D95620`.
- [x] `Maze-so-Puzzle-0.14.0-setup.exe`: 79,415,152 bytes, file/product version
  0.14.0, SHA-256
  `97FEDB5C34C30849608FD4EA23AF42004A999929FF7FE6BE39CCAAB033746A31`.
- [x] Both staged binaries byte-match their final Tauri outputs. The portable
  app stayed responsive for five seconds and reported the correct window title.
- [ ] Clean-machine install, code signing, physical-device listening/feel, and
  the complete manual campaign remain owner/device checks.

## Historical 0.13.0 verification record

- [x] Version 0.13.0 is aligned in npm, Cargo, Tauri, and the visible build label.
- [x] Every authored story maze has exactly one ordered lore entry with two
  concise read-aloud paragraphs, a silly character quote, educational Puzzle
  Power, conversation prompt, and victory epilogue.
- [x] New curated starts show their chapter. Resume, restart, Surprise Maze and
  tester starts remain interruption-free, while Story reopens any chapter.
- [x] One tap anywhere or one ordinary key skips a chapter without moving Ame
  or adding a step; Tab and modified shortcuts retain accessibility behaviour.
- [x] Sprig and Professor Poggle use original generated portraits with archived
  masters, exact prompts, deterministic processing, and optimized local WebP
  runtime files.
- [x] `npm run check`: 302/302 tests pass across 23 files; strict TypeScript and
  the Vite production build pass.
- [x] `npm audit --audit-level=moderate`: zero vulnerabilities. `npm ls`: clean.
  `cargo check --locked`: passed.
- [x] Story cards 1, 10, and 16 fit at desktop 1280×720, iPad 1024×768, and
  landscape phone 844×390 without scrolling; gameplay retains its fixed stage.
- [x] GitHub `main` commit `32b2d66` auto-deployed to Vercel. The canonical
  title reports 0.13.0; Chapter 10 opens with Professor Poggle, and an ArrowRight
  skip closes it without moving Ame or changing the zero-step counter. Both new
  portrait WebPs return HTTP 200 at their expected byte sizes.
- [x] `Maze-so-Puzzle-0.13.0-portable.exe`: 85,586,432 bytes, file/product
  version 0.13.0, SHA-256
  `6B7D6C30DC10854845314547A2550F9EE340189BED8C66D83E6719EDDA608EF0`.
- [x] `Maze-so-Puzzle-0.13.0-setup.exe`: 79,415,143 bytes, file/product version
  0.13.0, SHA-256
  `7310066CFC3DC12F4518821F894A15B6CD10AFE9DCCF19129527E7F7A782BE26`.
- [x] Both staged binaries byte-match their final Tauri outputs. The portable
  app stayed responsive for five seconds and reported the correct window title.
- [ ] Clean-machine install, code signing, physical-device listening/feel, and
  the complete manual campaign remain owner/device checks.

## Historical 0.12.0 verification record

- [x] Version 0.12.0 is aligned in npm, Cargo, Tauri, and the visible build label.
- [x] Sixteen authored story mazes are solver-valid. Rainbow Power Parade's
  perfect route exceeds 300 inputs, defeats all 19 enemies, rescues five
  friends, opens its required door, and finishes at Power 306.
- [x] Gold and Science treasure collection is immutable, save-safe, reward-safe,
  sound-backed, and excluded from the solver signature because it cannot change
  traversability.
- [x] Every blocker maps to the exact required item art and name; its third
  repeat reveals a pulsing minimap target that clears when collected.
- [x] Level Select includes unlocked numbered/named story mazes, best steps,
  rescue totals, perfect status, and Surprise Maze from both Home and play.
- [x] Directional lighting, wall depth and character shadows are deterministic
  per maze; Power 99 activates the readable rainbow aura.
- [x] The nine new generated masters, transparent lossless WebP derivatives,
  exact prompts, reference modes and deterministic processing are archived.
- [x] `npm run check`: 298/298 tests pass across 22 files; strict TypeScript and
  the Vite production build pass.
- [x] `npm audit --audit-level=moderate`: zero vulnerabilities. `npm ls`: clean.
  `cargo check --locked`: passed.
- [x] Desktop 1280×720, iPad 1024×768, and landscape phone 844×390 retain the
  fixed composition without page overflow or panel overlap. Browser logs are
  clear of warning/error entries.
- [x] GitHub `main` commit `2a3110a` auto-deployed to Vercel. The canonical
  title reports 0.12.0, the picker lists all sixteen mazes, Rainbow Power Parade
  opens with five friends and nineteen enemies, and representative new WebP
  treasure/navigation assets return HTTP 200.
- [x] `Maze-so-Puzzle-0.12.0-portable.exe`: 85,447,680 bytes, file/product
  version 0.12.0, SHA-256
  `4BE70602349AFA1A133024F0FB0B60356AD20809ACEC48EC2E85940AAFB3D3F6`.
- [x] `Maze-so-Puzzle-0.12.0-setup.exe`: 79,272,384 bytes, file/product version
  0.12.0, SHA-256
  `FA935AC313BEFD1415C1BF0FF797A8677F0F7B9F6E085FF1520C4E10EFD6F992`.
- [x] Both staged binaries byte-match their final Tauri outputs. The portable
  app stayed responsive for five seconds and reported the correct window title.
- [ ] Clean-machine install, code signing, physical-device listening/feel, and
  the complete manual campaign remain owner/device checks.

## Historical 0.11.0 verification record

- [x] Version 0.11.0 is aligned in npm, Cargo, Tauri, and the visible build label.
- [x] Fifteen authored story mazes use the deliberately varied size sequence 9,
  11, 13, 15, 13, 15, 17, 17, 19, 25, 21, 23, 15, 17, and 21.
- [x] Rose Heart Roundabout, Clover Comeback Carnival, and Friendship Crown
  Vault have solver-proven ordinary/perfect routes of 105/117, 103/177, and
  231/260 inputs. Ordinary routes rescue zero optional friends; perfect routes
  rescue all three, four, and five friends respectively.
- [x] Every portal pair used by a level occurs exactly twice; unmatched pairs
  are rejected, and disconnected geometry can be solved only through the exact
  engine teleport transition.
- [x] Portal travel is covered across engine events, solver search, fog reveal,
  minimap motifs, active-run recovery, save-stride validation, hints, art
  preloading, synthesized sound, and the cancellable arrival presentation.
- [x] The 6 × 6 camera clips and translates one full rendered maze world.
  Logical-coordinate pointer mapping and direction hysteresis are covered at
  both native and scaled board bounds.
- [x] Thirteen full local OST tracks participate in per-maze rotation; the short
  friendship cue remains excluded from background looping.
- [x] Rose Heart, Mint Clover, and Violet Moon portal masters and exact prompts
  are archived. The 512 × 512 runtime files have full alpha range and fully
  transparent canvas edges after deterministic processing.
- [x] `npm run check`: 292/292 tests pass across 22 files; strict TypeScript and
  the Vite production build pass.
- [x] `npm audit --audit-level=moderate`: zero vulnerabilities. `npm ls`: clean.
  `cargo check --locked`: passed.
- [x] Desktop 1280×720, iPad 1194×834, and landscape phone 844×390 retain the
  fixed composition without page overflow or panel overlap. Visible assets load
  and browser logs contain no warning/error entries.
- [x] GitHub `main` commit `934a7db` auto-deployed to the canonical Vercel site.
  The public label reports 0.11.0, the tester picker lists all fifteen mazes,
  Rose Heart Roundabout opens, and all three portal sprites plus a new OST track
  return HTTP 200 with the correct content types.
- [x] `Maze-so-Puzzle-0.11.0-portable.exe`: 84,777,984 bytes, file/product
  version 0.11.0, SHA-256
  `A64876899DE43C93E67D8D1B40201603DED39D3A496EB14E9D3CABD4CD02E331`.
- [x] `Maze-so-Puzzle-0.11.0-setup.exe`: 78,599,010 bytes, file/product version
  0.11.0, SHA-256
  `EAEEF9B96716712DC05964652E4830631395970D8DC192A466695CC0AE58469B`.
- [x] Both staged binaries byte-match their final Tauri outputs. The portable
  app stayed responsive for five seconds and reported the correct window title.
- [ ] Clean-machine install, code signing, physical-device listening/feel, and
  the complete manual campaign remain owner/device checks.

## Historical 0.10.3 checklist

## 1. Prepare

- [x] Confirm the 0.10.3 source version in `package.json`, `package-lock.json`,
  `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json`.
- [x] Confirm the title screen displays the optimized
  `public/assets/title-background-v1.webp`, while the PNG master remains at
  `docs/source-assets/title-background-v1.png` for provenance and future edits.
- [x] Confirm the 0.10.3 bundle contains continuous world-aligned SVG terrain,
  rounded convex and concave joins, periodic paired textures, connected hazards
  without outlines, lips, shadows, or filters, stronger floor/wall contrast,
  picture-first UI, a held-weapon overlay, pet followers, opaque AI-generated
  cage-front layers, Spring Boots/hole overlays, poison/Antidote Leaf art, and
  locally bundled OST files.
- [x] Confirm the terrain catalogue assigns each floor and wall a dominant-colour
  family and measured lightness, rejects yellow/gold with green/sage or rose in
  either direction, and keeps every navigable floor at least eight points lighter
  than its wall.
- [x] Rebuild all ten floor/wall paintings with periodic Poisson correction and
  validate their 1024 px opacity/repeat boundaries. Validate both 512 px RGBA
  garden/ivy dressings and transparent repeat edges; retain their ImageGen
  masters, exact prompts, output IDs, and deterministic processing scripts.
- [x] Confirm all twelve story mazes each have exactly one weapon, carry the
  authored 1–5 friend total, and collectively cover five weapons, five friendly
  enemy looks, eight species, and four cage styles.
- [x] Confirm the authored size sequence is 9, 11, 13, 15, 13, 15, 17, 17, 19,
  25, 21, and 23, with deliberately smaller breathers among the large mazes.
- [x] Confirm later authored levels put selected prerequisites and optional
  guardians on separate branches, Spring Boots precede every required hole run,
  and both ordinary and every-friend rescue routes remain solver-validated.
- [x] Confirm every maze larger than 6 tiles renders a 6 x 6 player-centred
  camera and persistent fog-of-war minimap without changing full-grid engine
  behaviour.
- [x] Confirm Surprise Maze seeds select varied unlocked odd sizes from 9 through
  29, never reach 30, place connected 2–4 tile water/lava regions only after the
  matching splash boots, and place one- or two-square hole runs only after
  Spring Boots while preserving ordinary/perfect routes.
- [x] Confirm the title-screen build label and exact `?debug=mazes` query expose
  the direct twelve-maze tester picker, and tester completion cannot write rewards,
  records, unlocks, active sessions, or progress.
- [x] Update release/audit records for 0.10.3 while leaving unfinished release
  gates clear.
- [x] Archive the built-in ImageGen Spring Boots and ground-hole masters, retain
  their prompt records, and validate/downsample transparent runtime copies with
  `scripts/process_traversal_assets.py`.
- [x] Confirm every selected Plan 03 publication source has exact recorded
  provenance and that its technical provenance review found no incorporated
  third-party pixels or requested franchise, logo, living-artist, proprietary
  palette, UI-layout, or composition dependency.
- [ ] Before inviting external reuse or redistribution, the owner must still
  choose and publish outward-facing source-code and asset licence terms. The v6
  review authorizes the selected derivatives for this project's runtime; it is
  not an open-content licence or third-party legal opinion.
- [x] Review `git status --short` if the folder is under version control; preserve
  intentional local work and remove no user-owned files.
- [ ] Start from a clean dependency install with `npm ci`.

## 2. Automated verification

Run each command from the project root in PowerShell:

```powershell
npm run check
npm run perf:check
npm audit
npm run check:desktop
```

- [x] `npm run check` reports that the complete unit suite passes and that
  TypeScript and the Vite production build complete without errors.
- [x] Pass 07A `npm run perf:check` validates the S01–S11 semantic fixture
  contract, feature-allocation ledger, retained evidence, and build provenance,
  then enforces the current compressed JS/CSS and complete `public/` no-growth
  ceilings. Run it immediately after the production build; this is a
  deterministic byte/evidence gate, not a timing claim.
- [ ] Before a future performance-qualified release, attach accepted clean-host
  web and Tauri manifests for the exact release commit. Contaminated/report-only
  rows and Edge browser timing cannot substitute for WebView2 results.
- [x] Dependency audit output for the exact 0.10.3 source is reviewed at the
  moderate threshold: zero vulnerabilities.
- [x] `npm ls` for 0.10.3 is reviewed; only expected optional cross-platform
  packages are unmet.
- [x] `npm run check:desktop` completes `cargo check --locked` without errors for
  the exact 0.10.3 source.
- [x] `npm run desktop:build` produces the 0.10.3 release executable and NSIS
  installer; the portable/setup artifacts are staged, hashed, and smoke-tested.
- [x] Automated level checks validate all twelve story mazes in the 9, 11, 13,
  15, 13, 15, 17, 17, 19, 25, 21, and 23 tile sequence, with separate ordinary
  and every-friend solutions, exactly one weapon, and the intended 1–5 distinct
  pet species in each maze.
- [x] Authored-level checks validate the optional Wishing Woods guardian route
  and solver-verified out-and-back progression in Wishing Woods, Ame's Grand
  Parade, Springstep Sky Hollow, and Lanternlight Labyrinth. Their ordinary and
  all-rescue route lengths are 114/148, 116/136, 190/214, and 290/322.
- [x] Generator checks prove repeated seeds reproduce terrain, weapon, enemy,
  cage, varied 9–29 size, branch prerequisites, connected 2–4 tile water/lava,
  and post-Spring-Boots hole choices without perturbing layout or progression
  determinism or solver validity.
- [x] Focused exploration tests cover an even 6 x 6 window, its defined centre
  bias, edge clamping,
  current field of view, and persistent reveal accumulation; the production
  browser pass must still confirm reveal reset on level switch.
- [x] Focused control tests cover dead-zone limits, all four dominant directions,
  shared 220 ms release timing, smooth 160–100 ms held acceleration, direction
  resets, queued steering, and strict one-tile wall-only corner assistance.
  Follower-trail tests cover bounded, loop-free, distinct placement. Physical
  mouse/touch pointer capture, repeat timing, and cancellation still require the
  device checks below.
- [x] Combat-presentation checks prove three distinct contacts, deterministic
  sound cues, monotonic conserved enemy-to-Ame transfer, enemy Power `0`, exact
  final engine Power, and the short reduced-motion handoff.
- [x] Jump-audio checks prove the four pitch-swept voices, 280 ms audible end,
  mute behavior, and failure isolation; local browser timing shows the 540 ms
  arc before a chained landing interaction.
- [x] Repeat the relevant checks after the integrated 0.10.3 source changes
  (`npm run check`: 267 of 267 tests across 20 files plus strict TypeScript and
  the Vite production build).
- [x] Repeat `npm run check` once more if browser QA or release packaging causes
  any additional source, asset, configuration, or lockfile change.

## 3. Browser play test

Test the production preview, not only the development server:

```powershell
npm run preview
```

0.10.3 browser QA record (2026-09-01): desktop 1280×720, iPad 1194×834,
and landscape-phone 844×390 checks have no document overflow or overlapping UI.
Browser warning/error logs are clear and every visible image loaded. The title
and Adventure Book reset entries opened the warning modal correctly; the
destructive confirmation was deliberately not clicked. The pickup toast and v4
front-only cage were also visually verified. GitHub `main` commit `3f61cbd`
auto-deployed successfully: the canonical 0.10.3 site passed focused 1194×834
and 844×390 bounds, tester-picker, visible-image, v4-cage, and browser-log checks.
Physical-device feel remains separate.

- [x] 960 x 540: the maze and side panel fit without page overflow or clipping.
- [x] 1280 x 720: default layout is balanced and has no page overflow.
- [x] 667 x 375 and 844 x 390: the same fixed 960 × 540 composition scales into
  the safe viewport with horizontal letterboxing where needed, no document
  overflow, and no board/sidebar intersection.
- [x] 740 x 360: the same phone-layout checks pass locally.
- [x] 1024 x 768 local: the stage is exactly 1024 × 576 at y=96; sidebar rows,
  maze, controls, and large victory friend cards do not overlap.
- [x] 1180 x 820: the same iPad-size layout checks pass locally.
- [x] 1194 x 834: the 0.10.3 iPad layout has no page overflow, panel overlap,
  browser warning/error, or broken visible image.
- [x] 1366 x 768 and 1920 x 1080: the board remains square and the layout has no
  page overflow; production-art sampling remains part of the public smoke.
- [ ] Big Maze expands the board, keeps its compact Power/item/rescue HUD and
  feedback toast readable, and returns to the full UI with Escape or Normal.
- [x] Portrait at 390 x 844: the turn-sideways guidance appears and is readable
  locally and on the canonical deployment.
- [ ] 200% zoom or increased text scaling does not hide required actions.
- [ ] The title screen loads without a blank flash, presents clear primary focus,
  and exposes Continue/Begin Adventure, Adventure Book, Surprise Maze, and sound.
- [ ] Title, Adventure Book, game, Help, loss, and completion views can all be
  reached and exited with keyboard only, with visible focus and sensible focus
  restoration.
- [ ] Visiting Home or Adventure Book mid-maze preserves the active run; choosing
  a different maze after moving opens a confirmation and keyboard input cannot
  move Ame behind it.
- [ ] The Adventure Book scrolls internally without page overflow and accurately
  shows overall totals, all eight pet-species counts, sticker/medal/badge ownership,
  locked story levels, cleared levels, best steps, and rescue pips.
- [ ] Arrow keys and WASD respond immediately and each move one legal square.
- [ ] Primary mouse press/touch moves immediately, holding repeats, dragging
  steers, recentering or release stops queued movement, and right/middle click do
  not move Ame.
- [ ] Try shallow wall bends: the one-tile assist may take only a safe ordinary
  floor step around the intended wall. It must not pathfind, enter water/lava/poison,
  open or bypass a door, or challenge/bypass a foe.
- [ ] On-screen arrows work with mouse and touch input, including press-and-hold
  travel and release/cancel cleanup.
- [ ] On a physical iPad, drag anywhere on the maze, steer during the same
  gesture, recenter to stop, release outside the board, and confirm the page
  neither pans nor pinch-zooms while playing.
- [ ] Help and completion dialogs trap focus, close as intended, restore focus,
  and remain usable with keyboard only.
- [ ] Mute state and reduced-motion preference are respected.
- [ ] Every pickup, blocked action, rescue, fight, loss, and victory has the
  intended sound or quiet fallback; specifically listen for jump, friend-rescue,
  combat clash, sparks, impact, Power ticks/power-up, and victory cues. Check
  title, menu, selection, achievement, and stamp cues too.
- [ ] Start several different mazes and confirm the five full BGM tracks vary by
  maze without an immediate repeat, revisiting the same maze keeps its assignment
  for that session, and the short friendship cue never loops as background music.
- [ ] All twelve story levels can be completed manually; also complete several
  surprise mazes and compare observed routes with the validated solver results.
- [ ] In both an early 9 x 9 maze and later large mazes, the main view stays
  6 x 6, follows Ame without exposing off-camera objects, clamps cleanly at map
  edges, and remains readable.
- [ ] The minimap shows every tile in the current field of view, remembers tiles
  after they leave view, masks unvisited areas, and resets on a new level.
- [x] On the canonical 0.10.3 URL, the exact `?debug=mazes` query opens the direct
  picker and all twelve authored mazes are listed; the title reports playable
  build 0.10.3 and the focused public smoke has no warning/error logs.
- [ ] Complete a canonical tester run and reconfirm that rewards, records,
  unlocks, active-run recovery, and progress stay unchanged.
- [ ] Each maze's authored 1–5 pets are optional for the ordinary exit and all
  are jointly rescuable for that maze's perfect reward.
- [ ] Sample every story theme and generated variant on the production URL:
  paired materials tile cleanly, enemy/pet/cage art matches the UI, inventory is
  picture-led, and Ame holds the level's selected weapon after collection. No
  yellow/gold floor may pair with a green/sage wall; floor/wall contrast must be
  clear in every approved colour family.
- [ ] Inspect all four cages: each opaque AI-generated front layer sits in front
  of its pet without a baked-in animal, background rectangle, or missing bars.
- [x] Locally verify the cage source/opacity and front-layer effect through normal
  controls; keep the all-four-style production-URL sample above pending.
- [x] Visually verify a v4 cage in 0.10.3 uses a front-only layer without a
  transparent full-cage shell obscuring the friend.
- [x] Verify pickup feedback appears as a readable floating toast over the maze.
- [x] Open the full-progress reset warning from both the title and Adventure Book;
  leave the destructive confirmation unclicked during this release QA pass.
- [ ] Rescue one through five animals, then move and backtrack: each rescued
  friend follows on a distinct recent visible footprint, never blocks movement,
  and reduced-motion mode removes decorative follower animation.
- [x] Rescue one animal through normal local controls and verify that it follows
  Ame; multi-follower, reduced-motion, and physical-device feel remain pending.
- [ ] Inspect every water/lava theme and generated 2–4 tile cluster: connected
  regions read organically against the floor with no outline, lip, cast shadow,
  or filter, and floor/wall contrast remains clear at the smallest tile size.
- [ ] Collect Spring Boots, approach single- and two-square hole runs from both
  directions, and confirm one input performs one clear 540 ms safe hop with the
  layered boing, moving shadow, and landing squash. If the landing contains an
  interaction, its rescue/battle set piece must begin only after the hop.
  Before the pickup, and whenever the landing is blocked or outside the maze,
  the same move must be refused. Hole art must remain flat, transparent, and free
  of a coloured outline or shadow.
- [x] Trigger a winning battle locally: input locks for the 2.22 s presentation,
  both characters make three distinct contacts, each clash/sparks/impact cue is
  timed to a visible bash, the enemy's number drains to `0`, and the same amount
  counts into Ame before the final burst. The browser sample observed 1→0 and
  2→3 with clean removal at 2.22 s; physical listening remains pending. Repeat
  with reduced motion and navigate away mid-effect during device testing.
- [ ] Rescue a pet: the cage front opens, the pet hops with hearts/sparks, and
  exactly one follower joins after the handoff. Repeat with reduced motion and
  navigate away mid-effect; no duplicate follower or stale overlay may remain.
- [x] A local underpowered guardian check presents the non-dismissible **Too
  strong!** comparison without beginning combat. The attempted move preserves
  Ame's position, Power, step count, inventory, and the enemy; the only action
  returns directly to safe play for backtracking.
- [ ] Existing schema-v1 and schema-v2 saves migrate safely to schema v3,
  malformed data fails gently, and unknown historical species/source facts are
  not invented.
- [ ] Completion updates distinct-maze, total-completion, generated-maze,
  species, perfect-rescue, streak, best-step, and best-Power statistics exactly
  once, including after a replay.
- [ ] Each of the nine stat-driven badges unlocks at its documented threshold and
  new rewards appear once without duplicate fanfare.
- [ ] For all nine badges and six completion/reward stickers, compare the
  Adventure Book's locked and unlocked cards with the reward modal/victory use.
  The same `ACHIEVEMENT_ART` identity must appear on every surface, stay legible
  at the 27–150 CSS-pixel range, and never fall back to an old URL or emoji.

## 4. Windows 0.10.3 artifact test

Expected build outputs:

- `src-tauri/target/release/maze-so-puzzle.exe`
- `src-tauri/target/release/bundle/nsis/Maze so Puzzle - For Ame to
  Solve!_VERSION_x64-setup.exe`

For the new artifact set, `VERSION` must resolve to `0.10.3`.

- [x] Build the exact final 0.10.3 source and confirm both expected outputs exist.
- [x] Independently inspect the portable executable and installer product/file
  version metadata and confirm both report 0.10.3.
- [x] Smoke-test the Windows portable artifact; it remained responsive for five
  seconds with the expected title. The installer workflow remains a clean-machine
  test below.

- [ ] Launch the standalone executable on a clean Windows x64 account.
- [ ] Install, launch, save progress, close, reopen, and uninstall the NSIS build.
- [ ] Confirm the title, icon, minimum window size, resize behaviour, landscape
  guidance, audio, and local save all work in the WebView2 desktop runtime.
- [ ] Test a path containing spaces and a non-administrator install where allowed.
- [ ] Confirm an upgrade preserves expected progress.
- [ ] Scan final files using the project's approved malware-scanning process.
- [ ] Sign the executable and installer for public distribution, then test the
  signed files again. If unsigned, label them clearly.

## 5. Windows 0.10.3 staging record

- [x] Copy only artifacts from the final successful build into `release/` using
  versioned filenames.
- [x] Confirm the staged names are `Maze-so-Puzzle-0.10.3-portable.exe` and
  `Maze-so-Puzzle-0.10.3-setup.exe`.
- [x] Independently confirm both artifacts report file/product version 0.10.3.
- [x] Generate final SHA-256 values after all copying (the test build is unsigned):

```powershell
Get-FileHash .\release\Maze-so-Puzzle-0.10.3-portable.exe -Algorithm SHA256
Get-FileHash .\release\Maze-so-Puzzle-0.10.3-setup.exe -Algorithm SHA256
```

- [x] Record the final 0.10.3 filenames, sizes, and SHA-256 values below.
- [x] Independently compare the staged hashes with the final Tauri output paths
  byte-for-byte and mirror the verified record into `release/README.md` and
  `release/SHA256SUMS.txt`.

Current verified unsigned 0.10.3 staging record:

- Portable: `Maze-so-Puzzle-0.10.3-portable.exe`, 51,461,632 bytes, SHA-256
  `2F7E47C76252F9E2F2C1E7939240BB81EF971DD2098FE157B647D1F248F42B7E`.
- Installer: `Maze-so-Puzzle-0.10.3-setup.exe`, 44,943,455 bytes, SHA-256
  `BF31CBB461EB909558C50D7077FDEA62A0D98A8D651BE9D3BFAA844368DD399B`.

The unsigned portable and setup artifacts were built and byte-compared with the
final Tauri outputs. The portable executable was smoke-launched; the installer
itself still requires the clean-machine workflow above.

### Historical verified 0.10.2 staging record

- Portable: `Maze-so-Puzzle-0.10.2-portable.exe`, 49,224,704 bytes, SHA-256
  `3D84F67F33821C8D38D8CEC9B6F1DA07B4BEC55464A76060314B7A25258A227E`.
- Installer: `Maze-so-Puzzle-0.10.2-setup.exe`, 42,696,746 bytes, SHA-256
  `94F1AF3C56799141DF9E0EDB4FD23A60A23BFE5141197E4BDB0091AA77F00EDC`.

The historical staged files matched the final 0.10.2 Tauri outputs
byte-for-byte, reported file and product version 0.10.2, and the hidden portable
smoke stayed responsive with the correct title for five seconds.

### Historical verified 0.10.1 staging record

- Portable: `Maze-so-Puzzle-0.10.1-portable.exe`, 49,224,192 bytes, SHA-256
  `747D1A233FE4789A26CED2F888F3C05745FBBBE352E6509E757603D5A64B33E9`.
- Installer: `Maze-so-Puzzle-0.10.1-setup.exe`, 42,691,848 bytes, SHA-256
  `4FE909ECC17B1245604ECFA4D62288D7340E6986FCCA69D346481868D3F5DBB5`.

### Historical verified 0.10.0 staging record

- Portable: `Maze-so-Puzzle-0.10.0-portable.exe`, 49,222,656 bytes, SHA-256
  `073EB840039176A3BF86B563A340271E9B41A37EFE2D469E36772A77A278F7F0`.
- Installer: `Maze-so-Puzzle-0.10.0-setup.exe`, 42,694,296 bytes, SHA-256
  `1A5C12CD9114727E82B23524A15CAF042D8F7F2495864BA7D889A8B4C9EC0073`.

### Historical verified 0.9.1 staging record

- Portable: `Maze-so-Puzzle-0.9.1-portable.exe`, 48,216,576 bytes, SHA-256
  `29D14C1EACED7AA5F7257C390C2E7366995731CDFFF9346E402CF037A01A488C`.
- Installer: `Maze-so-Puzzle-0.9.1-setup.exe`, 41,681,042 bytes, SHA-256
  `404A1C0B73730C2B69C5150D41F10CFADFAC00E96EEFC58084CEDD7F475E5A07`.

### Historical verified 0.9.0 staging record

- Portable: `Maze-so-Puzzle-0.9.0-portable.exe`, 48,397,312 bytes, SHA-256
  `E80B68613AEDBA3A1E5831240F1D1746D5AEA5BCD4A9C6BBB82CC455ECFC5AEC`.
- Installer: `Maze-so-Puzzle-0.9.0-setup.exe`, 41,891,642 bytes, SHA-256
  `C040302C732AB846C77850CE2BA67FE745A5027223A6AADD62EF0CB247C17347`.

### Historical verified 0.8.0 staging record

The previous unsigned 0.8.0 artifacts were source-compared, version-checked,
hashed, and smoke-launched. They remain a historical baseline and do not verify
the new 0.9.1 files:

- Portable: `Maze-so-Puzzle-0.8.0-portable.exe`, 47,846,912 bytes, SHA-256
  `6434B8EF5C237F34C3AF6A44743A9E4D55D291A8F15FD175DF44560471BD97FC`.
- Installer: `Maze-so-Puzzle-0.8.0-setup.exe`, 41,335,529 bytes, SHA-256
  `A15D88A70AE14F7FA447F740EE2783F9E7E170C61CB9A4E5F37E08F8ABFB761E`.

- [ ] Verify the published hashes against newly downloaded copies.
- [ ] Check filenames, sizes, version metadata, release notes, and download links.
- [ ] Record the Windows versions and machines used for the clean-install test.

## 6. Handoff

- [ ] Give testers the current filename, whether it is signed, controls, known
  limitations, and a short feedback prompt.
- [ ] Ask for the level number or surprise-maze seed with every gameplay report.
- [ ] Archive the exact source revision, lockfiles, prompt provenance, checksums,
  and release notes needed to reproduce the build.
