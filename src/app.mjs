import { buildRun, EVIDENCE, evaluateGate, supervise, validateRun } from './scenario.mjs';

const run = buildRun();
if (!validateRun(run)) throw new Error('The synthetic run failed its own trace contract.');
const finding = supervise(run.events);
const gate = evaluateGate(run.gateInput);

const stage = document.getElementById('stage');
const drawer = document.getElementById('drawer');
const drawerTitle = document.getElementById('drawerTitle');
const drawerBody = document.getElementById('drawerBody');
const chapter = document.getElementById('chapter');
const sceneCount = document.getElementById('sceneCount');
const progressFill = document.getElementById('progressFill');
const previousButton = document.getElementById('previousButton');
const nextButton = document.getElementById('nextButton');
const utilityButton = document.getElementById('utilityButton');

const state = {
  index: 0,
  naiveRevealed: false,
  flood: null,
  review: { classification: 'pending', intervention: 'pending', openedEvidence: false, challenged: false },
};

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function triad(frame) {
  return `<div class="triad" aria-label="Three governing questions">
    <div class="triad-item"><div class="triad-label">What did AI learn?</div><div class="triad-value">${frame.learn}</div></div>
    <div class="triad-item"><div class="triad-label">What does it want to do?</div><div class="triad-value">${frame.wants}</div></div>
    <div class="triad-item"><div class="triad-label">Is it authorised?</div><div class="triad-value ${frame.authorityClass || ''}">${frame.authority}</div></div>
  </div>`;
}

function scene(frame, body, mainClass = '') {
  return `<article class="scene">
    <div class="scene-head"><div class="scene-kicker">${frame.kicker}</div><div class="scene-tag">${frame.tag || 'Synthetic teaching simulation'}</div></div>
    <div class="scene-main ${mainClass}">${body}</div>
    ${triad(frame)}
  </article>`;
}

const frames = [
  {
    id: 'productivity', chapter: 'PRODUCTIVITY', kicker: '01 / PRODUCTIVITY',
    learn: 'Patterns in synthetic records', wants: 'Summarise and ask questions', authority: 'Yes · read-only',
    draw: () => `<p class="eyebrow">A familiar starting point</p>
      <h1 class="hero-title">AI helps humans supervise.</h1>
      <p class="hero-message">The human still chooses the investigation.</p>
      <div class="summary-grid"><div class="summary-card"><strong>24</strong><span>Synthetic filings</span></div><div class="summary-card"><strong>8</strong><span>Policy sources</span></div><div class="summary-card"><strong>1,240</strong><span>Sample transactions</span></div></div>`,
  },
  {
    id: 'sentinel', chapter: 'SENTINEL', kicker: '02 / AUTONOMOUS OBSERVATION',
    learn: 'Liquidity pattern changed', wants: 'Create an alert', authority: 'Yes · monitor mandate',
    draw: () => `<p class="eyebrow">Sentinel observes without a prompt</p>
      <div class="score-flow"><span class="hero-number ink">27</span><span class="score-arrow">→</span><span class="hero-number blue">42</span></div>
      <p class="hero-message">A liquidity anomaly is detected.</p>
      <div class="label-row"><span class="label-chip blue">MONITOR</span><span class="label-chip">ALERT CREATED</span><span class="label-chip">NO INTERVENTION</span></div>`,
  },
  {
    id: 'investigator', chapter: 'INVESTIGATOR', kicker: '03 / AGENTIC INVESTIGATION',
    learn: 'The anomaly needs context', wants: 'Choose evidence checks', authority: 'Yes · investigate only',
    draw: () => `<p class="eyebrow">The agent chooses the path</p>
      <div class="score-flow"><span class="hero-number ink">42</span><span class="score-arrow">→</span><span class="hero-number blue">61</span></div>
      <p class="hero-message">Provisional risk. Entity context is still unknown.</p>
      <div class="label-row"><span class="label-chip gold">ENTITY GRAPH</span><span class="label-chip gold">HISTORY</span><span class="label-chip gold">DISCLOSURES</span></div>`,
  },
  {
    id: 'expansion', chapter: 'AGENT EXPANSION', kicker: '04 / ONE OBJECTIVE, MANY ACTIONS',
    learn: 'Five evidence paths opened', wants: 'Run parallel bounded checks', authority: 'Yes · queries only',
    draw: () => `<h1 class="hero-title wide">One task becomes a tree.</h1>
      <div class="tree"><div class="tree-top"><div class="tree-node">SENTINEL</div><span class="tree-arrow">→</span><div class="tree-node focus">INVESTIGATOR</div><span class="tree-arrow">→</span><div class="tree-node">INTERPRETER</div></div>
      <div class="tree-branches"><div class="tree-node">EntityGraph</div><div class="tree-node">Historical<br>Transactions</div><div class="tree-node">Disclosure<br>Review</div><div class="tree-node">Counterparty<br>Check</div><div class="tree-node">Policy<br>Mapper</div></div>
      <div class="tree-parallel">Parallel work: liquidity · clustering · provenance · policy · confidence · audit · response</div></div>
      <div class="tree-counts"><div><strong>8</strong><span>AGENTS</span></div><div><strong>27</strong><span>SUB-TASKS</span></div></div>`,
  },
  {
    id: 'assurance', chapter: 'NAIVE OVERSIGHT', kicker: '05 / DECEPTIVELY REASSURING',
    learn: 'Every action can be recorded', wants: 'Put a human in every loop', authority: 'Claimed · not yet tested', authorityClass: 'escalate',
    draw: () => `<p class="eyebrow">The governance promise</p>
      <div class="assurance-stack"><div class="assurance-row"><span class="check">✓</span>HUMAN OVERSIGHT: ENABLED</div><div class="assurance-row"><span class="check">✓</span>ALL AGENT ACTIONS: LOGGED</div><div class="assurance-row"><span class="check">✓</span>ALL ACTIONS: REVIEWABLE</div></div>
      <p class="support-message">It sounds reassuring. Now start the workflow.</p>`,
  },
  {
    id: 'flood', chapter: 'LOG FLOOD', kicker: '06 / MACHINE SPEED',
    learn: 'The trace contains a material change', wants: 'Keep investigating', authority: 'Routine queries only',
    draw: () => `<div class="flood-layout"><div class="flood-hero"><p class="eyebrow">One supervisory objective</p><div id="floodNumber" class="hero-number blue">8</div><div id="floodUnit" class="flood-unit">AGENTS</div><p class="support-message">A complete audit trail is forming faster than a person can read it.</p></div>
      <div class="flood-log"><div class="flood-log-head"><span>INTERLEAVED ACTION TRACE</span><span id="floodCount">000 / 486</span></div><div id="floodLines" class="flood-log-lines" aria-hidden="true"></div></div></div>
      <div class="flood-controls"><button class="action-button secondary" type="button" data-action="replay-flood">Replay 3.2 seconds</button><button id="pauseFloodButton" class="action-button secondary" type="button" data-action="pause-flood">Pause</button></div>`,
  },
  {
    id: 'naive', chapter: 'HUMAN LOOP STRESS TEST', kicker: '07 / THE REVIEW PROBLEM',
    learn: 'The material event is in the log', wants: 'Ask for authorise or reject', authority: 'No meaningful basis yet', authorityClass: 'denied',
    draw: () => `<h1 class="hero-title wide">HUMAN REVIEW REQUIRED</h1>
      <div class="naive-panel"><div class="naive-count"><div class="hero-number ink">486</div><div class="hero-message">EVENTS</div></div><div class="naive-prompt"><h3>Choose one:</h3><div class="fake-choice" aria-disabled="true">AUTHORISE</div><div class="fake-choice" aria-disabled="true">REJECT</div></div></div>
      ${state.naiveRevealed ? '<p class="naive-reveal">BUT COULD THEY REALISTICALLY FIND IT?</p><p class="support-message">Logged. Present. Theoretically reviewable. Cognitively out of reach.</p>' : '<button class="action-button blue" type="button" data-action="reveal-naive">Reveal the problem</button>'}`,
  },
  {
    id: 'compression', chapter: 'SUPERVISORY AI', kicker: '08 / THE RIGHT LOOP EMERGES',
    learn: 'One classification drove the proposal', wants: 'Flag a material issue', authority: 'Yes · flag and escalate only',
    draw: () => `<p class="eyebrow">A separate control watches the agents</p>
      <div class="compression"><span class="hero-number ink">486</span><span class="compression-arrow">→</span><span class="hero-number blue">1</span></div>
      <h1 class="hero-title wide">ISSUE REQUIRES HUMAN JUDGEMENT</h1>
      <div class="chain">${finding.causalTrace.map((item, index) => `<div class="chain-card"><div class="chain-actor">${escapeHTML(item.actor)}</div><div class="chain-text">${[
        'Entity X reclassified', 'Risk 39 → 76', 'Restriction recommended', 'Mandate boundary found',
      ][index]}</div><div class="chain-id">${item.id}</div></div>`).join('')}</div>
      <div class="action-row"><button class="action-button secondary" type="button" data-action="open-source">Open original event</button><button class="action-button secondary" type="button" data-action="open-evidence">Inspect causal trace</button></div>`,
  },
  {
    id: 'loops', chapter: 'THREE LOOPS', kicker: '09 / DIFFERENT SPEEDS, DIFFERENT AUTHORITY',
    learn: 'Activity exceeds human attention', wants: 'Surface material boundaries', authority: 'Humans judge consequential actions',
    draw: () => `<h1 class="hero-title wide">Which loop needs a human?</h1>
      <div class="loop-bands"><div class="loop-band"><strong>MACHINE ACTIVITY</strong><span>Queries, tools, retrieval, scoring, evidence processing</span><em>MACHINE SPEED</em></div>
      <div class="loop-band"><strong>SUPERVISORY CONTROL</strong><span>AI watches agents, changes, conflicts and mandates</span><em>AI SUPERVISES AI</em></div>
      <div class="loop-band"><strong>HUMAN AUTHORITY</strong><span>Material intervention, legal judgement, override, policy</span><em>HUMAN JUDGEMENT</em></div></div>`,
  },
  {
    id: 'decision', chapter: 'HUMAN IN THE RIGHT LOOP', kicker: '10 / A SPECIFIC HUMAN TASK',
    learn: 'Entity X is the disputed fact', wants: 'Ask two consequential questions', authority: 'Human judgement required', authorityClass: 'escalate',
    draw: () => `<p class="eyebrow">486 events become one reviewable decision</p><h1 class="hero-title wide">HUMAN DECISION REQUIRED</h1>
      <div class="decision-grid"><div class="decision-card"><span>QUESTION 01</span><strong>Is the Entity X reclassification valid?</strong></div><div class="decision-card"><span>QUESTION 02</span><strong>If valid, is intervention justified?</strong></div></div>
      <div class="action-row"><button class="action-button blue" type="button" data-action="open-review">Inspect and record decision</button><button class="action-button secondary" type="button" data-action="open-source">Open original event</button></div>
      <div class="decision-status">Review state: ${escapeHTML(reviewLabel())}</div>`,
  },
  {
    id: 'trust', chapter: 'SUPERVISORY AI TRUST', kicker: '11 / THE SECOND-ORDER QUESTION',
    learn: 'A control selected what humans see', wants: 'Explain and defend its selection', authority: 'Flag or escalate · never intervene',
    draw: () => `<h1 class="hero-title wide">WHO SUPERVISES THE SUPERVISORY AI?</h1>
      <div class="trust-flow"><span>486 RAW EVENTS</span><b>→</b><span>SUPERVISORY AI</span><b>→</b><span>1 ISSUE</span><b>→</b><span>HUMAN</span></div>
      <div class="trust-grid">${['PROVENANCE', 'CAUSAL TRACE', 'INDEPENDENCE', 'UNCERTAINTY', 'DISAGREEMENT', 'REPRODUCIBILITY', 'CONTESTABILITY', 'AUTHORITY'].map((label) => `<div class="trust-item"><strong>${label}</strong></div>`).join('')}</div>
      <button class="action-button secondary" type="button" data-action="open-trust">Inspect all trust controls</button>`,
  },
  {
    id: 'bank', chapter: 'BANK COMPLIANCE', kicker: '12 / AI CHALLENGES AI',
    learn: 'The classification is contested', wants: 'Submit counter-evidence', authority: 'Yes · challenge only',
    draw: () => `<p class="eyebrow">Institution-side AI submits a rebuttal</p><h1 class="hero-title wide">THE FACT IS CONTESTED.</h1>
      <div class="challenge-grid"><div class="challenge-card"><small>DERIVED ENTITY GRAPH</small><strong>Commercial counterparty</strong><p>EntityGraph/T-17 changed the classification.</p></div><div class="challenge-card"><small>ORIGINAL RECORD + BANK RESPONSE</small><strong>Central-bank-related</strong><p>Source evidence supports a different interpretation.</p></div></div>
      <div class="label-row"><span class="label-chip blue">CHALLENGE APPENDED</span><span class="label-chip">SOURCE RECORDS UNCHANGED</span></div>`,
  },
  {
    id: 'prediction', chapter: 'PREDICTIVE BOUNDARY', kicker: '13 / PSYCHO-PASS MOMENT',
    learn: 'The model predicts possible harm', wants: 'Restrict liquidity activity', authority: 'No · prediction is not permission', authorityClass: 'denied',
    draw: () => `<p class="eyebrow">The system's persuasive case</p><div class="prediction-grid"><div class="prediction-card"><div class="hero-number ink">76</div><p>RISK COEFFICIENT</p></div><div class="prediction-card"><div class="hero-number amber">74%</div><p>PREDICTED MATERIAL EVENT</p></div></div>
      <p class="support-message">Both figures are synthetic teaching values. The proposed action is an enhanced liquidity restriction.</p>`,
  },
  {
    id: 'no-breach', chapter: 'NO BREACH', kicker: '14 / THE AUTHORITY BOUNDARY',
    learn: 'Risk is inferred, not a rule breach', wants: 'Pre-emptively restrict activity', authority: 'No · must escalate', authorityClass: 'denied',
    draw: () => `<p class="eyebrow">The decisive reveal</p><h1 class="hero-title danger wide">NO RULE HAS BEEN BREACHED.</h1>
      <p class="hero-message">A 74% prediction cannot authorise an intervention.</p>
      <div class="label-row"><span class="label-chip amber">PROBABILISTIC PRE-EMPTION</span><span class="label-chip">NOT DETERMINISTIC PREVENTION</span></div>`,
  },
  {
    id: 'counterfactual', chapter: 'COUNTERFACTUAL', kicker: '15 / ONE FACT CHANGES THE CASE',
    learn: 'Original evidence challenges T-17', wants: 'Reassess the recommendation', authority: 'Yes · analysis only',
    draw: () => `<p class="eyebrow">Reclassify Entity X as central-bank-related</p><div class="score-flow"><span class="hero-number ink">76</span><span class="score-arrow">→</span><span class="hero-number blue">39</span></div>
      <h1 class="hero-title wide">ONE FACT CHANGED.</h1><p class="support-message">The counterfactual adds a new event. The original trace stays intact.</p>`,
  },
  {
    id: 'gate', chapter: 'RUNTIME AUTHORITY', kicker: '16 / GOVERNED DISPOSITION',
    learn: 'The proposal exceeds mandate; evidence is disputed', wants: 'Decide the proposed restriction', authority: 'Human review required', authorityClass: 'escalate',
    draw: () => `<p class="eyebrow">Original 76-based proposal · now disputed</p>
      <div class="gate-grid"><div class="gate-check"><span>Identity</span><strong>Verified</strong></div><div class="gate-check warning"><span>Mandate</span><strong>Recommend only</strong></div><div class="gate-check warning"><span>Consequence</span><strong>High materiality</strong></div><div class="gate-check warning"><span>Evidence</span><strong>Disputed</strong></div></div>
      <div class="hero-number amber">ESCALATE</div><p class="hero-message">Restriction not executed.</p>
      <div class="action-row"><button class="action-button secondary" type="button" data-action="open-gate">Inspect gate reason</button><button class="action-button secondary" type="button" data-action="download-run">Export replay evidence</button></div>`,
  },
  {
    id: 'close-supervisor', chapter: 'CLOSING', kicker: '17 / THE GHOST QUESTION',
    learn: 'A network of agents shaped the case', wants: 'Assign responsibility', authority: 'The institution remains accountable',
    draw: () => `<p class="eyebrow">A governed network of humans and agents</p><h1 class="closing-question">WHO IS THE SUPERVISOR?</h1>`,
  },
  {
    id: 'close-loop', chapter: 'CLOSING', kicker: '18 / THE JUDGEMENT QUESTION',
    learn: 'A human cannot review every action', wants: 'Locate material boundaries', authority: 'Deliberately designed human judgement',
    draw: () => `<p class="eyebrow">Human in every loop is too vague</p><h1 class="closing-question">WHERE IS THE RIGHT LOOP?</h1>`,
  },
  {
    id: 'close-trust', chapter: 'CLOSING', kicker: '19 / THE ARCHITECTURE QUESTION',
    learn: 'AI selected what reached the human', wants: 'Make that selection challengeable', authority: 'Human and institutional accountability',
    draw: () => `<p class="eyebrow">The next governance problem</p><h1 class="closing-question">WHO SUPERVISES THE SUPERVISORY AI?</h1>
      <p class="hero-message">Where should human judgement sit in a machine-speed financial system?</p>
      <div class="action-row"><button class="action-button secondary" type="button" data-action="open-trust">Inspect trust controls</button><button class="action-button secondary" type="button" data-action="download-run">Export replay evidence</button></div>`,
  },
];

function reviewLabel() {
  const { classification, intervention, challenged } = state.review;
  if (challenged) return 'finding challenged';
  if (classification === 'pending') return 'pending · source not yet judged';
  if (classification === 'invalid') return 'classification rejected · intervention not justified';
  if (intervention === 'pending') return 'classification valid · intervention pending';
  return `classification valid · intervention ${intervention === 'yes' ? 'supported' : 'rejected'}`;
}

function stopFlood() {
  if (state.flood?.requestId) cancelAnimationFrame(state.flood.requestId);
  state.flood = null;
}

function render() {
  stopFlood();
  const frame = frames[state.index];
  stage.innerHTML = scene(frame, frame.draw());
  stage.scrollTop = 0;
  chapter.textContent = `${String(state.index + 1).padStart(2, '0')} / ${frame.chapter}`;
  sceneCount.textContent = `${String(state.index + 1).padStart(2, '0')} / ${frames.length}`;
  progressFill.style.width = `${((state.index + 1) / frames.length) * 100}%`;
  previousButton.disabled = state.index === 0;
  nextButton.disabled = state.index === frames.length - 1;
  utilityButton.textContent = frame.id === 'trust' || frame.id === 'close-trust' ? 'Trust controls' : 'Evidence';
  utilityButton.dataset.action = frame.id === 'trust' || frame.id === 'close-trust' ? 'open-trust' : 'open-evidence';
  if (frame.id === 'flood') startFlood();
}

function goTo(index) {
  if (index < 0 || index >= frames.length) return;
  closeDrawer();
  state.index = index;
  render();
}

function appendEvents(upTo) {
  const flood = state.flood;
  const lines = document.getElementById('floodLines');
  if (!flood || !lines || upTo <= flood.shown) return;
  const fragment = document.createDocumentFragment();
  for (let index = flood.shown; index < upTo; index++) {
    const event = run.events[index];
    const row = document.createElement('div');
    row.className = 'log-line';
    row.textContent = `${String(event.atMs).padStart(4, '0')}ms  ${event.id}  ${event.actor}/${event.taskId}  ${event.kind}  ${event.summary}`;
    fragment.appendChild(row);
  }
  lines.appendChild(fragment);
  lines.scrollTop = lines.scrollHeight;
  flood.shown = upTo;
  document.getElementById('floodCount').textContent = `${String(upTo).padStart(3, '0')} / 486`;
}

function updateFloodHero(elapsed) {
  const number = document.getElementById('floodNumber');
  const unit = document.getElementById('floodUnit');
  if (!number || !unit) return;
  const phase = elapsed < 750 ? ['8', 'AGENTS'] : elapsed < 1500 ? ['27', 'SUB-TASKS'] : elapsed < 2400 ? ['486', 'EVENTS'] : ['3.2', 'SECONDS'];
  number.textContent = phase[0];
  unit.textContent = phase[1];
}

function floodTick(now) {
  const flood = state.flood;
  if (!flood || flood.paused || frames[state.index].id !== 'flood') return;
  const elapsed = Math.min(3200, flood.elapsed + now - flood.startedAt);
  updateFloodHero(elapsed);
  appendEvents(Math.min(486, Math.floor(elapsed / 3200 * 486)));
  if (elapsed < 3200) {
    flood.requestId = requestAnimationFrame(floodTick);
  } else {
    appendEvents(486);
    flood.elapsed = 3200;
    flood.requestId = null;
    document.getElementById('pauseFloodButton').textContent = 'Completed';
  }
}

function startFlood() {
  state.flood = { startedAt: performance.now(), elapsed: 0, shown: 0, paused: false, requestId: null };
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    updateFloodHero(3200);
    appendEvents(486);
    state.flood.elapsed = 3200;
    document.getElementById('pauseFloodButton').textContent = 'Completed';
    return;
  }
  state.flood.requestId = requestAnimationFrame(floodTick);
}

function toggleFlood() {
  const flood = state.flood;
  if (!flood || flood.elapsed >= 3200) return;
  const button = document.getElementById('pauseFloodButton');
  if (flood.paused) {
    flood.paused = false;
    flood.startedAt = performance.now();
    button.textContent = 'Pause';
    flood.requestId = requestAnimationFrame(floodTick);
  } else {
    flood.elapsed = Math.min(3200, flood.elapsed + performance.now() - flood.startedAt);
    flood.paused = true;
    cancelAnimationFrame(flood.requestId);
    button.textContent = 'Resume';
  }
}

function detailBlock(label, value) {
  return `<div class="detail-block"><div class="detail-key">${label}</div><div class="detail-value">${escapeHTML(value)}</div></div>`;
}

function openDrawer(kind) {
  const classification = run.events.find((event) => event.kind === 'CLASSIFICATION_CHANGED');
  let title;
  let body;

  if (kind === 'source') {
    title = 'Original event · T-17';
    state.review.openedEvidence = true;
    body = `<p>Event ${classification.id} is one of the 486 original events. It remains in the trace after the counterfactual.</p>
      ${detailBlock('Raw audit entry', classification.summary)}
      ${detailBlock('Simulated time', `${classification.atMs} ms · sequence ${classification.sequence} of 486`)}
      ${detailBlock('Actor and task', `${classification.actor}/${classification.taskId}`)}
      ${detailBlock('Original source', EVIDENCE.entityFiling.finding)}
      ${detailBlock('Derived interpretation', EVIDENCE.graphInference.finding)}
      ${detailBlock('Uncertainty', EVIDENCE.graphInference.uncertainty)}
      <button class="action-button blue" type="button" data-action="open-review">Open human decision</button>`;
  } else if (kind === 'trust') {
    title = 'Supervisory AI trust controls';
    body = `<p>The Supervisory AI is a separate simulated control. It may flag and escalate; it cannot change evidence or execute intervention.</p>
      ${detailBlock('Provenance', `${finding.sourceEventIds.join(' → ')}; ${finding.sourceEvidenceIds.join(', ')}`)}
      ${detailBlock('Causal trace', finding.causalTrace.map((event) => `${event.actor}: ${event.summary}`).join(' → '))}
      ${detailBlock('Independence', finding.independence)}
      ${detailBlock('Uncertainty', finding.uncertainty)}
      ${detailBlock('Disagreement', finding.disagreement)}
      ${detailBlock('Reproducibility', finding.reproducibility)}
      ${detailBlock('Contestability', finding.contestability)}
      ${detailBlock('Authority', finding.authority.join(' and ') + ' only; no intervention or source writes')}
      <button class="action-button secondary" type="button" data-action="open-source">Open T-17</button>`;
  } else if (kind === 'gate') {
    title = 'Runtime gate · original proposal';
    body = `<p>The gate evaluates the original 76-based restriction proposal with the later dispute attached. The restriction is not executed.</p>
      ${detailBlock('Disposition', gate.disposition)}
      ${detailBlock('Decisive rule', `${gate.code}: ${gate.reason}`)}
      ${detailBlock('Identity / mandate', `Verified / ${run.gateInput.mandate} only`)}
      ${detailBlock('Materiality / reversibility', `${run.gateInput.materiality} / ${run.gateInput.reversibility}`)}
      ${detailBlock('Evidence / breach', `${run.gateInput.evidenceQuality} / no deterministic rule breach`)}
      ${detailBlock('Human task', 'Is the Entity X reclassification valid, and if valid is intervention justified?')}
      <button class="action-button blue" type="button" data-action="open-review">Open human review</button>`;
  } else if (kind === 'review') {
    title = 'Human decision record';
    body = `<p>The two decisions are separate. A recorded judgement does not itself execute a restriction; the runtime gate still applies.</p>
      <div class="choice-group"><strong>1. Is Entity X correctly reclassified?</strong>
        ${reviewButton('classification', 'pending', 'Needs verification')}
        ${reviewButton('classification', 'valid', 'Valid')}
        ${reviewButton('classification', 'invalid', 'Invalid')}</div>
      <div class="choice-group"><strong>2. If valid, is intervention justified?</strong>
        ${reviewButton('intervention', 'pending', 'Pending')}
        ${reviewButton('intervention', 'yes', 'Yes')}
        ${reviewButton('intervention', 'no', 'No')}</div>
      ${detailBlock('Current review state', reviewLabel())}
      ${detailBlock('Source inspection', state.review.openedEvidence ? 'Original T-17 event opened' : 'Original T-17 event has not been opened')}
      <button class="action-button secondary" type="button" data-action="open-source">Inspect T-17 and source</button>
      <button class="action-button amber" type="button" data-action="challenge-finding">Challenge Supervisory AI finding</button>`;
  } else {
    title = 'Replay evidence';
    body = `<p>This is a synthetic, deterministic run. The screen and trace use the same 486 events.</p>
      ${detailBlock('Run', `${run.id} · version ${run.version}`)}
      ${detailBlock('Volume', `${run.agents.length} agent instances · ${run.tasks.length} sub-tasks · ${run.events.length} events · 3.2 simulated seconds`)}
      ${detailBlock('Material event', `${finding.sourceEventIds[0]} · ${classification.summary}`)}
      ${detailBlock('Finding', `${finding.id}: ${finding.issue}`)}
      ${detailBlock('Gate', `${gate.disposition}: ${gate.reason}`)}
      <button class="action-button secondary" type="button" data-action="open-source">Open T-17</button>
      <button class="action-button secondary" type="button" data-action="open-trust">Inspect trust controls</button>
      <button class="action-button blue" type="button" data-action="download-run">Export complete run</button>`;
  }

  drawerTitle.textContent = title;
  drawerBody.innerHTML = body;
  drawer.hidden = false;
  drawer.querySelector('.drawer-close').focus();
}

function reviewButton(field, value, label) {
  const selected = state.review[field] === value ? 'selected' : '';
  const disabled = field === 'intervention' && state.review.classification !== 'valid' && value !== 'pending' ? 'disabled' : '';
  return `<button class="action-button secondary ${selected}" type="button" data-action="review-${field}" data-value="${value}" ${disabled}>${label}</button>`;
}

function closeDrawer() {
  drawer.hidden = true;
}

function downloadRun() {
  const payload = {
    ...run,
    supervisoryFinding: finding,
    runtimeGate: gate,
    humanReview: { ...state.review, status: reviewLabel() },
    note: 'Synthetic teaching simulation. Demo fingerprints are not cryptographic proof.',
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'regulator-ghost-replay.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) {
    if (event.target === drawer) closeDrawer();
    return;
  }
  const { action, value } = button.dataset;
  if (action === 'next') goTo(state.index + 1);
  else if (action === 'previous') goTo(state.index - 1);
  else if (action === 'replay-flood') { if (frames[state.index].id === 'flood') render(); }
  else if (action === 'pause-flood') toggleFlood();
  else if (action === 'reveal-naive') { state.naiveRevealed = true; render(); }
  else if (action === 'open-evidence') openDrawer('evidence');
  else if (action === 'open-source') openDrawer('source');
  else if (action === 'open-trust') openDrawer('trust');
  else if (action === 'open-gate') openDrawer('gate');
  else if (action === 'open-review') openDrawer('review');
  else if (action === 'close-drawer') closeDrawer();
  else if (action === 'download-run') downloadRun();
  else if (action === 'challenge-finding') {
    state.review.challenged = true;
    if (frames[state.index].id === 'decision') render();
    openDrawer('review');
  } else if (action === 'review-classification') {
    state.review.classification = value;
    if (value !== 'valid') state.review.intervention = value === 'invalid' ? 'no' : 'pending';
    if (frames[state.index].id === 'decision') render();
    openDrawer('review');
  } else if (action === 'review-intervention') {
    state.review.intervention = value;
    if (frames[state.index].id === 'decision') render();
    openDrawer('review');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !drawer.hidden) { closeDrawer(); return; }
  if (!drawer.hidden) return;
  if (event.key === 'ArrowRight' || (event.key === ' ' && !event.target.closest('button'))) {
    event.preventDefault(); goTo(state.index + 1);
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault(); goTo(state.index - 1);
  } else if (event.key.toLowerCase() === 'p' && frames[state.index].id === 'flood') {
    toggleFlood();
  } else if (event.key.toLowerCase() === 'r' && frames[state.index].id === 'flood') {
    render();
  } else if (event.key.toLowerCase() === 'f') {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }
});

render();
