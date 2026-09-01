# Vercel deployment

The browser game is ready to deploy as a static Vite project on Vercel's Hobby
plan. It needs no paid features, serverless functions, database, environment
variables, or external services.

Production URL: [maze-so-puzzle.vercel.app](https://maze-so-puzzle.vercel.app/)

The Vercel project is already connected to
`MachineKomi/maze-so-puzzle`. A push to GitHub `main` starts a production build
and updates the canonical URL automatically when that build succeeds. Branches
and pull requests can receive separate Vercel preview URLs, whose local browser
saves are intentionally separate from production.

## Import from GitHub

1. Sign in to Vercel with the GitHub account that can access
   `MachineKomi/maze-so-puzzle`.
2. Choose **Add New → Project**, then import `MachineKomi/maze-so-puzzle`.
3. Keep the repository root as the project root.
4. Confirm that the plan shown for the account/team is **Hobby** before deploying.
5. Vercel should read the committed `vercel.json` settings:
   - Framework Preset: `Vite`
   - Install Command: `npm ci`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Leave Environment Variables empty and deploy.

Git integration creates preview deployments for branches and production
deployments from `main`. No rewrite is currently needed because the game has one
document and does not use client-side URL routing.

## Publish an update

1. Run `npm run check` locally and review the exact source diff.
2. Push the verified commit to GitHub `main`.
3. Allow the existing Vercel Git integration to build and promote it. Do not
   create a second Vercel project or enable a paid feature.
4. Open the canonical production URL and confirm its build label and the key
   smoke checks below. GitHub Actions and Vercel build independently, so a green
   local gate and a post-deployment smoke test are both required.

## Verify the deployment

- Open the generated `vercel.app` URL on desktop, iPad Safari, and the target
  phone browser in landscape orientation. Check a notched device if one is
  available; the controls should stay inside its safe area.
- Confirm the title artwork loads, Begin Adventure enters maze 1, WASD/arrow and
  pointer controls work, keyboard and D-pad holds repeat smoothly, rescued pets
  follow Ame without affecting collision, sound and music begin only after user
  interaction, and the Adventure Book opens.
- Complete or partially play a maze, reload the page, and confirm local progress
  remains on that device.
- Confirm every maze whose width or height exceeds 6 tiles uses the 6×6
  player-centred view and a minimap that keeps explored tiles visible while
  masking unvisited areas. Check an early 9×9 maze, a generated maze, and the
  25×25 Lanternlight Labyrinth, including camera clamping near an outer edge.
- Generate several Surprise Mazes and confirm their deterministic sizes vary
  across unlocked odd 9–29 bands rather than increasing monotonically. No
  generated dimension should reach 30.
- Click or tap the small **Playable build 0.9.1** label on the title screen and
  confirm the secret tester picker can open every authored maze directly. Also
  load `?debug=mazes` and confirm it opens the same picker automatically. Preview
  runs must not change gold, records, rewards, active-run recovery, or unlocked
  progress.
- Inspect several straight paths, bends, diagonal contacts, enclosed pockets,
  and connected water/lava areas. Floor and wall patterns should remain aligned
  across the camera, convex and concave corners should follow the terrain
  boundary, floor/wall contrast should remain clear, and connected 2–4 tile
  hazards should have no outline, lip, cast shadow, or filter.
- Sample all authored themes and several generated themes. Dominant-colour
  compatibility must prevent yellow/gold floors from pairing with green/sage
  walls, while every accepted floor remains lighter/readable against its wall.
- Open Springstep Sky Hollow from the tester picker. Collect the illustrated
  Spring Boots and cross both single- and two-square hole runs; before the pickup
  or with an unsafe landing the same input must be blocked. Check the boing,
  transparent hole edge, jump arc, and one-player handoff after landing.
- Trigger one winning battle and one rescue presentation. Confirm their short
  input locks end cleanly, Power reaches the exact engine value, the rescued pet
  joins once, reduced-motion mode shortens the flourishes, and navigation or
  restart leaves no stale overlay.
- Enter several different mazes and listen for a varying selection from all five
  full BGM tracks without an immediate repeat. Revisiting a maze within the same
  session must retain its track, and the short friendship cue must never loop as
  maze music.
- Inspect every cage style and confirm its opaque AI-generated front layer stays
  in front of the pet without a baked-in animal or background rectangle. Rescue
  multiple pets and confirm they occupy distinct recent footprints behind Ame.
- On iPad and desktop, press the maze to move immediately, hold to repeat, drag
  to steer, and recenter or release to stop. At ordinary wall bends, confirm the
  one-tile assist never pathfinds or assists onto a hazard or through a door or
  foe. Confirm the page does not pan or pinch-zoom during touch play. On a
  landscape phone and iPad, verify the maze panel uses nearly the full safe
  viewport height and the sidebar does not overlap or scroll.
- Check portrait turn-sideways guidance on the tablet and mute/unmute after the
  first tap. Browser audio should never start before that interaction.

Progress is intentionally device-local. A browser, private session, cleared site
data, different Vercel preview hostname, or another device has a separate save.

## Local production check

```powershell
npm ci
npm run check
npm run preview
```

The `.vercel/` directory is ignored because it contains machine-specific project
link metadata. The source-controlled configuration contains no account IDs or
secrets. On 2026-09-01 release commit `9213213` was pushed to GitHub `main` and
the canonical alias promoted playable build 0.9.1. The normal build-label button
and exact debug query each opened the ten-maze picker. Canonical 1024 x 768 and
667 x 375 checks had exact viewport-sized documents and no overflow; Maze 2,
Rainbow Picnic, and Lanternlight sampled the new material pipeline and dressing,
one keyboard step succeeded, and browser logs were clear. The broader
physical-device and manual matrix above remains required.
Executable artifacts remain intentionally excluded from Git and Vercel
deployment.
