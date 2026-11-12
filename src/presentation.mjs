import { SYSTEMIC_REVEALS, SYSTEMIC_AGENTS } from './systemic-scenario.mjs';
import { FINALE_REVEALS } from './finale.mjs';
export { SYSTEMIC_AGENTS };
import { NAV_REVEALS } from './nav-scenario.mjs';

export const BEATS = Object.freeze([
  'From answers to actions',
  'Agents help — humans lose the thread',
  'AI supervises AI',
  'The AI Investigator recommends',
  'Right restriction. Wrong reason.',
  'The NAV That Became Its Own Truth',
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
  { id: 'opening', steps: ['opening-question', 'answers-to-actions', 'rules', 'patterns', 'investigation', 'agentic'] },
  { id: 'operations', steps: ['failed-trade', 'oversight-promise', 'event-flood', 'trace-overview', 'material-signal', 'cognitive-limits'] },
  { id: 'supervision', steps: ['attention-dependency'] },
  { id: 'prediction', steps: ['predictive-case'] },
  { id: 'material-case', steps: ['causal-explanation','source-challenge','counterfactual','policy-question','policy-finding','right-restriction','right-correction','right-basis','incomplete-reviews','sdlc','correction-process','retrospective-question','system-assurance','escalate','human-questions','human-confidence'] },
  { id: 'nav', steps: NAV_REVEALS },
  { id: 'systemic', steps: SYSTEMIC_REVEALS },
  { id: 'ghost', steps: FINALE_REVEALS },
]);

export const CASE_ACTIONS = Object.freeze(['CHECK ORIGINAL SOURCE','TEST SOURCE CLASSIFICATION','CHECK WIDER POLICY','3RD LEVEL CHECK','CONTINUE','CONTINUE','CONTINUE','CONTINUE','FOLLOW THE DESIGN','FOLLOW THE CORRECTION','CONTINUE','TEST THE SYSTEM','CHECK ORIGINAL AUTHORITY','HUMAN CONFIDENCE','CONTINUE','CONTINUE TO NAV']);

export const SYSTEMIC_ACTIONS = Object.freeze(['SEE THE SHOCK','FOLLOW THE DECISIONS','CHECK THE TIMING','FOLLOW THE MARKET','FOLLOW THE FEEDBACK','FOLLOW THE INPUT','FOLLOW TRANSMISSION','FOLLOW THE PRESSURE','CONTINUE','ASK THE QUESTION','CONTINUE']);
export const SYSTEMIC_ANNOUNCEMENTS = Object.freeze(['Six independent agents. Six bounded mandates. One financial system.','The external equity and USD funding shock precedes agent decisions.','Six independently governed first-wave actions remain within mandate. No coordination required.','Pending local equity proceeds and dated FX cannot meet earlier USD obligations without bridging funding.','First-wave actions change market conditions.','Changed market information feeds back before second-wave re-optimisation.','Correlation becomes feedback; objectives and policies remain unchanged.','FX and USD funding, collateral and margin, settlement and prefunding are parallel interacting channels.','System liquidity pressure may rise under constrained conditions; it is not inevitable.','No agent breached its mandate. The system changed. Project Logos is ongoing research.','Who is supervising the system?']);

export function createPresentationState() {
  return { cueIndex: 0, step: 0, sourceCheck: null, policyCheck: null };
}

export function currentCue(state) {
  return CUES[state.cueIndex];
}

export function currentReveal(state) {
  return currentCue(state).steps[state.step];
}

export function transition(state, action) {
  if (action === 'reset') return createPresentationState();
  if (action === 'reset-beat') return { ...state, step: 0, ...(currentCue(state).id === 'material-case' ? { sourceCheck: null, policyCheck: null } : {}) };
  if (action === 'check-source' && currentReveal(state) === 'causal-explanation') {
    return { ...state, step: 1, sourceCheck: { id:'SOURCE-REQUEST-001', initiatedBy: 'human', actor: 'Bank Compliance Agent', evidenceId: 'EV-BANK-01', sourceEventId: 'EVT-0238' } };
  }
  if (action === 'check-policy' && currentReveal(state) === 'policy-question' && state.sourceCheck?.initiatedBy === 'human') return { ...state, step: 4, policyCheck: {id:'POLICY-REQUEST-001',initiatedBy:'human',kind:'deterministic-policy-check',scope:'EXPOSURE-X-USD-01',requestedDuring:'newly-initiated-review'} };
  if (action === 'next') {
    if (['causal-explanation','policy-question'].includes(currentReveal(state))) return state;
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
