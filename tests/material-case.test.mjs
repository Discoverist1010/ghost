import test from "node:test";
import assert from "node:assert/strict";

const elements = new Map();
function element(id) {
  if (!elements.has(id)) {
    elements.set(id, {
      dataset: {}, hidden: true, classList: { remove() {}, toggle() {} },
      setAttribute() {},
    });
  }
  return elements.get(id);
}

globalThis.document = {
  getElementById: element,
  querySelector: () => element("shell"),
  addEventListener() {},
};

const { renderMaterialCase } = await import("../src/theatre.mjs");

test("one material-case stage reveals source-linked causal facts without audit IDs", () => {
  const states = Array.from({ length: 7 }, (_, step) => renderMaterialCase(step));
  assert.match(states[0], /486<\/strong><span>EVENTS/);
  assert.match(states[0], /MATERIAL ISSUE/);
  assert.match(states[1], /CENTRAL BANK RELATED/);
  assert.match(states[1], /COMMERCIAL COUNTERPARTY/);
  assert.match(states[2], /39<\/strong>/);
  assert.match(states[2], /76<\/strong>/);
  assert.match(states[3], /ENHANCED LIQUIDITY<br>RESTRICTION/);
  assert.match(states[4], /SOURCE RECORD/);
  assert.match(states[4], /FACT CONTESTED/);
  assert.doesNotMatch(states[4], /case-collapse-new/);
  assert.match(states[5], /ONE FACT CHANGED/);
  assert.match(states[5], /SAME MODEL/);
  assert.match(states[6], /AGENT MAY NOT EXECUTE/);
  assert.match(states[6], /ESCALATE/);
  for (const markup of states) {
    assert.doesNotMatch(markup, /E-0238|E-0252|E-0270|E-0301|EntityGraph|Interpreter|PolicyMapper/);
  }
});
