import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSystemicScenario,decideSystemicActions,applySystemicActions,SYSTEMIC_AGENTS,SYSTEMIC_TIMING} from '../src/systemic-scenario.mjs';
import {renderSystemic,renderSystemicEvidence} from '../src/systemic-theatre.mjs';
import {FINALE_REVEALS,FINAL_QUESTION,renderFinale} from '../src/finale.mjs';
import {CUES,transition,createPresentationState,currentReveal} from '../src/presentation.mjs';
const run=buildSystemicScenario();

test('six independent principals have distinct identities, objectives and bounded mandates',()=>{
 for(const key of ['identity','principal','objective','constraint','mandate'])assert.equal(new Set(SYSTEMIC_AGENTS.map(a=>a[key])).size,6);
 assert.equal(run.sharedControllingObjective,null);assert.equal(run.coordination,false);
 assert.equal(run.policiesRewritten,false);
 for(const a of [...run.firstWave,...run.secondWave]){assert.equal(a.withinMandate,true);assert.ok(a.totalUnits<=a.limit);assert.equal(a.coordination,false);assert.equal(a.objectiveChanged,false);}
});
test('the external shock precedes first-wave actions and all transitions reproduce',()=>{
 assert.deepEqual(buildSystemicScenario(),run);
 assert.deepEqual(run.events.map(e=>e.kind),['EXTERNAL_SHOCK','FIRST_WAVE','MARKET_CHANGED','SECOND_WAVE','PARALLEL_TRANSMISSION']);
 assert.ok(run.shock.equityDepth<run.initial.equityDepth);
 assert.ok(run.shock.usdDemand>run.initial.usdDemand);
 assert.ok(run.firstWave.every(a=>a.observedStateId==='shock'));
});
test('first-wave market changes are computed from individual action contributions',()=>{
 assert.equal(run.afterFirst.usdDemand,run.shock.usdDemand+run.firstWave.reduce((sum,a)=>sum+a.effects.usdDemand,0));
 assert.equal(run.afterFirst.equityDepth,run.shock.equityDepth+run.firstWave.reduce((sum,a)=>sum+a.effects.equityDepth,0));
 const withoutDealer=applySystemicActions(run.shock,run.firstWave.filter(a=>a.agentId!=='E'));
 assert.ok(withoutDealer.dealerCapacity>run.afterFirst.dealerCapacity);
 assert.ok(withoutDealer.fundingSpread<run.afterFirst.fundingSpread);
});
test('second-wave decisions consume changed market information and use role-specific rules',()=>{
 assert.ok(run.secondWave.every(a=>a.observedStateId==='after-first-wave'));
 for(const a of run.secondWave)assert.deepEqual(a.observed,run.afterFirst);
 const contained=decideSystemicActions({...run.initial,id:'counterfactual-contained'},2);
 assert.ok(contained.every(a=>a.units===0));
 const onlyMargin=decideSystemicActions({...run.initial,id:'margin-only',collateralPressure:40},2);
 assert.deepEqual(onlyMargin.filter(a=>a.units>0).map(a=>a.agentId),['D']);
 assert.ok(run.afterSecond.liquidityPressure>run.afterFirst.liquidityPressure);
});
test('execution, settlement and dated FX remain separate from earlier USD obligations',()=>{
 const byId=Object.fromEntries(SYSTEMIC_TIMING.map(e=>[e.id,e]));
 assert.equal(byId['equity-execution'].cashAvailable,false);
 assert.equal(byId['equity-settlement'].cashAvailable,true);
 assert.equal(byId['equity-settlement'].currency,'LOCAL');
 assert.equal(byId['fx-value'].executionTime,0);assert.equal(byId['fx-value'].time,2);
 assert.equal(byId['equity-settlement'].time,byId['fx-value'].time);
 for(const id of ['margin-deadline','payment-deadline']){assert.equal(byId[id].currency,'USD');assert.ok(byId[id].time<byId['equity-settlement'].time);}
 assert.match(run.assumptions.join(' '),/not universal/);
 assert.match(run.agents[3].mandate,/other contracts may permit non-USD/);
});
test('dealer and settlement effects respect their own institutional constraints',()=>{
 const dealer=run.firstWave.find(a=>a.agentId==='E');assert.equal(dealer.principal,'Independent dealer E');
 assert.ok(dealer.effects.dealerCapacity<0);assert.equal(dealer.effects.usdDemand,0);
 const settlement=run.firstWave.find(a=>a.agentId==='F');
 assert.ok(settlement.externalFundingUnits>0);assert.ok(settlement.reservedExistingCashUnits>0);
 assert.equal(settlement.effects.usdDemand,settlement.externalFundingUnits*2);
 assert.match(run.assumptions.join(' '),/only externally raised shortfalls add/);
 assert.match(run.assumptions.join(' '),/not the spot FX exchange rate/);
});
test('pressure is conditional and dampeners can contain the same initial shock',()=>{
 assert.equal(run.afterSecond.condition,'STRESSED');
 const contained=buildSystemicScenario({dampening:1});
 assert.deepEqual(contained.shock,run.shock);
 assert.ok(contained.secondWave.every(a=>a.units===0));
 assert.equal(contained.afterSecond.condition,'CONTAINED');
 assert.ok(contained.afterSecond.liquidityPressure<run.afterSecond.liquidityPressure);
 assert.equal(contained.dampeners.length,5);assert.throws(()=>buildSystemicScenario({dampening:2}),RangeError);
 assert.match(run.metricLabel,/Fictional relative.*not observed/);
});
test('mandate reassurance precedes collective consequences and research remains properly qualified',()=>{
 for(let i=0;i<9;i++)assert.doesNotMatch(renderSystemic(i),/NO AGENT FAILED|BIS PROJECT LOGOS/);
 assert.doesNotMatch(renderSystemic(2),/SYSTEM LIQUIDITY PRESSURE|FUNDING DEMAND ↑/);
 assert.match(renderSystemicEvidence(9),/ongoing research, not an established experimental finding/);
 assert.match(renderSystemicEvidence(9),/separate synthetic extension/);
 assert.match(renderSystemicEvidence(9),/not binding Federal Reserve policy/);
 assert.doesNotMatch(renderSystemicEvidence(0),/after-first-wave|SECOND_WAVE/);
});
test('NAV final question only progresses on command and Back reconstructs the boundary',()=>{
 const start={...createPresentationState(),cueIndex:5,step:CUES[5].steps.length-1};
 assert.equal(currentReveal(start),'nav-override');
 assert.equal(currentReveal(transition(start,'unknown')),'nav-override');
 const next=transition(start,'next');assert.equal(currentReveal(next),'independent-agents');
 assert.deepEqual(transition(next,'previous'),start);
});
test('seven finale reveals form five compositions with progressive supervision arrangements',()=>{
 assert.deepEqual(FINALE_REVEALS,['supervision-informs','supervision-structures','supervision-enforces','capability-authority','supervisory-dimensions','due-diligence','final-question']);
 assert.match(renderFinale(0),/AI INFORMS HUMAN SUPERVISION/);
 assert.doesNotMatch(renderFinale(0),/AI STRUCTURES|AI-ENFORCED/);
 assert.match(renderFinale(1),/AI INFORMS.*AI STRUCTURES/s);
 assert.doesNotMatch(renderFinale(1),/AI-ENFORCED/);
 assert.match(renderFinale(2),/AI INFORMS.*AI STRUCTURES.*AI-ENFORCED CONTROLS/s);
 for(let i=0;i<3;i++)assert.match(renderFinale(i),/data-composition="evolution"/);
 assert.match(renderFinale(2),/Not a mandatory adoption sequence/);
 assert.match(renderFinale(2),/institutionally approved mandates/);
 assert.equal(new Set(FINALE_REVEALS.map((_,i)=>renderFinale(i).match(/data-composition="([^"]+)"/)[1])).size,5);
});
test('capability and permission remain independent with explicitly bounded authority',()=>{
 const stage=renderFinale(3);
 assert.match(stage,/MORE CAPABLE AI.*≠ MORE AUTHORISED AI/s);
 assert.match(stage,/HOW SUPERVISION IS PERFORMED.*RULES.*ML.*LLMs.*AGENTS.*ADAPTIVE METHODS/s);
 assert.match(stage,/WHAT SUPERVISION IS PERMITTED TO DO.*OBSERVE.*INFORM.*PRIORITISE.*CONSTRAIN.*INTERVENE/s);
 assert.match(stage,/A sophisticated AI may only observe or recommend/);
 assert.match(stage,/A deterministic control may prevent a transaction under an approved mandate/);
 assert.doesNotMatch(stage,/SUPERVISORY CONFIDENCE/);
});
test('four balanced dimensions include all five conditions for human supervisory confidence together',()=>{
 const stage=renderFinale(4);
 for(const phrase of ['SUPERVISORY CAPABILITY','SUPERVISORY INFLUENCE','SUPERVISORY AUTHORITY','SUPERVISORY CONFIDENCE','EXPERTISE','EVIDENCE','CAPACITY','INDEPENDENCE','CONFIDENCE TO CHALLENGE'])assert.ok(stage.includes(phrase),phrase);
 assert.equal((stage.match(/<section>/g)||[]).length,4);
 assert.match(stage,/What may it approve, prevent or execute under its mandate/);
 assert.doesNotMatch(stage,/finale-row|ADAPTIVE METHODS|>HUMAN\?|>AI\?|>BOTH\?/);
 for(const id of ['human','ai','both','confidence-expertise','confidence-evidence','confidence-capacity','confidence-independence','confidence-challenge','human-authority-machine-attention'])assert.equal(FINALE_REVEALS.includes(id),false);
});
test('five-question recap links each demonstrated arc to its approved insight and due-diligence question',async()=>{
 const {FINALE_RECAP}=await import('../src/finale.mjs');
 const stage=renderFinale(5);
 assert.match(stage,/FIVE QUESTIONS BEFORE YOU DELEGATE TO AI/);
 assert.equal(FINALE_RECAP.length,5);assert.equal((stage.match(/data-recap-row=/g)||[]).length,5);
 assert.deepEqual(FINALE_RECAP.map(r=>r.arc),['EXCEPTIONS — 486 → 1','AI CHECKS AI — 76 → 39','AUTHORITY — ESCALATE','FUND NAV — $100 → $102.03','SYSTEMIC EFFECTS — SIX AGENTS']);
 assert.deepEqual(FINALE_RECAP.map(r=>r.question),[
 'What did the AI omit, filter or deprioritise—and why?',
 'Who checks the complete decision, including evidence, domain rules and affected historical cases?',
 'What may the AI execute or prevent—and who may override it, on what evidence?',
 'What is each AI optimising—and can feedback or previous approvals change what it escalates?',
 'Who tests collective behaviour, feedback loops and system-wide consequences?']);
 for(const r of FINALE_RECAP){assert.ok(stage.includes(r.arc));assert.ok(stage.includes(r.insight));assert.ok(stage.includes(r.question));}
 assert.doesNotMatch(stage,/BIS|MAS|IOSCO|CSSF|FSB|NIST|OWASP|regulatory requirement|restriction executed/);
 assert.match(FINALE_RECAP[2].insight,/does not create permission to execute/);
 assert.match(FINALE_RECAP[3].insight,/Human approval reduced supervisory attention/);
 assert.match(FINALE_RECAP[4].insight,/within mandate/);
});
test('exact definitive ending holds indefinitely and Back returns to the practical recap',()=>{
 let state={...createPresentationState(),cueIndex:7,step:FINALE_REVEALS.length-1};
 assert.equal(currentReveal(state),'final-question');assert.equal(transition(state,'next'),state);
 assert.equal(FINAL_QUESTION,'WHEN MACHINES INCREASINGLY DETERMINE WHAT HUMANS SEE, WHAT THEY MAY APPROVE AND WHAT CAN ACTUALLY BE EXECUTED, WHERE DOES SUPERVISION RESIDE?');
 const final=renderFinale(state.step);
 assert.equal(final.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim(),FINAL_QUESTION);
 assert.doesNotMatch(final,/<button|<svg|BIS|ACCOUNTAB|SUPERVISORY CAPABILITY|HUMAN\?|AI\?|BOTH\?/);
 assert.equal(currentReveal(transition(state,'previous')),'due-diligence');
 assert.equal(currentReveal(transition(transition(state,'previous'),'next')),'final-question');
});
test('system supervisory question enters the evolution composition and keeps Back intact',()=>{
 const before={...createPresentationState(),cueIndex:6,step:CUES[6].steps.length-1};
 assert.equal(currentReveal(before),'system-supervision');
 const after=transition(before,'next');assert.equal(currentReveal(after),'supervision-informs');
 assert.deepEqual(transition(after,'previous'),before);
 assert.equal(currentReveal(transition(after,'next')),'supervision-structures');
});
