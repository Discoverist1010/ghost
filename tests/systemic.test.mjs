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
test('finale retains independent dimensions but omits only the four requested screens',()=>{
 assert.doesNotMatch(renderFinale(0),/STRUCTURES|ENFORCED/);
 assert.match(renderFinale(4),/MORE CAPABLE.*≠ MORE AUTHORISED/s);
 assert.match(renderFinale(4),/RULES.*ML.*LLMs.*AGENTS.*ADAPTIVE METHODS/s);
 assert.match(renderFinale(4),/OBSERVE.*INFORM.*PRIORITISE.*CONSTRAIN.*INTERVENE/s);
 assert.equal(FINALE_REVEALS.length,15);
 for(const id of ['supervision-progression','supervision-methods','supervision-powers','accountability'])assert.equal(FINALE_REVEALS.includes(id),false);
});
test('human confidence and human-AI-both retain their progressive reveals before the final question',()=>{
 const conditions=['EXPERTISE','EVIDENCE','CAPACITY','INDEPENDENCE','CONFIDENCE TO CHALLENGE'];
 for(let i=0;i<5;i++)for(let j=0;j<5;j++)assert.equal(renderFinale(6+i).includes(conditions[j]),j<=i);
 assert.match(renderFinale(11),/>HUMAN\?</);assert.match(renderFinale(12),/>AI\?</);assert.match(renderFinale(13),/>BOTH\?</);
 let state={...createPresentationState(),cueIndex:7,step:13};assert.equal(currentReveal(transition(state,'next')),'final-question');
 assert.equal(currentReveal(transition({...state,step:14},'previous')),'both');
});
test('exact final question is the last stable state with no automatic continuation',()=>{
 let state={...createPresentationState(),cueIndex:7,step:FINALE_REVEALS.length-1};
 assert.equal(currentReveal(state),'final-question');assert.equal(transition(state,'next'),state);
 assert.equal(renderFinale(state.step).replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim(),FINAL_QUESTION);
 assert.doesNotMatch(renderFinale(state.step),/<button|<svg|BIS|ACCOUNTABILITY CANNOT/);
});


test('capability screen names AI and explains bounded constraints without the removed synthesis',()=>{
 const stage=renderFinale(FINALE_REVEALS.indexOf('capability-authority'));
 assert.match(stage,/MORE CAPABLE AI<br><span class="amber">≠ MORE AUTHORISED/);
 assert.match(stage,/CONSTRAIN · Enforce approved limits on agent actions/);
 assert.match(stage,/holding execution pending required human approval/);
 assert.doesNotMatch(stage,/Supervisory capability, supervisory influence/);
});


test('closing screen replaces the accountability clause with the four supervisory distinctions',()=>{
 const stage=renderFinale(FINALE_REVEALS.indexOf('final-question'));
 assert.match(stage,/WHERE DOES SUPERVISION RESIDE\?/);
 assert.match(stage,/SUPERVISORY CAPABILITY, SUPERVISORY INFLUENCE, SUPERVISORY AUTHORITY AND SUPERVISORY CONFIDENCE ARE DIFFERENT THINGS\./);
 assert.doesNotMatch(stage,/WHO REMAINS ACCOUNTABLE FOR THE CONSEQUENCES/);
});
