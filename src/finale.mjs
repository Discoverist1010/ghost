export const FINAL_QUESTION = 'WHEN MACHINES INCREASINGLY DETERMINE WHAT HUMANS SEE, WHAT THEY MAY APPROVE AND WHAT CAN ACTUALLY BE EXECUTED, WHERE DOES SUPERVISION RESIDE? SUPERVISORY CAPABILITY, SUPERVISORY INFLUENCE, SUPERVISORY AUTHORITY AND SUPERVISORY CONFIDENCE ARE DIFFERENT THINGS.';
export const FINALE_REVEALS=Object.freeze(['capability-authority','supervision-informs','supervision-structures','human-authority-machine-attention','supervision-enforces','confidence-question','confidence-expertise','confidence-evidence','confidence-capacity','confidence-independence','confidence-challenge','human','ai','both','final-question']);
const titles=['AI INFORMS<br><span class="cyan">HUMAN SUPERVISION</span>','AI STRUCTURES<br><span class="cyan">HUMAN SUPERVISION</span>','AI-ENFORCED CONTROLS GOVERN<br><span class="cyan">HUMAN-INITIATED ACTIONS</span>'];
const supports=['AI supplies information and recommendations.<br>Humans determine what to examine and decide.','AI selects exceptions, ranks investigations<br>and frames decisions.','Within an institutional mandate, automated controls may prevent execution<br>until required conditions or an authorised override are satisfied.'];
const conditions=['EXPERTISE','EVIDENCE','CAPACITY','INDEPENDENCE','CONFIDENCE TO CHALLENGE'];
const methods=['RULES','ML','LLMs','AGENTS','ADAPTIVE METHODS'];
const powers=['OBSERVE','INFORM','PRIORITISE','CONSTRAIN','INTERVENE'];
function row(items,cls=''){return `<div class="finale-row ${cls}">${items.map((s,i)=>`${i?'<span class="finale-arrow">→</span>':''}<strong>${s}</strong>`).join('')}</div>`;}
export function renderFinale(step){
  let body='';
  if([1,2,4].includes(step)){const i=step===4?2:step-1;body=`<h1>${titles[i]}</h1><p class="finale-support">${supports[i]}</p>`;}
  if(step===3)body='<h1>THE HUMAN RETAINS AUTHORITY—<br><span class="cyan">BUT THE MACHINE SHAPES<br>WHAT THE HUMAN SEES.</span></h1>';
  if(step===0)body='<p class="finale-recap">RECAP</p><h1>MORE CAPABLE AI<br><span class="amber">≠ MORE AUTHORISED</span></h1><div class="finale-dimensions"><div><span>METHOD</span>'+row(methods)+'</div><div><span>PERMISSION</span>'+row(powers,'is-authority')+'</div></div>';
  if(step>=5&&step<=10)body='<h1>CAN THE HUMAN<br><span class="amber">DISAGREE?</span></h1>'+(step>=6?'<div class="finale-conditions">'+conditions.slice(0,step-5).map((s,i)=>`<p class="${i===step-6?'is-new':''}">${s}</p>`).join('')+'</div>':'');
  if(step>=11&&step<=13)body=`<h1 class="finale-choice ${step===12?'cyan':step===13?'amber':''}">${['HUMAN?','AI?','BOTH?'][step-11]}</h1>`;
  if(step===14)body='<h1 class="finale-last"><span>WHEN MACHINES INCREASINGLY DETERMINE WHAT HUMANS SEE, WHAT THEY MAY APPROVE AND WHAT CAN ACTUALLY BE EXECUTED,</span> <strong>WHERE DOES SUPERVISION RESIDE? SUPERVISORY CAPABILITY, SUPERVISORY INFLUENCE, SUPERVISORY AUTHORITY AND SUPERVISORY CONFIDENCE ARE DIFFERENT THINGS.</strong></h1>';
  return `<div class="p3-finale" data-finale="${FINALE_REVEALS[step]}">${body}</div>`;
}
