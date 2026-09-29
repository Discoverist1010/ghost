export const BEATS = Object.freeze([
  'Finance moves from answers to actions',
  'The authority ladder',
  'One capital-markets exception',
  'The human-loop stress test',
  'Human in the right loop',
  'Agentic transactions and prediction',
  'One fact changes the judgement',
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
  { id: 'compression-before', beat: 5 },
  { id: 'compression-after', beat: 5, animation: 'compress' },
  { id: 'causal-chain', beat: 5, animation: 'causal' },
  { id: 'human-decision', beat: 5 },
  { id: 'attention-question', beat: 5 },
  { id: 'trust-questions', beat: 5 },
  { id: 'agentic-finance', beat: 6 },
  { id: 'risk-prediction', beat: 6 },
  { id: 'risk-proposal', beat: 6 },
  { id: 'no-breach', beat: 6 },
  { id: 'source-current', beat: 7 },
  { id: 'source-challenge', beat: 7 },
  { id: 'counterfactual', beat: 7, animation: 'counterfactual' },
  { id: 'one-fact', beat: 7 },
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

export function createPresentationState() {
  return { cueIndex: 0, naiveAttempt: null };
}

export function currentCue(state) {
  return CUES[state.cueIndex];
}

export function transition(state, action) {
  if (action === 'reset') return createPresentationState();
  if (action === 'next') return { ...state, cueIndex: Math.min(CUES.length - 1, state.cueIndex + 1) };
  if (action === 'previous') return { ...state, cueIndex: Math.max(0, state.cueIndex - 1) };
  if ((action === 'authorise' || action === 'reject') && currentCue(state).id === 'naive-review') {
    return { cueIndex: state.cueIndex + 1, naiveAttempt: action };
  }
  return state;
}
