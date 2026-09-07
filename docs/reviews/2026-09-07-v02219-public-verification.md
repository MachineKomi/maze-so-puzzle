# v0.22.19 — published reward-response correction

Web release **28842506f2b6b690e9bd7fc0f18c12957029de98**, reviewed checkpoint
4991f93d0d2e9477f459a222e4093225968cb3f6, frozen runtime
d4720370a7e6d6407f35e5c5188e86817e71259c. [PR10](https://github.com/MachineKomi/maze-so-puzzle/pull/10)
merged after exact-head CI34092206239 passed verify and Windows compilation.
The release tree equals the reviewed tree. Windows0.22.9 remains published;
native0.22.10 qualification stays separate.

[Astra qualification](2026-09-07-v02219-web-qualification.md) and
[actual independent Sol review](2026-09-07-cold-reward-sol-final-review.md)
accepted the limited web trade before publication. One Git-integrated
[Vercel deployment](https://vercel.com/jasons-projects-6714ffa7/maze-so-puzzle/Chr5tpmTabzcxYuiqPEHBs5xogij)
completed06:47:26UTC. No duplicate/manual deployment or guard override.

Both [canonical site](https://mazesopuzzle.com/) and
[retained alias](https://maze-so-puzzle.vercel.app/) return200 and exactly match:

| Entry | Bytes | SHA-256 |
| --- | ---: | --- |
| index.html |1070|c3b4fe59a7757e13533aee6d44b435b57e01f60f587e16159ce0fd2da95e3daf|
| assets/index-CSATG8jl.js |618310|2db1f61dc2dc9b08b5ea6e879e9e0c79e8cfdf5dda7688f4a67fe4bec2029aa3|
| assets/index-BVffqDNp.css |120280|050565a839dbd47fb285909012a0e2b9a596bbc268f0a4f3b212204b6e501c7b|

`verify-web-release.mjs` passes six fresh owned public journeys:

- Canonical780x312/1280x720 DPR2: Play, Friends, Sound, Home, Begin, Start,
  ArrowUp, Sound, resume. Correct19 version, Friends0/32, music65/SFX85,
  wall04c/hazard03, one step, stage fit and no page errors.
- Canonical844x390 DPR3/alias1080x810 DPR2: genuine v3 fixture migrates to v4;
  maze2 travels four steps/reverses four, aligned bounded world, exact return.
- Both origins844x390 DPR3: Gold8 opens with zero early credit, visible2-value
  bundles,4 credited/two distant bundles after settling; reload preserves the
  run and grounded value, then a real approach credits6 with2 still grounded.

Astra inspected the actual public phone loot image: counts remain centered and
readable across the foreground-wall composition. This verifies public behavior,
not affected-device frame performance. All owned contexts/browsers are stopped;
no Human browser profile or adventure was touched.

External packet `C:/GameDev/maze-game-qa/performance/v02219-public-20260907/`:
nine files /15391066bytes. Receipt time06:48:27UTC; SHA-256
f9cee5e69d2faabb797aafc5aa24ee8e606e7d9cbc0132230712aa5b9bad0083.
Camera fixturef16d2d2ea126c1c2a228f8bdf43d2c0efb2a0d396b484f164a4d9e6227f2c1b5;
loot fixturec2f79b862c3afcc6ece19402a823d0d58b15eb0e9e420d66e90d88dd28365408.
[Artifact ledger](../LOCAL_ARTIFACT_LEDGER.md): no repository/media copy, native
package, deletion or archive.

This release reduces first-loot draw work and fixes resting-loot resize; it does
not remove the remaining50ms CPU4 opening interval. Entry is slightly slower,
including the retained313.7ms tablet mount outlier, and the digit cache adds
368640 ideal RGBA bytes plus browser overhead. Ordinary camera tails are neutral
on the measured host. No net cold-start speed, Apple/3GB/WebKit/native or Human
feel acceptance is claimed. Q08/P19 now covers entry/camera/first opening on19;
Q05/P20 retains loot feel. [Queue](../HUMAN_REVIEW_QUEUE.md),
[cumulative playtests](../PLAYTEST_CHECKLIST.md), [decisions](../HUMAN_DECISIONS.md).

Next: LOOT-03 B enemy reward tables/campaign-total audit, then mixed chests/Mimics,
recognition XP and usable inventory before eggs. Preserve v4 migration/claims/
receipts, CAMERA-17 and the wider roadmap. Device observations do not block B.

Docs closure uses actual successful2884250 as the unchanged guard's baseline.
Record the observed ignored-build outcome separately; no replacement game build
is required solely to align documentation and release SHAs.

## Observed documentation closure

Documentation checkpoint **ba3320839595f7cfd6f6af4a105a21ed0aaeeff4** is backed
up on main and the current Codex branch. All15 changed paths are Markdown;
444 local links resolve and the whitespace check passes. The unchanged guard
returns0/SKIP against actual successful2884250 and the exact docs HEAD.

Vercel actually reported **Canceled by Ignored Build Step** at06:54:50UTC:
[deployment record](https://vercel.com/jasons-projects-6714ffa7/maze-so-puzzle/4ZifQi4dn7vPMjgR2BpfMscXQiFu).
This is an observed remote skip, not only a local prediction. Public runtime
remains2884250/d472037. This observation is backed up only on the existing Codex
branch for the next runtime slice, avoiding a recursive main docs/build loop.
