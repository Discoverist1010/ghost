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
  objective: 'Prepare an accurate daily NAV within the publication deadline, applying the fund\'s valuation procedures and minimising unnecessary manual exceptions.',
  dailyMovementThresholdPercent: 1,
  thresholdMeaning: 'Fictional internal daily NAV movement threshold; not a regulatory NAV-error tolerance or an acceptable valuation-error limit.',
  warningAuthority: 'advisory',
  warningBlocksPublication: false,
  proxyPermittedWhen: 'Appropriate valuation techniques, including proxies, may be used when documented and justified under specified circumstances.',
  missingControl: 'The implementation permits repeated proxy adjustment without adequate revalidation, and unresolved methodology warnings do not impose a mandatory release hold.',
});
export const NAV_REVEALS = Object.freeze([
  'nav-introduction', 'nav-monday', 'nav-week', 'nav-success', 'nav-warning',
  'nav-control-accounting', 'nav-control-movement', 'nav-control-valuation',
  'nav-reconstruction', 'nav-baseline', 'nav-cumulative', 'nav-governance',
  'nav-grounding', 'nav-override',
]);
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

export function buildNavScenario() {
  const fund = { id: 'GHOST-NAV-001', name: 'Ghost Demonstration Fund', fictional: true,
    type: 'Daily-dealing open-ended investment fund', currency: 'USD', units: 2_000_000,
    initialAssetA: 100_000_000, initialAssetB: 100_000_000, liabilities: 0,
    assumptions: ['Two investment positions only.', 'No subscriptions, redemptions, distributions, fees, liabilities, FX movements or other NAV changes during the five-day example.'] };
  const initial = { id: 'NAV-INITIAL-01', date: '2026-10-30', assetA: fund.initialAssetA,
    assetB: fund.initialAssetB, total: fund.initialAssetA + fund.initialAssetB,
    navPerUnit: (fund.initialAssetA + fund.initialAssetB) / fund.units };
  const sources = [
    { id: 'NAV-SOURCE-A', description: 'Synthetic independently priced liquid security. Supportable Asset A value remains USD 100 million.' },
    { id: 'NAV-SOURCE-B', description: 'Synthetic hard-to-value security with limited observable prices; new independent market information for the daily proxy uplift has not been verified.' },
    { id: NAV_POLICY.id, description: NAV_POLICY.proxyPermittedWhen },
    { id: 'NAV-METHOD-DEFECT-01', description: 'Incorrect implementation: multiply the previous reported Asset B valuation by 1.008 each day; reuse is not adequately revalidated.' },
  ];
  const events = [];
  let previous = initial;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => {
    const key = day.slice(0, 3).toUpperCase();
    const date = '2026-11-' + String(index + 2).padStart(2, '0');
    const assetA = fund.initialAssetA;
    // Deliberately defective method: a NEW uplift is applied to yesterday's already reported value.
    const assetB = previous.assetB * 1.008;
    const total = assetA + assetB - fund.liabilities;
    const navPerUnit = total / fund.units;
    const movement = checkNavMovement(navPerUnit, previous.navPerUnit, NAV_POLICY.dailyMovementThresholdPercent);
    const id = suffix => `NAV-${key}-${suffix}`;
    const prepared = id('VALUATION');
    const warningId = id('WARNING');
    const warning = { id: warningId, message: NAV_WARNING, authority: NAV_POLICY.warningAuthority,
      blocksPublication: NAV_POLICY.warningBlocksPublication, status: 'unresolved', repetition: index + 1,
      reason: 'Asset B proxy uplift lacks independently verified new market support; the prior reported valuation and the same method are being reused without adequate revalidation.',
      actor: NAV_IDENTITIES.monitor, valuationEventId: prepared, sourceIds: ['NAV-SOURCE-B', 'NAV-METHOD-DEFECT-01', NAV_POLICY.id] };
    const reconciliation = { passed: total === assetA + assetB - fund.liabilities && navPerUnit === total / fund.units,
      meaning: 'Mathematical consistency of recorded figures only; valuation assumptions are not validated.' };
    const approval = { id: id('APPROVAL'), actor: NAV_IDENTITIES.human, approved: true,
      acknowledgedWarningId: warningId, specialistDeterminationAvailable: false,
      rationale: 'The reviewer received the advisory concern, reviewed the reconciled pack and daily movement result, and approved publication without a specialist valuation determination.' };
    const publication = { id: id('PUBLICATION'), ...decideNavPublication({ reconciled: reconciliation.passed,
      movementInvestigationRequired: movement.investigationRequired, humanApproved: approval.approved, warning }) };
    // This closed synthetic release workflow publishes when its configured release decision permits it.
    publication.published = publication.approved;
    const record = { day, key, date, assetA, assetB, total, liabilities: fund.liabilities, units: fund.units,
      navPerUnit, previousAssetB: previous.assetB, previousNavPerUnit: previous.navPerUnit,
      priorReportedInputId: previous.publication?.id ?? initial.id,
      priorValuationId: previous.valuationEventId ?? initial.id,
      valuationEventId: prepared, methodId: 'NAV-METHOD-DEFECT-01', proxyDailyRate: .008,
      movement, reconciliation, warning, approval, publication };
    const definitions = [
      ['VALUATION', '09:00:00', 'VALUATION_PREPARED', NAV_IDENTITIES.valuation, [record.priorReportedInputId],
        { assetA, assetB, previousReportedAssetB: previous.assetB, rate: .008, total, navPerUnit, units: fund.units }],
      ['RECONCILIATION', '09:02:00', 'RECONCILIATION_PASSED', NAV_IDENTITIES.valuation, [prepared], reconciliation],
      ['MOVEMENT', '09:03:00', 'MOVEMENT_CHECK_PASSED', 'NAV-DETERMINISTIC-MOVEMENT-CHECK', [id('RECONCILIATION')], movement],
      ['WARNING', '09:05:00', 'AI_WARNING_RECORDED', NAV_IDENTITIES.monitor, [prepared, id('MOVEMENT')], warning],
      ['APPROVAL', '09:10:00', 'HUMAN_APPROVAL_RECORDED', NAV_IDENTITIES.human, [warningId, id('RECONCILIATION'), id('MOVEMENT')], approval],
      ['PUBLICATION', '09:15:00', 'PUBLICATION_APPROVED', NAV_IDENTITIES.release, [approval.id], publication],
    ];
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
    conclusion: 'In this simplified example, Asset B should have remained USD 100 million; the automatic uplifts were unsupported.',
    sourceIds: ['NAV-SOURCE-A', 'NAV-SOURCE-B', 'NAV-METHOD-DEFECT-01'] };
  const comparisons = days.map(day => ({ day: day.day,
    differencePerUnit: day.navPerUnit - specialist.navPerUnit,
    cumulativeDifferencePercent: (day.navPerUnit / specialist.navPerUnit - 1) * 100 }));
  events.push({ id: specialist.id, at: specialist.establishedAt, kind: 'SPECIALIST_RECONSTRUCTION_ESTABLISHED',
    actor: specialist.actor, parentIds: days.map(day => day.publication.id), sourceIds: specialist.sourceIds, payload: specialist });
  return { id: 'GHOST-NAV-001', version: '2.0', synthetic: true, fund, initial, policy: NAV_POLICY,
    identities: NAV_IDENTITIES, sources, days, events, specialist, comparisons,
    summary: { movementPassed: days.filter(d => !d.movement.investigationRequired).length,
      reconciliationsPassed: days.filter(d => d.reconciliation.passed).length,
      approvals: days.filter(d => d.approval.approved).length,
      publications: days.filter(d => d.publication.approved).length,
      unresolvedWarnings: days.filter(d => d.warning.status === 'unresolved').length,
      fridayTotal: days.at(-1).total, fridayNavPerUnit: days.at(-1).navPerUnit,
      cumulativeDifferencePercent: comparisons.at(-1).cumulativeDifferencePercent } };
}
