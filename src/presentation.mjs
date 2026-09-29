export const BEATS = Object.freeze([
  'From answers to actions',
  'Agents help — humans lose the thread',
  'AI supervises AI',
  'Prediction is not permission',
  'One fact changes the case',
  'The right loop / authority',
  'When correct agents become a system',
  'The ghost',
]);

// Each cue owns one stage. Its steps are reveals within that stage, not slides.
export const CUES = Object.freeze([
  { id: 'opening', steps: ['answers-to-actions', 'authority-ladder'] },
  { id: 'operations', steps: ['failed-trade', 'oversight-promise', 'event-flood', 'naive-review', 'naive-basis'] },
  { id: 'supervision', steps: ['material-issue', 'attention-reliance'] },
  { id: 'prediction', steps: ['agentic-finance', 'predictive-case', 'no-breach'] },
  { id: 'material-case', steps: ['classification', 'risk-change', 'recommendation', 'source-challenge', 'bank-challenge', 'counterfactual'] },
  { id: 'authority', steps: ['human-decision', 'gate-run', 'escalate'] },
  { id: 'systemic', steps: ['correlated-agents', 'correlated-outcome'] },
  { id: 'ghost', steps: ['who-supervises', 'right-loop', 'supervisory-ai'] },
]);

export const CASE_ACTIONS = Object.freeze([
  'SHOW CONSEQUENCE',
  'SHOW RECOMMENDATION',
  'CHECK SOURCE',
  'SHOW CHALLENGE',
  'RUN COUNTERFACTUAL',
  'HUMAN DECISION',
]);

export function createPresentationState() {
  return { cueIndex: 0, step: 0, naiveAttempt: null };
}

export function currentCue(state) {
  return CUES[state.cueIndex];
}

export function currentReveal(state) {
  return currentCue(state).steps[state.step];
}

export function transition(state, action) {
  if (action === 'reset') return createPresentationState();
  if (action === 'reset-beat') return { ...state, step: 0 };
  if ((action === 'authorise' || action === 'reject') && currentReveal(state) === 'naive-review') {
    return { ...state, step: state.step + 1, naiveAttempt: action };
  }
  if (action === 'next') {
    if (state.step < currentCue(state).steps.length - 1) return { ...state, step: state.step + 1 };
    if (state.cueIndex < CUES.length - 1) return { ...state, cueIndex: state.cueIndex + 1, step: 0 };
    return state;
  }
  if (action === 'previous') {
    if (state.step > 0) return { ...state, step: state.step - 1 };
    if (state.cueIndex > 0) {
      const cueIndex = state.cueIndex - 1;
      return { ...state, cueIndex, step: CUES[cueIndex].steps.length - 1 };
    }
    return state;
  }
  return state;
}
