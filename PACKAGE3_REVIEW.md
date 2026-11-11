# Approval update — 12 November 2026

The user approved committing, merging and pushing Package 3 and the subsequent surgical UI corrections. All left-hand stage headers are hidden; right-hand headers remain unchanged. The opening domain line now reads **OPERATIONS · FUND ACCOUNTING · LIQUIDITY MANAGEMENT**. The preservation test canonicalises only this expressly approved copy replacement. All 53 tests pass. Screenshots of these later corrections are in `artifacts/header-correction/`. The local-review/no-commit statements below record the earlier review checkpoint.

# Ghost V3 Package 3 — local review

## Repository state

- Root: `/Users/macbookpro18/Desktop/CODE/active/ghost`.
- Verified origin: `https://github.com/Discoverist1010/ghost.git`.
- Branch: `feature/ghost-v3`.
- Accepted baseline / unchanged HEAD: `c2316088e2093f0e7ac8dfda3db15ca73ae4db96`.
- Fetch verified local and remote main/feature at the baseline. Worktree was clean before implementation; it now contains only this local Package 3 work. No commit, merge or push performed.

## Implementation

New `src/systemic-scenario.mjs`, `src/systemic-theatre.mjs` and `src/finale.mjs` provide the deterministic financial model, sparse network/timing/transmission scenes and progressive finale. Integration changes are confined to `src/presentation.mjs`, `src/theatre.mjs`, removal of the temporary legacy-continuation button in `src/nav-theatre.mjs`, and scoped CSS appended to `styles.css`. Existing presenter controls are retained and remain visible throughout the finale.

Beat 7 has eleven controlled states; parallel channels and their possible convergence on pressure have separate clicks. Beat 8 has nineteen controlled states, including five progressively revealed human-confidence conditions. The complete eight-beat show has 71 states. The NAV final question advances only through normal Next, with Back returning to it. The exact final Ghost question holds indefinitely with Next disabled.

Tests and the six narrative/governance/source documents were updated for these final two beats. Financial scenario files `src/scenario.mjs` and `src/nav-scenario.mjs` are untouched. The pre-edit preservation contract verifies byte-identical stage markup for every accepted Beat 1–6 state and the full accepted CSS prefix.

## Financial fidelity

Six independent principals have distinct identities, objectives, constraints and mandates. No coordination, common controlling objective, mandate expansion or self-rewriting policy is required. The external shock precedes all first-wave decisions. Their contribution vectors calculate changes to fictional relative indicators; fixed role-specific second-wave rules consume that calculated state. Individual cumulative action budgets remain within mandate in both waves.

The funding gap distinguishes T0 equity execution, T+2 local-currency settlement, T0 FX execution with matched T+2 delivery, a separate T0 USD cash margin and an existing T+1 USD payment. These are selected fictional contracts, not universal market conventions. Separate institutional books avoid counting the same funding need three times. Internal reserves reduce freely deployable institutional cash; market-demand contributions apply only to the externally raised shortfall. Funding cost is separate from spot FX.

The default path moves from TIGHT after the first wave to STRESSED after the second. A dampened sensitivity variant contains the same shock and needs no additional second-wave action. Netting, opposing flows, dealer capacity, existing buffers and central-bank arrangements are explicit possible dampeners. No indices are represented as observed prices, calibrated forecasts or crisis probabilities.

BIS Project Logos is visibly attributed at the kicker and qualified in SHOW MORE as ongoing portfolio-agent research. The USD funding/FX/collateral sequence is an original Ghost synthetic extension. MAS, Governor Waller, BIS CGFS and FSB primary pages were successfully checked; their links, evidence types and limitations are in PUBLIC_SOURCES and the drawer. No institutional endorsement is claimed.

## Actual visual evidence

Local app: **http://127.0.0.1:4173/**, using the existing `npm run dev` server.

- [Screenshot index](artifacts/package3/SCREENSHOTS.md)
- [Contact sheet](artifacts/package3/contact-sheet.jpg)
- [First-wave decisions](artifacts/package3/7-first-wave.png)
- [Funding timing](artifacts/package3/7-funding-timing.png)
- [Second-wave feedback](artifacts/package3/7-second-wave.png)
- [BIS-qualified kicker](artifacts/package3/7-system-changed.png)
- [Independent dimensions](artifacts/package3/8-capability-authority.png)
- [Final question](artifacts/package3/8-final-question.png)
- [Short actual feedback animation](artifacts/package3/feedback.gif)
- [Normal window example](artifacts/package3/windowed-first-wave.png)

Screenshots come from the actual local HTML in native headless Chrome fullscreen at 1920×1080, with viewport emulation disabled. Still captures use reduced motion to settle each reveal; normal-motion interactions were separately tested. This is browser evidence, not physical conference-projector acceptance. Windowed 1440×1000 content centres the 1440×810 stage with equal 95px dark letterboxes. No target-size clipping or unwanted scrollbars were found.

The accepted opening is fully pixel-identical. The central-bank source and NAV warning stage regions are pixel-identical; small full-image differences are restricted to transient Pause/Play button states sampled at different animation lifecycle moments. See [comparison](artifacts/package3/baseline/pixel-comparison.json).

## Verification

- Baseline: **41 passed, 0 failed**.
- Final `npm test`: **53 passed, 0 failed**; [complete result](artifacts/package3/test-results.txt).
- `git diff --check`: passed.
- [Uninterrupted 71-state walkthrough](artifacts/package3/walkthrough.json): all eight beats, no browser errors or external application requests, no target-size clipping/scroll.
- [Interaction checks](artifacts/package3/interaction-checks.json): Play starts; human-only source initiation; Back/Next and NAV boundary; Home reset; fullscreen entry/exit; Replay; Pause freezes and Play resumes the flood, NAV timeline, first wave, second wave and kicker. Paused CSS snapshots remain identical over 250ms after allowing 50ms for style commit.
- Early drawers withhold later market states. Later evidence includes both waves, five primary-source links and research qualifications. Final SHOW MORE is hidden. Final Next/keyboard advance does not leave the question.
- [Default audit](artifacts/package3/systemic-audit.json) and [dampened audit](artifacts/package3/dampened-audit.json) retain reproducible actions, market states, timing assumptions and sources.

## Fidelity and material concerns

All approved reveal moments and exact final wording are present. No material narrative or financial deviation. The additional separate pressure click preserves the original useful parallel-transmission/convergence mechanic. No unresolved material defect identified in local tests or browser review. Beats 1–6 were preserved; no unrelated redesign or deployment was performed.

**PACKAGE 3 IMPLEMENTED LOCALLY — COMPLETE GHOST V3 AVAILABLE FOR CREATIVE AND EXECUTIVE REVIEW. NO COMMIT OR PUSH PERFORMED.**
