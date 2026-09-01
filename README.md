# Maze so Puzzle: For Ame to Solve!

[![Browser build](https://github.com/MachineKomi/maze-so-puzzle/actions/workflows/ci.yml/badge.svg)](https://github.com/MachineKomi/maze-so-puzzle/actions/workflows/ci.yml)

![Ame and her animal friends beside a magical storybook maze](public/assets/title-background-v1.webp)

A gentle, browser-first fantasy maze game for young players, with an optional
Windows desktop build powered by Tauri 2. This README describes the current
playable 0.7.0 web release, which remains an active play-test prototype. The
last verified downloadable Windows binaries remain version 0.5.1 until a new
desktop package is built and checked separately.

![The previous 0.4.0 Little Star Trail build, with Ame's maze on the left and her picture-led adventure panel on the right](docs/screenshots/gameplay-v0.4.0.png)

## Requirements

- Node.js `^20.19.0` or `>=22.12.0` and npm.
- Rust 1.77.2 or newer plus the Windows Tauri prerequisites for desktop builds.
- Microsoft Edge WebView2 for the Windows executable.

## Play the browser build

The current public build is available at
[maze-so-puzzle.vercel.app](https://maze-so-puzzle.vercel.app/).

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

The GitHub repository is connected to the zero-backend Vercel Hobby project at
[maze-so-puzzle.vercel.app](https://maze-so-puzzle.vercel.app/). A push to
`main` automatically builds and promotes the new production deployment; other
branches can receive preview deployments. The committed settings select Vite,
`npm ci`, `npm run build`, and `dist` with no environment variables or paid
services. See the [Vercel deployment guide](docs/VERCEL_DEPLOYMENT.md).

## Play or build the Windows app

Run the desktop development build:

```powershell
npm run desktop:dev
```

Build the standalone executable and NSIS installer:

```powershell
npm run desktop:build
```

The source version has advanced to 0.7.0 for the web release, but that alone does
not verify a desktop binary. The most recently verified desktop artifacts are
the unsigned 0.5.1 test build:

- Easy-to-find local test copies: `release/Maze-so-Puzzle-0.5.1-portable.exe`
  and `release/Maze-so-Puzzle-0.5.1-setup.exe`. Executables are deliberately
  excluded from source history and should be attached to a GitHub Release.
- Original standalone build output: `src-tauri/target/release/maze-so-puzzle.exe`
  (this mutable path may be replaced by a later local build).
- Original installer output: `src-tauri/target/release/bundle/nsis/Maze so
  Puzzle - For Ame to Solve!_0.5.1_x64-setup.exe`.
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
- Any maze wider or taller than 7 tiles uses a player-centred 7 x 7 exploration
  view. Its minimap reveals the current view immediately and remembers every
  square Ame has already explored while keeping the rest hidden.

## Tester preview mode

On the title screen, click or tap the small **Playable build 0.7.0** label to
open the secret tester maze picker. The same picker opens automatically when the
exact query `?debug=mazes` is appended to the game URL. It gives direct access to
every authored maze, including locked ones, and labels each maze's dimensions
and camera mode. Runs entered through the picker are previews: completion
rewards, records, unlocks, active-run recovery, and saved progress are not
changed.

## Included in playable web build 0.7.0

- Nine progressive story mazes: eight readable mazes from 9 x 9 through 17 x 17,
  followed by the 25 x 25 **Lanternlight Labyrinth** exploration finale.
- A consistent player-centred 7 x 7 camera for every maze whose width or height
  exceeds 7 tiles, including all current story and Surprise Mazes. A persistent
  fog-of-war minimap distinguishes Ame's current view, explored passages, and
  still-mysterious parts of the maze; a bright outline links it to the exact
  area shown on the main board.
- Fresh, solver-validated 9 x 9 through 17 x 17 surprise mazes from the
  deterministic "New maze" generator. Each seed also selects its illustrated
  terrain, weapon, friendly enemy, and cage variants deterministically.
- Nine distinct paired floor-and-wall themes across the story campaign, plus
  five weapon looks, five friendly enemy looks, eight pet species, and four cage
  styles. Every maze contains one weapon and three different optional pets.
- A new illustrated title screen, backed by original AI-generated key art, with
  Continue, Adventure Book, and Surprise Maze shortcuts.
- An Adventure Book showing story-maze clears, best step counts, rescue records,
  cumulative totals for all eight pet species, gold, completion statistics,
  stickers, rescue medals, and nine stat-driven achievement badges.
- Persistent gold rewards, three collectible stickers, best results, and rescue
  medals for 5, 10, and 15 perfect three-animal rescues.
- Weapon-gated friendly enemy encounters and visible Power numbers. Wishing
  Woods includes an optional Power 9 pebble-golem guarding a kitten: Ame can
  take the easy exit or defeat smaller foes, use a potion, and backtrack for the
  perfect rescue.
- Ame visibly holds the level's collected weapon, and Power numbers sit above
  character art without covering faces.
- Power growth from defeated lower-level enemies and `+2` potions.
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
- Continuous SVG terrain rendered in global maze coordinates, so textures do
  not restart or reveal a border at every grid square. The AI-generated paired
  floor and wall materials tile seamlessly at a readable scale; periodic water
  and lava textures join into connected regions. Exact convex and concave wall
  curves follow bends cleanly, while hazards have rounded banks, a flat subtle
  floor lip, and no cast shadow.
- A cleaner picture-first sidebar with larger rescue friends, cages, enemy and
  inventory variants, less repeated text, clearer found/missing silhouettes,
  and the selected weapon overlaid in Ame's hands.
- A 16:9 landscape presentation with a friendly turn-sideways screen on portrait
  devices.
- Safe session navigation: a maze can be resumed after visiting Home, the
  Adventure Book, refreshing the page, or reopening the app; changing maze
  mid-run asks for confirmation.

## Solvability and game rules

The core engine is immutable and UI-independent. Generated and curated levels
are checked with a stateful breadth-first solver that tracks position, Power,
weapon, boots, keys, rescued animals, collected pickups, defeated enemies, and
opened doors. Geometric reachability alone is never treated as proof that a
level is solvable.

Combat uses one child-friendly rule: Ame wins when her Power is **at least** the
enemy's Power. Winning adds the enemy's number to Ame's Power. A stronger enemy
triggers a low-stakes retry screen and restores the same level state.

Core modules live in `src/game/`:

- `engine.ts`: movement and interactions.
- `levels.ts`: the nine authored story levels.
- `exploration.ts`: clamped camera windows, field-of-view tiles, and persistent
  minimap reveal state.
- `terrainGeometry.ts`: connected rounded SVG boundaries in stable maze/world
  coordinates for walls, water, and lava.
- `solver.ts`: structural validation and stateful solution search.
- `generator.ts`: seeded perfect-maze generation and progression placement.

## Verification

```powershell
npm run check
npm audit
npm run check:desktop
```

`npm run check` runs the complete unit suite followed by the strict TypeScript
and Vite production build. The suite covers movement, interactions, solvability,
generation, animal rescues, camera and fog-of-war rules, progress migration,
rewards, statistics, achievements, protected navigation, deterministic visual
variants, the optional guardian route, and audio safeguards.
The 0.7.0 web release gate passes 164 automated tests, the strict TypeScript and
production Vite build, a zero-vulnerability npm audit, the locked Tauri compile,
and focused landscape-browser checks for the tester picker, 7 x 7 camera,
persistent minimap reveal, connected terrain, hazard treatment, and layout
overflow. Repeat the public URL smoke after every production push.

The browser matrix and the historical 0.5.1 Windows artifact record are kept in
[`docs/RELEASE_CHECKLIST.md`](docs/RELEASE_CHECKLIST.md). Building a future
Windows package is a separate release step:

```powershell
npm run desktop:build
```

The retained 0.5.1 Windows test installer is unsigned, so Windows SmartScreen
may show a warning. Any future broadly distributed Windows release should be
code-signed.

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
