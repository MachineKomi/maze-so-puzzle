# Maze so Puzzle: For Ame to Solve!

[![Browser build](https://github.com/MachineKomi/maze-so-puzzle/actions/workflows/ci.yml/badge.svg)](https://github.com/MachineKomi/maze-so-puzzle/actions/workflows/ci.yml)

![Ame and her animal friends beside a magical storybook maze](public/assets/title-background-v1.webp)

A gentle, browser-first fantasy maze game for young players, with an optional
Windows desktop build powered by Tauri 2. This README describes playable build
0.5.1, which is still an active play-test prototype.

![The previous 0.4.0 Little Star Trail build, with Ame's maze on the left and her picture-led adventure panel on the right](docs/screenshots/gameplay-v0.4.0.png)

## Requirements

- Node.js `^20.19.0` or `>=22.12.0` and npm.
- Rust 1.77.2 or newer plus the Windows Tauri prerequisites for desktop builds.
- Microsoft Edge WebView2 for the Windows executable.

## Play the browser build

```powershell
npm ci
npm run dev
```

Open <http://127.0.0.1:1420>. Progress is stored locally in that browser profile.

Production browser build:

```powershell
npm run build
npm run preview
```

## Deploy the browser game

The project includes a zero-backend Vercel configuration for a static Hobby-plan
deployment. Import `MachineKomi/maze-so-puzzle` from the Vercel dashboard; the
committed settings select Vite, `npm ci`, `npm run build`, and `dist` with no
environment variables or paid services. See the
[Vercel deployment guide](docs/VERCEL_DEPLOYMENT.md).

## Play or build the Windows app

Run the desktop development build:

```powershell
npm run desktop:dev
```

Build the standalone executable and NSIS installer:

```powershell
npm run desktop:build
```

The most recently verified desktop artifacts are the unsigned 0.5.1 test build:

- Easy-to-find local test copies: `release/Maze-so-Puzzle-0.5.1-portable.exe`
  and `release/Maze-so-Puzzle-0.5.1-setup.exe`. Executables are deliberately
  excluded from source history and should be attached to a GitHub Release.
- Standalone app: `src-tauri/target/release/maze-so-puzzle.exe`.
- Installer: `src-tauri/target/release/bundle/nsis/Maze so Puzzle - For Ame to
  Solve!_0.5.1_x64-setup.exe`.
- The verified 0.5.1 hashes and retained archive hashes are recorded in
  [`release/SHA256SUMS.txt`](release/SHA256SUMS.txt). Executable test builds stay
  out of Git history and can be published separately as GitHub Release assets.

## Controls

- Arrow keys or `WASD`: move one square.
- Click or tap anywhere on the maze: move one square in the dominant direction
  from Ame. There is deliberately no destination pathfinding.
- On-screen arrows: touch- and mouse-friendly movement.
- Hold a keyboard direction or an on-screen arrow for quick, predictable travel
  through a path; a tap still moves exactly one square.
- Touch devices receive a larger 44 px-minimum direction pad and shorter
  touch-specific instructions.
- Big Maze: enlarge the board while keeping a compact Power, rescue, and item
  HUD; press `Escape` or Normal to return to the full side panel.
- Lanternlight Labyrinth uses a player-centred 7 x 7 exploration view. Its
  minimap reveals the current view immediately and remembers every square Ame
  has already explored while keeping the rest hidden.

## Tester preview mode

Append the exact query `?debug=mazes` to the game URL to expose the compact
maze-skip control. It cycles through all authored mazes, including locked ones,
for quick visual testing. Runs entered through this tester control are previews:
completion rewards, records, unlocks, and saved progress are not changed. The
control is absent from the interface when that exact query is not present.

## Included in playable build 0.5.1

- Nine progressive story mazes: eight readable mazes from 9 x 9 through 17 x 17,
  followed by the 25 x 25 **Lanternlight Labyrinth** exploration finale.
- A player-centred 7 x 7 camera for Lanternlight Labyrinth and a persistent
  fog-of-war minimap that distinguishes Ame's current view, explored passages,
  and still-mysterious parts of the maze. A bright outline links the minimap to
  the exact 7 x 7 area currently shown on the main board.
- Fresh, solver-validated 9 x 9 through 17 x 17 surprise mazes from the
  deterministic "New maze" generator.
- Three optional animal friends to rescue in every maze: a bunny, fox, and kitten.
- A new illustrated title screen, backed by original AI-generated key art, with
  Continue, Adventure Book, and Surprise Maze shortcuts.
- An Adventure Book showing story-maze clears, best step counts, rescue records,
  cumulative bunny/fox/kitten totals, gold, completion statistics, stickers,
  rescue medals, and nine stat-driven achievement badges.
- Persistent gold rewards, three collectible stickers, best results, and rescue
  medals for 5, 10, and 15 perfect three-animal rescues.
- Sword-gated goblin encounters and visible Power numbers.
- Ame visibly holds her sword after collecting it, and Power numbers sit above
  character art without covering faces.
- Power growth from defeated lower-level goblins and `+2` potions.
- Colour-coded star keys and matching doors.
- Protective boots for water and warm magical lava.
- Exact level reset after a loss, schema-v3 saved progress with defensive v1/v2
  migration, a pictorial help card, mute control, and reduced-motion support.
- A separately validated active-run snapshot lets authored story mazes resume at
  the exact position, inventory, Power, step count, rescue state, and explored
  map after a refresh or app restart. Tester and generated runs are excluded.
- Expanded synthesized sound design for movement and interactions plus title,
  menu, selection, achievement, stamp, rescue, loss, and victory moments, with
  a locally bundled looping soundtrack for title, story, and surprise mazes.
- Upgraded v2 AI-generated art, including Ame, animal friends, goblins, items,
  doors, goals, UI decoration, and seamless floor, stone wall, water, and lava
  treatments. Terrain art now repeats at a consistent two- or three-tile scale,
  with restrained outer rounding, softened inner joins, and blended hazards.
- A cleaner picture-first sidebar with larger rescue friends and inventory art,
  less repeated text, and clearer found/missing silhouettes.
- A 16:9 landscape presentation with a friendly turn-sideways screen on portrait
  devices.
- Safe session navigation: a maze can be resumed after visiting Home, the
  Adventure Book, refreshing the page, or reopening the app; changing maze
  mid-run asks for confirmation.

## Solvability and game rules

The core engine is immutable and UI-independent. Generated and curated levels
are checked with a stateful breadth-first solver that tracks position, Power,
sword, boots, keys, rescued animals, collected pickups, defeated goblins, and
opened doors. Geometric reachability alone is never treated as proof that a
level is solvable.

Combat uses one child-friendly rule: Ame wins when her Power is **at least** the
goblin's Power. Winning adds the goblin's number to Ame's Power. A stronger
goblin triggers a low-stakes retry screen and restores the same level state.

Core modules live in `src/game/`:

- `engine.ts`: movement and interactions.
- `levels.ts`: the nine authored story levels.
- `exploration.ts`: clamped camera windows, field-of-view tiles, and persistent
  minimap reveal state.
- `solver.ts`: structural validation and stateful solution search.
- `generator.ts`: seeded perfect-maze generation and progression placement.

## Verification

```powershell
npm run check
npm audit
npm run check:desktop
npm run desktop:build
```

`npm run check` runs the complete unit suite followed by the strict TypeScript
and Vite production build. The suite covers movement, interactions, solvability,
generation, animal rescues, camera and fog-of-war rules, progress migration,
rewards, statistics, achievements, protected navigation, and audio safeguards.
The 0.5.1 candidate passed 122 automated tests, the production build, targeted
960 x 540, 1280 x 720, and iPad-sized landscape browser checks, locked desktop compile,
Tauri packaging, source-to-stage hash comparison, and a responsive five-second
portable smoke launch. Clean-machine installer, signing, listening, and broad
manual play-through checks remain in the release checklist.

The required manual browser and Windows test matrix is maintained in
[`docs/RELEASE_CHECKLIST.md`](docs/RELEASE_CHECKLIST.md); run it again against
the exact artifacts that will be shared. The Windows test installer is unsigned,
so Windows SmartScreen may show a warning. A public release should be code-signed.

## Project documentation

- [Architecture and extension points](docs/ARCHITECTURE.md)
- [Soundtrack catalogue and playback policy](docs/MUSIC.md)
- [Vercel deployment guide](docs/VERCEL_DEPLOYMENT.md)
- [Privacy and saved-data notes](docs/PRIVACY.md)
- [AI asset provenance and prompts](docs/AI_ASSET_PROMPTS.md)
- [Project audit and prioritized backlog](docs/PROJECT_AUDIT.md)
- [Release checklist](docs/RELEASE_CHECKLIST.md)
- [Player-visible changelog](CHANGELOG.md)
- [Windows test-build notes](release/README.md)

## Licensing

No source-code or asset licence has been selected yet. Publishing this repository
does not grant permission to copy, redistribute, or reuse its code or artwork;
copyright remains with the project owner until an explicit licence is added.
