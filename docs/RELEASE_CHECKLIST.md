# Release checklist

Verification date: 2026-09-01

Use this checklist for the exact commit and artifacts that will be shared. A
successful earlier build does not validate files produced after another source,
dependency, configuration, or asset change.

Status for web 0.7.0: automated verification, dependency audit, locked Tauri
compile, and targeted production-browser checks are complete. Physical-iPad,
listening, accessibility, and broad manual play-through items remain deliberately
unclaimed. Sections 4 and 5 preserve the last verified Windows artifact record,
which is version 0.5.1; no 0.7.0 executable or installer is claimed.

## 1. Prepare

- [x] Confirm the intended 0.7.0 source version in `package.json`, `package-lock.json`,
  `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json`.
- [x] Confirm the title screen displays the optimized
  `public/assets/title-background-v1.webp`, while the PNG master remains at
  `docs/source-assets/title-background-v1.png` for provenance and future edits.
- [x] Confirm the 0.7.0 bundle contains continuous world-aligned SVG terrain,
  rounded convex and concave joins, periodic paired textures, flat connected hazard
  lips, picture-first UI, a held-weapon overlay, and locally bundled OST files.
- [x] Confirm the nine story mazes use nine distinct paired terrain themes, each
  has exactly one weapon and three unique pets, and the full campaign covers five
  weapons, five friendly enemy looks, eight species, and four cage styles.
- [x] Confirm every maze larger than 7 tiles renders a 7 x 7 player-centred
  camera and persistent fog-of-war minimap without changing full-grid engine
  behaviour.
- [x] Confirm the title-screen build label and exact `?debug=mazes` query expose
  the direct nine-maze tester picker, and tester completion cannot write rewards,
  records, unlocks, active sessions, or progress.
- [x] Update `CHANGELOG.md`, `README.md`, architecture, audit, and release
  documentation for the visual-variety build.
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
- [x] Dependency audit output is reviewed: zero known vulnerabilities.
- [x] `npm ls` reports a clean JavaScript dependency tree.
- [x] `npm run check:desktop` completes `cargo check --locked` without errors.
- [ ] A future 0.7.x Windows release separately runs `npm run desktop:build` and
  verifies both the release executable and NSIS installer before sharing them.
- [x] Automated level checks validate all nine story mazes: the first eight from
  9 x 9 through 17 x 17 plus the 25 x 25 Lanternlight Labyrinth, with separate
  ordinary and all-three-rescues solutions, one weapon, and three unique known
  pet species in every maze.
- [x] Authored-level checks preserve Wishing Woods' 108-step ordinary route and
  validate the optional Power 9 pebble-golem route: Power 2, `+2` potion, Power
  5, backtrack at Power 11, then rescue the guarded kitten.
- [x] Generator checks prove repeated seeds reproduce terrain, weapon, enemy,
  and cage variants without perturbing layout or progression determinism.
- [x] Focused exploration tests cover a centred 7 x 7 window, edge clamping,
  current field of view, and persistent reveal accumulation; the production
  browser pass confirms reveal reset on level switch.
- [ ] Add focused controller automation for buffered turns, deterministic holds,
  modifier safety, focus/visibility cleanup, D-pad press-and-hold, and pointer
  cancellation. The previous 0.4.0 pass manually confirmed synchronous keyboard
  movement and exactly one move per D-pad tap; repeat that check for the 0.7.0
  production web build and any future desktop package.
- [x] Repeat the relevant checks after final source changes (`npm run check`:
  164 of 164 tests plus the production build).

## 3. Browser play test

Test the production preview, not only the development server:

```powershell
npm run preview
```

- [x] 960 x 540: the maze and side panel fit without page overflow or clipping.
- [x] 1280 x 720: default layout is balanced and has no page overflow.
- [ ] 1366 x 768 and 1920 x 1080: artwork stays sharp and the board remains square.
- [x] Big Maze expands the board, keeps its compact Power/item/rescue HUD and
  feedback toast readable, and returns to the full UI with Escape or Normal.
- [ ] Portrait: the turn-sideways guidance appears and is readable.
- [ ] 200% zoom or increased text scaling does not hide required actions.
- [x] The title screen loads without a blank flash, presents clear primary focus,
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
- [ ] Left click or primary tap moves one square toward the pointer; right and
  middle click do not move Ame.
- [ ] On-screen arrows work with mouse and touch input, including press-and-hold
  travel and release/cancel cleanup.
- [ ] Help and completion dialogs trap focus, close as intended, restore focus,
  and remain usable with keyboard only.
- [ ] Mute state and reduced-motion preference are respected.
- [ ] Every pickup, blocked action, rescue, fight, loss, and victory has the
  intended sound or quiet fallback; also check title, menu, selection,
  achievement, and stamp cues plus locally bundled background music across the
  title, early story, later story, and surprise mazes.
- [ ] All nine story levels can be completed manually; also complete several
  surprise mazes and compare observed routes with the validated solver results.
- [x] In both an early 9 x 9 maze and later large mazes, the main view stays
  7 x 7, follows Ame without exposing off-camera objects, clamps cleanly at map
  edges, and remains readable.
- [x] The minimap shows every tile in the current field of view, remembers tiles
  after they leave view, masks unvisited areas, and resets on a new level.
- [x] On the normal URL, the discreet build-label button opens the direct picker.
  The exact `?debug=mazes` query opens it automatically, while other query values
  do not. It lists every authored maze, bypasses locks, labels previews clearly,
  and leaves saved progress unchanged.
- [x] All three pets are optional for the ordinary exit and jointly rescuable
  for the perfect reward.
- [ ] Sample every story theme and generated variant on the production URL:
  paired materials tile cleanly, enemy/pet/cage art matches the UI, inventory is
  picture-led, and Ame holds the level's selected weapon after collection.
- [ ] Loss resets the exact level cleanly without duplicating rewards.
- [ ] Existing schema-v1 and schema-v2 saves migrate safely to schema v3,
  malformed data fails gently, and unknown historical species/source facts are
  not invented.
- [ ] Completion updates distinct-maze, total-completion, generated-maze,
  species, perfect-rescue, streak, best-step, and best-Power statistics exactly
  once, including after a replay.
- [ ] Each of the nine stat-driven badges unlocks at its documented threshold and
  new rewards appear once without duplicate fanfare.

## 4. Historical Windows 0.5.1 artifact test

Expected build outputs:

- `src-tauri/target/release/maze-so-puzzle.exe`
- `src-tauri/target/release/bundle/nsis/Maze so Puzzle - For Ame to
  Solve!_VERSION_x64-setup.exe`

For the last verified Windows artifact set, `VERSION` resolves to `0.5.1`.

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

## 5. Historical Windows 0.5.1 staging record

- [x] Copy only artifacts from the final successful build into `release/` using
  versioned filenames.
- [x] Confirm the staged names are `Maze-so-Puzzle-0.5.1-portable.exe` and
  `Maze-so-Puzzle-0.5.1-setup.exe`.
- [x] Keep the Windows artifacts clearly identified as the last verified 0.5.1
  desktop build; never present them as the current 0.7.0 web build.
- [x] Generate final SHA-256 values after all copying (the current test build is unsigned):

```powershell
Get-FileHash .\release\Maze-so-Puzzle-*-portable.exe -Algorithm SHA256
Get-FileHash .\release\Maze-so-Puzzle-*-setup.exe -Algorithm SHA256
```

- [x] Confirm the staged portable and installer hashes match their final Tauri
  source artifacts byte-for-byte, then record the final 0.5.1 filenames, sizes,
  and hashes in `release/README.md` and `release/SHA256SUMS.txt`.

- [ ] Verify the published hashes against newly downloaded copies.
- [ ] Check filenames, sizes, version metadata, release notes, and download links.
- [ ] Record the Windows versions and machines used for the clean-install test.

## 6. Handoff

- [ ] Give testers the current filename, whether it is signed, controls, known
  limitations, and a short feedback prompt.
- [ ] Ask for the level number or surprise-maze seed with every gameplay report.
- [ ] Archive the exact source revision, lockfiles, prompt provenance, checksums,
  and release notes needed to reproduce the build.
