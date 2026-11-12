# Retrospective correction — local enhancement

Only the existing retrospective-question screen and its evidence content were revised. Existing uncommitted NAV work was preserved. Branch: `feature/ghost-v3`; HEAD unchanged at `986a9984eb61ec53e44c5985887fe09d36f0cc86`. No commit or push performed.

- [Actual 1920×1080 screenshot](screen-1920x1080.png)
- [Evidence drawer](evidence-drawer.png)
- [Windowed screenshot](screen-windowed.png)
- [73 passing tests](test-results.txt), up from [72 before this enhancement](baseline-tests.txt)

The original hero and VIEW HISTORICAL REVIEW control remain. LOOK BACK, FIX FORWARD and the discreet MAS / Singapore AI Verify reference were added. NIST appears only in the drawer. All 64 other rendered states match their pre-enhancement hashes. No new state, scenario change or navigation change was introduced. Fullscreen and windowed rendering show no clipping or scrolling; Back, Next, Replay and drawer open/close pass with no browser errors.

Primary sources verified for the drawer:

- [MAS AIRM](https://www.mas.gov.sg/regulation/guidelines/guidelines-on-artificial-intelligence-risk-management-for-financial-institutions): evaluation §§5.14–5.15, monitoring and incident management §5.23, re-validation §5.24, change management §5.25. Published 7 October 2026; effective 7 October 2027.
- [AI Verify Testing Framework](https://aiverifyfoundation.sg/tools/ai-verify-testing-framework/): Reproducibility, Accountability, Human Agency & Oversight, with processes validated through documentary evidence.
- [NIST SSDF v1.1](https://csrc.nist.gov/pubs/sp/800/218/final): RV.3 root-cause remediation; PW.8.2 example 3 incorporates previously reported vulnerabilities into tests to prevent recurrence.

Historical impact tracing, authorised replay and financial-rule regression testing are practical Ghost recommendations informed by these sources. They are not represented as blanket AI Verify requirements or a NIST financial replay mandate. Existing original-date evidence, policy applicability and authority safeguards remain intact.
