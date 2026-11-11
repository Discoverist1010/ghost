export const FINAL_QUESTION = 'WHEN MACHINES INCREASINGLY DETERMINE WHAT HUMANS SEE, WHAT THEY MAY APPROVE AND WHAT CAN ACTUALLY BE EXECUTED, WHERE DOES SUPERVISION RESIDE—AND WHO REMAINS ACCOUNTABLE FOR THE CONSEQUENCES?';
export const FINALE_REVEALS=Object.freeze(['supervision-informs','supervision-structures','human-authority-machine-attention','supervision-enforces','supervision-progression','supervision-methods','supervision-powers','capability-authority','confidence-question','confidence-expertise','confidence-evidence','confidence-capacity','confidence-independence','confidence-challenge','human','ai','both','accountability','final-question']);
const titles=['AI INFORMS<br><span class="cyan">HUMAN SUPERVISION</span>','AI STRUCTURES<br><span class="cyan">HUMAN SUPERVISION</span>','AI-ENFORCED CONTROLS GOVERN<br><span class="cyan">HUMAN-INITIATED ACTIONS</span>'];
const supports=['AI supplies information and recommendations.<br>Humans determine what to examine and decide.','AI selects exceptions, ranks investigations<br>and frames decisions.','Within an institutional mandate, automated controls may prevent execution<br>until required conditions or an authorised override are satisfied.'];
const conditions=['EXPERTISE','EVIDENCE','CAPACITY','INDEPENDENCE','CONFIDENCE TO CHALLENGE'];
const methods=['RULES','ML','LLMs','AGENTS','ADAPTIVE METHODS'];
const powers=['OBSERVE','INFORM','PRIORITISE','CONSTRAIN','INTERVENE'];
function row(items,cls=''){return `<div class="finale-row ${cls}">${items.map((s,i)=>`${i?'<span class="finale-arrow">→</span>':''}<strong>${s}</strong>`).join('')}</div>`;}
export function renderFinale(step){
  let body='';
  if([0,1,3].includes(step)){const i=step===3?2:step;body=`<h1>${titles[i]}</h1><p class="finale-support">${supports[i]}</p>`;}
  if(step===2)body='<h1>THE HUMAN RETAINS AUTHORITY—<br><span class="cyan">BUT THE MACHINE SHAPES<br>WHAT THE HUMAN SEES.</span></h1>';
  if(step===4)body='<p class="finale-eyebrow">THREE SUPERVISORY ARRANGEMENTS</p><div class="finale-stages"><p>AI <strong>INFORMS</strong> HUMAN SUPERVISION</p><span>↓</span><p>AI <strong>STRUCTURES</strong> HUMAN SUPERVISION</p><span>↓</span><p>AI-ENFORCED CONTROLS <strong>GOVERN</strong><br>HUMAN-INITIATED ACTIONS</p></div><p class="finale-small">A CONCEPTUAL PROGRESSION · NOT A REQUIRED SEQUENCE</p>';
  if(step===5)body='<h1>HOW SUPERVISION<br><span class="cyan">IS PERFORMED</span></h1>'+row(methods)+'<div class="finale-functions">'+['Deterministic<br>breaches','Patterns &<br>anomalies','Interpret, investigate<br>& explain','Multi-step<br>investigations','Governed method<br>improvement'].map(s=>`<p>${s}</p>`).join('')+'</div><p class="finale-small">EACH METHOD HAS A ROLE. ADAPTATION REMAINS GOVERNED.</p>';
  if(step===6)body='<h1>WHAT SUPERVISION<br><span class="amber">MAY DO</span></h1>'+row(powers,'is-authority')+'<p class="finale-support">FORMALLY DELEGATED. BOUNDED. REVOCABLE.</p>';
  if(step===7)body='<h1>MORE CAPABLE<br><span class="amber">≠ MORE AUTHORISED</span></h1><div class="finale-dimensions"><div><span>METHOD</span>'+row(methods)+'</div><div><span>PERMISSION</span>'+row(powers,'is-authority')+'</div></div><p class="finale-support">Supervisory capability, supervisory influence<br>and supervisory authority are different things.</p>';
  if(step>=8&&step<=13)body='<h1>CAN THE HUMAN<br><span class="amber">DISAGREE?</span></h1>'+(step>=9?'<div class="finale-conditions">'+conditions.slice(0,step-8).map((s,i)=>`<p class="${i===step-9?'is-new':''}">${s}</p>`).join('')+'</div>':'');
  if(step>=14&&step<=16)body=`<h1 class="finale-choice ${step===15?'cyan':step===16?'amber':''}">${['HUMAN?','AI?','BOTH?'][step-14]}</h1>`;
  if(step===17)body='<h1>SUPERVISORY FUNCTIONS<br><span class="cyan">CAN BE SHARED.</span></h1><p class="finale-accountability">ACCOUNTABILITY CANNOT SIMPLY<br>BE DELEGATED TO A MODEL.</p>';
  if(step===18)body='<h1 class="finale-last"><span>WHEN MACHINES INCREASINGLY DETERMINE WHAT HUMANS SEE, WHAT THEY MAY APPROVE AND WHAT CAN ACTUALLY BE EXECUTED,</span> <strong>WHERE DOES SUPERVISION RESIDE—AND WHO REMAINS ACCOUNTABLE FOR THE CONSEQUENCES?</strong></h1>';
  return `<div class="p3-finale" data-finale="${FINALE_REVEALS[step]}">${body}</div>`;
}
