async(page) => {
 const b=await page.context().browser().browserType().launch({headless:true,channel:'chrome',args:['--screen-info={1920x1080}']});
 const wanted=['cognitive-limits','sdlc','retrospective-question','system-assurance','nav-grounding','system-pressure','system-changed'];
 const check=(x,m)=>{if(!x)throw Error(m)};
 try {
  const dc=await b.newContext({viewport:{width:1920,height:1080}}),oc=await b.newContext({viewport:{width:1920,height:1080}});await oc.setOffline(true);
  const dev=await dc.newPage(),off=await oc.newPage(),errors=[],requests=[],states=[],drawers=[],screens=[];
  for(const p of [dev,off]){p.on('pageerror',e=>errors.push(String(e)));await p.emulateMedia({reducedMotion:'reduce'});}
  off.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});
  await dev.goto('http://127.0.0.1:4173/');await off.goto('file:///Users/macbookpro18/Desktop/CODE/active/ghost/dist/demo.html');
  const root='/Users/macbookpro18/Desktop/CODE/active/ghost/artifacts/reference-consistency/';
  for(let i=0;i<51;i++){
   const id=await dev.locator('#stage').getAttribute('data-reveal');check(await off.locator('#stage').getAttribute('data-reveal')===id,'Reveal mismatch');states.push(id);
   check(await dev.locator('#stage').innerHTML()===await off.locator('#stage').innerHTML(),'Stage mismatch: '+id);
   if(wanted.includes(id)){
    const metrics=[];
    for(const [name,p] of [['main',dev],['standalone',off]]){
     await p.screenshot({path:root+name+'-'+id+'-1920x1080.png'});
     metrics.push(await p.locator('.stage-reference').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {text:e.textContent,font:s.fontSize,lineHeight:s.lineHeight,color:s.color,labelColor:getComputedStyle(e.querySelector('strong')).color,x:r.x,y:r.y,width:r.width,height:r.height};})));
    }
    check(JSON.stringify(metrics[0])===JSON.stringify(metrics[1]),'Typography/layout mismatch: '+id);screens.push({id,references:metrics[0]});
   }
   for(const p of [dev,off])await p.keyboard.press('e');
   check(await dev.locator('#drawer').isVisible()===await off.locator('#drawer').isVisible(),'Drawer availability mismatch');
   if(await dev.locator('#drawer').isVisible()){
    const html=await dev.locator('#drawerBody').innerHTML();check(html===await off.locator('#drawerBody').innerHTML(),'Evidence mismatch: '+id);drawers.push(id);
    if(['cognitive-limits','sdlc','system-changed'].includes(id))for(const [name,p]of [['main',dev],['standalone',off]])await p.screenshot({path:root+name+'-'+id+'-drawer-1920x1080.png'});
    if(id==='cognitive-limits')check(html.indexOf('HKMA ·')<html.indexOf('settlement-work-evidence'),'HKMA buried below task inventory');
    if(id==='system-changed')check(html.indexOf('BIS · Project Agenti')<html.indexOf('<pre>'),'BIS buried below audit');
    if(id==='system-assurance')check(html.indexOf('System-level assurance')<html.indexOf('<pre'),'Assurance buried below audit');
    for(const p of [dev,off])await p.keyboard.press('Escape');
   }
   if(id==='final-question'){
    for(const p of [dev,off]){check(await p.locator('#nextButton').isDisabled(),'Final Next enabled');await p.keyboard.press('ArrowRight');check(await p.locator('#stage').getAttribute('data-reveal')==='final-question','Final advanced');await p.keyboard.press('ArrowLeft');check(await p.locator('#stage').getAttribute('data-reveal')==='due-diligence','Back failed');await p.keyboard.press('ArrowRight');await p.locator('#replayButton').click();check(await p.locator('#stage').getAttribute('data-reveal')==='final-question','Replay failed');await p.keyboard.press('Home');check(await p.locator('#stage').getAttribute('data-reveal')==='opening-question','Reset failed');}
    break;
   }
   for(const p of [dev,off]){
    if(id==='causal-explanation'||id==='policy-question'){await p.keyboard.press('ArrowRight');check(await p.locator('#stage').getAttribute('data-reveal')===id,'Explicit check bypassed');await p.locator(id==='causal-explanation'?'[data-action="check-source"]':'[data-action="check-policy"]').click();}
    else await p.keyboard.press('ArrowRight');
   }
  }
  return{browser:await b.version(),main:'http://127.0.0.1:4173/',standalone:'file:///Users/macbookpro18/Desktop/CODE/active/ghost/dist/demo.html',offline:true,viewport:[1920,1080],statesCompared:states.length,evidenceCompared:drawers.length,screens,errors,httpRequests:requests};
 }finally{await b.close();}
}
