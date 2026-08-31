# Vercel deployment

The browser game is ready to deploy as a static Vite project on Vercel's Hobby
plan. It needs no paid features, serverless functions, database, environment
variables, or external services.

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

Git integration will create preview deployments for branches and production
deployments from the selected production branch. No rewrite is currently needed
because the game has one document and does not use client-side URL routing.

## Verify the deployment

- Open the generated `vercel.app` URL on desktop, iPad Safari, and the target
  phone browser in landscape orientation. Check a notched device if one is
  available; the controls should stay inside its safe area.
- Confirm the title artwork loads, Begin Adventure enters maze 1, WASD/arrow and
  pointer controls work, sound begins only after user interaction, and the
  Adventure Book opens.
- Complete or partially play a maze, reload the page, and confirm local progress
  remains on that device.
- Check Big Maze on a 21×21 or 23×23 level, portrait turn-sideways guidance on
  the tablet, and mute/unmute after the first tap. Browser audio should never
  start before that interaction.

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
secrets.
