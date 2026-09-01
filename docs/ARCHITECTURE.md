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
   weapon in Ame's hands after collection. It also owns primary-pointer capture,
   repeat timing, the touch cursor, rescued-pet follower presentation, and the
   short cancellable jump, battle, rescue, and Power-count-up presentations.
3. `src/game/engine.ts` applies one immutable movement or interaction step.
4. Authored levels come from `src/game/levels.ts`; surprise levels come from the
   deterministic generator in `src/game/generator.ts`. The generator selects a
   seeded odd size from unlocked 9–29 bands, grows solver-safe connected
   2–4-tile water/lava regions only beyond the splash-boots gate, and can place
   one- or two-square hole runs only after reachable Spring Boots. Later
   adventure seeds place selected prerequisites on dead-end branches to create
   intentional detours. Level and object records carry stable visual IDs without
   placing artwork concerns in the engine. The authored campaign deliberately
   uses 9, 11, 13, 15, 13, 15, 17, 17, 19, 25, 21, and 23 tile boards. The two
   newest adventures add four- and five-friend backtracking routes; Moonlit
   Friendship Quest also requires an Antidote Leaf detour before poison.
5. `src/game/solver.ts` validates structural rules and searches the exact engine
   state space to prove both an ordinary solution and an all-animal solution.
6. `src/game/exploration.ts` derives clamped camera windows, the shared camera
   policy, and immutable reveal sets. Any level wider or taller than 6 tiles
   renders a 6 x 6 player-centred view while the engine and solver continue to
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
   A session-scoped deterministic picker maps each maze to one of five full
   tracks and avoids an immediate repeat; the short friendship cue is excluded.
   Playback begins only from a user gesture, follows the shared mute control,
   pauses while the page or app is hidden, and degrades harmlessly when media is
   unavailable. Track roles and reserved music are documented in `docs/MUSIC.md`.
12. `src/artCatalog.ts` maps the typed visual IDs to runtime artwork, labels,
   material periods, dominant-colour families, compatibility rules, and
   fallbacks. Gold/yellow floors cannot pair with green/sage walls. The current
   catalogue contains ten compatible terrain themes, five weapons, five
   friendly enemy looks, eight pet species, and four fully opaque AI-generated
   front cage layers.
13. `src/pointerControls.ts` converts mouse/touch positions into tile-relative
   cardinal intent and applies the strict one-tile, wall-only corner assist. It
   never pathfinds or assists across hazards, unresolved doors, or enemies.
14. `src/game/followerTrail.ts` keeps a bounded loop-free history of squares Ame
   has left and selects distinct visible footprints for rescued friends.

## Important boundaries

- The engine, generator, solver, rewards, and navigation decisions are UI-agnostic
  pure TypeScript wherever practical.
- Visual IDs are presentation metadata. Combat depends on an enemy's Power, not
  its illustration; collecting any weapon sets the same engine sword flag for
  save compatibility. Each story maze has one weapon and between one and five
  distinct optional pets.
- Ground holes are engine terrain, not decorative art. A normal step is blocked
  until Spring Boots are collected; one directional input then scans across the
  consecutive hole run and lands on the first valid non-hole square. The engine
  emits the complete jump path so the UI can animate it, while the solver uses
  the exact same transition and cannot assume a safe landing.
- Poison is connected engine terrain. It blocks until an `antidote-leaf`
  object has been collected; engine, solver, structural validation, art
  preloading, minimap, accessibility descriptions, and active-run migration use
  the same typed rule.
- Underpowered armed enemy contact emits `enemy-too-strong`, returns the exact
  same playing `GameState` object, and never advances steps, Power, position, or
  interaction IDs. The UI owns the reassuring comparison dialog.
- Generated-maze presentation is selected from dedicated deterministic hash
  streams. Recreating a seed reproduces both its puzzle and visual variants,
  while adding artwork choices cannot perturb topology or progression placement.
- The browser build uses only local static assets from `public/`.
- Progress belongs to the current browser or Tauri WebView profile. It is not
  synchronized between devices.
- Camera coordinates affect presentation only. Movement, collision, combat,
  collection, and solving continue to operate in global level coordinates.
- Primary mouse and touch input begins only on the maze board. Pressing moves one
  tile immediately; holding repeats; dragging continuously recalculates the
  dominant direction; release, cancellation, recentering, modal entry, blur, or
  visibility loss clears queued pointer input. Pointer-only corner assistance
  can take one safe perpendicular floor step around an immediately intended wall
  but cannot follow a wall or bypass a hazard, door, or enemy. Keyboard and D-pad
  controls remain independent.
- Terrain geometry is a connected cell union rendered through SVG. Globally
  aligned `userSpaceOnUse` patterns keep the floor, wall, water, lava, and poison art in
  world coordinates as the camera moves. Boundary tracing resolves diagonal
  touches deterministically, preserves holes, rounds convex and concave corners,
  and includes a camera gutter so the viewport edge cannot invent a corner.
- Water, lava, and poison use slightly inset, softly feathered connected rounded
  fills with no outline, floor lip, raised edge, or cast shadow. Their periodic
  textures remain aligned across joins.
- Floor and wall paintings are converted from retained ImageGen masters with a
  periodic-plus-smooth Poisson correction, then rendered at a small world scale.
  Selected themes may add a sparse, world-aligned transparent dressing pattern;
  dressing is presentation-only and clipped by the same connected terrain shape.
- Rescued pets follow recent distinct visible footprints only; the follower
  trail is transient presentation state and never changes collision, solving,
  rewards, or durable progress.
- Battle and rescue flourishes are cancellable presentation state layered over
  immutable engine events. Input is briefly locked while the visual handoff is
  legible; restart, navigation, level change, unmount, and reduced-motion mode
  cancel or shorten timers without replaying the engine transition.
- The exploration minimap unions the current field of view with an immutable
  reveal set. Unvisited tiles remain masked; a new level starts a fresh map, and
  an unfinished authored run restores only a validated saved reveal set.
- The secret tester picker opens from the title screen's build label or
  automatically when the URL has the exact `debug=mazes` query value.
  Tester-entered runs are marked as previews and must bypass all reward,
  active-session, and progress writes, even if the preview maze is completed.
- Tauri exposes only its default core capability and loads the local Vite build
  under a restrictive content security policy.
- The 0.10.0 source is shared by the web and Tauri build paths. Its automated web
  gate, locked Cargo check, staged unsigned portable executable and installer,
  source comparison, hashes, and smoke launch pass. Public deployment,
  clean-machine installation, signing, and physical-device feel/listening remain
  separate release checks; older artifacts stay in `release/` as history.
- AI-generated source art and exact prompts are recorded in
  `docs/AI_ASSET_PROMPTS.md`; source-only masters are kept outside `public/` so
  they do not inflate deployments.

## Testing strategy

The Vitest suite exercises movement, combat, items, hazards, authored and
generated solvability, optional rescues, exploration-camera activation and
reveal-set rules, terrain boundary geometry, persistence migrations,
achievements, synthesized-sound and background-music safeguards, and protected
navigation. It also checks the complete art catalogue, dominant-colour theme
compatibility, authored visual variety, deterministic generated variants, one
weapon and three unique pets per maze, prerequisite detours and guardians,
Spring Boots, single/multi-hole jumps and unsafe landings, legacy-session
migration, 6 x 6 even-window clamping, variable 9–29 generated sizes, connected
post-boots hazards, pointer intent and corner-assist safety, rescued-pet trail
selection, held-input acceleration, theme colour/lightness separation, terrain
dressing preload, and cage-front asset coverage. Every authored maze and sampled
generated maze is run through the stateful solver. The 0.10.0 run covers 239 tests
across 17 files; `npm run check` also completes strict TypeScript and the Vite
production build. Dependency review, locked Cargo compilation, packaging,
public deployment, and real-device checks remain separate release gates.

## Extension points

- Add mechanics through the `TerrainKind`, `LevelObject`, and `GameEvent` unions,
  then implement the rule once in the engine and teach the solver through that
  same transition function.
- Add story mazes to `CURATED_LEVELS`; structural and progression tests will
  reject unsolvable or incorrectly gated content. Give each new story an
  intentional terrain theme, weapon/enemy/cage styles, and a deliberate rescue
  count from one through five.
- Add a visual variant by extending the typed ID union and `artCatalog.ts`, then
  supply and validate the local asset. Keep engine behavior keyed to object kind
  and Power rather than art labels or filenames.
- The zoomed exploration presentation is a dimension rule, not an authored-level
  flag: if either dimension exceeds `DEFAULT_FOV_SIZE` (currently 6), use the
  camera and minimap. Change that shared rule and its boundary tests together.
- Add a terrain kind by extending the engine union and choosing the matching
  rendering model. Connected material regions belong in the SVG fill/boundary
  pipeline with a globally aligned periodic pattern; isolated traversal
  overlays such as holes need an explicit square sprite and collision/solver
  semantics. Do not reintroduce independently textured or rounded DOM cells.
- Add generated-maze rules through deterministic placement phases followed by
  ordinary and perfect-rescue validation. Keep topology odd, at or below the
  29-tile cap, and prevent decorative hazard growth from consuming pre-gate or
  reserved progression tiles.
- Add durable statistics by versioning and defensively migrating the progress
  schema rather than changing saved data in place.
- Add background contexts through `MUSIC_TRACKS` and the existing gesture-safe
  controller. Keep short event stings separate from `MAZE_MUSIC_TRACKS`; preserve
  stable maze-to-track selection and the no-immediate-repeat rule.
