# HAZARD-03 candidate and cost decision trail

Astra, September7, PR7 on `codex/book-completion-hazard-refinement`.
Public remains0.22.15; candidate release label0.22.16 is not yet publication.
[Book/MOVE](2026-09-07-book03-move02-candidate.md) is included in this release slice.

The renderer restores.04tile clear floor and.03tile antialiased transition only
at ordinary-floor/liquid boundaries. One rounded union of all non-floor cells
prevents false safe strips at liquid/liquid, wall and pit interfaces. Each present
liquid clips two world-phase floor-pattern strokes. A separate shadow receiver
includes liquid, transition, lip and floor; wall footprints and pit voids remain
excluded. Wall geometry, lighting bearings, foreground/actor sizing and rules
are unchanged. No blur/morphology/cache surface is added.

Water has slow existing-texture current and broad subtle expanding ripples;
lava has slower molten current and warm local patches; poison has slow oily
current with the existing deterministic varied bubbles. Generic racing dashes
are removed. Two image instances wrap one existing texture period exactly.
The material offset advances20 times/second, at most.00375tile per update;
this is ambient sampling, not a change to actor/camera/frame timing. Lite freezes
it and omits FX; Reduced/Static freeze all ambient owners while retaining identity,
edges and shade. No dependency, source media, save migration, timer or gameplay RNG.

Independent actual Sol reviewed source and the first shape/phase/campaign packet.
Sol's material-interface concern was fixed with the common non-floor union.
Eight lights ×two themes ×three receiver fixtures and eight connected shapes
per material pass; four distinct sampled pattern phases return byte-exactly at
one full cycle. Ten initial browser cases cover those sheets plus all three
actual campaign hazards at780/1194 in Full/Lite/Static/Reduced. Two fixture-only
failures earlier sampled inside the unchanged physical wall footprint; corrected
sample points preserve wall exclusion, not a source geometry change. Final lean
source needs fresh phase/mode/campaign proof before acceptance.

Three serialized **one-pair pilots**, each with separate warmups, are diagnostic:

| Candidate | Phone / desktop RasterTask change versus15 | Decision |
| --- | --- | --- |
| Four-image diagonal drift, four border strokes |+27.34% /+41.30%|Rejected for optimization. |
| Two-image horizontal drift, two border strokes |+14.38% /+35.29%|Still too much desktop work; optimize cadence. |
| Same two-image/band source,20 ambient offsets/sec |+14.77% /+15.14%|Worth final five-pair review; not yet qualified. |

Every pilot measured max16.8ms with zero intervals over20/34ms. A steady frame
ceiling does not excuse rendering work. Early multi-change comparisons do not
attribute cost to individual operations; one pair does not establish stable
regression magnitude. Retain original reports/traces under performance folders
`hazard03-{idle,lean-idle,cadence-idle}-pilot-20260907`. Final frozen nonempty idle
and movement require five matched pairs at each viewport, actual Sol independent
recomputation, and explicit scoped acceptance. No physical iPad, WebKit, native,
low-end or thermal qualification is implied. Blocked WebKit tool remains held.

Pre-version combined build: gzip9 JS166074 (live15+172), CSS24074 (live15−142),
public155542751B unchanged. Astra admits200 JS bytes with rollback in the feature
ledger; the resulting ceiling is166257. Final bytes and release decision belong
in the qualification receipt. No new asset allocation or broad timing waiver.

Rollback the complete hazard seam to15 while retaining Book/MOVE and saves.
The existing Vercel guard remains untouched. Generated packets are logged for
Human cleanup review; no deletion/archive or repository/media clone.
