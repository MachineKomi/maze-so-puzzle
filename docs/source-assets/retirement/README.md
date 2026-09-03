# Static-art retirement ledger

This directory records Plan 03 retirement **candidates**. It does not authorize
moving or deleting any runtime file. The current 16 entries remain in
`public/assets/`, are `rollback-hold`, and are ineligible for Plan 12 removal.

## Lifecycle

The normal progression is `classified` → `rollback-hold` → `plan12-eligible` →
`export-staged` → `external-backup-confirmed` → `retired-from-runtime`.
`restored` is the rollback branch, not an automatic continuation. A state may
advance only when the corresponding per-entry evidence is recorded; a family
must not advance as a bulk shortcut.

- `classified`: a candidate has measured identity, but no preservation claim.
- `rollback-hold`: the exact runtime bytes remain in place while pointers,
  consumers, source reconstruction, and rollback obligations are unresolved.
- `plan12-eligible`: all non-export evidence is complete and the rollback window
  has expired. The current ledger has no entries in this state.
- `export-staged`: a copy exists at
  `artifacts/asset-retirement/<batch-id>/payload/<original-path>` and its batch
  index plus `SHA256SUMS` agree with this ledger.
- `external-backup-confirmed`: the Human has confirmed that the staged payload
  is backed up outside the repository.
- `retired-from-runtime`: a later, family-isolated Plan 12 change removed the
  delivery copy and proved it absent from source runtime, `dist`, executable,
  and packages.
- `restored`: the exact recorded bytes were restored and requalified.

An archive must never live below `public/assets`, because Vite/Tauri would still
package it. The proposed `artifacts/asset-retirement` root is also required to
be ignored before any export is staged; it is not created by Plan 03.

## Plan 12 process

For each entry independently:

1. Freeze all final catalogue and asset pointers after the last downstream art
   consumer lands. Prove source, generated-level/theme, story, tester, preload,
   CSS, app-icon, and Tauri paths with the authoritative reachability tool.
2. Resolve every processor dependency. In this baseline,
   `scripts/process_cage_fronts.py` still declares all four v2 fronts as outputs
   and reads `cage-moon-silver-v1.png` as a reference.
3. Let the stated rollback window expire, then pass clean-clone build/tests,
   browser route coverage, and an offline packaged-Tauri exercise with no
   missing request or fallback.
4. Copy—not move—the candidate into a new batch payload outside `public`, write
   an index and `SHA256SUMS`, and verify path, byte count, and SHA-256 against the
   ledger. Record that evidence before changing state to `export-staged`.
5. Obtain explicit external-backup confirmation. Only then may a separate,
   family-isolated Plan 12 change remove the runtime file. Re-run source,
   `dist`, executable, and package scans and record their before/after counts,
   bytes, and hashes.

The original/source masters, exact prompts, model sheets, provenance/rights
records, proof sheets, and Git history are never generic retirement payloads.
Only the superseded delivery copy named by `assetPath` is in scope.

## Restore drill

Copy the exact staged payload back to `assetPath` (or recover that path from
`preservation.gitRestore.firstSeenCommit`), then verify its SHA-256 and byte
count against the ledger. Re-run the same art, catalogue, generated-path,
browser, clean-clone, and offline packaged-Tauri checks used for retirement.
Record a `restored` transition only after the rebuilt delivery contains the
expected bytes and has no fallback or missing request.

`asset-retirement-ledger.json` is the editable authority and
`asset-retirement-ledger.schema.json` is its validation contract. Runtime
selection remains owned by `src/artCatalog.ts` and `src/assets.ts`; this ledger
must never be used as a catalogue.

## State machine

The forward path is:

`classified` → `rollback-hold` → `plan12-eligible` → `export-staged` →
`external-backup-confirmed` → `retired-from-runtime`.

`restored` is an exceptional recovery state. A restored entry must return to a
new audit before becoming eligible again. No transition may be inferred from a
missing text-search hit, asset age, visual similarity, or a replacement file's
existence.

## Plan 12 gate

Before setting one entry to `plan12-eligible`, Plan 12 must make every boolean in
its `retirementEvidence` true and clear every blocker. In particular it must:

1. Freeze all later catalogue and consumer pointers, including generated paths,
   preload lists, CSS, tests, stories, tester routes, and feature allocations.
2. Prove the candidate unreachable in a clean clone across authored, generated,
   theme, story, tester, and preload routes.
3. Exercise supported browser viewports and the offline packaged Tauri build
   without a missing request or fallback.
4. Let the declared rollback window expire.
5. Preserve source masters, prompt/provenance evidence, proof sheets, and Git
   history.

The external export root is
`artifacts/asset-retirement/<batch-id>/`. Plan 12 must first ensure
`artifacts/asset-retirement/` is ignored, then copy—not move—each candidate to
its recorded `archiveRelativePath`. The batch contains an immutable index and
`SHA256SUMS`; every copy is verified against this ledger. Only after the Human
confirms an external backup may a separate, family-isolated change remove the
runtime copy.

Never create an archive under `public/` or `public/assets/`: Vite/Tauri would
still package those bytes. Never remove a sole-copy entry before a verified
external archive exists.

## Rollback

Restore the archived payload to the exact `assetPath`, verify the restored file
matches the entry's SHA-256 and byte count, then rerun art validation, catalogue
and asset tests, production build, route checks, and the offline Tauri package
check. Git history is secondary recovery evidence; the verified external payload
is the primary Plan 12 rollback source.

The current ledger was classified against checkpoint
`ab20f28372c93e341b13e3cf2d2c94ea71703bb2` in a dirty shared worktree. Its
empty `runtimeReferences` arrays report the read-only static audit result, not a
complete dead-file proof. Non-runtime records, manifest entries, validator
classifications, and processor dependencies remain listed explicitly.
