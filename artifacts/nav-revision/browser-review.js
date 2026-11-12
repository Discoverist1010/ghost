async(page) => {
 const browser=await page.context().browser().browserType().launch({headless:true,channel:'chrome',args:['--screen-info={1920x1080}','--window-size=1920,1080']});
 const check=(x,m)=>{if(!x)throw Error(m)};
 try {
  const context=await browser.newContext({viewport:null}),p=await context.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(String(e)));
  await p.goto('http://127.0.0.1:4173/');
  const cdp=await context.newCDPSession(p),w=await cdp.send('Browser.getWindowForTarget');
  await cdp.send('Browser.setWindowBounds',{windowId:w.windowId,bounds:{windowState:'fullscreen'}});await p.keyboard.press('f');
  const reveal=()=>p.locator('#stage').getAttribute('data-reveal');
  for(let i=0;i<80&&await reveal()!=='nav-adaptation';i++) {
   const r=await reveal();
   if(r==='causal-explanation')await p.locator('[data-action="check-source"]').click();
   else if(r==='policy-question')await p.locator('[data-action="check-policy"]').click();
   else await p.keyboard.press('ArrowRight');
  }
  check(await reveal()==='nav-adaptation','Adaptation missing');
  await p.locator('#replayButton').click();
  for(let i=0;i<4;i++){await p.screenshot({path:'/private/tmp/ghost-nav-motion/adapt-'+i+'.png'});await p.waitForTimeout(250);}
  await p.keyboard.press('ArrowRight');check(await reveal()==='nav-week','Week missing');
  await p.waitForTimeout(120);await p.locator('#pauseButton').click();await p.waitForTimeout(50);
  const times=()=>p.locator('#stage').evaluate(e=>e.getAnimations({subtree:true}).map(a=>a.currentTime));
  const before=await times();await p.waitForTimeout(220);const after=await times();
  check(JSON.stringify(before)===JSON.stringify(after),'Pause did not freeze animations');
  await p.locator('#playButton').click();await p.waitForTimeout(150);check(JSON.stringify(await times())!==JSON.stringify(after),'Play did not resume');
  await p.locator('#replayButton').click();
  const resetTimes=await times();check(Math.max(...resetTimes)<350,'Replay did not restart');
  for(let i=0;i<7;i++){await p.screenshot({path:'/private/tmp/ghost-nav-motion/week-'+i+'.png'});await p.waitForTimeout(450);}
  check(await reveal()==='nav-week','Animation auto-advanced');
  await p.keyboard.press('ArrowLeft');check(await reveal()==='nav-adaptation','Back failed');
  await p.keyboard.press('ArrowRight');check(await reveal()==='nav-week','Next failed');
  await p.keyboard.press('ArrowRight');check(await reveal()==='nav-reconstruction','Reconstruction order');
  await p.keyboard.press('e');const downloadPromise=p.waitForEvent('download');await p.locator('[data-action="download-nav"]').click();const download=await downloadPromise;await download.saveAs('/Users/macbookpro18/Desktop/CODE/active/ghost/artifacts/nav-revision/nav-audit.json');await p.keyboard.press('Escape');
  await p.keyboard.press('ArrowRight');check(await reveal()==='nav-baseline','Insight missing');
  check(!await p.locator('.nav-revised-insight').evaluate(e=>e.open),'Conclusion disclosed too soon');
  await p.keyboard.press('ArrowRight');check(await reveal()==='nav-baseline'&&await p.locator('.nav-revised-insight').evaluate(e=>e.open),'Next skipped same-scene consequence');
  await p.locator('#replayButton').click();check(!await p.locator('.nav-revised-insight').evaluate(e=>e.open),'Replay did not reset consequence');
  await p.keyboard.press('ArrowRight');await p.keyboard.press('ArrowRight');check(await reveal()==='nav-grounding','Insight did not continue');
  await p.keyboard.press('Home');check(await reveal()==='opening-question','Home failed');
  return {fullscreen:await p.evaluate(()=>[innerWidth,innerHeight]),pauseTimes:before,pauseFrozen:true,playResumed:true,replayReset:true,backNext:true,insightRequiresPresenterAction:true,completeAuditDownloaded:true,home:true,errors};
 } finally {await browser.close();}
}
