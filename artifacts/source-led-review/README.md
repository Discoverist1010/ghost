# Source-led surgical patch · local review

Reviewed 13 November 2026 on `feature/ghost-v3`, based on accepted commit `a34a447`. No commit or push performed. The rebuilt local HTML is a review candidate; this work does not claim a new submission or PowerPoint handoff.

## Changes

- Added HKMA §7.2 meaningful-approval and §8.1 critical read-only dependency observations to the existing exception/supervision drawer.
- Added proposed intent/accountability/harness safeguards to VIEW REQUIREMENTS & TESTS. Business ownership, enforceable implementation, independent challenge and material-change controls are paired with operational tests. These are recommendations, not invented owner assignments or approvals in the fictional case.
- Replaced only the existing Logos reference block on NO AGENT FAILED / THE SYSTEM CHANGED with two equally weighted source/finding lines for Logos and Agenti. Two local CSS rules reuse the existing reference size, spacing and palette.
- Updated PUBLIC_SOURCES with primary links and source status. SAGE appears only in supporting documentation.
- Shared source-note renderers use existing heading, paragraph and link styling; no new drawer component or state is introduced.

Changed implementation/support files: `PUBLIC_SOURCES.md`, `src/source-notes.mjs` (new), `src/theatre.mjs`, `src/central-bank-theatre.mjs`, `src/systemic-theatre.mjs`, `styles.css`, `dist/demo.html`, `tests/material-case.test.mjs`, `tests/source-grounding.test.mjs` (new). This directory contains review evidence and the reproducible browser script.

## Primary-source checks

| Primary source | Checked finding | Status / qualification |
| --- | --- | --- |
| [HKMA discussion paper · November 2026](https://www.hkma.gov.hk/media/eng/doc/key-information/press-release/2026/20261102e3a1.pdf) | §§7.2 and 8.1: substantive review and critical monitoring dependency. §§5.2–5.3, 6.2 and 7.1: intent, ownership, lifecycle and enforceable harness boundaries. | §2.3: preliminary discussion proposals; not a statement of supervisory expectations; no new obligations. Distinct from separate supervisory guidance. |
| [HKMA SAGE launch · 2 November 2026](https://www.hkma.gov.hk/eng/news-and-media/press-releases/2026/11/20261102-4/) | Identity and delegated-authority verification, interoperability and agentic-finance use-case exploration; Expert Group established. | Launched initiative, not a completed universal identity standard or a new obligation. Documentation only. |
| [BIS Logos · updated 4 June 2026](https://www.bis.org/project/logos) | Planned controlled comparison of heuristic/rules-based and LLM portfolio managers and correlated allocation. | Ongoing exploratory simulation research; no finding validating the demo's funding mechanism. |
| [BIS Agenti · updated 14 October 2026](https://www.bis.org/node/87745) | RTGS-like agent simulation, payment timing, intraday liquidity, delays and gridlock. | Page explicitly marked ongoing; no proof of this specific six-agent example. |

Full primary-source text was retrieved and inspected. No unrelated source entries were revalidated or reclassified. Neither BIS project supplies the demonstration's calculations or establishes that this synthetic sequence occurred.

## Tests and preservation

- Baseline: 82/82 tests passed before editing. Final: 86/86, including four focused source-grounding tests.
- Eight beats, 51 states remain. The other 50 stage markups still match the historical accepted contract. Only the authorised BIS-reference state has a new expected hash; the historical fixture remains untouched.
- Existing immutable scenario-module hashes pass. Scores 76/39, illustrative 74%, sanctions determination, runtime ESCALATE, NAV arithmetic, six-agent behaviour, due-diligence recap and final question are unchanged.
- Fresh headless Chrome launched the actual `file://` standalone HTML with networking disabled, at 1920×1080 fullscreen. All 51 states and 44 contextual drawers worked. Two evidence exports downloaded. No HTTP requests or browser errors. One opening disclosure; audience branding absent. Final Next disabled; Back, Replay and Home worked.
- The ordinary browser tool's direct file navigation was blocked; the reproducible fresh-Chrome script below provided the actual offline file verification instead.
- Main-stage screenshot was visually inspected: both reference lines fit without clipping, use equal font size and retain the primary headline's dominance. Drawer paragraphs use existing legible typography; longer evidence remains scrollable as before.
- Development-server rendering also verified the new drawer links and existing human-triggered source/policy sequence. Animations were not altered; the ordinary-motion main stage was inspected before the deterministic reduced-motion offline walkthrough.

## Actual screenshots and repeatable evidence

- [Modified main stage · 1920×1080](system-changed-1920x1080.png)
- [HKMA oversight drawer](hkma-oversight-evidence-1920x1080.png)
- [HKMA requirements-and-testing drawer](hkma-requirements-evidence-1920x1080.png)
- [BIS research drawer](bis-evidence-1920x1080.png)
- [Offline final screen](final-offline.png)
- [Offline browser script](offline-review.js)

Standalone review build: 245,196 bytes, 13 embedded modules. SHA-256: `885018e88e70752091989f3c663acd3bdd7c94e06a21837321248ffa4ccdbd37`.

No narrative extension, new reveal, financial assumption, title, branding or main-stage disclaimer was added. External primary-source destinations still need connectivity; embedded evidence remains available offline. Awaiting creative review.
