# v0.22.1 physical test — later graphics-setting clarification

Source: direct Human chat, 2026-09-05, after the saved
[v0221-playtest-feedback.md](v0221-playtest-feedback.md). Preserve that original
file without rewriting the Human's account.

- The Human tried disabling animations and reducing surface quality/all exposed
  graphics settings to minimum on the eighth-generation iPad.
- Movement/camera became only slightly smoother and remained worse than the
  smooth movement on desktop and their Samsung S25 Plus (exact model tentative).
- The earlier report's 32GB figure describes device storage, not reported RAM.
- Exact UI option values and iPadOS/browser mode remain unspecified. “Minimum”
  must not be reclassified as an instrumented Lite + Reduced run; Static also
  disables smooth travel and is not an equivalent presentation comparison.
- The new Windows v0.22.1 binary has not been Human-tested. The desktop comparison
  in chat does not establish an exact-build native test.

Disposition: the existing settings escape hatch is not sufficient in this observed
run. Prioritize V22-PERF-02 moving-scene/camera isolation before pace/lighting/VFX.
This does not by itself prove a camera, GPU, memory, filter or browser root cause.
Phone/iPad prompt music remains positive observed behaviour, not proof of a new
audio-code fix or a universal cold-start guarantee.
