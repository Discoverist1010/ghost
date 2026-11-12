# NAV arc local review — 12 November 2026

Implemented locally on `feature/ghost-v3`, HEAD `986a9984eb61ec53e44c5985887fe09d36f0cc86`. Verified root `/Users/macbookpro18/Desktop/CODE/active/ghost`; origin `https://github.com/Discoverist1010/ghost.git`. Fetch confirmed local and remote main/feature matched this accepted baseline. Started with a clean worktree and 70 passing tests. No commit, merge, push or PR performed.

The running demo is [http://127.0.0.1:4173/](http://127.0.0.1:4173/). The visible review browser is positioned at Beat 6's opening.

## Mechanism and financial fidelity

The valuation agent applies the observable synthetic proxy's 0.8% daily movement to previous reported Asset B. Suitability for Asset B remains unvalidated. Monday's warning precedes provisional human approval for Monday publication only, pending specialist verification. On Tuesday the supervisor incorrectly treats that limited approval as positive feedback about recurring escalation value: synthetic confidence 0 → 0.65; priority 100 → 35. The prominence threshold is 50. These are illustrative triage settings, not calibrated probabilities. Without Monday approval, priority remains 100. All five concerns remain unresolved; later ordinary approvals are not specialist validations.

The supervisor's permitted scope is triage adaptation only. Valuation policy, mandatory controls and release authority do not change. Separate specialist resolution requires an attributed finding and evidence. This is bounded deterministic feedback, not general model training, self-authorised objectives or intentional concealment.

| Day | Published NAV | Daily movement | Triage priority |
|---|---:|---:|---:|
| Monday | 100.40 | 0.4000% | 100 |
| Tuesday | 100.80 | 0.4016% | 35 |
| Wednesday | 101.21 | 0.4032% | 35 |
| Thursday | 101.62 | 0.4048% | 35 |
| Friday | 102.03 | 0.4064% | 35 |

Full-precision Friday NAV: **102.0322570256384**, from total assets **204,064,514.0512768** divided by **2,000,000** units. Retrospective specialist NAV: **100**; cumulative difference **2.0322570256384065%**. Each daily movement is below the fictional 1% movement threshold. Repeated proxy application adds error; merely carrying a one-time error forward would not necessarily do so.

The regenerated [37-event synthetic audit](nav-audit.json) has unique IDs, chronological timestamps, attributable actors and parent references. Each proxy observation precedes valuation; each concern precedes approval and release. Tuesday's feedback references Monday's limited approval. The specialist reconstruction occurs after Friday publication. Existing earlier audit artifacts and other arcs remain unchanged.

## Actual rendered evidence

All screenshots below come from the running HTML application at **1920×1080**, with document fullscreen and native Chrome fullscreen. Reduced-motion mode settles still captures; motion was tested separately under normal animation settings.

[All eight scenes — contact sheet](review-contact-sheet.jpg)

1. [Human-defined objectives](01-objectives.png)
2. [Monday proxy valuation and limited approval](02-monday.png)
3. [Supervisory priority reduction](03-adaptation.png)
4. [Five-day timeline and completed checks](04-week.png)
5. [Independent reconstruction](05-reconstruction.png)
6. [Financial and supervisory insight](06-insight.png), plus [first half before presenter reveal](06-insight-before.png)
7. [Regulatory grounding](07-grounding.png)
8. [Final override question](08-override.png)

[Adaptation motion](adaptation.gif) · [Five-day progression motion](five-day-progression.gif) · [Windowed insight](windowed-insight.png)

Reveal 6 first holds the financial conclusion. Next, Space or clicking its heading reveals the supervisory consequence on the same scene. The subsequent Next enters regulatory grounding. Replay resets this reveal; no timer exposes the conclusion. The final override question holds until presenter Next enters Beat 7; Back returns to it.

## Verification

- [Baseline: 70/70 tests](baseline/test-results.txt); [revised: 72/72 tests, zero failures](test-results.txt).
- Every non-NAV rendered state and protected source module matches the accepted baseline hash. All pre-existing CSS is preserved; new rules are scoped to revised NAV scenes.
- Fullscreen 1920×1080 and windowed 1440×1000: all eight NAV reveals checked; no clipped text, overlapping presenter controls or document scrolling.
- Uninterrupted opening-to-finale path: 65 principal states reached, including all eight beats, with the additional internal reveal at the NAV insight. No browser errors. Final Ghost question remains stable; Home resets.
- Actual Pause freezes animation times; Play resumes; Replay restarts. Back/Next, fullscreen, evidence open/close, staged export and actual audit download pass. No narrative auto-advance.
- Before reconstruction, ordinary evidence views/export controls do not disclose the specialist benchmark or cumulative discrepancy.
- Reproducible browser checks: [browser-review.js](browser-review.js), [capture-screens.js](capture-screens.js).

## Regulatory qualifications

The displayed anchors are qualified paraphrases. [IOSCO June 2026](https://www.iosco.org/library/pubdocs/pdf/IOSCOPD824.pdf) concerns fund valuation methods and oversight; its publication is also confirmed by the [CSSF notice](https://www.cssf.lu/en/2026/06/iosco-publishes-final-report-on-valuing-collective-investment-schemes-cis/). [CSSF 24/856 paragraph 38](https://www.cssf.lu/wp-content/uploads/CSSF24_856eng.pdf) is a Luxembourg example concerning successive untreated errors in aggregate. Its regulatory tolerances are distinct from the synthetic daily movement test. The example makes no formal regulatory determination of this discrepancy.

[MAS AIRM](https://www.mas.gov.sg/regulation/guidelines/guidelines-on-artificial-intelligence-risk-management-for-financial-institutions) was published 7 October 2026 and takes effect 7 October 2027. [FSB October 2026 sound practices](https://www.fsb.org/2026/10/sound-practices-for-responsible-adoption-of-artificial-intelligence-ai-final-report/) support performance evaluation and effective human oversight. OWASP remains technical assurance guidance, not a financial regulation. Full links and governance questions remain in SHOW MORE.

## Modified files and review status

Implementation: `src/nav-scenario.mjs`, `src/nav-theatre.mjs`, NAV-scoped additions to `styles.css`. Tiny integration in `src/theatre.mjs` makes Next reveal the insight before leaving and guards early NAV export. Tests: `tests/nav.test.mjs`, `tests/presentation-flow.test.mjs`, `tests/material-case.test.mjs` (new preservation contract protects all non-NAV arcs). NAV-only documentation additions: `01_storyboard.md`, `03_scenarios.md`, `05_runtime_governance.md`, `07_eval_harness.md`. Evidence and verification are under `artifacts/nav-revision/`.

All approved principal moments and exact central/final conclusions are present. No material narrative or financial deviation identified. No unresolved significant defect found in the tested desktop viewports. Creative and executive acceptance remains pending; no Git publication performed.

**NAV ARC REVISION IMPLEMENTED LOCALLY — AWAITING CREATIVE AND EXECUTIVE REVIEW. NO COMMIT OR PUSH PERFORMED.**
