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
   cancellable jump, three-bash battle, rescue, colour-aware door-opening, and
   Power-transfer presentations. Water, lava, and poison share the traced
   terrain geometry with lightweight animated SVG material overlays; lock
   colours and motif particles come from `src/magicEffects.ts`.
   Important pickups also create an independently timed, board-centred
   sprite-and-label toast; completed combat creates a tile-anchored Power reward
   notice. Larger player/enemy sprites and Power labels are presentation-only CSS. It
   presents story chapters only on fresh curated starts, while preserving
   interruption-free resume/restart/generated/tester flows.
3. `src/story.ts` is the typed single source of truth for the sixteen-chapter
   Puzzlewild narrative, speaker metadata, educational Puzzle Powers, optional
   read-together prompts, victory epilogues, and one-input skip policy.
4. `src/combatPresentation.ts` builds a pure deterministic victory timeline:
   three clashes, semantic sound cues, exact conserved Power-transfer steps,
   final enemy Power `0`, and a short reduced-motion handoff.
5. `src/stageScale.ts` defines the 960 × 540 logical stage and its pure
   fit-without-stretching calculation. `App.tsx` observes the safe viewport and
   scales one fixed canvas; CSS container queries and units size every internal
   screen against that canvas rather than the physical device.
6. `src/game/engine.ts` applies one immutable movement or interaction step.
7. Authored levels come from `src/game/levels.ts`; surprise levels come from the
   deterministic generator in `src/game/generator.ts`. The generator selects a
   seeded odd size from unlocked 9–23 bands, grows solver-safe connected
   2–4-tile water/lava regions only beyond the splash-boots gate, and can place
   seeded one-, two-, or three-square hole runs only after reachable Spring
   Boots. Later
   adventure seeds carve 2×2 through 4×4 rooms, cluster rewards and rescues,
   add Power-gated room guardians, and place selected prerequisites on side
   branches to create intentional detours. Level and object records carry stable visual IDs without
   placing artwork concerns in the engine. The authored campaign deliberately
   uses 9, 11, 13, 15, 13, 15, 17, 17, 19, 23, 21, 23, 15, 17, and 21 tile
   boards. The three newest portal adventures add mandatory return trips,
   optional rescue wings, multi-pair routing, and a five-friend final vault;
   Moonlit Friendship Quest also requires an Antidote Leaf detour before poison.
8. `src/game/solver.ts` validates structural rules and searches the exact engine
   state space to prove both an ordinary solution and an all-animal solution.
9. `src/game/exploration.ts` derives clamped camera windows, the shared camera
   policy, and immutable reveal sets. Any level wider or taller than 6 tiles
   renders a 6 x 6 player-centred view while the engine and solver continue to
   use full-level coordinates.
10. `src/game/terrainGeometry.ts` traces connected orthogonal cell unions into
   rounded SVG paths in stable world coordinates, including holes, diagonal
   contacts, and the camera gutter used by the renderer.
11. `src/progress.ts` calculates rewards and stores a sanitized schema-v3 snapshot
    in browser `localStorage`.
12. `src/session.ts` validates and stores a schema-v1 snapshot for an unfinished
    normal authored run, including exploration reveal state. It rejects tester,
    generated, corrupt, inconsistent, and completed states.
13. `src/resetProgress.ts` provides the UI-independent full-reset boundary. It
    removes only the current, v2, legacy, and active-run Maze so Puzzle keys,
    isolates each storage failure, and returns a fresh default progress value.
14. `src/sound.ts` synthesizes short interaction and fanfare cues with the Web
    Audio API; those effects require no recorded audio files.
15. `src/music.ts` selects and safely loops the locally shipped MP3 soundtrack.
   A session-scoped deterministic shuffle bag cycles through all thirteen full
   tracks on maze transitions and avoids an immediate repeat; the short
   friendship cue is excluded. The title theme starts from the first permitted
   home-screen gesture rather than attempting prohibited autoplay.
   Playback begins only from a user gesture, follows the shared mute control,
   pauses while the page or app is hidden, and degrades harmlessly when media is
   unavailable. Track roles and reserved music are documented in `docs/MUSIC.md`.
16. `src/artCatalog.ts` maps the typed visual IDs to runtime artwork, labels,
    material periods, dominant-colour families, compatibility rules, and
    fallbacks. Gold/yellow floors cannot pair with green/sage walls. The current
    catalogue contains twelve compatible terrain themes, eleven weapons, twelve
    friendly enemy looks, fifteen pet species, four complete AI-generated v5
    cage fronts, and dedicated Rose Heart, Blue Star, and Sunny Sun key/door pairs.
    Each lock pair exposes both child-readable colour and shape metadata. It
    also maps three paired-portal IDs to original transparent flower-pad art.
17. `src/movementControls.ts` owns the shared held-input cadence used by pointer,
    touch, keyboard, and D-pad controls: a 320 ms first pause, a smooth 260–160 ms
    repeat curve over 16 held steps, and reset-on-direction-change semantics.
18. `src/pointerControls.ts` converts mouse/touch positions into tile-relative
    cardinal intent and applies the strict one-tile, wall-only corner assist. It
    never pathfinds or assists across hazards, unresolved doors, or enemies.
19. `src/game/followerTrail.ts` keeps a bounded loop-free history of squares Ame
    has left and selects distinct visible footprints for rescued friends.
20. `src/cameraMotion.ts` converts engine/world coordinates into one smoothly
    translated full-maze render surface. The 6 × 6 camera clips that world rather
    than rebuilding a different set of local tiles every step, so terrain,
    objects, portal hops, and edge-following movement remain spatially coherent.
21. `src/game/visualPersonality.ts` exhaustively maps every rescue species and
    enemy look to a lightweight CSS motion family, flourish glyph, and friendly
    character trait. This keeps personality presentation typed and testable
    without multiplying raster animation frames or network requests.

## Important boundaries

- The engine, generator, solver, rewards, and navigation decisions are UI-agnostic
  pure TypeScript wherever practical.
- Visual IDs are presentation metadata. Combat depends on an enemy's Power, not
  its illustration; collecting any weapon sets the same engine sword flag for
  save compatibility. Each story maze has one weapon and between one and five
  distinct optional pets. Keys and doors still use the engine's `KeyColor`
  identity, while `artCatalog.ts` resolves that identity to paired colour,
  motif, label, and sprite metadata without CSS hue rotation.
- Ground holes are engine terrain, not decorative art. A normal step is blocked
  until Spring Boots are collected; one directional input then scans across the
  consecutive hole run and lands on the first valid non-hole square. The engine
  emits the complete jump path so the UI can animate it, while the solver uses
  the exact same transition and cannot assume a safe landing. A hole at a plus
  junction therefore controls both axes but never permits a mid-air turn. The
  presentation derives a longer duration and higher arc from the emitted
  one-, two-, or three-hole path without changing engine timing.
- Poison is connected engine terrain. It blocks until an `antidote-leaf`
  object has been collected; engine, solver, structural validation, art
  preloading, minimap, accessibility descriptions, and active-run migration use
  the same typed rule.
- Portals are persistent paired level objects rather than pickups. Structural
  validation requires every used pair ID to occur exactly twice. Stepping onto
  one resolves through the same immutable engine transition as ordinary
  movement, emits `portal-warped`, and lands on its twin without pathfinding.
  Solver search, minimap reveal, hint reachability, follower presentation,
  movement-stride validation, and active-run saves all use that same result.
- Underpowered armed enemy contact emits `enemy-too-strong`, returns the exact
  same playing `GameState` object, and never advances steps, Power, position, or
  interaction IDs. The UI owns the reassuring comparison dialog.
- A winning enemy contact removes the enemy and applies the exact Power gain but
  returns `moved: false`: Ame remains in the adjacent square and the step counter
  does not advance. The next ordinary input may enter the now-clear tile. Solver
  and session helpers therefore treat a state-changing `enemy-defeated` result
  as a valid transition even without movement, while ignoring a truly unchanged
  result.
- Generated-maze presentation is selected from dedicated deterministic hash
  streams. Recreating a seed reproduces both its puzzle and visual variants,
  while adding artwork choices cannot perturb topology or progression placement.
- The browser build uses only local static assets from `public/`.
- All landscape screens share one 960 × 540 logical canvas. A `ResizeObserver`
  fits that canvas inside the safe viewport with a single uniform scale, so its
  aspect ratio, panel order, and relative sizing cannot diverge between desktop,
  iPad, phone, Safari, or installed-web-app chrome. Extra space is deliberately
  letterboxed. Only the portrait rotate prompt and pointer-specific interaction
  semantics remain viewport media behaviour.
- Progress belongs to the current browser or Tauri WebView profile. It is not
  synchronized between devices.
- Full reset is an explicit destructive UI flow available from the title and
  Adventure Book. After confirmation, `resetProgress.ts` deletes only
  `maze-so-puzzle-progress-v3`, `maze-so-puzzle-progress-v2`,
  `maze-so-puzzle-progress-v1`, and `maze-so-puzzle-active-run-v1`; unrelated
  origin storage is intentionally preserved, and the app reloads Story Maze 1.
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
- Jump, battle, and rescue flourishes are cancellable presentation state layered
  over immutable engine events. A hole jump can chain into an interaction on its
  landing tile. Winning combat clears held input, performs three timed contacts,
  and displays a conserved enemy-to-Ame Power transfer before input unlocks.
  Completion and reward sounds wait for the set piece. Restart, navigation,
  level change, visibility loss, unmount, and reduced-motion mode cancel or
  shorten timers without replaying the engine transition.
- Pickup toasts are also transient presentation state. Weapon, splash-boots,
  Spring Boots, Antidote Leaf, potion, and key events select their illustrated
  notice; one cancellable 1.85 s timer replaces any earlier notice and level
  changes or unmounts clear it. Reduced motion keeps the notice static.
- Sticker, medal, and badge IDs map exhaustively through typed `STICKER_ART`,
  `MEDAL_ART`, and `BADGE_ART` records. The Book and victory screen consume the
  same catalogue, preventing earned rewards from falling back to emoji. Source
  PNG masters remain in documentation while the runtime uses transparent
  512 × 512 lossless WebP and native lazy decoding for below-fold cards.
- The exploration minimap unions the current field of view with an immutable
  reveal set. Unvisited tiles remain masked; a new level starts a fresh map, and
  an unfinished authored run restores only a validated saved reveal set.
- The secret tester picker opens from the title screen's build label or
  automatically when the URL has the exact `debug=mazes` query value.
  Tester-entered runs are marked as previews and must bypass all reward,
  active-session, and progress writes, even if the preview maze is completed.
- Tauri exposes only its default core capability and loads the local Vite build
  under a restrictive content security policy.
- The 0.19.0 source is shared by the web and Tauri build paths, and its automated
  browser gate passes. The refreshed unsigned Windows portable executable and
  NSIS installer byte-match the final Tauri outputs, report version 0.19.0, have
  recorded sizes and SHA-256 hashes, and the portable app passed a responsive
  five-second smoke launch with the correct title. The GitHub-connected Vercel
  production deployment is verified separately after each push. Clean-machine
  installation, signing, and physical-device feel/listening remain separate
  release checks.
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
weapon and each maze's authored 1–5 pets, prerequisite detours and guardians,
Spring Boots, single/multi-hole jumps and unsafe landings, legacy-session
  migration, 6 x 6 even-window clamping, variable 9–23 generated sizes, room
  carving and clustered encounters, connected
post-boots hazards, pointer intent and corner-assist safety, rescued-pet trail
selection, held-input acceleration, theme colour/lightness separation, terrain
  dressing preload, dedicated key/door pair, deterministic colour/motif door
  bursts, and complete v5 cage-front coverage,
stationary winning-combat semantics, and the full-reset storage allow-list.
Every authored maze and sampled generated maze is run through the stateful
solver. The 0.19.0 run covers 316 tests across 27 files; `npm run check` also
completes strict TypeScript and the Vite production build. Dependency review,
public deployment, clean-machine installation, and real-device checks remain
separate release gates; the locked Tauri build, packaging, version/hash checks,
and portable launch smoke are complete for 0.19.0.

Plan 07 measurement infrastructure lives under `scripts/performance/` and is
not imported by the runtime. A single S01–S11 fixture catalog binds browser and
Tauri scenarios to stable level IDs and semantic UI/engine checkpoints. The
fixture test resolves those IDs against the current campaign and derives long
routes through the current solver. The inventory script hashes bundle, asset,
media, and package inputs; a source/dist fingerprint binds inventories to the
production build; browser and Tauri harnesses write raw evidence outside the
repository and retain provenance/rejection reasons. CI currently validates the
retained evidence and blocks malformed contracts or unallocated compressed
JS/CSS and public-runtime growth. Timing remains report-only until clean-host
variance is qualified; see
`PERFORMANCE_BUDGETS.md`.

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
  23-tile topology cap and absolute 24-tile validator, and prevent decorative
  room or hazard growth from consuming pre-gate or
  reserved progression tiles.
- Add durable statistics by versioning and defensively migrating the progress
  schema rather than changing saved data in place.
- Add background contexts through `MUSIC_TRACKS` and the existing gesture-safe
  controller. Keep short event stings separate from `MAZE_MUSIC_TRACKS`; preserve
  complete seeded shuffle cycles and the no-immediate-repeat rule.
