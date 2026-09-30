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

const { formatTraceLine, renderMaterialCase, renderSystemic, renderView } = await import("../src/theatre.mjs");
const { CUES, NARRATIVE_INDICATORS } = await import("../src/presentation.mjs");

test("early supervisory compression withholds later risk and authority facts", () => {
  const early = renderView("supervision", 0);
  assert.match(early, /486<\/strong><span>TRACE EVENTS/);
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

test("Beat 7 has one dominant framing and six independently mandated agents", () => {
  const markup = renderSystemic(0);
  assert.match(markup, /MANY AGENTS\. DIFFERENT GOALS\. SIMILAR DECISIONS\./);
  assert.equal((markup.match(/data-agent-id="[A-F]"/g) ?? []).length, 6);
  assert.equal((markup.match(/class="systemic-mandate-summary"/g) ?? []).length, 1);
  assert.equal((markup.match(/6 \/ 6 WITHIN MANDATE ✓/g) ?? []).length, 1);
  assert.equal((markup.match(/class="agent-mandate"/g) ?? []).length, 6);
  for (const objective of [
    'MAXIMISE RISK-ADJUSTED RETURN', 'MAINTAIN TARGET VOLATILITY', 'LIMIT DRAWDOWN',
    'PRESERVE LIQUIDITY', 'TRACK BENCHMARK EFFICIENTLY', 'PROTECT FUNDING / COLLATERAL BUFFER',
  ]) assert.ok(markup.includes(objective));
  assert.match(markup, /SAME MARKET.*OVERLAPPING DATA.*SIMILAR AI INFRASTRUCTURE/);
  assert.match(markup, /NO COORDINATION REQUIRED/);
  assert.doesNotMatch(markup, /AGENT SWARM|LIVE PRODUCTION|OBSERVED MARKET INCIDENT|agent-to-agent|data-peer|REGULATORY RESEARCH/);
  const delays = [...markup.matchAll(/--first-delay:(\d+)ms;--feedback-delay:(\d+)ms;--second-delay:(\d+)ms;--second-flow-delay:(\d+)ms/g)]
    .map((match) => match.slice(1).map(Number));
  assert.equal(delays.length, 6);
  for (let index = 1; index < delays.length; index++) {
    for (let column = 0; column < 4; column++) assert.ok(delays[index][column] > delays[index - 1][column]);
  }
  assert.ok(delays[0][0] < delays[0][1] && delays[0][1] < delays[0][2] && delays[0][2] < delays[0][3]);
});

test("Beat 7 signal, market feedback, second wave and institutional transmission are sequenced", () => {
  const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
  const markup = renderSystemic(2);
  assert.match(markup, /COMMON MARKET SIGNAL.*VOLATILITY ↑.*MARKET DEPTH ↓.*EXPECTED DOWNSIDE ↑/);
  assert.match(markup, /MARKET DEPTH ↓↓.*BID–ASK SPREAD ↑.*VOLATILITY ↑/);
  assert.match(markup, /CHANGED MARKET → AGENTS RE-OPTIMISE/);
  assert.match(markup, /THE MARKET CHANGES\./);
  assert.match(css, /data-phase="1"\] \.market-signal[^}]*visibility:\s*visible/);
  assert.match(css, /data-phase="1"\] \.systemic-agent[^}]*agent-spotlight[^}]*--first-delay/);
  assert.match(css, /data-phase="1"\] \.agent-response[^}]*--first-delay/);
  assert.match(css, /data-phase="2"\] \.market-change-lead[^}]*visibility:\s*visible/);
  assert.match(css, /data-phase="2"\] \.agent-flow--first[^}]*--first-delay/);
  assert.match(css, /data-phase="2"\] \.market-effects[^}]*1\.85s/);
  assert.match(css, /data-phase="2"\] \.agent-flow--feedback[^}]*--feedback-delay/);
  assert.match(css, /data-phase="2"\] \.systemic-agent[^}]*agent-spotlight[^}]*--second-delay/);
  assert.match(css, /data-phase="2"\] \.agent-reoptimise[^}]*--second-delay/);
  assert.match(css, /data-phase="2"\] \.agent-flow--second[^}]*--second-flow-delay/);
  const spine = markup.slice(markup.indexOf('class="systemic-transmission"'));
  assert.ok(spine.indexOf('<strong>MARKET</strong>') < spine.indexOf('BROKER / PRIME'));
  assert.ok(markup.indexOf('BROKER / PRIME') < markup.indexOf('CLEARING / COLLATERAL'));
  assert.ok(markup.indexOf('CLEARING / COLLATERAL') < markup.indexOf('CUSTODY / POST-TRADE'));
  assert.match(css, /systemic-transmission > div:nth-child\(2\)[^}]*1\.2s/);
  assert.match(css, /systemic-transmission > div:nth-child\(3\)[^}]*2\.5s/);
  assert.match(css, /systemic-transmission > div:nth-child\(4\)[^}]*3\.8s/);
  assert.match(css, /data-phase="3"\] \.systemic-agent[^}]*opacity:\s*\.12/);
  assert.match(css, /data-phase="3"\] \.systemic-agent > :not\(\.agent-silhouette\)[^}]*visibility:\s*hidden/);
  assert.ok(markup.indexOf('NO AGENT FAILED.') < markup.indexOf('THE SYSTEM CHANGED.'));
  assert.match(css, /systemic-punch strong:first-child[^}]*\.3s/);
  assert.match(css, /systemic-punch strong:last-child[^}]*1\.55s/);
  assert.match(css, /\.stage\s*\{[^}]*overflow:\s*hidden;/);
  assert.match(css, /\.cue\s*\{[^}]*overflow:\s*hidden;/);
  assert.match(css, /\.cue--systemic \.cue-content\s*\{[^}]*max-height:\s*800px/);
  assert.ok(800 <= 1080 - 110 - 116); // The 1920×1080 stage leaves 854px for the cue.
  assert.ok(4 * 120 + 3 * 12 <= 800 - 70 - 2 * 16 - 150); // Transmission path within the nominal network.
});

test('stage furniture and detail language follow the eight-beat hierarchy', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.ok(html.includes('AUTONOMOUS AI <span>//</span> FUTURE SUPERVISORS'));
  assert.match(html, /id="contextButton"[^>]*>SHOW MORE/);
  assert.deepEqual(NARRATIVE_INDICATORS, [
    { role: 'ASSIST', label: 'HUMAN BENEFIT', value: 'PRODUCTIVITY' },
    { role: 'INVESTIGATE', label: 'HUMAN BENEFIT', value: 'SPEED' },
    { role: 'SUPERVISE', label: 'HUMAN BENEFIT', value: 'FOCUS' },
    { role: 'ASSESS', label: 'HUMAN BENEFIT', value: 'EARLY WARNING' },
    { role: 'EVALUATE', label: 'GOVERNANCE QUESTION', value: 'EVIDENCE' },
    { role: 'ACT', label: 'GOVERNANCE QUESTION', value: 'AUTHORITY' },
    { role: 'OPTIMISE', label: 'GOVERNANCE QUESTION', value: 'SYSTEM EFFECTS' },
    { role: 'SUPERVISE', label: 'GOVERNANCE QUESTION', value: 'ACCOUNTABILITY' },
  ]);
  assert.match(renderView('opening', 1), /ASSIST<\/span><i>↓<\/i><span>INVESTIGATE<\/span><i>↓<\/i><span>ASSESS<\/span><i>↓<\/i><span>ACT/);
  for (const cue of CUES) for (let step = 0; step < cue.steps.length; step++) {
    const markup = renderView(cue.id, step);
    assert.doesNotMatch(markup, /SYNTHETIC TEACHING SIMULATION|REGULATORY RESEARCH|SYNTHETIC ILLUSTRATION|ILLUSTRATIVE, NOT CALIBRATED|PUBLIC CONTEXT|LIVE \/ PILOT \/ OFFICIAL PROTOTYPE|INSPECT SYNTHETIC|INSPECT ORIGINAL|INSPECT TRUST|INSPECT GATE/i);
  }
  assert.match(renderMaterialCase(0), />SHOW MORE<\/button>/);
  assert.match(renderView('operations', 2), /INTERLEAVED AGENT TRACE/);
  assert.match(renderView('operations', 3), /TRACE EVENTS/);
});

test('trace lines expose telemetry identity without implying model deliberations', () => {
  const run = buildRun();
  assert.equal(run.events.length, 486);
  assert.equal(run.events.at(-1).atMs, 3200);
  assert.match(formatTraceLine(run.events[237]), /^1564ms  EVT-0238  AGT-ENTITYGRAPH-01  T-17  CLASSIFICATION_CHANGED$/);
  assert.doesNotMatch(formatTraceLine(run.events[237]), /LLM|MODEL CALL|EXTERNAL API/);
});

test("Ghost closes the systemic argument on the session question without extra stage content", () => {
  assert.match(renderView('ghost', 0), /WHO IS THE SUPERVISOR/);
  assert.match(renderView('ghost', 1), /WHERE IS THE RIGHT LOOP/);
  assert.match(renderView('ghost', 2), /WHO SUPERVISES<br>THE SUPERVISORY AI/);
  assert.match(renderView('ghost', 2), /WHO SUPERVISES THE SYSTEM/);
  const propositions = renderView('ghost', 3);
  assert.ok(propositions.indexOf('INTELLIGENCE CAN BE DISTRIBUTED') < propositions.indexOf('AUTHORITY MUST BE DELIBERATE'));
  assert.ok(propositions.indexOf('AUTHORITY MUST BE DELIBERATE') < propositions.indexOf('ACCOUNTABILITY CANNOT DISAPPEAR'));
  const final = renderView('ghost', 4);
  assert.match(final, /WHERE DOES INTELLIGENCE END<br>AND AUTHORITY BEGIN/);
  assert.doesNotMatch(final, /THANK YOU|CHECKLIST|REGULATORY RESEARCH|maturity/);
});

test("keyboard advances through every stage without changing the eight-beat contract", () => {
  const keydown = listeners.get("keydown");
  let verdicts = 0;
  for (let cueIndex = 0; cueIndex < CUES.length; cueIndex++) {
    for (const reveal of CUES[cueIndex].steps) {
      assert.equal(element("stage").dataset.cue, CUES[cueIndex].id);
      assert.equal(element("stage").dataset.reveal, reveal);
      assert.equal(element("beatCounter").textContent, `BEAT ${cueIndex + 1}/8`);
      const indicator = NARRATIVE_INDICATORS[cueIndex];
      assert.ok(element('stageStatus').innerHTML.includes(`AI ROLE: <strong>${indicator.role}</strong>`));
      assert.ok(element('stageStatus').innerHTML.includes(`${indicator.label}: <strong>${indicator.value}</strong>`));
      if (reveal === "escalate") verdicts++;
      if (cueIndex !== CUES.length - 1 || reveal !== CUES[cueIndex].steps.at(-1)) {
        keydown({ key: "ArrowRight", target: null, preventDefault() {} });
      }
    }
  }
  assert.equal(verdicts, 1);
  assert.equal(element("nextButton").disabled, true);
});

test("Beat 7 keeps one DOM stage across acts and replays only on request", () => {
  const keydown = listeners.get('keydown');
  const stage = element('stage');
  let writes = 0;
  let markup = stage.innerHTML;
  Object.defineProperty(stage, 'innerHTML', {
    configurable: true,
    get() { return markup; },
    set(value) { writes++; markup = value; },
  });
  const primary = { textContent: '' };
  const persistent = { dataset: { phase: '0' }, querySelector: () => primary };
  stage.querySelector = (selector) => selector === '.systemic-stage' && markup?.includes('class="systemic-stage"') ? persistent : null;
  const key = (name) => keydown({ key: name, target: null, preventDefault() {} });
  key('Home');
  for (const cue of CUES.slice(0, 6)) for (const _ of cue.steps) key('ArrowRight');
  assert.equal(stage.dataset.reveal, 'optimise-base');
  const beforeAdvance = writes;
  key('ArrowRight');
  assert.equal(stage.dataset.reveal, 'market-signal');
  assert.equal(persistent.dataset.phase, '1');
  assert.equal(primary.textContent, 'EXECUTE →');
  assert.match(element('cueAnnouncement').textContent, /staggered independent de-risking/);
  assert.equal(writes, beforeAdvance);
  key('r');
  assert.equal(stage.dataset.reveal, 'market-signal');
  assert.equal(writes, beforeAdvance + 1);
  key('ArrowLeft');
  assert.equal(stage.dataset.reveal, 'optimise-base');
  assert.equal(persistent.dataset.phase, '0');
  assert.equal(primary.textContent, 'MARKET SIGNAL →');
});
