import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {renderStageReference,renderHkmaOversightEvidence,renderHkmaSystemicEvidence} from '../src/source-notes.mjs';
import {renderArc2} from '../src/central-bank-theatre.mjs';
import {renderNav} from '../src/nav-theatre.mjs';
import {renderSystemic,renderSystemicEvidence} from '../src/systemic-theatre.mjs';
import {renderFinale,FINALE_REVEALS} from '../src/finale.mjs';
import {CUES} from '../src/presentation.mjs';

test('three exact HKMA anchors are confined to the specified reference screens',async()=>{
 const source=await readFile(new URL('../src/theatre.mjs',import.meta.url),'utf8');
 assert.ok(source.includes("renderStageReference('HKMA 2026 DISCUSSION', 'Formal approval is ineffective without the capacity and opportunity for meaningful challenge.')"));
 assert.match(renderArc2(8),/HKMA 2026 DISCUSSION:.*Connect approved business intent to accountable ownership and enforceable controls\./s);
 assert.match(renderArc2(8),/REQUIREMENTS.*IMPLEMENTATION.*TESTING.*DOMAIN VALIDATION.*THE CODE PASSED.*THE BUSINESS RULE WAS INCOMPLETE/s);
 const pressure=renderSystemic(8);
 assert.match(pressure,/POSSIBLE UNDER CONSTRAINED CONDITIONS\. NOT INEVITABLE\..*HKMA 2026 DISCUSSION:.*Correlated machine-speed responses may amplify feedback loops and procyclical behaviour\./s);
 for(let i=0;i<8;i++)assert.doesNotMatch(renderSystemic(i),/HKMA 2026 DISCUSSION/);
});

test('reference labels, findings and spacing use one shared style without adding finale citations',async()=>{
 assert.equal(renderStageReference('SOURCE','Finding.'),'<p class="stage-reference"><strong>SOURCE:</strong> Finding.</p>');
 assert.equal(renderStageReference('A & B','<test>'),'<p class="stage-reference"><strong>A &amp; B:</strong> &lt;test&gt;</p>');
 const css=await readFile(new URL('../styles.css',import.meta.url),'utf8');
 assert.match(css,/\.stage \.stage-reference\s*\{[^}]*font-size:28px;[^}]*line-height:1.4;[^}]*color:var\(--secondary\)/);
 assert.match(css,/\.stage \.stage-reference strong\s*\{[^}]*color:var\(--cyan\)/);
 assert.match(css,/\.stage-references\s*\{[^}]*gap:14px/);
 for(const [html,count]of [[renderArc2(8),1],[renderArc2(11),2],[renderArc2(12),2],[renderNav(5),4],[renderSystemic(8),1],[renderSystemic(9),2]])assert.equal((html.match(/class="stage-reference"/g)||[]).length,count);
 for(let i=0;i<FINALE_REVEALS.length;i++)assert.doesNotMatch(renderFinale(i),/stage-reference|HKMA 2026 DISCUSSION/);
 assert.deepEqual(CUES.map(c=>c.steps.length),[6,6,1,1,14,7,9,7]);
});

test('research summaries precede the systemic audit and retain all technical evidence',()=>{
 const html=renderSystemicEvidence(9);
 assert.ok(html.indexOf('BIS · Project Logos')<html.indexOf('Reconstructable market transition'));
 assert.ok(html.indexOf('BIS · Project Agenti')<html.indexOf('<pre>'));
 assert.ok(html.indexOf('HKMA · Agentic A.I. Governance discussion paper')<html.indexOf('<pre>'));
 for(const term of ['Ongoing research','Neither BIS project validates this exact scenario','not binding Federal Reserve policy','&quot;shock&quot;','&quot;afterFirst&quot;'])assert.ok(html.includes(term),term);
 const source=renderHkmaSystemicEvidence();assert.match(source,/§4.5/);assert.match(source,/Section 2.3 creates no new obligations/);
 const oversight=renderHkmaOversightEvidence();assert.match(oversight,/Exploratory discussion proposals/);assert.match(oversight,/not binding supervisory guidance/);
});
