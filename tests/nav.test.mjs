import test from 'node:test';
import assert from 'node:assert/strict';
import { buildNavScenario, checkNavMovement, decideNavPublication, NAV_IDENTITIES, NAV_POLICY, NAV_REVEALS } from '../src/nav-scenario.mjs';
import { renderNav, renderNavEvidence } from '../src/nav-theatre.mjs';
import { CUES, createPresentationState, currentReveal, transition } from '../src/presentation.mjs';
const near = (actual, expected, tolerance = 1e-8) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);

test('NAV arithmetic compounds the reported hard-to-value asset without rounding inputs', () => {
  const run = buildNavScenario();
  assert.deepEqual(run, buildNavScenario());
  assert.equal(run.initial.total, 200_000_000);
  assert.equal(run.fund.units, 2_000_000);
  assert.equal(run.initial.navPerUnit, 100);
  const expectedB = [100800000, 101606400, 102419251.2, 103238605.2096, 104064514.0512768];
  const expectedNav = ['100.4000','100.8032','101.2096','101.6193','102.0323'];
  run.days.forEach((day, i) => {
    const previous = i ? run.days[i-1] : run.initial;
    assert.equal(day.assetA, 100_000_000);
    assert.equal(day.previousAssetB, previous.assetB);
    assert.equal(day.assetB, previous.assetB * 1.008);
    assert.equal(day.navPerUnit, (day.assetA + day.assetB - day.liabilities) / day.units);
    assert.equal(day.previousNavPerUnit, previous.navPerUnit);
    near(day.assetB, expectedB[i], 1e-6);
    assert.equal(day.navPerUnit.toFixed(4), expectedNav[i]);
    if (i) assert.equal(day.priorReportedInputId, previous.publication.id);
  });
  assert.equal(run.summary.fridayNavPerUnit.toFixed(2), '102.03');
  near(run.summary.fridayTotal / 1e6, 204.0645140512768);
});

test('the independent specialist benchmark is retrospective and the cumulative difference is derived', () => {
  const run = buildNavScenario();
  assert.equal(run.specialist.navPerUnit, 100);
  assert.equal(run.specialist.total, 200_000_000);
  assert.equal(run.specialist.assetB, 100_000_000);
  assert.ok(run.specialist.retrospective && run.specialist.illustrative);
  assert.ok(run.specialist.establishedAt > run.events.find(e => e.id === run.days.at(-1).publication.id).at);
  assert.equal(run.events.at(-1).id, run.specialist.id);
  near(run.summary.cumulativeDifferencePercent, (run.summary.fridayNavPerUnit - 100) / 100 * 100);
  assert.equal(run.summary.cumulativeDifferencePercent.toFixed(2), '2.03');
  assert.notEqual(run.days.at(-1).assetB, run.specialist.assetB * 1.008, 'Friday uses previous reported value, not the reconstructed benchmark');
});

test('movement checking measures consecutive NAV changes, not regulatory error tolerance', () => {
  const run = buildNavScenario();
  const expected = ['0.4000','0.4016','0.4032','0.4048','0.4064'];
  run.days.forEach((day, i) => {
    assert.equal(day.movement.percent.toFixed(4), expected[i]);
    assert.ok(Math.abs(day.movement.percent) < 1);
    assert.equal(day.movement.investigationRequired, false);
    assert.equal(day.movement.thresholdPercent, 1);
  });
  assert.equal(checkNavMovement(101, 100, 1).investigationRequired, false);
  assert.equal(checkNavMovement(99, 100, 1).investigationRequired, false);
  assert.equal(checkNavMovement(101.001, 100, 1).investigationRequired, true);
  assert.equal(checkNavMovement(98.999, 100, 1).investigationRequired, true);
  assert.match(NAV_POLICY.thresholdMeaning, /not a regulatory NAV-error tolerance/);
});

test('reconciliation proves recorded arithmetic while leaving the pricing-method question open', () => {
  const run = buildNavScenario();
  for (const day of run.days) {
    assert.equal(day.reconciliation.passed, true);
    assert.match(day.reconciliation.meaning, /assumptions are not validated/);
    assert.equal(day.warning.status, 'unresolved');
  }
  assert.equal(run.summary.reconciliationsPassed, 5);
  assert.equal(run.summary.publications, 5);
  assert.notEqual(run.summary.fridayNavPerUnit, run.specialist.navPerUnit);
});

test('each advisory warning precedes the human approval and publication in an attributable audit', () => {
  const run = buildNavScenario();
  const kinds = ['VALUATION_PREPARED','RECONCILIATION_PASSED','MOVEMENT_CHECK_PASSED','AI_WARNING_RECORDED','HUMAN_APPROVAL_RECORDED','PUBLICATION_APPROVED'];
  assert.equal(run.events.length, 31);
  assert.equal(new Set(run.events.map(e=>e.id)).size, run.events.length);
  assert.equal(new Set(Object.values(NAV_IDENTITIES)).size, Object.values(NAV_IDENTITIES).length);
  assert.deepEqual(run.events.map(e=>e.at), run.events.map(e=>e.at).toSorted());
  for (const day of run.days) {
    const events = run.events.filter(e=>e.day===day.day);
    assert.deepEqual(events.map(e=>e.kind), kinds);
    assert.equal(events[0].actor, NAV_IDENTITIES.valuation);
    assert.equal(events[3].actor, NAV_IDENTITIES.monitor);
    assert.equal(events[4].actor, NAV_IDENTITIES.human);
    assert.ok(events[3].at < events[4].at && events[4].at < events[5].at);
    assert.ok(events[4].parentIds.includes(day.warning.id));
    assert.ok(events[5].parentIds.includes(day.approval.id));
    assert.equal(day.approval.acknowledgedWarningId, day.warning.id);
    assert.equal(day.approval.specialistDeterminationAvailable, false);
    assert.equal(day.warning.authority, 'advisory');
    assert.equal(day.warning.blocksPublication, false);
    assert.equal(day.publication.blockedByWarning, false);
    assert.equal(day.publication.approved, true);
    assert.equal(day.publication.published, true);
    assert.ok(day.warning.sourceIds.every(id=>run.sources.some(s=>s.id===id)));
  }
  assert.equal(run.summary.unresolvedWarnings, 5);
  assert.deepEqual(run.days.map(d=>d.warning.repetition), [1,2,3,4,5]);
});

test('publication follows explicit policy and approval rather than a monitor bypass', () => {
  const input = { reconciled:true, movementInvestigationRequired:false, humanApproved:true, warning:{status:'unresolved'} };
  assert.equal(decideNavPublication(input).approved, true);
  assert.equal(decideNavPublication({...input,humanApproved:false}).approved, false);
  assert.equal(decideNavPublication({...input,reconciled:false}).approved, false);
  assert.equal(decideNavPublication({...input,movementInvestigationRequired:true}).approved, false);
  assert.equal(decideNavPublication({...input,policy:{...NAV_POLICY,warningBlocksPublication:true}}).approved, false);
});

test('warning and independent benchmark arrive only at their intended dramatic reveals', () => {
  for (let step=0;step<4;step++) {
    assert.doesNotMatch(renderNav(step), /WARNING|NON-BLOCKING|UNRESOLVED|SPECIALIST|RECONSTRUCTION|2\.03%|BASELINE/);
    assert.doesNotMatch(renderNavEvidence(step), /VALUATION METHOD REQUIRES REVIEW|SPECIALIST|specialist reconstruction|2\.03%/);
  }
  assert.match(renderNav(4), /AI WARNING: VALUATION METHOD REQUIRES REVIEW/);
  for(let step=0;step<8;step++) {
    assert.doesNotMatch(renderNav(step), /SPECIALIST RECONSTRUCTION/);
    assert.doesNotMatch(renderNavEvidence(step), /Retrospective specialist comparison/);
  }
  assert.match(renderNav(8), /SPECIALIST RECONSTRUCTION/);
  assert.match(renderNav(8), /Established after Friday’s publication/);
  assert.match(renderNavEvidence(8), /AFTER Friday publication/);
  assert.match(renderNav(9), /YESTERDAY'S ERROR/);
  assert.match(renderNav(9), /BECAME TODAY'S BASELINE/);
  assert.match(renderNav(10), /2\.03%/);
  assert.match(renderNav(11), /HUMAN APPROVAL ≠.*CORRECT VALUATION/);
});

test('three controls are separately revealed and jurisdictional limits are explicit', () => {
  assert.doesNotMatch(renderNav(5), /MOVEMENT|VALUATION/);
  assert.doesNotMatch(renderNav(6), /UNRESOLVED/);
  assert.match(renderNav(6), /FICTIONAL INTERNAL DAILY MOVEMENT THRESHOLD/);
  assert.match(renderNav(7), /VALUATION.*UNRESOLVED/);
  assert.match(renderNav(12), /WHO CHECKS THE CHECKER'S BASELINE/);
  assert.match(renderNav(12), /CSSF 24\/856 · Luxembourg/);
  const evidence=renderNavEvidence(12);
  assert.match(evidence, /paragraph 38/);
  assert.match(evidence, /not a universally applicable rule/);
  assert.match(evidence, /distinct from this example/);
  assert.match(evidence, /OWASP is neither an accounting standard nor a financial regulator/);
});

test('Beat 6 question holds until ordinary Next enters Beat 7', () => {
  assert.equal(CUES.length, 8);
  assert.equal(CUES[5].id, 'nav');
  assert.deepEqual(CUES[5].steps, NAV_REVEALS);
  let state={...createPresentationState(),cueIndex:5};
  for(let i=1;i<NAV_REVEALS.length;i++) {
    state=transition(state,'next');
    assert.equal(state.cueIndex,5);
    assert.equal(currentReveal(state),NAV_REVEALS[i]);
  }
  assert.equal(currentReveal(state),'nav-override');
  assert.match(renderNav(state.step), /IF THE HUMAN CAN BE WRONG/);
  assert.match(renderNav(state.step), /WHO SHOULD HAVE THE FINAL POWER/);
  assert.doesNotMatch(renderNav(state.step), /USD|LIQUIDITY|WHERE DOES INTELLIGENCE END/);
  state=transition(state,'next');
  assert.equal(currentReveal(state),'independent-agents');
  for(const _ of CUES[6].steps) state=transition(state,'next');
  assert.equal(currentReveal(state),'supervision-informs');
});
