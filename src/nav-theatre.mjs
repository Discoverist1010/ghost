import { buildNavScenario, NAV_REVEALS } from './nav-scenario.mjs';

export const navRun = buildNavScenario();
const money = (value, digits = 2) => '$' + value.toFixed(digits);
const pct = (value, digits = 4) => (value >= 0 ? '+' : '') + value.toFixed(digits) + '%';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const check = '<span class="nav-check" aria-hidden="true">✓</span>';
const icon = (name) => {
  const paths = {
    calendar: '<rect x="4" y="6" width="24" height="23" rx="3"/><path d="M10 3v7m12-7v7M4 14h24M13 20h6m-3-3v7"/>',
    accounting: '<rect x="6" y="3" width="20" height="26" rx="2"/><path d="M10 8h12M10 14h2m4 0h2m4 0h1M10 20h2m4 0h2m4 0h1M10 25h2m4 0h2m4 0h1"/>',
    movement: '<path d="M5 27V17h5v10m5 0V11h5v16m5 0V4h5v23M3 11l8-6 8 2 9-6"/>',
    valuation: '<path d="M16 3L2 10l14 7 14-7L16 3ZM2 17l14 7 14-7M2 24l14 7 14-7"/>',
  };
  return '<svg class="nav-icon" viewBox="0 0 32 34" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' + paths[name] + '</svg>';
};
const header = '<header class="nav-header"><div>REGULATOR<span>//GHOST V3</span><i></i><small>The NAV That Became Its Own Truth</small></div><p>AUTONOMOUS AI &nbsp;//&nbsp; FUND ADMINISTRATION</p></header>';

function successes(compact = false) {
  const counts = navRun.summary;
  const rows = [[counts.movementPassed, 'DAILY MOVEMENT CHECKS PASSED'], [counts.reconciliationsPassed, 'RECONCILIATIONS PASSED'],
    [counts.approvals, 'HUMAN APPROVALS RECORDED'], [counts.publications, 'NAV PUBLICATIONS APPROVED']];
  return '<div class="nav-successes' + (compact ? ' nav-successes--compact' : '') + '">' + rows.map(([n, text]) =>
    '<p>' + check + '<span><strong>' + n + ' / ' + navRun.days.length + '</strong> ' + text + '</span></p>').join('') + '</div>';
}
function timeline() {
  return '<h1 class="nav-heading">FIVE CONSECUTIVE VALUATIONS</h1><div class="nav-timeline">' + navRun.days.map((day, index) =>
    '<div class="nav-day-wrap" style="--nav-delay:' + (index * .55) + 's">' +
    (index ? '<span class="nav-day-arrow" aria-hidden="true">›</span>' : '') +
    '<article class="nav-day" data-publication-id="' + day.publication.id + '"><h2>' + day.key + '</h2><strong>' + money(day.navPerUnit) + '</strong><span>(' + pct(day.movement.percent) + ')</span>' + check + '</article></div>'
  ).join('') + '</div><p class="nav-timeline-caption">EACH DAY: RECONCILED · MOVEMENT CHECK PASSED · HUMAN APPROVED · PUBLISHED</p>';
}
function controlRows(visible) {
  const rows = [
    ['accounting', 'ACCOUNTING', 'Did the recorded figures reconcile?', 'YES', ''],
    ['movement', 'MOVEMENT', 'Did today’s NAV change exceed ' + navRun.policy.dailyMovementThresholdPercent + '%?', 'NO', 'FICTIONAL INTERNAL DAILY MOVEMENT THRESHOLD'],
    ['valuation', 'VALUATION', 'Was the underlying pricing method independently justified?', 'UNRESOLVED', ''],
  ];
  return '<h1 class="nav-heading">WHAT WAS THE SYSTEM CHECKING?</h1><div class="nav-controls-explained">' + rows.slice(0, visible).map(([symbol, label, question, answer, note], index) =>
    '<section class="nav-control-row' + (index === 2 ? ' nav-unresolved' : '') + '">' + icon(symbol) + '<h2>' + label + '</h2><p>' + question + (note ? '<small>' + note + '</small>' : '') + '</p><strong>' + (index === 2 ? '△ ' : '✓ ') + answer + '</strong></section>'
  ).join('') + '</div>';
}
function chart() {
  const x = i => 170 + i * 190;
  const floor = Math.floor(navRun.specialist.navPerUnit) - 1;
  const ceiling = Math.ceil(navRun.summary.fridayNavPerUnit);
  const y = n => 330 - (n - floor) / (ceiling - floor) * 270;
  const points = navRun.days.map((d, i) => x(i) + ',' + y(d.navPerUnit));
  const referenceY = y(navRun.specialist.navPerUnit);
  return '<h1 class="nav-heading">FIVE DAILY PUBLICATIONS.</h1><div class="nav-chart">' +
    '<svg viewBox="0 0 1100 405" role="img" aria-label="Published NAV rises over five days; a later independent specialist reconstruction is 100 dollars per unit.">' +
    Array.from({length: ceiling - floor + 1}, (_, i) => floor + i).map(n => '<g class="nav-grid"><line x1="100" y1="' + y(n) + '" x2="1000" y2="' + y(n) + '"/><text x="83" y="' + (y(n) + 7) + '">' + n.toFixed(2) + '</text></g>').join('') +
    '<polyline class="nav-chart-line" pathLength="1" points="' + points.join(' ') + '"/>' +
    navRun.days.map((d, i) => '<g class="nav-chart-point" style="--nav-delay:' + (.3 + i * .45) + 's"><circle cx="' + x(i) + '" cy="' + y(d.navPerUnit) + '" r="7"/><text x="' + x(i) + '" y="' + (y(d.navPerUnit) - 25) + '">' + money(d.navPerUnit) + '</text></g><text class="nav-chart-day" x="' + x(i) + '" y="375">' + d.key + '</text>').join('') +
    '<g class="nav-chart-specialist"><line x1="170" x2="930" y1="' + referenceY + '" y2="' + referenceY + '"/>' + navRun.days.map((_, i) => '<circle cx="' + x(i) + '" cy="' + referenceY + '" r="5"/>').join('') + '<text x="1010" y="' + (referenceY + 8) + '">' + money(navRun.specialist.navPerUnit) + '</text></g></svg>' +
    '<div class="nav-chart-legend"><p><span class="nav-legend-dot"></span>PUBLISHED NAV <small>Fund Administration Agent</small></p><p class="nav-specialist-label"><span class="nav-legend-dot"></span>SPECIALIST RECONSTRUCTION <strong>' + money(navRun.specialist.navPerUnit) + '</strong><small>Established after Friday’s publication</small></p></div></div>';
}

export function renderNav(step) {
  if (!NAV_REVEALS[step]) throw new Error('Unknown NAV reveal: ' + step);
  const monday = navRun.days[0];
  let body;
  switch (step) {
    case 0: body = '<div class="nav-introduction"><div class="nav-intro-copy"><h1>DAILY NAV.<br>PUBLICATION<br>DEADLINE.</h1><p>An AI agent values assets, reconciles accounts and prepares the fund NAV for publication.</p></div><div class="nav-agent-stack"><div class="nav-agent-card"><strong>AI</strong><span>Fund Admin Agent</span></div></div><div class="nav-workflow">' + ['Valuation', 'Reconciliation', 'Checks', 'Approval', 'Publication'].map((s, i) => '<p style="--nav-delay:' + i * .3 + 's">' + check + s + '</p>').join('') + '</div></div>'; break;
    case 1: body = '<div class="nav-monday"><div class="nav-monday-value"><p class="nav-day-title">' + icon('calendar') + 'MONDAY</p><h1>NAV PER UNIT:</h1><strong class="nav-price">' + money(monday.navPerUnit) + '</strong></div><div class="nav-monday-checks">' + [
      ['RECONCILIATION PASSED', 'NAV-MON-RECONCILIATION'],
      ['DAILY MOVEMENT CHECK PASSED <small>(' + pct(monday.movement.percent) + ')</small>', 'NAV-MON-MOVEMENT'],
      ['HUMAN APPROVAL RECORDED', monday.approval.id], ['PUBLICATION APPROVED', monday.publication.id],
    ].map(([s, id], i) => '<p style="--nav-delay:' + (.35 + i * .5) + 's" data-event-id="' + id + '">' + check + '<span>' + s + '</span></p>').join('') + '</div></div>'; break;
    case 2: body = timeline(); break;
    case 3: body = successes(); break;
    case 4: body = successes(true) + '<div class="nav-warning" data-warning-count="' + navRun.summary.unresolvedWarnings + '"><span aria-hidden="true">△</span><div><h1>AI WARNING: ' + navRun.days[0].warning.message + '</h1><p>WARNING RECORDED. NON-BLOCKING.</p><small>' + navRun.summary.unresolvedWarnings + ' ADVISORY WARNINGS REMAINED UNRESOLVED.</small></div></div>'; break;
    case 5: case 6: case 7: body = controlRows(step - 4); break;
    case 8: body = chart(); break;
    case 9: body = '<h1 class="nav-baseline-punch"><span>YESTERDAY\'S ERROR </span><strong>BECAME TODAY\'S BASELINE.</strong></h1><p class="nav-baseline-support">EACH DAY PASSED. THE ERROR ACCUMULATED.</p><p class="nav-method-link">PREVIOUS REPORTED ASSET B × ' + (1 + navRun.days[0].proxyDailyRate).toFixed(3) + ' → NEXT REPORTED ASSET B</p>'; break;
    case 10: body = '<p class="nav-cumulative-kicker">ONE WEEK <span>·</span> FIVE APPROVALS</p><h1 class="nav-cumulative-value">' + navRun.summary.cumulativeDifferencePercent.toFixed(2) + '%</h1><p class="nav-cumulative-label">CUMULATIVE NAV DIFFERENCE</p><p class="nav-movement-punch">NO SINGLE DAY TRIGGERED THE ' + navRun.policy.dailyMovementThresholdPercent + '% MOVEMENT CHECK.</p><p class="nav-cumulative-note">Fictional internal daily movement check · Independent difference now requires investigation.</p>'; break;
    case 11: body = '<div class="nav-governance"><h1>HUMAN APPROVAL ≠<br><strong>CORRECT VALUATION</strong></h1><h1>AI WARNING ≠<br><strong>EFFECTIVE CONTROL</strong></h1><p>THE CHECKS PASSED. THE ASSUMPTION DID NOT.</p></div>'; break;
    case 12: body = '<h1 class="nav-grounding-question">WHO CHECKS THE CHECKER\'S BASELINE?</h1><div class="nav-regulatory-anchors"><p><strong>IOSCO 2026:</strong> Documented and consistently applied fund valuation methods, independent oversight, review and appropriate price-override controls.</p><p><strong>CSSF 24/856 · Luxembourg:</strong> Successive untreated NAV calculation errors can become significant when considered in aggregate.</p><p><strong>MAS AIRM / FSB:</strong> Effective lifecycle governance, monitoring, specialist capabilities and meaningful human oversight.</p></div>'; break;
    case 13: body = '<div class="nav-final"><p>IF THE HUMAN CAN BE WRONG,<br>AND THE AI CAN BE WRONG,</p><h1>WHO SHOULD HAVE THE FINAL POWER<br>TO OVERRIDE THE CONTROL—<br>AND ON WHAT EVIDENCE?</h1></div>'; break;
  }
  return '<div class="nav-scene nav-scene--' + step + '" data-nav-reveal="' + NAV_REVEALS[step] + '">' + header + body + '</div>';
}

const detail = (label, text) => '<div class="detail-block"><div class="detail-key">' + escape(label) + '</div><div class="detail-value">' + escape(text) + '</div></div>';
const link = (url, label) => '<p><a href="' + url + '" target="_blank" rel="noopener noreferrer">' + label + '</a></p>';
export function renderNavEvidence(step) {
  let html = '<p>Deterministic synthetic teaching example. This view follows the presenter’s reveal order; it is not a complete audit export.</p>' +
    detail('Fund / assumptions', navRun.fund.name + ' — fictional daily-dealing open-ended fund. Two assets, initial USD 200 million, 2 million units, initial NAV USD 100. ' + navRun.fund.assumptions.join(' ')) +
    detail('Human-defined objective', navRun.policy.objective) +
    detail('Movement control — not valuation-error tolerance', navRun.policy.thresholdMeaning);
  if (step >= 1) {
    const days = step === 1 ? navRun.days.slice(0, 1) : navRun.days;
    html += days.map(d => detail(d.day + ' · publication ' + d.publication.id, money(d.navPerUnit, 4) + ' per unit; daily movement ' + pct(d.movement.percent) + '; reconciliation passed, human approval recorded, publication approved.')).join('');
  }
  if (step >= 4) html += detail('Defective method', 'Reported Asset B today = previous reported Asset B × 1.008. A new unsupported uplift is added every day to an already reported prior valuation; no independently verified new market information supports it. ' + navRun.policy.missingControl) +
    detail('Monitor / human / release', 'The valuation agent, monitor and human have separate identities. The monitor can read and report, not hold release. The reviewer receives an advisory warning but lacks a specialist valuation determination. Approval permits publication under NAV-POLICY-01; no agent bypasses permissions.') +
    detail('Unresolved warnings', navRun.summary.unresolvedWarnings + ' warnings remain in the source record; none was deleted or converted into an enforcement hold.') +
    '<h3>Original chronology · warning before approval</h3>' + navRun.events.filter(e => e.kind !== 'SPECIALIST_RECONSTRUCTION_ESTABLISHED').map(e => detail(e.id + ' · ' + e.at, e.kind + ' · ' + e.actor + ' · parents: ' + e.parentIds.join(', ') + (e.kind === 'AI_WARNING_RECORDED' ? ' · unresolved / advisory / non-blocking: ' + e.payload.reason : ''))).join('') +
    detail('Source records', navRun.sources.map(s => s.id + ': ' + s.description).join(' | '));
  if (step >= 8) html += detail('Retrospective specialist comparison', navRun.specialist.id + ' · ' + navRun.specialist.establishedAt + ' · ' + navRun.specialist.actor + '. Asset A and B each USD 100 million, total USD 200 million, NAV ' + money(navRun.specialist.navPerUnit, 4) + '. Established AFTER Friday publication, not a value every earlier reviewer already knew.') +
    detail('Unrounded Friday arithmetic', 'Asset B USD ' + navRun.days.at(-1).assetB + '; total USD ' + navRun.summary.fridayTotal + '; divided by ' + navRun.fund.units + ' units = USD ' + navRun.summary.fridayNavPerUnit + ' per unit. Cumulative difference ' + navRun.summary.cumulativeDifferencePercent + '%. Rounding is for display only.') +
    '<button type="button" class="drawer-button" data-action="download-nav">Export complete synthetic NAV audit</button>';
  if (step >= 12) html += '<h3>Primary-source grounding and limits</h3>' +
    detail('IOSCO June 2026', 'Recommendations on Valuing Collective Investment Schemes (CIS), final report. Updates and consolidates earlier principles. Supports documented methodologies, consistent application, independent oversight, review, back-testing and documented price overrides. Does not endorse this fictional case.') + link('https://www.iosco.org/library/pubdocs/pdf/IOSCOPD824.pdf', 'IOSCO 2026 final recommendations') +
    detail('CSSF paragraph 38 — Luxembourg example', 'Circular 24/856 recognises successive untreated NAV errors that individually lie below the applicable tolerance but can reach or exceed it in aggregate. This is a Luxembourg regulatory example, not a universally applicable rule; this fictional fund is not assumed to fall under it. Regulatory NAV-error tolerance is distinct from this example’s 1% day-to-day MOVEMENT threshold. No formal regulatory classification of this discrepancy is claimed.') + link('https://www.cssf.lu/wp-content/uploads/CSSF24_856eng.pdf', 'CSSF Circular 24/856 · paragraph 38') +
    detail('MAS AIRM / FSB', 'MAS AI Risk Management Guidelines §5.9 address lifecycle human oversight, capabilities, automation bias and decision fatigue (published 7 October 2026, effective 7 October 2027). FSB October final Sound Practices 4, 7, 9 and 10 address adaptability, data governance, performance management and human oversight.') + link('https://www.mas.gov.sg/regulation/guidelines/guidelines-on-artificial-intelligence-risk-management-for-financial-institutions', 'MAS AI Risk Management Guidelines') + link('https://www.fsb.org/2026/10/sound-practices-for-responsible-adoption-of-artificial-intelligence-ai-final-report/', 'FSB October 2026 final report') +
    detail('OWASP — technical guidance', 'Securing Agentic Applications V2 supports identity/access controls, bounded permissions, runtime monitoring/protection and assurance. A warning and the authority to enforce a hold are distinct. OWASP is neither an accounting standard nor a financial regulator.') + link('https://genai.owasp.org/resource/securing-agentic-applications-v2/', 'OWASP Securing Agentic Applications V2') +
    detail('Failure mechanisms', 'This case concerns an incomplete policy/implementation framework and repeated use of an unvalidated proxy. It does not establish hallucination, reward hacking or deliberate deception. Human approval is not specialist verification.');
  if (step === NAV_REVEALS.length - 1) html += '<button type="button" class="drawer-button" data-action="continue-legacy">View preserved V2 material →</button>';
  return html;
}
