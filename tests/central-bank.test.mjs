import test from 'node:test';
import assert from 'node:assert/strict';
import {buildRun,validateRun,submitSourceChallenge,supervise,evaluateGate,EVIDENCE} from '../src/scenario.mjs';
import {ARC2_ENTITY,ARC2_JURISDICTION,ARC2_POLICY,ARC2_EXPOSURE,verifySanctionsPolicy,testSourceClassification,createCorrectionPlan,planHistoricalReview} from '../src/central-bank-scenario.mjs';
import {renderArc2,buildArc2Audit,renderArc2Evidence} from '../src/central-bank-theatre.mjs';
import {CUES,currentReveal,createPresentationState,transition} from '../src/presentation.mjs';
const run=buildRun();
const why={...createPresentationState(),cueIndex:4,step:0};
const requested=transition(why,'check-source');
const challenge=submitSourceChallenge(run,requested.sourceCheck);
const calculation=testSourceClassification(run,challenge);
const question={...requested,step:3};
const checked=transition(question,'check-policy');
const result=verifySanctionsPolicy({request:checked.policyCheck});
const context={sourceRequest:requested.sourceCheck,challenge,classificationTest:calculation,policyRequest:checked.policyCheck,policyResult:result};

test('original trace, event identity and initial 76/74 assessment survive the new policy review',()=>{
 const before=structuredClone(run);
 assert.equal(validateRun(run),true);assert.equal(run.events.length,486);assert.equal(run.agents.length,8);assert.equal(run.tasks.length,27);
 assert.equal(run.events[237].id,'EVT-0238');assert.equal(run.events[237].taskId,'T-17');
 assert.equal(run.gateInput.score,76);assert.equal(run.prediction.percent,74);
 verifySanctionsPolicy({request:checked.policyCheck});testSourceClassification(run,challenge);
 assert.deepEqual(run,before);
});
test('source verification requires the explicit human action and retains attributed challenge evidence',()=>{
 assert.equal(transition(why,'next'),why);assert.equal(why.sourceCheck,null);
 assert.equal(testSourceClassification(run,null),null);
 assert.equal(requested.sourceCheck.initiatedBy,'human');assert.equal(requested.sourceCheck.id,'SOURCE-REQUEST-001');
 assert.equal(challenge.actor,'Bank Compliance Agent');assert.equal(challenge.status,'contested');
 assert.deepEqual(challenge.parentIds,['EVT-0238']);assert.ok(challenge.evidenceIds.includes('EV-ENTITY-01'));
 assert.equal(submitSourceChallenge(run,{...requested.sourceCheck,initiatedBy:'ai'}),null);
});
test('conditional recalculation changes only the classification-dependent coefficient',()=>{
 assert.equal(calculation.before,76);assert.equal(calculation.after,39);assert.equal(calculation.classificationUpliftRemoved,37);
 assert.equal(calculation.conditional,true);assert.equal(calculation.isAI,false);assert.equal(calculation.originalTracePreserved,true);
 assert.deepEqual(calculation.originalPrediction,run.prediction);assert.deepEqual(testSourceClassification(run,challenge),calculation);
 assert.match(calculation.scope,/no transaction permission/);
 assert.ok(run.evidence.find(e=>e.id==='EV-ENTITY-01'));assert.equal(supervise(run.events).omittedConflictEvidenceIds[0],'EV-ENTITY-01');
});
test('WHY 76 and source comparison withhold later discoveries',()=>{
 assert.doesNotMatch(renderArc2(0),/39|CENTRAL-BANK|SANCTIONS|ESCALATE/);
 assert.match(renderArc2(0),/VIEW AI ASSESSMENT/);assert.match(renderArc2(0),/CHECK ORIGINAL SOURCE/);
 assert.match(renderArc2(1),/AI #1 DERIVED:.*COMMERCIAL COUNTERPARTY/s);
 assert.match(renderArc2(1),/AI #2 FLAGS CONTRADICTORY EVIDENCE/);
 assert.doesNotMatch(renderArc2(1),/39|SANCTIONS/);
 for(let i=0;i<5;i++)assert.doesNotMatch(renderArc2(i),/APPLICABLE SANCTIONS-RELATED POLICY FOUND|RIGHT RESTRICTION/);
});
test('policy verification is a separate explicit action and deterministic attributed result',()=>{
 assert.equal(transition(question,'next'),question);assert.equal(question.policyCheck,null);
 assert.match(renderArc2(4),/SO WAS THE RECOMMENDED<br>RESTRICTION WRONG/);
 assert.match(renderArc2(4),/WHAT IS MORE LIKELY—THE USER STOPS HERE/);
 assert.match(renderArc2(4),/>3RD LEVEL CHECK →<\/button>/);
 assert.equal(currentReveal(checked),'policy-finding');assert.equal(checked.policyCheck.kind,'deterministic-policy-check');
 assert.equal(result.status,'MATCH_REQUIRES_AUTHORISED_HANDLING');assert.equal(result.isAI,false);assert.equal(result.executed,false);
 assert.equal(result.requestId,checked.policyCheck.id);assert.equal(result.policyId,ARC2_POLICY.id);assert.equal(result.exposureId,ARC2_EXPOSURE.id);
 assert.deepEqual(verifySanctionsPolicy({request:checked.policyCheck}),result);
 assert.equal(verifySanctionsPolicy(),null);assert.equal(verifySanctionsPolicy({request:{...checked.policyCheck,initiatedBy:'ai'}}),null);
});
test('a policy record and verified source, entity, jurisdiction and exposure are all required',()=>{
 for(const key of ['entity','jurisdiction','policy','exposure']){
  const inputs={request:checked.policyCheck,entity:ARC2_ENTITY,jurisdiction:ARC2_JURISDICTION,policy:ARC2_POLICY,exposure:ARC2_EXPOSURE};
  inputs[key]=null;assert.notEqual(verifySanctionsPolicy(inputs)?.status,'MATCH_REQUIRES_AUTHORISED_HANDLING');
 }
 for(const key of ['entity','jurisdiction','policy','exposure']){
  const inputs={request:checked.policyCheck,entity:ARC2_ENTITY,jurisdiction:ARC2_JURISDICTION,policy:ARC2_POLICY,exposure:ARC2_EXPOSURE};
  inputs[key]={...inputs[key],verified:false};assert.equal(verifySanctionsPolicy(inputs).status,'INSUFFICIENT_EVIDENCE');
 }
 assert.equal(verifySanctionsPolicy({request:checked.policyCheck,policy:{...ARC2_POLICY,recordId:null}}).status,'INSUFFICIENT_EVIDENCE');
 assert.equal(verifySanctionsPolicy({request:checked.policyCheck,policy:{...ARC2_POLICY,entityIds:undefined}}).status,'INSUFFICIENT_EVIDENCE');
});
test('effective dates apply to the exposure date and never retroactively',()=>{
 for(const asOf of ['2026-09-30','2027-01-01','bad-date','2026-02-30'])assert.equal(verifySanctionsPolicy({request:checked.policyCheck,exposure:{...ARC2_EXPOSURE,asOf}}).status,'POLICY_NOT_EFFECTIVE');
 assert.equal(verifySanctionsPolicy({request:checked.policyCheck,exposure:{...ARC2_EXPOSURE,asOf:'2026-10-01'}}).status,'MATCH_REQUIRES_AUTHORISED_HANDLING');
 assert.equal(verifySanctionsPolicy({request:checked.policyCheck,entity:{...ARC2_ENTITY,validFrom:'2026-12-01'}}).status,'ENTITY_EVIDENCE_NOT_EFFECTIVE');
});
test('neither central-bank relationship nor jurisdiction alone establishes a protective restriction',()=>{
 for(const changes of [{type:'ORDINARY_CUSTODY_SERVICE'},{currency:'SGD'},{status:'SETTLED'},{entityId:'ENTITY-Y'}])assert.equal(verifySanctionsPolicy({request:checked.policyCheck,exposure:{...ARC2_EXPOSURE,...changes}}).status,'NO_MATCH');
 assert.equal(verifySanctionsPolicy({request:checked.policyCheck,entity:{...ARC2_ENTITY,relationship:'unverified'}}).status,'NO_MATCH');
 assert.equal(verifySanctionsPolicy({request:checked.policyCheck,jurisdiction:{...ARC2_JURISDICTION,id:'J-OTHER'}}).status,'NO_MATCH');
 assert.equal(verifySanctionsPolicy({request:checked.policyCheck,policy:{...ARC2_POLICY,entityIds:['ENTITY-Y']}}).status,'NO_MATCH');
 assert.equal(verifySanctionsPolicy({request:{...checked.policyCheck,scope:'OTHER-EXPOSURE'}}).status,'REQUEST_SCOPE_MISMATCH');
});
test('independent policy does not grant the original AI execution authority or rewrite its reasoning',()=>{
 const gateInput=structuredClone(run.gateInput);assert.equal(result.originalAIRecommendationAuthorised,false);
 assert.equal(evaluateGate(run.gateInput).disposition,'ESCALATE');assert.deepEqual(run.gateInput,gateInput);
 const audit=buildArc2Audit(run,{...context,step:13});
 assert.equal(audit.originalRuntimeGate.result.disposition,'ESCALATE');assert.equal(audit.originalRuntimeGate.executed,false);
 assert.equal(audit.policyResult.pathway,'AUTHORISED-SANCTIONS-COMPLIANCE-07');
 assert.match(audit.originalRuntimeGate.separatePolicyPathway,/does not modify or retrospectively authorise/);
});
test('the two AI review scopes are distinct and design omissions are explicit',()=>{
 const audit=buildArc2Audit(run,{...context,step:8});assert.notEqual(audit.reviewCoverage.ai1,audit.reviewCoverage.ai2);
 assert.equal(audit.reviewCoverage.deceptionEstablished,false);
 assert.match(audit.designGap.classificationRequirement,/central-bank-related exception/);assert.match(audit.designGap.policyRequirement,/effective dates/);
 assert.equal(audit.designGap.testEvidence.length,2);assert.match(audit.designGap.consultation,/Domain experts were consulted/);
});
test('prospective and retrospective proposals do not change historical decisions or execute remediation',()=>{
 const plan=createCorrectionPlan(result);assert.equal(plan.status,'PROPOSED_REQUIRES_APPROVAL');assert.equal(plan.prospective.executed,false);
 assert.equal(plan.retrospective.automaticReversal,false);assert.equal(plan.retrospective.applyPolicyRetroactively,false);assert.equal(plan.retrospective.presumedViolation,false);
 const history=[{id:'CASE-OLD',ruleId:'RULE-ENTITY-17',originalDate:'2026-09-20',sourceEvidenceIds:['HIST-SOURCE-01'],decision:'RECORDED'},{id:'CASE-OTHER',ruleId:'OTHER',originalDate:'2026-11-01'}],before=structuredClone(history);
 const queue=planHistoricalReview(history,plan);assert.equal(queue.length,1);assert.equal(queue[0].policyMustBeEffectiveOn,'2026-09-20');assert.equal(queue[0].transactionReversed,false);assert.deepEqual(history,before);
 assert.equal(createCorrectionPlan({...result,status:'NO_MATCH'}),null);
});
test('drawers and exports withhold source, counterfactual and policy findings until approved reveals',()=>{
 for(const step of [-1,0]){const a=buildArc2Audit(run,{...context,step});assert.equal(a.originalSource,undefined);assert.equal(a.challenge,undefined);assert.equal(a.conditionalClassificationTest,undefined);assert.equal(a.policyResult,undefined);assert.doesNotMatch(JSON.stringify(a),/central-bank-related|INST-SAN|39/);}
 const source=buildArc2Audit(run,{...context,step:1});assert.equal(source.originalSource.id,EVIDENCE.entityFiling.id);assert.equal(source.challenge.counterfactual,undefined);assert.equal(source.conditionalClassificationTest,undefined);
 for(let step=0;step<5;step++){assert.equal(buildArc2Audit(run,{...context,step}).policyResult,undefined);assert.doesNotMatch(renderArc2Evidence(run,{...context,step}),/J-7|INST-SAN-07|APPLICABLE SANCTIONS/);}
 assert.equal(buildArc2Audit(run,{...context,step:5}).policyResult.policyId,'INST-SAN-07');
 assert.equal(buildArc2Audit(run,{...context,step:0}).originalRuntimeGate,undefined);
});
test('research is system-level assurance, with UK AISI evasion separated from this cause',()=>{
 const stage=renderArc2(12);assert.match(stage,/SINGAPORE AISI/);assert.match(stage,/GOOGLE DEEPMIND/);assert.doesNotMatch(stage,/85%|Mythos|UK AI/);
 for(const step of [3,7,8])assert.doesNotMatch(renderArc2(step),/DECEPTION|HALLUCINATION|REWARD HACK/);
});
test('final human questions lead to NAV only on presenter command',()=>{
 const state={...checked,step:13};assert.equal(currentReveal(state),'human-questions');
 assert.match(renderArc2(14),/WHAT IF THE HUMAN NEVER/);assert.match(renderArc2(14),/DOMAIN REQUIREMENT/);
 assert.match(renderArc2(15),/CAN THE HUMAN DISAGREE—/);
 const next=transition(state,'next');assert.equal(currentReveal(next),'nav-introduction');assert.deepEqual(transition(next,'previous'),state);
});

test('sanctions discovery uses the approved hierarchy and only three audience-facing evidence fields',()=>{
 const screen=renderArc2(5);
 assert.match(screen,/A SEPARATE SANCTIONS RULE CHECK/);
 assert.match(screen,/THE SCORE FELL TO 39/);
 assert.match(screen,/<span class="amber">BUT A RESTRICTION<br>IS STILL REQUIRED/);
 assert.match(screen,/This specific exposure matches a sanctions restriction under the bank's policy\./);
 assert.match(screen,/SEE WHY THE RULE APPLIES/);
 assert.doesNotMatch(screen,/RIGHT RESTRICTION|WRONG REASON|APPLICABLE SANCTIONS-RELATED/);
 const evidence=renderArc2Evidence(run,{...context,step:5});
 assert.deepEqual([...evidence.matchAll(/<dt>(.*?)<\/dt>/g)].map(m=>m[1]),['1. Entity','2. Applicable Rule','3. Required Action']);
 assert.equal((evidence.match(/<dd>/g)||[]).length,3);
 assert.match(evidence,/Entity X/);assert.match(evidence,/INST-SAN-07/);assert.match(evidence,/EXPOSURE-X-USD-01/);assert.match(evidence,/1 October 2026/);
 assert.doesNotMatch(evidence,/<pre|<details|<h3|Progressively disclosed|conditional 39/);
 assert.equal(buildArc2Audit(run,{...context,step:5}).policyResult.status,'MATCH_REQUIRES_AUTHORISED_HANDLING');
 assert.equal(buildArc2Audit(run,{...context,step:5}).policyResult.executed,false);
});

test('three findings advance directly to incomplete reviews without an extra synthesis', async()=>{
 const {arc2SceneStep,arc2FindingStage}=await import('../src/central-bank-theatre.mjs');
 const ids=CUES[4].steps;const start=ids.indexOf('right-restriction');
 assert.deepEqual(ids.slice(start,start+5),['right-restriction','right-correction','right-basis','incomplete-reviews','sdlc']);
 let state={...checked,step:start};
 const stages=[];
 for(const nextId of ['right-correction','right-basis','incomplete-reviews']){
  const old=state;stages.push(renderArc2(arc2SceneStep(state.step),arc2FindingStage(state.step)));
  state=transition(state,'next');assert.equal(currentReveal(state),nextId);assert.deepEqual(transition(state,'previous'),old);
 }
 assert.match(stages[0],/AI #1 · INITIAL ASSESSMENT/);assert.match(stages[0],/RIGHT RESTRICTION.*WRONG REASON/s);
 assert.match(stages[1],/AI #2 · HUMAN-REQUESTED SOURCE CHECK/);assert.match(stages[1],/RIGHT CORRECTION.*WRONG TO CLEAR/s);
 assert.match(stages[1],/CLEARANCE WOULD BE AN ERRONEOUS INFERENCE/);assert.match(stages[1],/AI #2 DID NOT AUTHORISE OR EXECUTE IT/);
 assert.match(stages[2],/INDEPENDENT POLICY CHECK/);assert.match(stages[2],/RIGHT RESTRICTION.*RIGHT BASIS/s);
 assert.doesNotMatch(stages.join(''),/THREE CHECKS|TWO INCOMPLETE ANSWERS|WHY DID DISCOVERING/);
 const evidence=renderArc2Evidence(run,{...context,step:6,findingStage:3});assert.equal((evidence.match(/<dt>/g)||[]).length,3);
 assert.equal(buildArc2Audit(run,{...context,step:6}).policyResult.executed,false);
});
