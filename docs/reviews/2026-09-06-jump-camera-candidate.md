# Jump-camera correction — candidate

Astra,2026-09-06. Baseline is qualified live web0.22.12, runtime `e18c6ee`;
source checkpoint `af70dd0`. Work branch `codex/jump-camera-delight` remains
undeployed. [Human feedback](../user-playtests/2026-09-06-jump-camera-and-tall-walls.md)
owns the outcome and the subsequent tall-wall priority.

The old camera selects one jump midpoint and treats the jump as a discontinuity,
then snaps to the landing view. Actual Sol independently confirmed this cause.
The candidate uses the existing scene rAF owner for one finite smooth ground
trajectory and its camera. CSS supplies only the existing local arc/shadow/ring;
three cached animation handles are paused and seeked on the same absolute clock,
so a delayed React mount cannot restart the arc behind the camera. No frame
React update, layout read, new renderer, dependency, media, save or rule change.

The logical camera targets jump.to, never a chained portal's already committed
remote exit. Portal remains an explicit discontinuity; followers stay hidden
through both phases. Static/Reduced land synchronously. Blur/resize/hidden settle
the finite trajectory. Removal occurs at its exact duration, eliminating the
old duration-minus20ms endpoint cut. Public jump duration/reach remain460ms/one hole.

Root provisional allocation: at most1000 gzip9 JS, zero CSS/public growth;
one existing rAF and three reused local CSS animation handles, no added scene
nodes or backing surfaces. Full and Lite use the same finite path; no ambient work.
Final measured allocation and qualification precede publication.

Current evidence:650 project tests/build passed before the three animation-handle
clock refinement; the refined source builds. Two old-source phone/desktop motion
diagnostics reproduce the fixed camera; seven candidate browser cases pass for
phone/desktop tracking, Lite/Reduced/Static, resize and blur. These do not yet
close chained portal, rapid approach, delayed commit or paired performance gates.
Sol's initial source review found the clock risk above; final review is pending.

API references: [MDN Animation.currentTime](https://developer.mozilla.org/en-US/docs/Web/API/Animation/currentTime)
documents seeking both paused and playing animations; [Element.getAnimations](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations)
supplies subtree animation handles. This is the implementation choice, not a
claim that a browser API establishes physical-device performance.

Evidence folders under `C:/GameDev/maze-game-qa/performance/`:
`jump-camera-before-20260906`, `jump-camera-after-20260906` and the exact three
baseline entry files plus identity JSON in `jump-camera-baseline-v02212`.
The latter is a small frozen entry packet, not a copied full build or repository.
All outputs are held; no cleanup is authorized. Current wall appearance remains
unresolved and no iPad/native/beauty acceptance is inferred from this jump work.
