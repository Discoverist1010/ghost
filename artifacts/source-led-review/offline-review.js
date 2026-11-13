async(page) => {
 const b=await page.context().browser().browserType().launch({headless:true,channel:'chrome',args:['--screen-info={1920x1080}','--window-size=1920,1080']});
 const check=(x,m)=>{if(!x)throw Error(m)};
 try {
  const c=await b.newContext({viewport:null});await c.setOffline(true);
  const p=await c.newPage(),errors=[],network=[],visited=[],drawers=[],downloads=[];
  p.on('pageerror',e=>errors.push(String(e)));p.on('request',r=>{if(/^https?:/.test(r.url()))network.push(r.url());});
  await p.emulateMedia({reducedMotion:'reduce'});
  await p.goto('file:///Users/macbookpro18/Desktop/CODE/active/ghost/dist/demo.html');
  const d=await c.newCDPSession(p),w=await d.send('Browser.getWindowForTarget');await d.send('Browser.setWindowBounds',{windowId:w.windowId,bounds:{windowState:'fullscreen'}});await p.keyboard.press('f');
  const brand=/\bghost\b|GHOST-|REGULATOR\s*\/\//i;
  const disclosure='Public-source research. All demonstration scenarios are synthetic and illustrative.';
  for(let i=0;i<85;i++) {
   const reveal=await p.locator('#stage').getAttribute('data-reveal');visited.push(reveal);
   const body=await p.locator('body').innerText();check(!brand.test(body),'Audience brand on '+reveal);
   check(body.includes(disclosure)===(reveal==='opening-question'),'Disclosure repeated or missing on '+reveal);
   const box=await p.locator('.app-shell').boundingBox();check(Math.abs(box.width/box.height-16/9)<.001,'Aspect ratio changed');
   if(reveal==='system-changed')await p.screenshot({path:'/Users/macbookpro18/Desktop/CODE/active/ghost/artifacts/source-led-review/system-changed-1920x1080.png'});
   await p.keyboard.press('e');
   if(await p.locator('#drawer').isVisible()) {
    const title=await p.locator('#drawerTitle').innerText(),text=await p.locator('#drawerBody').innerText();
    check(!brand.test(title+' '+text),'Brand in evidence on '+reveal);drawers.push(reveal);
    if(reveal==='causal-explanation'||reveal==='nav-reconstruction') {
     const promise=p.waitForEvent('download');
     await p.locator(reveal==='causal-explanation'?'[data-action="download-arc2"]':'[data-action="download-nav"]').click();
     const download=await promise;check(!brand.test(download.suggestedFilename()),'Branded download filename');
     await download.saveAs('/Users/macbookpro18/Desktop/CODE/active/ghost/artifacts/source-led-review/'+download.suggestedFilename());downloads.push(download.suggestedFilename());
    }
    if(['cognitive-limits','attention-dependency'].includes(reveal))check(text.includes('§7.2')&&text.includes('§8.1'),'HKMA oversight missing');
    if(reveal==='sdlc')check(text.includes('Intent-anchored accountability')&&text.includes('not evidence that the fictional institution assigned'),'HKMA harness missing');
    if(reveal==='system-changed')check(text.includes('Project Agenti')&&text.includes('Neither BIS project'),'BIS scope missing');
    const reviewShots={'cognitive-limits':['HKMA · Agentic A.I. Governance discussion paper · November 2026','hkma-oversight-evidence-1920x1080.png'],'sdlc':['Practical application to the missing business rule','hkma-requirements-evidence-1920x1080.png'],'system-changed':['BIS · Project Logos · project page updated 4 June 2026','bis-evidence-1920x1080.png']};
    if(reviewShots[reveal]){const [heading,file]=reviewShots[reveal];await p.locator('#drawerBody').getByRole('heading',{name:heading,exact:true}).scrollIntoViewIfNeeded();await p.screenshot({path:'/Users/macbookpro18/Desktop/CODE/active/ghost/artifacts/source-led-review/'+file});}
    if(reveal==='nav-grounding')await p.screenshot({path:'/Users/macbookpro18/Desktop/CODE/active/ghost/artifacts/source-led-review/evidence-offline.png'});
    await p.keyboard.press('Escape');
   }
   if(reveal==='final-question') {
    await p.screenshot({path:'/Users/macbookpro18/Desktop/CODE/active/ghost/artifacts/source-led-review/final-offline.png'});
    check(await p.locator('#nextButton').isDisabled(),'Final Next enabled');await p.keyboard.press('ArrowRight');check(await p.locator('#stage').getAttribute('data-reveal')===reveal,'Final advanced');
    await p.keyboard.press('ArrowLeft');check(await p.locator('#stage').getAttribute('data-reveal')==='due-diligence','Final Back failed');await p.keyboard.press('ArrowRight');await p.locator('#replayButton').click();check(await p.locator('#stage').getAttribute('data-reveal')==='final-question','Replay moved final');
    await p.keyboard.press('Home');check(await p.locator('#stage').getAttribute('data-reveal')==='opening-question','Home failed');
    check(!network.length,'Offline application attempted network assets');check(!errors.length,'Browser errors');
    return{fileUrl:p.url(),offline:true,viewport:await p.evaluate(()=>[innerWidth,innerHeight]),visited,drawersChecked:drawers.length,downloadNames:downloads,aspectRatio:'16:9',openingDisclosureOnly:true,audienceBrandAbsent:true,finalStable:true,backNextReplayHome:true,httpRequests:network,browserErrors:errors};
   }
   if(reveal==='causal-explanation')await p.locator('[data-action="check-source"]').click();
   else if(reveal==='policy-question')await p.locator('[data-action="check-policy"]').click();
   else await p.keyboard.press('ArrowRight');
  }
  throw Error('Offline final question not reached');
 }finally{await b.close();}
}
