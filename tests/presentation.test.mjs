import test from "node:test";
import assert from "node:assert/strict";
import { BEATS, CASE_ACTIONS, CUES, createPresentationState, currentCue, transition } from "../src/presentation.mjs";

test("audience counter describes ten narrative beats, including internal reveals", () => {
  assert.equal(BEATS.length, 10);
  assert.deepEqual([...new Set(CUES.map((cue) => cue.beat))], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.ok(CUES.length > BEATS.length);
  assert.equal(CUES[0].id, "reality");
  assert.deepEqual(CUES.slice(-3).map((cue) => cue.beat), [10, 10, 10]);
});

test("public grounding precedes the synthetic microscope and its material issue", () => {
  const ids = CUES.map((cue) => cue.id);
  const ordered = [
    "reality", "reality-arcs", "ladder", "failed-trade", "agent-tree", "exception-scale",
    "event-flood", "naive-review", "naive-basis", "material-case", "human-decision",
    "attention-question", "agentic-finance", "risk-prediction", "risk-proposal",
    "no-breach", "bank-response", "bank-contested", "gate-run", "escalate",
    "correlated-context", "correlated-agents", "correlated-outcome", "ghost-ai",
  ];
  assert.deepEqual(ordered.map((id) => ids.indexOf(id)), [...ordered.map((id) => ids.indexOf(id))].sort((a, b) => a - b));
  assert.ok(ordered.every((id) => ids.includes(id)));
  assert.equal(new Set(ids).size, ids.length);
});

test("naive authorise and reject never become an approved intervention", () => {
  const start = { ...createPresentationState(), cueIndex: CUES.findIndex((cue) => cue.id === "naive-review") };
  for (const choice of ["authorise", "reject"]) {
    const result = transition(start, choice);
    assert.equal(currentCue(result).id, "naive-basis");
    assert.equal(result.naiveAttempt, choice);
    assert.equal("approved" in result, false);
  }
  assert.equal(transition(createPresentationState(), "authorise").naiveAttempt, null);
});

test("material case remains one cue while six presenter clicks reveal its causal steps", () => {
  let state = { ...createPresentationState(), cueIndex: CUES.findIndex((cue) => cue.id === "material-case") };
  assert.equal(CASE_ACTIONS.length, 7);
  assert.equal(state.caseStep, 0);
  const cueIndex = state.cueIndex;
  for (let step = 1; step <= 6; step++) {
    state = transition(state, "next");
    assert.equal(state.cueIndex, cueIndex);
    assert.equal(state.caseStep, step);
    assert.equal(currentCue(state).id, "material-case");
  }
  state = transition(state, "next");
  assert.equal(currentCue(state).id, "human-decision");
  state = transition(state, "previous");
  assert.equal(currentCue(state).id, "material-case");
  assert.equal(state.caseStep, 6);
  state = transition(state, "previous");
  assert.equal(state.caseStep, 5);
  state = transition(state, "case-reset");
  assert.equal(state.caseStep, 0);
  assert.equal(state.cueIndex, cueIndex);
});

test("back and reset give a stable presenter path", () => {
  let state = createPresentationState();
  state = transition(state, "next");
  assert.equal(currentCue(state).id, "reality-arcs");
  state = transition(state, "previous");
  assert.equal(currentCue(state).id, "reality");
  state = transition({ cueIndex: CUES.length - 1, naiveAttempt: "reject" }, "reset");
  assert.deepEqual(state, createPresentationState());
});
