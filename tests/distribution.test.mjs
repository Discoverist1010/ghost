import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {buildStandalone} from '../scripts/build-standalone.mjs';
import {audienceText,audienceEvidence} from '../src/audience.mjs';
import {buildRun} from '../src/scenario.mjs';
import {buildNavScenario} from '../src/nav-scenario.mjs';

const brand=/\bghost\b|\bGHOST-|REGULATOR\s*\/\//i;
test('public exports have consistent neutral identities without mutating the source evidence',()=>{
 const run=buildRun(),nav=buildNavScenario(),before=structuredClone({run,nav});
 const publicRun=audienceEvidence(run),publicNav=audienceEvidence(nav);
 assert.doesNotMatch(JSON.stringify({publicRun,publicNav}),brand);
 assert.deepEqual({run,nav},before);
 assert.equal(publicRun.id,'DEMO-MAIN-001');assert.equal(publicNav.id,'DEMO-NAV-001');
 assert.equal(publicNav.fund.name,'Demonstration Fund');
 assert.equal(publicRun.events.length,486);assert.equal(publicRun.gateInput.score,76);assert.equal(publicRun.prediction.percent,74);
 assert.equal(publicNav.summary.fridayNavPerUnit,nav.summary.fridayNavPerUnit);
 assert.equal(publicNav.days[1].warning.priority,35);
 assert.deepEqual(publicNav.days.map(d=>d.publication),nav.days.map(d=>d.publication));
 assert.equal(audienceText('GHOST-MAIN-001 / GHOST-NAV-001'),'DEMO-MAIN-001 / DEMO-NAV-001');
 const value={id:'GHOST-X',parentIds:['GHOST-X'],source:'Ghost Demonstration Fund',score:39};
 assert.equal(audienceEvidence(value).id,audienceEvidence(value).parentIds[0]);
 assert.deepEqual(audienceEvidence(value),{id:'DEMO-X',parentIds:['DEMO-X'],source:'Demonstration Fund',score:39});
});
test('opening has one disclosure, no brand or presentation-title banners, and retains the first question',async()=>{
 const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
 assert.doesNotMatch(html,brand);
 assert.doesNotMatch(html,/class="(?:opening-brand|opening-session|stage-identity)"/);
 assert.equal((html.match(/Public-source research\. All demonstration scenarios are synthetic and illustrative\./g)||[]).length,1);
 const source=await readFile(new URL('../src/theatre.mjs',import.meta.url),'utf8');
 assert.match(source,/WHEN AI STARTS ACTING/);assert.match(source,/WHO IS THE SUPERVISOR/);
 const css=await readFile(new URL('../styles.css',import.meta.url),'utf8');
 assert.match(css,/\.opening-disclosure\s*\{[^}]*display:none/);
 assert.match(css,/\.is-opening \.opening-disclosure\s*\{[^}]*display:block/);
});
test('standalone build is reproducible and embeds all runtime modules and styles without external assets',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'demo-standalone-'));
 try {
  const first=await buildStandalone(join(directory,'first.html')),second=await buildStandalone(join(directory,'second.html'));
  const html=await readFile(first.file,'utf8');assert.equal(html,await readFile(second.file,'utf8'));
  assert.equal(html,await readFile(new URL('../dist/demo.html',import.meta.url),'utf8'),'Rebuild dist/demo.html after source changes');
  assert.ok(first.modules>=12);assert.ok(first.bytes>100000);
  assert.match(html,/<style>/);assert.match(html,/<script>/);
  assert.doesNotMatch(html,/<script[^>]+src=|<link[^>]+rel=["']stylesheet|<script[^>]+type=["']module/i);
  assert.doesNotMatch(html,/\bfetch\s*\(|new WebSocket|new EventSource/);
  assert.equal((html.match(/Public-source research\. All demonstration scenarios are synthetic and illustrative\./g)||[]).length,1);
  assert.match(html,/aspect-ratio: 16 \/ 9/);
  assert.match(html,/https:\/\/www\.bis\.org\/project\/logos/);
  assert.match(html,/https:\/\/www\.mas\.gov\.sg/);
 }finally{await rm(directory,{recursive:true,force:true});}
});
