// Public-source interpretation only; no scenario inputs or decision rules.
const HKMA_PAPER = 'https://www.hkma.gov.hk/media/eng/doc/key-information/press-release/2026/20261102e3a1.pdf';
const link = (url, label) => `<p><a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a></p>`;

export function renderHkmaOversightEvidence() {
  return `<section><h3>HKMA · Agentic A.I. Governance discussion paper · November 2026</h3>
    <p><strong>§7.2 · Meaningful oversight.</strong> Formal approval alone is insufficient when the reviewer lacks substantive information, review capacity or time to challenge and intervene.</p>
    <p><strong>§8.1 · Proposed materiality assessment.</strong> A read-only supervisory deployment can be material when a critical operation depends on its accuracy; lack of write access does not remove that dependency.</p>
    <p>Exploratory discussion proposals, not binding supervisory guidance. Section 2.3 states that the paper creates no new obligations. These observations support the oversight question, not a regulatory finding about this synthetic case.</p>
    ${link(HKMA_PAPER, 'HKMA discussion paper · §§2.3, 7.2 and 8.1')}</section>`;
}

export function renderHkmaHarnessEvidence() {
  return `<section><h3>HKMA · Agentic A.I. Governance discussion paper · November 2026</h3>
    <p><strong>Intent-anchored accountability and risk-integrated agent harness · §§5.2–5.3, 6.2 and 7.1.</strong> The proposed approach connects business ownership of approved intent and permitted actions to technically enforced boundaries, independent control challenge and lifecycle testing.</p>
    <p>Exploratory discussion proposals, not binding supervisory guidance; §2.3 creates no new obligations.</p>
    ${link(HKMA_PAPER, 'HKMA discussion paper · intent, ownership, lifecycle and harness')}
    <h3>Practical application to the missing business rule</h3>
    <p>Recommended safeguards and tests for this failure pattern—not evidence that the fictional institution assigned these owners or obtained these approvals:</p>
    <p><strong>Incomplete business intent → business-owned scope → domain acceptance tests.</strong> Document the complete objective, permitted actions and policy exceptions; test entity, jurisdiction, effective date and exposure together.</p>
    <p><strong>Intent lost in implementation → enforceable harness checks → end-to-end negative tests.</strong> Translate approved policy into deterministic checks, limits and escalation paths; test that an unmatched condition cannot pass as permission.</p>
    <p><strong>Narrow review coverage → independent control challenge → complete-workflow testing.</strong> Challenge missing domain requirements and verify the workflow across component boundaries, including failure and fallback cases.</p>
    <p><strong>Authority creep → versioned tools and permissions → material-change tests.</strong> Reassess and approve capability expansion; test that unapproved tools, access and actions remain restricted.</p>
    <p>This scenario illustrates incomplete cross-domain requirements, not a demonstrated coding defect. Technical execution of a partial specification does not establish complete business coverage.</p></section>`;
}

export function renderBisResearchEvidence() {
  return `<section><h3>BIS · Project Logos · project page updated 4 June 2026</h3>
    <p>Simulation research compares rules-based and LLM portfolio managers, including conditions that amplify or dampen correlated allocation decisions.</p>
    <p>BIS Project Logos is ongoing research, not an established experimental finding about this funding sequence.</p>
    ${link('https://www.bis.org/project/logos', 'BIS Project Logos · portfolio decisions and correlation')}
    <h3>BIS · Project Agenti · project page updated 14 October 2026</h3>
    <p>An RTGS-like payment simulation explores agent-driven payment timing, intraday liquidity, possible delays, gridlock and resilience.</p>
    <p>Ongoing research, not proof that this demonstration’s specific mechanism has occurred or been experimentally established.</p>
    ${link('https://www.bis.org/node/87745', 'BIS Project Agenti · payments and intraday liquidity')}
    <h3>Demonstration · separate synthetic extension</h3>
    <p>The six-agent example combines market, FX, collateral, funding and settlement transmission. Neither BIS project validates this exact scenario or establishes an observed market incident.</p></section>`;
}
