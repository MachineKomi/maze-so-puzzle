# New laptop recovery and readiness — 6 September 2026

Astra (GPT-6) recovery/writer; actual GPT-5.6 Sol High independent source and
helper review. This records the resumed task, not a restart of the programme.
The [migration handoff](2026-09-06-new-laptop-handoff.md) remains the preserved
pause record. No runtime feature, release, deployment, deletion, archive or
player-profile operation occurred during recovery.

## Verified checkout and channels

- Actual root: `C:/GameDev/maze-game`; branch
  `codex/migration-wall04ar1-20260906`; arrival HEAD
  `bc4bb0660eb2dca57204c3b76833bd0dec63ed82`; working tree clean on arrival.
- Origin: `https://github.com/MachineKomi/maze-so-puzzle.git`.
  Live remote branch matched that HEAD; remote main remained
  `d9c76976c0e1926fd6020f3071f32a6a37e762a7`. No branch switch/reset.
- **Live web remains 0.22.10.** Both domains returned identical HTML/JS/CSS
  at `2026-09-06T17:57:28Z`; baseline JS matches the handoff's exact SHA below.
- **0.22.11 remains WALL-04A-R1 WIP**, with fresh build/static checks only.
  The old timing signal, new-host movement/visual qualification and publication
  remain open. The previous independent Sol visual review is inherited.
- **Latest published Windows remains 0.22.9**, confirmed against the live
  [GitHub release list](https://github.com/MachineKomi/maze-so-puzzle/releases).
  The separately staged 0.22.10 native portable is still unqualified and in
  transit; no new native compile, launch or package acceptance is claimed.

| Entry | Bytes | SHA-256 |
| --- | ---: | --- |
| Live `/assets/index-T8J736ZB.js` | 585521 | `e4cb4b603e531a4a67da0bab5bae26599bf594237d9005fb699a8b5a043b135a` |
| Rebuilt candidate `/assets/index-fV--7I7N.js` | 586847 | `0e27a17d598655b169f940330d85192a48c1d770d38099dedf1d4f906a475b7e` |
| Shared `/assets/index-BTuEPBbD.css` | 117988 | `503da2e95e6635cdaa65325397ac7fdc73fc4ee383c9068b7eb0728b0b489db7` |

Candidate build provenance: runtime-input SHA-256
`155017402a826c9629e9bb3bbe05a5674bfdd6307707935e43c838b56920c536`;
dist fingerprint `bd218a9351e80fdbc28db1d8aa49ce47ab2c9c4bc94ce08217288d1272d9fb6b`.
Raw HTTP identity and frozen baseline entry files are under ignored
`output/playwright/migration-preflight-20260906/`; approved media remains in
the existing public tree. No duplicate release worktree was needed.

## Restoration inventory

At arrival, `C:/GameDev/maze-game-qa`, `C:/GameDev/maze-game-claude-review`
and `artifacts/art-proofs` were absent. `output/playwright` contained only
`v0.20.0/title-1280x720.png` (1246450 bytes). Human confirmed in this resumed
task that uploads were still running and a USB transfer to GameDev was planned.
Those destination folders are left for that transfer; they are not lost or
silently recreated as empty recovered evidence.

Recovered from Git:

- Complete migration/joint-state/roadmap/execution/feedback/decision context,
  approved source/runtime artwork, soundtrack and immutable release records.
- Committed paused evidence: four 18-case lanes, 72 functional/mutation cases,
  12 A/B diagnostic rows and 12 cast-isolation rows. This is old-host evidence.
- External-worktree preservation manifest: all six recorded HEADs resolve;
  all 41 available tracked duplicate files match their recorded hashes.
  The external unique files/patches are still pending transfer, including two
  nonempty patches of 15839533 and 170901 bytes. Do not apply them to this branch.
- The mandatory v14 approved packet was restored using
  `scripts/art_pipeline/proof_archive.py --restore`: **49 exact files**,
  authenticated by the committed ZIP, original approval and transitive index.
  Subsequent `--check`: 49 verified, zero missing, zero runtime writes.
  This does not recover every old ignored proof or create a new art approval.
- Three engine-derived normal wall saves and the component rack were freshly
  generated under `output/playwright/walls04-rack-new-host`. These are new
  reproducible fixtures, not recovered old screenshots.

Still in transit: consolidated wall screenshots/logs/trace payloads, external
worktree-leftover backup, other ignored art proofs, external Claude drafts and
the exact unpublished 0.22.10 portable. Verify their existing manifests after
transfer. Do not overwrite or relabel the staged executable. Published old
binaries, full duplicate worktrees, build/dependency caches and unused image
originals are not needed to start browser work. Browser/profile saves do not
travel in Git; no family profile was read, copied or cleared here.

## Local toolchain and capabilities

| Capability | Verified state |
| --- | --- |
| Hardware | Ryzen AI 5 340, 6 cores/12 threads; 23.29 GiB OS-visible RAM; Radeon 840M, driver 32.0.22024.3004. Inventory is not a performance verdict. |
| Node/npm | 24.19.0 / 11.17.0; satisfies package engine range. `npm ci --no-audit --no-fund` installed 55 packages; `npm ls --depth=0` matches lock. No package/lock changes; Rolldown remains 1.2.6. |
| Python | Bundled Python 3.12.14; PATH `python` is a Store alias. Dedicated venv: `C:/Users/hawki/.cache/maze-so-puzzle/art-venv-20260906`. |
| Art packages | Exact requirements: Pillow 12.2.0, numpy 2.5.2, jsonschema 4.26.0. Bundled defaults differed, so they were not modified. Transitive requirements are not fully pinned by the repository. |
| Rust/native | rustc/cargo 1.97.1, stable x86_64-pc-windows-msvc; WebView2 152.0.4191.66. Tauri info cannot detect MSVC + Windows SDK. Install those prerequisites before locked native compilation/qualification. |
| Browser tooling | Bundled Playwright 1.62.1 launches an isolated headless Chromium-family browser reporting 152.0.4191.62 and closes it. This is tooling readiness only. No repository browser dependency or junction added. Record the actual launched browser again for A/B; do not substitute the WebView version. |
| Skills | `product-brainstorming`, `synthesize-research`, `write-spec` are restored and exposed from the new user's `.codex/skills`; bundled imagegen/computer-use capabilities are available. Old custom `playwright`/`screenshot` skills and CLI commands are absent. Bundled Playwright can run the existing callbacks; no skill/plugin installation is required for wall qualification. |
| Git/access | Git 2.55.0; Credential Manager configured; noninteractive remote read and push dry-run succeed. `gh auth status` is signed out. No Vercel CLI; existing Git deployment integration/guard remains authoritative. No credentials copied or committed. |

Use the exact art interpreter, not bare `python`:

```powershell
& 'C:/Users/hawki/.cache/maze-so-puzzle/art-venv-20260906/Scripts/python.exe' -B scripts/art_pipeline.py --check
```

The requirements' installed transitives were attrs 26.1.0,
jsonschema-specifications 2025.9.1, referencing 0.37.0, rpds-py 2026.6.3 and
typing_extensions 4.16.0. Record encoder facts when generating derivatives;
this recovery generated no new art.

## Scoped operational fixes and independent review

Only three browser helpers change. `wall-travel-review.js` and
`wall-paint-comparison.js` now require an explicit `reviewFixtures` URL;
the comparison also requires an explicit `reviewBaseline` outside cast mode.
`reviewCandidate` defaults to the opened page's origin. Travel/capture helpers
derive the candidate origin and use repo-relative new-host output directories;
`reviewOutput` can select a fresh absolute external evidence folder.

`scripts/art_review/wall-browser.js` additionally requires `reviewBundle`,
rejects the wrong mounted module, and records the observed module per row.
Sol identified this missing source binding during independent diff review;
Astra fixed it and Sol confirmed the final scoped diff passes. Existing frozen
filename checks in the performance callbacks are retained. A filename alone is
not the content-hash gate required for the next promotion comparison.

Run callbacks from the repo root and URL-encode these parameters. For example,
select an available candidate origin and pass
`reviewFixtures=http://127.0.0.1:<fixture-port>/output/playwright/walls04-rack-new-host/fixtures.json`.
For the older wall-browser callback, bind
`reviewBundle=/assets/index-fV--7I7N.js`. No old session ID or port is inherited.
The historical short paint callback remains explicitly non-qualifying; use the
longer paired protocol below for promotion.

Remaining old-user paths belong to historical `process_v12_assets.py`,
`process_v13_story_assets.py`, `process_v15_sprite_variety.py` source generation
inputs and the one-time `prepare-laptop-handoff.mjs` preservation script.
Preserve those inputs/provenance; do not run these scripts blindly. Active
runtime/native/CI code has no remaining `C:/maze-game` dependency in this audit.
External QA helper internals can only be audited once transferred.

## Fresh checks and limits

- Serial `npm test -- --maxWorkers=1 --no-file-parallelism`: **642/642,
  58 files**, 68.15 seconds, with opt-in wall fixtures generated separately from
  family saves. This run preserves the inherited test count on the new host.
- TypeScript/production build passes and reconstructs the candidate identities
  above. Vite's existing >500 kB chunk advisory remains; no warning suppression.
- `npm run perf:check` passes static contracts/evidence schema and deterministic
  gzip9 budgets: JS **161595**, CSS **23655**, public **155542751** bytes.
  These checks explicitly do not pass timing or physical-device gates.
- Deployment guard **12/12**, including three real-history cases with
  `MSP_DEPLOY_HISTORY_TESTS=1`. `vercel.json` and the guard remain unchanged;
  this migration branch remains excluded from automatic deployment.
- `npm audit --omit=dev --audit-level=high`: zero vulnerabilities. Final scoped
  diff and local recovery links pass checks; runtime, public assets, locks,
  native sources, exact-art records and deployment configuration are unchanged.
- Three callback syntax checks and independent actual Sol final diff review
  pass. No new 72-case browser run or new visual acceptance is claimed.
- Art unit suite: **152 run, 151 pass, 1 error**, 102.811 seconds. The exact
  Tessera reconstruction reaches the final report comparison with the approved
  runtime/source-record bytes intact, then rejects the historical publication
  report: current Python 3.12.14 / zlib 1.3.2 differ from its recorded Python
  3.14.3 / zlib 1.3.1.zlib-ng. Pillow/numpy/libwebp versions match. Keep that
  original environment record; do not rewrite it or report a fresh 152-pass.
- First fresh full-art validation reports **3 errors / 425 historical warnings**:
  one stale-manifest aggregate plus the retirement-ledger byte count/hash drift.
  The v14 approval-bound packet is valid. Recorded ledger: 623530 bytes,
  `7bf495f7ac0c01400c33ca05d7b5016fe3a3051cb9c87a8b5359dfb2bfe2ba10`;
  checkout: 610813 bytes,
  `04f028696f9b9ba0697791cff1c251b3a4649a09f5c386241abc08582a11d1da`.
  Converting all newlines to CRLF does **not** reproduce the recorded bytes.
  Preserve this failed evidence and resolve exact authority before claiming a
  fresh full-art pass; do not regenerate the manifest to hide drift.

Independent ledger investigation confirms the checkout is byte-identical to
the committed `c41b56d` cleanup ledger. Earlier inspected Git objects are also
LF-normalized; attempted mixed-EOL reconstruction from diff boundaries did not
match the recorded hash. Original mixed-EOL worktree bytes are a hypothesis,
not established authority. Check the incoming old-laptop evidence for the exact
623530-byte original. No ledger, manifest or `.gitattributes` change was made.
Both art failures are explicit portability/provenance limits, not newly changed
runtime art. A fresh complete art gate is unavailable until they are resolved.

## Next owned action

Astra owns the runtime/heavy slot; actual Sol independently reviews evidence.
Browser qualification can proceed while the transferred ledger/evidence and
native prerequisites are pending. Run the shortest controlled wall comparison,
using the recovered/restored evidence as it becomes available:

1. Freeze baseline and candidate locally with the byte identities above; use
   equivalent serving/cache policy, one browser binary, no competing builds,
   identical decoded assets/fonts and normal Twilight save at 1193x833, DPR2,
   Full quality/full motion. Record hardware/power/browser/background state.
2. Discard one warm-up, then run three alternating pairs of an engine-derived
   right/left camera route lasting 3–5 seconds. Match start/end steps and camera
   distance; retain all attempts and reject contaminated/unmatched pairs.
3. Record p50/p90/p95/max, >20/>34 ms counts and complete frame samples, Paint/
   Raster traces, and paired visible captures of movement and larger shadows.
   Zero CompositeLayers records means unavailable evidence, not zero GPU cost.
   The old Full p95 16.9 versus 16.9/33.3/33.2 remains an unresolved signal;
   later cast-on/off parity does not identify a shadow-specific cause or clear it.
4. If parity holds, make one compact/DPR2 confirmation and independent visible
   lower/upper-rim, material and corridor review. If a regression reproduces,
   isolate its cause before promotion. Do not expand into another browser farm
   or renderer rewrite. Human-disappointing relief triggers the existing
   same-scene orthographic-3D comparison, not another tiny opacity adjustment.
5. Only after qualified review proceed toward a separately authorized release
   transaction. P13 beauty, physical iPad8 and native qualification remain
   separate. Today's instruction is recovery with no publication.

Then **BOOK-02A** silhouettes, genuine friend/enemy discovery persisted before
maze completion, and unique obtainable-roster X/Y counters; then richer finite
friend-led victories, in-maze achievement fanfare and continuous pickup glows.
Garden membership waits for real Plan10 data; collection rules/art stay in
Plans09/10. Permanent XP/new economy is not authorized.

Preserve HOLE-02/04-B/04-C/PT36, remaining UI/VFX, Alex/ALT-P1-01, 08 controls,
05 animation, 07B/FP-CORE2, 09/FP-CAMPAIGN, 10 greybox/family/Garden/FP-COOP,
11 front door, 13 closure, future explicitly approved 12 hygiene, RC-01,
planning-only 14 and final 15. Latest overrides supersede historical active
assignments, the old large-level quota and the old unselected-hole wording.
Room-rich 20x20+ remains welcome within the 24x24 ceiling; approachable puzzles,
readability, beauty, satisfying rewards and Ame/Alex's enjoyment remain the aim.

[Cumulative playtests](../PLAYTEST_CHECKLIST.md) ·
[Human decisions](../HUMAN_DECISIONS.md) · [Full backlog](../PLAYTEST_BACKLOG.md).
