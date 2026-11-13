import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {renderHkmaOversightEvidence,renderHkmaHarnessEvidence,renderBisResearchEvidence} from '../src/source-notes.mjs';
import {renderSystemic,renderSystemicEvidence} from '../src/systemic-theatre.mjs';
import {renderArc2Evidence} from '../src/central-bank-theatre.mjs';
import {buildRun} from '../src/scenario.mjs';
import {CUES} from '../src/presentation.mjs';

test('HKMA oversight notes attribute the two findings to exploratory proposals',async()=>{
 const html=renderHkmaOversightEvidence();
 assert.match(html,/§7.2.*Formal approval alone.*information, review capacity or time/s);
 assert.match(html,/§8.1.*read-only.*critical operation depends on its accuracy/s);
 assert.match(html,/not binding supervisory guidance/);
 assert.match(html,/Section 2.3.*creates no new obligations/);
 assert.match(html,/href="https:\/\/www.hkma.gov.hk\/media\/eng\/doc\/key-information\/press-release\/2026\/20261102e3a1.pdf"/);
 const theatre=await readFile(new URL('../src/theatre.mjs',import.meta.url),'utf8');
 assert.match(theatre,/\['operations','supervision'\].*renderHkmaOversightEvidence\(\)/);
});

test('requirements evidence adds proposed safeguards at the existing design reveal without inventing approvals',()=>{
 const run=buildRun();const before=structuredClone(run);
 const html=renderArc2Evidence(run,{step:8});
 assert.match(html,/Intent-anchored accountability and risk-integrated agent harness/);
 assert.match(html,/business ownership.*technically enforced boundaries, independent control challenge and lifecycle testing/s);
 assert.match(html,/not evidence that the fictional institution assigned these owners or obtained these approvals/);
 for(const finding of ['domain acceptance tests','end-to-end negative tests','complete-workflow testing','material-change tests','not a demonstrated coding defect'])assert.ok(html.includes(finding));
 assert.deepEqual(run,before);
 assert.equal(renderHkmaHarnessEvidence().includes('not binding supervisory guidance'),true);
 for(const step of [0,1,2,3,4,5,6,7])assert.doesNotMatch(renderArc2Evidence(run,{step}),/Intent-anchored accountability/);
});

test('BIS references appear together only at the existing research reveal and retain separate scopes',()=>{
 const html=renderSystemic(9);
 assert.match(html,/NO AGENT FAILED\./);assert.match(html,/THE SYSTEM CHANGED\./);
 assert.match(html,/<strong>BIS PROJECT LOGOS:<\/strong> CORRELATED PORTFOLIO DECISIONS/);
 assert.match(html,/<strong>BIS PROJECT AGENTI:<\/strong> PAYMENTS &amp; INTRADAY LIQUIDITY/);
 for(let i=0;i<9;i++){
  assert.doesNotMatch(renderSystemic(i),/PROJECT AGENTI/);
  assert.doesNotMatch(renderSystemicEvidence(i),/Project Agenti/);
 }
 const evidence=renderSystemicEvidence(9);
 assert.match(evidence,/rules-based and LLM portfolio managers/);
 assert.match(evidence,/RTGS-like.*payment timing, intraday liquidity, possible delays, gridlock/s);
 assert.match(evidence,/Ongoing research/);
 assert.match(evidence,/Neither BIS project validates this exact scenario/);
 assert.match(renderBisResearchEvidence(),/https:\/\/www.bis.org\/node\/87745/);
});

test('source additions preserve state counts and keep SAGE out of audience views',async()=>{
 assert.deepEqual(CUES.map(c=>c.steps.length),[6,6,1,1,14,7,9,7]);
 for(const html of [renderHkmaOversightEvidence(),renderHkmaHarnessEvidence(),renderBisResearchEvidence(),renderSystemic(9)])assert.doesNotMatch(html,/SAGE|\bghost\b|REGULATOR\/\//i);
 const sources=await readFile(new URL('../PUBLIC_SOURCES.md',import.meta.url),'utf8');
 assert.match(sources,/Project SAGE.*launch announcement/);
 assert.match(sources,/not proof of a deployed universal cross-firm identity standard/);
});
