# Project audit

Audit date: 2026-09-02
Audited build: 0.17.0 web/Windows playable release

This is a housekeeping snapshot for the current playable prototype. It records
what was actually checked, separates product choices from defects, and keeps the
remaining work ordered by risk. It is not a substitute for clean-machine and
real-device testing. On 2026-09-02 the integrated 0.17.0 suite passed 312 tests
across 25 files plus strict TypeScript and the Vite production build. The npm
production audit reports zero vulnerabilities; `npm ls` is clean, and
`cargo check --locked` passes. Browser QA at desktop, iPad, and phone aspect
ratios found the illustrated Book and UI readable with no document overflow or
console errors. Unsigned 0.17.0 portable and setup artifacts were built and
byte-verified, and the portable executable passed a five-second launch smoke.
Physical-device touch/listening/feel,
clean-machine installation, signing, and the broader manual production
walkthrough also remain open. Older sections are kept as clearly labelled
historical evidence.

## Current 0.17.0 release status

| Area | Current evidence | Status |
| --- | --- | --- |
| Automated gate | Full unit/integration suite plus strict TypeScript and Vite production compilation | `npm run check` passed 312 tests across 25 files; production JavaScript is 115.79 KB gzipped |
| Dependencies | JavaScript dependency vulnerability and tree review | `npm audit --audit-level=moderate` reports zero vulnerabilities; `npm ls` is clean |
| Desktop compile | Locked Rust/Tauri dependency graph | `cargo check --locked` passed |
| Absolute size policy | Shared solver validation and procedural dimension selection | Every board above 24×24 is rejected; odd generated topology ranges from 9×9 through 23×23 |
| Room-based design | Later Surprise Mazes plus rebuilt Lanternlight Labyrinth | 2×2–4×4 procedural rooms cluster treasure, rescues and Power-gated guardians; Lanternlight is 23×23 with a five-object monster/treasure chamber |
| Hole-gate variety | Engine event paths, generated gates, and authored routes | One-, two-, and three-hole straight jumps are all covered; Lanternlight adds a four-way centre-hole junction, and longer jumps scale duration/height without changing engine movement |
| Visual variety | Typed art and personality catalogues plus fourteen new achievement sprites | Every one of the 15 stickers, medals, and badges has distinct rendered art; source masters are archived and runtime WebPs retain transparent 512×512 silhouettes |
| Soundtrack | Thirteen full OST tracks plus one reserved friendship cue | A seeded shuffle bag plays every full song once per cycle on maze changes, avoids immediate repeats, and home music begins from the first permitted title-screen gesture |
| Procedural records | Maze Select and Adventure Book | Copy explicitly identifies fresh seeded generation; the Book keeps up to six recent record cards rather than presenting an infinite fixed list |
| Responsive browser QA | 1280×720 desktop and 1024×768 iPad | Title, Book, gameplay HUD, and illustrated Help fit the fixed stage; browser warning/error logs are empty |
| Hosting | GitHub `main` is connected to the Vercel Hobby project at `https://maze-so-puzzle.vercel.app/` | Release commit `512a02e` auto-deployed; the canonical bundle reports 0.17.0 and all 14 new achievement assets return the expected WebP type with exact local byte sizes |
| Desktop artifacts | Unsigned 0.17.0 portable executable and NSIS setup | Both built and byte-verified; the portable launch smoke passed, and exact sizes and SHA-256 values are recorded in `RELEASE_CHECKLIST.md` |

## Historical 0.14.0 release status

The 0.14.0 compact-room and procedural-scrapbook release remains recorded in
the changelog and release checklist. It is superseded by the current 0.17.0 gate.

## Historical 0.13.0 release status

The 0.13.0 Puzzlewild read-together story release remains recorded in the
changelog and release checklist. It is superseded by the current 0.17.0 gate.

## Historical 0.12.0 release status

The 0.12.0 exploration-reward, prerequisite-help, lighting, and Power-99 release
remains recorded in the changelog and release checklist. It is superseded by
the current 0.17.0 gate rather than deleted.

## Historical 0.10.3 release status

The 0.10.3 browser and Windows evidence remains in the release checklist and
changelog. It is superseded by the current 0.17.0 gate rather than deleted.

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

## Confirmed product rules

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
