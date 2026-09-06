# V22-PLAY-01 PLAY-B — Sol stationary-rescue candidate

Date: 2026-09-06. Baseline: released v0.22.3 source
`c77e7d7e428e1db17ef4fd223cfc9c5614bbe638` (runtime freeze
`b834a8e6775ec024fc9f854c7a7ced8c096b6627`). Runtime core checkpoint:
`e0cdd77100ab34048ccc8e08f0e01452e5dd1903`. Final candidate checkpoint:
`[FINAL_CANDIDATE_COMMIT]`. Status: complete engineering candidate for
independent Astra review; not merged, versioned, released or family/device
accepted.

## Implemented contract

- Direct contact with an unresolved cage changes rescue state without moving
  Ame or incrementing movement steps. A second deliberate input may enter the
  released tile. Turning away immediately preserves the committed rescue.
- A hole jump whose landing is an unresolved cage is blocked with the truthful
  `caged-friend` reason and no jump, rescue or movement event. Resolved landings
  keep the existing jump rule. All sixteen authored mazes retain at least one
  legal adjacent approach; no content was rewritten.
- The rescued friend reveals at the cage anchor, then joins Ame's previous trail
  point on the next movement. Existing followers keep their procession; reload
  uses the established gathered fallback rather than persisting cosmetic trail.
- Rescue final unlock remains 900 ms in Full/Lite and 180 ms in
  Reduced/Static. Only a later accepted movement uses the selected
  320/200/120 ms pace. Held, released and cancelled inputs do not replay through
  the presentation.
- Solver signatures include rescue state for ordinary and perfect traversal.
  Position reachability uses canonical adjacent-rescue closure and
  rescue-superset dominance only because rescue has no negative traversal
  effect; it does not claim shortest-route preservation.
- Route reports distinguish physical inputs from movement steps. Save
  plausibility retains the admitted portal/hole stride envelope, resource
  identities and capability gates while allowing genuine stationary state
  changes. A zero-step rescued run is protected from silent maze replacement.
- Global gameplay-rules revision 2 is fingerprinted. All older active runs fail
  closed through the existing updated-maze notice; durable Book progress,
  unlocks, rewards, discoveries and historical results remain. Schema-v1 runs
  also fail closed for every recognized story maze because they contain no
  rules fingerprint; matching v2/v3 fingerprints retain their existing path.

No camera, audio, UI redesign, art, CSS, asset, dependency, save-schema,
version, package or release change is included.

## Search-budget correction retained for review

The first reachability draft bounded only the retained non-dominated signature
set. Dominated signatures could be removed while admitted queue work continued,
silently weakening the old numeric state limit and making `visitedStates`
untruthful. That draft was not qualified or promoted.

The corrected source charges every newly admitted signature monotonically and
reports that count as `visitedStates`. It also counts every engine transition,
including rescue-normalization work, and caps transitions at four times the
unchanged state limit. Low-limit and dominance-churn regressions prove both
bounds. This preserves an explicit total-work limit rather than treating the
smaller retained frontier as completed work.

## Authored route results

Values are engine-derived at the candidate rules fingerprint. `Inputs` includes
stationary interactions; `movement` counts only state transitions where Ame
moved.

| Maze | Ordinary inputs | Perfect inputs | Ordinary movement | Perfect movement |
| ---: | ---: | ---: | ---: | ---: |
| 1 | 6 | 7 | 6 | 6 |
| 2 | 38 | 52 | 36 | 48 |
| 3 | 65 | 80 | 62 | 74 |
| 4 | 82 | 91 | 78 | 84 |
| 5 | 71 | 78 | 66 | 70 |
| 6 | 95 | 108 | 90 | 100 |
| 7 | 120 | 150 | 114 | 140 |
| 8 | 123 | 140 | 116 | 130 |
| 9 | 182 | 195 | 179 | 189 |
| 10 | 150 | 206 | 146 | 198 |
| 11 | 204 | 210 | 197 | 199 |
| 12 | 164 | 169 | 158 | 158 |
| 13 | 29 | 44 | 28 | 40 |
| 14 | 104 | 176 | 100 | 168 |
| 15 | 47 | 58 | 44 | 50 |
| 16 | 62 | 75 | 54 | 62 |

The gameplay-spec historical comparison remains labelled as history; current
cost prose was reconciled to these input/movement values.

## Static cost and allocation

The exact released v0.22.3 gzip-9 baseline is the accepted release/ledger value.
The candidate was rebuilt from locked dependencies and measured with matching
runtime-input and dist fingerprints.

| Metric | v0.22.3 | Candidate | Delta | Authorized maximum |
| --- | ---: | ---: | ---: | ---: |
| JavaScript gzip-9 | 154,875 | 155,090 | +215 | +900 |
| CSS gzip-9 | 23,563 | 23,563 | 0 | 0 |
| Runtime public delivery | 165,031,011 | 165,031,011 | 0 | 0 |
| Runtime asset files | 164,967,097 | 164,967,097 | 0 | 0 |
| Decoded-image inventory upper bound | 411,582,176 | 411,582,176 | 0 | 0 |

Ledger entry `gameplay-v22-play01b-stationary-rescue` records only +215 bytes,
not the unused authorization. The earlier 23,512 CSS figure belonged to an older
pre-audio measurement; the source-matched released baseline and candidate CSS
are byte-identical at 116,346 raw / 23,563 gzip-9 with SHA-256
`1f23b663b12699e2b878cb363d885e5b7702a4393fc9f7ce305371026f0202bc`.
`npm ci` installed the committed lock set (55 packages, zero vulnerabilities);
no package or lockfile content changed. Checkout-specific lockfile line endings
are not a runtime dependency change.

Final clean inventory: `[FINAL_INVENTORY_PATH]`, SHA-256
`[FINAL_INVENTORY_SHA256]`; runtime-input SHA-256
`[FINAL_RUNTIME_INPUT_SHA256]`, dist fingerprint SHA-256
`[FINAL_DIST_FINGERPRINT_SHA256]`.

## Verification

- Complete final project Vitest: 533/533 across 50 files. The post-audit
  schema-v1 helper check separately passed 23/23 before the final build.
- Bounded authored/generated audit: 102/102. It covers all sixteen authored
  ordinary/perfect graphs under the unchanged 100,000-state/400,000-transition
  bounds, representative generation, portal statistics, hints, metrics,
  documentation consistency and the largest supported generated maze. No cage
  lacked a legal adjacent approach.
- Focused engine/follower/session/traversal qualification: 86/86. Save
  round-trips cover every authored ordinary/perfect endpoint and selected
  interaction intermediates, including the committed rescue before its overlay
  finishes and turning away after release.
- TypeScript and production build pass. The existing Vite 500 kB advisory is
  unchanged. Build provenance reports exact runtime-input and dist matches.
- Focused production-browser rescue matrix: 19/19 in 43.4 s. It covers
  keyboard, fixed pad and board drag hold/steer/release; 900/180 ms Full, Lite,
  Reduced and Static unlocks; hidden cancellation; and actor/follower geometry.
- Full existing production-browser suite: 95 passed, 3 intentionally skipped,
  0 unexpected in 4.8 min. The skips are the three combined
  `hole-jumped + door-opened`, `hole-jumped + enemy-defeated` and
  `hole-jumped + animal-rescued` cases: no current authored perfect-route prefix
  contains those combined transitions, and the suite deliberately refuses a
  synthetic save substitute.
- Final source save/lifecycle browser checks: 2/2. Visibility cancellation
  leaves the committed rescue with no replay; a fresh page reload reads the
  zero-step rescue, shows it as the active run, guards a different-maze choice,
  and resumes the exact engine state.
- Art/tooling/manifest inputs are unchanged. This candidate inherits the
  v0.22.3 136/136 art qualification; no new art run is claimed.

External browser evidence is outside runtime delivery:

| Evidence | Bytes | SHA-256 |
| --- | ---: | --- |
| `play-b-candidate-r1/playwright-results.json` | 32,083 | `1e96abf67ae8e90c7484badca77dd1119d8459974906f7d83e3973c1935a5e90` |
| `play-b-candidate-full-r1/playwright-results.json` | 163,376 | `fc7586992c8f56df9440e339cfcca2523ba6d9fa44fba9c394801f097e3e19b0` |
| `play-b-candidate-save-final/playwright-results.json` | 5,308 | `049d82907564d0e7813370e067e39efd638618d5fa67673eb06ccaea4fe78218` |

The first browser command failed before starting a browser because Node on
Windows rejected a drive-letter `--import` URL. The retained invocation uses
the same external loader as a canonical `file:///` URL; this was tool setup, not
a product failure or repository dependency change. The reachability draft issue
and correction are retained above rather than hidden by the final green counts.

## Limits, gates and rollback

This evidence establishes deterministic engine, traversal, persistence,
presentation lifecycle and desktop-browser geometry behavior. It does not claim
affected-iPad performance, comfort or family acceptance. The candidate remains
at version 0.22.3; Astra owns independent review, any v0.22.4 freeze, native
qualification and publication.

Rollback is the complete PLAY-B runtime/tests/spec seam to
`c77e7d7e428e1db17ef4fd223cfc9c5614bbe638`. Preserve released Tessera,
PLAY-A, AUDIO-01V, approved assets and durable schema-6 campaign data. Never
roll back only the rules fingerprint, save reader or route metrics while keeping
stationary rescue semantics.
