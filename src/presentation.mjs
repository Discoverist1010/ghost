export const BEATS = Object.freeze([
  'AI helps humans',
  'AI observes',
  'Agent investigates',
  'Agent expansion',
  'Human loop overload',
  'AI supervises AI',
  'Challenge and trust',
  'Predictive boundary',
  'Counterfactual and authority',
  'The ghost',
]);

// Each cue is one stage state; several cues can belong to the same audience beat.
export const CUES = Object.freeze([
  { id: 'productivity', beat: 1 },
  { id: 'sentinel', beat: 2 },
  { id: 'investigator-score', beat: 3 },
  { id: 'investigator-checks', beat: 3 },
  { id: 'one-objective', beat: 4 },
  { id: 'agent-tree', beat: 4, animation: 'tree' },
  { id: 'agent-count', beat: 4 },
  { id: 'task-count', beat: 4 },
  { id: 'oversight-promise', beat: 5 },
  { id: 'start-workflow', beat: 5 },
  { id: 'event-flood', beat: 5, animation: 'flood' },
  { id: 'naive-review', beat: 5 },
  { id: 'naive-basis', beat: 5 },
  { id: 'compression-before', beat: 6 },
  { id: 'compression-after', beat: 6, animation: 'compress' },
  { id: 'causal-chain', beat: 6, animation: 'causal' },
  { id: 'human-decision', beat: 6 },
  { id: 'three-loops', beat: 6 },
  { id: 'trust-question', beat: 7 },
  { id: 'trust-questions', beat: 7 },
  { id: 'bank-supervisory', beat: 7 },
  { id: 'bank-response', beat: 7 },
  { id: 'bank-contested', beat: 7 },
  { id: 'risk-score', beat: 8 },
  { id: 'risk-prediction', beat: 8 },
  { id: 'risk-proposal', beat: 8 },
  { id: 'no-breach', beat: 8 },
  { id: 'prediction-permission', beat: 8 },
  { id: 'counterfactual', beat: 9, animation: 'counterfactual' },
  { id: 'one-fact', beat: 9 },
  { id: 'gate-run', beat: 9, animation: 'gate' },
  { id: 'escalate', beat: 9 },
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
