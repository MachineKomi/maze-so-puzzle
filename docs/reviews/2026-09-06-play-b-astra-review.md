# PLAY-B — Astra independent candidate review

Date: 2026-09-06. Actual GPT-5.6 Sol implements the isolated
`codex/v22-play-b` candidate; Astra owns independent review and any release.
This record is not physical-device acceptance or a publication receipt.

## Inspected candidate and decision

Initial committed candidate: `e0cdd77100ab34048ccc8e08f0e01452e5dd1903`,
based on `c77e7d7e428e1db17ef4fd223cfc9c5614bbe638` (v0.22.3 runtime).
Final handback and publication remain pending at this review checkpoint.

Astra inspected engine contact/pit semantics, App presentation/follower binding,
the follower trail, exact solver and positions-only reachability, save/navigation
guards, rules fingerprints, metrics and the associated tests. A delegated Astra
read-only reviewer separately checked saves/progress; that is not a second Sol
review. No additional content or visual redesign is authorized.

The intended behavior is correct in this candidate: adjacent rescue commits one
rescued ID at unchanged player origin/steps; the new follower waits at the cage
under the reveal and joins on the next actual move. Existing follower slots are
retained. Hole landings on unresolved cages fail truthfully without a remote
rescue or synthetic jump. Loose pickups remain walk-over interactions.

## Review corrections and evidence boundaries

1. **Bounded reachability work — corrected before e0cdd77.** The first draft
   counted only currently non-dominated signatures against its state cap, letting
   previously admitted work disappear from the budget. Astra requested monotonic
   admitted-state accounting and an engine-transition cap, including rescue
   normalization. The corrected code counts dominated states and every engine
   transition, with unchanged 100,000-state / 400,000-transition defaults. Low-
   limit and dominance-churn tests cover the seam. Exact path solving still uses
   real rescue-then-entry transitions; the positions-only dominance helper is
   not a claim about shortest routes or iPad performance.
2. **Legacy-v1 rule identity — bounded correction requested.** e0cdd77's old
   v1 migrator could stamp a hypothetical revision-1 level with the current rules
   fingerprint despite having no original fingerprint to compare. None of the
   current sixteen mazes is revision 1, so current published campaign saves are
   protected; nevertheless this weakens the global compatibility contract.
   Astra requested that recognized v1 runs fail closed with updated-maze copy,
   preserving durable progress and valid fingerprint-matched v2/v3 migration.
   Final corrected code/tests must be reviewed before acceptance.
3. **Metrics documentation — reconciliation requested.** Routes now distinguish
   directional inputs from movement steps. The measured before/after table is
   retained, but a few current per-level narrative costs still used older values;
   Sol is reconciling those against the already measured report.

Sol reported 533/533 project tests and 19/19 focused browser checks at the initial
candidate. The full serial input suite, requested migration corrections and
final evidence are still pending; do not promote those partial counts into a
nonexistent final all-pass run. Final source and report hashes belong below.

## Compatibility, cost and release conditions

Rules revision 2 changes **all sixteen authored fingerprints**, plus generated
content identity. A v0.22.3 unfinished authored run therefore restarts through the
existing updated-maze notice. Durable completions/unlocks/rewards remain intact;
previous best results are earlier-layout history, not erased or re-awarded.
Generated runs were already intentionally non-persistent. Do not promise old
active-run continuity or imply that every conceivable player route was tested.

Initial source-matched frozen v0.22.3 versus e0cdd77: JavaScript gzip9
154,875 to 155,140 (+265); CSS 23,563 to 23,563; runtime public 165,031,011 bytes
unchanged; decoded image upper bound 411,582,176 unchanged; dependencies unchanged.
Approved cap remains +900 gzip9 JS / zero other growth, with final actual delta
allocated rather than the whole cap. Earlier 23,512-byte CSS wording is not the
source-matched frozen b834a8e artifact and is not the comparison authority.

After clean final handback, Astra will integrate only reviewed source/doc changes,
freeze v0.22.4, verify production and actual Windows rescue/save/reopen behavior,
and publish immutable artifacts if those checks pass. Current playable v0.22.3
remains rollback authority. Camera smoothness, phone layout, physical listening,
native Title Exit, signing/installers and sustained low-end qualification stay
separate; neither a solver pass nor desktop browser frames closes them.

[Playtest checklist](../PLAYTEST_CHECKLIST.md) · [Human decisions](../HUMAN_DECISIONS.md).
