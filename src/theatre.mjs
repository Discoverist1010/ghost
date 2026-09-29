import { buildRun, EVIDENCE, evaluateGate, supervise, validateRun } from "./scenario.mjs";
import { BEATS, CUES, createPresentationState, currentCue, transition } from "./presentation.mjs";

const run = buildRun();
if (!validateRun(run)) throw new Error("The synthetic run failed its trace contract.");
const finding = supervise(run.events);
const gate = evaluateGate(run.gateInput);
const classification = run.events.find((event) => event.kind === "CLASSIFICATION_CHANGED");
if (!finding?.sourceEventIds.includes(classification?.id) ||
    !run.counterfactual.evidenceIds.includes(EVIDENCE.bankResponse.id)) {
  throw new Error("The presentation has lost its source-event or challenge link.");
}
const stage = document.getElementById("stage");
const beatCounter = document.getElementById("beatCounter");
const announcer = document.getElementById("cueAnnouncement");
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

function scoreFlow(before, after, tone = "cyan") {
  return '<div class="score-flow">' + number(before) + '<span class="score-arrow">→</span>' + number(after, tone) + "</div>";
}

function button(label, action, className = "quiet-button") {
  return '<button type="button" class="' + className + '" data-action="' + action + '">' + label + "</button>";
}

function renderTree() {
  const specialists = run.agents.slice(2, 7);
  return '<div class="agent-tree">' +
    '<div class="tree-lead"><div class="agent-node">SENTINEL</div><span>↓</span><div class="agent-node investigator">INVESTIGATOR</div></div>' +
    '<div class="tree-branch-line" aria-hidden="true"></div>' +
    '<div class="tree-specialists">' + specialists.map((agent, index) =>
      '<div class="agent-node specialist" style="--delay:' + (index * 180) + 'ms">' + escapeHTML(agent.replace(/([a-z])([A-Z])/g, "$1 $2")) + "</div>"
    ).join("") + "</div>" +
    '<div class="tree-interpreter">+ INTERPRETER · parallel analysis and control tasks</div></div>';
}

function renderCausalChain() {
  const summaries = [
    "Entity X reclassified",
    "Risk " + run.scoreHistory[3].score + " → " + run.scoreHistory[4].score,
    "Restriction recommended",
    "Mandate boundary identified",
  ];
  return '<div class="causal-chain">' + finding.causalTrace.map((event, index) =>
    '<div class="causal-step" style="--delay:' + (index * 650) + 'ms">' +
      '<span class="causal-actor">' + escapeHTML(index === 3 ? "Runtime control" : event.actor) + "</span>" +
      '<strong>' + summaries[index] + "</strong>" +
      '<span class="causal-id">' + escapeHTML(event.id) + "</span>" +
    "</div>"
  ).join("") + "</div>";
}

const trustQuestions = [
  ["PROVENANCE", "Can I see what it used?"],
  ["UNCERTAINTY", "What might be wrong?"],
  ["CONTESTABILITY", "Can I challenge it?"],
];

const gateChecks = [
  ["IDENTITY", run.gateInput.verifiedIdentity ? "Verified ✓" : "Unverified"],
  ["MANDATE", run.gateInput.mandate === "recommend" ? "Recommend only" : run.gateInput.mandate],
  ["PROPOSED ACTION", run.gateInput.proposedAction === "restrict_activity" ? "Restrict liquidity activity" : run.gateInput.proposedAction],
  ["MATERIALITY", run.gateInput.materiality === "high" ? "High" : run.gateInput.materiality],
  ["EVIDENCE", run.gateInput.evidenceQuality === "disputed" ? "Disputed" : run.gateInput.evidenceQuality],
];

function renderView(id) {
  switch (id) {
    case "productivity":
      return wrap(id,
        '<p class="stage-label">A familiar starting point</p>' +
        '<h1 class="hero-verdict">AI HELPS HUMANS SUPERVISE</h1>' +
        '<p class="evidence-inline">' + run.sourceCounts.filings + ' synthetic filings <span>·</span> ' +
          run.sourceCounts.policySources + ' policy sources <span>·</span> ' +
          run.sourceCounts.transactions.toLocaleString("en-US") + ' sample transactions</p>' +
        '<p class="primary-line">Human still chooses what happens next.</p>', "calm");
    case "sentinel":
      return wrap(id,
        scoreFlow(run.scoreHistory[0].score, run.scoreHistory[1].score) +
        '<p class="primary-line">Liquidity pattern changed.</p>' +
        '<p class="support-line">Sentinel observed without waiting to be prompted.</p>', "centered");
    case "investigator-score":
      return wrap(id,
        scoreFlow(run.scoreHistory[1].score, run.scoreHistory[2].score) +
        '<p class="primary-line">Risk rises while entity context is still unknown.</p>' +
        '<p class="support-line">The score is provisional.</p>', "centered");
    case "investigator-checks":
      return wrap(id,
        '<h1 class="hero-verdict">INVESTIGATOR CHOSE THE NEXT CHECKS</h1>' +
        '<div class="spaced-terms"><span>ENTITY GRAPH</span><span>HISTORY</span><span>DISCLOSURES</span></div>' +
        '<p class="support-line">No human selected the individual queries.</p>', "centered");
    case "one-objective":
      return wrap(id, '<h1 class="hero-verdict solitary">ONE OBJECTIVE</h1>', "centered");
    case "agent-tree":
      return wrap(id, renderTree(), "centered");
    case "agent-count":
      return wrap(id, number(run.agents.length, "cyan") + '<h1 class="hero-unit">AGENTS</h1>', "centered");
    case "task-count":
      return wrap(id, number(run.tasks.length, "cyan") + '<h1 class="hero-unit">SUB-TASKS</h1>', "centered");
    case "oversight-promise":
      return wrap(id,
        '<div class="assurance-lines"><p><span>✓</span> HUMAN OVERSIGHT ENABLED</p>' +
        '<p><span>✓</span> ALL ACTIONS LOGGED</p>' +
        '<p><span>✓</span> EVERYTHING REVIEWABLE</p></div>', "centered");
    case "start-workflow":
      return wrap(id, button("START WORKFLOW →", "next", "stage-button stage-button-primary"), "centered");
    case "event-flood":
      return wrap(id,
        '<div class="flood-layout"><div class="flood-metric">' +
          '<span id="floodNumber" class="hero-number cyan">' + run.agents.length + "</span>" +
          '<span id="floodUnit" class="hero-unit">AGENTS</span></div>' +
          '<div class="flood-log" aria-hidden="true"><div class="flood-log-head">INTERLEAVED ACTION TRACE <span id="floodCount">000 / ' + run.events.length + '</span></div>' +
          '<div id="floodLines" class="flood-log-lines"></div></div></div>' +
        '<div class="stage-actions">' + button("Replay", "replay", "quiet-button") +
          button("Pause", "pause", "quiet-button") + "</div>", "flood");
    case "naive-review":
      return wrap(id,
        '<h1 class="hero-verdict">HUMAN REVIEW REQUIRED</h1>' +
        '<div class="naive-count">' + number(run.events.length) + '<span>EVENTS</span></div>' +
        '<div class="naive-actions">' + button("AUTHORISE", "naive-authorise", "stage-button") +
          button("REJECT", "naive-reject", "stage-button") + "</div>", "centered");
    case "naive-basis":
      return wrap(id,
        '<h1 class="hero-verdict impact">ON WHAT BASIS?</h1>' +
        '<p class="primary-line">Logged. Present. Auditable.</p>' +
        '<p class="support-line">Cognitively out of reach.</p>', "centered");
    case "compression-before":
      return wrap(id, number(run.events.length) + '<h1 class="hero-unit">EVENTS</h1>', "centered");
    case "compression-after":
      return wrap(id, number(finding ? 1 : 0, "cyan") + '<h1 class="hero-unit">MATERIAL ISSUE</h1>', "centered compressed");
    case "causal-chain":
      return wrap(id, '<h1 class="stage-heading">THE CHAIN THAT MATTERS</h1>' + renderCausalChain(), "centered");
    case "human-decision":
      return wrap(id,
        '<h1 class="hero-verdict">HUMAN DECISION REQUIRED</h1>' +
        '<div class="decision-questions"><p>Is the Entity X reclassification valid?</p>' +
        '<p>If valid, is intervention justified?</p></div>' +
        '<p class="support-line">Humans sit at boundaries of authority, not every boundary of computation.</p>', "centered");
    case "three-loops":
      return wrap(id,
        '<div class="loop-bands">' +
          '<div><strong>MACHINE ACTIVITY</strong><span>Queries · retrieval · tools · scoring</span><em>MACHINE SPEED</em></div>' +
          '<div><strong>SUPERVISORY CONTROL</strong><span>AI watches agents, conflicts and boundaries</span><em>AI SUPERVISES AI</em></div>' +
          '<div><strong>HUMAN AUTHORITY</strong><span>Material intervention · override · policy · legal judgement</span><em>HUMAN JUDGEMENT</em></div>' +
        "</div>", "centered");
    case "trust-question":
      return wrap(id,
        '<h1 class="hero-verdict">WHO SUPERVISES THE SUPERVISORY AI?</h1>' +
        '<p class="pipeline">' + run.events.length + ' RAW EVENTS <span>→</span> SUPERVISORY AI <span>→</span> ' +
        (finding ? 1 : 0) + ' ISSUE <span>→</span> HUMAN</p>', "centered");
    case "trust-questions":
      return wrap(id,
        '<p class="stage-label">The attention allocator must be challengeable</p>' +
        '<div class="trust-questions">' + trustQuestions.map(([title, question]) =>
          '<div><strong>' + title + "</strong><span>" + question + "</span></div>"
        ).join("") + "</div>", "centered");
    case "bank-supervisory":
      return wrap(id,
        '<p class="stage-label">SUPERVISORY AI</p>' +
        '<h1 class="hero-verdict">ENTITY X = COMMERCIAL COUNTERPARTY</h1>', "centered");
    case "bank-response":
      return wrap(id,
        '<p class="stage-label">BANK COMPLIANCE AGENT</p>' +
        '<h1 class="hero-verdict">COUNTER-EVIDENCE RECEIVED</h1>', "centered");
    case "bank-contested":
      return wrap(id,
        '<div class="broken-link"><span>ENTITY X CLASSIFICATION</span><i aria-hidden="true">╳</i><span>RESTRICTION</span></div>' +
        '<h1 class="hero-verdict amber">SUPERVISORY FACT: CONTESTED</h1>' +
        '<p class="support-line">Neither agent may rewrite source evidence.</p>', "centered");
    case "risk-score":
      return wrap(id,
        number(run.scoreHistory[4].score, "amber") + '<h1 class="hero-unit">RISK COEFFICIENT</h1>', "centered");
    case "risk-prediction":
      return wrap(id,
        '<div class="dual-metric"><div>' + number(run.scoreHistory[4].score) +
          '<span>RISK COEFFICIENT</span></div><div>' + number(run.prediction.percent + "%", "amber") +
          '<span>PREDICTED MATERIAL EVENT</span></div></div>', "centered");
    case "risk-proposal":
      return wrap(id,
        '<p class="stage-label">' + run.scoreHistory[4].score + ' RISK · ' + run.prediction.percent + '% PREDICTED MATERIAL EVENT</p>' +
        '<h1 class="hero-verdict">RECOMMEND: ENHANCED LIQUIDITY RESTRICTION</h1>', "centered");
    case "no-breach":
      return wrap(id, '<h1 class="hero-verdict impact">NO RULE HAS BEEN BREACHED</h1>', "centered");
    case "prediction-permission":
      return wrap(id,
        '<h1 class="hero-verdict">PREDICTION ≠ PERMISSION</h1>' +
        '<p class="support-line">Probabilistic pre-emption ≠ deterministic prevention.</p>', "centered");
    case "counterfactual":
      return wrap(id,
        scoreFlow(run.scoreHistory[4].score, run.scoreHistory[5].score) +
        '<p class="support-line">Entity X restored to central-bank-related.</p>', "centered");
    case "one-fact":
      return wrap(id,
        '<h1 class="hero-verdict">ONE FACT CHANGED</h1>' +
        '<p class="primary-line">Same rules. Same model. Different fact.</p>', "centered");
    case "gate-run":
      return wrap(id,
        '<h1 class="stage-heading">RUNTIME AUTHORITY</h1>' +
        '<div class="gate-steps">' + gateChecks.map(([label, value]) =>
          '<div class="gate-step"><span>' + label + "</span><strong>" + value + "</strong></div>"
        ).join("") + "</div>" +
        '<p id="gateStatus" class="gate-status">CHECKING DELEGATED AUTHORITY</p>', "centered");
    case "escalate":
      return wrap(id,
        '<h1 class="hero-verdict mega amber">' + gate.disposition + "</h1>" +
        '<p class="primary-line">RESTRICTION NOT EXECUTED</p>' +
        '<p class="support-line">High confidence does not manufacture authority.</p>', "centered");
    case "ghost-supervisor":
      return wrap(id, '<h1 class="hero-verdict impact">WHO IS THE SUPERVISOR?</h1>', "centered");
    case "ghost-loop":
      return wrap(id, '<h1 class="hero-verdict impact">WHERE IS THE RIGHT LOOP?</h1>', "centered");
    case "ghost-ai":
      return wrap(id,
        '<h1 class="hero-verdict">WHO SUPERVISES THE SUPERVISORY AI?</h1>' +
        '<p class="primary-line">Where should human judgement sit in a machine-speed financial system?</p>' +
        '<p class="closing-line">Intelligence can be distributed. Accountability cannot disappear into the network.</p>', "centered");
    default:
      throw new Error("Unknown presentation cue: " + id);
  }
}

const detailActions = {
  "causal-chain": ["Inspect original event", "open-source"],
  "human-decision": ["Inspect and record decision", "open-review"],
  "trust-question": ["Inspect trust controls", "open-trust"],
  "trust-questions": ["Inspect trust controls", "open-trust"],
  "bank-contested": ["Inspect source evidence", "open-source"],
  "gate-run": ["Inspect gate rule", "open-gate"],
  "escalate": ["Inspect gate and export", "open-gate"],
};

function stopAnimations() {
  if (floodState?.requestId) cancelAnimationFrame(floodState.requestId);
  if (gateState?.requestId) cancelAnimationFrame(gateState.requestId);
  floodState = null;
  gateState = null;
}

function renderCue() {
  stopAnimations();
  paused = false;
  stage.classList.remove("is-paused");
  const cue = currentCue(presentation);
  stage.dataset.cue = cue.id;
  stage.innerHTML = renderView(cue.id);
  beatCounter.textContent = "BEAT " + cue.beat + "/" + BEATS.length;
  announcer.textContent = "Beat " + cue.beat + ": " + BEATS[cue.beat - 1] + ". " + cue.id.replaceAll("-", " ");
  previousButton.disabled = presentation.cueIndex === 0;
  nextButton.disabled = presentation.cueIndex === CUES.length - 1;
  const detail = detailActions[cue.id];
  contextButton.hidden = !detail;
  if (detail) {
    contextButton.textContent = detail[0];
    contextButton.dataset.action = detail[1];
  }
  if (cue.id === "event-flood") startFlood();
  if (cue.id === "gate-run") startGate();
}

function move(action) {
  const next = transition(presentation, action);
  if (next === presentation) return;
  closeDrawer();
  presentation = next;
  renderCue();
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
    line.textContent = String(event.atMs).padStart(4, "0") + "ms  " + event.id + "  " +
      event.actor + "/" + event.taskId + "  " + event.kind + "  " + event.summary;
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
    elapsed < 2400 ? [run.events.length, "EVENTS"] :
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
  const shown = Math.min(gateChecks.length, Math.floor(elapsed / 570) + 1);
  document.querySelectorAll(".gate-step").forEach((element, index) => {
    element.classList.toggle("revealed", index < shown);
  });
  if (shown === gateChecks.length) document.getElementById("gateStatus").textContent = "CHECK COMPLETE · REVEAL DISPOSITION";
}

function gateTick(now) {
  if (!gateState || paused) return;
  const duration = 2850;
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
    updateGate(2850);
    gateState.elapsed = 2850;
  } else {
    gateState.requestId = requestAnimationFrame(gateTick);
  }
}

function pauseOrResume() {
  const cue = currentCue(presentation);
  if (!cue.animation) return;
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
        detailBlock("Actor / task", classification.actor + "/" + classification.taskId) +
        detailBlock("Parent event", classification.parentIds.join(", ")) +
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
  return {
    title: "Replay evidence",
    body: "<p>This is one deterministic synthetic run. The stage counters, original log, supervisory finding and gate all refer to the same data.</p>" +
      detailBlock("Run", run.id + " · version " + run.version) +
      detailBlock("Scale", run.agents.length + " agents · " + run.tasks.length + " sub-tasks · " + run.events.length + " events · " + (run.events.at(-1).atMs / 1000).toFixed(1) + " simulated seconds") +
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
  if (action === "next" || action === "previous") move(action);
  else if (action === "naive-authorise") move("authorise");
  else if (action === "naive-reject") move("reject");
  else if (action === "replay") { if (currentCue(presentation).animation) renderCue(); }
  else if (action === "pause") pauseOrResume();
  else if (action === "open-evidence") openDrawer("evidence");
  else if (action === "open-source") openDrawer("source");
  else if (action === "open-trust") openDrawer("trust");
  else if (action === "open-gate") openDrawer("gate");
  else if (action === "open-review") openDrawer("review");
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
  } else if (event.key.toLowerCase() === "r" && currentCue(presentation).animation) {
    renderCue();
  } else if (event.key.toLowerCase() === "p" && currentCue(presentation).animation) {
    pauseOrResume();
  } else if (event.key.toLowerCase() === "f" && document.fullscreenEnabled) {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  }
});

renderCue();
