# Web0.22.15 — verified public receipt

Astra,2026-09-07. Release source
`1e8b465dc7a416b2619b9104c88ccf2fd8af4875`; frozen runtime
`e69f3e4191305106e7cc77de6bbfedd2296ccb68`. Exact release CI
[34071195810](https://github.com/MachineKomi/maze-so-puzzle/actions/runs/34071195810)
passed. [PR6](https://github.com/MachineKomi/maze-so-puzzle/pull/6) was independently
reviewed and marked ready. Main fast-forwarded from04b5da9 without force or a
branch switch. The existing Git integration produced one successful
[production deployment](https://vercel.com/jasons-projects-6714ffa7/maze-so-puzzle/55XtFpyGLgQ2fftogtCSJrhfDzJq)
at00:55:26UTC. Guard and ignore configuration are unchanged; no manual duplicate.

At00:56:03UTC both [canonical game](https://mazesopuzzle.com/) and
[existing alias](https://maze-so-puzzle.vercel.app/) returned200 and matched all
three frozen entry files by length and SHA-256:

| Entry | Bytes | SHA-256 |
| --- | ---: | --- |
| index.html |1070|0718f87a9abae6b26bbc57243a876b1eb11f3bd607e7f7654b113753931f530d|
| assets/index-BGe6P2K8.js |598420|9efdebdfa194e6ed6a084d437ff888550a37b5ff308c43fe5cd3786f9b119148|
| assets/index-BMjZ25aw.css |121429|023de600bfbfde4110d27d4f415797dab41b3058bd505703e26479fa3b32147f|

Two fresh isolated Chromium public journeys at780×312 and1280×720, DPR2,
verified visible0.22.15, Friends0/32, fresh Music65/SFX85, Home→Adventure→Start,
one accepted ArrowUp step, Sound and resume. Both stages exactly fit their
viewports; wall `04c-balanced-v1` and hazard `02-crisp-local` match, with zero
page errors. Astra inspected both public gameplay screenshots. The Human's
browser profiles and origin-local saves were not touched.

External packet: `C:/GameDev/maze-game-qa/performance/wall04c-public-20260907/`,
five files/5,844,671B including four PNGs and machine receipt. Receipt SHA-256
`584f1181f5530b7606ba2d53facc63db63a81a2db96527323169eb86817193f1`.
The verifier records observed wall revision rather than the prior stale literal.
All owned verification browsers/processes exited; no repository/media clone.

[Qualification](2026-09-07-v02215-web-qualification.md) and
[actual Sol review](2026-09-07-wall04c-sol-final-review.md) bind664 tests,
41-case pre-label-fix matrix plus two post-fix follower journeys and all three
five-pair final performance cohorts. Desktop jump RasterTask+22.110% is a real
accepted bounded cost; measured frame intervals are at most16.8ms. No second
engine, physical iPad, native, low-end, thermal or Human beauty acceptance follows.
Windows remains published0.22.9; native0.22.10 remains held.

Q01 now has the changed wall/sprite build to judge. The Human accepted13's
direction;15's refinements still await their observation. Q02 asks for a fresh
jump check. Q04's hazard revision is not delivered here. Next authorized work:
Book-selected completion regression, HAZARD-03, then physical LOOT-03 and the
preserved roadmap. [Queue](../HUMAN_REVIEW_QUEUE.md),
[cumulative playtests](../PLAYTEST_CHECKLIST.md), [decisions](../HUMAN_DECISIONS.md).

Docs-only closure must compare against this successful release source1e8b465,
stage only docs/root Markdown, and verify the actual Vercel ignored-build result.
No version bump or new local build is needed. Retained evidence cleanup needs
explicit Human approval; [ledger](../LOCAL_ARTIFACT_LEDGER.md) records outputs.

## Observed documentation closure

Actual Sol independently reviewed `1e8b465..3ffc44c` and found no material closure
issue after attribution wording was corrected. Main then fast-forwarded to
`3ffc44c8dc459159954d48115d2918774870f07e`, containing only root Markdown/docs
since successful release1e8b465. The local guard returned SKIP using that actual
baseline. At01:05:54UTC the real Vercel commit status reported **Canceled by
Ignored Build Step**, [deployment record](https://vercel.com/jasons-projects-6714ffa7/maze-so-puzzle/9GqSAXPhqQR7VsFgQY5NuZTpg28c).
No new full game build was produced. Public runtime remains the qualified15
payload above. This observed-result note is backed up on the current Codex branch
for the next normal checkpoint; no additional main push or deployment is needed
merely to record the skip.
