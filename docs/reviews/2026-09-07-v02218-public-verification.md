# v0.22.18 — published physical authored loot

Web release **54c286ac2dcc15590fb781a96e0d6ed2009fa78e**, reviewed checkpoint
82ee7e995682e160f098d3c1f9ea4a6e8f7612dc, frozen runtime
85f49eaf5c2e53d01491b6e7916b3c9bcc7e6523. [PR9](https://github.com/MachineKomi/maze-so-puzzle/pull/9)
merged after exact-head CI34087361117 passed Linux verify and Windows compilation.
The release tree equals the reviewed checkpoint; no extra runtime change.
Windows0.22.9 remains published and native0.22.10 separately held.

Actual [Sol review](2026-09-07-loot03-sol-final-review.md) and
[qualification](2026-09-07-v02218-web-qualification.md) accepted the scoped web
candidate before publication. One existing Git-integrated
[Vercel deployment](https://vercel.com/jasons-projects-6714ffa7/maze-so-puzzle/7hUUyZxaEPKczNd8a18fYGd8NFy8)
completed at05:38:37UTC. No manual duplicate, preview, guard change or override.

Both [canonical site](https://mazesopuzzle.com/) and
[retained alias](https://maze-so-puzzle.vercel.app/) return200 and exactly match
the frozen HTML/JavaScript/CSS bytes:

| Entry | Bytes | SHA-256 |
| --- | ---: | --- |
| index.html |1070|4ee341871fc70c35ddf22828dbb1e6aaedbc6a4dca34ef6cb7c77033f54b7b05|
| assets/index-BtYxUHKL.js |617473|ef2ed8b317d8aeb9d1f3a6423bb786e72c8dd70e09e8e9d851383486b38bf5bb|
| assets/index-BVffqDNp.css |120280|050565a839dbd47fb285909012a0e2b9a596bbc268f0a4f3b212204b6e501c7b|

`verify-web-release.mjs` passes six fresh isolated public journeys:

- Canonical780×312 and1280×720/DPR2: Play → Friends → Sound → Home → Begin →
  Start → ArrowUp → Sound → resume. Correct18version, Friends0/32, music65/SFX85,
  wall04c/hazard03 revisions, one step, exact stage fit and zero page errors.
- Canonical844×390/DPR3 and alias1080×810/DPR2: genuine v3 seed migrates to v4;
  maze2 moves four steps and reverses four, camera x5→1→5, y0, aligned bounded
  10×10 viewBoxes, steps16→24 and exact return. No Human save/profile is used.
- Each origin844×390/DPR3: authored Gold8 opens with0credited/four2-value bundles
  at150ms. After settling,4credited and two distant2-value bundles remain.
  Reload preserves the exact game/run and4+4 conservation; one actual approach
  raises credit to6 while the remaining2 stays grounded. No page errors.

Astra inspected the actual public phone loot image: settled Gold values remain
readable through the foreground-wall composition and the toast says scattered.
These isolated public checks verify behavior, not physical Apple frame timing.
All owned browsers/contexts are stopped.

Evidence: `C:/GameDev/maze-game-qa/performance/v02218-public-20260907/`, nine files,
15389358bytes. Receipt SHA-256
53c2434af4e3a68456200c828a7c3c09c7d85b17f3d45efeb69d988ef6e2979a.
Camera fixture SHA-256f16d2d2ea126c1c2a228f8bdf43d2c0efb2a0d396b484f164a4d9e6227f2c1b5;
loot fixture SHA-256c2f79b862c3afcc6ece19402a823d0d58b15eb0e9e420d66e90d88dd28365408.
The [artifact ledger](../LOCAL_ARTIFACT_LEDGER.md) records retained outputs;
no repository/media clone, native package, deletion or archive.

The public slice is authored Gold/Science physical collection and protected
migration. Power remains immediate-rule; enemy currency tables, mixed chests/
Mimics, rainbow account XP and eggs have not shipped. Follow B next: deterministic
enemy rewards, then chest/Mimic lifecycle, with A's value/save/capacity owners.
Corrective builds must retain v4 compatibility; no v3-only rollback or save reset.

Q05/P20 is now ready for loot feel. Q08/P19 remains the priority iPhone13/iPad8
camera check on18, including cold first reward opening. The paired reports
retain its common opening hitch and real added loot work; neither3GB comfort,
Apple/WebKit/native/thermal acceptance nor a minimum RAM threshold is established.
[Queue](../HUMAN_REVIEW_QUEUE.md), [cumulative playtests](../PLAYTEST_CHECKLIST.md),
[decisions](../HUMAN_DECISIONS.md).

Documentation closure must use actual successful54c286a as the guard baseline.
Record its actual ignored-build result separately; do not rebuild the game solely
to align documentation and release SHAs.
