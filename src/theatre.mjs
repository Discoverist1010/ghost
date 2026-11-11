import { renderSystemic, renderSystemicBody, renderSystemicEvidence } from './systemic-theatre.mjs';
import { renderFinale } from './finale.mjs';
export { renderSystemic };
import { renderNav, renderNavEvidence, navRun } from './nav-theatre.mjs';
import { AGENT_IDENTITIES, DOMAIN_RULE, submitSourceChallenge, buildRun, EVIDENCE, evaluateGate, supervise, validateRun } from "./scenario.mjs";
import { BEATS, CASE_ACTIONS, CUES, NARRATIVE_INDICATORS, SYSTEMIC_ACTIONS, SYSTEMIC_ANNOUNCEMENTS, createPresentationState, currentCue, currentReveal, transition } from "./presentation.mjs";

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
let paused = false;
let sourceChallenge = null;
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
  if (step >= 3) return renderDeepCase(step);
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
    '<div class="case-source"><p class="human-trigger">HUMAN REQUESTED → CHECK SOURCE</p><div class="case-system-fact"><p class="case-kicker">SYSTEM DERIVED</p><strong>' + derived + '</strong></div>' +
      '<div class="case-source-record"><p class="case-kicker">SOURCE RECORD</p><strong>' + prior + '</strong></div>' +
      '<div class="case-institution"><strong>BANK COMPLIANCE AGENT</strong><span>COUNTER-EVIDENCE SUBMITTED</span></div>' +
      '<p class="case-contested">FACT CONTESTED</p><p class="case-subtle">THE SECOND AI DOES NOT SETTLE THE MATTER.<br>IT PREVENTS THE FIRST AI FROM SETTLING IT ALONE.</p></div>',
    '<div class="case-counterfactual"><div class="cf-facts"><span class="cf-derived">' + derived + '</span><strong class="cf-source">' + prior + '</strong></div>' +
      '<div class="cf-score"><strong class="cf-old">' + escapeHTML(run.counterfactual.before) + '</strong><span aria-hidden="true">↓</span><strong class="cf-new">' + counterfactual + '</strong></div>' +
      '<p class="cf-recommendation">ENHANCED LIQUIDITY RESTRICTION <span>BASIS CHALLENGED</span></p>' +
      '<h1 class="cf-one">ONE FACT CHANGED.</h1>' +
      '<p class="cf-conditional">CONDITIONAL COUNTERFACTUAL · CLASSIFICATION STILL CONTESTED</p><p class="cf-same"><span>SAME MODEL.</span><span>SAME RULES.</span><span>SAME OTHER EVIDENCE.</span><span>DIFFERENT FACT.</span></p></div>',
  ];
  return '<div class="case-stage" data-case-step="' + step + '"><div class="case-visual" aria-live="polite">' + scenes[step] + '</div>' +
    '<div class="case-controls">' + button(CASE_ACTIONS[step] + ' →', step === 0 ? 'check-source' : 'next', 'case-primary') +
    (step === 2 ? '' : button('SHOW MORE', 'open-source', 'case-secondary')) + '</div></div>';
}

function renderDeepCase(step) {
  const content = {
    3: '<h1 class="hero-verdict amber">CONFLICT OMITTED</h1><div class="omission-flow"><p>SUPERVISOR SUMMARY <strong>INCOMPLETE</strong></p><span>↓ INDEPENDENT SOURCE INSPECTION</span><p>UNDERLYING EVIDENCE <strong>STILL AVAILABLE</strong></p></div><p class="support-line">NOT DELETED. NO INTENTIONAL CONCEALMENT ESTABLISHED.</p>',
    4: '<h1 class="hero-verdict">WHO DESIGNED THE<br>CLASSIFICATION RULE?</h1><p class="primary-line">DOMAIN EXPERTS WERE CONSULTED.</p><p class="support-line">THEIR ESSENTIAL EXCEPTION NEVER REACHED THE RULE.</p>',
    5: '<div class="sdlc-flow"><span>REQUIREMENT</span><i>→</i><span>IMPLEMENTATION</span><i>→</i><span>TEST</span><i>→</i><span>DOMAIN REVIEW</span></div><div class="sdlc-gap"><p>CENTRAL-BANK-RELATED EXCEPTION</p><strong>ABSENT FROM RULE + ACCEPTANCE TESTS</strong></div><h1 class="sdlc-punch">THE CODE PASSED.<br>THE BUSINESS RULE WAS INCOMPLETE.</h1><p class="support-line">DOMAIN EXPERTISE THROUGHOUT THE LIFECYCLE.</p>',
    6: '<h1 class="hero-verdict">CAN THE MONITOR BE EVADED?</h1><p class="research-institute">UK AI SECURITY INSTITUTE</p><strong class="hero-number amber">85%</strong><p class="research-qualification">Action-monitor evasion in a specific controlled Mythos 5.2 evaluation after repeated monitor feedback.</p>',
    7: '<h1 class="hero-verdict">IF AI CAN LEARN TO EVADE A MONITOR,<br>WHO TESTS THE SUPERVISORY AI?</h1><p class="primary-line">INDEPENDENT MONITORING · EVIDENCE ACCESS</p><p class="support-line">BOUNDED PERMISSIONS · ADVERSARIAL ASSURANCE</p><p class="guidance-anchor">OWASP Securing Agentic Applications V2 · Technical guidance</p>',
    10: '<h1 class="hero-verdict">CAN THE HUMAN DISAGREE?</h1><p class="primary-line">EXPERTISE · CAPACITY · EVIDENCE</p><p class="primary-line">INDEPENDENCE · CONFIDENCE</p>',
  };
  if (step === 8 || step === 9) return renderView('runtime', step - 8);
  return '<div class="deep-case">' + content[step] + '<div class="case-controls">' +
    button(CASE_ACTIONS[step] + ' →', 'next', 'case-primary') +
    button('SHOW MORE', step <= 5 ? 'open-domain' : step === 10 ? 'open-review' : 'open-research', 'case-secondary') + '</div></div>';
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
      if (step === 0) return wrap(id,
        '<p class="opening-eyebrow">THE QUESTION</p>' +
        '<h1 class="opening-title"><span>WHEN AI STARTS ACTING,</span><strong>WHO IS THE SUPERVISOR?</strong></h1>' +
        '<div class="opening-rule" aria-hidden="true"></div>' +
        '<p class="opening-domains">OPERATIONS · FUND ACCOUNTING · LIQUIDITY MANAGEMENT</p>', 'centered');
      step -= 1;
      if (step >= 1 && step <= 4) {
        const technologies = ['RULES', 'ML PATTERN DETECTION', 'LLM INVESTIGATION', 'AGENTIC SUPERVISION'];
        const descriptions = ['DETERMINISTIC CHECKS', 'RECOGNISE UNUSUAL PATTERNS', 'EXPLAIN. QUESTION. INVESTIGATE.', 'AUTONOMOUS MULTI-STEP WORK'];
        return wrap(id, '<div class="technology-path">' + technologies.slice(0, step).map((name, i) => '<span class="' + (i === step - 1 ? 'active' : '') + '">' + name + '</span>').join('<i>→</i>') + '</div><h1 class="hero-verdict">' + descriptions[step - 1] + '</h1><p class="support-line">' + (step === 1 ? 'RULES REMAIN APPROPRIATE FOR DETERMINISTIC CHECKS.' : step === 4 ? 'GREATER CAPABILITY DOES NOT GRANT GREATER AUTHORITY.' : 'CAPABILITIES WORK TOGETHER.') + '</p>', 'centered');
      }
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
          "</div>" +
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
      if (step === 1) return wrap(id,
        '<h1 class="hero-verdict dependency-question">WHO DECIDED WHAT THE HUMAN SAW?</h1>' +
        '<p class="dependency-punch">THE SOLUTION CREATED A NEW DEPENDENCY.</p>' +
        '<div class="regulatory-anchors"><p><strong>FSB:</strong> Complex agentic activity may require AI-assisted monitoring; effective human oversight remains essential.</p><p><strong>MAS AIRM:</strong> Automation bias and decision fatigue challenge meaningful human oversight.</p></div>', 'centered');
      return wrap(id,
        '<div class="case-compression"><div><strong>' + run.events.length + '</strong><span>TRACE EVENTS</span></div><i aria-hidden="true">↓</i><div class="case-compression-result"><strong>1</strong><span>MATERIAL ISSUE</span></div></div>' +
        '<p class="supervision-trust">THE SIGNAL BECOMES VISIBLE.</p>', "centered");
    case "prediction":
      if (step === 0) return wrap(id,
        '<p class="prediction-context">AI INVESTIGATOR ASSESSMENT</p>' +
        '<div class="prediction-metrics"><div><strong>' + run.scoreHistory[4].score + '</strong><span>RISK COEFFICIENT</span></div>' +
        '<div><strong>' + run.prediction.percent + '%</strong><span>PREDICTED MATERIAL EVENT</span></div></div>' +
        '<div class="prediction-recommendation"><span>AI RECOMMENDS</span><strong>ENHANCED LIQUIDITY RESTRICTION</strong></div>', "centered");
      return wrap(id,
        '<h1 class="hero-verdict impact">NO RULE HAS BEEN BREACHED</h1>' +
        '<p class="primary-line">PREDICTION ≠ PERMISSION</p>', "centered");
    case "material-case":
      return wrap(id, renderMaterialCase(step), "centered");
    case "nav":
      return wrap(id, renderNav(step), "centered");
    case "runtime":
      if (step === 1) return wrap(id,
        '<h1 class="hero-verdict judgement-title">HUMAN JUDGEMENT REQUIRED</h1>' +
        '<div class="judgement-paths"><p>MANUAL VERIFICATION?</p>' +
        '<p>AI-ASSISTED VALIDATION?</p></div>' +
        '<p class="judgement-question">WHO VALIDATES THE VALIDATOR?</p>' +
        '<p class="judgement-principle">AUTHORITY MAY BE HUMAN.<br>CERTAINTY MAY STILL DEPEND ON MACHINES.</p>', "centered");
      return wrap(id,
        '<div class="authority-facts"><p>EVIDENCE: <strong>' + run.gateInput.evidenceQuality.toUpperCase() + '</strong></p><p>MANDATE: <strong>RECOMMEND ONLY</strong></p></div>' +
        '<h1 class="hero-verdict mega amber authority-verdict">' + gate.disposition + "</h1>" +
        '<p class="primary-line authority-restraint">RESTRICTION NOT EXECUTED</p>' +
        '<p class="authority-punch">THE SYSTEM DOESN\'T NEED TO KNOW WHO IS RIGHT<br>IN ORDER TO KNOW IT SHOULD NOT ACT.</p>', "centered");
    case "systemic":
      return wrap(id, renderSystemic(step), "centered");
    case "ghost":
      return wrap(id, renderFinale(step), "centered");
    default:
      throw new Error("Unknown presentation cue: " + id);
  }
}

function detailAction(id, step) {
  if (id === "operations") return ["SHOW MORE", "open-evidence"];
  if (id === "supervision") return ["SHOW MORE", "open-trust"];
  if (id === "prediction") return ["SHOW MORE", "open-evidence"];
  if (id === "material-case") {
    if (step === 8) return ['SHOW MORE', 'open-gate'];
    if (step >= 9) return ['SHOW MORE', 'open-review'];
    if (step >= 6) return ['SHOW MORE', 'open-research'];
    if (step >= 3) return ['SHOW MORE', 'open-domain'];
    return ['SHOW MORE', 'open-source'];
  }
  if (id === "nav") return ["SHOW MORE", "open-nav"];
  if (id === "systemic") return ["SHOW MORE", "open-systemic"];
  if (id === 'ghost' && step !== CUES[7].steps.length - 1) return ['SHOW MORE', 'open-finale'];
  return null;
}

function stopAnimations() {
  if (floodState?.requestId) cancelAnimationFrame(floodState.requestId);
  floodState = null;
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
    persistentSystemic.dataset.phase = currentReveal(presentation);
    persistentSystemic.innerHTML = renderSystemicBody(presentation.step);
  } else {
    stage.innerHTML = renderView(cue.id, presentation.step);
  }
  const indicator = NARRATIVE_INDICATORS[presentation.cueIndex];
  stageStatus.innerHTML = '<span>AI ROLE: <strong>' + indicator.role + '</strong></span>' +
    '<span>' + indicator.label + ': <strong>' + indicator.value + '</strong></span>';
  stageStatus.classList.toggle('is-question', presentation.cueIndex >= 4);
  document.querySelector('.app-shell').classList.toggle('is-closing', cue.id === 'ghost');
  document.querySelector('.app-shell').classList.toggle('is-opening', currentReveal(presentation) === 'opening-question');
  document.querySelector('.app-shell').classList.toggle('is-nav', cue.id === 'nav');
  beatCounter.textContent = "BEAT " + (presentation.cueIndex + 1) + "/" + BEATS.length;
  announcer.textContent = "Beat " + (presentation.cueIndex + 1) + ": " + BEATS[presentation.cueIndex] + ". " +
    (cue.id === 'systemic' ? SYSTEMIC_ANNOUNCEMENTS[presentation.step] : currentReveal(presentation).replaceAll("-", " "));
  previousButton.disabled = presentation.cueIndex === 0 && presentation.step === 0;
  nextButton.disabled = ["causal-explanation"].includes(currentReveal(presentation)) || presentation.cueIndex === CUES.length - 1 && presentation.step === cue.steps.length - 1;
  nextButton.setAttribute("aria-label", cue.id === "material-case" ? CASE_ACTIONS[presentation.step] :
    cue.id === 'systemic' ? SYSTEMIC_ACTIONS[presentation.step] : "Next reveal");
  const detail = detailAction(cue.id, presentation.step);
  contextButton.hidden = !detail || (cue.id === "material-case" && presentation.step < 8);
  if (detail) {
    contextButton.textContent = detail[0];
    contextButton.dataset.action = detail[1];
  }
  if (currentReveal(presentation) === "event-flood") startFlood();
  syncMotionControls();
}

function move(action) {
  const next = transition(presentation, action);
  if (next === presentation) return;
  closeDrawer();
  if (action === 'check-source') sourceChallenge = submitSourceChallenge(run, next.sourceCheck);
  if (action === 'reset-beat' && currentCue(presentation).id === 'material-case') sourceChallenge = null;
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
    syncMotionControls();
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

function hasActiveMotion() {
  if (floodState && floodState.elapsed < run.events.at(-1).atMs && (paused || floodState.requestId)) return true;
  return (stage.getAnimations?.({ subtree: true }) ?? []).some(animation =>
    animation.playState !== 'finished' && animation.playState !== 'idle');
}

function syncMotionControls() {
  const opening = currentReveal(presentation) === 'opening-question';
  const active = hasActiveMotion();
  document.getElementById('pauseButton').disabled = opening || paused || !active;
  document.getElementById('playButton').disabled = !opening && (!paused || !active);
}

function pauseOrResume() {
  if (!hasActiveMotion() || currentReveal(presentation) === 'opening-question') return;
  paused = !paused;
  stage.classList.toggle("is-paused", paused);
  const clock = performance.now();
  for (const animation of [floodState]) {
    if (!animation) continue;
    if (paused) {
      animation.elapsed += clock - animation.startedAt;
      if (animation.requestId) cancelAnimationFrame(animation.requestId);
      animation.requestId = null;
    } else {
      animation.startedAt = clock;
      animation.requestId = requestAnimationFrame(floodTick);
    }
  }
  syncMotionControls();
}

function detailBlock(label, value) {
  return '<div class="detail-block"><div class="detail-key">' + escapeHTML(label) +
    '</div><div class="detail-value">' + escapeHTML(value) + "</div></div>";
}

export function renderGateDetails() {
  return gateChecks.map(([label, value]) => detailBlock(label, value)).join('') +
    detailBlock("Disposition", gate.disposition) +
    detailBlock("Gate rule / reason", gate.code + ": " + gate.reason) +
    detailBlock("Evidence / rule", run.gateInput.evidenceQuality + " / no deterministic rule breach");
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

function sourceLink(url, label) { return '<p><a href="' + url + '" target="_blank" rel="noopener noreferrer">' + label + '</a></p>'; }
function regulatoryDetails() {
  return detailBlock('FSB provenance', 'The June 10 consultation discusses hundreds of intermediate agent steps and AI-assisted monitoring. October 15 final Sound Practices 4, 7, 9 and 10 address organisational capability, data governance, performance monitoring and effective human oversight. Stage lines are paraphrases.') +
    sourceLink('https://www.fsb.org/uploads/P100626.pdf', 'FSB June consultation') + sourceLink('https://www.fsb.org/uploads/P151026-1.pdf', 'FSB October final report') +
    detailBlock('MAS AIRM', '7 October 2026 guidelines, §5.9: lifecycle human oversight considers automation bias and decision fatigue. Effective 7 October 2027; specialist capability supports lifecycle governance.') +
    sourceLink('https://www.mas.gov.sg/regulation/guidelines/guidelines-on-artificial-intelligence-risk-management-for-financial-institutions', 'MAS AI Risk Management Guidelines');
}
function safrDetails() {
  return detailBlock('SAFR status', 'Industry-developed runtime safeguards reference under MAS BuildFin.ai; V1.1. Ghost is a synthetic teaching abstraction, not an implementation, certification or regulatory endorsement.') + sourceLink('https://www.mas.gov.sg/-/media/mas-media-library/development/fintech/ai-safr/safr-v1-1.pdf', 'SAFR V1.1');
}
function researchDetails() {
  return detailBlock('External evaluation', 'UK AI Security Institute testing reproduced in Anthropic’s November 2026 Fable 5.2 / Mythos 5.2 system card, pp. 181–182, Figure AISI.1. In a controlled file-download task, the model attempted obfuscated bash scripts against an action-only monitor; repeated feedback included monitor scores and explanations. Reported evasion rose from 30% on the first attempt to 85% with iteration. Conditions matter; this is not a general AI evasion rate or evidence about Ghost or financial supervisory systems.') +
    detailBlock('Separate concern', 'Ghost demonstrates an incomplete classification rule and omitted conflict. It does not establish deliberate concealment, reward hacking or inevitable deception by capable models. Action monitoring remains a useful defence.') +
    sourceLink('https://www.anthropic.com/claude-fable-and-mythos-5-2', 'Anthropic system-card publication') + sourceLink('https://assets.claude.com/27d60918d218125e7504bc7354c4b4626ec56b11.pdf', 'System card · UK AISI evaluation') +
    detailBlock('Technical guidance', 'OWASP Securing Agentic Applications V2, 10 November 2026: secure architectures, identity/access controls, runtime protection and assurance testing. Technical guidance, not binding financial regulation.') + sourceLink('https://genai.owasp.org/resource/securing-agentic-applications-v2/', 'OWASP Securing Agentic Applications V2');
}

function drawerContent(kind) {
  if (kind === 'nav') return { title: 'NAV evidence · ' + navRun.id, body: renderNavEvidence(presentation.step) };

  const early = presentation.cueIndex < 4;
  if (early) return { title: 'Supervision and evidence', body:
    detailBlock('Objective', 'Identify material risks rapidly while minimising unnecessary human escalations.') +
    detailBlock('Authority', 'Flag and recommend only. Human decision authority is retained; attention is selected by AI.') +
    detailBlock('Trace', '8 agents / 27 subtasks / 486 trace events / 3.2 simulated seconds. Records are retained for independent inspection.') +
    (presentation.cueIndex === 2 ? regulatoryDetails() : presentation.cueIndex === 3 ? detailBlock('Illustrative assessment', 'Risk coefficient 76 and separate prediction 74% are synthetic teaching values, not calibrated estimates or authority thresholds.') : '') };
  if (kind === 'research') return { title: 'External monitoring evaluation · separate from Ghost', body: researchDetails() };
  if (kind === 'domain') return { title: 'Synthetic requirements and acceptance evidence', body:
    Object.entries(DOMAIN_RULE).map(([key, value]) => detailBlock(key, value)).join('') +
    detailBlock('Failure mechanisms', 'This case: incomplete business requirement. Unsupported inference: a conclusion beyond evidence. Hallucination: invented model output. Unsuitable objective: optimisation of the wrong target. Monitor evasion: deliberate avoidance of detection. These are distinct; Ghost does not establish all five.') +
    detailBlock('Design control', 'Cross-domain expertise participates in requirements, implementation, tests and change management, with explicit exception fixtures; final sign-off alone is insufficient.') + button('Inspect original evidence', 'open-source', 'drawer-button') };

  if (kind === "source") {
    review.openedEvidence = true;
    return {
      title: "Original event · T-17",
      body: "<p>This event was genuinely present in the 486-event stream. The later challenge appends evidence; it does not erase this record.</p>" +
        (sourceChallenge ? detailBlock('Human-triggered challenge', sourceChallenge.id + ' · ' + sourceChallenge.actor + ' · ' + sourceChallenge.evidenceIds.join(', ') + ' · status: contested') : detailBlock('Bank Compliance Agent', 'Not invoked. Select CHECK SOURCE on the stage to request a challenge.')) +
        detailBlock("Raw event", classification.summary) +
        detailBlock("Trace position", classification.id + " · " + classification.atMs + " ms · sequence " + classification.sequence + " / " + run.events.length) +
        agentDetail(classification) +
        detailBlock("Original source", EVIDENCE.entityFiling.id + ": " + EVIDENCE.entityFiling.finding) +
        detailBlock("Derived interpretation", EVIDENCE.graphInference.id + ": " + EVIDENCE.graphInference.finding) +
        detailBlock("Uncertainty", EVIDENCE.graphInference.uncertainty) +
        detailBlock("Demo fingerprints", "Input " + classification.inputHash + " · output " + classification.outputHash + ". These are stable demo identifiers, not cryptographic proof.") +
        button("Open human judgement", "open-review", "drawer-button strong"),
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
        renderGateDetails() + detailBlock('Reversibility', run.gateInput.reversibility) + detailBlock('Prediction / permission', 'Risk 76 and illustrative prediction 74% create no delegated authority. No deterministic rule breach verified.') + safrDetails() +
        detailBlock("Human task", "Determine what verification is sufficient for the contested classification, then judge whether intervention is justified.") +
        button("Open human review", "open-review", "drawer-button strong"),
    };
  }
  if (kind === "review") {
    return {
      title: "Human judgement record",
      body: "<p>The classification remains contested until its evidence is verified. These controls record considered human views; they do not execute the proposed restriction or make AI counter-evidence automatically correct.</p>" +
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
  if (kind === "systemic") return { title: "The agents that all obeyed · evidence", body: renderSystemicEvidence(presentation.step) };
  if (kind === 'finale') return {title:'Supervision and accountability',body:'<p>The three arrangements are conceptual, not a mandatory institutional sequence. A sophisticated agent may only recommend; a deterministic rule may validly block execution. Capability does not grant authority.</p><p>Controls act within a formally delegated, bounded and revocable institutional mandate, with traceability and appropriate review or authorised override. Not every AI warning should block publication; enforcement depends on the approved policy and evidence.</p><p>Meaningful human challenge requires expertise, evidence, time and capacity, independence and confidence. An override button alone supplies none of these.</p><p>Human decision-makers and institutions retain accountability as assigned by applicable law, regulation and governance. The model is not an independently accountable legal person. Bounded software controls do not require a person to approve every machine-speed action.</p>'};
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
      (presentation.cueIndex === 4 ? button("Export full synthetic run", "download-run", "drawer-button") : '') +
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

function downloadNav() {
  const url = URL.createObjectURL(new Blob([JSON.stringify(navRun, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'ghost-nav-five-day-audit.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadRun() {
  const payload = {
    ...run,
    supervisoryFinding: finding,
    sourceChallenge,
    challengeStatus: sourceChallenge ? 'human-requested challenge submitted' : 'not invoked; bank response is a scenario fixture only',
    domainRule: DOMAIN_RULE,
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
  if (["next", "previous", "reset-beat", "check-source"].includes(action)) move(action);
  else if (action === "naive-authorise") move("authorise");
  else if (action === "naive-reject") move("reject");
  else if (action === "replay") renderCue(true);
  else if (action === "pause" && !paused) pauseOrResume();
  else if (action === "play") {
    if (currentReveal(presentation) === 'opening-question') move('next');
    else if (paused) pauseOrResume();
  }
  else if (action === "open-nav") openDrawer("nav");
  else if (action === "download-nav") downloadNav();
  else if (action === "open-evidence") openDrawer("evidence");
  else if (action === "open-source") openDrawer("source");
  else if (action === "open-trust") openDrawer("trust");
  else if (action === "open-gate") openDrawer("gate");
  else if (action === "open-review") openDrawer("review");
  else if (action === "open-domain") openDrawer("domain");
  else if (action === "open-research") openDrawer("research");
  else if (action === "open-systemic") openDrawer("systemic");
  else if (action === "open-finale") openDrawer("finale");
  else if (action === "close-drawer") closeDrawer();
  else if (action === "download-run") downloadRun();
  else if (action === "reset") {
    closeDrawer();
    presentation = transition(presentation, "reset");
    sourceChallenge = null;
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
    sourceChallenge = null;
    Object.assign(review, { classification: "pending", intervention: "pending", openedEvidence: false, challenged: false });
    renderCue();
  } else if (event.key.toLowerCase() === "r") {
    event.preventDefault();
    renderCue(true);
  } else if (event.key.toLowerCase() === "e") {
    const detail = detailAction(currentCue(presentation).id, presentation.step);
    if (detail) { event.preventDefault(); openDrawer(detail[1].slice(5)); }
  } else if (event.key.toLowerCase() === "c" && currentReveal(presentation) === 'causal-explanation') {
    event.preventDefault();
    move('check-source');
  } else if (event.key.toLowerCase() === "p") {
    pauseOrResume();
  } else if (event.key.toLowerCase() === "f" && document.fullscreenEnabled) {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  }
});

stage.addEventListener?.('animationend', syncMotionControls);
stage.addEventListener?.('animationcancel', syncMotionControls);
renderCue();
