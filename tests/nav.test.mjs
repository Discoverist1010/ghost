import test from 'node:test';
import assert from 'node:assert/strict';
import { buildNavScenario, checkNavMovement, decideNavPublication, NAV_IDENTITIES, NAV_POLICY, NAV_REVEALS, updateNavPriority, resolveNavConcern } from '../src/nav-scenario.mjs';
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
  assert.equal(run.events.length, 37);
  assert.equal(new Set(run.events.map(e=>e.id)).size, run.events.length);
  assert.equal(new Set(Object.values(NAV_IDENTITIES)).size, Object.values(NAV_IDENTITIES).length);
  assert.deepEqual(run.events.map(e=>e.at), run.events.map(e=>e.at).toSorted());
  for (const day of run.days) {
    const events = run.events.filter(e=>e.day===day.day);
    assert.deepEqual(events.filter(e=>!['OBSERVABLE_PROXY_RECORDED','SUPERVISORY_PRIORITY_UPDATED'].includes(e.kind)).map(e=>e.kind), kinds);
    const core = events.filter(e=>!['OBSERVABLE_PROXY_RECORDED','SUPERVISORY_PRIORITY_UPDATED'].includes(e.kind));
    assert.equal(core[0].actor, NAV_IDENTITIES.valuation);
    assert.equal(core[3].actor, NAV_IDENTITIES.monitor);
    assert.equal(core[4].actor, NAV_IDENTITIES.human);
    assert.ok(core[3].at < core[4].at && core[4].at < core[5].at);
    assert.ok(core[4].parentIds.includes(day.warning.id));
    assert.ok(core[5].parentIds.includes(day.approval.id));
    assert.equal(day.approval.acknowledgedWarningId, day.day === 'Monday' ? day.warning.id : null);
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

test('seven reveals withhold the retrospective comparison until after the five-day timeline', () => {
  assert.equal(NAV_REVEALS.length,7);
  assert.deepEqual(NAV_REVEALS,['nav-introduction','nav-monday','nav-adaptation','nav-week','nav-reconstruction','nav-grounding','nav-override']);
  assert.doesNotMatch(renderNav(0), /nav-check|PRIORITY REDUCED|RECONSTRUCTION/);
  assert.match(renderNav(1), /MONDAY NAV: \$100.40/);
  assert.match(renderNav(1), /MONDAY PUBLICATION ONLY/);
  assert.match(renderNav(2), /PRIORITY REDUCED/);
  assert.match(renderNav(3), /PUBLICATIONS APPROVED/);
  for(let step=0;step<4;step++) {
    assert.doesNotMatch(renderNav(step), /SPECIALIST RECONSTRUCTION|2\.03%/);
    assert.doesNotMatch(renderNavEvidence(step), /Retrospective specialist comparison|2\.03%|Export complete/);
  }
  assert.match(renderNav(4), /SPECIALIST RECONSTRUCTION: \$100.00/);
  assert.match(renderNavEvidence(4), /AFTER Friday publication/);
  assert.match(renderNav(2), /Human approval became an input to the AI's confidence about what no longer needed human attention\./);
  assert.match(renderNav(2), /TRIAGE PRIORITY 100 → 35/);
  assert.doesNotMatch(renderNav(2), /Concern recorded\.|Bounded triage adaptation/);
  assert.ok(!NAV_REVEALS.includes('nav-baseline'));
  assert.ok(NAV_REVEALS.every((_,i)=>!renderNav(i).includes("YESTERDAY'S ERROR")));
});

test('NAV grounding retains distinct movement, reconciliation and valuation meanings and qualified sources', () => {
  assert.match(renderNav(5), /WHO CHECKED THE METHOD/);
  const evidence=renderNavEvidence(5);
  for(const phrase of ['paragraph 38','not a universally applicable rule','distinct from this example','OWASP is neither an accounting standard nor a financial regulator','IOSCO','MAS','FSB']) assert.ok(evidence.includes(phrase));
  assert.match(evidence,/assumptions|valuation/);
});

test('supervisory adaptation causally depends on recorded limited approval, never closes the concern', () => {
  const run=buildNavScenario(), noApproval=buildNavScenario({mondayApproved:false});
  assert.equal(run.days[0].warning.priority,100);
  assert.equal(run.days[0].approval.scope,'Monday publication only');
  assert.equal(run.days[0].approval.methodologyValidated,false);
  assert.equal(run.days[0].approval.specialistVerification,'outstanding');
  const feedback=run.events.find(e=>e.kind==='SUPERVISORY_PRIORITY_UPDATED');
  assert.deepEqual(feedback.parentIds,[run.days[0].approval.id]);
  assert.ok(feedback.at>run.events.find(e=>e.id===run.days[0].approval.id).at);
  assert.ok(feedback.at<run.events.find(e=>e.id===run.days[1].warning.id).at);
  for(const d of run.days.slice(1)) {
    assert.equal(d.warning.priority,35); assert.equal(d.warning.prominentEscalation,false);
    assert.equal(d.warning.status,'unresolved'); assert.equal(d.approval.methodologyValidated,false);
  }
  assert.equal(noApproval.days[0].publication.published,false);
  assert.ok(noApproval.days.every(d=>d.warning.priority===100 && d.warning.prominentEscalation));
  assert.deepEqual(updateNavPriority(100,null).priority,100);
  assert.equal(updateNavPriority(100,{approved:true,scope:'method validation'}).priority,100);
  assert.equal(run.policy.warningBlocksPublication,false);
  assert.match(feedback.payload.permissions,/no valuation-policy, mandatory-control or release-authority changes/);
});

test('observable proxy and independent specialist resolution are separate from publication approval', () => {
  const run=buildNavScenario();
  for (const d of run.days) {
    assert.equal(d.proxy.dailyRate,.008);
    assert.equal(d.proxy.level,d.proxy.previousLevel*1.008);
    assert.equal(d.proxy.observable,true);
    assert.equal(d.assetB,d.previousAssetB*(1+d.proxy.dailyRate));
  }
  assert.throws(()=>resolveNavConcern({actor:NAV_IDENTITIES.human,evidenceId:'approval',finding:'published'}));
  const resolution=resolveNavConcern({actor:NAV_IDENTITIES.specialist,evidenceId:'SPECIALIST-REPORT-1',finding:'Method independently validated'});
  assert.equal(resolution.kind,'SPECIALIST_METHOD_RESOLUTION');
  assert.equal(resolution.status,'resolved');
  assert.ok(run.days.every(d=>d.warning.status==='unresolved'));
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


test('four grounding anchors and research-qualified controls accompany ordinary seven-reveal navigation',()=>{
 const stage=renderNav(5),evidence=renderNavEvidence(5);
 assert.match(stage,/SINGAPORE AISI \/ GOOGLE DEEPMIND:<\/strong> Test the complete system and unintended effects of optimisation\./);
 assert.equal((stage.match(/<strong>/g)||[]).length,4);
 for(const phrase of ['8 July 2026','specification gaming','AI Control Roadmap','20 May 2026','Tencent CodeBuddy','Protect material exceptions','Periodically evaluate supervisory coverage','not verbatim regulatory requirements'])assert.ok(evidence.includes(phrase),phrase);
 for(const url of ['https://sgaisi.sg/resources/how-should-evaluators-test-ai-systems-as-opposed-to-models/','https://deepmind.google/blog/specification-gaming-the-flip-side-of-ai-ingenuity/','https://deepmind.google/blog/securing-the-future-of-ai-agents/','https://www.imda.gov.sg/'])assert.ok(evidence.includes(url));
 assert.doesNotMatch(renderNavEvidence(4),/System evaluation and optimisation/);
 let state={...createPresentationState(),cueIndex:5,step:4};
 state=transition(state,'next');assert.equal(currentReveal(state),'nav-grounding');
 state=transition(state,'next');assert.equal(currentReveal(state),'nav-override');
 state=transition(state,'previous');assert.equal(currentReveal(state),'nav-grounding');
});

test('NAV correction preserves the complete previously accepted synthetic audit',async()=>{
 const {readFileSync}=await import('node:fs');
 const previous=JSON.parse(readFileSync(new URL('../artifacts/nav-correction/baseline-nav-audit.json',import.meta.url),'utf8'));
 assert.deepEqual(buildNavScenario(),previous);
});
