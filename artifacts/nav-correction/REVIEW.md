# Surgical NAV correction — local review

Branch `feature/ghost-v3`, baseline `967394cff7327c5bfbc314a68e19d029dc793487`. Local changes only; no commit or push.

## Actual running-application screenshots

- [Recurring exception and amber conclusion · 1920×1080](nav-adaptation-1920x1080.png)
- [Four grounding references · 1920×1080](nav-grounding-1920x1080.png)
- [Windowed recurring exception](nav-adaptation-windowed.png)
- [Windowed grounding](nav-grounding-windowed.png)

Demo: http://127.0.0.1:4173/

The exact approval/confidence conclusion now follows TRIAGE PRIORITY 100 → 35, replacing the smaller explanations. The standalone financial-baseline reveal and its special Next handling are removed. Beat 6 now has seven principal reveals; the full show has 64. Reconstruction proceeds directly to grounding, then the existing override question.

## Verification

[75 tests pass](test-results.txt), from [73 before editing](baseline-tests.txt). A dedicated test compares the complete deterministic NAV scenario with the [accepted audit](baseline-nav-audit.json), including every financial value, triage result, actor, source and audit event. They are identical.

[Screen preservation comparison](preservation.json): only `nav-adaptation` and `nav-grounding` change; only `nav-baseline` is removed. Every other screen's markup is identical. Full opening-to-finale traversal reaches all 64 states without browser errors. Evidence open/close, Back, Next, Replay and final NAV hold are verified. Both modified screens are unclipped at fullscreen 1920×1080 and windowed 1440×1000. Existing presenter controls and other arcs are preserved.

## Sources and qualifications

- [Singapore AISI · 8 July 2026](https://sgaisi.sg/resources/how-should-evaluators-test-ai-systems-as-opposed-to-models/): evaluate systems in realistic deployment contexts, including integrations, memory, workflows, domain expertise and ongoing monitoring.
- [Google DeepMind · specification gaming](https://deepmind.google/blog/specification-gaming-the-flip-side-of-ai-ingenuity/): an objective or feedback signal can fail to capture the intended outcome. Ghost's deterministic triage error is not claimed to establish deception or deliberate specification gaming.
- [Google DeepMind · AI Control Roadmap](https://deepmind.google/blog/securing-the-future-of-ai-agents/): monitor coverage, detection recall and response time; do not assume that deploying a monitor establishes complete supervision.
- [IMDA agentic-governance framework and case studies](https://www.imda.gov.sg/-/media/imda/files/about/emerging-tech-and-research/artificial-intelligence/mgf-for-agentic-ai.pdf), v1.5 published 20 May 2026, updated 5 June: meaningful checkpoints, automation-bias safeguards and oversight audits. Tencent CodeBuddy's case requires fresh review of suspicious commands even when previously whitelisted.

The drawer links these sources and distinguishes their findings from Ghost recommendations: separate publication approval from method validation; preserve unresolved warnings; test priority feedback; protect material exceptions; periodically evaluate supervisory coverage. These are framework-informed design recommendations, not verbatim regulatory requirements or institutional validation of the demonstration.

Changed implementation files: `src/nav-theatre.mjs`, the reveal list only in `src/nav-scenario.mjs`, removal of obsolete NAV-only handling in `src/theatre.mjs`, and narrowly scoped NAV styling. Tests updated in `tests/nav.test.mjs` and `tests/presentation-flow.test.mjs`. Earlier evidence artifacts remain intact.

Awaiting review. No commit or push performed.
