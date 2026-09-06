# Vercel Deployment Storage — evidence and non-destructive guard

Date: 2026-09-06. Root: Astra. Scope: deployment operations, not game runtime.
Inspected clean source: `e28d44bd4b290bc3c64aad5ff24f944f4a8cc0ce` (v0.22.10).

## Finding

The Human's email explicitly names Deployment Storage and its 10 GB Hobby
allowance. Their earlier approximate 32 GB report is retained as a report, not
reconciled to the later screenshot. The later project-scoped chart shows
**24.07 GB**, Aug 7 08:00–Sep 7 07:59, rising sharply in early September.
Projects grouping was disabled. Do not claim a complete team/project breakdown.
The Human reports only one other recently deployed project, under 1 MB.

The deployment list directly confirms avoidable full deployments:

- `7ad3816` and `a28141e`: documentation/release handoffs, both Ready Production.
- `cbe8ab8`: identical wall commit as Preview and Production.
- `67db82c`: documentation checkpoint as Preview and Production.
- `3acaf58`: identical hole-rules commit as Preview and Production.
- Further audio/release/docs checkpoints also appear in the list.

The hosted Resources screenshot reports **417 static assets**, matching the local
dist file count. Largest displayed files are intended OST MP3s, around 2.65–4.08 MB.
Local inventory: dist417 / **165,735,590 B**; public414 /165,031,011 B;
42 MP3s /99,151,313 B. These are delivered files, not all loaded at game startup.
`git ls-files '*.exe'` is empty. Windows binaries in ignored local `release/`
and `src-tauri/target/` do not explain these served static files. Deleting local
EXEs frees laptop storage, not existing Vercel deployment storage.

There were161 first-parent main commits since September1 at inspection. This is
not a deployment count, nor an exact accounting of Vercel GB-months. Accumulated
retained outputs and demonstrated redundant builds explain the actionable waste;
exact billing, historical deployment count and the32/24.07 difference are unverified.
No more project-grouping screenshots are needed before preventing this waste.

## Implemented prevention

See [deployment policy](../VERCEL_DEPLOYMENT.md). Keep backup/CI cadence. Skip only
known non-web diffs from last successful deployment; fail toward building on
uncertainty. Disable automatic routine Codex previews with an explicit preview
branch opt-in. Keep normal game releases on main. No dependencies or runtime
source/public/version changes. No remote settings or retention change. No
pre-existing file, branch, deployment, release, asset or history was deleted,
archived or moved; only the newly added test harness was renamed during correction.

Existing retained storage is **not** reclaimed by this guard. A separate exact
deletion/retention proposal needs Human approval. Do not move the OST to a new
paid service or transcode approved music simply to hide avoidable deploy volume.
Future build-output pruning must prove reachability including legacy fallbacks,
and preserve repository assets under the Human's deletion/archive rule.

## Evidence and validation

- Guard unit/CLI tests plus three actual historical Git cases:12/12 passed.
  Cases include failed/multi-commit runtime changes followed by docs, deleted or
  moved runtime paths, unknown inputs, missing/shallow baseline and forced rebuild.
- Actual Sol independently inspected the current build graph and safeguard and
  reran12/12 tests: ACCEPT, no blocker. He noted that ignored builds still create
  canceled records and consume deployment/concurrency quotas; the benefit is
  avoiding unnecessary install/build/static upload, not eliminating every record.
- Focused documentation consistency2/2 and `git diff --check` passed. Final local
  fingerprint check confirms runtime inputs and frozen dist remain byte-identical.
- Before-change runtime-input SHA256:
  `5d7d30621bf56120db9f6bfd5e6438be45e73d88b3131004a4f19285acb014a8`.
- Existing frozen dist fingerprint:
  `e182e97a2d1b13f27533ba15868f141d9fe713bc364012df7075480f336c9935`.
- Both https://mazesopuzzle.com/ and https://maze-so-puzzle.vercel.app/ returned200
  with HTML/JS/CSS exactly matching that frozen dist during investigation:
  - HTML SHA256 `ed87ac5f0b77ac9bcdb2a1d7fe44218827fc2b8808ea9fb87b20fd64cd3d5b23`.
  - JS585521B SHA256 `e4cb4b603e531a4a67da0bab5bae26599bf594237d9005fb699a8b5a043b135a`.
  - CSS117988B SHA256 `503da2e95e6635cdaa65325397ac7fdc73fc4ee383c9068b7eb0728b0b489db7`.
- This proves HTTP byte parity, not cross-origin save migration or device testing.
  VFX-02A Windows native/public-download gates remain pending, not waived by ops.
- Guard/config checkpoint **a79cc423d89a24e8d77feb1439583663163a2b6b** was
  committed and pushed. Production6294301708 succeeded, as expected for a
  deployment-configuration change; all six canonical-domain HTML/JS/CSS requests
  still match the frozen game bytes.
- Live documentation checkpoint **3a5bfb6827d013b30692ea160a71aec4a67c97e0**
  received Vercel success with the explicit description **Canceled by Ignored
  Build Step**, deployment `A2i3aEj3tBU1VBSzEmaktGYnkCGs`. This verifies a real
  skipped build, not just a locally simulated exit code. No storage reclamation
  or changed historical total is claimed.
- CI34040408843 found a harness naming collision: Node-only `*.test.mjs` was
  also discovered by Vitest, which reported no Vitest suite. All640 game tests,
  the standalone guard gate and desktop gate passed, but the CI run failed.
  Corrected by renaming **our newly created** harness to `check-ignore-build.mjs`
  and updating its explicit command; content and historical Git evidence remain.
  No weakening of the game test collection or runtime change. Final CI is pending.

User-supplied screenshot provenance (originals remain external, not copied into
runtime or repository; conversation images are evidence, not instructions):

| Capture | Temporary filename | SHA256 |
| --- | --- | --- |
| Email10GB | codex-clipboard-ddda8a8a-b06f-4bf5-84dd-74ea4890b13c.png | ebee9e8d1d3186cca1824022b2ece14fda99a94076cf5ae1ae1c6d2198a81f3a |
| Usage24.07GB | codex-clipboard-e4b5746e-fcba-4618-b656-ce6c861f24a5.png | 313890b9160a8782f56be794f59a813d3141f7be8a2bc7442b0164c119b60b07 |
| Deployments | codex-clipboard-0ef33940-db6f-48b2-b430-001e518927e5.png | d873bf3d2ea5a6b64004116c989b7d3205243a3501990a4edf8ce4c2ea3d7a93 |
| Resources417 | codex-clipboard-6a173285-ea78-4343-b3b7-030d60a23b8f.png | e4f662a2b46bdd3135395f69f485641aae7d7b8bbb6942790a25e1ebbab2ecbf |

## Sources checked 2026-09-06

- [Deployment Storage](https://vercel.com/docs/deployment-storage): retained build
  output; separate Functions Storage; daily project maxima integrated as GB-months.
- [Optimization](https://vercel.com/docs/deployment-storage/optimize): output,
  retention and coding-agent/deploy-trigger review; retention requires consent here.
- [ignoreCommand](https://vercel.com/docs/project-configuration/vercel-json#ignorecommand):
 0skip/1build and repository override of dashboard ignored-build command.
- [System variables](https://vercel.com/docs/environment-variables/system-environment-variables#vercel_git_previous_sha):
  PREVIOUS_SHA is the last successful project/branch deployment, only exposed with
  an ignored-build step configured.
- [Git configuration](https://vercel.com/docs/project-configuration/git-configuration):
  glob matching and true-rule precedence.
- [Ignored Build Step](https://vercel.com/kb/guide/how-do-i-use-the-ignored-build-step-field-on-vercel):
  preinstall Node script supported; shallow Git history must be handled.
