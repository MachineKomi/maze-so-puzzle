# Release checklist

Verification date: 2026-09-01

Use this checklist for the exact commit and artifacts that will be shared. A
successful earlier build does not validate files produced after another source,
dependency, configuration, or asset change.

Status for 0.10.1: 247 tests across 18 files and the strict TypeScript/Vite
build pass. Source metadata and artwork provenance remain aligned.
The zero-vulnerability dependency audit/tree, locked Tauri compile, Windows
packaging/source comparison/hash/smoke launch, repeat-boundary/alpha checks,
local 1024 × 768 and 844 × 390 previews, exact 65-step poison route,
non-destructive stronger-enemy dialog, three-bash conserved Power transfer,
540 ms jump arc, layered boing, source comparison, and five-second portable
smoke pass. GitHub/Vercel promotion and the canonical 0.10.1 smoke remain.
Physical-device touch/listening/feel, accessibility, clean-machine installation,
signing, and the broader manual play-through remain deliberately unclaimed. The
completed 0.10.0, 0.9.1, 0.9.0, and 0.8.0 evidence below is retained as a historical baseline.

## 1. Prepare

- [x] Confirm the 0.10.1 source version in `package.json`, `package-lock.json`,
  `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json`.
- [x] Confirm the title screen displays the optimized
  `public/assets/title-background-v1.webp`, while the PNG master remains at
  `docs/source-assets/title-background-v1.png` for provenance and future edits.
- [x] Confirm the 0.10.1 bundle contains continuous world-aligned SVG terrain,
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
- [x] Update `README.md`, architecture, music, asset, privacy, audit, release, and
  Vercel documentation for 0.10.1 while leaving unfinished release gates clear.
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
- [x] Dependency audit output for the exact 0.10.1 source is reviewed: zero known
  vulnerabilities.
- [x] `npm ls` for 0.10.1 is reviewed; only expected platform/feature optional packages are
  absent.
- [x] `npm run check:desktop` completes `cargo check --locked` without errors for
  the exact 0.10.1 source.
- [x] `npm run desktop:build` produces the 0.10.1 release executable and NSIS
  installer; both are staged, source-compared, version-checked, and hashed, and
  the portable app passes its five-second smoke launch.
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
- [x] Repeat the relevant checks after the integrated 0.10.1 source changes
  (`npm run check`: 247 of 247 tests across 18 files plus the production build).
- [x] Repeat `npm run check` once more if browser QA or release packaging causes
  any additional source, asset, configuration, or lockfile change.

## 3. Browser play test

Test the production preview, not only the development server:

```powershell
npm run preview
```

Production smoke record (2026-09-01): the canonical URL serves playable build
0.10.0 from GitHub `main` commit `76fdb6c`. The exact debug query opens the
twelve-maze picker, Maze 12 opens with five friends and its 6 × 6 camera, the
1024 × 768 document exactly matches its viewport, and the production browser
error/warning logs are clear. The 844 × 390 exact-fit phone check and the full
65-step Antidote Leaf/connected-poison route also pass against the same local
production bundle; physical-device feel remains a human test.

- [x] 960 x 540: the maze and side panel fit without page overflow or clipping.
- [x] 1280 x 720: default layout is balanced and has no page overflow.
- [x] 667 x 375 and 844 x 390: the phone stage, safe viewport, page overflow,
  board overlap, and minimum-control layout baseline passes locally; 0.9.1
  canonical checks remain historical evidence.
- [x] 740 x 360: the same phone-layout checks pass locally.
- [x] 1024 x 768 local and canonical 0.10.0: the iPad-size layout has no page
  overflow, sidebar overlap, or maze/control overlap.
- [x] 1180 x 820: the same iPad-size layout checks pass locally.
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
- [x] On the 0.10.0 canonical URL, the exact `?debug=mazes` query opens the
  direct picker and all twelve authored mazes are listed; the normal build-label
  entry and non-debug isolation remain covered locally and by the prior public smoke.
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

## 4. Windows 0.10.1 artifact test

Expected build outputs:

- `src-tauri/target/release/maze-so-puzzle.exe`
- `src-tauri/target/release/bundle/nsis/Maze so Puzzle - For Ame to
  Solve!_VERSION_x64-setup.exe`

For the new artifact set, `VERSION` must resolve to `0.10.1`.

- [x] Build the exact final 0.10.1 source and confirm both expected outputs exist.
- [x] Confirm the portable executable and installer report product/file version
  0.10.1 and embed the final browser bundle.
- [x] A hidden five-second launch of the staged portable executable remains
  running and responsive and exposes the correct game window title.

- [ ] Launch the standalone executable on a clean Windows x64 account.
- [ ] Install, launch, save progress, close, reopen, and uninstall the NSIS build.
- [ ] Confirm the title, icon, minimum window size, resize behaviour, landscape
  guidance, audio, and local save all work in the WebView2 desktop runtime.
- [ ] Test a path containing spaces and a non-administrator install where allowed.
- [ ] Confirm an upgrade preserves expected progress.
- [ ] Scan final files using the project's approved malware-scanning process.
- [ ] Sign the executable and installer for public distribution, then test the
  signed files again. If unsigned, label them clearly.

## 5. Windows 0.10.1 staging record

- [x] Copy only artifacts from the final successful build into `release/` using
  versioned filenames.
- [x] Confirm the staged names are `Maze-so-Puzzle-0.10.1-portable.exe` and
  `Maze-so-Puzzle-0.10.1-setup.exe`.
- [x] Confirm both artifacts report file/product version 0.10.1 and remain clearly
  labelled as unsigned local test builds.
- [x] Generate final SHA-256 values after all copying (the test build is unsigned):

```powershell
Get-FileHash .\release\Maze-so-Puzzle-0.10.1-portable.exe -Algorithm SHA256
Get-FileHash .\release\Maze-so-Puzzle-0.10.1-setup.exe -Algorithm SHA256
```

- [x] Confirm the staged portable and installer hashes match their final Tauri
  source artifacts byte-for-byte, then record the final 0.10.1 filenames, sizes,
  and hashes in `release/README.md` and `release/SHA256SUMS.txt`.

Current verified unsigned 0.10.1 staging record:

- Portable: `Maze-so-Puzzle-0.10.1-portable.exe`, 49,224,192 bytes, SHA-256
  `747D1A233FE4789A26CED2F888F3C05745FBBBE352E6509E757603D5A64B33E9`.
- Installer: `Maze-so-Puzzle-0.10.1-setup.exe`, 42,691,848 bytes, SHA-256
  `4FE909ECC17B1245604ECFA4D62288D7340E6986FCCA69D346481868D3F5DBB5`.

The staged files match the final Tauri outputs byte-for-byte, report file and
product version 0.10.1, and the hidden portable smoke stayed responsive with
the correct title for five seconds.

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
