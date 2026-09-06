# v0.22.13 public web verification

Astra,2026-09-06. **Published and verified** at
[mazesopuzzle.com](https://mazesopuzzle.com/) and the retained
[Vercel alias](https://maze-so-puzzle.vercel.app/).
Runtime `dfe04a93bcfd06a5548d51a4523b3625382ab0f1`; final source/harness
`e59d0f9b9185e2b71352168135582ec5af41e2d5`.
[Qualification and actual Sol review](2026-09-06-v02213-web-qualification.md)
record654 tests,33 browser cases and three serialized five-pair comparisons.

[PR2](https://github.com/MachineKomi/maze-so-puzzle/pull/2) and exact-source
[CI34062795366](https://github.com/MachineKomi/maze-so-puzzle/actions/runs/34062795366)
passed before publication. Remote main was still the observedaf70dd0; the
qualified source was fast-forwarded once through Git, without switching the
working branch `codex/jump-camera-delight` or discarding changes.
[Vercel Production](https://vercel.com/jasons-projects-6714ffa7/maze-so-puzzle/8p9tq76twrApDkd7BgjLYGjd49wP)
completed successfully. No duplicate CLI/preview deployment or guard override.

At22:07:43 UTC fresh no-cache requests returned200 from both origins, with
identical qualified entry bytes:

| File | Bytes | SHA256 |
| --- | ---: | --- |
| index.html |1070|`63bfcd42d9cb7686fb1b6f55b359657e093efb759b61a7e22aa75ee850e69140`|
| assets/index-DbTd2mCo.js |594615|`0872b905ea9480cd2dc30715f2e1a98d9bdf0c327c427773162aca622ccacad4`|
| assets/index-B-a8vIxf.css |119481|`879b70aef73c6bdad942caa7292dd0a30030192ee069d3c96267e4e645ca608a`|

Fresh isolated Chromium contexts at780×312 and1280×720, DSF2, displayed0.22.13
and completed Play → Friends → Sound → Home → Begin adventure → Start the maze
→ ArrowUp → Sound → resume. Both preserve0/32 met, fresh65/85 mix and exact
viewport fit, use `04b-section-v1` walls, accept one movement step and report
zero page errors. Visible media/fonts are decoded before four final captures.
Astra inspected the published desktop gameplay frame. No personal profile or
saved adventure was touched; origin-local saves remain separate.

The first stricter public helper incorrectly expected the initial ArrowRight
to increment steps. That input rescues the adjacent caged friend **from Ame's
current square**, so zero steps is correct engine behavior. The failed assertion
and initial receipt are retained in `tall-wall-public-20260906`. An external
corrected helper selects the known clear ArrowUp path; no runtime repair or
redeployment was needed. It passes both complete public journeys in
`C:/GameDev/maze-game-qa/performance/tall-wall-public-corrected-20260906/`.
Receipt SHA256: `acf5c8c956cab5b3560763c481f5b219951f443a4c808acbf07605fa688bffa2`.
The reusable source-helper correction is a subsequent Codex-branch checkpoint,
to travel with the next runtime release rather than trigger a redundant build.

This implements tall wall geometry, crisp sparse dressing and continuous jump
camera motion. **P13/Human wall beauty stays open**, with the changed P16 journey
in the [cumulative checklist](../PLAYTEST_CHECKLIST.md). Physical iPad, low-end/
thermal/full Plan07 and native qualification remain open; latest published
Windows is0.22.9, native0.22.10 unfinished. Higher aggregate jump raster work is
explicitly retained in qualification, not described as a universal speedup.

Next visual slice: lava/water/poison scale, distinct contained motion and clean
receiver boundaries through Plan02/04, then DELIGHT-02B and LEARN-01. Wider
roadmap and Human decisions remain intact. All outputs are recorded in the
[artifact ledger](../LOCAL_ARTIFACT_LEDGER.md); none were deleted or archived.
Documentation closure compares the full range from last-success e59d0f9 and
uses the unchanged [Vercel guard](../VERCEL_DEPLOYMENT.md), without a new build.

Final operations verification: docs closure `d04a6911964af5f057baa23ea173b6f7db7a091e`
was pushed to main; Vercel reported **Canceled by Ignored Build Step** at
[the skipped checkpoint](https://vercel.com/jasons-projects-6714ffa7/maze-so-puzzle/6hfewD4rxitWR4rD4WoVKB1EfqKC).
No second game payload was built. The known-clear-path helper correction is
backed up as03026dd on `codex/jump-camera-delight` only. Scripts are deliberately
not docs-exempt: carry that correction with the next qualified runtime release,
not an unchanged-game main push. Main remains at docs closure d04a691.
