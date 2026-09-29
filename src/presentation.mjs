export const BEATS = Object.freeze([
  'Finance moves from answers to actions',
  'The authority ladder',
  'One capital-markets exception',
  'The human-loop stress test',
  'Human in the right loop',
  'Agentic transactions and prediction',
  'AI challenges AI',
  'Runtime authority',
  'Correlated agent decisions',
  'The ghost',
]);

// Cues are presenter-controlled reveals within ten audience-facing beats.
export const CUES = Object.freeze([
  { id: 'reality', beat: 1 },
  { id: 'reality-arcs', beat: 1 },
  { id: 'reality-authority', beat: 1 },
  { id: 'ladder', beat: 2 },
  { id: 'ladder-meaning', beat: 2 },
  { id: 'ladder-question', beat: 2 },
  { id: 'failed-trade', beat: 3 },
  { id: 'agent-tree', beat: 3, animation: 'tree' },
  { id: 'exception-scale', beat: 3 },
  { id: 'oversight-promise', beat: 4 },
  { id: 'start-workflow', beat: 4 },
  { id: 'event-flood', beat: 4, animation: 'flood' },
  { id: 'naive-review', beat: 4 },
  { id: 'naive-basis', beat: 4 },
  { id: 'material-case', beat: 5 },
  { id: 'human-decision', beat: 5 },
  { id: 'attention-question', beat: 5 },
  { id: 'trust-questions', beat: 5 },
  { id: 'agentic-finance', beat: 6 },
  { id: 'risk-prediction', beat: 6 },
  { id: 'risk-proposal', beat: 6 },
  { id: 'no-breach', beat: 6 },
  { id: 'bank-response', beat: 7 },
  { id: 'bank-contested', beat: 7 },
  { id: 'gate-run', beat: 8, animation: 'gate' },
  { id: 'escalate', beat: 8 },
  { id: 'correlated-context', beat: 9 },
  { id: 'correlated-agents', beat: 9 },
  { id: 'correlated-outcome', beat: 9 },
  { id: 'ghost-supervisor', beat: 10 },
  { id: 'ghost-loop', beat: 10 },
  { id: 'ghost-ai', beat: 10 },
]);

// One cue, seven internal states: an initial compression and six causal reveals.
export const CASE_ACTIONS = Object.freeze([
  'REVEAL CAUSE',
  'SHOW CONSEQUENCE',
  'SHOW RECOMMENDATION',
  'CHECK SOURCE',
  'RUN COUNTERFACTUAL',
  'CHECK AUTHORITY',
  'HUMAN DECISION',
]);

export function createPresentationState() {
  return { cueIndex: 0, caseStep: 0, naiveAttempt: null };
}

export function currentCue(state) {
  return CUES[state.cueIndex];
}

export function transition(state, action) {
  if (action === 'reset') return createPresentationState();
  if (action === 'case-reset' && currentCue(state).id === 'material-case') return { ...state, caseStep: 0 };
  if (action === 'next') {
    if (currentCue(state).id === 'material-case' && state.caseStep < CASE_ACTIONS.length - 1) {
      return { ...state, caseStep: state.caseStep + 1 };
    }
    return { ...state, cueIndex: Math.min(CUES.length - 1, state.cueIndex + 1), caseStep: 0 };
  }
  if (action === 'previous') {
    if (currentCue(state).id === 'material-case' && state.caseStep > 0) {
      return { ...state, caseStep: state.caseStep - 1 };
    }
    const cueIndex = Math.max(0, state.cueIndex - 1);
    return { ...state, cueIndex, caseStep: CUES[cueIndex].id === 'material-case' ? CASE_ACTIONS.length - 1 : 0 };
  }
  if ((action === 'authorise' || action === 'reject') && currentCue(state).id === 'naive-review') {
    return { ...state, cueIndex: state.cueIndex + 1, naiveAttempt: action };
  }
  return state;
}
