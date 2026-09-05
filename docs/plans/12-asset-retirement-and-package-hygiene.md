# Plan 12 — asset retirement and package hygiene

Status: pending after accepted Plan 13 consumer freeze. Prepared 2026-09-05.
Owner: root release manager. Human external-backup confirmation is mandatory.

## Outcome and authority

Deliver only the media the finished game needs while preserving every required
source, approved decision and recovery path. Read the roadmap, Plan 13 closure,
final content-use report, performance inventories, current art/source catalogues,
`../source-assets/retirement/README.md` and its ledger/schema completely.
Historical counts and apparent filename age do not prove retirement eligibility.

Include UI-02's selected Book/card renditions, final bestiary/Mimic entry aliases,
PT39's six-art review dispositions and any Human-approved PT41 additions in the
consumer join. An undiscovered entry is an on-demand consumer, not proof its
approved art is unused. Keep historical role/source dependencies distinct from
active preload intent; a new revision does not waive rollback provenance.

No new artwork or gameplay is in scope. This plan does not authorize removing
masters, exact prompts, rights/provenance, proof sheets, Git history or sole
surviving copies. Only individually evidenced delivery copies are candidates.

## Stage A — classify and copy, retaining repository files

1. Start from the accepted consumer-freeze SHA. Rebuild actual reachability from
   typed catalogues, generated recipes, CSS, story, UI details, fallback paths,
   animation, preload helpers, tester fixtures, app icons and Tauri packaging.
   Check processor/source reconstruction dependencies as well as live requests.
2. Join every candidate to its replacement, rollback obligations, exact bytes/
   hash, lifecycle, approved reservations and consumer evidence. Verify the
   declared rollback window has expired. A file required by a fallback or
   reconstruction tool is still reachable until that dependency is resolved.
3. An approved asset missing its promised consumer returns to Plan 09/13 or an
   explicit Human defer gate. New exclusions cannot be invented to improve size.
4. Resolve and verify the absolute archive path stays within the intended
   non-runtime archive root, outside `public`, `dist` and all package inputs.
   Ensure it is ignored. Copy each eligible file to a new immutable batch;
   preserve its original relative path, byte count and SHA-256 in an index and
   checksum file. Do not move or delete the original.
5. Validate each copy and perform a restore drill into a disposable checkout.
   Reconstruct the expected catalogue/source build and verify exact hashes.
   Publish a compact report identifying batch, paths, total bytes, sole-copy
   issues, eligibility and restore instructions; large archive payload stays
   outside Git/runtime delivery.

## Human gate

Ask the Human to confirm that this exact hash-indexed batch has been copied to
external storage. Record the response, date, batch ID and covered files without
exposing private drive details. A local archive, silent timeout, prior approval
for another batch or Git history alone is not external-backup confirmation.
Complete all Stage-A work before asking; the approval must refer to a concrete
reviewable archive. Wait at this gate, not halfway through preparing it.

## Stage B — separately reviewed removal

After explicit confirmation, recheck the consumer-freeze SHA and hash/index.
If intervening source or pointers changed, re-audit affected entries first.
Remove only the proven, confirmed delivery copies in family-isolated changes.
Preserve lifecycle tombstones so missing retired bytes are intentional while
unknown missing files still fail validation. Do not weaken validators globally.

Build in a clean checkout so old dist/package files cannot mask missing assets.
Run focused art/catalogue/generator/fallback tests, full project and locked
desktop checks, browser routes, offline packaged smoke and the restore drill.
Scan final source runtime, dist and package inventory; report comparable before/
after files, encoded bytes and artifact hashes. Decoded memory estimates are
separate from measured residency. A 25% saving is a qualified goal, not a quota.

Root commits/pushes only accepted removal batches and their compact evidence.
If no files qualify, report a valid zero-removal result with reasons rather than
manufacturing deletions. RC-01 then qualifies the exact final product.

## Rollback

Restore exact archived bytes to the recorded paths, verify hashes, restore the
matching pointers/tombstones and rerun the same build/route/package checks.
A restore creates new evidence; it never rewrites immutable release artifacts.
Record retirement/restore outcomes in the existing ledger, with a concise final
`docs/source-assets/retirement/PLAN12_REPORT.md` referencing its authoritative rows.
