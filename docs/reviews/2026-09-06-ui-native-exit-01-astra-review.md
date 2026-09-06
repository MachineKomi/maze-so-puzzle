# UI-NATIVE-EXIT-01 — Astra source review

Date:2026-09-06. **Final disposition: accepted for the next reviewed UI preview;
not published in v0.22.4.** Actual Sol candidate
`e5a4a77cfc786e94b9e57f08ec95ca70cccdc1dc`, isolated
`codex/v22-ui-native-exit`, based on frozen v0.22.4 `45d8437`.

Initial source decision: **no source blocker found; proceed to bounded qualification**, not
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

## Final independent acceptance

Sol returned clean/pushed branch `codex/v22-ui-native-exit` at
`19f08a164161656164fac787847798342cbf4674`. Runtime/config bytes are unchanged
from reviewed `e5a4a77`; later changes are the qualified report, three targeted
browser tests and exact +249-byte allocation. Root read those diffs, final report,
native state/fallback records and keyboard-focus screenshot, and verified the
native summary plus all ten referenced record hashes. This is independent review,
not a fabricated second full test run.

- 541/541 serial project tests,8 adapter tests,3 browser cases, TypeScript/build/
  performance and locked desktop/native build passed.
- JSgzip9 grows155090→155339 (+249 within400 authorized); CSS23563,
  public165031011 and decoded images411582176 are unchanged. Whole native
  executable grows43520 bytes to173468160, not a bridge-only measurement.
- Actual pointer and keyboard Exit terminate their owned processes; exact
  schema3 run, schema6 durable records and Reduced/Lite/Zippy/Music.12/SFX.64
  return after both reopens. Normal OS cleanup is separate from Exit proof.
- Simulated unavailable/rejected public bridges in actual WebView2 preserve
  usable Play and neutral guidance; reload restores the real bridge. This is
  not evidence of an actual Tauri permission-denial installation.
- Native summary6399B SHA256
  `d23b3a76c0ef041c5cb5355767fa3ff2016f5ebcb02f71cc7e2bd2f6fa1e2f5d`,
  under `C:/GameDev/maze-game-qa/output/ui-native-exit-01/e5a4a77cfc78`.
  Both rejected harness assumptions remain disclosed; owned processes/ports closed.

[Sol handback](https://github.com/MachineKomi/maze-so-puzzle/blob/19f08a164161656164fac787847798342cbf4674/docs/reviews/2026-09-06-ui-native-exit-01-sol-candidate.md)
backs up the narrative. Raw synthetic profiles/screenshots remain external.
Hold this seam on its preserved branch and combine it with the next accepted
short-height UI checkpoint for v0.22.5; do not rewrite v0.22.4. No camera,
physical-family, signing or installer acceptance is implied.
