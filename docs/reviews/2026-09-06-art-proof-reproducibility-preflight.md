# Phase 2 prerequisite — art proof reproducibility preflight

2026-09-06. Read-only investigation by the bounded evidence agent, reviewed by
root Astra. No repair, regeneration or new test pass is claimed by this note.
v0.22.8 has inherited art qualification only; its fresh136 unit tests are separate.

## Two distinct defects

1. Clean checkout lacks the required historical v14 selection evidence: the
   approved review binds an index plus48 children. The23 diagnostics report
   missing ignored references, not missing runtime sprites. Restore original
   bytes from a hash-verified archive and keep mandatory transitive verification.
   Never regenerate an approved packet or rewrite its approval to silence errors.
2. The optional ambient `artifacts/art-proofs/canary/proof-index.json` pins live
   pipeline/test bytes, including `validate.py` itself. Its test expects CRLF6401B;
   the current LF source/manifest expects6277B. Any legitimate validator change
   would also stale this old compatibility check. Presence of an ignored legacy
   packet must not silently change what the standard current-art gate means.

## Bounded proposed repair, requiring independent review

- Make legacy-canary checking an explicit CLI selection. Report historical-byte
  integrity separately from compatibility with today's inputs; unselected history
  is not labelled validated. Preserve mandatory approved v14 checks.
- Keep LF pipeline policy; do not normalize hashes globally or reinterpret old
  approved bytes. Historical checks require their original input snapshot.
- Add a non-writing, field-level current-manifest diff. Residual staleness is
  not yet explained; do not attribute all of it to EOL. Refresh only a derived
  current manifest after reviewing its actual changes, never historical approvals.
- Tests: optional packet presence does not alter default current validation;
  explicitly selected stale compatibility fails; mandatory packet absence and
  tampering fail; LF/CRLF hashes remain distinct; diagnostic names differing fields.
- Restore required evidence into an explicit reproducible archive/retrieval policy
  before claiming a fresh clone validates. Keep heavy pictures outside runtime
  delivery. Archive availability/rights and exact provenance must be checked.

Candidate files: `scripts/art_pipeline/cli.py`, `validate.py`, `manifest.py`,
`tests/test_mgjrpg02_integrity.py`, `tests/test_mgjrpg02_selection.py`, small new
CLI/manifest fixtures. Source observations at frozen3acaf58: optional discovery
near validate.py302/3402, required selection near2059, manifest generation near604.

Then Phase2 clean connected-ditch art/topology with Human approval; root PT36
before Plan04 remains. This is not permission to reopen all approved sprites,
delete history, waive an integrity gate or call unchanged art newly approved.
