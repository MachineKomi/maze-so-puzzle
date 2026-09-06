# Sol independent cleanup review — 2026-09-06

Reviewer: actual Sol review agent; read-only review, no implementation/build work.
Recorded by root Astra from the review message.

No stop-level blocker in the 30-file batch. Independently checked:

- Git's deleted public paths equal the receipt exactly: 30 / 9,488,260 bytes.
- Receipt held set equals all 104 rollback-hold ledger rows / 31,743,621 bytes.
- Every deleted asset's record-level and derivative-level status is superseded.
- All replacement files exist; runtime/source scans identify no pixel consumer
  beyond recorded history and the two explicitly handled metadata mechanisms.
- All 30 historical Git blobs at `363859ef60ef974cb41d4e001d1be85d58e5ac56`
  independently hashed and counted; zero mismatches against the receipt.
- Missing-file waiver is joined to exact path, receipt, ledger, schema, record,
  hash, dimensions, replacement and authorization. Generation-batch/source
  validation remains outside the waiver; no active/source blanket exemption.
- No final Plan12 evidence flags are fabricated. All retired rows remain
  ineligible for the separate final Plan12 gate and use the explicit early state.
- The publisher consumes previous-URL metadata, not these old pixels; exact
  tombstones preserve its metadata while unknown missing files still fail.

## Nonblocking follow-ups addressed by root

1. Require derivative-level as well as record-level superseded status. Added
   the nested check and active/dormant/deprecated negative tests, plus a check
   that accidentally restored obsolete bytes cannot silently ship again.
2. Clarify the historical migration table's dormant sandstone label versus
   the current superseded source record; preserve the newer dormant art.
3. Close the early report only after final validation/deployment evidence.

This review does not assert new Windows package qualification, final consumer
freeze or Human/device visual/performance acceptance.
