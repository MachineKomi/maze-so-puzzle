# Release checklist

Verification date: 2026-09-02

Use this checklist for the exact commit and artifacts that will be shared. A
successful earlier build does not validate files produced after another source,
dependency, configuration, or asset change.

Status for 0.14.0: `npm run check` passes 304 tests across 23 files plus strict
TypeScript and the Vite production build. The moderate-level npm audit reports
zero vulnerabilities; `npm ls` is clean, and locked Cargo compilation passes.
Browser QA at 1280×720 desktop and 1024×768 iPad found that compact Lanternlight
rooms and the procedural scrapbook fit without document overflow or UI overlap.
The unsigned Windows portable and setup builds were built, hashed,
byte-compared, versioned, and smoke-tested. Physical-device touch/listening/
feel, accessibility, clean-machine installation, signing, and the broader
manual play-through remain deliberately unclaimed. Earlier evidence is kept as
historical release evidence.

## 0.14.0 verification record

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
- [ ] GitHub/Vercel deployment is pending the exact release commit.
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
- [ ] Confirm every production image has known provenance and the game contains
  no unlicensed third-party material.
- [ ] Make the owner-approved licence decision before publishing source or
  redistributable assets.
- [x] Review `git status --short` if the folder is under version control; preserve
  intentional local work and remove no user-owned files.
- [ ] Start from a clean dependency install with `npm ci`.

## 2. Automated verification

Run each command from the project root in PowerShell:

```powershell
npm run check
npm audit
npm run check:desktop
```

- [x] `npm run check` reports that the complete unit suite passes and that
  TypeScript and the Vite production build complete without errors.
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
