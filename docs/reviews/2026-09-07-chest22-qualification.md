# LOOT-03B / v0.22.22 qualification

Frozen runtime checkpoint **e08775f47c57b6108d7365045a67f73165caa192**,
branch `codex/chest-mimic-rewards`, [PR13](https://github.com/MachineKomi/maze-so-puzzle/pull/13).
Now [published as web0.22.22](2026-09-07-v02222-public-verification.md). Astra is the sole runtime
writer; [actual Sol review](2026-09-07-chest22-sol-review.md) owns the independent
disposition. [Execution contract](../plans/LOOT-03B-authored-chests-and-mimics.md).

## Delivered candidate scope

Four existing authored Gold chests become guaranteed-good mixed chests, retaining
their eight-Gold floor: Gold8–10 and Science2–4. Twilight's existing required
Power6 Candy encounter becomes a disguised chest with a separate safe reveal
and final-defeat rewards of Gold12–15 and Science7–9. Opening holds movement;
continuing or fighting requires a fresh press. The one-second reveal is finite,
uses the existing presentation owner and respects comfort modes.

The engine commits deterministic immutable receipts and exactly two conserved
ledger channels. Revealing a Mimic awards nothing; its final defeat awards
Power once and scatters both currencies. Rewards use existing bounce, settle,
finite legal vacuum and persistent pending-value behavior. There is no new
continuous clock. Book stays12; closed Candy does not reveal its identity early.

Schema6 keeps the authoritative active-run-v5 storage key and protects future,
malformed and denied-write records. Valid old v5 attempts retain exact historical
layouts and fingerprints, without retroactive Science or Mimic rewards. An
explicit restart uses the new authored layout. Generated revision2/rules5 and
ordinary enemy reward rules5 remain pinned; generated Mimics need their later
versioned Plan09 tranche.

Three already approved art states become current-level-only active entries.
The forward activation checks exact approval, mechanics, source, runtime and
registry identities. No pixels, historical publication decisions or media bytes
change. Active encoded inventory rises165234 bytes, with786432 theoretical RGBA
bytes before browser overhead; these are previously dormant files, not new
public downloads or measured RAM. Other unobtainable variants stay dormant.

## Source, economy and compatibility evidence

747 tests in76 files pass, with TypeScript/Vite build and performance byte contracts passing.
The locked art environment passes manifest/check validation. Exact runtime CI
[34111918488](https://github.com/MachineKomi/maze-so-puzzle/actions/runs/34111918488)
passes; final reviewed-head CI remains a separate release requirement.

Engine proofs cover good opening without a sword, underpowered safe return and
equal-Power defeat, immutable receipts, forged/duplicate rejection, source
conservation, joint allowed outcomes, capacity and ordinary/all-rescue/all-chest
routes. Save proofs cover all16 historical authored graphs, old resolved rewards,
all receipt phases, denied migration writes and future/malformed protection.

All four affected mazes have all-rescue/all-chest solutions, at most113806
admitted solver states. Twilight's encounter is required under Plan09's explicit
designer policy; replay proves enough Power before its own reward. Ordinary/
perfect input counts are Lanternlight151/208, Twilight208/214, Moonlit165/170 and
Rainbow Power Parade63/76. Terrain and movement counts are unchanged; opening
adds stationary inputs. All-loot campaign supply changes Gold144–244→154–263 and
Science85–138→99–161. These are available supply envelopes, not banked or spend
economy promises.

JSgzip9 is176618 bytes (+2607 versus21), CSSgzip9 is24296 (+105), within the
explicit178269/31622 budgets. Public runtime bytes remain155542751. No dependency
or public media file was added.

Runtime-input SHA-256: **6a0951aca1dee5d4d751462bd39d508412afc1a1139ffc7724cf3e06a4e2057b**.
Dist fingerprint: **4988442c954033d4a0bbab3459c17b363ad1f6421bec8d912bdd66de5ee239b3**.
The build marker names pre-commit ae94630; actual fingerprints match frozen e08775f.

## Browser qualification

The105-case browser matrix passed102 and exposed three stale inherited helpers.
The9-case corrected follow-up passes: the three failed cases plus six repeated
checks. Together they cover105 distinct contracts, not one105-pass run. No
runtime changed between these packets. The two-case pilot is retained separately.

The v4 migration fixture previously labelled today's chest graph as historical;
it now replays the actual legacy graph and retains distant treasure while retiring
past enemies. The route replayer now observes and waits for chest-opened as a
blocking presentation before pressing again. The count fallback route previously
selected the earliest remaining Gold3 with only unit drops, which never needed
text; it now opens the real mixed chest and proves numbered-drop fallback.

All15 new chest cases pass: good/revealed across Full phone/tablet/desktop,
Lite/Static/Reduced phone; held opening and fresh-press combat, exact rewards,
reload conservation, interruption during either reveal, and genuine old Twilight
resume followed by new-layout restart. The wider matrix covers Book/completion,
ordinary movement/cancellation, followers, camera/rebase/jump, enemy and authored
loot, saturated admission, reward backing resize and digit bounds. Underpowered
safe-return/equality is an engine proof; the browser Mimic fixture arrives with
sufficient Power. It must not be described as a browser underpower journey.

Astra and actual Sol independently inspected final phone/tablet/desktop chest
and settled-loot captures. Sol found no bounded visual blocker and confirmed
that the formerly near-edge Mimic reward labels remain inside the board.

## Paired performance

Four serial five-pair cohorts compare frozen published21 with e08775f: ordinary
camera and the real authored chest slot, each with separate untraced timing and
traced work. Each report has24 contexts: four warmups and five measured pairs
per profile, CPU4,844x390/DPR3 and1080x810/DPR2, with500ms entry settle. All bind
matching runtime/dist fingerprints with no page errors, broken images, terrain
mutations or mismatched routes. No competing owned browser job or runtime edit
occurred during measurement.

Chest comparison uses the exact historical/current graphs from the same legal
prefix. Baseline walks over8Gold; candidate opens mixed Gold/Science before
entering. Both travel two steps and return to the same position/Power. The new
stationary opening input and beat are explicit feature cost, not identical
interactions. All source values remain conserved. The camera route is unchanged.

Untraced p95 stays at most16.8ms. Ordinary camera has no frames above34ms;
chest rewards still have occasional roughly50ms hitches. No cold-start or broad
performance improvement is claimed.

| Route / width | Max median21→22 ms | Worst21→22 ms | >20ms counts21→22 | >34ms counts21→22 |
| --- | ---: | ---: | ---: | ---: |
| Chest844 |50.00→50.00|66.60→50.00|6→7|5→3|
| Chest1080 |50.00→33.40|50.10→50.10|6→8|5→1|
| Camera844 |33.30→33.40|33.40→33.40|7→8|0→0|
| Camera1080 |33.40→33.30|33.40→33.40|7→6|0→0|

Separate traced medians below are milliseconds per route. Categories overlap
and cannot be added as total CPU/GPU cost. Chest raster grows3.22%/4.14%, with
layout+8.10/+11.98ms for the added opening and second currency. Camera raster
changes−1.46%/+3.10%; timing remains neutral in the untraced authority. The
traced candidate tablet chest has a66.7ms outlier, retained separately.

| Route / width | Paint21→22 | Raster21→22 | Layout21→22 | Style21→22 |
| --- | ---: | ---: | ---: | ---: |
| Chest844 |137.31→148.71|460.10→474.93|24.84→32.93|258.36→238.23|
| Chest1080 |139.73→147.48|643.40→670.07|34.91→46.89|254.96→231.76|
| Camera844 |200.17→196.84|771.06→759.77|102.45→102.62|369.36→375.90|
| Camera1080 |218.94→217.87|1010.10→1041.46|153.36→153.76|323.75→339.34|

Raw report SHA-256 under external `performance/chest22-*`:

- chest-frames:3b6972aa907009ccd319bfe54594ea41ce547d225b63d3c2bbfa22f0944118f2
- chest-work:ab214e8b7f52190c754774b2c6edbdca5c5c66de481018e348f3ce5d126f8165
- camera-frames:ace1e92622fc020831586dae4400ba2ab78131a122c3d3b5a5e4a804c5f8a18d
- camera-work:1fa89a71b7dad4d762c7e1963be72248e0df4de5dfcf6e2986fb7a0c14b43d93

`chest22-summary/paired-summary.json` and `integrity.json` retain reproducible
aggregates and final identities. Sol independently recomputed the raw reports and
supports bounded web promotion of frozen e08775f, with all measured costs and
device limits retained. The linked review owns that actual disposition. Final
reviewed df33b62 passed exact-head CI34114218300; the linked public receipt
confirms release c5f2305 and matching published bytes.

The inherited immediate-entry Power cosmetic expiry and physical iPhone13/iPad8
camera observation remain open. Chromium CPU4 evidence cannot establish Apple,
WebKit, low-memory or thermal acceptance. Published Windows remains0.22.9;
native0.22.10 qualification is separate, and CI compilation is not native release
acceptance.

Evidence is recorded in the [artifact ledger](../LOCAL_ARTIFACT_LEDGER.md).
The [feedback reconciliation](2026-09-07-playtest-feedback-reconciliation-v21.md)
preserves connected hole art, icon-led pace and hazard contact effects. Proper
generated reward artwork, recognition-only XP and protected usable inventory
before eggs remain open, along with DELIGHT/LEARN and campaign/Garden/co-op.
