import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildRun, EVIDENCE } from "../src/scenario.mjs";

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
  querySelectorAll: () => Array.from({ length: 4 }, (_, index) => element("gate-" + index)),
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
  assert.match(early, /WHO DECIDED WHAT THE HUMAN SAW/);
  assert.doesNotMatch(early, /ENTITY X|39|76|RESTRICTION|COUNTERPARTY|ESCALATE/);
});

test("three presenter states reveal causal explanation, challenge, then counterfactual", () => {
  const states = Array.from({ length: 3 }, (_, step) => renderMaterialCase(step));
  assert.match(states[0], /WHY 76/);
  assert.match(states[0], /CENTRAL BANK RELATED/);
  assert.match(states[0], /COMMERCIAL COUNTERPARTY/);
  assert.match(states[0], /39 <span>→<\/span> 76/);
  assert.match(states[0], /ENHANCED LIQUIDITY RESTRICTION/);
  assert.match(states[1], /SOURCE RECORD/);
  assert.match(states[1], /BANK COMPLIANCE AGENT/);
  assert.match(states[1], /COUNTER-EVIDENCE APPENDED/);
  assert.match(states[1], /FACT CONTESTED/);
  assert.doesNotMatch(states[1], /cf-new|ONE FACT CHANGED|>39</);
  assert.match(states[2], /cf-old">76/);
  assert.match(states[2], /cf-new">39/);
  assert.match(states[2], /ONE FACT CHANGED/);
  assert.match(states[2], /SAME MODEL/);
  assert.match(states[2], /SAME RULES/);
  assert.match(states[2], /SAME OTHER EVIDENCE/);
  assert.match(states[2], /DIFFERENT FACT/);
  assert.doesNotMatch(states.join(''), /MODEL WEIGHT|CLASSIFICATION UPLIFT/);
  for (const markup of states) {
    assert.doesNotMatch(markup, /ESCALATE|E-0238|E-0252|E-0270|E-0301|EntityGraph|Interpreter|PolicyMapper/);
  }
  assert.match(renderView("authority", 2), /ESCALATE/);
  assert.equal((renderView("authority", 1).match(/class="gate-step"/g) ?? []).length, 4);
  assert.match(renderView("prediction", 0), /AGENTIC PAYMENTS/);
  assert.match(renderView("prediction", 0), /74%/);
  assert.match(renderView("prediction", 1), /NO RULE HAS BEEN BREACHED/);
});

test("counterfactual view leaves deterministic evidence and rules untouched", () => {
  const before = buildRun();
  renderMaterialCase(2);
  const after = buildRun();
  assert.deepEqual(after, before);
  assert.equal(after.counterfactual.before, 76);
  assert.equal(after.counterfactual.after, 39);
  assert.ok(after.counterfactual.evidenceIds.includes(EVIDENCE.bankResponse.id));
});

test("projection stage cannot scroll and counterfactual motion has a causal sequence", () => {
  const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
  assert.match(css, /\.stage\s*\{[^}]*overflow:\s*hidden;/);
  assert.match(css, /\.cue\s*\{[^}]*overflow:\s*hidden;/);
  assert.match(css, /\.cf-derived\s*\{[^}]*cf-demote/);
  assert.match(css, /\.cf-new\s*\{[^}]*\.7s/);
  assert.match(css, /\.cf-recommendation\s*\{[^}]*1s/);
  assert.match(css, /\.cf-one\s*\{[^}]*1\.35s/);
  assert.match(css, /\.cf-same span:nth-child\(4\)\s*\{[^}]*2\.55s/);
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
