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

const { formatTraceLine, renderGateDetails, renderMaterialCase, renderSystemic, renderView, renderSettlementWorkEvidence } = await import("../src/theatre.mjs");
const { CUES, NARRATIVE_INDICATORS } = await import("../src/presentation.mjs");

test("early supervisory compression withholds later risk and authority facts", () => {
  const raw=renderView('operations',3),signal=renderView('operations',4),cognitive=renderView('operations',5),dependency=renderView('supervision',0);
  assert.match(raw,/486<\/strong><span>TRACE EVENTS/);
  assert.doesNotMatch(raw,/MATERIAL ISSUE/);
  assert.match(signal,/1 MATERIAL ISSUE IDENTIFIED/);assert.match(signal,/THE SIGNAL BECOMES VISIBLE/);
  assert.match(cognitive,/FSB:.*MAS AIRM:/s);
  assert.match(dependency,/WHO DECIDED WHAT THE HUMAN SAW/);
  assert.match(dependency,/THE SOLUTION CREATED A NEW DEPENDENCY/);
  assert.doesNotMatch(dependency,/FSB:|MAS AIRM:/);
  for(const view of [raw,signal,cognitive,dependency])assert.doesNotMatch(view,/ENTITY X|39|76|RESTRICTION|COUNTERPARTY|ESCALATE|AUTHORISE|REJECT|ON WHAT BASIS/);
});

test("human challenge precedes a conditional classification test without premature source disclosure", () => {
 const why=renderMaterialCase(0),source=renderMaterialCase(1),testView=renderMaterialCase(2),assessment=renderView('prediction',0);
 assert.match(why,/WHY 76/);assert.match(why,/AI-DERIVED CLASSIFICATION/);assert.match(why,/COMMERCIAL CLASSIFICATION → RISK 76/);
 assert.match(why,/CHECK ORIGINAL SOURCE →/);assert.match(why,/VIEW AI ASSESSMENT/);
 assert.doesNotMatch(why,/CENTRAL-BANK|39|SANCTIONS|ESCALATE/);
 assert.match(source,/HUMAN REQUESTED SOURCE VERIFICATION/);assert.match(source,/AI #2 · BANK COMPLIANCE AGENT/);
 assert.match(source,/ORIGINAL SOURCE:.*CENTRAL-BANK-RELATED/s);assert.match(source,/CLASSIFICATION CONTESTED/);
 assert.doesNotMatch(source,/39|SANCTIONS|ESCALATE/);
 assert.match(testView,/IF THE ORIGINAL CLASSIFICATION IS USED/);assert.match(testView,/arc2-score-before">76/);assert.match(testView,/arc2-score-after">39/);
 assert.match(testView,/ONE FACT CHANGED/);assert.match(testView,/SAME MODEL · SAME RULES · DIFFERENT CLASSIFICATION/);
 assert.match(testView,/CONDITIONAL CLASSIFICATION-DEPENDENT SCORE/);
 assert.match(assessment,/FROM THE FAILED-TRADE INVESTIGATION: ENTITY X COUNTERPARTY RISK/);
 assert.match(assessment,/74%/);assert.match(assessment,/>76</);assert.doesNotMatch(assessment,/39|CENTRAL-BANK|SANCTIONS|ESCALATE/);
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

test("source review makes the two AI scopes and uncertainty visually distinct", () => {
 const source=renderMaterialCase(1),css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
 assert.ok(source.indexOf('HUMAN REQUESTED')<source.indexOf('AI #2 · BANK COMPLIANCE AGENT'));
 assert.ok(source.indexOf('AI #1 DERIVED')<source.indexOf('ORIGINAL SOURCE'));
 assert.ok(source.indexOf('ORIGINAL SOURCE')<source.indexOf('AI #2 FLAGS CONTRADICTORY EVIDENCE'));
 assert.match(source,/DOES NOT ESTABLISH FINAL TRUTH/);
 assert.match(css,/arc2-source-comparison[^}]*animation:case-rise \.65s \.9s/);
 assert.match(css,/arc2-source-result[^}]*animation:case-rise \.65s 1\.7s/);
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
  for (const cue of CUES) for (let step = 0; step < cue.steps.length; step++) {
    const markup = renderView(cue.id, step);
    assert.doesNotMatch(markup, /SYNTHETIC TEACHING SIMULATION|REGULATORY RESEARCH|SYNTHETIC ILLUSTRATION|ILLUSTRATIVE, NOT CALIBRATED|PUBLIC CONTEXT|LIVE \/ PILOT \/ OFFICIAL PROTOTYPE|INSPECT SYNTHETIC|INSPECT ORIGINAL|INSPECT TRUST|INSPECT GATE/i);
  }
  assert.match(renderMaterialCase(0), />VIEW AI ASSESSMENT<\/button>/);
  const mainPath = CUES.flatMap((cue) => cue.steps.map((_, step) => renderView(cue.id, step))).join('');
  assert.doesNotMatch(mainPath, /RUNTIME AUTHORITY CHECK|class="gate-steps"|AUTONOMOUS TO DO WHAT/);
  assert.equal((mainPath.match(/>ESCALATE<\/h1>/g) ?? []).length, 0);
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
      assert.ok(element('stageStatus').innerHTML.includes(reveal === 'rules' ? '<strong>NOT AI</strong>' : `AI ROLE: <strong>${indicator.role}</strong>`));
      assert.ok(element('stageStatus').innerHTML.includes(`${indicator.label}: <strong>${indicator.value}</strong>`));
      if (reveal === "escalate") verdicts++;
      if (reveal === "escalate") assert.equal(element("contextButton").dataset.action, "open-arc2");
      if (reveal === "human-judgement") assert.equal(element("contextButton").dataset.action, "open-review");
      if (cueIndex !== CUES.length - 1 || reveal !== CUES[cueIndex].steps.at(-1)) {
        if(reveal==='policy-question')clickAction('check-policy');
        else keydown({ key: reveal === 'causal-explanation' ? 'c' : 'ArrowRight', target: null, preventDefault() {} });
      }
    }
  }
  assert.equal(verdicts, 0);
  assert.equal(element("nextButton").disabled, true);
});

test("Beat 7 keeps one outer stage and explicit deterministic replay", () => {
 const keydown=listeners.get('keydown'),stage=element('stage');let writes=0,markup=stage.innerHTML;
 Object.defineProperty(stage,'innerHTML',{configurable:true,get(){return markup},set(v){writes++;markup=v}});
 const persistent={dataset:{},innerHTML:''};stage.querySelector=q=>q==='.systemic-stage'&&markup?.includes('p3-systemic')?persistent:null;
 const key=k=>keydown({key:k,target:null,preventDefault(){}});key('Home');
 for(const c of CUES.slice(0,6))for(const r of c.steps){if(r==='policy-question')clickAction('check-policy');else key(r==='causal-explanation'?'c':'ArrowRight');}
 assert.equal(stage.dataset.reveal,'independent-agents');const before=writes;key('ArrowRight');
 assert.equal(stage.dataset.reveal,'common-shock');assert.equal(persistent.dataset.phase,'common-shock');
 assert.match(persistent.innerHTML,/ASIAN EQUITIES FALL/);assert.equal(writes,before);
 key('r');assert.equal(writes,before+1);key('ArrowLeft');assert.equal(stage.dataset.reveal,'independent-agents');
 assert.equal(persistent.dataset.phase,'independent-agents');
});

test('Arc 2 system assurance replaces monitor-evasion staging without attributing deception', () => {
 const research=renderMaterialCase(12),design=renderMaterialCase(9);
 assert.match(research,/SINGAPORE AISI/);assert.match(research,/GOOGLE DEEPMIND/);
 assert.doesNotMatch(research,/85%|Mythos|EVASION/);
 assert.match(design,/REQUIREMENTS.*IMPLEMENTATION.*TESTING.*DOMAIN VALIDATION/s);
 assert.match(design,/THE CODE PASSED/);assert.match(design,/THE BUSINESS RULE WAS INCOMPLETE/);
 assert.match(renderMaterialCase(13),/WHAT IF THE HUMAN NEVER/);
});

test('opening question precedes the retained message and uses the single presenter bar', () => {
  const opening = renderView('opening', 0);
  assert.match(opening, /<span>WHEN AI STARTS ACTING,<\/span><strong>WHO IS THE SUPERVISOR\?<\/strong>/);
  assert.match(opening, /OPERATIONS · FUND ACCOUNTING · LIQUIDITY MANAGEMENT/);
  assert.doesNotMatch(opening, /START →|WHERE DOES INTELLIGENCE END|Human, AI or Both/);
  assert.match(renderView('opening', 1), /ARTIFICIAL INTELLIGENCE IN FINANCE<br>IS MOVING FROM RULES<br>TO <span class="cyan">GENERATIVE AND AUTONOMY/);
  assert.match(renderView('opening', 1), /WHAT IS HUMAN-IN-THE-LOOP/);
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const ids = ['previousButton', 'pauseButton', 'playButton', 'replayButton', 'beatCounter', 'nextButton'];
  const positions = ids.map(id => html.indexOf('id="' + id + '"'));
  assert.ok(positions.every((value, index) => value >= 0 && (index === 0 || value > positions[index - 1])));
  assert.equal((html.match(/class="presenter-control"/g) ?? []).length, 1);
  assert.doesNotMatch(html, /motion-controls|START/);
});

test('all non-NAV screens and source modules remain identical to the accepted baseline', async () => {
 const {createHash}=await import('node:crypto'),hash=v=>createHash('sha256').update(v).digest('hex');
 const c=JSON.parse(readFileSync(new URL('../artifacts/nav-revision/baseline/contracts.json',import.meta.url),'utf8'));
 const markup=CUES.filter(c=>c.id!=='nav').flatMap(c=>c.steps.map((_,s)=>{
  const html=renderView(c.id,s);
  // Approved retrospective additions only; retain the exact prior hero/layout contract.
  return c.steps[s]==='retrospective-question' ? html.replace(/<div class="arc2-retro-actions">.*?<\/div><p class="arc2-retro-reference">.*?<\/p>/s,'') : html;
 })).join('\n');
 assert.equal(hash(markup),c.protectedMarkupHash);
 assert.equal(hash(readFileSync(new URL('../styles.css',import.meta.url),'utf8').slice(0,c.cssLength)),c.cssHash);
 for(const [f,h] of Object.entries(c.sourceHashes))assert.equal(hash(readFileSync(new URL('../src/'+f,import.meta.url))),h);
});

test('settlement signal, cognitive limit and requested custody responsibilities remain deterministic', async () => {
  const {SETTLEMENT_WORKFLOW}=await import('../src/settlement-workflow.mjs');
  const signal=renderView('operations',4),cognitive=renderView('operations',5),run=buildRun();
  assert.match(signal,/1 FAILED TRADE · 8 AGENTS · 27 SUBTASKS · 3\.2 SECONDS/);
  assert.match(cognitive,/LOGGED\. AUDITABLE\.<br>THEORETICALLY REVIEWABLE\./);
  assert.ok(cognitive.includes('At 10 investigations per month: '+(10*run.events.length).toLocaleString('en-US')+' trace events.'));
  assert.match(cognitive,/BUT COGNITIVELY OUT OF REACH/);
  const evidence=renderSettlementWorkEvidence();
  assert.deepEqual(SETTLEMENT_WORKFLOW.map(a=>a.role),['Case Orchestrator','Settlement Instructions Agent','Custody Position Agent','Cash & FX Agent','Counterparty & SSI Agent','Messaging & Network Agent','Reference Data & Market Calendar Agent','Supervisory / Materiality Agent']);
  assert.equal(SETTLEMENT_WORKFLOW.flatMap(a=>a.tasks).length,27);
  assert.equal(new Set(SETTLEMENT_WORKFLOW.flatMap(a=>a.tasks)).size,27);
  assert.equal((evidence.match(/data-workflow-agent=/g)||[]).length,8);
  assert.equal((evidence.match(/data-workflow-task=/g)||[]).length,27);
  assert.equal((evidence.match(/<li data-agent-id=/g)||[]).length,run.agents.length);
  assert.equal((evidence.match(/<li data-task-id=/g)||[]).length,run.tasks.length);
  for(const task of run.tasks)assert.ok(evidence.includes('<strong>'+task.id+' · '+task.label+'</strong><br>'+task.actor+' · '+task.agentId));
  assert.equal(renderSettlementWorkEvidence(),evidence);
  assert.doesNotMatch(evidence,/EVT-0238|central-bank-related|76|CLASSIFICATION_CHANGED/);
});
