# UI-NATIVE-EXIT-01 — Astra source review

Date:2026-09-06. Actual Sol candidate
`e5a4a77cfc786e94b9e57f08ec95ca70cccdc1dc`, isolated
`codex/v22-ui-native-exit`, based on frozen v0.22.4 `45d8437`.

Decision: **no source blocker found; proceed to bounded qualification**, not
main integration or release acceptance. Astra read the complete adapter/tests,
FrontDoor and capability/config diff and Sol's source-ready report. Sol's eight
focused tests/TypeScript pass are reported evidence, not newly rerun by Astra.

- Uses the documented public `window.__TAURI__.window.getCurrentWindow().close()`
  with `withGlobalTauri` and only `core:window:allow-close` added. No internal
  IPC, process plugin, destroy/force-exit fallback or new dependency.
- Repeated requests share the pending promise; absent/malformed/throwing or
  rejected bridges return safe outcomes. No browser `window.close()` is called.
- Neutral manual-close guidance preserves Play, while an unmount guard avoids
  a later failed request updating the old screen. Existing input/save authority
  and geometry are untouched.

Official API/config/permission documentation was independently checked:
[window](https://v2.tauri.app/reference/javascript/api/namespacewindow/),
[configuration](https://v2.tauri.app/reference/config/#withglobaltauri),
[core permissions](https://v2.tauri.app/reference/acl/core-permissions/).
Public bridge shape must still be observed in the actual installed runtime.

Before promotion: measure exact web and native cost, book actual allocation
within the authorized400 gzip9 JS ceiling, run serial integration/build checks,
verify real Title Exit button terminates the owned native process (pointer and
keyboard), then exact save/settings on reopen. Test browser and injected
unavailable/rejected paths with Play still usable. Do not count X/Alt+F4 or a
mocked successful promise as the repaired Exit path. Account for the global
bridge's native embedded bytes separately from Vite JS. No camera claim.

v0.22.4 remains immutable and does not contain this candidate. After returned
heavy-job ownership, actual Sol qualifies the candidate; root independently
reviews the evidence and owns any integration/versioned publication.
