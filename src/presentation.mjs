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

export const NARRATIVE_INDICATORS = Object.freeze([
  { role: 'ASSIST', label: 'HUMAN BENEFIT', value: 'PRODUCTIVITY' },
  { role: 'INVESTIGATE', label: 'HUMAN BENEFIT', value: 'SPEED' },
  { role: 'SUPERVISE', label: 'HUMAN BENEFIT', value: 'FOCUS' },
  { role: 'ASSESS', label: 'HUMAN BENEFIT', value: 'EARLY WARNING' },
  { role: 'EVALUATE', label: 'GOVERNANCE QUESTION', value: 'EVIDENCE' },
  { role: 'ACT', label: 'GOVERNANCE QUESTION', value: 'AUTHORITY' },
  { role: 'OPTIMISE', label: 'GOVERNANCE QUESTION', value: 'SYSTEM EFFECTS' },
  { role: 'SUPERVISE', label: 'GOVERNANCE QUESTION', value: 'ACCOUNTABILITY' },
]);

// Each cue owns one stage. Its steps are reveals within that stage, not slides.
export const CUES = Object.freeze([
  { id: 'opening', steps: ['answers-to-actions', 'authority-ladder'] },
  { id: 'operations', steps: ['failed-trade', 'oversight-promise', 'event-flood', 'naive-review', 'naive-basis'] },
  { id: 'supervision', steps: ['material-issue'] },
  { id: 'prediction', steps: ['predictive-case', 'no-breach'] },
  { id: 'material-case', steps: ['causal-explanation', 'source-challenge', 'counterfactual'] },
  { id: 'authority', steps: ['human-judgement', 'gate-run', 'escalate'] },
  { id: 'systemic', steps: ['optimise-base', 'market-signal', 'execute-feedback', 'transmit', 'system-pressure', 'system-changed', 'system-supervision-bridge'] },
  { id: 'ghost', steps: ['who-supervises', 'right-loop', 'supervisory-ai', 'final-propositions', 'final-question'] },
]);

export const CASE_ACTIONS = Object.freeze([
  'CHECK SOURCE',
  'RUN COUNTERFACTUAL',
  'HUMAN JUDGEMENT',
]);

// Beat 7 is a labelled synthetic mechanism-of-concern, not a second scenario run.
export const SYSTEMIC_AGENTS = Object.freeze([
  { id: 'A', objective: 'MAXIMISE RISK-ADJUSTED RETURN', constraint: 'Risk budget', response: 'REDUCE RISK', feedback: 'Risk budget tighter', secondResponse: 'DE-RISK MORE' },
  { id: 'B', objective: 'MAINTAIN TARGET VOLATILITY', constraint: 'Volatility ceiling', response: 'REDUCE RISK', feedback: 'Volatility target breached', secondResponse: 'DE-RISK MORE' },
  { id: 'C', objective: 'LIMIT DRAWDOWN', constraint: 'Loss threshold', response: 'CUT EXPOSURE', feedback: 'Drawdown worsens', secondResponse: 'DE-RISK MORE' },
  { id: 'D', objective: 'PRESERVE LIQUIDITY', constraint: 'Cash floor', response: 'RAISE CASH', feedback: 'Liquidity deteriorates', secondResponse: 'RAISE MORE CASH' },
  { id: 'E', objective: 'TRACK BENCHMARK EFFICIENTLY', constraint: 'Tracking-risk constraint', response: 'REDUCE ACTIVE RISK', feedback: 'Risk constraint tightens', secondResponse: 'REDUCE MORE' },
  { id: 'F', objective: 'PROTECT FUNDING / COLLATERAL BUFFER', constraint: 'Liquidity constraint', response: 'INCREASE LIQUIDITY', feedback: 'Buffer pressure rises', secondResponse: 'RAISE MORE LIQUIDITY' },
]);

export const SYSTEMIC_ACTIONS = Object.freeze([
  'MARKET SIGNAL', 'EXECUTE', 'FOLLOW THE CONSEQUENCES', 'CONTINUE', 'CONTINUE', 'CONTINUE', 'CONTINUE',
]);

export const SYSTEMIC_ANNOUNCEMENTS = Object.freeze([
  'Six portfolios have different objectives. Each is within mandate.',
  'A common market signal produces staggered independent de-risking. No coordination is required.',
  'Aggregate actions change the market. Those conditions feed back to the agents before a second wave.',
  'Changed market conditions may transmit through funding, collateral, and settlement channels in parallel.',
  'Those three channels can converge into system liquidity pressure.',
  'No agent failed. The system changed.',
  'Who is supervising the system?',
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
