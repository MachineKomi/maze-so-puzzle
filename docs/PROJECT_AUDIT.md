# Project audit

Audit date: 2026-08-31
Audited build: 0.3.0 playable test build

This is a housekeeping snapshot for the current playable prototype. It records
what was actually checked, separates product choices from defects, and keeps the
remaining work ordered by risk. It is not a substitute for the final release
checklist after source or asset changes. Local browser and Tauri packaging
verification is complete; clean-machine installation and the full family
play-test matrix are not claimed.

## Current 0.3.0 candidate status

| Area | Current evidence | Status |
| --- | --- | --- |
| Unit suite | 79 tests cover the engine, solver, generator, eight story levels, progress schema v3, achievements, protected navigation, and synthesized-audio safeguards | 79 of 79 passed in the final run |
| Story campaign | Eight authored, solver-validated levels from 13 x 13 through 23 x 23; three optional and jointly rescuable animals per level | Implemented; final play-through pending |
| Title experience | AI-illustrated title screen, story continuation, Adventure Book, surprise-maze shortcut, sound control, and reduced-motion-aware flourishes | Production bundle verified at 1280 x 720; broader manual matrix remains |
| Adventure Book | Species totals, overall stats, stickers, rescue medals, nine stat-driven badges, and per-story-maze clear/step/rescue records | Browser structure, visuals, current-run record, and keyboard focus verified |
| Saves | Schema v3 records richer statistics and defensively migrates v1/v2 data without inventing unknown historical species | Automated coverage present; browser-profile upgrade test pending |
| Audio | Added title, menu, select, achievement, and stamp cues; overlapping voices and closed contexts are bounded and guarded | Automated coverage present; browser and WebView2 listening pass pending |
| Title asset | PNG master archived; 256,684-byte WebP derivative served in-game | Production bundle verified; source-only art excluded |
| Windows package | Tauri 0.3.0 portable executable and NSIS installer | Built and staged; hashes match sources; portable smoke launch responsive |

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
0.3.0 evidence above is current, while the broader manual release matrix remains
intentionally separate below.

## Version 3 implementation snapshot

- The campaign now has eight story mazes. The four new adventures reach 21 x 21
  and 23 x 23 while combining swords, Power growth, potions, multiple coloured
  keys and doors, protective boots, water, lava, and optional rescue routes.
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
- Synthesized audio now includes title, menu, selection, achievement, and stamp
  cues, with a voice cap, safe node cleanup, and recovery from a closed context.

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
- Non-primary mouse-button releases no longer move Ame.
- Dialogs now receive focus, contain keyboard focus, respond to Escape where
  appropriate, restore focus, and make the background inert while open.
- The rendered page has a logical top-level heading, control-state semantics,
  and a current textual description of Ame's adjacent maze cells.
- Home and Adventure Book preserve the active run, cross-maze switches are
  confirmed once movement has begun, and modal keyboard input cannot move Ame
  behind the confirmation.
- Big Maze expands the board for later 21 x 21 and 23 x 23 levels while retaining
  a compact Power/item/rescue HUD and an overlaid feedback toast.

These changes still require the final post-change automated and manual run in
`RELEASE_CHECKLIST.md`; their presence in source is not itself a release sign-off.

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
- Test 200% browser zoom and Windows text scaling, including Big Maze mode on
  both 21 x 21 and 23 x 23 levels.
- Add visual-regression snapshots for the minimum 960 x 540 window, the default
  1280 x 720 window, 1920 x 1080, and the portrait guidance screen.
- Reassess compact-window touch targets. The 960 x 540 layout prioritizes fitting
  the complete game, so an alternate large-control mode may be better than
  forcing every control to desktop-unfriendly dimensions.

### P2 - maintainability and polish

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
- The release target is 0.3.0. Package, lockfile, Cargo, and Tauri versions were
  confirmed aligned during final packaging.
- The Tauri content security policy is local-only. Inline style permission is
  currently needed because the UI uses dynamic positioning and CSS variables.
- AI artwork provenance and regeneration prompts are documented in
  `AI_ASSET_PROMPTS.md`, including the exact title-screen prompt and optimized
  runtime derivative.
