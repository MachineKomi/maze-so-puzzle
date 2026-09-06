# v0.22.12 public web verification

Astra,2026-09-06. Qualified source `5013ea7ea2c985487b9824ffd2ffbd6a9fb8079f`
(runtime `e18c6ee`) was fast-forwarded from accepted `d9c7697` to `main` after
[engineering qualification](2026-09-06-v02212-web-qualification.md) and actual
[Sol acceptance](2026-09-06-phone02-book-sol-final-review.md). The working branch
remains `codex/phone02-book`; no blind branch switch or R1 promotion occurred.

[PR1](https://github.com/MachineKomi/maze-so-puzzle/pull/1), exact-source
[CI34057314317](https://github.com/MachineKomi/maze-so-puzzle/actions/runs/34057314317)
and [Vercel Production](https://vercel.com/jasons-projects-6714ffa7/maze-so-puzzle/5vBuGfPYiEWtF4jREtVWMjRiFGK7)
identify this transaction. Git integration was used once; no CLI/preview duplicate,
force override, dependency installation, repo copy or cleanup was performed.

At20:32:34 UTC, fresh no-cache HTTP requests to both
[canonical](https://mazesopuzzle.com/) and
[existing alias](https://maze-so-puzzle.vercel.app/) returned200 for all three
entry files, exactly matching the qualified local bytes:

| File | Bytes | SHA256 |
| --- | ---: | --- |
| index.html |1070|`d7e936f8578774d73017cbabdef14e2b0281571adf71d5a171cf2cc5760d60ec`|
| assets/index-BPKRGxyO.js |588935|`816505e73976d41499f7abbc2ab74835ea861b7dd7fbec9fb7ef4b8c8cd9aff9`|
| assets/index-CNtPFkFx.css |119742|`bd96c37fce43dce81d6d5e902bf20a3c13dd007c7bf30c1ac53b4ec215cc1ab4`|

Fresh isolated Chromium contexts at780x312 and1280x720, DSF2, displayed0.22.12
and completed Play → Friends → Sound → Home → Begin adventure → Start the maze
→ directional input → Sound → resume. Both showed0/32 met and fresh Music65/SFX85;
the fitted stage exactly covered each viewport and no page errors were observed.
Visible images and fonts are decoded before the four final public Friends/game
captures; Astra inspected the final phone game and Friends captures. Results are at
`C:/GameDev/maze-game-qa/performance/phone02-book-public-20260906/`.
No personal browser profile or saved adventure was touched.

Final JSON SHA256: `0929865a6ff00e9d2f82d4cb9ce18e2ebdff25e08ccd8be17f53674340bc7e0f`.

The first helper invocation failed before launch because Windows ESM needs a
file URL. An extended smoke initially omitted the ordinary story dismissal and
correctly could not click through its modal; its incomplete JSON is retained.
The corrected helper explicitly clicks Start the maze and passes both journeys.
These helper corrections changed no runtime and are not hidden game failures.

The Human reported a `pwsh.exe` guard-page popup and dismissed it. Read-only
checks found available memory and no orphaned Maze test processes. The bounded
Application event query returned no matching record; the cause is unconfirmed.
No OS settings, pagefile, user browser or Codex service was modified.

Latest published Windows remains0.22.9; recovered native0.22.10 is unfinished.
R1/0.22.11 remains held. Physical comfort, acoustic listening, Human beauty and
the full Plan07/native matrix remain open. Continue DELIGHT-02B, then LEARN-01;
[P15 and cumulative playtests](../PLAYTEST_CHECKLIST.md) and
[Human decisions](../HUMAN_DECISIONS.md) retain actual observation boundaries.

Post-release documentation uses the unchanged last-success diff guard. Validate
the complete range from `5013ea7`, commit only docs/root Markdown and push backup
branches without a new version/build. A skipped docs deployment is expected and
does not require replacement publication. See [operations](../VERCEL_DEPLOYMENT.md).
