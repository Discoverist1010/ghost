import test from "node:test";
import assert from "node:assert/strict";
import { BEATS, CASE_ACTIONS, CUES, SYSTEMIC_ACTIONS, SYSTEMIC_AGENTS, createPresentationState, currentCue, currentReveal, transition } from "../src/presentation.mjs";

const reveals = CUES.flatMap((cue) => cue.steps);

test("eight escalating beats keep the systemic argument inside Beat 7", () => {
  assert.equal(BEATS.length, 8);
  assert.equal(CUES.length, 8);
  assert.equal(reveals.length - 1, 39);
  assert.deepEqual(CUES.map((cue) => cue.id), [
    "opening", "operations", "supervision", "prediction", "material-case", "authority", "systemic", "ghost",
  ]);
  assert.equal(new Set(reveals).size, reveals.length);
});

test("problems land before their solutions and the story never backtracks", () => {
  const before = (a, b) => assert.ok(reveals.indexOf(a) < reveals.indexOf(b), `${a} must precede ${b}`);
  before("failed-trade", "event-flood");
  before("event-flood", "naive-basis");
  before("naive-basis", "material-issue");
  before("material-issue", "predictive-case");
  before("predictive-case", "no-breach");
  before("no-breach", "causal-explanation");
  before("causal-explanation", "source-challenge");
  before("source-challenge", "counterfactual");
  before("source-challenge", "escalate");
  before("counterfactual", "escalate");
  before("escalate", "human-judgement");
  before("human-judgement", "optimise-base");
  assert.equal(reveals.includes("gate-run"), false);
  before("optimise-base", "market-signal");
  before("market-signal", "execute-feedback");
  before("execute-feedback", "transmit");
  before("transmit", "system-pressure");
  before("system-pressure", "system-changed");
  before("system-changed", "system-supervision-bridge");
  before("system-supervision-bridge", "who-supervises");
  before("supervisory-ai", "final-propositions");
  before("final-propositions", "final-question");
  assert.equal(reveals.filter((id) => id === "escalate").length, 1);
});

test("six independent portfolio objectives remain within mandate", () => {
  assert.equal(SYSTEMIC_AGENTS.length, 6);
  assert.equal(new Set(SYSTEMIC_AGENTS.map((agent) => agent.id)).size, 6);
  assert.equal(new Set(SYSTEMIC_AGENTS.map((agent) => agent.objective)).size, 6);
  assert.equal(new Set(SYSTEMIC_AGENTS.map((agent) => agent.constraint)).size, 6);
  assert.deepEqual(SYSTEMIC_ACTIONS, [
    'MARKET SIGNAL', 'EXECUTE', 'FOLLOW THE CONSEQUENCES', 'CONTINUE', 'CONTINUE', 'CONTINUE', 'CONTINUE',
  ]);
  assert.deepEqual(CUES[6].steps, [
    'optimise-base', 'market-signal', 'execute-feedback', 'transmit', 'system-pressure', 'system-changed', 'system-supervision-bridge',
  ]);
  let state = { ...createPresentationState(), cueIndex: 6, step: 0 };
  for (let step = 1; step < CUES[6].steps.length; step++) {
    state = transition(state, 'next');
    assert.equal(state.cueIndex, 6);
    assert.equal(state.step, step);
  }
  state = transition(state, 'next');
  assert.equal(currentCue(state).id, 'ghost');
  assert.equal(currentReveal(state), 'who-supervises');
});

test("naive authorise and reject reveal the inadequate basis without approving", () => {
  const start = { ...createPresentationState(), cueIndex: 1, step: 3 };
  for (const choice of ["authorise", "reject"]) {
    const result = transition(start, choice);
    assert.equal(currentReveal(result), "naive-basis");
    assert.equal(result.naiveAttempt, choice);
    assert.equal("approved" in result, false);
  }
  assert.equal(transition(createPresentationState(), "authorise").naiveAttempt, null);
});

test("causal case is one beat with source and counterfactual before human authority", () => {
  let state = { ...createPresentationState(), cueIndex: 4 };
  assert.equal(CASE_ACTIONS.length, 11);
  assert.equal(transition(state, 'next'), state, 'Next cannot invoke a second AI');
  assert.equal(state.sourceCheck, null);
  state = transition(state, 'check-source');
  assert.equal(currentReveal(state), 'source-challenge');
  assert.equal(state.sourceCheck.initiatedBy, 'human');
  for (let step = 2; step < CUES[4].steps.length; step++) {
    state = transition(state, 'next');
    assert.equal(state.cueIndex, 4);
    assert.equal(state.step, step);
  }
  assert.equal(currentReveal(state), 'human-confidence');
  state = transition(state, 'next');
  assert.equal(currentReveal(state), 'package-boundary');
  assert.equal(transition(state, 'next'), state);
  state = transition(state, 'previous');
  assert.equal(currentReveal(state), 'human-confidence');
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
