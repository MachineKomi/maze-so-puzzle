# LOOT-03B chest22 independent final review — Sol

Date: 2026-09-07  
Reviewer: Sol (GPT-5.6), independent read-only runtime reviewer  
Reviewed checkpoint: frozen runtime `e08775f47c57b6108d7365045a67f73165caa192` plus the three helper-only corrections described below  
Status: supports bounded web promotion from the reviewed evidence; physical Apple/native and retained cold-Power questions remain open

## Disposition

The authored-only slice is a coherent independently releasable part of LOOT-03B. Four existing authored Gold chests become guaranteed-good mixed chests. Twilight's existing required Power6 Candy encounter becomes one guaranteed Candy Mimic without moving it or changing the generated-maze family. This preserves the current campaign topology and avoids introducing an unreviewed generated policy.

I found no remaining gameplay, economy, save-model, art-activation, browser-behavior, bounded web-visual or measured web-performance blocker after the restart, maze-switch, receipt-transition and provenance corrections. The exact runtime passed CI run `34111918488`. The broad browser run passed 102 of 105 cases, including all 15 new chest cases. Its three failures were inherited helper assumptions rather than runtime failures; the separately corrected nine-case follow-up passed 9/9, covering the three corrected cases plus six repeated checks. This must not be reported as one 105/105 run.

The completed five-pair CPU4 comparisons support promotion of this authored-only slice for the bounded web scope. The new chest work has a small, measurable rendering and layout cost, but the untraced p95 remains at or below 16.8 ms, the untraced worst interval does not regress, and the ordinary-camera control remains close to neutral. This is a proportionate cost for the measured benign mixed-chest reveal and physical rewards. The Mimic battle has separate engine and browser coverage and was not the paired timing route. These results are not evidence about iPhone13, iPad8, native WebKit, thermal behavior or universal low-device performance.

## Gameplay and economy review

`src/game/chests.ts` owns a deterministic receipt derived from rules version2, run ID, level ID, stable object ID and an isolated channel. The receipt fixes family, outcome, Power and both reward amounts on first legal contact. `commitChest` now permits only an identical replay or the exact `revealed` to `defeated` transition; direct defeat and terminal-state regression throw. `sanitizeChests` reconstructs the expected receipt and rejects duplicated IDs, forged rewards, incompatible phases and unknown objects.

The four ordinary chests retain their former eight-Gold floor and add Science: Gold8–10 and Science2–4. The Power6 Candy Mimic yields Gold12–15 and Science7–9. Its minima exceed both ordinary-chest maxima and the same-band enemy maxima. Enemy reward randomness remains pinned to rules5; current authored content moves to rules6; generated revision2 deliberately continues to fingerprint rules5 and contains no generated chest or Mimic conversion.

The shared ledger assigns two namespaced channels to every chest. Capacity validation reserves unresolved treasure, enemy and chest channels before play. A resolved good chest or defeated Mimic creates both sources once, while a revealed Mimic creates none. Credited plus pending value remains equal to each deterministic receipt amount. No Mimic reward is available before final defeat and immediate combat Power remains an engine rule rather than an optional floor pickup.

Twilight's Candy is required by the existing route. The implementation therefore must retain the Plan09 exception rather than describe it as optional. The source tests exercise an all-friend/all-chest solution and inspect the pre-defeat state to show sufficient Power exists before the Mimic's own reward is created. Final qualification should retain the underpowered safe-return, equality, ordinary-route and all-rescue witnesses and the reported bounded solver state counts.

The economy audit separates historical and current authored definitions. The reviewed expected campaign envelope changes from Gold144–244 and Science85–138 to Gold154–263 and Science99–161. Those totals are supply bounds, not a spend economy or account progression system.

## Save and lifecycle review

Schema6 deliberately retains storage key `maze-so-puzzle-active-run-v5`. Older builds consequently encounter an unsupported future schema at their authoritative key and refuse routine writes. v2–v5 migration accepts only exact historical fingerprints. v5 authored runs bind to `LEGACY_CURATED_LEVELS`, preserve the old treasure and visible-Candy object graph, settle already accepted claims, and do not create retroactive chest receipts or rewards.

`App.tsx` now resolves a restored snapshot to its exact historical level instead of selecting the same-ID current level. Normal same-ID Book selection resumes that attempt. A confirmed restart or loss-modal restart uses the current curated definition for a new normal attempt, while tester and generated runs retain their own level definition. The browser fixture must continue to prove old fingerprint on resume and current fingerprint plus a fresh run ID after restart.

Maze-switch protection now includes committed chest receipts and pending loot as progress. This closes the stationary-interaction case in which an opened chest could otherwise be replaced without the normal leave-this-run decision.

Malformed and future authoritative records remain protected. A valid v5 record whose migration write is denied remains the sole durable copy and `clearActiveRun` refuses to erase it. A known obsolete record may still follow the established narrow discard policy. The updated-content check recognizes a permitted historical identity independently from game-data validity, so a malformed schema6 historical snapshot is protected rather than misclassified as obsolete.

## Asset activation review

The art authority is already complete and does not require a new selection decision:

- `docs/source-assets/calibrations/mgjrpg-02/v06/human-decision.json`, SHA-256 `0efe136020a5116ad7df79b042e60aba786dc2925122a0a55cf6fe3aebf11e48`, approved publication of the exact selected derivatives.
- `docs/user-playtests/2026-09-06-physical-loot-and-account-level.md` authorizes benign mixed chests and disguised Mimics as gameplay.

The forward activation correctly limits itself to `classic-mimic-closed`, `classic-mimic-good-open` and `candy-mimic-closed`. `classic-mimic-revealed` and `candy-mimic-good-open` remain dormant because this slice has no production consumer for them. The source records, existing runtime WebPs and historical Plan03 decision/map/report remain intact; only current lifecycle metadata, the generated projection, manifest and new `docs/source-assets/publication/loot03b-chest-activation.json` should change.

The activation helper now pins the mechanics authority at SHA-256 `ce2acd10f1e851b8246b63d7737cffc0f662327ca98d6bbd106784cae7eccdea`. Before changing status, it also verifies each generated-registry entry against the exact runtime path, source-record ID and derivative dimensions. A specific LF rule in `.gitattributes` preserves the cited mechanics record's bytes across Windows checkout. Its publish/check boundary is fail-closed for the reviewed three identities.

The deterministic workflow is:

```powershell
python scripts/art_pipeline/mgjrpg02_loot03b_activate.py --publish
python scripts/art_pipeline/mgjrpg02_loot03b_activate.py --check
npm run art:manifest -- --write
npm run art:check
```

The repository's locked art environment should own those commands on this host because bare `python` resolves to the Windows Store alias.

## Independent performance review

I recomputed all four raw reports. Each contains 24 rows: four separate warmups and five alternating measured baseline/candidate pairs for each of 844×390 at DPR3 and 1080×810 at DPR2. Every measured pair number 0–4 is present once per side and viewport. The reports bind to head `e08775f47c57b6108d7365045a67f73165caa192`; their current runtime-input SHA-256 is `6a0951aca1dee5d4d751462bd39d508412afc1a1139ffc7724cf3e06a4e2057b` and dist fingerprint is `4988442c954033d4a0bbab3459c17b363ad1f6421bec8d912bdd66de5ee239b3`, with both match flags true. Across measured rows I found no recorded page errors, broken images or terrain mutations.

The raw report hashes agree with the compact summary:

- chest frames: `3b6972aa907009ccd319bfe54594ea41ce547d225b63d3c2bbfa22f0944118f2`
- chest traced work: `ab214e8b7f52190c754774b2c6edbdca5c5c66de481018e348f3ce5d126f8165`
- camera frames: `ace1e92622fc020831586dae4400ba2ab78131a122c3d3b5a5e4a804c5f8a18d`
- camera traced work: `1fa89a71b7dad4d762c7e1963be72248e0df4de5dfcf6e2986fb7a0c14b43d93`

For the chest route, the ratio of median traced RasterTask totals is +3.223% on the phone profile and +4.144% on the tablet profile. Median Layout rises from 24.835 to 32.931 ms (+8.096 ms) and from 34.908 to 46.892 ms (+11.984 ms), respectively. Median Paint rises 8.302% and 5.550%, while UpdateLayoutTree falls 7.789% and 9.098%. These are route totals from trace-enabled runs and do not establish causal attribution to one renderer operation.

The untraced chest frame cohorts keep every row p95 at or below 16.8 ms. Phone worst improves from 66.6 to 50.0 ms; intervals over 20 ms change 6→7 and intervals over 34 ms 5→3. Tablet worst is 50.1 ms on both sides; intervals over 20 ms change 6→8 and intervals over 34 ms 5→1. A roughly 50 ms opening tail therefore remains, even though the severe-tail counts do not worsen. The separate traced tablet chest cohort contains one candidate 66.7 ms interval; it is retained as a limitation and is not substituted for the untraced frame authority.

The ordinary-camera control does not show a material regression. Untraced worst is 33.4 ms for both versions and profiles, every row p95 is at or below 16.8 ms, and neither side has an interval over 34 ms. Traced median RasterTask changes −1.464% on phone and +3.104% on tablet; median Layout changes by only +0.170 and +0.392 ms over the routes. These host results support the scoped web release but do not close the affected physical-device camera question.

## Browser-helper review

The three failures in the 105-case run exposed stale test construction or observation, and the scoped helper corrections retain the underlying behavioral assertions:

- `scripts/performance/enemy-loot.pw.ts` now constructs its v4 migration witness from `LEGACY_CURATED_LEVELS`, solves that historical graph and saves the actual historical fingerprint. Relabelling the current chest graph as v4 would correctly be rejected and was not a valid migration fixture.
- `scripts/performance/gameplay-browser.ts` now treats `.chest-presentation` and `chest-opened` as a blocking presentation beat. Route replay must not issue its next direction during the chest's input lock.
- `scripts/performance/reward-numbers.pw.ts` now opens a real guaranteed-good mixed chest, waits through its presentation and checks a multi-unit reward. The former remaining Gold source emitted unit drops, so it could not exercise count text or the atlas-failure fallback it claimed to test.

The follow-up passed all nine selected cases. This is evidence for the corrected helpers and repeated surrounding routes; it does not erase the original 102/105 result or widen the runtime scope.

## Fresh visual evidence and remaining qualification

I independently inspected the original four 844px pilot captures and the frozen final packet under `C:/GameDev/maze-game-qa/performance/chest22-browser-final/chests`. The final inspection covered guaranteed-good and Mimic open/settled states at 844, 1080 and 1440 pixels, plus 844px Full, Lite, Static and Reduced presentations.

The Classic closed/open transition reads as a benign chest. The Candy reveal is unmistakable, its Power6 label is readable, and Gold and Science remain distinguishable after settlement. At all three final sizes, the Mimic's settled value labels are fully inside the board and do not collide with Ame or the foreground wall; the 844px comfort-mode captures preserve the same outcome and currency meaning. The activated art is visually consistent with the current maze presentation in these controlled Chromium captures.

The final JSON packet records no page errors for the rendered mode/viewport cases. Its legacy Twilight case restores the schema5 run with the same run ID, revision4 fingerprint and empty chest receipts, then restarts with a fresh run ID and the current revision5 fingerprint. This is actual final-browser evidence for the historical-resume/current-restart boundary rather than an inference from source.

The inspected images and paired reports establish bounded Chromium presentation and performance on this host, not physical Apple or Human visual acceptance. Any release statement must keep physical iPhone13/iPad8 camera acceptance, cold cosmetic Power behavior, XP, eggs, generated Mimics and the wider Plan09 campaign open.
