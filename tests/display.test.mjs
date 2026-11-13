import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {presentationScale,installPresentationScale,DISPLAY_REFERENCE} from '../src/display.mjs';

test('all requested display sizes contain the complete fixed 16:9 composition',()=>{
 assert.deepEqual(DISPLAY_REFERENCE,{width:1920,height:1080});
 for(const [w,h] of [[1920,1080],[1600,900],[1366,768],[1920,1200],[1280,800],[1280,713]]){
  const scale=presentationScale(w,h);
  assert.ok(1920*scale<=w+.000001);assert.ok(1080*scale<=h+.000001);
  assert.ok(Math.abs((1920*scale)/(1080*scale)-16/9)<1e-12);
  assert.ok(Math.abs(1920*scale-w)<.000001||Math.abs(1080*scale-h)<.000001);
 }
 assert.equal(presentationScale(1920,1080),1);
 assert.equal(presentationScale(1920,1200),1);
});

test('resize updates only one scale variable and detaches cleanly without advancing state',()=>{
 const writes=[],listeners=new Map(),state={beat:5,reveal:'nav-adaptation'};
 const frame={style:{setProperty:(...args)=>writes.push(args)},dataset:state};
 const viewport={innerWidth:1920,innerHeight:1080,addEventListener:(n,f)=>listeners.set(n,f),removeEventListener:(n,f)=>{assert.equal(listeners.get(n),f);listeners.delete(n);}};
 const stop=installPresentationScale(frame,viewport);
 assert.deepEqual(writes,[['--presentation-scale','1']]);
 viewport.innerWidth=1280;viewport.innerHeight=800;listeners.get('resize')();
 assert.equal(Number(writes.at(-1)[1]),2/3);assert.deepEqual(frame.dataset,{beat:5,reveal:'nav-adaptation'});
 assert.ok(writes.every(([name])=>name==='--presentation-scale'));
 stop();assert.equal(listeners.size,0);
});

test('stage and drawer share one transformed frame with no downloadable font or essential asset',async()=>{
 const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
 const css=await readFile(new URL('../styles.css',import.meta.url),'utf8');
 assert.ok(html.indexOf('class="presentation-frame"')<html.indexOf('class="app-shell"'));
 assert.ok(html.indexOf('id="drawer"')<html.lastIndexOf('</div>'));
 assert.match(css,/\.presentation-frame\s*\{[^}]*width:1920px; height:1080px;[^}]*scale\(var\(--presentation-scale/s);
 assert.doesNotMatch(css,/@import|@font-face|url\(https?:/);
 const source=await readFile(new URL('../src/theatre.mjs',import.meta.url),'utf8');
 assert.match(source,/External source · internet required/);
});
