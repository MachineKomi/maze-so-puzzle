# Release checklist

Verification date: 2026-09-01

Use this checklist for the exact commit and artifacts that will be shared. A
successful earlier build does not validate files produced after another source,
dependency, configuration, or asset change.

Status for 0.8.0: 189 tests across 15 files, strict TypeScript/Vite, the npm
audit/tree, locked Tauri compile, selected integrated responsive-browser sizes,
Windows packaging, source comparison, hash capture, and portable smoke launch
are complete. Physical-device touch/listening/feel, public-Vercel smoke,
accessibility, clean-machine installation, signing, and the broader manual
play-through remain deliberately unclaimed.

## 1. Prepare

- [x] Confirm the 0.8.0 source version in `package.json`, `package-lock.json`,
  `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json`.
- [x] Confirm the title screen displays the optimized
  `public/assets/title-background-v1.webp`, while the PNG master remains at
  `docs/source-assets/title-background-v1.png` for provenance and future edits.
- [x] Confirm the 0.8.0 bundle contains continuous world-aligned SVG terrain,
  rounded convex and concave joins, periodic paired textures, connected hazards
  without outlines, lips, shadows, or filters, stronger floor/wall contrast,
  picture-first UI, a held-weapon overlay, pet followers, opaque AI-generated
  cage-front layers, and locally bundled OST files.
- [x] Confirm the nine story mazes use nine distinct paired terrain themes, each
  has exactly one weapon and three unique pets, and the full campaign covers five
  weapons, five friendly enemy looks, eight species, and four cage styles.
- [x] Confirm the authored size sequence is 9, 11, 13, 15, 13, 15, 17, 17, and
  25, with Rainbow Picnic before the smaller Toasty Toes breather.
- [x] Confirm every maze larger than 6 tiles renders a 6 x 6 player-centred
  camera and persistent fog-of-war minimap without changing full-grid engine
  behaviour.
- [x] Confirm Surprise Maze seeds select varied unlocked odd sizes from 9 through
  29, never reach 30, and place connected 2–4 tile hazard regions only where the
  appropriate boots and solver-verified ordinary/perfect routes remain valid.
- [x] Confirm the title-screen build label and exact `?debug=mazes` query expose
  the direct nine-maze tester picker, and tester completion cannot write rewards,
  records, unlocks, active sessions, or progress.
- [x] Update `README.md`, architecture, asset, privacy, audit, release, and Vercel
  documentation for the locally verified 0.8.0 release.
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
- [x] Dependency audit output for the exact 0.8.0 source is reviewed: zero known
  vulnerabilities.
- [x] `npm ls` is reviewed; only expected platform/feature optional packages are
  absent.
- [x] `npm run check:desktop` completes `cargo check --locked` without errors for
  the exact 0.8.0 source.
- [x] `npm run desktop:build` produces the 0.8.0 release executable and NSIS
  installer; both are staged, source-compared, version-checked, and hashed, and
  the portable app passes its five-second smoke launch.
- [x] Automated level checks validate all nine story mazes: the first eight from
  the 9, 11, 13, 15, 13, 15, 17, and 17 tile sequence plus the 25 x 25
  Lanternlight Labyrinth, with separate ordinary and all-three-rescues solutions,
  one weapon, and three unique known pet species in every maze.
- [x] Authored-level checks preserve Wishing Woods' 108-step ordinary route and
  validate the optional Power 9 pebble-golem route: Power 2, `+2` potion, Power
  5, backtrack at Power 11, then rescue the guarded kitten.
- [x] Generator checks prove repeated seeds reproduce terrain, weapon, enemy,
  cage, varied 9–29 size, and connected 2–4 tile hazard choices without
  perturbing layout or progression determinism or solver validity.
- [x] Focused exploration tests cover an even 6 x 6 window, its defined centre
  bias, edge clamping,
  current field of view, and persistent reveal accumulation; the production
  browser pass must still confirm reveal reset on level switch.
- [x] Focused `pointerControls` tests cover dead-zone limits, all four dominant
  directions, direction changes, and strict one-tile wall-only corner assistance.
  Follower-trail tests cover bounded, loop-free, distinct placement. Physical
  mouse/touch pointer capture, repeat timing, and cancellation still require the
  device checks below.
- [x] Repeat the relevant checks after final source changes (`npm run check`:
  189 of 189 tests across 15 files plus the production build).

## 3. Browser play test

Test the production preview, not only the development server:

```powershell
npm run preview
```

- [ ] 960 x 540: the maze and side panel fit without page overflow or clipping.
- [ ] 1280 x 720: default layout is balanced and has no page overflow.
- [x] 667 x 375 and 844 x 390: the phone stage fills the safe landscape viewport
  with 347 px and 362 px boards respectively, without page overflow or overlap;
  the 844 x 390 pass retained 44 px minimum controls.
- [ ] 740 x 360: repeat the same phone-layout checks.
- [x] 1024 x 768: the iPad-size layout uses a 534 px board with no page overflow,
  sidebar overlap, or maze/control overlap.
- [ ] 1180 x 820: repeat the same iPad-size layout checks.
- [ ] 1366 x 768 and 1920 x 1080: artwork stays sharp and the board remains square.
- [ ] Big Maze expands the board, keeps its compact Power/item/rescue HUD and
  feedback toast readable, and returns to the full UI with Escape or Normal.
- [ ] Portrait: the turn-sideways guidance appears and is readable.
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
  floor step around the intended wall. It must not pathfind, enter water/lava,
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
  intended sound or quiet fallback; also check title, menu, selection,
  achievement, and stamp cues plus locally bundled background music across the
  title, early story, later story, and surprise mazes.
- [ ] All nine story levels can be completed manually; also complete several
  surprise mazes and compare observed routes with the validated solver results.
- [ ] In both an early 9 x 9 maze and later large mazes, the main view stays
  6 x 6, follows Ame without exposing off-camera objects, clamps cleanly at map
  edges, and remains readable.
- [ ] The minimap shows every tile in the current field of view, remembers tiles
  after they leave view, masks unvisited areas, and resets on a new level.
- [ ] On the normal URL, the discreet build-label button opens the direct picker.
  The exact `?debug=mazes` query opens it automatically, while other query values
  do not. It lists every authored maze, bypasses locks, labels previews clearly,
  and leaves saved progress unchanged.
- [ ] All three pets are optional for the ordinary exit and jointly rescuable
  for the perfect reward.
- [ ] Sample every story theme and generated variant on the production URL:
  paired materials tile cleanly, enemy/pet/cage art matches the UI, inventory is
  picture-led, and Ame holds the level's selected weapon after collection.
- [ ] Inspect all four cages: each opaque AI-generated front layer sits in front
  of its pet without a baked-in animal, background rectangle, or missing bars.
- [x] Locally verify the cage source/opacity and front-layer effect through normal
  controls; keep the all-four-style production-URL sample above pending.
- [ ] Rescue one, two, and three animals, then move and backtrack: each rescued
  friend follows on a distinct recent visible footprint, never blocks movement,
  and reduced-motion mode removes decorative follower animation.
- [x] Rescue one animal through normal local controls and verify that it follows
  Ame; multi-follower, reduced-motion, and physical-device feel remain pending.
- [ ] Inspect every water/lava theme and generated 2–4 tile cluster: connected
  regions read organically against the floor with no outline, lip, cast shadow,
  or filter, and floor/wall contrast remains clear at the smallest tile size.
- [ ] Loss resets the exact level cleanly without duplicating rewards.
- [ ] Existing schema-v1 and schema-v2 saves migrate safely to schema v3,
  malformed data fails gently, and unknown historical species/source facts are
  not invented.
- [ ] Completion updates distinct-maze, total-completion, generated-maze,
  species, perfect-rescue, streak, best-step, and best-Power statistics exactly
  once, including after a replay.
- [ ] Each of the nine stat-driven badges unlocks at its documented threshold and
  new rewards appear once without duplicate fanfare.

## 4. Windows 0.8.0 artifact test

Expected build outputs:

- `src-tauri/target/release/maze-so-puzzle.exe`
- `src-tauri/target/release/bundle/nsis/Maze so Puzzle - For Ame to
  Solve!_VERSION_x64-setup.exe`

For the current verified Windows artifact set, `VERSION` resolves to `0.8.0`.

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

## 5. Windows 0.8.0 staging record

- [x] Copy only artifacts from the final successful build into `release/` using
  versioned filenames.
- [x] Confirm the staged names are `Maze-so-Puzzle-0.8.0-portable.exe` and
  `Maze-so-Puzzle-0.8.0-setup.exe`.
- [x] Confirm both artifacts report file/product version 0.8.0 and remain clearly
  labelled as unsigned local test builds.
- [x] Generate final SHA-256 values after all copying (the current test build is unsigned):

```powershell
Get-FileHash .\release\Maze-so-Puzzle-0.8.0-portable.exe -Algorithm SHA256
Get-FileHash .\release\Maze-so-Puzzle-0.8.0-setup.exe -Algorithm SHA256
```

- [x] Confirm the staged portable and installer hashes match their final Tauri
  source artifacts byte-for-byte, then record the final 0.8.0 filenames, sizes,
  and hashes in `release/README.md` and `release/SHA256SUMS.txt`.
- [x] Record the portable at 47,846,912 bytes with SHA-256
  `6434B8EF5C237F34C3AF6A44743A9E4D55D291A8F15FD175DF44560471BD97FC`.
- [x] Record the installer at 41,335,529 bytes with SHA-256
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
