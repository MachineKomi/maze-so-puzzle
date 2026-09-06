# New laptop handoff — 6 September 2026

## Start here: paused, not released

Human explicitly paused development to leave the slow old laptop. The active
repository was `C:/maze-game`; the intended new clone is `C:/GameDev/maze-game`.
Remote: `https://github.com/MachineKomi/maze-so-puzzle.git`.
Resume branch: **`codex/migration-wall04ar1-20260906`**. Main remains the previous
checkpoint. Push this WIP branch for backup, not to main: main auto-deploys.
The branch is excluded by the existing Vercel `codex/**` deployment guard.

[First prompt](NEW_LAPTOP_PROMPT.md) is designed to paste into a new local task.
This file and `JOINT_ORCHESTRATION_STATE.md` override historical “active/next”
paragraphs lower down in long plans. Don't infer completion from a version bump.

## Exact project and release state

- Main baseline before WIP: `d9c76976c0e1926fd6020f3071f32a6a37e762a7`, a
  requirements-only commit. Earlier cleanup baseline is
  `feb04e1bda9aea93a7fc0abc70b50f326339957f`.
- Online game at `https://mazesopuzzle.com` and the old Vercel alias is v0.22.10.
  The payload includes VFX-02A bounded Gold/Science/maze-Power wall-bounce/magnet
  presentation; it does not implement permanent XP or new reward drop tables.
- WIP package/UI/Tauri version **0.22.11** = WALL-04A-R1. It has **not** been
  deployed or released natively. Final tested candidate JS is
  `/assets/index-fV--7I7N.js` (586847 bytes), CSS `/assets/index-BTuEPBbD.css`
  (117988 bytes). No new art/media/CSS or dependencies.
- Baseline live JS for fair A/B is `/assets/index-T8J736ZB.js` (585521 bytes),
  SHA256 `e4cb4b603e531a4a67da0bab5bae26599bf594237d9005fb699a8b5a043b135a`.
  CSS is unchanged. If online advances, reconstruct the frozen baseline;
  don't silently compare against a different build.
- Latest fully published Windows release is **v0.22.9 WALL-04A**, source
  `cbe8ab879bd58c0a08a770209ebfeb649f684e2b`. The verified portable is
  173471744 bytes, SHA256
  `4bf84655dc589447344397c26847351990156743529a623d4aaafedfad46a441`.
- An unsigned0.22.10 portable is staged, NOT fully qualified/published:
  `C:/GameDev/maze-game-qa/releases/v02210/attachments/Maze-so-Puzzle-0.22.10-VFX-02A-e28d44b-locked-portable.exe`,
  173473280 bytes, SHA256
  `1533d4d494be468e16fe0531ad14c6c90ca0c15aa3e8a3ca09a36020f21051fe`.
  Its frozen source is `e28d44bd4b290bc3c64aad5ff24f944f4a8cc0ce`.
  Do not relabel it, overwrite it with a newer build, or relax exact-source
  release checks. Decide explicitly which next native checkpoint to qualify.

## Current wall work and unfinished gate

Human: initial walls looked better but too subtle/disappointing, shadow too
small, upper bend highlight aligned but lower bend did not. Main visual target
is a beautiful readable game, not a test-count milestone. Real3D/perspective
are allowed to investigate, not an instruction for an unbounded engine rewrite.

Read `docs/plans/WALL-04A-R1-convincing-depth.md`,
`docs/LIGHTING_AND_DEPTH_SPEC.md`, and
`docs/reviews/2026-09-06-wall04ar1-candidate.md`.

R1 raises faces to0.20–0.26tile, uses compressed approved texture on an opaque
colored side, keeps solid geometry inside original walls, and sweeps a bounded
floor-only cast. Bevel now follows BOTH original and uniformly raised contour
bands clipped to the true top intersection. Four constant extra paint paths,
zero additional wall filters/timers/media. No engine/save/camera changes.

Checks already done on old laptop:

- 642 project tests/58files passed serially; 28 focused wall/terrain tests passed
  again after a test-only bounds correction. TypeScript/build passed.
- `cargo check --locked` passed. This is compilation, not native launch/release.
- Performance contract passes: JSgzip9=161595 (+307, allocation400), CSS23655,
  public155542751 unchanged. Source art is unchanged; previous152art tests and
  zero art-validator errors are inherited, not a fresh art-suite claim.
- **72 production browser cases pass**:3 saved camera routes ×2 viewports
  (1193×833/844×390) ×DPR1/2 ×Full/Lite/Static ×Full/Reduced. Camera moves,
  zero terrain SVG mutations, errors, broken images or invalid ghost samples.
- Actual independent Sol reviewed source, six-material/four-bearing rack and
  three final gameplay captures: acceptable PROVISIONAL stronger relief, no
  actionable visible corner/readability blocker. Not Human beauty acceptance.

**Do not declare performance passed.** First alternating warmed live baseline
versus candidate Twilight/DPR2 Full trace: baseline p95~16.9ms all3 repeats;
candidate16.9/33.3/33.2ms despite similar total Paint/RasterTask cost. Subsequent
cast-on/off within candidate: Full~16.8–17ms both; Lite~33.2–33.5ms both.
The cast-specific theory is weakened, not the initial signal disproven. These
are instrumented loaded-host observations, not a clean hardware cohort. No
CompositeLayers events were available; this is not zero GPU/composite cost.

Raw numeric results are committed in `wall04ar1-paused-evidence.json`.
Final screenshots/logs are also preserved in
`C:/GameDev/maze-game-qa/migration-2026-09-06/wall04ar1`.
The last cast test finished before migration preservation; no new development
tests were launched after the pause. Owned review browser/server sessions were
not running when checked. Old session IDs/ports are not transferable state.

On new laptop: one controlled baseline/candidate test with known identical
scene, viewport, assets loaded, motion/quality and no competing agent builds;
inspect actual movement and the larger shadows, not just a single p95 number.
Resolve a reproducible regression before promotion. If Human still dislikes
the visual result, next wall work is a same-scene true orthographic3D prototype,
not another tiny opacity change. Research/options are already in the R1 brief.

## What follows once the wall checkpoint is qualified

The latest Human feedback is fully recorded in
`docs/playtests/2026-09-06-depth-discovery-and-celebration.md` and routed into
Plans01/02/04/09/10, roadmap and backlog. None of these Book/achievement changes
has been implemented by this WIP:

1. BOOK-02A: actual grey enemy/friend silhouettes, no repeated unknown copy,
   names, question marks or rescue counter. Real encounter reveals color/name/
   one-liner; friends can be encountered before rescue. Persist encounters
   before completion; existing species rescue records prove encounter. Show
   unique discovered X/Y against an obtainable eligible roster.
2. Plan02: stronger victory hero/friend dances, rare flips, finite fireworks/
   confetti; large in-maze earned-achievement sticker/fanfare; continuous glow
   and tasteful cheap twinkles. Preserve motion/mute/cancellation/award rules.
3. Plan09: all eligible friends/enemies obtainable, themed/progressively varied
   campaign and procedural rosters; all-friends/all-enemies achievement rules
   and matching approved stickers. Roster growth cannot revoke earned rewards.
4. Plan10 after09: real Garden membership indicator beside friend name and
   all-Garden achievement; never infer Garden ownership from rescue count.
   Co-op greybox/family gates remain. Permanent XP/economy remains Plan14
   exploration, not silently approved implementation.

Connected HOLE-02 art/topology, remaining04-B/04-C/PT36, later plans and backlog
remain in the roadmap. Don't let small corrective branches erase the programme.

## Collaboration and intent

Astra and Sol share outcome ownership. Human asked for real collaboration,
not fabricated agreement or a rigid alternating-turn ritual. Use one runtime
writer; the other reviews independently/read-only. If actual Sol is unavailable,
say so, do not label a second Astra opinion “Sol.” Existing old subagent/thread
IDs do not travel. Claude/Opus is occasional bounded review with fewer credits,
not a mandatory reviewer or implementation workforce.

Messages identify `# Astra:` or `# Sol:`. Human drives vision and family feel;
agents lead ordinary decisions and implementation. Ame/Amelia and Alex are
young children enjoying the game; preserve approachable, forgiving controls,
clear arithmetic/capability puzzles, delight and generous small rewards. It
must feel like a polished authored JRPG/adventure, not a tidy generic web app.
Compact inventive rooms/puzzles/exploration beat exhausting serpentine corridors.

Native/browser engineering pass, physical iPad8 performance and Human visual/
play-feel acceptance are separate. iPad camera stutter remains open; menus,
actors and stationary effects work well. Phone/desktop are much smoother.
Don't attribute every defect to iPad age or buy hardware to evade the target.

Keep durable decisions/evidence/backlog in repo. Commit and push meaningful
checkpoints; deploy qualified meaningful builds, not every documentation edit.
Update `docs/PLAYTEST_CHECKLIST.md` and `docs/HUMAN_DECISIONS.md`; don't wait
indefinitely for family feedback before independent work can proceed. No new
product answer blocks current recovery.

## Files to transfer manually

| Old location | New location / treatment |
| --- | --- |
| `C:/GameDev/maze-game-qa` | Same path. Keep playtests, reviews, performance/audio evidence, releases/attachments/helpers and the new `migration-2026-09-06` folder. May omit `worktrees` from TRANSFER (not deletion); unique leftovers there were preserved in migration folder. |
| `C:/GameDev/maze-game-claude-review` | Same path. Latest external drafts can differ from imported repo snapshots. |
| `C:/maze-game/artifacts/art-proofs` | `C:/GameDev/maze-game/artifacts/art-proofs`. Important: ignored by Git; some historical art checks require these exact reviewed proofs. |
| `C:/maze-game/output/playwright` | `C:/GameDev/maze-game/output/playwright`. Saved QA fixtures, traces and captures; can omit bulky reproducible duplicates only after checking. Latest wall proof is additionally consolidated in QA. |
| Local-only `C:/maze-game/release/*.exe` | Optional if preserving historical exact binaries; published ones can be downloaded from GitHub. Unpublished0.22.10 is in QA/attachments above and should be transferred. |
| `C:/Users/hellb/.codex/skills` custom folders | Back up `playwright`, `screenshot`, `product-brainstorming`, `synthesize-research`, `write-spec`. Restore using the new installation's supported skill location; do not overwrite bundled `.system` skills. |

Optional archive: `.codex/generated_images` if keeping unused originals outside
repo; `.playwright-cli` if retaining every old ad-hoc screenshot. Approved source
masters/OST/runtime art are already in Git, so these aren't required to run the
game. User-provided temporary screenshot originals should stay in their existing
Google Drive backup if not already in QA.

The six obsolete/external worktree snapshots have their combined tracked diffs,
unique untracked/proof files, exact duplicates and HEADs preserved under
`maze-game-qa/migration-2026-09-06/worktree-leftovers` with a hash manifest.
This includes historical Temp Plan03 WIP (a~15.8MB binary patch), not changes to
apply to current main. Full duplicate repos and old `.git` worktree link files
need not be moved to develop this project. Do NOT delete the originals yet;
verify the transferred backup and remote refs first. No new deletion authorized.

Do not copy `node_modules`, `dist`, `src-tauri/target`, `.vercel`, browser caches,
Git credentials, tokens or auth databases into the repo. Reinstall dependencies
from locks and sign into GitHub/Codex/Vercel afresh. Personal config may contain
paths/secrets: keep any backup private and merge selectively, never commit it.
Codex settings docs: https://learn.chatgpt.com/docs/config-file/config-basic .
Current docs describe user `.agents/skills`, while this installed old version
actually exposes `.codex/skills`; inspect the new app's discovered skills before
choosing where to restore them: https://learn.chatgpt.com/docs/build-skills .

Player progress is browser/Tauri WebView local storage, NOT in Git or guaranteed
to travel with account/browser sync. If old-laptop progress matters, retain the
old profiles privately until a scoped save export/import is arranged. Do not
copy browser auth/cookie databases blindly or clear the family's saves. Domain
change from the Vercel alias to mazesopuzzle.com also has separate origin saves.

## New path and toolchain preflight

Explicit destination name is important: the GitHub repo is `maze-so-puzzle`,
not `maze-game`; `git clone ... C:/GameDev/maze-game` chooses the intended name.
Read README/package locks before installation: Node requirement is
`^20.19.0 || >=22.12.0`; use locked npm install, Python plus requirements-art.txt,
Rust/MSVC Tauri prerequisites/WebView2 for native qualification. Don't silently
upgrade dependencies. Browser-only recovery can precede native setup.

Audit active scripts for `C:/maze-game`, `C:\\maze-game`, old username/tool paths,
localhost ports and removed release worktrees. Change live helpers to derive
repo root or accept an explicit parameter where useful. Preserve historical
source paths/hashes/provenance records as evidence; do NOT run a global path
replace over the repository. QA helper paths under C:/GameDev remain valid,
but their internal root constants may be old.

In particular, the checked-in `wall-travel-review.js` and
`wall-paint-comparison.js` use the old output/root and ports4190/4189; adapt these
before running. `prepare-laptop-handoff.mjs` is a one-time preservation script,
not something to rerun on the new machine against absent historical roots.
Recreate normal saved fixtures using `scripts/art_review/wall-rack.test.tsx`
with `MAZE_WALL_PROOF_DIR=output/playwright/walls04-rack`. The new relief rack is
`scripts/performance/wall-relief-rack.html`. Use available Playwright skill;
no new repository browser dependency or second parallel browser farm is needed.

## Storage/deployment lessons that must survive migration

Eleven approved worktrees were removed (~17.55GiB);30 backed-up superseded
delivery assets removed9,488,260bytes.104 held assets remain dependency inputs;
do not remove them from filename/age alone. Immutable approved sources remain.
No Git history rewrite or hosted-deployment deletion occurred or is authorized.
Git deletion reduces checkout/future deployment size, not historical Git objects.

Vercel storage growth came with repeated docs-only and duplicate branch/main
deployments. `vercel.json` now uses a tested ignore step based on previous
successful deployment SHA; `codex/**` previews disabled except explicit
`codex/preview/**`. Keep frequent backup pushes; don't bypass this policy for
handoff docs. Read `docs/VERCEL_DEPLOYMENT.md` before publishing.

## First new-machine response

Confirm branch/root/remote, restored evidence, unavailable tools/login blockers,
what is live versus WIP, and the smallest useful next step. Do not immediately
ship0.22.11 or start another broad implementation plan. Once preflight is sound,
resume the bounded wall qualification and real independent review, then progress
to BOOK-02A. Human asked to be brought up to speed and ready to continue, not
for another redesign/planning loop or loss of the work already completed.
