import test from "node:test";
import assert from "node:assert/strict";
import { BEATS, CASE_ACTIONS, CUES, SYSTEMIC_ACTIONS, SYSTEMIC_AGENTS, createPresentationState, currentCue, currentReveal, transition } from "../src/presentation.mjs";

const reveals = CUES.flatMap((cue) => cue.steps);

test("eight escalating beats keep the systemic argument inside Beat 7", () => {
  assert.equal(BEATS.length, 8);
  assert.equal(CUES.length, 8);
  assert.equal(reveals.length - 1, 50);
  assert.deepEqual(CUES.map((cue) => cue.id), [
    "opening", "operations", "supervision", "prediction", "material-case", "nav", "systemic", "ghost",
  ]);
  assert.equal(new Set(reveals).size, reveals.length);
  assert.equal(reveals.includes('authority-ladder'),false);
  assert.equal(reveals.includes('conflict-omitted'),false);
  assert.equal(reveals.includes('correction-obligations'),false);
  assert.equal(reveals.includes('escalate'),false);
  assert.equal(CUES[4].steps.includes('human-confidence'),false);
  assert.equal(CUES[6].steps.includes('funding-timing'),false);
  const firstWave={...createPresentationState(),cueIndex:6,step:2};
  assert.equal(currentReveal(transition(firstWave,'next')),'changed-market');
  assert.deepEqual(transition(transition(firstWave,'next'),'previous'),firstWave);
  const human={...createPresentationState(),cueIndex:4,step:13};
  assert.equal(currentReveal(transition(human,'next')),'nav-introduction');
  assert.deepEqual(transition(transition(human,'next'),'previous'),human);
  const assurance={...createPresentationState(),cueIndex:4,step:12};
  assert.equal(currentReveal(transition(assurance,'next')),'human-questions');
  assert.deepEqual(transition(transition(assurance,'next'),'previous'),assurance);
  const process={...createPresentationState(),cueIndex:4,step:10};
  assert.equal(currentReveal(transition(process,'next')),'retrospective-question');
  assert.deepEqual(transition(transition(process,'next'),'previous'),process);
  const correction={...createPresentationState(),cueIndex:4,step:2};
  assert.equal(currentReveal(transition(correction,'next')),'policy-question');
  assert.deepEqual(transition(transition(correction,'next'),'previous'),correction);
  const agents={...createPresentationState(),cueIndex:0,step:5};
  assert.equal(currentReveal(transition(agents,'next')),'failed-trade');
  assert.equal(currentReveal(transition(transition(agents,'next'),'previous')),'agentic');
});

test("problems land before their solutions and the story never backtracks", () => {
  const before = (a, b) => assert.ok(reveals.indexOf(a) < reveals.indexOf(b), `${a} must precede ${b}`);
  before("failed-trade", "event-flood");
  before("event-flood", "trace-overview");
  before("trace-overview", "material-signal");
  before("material-signal", "cognitive-limits");
  before("cognitive-limits", "attention-dependency");
  before("attention-dependency", "predictive-case");
  before("predictive-case", "causal-explanation");
  assert.equal(reveals.includes("no-breach"),false);
  before("causal-explanation", "source-challenge");
  before("source-challenge", "counterfactual");
  before("source-challenge", "system-assurance");
  before("counterfactual", "system-assurance");
  before("system-assurance", "human-questions");
  before("human-questions", "independent-agents");
  assert.equal(reveals.includes("gate-run"), false);
  before("independent-agents", "common-shock");
  before("common-shock", "first-wave");
  before("first-wave", "correlation-feedback");
  before("correlation-feedback", "system-pressure");
  assert.equal(reveals.includes("parallel-transmission"),false);
  before("system-pressure", "system-changed");
  before("system-changed", "system-supervision");
  before("system-supervision", "supervision-informs");
  before("supervision-enforces", "capability-authority");
  before("supervisory-dimensions", "due-diligence");
  before("due-diligence", "final-question");
  assert.equal(reveals.filter((id) => id === "escalate").length, 0);
});

test("six independent agent objectives remain within mandate", () => {
  assert.equal(SYSTEMIC_AGENTS.length, 6);
  assert.equal(new Set(SYSTEMIC_AGENTS.map((agent) => agent.id)).size, 6);
  assert.equal(new Set(SYSTEMIC_AGENTS.map((agent) => agent.objective)).size, 6);
  assert.equal(new Set(SYSTEMIC_AGENTS.map((agent) => agent.constraint)).size, 6);
  assert.equal(SYSTEMIC_ACTIONS.length,CUES[6].steps.length);
  assert.deepEqual(CUES[6].steps,['independent-agents','common-shock','first-wave','changed-market','second-wave','correlation-feedback','system-pressure','system-changed','system-supervision']);
  let state = { ...createPresentationState(), cueIndex: 6, step: 0 };
  for (let step = 1; step < CUES[6].steps.length; step++) {
    state = transition(state, 'next');
    assert.equal(state.cueIndex, 6);
    assert.equal(state.step, step);
  }
  state = transition(state, 'next');
  assert.equal(currentCue(state).id, 'ghost');
  assert.equal(currentReveal(state), 'supervision-informs');
});

test("retired authorise/reject actions cannot approve or change the revised arc", () => {
  assert.deepEqual(CUES[1].steps,['failed-trade','oversight-promise','event-flood','trace-overview','material-signal','cognitive-limits']);
  assert.deepEqual(CUES[2].steps,['attention-dependency']);
  assert.equal(reveals.some(r=>['naive-review','naive-basis','material-issue'].includes(r)),false);
  for(let step=0;step<CUES[1].steps.length;step++)for(const action of ['authorise','reject']){
    const start={...createPresentationState(),cueIndex:1,step};
    assert.equal(transition(start,action),start);
    assert.equal('approved' in start,false);
  }
  let state={...createPresentationState(),cueIndex:1,step:3};
  for(const expected of ['material-signal','cognitive-limits','attention-dependency','predictive-case']){
    const previous=state;state=transition(state,'next');assert.equal(currentReveal(state),expected);
    assert.deepEqual(transition(state,'previous'),previous);
  }
});

test("causal case is one beat with source and counterfactual before human authority", () => {
  let state = { ...createPresentationState(), cueIndex: 4 };
  assert.equal(CASE_ACTIONS.length, 14);
  assert.equal(transition(state, 'next'), state, 'Next cannot invoke a second AI');
  assert.equal(state.sourceCheck, null);
  state = transition(state, 'check-source');
  assert.equal(currentReveal(state), 'source-challenge');
  assert.equal(state.sourceCheck.initiatedBy, 'human');
  for (let step = 2; step < CUES[4].steps.length; step++) {
    state = transition(state,currentReveal(state)==='policy-question'?'check-policy':'next');
    assert.equal(state.cueIndex, 4);
    assert.equal(state.step, step);
  }
  assert.equal(currentReveal(state), 'human-questions');
  state = transition(state, 'next');
  assert.equal(currentReveal(state), 'nav-introduction');
  state = transition(state, 'previous');
  assert.equal(currentReveal(state), 'human-questions');
  state = transition(state, 'reset-beat');
  assert.equal(currentReveal(state), 'causal-explanation');
  assert.equal(state.sourceCheck, null);
});

test("back and reset keep the eight-beat presenter path stable", () => {
  let state = createPresentationState();
  state = transition(state, "next");
  assert.equal(currentReveal(state), "answers-to-actions");
  state = transition(state, "previous");
  assert.equal(currentReveal(state), "opening-question");
  state = transition({ cueIndex: 7, step: 2, naiveAttempt: "reject" }, "reset");
  assert.deepEqual(state, createPresentationState());
});
