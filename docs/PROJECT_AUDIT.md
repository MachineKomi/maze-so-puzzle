# Project audit

Audit date: 2026-09-01
Audited build: playable 0.7.1 web and Windows test release

This is a housekeeping snapshot for the current playable prototype. It records
what was actually checked, separates product choices from defects, and keeps the
remaining work ordered by risk. It is not a substitute for clean-machine and
real-device testing. The current automated suite, responsive browser checks,
Tauri build, staging, source-to-stage hash comparison, and portable smoke launch
all completed against 0.7.1 on 2026-09-01. Older rows remain as historical
release evidence.

## Current 0.7.1 release status

| Area | Current evidence | Status |
| --- | --- | --- |
| Automated gate | Engine, solver, generated/authored levels, exploration, progress, assets, audio, navigation, touch direction/dead-zone rules, visual variants, rescue-record migration, and exhaustive terrain topology | 171 of 171 tests passed; strict TypeScript, Vite production build, zero-vulnerability npm audit, and locked Tauri compile passed |
| Landscape phones | Full-safe-viewport layout at 667×375, 740×360, and 844×390 with compact sidebar and two-row movement controls | No body/sidebar overflow or card overlap; maze measured 277–292 px and movement/utility targets remained at least 44 px |
| iPad-size layout | 1024×768 and 1180×820 responsive checks plus dedicated coarse-pointer D-pad rules | No sidebar overflow; maze measured 442–516 px. Physical-device gesture and pinch checks remain required |
| Touch movement | Floating joystick uses a cell-scaled dead zone, dominant axis, 72 ms repeat, live direction changes, pointer capture, and tap fallback | Seven pure gesture regressions pass; browser markup/meta and cancellation paths reviewed, with physical-iPad interaction remaining |
| Exploration policy | The shared rule enables the 7 x 7 camera and fog minimap whenever either maze dimension exceeds 7; focused boundary coverage includes 7, 8, and 9 tile dimensions | Passed unit coverage and local production-browser movement/reveal checks |
| Tester access | The title build label opens a direct nine-maze picker, and exact `?debug=mazes` opens the same picker automatically; tester runs retain the non-saving preview mode | Passed local production-browser normal-query, exact-query, direct-selection, and modal checks |
| Terrain geometry | Maze terrain is one globally aligned SVG surface with connected wall and hazard regions, rounded convex/concave bends, preserved holes, periodic textures, a camera gutter, and flat hazard lips without cast shadows | Passed exhaustive 3 x 3 occupancy tests, targeted topology tests, and local landscape visual review; real-iPad review remains valuable play-test feedback |
| Visual catalogue | Nine distinct paired terrain themes, five weapons, five friendly enemy looks, eight pet species, and four cage styles are selected through typed IDs and local assets | Every story maze has a distinct theme, one weapon, and three unique optional pets; the picture-first UI and held-weapon overlay resolve the authored variants |
| Surprise Maze variants | Generated terrain, weapon, enemy, and cage looks use dedicated deterministic hash streams | Repeating a seed reproduces its presentation without changing deterministic layout or progression placement |
| Optional Power puzzle | The Wishing Woods kitten spur is guarded by an optional Power 9 pebble-golem after a Power 2 foe, `+2` potion, and Power 5 foe | The ordinary route remains 108 steps; the solver-verified all-pets route backtracks at Power 11 and remains safely solvable |
| Hosting | GitHub `main` is connected to the Vercel Hobby production project at `https://maze-so-puzzle.vercel.app/` | Pushes to `main` auto-deploy; the canonical alias is smoke-tested after each release push |
| Desktop artifacts | Tauri 0.7.1 portable executable and NSIS installer built, staged, version-checked, source-compared, and SHA-256 hashed | Portable app remained responsive with the correct title for five seconds; installer clean-machine testing and signing remain |

## Current 0.5.1 implementation status

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

## Current 0.5.0 implementation status

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
- AI-generated v3 floor and wall materials show smaller stones at a more useful
  maze scale. Exact-periodic runtime conversions keep those patterns seamless;
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

## Confirmed product rules

- Equal Power wins. This is intentional, child-friendly, covered by a unit test,
  and documented in the README.
- Click or tap moves exactly one grid square in the dominant direction from Ame.
  Touch dragging acts as a floating directional joystick and still never
  pathfinds to a destination.
- Portrait orientation shows a turn-sideways message. Landscape is the intended
  play mode rather than an accidental limitation.
- The three animal rescues are bonus goals; reaching the maze exit must not
  require collecting them.
- Any maze wider or taller than 7 tiles uses the 7 x 7 exploration camera and
  fog minimap. Maze dimensions and presentation are no longer separate opt-ins.
- The unsigned Windows files are suitable for local testing. SmartScreen may
  warn on machines that did not build them; the verified files are 0.7.1.

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
- Dialogs now receive focus, contain keyboard focus, respond to Escape where
  appropriate, restore focus, and make the background inert while open.
- The rendered page has a logical top-level heading, control-state semantics,
  and a current textual description of Ame's adjacent maze cells.
- Home and Adventure Book preserve the active run, cross-maze switches are
  confirmed once movement has begun, and modal keyboard input cannot move Ame
  behind the confirmation.
- Big Maze remains available as an optional roomier board view while retaining a
  compact Power/item/rescue HUD and an overlaid feedback toast.

The 0.7.1 source passes the automated, dependency, locked-desktop-compile,
local responsive-browser, Windows packaging, source-comparison, hash, and
portable-smoke gates recorded above. All unchecked clean-machine, physical-device,
listening, and broader manual items in `RELEASE_CHECKLIST.md` remain requirements
for the artifact type they cover.

## Prioritized remaining work

### P0 - release hygiene and future packaged builds

- Perform the remaining physical-device browser matrix in `RELEASE_CHECKLIST.md`
  against the exact 0.7.1 production deployment, and separately repeat the
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

- Add automated browser interaction tests for keyboard movement, directional
  pointer movement, dialog focus trapping and restoration, reward persistence,
  loss/retry, and a full maze completion.
- Add automated accessibility checks and a richer screen-reader representation
  of nearby maze cells; the visual grid should not be the only spatial model.
- Test 200% browser zoom and Windows text scaling, including Big Maze mode and
  the 7 x 7 camera/minimap on early, generated, and 25 x 25 mazes.
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
- The current source metadata is aligned at 0.7.1 and the public Vercel alias is
  rechecked after every deployment. Packaging, staged names, source-to-stage
  comparison, portable smoke launch, sizes, and hashes in `release/` describe
  the verified unsigned 0.7.1 Windows test artifacts.
- The Tauri content security policy is local-only. Inline style permission is
  currently needed because the UI uses dynamic positioning and CSS variables.
- AI artwork provenance and regeneration prompts are documented in
  `AI_ASSET_PROMPTS.md`, including the title screen, paired terrain materials,
  character/item variants, and optimized runtime derivatives.
