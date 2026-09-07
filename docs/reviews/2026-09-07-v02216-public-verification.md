# v0.22.16 public verification

**Published web0.22.16**, September7 at02:15:39UTC verification start.
Release **815deb052e8e921e0a10356870af3c0e02d9f84f**, frozen runtime
**09d5475c522c410cbe723d4e0dd8bd76945400f6**. [Qualification](2026-09-07-v02216-web-qualification.md)
and [actual Sol review](2026-09-07-v02216-sol-final-review.md) passed before the
non-forced main fast-forward. Exact runtime CI34074434881 and release CI34075470855
succeeded. [PR7](https://github.com/MachineKomi/maze-so-puzzle/pull/7).

One existing Git-integrated [Vercel deployment](https://vercel.com/jasons-projects-6714ffa7/maze-so-puzzle/CE46G8wpWi7DVoeoTnJCH6KLp4SJ)
reports success. No CLI duplicate, preview deployment or guard override was used.
Both [canonical site](https://mazesopuzzle.com/) and [retained alias](https://maze-so-puzzle.vercel.app/)
return200 and byte-identical frozen HTML/JS/CSS:

| Entry | Bytes | SHA-256 |
| --- | ---: | --- |
| index.html |1070|8dc2fabc1e2ee5fde148827f9ce15d180fd02e32325dc11ba4a0af6fd6bd31b6|
| assets/index-aQLG22Mg.js |598960|6593a81e58d373faee015a29b91fd2ea9c246ca060c85a2fbe6cd390c137cd64|
| assets/index-DFsBSc8z.css |119811|d421c025b8ceaa4730a21d0a4f37d89611231cdf8c8ae53b40c1011c4e145a5a|

`scripts/performance/verify-web-release.mjs` completed two fresh isolated public
Chromium journeys at780×312 and1280×720, DPR2. Both showed16, Friends0/32,
fresh Music65/SFX85, retained04c-balanced-v1 walls and03-living-connected hazards.
Play→Friends→Sound→Home→Begin adventure→Start→ArrowUp→Sound→resume passes, one
movement step recorded, exact stage fit and zero page errors. Four screenshots
and receipt are in `C:/GameDev/maze-game-qa/performance/v02216-public-20260907/`.
No Human browser profile or save was accessed. Both owned contexts/browser closed.

This delivers Book progression, moving-dot removal and the revised liquid banks/
shade/motion; it preserves the accepted tall walls and larger grounded sprites.
The recorded Full-mode idle RasterTask increase remains real (+9.983/+15.496%
ratios of medians). No physical iPad/WebKit/native/low-end/thermal or Human beauty
acceptance is inferred. Windows0.22.9 remains published; native0.22.10 is held.

Q04/Q07/P18 are now changed-build playtests; Q01/P17 wall refinement and Q02 jump
observations remain independent. [Queue](../HUMAN_REVIEW_QUEUE.md),
[cumulative playtests](../PLAYTEST_CHECKLIST.md), [decisions](../HUMAN_DECISIONS.md).
Next is [LOOT-03 A](2026-09-07-loot03-readiness.md), migration/conservation first.

Documentation closure must compare against actual successful815deb0. Do not
rebuild solely for docs or push another runtime/preview to align a documentation
SHA. Observe the normal ignored-build result after the scoped docs push. Retain
all named evidence; no deletion/archive was authorized.

Evidence inventory: five files,5844552 bytes. Receipt SHA-256
`7b9d3f7b7d90da7fc48542131c21d1e8c7cd476a95cb03d354277ccfdb6d10f0`.
[Artifact ledger](../LOCAL_ARTIFACT_LEDGER.md) retains review/cleanup candidates
without deleting or archiving them.

## Observed documentation closure

Documentation-only commit **1b3bfecc2bca1c3b80b1770953f73d26e5cdc0b9** is
on main and the development branch. All22 changed paths are documentation;
468 local Markdown links resolve and the whitespace check passes. The unchanged
repository guard compared actual successful815deb0 to this exact HEAD and
returned exit0/SKIP: only documentation/release/CI/desktop files changed.

The GitHub Vercel status at02:26:19UTC is **Canceled by Ignored Build Step**,
[deployment record](https://vercel.com/jasons-projects-6714ffa7/maze-so-puzzle/bsnYKJ8hNuGHhfGZAPZZvpvZUFxN).
This is observed skip evidence, not merely the local guard prediction. The live
game remains the qualified815deb0 payload. This observed receipt is backed up
on the current Codex branch without another main push; include it normally
with the next runtime slice. No build, version bump, manual deployment, source
clone or deletion was needed for documentation closure.
