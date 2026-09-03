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
   branches to create intentional detours. Level records carry a content revision
   and deterministic gameplay fingerprint; authored objects use semantic IDs
   rather than parser position. The campaign size sequence is 6, 11, 13, 15,
   13, 15, 17, 17, 19, 23, 21, 23, 13, 17, 17, and 17. Chapter 1 therefore
   teaches on a whole-board view before camera/fog begins in Chapter 2. The
   portal trilogy ends in a compact three-pair quadrant relay; the Power-99
   finale uses a changed-state return and keeps all five rescues optional.
8. `src/game/solver.ts` validates structural rules and searches the exact engine
   state space to prove both an ordinary zero-rescue solution and an all-animal
   solution. It can begin at a validated current state.
9. `src/game/reachability.ts`, `src/game/hints.ts`, and `src/game/metrics.ts`
   derive current-state reachability, four-tier Required Path help, and campaign
   route-quality reports from engine transitions. Portals and complete hole-run
   jumps therefore cannot drift from UI reasoning. Reachability exposes whether
   its state budget completed; route metrics distinguish raw branches from
   demonstrated player decisions and leave causal prerequisite depth pending.
10. `src/game/exploration.ts` derives clamped camera windows, the shared camera
   policy, and immutable reveal sets. Any level wider or taller than 6 tiles
   renders a 6 x 6 player-centred view while the engine and solver continue to
   use full-level coordinates.
11. `src/game/terrainGeometry.ts` traces connected orthogonal cell unions into
   rounded SVG paths in stable world coordinates, including holes, diagonal
   contacts, and the camera gutter used by the renderer.
12. `src/campaign.ts` owns versioned campaign order/history and ID-based access
    migration. `src/progress.ts` stores sanitized schema-v4 progress, stable
    unlocked story IDs, and revision-scoped route records in browser
    `localStorage`; old best steps remain explicitly historical after a map edit.
13. `src/session.ts` validates and stores a schema-v2 snapshot for an unfinished
    normal authored run, including revision, fingerprint, reveal state, and
    progressive-hint state. It fails closed on changed content, reports that
    narrow restart case to the player, and rejects tester, generated, corrupt,
    inconsistent, and completed states.
14. `src/resetProgress.ts` provides the UI-independent full-reset boundary. It
    removes only the current, v3, v2, legacy, and active-run Maze so Puzzle keys,
    isolates each storage failure, and returns both a fresh default value and an
    honest durability result so the UI does not claim a partial reset succeeded.
15. `src/sound.ts` synthesizes short interaction and fanfare cues with the Web
    Audio API; those effects require no recorded audio files.
16. `src/music.ts` selects and safely loops the locally shipped MP3 soundtrack.
   A session-scoped deterministic shuffle bag cycles through all thirteen full
   tracks on maze transitions and avoids an immediate repeat; the short
   friendship cue is excluded. The title theme starts from the first permitted
   home-screen gesture rather than attempting prohibited autoplay.
   Playback begins only from a user gesture, follows the shared mute control,
   pauses while the page or app is hidden, and degrades harmlessly when media is
   unavailable. Track roles and reserved music are documented in `docs/MUSIC.md`.
17. `src/artCatalog.ts` maps stable typed visual IDs to runtime artwork, labels,
    material periods, dominant-colour families, compatibility rules, and
    fallbacks. `ArtReference` preserves the small legacy consumer surface while
    rich `SpriteArt` canaries add pixel revision, derivative, measured geometry,
    light, alpha, runtime status, and source-record identity without importing
    heavy provenance into the browser. `AME_ART` deliberately selects historical
    v01 while the v02 Human candidate remains source-only. `LOCK_PAIR_ART` is the
    single Rose Heart, Blue Star, and Sunny Sun authority; legacy key/door maps
    are object-identical projections. Hazard records add period, measured colour
    and lightness, static pattern, and reduced-motion cues. Gold/yellow floors
    still cannot pair with green/sage walls, and gameplay/content fingerprints
    remain independent of art revisions.
18. `src/movementControls.ts` owns the shared held-input cadence used by pointer,
    touch, keyboard, and D-pad controls: a 320 ms first pause, a smooth 260–160 ms
    repeat curve over 16 held steps, and reset-on-direction-change semantics.
19. `src/pointerControls.ts` converts mouse/touch positions into tile-relative
    cardinal intent and applies the strict one-tile corner assist. The assisted
    destination must be safe, non-exit ordinary floor with no unresolved
    interaction. A previously resolved non-portal pickup square is eligible,
    but a pickup, rescue, treasure, hazard, unresolved object, portal, jump, or
    exit never is.
20. `src/game/followerTrail.ts` keeps a bounded loop-free history of squares Ame
    has left and selects distinct visible footprints for rescued friends.
21. `src/cameraMotion.ts` converts engine/world coordinates into one smoothly
    translated full-maze render surface. The 6 × 6 camera clips that world rather
    than rebuilding a different set of local tiles every step, so terrain,
    objects, portal hops, and edge-following movement remain spatially coherent.
22. `src/game/visualPersonality.ts` exhaustively maps every rescue species and
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
- Required Path is a four-tier, on-demand ladder: Goal, Principle, Direction,
  and the next engine-valid Step. Repetition advances the tier only for the same
  meaningful game state, and the active run persists that bounded replay state.
  Its solver route always avoids optional animals.
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
  `maze-so-puzzle-progress-v4`, `maze-so-puzzle-progress-v3`,
  `maze-so-puzzle-progress-v2`, `maze-so-puzzle-progress-v1`,
  `maze-so-puzzle-active-run-v2`, and `maze-so-puzzle-active-run-v1`; unrelated
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
- Capability blockers escalate without modal loops: first contact uses HUD
  feedback, the second repeat adds a marker, and only the third repeat may open
  the explanatory modal. Strong-enemy explanation opens once per encounter;
  later safe contacts stay in HUD feedback.
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
- AI-generated source art and exact prompts are recorded append-only in
  `docs/AI_ASSET_PROMPTS.md` and versioned source records. Source-only masters
  stay outside `public/` so they do not inflate deployments.

## Static art source and build boundary

`docs/ART_BIBLE.md` is the static visual authority and
`docs/characters/AME_MODEL_SHEET.md` owns Ame's identity/registration gate.
Hand-reviewed records under `docs/source-assets/records/` preserve lifecycle,
prompt fidelity, immutable ingredients, hashes, rights uncertainty, derivatives,
and rollback. The generated `docs/source-assets/manifest.json` inventories those
records plus every runtime/source image deterministically; it contains no
generation timestamp and is not hand-edited.

Candidate C's identity/construction is Human-approved, but the active runtime
still selects historical Ame v01. The proposed `mgjrpg-02` rendering profile is
a separate pre-volume gate. Its `storybook-local-contour-v1` contract derives
each stable contour section from the nearest enclosed material, maps it through
Maze's own deep-plum contour families, and reserves darkest ink for critical
facial/occlusion/contrast detail. It forbids uniform black perimeters,
pixel-by-pixel hue switching, halos, and low-contrast pale edges. Field cutouts
receive no sticker cutline; semantic UI/reward signals may use a cream cutline;
periodic terrain/hazards use material boundaries and seams without an enclosing
actor contour. The adopted PPBA technique contributes no external pixel, prompt,
palette, motif, layout, brand, or runtime dependency.

`scripts/art_pipeline.py` is the safe entry point. `--check` is non-writing;
`--manifest --write` is the explicit deterministic update; `--build` requires a
record ID and profile, stages and validates output, refuses overwrite, and keeps
unapproved derivatives beneath ignored `artifacts/art-proofs/`; `--proof`
creates actual-size/context boards and an encoded/decoded inventory only there.
The pipeline applies EXIF/profile handling where evidence exists,
premultiplied-alpha resize, straight-alpha delivery, transparent-edge RGB
dilation, periodic seam checks, clear-border checks, schema/hash coverage, and
strict-v1 versus honest legacy warnings. New `mgjrpg-02` production records use
schema v2 / `strict-v2`: the schema and builder bind family to treatment class,
closed ordered reference roles/authority kinds, direct non-edit-of-edit lineage,
selected immutable build source, and exact global recipe/review evidence.
Existing release-number processors are
retained unchanged as historical recipes until parity is separately proved.

The ignored `artifacts/art-proofs/mgjrpg-02/v08/` packet is preserved as
Human-rejected post-process evidence; it is not an art authority. The v11
authored-options packet preserves the Human's family-specific narrowing: A for
most core/current-family sprites, C for the traditional slime, sword lizard man,
and green-tea-drinking skeleton, B future-enemy concepts except the A wholesome
succubus, and the existing top-down flower-petal portal category. Future enemies
must be re-authored through A's chunky, high-chroma material-contour grammar
with only restrained B colour/shading influence.

The current bounded-response packet is
`artifacts/art-proofs/mgjrpg-02/v14/`. Its schema-aware validator binds four
immutable generator originals, exact prompts and ordered reference roles, the
locked Candidate C source, the prior preferred Direction B Ame, two independent
fresh-base attempts, measured proof artifacts, and zero runtime/catalogue
impact. Neither fresh Ame attempt is an edit of prior B or of the other; both
drift Candidate C's locked construction, so prior B is the recommended fallback
pending Human confirmation. The enemy hybrid remains direction evidence pending
simplification, and the flower-pad hybrid confirms category rather than an
approved master. Composite board cells remain non-separable concept evidence;
opaque RGB boards do not pass production alpha or periodic-terrain seam QA.
Until the Human explicitly accepts, narrows, or rejects the v14 recommendation,
no Candidate C catalogue switch, broad static-family batch, retirement, or
decoded runtime residency is authorized; public byte delta remains zero.

Lifecycle is intentionally three-dimensional: runtime status (`active`,
`dormant`, `deprecated`, `superseded`, `source-only`), source status
(`source-backed`, `partial`, `legacy-runtime-only`), and approval status
(`historical`, `candidate`, `pending-human`, `design-approved`, `approved`,
`rejected`). `design-approved` records Human acceptance of identity and
construction while remaining non-publishable. Only `approved`, with named
runtime-publish evidence, exact prompt evidence, and reviewed rights, can enter
new public output. Runtime selection never implies Human approval. A catalogue
switch uses a new versioned URL and keeps its prior pointer and files for
rollback; cleanup is a later proved-dead change.

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
stationary winning-combat semantics, content fingerprints and semantic IDs,
campaign-order migration, revision-scoped route records, engine-transition
reachability, progressive hints, route-quality metrics, fixed Surprise seeds,
and the full-reset storage allow-list.
Every authored maze and sampled generated maze is run through the stateful
solver. The current test count is recorded by the release checklist rather than
hard-coded here; `npm run check` also completes strict TypeScript and the Vite
production build. Dependency review,
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
- Treat map edits as persistence migrations: preserve semantic object IDs,
  increment `contentRevision`, update the gameplay fingerprint and route report,
  and verify that stale active runs fail closed while durable progress survives.
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
