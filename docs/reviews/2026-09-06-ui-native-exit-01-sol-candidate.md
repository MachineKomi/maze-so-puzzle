# UI-NATIVE-EXIT-01 — Sol qualified candidate

Date: 2026-09-06. Frozen base:
`45d843774d0335aa0ae1ee51aa9ca2f70f235b31` (v0.22.4). Branch:
`codex/v22-ui-native-exit`. Runtime/config checkpoint:
`e5a4a77cfc786e94b9e57f08ec95ca70cccdc1dc`. Status: qualified candidate
for independent Astra acceptance. It is not merged, versioned or published.

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

## Qualification

- Locked tool setup: `npm ci`, 55 packages installed, zero vulnerabilities; no
  dependency or lockfile content change.
- Focused adapter tests: 8/8. They cover successful public close, one-call
  coalescing, rejection and retry, absent/malformed bridge forms, throwing
  bridge and proof that native rejection never calls a browser close function.
- TypeScript project validation passed.
- Both changed JSON files parse; `git diff --check` passes apart from checkout
  line-ending notices. Package manifests, Cargo files and Rust source are
  byte-unmodified in the Git diff.
- Serial full suite passed 541/541 with `npm test -- --maxWorkers=1` in 89.68s.
- Production `npm run build`, `npm run perf:inventory` and `npm run perf:check`
  passed. The source-matched inventory is accepted static evidence with runtime
  input and dist fingerprints both matching.
- A focused production-browser run passed 3/3 in 7.22s: no bridge/manual-close
  guidance plus Play, rejected bridge plus Play, and late rejected promise after
  Play/unmount with no page error or stale notice.
- `npm run check:desktop` passed with the locked Cargo graph. The serial native
  command
  `node node_modules/@tauri-apps/cli/tauri.js build --no-bundle --ci -- --locked`
  passed using the existing external target cache. The resulting unsigned x64
  PE reports product/file version 0.22.4.

## Exact allocation

The frozen v0.22.4 baseline is 155,090 JS gzip-9 bytes. This candidate is
155,339: **+249 bytes**, within Astra's +400-byte authorization and leaving the
usual 23-byte general headroom under the adjusted contract. CSS remains 23,563
gzip-9 bytes. Runtime public delivery remains 165,031,011 bytes; asset transfer
remains 164,967,097; decoded image upper bound remains 411,582,176. CSS, public,
asset, decoded and dependency growth are all zero.

The complete native executable is 173,468,160 bytes and SHA-256
`bf9e488a1b86bfdb9ee20d60896eedc70011ba9813d5b74735dd428fac2240ea`.
The immutable published v0.22.4 baseline is 173,424,640 bytes and SHA-256
`9888f8f2bbd4f6c2f6210e3eecf0104d852f3928cc03a74b338772647e28e7c0`:
the whole executable grows 43,520 bytes. That number measures the complete
global-bridge/capability/embedded-runtime seam, not `withGlobalTauri` in
isolation. The exact +249 JS allocation is recorded under
`ui-native-exit-01-public-window-close`.

## Actual native evidence

The native smoke used only the copied candidate executable and a new external
synthetic WebView2 profile. The inherited frozen-engine Maze 1 fixture was
sanitized by v0.22.4 and remains valid because this candidate changes no engine,
content or save source. Before the first Exit and after both reopens, the app
mounted the same schema-3 `little-star-trail` run at `(1,4)`, zero steps, with
gameplay fingerprint `g-da9a47f7`; schema-6 durable progress was unchanged.
Reduced motion, Lite quality, Zippy pace, 12% Music and 64% SFX also survived
both closes. Every launch exposed the expected public global Tauri window
namespace and close function, with no page errors.

- Pointer: Computer Use selected the exact returned candidate window and clicked
  its accessibility `Exit` button. PID 13352 terminated and debug port 9241
  closed. No force-kill, title-bar close or scripted `window.close` was used.
- Keyboard: after reopen and state verification, Computer Use traversed focus;
  a read-only observation confirmed `BUTTON.front-door-exit` was the active DOM
  element, then Computer Use pressed Return. PID 21192 and port 9241 closed.
  Again, no force-kill or scripted close was used.
- Final reopen proved the same run/preferences once more. Computer Use then used
  normal OS Alt+F4 only for cleanup of PID 17848; that cleanup is not counted as
  Title Exit proof.

Primary native evidence is under
`C:/GameDev/maze-game-qa/output/ui-native-exit-01/e5a4a77cfc78/`, including
`native-summary.json`, three source/state records, Computer Use screenshots,
the copied executable and both retained observer failures. The summary is 4,762
bytes with SHA-256
`9136143bf2d59dd52140669cb8de62e57d52d085285365127226a37ae182eef0`.
Focused browser
evidence is
`C:/GameDev/maze-game-qa/output/playwright/ui-native-exit-01-browser/playwright-results.json`
(5,460 bytes, SHA-256
`1308bbcb6cc558f14acd00be6b4f09790349a8b25c424dfa1310902134ff0d0b`).
Static inventory is
`C:/Users/hellb/AppData/Local/Temp/maze-so-puzzle-performance/e5a4a77cfc78/inventory-2026-09-06T02-21-58.193Z.json`
(368,080 bytes, SHA-256
`be224daeb2e65a976d004df1ee6f659e580547ed74c6a6fbfd3c3a0b2be29225`).

## Retained failures and limits

Two native harness failures are preserved and are not classified as runtime
failures. The first demanded byte-identical `revealedTiles` after initialization;
the app canonically rewrote that derived list while retaining the exact engine
state. Its owned PID 4976 was closed normally through Computer Use's standard
title-bar Close button. The second assumed WebView2's `Local State` was at the
profile root instead of `EBWebView/Local State` and failed before launch. The
corrected evidence compares authoritative run identity/game state/preferences,
retains both failed records and never deletes either profile.

This is a Windows WebView2 process-termination result on this host, not signing,
installer, offline, clean-machine or broader Windows-family acceptance. It does
not establish device efficacy or authorize publication. Root remains the
independent acceptance, versioning, integration and release authority.

Rollback is the complete five-file runtime/config seam to frozen v0.22.4. Do
not remove only the capability while leaving the button calling the bridge, or
restore browser `window.close()` as a native fallback.
