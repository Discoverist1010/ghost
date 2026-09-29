import test from "node:test";
import assert from "node:assert/strict";

const elements = new Map();
const listeners = new Map();
function element(id) {
  if (!elements.has(id)) {
    elements.set(id, {
      dataset: {}, hidden: true, classList: { remove() {}, toggle() {} },
      setAttribute() {}, appendChild() {},
    });
  }
  return elements.get(id);
}

globalThis.document = {
  getElementById: element,
  querySelector: () => element("shell"),
  querySelectorAll: () => Array.from({ length: 6 }, (_, index) => element("gate-" + index)),
  createDocumentFragment: () => ({ appendChild() {} }),
  createElement: () => ({}),
  addEventListener: (name, listener) => listeners.set(name, listener),
};
globalThis.Element = class {};
globalThis.window = { matchMedia: () => ({ matches: true }) };

const { renderMaterialCase, renderView } = await import("../src/theatre.mjs");
const { CUES } = await import("../src/presentation.mjs");

test("early supervisory compression withholds later risk and authority facts", () => {
  const early = renderView("supervision", 0);
  assert.match(early, /486<\/strong><span>EVENTS/);
  assert.match(early, /MATERIAL ISSUE/);
  assert.match(early, /ENTITY X CLASSIFICATION MATERIALLY CHANGED/);
  assert.doesNotMatch(early, /39|76|RESTRICTION|COUNTERPARTY|ESCALATE/);
});

test("one later causal stage reveals linked facts without audit IDs or early authority", () => {
  const states = Array.from({ length: 6 }, (_, step) => renderMaterialCase(step));
  assert.match(states[0], /CENTRAL BANK RELATED/);
  assert.match(states[0], /COMMERCIAL COUNTERPARTY/);
  assert.match(states[1], /39<\/strong>/);
  assert.match(states[1], /76<\/strong>/);
  assert.match(states[2], /ENHANCED LIQUIDITY<br>RESTRICTION/);
  assert.match(states[3], /SOURCE RECORD/);
  assert.match(states[3], /FACT CONTESTED/);
  assert.doesNotMatch(states[3], /case-collapse-new/);
  assert.match(states[4], /BANK COMPLIANCE AGENT/);
  assert.match(states[4], /COUNTER-EVIDENCE APPENDED/);
  assert.match(states[5], /ONE FACT CHANGED/);
  assert.match(states[5], /SAME MODEL/);
  for (const markup of states) {
    assert.doesNotMatch(markup, /ESCALATE|E-0238|E-0252|E-0270|E-0301|EntityGraph|Interpreter|PolicyMapper/);
  }
  assert.match(renderView("authority", 2), /ESCALATE/);
});

test("keyboard advances through every stage without changing the eight-beat contract", () => {
  const keydown = listeners.get("keydown");
  let verdicts = 0;
  for (let cueIndex = 0; cueIndex < CUES.length; cueIndex++) {
    for (const reveal of CUES[cueIndex].steps) {
      assert.equal(element("stage").dataset.cue, CUES[cueIndex].id);
      assert.equal(element("stage").dataset.reveal, reveal);
      assert.equal(element("beatCounter").textContent, `BEAT ${cueIndex + 1}/8`);
      if (reveal === "escalate") verdicts++;
      if (cueIndex !== CUES.length - 1 || reveal !== CUES[cueIndex].steps.at(-1)) {
        keydown({ key: "ArrowRight", target: null, preventDefault() {} });
      }
    }
  }
  assert.equal(verdicts, 1);
  assert.equal(element("nextButton").disabled, true);
});
