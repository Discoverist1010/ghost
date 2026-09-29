import test from 'node:test';
import assert from 'node:assert/strict';
import { AGENTS, buildRun, evaluateGate, supervise, validateRun } from '../src/scenario.mjs';

test('the visible flood is a reproducible, causally linked run', () => {
  const first = buildRun();
  const second = buildRun();
  assert.deepEqual(first, second);
  assert.equal(validateRun(first), true);
  assert.equal(first.events.length, 486);
  assert.equal(first.tasks.length, 27);
  assert.equal(new Set(first.events.map((event) => event.actor)).size, AGENTS.length);
  assert.equal(first.events.at(-1).atMs, 3200);

  const tasksById = new Map(first.tasks.map((task) => [task.id, task]));
  for (const event of first.events) assert.equal(event.actor, tasksById.get(event.taskId).actor);

  const classification = first.events.find((event) => event.kind === 'CLASSIFICATION_CHANGED');
  const risk = first.events.find((event) => event.kind === 'RISK_UPDATED');
  const recommendation = first.events.find((event) => event.kind === 'INTERVENTION_RECOMMENDED');
  const mandate = first.events.find((event) => event.kind === 'MANDATE_BOUNDARY_IDENTIFIED');
  assert.equal(classification.taskId, 'T-17');
  assert.equal(classification.before, 'central-bank-related');
  assert.equal(classification.after, 'commercial-counterparty');
  assert.deepEqual(risk.parentIds, [classification.id]);
  assert.deepEqual([risk.before, risk.after], [39, 76]);
  assert.deepEqual(recommendation.parentIds, [risk.id]);
  assert.deepEqual(mandate.parentIds, [recommendation.id]);
  assert.deepEqual(supervise(first.events).sourceEventIds, [classification.id, risk.id, recommendation.id, mandate.id]);
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
