# Changelog

This file records the player-visible changes in each playable build. The project
is still an active prototype, so version numbers identify test builds rather
than promising long-term save or API compatibility.

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
