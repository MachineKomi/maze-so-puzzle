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
  pointer controls work, keyboard and D-pad holds repeat smoothly, sound and
  music begin only after user interaction, and the Adventure Book opens.
- Complete or partially play a maze, reload the page, and confirm local progress
  remains on that device.
- Confirm every maze whose width or height exceeds 7 tiles uses the 7×7
  player-centred view and a minimap that keeps explored tiles visible while
  masking unvisited areas. Check an early 9×9 maze, a generated maze, and the
  25×25 Lanternlight Labyrinth, including camera clamping near an outer edge.
- Click or tap the small **Playable build 0.7.1** label on the title screen and
  confirm the secret tester picker can open every authored maze directly. Also
  load `?debug=mazes` and confirm it opens the same picker automatically. Preview
  runs must not change gold, records, rewards, active-run recovery, or unlocked
  progress.
- Inspect several straight paths, bends, diagonal contacts, enclosed pockets,
  and connected water/lava areas. Floor and wall patterns should remain aligned
  across the camera, convex and concave corners should follow the terrain
  boundary, and hazards should have a flat subtle floor lip with no cast shadow.
- On iPad, drag around the maze and confirm Ame follows the dominant direction,
  changes direction during the same gesture, and stops on release. Confirm the
  page does not pan or pinch-zoom during play. On a landscape phone, verify the
  stage uses the full safe viewport and the sidebar does not overlap or scroll.
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
secrets. Version 0.7.1 also has separately built and smoke-checked local Windows
test artifacts; those executable files are intentionally excluded from Git and
Vercel deployment.
