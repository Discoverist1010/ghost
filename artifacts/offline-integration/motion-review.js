async(page) => {
 const b=await page.context().browser().browserType().launch({headless:true,channel:'chrome',args:['--screen-info={1920x1080}','--window-size=1920,1080']});
 const check=(x,m)=>{if(!x)throw Error(m)};
 try {
  const c=await b.newContext({viewport:null});await c.setOffline(true);const p=await c.newPage(),network=[];p.on('request',r=>{if(/^https?:/.test(r.url()))network.push(r.url())});
  await p.goto('file:///Users/macbookpro18/Desktop/CODE/active/ghost/dist/demo.html');
  const d=await c.newCDPSession(p),w=await d.send('Browser.getWindowForTarget');await d.send('Browser.setWindowBounds',{windowId:w.windowId,bounds:{windowState:'fullscreen'}});await p.keyboard.press('f');
  const reveal=()=>p.locator('#stage').getAttribute('data-reveal');
  for(let i=0;i<80&&await reveal()!=='nav-week';i++) {const r=await reveal();if(r==='causal-explanation')await p.locator('[data-action="check-source"]').click();else if(r==='policy-question')await p.locator('[data-action="check-policy"]').click();else await p.keyboard.press('ArrowRight');}
  check(await reveal()==='nav-week','Week not reached');await p.locator('#replayButton').click();await p.waitForTimeout(120);await p.locator('#pauseButton').click();await p.waitForTimeout(50);
  const times=()=>p.locator('#stage').evaluate(e=>e.getAnimations({subtree:true}).map(a=>a.currentTime));const paused=await times();await p.waitForTimeout(200);check(JSON.stringify(paused)===JSON.stringify(await times()),'Pause failed offline');
  await p.locator('#playButton').click();await p.waitForTimeout(120);check(JSON.stringify(await times())!==JSON.stringify(paused),'Play failed offline');
  await p.locator('#replayButton').click();check(Math.max(...await times())<350,'Replay failed offline');
  await p.waitForTimeout(3000);check(await reveal()==='nav-week','Animation auto-advanced');
  await p.keyboard.press('Home');check(await reveal()==='opening-question','Reset failed');
  const fullscreen=await p.evaluate(()=>Boolean(document.fullscreenElement));await p.keyboard.press('f');await p.waitForTimeout(150);check(await p.evaluate(()=>!document.fullscreenElement),'Fullscreen exit failed');
  check(!network.length,'Unexpected HTTP request');return{fileUrl:p.url(),offline:true,normalMotion:true,pauseFrozen:true,playResumed:true,replayRestarted:true,noAutoAdvance:true,homeReset:true,fullscreen,fullscreenExit:true,httpRequests:network};
 } finally {await b.close();}
}
