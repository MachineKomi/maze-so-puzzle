# CAMERA-17 — bounded scene rendering for modest devices

September 7, 2026. Human authorizes implementation and qualified publication.
This interrupts LOOT-03 A because movement comfort affects basic playability.
Astra is the sole runtime writer on `codex/bounded-camera-performance`; Sol
independently challenges the design, source, pixels and measurements.

## Problem and evidence

The Human reports severe camera stutter on iPhone 13 and eighth-generation
iPad in Safari and Chrome, while sprite/effect animation looks smooth. Galaxy
S24, an 8 GB laptop and the new laptop are smooth. A family iPhone 17 is smooth
on campaign mazes 1 and 2. Reported RAM values are approximate; this small,
uncontrolled sample does not establish either a RAM threshold or an iOS cause.
Target: enjoyable continuous movement on the reported 3–4 GB devices, preserving
the beautiful tall walls, large grounded characters and clear controls.

Claude's `C:/GameDev/maze-game-claude-review/CLAUDE-PERFORMANCE-REPORT.md`
(SHA-256 `8eb39b795bf8a45731b161bb83d56b716dbf72e8cea0e44304e7c38fc155ccba`)
was fully read. It examines v0.22.13/dfe04a9, using Windows Chromium, cold SVG
rasterization and backgrounded interaction measurements. Its useful hypotheses
are oversized moving surfaces, expensive SVG painting and minimap reconciliation.
Its claims about the exact Apple cause and memory sufficiency exceed its data:
small-maze JS/image estimates omit actual Apple graphics/page memory; a cold
SVG raster is not a camera frame, and timing a React tree does not isolate the map.

Current baseline is verified public web0.22.16, release815deb0/runtime09d5475.
Unused hazard definitions, dash animations, morphology/blur inset and hazard
blend/mask work cited by Claude are already removed. Do not repeat those fixes
or discard accepted16 liquid/wall appearance. Current-source remaining leads:
the full-maze moving world/foreground, full SVG paint bounds, map tile elements
reconciled each step, and repeated travel-state attribute writes.

[WebKit layer guidance](https://webkit.org/blog/8262/visualizing-layers-in-web-inspector/)
explains the repaint/memory tradeoff; promotion must be measured and bounded.
[WebKit memory guidance](https://webkit.org/blog/6425/memory-debugging-with-web-inspector/)
separates JS, images, layers and page memory. Neither source supports declaring
that 3 GB is insufficient or promising success without an affected-device test.

## Implementation sequence

1. Freeze the exact16 HTML/JS/CSS and identity outside the repo; share unchanged
   media. Capture unthrottled and defined CPU-throttled browser routes at phone DPR3
   and tablet DPR2, including camera-moving small/large mazes and nonempty hazards.
   Confirm unused hazard animation count is zero on dry mazes. Keep trace runs
   separate from uninstrumented frame/geometry checks. Do not emulate RAM by
   equating CPU throttling with an Apple device.
2. Replace the maze-sized moving paint extent with a bounded camera window and
   gutter: at most FOV+4 tiles per axis (10 by10 for the normal six-tile view).
   Reuse stable full-level wall topology, lighting and world-space pattern phase.
   Rebase integer window origins only when the sample leaves the gutter. Update
   world/foreground viewBoxes, layout origins and fractional translation together
   in the existing travel owner before paint. No second clock or per-frame React.
   Bound mask regions too; promote only these bounded surfaces. Check actual
   compositing extents, not merely DOM width. Preserve overlap, cast reach, holes,
   actors, labels and scroll/resize/clamp/jump/portal semantics at every boundary.
3. Remove repeated travel-state writes. Replace the minimap's per-tile DOM grid
   with grouped terrain paths and sparse object/player overlays, preserving
   fog, current-view/remembered distinction, guided markers, colours, geometry and
   accessible descriptions. Inspect its node cost separately; use a matched
   control before attributing any part of the combined frame/work gain to it.
4. Run genuine independent Sol review, focused correctness/visual cases and
   matched five-pair final production comparisons. Optimize further if results
   show new raster spikes or no material benefit. A renderer/asset rewrite is a
   later evidenced option, not an automatic parallel project.
5. Publish a qualified changed web build and one short same-maze physical
   comparison in the Human queue. Physical confirmation remains open until the
   affected devices are actually observed. Keep proceeding independently on
   evidence that does not require those devices.

## Acceptance

- Normal six-tile play has bounded moving surfaces independent of total maze
  size; theoretical RGBA backing estimates and actual lab layer bounds recorded.
  Repeated travel/resize/navigation must not retain growing caches or DOM trees.
- Continuous actor/camera/follower registration at fractional samples and all
  window rebases; exact engine state, input cadence, exploration and reward/save
  results unchanged. No visible seam, missing wall, ground gap or extra occlusion.
- Full visuals retained. Lite/Reduced/Static and explicit user choices remain
  authoritative. No user-agent/coarse-pointer guess silently removes walls or
  shadows; no unproven automatic downgrade is required for this slice.
- Existing Book, wall/sprite, jump, hazard and save regressions pass. Baseline and
  candidate route identity, version, hashes, viewport, DPR, CPU setting, browser,
  raw samples, median/worst and rejected runs remain reproducible.
- Aim for a material reduction in large-maze paint/raster work (initial target
  25%+) without worse input/frame tails; report measured results, not guarantees.
  Target physical steady travel near60fps with no recurring perceptible stutter.
  A lab pass cannot close the iPhone/iPad or minimum-RAM product claim.
- No new runtime assets/dependencies, save migration, gameplay change, deletion
  or archive. Any compressed bundle growth needs a reviewed explicit allocation.
  Preserve the Vercel guard; generated outputs go in the artifact ledger.

## Remaining questions and delivery boundary

Engineering will determine bounded promotion and map representation from current
measurements. Apple hardware/OS/browser versions and the same-maze changed-build
feel are nonblocking Human observations. Windows Application Control previously
blocked the installed Playwright WebKit DLL; do not bypass that security policy
or repeatedly reinstall it. Add a selectable WebKit harness where supported,
and label this machine's unavailable engine honestly. No Mac/Apple test result
is invented. LOOT-03 resumes after this movement correction, followed by the
preserved roadmap. Updated source/qualification receipts will own actual status.

## Delivered implementation and remaining physical decision

The final renderer eff0530 is [published as0.22.17](../reviews/2026-09-07-v02217-public-verification.md)
from release65acb82. Static/liquid separation
was required: windowing alone increased phone raster work in the rejected pilot.
The grouped map joins that renderer in the measured candidate; its isolated
contribution is not established by comparing pilots with different trace settings.
Intrinsic per-path map paint is required for SVG use instances, with actual
current/remembered/mystery pixel checks; the first CSS-based palette was rejected.

One ideal uncompressed RGBA backing has area ×4bytes. For a23×23 maze versus
a10×10 window at equal tile scale/DPR, its pixel area falls81.10%; for31×31 it
falls89.59%. That is a model per surface, not a measurement of resident Apple
RAM, exact compositor allocation, texture-cache release or total application memory.
Final Chromium layer dimensions and node counts are recorded separately in the
[qualification receipt](../reviews/2026-09-07-v02217-web-qualification.md).
The renderer retains full geometry in memory; it bounds painting, not the maze.

The final promotion controls reject removing caches. Small-maze summed content
rectangles increase58.57%/60.69%, but promoted17 reduces maze2 Raster work
58.66%/65.82% against16; removing all hints increases phone Raster138.23%.
Keep the measured cache policy, with no conditional device/RAM downgrade.
This explicitly accepts more small-maze layers for less repeated rendering;
actual Apple residency and feel remain unverified, rather than inferred from
overlapping rectangles or rounded JS heap. The independent review and raw
controls remain in the linked receipts.

The final report must distinguish five-pair frame observations, trace-work
proxies, separate layer inventory and sustained-route diagnostics. Main-thread
CPU throttling is not low RAM, a slower GPU or thermal emulation. If Q08 still
reports stutter, the next investigation is a Safari Web Inspector recording on
an affected device: layer repaint/allocation versus main-thread input/save work,
same maze/settings and OS. Only then select a further renderer/asset or input
change. Do not declare a minimum RAM spec or silently force Lite based on brand.

## LOOT-03 retained cold-opening follow-up

The [v18 qualification](../reviews/2026-09-07-v02218-web-qualification.md) compares
public17 and physical authored-loot18. Ordinary camera Raster is essentially
neutral. Both versions show one cold source-opening hitch in each CPU4 measured
loot run, with matching untraced worst66.7ms phone/83.3ms tablet;18 has added
claim/credit layout work and a worse traced tablet tail. Do not call this fixed
or attribute the full delay to RAM. Keep it separate from sustained camera travel.

Next bounded performance diagnosis, when selected or supported by Q08 feedback:
instrument keydown/engine, save validation/write, first Canvas allocation/draw,
layout and first presented movement frame on the same opening. Compare cold and
subsequent openings under identical settings; preserve the current baseline and
normal movement controls. Test a concrete isolated change only after locating
repeatable work. Do not preallocate a large idle Canvas or disable physical loot
speculatively. Q08 can additionally report whether opening Gold/Science visibly
pauses on the affected devices; this observation does not block enemy-table design.
