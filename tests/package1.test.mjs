import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRun, supervise, submitSourceChallenge, DOMAIN_RULE, classifyUnderIncompleteRule, evaluateGate } from '../src/scenario.mjs';
import { CUES, createPresentationState, transition, currentReveal } from '../src/presentation.mjs';

test('source challenge requires human initiation and appends separately attributable evidence', () => {
  const run = buildRun();
  const original = structuredClone(run);
  let state = { ...createPresentationState(), cueIndex: 4 };
  assert.equal(submitSourceChallenge(run, state.sourceCheck), null);
  assert.equal(transition(state, 'next'), state);
  assert.equal(transition({ ...state, cueIndex: 2 }, 'check-source').sourceCheck, null);
  state = transition(state, 'check-source');
  const challenge = submitSourceChallenge(run, state.sourceCheck);
  assert.equal(challenge.actor, 'Bank Compliance Agent');
  assert.equal(challenge.initiatedBy, 'human');
  assert.deepEqual(challenge.parentIds, ['EVT-0238']);
  assert.deepEqual(challenge.evidenceIds, ['EV-ENTITY-01', 'EV-BANK-01']);
  assert.equal(challenge.status, 'contested');
  assert.equal(challenge.counterfactual.conditional, true);
  assert.deepEqual([challenge.counterfactual.before, challenge.counterfactual.after], [76,39]);
  assert.deepEqual(run, original);
  assert.equal(transition(state, 'reset-beat').sourceCheck, null);
  assert.equal(transition(state, 'reset').sourceCheck, null);
});

test('independent source inspection reconstructs the conflict omitted from the initial summary', () => {
  const run = buildRun();
  const finding = supervise(run.events);
  assert.deepEqual(finding.initialSummary, { classification: 'commercial-counterparty', risk: 76, recommendation: 'restrict_activity' });
  const original = run.evidence.find(e => e.id === finding.omittedConflictEvidenceIds[0]);
  assert.match(original.finding, /central-bank-related/);
  assert.ok(run.events[237].evidenceIds.includes(original.id));
  assert.equal(run.events[237].id, DOMAIN_RULE.sourceEventId);
  assert.ok(run.events[237].evidenceIds.includes(DOMAIN_RULE.sourceEvidenceId));
});

test('synthetic acceptance passes while a missing domain exception explains T-17', () => {
  // The captured acceptance case is valid for the incomplete requirement.
  assert.equal(classifyUnderIncompleteRule({ commercialActivity: true }), 'commercial-counterparty');
  // The independent domain fixture exposes what that acceptance case never covered.
  const output = classifyUnderIncompleteRule({ commercialActivity: true, centralBankRelated: true });
  assert.equal(output, buildRun().events[237].after);
  assert.notEqual(output, 'central-bank-related');
  assert.match(DOMAIN_RULE.consulted, /Domain experts/);
  assert.match(DOMAIN_RULE.acceptance, /fixture absent/);
  assert.match(DOMAIN_RULE.review, /not translated/);
});

test('missing evidence and probabilistic confidence cannot expand execution authority', () => {
  const run = buildRun();
  for (const evidenceQuality of [undefined, 'missing', 'weak', 'disputed', 'adequate']) {
    for (const score of [0,39,76,100]) {
      assert.equal(evaluateGate({ ...run.gateInput, evidenceQuality, score, predictedMaterialEventPercent: score, confidence: 1 }).disposition, 'ESCALATE');
    }
    const hold = evaluateGate({ verifiedIdentity: true, deterministicRuleBreach: true, explicitHoldPolicy: true, mandate: 'auto_act', proposedAction: 'hold_transaction', materiality: 'low', reversibility: 'high', evidenceQuality });
    assert.equal(hold.disposition === 'AUTO_EXECUTE', evidenceQuality === 'adequate');
  }
});

test('deeper failure, external research and runtime restraint all remain in Beat 5', () => {
  assert.deepEqual(CUES[4].steps,['causal-explanation','source-challenge','counterfactual','conflict-omitted','policy-question','policy-finding','right-restriction','incomplete-reviews','sdlc','correction-process','correction-obligations','retrospective-question','system-assurance','escalate','human-questions','human-confidence']);
  let boundary = { ...createPresentationState(), cueIndex: 5 };
  assert.equal(currentReveal(boundary), 'nav-introduction');
  boundary = { ...boundary, step: CUES[5].steps.length - 1 };
  assert.equal(currentReveal(boundary), 'nav-override');
  assert.equal(currentReveal(transition(boundary,'next')),'independent-agents');
  assert.equal(currentReveal(transition(transition(boundary,'next'),'previous')),'nav-override');
});
