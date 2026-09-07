# v0.22.17 public verification

**Published web 0.22.17**, September 7, 2026. Verification started at
04:10:33 UTC. Release **65acb82076e299e7764b508e0d83ff2f77dd96df**,
reviewed checkpoint **b41a5c40e4faed8d5bd3f10a776c2be4c8c0c0d7**, frozen
runtime **eff0530820760fa7a5f22ac5ae68327dad626653**.
[PR8](https://github.com/MachineKomi/maze-so-puzzle/pull/8) merged after Linux
verification and Windows compilation CI34081874552 passed. The release tree
matches the reviewed checkpoint exactly. Windows compilation is not native
release acceptance: published Windows remains0.22.9, native0.22.10 held.

[Qualification](2026-09-07-v02217-web-qualification.md) and
[Sol's independent review](2026-09-07-camera17-sol-final-review.md) accepted the
scoped web change before publication. One existing Git-integrated
[Vercel deployment](https://vercel.com/jasons-projects-6714ffa7/maze-so-puzzle/6KWzrG5GKzRxSooc61FS2XTNdLyq)
reports success. No duplicate preview/manual deployment or guard override.

Both [canonical site](https://mazesopuzzle.com/) and
[retained alias](https://maze-so-puzzle.vercel.app/) return200 and match the
frozen HTML, JavaScript and CSS byte for byte:

| Entry | Bytes | SHA-256 |
| --- | ---: | --- |
| index.html |1070|8bc65a2ac96e3dc6de94ac7b968c0a4dea3abd5853f57df7d0340b056b85dfcf|
| assets/index-CTYfMU9E.js |602800|060cd653186d4888965c047858c1a6e1eae64282da478e89c115646f513118fe|
| assets/index-BVffqDNp.css |120280|050565a839dbd47fb285909012a0e2b9a596bbc268f0a4f3b212204b6e501c7b|

`scripts/performance/verify-web-release.mjs` passes four fresh, isolated public
journeys. At780×312 and1280×720/DPR2: Play → Friends → Sound → Home → Begin →
Start → ArrowUp → Sound → resume. Both show version17, Friends0/32, Music65/SFX85,
retained wall/hazard revisions, one move, exact stage fit and zero page errors.

The optional current-engine maze-2 fixture also passes on the canonical domain
at844×390/DPR3 and the retained alias at1080×810/DPR2. Each moves four steps,
then reverses four: camera x5→1→5, y0, bounded10×10 viewBoxes and aligned
foreground before/turn/after. Saved steps16→24 and exact player return pass.
These contexts use synthetic fixture saves; no Human browser profile or save
is accessed. The public phone image retains the readable map palette, tall
walls and large grounded player/friend. All owned browsers and contexts close.

Evidence: `C:/GameDev/maze-game-qa/performance/v02217-public-20260907/`,
seven files,10383251 bytes. Receipt SHA-256
`bb914ef94898b2bc740c3bf354ff3eea5cfbe47a7af10c78fe003339b30c1741`.
Fixture SHA-256
`f16d2d2ea126c1c2a228f8bdf43d2c0efb2a0d396b484f164a4d9e6227f2c1b5`.
The [artifact ledger](../LOCAL_ARTIFACT_LEDGER.md) preserves outputs and review
triggers; no files are deleted or archived.

This delivers bounded camera paint, liquid/static isolation and grouped-map
rendering, with a measured26–70% reduction in Raster work across six lab rows.
Small-maze extra layers are an explicit caching tradeoff, not a claimed RAM
saving. These public journeys are functional checks, not Apple frame timings.
**The reported iPhone13/iPad8 defect remains open pending Q08/P19.** Neither
an iOS-wide cause nor a minimum RAM floor is established. Physical Apple/3GB,
WebKit, GPU memory and thermal acceptance remain open.

[Queue](../HUMAN_REVIEW_QUEUE.md), [cumulative playtests](../PLAYTEST_CHECKLIST.md),
[decisions](../HUMAN_DECISIONS.md). Next independent implementation is
[LOOT-03 A](2026-09-07-loot03-readiness.md), migration/conservation first.
If affected-device stutter persists, compare this exact public build and collect
Safari/device-side evidence before choosing the next renderer/input change.

The following documentation closure must use actual successful65acb82 as the
guard baseline. Do not build again solely to align a documentation SHA with
the published runtime. Record the actual ignored-build result separately.

## Observed documentation closure

Documentation-only checkpoint **81387a35c4d7abdb7ac81a724a06e0db9c1e60fd** is
backed up on main and the current Codex branch. All16 changed paths are Markdown;
489 checked local links resolve and the whitespace check passes. The unchanged
guard compares actual successful65acb82 to the exact documentation HEAD and
returns exit0/SKIP: only documentation/release/CI/desktop files changed.

GitHub's raw Vercel status reports **Canceled by Ignored Build Step** at
04:15:40 UTC, [deployment record](https://vercel.com/jasons-projects-6714ffa7/maze-so-puzzle/H9LmkTzVEoBHndK3msSPfQBFQmY6).
This is the observed skip, not merely a local prediction. The published game
remains the qualified65acb82 payload. This observation is committed/pushed only
on the existing Codex branch and can join the next runtime slice normally;
there is no second main push, rebuild, version bump or manual deployment to
record the skip. No files are deleted or archived.
