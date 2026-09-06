# UI-NATIVE-EXIT-01 — Sol source-ready candidate

Date: 2026-09-06. Frozen base:
`45d843774d0335aa0ae1ee51aa9ca2f70f235b31` (v0.22.4). Branch:
`codex/v22-ui-native-exit`. Status: source-ready for independent Astra review;
browser, native, full-suite, build, performance, allocation and publication
qualification are deliberately pending the serial heavy-work handoff.

## Bounded implementation

- `src/nativeExit.ts` calls only the documented public global Tauri window API:
  `window.__TAURI__.window.getCurrentWindow().close()`. It returns one of
  `requested`, `unavailable` or `failed`, contains synchronous and asynchronous
  bridge failures, and coalesces repeated activation while a request is pending.
- `FrontDoorScreen` no longer calls browser `window.close()`. An unavailable or
  failed native request leaves Play usable and shows neutral manual-close copy
  that does not guess whether the host is a browser or native window. There is
  no delayed notice timer; the mounted guard prevents a late failed promise from
  updating the screen after Play/unmount.
- `app.withGlobalTauri` exposes the documented public namespace without an API
  package. The existing `main` window capability gains only
  `core:window:allow-close`. No process plugin, internal IPC, Rust handler,
  destroy/force-exit path or broader permission is added.

Official Tauri v2 references:
[global API configuration](https://v2.tauri.app/reference/config/#withglobaltauri),
[window API](https://v2.tauri.app/reference/javascript/api/namespacewindow/), and
[close permission example](https://v2.tauri.app/learn/window-customization/).

No package/lockfile, dependency, CSS, media, geometry, camera, input, gameplay,
save, version, Rust or release file changed. Existing active-run persistence and
storage warnings remain the only durability authority.

## Lightweight source checks

- Locked tool setup: `npm ci`, 55 packages installed, zero vulnerabilities; no
  dependency or lockfile content change.
- Focused adapter tests: 8/8. They cover successful public close, one-call
  coalescing, rejection and retry, absent/malformed bridge forms, throwing
  bridge and proof that native rejection never calls a browser close function.
- TypeScript project validation passed.
- Both changed JSON files parse; `git diff --check` passes apart from checkout
  line-ending notices. Package manifests, Cargo files and Rust source are
  byte-unmodified in the Git diff.

## Pending serial gates

Astra must return the heavy slot before production build/static measurement,
full tests, browser fallback/Play journey, Cargo/native build or actual process
smoke. Any JavaScript gzip-9 growth above the inherited 23-byte margin requires
an exact ledger entry; Astra pre-authorized at most +400 bytes. CSS, media,
public, decoded and dependency growth remain zero-only.

Native acceptance requires the actual Title Exit button to make the owned main
window disappear and terminate the owned process, followed by reopen/resume of
the exact active run and pace/Music/SFX preferences. Repeat keyboard activation,
denied/unavailable behavior and normal OS close. A mock, compile, CDP page close,
X or Alt+F4 alone cannot establish the native Exit result.

Rollback is the complete five-file runtime/config seam to frozen v0.22.4. Do
not remove only the capability while leaving the button calling the bridge, or
restore browser `window.close()` as a native fallback.
