import { AGENT_IDENTITIES, buildRun, EVIDENCE, evaluateGate, supervise, validateRun } from "./scenario.mjs";
import { BEATS, CASE_ACTIONS, CUES, NARRATIVE_INDICATORS, SYSTEMIC_ACTIONS, SYSTEMIC_AGENTS, SYSTEMIC_ANNOUNCEMENTS, createPresentationState, currentCue, currentReveal, transition } from "./presentation.mjs";

const run = buildRun();
if (!validateRun(run)) throw new Error("The synthetic run failed its trace contract.");
const finding = supervise(run.events);
const gate = evaluateGate(run.gateInput);
const classification = run.events.find((event) => event.kind === "CLASSIFICATION_CHANGED");
const riskEvent = run.events.find((event) => event.kind === "RISK_UPDATED" && event.parentIds.includes(classification?.id));
const proposalEvent = run.events.find((event) => event.kind === "INTERVENTION_RECOMMENDED" && event.parentIds.includes(riskEvent?.id));
if (!finding?.sourceEventIds.includes(classification?.id) ||
    !finding.sourceEventIds.includes(riskEvent?.id) ||
    !finding.sourceEventIds.includes(proposalEvent?.id) ||
    !run.counterfactual.evidenceIds.includes(EVIDENCE.bankResponse.id) ||
    !EVIDENCE.entityFiling.finding.includes(classification.before) ||
    run.counterfactual.before !== riskEvent.after ||
    run.counterfactual.after !== riskEvent.before ||
    proposalEvent.proposedAction !== run.gateInput.proposedAction ||
    run.gateInput.mandate !== "recommend" ||
    gate.disposition !== "ESCALATE") {
  throw new Error("The presentation has lost its source-event or challenge link.");
}
const stage = document.getElementById("stage");
const beatCounter = document.getElementById("beatCounter");
const announcer = document.getElementById("cueAnnouncement");
const stageStatus = document.getElementById("stageStatus");
const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");
const contextButton = document.getElementById("contextButton");
const drawer = document.getElementById("drawer");
const drawerTitle = document.getElementById("drawerTitle");
const drawerBody = document.getElementById("drawerBody");

let presentation = createPresentationState();
let floodState = null;
let gateState = null;
let paused = false;
let focusBeforeDrawer = null;
const review = { classification: "pending", intervention: "pending", openedEvidence: false, challenged: false };

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function wrap(id, content, modifier = "") {
  return '<article class="cue cue--' + id + ' ' + modifier + '"><div class="cue-content">' + content + "</div></article>";
}

function number(value, tone = "") {
  return '<span class="hero-number ' + tone + '">' + escapeHTML(value) + "</span>";
}

function button(label, action, className = "quiet-button") {
  return '<button type="button" class="' + className + '" data-action="' + action + '">' + label + "</button>";
}

function renderTree() {
  const workstreams = [
    ['TRADE DATA', 'T-09'], ['SETTLEMENT', 'T-11'], ['ENTITY GRAPH', 'T-17'],
    ['CASH', 'T-14'], ['COUNTERPARTY', 'T-06'], ['MARKET RULE', 'T-07'],
    ['DISCLOSURE', 'T-05'], ['AUDIT', 'T-24'],
  ];
  if (!workstreams.every(([, taskId]) => run.tasks.some((task) => task.id === taskId))) {
    throw new Error('A displayed workstream is not linked to a synthetic task.');
  }
  return '<div class="exception-tree"><p class="tree-origin">1 FAILED TRADE</p>' +
    '<div class="tree-stem" aria-hidden="true">↓</div><p class="tree-orchestrator">INVESTIGATOR</p>' +
    '<div class="workstreams">' + workstreams.map(([label, taskId], index) =>
      '<span style="--delay:' + (index * 120) + 'ms" data-task-id="' + taskId + '">' + label + '</span>'
    ).join('') + '</div></div>';
}

export function renderMaterialCase(step) {
  const prior = escapeHTML(classification.before.replaceAll('-', ' ').toUpperCase());
  const derived = escapeHTML(classification.after.replaceAll('-', ' ').toUpperCase());
  const before = escapeHTML(riskEvent.before);
  const after = escapeHTML(riskEvent.after);
  const counterfactual = escapeHTML(run.counterfactual.after);
  const scenes = [
    '<div class="case-causal"><h1>WHY ' + after + '?</h1>' +
      '<div class="case-causal-classification"><span>ENTITY X · DERIVED CLASSIFICATION</span><p>' + prior + ' <i aria-hidden="true">↓</i> <strong>' + derived + '</strong></p></div>' +
      '<div class="case-causal-score">' + before + ' <span>→</span> ' + after + '</div>' +
      '<p class="case-causal-proposal">ENHANCED LIQUIDITY RESTRICTION<br>RECOMMENDED</p></div>',
    '<div class="case-source"><div class="case-system-fact"><p class="case-kicker">SYSTEM DERIVED CLASSIFICATION</p><strong>' + derived + '</strong></div>' +
      '<div class="case-source-record"><p class="case-kicker">SOURCE RECORD</p><strong>' + prior + '</strong></div>' +
      '<div class="case-institution"><span>BANK COMPLIANCE AGENT</span><strong>COUNTER-EVIDENCE SUBMITTED</strong>' +
      '<small>ORIGINAL INFERENCE RETAINED <i>+</i> COUNTER-EVIDENCE APPENDED</small></div>' +
      '<p class="case-contested">FACT CONTESTED</p><p class="case-subtle">AI MAY CHALLENGE AI. NEITHER REWRITES THE EVIDENCE.</p></div>',
    '<div class="case-counterfactual"><div class="cf-facts"><span class="cf-derived">' + derived + '</span><strong class="cf-source">' + prior + '</strong></div>' +
      '<div class="cf-score"><strong class="cf-old">' + escapeHTML(run.counterfactual.before) + '</strong><span aria-hidden="true">↓</span><strong class="cf-new">' + counterfactual + '</strong></div>' +
      '<p class="cf-recommendation">ENHANCED LIQUIDITY RESTRICTION <span>BASIS CHALLENGED</span></p>' +
      '<h1 class="cf-one">ONE FACT CHANGED.</h1>' +
      '<p class="cf-same"><span>SAME MODEL.</span><span>SAME RULES.</span><span>SAME OTHER EVIDENCE.</span><span>DIFFERENT FACT.</span></p></div>',
  ];
  return '<div class="case-stage" data-case-step="' + step + '"><div class="case-visual" aria-live="polite">' + scenes[step] + '</div>' +
    '<div class="case-controls">' + button(CASE_ACTIONS[step] + ' →', 'next', 'case-primary') +
    (step === 2 ? button('REPLAY', 'replay', 'case-secondary') : button('SHOW MORE', 'open-source', 'case-secondary')) +
    button('RESET', 'reset-beat', 'case-secondary') + '</div></div>';
}

function renderSystemicAgent(agent, index) {
  const side = index < 3 ? 'left' : 'right';
  const first = 550 + index * 240;
  const feedback = 2850 + index * 140;
  const second = 3600 + index * 160;
  const secondFlow = 4700 + index * 160;
  return '<article class="systemic-agent" data-agent-id="' + agent.id + '" style="--first-delay:' + first + 'ms;--feedback-delay:' + feedback + 'ms;--second-delay:' + second + 'ms;--second-flow-delay:' + secondFlow + 'ms">' +
    '<strong class="agent-name">PORTFOLIO ' + agent.id + '</strong>' +
    '<span class="agent-silhouette" aria-hidden="true">' + agent.id + '</span>' +
    '<div class="agent-intent"><span>' + escapeHTML(agent.objective) + '</span><small>' + escapeHTML(agent.constraint) + '</small></div>' +
    '<strong class="agent-response">' + escapeHTML(agent.response) + '</strong>' +
    '<div class="agent-reoptimise"><small>' + escapeHTML(agent.feedback) + '</small><strong>' + escapeHTML(agent.secondResponse) + '</strong></div>' +
    '<span class="agent-mandate" aria-label="Within mandate">✓</span>' +
    '<span class="agent-flow agent-flow--first" aria-hidden="true">' + (side === 'left' ? '→' : '←') + '</span>' +
    '<span class="agent-flow agent-flow--feedback" aria-hidden="true">' + (side === 'left' ? '←' : '→') + '</span>' +
    '<span class="agent-flow agent-flow--second" aria-hidden="true">' + (side === 'left' ? '⇢' : '⇠') + '</span></article>';
}

export function renderSystemic(step) {
  const agents = SYSTEMIC_AGENTS.map(renderSystemicAgent);
  return '<div class="systemic-stage" data-phase="' + step + '">' +
    '<header class="systemic-head"><h1>MANY AGENTS. DIFFERENT GOALS. SIMILAR DECISIONS.</h1></header>' +
    '<div class="systemic-network">' +
      '<div class="systemic-mandate-summary">6 / 6 WITHIN MANDATE ✓</div>' +
      '<div class="systemic-agents systemic-agents--left">' + agents.slice(0, 3).join('') + '</div>' +
      '<div class="systemic-market"><div class="market-common"><strong>SAME MARKET</strong><span>OVERLAPPING DATA</span><span>SIMILAR AI INFRASTRUCTURE</span></div>' +
        '<div class="market-signal"><strong>COMMON MARKET SIGNAL</strong><span>VOLATILITY ↑</span><span>MARKET DEPTH ↓</span><span>EXPECTED DOWNSIDE ↑</span></div>' +
        '<div class="market-direction">DE-RISK / SELL</div>' +
        '<div class="market-change-lead">THE MARKET CHANGES.</div>' +
        '<div class="market-effects"><strong>AGGREGATE MARKET EFFECT</strong><span>MARKET DEPTH ↓↓</span><span>BID–ASK SPREAD ↑</span><span>VOLATILITY ↑</span></div>' +
        '<div class="market-feedback">CHANGED MARKET → AGENTS RE-OPTIMISE</div>' +
      '</div>' +
      '<div class="systemic-agents systemic-agents--right">' + agents.slice(3).join('') + '</div>' +
      '<div class="systemic-transmission">' +
        '<div><strong>MARKET</strong><span>Liquidity ↓</span><span>Volatility ↑</span></div>' +
        '<div><strong>BROKER / PRIME</strong><span>Margin requirements ↑</span><span>Funding demand ↑</span></div>' +
        '<div><strong>CLEARING / COLLATERAL</strong><span>Collateral calls ↑</span><span>Eligible collateral demand ↑</span></div>' +
        '<div><strong>CUSTODY / POST-TRADE</strong><span>Settlement activity ↑</span><span>Cash / FX requirements ↑</span></div>' +
      '</div>' +
      '<div class="systemic-punch"><strong>NO AGENT FAILED.</strong><strong>THE SYSTEM CHANGED.</strong></div>' +
      '<div class="systemic-bridge"><p>WE SPENT THIS SESSION ASKING<br>HOW TO GOVERN AUTONOMOUS AGENTS.</p>' +
        '<p>BUT THE FINANCIAL SYSTEM IS NOT SIMPLY<br>THE SUM OF INDIVIDUALLY GOVERNED AGENTS.</p>' +
        '<h2>WHO IS SUPERVISING THE SYSTEM?</h2></div>' +
    '</div>' +
    '<div class="systemic-footer"><div class="systemic-inference"><p>DIFFERENT OBJECTIVES. SIMILAR RESPONSE.</p><strong>NO COORDINATION REQUIRED.</strong></div>' +
      '<div class="systemic-cycle">OPTIMISE → ACT → MARKET CHANGES → OBSERVE → OPTIMISE AGAIN</div>' +
      '<div class="systemic-feedback-punch">CORRELATION BECOMES FEEDBACK.</div>' +
      button(SYSTEMIC_ACTIONS[step] + ' →', 'next', 'systemic-primary') + '</div>' +
    '</div>';
}

const gateChecks = [
  ["IDENTITY + MANDATE", run.gateInput.verifiedIdentity && run.gateInput.mandate === "recommend" ? "VERIFIED ✓ · RECOMMEND ONLY" : "NOT VERIFIED"],
  ["ACTION + MATERIALITY", run.gateInput.proposedAction === "restrict_activity" && run.gateInput.materiality === "high" ? "RESTRICT LIQUIDITY · HIGH" : "CHECK PROPOSAL"],
  ["EVIDENCE", run.gateInput.evidenceQuality.toUpperCase()],
  ["EXECUTION AUTHORITY", gate.disposition === "ESCALATE" ? "INSUFFICIENT" : gate.disposition],
];

export function renderView(id, step) {
  switch (id) {
    case "opening":
      return wrap(id, step === 0 ?
        '<h1 class="hero-verdict wide">AUTONOMOUS FINANCE IS MOVING<br>FROM ANSWERS <span class="cyan">→</span> TO ACTIONS</h1>' +
        '<div class="opening-signposts"><span>OPERATIONS</span><span>TRANSACTIONS</span><span>PORTFOLIOS</span></div>' :
        '<div class="opening-ladder"><span>ASSIST</span><i>↓</i><span>INVESTIGATE</span><i>↓</i><span>ASSESS</span><i>↓</i><span>ACT</span></div>' +
        '<h1 class="opening-question">AUTONOMOUS TO DO WHAT?</h1>' +
        '<p class="opening-answer">NOT HOW INTELLIGENT THE AI IS.<br>HOW MUCH AUTHORITY ACCOMPANIES IT.</p>', "centered");
    case "operations":
      if (step === 0) return wrap(id,
        '<div class="ops-case">' + renderTree() +
        '<div class="ops-scale"><strong>' + run.agents.length + ' AGENTS</strong><strong>' + run.tasks.length + ' SUB-TASKS</strong></div>' +
        '<p class="ops-help">AGENTS CAN HELP.</p></div>', "centered");
      if (step === 1) return wrap(id,
        '<div class="assurance-lines"><p><span>✓</span> HUMAN OVERSIGHT ENABLED</p>' +
        '<p><span>✓</span> EVERY ACTION LOGGED</p>' +
        '<p><span>✓</span> EVERYTHING REVIEWABLE</p></div>' +
        button("START WORKFLOW →", "next", "stage-button stage-button-primary"), "centered");
      if (step === 2) return wrap(id,
        '<div class="flood-layout"><div class="flood-metric">' +
          '<span id="floodNumber" class="hero-number cyan">' + run.agents.length + "</span>" +
          '<span id="floodUnit" class="hero-unit">AGENTS</span>' +
          '<div class="stage-actions">' + button("Replay", "replay", "quiet-button") +
            button("Pause", "pause", "quiet-button") + "</div></div>" +
          '<div class="flood-log" aria-hidden="true"><div class="flood-log-head">INTERLEAVED AGENT TRACE <span id="floodCount">000 / ' + run.events.length + '</span></div>' +
          '<div id="floodLines" class="flood-log-lines"></div></div></div>', "flood");
      if (step === 3) return wrap(id,
        '<h1 class="hero-verdict">HUMAN REVIEW REQUIRED</h1>' +
        '<div class="naive-count">' + number(run.events.length) + '<span>TRACE EVENTS</span></div>' +
        '<div class="naive-actions">' + button("AUTHORISE", "naive-authorise", "stage-button") +
          button("REJECT", "naive-reject", "stage-button") + "</div>", "centered");
      return wrap(id,
        '<h1 class="hero-verdict impact">ON WHAT BASIS?</h1>' +
        '<p class="primary-line">Logged. Auditable. Theoretically reviewable.</p>' +
        '<p class="support-line">BUT COGNITIVELY OUT OF REACH.</p>', "centered");
    case "supervision":
      return wrap(id,
        '<div class="case-compression"><div><strong>' + run.events.length + '</strong><span>TRACE EVENTS</span></div><i aria-hidden="true">↓</i><div class="case-compression-result"><strong>1</strong><span>MATERIAL ISSUE</span></div></div>' +
        '<h1 class="supervision-question">WHO DECIDED WHAT THE HUMAN SAW?</h1>' +
        '<p class="supervision-trust">PROVENANCE <span>·</span> UNCERTAINTY <span>·</span> CONTESTABILITY</p>', "centered");
    case "prediction":
      if (step === 0) return wrap(id,
        '<p class="prediction-context">AGENTIC PAYMENTS · DIGITAL ASSETS · TREASURY</p>' +
        '<div class="prediction-metrics"><div><strong>' + run.scoreHistory[4].score + '</strong><span>RISK COEFFICIENT</span></div>' +
        '<div><strong>' + run.prediction.percent + '%</strong><span>PREDICTED MATERIAL EVENT</span></div></div>' +
        '<p class="prediction-recommendation">RECOMMEND: ENHANCED LIQUIDITY RESTRICTION</p>', "centered");
      return wrap(id,
        '<h1 class="hero-verdict impact">NO RULE HAS BEEN BREACHED</h1>' +
        '<p class="primary-line">PREDICTION ≠ PERMISSION</p>', "centered");
    case "material-case":
      return wrap(id, renderMaterialCase(step), "centered");
    case "authority":
      if (step === 0) return wrap(id,
        '<h1 class="hero-verdict">HUMAN DECISION REQUIRED</h1>' +
        '<div class="decision-questions"><p>IS THE ENTITY X CLASSIFICATION VALID?</p>' +
        '<p>IF VALID, DOES IT JUSTIFY INTERVENTION?</p></div>' +
        '<p class="support-line">Humans at boundaries of authority, not every boundary of computation.</p>', "centered");
      if (step === 1) return wrap(id,
        '<h1 class="stage-heading">RUNTIME AUTHORITY CHECK</h1>' +
        '<div class="gate-steps">' + gateChecks.map(([label, value]) =>
          '<div class="gate-step"><span>' + label + "</span><strong>" + value + "</strong></div>"
        ).join("") + "</div>" +
        '<p id="gateStatus" class="gate-status">CHECKING DELEGATED AUTHORITY</p>', "centered");
      return wrap(id,
        '<h1 class="hero-verdict mega amber">' + gate.disposition + "</h1>" +
        '<p class="primary-line">RESTRICTION NOT EXECUTED</p>' +
        '<p class="support-line">CONFIDENCE DOES NOT CREATE AUTHORITY.</p>', "centered");
    case "systemic":
      return wrap(id, renderSystemic(step), "centered");
    case "ghost":
      if (step === 0) return wrap(id, '<h1 class="hero-verdict impact">WHO IS THE SUPERVISOR?</h1>', "centered");
      if (step === 1) return wrap(id, '<h1 class="hero-verdict impact">WHERE IS THE RIGHT LOOP?</h1>' +
        '<p class="ghost-support">HUMAN JUDGEMENT AT THE DECISION THAT ACTUALLY MATTERS.</p>', "centered");
      if (step === 2) return wrap(id, '<h1 class="hero-verdict">WHO SUPERVISES<br>THE SUPERVISORY AI?</h1>' +
        '<p class="ghost-support">AND WHO SUPERVISES THE SYSTEM<br>THAT EMERGES FROM ALL OF THEM?</p>', "centered");
      if (step === 3) return wrap(id, '<div class="ghost-propositions"><p>INTELLIGENCE CAN BE DISTRIBUTED.</p>' +
        '<p>AUTHORITY MUST BE DELIBERATE.</p><p>ACCOUNTABILITY CANNOT DISAPPEAR INTO THE NETWORK.</p></div>', "centered");
      return wrap(id, '<h1 class="ghost-final">WHERE DOES INTELLIGENCE END<br>AND AUTHORITY BEGIN?</h1>', "centered");
    default:
      throw new Error("Unknown presentation cue: " + id);
  }
}

function detailAction(id, step) {
  if (id === "operations") return ["SHOW MORE", "open-evidence"];
  if (id === "supervision") return ["SHOW MORE", "open-trust"];
  if (id === "prediction") return ["SHOW MORE", "open-evidence"];
  if (id === "material-case") return ["SHOW MORE", "open-source"];
  if (id === "authority") return step === 0 ? ["SHOW MORE", "open-review"] : ["SHOW MORE", "open-gate"];
  if (id === "systemic") return ["SHOW MORE", "open-systemic"];
  return null;
}

function stopAnimations() {
  if (floodState?.requestId) cancelAnimationFrame(floodState.requestId);
  if (gateState?.requestId) cancelAnimationFrame(gateState.requestId);
  floodState = null;
  gateState = null;
}

function renderCue(forceReplay = false) {
  stopAnimations();
  paused = false;
  stage.classList.remove("is-paused");
  const cue = currentCue(presentation);
  const persistentSystemic = !forceReplay && cue.id === 'systemic' && stage.dataset.cue === 'systemic' && stage.querySelector?.('.systemic-stage');
  stage.dataset.cue = cue.id;
  stage.dataset.reveal = currentReveal(presentation);
  if (persistentSystemic) {
    persistentSystemic.dataset.phase = String(presentation.step);
    persistentSystemic.querySelector('.systemic-primary').textContent = SYSTEMIC_ACTIONS[presentation.step] + ' →';
  } else {
    stage.innerHTML = renderView(cue.id, presentation.step);
  }
  const indicator = NARRATIVE_INDICATORS[presentation.cueIndex];
  stageStatus.innerHTML = '<span>AI ROLE: <strong>' + indicator.role + '</strong></span>' +
    '<span>' + indicator.label + ': <strong>' + indicator.value + '</strong></span>';
  stageStatus.classList.toggle('is-question', presentation.cueIndex >= 4);
  document.querySelector('.app-shell').classList.toggle('is-closing', cue.id === 'ghost');
  beatCounter.textContent = "BEAT " + (presentation.cueIndex + 1) + "/" + BEATS.length;
  announcer.textContent = "Beat " + (presentation.cueIndex + 1) + ": " + BEATS[presentation.cueIndex] + ". " +
    (cue.id === 'systemic' ? SYSTEMIC_ANNOUNCEMENTS[presentation.step] : currentReveal(presentation).replaceAll("-", " "));
  previousButton.disabled = presentation.cueIndex === 0 && presentation.step === 0;
  nextButton.disabled = presentation.cueIndex === CUES.length - 1 && presentation.step === cue.steps.length - 1;
  nextButton.setAttribute("aria-label", cue.id === "material-case" ? CASE_ACTIONS[presentation.step] :
    cue.id === 'systemic' ? SYSTEMIC_ACTIONS[presentation.step] : "Next reveal");
  const detail = detailAction(cue.id, presentation.step);
  contextButton.hidden = !detail || cue.id === "material-case";
  if (detail) {
    contextButton.textContent = detail[0];
    contextButton.dataset.action = detail[1];
  }
  if (currentReveal(presentation) === "event-flood") startFlood();
  if (currentReveal(presentation) === "gate-run") startGate();
}

function move(action) {
  const next = transition(presentation, action);
  if (next === presentation) return;
  closeDrawer();
  presentation = next;
  renderCue();
}

export function formatTraceLine(event) {
  return String(event.atMs).padStart(4, "0") + "ms  " + event.id + "  " +
    event.agentId + "  " + event.taskId + "  " + event.kind;
}

function appendFloodEvents(count) {
  if (!floodState || count <= floodState.shown) return;
  const lines = document.getElementById("floodLines");
  if (!lines) return;
  const fragment = document.createDocumentFragment();
  for (let index = floodState.shown; index < count; index++) {
    const event = run.events[index];
    const line = document.createElement("div");
    line.className = "log-line";
    line.textContent = formatTraceLine(event);
    fragment.appendChild(line);
  }
  lines.appendChild(fragment);
  lines.scrollTop = lines.scrollHeight;
  floodState.shown = count;
  document.getElementById("floodCount").textContent =
    String(count).padStart(3, "0") + " / " + run.events.length;
}

function updateFlood(elapsed) {
  const duration = run.events.at(-1).atMs;
  const phase = elapsed < 750 ? [run.agents.length, "AGENTS"] :
    elapsed < 1500 ? [run.tasks.length, "SUB-TASKS"] :
    elapsed < 2400 ? [run.events.length, "TRACE EVENTS"] :
    [(duration / 1000).toFixed(1), "SECONDS"];
  document.getElementById("floodNumber").textContent = phase[0];
  document.getElementById("floodUnit").textContent = phase[1];
  appendFloodEvents(Math.min(run.events.length, Math.floor(elapsed / duration * run.events.length)));
}

function floodTick(now) {
  if (!floodState || paused) return;
  const duration = run.events.at(-1).atMs;
  const elapsed = Math.min(duration, floodState.elapsed + now - floodState.startedAt);
  updateFlood(elapsed);
  if (elapsed < duration) floodState.requestId = requestAnimationFrame(floodTick);
  else {
    appendFloodEvents(run.events.length);
    floodState.elapsed = duration;
    floodState.requestId = null;
  }
}

function startFlood() {
  floodState = { startedAt: performance.now(), elapsed: 0, shown: 0, requestId: null };
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    updateFlood(run.events.at(-1).atMs);
    appendFloodEvents(run.events.length);
    floodState.elapsed = run.events.at(-1).atMs;
  } else {
    floodState.requestId = requestAnimationFrame(floodTick);
  }
}

function updateGate(elapsed) {
  const shown = Math.min(gateChecks.length, Math.floor(elapsed / 650) + 1);
  document.querySelectorAll(".gate-step").forEach((element, index) => {
    element.classList.toggle("revealed", index < shown);
  });
  if (shown === gateChecks.length) document.getElementById("gateStatus").textContent = "CHECK COMPLETE · REVEAL DISPOSITION";
}

function gateTick(now) {
  if (!gateState || paused) return;
  const duration = 2300;
  const elapsed = Math.min(duration, gateState.elapsed + now - gateState.startedAt);
  updateGate(elapsed);
  if (elapsed < duration) gateState.requestId = requestAnimationFrame(gateTick);
  else {
    gateState.elapsed = duration;
    gateState.requestId = null;
  }
}

function startGate() {
  gateState = { startedAt: performance.now(), elapsed: 0, requestId: null };
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    updateGate(2300);
    gateState.elapsed = 2300;
  } else {
    gateState.requestId = requestAnimationFrame(gateTick);
  }
}

function pauseOrResume() {
  if (currentCue(presentation).id !== 'systemic' && !["event-flood", "gate-run", "failed-trade", "material-issue", "causal-explanation", "source-challenge", "counterfactual"].includes(currentReveal(presentation))) return;
  paused = !paused;
  stage.classList.toggle("is-paused", paused);
  const pauseButton = stage.querySelector('[data-action="pause"]');
  if (pauseButton) {
    pauseButton.textContent = paused ? "Resume" : "Pause";
    pauseButton.setAttribute("aria-pressed", String(paused));
  }
  const clock = performance.now();
  for (const animation of [floodState, gateState]) {
    if (!animation) continue;
    if (paused) {
      animation.elapsed += clock - animation.startedAt;
      if (animation.requestId) cancelAnimationFrame(animation.requestId);
      animation.requestId = null;
    } else {
      animation.startedAt = clock;
      animation.requestId = requestAnimationFrame(animation === floodState ? floodTick : gateTick);
    }
  }
}

function detailBlock(label, value) {
  return '<div class="detail-block"><div class="detail-key">' + escapeHTML(label) +
    '</div><div class="detail-value">' + escapeHTML(value) + "</div></div>";
}

function agentDetail(event) {
  const task = run.tasks.find((item) => item.id === event.taskId);
  return detailBlock('Agent ID', event.agentId) +
    detailBlock('Agent role', event.actor) +
    detailBlock('Agent version', task?.agentVersion ?? 'unknown') +
    detailBlock('Principal', task?.principal ?? 'unknown') +
    detailBlock('Mandate', task?.mandate ?? 'unknown') +
    detailBlock('Task ID', event.taskId) +
    detailBlock('Event ID', event.id) +
    detailBlock('Parent event', event.parentIds.join(', ') || 'none') +
    detailBlock('Evidence source', event.evidenceIds.join(', ') || 'none');
}

function reviewLabel() {
  if (review.challenged) return "Supervisory finding challenged";
  if (review.classification === "pending") return "Pending: classification not yet judged";
  if (review.classification === "invalid") return "Classification rejected; intervention not justified";
  if (review.intervention === "pending") return "Classification valid; intervention pending";
  return "Classification valid; intervention " + (review.intervention === "yes" ? "supported" : "rejected");
}

function choiceButton(field, value, label) {
  const selected = review[field] === value ? " selected" : "";
  const disabled = field === "intervention" && review.classification !== "valid" && value !== "pending" ?
    " disabled" : "";
  return '<button class="drawer-button' + selected + '" type="button" data-action="review-' +
    field + '" data-value="' + value + '"' + disabled + ">" + label + "</button>";
}

function drawerContent(kind) {
  if (kind === "source") {
    review.openedEvidence = true;
    return {
      title: "Original event · T-17",
      body: "<p>This event was genuinely present in the 486-event stream. The later challenge appends evidence; it does not erase this record.</p>" +
        detailBlock("Raw event", classification.summary) +
        detailBlock("Trace position", classification.id + " · " + classification.atMs + " ms · sequence " + classification.sequence + " / " + run.events.length) +
        agentDetail(classification) +
        detailBlock("Original source", EVIDENCE.entityFiling.id + ": " + EVIDENCE.entityFiling.finding) +
        detailBlock("Derived interpretation", EVIDENCE.graphInference.id + ": " + EVIDENCE.graphInference.finding) +
        detailBlock("Uncertainty", EVIDENCE.graphInference.uncertainty) +
        detailBlock("Demo fingerprints", "Input " + classification.inputHash + " · output " + classification.outputHash + ". These are stable demo identifiers, not cryptographic proof.") +
        button("Open human decision", "open-review", "drawer-button strong"),
    };
  }
  if (kind === "trust") {
    return {
      title: "Supervisory AI trust controls",
      body: "<p>The Supervisory AI is a separate simulated control. It selects what reaches human attention but has no source-write or intervention authority.</p>" +
        detailBlock("Provenance", finding.sourceEventIds.join(" → ") + "; " + finding.sourceEvidenceIds.join(", ")) +
        detailBlock("Causal trace", finding.causalTrace.map((event) => event.actor + ": " + event.summary).join(" → ")) +
        detailBlock("Independence", finding.independence) +
        detailBlock("Uncertainty", finding.uncertainty) +
        detailBlock("Disagreement", finding.disagreement) +
        detailBlock("Reproducibility", finding.reproducibility) +
        detailBlock("Contestability", finding.contestability) +
        detailBlock("Authority", finding.authority.join(" and ") + " only; no intervention or source writes") +
        button("Open T-17", "open-source", "drawer-button"),
    };
  }
  if (kind === "gate") {
    return {
      title: "Runtime gate · original proposal",
      body: "<p>The original 76-based restriction proposal is evaluated with the later evidence dispute attached. The restriction is not executed.</p>" +
        detailBlock("Disposition", gate.disposition) +
        detailBlock("Decisive rule", gate.code + ": " + gate.reason) +
        detailBlock("Identity / mandate", "Verified / " + run.gateInput.mandate + " only") +
        detailBlock("Action / consequence", run.gateInput.proposedAction + " / " + run.gateInput.materiality + " materiality") +
        detailBlock("Evidence / rule", run.gateInput.evidenceQuality + " / no deterministic rule breach") +
        detailBlock("Human task", "Is the Entity X reclassification valid, and if valid is intervention justified?") +
        button("Open human review", "open-review", "drawer-button strong"),
    };
  }
  if (kind === "review") {
    return {
      title: "Human decision record",
      body: "<p>These are separate judgements. Recording a view does not execute the proposed restriction; runtime authority still applies.</p>" +
        '<div class="choice-group"><strong>1. Is Entity X correctly reclassified?</strong>' +
        choiceButton("classification", "pending", "Needs verification") +
        choiceButton("classification", "valid", "Valid") +
        choiceButton("classification", "invalid", "Invalid") + "</div>" +
        '<div class="choice-group"><strong>2. If valid, is intervention justified?</strong>' +
        choiceButton("intervention", "pending", "Pending") +
        choiceButton("intervention", "yes", "Yes") +
        choiceButton("intervention", "no", "No") + "</div>" +
        detailBlock("Current review state", reviewLabel()) +
        detailBlock("Original source opened", review.openedEvidence ? "Yes" : "No") +
        button("Inspect T-17", "open-source", "drawer-button") +
        button("Challenge the finding", "challenge-finding", "drawer-button warning"),
    };
  }
  if (kind === "systemic") {
    return {
      title: "Systemic illustration · source status",
      body: "<p>Beat 7 is a synthetic mechanism-of-concern, not an observed market incident or a second executable scenario. The six portfolio agents illustrate distinct objectives responding to shared conditions; they do not communicate.</p>" +
        detailBlock("Evidence status", "Regulatory research / synthetic illustration") +
        detailBlock("Public grounding", "BIS Project Logos; FSB AI financial-stability work; IOSCO AI in securities markets. See PUBLIC_SOURCES.md for primary links and qualifications.") +
        detailBlock("Scenario boundary", "The six-agent visual is separate from the deterministic 486-trace-event failed-trade run.") +
        detailBlock("Mandate", "Each illustrated portfolio agent remains within its own constraint; collective transmission is a possibility, not a forecast."),
    };
  }
  return {
    title: "Replay evidence",
    body: "<p>This is one deterministic synthetic run. The stage counters, original log, supervisory finding and gate all refer to the same data.</p>" +
      detailBlock("Run", run.id + " · version " + run.version) +
      detailBlock("Opening exception", run.caseContext.count + " " + run.caseContext.exception + " · " + run.caseContext.openingEventId + " · " + run.caseContext.context) +
      detailBlock("Scale", run.agents.length + " agents · " + run.tasks.length + " sub-tasks · " + run.events.length + " trace events · " + (run.events.at(-1).atMs / 1000).toFixed(1) + " simulated seconds") +
      detailBlock("Agent identity format", AGENT_IDENTITIES.EntityGraph + " · demo-local stable identity, SAFR-inspired but not SAFR-prescribed") +
      detailBlock("Material event", finding.sourceEventIds[0] + ": " + classification.summary) +
      detailBlock("Causal event IDs", finding.sourceEventIds.join(" → ")) +
      detailBlock("Gate", gate.disposition + ": " + gate.reason) +
      button("Open original event", "open-source", "drawer-button") +
      button("Inspect trust controls", "open-trust", "drawer-button"),
  };
}

function openDrawer(kind) {
  if (drawer.hidden) focusBeforeDrawer = document.activeElement;
  const content = drawerContent(kind);
  drawerTitle.textContent = content.title;
  drawerBody.innerHTML = content.body +
    '<div class="drawer-footer">' +
      button("Export full synthetic run", "download-run", "drawer-button") +
      button("Reset presentation", "reset", "drawer-button") +
    "</div>";
  drawer.hidden = false;
  drawer.querySelector(".drawer-close").focus();
}

function closeDrawer() {
  if (drawer.hidden) return;
  drawer.hidden = true;
  if (focusBeforeDrawer?.isConnected) focusBeforeDrawer.focus();
  focusBeforeDrawer = null;
}

function downloadRun() {
  const payload = {
    ...run,
    supervisoryFinding: finding,
    runtimeGate: gate,
    humanReview: { ...review, status: reviewLabel() },
    naiveReviewAttempt: presentation.naiveAttempt,
    note: "Synthetic teaching simulation. Demo fingerprints are not cryptographic proof.",
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "regulator-ghost-replay.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

document.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const control = target?.closest("[data-action]");
  if (!control) {
    if (event.target === drawer) closeDrawer();
    return;
  }
  const action = control.dataset.action;
  const value = control.dataset.value;
  if (action === "next" || action === "previous" || action === "reset-beat") move(action);
  else if (action === "naive-authorise") move("authorise");
  else if (action === "naive-reject") move("reject");
  else if (action === "replay") renderCue(true);
  else if (action === "pause") pauseOrResume();
  else if (action === "open-evidence") openDrawer("evidence");
  else if (action === "open-source") openDrawer("source");
  else if (action === "open-trust") openDrawer("trust");
  else if (action === "open-gate") openDrawer("gate");
  else if (action === "open-review") openDrawer("review");
  else if (action === "open-systemic") openDrawer("systemic");
  else if (action === "close-drawer") closeDrawer();
  else if (action === "download-run") downloadRun();
  else if (action === "reset") {
    closeDrawer();
    presentation = transition(presentation, "reset");
    Object.assign(review, { classification: "pending", intervention: "pending", openedEvidence: false, challenged: false });
    renderCue();
  } else if (action === "challenge-finding") {
    review.challenged = true;
    openDrawer("review");
  } else if (action === "review-classification") {
    review.classification = value;
    if (value !== "valid") review.intervention = value === "invalid" ? "no" : "pending";
    openDrawer("review");
  } else if (action === "review-intervention") {
    review.intervention = value;
    openDrawer("review");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !drawer.hidden) { closeDrawer(); return; }
  if (!drawer.hidden) {
    if (event.key === "Tab") {
      const focusable = [...drawer.querySelectorAll("button:not(:disabled), a[href]")];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    return;
  }
  const target = event.target instanceof Element ? event.target : null;
  if (event.key === "ArrowRight" || (event.key === " " && !target?.closest("button"))) {
    event.preventDefault();
    move("next");
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    move("previous");
  } else if (event.key === "Home") {
    event.preventDefault();
    presentation = transition(presentation, "reset");
    Object.assign(review, { classification: "pending", intervention: "pending", openedEvidence: false, challenged: false });
    renderCue();
  } else if (event.key.toLowerCase() === "r") {
    event.preventDefault();
    if (currentCue(presentation).id === 'systemic' || ["event-flood", "gate-run", "failed-trade", "material-issue", "causal-explanation", "source-challenge", "counterfactual"].includes(currentReveal(presentation))) renderCue(true);
    else move("reset-beat");
  } else if (event.key.toLowerCase() === "e") {
    const detail = detailAction(currentCue(presentation).id, presentation.step);
    if (detail) { event.preventDefault(); openDrawer(detail[1].slice(5)); }
  } else if (event.key.toLowerCase() === "p") {
    pauseOrResume();
  } else if (event.key.toLowerCase() === "f" && document.fullscreenEnabled) {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  }
});

renderCue();
