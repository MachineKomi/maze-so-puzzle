# Changelog

This file records the player-visible changes in each playable build. The project
is still an active prototype, so version numbers identify test builds rather
than promising long-term save or API compatibility.

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
