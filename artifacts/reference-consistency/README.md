# HKMA anchors and reference consistency · comparison report

13 November 2026 · `feature/ghost-v3`, based on `ab7108f`. Local review candidate only; no commit or push performed.

## Source-first implementation and equivalence

1. Updated and visually verified the modular development demo at `http://127.0.0.1:4173/` before regenerating the export. No manual edits were made to compiled HTML.
2. Ran `npm run build` to produce [dist/demo.html](../../dist/demo.html), then opened that actual file through `file://` in a fresh Chrome context with networking disabled.
3. Compared **all 51 stage DOMs and 44 evidence-drawer DOMs** between development and standalone versions. No differences. Both retain eight beats and the same presenter sequence.
4. Captured seven reference-bearing stages and three corresponding drawers in both versions at 1920×1080. **All ten screenshot pairs are pixel-identical**, including source text, typography, positioning and controls.
5. Rebuilt twice without source changes. Both builds were byte-identical to the verified candidate: 248,882 bytes, 14 embedded modules; SHA-256 `f66c33355a73db0591ff562248ebc21270ee9312d9765db0d975624e9767cf76`.

## Surgical changes

- Added the exact requested HKMA discussion-paper paraphrases to cognitive limits, the SDLC/business-rule scene and conditional systemic liquidity pressure. Main headlines and the possible/not-inevitable qualification remain intact.
- All 15 reference rows on the seven source-bearing screens now use one small shared CSS style and a shared text renderer: **SOURCE LABEL: finding**, 28px at the 1920×1080 reference, 1.4 line height, 14px row gap, cyan labels and muted-white findings. Placement/width remains scene-specific; balanced wrapping avoids orphaned last words.
- Historical-review attribution is now two legible, source-supported lines (MAS AIRM and Singapore AI Verify), replacing the small names-only attribution. Its hero and LOOK BACK / FIX FORWARD actions are unchanged.
- HKMA, FSB and MAS summaries now precede technical metadata and task inventories in the relevant exception drawer. BIS Logos/Agenti and HKMA summaries precede systemic technical records. System-assurance research precedes its JSON audit. Detailed records and primary links remain accessible.
- Source entries identify institution, publication/date and status before the finding, qualification and primary-source link. Existing drawer styles are reused; no new visual component or main-stage disclaimer was introduced.

## Source status

The [HKMA November 2026 discussion paper](https://www.hkma.gov.hk/media/eng/doc/key-information/press-release/2026/20261102e3a1.pdf) remains exploratory, not binding supervisory guidance; §2.3 creates no new obligations. Meaningful-approval support is in §7.2; intent/ownership and harness boundaries in §§5.2–5.3 and 7.1; potential correlated machine-speed feedback and procyclicality in §4.5. Its proposed critical read-only dependency assessment (§8.1) remains in the drawer.

The systemic outcome remains conditional. BIS Logos and Agenti remain ongoing research, not validation of this specific synthetic scenario. MAS guidance, FSB reports, research and technical frameworks retain their separate qualifications. Historical impact tracing is not attributed to a blanket AI Verify requirement. No source-based rule or ownership assignment has been invented for the fictional institution.

## Actual 1920×1080 screenshots

| Screen | Main development demo | Standalone HTML | Pixel comparison |
| --- | --- | --- | --- |
| Cognitive limits · FSB / MAS / HKMA | [Main](main-cognitive-limits-1920x1080.png) | [Standalone](standalone-cognitive-limits-1920x1080.png) | Identical |
| SDLC · HKMA | [Main](main-sdlc-1920x1080.png) | [Standalone](standalone-sdlc-1920x1080.png) | Identical |
| Historical review · MAS / AI Verify | [Main](main-retrospective-question-1920x1080.png) | [Standalone](standalone-retrospective-question-1920x1080.png) | Identical |
| System assurance · AISI / DeepMind | [Main](main-system-assurance-1920x1080.png) | [Standalone](standalone-system-assurance-1920x1080.png) | Identical |
| NAV grounding · four anchors | [Main](main-nav-grounding-1920x1080.png) | [Standalone](standalone-nav-grounding-1920x1080.png) | Identical |
| Systemic liquidity · HKMA | [Main](main-system-pressure-1920x1080.png) | [Standalone](standalone-system-pressure-1920x1080.png) | Identical |
| Systemic conclusion · BIS Logos / Agenti | [Main](main-system-changed-1920x1080.png) | [Standalone](standalone-system-changed-1920x1080.png) | Identical |
| Exception source-first drawer | [Main](main-cognitive-limits-drawer-1920x1080.png) | [Standalone](standalone-cognitive-limits-drawer-1920x1080.png) | Identical |
| Requirements-and-testing drawer | [Main](main-sdlc-drawer-1920x1080.png) | [Standalone](standalone-sdlc-drawer-1920x1080.png) | Identical |
| BIS source-first drawer | [Main](main-system-changed-drawer-1920x1080.png) | [Standalone](standalone-system-changed-drawer-1920x1080.png) | Identical |

## Verification

- **92/92 tests pass** (baseline 89). Three focused tests added; only affected presentation wording/hash assertions updated. Historical fixtures were preserved. The 44 unaffected stage markups remain protected by their accepted hashes.
- **1366×768 fullscreen/offline:** all 51 states, 44 drawers and both deliberate review actions passed; no clipping, overflow, browser errors or HTTP requests. [Smaller systemic screen](chrome-1366x768-fullscreen-system-pressure.png) and [smaller cognitive-limit screen](chrome-1366x768-fullscreen-cognitive-limits.png).
- **Ordinary animations tested in both versions:** Pause/Play, P/R/E, Back/Next, reset, fullscreen, focus/resize stability, human-triggered checks and the final held question all passed. Animation completion did not advance the narrative.
- Reference bounds were checked against headlines, risk kickers, contextual action buttons and presenter controls. No overlaps; computed source font sizes, colours, line heights and reference bounds match across both versions.
- Original scenario modules, NAV/systemic calculations, authority controls, reveal definitions, display-scaling module and finale are byte-identical to HEAD. No final-recap or final-question changes.
- Browser tested: installed Chrome 157.0.8103.78 in fresh headless contexts. This patch does not claim new Safari or physical-projector validation. External publication links still need connectivity; embedded explanations and audits do not.

## Changed files

Source: `src/source-notes.mjs`, `src/theatre.mjs`, `src/central-bank-theatre.mjs`, `src/nav-theatre.mjs`, `src/systemic-theatre.mjs`, `styles.css`.

Generated delivery: `dist/demo.html`, produced exclusively by the existing build process. Supporting metadata: `PUBLIC_SOURCES.md`, current build identity in `README.md` and `STANDALONE_DELIVERY.md`.

Tests: `tests/reference-style.test.mjs` (new), presentation assertions in `tests/central-bank.test.mjs`, `tests/material-case.test.mjs`, `tests/source-grounding.test.mjs`. Actual screenshots, runners and results are in this directory.

## Repeatable evidence

[Comparison runner](compare-versions.js) · [DOM/typography results](comparison.json) · [PNG comparison results](screenshot-comparison.json) · [Repeated build hashes](reproducible-builds.json) · [Main visual check](main-review.json) · [Smaller display results](small-display.json) · [Normal-motion control results](controls.json) · [Full test output](test-results.txt).

The main modular demo remains the single source of truth. Awaiting review; no commit or push performed.
