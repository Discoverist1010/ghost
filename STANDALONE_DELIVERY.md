# Standalone conference delivery

## One file, opened in a browser

Use **[dist/demo.html](dist/demo.html)**. Copy that file alone to the presentation laptop and open it directly in Chrome. No server, installation, internet connection, PowerPoint integration or adjacent asset folder is needed. The modular developer entry point `index.html` is not the delivery file.

The HTML includes all application JavaScript, CSS, inline graphics, scenario data and essential evidence descriptions. Typography uses the Mac's installed system-font stack; there is no custom font file or font download dependency. Full external publications are references, not essential runtime assets.

Current review candidate: 248,882 bytes; SHA-256 `f66c33355a73db0591ff562248ebc21270ee9312d9765db0d975624e9767cf76`.

## Display and controls

The accepted composition is fixed at 1920×1080. The stage, controls and drawers scale together proportionally to fit the browser viewport; remaining space uses the dark background. Content is not independently rearranged for a different aspect ratio.

| Action | Control |
| --- | --- |
| Advance / back | Next / Back; Right / Left; Space advances outside a focused button |
| Pause / resume | Pause / Play; P toggles |
| Replay current reveal | Replay; R |
| Reset to opening | Home; Reset presentation inside an evidence drawer |
| Evidence / close | SHOW MORE or contextual evidence button; E opens; close button or Escape closes |
| Fullscreen / windowed | F toggles browser fullscreen |
| Source challenge | Explicit CHECK ORIGINAL SOURCE button; C also invokes it at WHY 76 |
| Independent policy check | Explicit 3RD LEVEL CHECK button |

The beat counter tracks navigation through the eight beats. There is no new beat-jump selector. Ordinary Next/Space cannot bypass either human-triggered check. The final question holds indefinitely; Next is disabled, while Back, Replay and deliberate reset remain available. Completing an animation, resizing the window or switching focus does not advance the narrative.

Local evidence controls are bordered buttons. External source references are cyan underlined links, with an “External source · internet required” tooltip and accessible label. Embedded descriptions and audit data work offline; opening the external publication itself requires connectivity. Exported audit JSON is generated locally on demand.

## Verified scope

Installed Chrome 157.0.8103.78 was tested directly against the exported `file://` HTML with networking disabled. All five requested display resolutions passed in both windowed and fullscreen modes: 1920×1080, 1600×900, 1366×768, 1920×1200 and 1280×800. Windowed viewport height excludes browser chrome; exact measurements are in the report.

Every configuration completed all 51 states, all eight beats, 44 contextual drawers and the two deliberate review actions. Normal-motion tests separately checked Pause/Play, keyboard controls, fullscreen, resize/focus stability and the final hold. All 51 stage DOMs and 44 evidence DOMs matched the development version.

**Safari remains unverified.** Safari 18.6 is installed, but its WebDriver could not start (“Operation not permitted”) and native UI automation was unavailable. No Safari security preferences were changed. These Chrome findings must not be described as actual Safari verification.

The resolution tests use fresh headless instances of the installed Chrome with simulated display sizes and real browser fullscreen. They are software rendering checks, not a test of the venue's physical projector or overscan settings. Main text and essential controls retain the approved reference margins; a physical projector should display the full frame rather than crop it.

[Full review, matrix, test results and actual screenshots](artifacts/conference-readiness/README.md).

## Maintenance

Preserve the modular source. `npm run build` regenerates `dist/demo.html`; `npm test` rejects a stale export. Node.js is needed only for maintenance, not to present the HTML. The current local candidate includes the preceding HKMA/BIS source-led edits and awaits review; no commit or push has been performed for these patches.

## Latest source/reference comparison

The modular main demo is the single source of truth; never hand-edit the compiled export. The latest [source-first comparison report](artifacts/reference-consistency/README.md) records identical content across 51 stage states and 44 drawers, ten pixel-identical screenshot pairs, repeatable builds and 92 passing tests.
