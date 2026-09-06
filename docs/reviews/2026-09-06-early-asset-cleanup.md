# Early asset delivery cleanup — Human-authorized exception

Date: 2026-09-06. Owner: root Astra. Scope: storage/package hygiene only.

## Human decision

The Human confirmed recently zipping the complete local repository and backing
it up to Google Drive, and explicitly authorized directly deleting superseded,
unused assets. They also separately approved the eleven named worktrees.
The backup is Human-attested; the agent did not inspect or hash the external ZIP.
Do not misrepresent it as an independently verified per-file external archive.

This instruction brings forward a bounded cleanup before Plan 13 consumer freeze
and replaces the proposed copy/ask-again step for this exact reviewed batch.
It does not authorize deleting active/dormant art, source masters, history,
hosted deployments or additional worktrees. No Git history rewrite is approved.

## Batch and safeguards

[Machine-readable receipt](../source-assets/retirement/early-assets-2026-09-06.json)
names 30 superseded delivery files / 9,488,260 bytes and 104 held candidates.
Each deleted path has an exact SHA256, source-record owner, existing replacement
and verified byte-for-byte Git blob at recovery checkpoint
`363859ef60ef974cb41d4e001d1be85d58e5ac56` (already on origin/main).
The checks compare the complete file bytes, not just Git object IDs.

The selection is intentionally conservative: reject any filename referenced by
runtime/catalogue/config or a reconstruction script, or any non-derivative source
record dependency. Two audited exceptions are metadata-only: the legacy
classification table and the original publisher's previous-URL hash/size lookup.
The latter now reads exact retirement metadata when old bytes are absent; it
still fails on any unknown missing file. Old canary inputs and comparison refs
remain on disk. Test assertions now distinguish retained files from explicitly
authorized tombstones rather than demanding obsolete files forever.

The first preflight missed eight identity references in generation-batch
registries outside the individual source records. Full art-manifest validation
detected these before publication; all eight were restored byte-for-byte and
added to the retained list. The final batch is 30, not the preliminary 38.
A regression test now checks generation-batch reference registries explicitly.

No new assets are moved or repointed. Current `public/assets/mgjrpg-02/` family
paths remain stable. Approved dormant content is not mistaken for obsolete art.
Here active/dormant means the current catalogue and authoritative source record:
the old migration helper still describes `wall-sandstone-v1.png` as originally
dormant, but its current source record is superseded. Its newer Golden Sandstone
replacement remains present and dormant. The obsolete migration table is not
used as removal authority.
All 448 tracked source images and every retained public file are hash-snapshotted
for before/after comparison outside runtime delivery under the external QA root.

Ledger state `retired-early-delivery` is distinct from final Plan 12 acceptance.
Its historical final-freeze/package gate booleans are not falsely set to passed.
The later final-consumer/package audit remains required. No new Windows package
or Human/device acceptance is implied by this maintenance operation.

## Recovery

Restore selected paths from the verified checkpoint using a reviewed
`git restore --source=363859ef60ef974cb41d4e001d1be85d58e5ac56 -- <exact paths>`
operation, or recover them from the Human's backup. Verify SHA256 and byte size
against the receipt. Revert/update the corresponding tombstones and manifest,
then rerun validation. A shallow clone may first need that historical commit
fetched. Do not recover all of `public/` over newer assets.

Deleting delivery files reduces current checkout and future build payload;
existing Git blobs and old Vercel deployments remain. Final measured outcomes
and validation are recorded in `PLAN12_EARLY_REPORT.md` beside the receipt.
