# Project audit

Audit date: 2026-09-01
Audited build: 0.4.0 playable test build

This is a housekeeping snapshot for the current playable prototype. It records
what was actually checked, separates product choices from defects, and keeps the
remaining work ordered by risk. It is not a substitute for the final release
checklist after source or asset changes. Local browser and Tauri packaging
verification is complete; clean-machine installation and the full family
play-test matrix are not claimed.

## Current 0.4.0 candidate status

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
0.4.0 evidence above is current, while the broader manual release matrix remains
intentionally separate below.

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
  It does not pathfind to the clicked destination.
- Portrait orientation shows a turn-sideways message. Landscape is the intended
  play mode rather than an accidental limitation.
- The three animal rescues are bonus goals; reaching the maze exit must not
  require collecting them.
- The unsigned Windows files are suitable for local testing. SmartScreen may
  warn on machines that did not build them.

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

The final automated run is complete. The unchecked clean-machine, device, and
manual items in `RELEASE_CHECKLIST.md` remain separate release requirements.

## Prioritized remaining work

### P0 - required before a public release

- Perform the complete manual test matrix in `RELEASE_CHECKLIST.md` against the
  exact final browser bundle, portable executable, and installer.
- Install, launch, save, upgrade, and uninstall on a clean Windows x64 machine.
- Code-sign the Windows executable and installer, or explicitly label the public
  build as unsigned and document the expected SmartScreen warning.
- Choose and add a source-code and asset licence. This is an owner decision and
  was deliberately not guessed during housekeeping.
- Verify the recorded staged SHA-256 values against any copies uploaded for
  testers.

### P1 - next quality pass

- Add automated browser interaction tests for keyboard movement, directional
  pointer movement, dialog focus trapping and restoration, reward persistence,
  loss/retry, and a full maze completion.
- Add automated accessibility checks and a richer screen-reader representation
  of nearby maze cells; the visual grid should not be the only spatial model.
- Test 200% browser zoom and Windows text scaling, including Big Maze mode on the
  largest 17 x 17 story and generated mazes.
- Add visual-regression snapshots for the minimum 960 x 540 window, the default
  1280 x 720 window, 1920 x 1080, and the portrait guidance screen.
- Reassess compact-window touch targets. The 960 x 540 layout prioritizes fitting
  the complete game, so an alternate large-control mode may be better than
  forcing every control to desktop-unfriendly dimensions.

### P2 - maintainability and polish

- If mazes larger than 17 x 17 return, use a player-centred zoomed camera and a
  simplified explored-area minimap instead of shrinking the full board and its
  sprites. Keep that as a separate navigation feature rather than complicating
  the current readable story progression.
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
- The release target is 0.4.0. Package, lockfile, Cargo, and Tauri versions were
  confirmed aligned during final packaging.
- The Tauri content security policy is local-only. Inline style permission is
  currently needed because the UI uses dynamic positioning and CSS variables.
- AI artwork provenance and regeneration prompts are documented in
  `AI_ASSET_PROMPTS.md`, including the exact title-screen prompt and optimized
  runtime derivative.
