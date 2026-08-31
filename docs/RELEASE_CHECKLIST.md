# Release checklist

Use this checklist for the exact commit and artifacts that will be shared. A
successful earlier build does not validate files produced after another source,
dependency, configuration, or asset change.

Status for 0.3.0: local source integration, production-browser smoke testing,
Tauri packaging, staging, hashing, and portable launch testing are complete.
Unchecked items below still require the stated device, owner decision, or full
manual play-through and are not implied by the 79-test suite.

## 1. Prepare

- [x] Confirm the intended version in `package.json`, `package-lock.json`,
  `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json`.
- [x] Confirm the title screen displays the optimized
  `public/assets/title-background-v1.webp`, while the PNG master remains at
  `docs/source-assets/title-background-v1.png` for provenance and future edits.
- [x] Update `CHANGELOG.md`, `README.md`, and `docs/AI_ASSET_PROMPTS.md` as needed.
- [ ] Confirm every production image has known provenance and the game contains
  no unlicensed third-party material.
- [ ] Make the owner-approved licence decision before publishing source or
  redistributable assets.
- [ ] Review `git status --short` if the folder is under version control; preserve
  intentional local work and remove no user-owned files.
- [ ] Start from a clean dependency install with `npm ci`.

## 2. Automated verification

Run each command from the project root in PowerShell:

```powershell
npm run check
npm audit
npm run check:desktop
npm run desktop:build
```

- [x] `npm run check` reports that every unit test passes and that TypeScript and
  the Vite production build complete without errors; the 0.3.0 suite currently
  contains 79 tests.
- [x] Dependency audit output is reviewed: `npm audit` reported 0 vulnerabilities.
- [x] `npm run check:desktop` completes the locked Rust compile without errors.
- [x] Tauri produces both the release executable and the NSIS installer.
- [x] Repeat the relevant checks if any file changes after this point.

## 3. Browser play test

Test the production preview, not only the development server:

```powershell
npm run preview
```

- [x] 960 x 540: the maze, side panel, controls, and dialogs fit without clipping.
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
- [x] Visiting Home or Adventure Book mid-maze preserves the active run; choosing
  a different maze after moving opens a confirmation and keyboard input cannot
  move Ame behind it.
- [x] The Adventure Book scrolls internally without page overflow and accurately
  shows overall totals, bunny/fox/kitten counts, sticker/medal/badge ownership,
  locked story levels, cleared levels, best steps, and rescue pips.
- [x] Arrow keys and WASD each move one legal square.
- [ ] Left click or primary tap moves one square toward the pointer; right and
  middle click do not move Ame.
- [ ] On-screen arrows work with mouse and touch input.
- [ ] Help and completion dialogs trap focus, close as intended, restore focus,
  and remain usable with keyboard only.
- [ ] Mute state and reduced-motion preference are respected.
- [ ] Every pickup, blocked action, rescue, fight, loss, and victory has the
  intended sound or quiet fallback; also check title, menu, selection,
  achievement, and stamp cues.
- [ ] All eight story levels, including both 21 x 21 and both 23 x 23 levels, can
  be completed; also complete several surprise mazes.
- [ ] All three animals are optional for the ordinary exit and jointly rescuable
  for the perfect reward.
- [ ] Loss resets the exact level cleanly without duplicating rewards.
- [ ] Existing schema-v1 and schema-v2 saves migrate safely to schema v3,
  malformed data fails gently, and unknown historical species/source facts are
  not invented.
- [ ] Completion updates distinct-maze, total-completion, generated-maze,
  species, perfect-rescue, streak, best-step, and best-Power statistics exactly
  once, including after a replay.
- [ ] Each of the nine stat-driven badges unlocks at its documented threshold and
  new rewards appear once without duplicate fanfare.

## 4. Windows artifact test

Expected build outputs:

- `src-tauri/target/release/maze-so-puzzle.exe`
- `src-tauri/target/release/bundle/nsis/Maze so Puzzle - For Ame to
  Solve!_VERSION_x64-setup.exe`

For this release, `VERSION` must resolve to `0.3.0`.

- [ ] Launch the standalone executable on a clean Windows x64 account.
- [ ] Install, launch, save progress, close, reopen, and uninstall the NSIS build.
- [ ] Confirm the title, icon, minimum window size, resize behaviour, landscape
  guidance, audio, and local save all work in the WebView2 desktop runtime.
- [ ] Test a path containing spaces and a non-administrator install where allowed.
- [ ] Confirm an upgrade preserves expected progress.
- [ ] Scan final files using the project's approved malware-scanning process.
- [ ] Sign the executable and installer for public distribution, then test the
  signed files again. If unsigned, label them clearly.

## 5. Stage and verify release copies

- [x] Copy only artifacts from the final successful build into `release/` using
  versioned filenames.
- [x] Confirm the staged names are `Maze-so-Puzzle-0.3.0-portable.exe` and
  `Maze-so-Puzzle-0.3.0-setup.exe`.
- [x] Keep older artifacts clearly identified as archives, or move them to the
  chosen archive location; never present them as the current build.
- [x] Generate final SHA-256 values after all copying (the current test build is unsigned):

```powershell
Get-FileHash .\release\Maze-so-Puzzle-*-portable.exe -Algorithm SHA256
Get-FileHash .\release\Maze-so-Puzzle-*-setup.exe -Algorithm SHA256
```

- [ ] Verify the published hashes against newly downloaded copies.
- [ ] Check filenames, sizes, version metadata, release notes, and download links.
- [ ] Record the Windows versions and machines used for the clean-install test.

## 6. Handoff

- [ ] Give testers the current filename, whether it is signed, controls, known
  limitations, and a short feedback prompt.
- [ ] Ask for the level number or surprise-maze seed with every gameplay report.
- [ ] Archive the exact source revision, lockfiles, prompt provenance, checksums,
  and release notes needed to reproduce the build.
