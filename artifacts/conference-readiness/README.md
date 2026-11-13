# Standalone conference-readiness review

13 November 2026 · local `feature/ghost-v3` · based on `a34a447` plus the preserved, uncommitted source-led patch. No commit, push or new submission performed.

**Verified delivery:** [one standalone HTML](../../dist/demo.html), opened directly using `file://` in the installed Chrome with networking disabled. **Remaining verification gap:** actual Safari could not be tested in this environment. Use the tested Chrome for the verified delivery path.

## Material corrections

1. **Uniform geometry:** the old outer stage was 16:9, but fixed-pixel spacing and container-dependent rules changed internal layout at smaller sizes. A small `src/display.mjs` helper now scales a fixed 1920×1080 frame containing both the stage and evidence drawer. Only one CSS scale variable changes on resize; presenter state, calculations and animations are untouched. Dark letterboxing/pillarboxing fills remaining space. No responsive scene redesign was introduced.
2. **External-source distinction:** existing cyan underlined publication links now have an explicit external-source/internet tooltip and accessible label. Local bordered evidence controls still operate without connectivity. No additional main-stage disclosure was added.
3. **Delivery notes:** direct-browser instructions replace PowerPoint as the current workflow. The earlier PowerPoint guide is labelled historical, without deleting its record.
4. **Packaging:** rebuilt the existing single-file export from modular source. No framework, dependency, CDN, remote font, asset folder, local fetch or cross-origin module is needed at runtime. The existing Mac system-font stack needs no downloaded font file.

Implementation files changed for this readiness pass: `index.html`, `styles.css`, `src/theatre.mjs`, new `src/display.mjs`, rebuilt `dist/demo.html`, new `tests/display.test.mjs`. Documentation: `STANDALONE_DELIVERY.md`, current portions of `README.md`, historical status in `POWERPOINT_INTEGRATION.md` and `HISTORY.md`. The preceding source-led patch remains preserved; no scenario module, NAV arithmetic, source-check logic, policy determination, reveal list, recap wording or final question was changed.

## Browser/display matrix

Installed Chrome 157.0.8103.78, fresh headless browser instances with the specified virtual display sizes. Fullscreen checks used browser-window fullscreen plus the application's F shortcut and verified the resulting screen-sized viewport. Windowed screenshots include only the content viewport, whose height excludes 87px of browser chrome in these test instances.

| Display | Mode | Actual content viewport | States / drawers | Result |
| --- | --- | --- | --- | --- |
| 1920×1080 | windowed | 1920×993 | 51 / 44 | PASS |
| 1920×1080 | fullscreen | 1920×1080 | 51 / 44 | PASS |
| 1600×900 | windowed | 1600×813 | 51 / 44 | PASS |
| 1600×900 | fullscreen | 1600×900 | 51 / 44 | PASS |
| 1366×768 | windowed | 1366×681 | 51 / 44 | PASS |
| 1366×768 | fullscreen | 1366×768 | 51 / 44 | PASS |
| 1920×1200 | windowed | 1920×1113 | 51 / 44 | PASS |
| 1920×1200 | fullscreen | 1920×1200 | 51 / 44 | PASS |
| 1280×800 | windowed | 1280×713 | 51 / 44 | PASS |
| 1280×800 | fullscreen | 1280×800 | 51 / 44 | PASS |

Every configuration exercised the eight beats, both explicit human checks, Next/Back, contextual drawers, close button/Escape, Replay, Home and the final hold. All checked stage elements and drawers stayed inside the fitted presentation/viewport bounds. The 1920×1080 reference dimensions remained constant at every resolution. There were no page scrollbars, detected text/control overflow, browser errors or HTTP requests. Intentional scrolling inside long evidence drawers remains available.

Geometry bounds were checked across all 510 state visits and 440 drawer openings. Screenshots of opening, adaptation, systemic research, recap and ending were captured in every display/mode combination. The primary conference reference, low-resolution recap and 16:10 letterboxing were visually inspected; full reference composition and row wrapping are preserved. Essential controls keep the approved safe margins. This is software-rendering verification, not a physical venue-projector/overscan test; actual hardware should show the whole frame rather than crop it.

### Safari status

Safari 18.6 is installed (`safaridriver --version`). Starting the actual Safari driver failed with “Unable to start the server: Operation not permitted”, including the authorised run. Native UI service startup also failed. No Safari automation/security preferences were changed, and no WebKit result is presented as actual Safari testing. Safari remains an explicit unverified browser rather than a claimed pass.

## Functional and offline checks

- **Actual exported file:** all matrix runs opened `file:///Users/macbookpro18/Desktop/CODE/active/ghost/dist/demo.html` with the browser context offline. All required text, inline graphics, styles, code and audit data loaded locally. External publications were not followed or needed.
- **Development equivalence:** compared all 51 rendered stage DOMs and 44 evidence DOMs against the modular development version. No differences. The server was used only for this comparison, not for standalone operation.
- **Normal motion:** separate run with ordinary animations verified opening Play, flood Pause/Play, P, R, E, clickable reset, fullscreen enter/exit and focus/viewport changes. Telemetry stayed frozen while paused and resumed afterward. Completing an animation did not change the narrative state.
- **Deliberate human review:** ArrowRight and Space could not bypass source verification or the separate policy check. Both action buttons worked.
- **Final stability:** the final question held after waiting, ignored Next, and supported Back→recap, Next→final, Replay and Home reset. There is no automatic advancement on animation completion or resize.
- **Existing beat navigation:** all eight beat boundaries were traversed using existing Next/Back; no new jump selector was added.
- **External links:** 62 source links encountered across the 44 drawers had external/internet labels; local evidence remained usable offline.
- **Tests:** 86 passed at the start of this readiness pass; 89 passed after three focused display tests were added. The earlier source-grounding tests and protected scenario/markup contracts continue to pass. No substantive test was weakened.

## Actual screenshots

- [1920×1080 fullscreen recap](chrome-1920x1080-fullscreen-due-diligence.png)
- [1600×900 fullscreen opening](chrome-1600x900-fullscreen-opening-question.png)
- [1366×768 windowed recap](chrome-1366x768-windowed-due-diligence.png)
- [1920×1200 fullscreen letterboxing](chrome-1920x1200-fullscreen-system-changed.png)
- [1280×800 fullscreen recap](chrome-1280x800-fullscreen-due-diligence.png)
- [1280×800 windowed evidence](chrome-1280x800-windowed-evidence.png)
- [1920×1080 fullscreen final question](chrome-1920x1080-fullscreen-final-question.png)

## Reproducible evidence

- [Full display runner](check-display.js), with three smaller batch scripts alongside it.
- [All ten matrix results](matrix.json).
- [Normal-motion control runner](check-controls.js) and [result](controls.json).
- [Development/export comparison runner](check-equivalence.js) and [result](equivalence.json).
- [Full test output](test-results.txt).

## Deliverable identity

`dist/demo.html` · 246,658 bytes · 14 embedded modules. SHA-256: `97071108a7b4f7712ddd5e92befd488e16342ca3ce60c904e0d3427f6d1cc41c`.

Only that HTML is needed on the presentation laptop. Node.js, source modules and test scripts are maintenance tools, not presentation dependencies. The file retains the neutral browser title, one opening disclosure, all eight beats and the approved final question. Awaiting review; no commit or push performed.
