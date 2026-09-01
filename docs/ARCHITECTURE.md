# Architecture

Maze so Puzzle is a browser-first, client-only React game. The same production
web bundle is embedded by Tauri for the optional Windows application. There is
no backend, account system, analytics service, advertisement SDK, or remote game
state.

## Runtime flow

1. `src/main.tsx` mounts the React application.
2. `src/App.tsx` owns screen navigation and presents the title, Adventure Book,
   maze board, side panel, dialogs, rewards, and accessibility descriptions.
3. `src/game/engine.ts` applies one immutable movement or interaction step.
4. Authored levels come from `src/game/levels.ts`; surprise levels come from the
   deterministic generator in `src/game/generator.ts`.
5. `src/game/solver.ts` validates structural rules and searches the exact engine
   state space to prove both an ordinary solution and an all-animal solution.
6. `src/game/exploration.ts` derives clamped camera windows and immutable reveal
   sets. Large exploration levels render a 7 x 7 player-centred view while the
   engine and solver continue to use full-level coordinates.
7. `src/progress.ts` calculates rewards and stores a sanitized schema-v3 snapshot
   in browser `localStorage`.
8. `src/sound.ts` synthesizes short interaction and fanfare cues with the Web
   Audio API; those effects require no recorded audio files.
9. `src/music.ts` selects and safely loops the locally shipped MP3 soundtrack.
   Playback begins only from a user gesture, follows the shared mute control,
   and degrades harmlessly when media is unavailable. Track roles and reserved
   music are documented in `docs/MUSIC.md`.

## Important boundaries

- The engine, generator, solver, rewards, and navigation decisions are UI-agnostic
  pure TypeScript wherever practical.
- The browser build uses only local static assets from `public/`.
- Progress belongs to the current browser or Tauri WebView profile. It is not
  synchronized between devices.
- Camera coordinates affect presentation only. Movement, collision, combat,
  collection, and solving continue to operate in global level coordinates.
- The exploration minimap unions the current field of view with an in-memory
  reveal set. Unvisited tiles remain masked, and a level load starts a fresh map.
- Tester mode exists only when the URL has the exact `debug=mazes` query value.
  Tester-entered runs are marked as previews and must bypass all reward and
  progress writes, even if the preview maze is completed.
- Tauri exposes only its default core capability and loads the local Vite build
  under a restrictive content security policy.
- AI-generated source art and exact prompts are recorded in
  `docs/AI_ASSET_PROMPTS.md`; source-only masters are kept outside `public/` so
  they do not inflate deployments.

## Testing strategy

The Vitest suite exercises movement, combat, items, hazards, authored and
generated solvability, optional rescues, exploration-camera and reveal-set rules,
persistence migrations, achievements, synthesized-sound and background-music
safeguards, and protected navigation.
Every authored maze and sampled generated maze is run through the stateful
solver. `npm run check` is the normal browser release gate; locked Cargo
compilation and a Tauri bundle build are the additional Windows gates.

## Extension points

- Add mechanics through the `TerrainKind`, `LevelObject`, and `GameEvent` unions,
  then implement the rule once in the engine and teach the solver through that
  same transition function.
- Add story mazes to `CURATED_LEVELS`; structural and progression tests will
  reject unsolvable or incorrectly gated content.
- Opt a story maze into the zoomed exploration presentation with its explicit
  `exploration-map` mechanic marker. Do not infer camera mode from dimensions;
  this keeps level size and presentation independently testable.
- Add generated-maze rules through deterministic placement phases followed by
  ordinary and perfect-rescue validation.
- Add durable statistics by versioning and defensively migrating the progress
  schema rather than changing saved data in place.
- Add background contexts through `MUSIC_TRACKS` and the existing gesture-safe
  controller. Keep short event stings separate from looping music, and preserve
  the reserved arena and friendship-cue assets until their mechanics are added.
