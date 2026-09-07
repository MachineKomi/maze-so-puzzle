# Cold reward opening — bounded diagnosis

Active on `codex/cold-reward-performance` from3a01ad4. Live18 remains release54c286a,
runtime85f49ea. The retained hitch is distinct from sustained Apple camera travel;
Q08 remains actual device evidence. Astra writes runtime; actual Sol reviews.

The instrumented18→18 pilot `reward-cold-probe-v02218` uses the same verified
production bytes on both sides, one diagnostic pair plus warmups at844×390DPR3
and1080×810DPR2, CPU4. Wrappers perturb scheduling; these are phase diagnostics,
not qualification samples. Existing render traces and exact state endpoints stay.
The first reward Canvas bounds read costs13.8–17ms across the first inspected
contexts, first value strokeText6.8–10.1ms and first setTransform1.5–2.6ms. Storage
writes are0–.3ms, so storage-call latency does not explain this specific draw cost.
This does not measure all save validation/React/input work or rule out device I/O.

Sol independently found the larger first reward callback in every retained
measured18 trace versus17. The source/phase evidence supports a narrow initial
change: use the existing ResponsiveStage scale to size the Canvas instead of
forcing a scene layout through allocation-time getBoundingClientRect. Keep the
actual presented-Ame rectangle for immediate Power targeting. No large idle
Canvas, resolution reduction, delayed claims or v4/gameplay change.

## Candidate correction and measured tradeoffs

`reward-cold-stage-scale-probe` showed that scale reuse alone did not reduce the
roughly30ms first callback: layout work moved to the first font assignment.
`reward-cold-number-atlas-probe` then replaced physical-loot live text with one
shared720x128 digit atlas. Measured first callbacks were30.9→5.6ms phone and
32→5.3ms tablet. Power text/actual-Ame targeting remain unchanged. Main-Canvas
failure retains SVG; auxiliary-atlas failure retains original visible text.

The fresh-context `reward-cold-mount-probe` applies CPU4 before Continue, explicitly
tags detached atlas work, and records click→terrain DOM/second rAF. Baseline
second rAF323–337ms versus candidate355–371ms exposes roughly30–43ms added
maze-entry latency. Wrapped atlas construction10–11ms. This is a paint opportunity
proxy, not actual presented GPU pixels. The cache's ideal RGBA footprint is368640
bytes plus browser overhead, once per page. Empty ledger still leaves a1x1 main
reward Canvas and no reward rAF/timer, but auxiliary storage is not zero.
Measured opening intervals66.6/66.7→50ms in this pilot still show a residual hitch.
Do not describe phase wrappers or one-pair samples as final qualification.

New tests caught a resting-loot resize defect: a phone→tablet switch kept1044px
backing where852px was appropriate. A board ResizeObserver now wakes drawing
after layout updates the shared scene snapshot. Lifecycle cleanup disconnects it.
`reward-cold-browser-r3` passes5 new checks: DPR1/2/3 phone→tablet→phone, exact
grounded save conservation, no first physical-draw bounds/text calls, atlas-only
failure, all10 digit alpha bounds, composed2/10/99/123/456/789 at11/26/66px, and
rejected invalid draws. Original fallback images are retained for comparison.
The proportional outline is thinner at small sizes than the old fixed3px stroke;
actual phone images remain readable for Astra, with actual Sol review pending.

Candidate0.22.19 passes700 project tests, TypeScript/Vite and budget/contracts.
JSgzip9 is172375 (+372 over18); a named128-byte allowance supplements the prior
354-byte headroom, giving172485 ceiling. CSS/public/dependencies are unchanged.
This is explicit byte cost, not a performance or release waiver.

Next: frozen uninstrumented frame/work comparisons and full physical-loot/Power/
resize/camera browser checks, actual independent Sol review and exact-source CI.
Publication remains pending those results; live18 remains unchanged.
