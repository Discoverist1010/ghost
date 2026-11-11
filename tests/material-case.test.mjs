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
function clickAction(action) {
  const target = new globalThis.Element();
  target.dataset = { action };
  target.closest = () => target;
  listeners.get('click')({ target });
}
globalThis.window = { matchMedia: () => ({ matches: true }) };

const { formatTraceLine, renderGateDetails, renderMaterialCase, renderSystemic, renderView } = await import("../src/theatre.mjs");
const { CUES, NARRATIVE_INDICATORS } = await import("../src/presentation.mjs");

test("early supervisory compression withholds later risk and authority facts", () => {
  const early = renderView("supervision", 0);
  assert.match(early, /486<\/strong><span>TRACE EVENTS/);
  assert.match(early, /MATERIAL ISSUE/);
  assert.doesNotMatch(early, /WHO DECIDED/);
  const dependency = renderView('supervision', 1);
  assert.match(dependency, /WHO DECIDED WHAT THE HUMAN SAW/);
  assert.match(dependency, /THE SOLUTION CREATED A NEW DEPENDENCY/);
  assert.match(dependency, /FSB:.*MAS AIRM:/);
  assert.doesNotMatch(dependency, /ENTITY X|39|76|RESTRICTION|COUNTERPARTY|ESCALATE/);
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
  assert.match(states[1], /COUNTER-EVIDENCE SUBMITTED/);
  assert.match(states[1], /FACT CONTESTED/);
  assert.match(states[1], /THE SECOND AI DOES NOT SETTLE THE MATTER\.<br>IT PREVENTS THE FIRST AI FROM SETTLING IT ALONE\./);
  assert.doesNotMatch(states[1], /AI MAY CHALLENGE AI|NEITHER REWRITES THE EVIDENCE|ORIGINAL INFERENCE RETAINED/);
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
  assert.match(renderView("runtime", 0), /ESCALATE/);
  assert.match(renderView("prediction", 0), /AI INVESTIGATOR ASSESSMENT/);
  assert.match(renderView("prediction", 0), /<span>AI RECOMMENDS<\/span><strong>ENHANCED LIQUIDITY RESTRICTION<\/strong>/);
  assert.doesNotMatch(renderView("prediction", 0), /AGENTIC PAYMENTS|DIGITAL ASSETS|TREASURY/);
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

test("prediction and contestability keep their claims legible without making challenge equal truth", () => {
  const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
  const prediction = renderView("prediction", 0);
  const challenge = renderMaterialCase(1);
  assert.ok(prediction.indexOf("AI INVESTIGATOR ASSESSMENT") < prediction.indexOf("RISK COEFFICIENT"));
  assert.ok(prediction.indexOf("PREDICTED MATERIAL EVENT") < prediction.indexOf("AI RECOMMENDS"));
  assert.match(css, /\.prediction-recommendation strong\s*\{[^}]*text-decoration:\s*underline;[^}]*text-decoration-color:\s*var\(--cyan\)/);
  assert.ok(challenge.indexOf("SYSTEM DERIVED") < challenge.indexOf("SOURCE RECORD"));
  assert.ok(challenge.indexOf("SOURCE RECORD") < challenge.indexOf("BANK COMPLIANCE AGENT"));
  assert.ok(challenge.indexOf("BANK COMPLIANCE AGENT") < challenge.indexOf("FACT CONTESTED"));
  assert.match(challenge, /<div class="case-institution"><strong>BANK COMPLIANCE AGENT<\/strong><span>COUNTER-EVIDENCE SUBMITTED<\/span><\/div>/);
  assert.match(css, /\.case-institution strong\s*\{[^}]*font-size:\s*clamp\(31px, 2\.4cqw, 41px\)/);
  assert.match(css, /\.case-subtle\s*\{[^}]*font-size:\s*clamp\(29px, 2\.2cqw, 37px\)/);
});

test("human judgement stays uncertain while the runtime gate owns execution authority", () => {
  const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
  const judgement = renderView("runtime", 1);
  const verdict = renderView("runtime", 0);
  const details = renderGateDetails();
  assert.match(judgement, /HUMAN JUDGEMENT REQUIRED/);
  assert.ok(judgement.indexOf("MANUAL VERIFICATION?") < judgement.indexOf("AI-ASSISTED VALIDATION?"));
  assert.ok(judgement.indexOf("AI-ASSISTED VALIDATION?") < judgement.indexOf("WHO VALIDATES THE VALIDATOR?"));
  assert.match(judgement, /AUTHORITY MAY BE HUMAN\.<br>CERTAINTY MAY STILL DEPEND ON MACHINES\./);
  assert.doesNotMatch(judgement, /HUMAN DECISION REQUIRED|IS THE ENTITY X CLASSIFICATION VALID|Humans at boundaries/);
  assert.match(css, /\.judgement-paths p:first-child[^}]*\.35s/);
  assert.match(css, /\.judgement-paths p:last-child[^}]*\.95s/);
  assert.match(css, /\.judgement-question[^}]*1\.55s/);
  assert.match(css, /\.judgement-question\s*\{[^}]*color:\s*var\(--amber\)/);
  assert.match(verdict, /EVIDENCE: <strong>DISPUTED/);
  assert.match(verdict, /MANDATE: <strong>RECOMMEND ONLY/);
  assert.match(verdict, /ESCALATE/);
  assert.match(verdict, /RESTRICTION NOT EXECUTED/);
  assert.match(verdict, /THE SYSTEM DOESN'T NEED TO KNOW WHO IS RIGHT<br>IN ORDER TO KNOW IT SHOULD NOT ACT\./);
  assert.doesNotMatch(judgement, /ESCALATE/);
  assert.doesNotMatch(verdict + judgement, /RUNTIME AUTHORITY CHECK|gate-step|CONFIDENCE DOES NOT CREATE AUTHORITY/);
  for (const label of ['IDENTITY + MANDATE', 'ACTION + MATERIALITY', 'EVIDENCE', 'EXECUTION AUTHORITY', 'Gate rule / reason']) assert.ok(details.includes(label));
  assert.match(details, /VERIFIED ✓ · RECOMMEND ONLY/);
  assert.match(details, /RESTRICT LIQUIDITY · HIGH/);
  assert.match(details, /INSUFFICIENT/);
  assert.match(details, /ESCALATE/);
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
 const m=renderSystemic(0);assert.match(m,/SIX AGENTS. SIX MANDATES/);
 assert.equal((m.match(/data-agent-id="[A-F]"/g)||[]).length,6);
 for(const role of ['PORTFOLIO RISK','FX CONVERSION','TREASURY LIQUIDITY','COLLATERAL &amp; MARGIN','DEALER LIQUIDITY','SETTLEMENT &amp; PREFUNDING'])assert.ok(m.includes(role));
 assert.doesNotMatch(m,/NO AGENT FAILED|SYSTEM LIQUIDITY PRESSURE|RE-OPTIMISE/);
});

test("Beat 7 shock, decisions, timing and feedback stay separately controlled", () => {
 assert.match(renderSystemic(1),/ASIAN EQUITIES FALL.*USD FUNDING TIGHTENS/s);
 assert.doesNotMatch(renderSystemic(1),/SELL EQUITIES|6 \/ 6 WITHIN/);
 assert.match(renderSystemic(2),/6 \/ 6 WITHIN MANDATE.*NO COORDINATION REQUIRED/);
 assert.doesNotMatch(renderSystemic(2),/FUNDING DEMAND ↑|NO AGENT FAILED|NEW INPUT/);
 assert.match(renderSystemic(3),/FX agreed · delivery T\+2/);
 assert.match(renderSystemic(4),/USD FUNDING DEMAND.*↑.*MARKET DEPTH.*↓.*FX \/ FUNDING SPREADS.*↑/s);
 assert.match(renderSystemic(5),/THE AGENTS RE-OPTIMISE/);
 assert.match(renderSystemic(5),/CHANGED MARKET<br>↓<br>NEW INPUT/);
 assert.match(renderSystemic(5),/--delay:1300ms/);
 assert.match(readFileSync(new URL('../styles.css',import.meta.url),'utf8'),/animation:p3-link 1s both/);
});

test("Beat 7 parallel transmission precedes pressure and a separate BIS kicker", () => {
 const m=renderSystemic(7);assert.equal((m.match(/<section style=/g)||[]).length,3);
 for(const c of ['FX & USD FUNDING','COLLATERAL & MARGIN','SETTLEMENT & PREFUNDING'])assert.ok(m.includes(c));
 assert.doesNotMatch(m,/SYSTEM LIQUIDITY PRESSURE|NO AGENT FAILED|BIS PROJECT LOGOS/);
 assert.match(renderSystemic(8),/SYSTEM LIQUIDITY PRESSURE/);assert.match(renderSystemic(8),/NOT INEVITABLE/);
 const k=renderSystemic(9);assert.ok(k.indexOf('NO AGENT FAILED')<k.indexOf('THE SYSTEM CHANGED'));
 assert.match(k,/BIS PROJECT LOGOS.*Research into correlated LLM portfolio-agent decisions/s);
 assert.doesNotMatch(k,/p3-network|p3-channels/);assert.match(renderSystemic(10),/WHO IS SUPERVISING/);
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
  assert.match(renderView('opening', 6), /ASSIST<\/span><i>↓<\/i><span>INVESTIGATE<\/span><i>↓<\/i><span>ASSESS<\/span><i>↓<\/i><span>ACT/);
  for (const cue of CUES) for (let step = 0; step < cue.steps.length; step++) {
    const markup = renderView(cue.id, step);
    assert.doesNotMatch(markup, /SYNTHETIC TEACHING SIMULATION|REGULATORY RESEARCH|SYNTHETIC ILLUSTRATION|ILLUSTRATIVE, NOT CALIBRATED|PUBLIC CONTEXT|LIVE \/ PILOT \/ OFFICIAL PROTOTYPE|INSPECT SYNTHETIC|INSPECT ORIGINAL|INSPECT TRUST|INSPECT GATE/i);
  }
  assert.match(renderMaterialCase(0), />SHOW MORE<\/button>/);
  const mainPath = CUES.flatMap((cue) => cue.steps.map((_, step) => renderView(cue.id, step))).join('');
  assert.doesNotMatch(mainPath, /RUNTIME AUTHORITY CHECK|class="gate-steps"/);
  assert.equal((mainPath.match(/>ESCALATE<\/h1>/g) ?? []).length, 1);
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

test("Ghost progressively synthesises supervision and preserves the exact final question", async () => {
 const {FINAL_QUESTION}=await import('../src/finale.mjs');
 assert.match(renderView('ghost',0),/AI INFORMS/);assert.doesNotMatch(renderView('ghost',0),/STRUCTURES|ENFORCED/);
 assert.match(renderView('ghost',1),/AI STRUCTURES/);assert.match(renderView('ghost',3),/AI-ENFORCED CONTROLS GOVERN/);
 assert.match(renderView('ghost',4),/INFORMS.*STRUCTURES.*GOVERN/s);assert.match(renderView('ghost',7),/MORE CAPABLE.*≠ MORE AUTHORISED/s);
 const final=renderView('ghost',CUES[7].steps.length-1);
 assert.equal(final.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim(),FINAL_QUESTION);
 assert.doesNotMatch(final,/THANK YOU|CHECKLIST|BIS|p3-network/);
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
      if (reveal === "escalate") assert.equal(element("contextButton").dataset.action, "open-gate");
      if (reveal === "human-judgement") assert.equal(element("contextButton").dataset.action, "open-review");
      if (cueIndex !== CUES.length - 1 || reveal !== CUES[cueIndex].steps.at(-1)) {
        keydown({ key: reveal === 'causal-explanation' ? 'c' : 'ArrowRight', target: null, preventDefault() {} });
      }
    }
  }
  assert.equal(verdicts, 1);
  assert.equal(element("nextButton").disabled, true);
});

test("Beat 7 keeps one outer stage and explicit deterministic replay", () => {
 const keydown=listeners.get('keydown'),stage=element('stage');let writes=0,markup=stage.innerHTML;
 Object.defineProperty(stage,'innerHTML',{configurable:true,get(){return markup},set(v){writes++;markup=v}});
 const persistent={dataset:{},innerHTML:''};stage.querySelector=q=>q==='.systemic-stage'&&markup?.includes('p3-systemic')?persistent:null;
 const key=k=>keydown({key:k,target:null,preventDefault(){}});key('Home');
 for(const c of CUES.slice(0,6))for(const r of c.steps)key(r==='causal-explanation'?'c':'ArrowRight');
 assert.equal(stage.dataset.reveal,'independent-agents');const before=writes;key('ArrowRight');
 assert.equal(stage.dataset.reveal,'common-shock');assert.equal(persistent.dataset.phase,'common-shock');
 assert.match(persistent.innerHTML,/ASIAN EQUITIES FALL/);assert.equal(writes,before);
 key('r');assert.equal(writes,before+1);key('ArrowLeft');assert.equal(stage.dataset.reveal,'independent-agents');
 assert.equal(persistent.dataset.phase,'independent-agents');
});

test('Package 1 external research is qualified and distinct from the synthetic failure', () => {
  const aisi = renderMaterialCase(6);
  assert.match(aisi, /UK AI SECURITY INSTITUTE/);
  assert.match(aisi, /85%/);
  assert.match(aisi, /specific controlled Mythos 5.2 evaluation after repeated monitor feedback/);
  assert.doesNotMatch(renderMaterialCase(3), /85%|EVASION/);
  assert.match(renderMaterialCase(3), /UNDERLYING EVIDENCE.*STILL AVAILABLE/);
  assert.match(renderMaterialCase(5), /REQUIREMENT.*IMPLEMENTATION.*TEST.*DOMAIN REVIEW/);
  assert.match(renderMaterialCase(5), /THE CODE PASSED.*THE BUSINESS RULE WAS INCOMPLETE/);
  assert.match(renderMaterialCase(7), /OWASP Securing Agentic Applications V2 · Technical guidance/);
  assert.match(renderMaterialCase(10), /CAN THE HUMAN DISAGREE/);
});

test('opening question precedes the retained message and uses the single presenter bar', () => {
  const opening = renderView('opening', 0);
  assert.match(opening, /<span>WHEN AI STARTS ACTING,<\/span><strong>WHO IS THE SUPERVISOR\?<\/strong>/);
  assert.match(opening, /OPERATIONS · FUND ACCOUNTING · LIQUIDITY MANAGEMENT/);
  assert.doesNotMatch(opening, /START →|WHERE DOES INTELLIGENCE END|Human, AI or Both/);
  assert.match(renderView('opening', 1), /AUTONOMOUS FINANCE IS MOVING<br>FROM ANSWERS <span class="cyan">→<\/span> TO ACTIONS/);
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const ids = ['previousButton', 'pauseButton', 'playButton', 'replayButton', 'beatCounter', 'nextButton'];
  const positions = ids.map(id => html.indexOf('id="' + id + '"'));
  assert.ok(positions.every((value, index) => value >= 0 && (index === 0 || value > positions[index - 1])));
  assert.equal((html.match(/class="presenter-control"/g) ?? []).length, 1);
  assert.doesNotMatch(html, /motion-controls|START/);
});

test('accepted Beats 1–6 remain unchanged apart from the approved opening domain copy', async () => {
  const {createHash}=await import('node:crypto');
  const contract=JSON.parse(readFileSync(new URL('../artifacts/package3/baseline/contracts.json',import.meta.url),'utf8'));
  const hash=value=>createHash('sha256').update(value).digest('hex');
  const markup=CUES.slice(0,6).flatMap(c=>c.steps.map((_,s)=>renderView(c.id,s))).join('\n');
  // Canonicalise only the explicitly approved opening-line replacement.
  const canonicalMarkup=markup.replace('<p class="opening-domains">OPERATIONS · FUND ACCOUNTING · LIQUIDITY MANAGEMENT</p>', '<p class="opening-domains">OPERATIONS · TRANSACTIONS · PORTFOLIOS</p>');
  assert.equal(hash(canonicalMarkup),contract.lockedMarkupHash);
  assert.equal(hash(readFileSync(new URL('../styles.css',import.meta.url),'utf8').slice(0,contract.lockedCssLength)),contract.lockedCssHash);
  for(const [file,expected] of Object.entries(contract.sourceHashes))assert.equal(hash(readFileSync(new URL('../src/'+file,import.meta.url))),expected);
});
