import test from "node:test";
import assert from "node:assert/strict";
import { BEATS, CUES, createPresentationState, currentCue, transition } from "../src/presentation.mjs";

test("audience counter describes ten narrative beats, including internal reveals", () => {
  assert.equal(BEATS.length, 10);
  assert.deepEqual([...new Set(CUES.map((cue) => cue.beat))], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.ok(CUES.length > BEATS.length);
  assert.equal(CUES[0].id, "productivity");
  assert.deepEqual(CUES.slice(-3).map((cue) => cue.beat), [10, 10, 10]);
});

test("the log flood precedes the inadequate review and causal compression", () => {
  const ids = CUES.map((cue) => cue.id);
  const ordered = ["event-flood", "naive-review", "naive-basis", "compression-before", "compression-after", "causal-chain", "human-decision"];
  assert.deepEqual(ordered.map((id) => ids.indexOf(id)), [...ordered.map((id) => ids.indexOf(id))].sort((a, b) => a - b));
  assert.ok(ordered.every((id) => ids.includes(id)));
  assert.ok(ids.indexOf("gate-run") < ids.indexOf("escalate"));
  assert.ok(ids.indexOf("risk-proposal") < ids.indexOf("no-breach"));
});

test("naive authorise and reject never become an approved intervention", () => {
  const start = { cueIndex: CUES.findIndex((cue) => cue.id === "naive-review"), naiveAttempt: null };
  for (const choice of ["authorise", "reject"]) {
    const result = transition(start, choice);
    assert.equal(currentCue(result).id, "naive-basis");
    assert.equal(result.naiveAttempt, choice);
    assert.equal("approved" in result, false);
  }
  assert.equal(transition(createPresentationState(), "authorise").naiveAttempt, null);
});

test("back and reset give a stable presenter path", () => {
  let state = createPresentationState();
  state = transition(state, "next");
  assert.equal(currentCue(state).id, "sentinel");
  state = transition(state, "previous");
  assert.equal(currentCue(state).id, "productivity");
  state = transition({ cueIndex: CUES.length - 1, naiveAttempt: "reject" }, "reset");
  assert.deepEqual(state, createPresentationState());
});
