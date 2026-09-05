# V22-PLAY-01 PLAY-A — Sol pace candidate

Date: 2026-09-06. Runtime checkpoint: `07897d9` over accepted Tessera base
`a653a7b2fcf8730fe5d011c080591d499da9f068`. Status: complete candidate for
independent Astra review; not merged, released or family/device accepted.

## Implemented contract

- Exactly Chill 320 ms, default Regular 200 ms and Zippy 120 ms. A fresh
  keyboard, board tap/drag or ThumbPad intent commits immediately; successful
  admission, captured travel and the next held boundary share the selected
  duration. Recursive timers schedule from their actual callback and never
  emit a catch-up burst.
- Successful input unlock uses the accepted step's captured duration, closing
  the former fixed-160-ms rapid-tap loophole. At most one existing queued intent
  remains; bump and door/combat/rescue/jump/portal timings are unchanged.
- The travel-lag bound is 320 ms, so a single Chill tile is not accelerated.
  `useSceneTravel` remains the only sampled actor/camera/follower owner and the
  PERF-02A percentage world translation is unchanged.
- Sound & comfort has one labelled cycle button whose accessible name includes
  the current value. Opening/closing it clears input. Unlike other modal
  boundaries, Sound lets an already-captured ordinary segment finish behind
  the inert modal; a pace change applies only to a later fresh input.
- Pace is additive in the existing comfort-preferences key, separate from
  campaign/active-run saves. Missing, malformed and unknown pace values resolve
  to Regular. Denied writes retain the existing in-memory/save-warning behavior;
  Reset Progress preserves the value.

PLAY-B, audio sliders, camera/renderer work, art, engine legality, fingerprints,
save schemas, dependencies, versions and native packaging are unchanged.

## Static cost and allocation

Production build measurement against the exact accepted base:

| Metric | Base | Candidate | Delta | Ceiling |
| --- | ---: | ---: | ---: | ---: |
| JS gzip9 | 153,284 | 153,514 | +230 | 153,537 |
| CSS gzip9 | 23,512 | 23,510 | -2 | 30,227 |
| Runtime public | 165,031,011 | 165,031,011 | 0 | 165,031,011 |

Astra pre-authorized a maximum +700 JS / 0 CSS/public/decoded/dependencies.
Ledger entry `controls-v22-play01-pace` records only the exact +230-byte result,
not the unused authorization. The inherited 23-byte JS margin remains.

## Verification

- Focused motion/cadence/travel/PERF-02A geometry: 24/24.
- Complete project Vitest: 502/502 across 49 files.
- TypeScript and production build passed; the existing Vite 500 kB advisory is
  retained. Performance byte guard passes after the exact allocation.
- New single-worker production browser cadence suite: 6/6. It covers each mode
  and all three input sources at the exact timer boundary, late callback without
  catch-up, rapid Chill taps with at most one queued intent, and the mid-travel
  Chill-to-Zippy settings transition with no replay and a fresh 120 ms step.
- Selected inherited production-browser regressions: 5/5 for keyboard-to-pad
  ownership, Full/Reduced/Static, and modal cancellation. Existing UI focus,
  Sound preference and Reset Progress journey: 1/1.
- Sound UI inspected at 1194x834 and 568x320. Primary composition is balanced;
  the short layout retains its fixed footer and scrollable body, exposes the
  pace legend at the first fold and reaches the full 44px-plus control without
  obscuring or resizing gameplay.

External evidence (not runtime delivery):

| Evidence | Bytes | SHA256 |
| --- | ---: | --- |
| `play-a-candidate-final/playwright-results.json` | 11,222 | `90d4a3bdf68dfbec8a8a23e7df27865513bb6de9c5895a24989a9ef4608cd8b3` |
| `play-a-regressions/playwright-results.json` | 9,773 | `2ff3cbfe8ff5d7f3430a41970ab7f0ee48146f53671f4911e969a99a6776bbf4` |
| `play-a-ui/playwright-report.json` | 3,349 | `5238179b3722cba3b45b8d63539cf9898b25341326cb7eaa0d33836b04854ff8` |
| `play-a-mid-travel-r4/playwright-results.json` | 3,646 | `5b1a82a4de7825f4d382d66b6f4bbdc982f00c4054880647ced6072c5936ccdb` |
| `play-a-ui/sound-1194x834.png` | 500,357 | `d7e6321c24f12a03f11ae6f040783aab4832e9ad1fdc78728dab6684546f01d0` |
| `play-a-ui/sound-568x320.png` | 129,631 | `edec230560429af233a022c211ceb982e3238a607b6fdd18f4a3b52a8ea9375e` |
| `play-a-ui/sound-568x320-pace.png` | 125,057 | `37087c4b77a55ed8494a41c3fb6e6a2b5e4f46bb75f62acbfd8de65dafc441bf` |

The initial mid-travel probe installed its synthetic clock after the traveller
was mounted, creating two incompatible `performance.now()` origins. A second
attempt paused before the page's required mount rAFs. Neither was treated as a
runtime failure. The retained r4 result installs the clock before navigation,
allows mount to finish and then pauses one monotonic clock domain. The original
runtime issue—Sound settling travel through `!enabled`—was independently found,
fixed and proven by r4 plus the final 6/6 run.

## Limits and rollback

Desktop browser evidence establishes policy, lifecycle and geometry only. It
does not establish affected-iPad performance, family preference or final tuning.
Rollback is the complete PLAY-A runtime/docs seam to `a653a7b`; retain the
accepted Tessera repair, camera experiment and all compatible save readers.
