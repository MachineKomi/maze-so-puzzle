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
- Click or tap the small **Playable build 0.10.3** label on the title screen and
  confirm the secret tester picker can open every authored maze directly. Also
  load `?debug=mazes` and confirm it opens the same picker automatically. Preview
  runs must not change gold, records, rewards, active-run recovery, or unlocked
  progress.
- Inspect several straight paths, bends, diagonal contacts, enclosed pockets,
  and connected water/lava/poison areas. Floor and wall patterns should remain aligned
  across the camera, convex and concave corners should follow the terrain
  boundary, floor/wall contrast should remain clear, and connected 2–4 tile
  hazards should have no outline, lip, cast shadow, or filter.
- Sample all authored themes and several generated themes. Dominant-colour
  compatibility must prevent yellow/gold floors from pairing with green/sage
  walls, while every accepted floor remains lighter/readable against its wall.
- Use the tester picker to inspect all three lock families. The pink Rose Heart
  Key must match the Rose Heart Door, the blue Blue Star Key the Blue Star Door,
  and the yellow Sunny Sun Key the Sunny Sun Door. Confirm each pair has its own
  unmistakable colour and silhouette, and that hints and labels use the full
  matching pair name rather than showing a recoloured star.
- Collect a maze weapon, splash boots, Spring Boots, Antidote Leaf, potion, and
  key across representative mazes. Each should display a short board-centred
  picture-and-name toast without hiding the compact feedback permanently. Ame,
  enemy sprites, and outlined Power values should remain large and readable
  without Power covering a face.
- Open Springstep Sky Hollow from the tester picker. Collect the illustrated
  Spring Boots and cross both single- and two-square hole runs; before the pickup
  or with an unsafe landing the same input must be blocked. Check the boing,
  transparent hole edge, jump arc, and one-player handoff after landing.
- Open Moonlit Friendship Quest. Confirm the Antidote Leaf is on a real detour,
  poison blocks before collection, its connected two-tile region is inset and
  feathered over visible floor, and the collected leaf appears in the bag.
- Touch a stronger enemy while armed. Confirm the move and step count do not
  advance, only the **Too strong!** comparison appears, and dismissing it leaves
  the maze ready for backtracking rather than resetting the run.
- Trigger one winning battle and one rescue presentation. Confirm their short
  input locks end cleanly, Power reaches the exact engine value, Ame remains one
  square away with no added step, and the next input enters the cleared enemy
  tile. The rescued pet should join once, reduced-motion mode should shorten the
  flourishes, and navigation or restart must leave no stale overlay.
- Enter several different mazes and listen for a varying selection from all five
  full BGM tracks without an immediate repeat. Revisiting a maze within the same
  session must retain its track, and the short friendship cue must never loop as
  maze music.
- Inspect every cage style and confirm the sparse v4 front layer shows one low
  base, two side posts, and three narrow bars in front of the pet, without a
  baked-in animal, rear cage, dome, central panel, or background rectangle. The
  pet should remain easy to recognize through the open centre. Rescue multiple
  pets and confirm they occupy distinct recent footprints behind Ame.
- On iPad and desktop, press the maze to move immediately, hold to repeat, drag
  to steer, and recenter or release to stop. At ordinary wall bends, confirm the
  one-tile assist never pathfinds or assists onto a hazard or through a door or
  foe. A single press should remain easy to release: the first repeat waits about
  320 ms, then the held cadence should ease gradually rather than zipping to full
  speed. Confirm the page does not pan or pinch-zoom during touch play. On a
  landscape phone and iPad, verify the maze panel uses nearly the full safe
  viewport height and the sidebar does not overlap or scroll.
- Check portrait turn-sideways guidance on the tablet and mute/unmute after the
  first tap. Browser audio should never start before that interaction.
- From both the title screen and Adventure Book, open **Reset progress** and
  cancel once to prove nothing changes. In a disposable browser profile, confirm
  once and verify the game returns to Story Maze 1 with records, gold, rescues,
  stickers, medals, badges, and the active run cleared. If testing storage
  directly, an unrelated `localStorage` entry must remain untouched.

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
secrets. On 2026-09-01 release commit `65fe554` was pushed to GitHub `main` and
the Vercel Hobby production deployment became ready. The canonical alias reports
playable build 0.10.2; the exact debug query lists all twelve story mazes. Live
1024 × 768, 844 × 390, and 568 × 320 checks retain one fixed normalized layout,
an exact 16:9 stage, no document overflow, and no production warning/error logs.
The same source also passes the local twelve-size matrix, perfect-rescue
iPad/phone finish, 65-step Antidote Leaf route, conserved multi-bash Power
transfer, and non-destructive stronger-enemy interaction. The broader
physical-device and manual matrix above remains required.
Executable artifacts remain intentionally excluded from Git and Vercel
deployment.

Playable build 0.10.3 passes its local 267-test/20-file browser gate. Its
separate unsigned Windows portable executable and NSIS installer are also built,
version/hash checked, byte-compared with the final Tauri outputs, and the
portable app has passed its launch smoke. On 2026-09-01 GitHub `main` commit
`3f61cbd` auto-deployed to the canonical Vercel site. The public label reports
0.10.3, the exact debug query lists all twelve mazes, 1194 × 834 and 844 × 390
retain viewport-sized pages with no broken visible images, the new v4 cage asset
loads, and the production console has no warning/error entries. The 0.10.2
paragraph above remains historical evidence.
