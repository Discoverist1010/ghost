export const FINAL_INTRO = 'WHEN MACHINES INCREASINGLY DETERMINE WHAT HUMANS SEE, WHAT THEY MAY APPROVE AND WHAT CAN ACTUALLY BE EXECUTED,';
export const FINAL_HERO = 'WHERE DOES SUPERVISION RESIDE?';
export const FINAL_QUESTION = FINAL_INTRO + ' ' + FINAL_HERO;
export const FINALE_REVEALS = Object.freeze([
  'supervision-informs', 'supervision-structures', 'supervision-enforces',
  'capability-authority', 'supervisory-dimensions', 'due-diligence', 'final-question',
]);
export const CONFIDENCE_CONDITIONS = Object.freeze(['EXPERTISE', 'EVIDENCE', 'CAPACITY', 'INDEPENDENCE', 'CONFIDENCE TO CHALLENGE']);
export const SUPERVISORY_DIMENSIONS = Object.freeze([
  {name:'SUPERVISORY CAPABILITY', question:'Can the system detect, investigate and understand an issue?'},
  {name:'SUPERVISORY INFLUENCE', question:'What does it determine humans see, consider or prioritise?'},
  {name:'SUPERVISORY AUTHORITY', question:'What may it approve, prevent or execute under its mandate?'},
  {name:'SUPERVISORY CONFIDENCE', question:"Can the human meaningfully challenge the AI's conclusion?"},
].map(Object.freeze));
export const FINALE_RECAP = Object.freeze([
  {id:'exceptions', arc:'EXCEPTIONS — 486 → 1', insight:'AI makes exceptions manageable but determines what humans see.', question:'What did the AI omit, filter or deprioritise—and why?'},
  {id:'ai-checks-ai', arc:'AI CHECKS AI — 76 → 39', insight:'One AI corrected another, but both missed an applicable restriction.', question:'Who checks the complete decision, including evidence, domain rules and affected historical cases?'},
  {id:'authority', arc:'AUTHORITY — ESCALATE', insight:'A persuasive recommendation does not create permission to execute.', question:'What may the AI execute or prevent—and who may override it, on what evidence?'},
  {id:'nav', arc:'FUND NAV — $100 → $102.03', insight:'Human approval reduced supervisory attention while a valuation discrepancy accumulated.', question:'What is each AI optimising—and can feedback or previous approvals change what it escalates?'},
  {id:'systemic', arc:'SYSTEMIC EFFECTS — SIX AGENTS', insight:'All agents remained within mandate, yet their combined behaviour changed market conditions.', question:'Who tests collective behaviour, feedback loops and system-wide consequences?'},
].map(Object.freeze));
const stages = [
  {title:'AI INFORMS HUMAN SUPERVISION', copy:'AI supplies information and recommendations.<br>Humans determine what to examine and decide.'},
  {title:'AI STRUCTURES HUMAN SUPERVISION', copy:'AI selects exceptions, ranks investigations and frames decisions.<br>Humans retain formal decision authority, but machines increasingly influence what they see.'},
  {title:'AI-ENFORCED CONTROLS GOVERN HUMAN-INITIATED ACTIONS', copy:'Within institutionally approved mandates, automated controls may prevent execution until required conditions are satisfied or an authorised override occurs.'},
];
const methods = ['RULES','ML','LLMs','AGENTS','ADAPTIVE METHODS'];
const powers = ['OBSERVE','INFORM','PRIORITISE','CONSTRAIN','INTERVENE'];
const esc = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const row = (items, cls='') => `<div class="finale-row ${cls}">${items.map((s,i)=>`${i?'<span class="finale-arrow" aria-hidden="true">→</span>':''}<strong>${s}</strong>`).join('')}</div>`;

export function renderFinale(step) {
  const reveal = FINALE_REVEALS[step];
  if (!reveal) throw new Error('Unknown finale reveal: ' + step);
  let body, composition;
  if (step <= 2) {
    composition = 'evolution';
    body = '<h1>EVOLUTION OF SUPERVISION</h1><div class="finale-evolution">' + stages.map((stage,i)=>
      '<div class="finale-evolution-slot">' + (i<=step ? `<section class="finale-evolution-item${i===step?' is-revealed':''}" data-arrangement="${i+1}"><h2>${stage.title}</h2><p>${stage.copy}</p></section>` : '') + '</div>'
    ).join('') + '</div><p class="finale-v4-note">Conceptual arrangements · Not a mandatory adoption sequence</p>';
  } else if (reveal === 'capability-authority') {
    composition = 'capability';
    body = '<h1>MORE CAPABLE AI<br><span class="amber">≠ MORE AUTHORISED AI</span></h1><div class="finale-v4-paths"><section><h2>HOW SUPERVISION IS PERFORMED</h2>'+row(methods)+'</section><section><h2>WHAT SUPERVISION IS PERMITTED TO DO</h2>'+row(powers,'is-authority')+'</section></div><p class="finale-v4-support">A sophisticated AI may only observe or recommend.<br>A deterministic control may prevent a transaction under an approved mandate.</p>';
  } else if (reveal === 'supervisory-dimensions') {
    composition = 'dimensions';
    body = '<h1>FOUR DIMENSIONS OF SUPERVISION</h1><div class="finale-four-dimensions">'+SUPERVISORY_DIMENSIONS.map(d=>`<section><h2>${d.name}</h2><p>${esc(d.question)}</p></section>`).join('')+'</div><div class="finale-confidence-together"><p>MEANINGFUL HUMAN CHALLENGE REQUIRES</p><strong>'+CONFIDENCE_CONDITIONS.join(' · ')+'</strong></div>';
  } else if (reveal === 'due-diligence') {
    composition = 'recap';
    body = '<h1>FIVE QUESTIONS BEFORE YOU DELEGATE TO AI</h1><table class="finale-recap-table"><colgroup><col class="recap-arc"><col class="recap-insight"><col class="recap-question"></colgroup><thead><tr><th scope="col">ARC</th><th scope="col">WHAT WE LEARNED</th><th scope="col">WHAT TO ASK</th></tr></thead><tbody>'+FINALE_RECAP.map(r=>`<tr data-recap-row="${r.id}"><th scope="row">${esc(r.arc)}</th><td>${esc(r.insight)}</td><td class="recap-question-text">${esc(r.question)}</td></tr>`).join('')+'</tbody></table>';
  } else {
    composition = 'ending';
    body = `<h1 class="finale-last"><span>${FINAL_INTRO}</span> <strong>${FINAL_HERO}</strong></h1>`;
  }
  return `<div class="p3-finale finale-v4" data-finale="${reveal}" data-composition="${composition}">${body}</div>`;
}
