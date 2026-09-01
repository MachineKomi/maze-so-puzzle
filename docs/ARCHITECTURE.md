# Architecture

Maze so Puzzle is a browser-first, client-only React game. The same production
web bundle is embedded by Tauri for the optional Windows application. There is
no backend, account system, analytics service, advertisement SDK, or remote game
state.

## Runtime flow

1. `src/main.tsx` mounts the React application.
2. `src/App.tsx` owns screen navigation and presents the title, Adventure Book,
   maze board, side panel, dialogs, rewards, accessibility descriptions, and the
   SVG terrain surface. Terrain patterns use global maze coordinates rather than
   restarting inside each rendered cell. It resolves each level's picture-first
   terrain, weapon, enemy, pet, and cage presentation and overlays the selected
   weapon in Ame's hands after collection.
3. `src/game/engine.ts` applies one immutable movement or interaction step.
4. Authored levels come from `src/game/levels.ts`; surprise levels come from the
   deterministic generator in `src/game/generator.ts`. Level and object records
   carry stable visual IDs without placing artwork concerns in the engine.
5. `src/game/solver.ts` validates structural rules and searches the exact engine
   state space to prove both an ordinary solution and an all-animal solution.
6. `src/game/exploration.ts` derives clamped camera windows, the shared camera
   policy, and immutable reveal sets. Any level wider or taller than 7 tiles
   renders a 7 x 7 player-centred view while the engine and solver continue to
   use full-level coordinates.
7. `src/game/terrainGeometry.ts` traces connected orthogonal cell unions into
   rounded SVG paths in stable world coordinates, including holes, diagonal
   contacts, and the camera gutter used by the renderer.
8. `src/progress.ts` calculates rewards and stores a sanitized schema-v3 snapshot
   in browser `localStorage`.
9. `src/session.ts` validates and stores a schema-v1 snapshot for an unfinished
   normal authored run, including exploration reveal state. It rejects tester,
   generated, corrupt, inconsistent, and completed states.
10. `src/sound.ts` synthesizes short interaction and fanfare cues with the Web
   Audio API; those effects require no recorded audio files.
11. `src/music.ts` selects and safely loops the locally shipped MP3 soundtrack.
   Playback begins only from a user gesture, follows the shared mute control,
   pauses while the page or app is hidden, and degrades harmlessly when media is
   unavailable. Track roles and reserved music are documented in `docs/MUSIC.md`.
12. `src/artCatalog.ts` maps the typed visual IDs to runtime artwork, labels,
   material periods, and fallbacks. The current catalogue contains nine paired
   terrain themes, five weapons, five friendly enemy looks, eight pet species,
   and four cages.

## Important boundaries

- The engine, generator, solver, rewards, and navigation decisions are UI-agnostic
  pure TypeScript wherever practical.
- Visual IDs are presentation metadata. Combat depends on an enemy's Power, not
  its illustration; collecting any weapon sets the same engine sword flag for
  save compatibility. Each story maze has one weapon and three unique pets.
- Generated-maze presentation is selected from dedicated deterministic hash
  streams. Recreating a seed reproduces both its puzzle and visual variants,
  while adding artwork choices cannot perturb topology or progression placement.
- The browser build uses only local static assets from `public/`.
- Progress belongs to the current browser or Tauri WebView profile. It is not
  synchronized between devices.
- Camera coordinates affect presentation only. Movement, collision, combat,
  collection, and solving continue to operate in global level coordinates.
- Terrain geometry is a connected cell union rendered through SVG. Globally
  aligned `userSpaceOnUse` patterns keep the floor, wall, water, and lava art in
  world coordinates as the camera moves. Boundary tracing resolves diagonal
  touches deterministically, preserves holes, rounds convex and concave corners,
  and includes a camera gutter so the viewport edge cannot invent a corner.
- Water and lava use connected region outlines, a separate shallow floor-colour
  lip, and no cast shadow. Their periodic textures remain aligned across joins.
- The exploration minimap unions the current field of view with an immutable
  reveal set. Unvisited tiles remain masked; a new level starts a fresh map, and
  an unfinished authored run restores only a validated saved reveal set.
- The secret tester picker opens from the title screen's build label or
  automatically when the URL has the exact `debug=mazes` query value.
  Tester-entered runs are marked as previews and must bypass all reward,
  active-session, and progress writes, even if the preview maze is completed.
- Tauri exposes only its default core capability and loads the local Vite build
  under a restrictive content security policy.
- The current 0.7.0 source is a web release. Architecture compatibility with
  Tauri is not binary verification; the last verified Windows executable and
  installer remain version 0.5.1 until separately rebuilt and checked.
- AI-generated source art and exact prompts are recorded in
  `docs/AI_ASSET_PROMPTS.md`; source-only masters are kept outside `public/` so
  they do not inflate deployments.

## Testing strategy

The Vitest suite exercises movement, combat, items, hazards, authored and
generated solvability, optional rescues, exploration-camera activation and
reveal-set rules, terrain boundary geometry, persistence migrations,
achievements, synthesized-sound and background-music safeguards, and protected
navigation. It also checks the complete art catalogue, authored visual variety,
deterministic generated variants, one weapon and three unique pets per maze, and
the optional Wishing Woods guardian route.
Every authored maze and sampled generated maze is run through the stateful
solver. `npm run check` is the normal browser release gate; locked Cargo
compilation and a Tauri bundle build are the additional Windows gates.

## Extension points

- Add mechanics through the `TerrainKind`, `LevelObject`, and `GameEvent` unions,
  then implement the rule once in the engine and teach the solver through that
  same transition function.
- Add story mazes to `CURATED_LEVELS`; structural and progression tests will
  reject unsolvable or incorrectly gated content. Give each new story an
  intentional terrain theme, weapon/enemy/cage styles, and three distinct pets.
- Add a visual variant by extending the typed ID union and `artCatalog.ts`, then
  supply and validate the local asset. Keep engine behavior keyed to object kind
  and Power rather than art labels or filenames.
- The zoomed exploration presentation is a dimension rule, not an authored-level
  flag: if either dimension exceeds `DEFAULT_FOV_SIZE` (currently 7), use the
  camera and minimap. Change that shared rule and its boundary tests together.
- Add a terrain kind by extending the engine union and supplying its connected
  SVG fill, boundary treatment, and globally aligned periodic pattern. Do not
  reintroduce independently textured or rounded DOM cells.
- Add generated-maze rules through deterministic placement phases followed by
  ordinary and perfect-rescue validation.
- Add durable statistics by versioning and defensively migrating the progress
  schema rather than changing saved data in place.
- Add background contexts through `MUSIC_TRACKS` and the existing gesture-safe
  controller. Keep short event stings separate from looping music, and preserve
  the reserved arena and friendship-cue assets until their mechanics are added.
