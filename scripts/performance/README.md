# Performance evidence harness

This directory is the shared measurement surface for Plan 07. It does not
change game behavior. It provides stable scenario contracts, deterministic
inventories, browser cohorts, provenance validation, and a feature-allocation
ledger.

## Evidence location

Raw traces, screenshots, browser profiles, Lighthouse reports, and generated
cohort JSON must be written outside the repository. By default, browser
evidence is written beneath a unique directory:

```text
%TEMP%/maze-so-puzzle-performance/<commit>/<UTC-run-id>/
```

Set `MAZE_PERF_EVIDENCE_DIR` to a fresh absolute directory outside the repository
when a durable lab volume is available. Small reviewed summaries may be copied
to `docs/performance/evidence/`; they must retain their artifact hashes and may
not contain a heavy trace.

Every measured row must record the commit, dirty-tree state, lockfile hashes,
build mode, build hash, OS, hardware, browser/WebView version, viewport,
throttling, cache state, run count, timestamps, and acceptance or rejection
reason. The validator rejects incomplete rows instead of filling gaps.

## Commands

```powershell
npm run build
npm run perf:check
npm run perf:inventory -- --output C:\path\outside\repo\inventory.json
npm run perf:validate -- C:\path\outside\repo\inventory.json
```

Browser runs use an ephemeral Playwright CLI and the installed Microsoft Edge
binary. Do not add Playwright to the product dependency graph:

```powershell
npm install --no-save --package-lock=false --ignore-scripts @playwright/test@1.62.1
$env:MAZE_PERF_EVIDENCE_DIR = Join-Path $env:TEMP ("maze-so-puzzle-performance\manual-" + [DateTime]::UtcNow.ToString("yyyyMMdd-HHmmss"))
npm run perf:browser
```

The harness launches `vite preview`; development-server results are not
accepted. Use `MAZE_PERF_EDGE_PATH` only to point at a recorded Edge binary.

## Scenario rules

- Curated levels are selected by stable `levelId` and accessible button name.
- Checkpoints describe UI state, terrain, or engine events. They do not store
  pixel coordinates.
- Any long route must be generated from the current engine and solver. Recorded
  direction strings are forbidden evidence.
- Fixed Surprise seeds are identity fixtures, not hand-authored layouts.
- Tauri rows use the same scenario IDs. If a clean WebView2 cohort is not
  available, report `pending-hardware`; never substitute Edge browser timing.

Timing budgets are report-only until the variance qualification described in
`docs/PERFORMANCE_BUDGETS.md` is complete. Deterministic contract and byte/hash
checks may block immediately. `npm run build` writes a source/dist fingerprint
under ignored `node_modules/.cache/`; `perf:check` rejects a stale or modified
`dist/` rather than assuming it came from the current tree.
