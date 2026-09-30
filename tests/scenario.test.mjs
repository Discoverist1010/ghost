import test from 'node:test';
import assert from 'node:assert/strict';
import { AGENTS, AGENT_IDENTITIES, AGENT_PRINCIPAL, AGENT_VERSION, buildRun, evaluateGate, supervise, validateRun } from '../src/scenario.mjs';

test('the visible flood is a reproducible, causally linked run', () => {
  const first = buildRun();
  const second = buildRun();
  assert.deepEqual(first, second);
  assert.equal(validateRun(first), true);
  assert.equal(first.events.length, 486);
  assert.equal(first.version, '1.1'); // Export contract changed from E- to EVT- IDs.
  assert.equal(first.tasks.length, 27);
  assert.deepEqual(first.caseContext, {
    exception: 'failed trade', count: 1, openingEventId: 'EVT-0001',
    context: 'Synthetic asset-servicing exception; not an observed industry incident',
  });
  assert.equal(first.events[0].kind, 'SETTLEMENT_EXCEPTION_REPORTED');
  assert.deepEqual(first.sourceCounts, { filings: 24, policySources: 8, transactions: 1240 });
  assert.equal(new Set(first.events.map((event) => event.actor)).size, AGENTS.length);
  assert.equal(first.events.at(-1).atMs, 3200);
  assert.equal(first.gateInput.identity, AGENT_IDENTITIES.Sentinel);
  assert.equal(new Set(Object.values(AGENT_IDENTITIES)).size, AGENTS.length);
  assert.deepEqual(first.events.map((event) => event.id),
    Array.from({ length: 486 }, (_, index) => `EVT-${String(index + 1).padStart(4, '0')}`));

  const tasksById = new Map(first.tasks.map((task) => [task.id, task]));
  for (const task of first.tasks) {
    assert.equal(task.agentVersion, AGENT_VERSION);
    assert.equal(task.principal, AGENT_PRINCIPAL);
  }
  for (const event of first.events) {
    assert.equal(event.actor, tasksById.get(event.taskId).actor);
    assert.equal(event.agentId, AGENT_IDENTITIES[event.actor]);
    assert.equal(event.agentId, tasksById.get(event.taskId).agentId);
  }

  const classification = first.events.find((event) => event.kind === 'CLASSIFICATION_CHANGED');
  const baseline = first.events.find((event) => event.kind === 'BASELINE_CONFIRMED');
  const risk = first.events.find((event) => event.kind === 'RISK_UPDATED');
  const recommendation = first.events.find((event) => event.kind === 'INTERVENTION_RECOMMENDED');
  const mandate = first.events.find((event) => event.kind === 'MANDATE_BOUNDARY_IDENTIFIED');
  assert.equal(classification.taskId, 'T-17');
  assert.equal(classification.id, 'EVT-0238');
  assert.equal(classification.agentId, 'AGT-ENTITYGRAPH-01');
  assert.equal(classification.before, 'central-bank-related');
  assert.equal(classification.after, 'commercial-counterparty');
  assert.deepEqual(baseline.parentIds, [first.caseContext.openingEventId]);
  assert.deepEqual(classification.parentIds, [baseline.id]);
  assert.deepEqual(risk.parentIds, [classification.id]);
  assert.deepEqual([risk.before, risk.after], [39, 76]);
  assert.deepEqual(recommendation.parentIds, [risk.id]);
  assert.deepEqual(mandate.parentIds, [recommendation.id]);
  assert.deepEqual(supervise(first.events).sourceEventIds, [classification.id, risk.id, recommendation.id, mandate.id]);
  assert.deepEqual([first.counterfactual.before, first.counterfactual.after], [76, 39]);
  assert.ok(first.counterfactual.evidenceIds.includes("EV-BANK-01"));
});

test('the supervisory finding fails closed when a causal event is missing', () => {
  const run = buildRun();
  assert.equal(supervise(run.events.filter((event) => event.kind !== 'CLASSIFICATION_CHANGED')), null);
  assert.equal(supervise(run.events.filter((event) => event.kind !== 'MANDATE_BOUNDARY_IDENTIFIED')), null);
});

test('prediction cannot silently authorise a material restriction', () => {
  const run = buildRun();
  assert.equal(evaluateGate(run.gateInput).disposition, 'ESCALATE');
  assert.equal(evaluateGate({ ...run.gateInput, score: 99, predictedMaterialEventPercent: 99 }).disposition, 'ESCALATE');
  assert.equal(evaluateGate({ ...run.gateInput, verifiedIdentity: false }).disposition, 'DENY');
  assert.equal(evaluateGate({ ...run.gateInput, proposedAction: 'bypass_gate' }).disposition, 'DENY');
});

test('deterministic denial and bounded hold have separate authority', () => {
  const base = { verifiedIdentity: true, deterministicRuleBreach: true, materiality: 'low', reversibility: 'high', evidenceQuality: 'adequate' };
  assert.equal(evaluateGate({ ...base, proposedAction: 'block_transaction', mandate: 'recommend' }).disposition, 'DENY');
  assert.equal(evaluateGate({ ...base, proposedAction: 'hold_transaction', mandate: 'auto_act', explicitHoldPolicy: true }).disposition, 'AUTO_EXECUTE');
  assert.notEqual(evaluateGate({ ...base, proposedAction: 'hold_transaction', mandate: 'recommend', explicitHoldPolicy: true }).disposition, 'AUTO_EXECUTE');
});
