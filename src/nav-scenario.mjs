// A deterministic teaching example, separate from GHOST-MAIN-001 and its authority gate.
export const NAV_IDENTITIES = Object.freeze({
  valuation: 'NAV-AGENT-FUND-ADMIN-01',
  monitor: 'NAV-AGENT-METHOD-MONITOR-01',
  human: 'NAV-HUMAN-REVIEWER-01',
  release: 'NAV-WORKFLOW-RELEASE-01',
  specialist: 'NAV-SPECIALIST-INDEPENDENT-01',
});
export const NAV_POLICY = Object.freeze({
  id: 'NAV-POLICY-01',
  objective: 'Prepare an accurate daily NAV within the publication deadline, applying the fund\'s valuation procedures and minimising unnecessary manual exceptions. Reuse an accepted method unless new evidence requires review (inadequately bounded).',
  dailyMovementThresholdPercent: 1,
  thresholdMeaning: 'Fictional internal daily NAV movement threshold; not a regulatory NAV-error tolerance or an acceptable valuation-error limit.',
  warningAuthority: 'advisory',
  warningBlocksPublication: false,
  proxyPermittedWhen: 'Appropriate valuation techniques, including proxies, may be used when documented and justified under specified circumstances.',
  missingControl: 'The implementation permits repeated proxy adjustment without adequate revalidation. Publication-specific approval is inappropriately generalised by adaptive triage; unresolved concerns are not protected from de-prioritisation or independently re-escalated.',
});
export const NAV_REVEALS = Object.freeze([
  'nav-introduction', 'nav-monday', 'nav-adaptation', 'nav-week',
  'nav-reconstruction', 'nav-baseline', 'nav-grounding', 'nav-override',
]);
// Bounded synthetic triage update, not model training. The defective signal is
// publication approval: its limited scope does not validate the methodology.
export function updateNavPriority(priority, approval) {
  const confidenceIncrement = approval?.approved && approval.scope === 'Monday publication only' ? 0.65 : 0;
  return { concernId: 'NAV-METHOD-CONCERN-01', previousPriority: priority, confidenceBefore: 0, confidenceAfter: confidenceIncrement, confidenceIncrement,
    priority: Math.round(priority * (1 - confidenceIncrement)),
    feedbackId: confidenceIncrement ? approval.id : null,
    interpretation: confidenceIncrement ? 'Publication accepted; recurring methodology concern treated as lower-value escalation' : 'No qualifying approval feedback; priority unchanged',
    issueStatus: 'unresolved', permissions: 'Triage only; no valuation-policy, mandatory-control or release-authority changes' };
}
export function resolveNavConcern({actor, evidenceId, finding}) {
  if (actor !== NAV_IDENTITIES.specialist || !evidenceId || !finding) throw new Error('Specialist finding and evidence required');
  return {kind:'SPECIALIST_METHOD_RESOLUTION', actor, evidenceId, finding, status:'resolved'};
}
export const NAV_WARNING = 'VALUATION METHOD REQUIRES REVIEW';

export function checkNavMovement(current, previous, thresholdPercent) {
  const percent = (current - previous) / previous * 100;
  return { percent, thresholdPercent, investigationRequired: Math.abs(percent) > thresholdPercent };
}
export function decideNavPublication({ reconciled, movementInvestigationRequired, humanApproved, warning, policy = NAV_POLICY }) {
  const blockedByWarning = Boolean(warning && policy.warningBlocksPublication);
  return { approved: reconciled && !movementInvestigationRequired && humanApproved && !blockedByWarning,
    blockedByWarning, policyId: policy.id, authority: 'configured-human-approved-release' };
}

export function buildNavScenario({ mondayApproved = true } = {}) {
  const fund = { id: 'GHOST-NAV-001', name: 'Ghost Demonstration Fund', fictional: true,
    type: 'Daily-dealing open-ended investment fund', currency: 'USD', units: 2_000_000,
    initialAssetA: 100_000_000, initialAssetB: 100_000_000, liabilities: 0,
    assumptions: ['Two investment positions only.', 'No subscriptions, redemptions, distributions, fees, liabilities, FX movements or other NAV changes during the five-day example.'] };
  const initial = { id: 'NAV-INITIAL-01', date: '2026-10-30', assetA: fund.initialAssetA,
    assetB: fund.initialAssetB, total: fund.initialAssetA + fund.initialAssetB,
    navPerUnit: (fund.initialAssetA + fund.initialAssetB) / fund.units };
  const sources = [
    { id: 'NAV-SOURCE-A', description: 'Synthetic independently priced liquid security. Supportable Asset A value remains USD 100 million.' },
    { id: 'NAV-SOURCE-B', description: 'Synthetic hard-to-value security with no direct observable price. A separate observable market proxy rises 0.8% daily; suitability for this security remains unvalidated.' },
    { id: NAV_POLICY.id, description: NAV_POLICY.proxyPermittedWhen },
    { id: 'NAV-METHOD-DEFECT-01', description: 'Incorrect implementation: multiply the previous reported Asset B valuation by 1.008 each day; reuse is not adequately revalidated.' },
  ];
  const events = [];
  let priority = 100;
  let mondayApproval;
  let proxyLevel = 100;
  let previous = initial;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => {
    const key = day.slice(0, 3).toUpperCase();
    const date = '2026-11-' + String(index + 2).padStart(2, '0');
    const assetA = fund.initialAssetA;
    const proxy = {id: 'NAV-' + key + '-PROXY', previousLevel: proxyLevel, level: proxyLevel * 1.008, dailyRate: .008, observable: true, synthetic: true};
    proxyLevel = proxy.level;
    const feedback = index === 1 ? updateNavPriority(priority, mondayApproval) : null;
    if (feedback) priority = feedback.priority;
    // Deliberately defective method: a NEW uplift is applied to yesterday's already reported value.
    const assetB = previous.assetB * (1 + proxy.dailyRate);
    const total = assetA + assetB - fund.liabilities;
    const navPerUnit = total / fund.units;
    const movement = checkNavMovement(navPerUnit, previous.navPerUnit, NAV_POLICY.dailyMovementThresholdPercent);
    const id = suffix => `NAV-${key}-${suffix}`;
    const prepared = id('VALUATION');
    const warningId = id('WARNING');
    const warning = { id: warningId, concernId: 'NAV-METHOD-CONCERN-01', message: NAV_WARNING, authority: NAV_POLICY.warningAuthority,
      blocksPublication: NAV_POLICY.warningBlocksPublication, status: 'unresolved', repetition: index + 1, priority, prominentEscalation: priority >= 50,
      reason: 'The market proxy is observable, but its suitability for Asset B is not sufficiently validated; the prior reported valuation and the same method are being reused without adequate revalidation.',
      actor: NAV_IDENTITIES.monitor, valuationEventId: prepared, sourceIds: ['NAV-SOURCE-B', 'NAV-METHOD-DEFECT-01', NAV_POLICY.id] };
    const reconciliation = { passed: total === assetA + assetB - fund.liabilities && navPerUnit === total / fund.units,
      meaning: 'Mathematical consistency of recorded figures only; valuation assumptions are not validated.' };
    const approval = { id: id('APPROVAL'), actor: NAV_IDENTITIES.human, approved: index === 0 ? mondayApproved : true,
      scope: index === 0 ? 'Monday publication only' : day + ' publication only',
      methodologyValidated: false, specialistVerification: 'outstanding',
      acknowledgedWarningId: index === 0 ? warningId : null, specialistDeterminationAvailable: false,
      rationale: index === 0 ? (mondayApproved ? 'Provisional approval for Monday publication only, pending specialist verification; not indefinite approval of the proxy.' : 'Monday publication not approved; specialist verification outstanding.') : (warning.prominentEscalation ? 'Prominent unresolved methodology concern received; daily publication approved provisionally, specialist verification outstanding.' : 'Ordinary daily review pack approved; recurring concern remains in lower-priority audit evidence.') };
    if (index === 0) mondayApproval = approval;
    const publication = { id: id('PUBLICATION'), ...decideNavPublication({ reconciled: reconciliation.passed,
      movementInvestigationRequired: movement.investigationRequired, humanApproved: approval.approved, warning }) };
    // This closed synthetic release workflow publishes when its configured release decision permits it.
    publication.published = publication.approved;
    const record = { day, key, date, assetA, assetB, total, liabilities: fund.liabilities, units: fund.units,
      navPerUnit, previousAssetB: previous.assetB, previousNavPerUnit: previous.navPerUnit,
      priorReportedInputId: (previous.publication?.published ? previous.publication.id : previous.valuationEventId) ?? initial.id,
      priorValuationId: previous.valuationEventId ?? initial.id,
      valuationEventId: prepared, methodId: 'NAV-METHOD-DEFECT-01', proxyDailyRate: .008,
      proxy, feedback, movement, reconciliation, warning, approval, publication };
    const definitions = [
      ['PROXY', '08:55:00', 'OBSERVABLE_PROXY_RECORDED', 'NAV-SYNTHETIC-MARKET-SOURCE', [], proxy],
      ['VALUATION', '09:00:00', 'VALUATION_PREPARED', NAV_IDENTITIES.valuation, [record.priorReportedInputId, proxy.id],
        { proxyId: proxy.id, assetA, assetB, previousReportedAssetB: previous.assetB, rate: .008, total, navPerUnit, units: fund.units }],
      ['RECONCILIATION', '09:02:00', 'RECONCILIATION_PASSED', NAV_IDENTITIES.valuation, [prepared], reconciliation],
      ['MOVEMENT', '09:03:00', 'MOVEMENT_CHECK_PASSED', 'NAV-DETERMINISTIC-MOVEMENT-CHECK', [id('RECONCILIATION')], movement],
      ['WARNING', '09:05:00', 'AI_WARNING_RECORDED', NAV_IDENTITIES.monitor, [prepared, id('MOVEMENT')], warning],
      ['APPROVAL', '09:10:00', 'HUMAN_APPROVAL_RECORDED', NAV_IDENTITIES.human, [warningId, id('RECONCILIATION'), id('MOVEMENT')], approval],
      ['PUBLICATION', '09:15:00', publication.approved ? 'PUBLICATION_APPROVED' : 'PUBLICATION_WITHHELD', NAV_IDENTITIES.release, [approval.id], publication],
    ];
    if (feedback) definitions.splice(4, 0, ['PRIORITY', '09:04:00', 'SUPERVISORY_PRIORITY_UPDATED', NAV_IDENTITIES.monitor, feedback.feedbackId ? [feedback.feedbackId] : [], feedback]);
    for (const [suffix, time, kind, actor, parentIds, payload] of definitions) events.push({ id: id(suffix), day,
      at: `${date}T${time}Z`, kind, actor, parentIds, sourceIds: ['NAV-SOURCE-A', 'NAV-SOURCE-B', NAV_POLICY.id, record.methodId], payload });
    previous = record;
    return record;
  });
  // This independent comparison is established retrospectively, AFTER Friday's publication.
  const specialist = { id: 'NAV-SPECIALIST-RECONSTRUCTION', actor: NAV_IDENTITIES.specialist,
    establishedAt: '2026-11-06T17:00:00Z', retrospective: true, illustrative: true,
    assetA: fund.initialAssetA, assetB: fund.initialAssetB,
    total: fund.initialAssetA + fund.initialAssetB,
    navPerUnit: (fund.initialAssetA + fund.initialAssetB) / fund.units,
    conclusion: 'In this simplified example, Asset B should have remained USD 100 million; the observable proxy was unsuitable for Asset B; reconstruction supports USD 100 million throughout the synthetic week.',
    sourceIds: ['NAV-SOURCE-A', 'NAV-SOURCE-B', 'NAV-METHOD-DEFECT-01'] };
  const comparisons = days.map(day => ({ day: day.day,
    differencePerUnit: day.navPerUnit - specialist.navPerUnit,
    cumulativeDifferencePercent: (day.navPerUnit / specialist.navPerUnit - 1) * 100 }));
  events.push({ id: specialist.id, at: specialist.establishedAt, kind: 'SPECIALIST_RECONSTRUCTION_ESTABLISHED',
    actor: specialist.actor, parentIds: days.map(day => day.publication.id), sourceIds: specialist.sourceIds, payload: specialist });
  return { id: 'GHOST-NAV-001', version: '3.0', synthetic: true, fund, initial, policy: NAV_POLICY,
    identities: NAV_IDENTITIES, supervisoryPolicy: {objective:'Improve exception prioritisation and reduce repetitive low-value human escalations.', permitted:'Adapt triage priority using previous human review outcomes.', prohibited:['Change valuation policy','Waive mandatory controls','Independently approve publication'], syntheticPriorityScale:'0–100; prominent escalation at 50 or above; illustrative, not calibrated'}, sources, days, events, specialist, comparisons,
    summary: { movementPassed: days.filter(d => !d.movement.investigationRequired).length,
      reconciliationsPassed: days.filter(d => d.reconciliation.passed).length,
      approvals: days.filter(d => d.approval.approved).length,
      publications: days.filter(d => d.publication.approved).length,
      unresolvedWarnings: days.filter(d => d.warning.status === 'unresolved').length,
      fridayTotal: days.at(-1).total, fridayNavPerUnit: days.at(-1).navPerUnit,
      cumulativeDifferencePercent: comparisons.at(-1).cumulativeDifferencePercent } };
}
