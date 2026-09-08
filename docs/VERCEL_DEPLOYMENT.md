# Vercel deployment

The browser game is a static Vite project: no backend, serverless functions or
database. The Human upgraded the existing team to **Pro** on 2026-09-06 after a
Deployment Storage warning. Do not change its plan, retention or billing settings.

Production URL: [mazesopuzzle.com](https://mazesopuzzle.com/).
Existing alias: [maze-so-puzzle.vercel.app](https://maze-so-puzzle.vercel.app/).
Both serve identical frozen v0.22.28 HTML/JS/CSS, verified 2026-09-08 in the
[public receipt](reviews/2026-09-08-v02228-public-verification.md). Browser saves are
origin-local: the new domain does **not** automatically inherit saves from the
old alias. Keep the old alias available; never clear saves to migrate domains.

The Vercel project is already connected to
`MachineKomi/maze-so-puzzle`. Runtime/build-input changes on `main` still start a
production build. The repository-owned deployment safeguard skips proven non-web
changes, while GitHub backup pushes and CI continue. See the
[storage investigation and evidence](reviews/2026-09-06-vercel-storage-investigation.md).

## Web build input boundary

`.vercelignore` excludes native/source evidence directories. Tests inside `src/`
are still part of the app TypeScript graph during `npm run build`; they must not
import excluded `src-tauri/` or `docs/` files, even if full-clone CI passes. Keep
web release-identity tests to package/lock/UI inputs and native checks in their
own lane. The0.22.14 correction retained a real TS2307 deployment failure that
exposed this boundary; do not relax `.vercelignore` to package native evidence.

## Routine documentation checkpoints

Current last successful production release: **d17c89d0b9ca408d881732724deb9e08d088bdaf**
(web0.22.28). Use the actual successful deployment as the guard baseline; later
skipped documentation checkpoints do not require a replacement game build.

Keep documentation, planning and review checkpoints on the current working
branch. The migration branch `codex/migration-wall04ar1-20260906` is covered by
the existing `codex/**` auto-deployment exclusion. Do not move its unqualified
0.22.11 wall candidate onto `main` merely to publish documentation.

Before a docs-only commit, inspect `git status --short` and the exact staged
paths with `git diff --cached --name-status`; stage only the intended files.
Check changed links, relevant documentation contracts and `git diff --check`.
Do not run `npm ci`, a game/native build or a release worktree solely to create
a documentation checkpoint. Commit and push the reviewed checkpoint for backup;
no version bump, preview branch, Vercel CLI deployment, Redeploy or force override
is needed. Record newly created local outputs in the
[artifact ledger](LOCAL_ARTIFACT_LEDGER.md), without copying their payloads into
the documentation commit.

Judge deployment eligibility from the complete range since Vercel's last
successful deployment. A docs-only final commit can follow unshipped game work;
that range must still build on an eligible branch. Conversely, a safely skipped
docs checkpoint needs no replacement deployment to acquire a new source SHA.
Do not change the guard or spoof its baseline to make a mixed range look like
documentation. Missing baseline evidence intentionally permits a conservative
build. The guard rules and tested exit convention below remain authoritative.

For a qualified game release, use the existing Git integration once. Avoid a
duplicate manual/CLI deployment or a routine preview followed by the identical
production payload. An explicit preview should serve a concrete review need.
Local cache removal cannot reclaim hosted deployment storage; any hosted
retention/deletion proposal remains a separate exact-target Human decision.

## Backup is not deployment

- Commit and push meaningful checkpoints frequently. Do not reduce backup cadence.
- `vercel.json` runs `node scripts/deployment/ignore-build.mjs` before installation.
  Vercel's convention is **exit 0 = skip; exit 1 = build**.
- Compare **VERCEL_GIT_PREVIOUS_SHA** (last successful project/branch deployment)
  to **VERCEL_GIT_COMMIT_SHA**, not `HEAD^`. A docs commit following an unshipped
  runtime commit must still build. Renames include both removed and added paths.
- Only `docs/`, `release/`, `.github/`, `src-tauri/` and root Markdown are exempt.
  These do not enter the current browser bundle. Unknown files, `src/`, `public/`,
  package/lock/config files, and scripts always build. Revisit the exemptions if
  future Vite production code imports documentation or desktop assets.
- Missing environment/SHA, missing shallow-history baseline, mismatched checkout
  or Git errors **build conservatively**. Do not substitute a guessed parent to
  suppress a build. Long doc-only sequences may therefore cause an occasional
  safe fallback build with Vercel's shallow checkout.
- Routine `codex/**` branch auto-deployments are disabled. An intentionally named
  `codex/preview/<purpose>` branch opts in; `main` and non-Codex branches retain
  their default Git deployment eligibility. Vercel permits a matching `true`
  rule to override the broader `false` rule. Existing branches/deployments remain.
  Agents must bring this configuration forward before pushing an older branch.
- For a deliberate unchanged-source/environment recovery deployment, the operator
  can use Redeploy and uncheck **Use project's Ignore Build Step**, or temporarily
  set `MSP_FORCE_DEPLOY=1` for that environment, deploy and then
  remove the override. This bypasses the diff gate, not Git branch eligibility.
  Never leave it enabled routinely. No override is needed for normal game changes.
- Intentional skipped builds can show as canceled/ignored in Vercel; this is not
  failed game QA. They still count toward deployment/concurrency quotas, but do
  not proceed to install/build/upload another full game output. A docs
  checkpoint's source SHA need not have a new production
  deployment. Verify game releases at their actual runtime commit and raw bytes.
- This prevents future waste; it does not reclaim retained historical storage.
  Any retention change, deployment deletion or asset archive needs explicit Human
  approval with exact targets and preserved rollback/download needs first.

Validate with `node --test scripts/deployment/check-ignore-build.mjs`; CI runs this
without extra dependencies. For the three real-history regressions, additionally
set `MSP_DEPLOY_HISTORY_TESTS=1` in a clone retaining the referenced historical
commits. CI intentionally retains a shallow checkout instead of downloading old
art history solely for those optional cases.

## Import from GitHub

1. Sign in to Vercel with the GitHub account that can access
   `MachineKomi/maze-so-puzzle`.
2. Choose **Add New → Project**, then import `MachineKomi/maze-so-puzzle`.
3. Keep the repository root as the project root.
4. Use the Human-selected existing team and plan; do not purchase/change a plan.
5. Vercel should read the committed `vercel.json` settings:
   - Framework Preset: `Vite`
   - Install Command: `npm ci`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Ignored Build Step: `node scripts/deployment/ignore-build.mjs`
6. No application secrets are needed. Keep Vercel system environment variables
   available for the build guard. Do not disable the guard for routine deployment.

Git integration follows the branch/diff policy above. No rewrite is currently needed because the game has one
document and does not use client-side URL routing.

## Publish an update

1. Run `npm run check` locally and review the exact source diff.
2. Push the verified commit to GitHub `main`.
3. Allow the existing Vercel Git integration to build and promote web changes.
   A proven docs-only range since the last successful deployment should skip;
   the final commit title alone does not establish that range. Do not create a
   second project or duplicate CLI deployment for an already-running Git deployment.
4. Open the canonical production URL and confirm its build label and the key
   smoke checks below. GitHub Actions and Vercel build independently, so a green
   local gate and a post-deployment smoke test are both required.

## Verify the deployment

Use the current [release checklist](RELEASE_CHECKLIST.md),
[family checks](PLAYTEST_CHECKLIST.md) and [joint state](JOINT_ORCHESTRATION_STATE.md).
Do not restart the old release-specific checks below as current requirements.

## Historical v0.19-era smoke checklist (retained evidence)

- For the Plan 03 static-art cutover, confirm the current catalogue and visible
  weapon label use **Bubble Ring Blade**. The historical `bubble-bow` ID is a
  one-way saved-content resolver alias only; it must not remain a selectable
  current weapon family or public label.
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
  23×23 Lanternlight Labyrinth, including camera clamping near an outer edge.
- Generate several Surprise Mazes and confirm their deterministic sizes vary
  across unlocked odd 9–23 bands rather than increasing monotonically. No maze
  may exceed the absolute 24×24 limit.
- Inspect later generated mazes for 2×2–4×4 chambers, clustered treasure or
  rescues, and Power-gated monster rooms. The widened geometry must not make any
  ordinary or all-friends route unsolvable.
- Click or tap the small **Playable build 0.19.0** label on the title screen and
  confirm the secret tester picker can open every authored maze directly. Also
  load `?debug=mazes` and confirm it opens the same picker automatically. Preview
  runs must not change gold, records, rewards, active-run recovery, or unlocked
  progress.
- Start a new normal authored maze and confirm its illustrated chapter appears.
  Tap anywhere or press an ordinary key and confirm it closes without moving Ame
  or adding a step. Resume, restart, Surprise Maze, and tester starts should not
  interrupt play; the picture-led Story button must reopen authored chapters.
- Inspect several straight paths, bends, diagonal contacts, enclosed pockets,
  and connected water/lava/poison areas. Floor and wall patterns should remain aligned
  across the camera, convex and concave corners should follow the terrain
  boundary, floor/wall contrast should remain clear, and connected 2–4 tile
  hazard base textures should have no outline, lip, or cast shadow. Confirm the
  water ripple, internal lava shimmer, and rising poison-bubble overlays remain
  clipped cleanly inside those same connected rounded boundaries.
- Sample all authored themes and several generated themes. Dominant-colour
  compatibility must prevent yellow/gold floors from pairing with green/sage
  walls, while every accepted floor remains lighter/readable against its wall.
- Use the tester picker to inspect all three lock families. The pink Rose Heart
  Key must match the Rose Heart Door, the blue Blue Star Key the Blue Star Door,
  and the yellow Sunny Sun Key the Sunny Sun Door. Confirm each pair has its own
  unmistakable colour and silhouette, and that hints and labels use the full
  matching pair name rather than showing a recoloured star.
- Collect each lock family and open its matching door. Confirm the key and door
  share their colour glow, the opening edge blooms before the door disappears,
  and the particle shower uses hearts/petals, stars/diamonds, or suns/sparkles
  to match the lock motif. Reduced-motion mode should keep a readable static
  flash and omit ambient movement.
- Collect a maze weapon, splash boots, Spring Boots, Antidote Leaf, potion, and
  key across representative mazes. Each should display a large board-centred
  picture-and-name toast using that exact item sprite without hiding the compact feedback permanently. Ame,
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
  input locks end cleanly, Power reaches the exact engine value, and the exact
  `+X!` gained amount floats above Ame after the last clash. Ame remains one
  square away with no added step, and the next input enters the cleared enemy
  tile. The rescued pet should join once, reduced-motion mode should shorten the
  flourishes, and navigation or restart must leave no stale overlay.
- Enter several different mazes and listen for a varying selection from all thirteen
  full BGM tracks without an immediate repeat. Revisiting a maze within the same
  session must retain its track, and the short friendship cue must never loop as
  maze music.
- Inspect every cage style and confirm the complete v5 front layer has a top
  rail, bottom rail, connected bars, and central lock in front of the pet,
  without a baked-in animal, rear cage, scenery, or background rectangle. The
  pet should remain easy to recognize through the transparent openings. Rescue multiple
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

Playable build 0.11.0 was pushed to GitHub `main` as commit `934a7db` on
2026-09-02 and auto-deployed successfully through the connected Vercel Hobby
project. The canonical title screen reports 0.11.0; the tester picker lists all
fifteen story mazes with the new portal chapter in positions 13–15. Rose Heart
Roundabout opens in its 6 × 6 camera with the expected three-friend objective,
and direct production requests for all three portal PNGs plus a newly added OST
track return HTTP 200 with the correct image/audio content types. Local
1280 × 720, 1194 × 834, and 844 × 390 browser QA remains the detailed layout
record for this source. The 0.10.2 and 0.10.3 paragraphs above are historical.

Playable build 0.12.0 was pushed to GitHub `main` as commit `2a3110a` on
2026-09-02 and auto-deployed successfully through the connected Vercel Hobby
project. The canonical title reports 0.12.0; the tester picker lists all sixteen
story mazes, and Rainbow Power Parade opens with the five-friend objective,
nineteen visible enemy Power labels across the full board, restored Gold and
Science counters, enlarged minimap, and generated picture-navigation controls.
Representative Gold chest, Science beaker, and Mazes WebP assets return HTTP
200 with `image/webp`. Local 1280 × 720, 1024 × 768, and 844 × 390 browser QA
remains the detailed responsive layout record for this source. Earlier release
paragraphs remain historical evidence.

Playable build 0.13.0 was pushed to GitHub `main` as commit `32b2d66` on
2026-09-02 and auto-deployed successfully through the connected Vercel Hobby
project. The canonical title reports 0.13.0. Live tester navigation opened
Chapter 10 with Professor Poggle, and an ArrowRight skip closed the chapter
while retaining Ame's starting position and zero steps. The production Sprig
and Professor Poggle WebPs return HTTP 200 as `image/webp` at 58,694 and 73,084
bytes. Local story QA covers chapters 1, 10, and 16 at 1280 × 720 desktop,
1024 × 768 iPad, and 844 × 390 landscape phone. Earlier release paragraphs
remain historical evidence.

Playable build 0.14.0 was pushed to GitHub `main` as commit `0a6168b` on
2026-09-02 and auto-deployed successfully through the connected Vercel Hobby
project. The canonical title reports 0.14.0; its tester lists all sixteen story
mazes and reports the rebuilt Lanternlight Labyrinth at 23×23. The live
Adventure Book includes the procedural Surprise Maze explanation and fresh-maze
button. At 1280×720 the production document exactly matches the viewport with
no page overflow. Local 1280×720 and 1024×768 checks remain the detailed room,
fixed-stage, and browser-log record for this exact source. Earlier release
paragraphs remain historical evidence.

Playable build 0.15.0 was pushed to GitHub `main` as commit `42775f7` on
2026-09-02 and auto-deployed successfully through the connected Vercel Hobby
project. The canonical title reports 0.15.0; the tester lists all sixteen story
mazes and the 23×23 Lanternlight Labyrinth. At 1280×720 the live document exactly
matches the viewport. Direct production requests for all nine new Otter/Lamb/
Capybara, Acorn Knight/Bubble Dragon/Candy Mimic, and Comet Spear/Bubble Bow/
Cupcake Mace PNGs return HTTP 200 with `image/png`. Earlier release paragraphs
remain historical evidence.

Playable build 0.16.0 was pushed to GitHub `main` as commit `496edbb` on
2026-09-02 and auto-deployed successfully through the connected Vercel Hobby
project. The canonical JavaScript reports 0.16.0. Direct production requests
for the four new friends, four new enemies, four new repeatable terrain
textures, and two new transparent dressing overlays all return HTTP 200 with
the expected WebP/PNG media types and exact local byte sizes. Earlier release
paragraphs remain historical evidence.

Playable build 0.16.1 was pushed to GitHub `main` as commit `44c1023` on
2026-09-02 and auto-deployed successfully through the connected Vercel Hobby
project. The canonical JavaScript reports 0.16.1. Direct production requests
for all thirteen looping OST songs and the reserved friendship cue return HTTP
200 as `audio/mpeg`; every live byte size matches its local source. The local
browser title-to-maze navigation check reports no warning or error logs. Earlier
release paragraphs remain historical evidence.

Playable build 0.17.0 was pushed to GitHub `main` as commit `512a02e` on
2026-09-02 and auto-deployed successfully through the connected Vercel Hobby
project. The canonical JavaScript reports 0.17.0. Direct production requests
for all fourteen new illustrated sticker, medal, and badge assets return HTTP
200 as `image/webp`; every live byte size matches its local release file. Local
browser checks at 1280×720 and 1024×768 covered the title, Adventure Book,
gameplay HUD, and Help dialog without warning or error logs. Earlier release
paragraphs remain historical evidence.

Playable build 0.18.0 was pushed to GitHub `main` as release commit `a05061e`
on 2026-09-02 and auto-deployed successfully through the connected Vercel Hobby
project. The canonical JavaScript reports 0.18.0. Direct production requests
for the four complete Golden Heart, Storybook Wood, Moon Silver, and Garden
Vine cage WebPs return HTTP 200 and every live byte size matches its local
runtime asset. Local browser checks at 1280×720 and 1024×768 exercised the
larger sprite-backed pickup notice, complete cage, rescue opening, and exact
post-combat Power reward without warning or error logs. Earlier release
paragraphs remain historical evidence.

Playable build 0.19.0 was pushed to GitHub `main` as release commit `288e653`
on 2026-09-02 and auto-deployed successfully through the connected Vercel Hobby
project. The canonical JavaScript is `index-DyaTff51.js` and reports 0.19.0;
the live CSS/JavaScript contain the water-ripple, lava-shimmer, poison-bubble,
and colour/motif door-burst contracts. Local production-browser checks at
1280×720 and 1024×768 exercised live hazards, the Blue Star Key glow, and a
single 18-particle Blue Star Door opening with no document overflow or browser
warning/error logs. Earlier release paragraphs remain historical evidence.

Playable build 0.20.0 FP-ART-OST was pushed to GitHub `main` as runtime source
commit `45dfda27c9f7c60b1dd8c42fd0f9e06e1801f58c` on 2026-09-04. GitHub Browser
build run 33897322239 completed successfully. The canonical index and
`index-CwB1ah1Q.js` returned HTTP 200; the bundle reports 0.20.0 and contains the
new Home hero, progress-v5/Stay flow and delivered OST catalogue. Direct HEAD
requests for all 42 soundtrack files succeeded. This verifies deployment and
static reachability, not physical-device listening, mastering, crossfade or
low-end performance quality.

Playable build 0.20.1 was pushed to GitHub `main` as runtime source commit
`d6b11c026ead3d75565e10490c10307a5a14cfd0` on 2026-09-04. GitHub Browser
build run 33906290349 completed successfully. The canonical index and
`index-Dr4fqy07.js` returned HTTP 200; the bundle reports 0.20.1 and references
the refreshed Poggle/Sprig portraits, repaired Home hero and separate title
environment. Direct HEAD requests for all four corrective art paths succeeded.
This verifies deployment and static reachability, not the pending physical
iPad/TV/phone, clean-machine installation or qualified performance gates.
# Latest verified web release

Web0.22.17 is live from65acb82/runtime eff0530:
[public receipt](reviews/2026-09-07-v02217-public-verification.md).
Use65acb82 as the actual last-success baseline for the following docs-only closure.
The version-consistency test deliberately imports only web/package/lock inputs:
`src-tauri/` is excluded by `.vercelignore`; do not make app compilation depend on it.
Docs-only closure must still follow the unchanged ignored-build procedure above.
