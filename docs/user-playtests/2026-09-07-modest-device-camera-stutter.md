# Camera stutter on modest Apple devices

Human report, September7,2026; exact tested build and OS versions not supplied.
Severe camera/movement stutter occurs on iPhone13 and eighth-generation iPad in
Safari and Chrome. Sprite/effect animations appear smooth. Reported device RAM
is approximately4GB/3GB. GalaxyS24, an8GB laptop and a24GB laptop feel smooth.
A family iPhone17 also feels smooth on campaign maze1 (no camera movement) and
maze2 (camera movement). Its reported8GB is not independently verified here.

The Human asks for a careful source/Claude review, detailed implementation plan
and fixes targeting smooth play on3GB Apple devices as well as Android and PC.
Claude's report was provided in `C:/GameDev/maze-game-claude-review/CLAUDE-PERFORMANCE-REPORT.md`.
The [CAMERA-17 plan](../plans/CAMERA-17-bounded-scene-performance.md) records its
hash, historical source boundary, adopted hypotheses and unsupported conclusions.

This evidence does not establish RAM as the cause, a minimum RAM requirement,
or an Apple-wide defect. Hardware age, chip, browser/OS and graphics allocation
are confounded. Preserve the successful iPhone17 observation fairly. Windows
CPU throttling measures an engineering response, not an emulated3GB iPad.
Affected-device confirmation remains in Q08/P19 after a changed build is live.

## Changed-build delivery

Web0.22.19 is now [published and verified](../reviews/2026-09-07-v02219-public-verification.md).
It retains CAMERA-17 and adds a shorter first-loot draw hitch, with a disclosed
slower maze-entry/cache trade. Q08/P19 now uses19 for entry, camera and first
Gold/Science opening. No new affected-device result has been received; the
original report remains open, and no minimum RAM specification is established.

Web0.22.17 is now [published and verified](../reviews/2026-09-07-v02217-public-verification.md).
Q08/P19 is ready for the short same-maze device comparison. The lab change reduces
raster work, with a disclosed extra-layer tradeoff; it does not establish the
physical cause or close this report without new affected-device observations.
