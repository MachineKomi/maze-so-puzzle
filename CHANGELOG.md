# Changelog

This file records the player-visible changes in each playable build. The project
is still an active prototype, so version numbers identify test builds rather
than promising long-term save or API compatibility.

## 0.11.0 - 2026-09-02

This portal-puzzle release adds a deeper three-maze chapter, expands the full
soundtrack, and makes the zoomed board feel like one continuous place as Ame
explores it.

### Added

- Three new authored story mazes: **Rose Heart Roundabout**, **Clover Comeback
  Carnival**, and the five-friend finale **Friendship Crown Vault**. Their
  ordinary/perfect routes are 105/117, 103/177, and 231/260 inputs, with
  mandatory backtracking, optional rescue wings, guardian growth puzzles,
  hazards, locks, and up to three portal pairs.
- Rose Heart, Mint Clover, and Violet Moon paired portals. Stepping onto one
  flower pad warps Ame to its twin with a short bloom, sparkle, and synthesized
  whoosh presentation; the paired motif is also shown on the minimap.
- Eight additional user-provided full OST tracks, bringing per-maze music
  rotation to thirteen songs while preserving no-immediate-repeat behavior.
- Focused portal, camera-motion, save-validation, scaled-pointer, art, sound,
  solver, and level-design regression coverage.

### Changed

- The 6 × 6 exploration camera now clips one full rendered maze world and
  translates it smoothly beneath Ame. Terrain and objects no longer appear to
  be reconstructed tile-by-tile when the view follows the player.
- Pointer direction is calculated in logical board coordinates even when the
  fixed 960 × 540 stage is scaled for iPad or phone. A small direction
  hysteresis removes diagonal touch wobble without adding pathfinding.
- Keyboard direction changes take effect immediately when another held key is
  released, while the child-friendly movement ramp remains intact.
- Hints first search Ame's currently reachable region, so they no longer point
  through an unresolved portal/door/guardian gate when a useful local tool or
  route is available.
- Portal destinations, fog reveal, followers, pickup feedback, active-run
  recovery, and maximum-stride checks now share the engine's exact warp result.

### Verification

- `npm run check` passes 292 tests across 22 files, strict TypeScript checking,
  and the Vite production build. `npm audit --audit-level=moderate` reports zero
  vulnerabilities, `npm ls` is clean, and `cargo check --locked` passes.
- Local browser QA passed at 1280 × 720 desktop, 1194 × 834 iPad, and 844 × 390
  landscape phone with no page overflow, panel overlap, broken visible images,
  or console warnings/errors. The first portal maze and an iPad perfect-rescue
  victory were played through with real controls.
- The unsigned 0.11.0 portable executable and NSIS installer byte-match the
  final Tauri outputs, report file/product version 0.11.0, and the portable app
  stayed responsive with the correct title in a five-second smoke launch.

## 0.10.3 - 2026-09-01

This readability-and-control release makes the maze board easier to understand
at a glance, makes held movement gentler for small hands, and adds a safe way to
start the whole adventure again.

### Changed

- Every lock family now has its own colour **and** silhouette: the pink
  **Rose Heart Key** opens the Rose Heart Door, the blue **Blue Star Key** opens
  the Blue Star Door, and the yellow **Sunny Sun Key** opens the Sunny Sun Door.
  Board art, names, hints, accessibility text, and preloading all use the same
  typed catalogue instead of recolouring one star asset.
- All four rescue-cage styles use new sparse front-only v4 overlays. A low base,
  two side posts, and three narrow bars keep the animal clearly visible while
  the opaque cage pieces still read cleanly in a small maze tile.
- Ame and the friendly enemies render larger, with larger outlined Power values
  positioned above their heads. Battle and Spring Boots presentation copies use
  the same proportions.
- Important map pickups now receive a short board-centred picture-and-name toast
  for the weapon, splash boots, Spring Boots, Antidote Leaf, potion, and key.
  The existing compact feedback remains available independently.
- Winning a friendly battle now resolves while Ame stays safely in the square
  beside the enemy. The enemy disappears and its Power transfers to Ame, but the
  step counter and position do not advance; the next input enters the cleared
  square. The solver follows this same state-changing, non-moving transition.
- Held keyboard, pointer, touch, and D-pad movement is deliberately slower and
  smoother: the first repeat waits 320 ms, begins at 260 ms between steps, and
  eases over 16 repeats to a capped 160 ms corridor cadence. A short 120 ms
  visual interpolation softens each grid step without delaying the game rule.
- The title screen and Adventure Book now offer **Reset progress**. A clear
  confirmation lists the records, gold, rescued friends, stickers, medals,
  badges, and active maze that will be forgotten before returning to Story
  Maze 1. The reset removes only Maze so Puzzle's four known save keys and
  preserves unrelated browser storage.

### Verification

- `npm run check` passes 267 tests across 20 files, followed by strict
  TypeScript checking and the Vite production build.
- New coverage locks down the three key/door art pairs, v4 cage catalogue and
  preload paths, stationary combat and solver semantics, the eased held-input
  cadence, and the exact storage allow-list used by the full reset.

### Release status

- The 0.10.3 browser source gate and unsigned Windows build are complete. The
  staged portable executable is 51,461,632 bytes with SHA-256
  `2F7E47C76252F9E2F2C1E7939240BB81EF971DD2098FE157B647D1F248F42B7E`;
  the staged NSIS installer is 44,943,455 bytes with SHA-256
  `BF31CBB461EB909558C50D7077FDEA62A0D98A8D651BE9D3BFAA844368DD399B`.
- Both staged files byte-match the final Tauri outputs and report file/product
  version 0.10.3. The portable app remained responsive through a five-second
  smoke launch and displayed the correct title.
- GitHub `main` commit `3f61cbd` auto-deployed to the canonical Vercel site.
  The live 0.10.3 label, twelve-maze tester picker, iPad and landscape-phone
  bounds, v4 cage asset, visible images, and production browser logs passed the
  focused smoke. Physical-device play testing remains a separate release step.

## 0.10.2 - 2026-09-01

This responsive-foundation release keeps the game deliberately composed on
desktop, iPad, and landscape phones instead of rearranging or stretching its
interface for each device.

### Changed

- The complete game now renders on one fixed 960 × 540 logical canvas and is
  uniformly scaled into the browser's safe area. Wide phones letterbox cleanly
  instead of stretching the interface, while 4:3 iPads retain a centred 16:9
  play surface.
- Stage-internal responsive sizing now follows the logical canvas through CSS
  container units and queries. Text, cards, maze, sidebar, controls, title,
  Adventure Book, and dialogs therefore keep the same relative size and
  position at every landscape viewport.
- Portrait devices hide the canvas cleanly and show the existing friendly
  rotate prompt. Safe-area insets remain part of the scale calculation for
  notched phones and installed web apps.
- Victory friends use count-aware portrait cards and remain large on iPad and
  desktop. One to three friends receive roomy centred cards; four or five stay
  together in a readable single row, with subdued missing slots and a gentle
  sparkle behind rescued friends.
- The old short-screen rule that reduced completion friends to tiny icons has
  been removed. Reduced-motion mode still disables the dance and sparkle.

### Verification

- The release gate covers 260 tests across 19 files, including a pure fixed-stage
  scale contract for desktop, iPad, wide-phone, and minimum landscape sizes.
- Local browser checks covered 1920 × 1080, 1600 × 900, 1366 × 768, 1280 × 720,
  1366 × 1024, 1180 × 820, 1024 × 768, 932 × 430, 844 × 390, 740 × 360,
  667 × 375, and 568 × 320. Every landscape check retained a 16:9 stage with no
  document overflow or panel intersection.
- A perfect-rescue completion was replayed at iPad and phone sizes. The friend
  card, reward rows, and actions remained separate and fully inside the stage.

### Desktop status

- The unsigned 0.10.2 portable executable and NSIS installer are rebuilt from
  the same source as the browser release and staged in `release/`.
- Clean-machine install/uninstall testing and code signing remain outstanding.

## 0.10.1 - 2026-09-01

This combat-and-spring polish release makes two of the game's most satisfying
moments easier to see, hear, and enjoy without changing any maze rules.

### Changed

- Winning combat now lasts for three distinct friendly bashes instead of one
  quick collision. Every contact has synchronized clash, spark, and impact
  sounds and effects.
- The defeated enemy's visible Power drains in exact steps to `0` while the
  same amount counts into Ame's visible Power. A tested presentation plan keeps
  the transfer conserved at every frame and ends on the engine's exact result.
- Glowing Power motes travel from the enemy to Ame before the final victory
  burst. Held keyboard, pointer, and D-pad input is cleared at combat start so
  a long presentation cannot queue an accidental move.
- Spring Boots jumps use a higher, clearer 540 ms hop with a take-off squash,
  moving ground shadow, landing squash, and a crisp four-layer synthesized
  boing. A jump that lands directly on a friend or enemy now plays the hop first
  and chains into the rescue or battle set piece.
- Completion dialogs and reward sounds wait until any jump, rescue, or battle
  finishes. Hiding the page cancels pending presentation work so delayed sounds
  cannot bunch together on return.
- Reduced-motion mode retains a short exact Power handoff and static jump
  landing without playing the full movement sequence.

### Verification

- The release gate now covers 247 tests across 18 files, including deterministic
  three-clash timing, exact Power conservation, small and large enemies,
  reduced-motion handoff, and Spring Boots audio timing/mute safeguards.

### Desktop status

- The unsigned 0.10.1 portable executable and NSIS installer are rebuilt from
  the same source as the browser release and staged in `release/`.
- Clean-machine install/uninstall testing and code signing remain outstanding.

## 0.10.0 - 2026-09-01

This safety-and-puzzles release makes strong-enemy encounters encouraging
instead of punishing, adds a new traversal item and hazard, and grows the story
campaign with two genuinely backtracking-focused adventures.

### Added

- **Twilight Treasure Loop** (21 × 21) and **Moonlit Friendship Quest**
  (23 × 23), bringing the authored campaign to twelve mazes. Their required
  weapon, boots, Spring Boots, potions, and three coloured keys live on
  deliberate side trails; solver tests prove those prerequisites cannot be
  skipped.
- A connected magical-poison crossing and a new AI-generated Antidote Leaf.
  Moonlit Friendship Quest requires finding the leaf on a detour before its
  two-tile poison gate.
- A picture-first Hint button with short, state-aware guidance for weapons,
  traversal items, strong enemies, keys, rescues, and the exit.
- Variable rescue parties: the first two mazes introduce one and two friends,
  middle mazes use three, and the two new large adventures hold four and five.
  Rewards, records, perfect-rescue history, and save migration now use each
  maze's actual friend total.

### Changed

- Walking into an enemy with higher Power no longer defeats Ame or resets the
  maze. Movement is refused without changing a single game-state field, and a
  clear **Too strong!** comparison offers one reassuring action: **I'll go get
  stronger.** Equal Power still wins.
- Removed the tile-sized move arrow/cross and the overlapping inventory/rescue
  tick badges. Found state now comes from the artwork itself.
- Water, lava, and poison use slightly inset, feathered connected silhouettes,
  leaving a narrow floor margin without outlines, lips, or shadows.
- Per-theme material treatment replaces blanket wall darkening. Dark dungeon
  art is gently lifted, while floor/wall separation remains clear.
- Keys and matching doors keep their colour treatment and now carry a compact
  Rose, Blue, or Sunny label on the board.
- Tablet and phone layouts reserve space for up to five rescue portraits and
  keep cards from overlapping. The 1024 × 768 and 844 × 390 browser checks fit
  without document overflow.
- The release gate now covers 239 tests across 17 files, including immutable
  strong-enemy blocking, poison traversal and save migration, variable rescue
  totals, and both new ordinary/perfect-rescue routes.

### Desktop status

- The unsigned 0.10.0 portable executable and NSIS installer are rebuilt from
  the same source as the browser release and staged in `release/`.
- Clean-machine install/uninstall testing and code signing remain outstanding.

## 0.9.1 - 2026-09-01

This comfort-and-materials release responds to the first extended iPad play
session: movement is easier to stop and steer, nearby corners are more
forgiving, and every maze material is calmer, smaller-scale, and easier to read.

### Added

- Shared held-input acceleration for touch, mouse, keyboard/WASD, and the
  on-screen arrows: one immediate tile, a generous tap-release pause, then a
  smooth ramp from careful movement to corridor speed.
- Sparse AI-generated grass, clover, flower, moss, and ivy dressing on selected
  garden, woodland, and ruin themes. World-aligned transparent overlays add
  variety without introducing tile edges or affecting play.
- Reproducible terrain-processing scripts and automated checks for runtime
  texture dimensions, opacity, repeat boundaries, dressing alpha, theme colour
  harmony, and minimum floor/wall lightness separation.

### Changed

- All ten floor and wall textures were rebuilt from their untouched ImageGen
  masters with periodic Poisson correction. Seams are subdued without mirrored
  cross-bands, broad-blend ghosting, or doubled masonry, and their in-game
  repeat scale is smaller.
- Maze 2 now pairs a soft rose-brick floor with darker mossy ruins. The active
  catalogue rejects gold/yellow with both green/sage and rose/pink, and every
  story theme keeps a lighter floor against a darker wall.
- One-tile corner assistance is resolved at the moment each move occurs and is
  shared by all controls. It tolerates a small finger wobble, remembers Ame's
  approach direction at ambiguous bends, and still cannot pathfind or bypass
  hazards, holes, doors, or enemies.
- The release gate now covers 215 tests across 16 files, including the new
  acceleration curve, queued steering, colour/lightness rules, dressing assets,
  and expanded corner-safety cases.

### Desktop status

- The unsigned 0.9.1 portable executable and NSIS installer are rebuilt from
  the same source as the browser release, version-checked, source-compared, and
  SHA-256 recorded in `release/`.
- Clean-machine install/uninstall testing and code signing remain outstanding.

## 0.9.0 - 2026-09-01

This puzzle-and-presentation release adds a new traversal toy, makes the later
story mazes require real exploration, and gives fights and rescues a much more
satisfying storybook flourish.

### Added

- **Springstep Sky Hollow**, a tenth 19 x 19 story maze, plus Spring Boots and
  safe one- or two-tile ground-hole jumps with new AI-generated transparent art
  and a synthesized boing cue.
- Cancellable win and loss battle set pieces: Ame and the friendly foe lunge,
  clash and spark before the winning side's Power counts up. Rescue cages pop
  open with hearts and two excited hops before the pet joins Ame's followers.
- Five full OST tracks now receive session-stable per-maze assignments and
  avoid immediately repeating the previous song.
- New jump, friend-rescue, clash, spark, impact, Power-tick, power-up and battle
  result sound cues.

### Changed

- Wishing Woods, Ame's Grand Parade, Springstep Sky Hollow and Lanternlight
  Labyrinth now place important prerequisites on side branches, requiring
  readable detours and backtracking. All ordinary and three-pet routes remain
  solver-validated.
- Floors and walls now carry dominant-colour metadata and are selected only from
  an explicit compatibility matrix; the clashing yellow-floor/green-wall pairing
  is rejected. The ten story mazes use ten distinct approved material pairs.
- Adventure Surprise Mazes can place prerequisite items on branches and add
  Spring-Boots-gated hole runs while retaining both solution modes.
- Long-jump cameras keep both endpoints visible, and held touch/mouse/keyboard
  movement survives short presentations without ghost inputs.
- Old active runs from levels whose topology changed are discarded safely while
  campaign progress, rewards and records remain untouched.
- The release gate remains 204 tests across 15 files, with a 500-maze generated
  stress audit, clean dependency audit, locked Rust compile and fresh unsigned
  Windows x64 portable/installer packages.

### Desktop status

- The unsigned 0.9.0 portable executable and NSIS installer were rebuilt,
  version-checked, source-compared and SHA-256 hashed. The portable app remained
  responsive with the correct title in a hidden five-second smoke launch.
- Clean-machine install/uninstall testing and code signing remain outstanding.

## 0.8.0 - 2026-09-01

This touch-and-exploration release enlarged the visible maze on tablets and
phones while allowing Surprise Mazes to vary from small readable boards through
larger fog-of-war adventures.

### Added

- A 6 x 6 player-centred camera and persistent minimap for every current maze,
  with unrevealed tiles masked until Ame explores them.
- Seeded Surprise Maze sizes varying non-monotonically from 9 x 9 through 29 x
  29, including connected multi-tile water and lava regions after splash boots.
- Opaque front-bar cage layers and rescued-pet followers using Ame's recent
  visible footsteps.

### Changed

- Continuous press, hold and drag steering gained one-tile wall-corner
  forgiveness without pathfinding or bypassing hazards, doors or enemies.
- Connected hazards lost their outlines, lips and shadows; iPad and landscape
  phone layouts give more of the screen to the maze.
- The unsigned 0.8.0 Windows packages and public Vercel build were verified and
  are retained as the previous release baseline.

## 0.7.1 - 2026-09-01

This touch-first maintenance release makes the game practical on landscape
phones, improves the iPad layout, and restores matching Windows test builds.

### Added

- A floating touch joystick on the maze: drag in any direction for continuous
  grid movement, steer while holding, recenter to stop, or tap for one step.
- iPad standalone-web-app metadata and an explicit no-pinch viewport policy.
- Fresh unsigned Windows x64 portable and NSIS installer builds staged locally
  at version 0.7.1 with recorded SHA-256 checksums.

### Changed

- Extra-wide landscape phones now use their entire safe viewport instead of a
  narrow letterboxed 16:9 stage. The maze is larger and the compact sidebar no
  longer overlaps or scrolls at the tested 667×375 through 844×390 sizes.
- Coarse-pointer iPads use a compact two-row D-pad; movement and utility targets
  remain at least 44px while the 1024×768 and 1180×820 layouts fit cleanly.
- Page panning, selection, overscroll, and pinch zoom no longer compete with
  maze gestures during play.
- Expanded the release gate to 171 automated tests, including seven focused
  floating-joystick direction and dead-zone tests.

### Desktop status

- The 0.7.1 portable executable launched responsive with the correct title in a
  five-second smoke test. The installer was built and source-compared but has
  not yet received a clean-machine install/uninstall test. Both files are
  unsigned and may trigger Windows SmartScreen.

## 0.7.0 - 2026-09-01

This picture-first variety build gives every maze its own illustrated identity,
expands the rescue cast, and adds one optional backtracking Power puzzle without
making the ordinary story route harder.

### Added

- Nine distinct paired terrain themes across the story campaign, five weapon
  looks, five friendly enemy looks, eight pet species, and four cage styles.
  Every maze now contains one weapon and three different optional pets.
- A Power 9 pebble-golem guarding the Wishing Woods kitten. The normal exit
  remains unchanged; a perfect rescue asks Ame to collect her weapon, defeat the
  Power 2 and Power 5 foes with a `+2` potion between them, then backtrack and
  win the optional fight at Power 11.
- Deterministic visual variants for generated Surprise Mazes. A seed always
  recreates the same terrain, weapon, enemy, and cage presentation as well as
  the same puzzle.

### Changed

- Reworked maze, rescue, and inventory presentation around the illustrated
  variants, with less repeated copy and a level-specific weapon overlay in
  Ame's hands after collection.
- Expanded authored-level and generator regressions; the release gate now runs
  164 automated tests.

### Desktop status

- Version 0.7.0 is a web release. The unsigned downloadable Windows executable
  and installer at version 0.5.1 remain the last verified desktop artifacts
  until Tauri is rebuilt, packaged, smoke-tested, and re-hashed.

## 0.6.0 - 2026-09-01

This web-first polish build makes the exploration presentation consistent,
turns the hidden tester shortcut into a useful maze picker, and replaces the
cell-by-cell terrain treatment with one continuous illustrated maze surface.

### Added

- A consistent camera rule: whenever either maze dimension exceeds 7 tiles, the
  board shows a player-centred 7 x 7 field of view and a fog-of-war minimap that
  remembers explored squares. The engine, objects, saves, and solver continue to
  use full-level coordinates.
- A secret direct-access tester picker. Click or tap the small build label on the
  title screen, or use the exact `?debug=mazes` query, then choose any authored
  maze without unlocking or solving the earlier ones. Tester runs remain
  non-saving previews and cannot grant rewards, records, gold, or unlocks.
- New AI-generated seamless v3 floor and wall materials with smaller-scale warm
  limestone and lavender-blue fantasy cobblestones. Editable generation masters
  remain under `docs/source-assets/`; optimized periodic runtime assets remain
  under `public/assets/`.

### Changed

- Rebuilt maze terrain as globally aligned, world-coordinate SVG geometry. Wall,
  floor, water, and lava textures continue smoothly across cell boundaries
  instead of restarting inside every tile.
- Replaced the separate wall-corner caps with connected terrain outlines that
  follow both convex and concave bends. Connected water and lava cells now form
  one rounded region with a restrained flat floor lip and no drop shadow.
- Connected GitHub `main` to the production Vercel Hobby deployment at
  `https://maze-so-puzzle.vercel.app/`; subsequent pushes to `main` deploy the
  newest web build automatically after Vercel's build completes.

### Desktop status

- Version 0.6.0 is currently a web release. The unsigned downloadable Windows
  executable and installer at version 0.5.1 remain the last verified desktop
  artifacts until Tauri is rebuilt, packaged, smoke-tested, and re-hashed.

## 0.5.1 - 2026-09-01

This child-first polish build makes the opening easier to understand, the long
exploration maze safer to pause, and repeated travel quicker and more pleasant.

### Added

- Refresh-safe active-run saves for authored story mazes. Ame's exact position,
  Power, inventory, rescued friends, step count, and explored minimap tiles can
  now be resumed after a refresh, tab eviction, browser close, or desktop-app
  restart. Corrupt, stale, generated, and tester snapshots fail closed.
- A gentle first-step coach that highlights the opening maze's safe arrow and
  then disappears as soon as Ame moves.
- A bright 7 x 7 camera outline on the fog-of-war minimap plus an initial
  "Walk to reveal the maze" prompt.
- A Windows CI job that runs the locked Tauri/Rust compile check alongside the
  existing browser test-and-build gate.

### Changed

- Enlarged the on-screen direction pad to 44 px minimum targets for coarse
  pointers, with touch-specific instructions and a compact surrounding layout.
- Shortened movement and held-direction cadence from 82 ms to 64 ms, while
  keeping one-square taps and deterministic direction buffering.
- Kept the current maze objective visible after ordinary footsteps instead of
  replacing it with repetitive status copy. Important pickups, rescues, doors,
  combat, and bumps still announce their own feedback and sounds.
- Clarified the Power rule throughout the interface: matching or beating a
  goblin wins, and the goblin's Power joins Ame.
- Condensed the full first-clear celebration so its animals, gold, new stickers,
  and buttons fit at 1280 x 720 without a scrollbar.
- Rebalanced Lanternlight Labyrinth so its required early potion cannot be
  bypassed before the Power 5 goblin, and moved its final Power 9 challenge next
  to the exit. The ordinary route is now 280 steps and the perfect-rescue route
  312 steps.
- Replaced eager all-art warming with deduplicated per-level and idle reward-art
  preloads, reducing the image burst when play first begins.
- Paused background music automatically while the page or app is hidden and
  resumed only the same still-active, unmuted track when play returns.
- Added an exhaustive authored-level regression proving that no reachable
  sword-equipped game state can enter an underpowered combat trap.

## 0.5.0 - 2026-09-01

This exploration build keeps the early story mazes large and readable, then
introduces one deliberately bigger adventure without shrinking Ame or the
important objects into tiny tiles.

### Added

- **Lanternlight Labyrinth**, a ninth authored story maze measuring 25 x 25,
  with its ordinary exit and optional all-three-animal rescue route covered by
  the same stateful level-validation rules as the rest of the campaign.
- A player-centred 7 x 7 exploration camera for the larger maze. The underlying
  engine still moves on the full level grid, so movement and puzzle rules remain
  deterministic.
- A persistent fog-of-war minimap. Ame can always see her current 7 x 7 field of
  view; previously explored passages stay revealed, while unvisited areas remain
  masked until she reaches them.
- A hidden tester preview reached with the exact URL query `?debug=mazes`. Its
  compact skip control cycles through every authored maze without requiring
  unlocks, and preview completions deliberately do not award gold, collectibles,
  records, unlocks, or saved progress.

### Changed

- Kept the first eight story mazes in their readable 9 x 9 through 17 x 17
  progression, using the new exploration presentation only for the 25 x 25
  finale.
- Retained the locally bundled, offline-capable soundtrack across the title,
  story, later-story, and Surprise Maze contexts.

## 0.4.0 - 2026-09-01

This family-playtest build focuses on clarity, responsiveness, and a more
picture-led interface while keeping all existing progress compatible.

### Added

- A locally bundled soundtrack with distinct title, early-story, later-story,
  and Surprise Maze music. Music follows the existing Sound button, starts only
  after a player gesture, loops gently, and works offline in browser and Tauri.
- A new AI-generated Ame gameplay sprite that shows her holding the sword after
  it has been collected.
- Press-and-hold travel for keyboard directions and the tablet D-pad, with a
  quick deterministic repeat cadence and latest-direction buffering.
- Soft inner wall caps so both convex and concave path corners have restrained,
  friendly rounding.

### Changed

- Rebalanced all eight story mazes from 9 x 9 through 17 x 17. Required routes
  still grow steadily from 26 to 114 steps and every maze retains three optional,
  jointly rescuable animal friends.
- Limited generated Surprise Mazes to readable odd sizes from 9 x 9 through
  17 x 17 and expanded solver tests across every supported size and difficulty.
- Re-tiled floor art over three-cell patches and wall, water, and lava art over
  two-cell patches instead of stretching one texture across the full board.
- Tightened overly round outer wall corners and softened water/lava boundaries.
- Reduced movement cadence to 82 ms, shortened the hop flourish, moved pointer
  actions to press-down, memoized static terrain, retained Ame's DOM node between
  moves, and rate-limited repeated wall-bump sounds.
- Reworked the sidebar around larger animal and item images, compact pictorial
  inventory slots, and less redundant text.
- Prevented secondary touches and modifier-key shortcuts from producing stray
  movement, and stopped routine rapid steps from flooding screen-reader live
  announcements.
- Expanded the automated suite to 87 passing tests, including soundtrack failure
  safety and the revised authored/generated maze ranges.

## 0.3.0 - 2026-08-31

The production browser bundle and unsigned Windows x64 test artifacts were
built, smoke-tested, staged, and hashed locally. Clean-machine installer and
full family play-testing remain intentionally separate release checks.

### Added

- Four new story mazes, bringing the campaign to eight levels and expanding it
  gradually from 13 x 13 through 23 x 23.
- An illustrated title screen with original AI-generated adventure key art and
  quick access to the story, Adventure Book, and surprise-maze generator.
- The Adventure Book: story-maze clear records, best steps, rescue pips,
  cumulative bunny/fox/kitten rescues, gold and completion statistics, stickers,
  rescue medals, and nine stat-driven achievement badges.
- New achievement goals for maze totals, surprise mazes, finishing Power, speedy
  clears, and rescuing each animal species.
- New title, menu, selection, achievement, and stamp cues alongside the existing
  movement, interaction, rescue, retry, and maze-solved sounds.
- Extra lightweight sparkle, bob, glow, and step flourishes implemented in CSS,
  with reduced-motion alternatives.
- A one-button Big Maze view with a compact Power, rescue, and inventory HUD for
  the 21 x 21 and 23 x 23 adventures.

### Changed

- Upgraded saved progress to schema version 3. Existing v1 and v2 saves migrate
  defensively; historical animal species or generated-maze facts that were never
  stored are left unknown instead of being guessed.
- Expanded campaign record keeping with total completions, distinct mazes,
  generated-maze totals, cumulative species rescues, perfect-rescue counts and
  streaks, best Power, and best documented rescue species.
- Hardened synthesized audio against overlapping voices, closed audio contexts,
  and stale delayed victory sounds.
- Added a protected mid-maze resume flow: Home and Adventure Book keep the run
  in memory, while switching mazes asks before restarting any in-progress path.
- Kept source-only PNG masters out of the production bundle; the final browser
  assets are about 3.18 MiB smaller without deleting the editable originals.
- Added safe-area-aware landscape sizing and smaller browser icons for iPad and
  phone testing, and deferred non-title art preloading until the player enters
  the game or Adventure Book.
- Added a static Vercel Hobby configuration, GitHub browser-build checks, and
  public-repository architecture, deployment, privacy, and release guidance.
- Kept all eight story mazes solver-validated, with three optional and jointly
  rescuable animal friends in each maze.

## 0.2.0 - 2026-08-31

### Added

- Four progressive story mazes sized from 13 x 13 through 19 x 19.
- Deterministic, solver-validated surprise mazes from 13 x 13 through 23 x 23.
- Three optional animal friends to rescue in each maze: a bunny, fox, and kitten.
- Gold rewards, collectible stickers, best-result tracking, and rescue medals.
- Swords, Power-based goblin encounters, potions, colour-coded keys and doors,
  protective boots, water, and magical lava.
- Keyboard, pointer, touch, and on-screen direction controls, with deliberately
  directional click-to-move instead of destination pathfinding.
- Sound effects, mute control, completion fanfare, a pictorial help dialog, and
  reduced-motion support.
- A Windows x64 desktop build and NSIS installer powered by Tauri 2.
- Reproducible prompt documentation for the AI-generated production artwork.

### Changed

- Replaced the original floor and wall presentation with softer, seamless v2
  fantasy-dungeon tiles.
- Moved Power values above character art and removed the large circular badges.
- Expanded the original small mazes so early levels still teach gently while
  feeling like real mazes.
- Strengthened completion feedback with rescue summaries and bonus rewards.
- Refined the 16:9 interface, portrait guidance, focus behaviour, and semantic
  labels for browser and desktop play.

## 0.1.0 - 2026-08-31

- Initial internal playable prototype.
