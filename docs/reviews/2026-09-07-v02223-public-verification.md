# v0.22.23 — Adventure XP and scene depth, public verification

Published September7,2026. Release **c40527bf819a29a93e425df79f32b23b082202b7**,
reviewed **3b88332877b6ad64a15c459bd5d05681f5397a1c**, frozen runtime
**6ee51c4a3f1d6b18c39e309cea26111aff1e3df3**. The merge tree equals the reviewed
checkpoint. [PR14](https://github.com/MachineKomi/maze-so-puzzle/pull/14) merged
after exact-head [CI34133344035](https://github.com/MachineKomi/maze-so-puzzle/actions/runs/34133344035)
passed web verification and Windows compilation. Compilation is not native
acceptance; published Windows remains0.22.9, native0.22.10 separately unfinished.

[Actual independent Sol review](2026-09-07-xp23-sol-review.md) supports the bounded
web release. [Qualification](2026-09-07-xp23-scene-qualification.md) retains757
project tests,122 distinct browser contracts across120/122 plus a26/26 affected
follow-up, and four serial five-pair camera/enemy frame/work cohorts. This is
not one clean122-case run. No local untraced frame regression was observed;
measurable layer/style costs are disclosed in both independent records.

The existing Git-integrated [Vercel deployment](https://vercel.com/jasons-projects-6714ffa7/maze-so-puzzle/HfaHvTrmFeHxRCUnqASyXDVY4NTT)
succeeded at2026-09-07T14:33:44Z. No override, preview or duplicate manual build.
Both [canonical](https://mazesopuzzle.com/) and [alias](https://maze-so-puzzle.vercel.app/)
serve the exact qualified entries and new crystal:

| Entry | Bytes | SHA-256 |
| --- | ---: | --- |
| index.html |1070|da00e0a0c23a1712f3fb464d6c904fe76863d9d33c43a17b760175c300824b13|
| assets/index-CaFFna9M.js |637784|31293669817e69ab59f8987de38466a81edf491dab222ab41db47641e7843e7f|
| assets/index-BOn4b7Uu.css |122583|7fc186629601802ccbd3ba0474055be9f3a6d75175a0748a85a28a0c4656c27f|
| assets/adventure-xp-v1.png |12573|d1b2a5dbb8dac34682c71ff082850fb5333462defcbb4513e4081175fcd62f1f|

Runtime-input SHA-256:793236438ae68281d8ea50d8f6e4b0f59112e7c126d184c1e621d7b6faecdd2d.
Dist fingerprint:327e3474136558dab6c72cd9813b8de1fb3380afe3efa3974050470c31b38836.
No dependency or deployment-guard change. Public files grow by12573 bytes for
the original crystal derivative; exact source/prompt/provenance remain preserved.

## Published behavior

Two fresh phone/desktop standard journeys pass: Play, Friends0/32, Music65/SFX85,
Home/Begin/Start, movement and return from Sound. The game stage fits and retains
accepted walls04c-balanced-v2 and hazards03-living-connected. Both origins pass
an additional10 targeted journeys each: three door/Power depth cases, identical
weapon pickup/held scale, two camera-following jumps, two horizontal jumps at
departure/apex/landing, a physical light-floor XP crystal and the completed-run
Stay/re-win/Next/exactly-once banking/Book flow.

Astra inspected actual published phone door-opening and large horizontal-apex
images. Ame stays in front of opening doors; the proportional outlined Power
label remains above walls. Jumping Ame is above every wall, with the ground
effect below, and boots artwork is absent. These are controlled real-route
browser proofs, not physical-device or Human beauty acceptance.

Doors have taller natural proportions; every floor weapon matches its held
scale. Grounded objects/friends/Ame share contact-Y depth; foreground walls,
airborne poses and labels have explicit separate passes. Recognition XP scatters
only at final enemy/Mimic defeat, remains optional ground loot until collected,
and banks collected value plus solve10 once through Next. Book Stats shows saved
Adventure Level. Puzzle Power and accepted wall geometry are unchanged. Profile8/
run7 migration protects historical layouts, currencies and all v22 chest phases.

Fresh owned contexts never access the Human browser profile or saved adventure.
Both origins have identical game files but their browser saves remain origin-local.

## Evidence and limits

Public byte receipt at2026-09-07T14:33:58.150Z, SHA-256 **f9a4b226f5292dc06529772f6863fcf726220cb45cf3d01ae608cda17a300fad**.

- canonical10-case report: `544c88a82368da054841555a4368d2e282d5f8263ca48b64a95dfc8662108029`.
- alias10-case report: `4827815cf4811e4f7eca4e07f8434df3e6af724d0ec932ff2f8c7de585e18e87`.
- standard two-journey receipt: `44fb87518dc7cafdbfad6ae5d7887cf76d3aa52f9ce56012ddc7f4b02be0da46`.

Physical iPhone13/iPad8/3GB, WebKit/native, cold first-Power, long-session thermal
and actual allocated memory qualification remain open. This release does not
establish a minimum RAM threshold or Human crystal-art acceptance. Proper Gold/
Science/Power replacement sprites remain ART-REWARD-01. Next is protected usable
inventory before rare eggs; preserve the wider roadmap and nonblocking queues.

[Q09/P23 scene and XP playtest](../HUMAN_REVIEW_QUEUE.md),
[cumulative checklist](../PLAYTEST_CHECKLIST.md), [Human decisions](../HUMAN_DECISIONS.md).
[Artifact ledger](../LOCAL_ARTIFACT_LEDGER.md) records outputs; no deletion/archive.
The following docs-only closure will be checked from this actual successful
release baseline, without a replacement game build.


## Observed documentation closure

Documentation checkpoint **687ae8a0ab7e27ebeac9e3d0b07ba175b39e9a21** is backed
up on main and `codex/adventure-xp`. Before pushing, the unchanged guard compared
that entire range against actual successful release **c40527bf819a29a93e425df79f32b23b082202b7**
and returned0/SKIP for documentation-only inputs.497 changed-document relative
links passed; no runtime/build input changed.

Vercel's actual [documentation deployment status](https://vercel.com/jasons-projects-6714ffa7/maze-so-puzzle/Gxiqch3SSg7cnYZzYQH3Bn7ZeBZ9)
reported **Canceled by Ignored Build Step** at2026-09-07T14:37:59Z with GitHub
success status. This is a confirmed skip, not a failed runtime release. No
replacement game build, CLI deployment or force override was created.

This observed receipt is backed up on the Codex branch only for the next runtime
slice, avoiding another main push just to make a documentation SHA agree with
its own receipt. All owned local QA/public browser processes are stopped;
unowned PID26132/port4271 is preserved. No files deleted or archived.
