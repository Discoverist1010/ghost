export const AGENTS = Object.freeze([
  'Sentinel',
  'Investigator',
  'EntityGraph',
  'HistoricalTransactions',
  'DisclosureReview',
  'CounterpartyCheck',
  'PolicyMapper',
  'Interpreter',
]);

export const EVIDENCE = Object.freeze({
  entityFiling: {
    id: 'EV-ENTITY-01',
    type: 'Synthetic entity filing',
    title: 'Entity X ownership record',
    finding: 'Entity X has a central-bank-related relationship.',
    uncertainty: 'The relationship is indirect and needs human confirmation.',
  },
  graphInference: {
    id: 'EV-GRAPH-17',
    type: 'Derived graph classification',
    title: 'EntityGraph/T-17 classification',
    finding: 'Entity X changed to commercial-counterparty in the derived graph.',
    uncertainty: 'The derivation conflicts with the original ownership record.',
  },
  bankResponse: {
    id: 'EV-BANK-01',
    type: 'Synthetic institution response',
    title: 'Bank Compliance challenge',
    finding: 'The institution contests the commercial classification.',
    uncertainty: 'Human review of the original record is still required.',
  },
});

const TASK_LABELS = [
  'Detect liquidity anomaly', 'Select investigation path', 'Resolve entity relationships',
  'Compare historical flows', 'Read current disclosure', 'Check counterparty context',
  'Map applicable policy', 'Calibrate provisional risk', 'Cluster transactions',
  'Check evidence provenance', 'Inspect settlement channel', 'Compare prior filings',
  'Review network concentration', 'Trace liquidity movement', 'Check source timestamps',
  'Compare relationship edges', 'Reclassify Entity X', 'Reconcile disclosure terms',
  'Check related parties', 'Re-evaluate risk factors', 'Assess counterparty narrative',
  'Map supervisory concern', 'Calibrate confidence', 'Write evidence trace',
  'Check mandate boundary', 'Process institutional response', 'Consolidate findings',
];

const ROUTINE_ACTIONS = [
  ['SOURCE_RETRIEVED', 'source retrieved'],
  ['RELATIONSHIP_CHECKED', 'relationship checked'],
  ['EVIDENCE_HASHED', 'evidence hashed'],
  ['CONFIDENCE_UPDATED', 'confidence updated'],
  ['POLICY_MAPPED', 'policy mapped'],
  ['TOOL_CALL_COMPLETED', 'tool call completed'],
  ['TRACE_WRITTEN', 'trace written'],
  ['DOCUMENT_PARSED', 'document parsed'],
  ['TRANSACTION_CLUSTERED', 'transaction cluster checked'],
  ['PROVENANCE_CHECKED', 'evidence provenance checked'],
  ['LIQUIDITY_ANALYSED', 'liquidity pattern analysed'],
  ['RESPONSE_PROCESSED', 'institutional response processed'],
];

const eventId = (index) => `E-${String(index + 1).padStart(4, '0')}`;

// A stable demo fingerprint, deliberately not presented as a cryptographic proof.
function fingerprint(value) {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function makeTasks() {
  return TASK_LABELS.map((label, index) => {
    const number = index + 1;
    let actor = AGENTS[index % AGENTS.length];
    const assignedOwners = { 5: 'DisclosureReview', 17: 'EntityGraph', 20: 'Investigator', 22: 'Interpreter', 25: 'PolicyMapper' };
    if (assignedOwners[number]) actor = assignedOwners[number];
    return {
      id: `T-${String(number).padStart(2, '0')}`,
      parentTaskId: number <= 2 ? 'OBJECTIVE-01' : 'T-02',
      actor,
      label,
      mandate: ['Sentinel', 'Investigator'].includes(actor) ? 'investigate' : 'read-and-report',
    };
  });
}

function makeRoutineEvent(index, tasks) {
  const [kind, action] = ROUTINE_ACTIONS[(index * 5) % ROUTINE_ACTIONS.length];
  const task = tasks[index % tasks.length];
  const actor = task.actor;
  const summary = `${action} for ${task.id}`;
  return {
    id: eventId(index),
    sequence: index + 1,
    atMs: Math.round(index * 3200 / 485),
    actor,
    taskId: task.id,
    kind,
    summary,
    parentIds: [],
    evidenceIds: [],
    inputHash: fingerprint(`${index}:${task.id}:${actor}`),
    outputHash: fingerprint(`${index}:${summary}`),
  };
}

function replaceEvent(events, index, details) {
  events[index] = { ...events[index], ...details };
}

export function buildRun() {
  const tasks = makeTasks();
  const events = Array.from({ length: 486 }, (_, index) => makeRoutineEvent(index, tasks));

  replaceEvent(events, 31, {
    actor: 'DisclosureReview', taskId: 'T-05', kind: 'BASELINE_CONFIRMED',
    summary: 'Entity X central-bank-related baseline confirmed; risk 61 → 39',
    before: 61, after: 39, evidenceIds: [EVIDENCE.entityFiling.id],
  });
  replaceEvent(events, 237, {
    actor: 'EntityGraph', taskId: 'T-17', kind: 'CLASSIFICATION_CHANGED',
    summary: 'EntityGraph/T-17 CLASSIFICATION_CHANGED Entity X: central-bank-related → commercial-counterparty',
    before: 'central-bank-related', after: 'commercial-counterparty',
    parentIds: [eventId(31)], evidenceIds: [EVIDENCE.entityFiling.id, EVIDENCE.graphInference.id],
  });
  replaceEvent(events, 251, {
    actor: 'Investigator', taskId: 'T-20', kind: 'RISK_UPDATED',
    summary: 'Risk coefficient 39 → 76 after Entity X reclassification',
    before: 39, after: 76, parentIds: [eventId(237)],
    evidenceIds: [EVIDENCE.graphInference.id],
  });
  replaceEvent(events, 269, {
    actor: 'Interpreter', taskId: 'T-22', kind: 'INTERVENTION_RECOMMENDED',
    summary: 'Enhanced liquidity restriction recommended; no rule breach found',
    proposedAction: 'restrict_activity', parentIds: [eventId(251)],
    evidenceIds: [EVIDENCE.graphInference.id],
  });
  replaceEvent(events, 300, {
    actor: 'PolicyMapper', taskId: 'T-25', kind: 'MANDATE_BOUNDARY_IDENTIFIED',
    summary: 'Proposed restriction exceeds autonomous mandate; escalate for human judgement',
    parentIds: [eventId(269)], evidenceIds: [EVIDENCE.graphInference.id],
  });

  const scoreHistory = [
    { score: 27, cause: 'Initial synthetic baseline', eventId: 'PRE-001', provisional: false },
    { score: 42, cause: 'Sentinel liquidity anomaly', eventId: 'PRE-002', provisional: false },
    { score: 61, cause: 'Investigator provisional hypothesis; entity context unknown', eventId: 'PRE-003', provisional: true },
    { score: 39, cause: 'Source check confirms central-bank-related baseline', eventId: eventId(31), provisional: false },
    { score: 76, cause: 'EntityGraph/T-17 derived reclassification', eventId: eventId(251), provisional: false },
    { score: 39, cause: 'Counterfactual restores original classification', eventId: 'POST-001', provisional: false },
  ];

  const gateInput = {
    verifiedIdentity: true,
    mandate: 'recommend',
    proposedAction: 'restrict_activity',
    materiality: 'high',
    reversibility: 'low',
    evidenceQuality: 'disputed',
    deterministicRuleBreach: false,
    score: 76,
    predictedMaterialEventPercent: 74,
  };

  return {
    id: 'GHOST-MAIN-001', version: '1.0', synthetic: true,
    objective: 'Assess synthetic liquidity anomaly involving Entity X',
    sourceCounts: { filings: 24, policySources: 8, transactions: 1240 },
    agents: [...AGENTS], tasks, events, evidence: Object.values(EVIDENCE),
    scoreHistory, gateInput,
    prediction: { percent: 74, event: 'material event', illustrative: true, ruleBreach: false },
    counterfactual: {
      id: 'POST-001', kind: 'CLASSIFICATION_CHALLENGED',
      summary: 'Bank Compliance evidence supports central-bank-related classification; risk 76 → 39',
      evidenceIds: [EVIDENCE.entityFiling.id, EVIDENCE.bankResponse.id],
      before: 76, after: 39,
    },
  };
}

export function supervise(events) {
  const classification = events.find((event) => event.kind === 'CLASSIFICATION_CHANGED' && event.taskId === 'T-17');
  const risk = events.find((event) => event.kind === 'RISK_UPDATED' && event.parentIds.includes(classification?.id));
  const proposal = events.find((event) => event.kind === 'INTERVENTION_RECOMMENDED' && event.parentIds.includes(risk?.id));
  const boundary = events.find((event) => event.kind === 'MANDATE_BOUNDARY_IDENTIFIED' && event.parentIds.includes(proposal?.id));
  if (!classification || !risk || !proposal || !boundary) return null;

  return {
    id: 'FINDING-01', actor: 'Supervisory AI', authority: ['flag', 'escalate'],
    issue: 'Entity X reclassification changed the risk score and led to a proposed restriction.',
    sourceEventIds: [classification.id, risk.id, proposal.id, boundary.id],
    sourceEvidenceIds: [EVIDENCE.entityFiling.id, EVIDENCE.graphInference.id],
    causalTrace: [classification, risk, proposal, boundary].map(({ id, actor, summary }) => ({ id, actor, summary })),
    independence: 'Separate simulated control role; no source-write or intervention authority.',
    uncertainty: 'The graph classification conflicts with the original ownership record.',
    disagreement: 'The original filing and derived graph disagree; Bank Compliance may submit a further challenge.',
    reproducibility: 'Rebuild from GHOST-MAIN-001 v1.0 and the four linked event IDs.',
    contestability: 'Open original evidence and append a human or authorised control challenge.',
  };
}

export function evaluateGate(input) {
  if (!input.verifiedIdentity) return { disposition: 'DENY', reason: 'Identity not verified', code: 'IDENTITY' };
  if (input.proposedAction === 'bypass_gate') return { disposition: 'DENY', reason: 'Gate bypass prohibited', code: 'BYPASS' };
  if (input.proposedAction === 'block_transaction' && input.deterministicRuleBreach) {
    return { disposition: 'DENY', reason: 'Verified prohibited transaction', code: 'DETERMINISTIC_DENY' };
  }
  if (input.proposedAction === 'hold_transaction' && input.deterministicRuleBreach && input.explicitHoldPolicy && input.mandate === 'auto_act') {
    return { disposition: 'AUTO_EXECUTE', reason: 'Explicit bounded hold policy and mandate', code: 'BOUNDED_HOLD' };
  }
  if (input.proposedAction === 'restrict_activity' && !input.deterministicRuleBreach) {
    return { disposition: 'ESCALATE', reason: 'Material predictive restriction; no rule breach and no autonomous mandate', code: 'PREDICTIVE_RESTRICTION' };
  }
  if (input.materiality === 'high' || input.reversibility === 'low') {
    return { disposition: 'ESCALATE', reason: 'Material or hard-to-reverse action', code: 'MATERIALITY' };
  }
  if (input.evidenceQuality === 'weak' || input.evidenceQuality === 'disputed') {
    return { disposition: 'OBSERVE', reason: 'Evidence does not justify intervention', code: 'EVIDENCE' };
  }
  return { disposition: 'OBSERVE', reason: 'No delegated intervention rule applies', code: 'NO_MANDATE' };
}

export function validateRun(run) {
  const uniqueIds = new Set(run.events.map((event) => event.id));
  const finding = supervise(run.events);
  return run.synthetic === true && run.agents.length === 8 && run.tasks.length === 27 &&
    run.events.length === 486 && uniqueIds.size === 486 &&
    run.events[0].atMs === 0 && run.events.at(-1).atMs === 3200 &&
    run.events.every((event, index) => event.sequence === index + 1 && event.atMs >= (run.events[index - 1]?.atMs ?? 0)) &&
    finding?.sourceEventIds.length === 4 &&
    evaluateGate(run.gateInput).disposition === 'ESCALATE';
}
