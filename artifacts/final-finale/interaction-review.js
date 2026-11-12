async(page) => {
 const b=await page.context().browser().browserType().launch({headless:true,channel:'chrome',args:['--screen-info={1920x1080}','--window-size=1920,1080']});
 const check=(x,m)=>{if(!x)throw Error(m)};
 try {
  const c=await b.newContext({viewport:null}),p=await c.newPage();await p.goto('http://127.0.0.1:4173/');
  const d=await c.newCDPSession(p),w=await d.send('Browser.getWindowForTarget');await d.send('Browser.setWindowBounds',{windowId:w.windowId,bounds:{windowState:'fullscreen'}});await p.keyboard.press('f');
  const reveal=()=>p.locator('#stage').getAttribute('data-reveal');
  for(let i=0;i<80&&await reveal()!=='supervision-informs';i++){
   const r=await reveal();if(r==='causal-explanation')await p.locator('[data-action="check-source"]').click();else if(r==='policy-question')await p.locator('[data-action="check-policy"]').click();else await p.keyboard.press('ArrowRight');
  }
  check(await reveal()==='supervision-informs','Evolution not reached');
  check(await p.locator('[data-arrangement]').count()===1,'First reveal contains later arrangements');
  await p.locator('#replayButton').click();await p.waitForTimeout(90);await p.locator('#pauseButton').click();await p.waitForTimeout(50);
  const times=()=>p.locator('#stage').evaluate(e=>e.getAnimations({subtree:true}).map(a=>a.currentTime));
  const before=await times();await p.waitForTimeout(180);check(JSON.stringify(await times())===JSON.stringify(before),'Pause did not freeze motion');
  await p.locator('#playButton').click();await p.waitForTimeout(90);check(JSON.stringify(await times())!==JSON.stringify(before),'Play did not resume motion');
  await p.locator('#replayButton').click();check(Math.max(...await times())<250,'Replay did not reset');
  await p.keyboard.press('ArrowRight');check(await p.locator('[data-arrangement]').count()===2,'Second reveal does not add arrangement');
  await p.keyboard.press('ArrowRight');check(await p.locator('[data-arrangement]').count()===3,'Third reveal missing arrangement');
  await p.keyboard.press('ArrowLeft');check(await p.locator('[data-arrangement]').count()===2,'Back inconsistent');await p.keyboard.press('ArrowRight');
  await p.keyboard.press('e');check(await p.locator('#drawerBody').innerText().then(s=>s.includes('institutions retain accountability')),'Evidence not available');await p.keyboard.press('Escape');
  await p.keyboard.press('ArrowRight');await p.keyboard.press('ArrowRight');await p.keyboard.press('ArrowRight');
  check(await reveal()==='due-diligence','Recap not reached');check(await p.locator('[data-recap-row]').count()===5,'Recap not five rows');
  await p.keyboard.press('ArrowRight');check(await reveal()==='final-question','Recap does not lead directly to final');
  await p.waitForTimeout(1000);check(await reveal()==='final-question','Final auto-advanced');check(await p.locator('#nextButton').isDisabled(),'Next is not disabled');
  check(!await p.locator('.narrative-indicator').isVisible(),'Final contains narrative header');
  await p.keyboard.press('ArrowLeft');check(await reveal()==='due-diligence','Final Back failed');await p.keyboard.press('ArrowRight');await p.locator('#replayButton').click();check(await reveal()==='final-question','Final Replay failed');
  await p.keyboard.press('Home');check(await reveal()==='opening-question','Home reset failed');
  const fullscreen=await p.evaluate(()=>Boolean(document.fullscreenElement));await p.keyboard.press('f');await p.waitForTimeout(100);const exited=await p.evaluate(()=>!document.fullscreenElement);
  return{pauseFrozen:true,playResumed:true,replay:true,evolutionCounts:[1,2,3],back:true,evidence:true,recapRows:5,recapDirectToFinal:true,finalStable:true,nextDisabled:true,finalHeaderHidden:true,homeReset:true,fullscreen,exited};
 }finally{await b.close();}
}
