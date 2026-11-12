async(page) => {
 const browser=await page.context().browser().browserType().launch({headless:true,channel:'chrome',args:['--screen-info={1920x1080}','--window-size=1920,1080']});
 try {
  const context=await browser.newContext({viewport:null}),p=await context.newPage(),errors=[],visited=[],checks=[];
  p.on('pageerror',e=>errors.push(String(e)));
  await p.emulateMedia({reducedMotion:'reduce'});await p.goto('http://127.0.0.1:4173/');
  const cdp=await context.newCDPSession(p),w=await cdp.send('Browser.getWindowForTarget');
  await cdp.send('Browser.setWindowBounds',{windowId:w.windowId,bounds:{windowState:'fullscreen'}});await p.keyboard.press('f');
  const names={'supervision-informs':'01-evolution-first','supervision-structures':'01-evolution-second','supervision-enforces':'01-evolution','capability-authority':'02-capability','supervisory-dimensions':'03-dimensions','due-diligence':'04-recap','final-question':'05-final-question'};
  for(let i=0;i<85;i++) {
   const reveal=await p.locator('#stage').getAttribute('data-reveal');visited.push(reveal);
   if(names[reveal]) {
    await p.screenshot({path:'/Users/macbookpro18/Desktop/CODE/active/ghost/artifacts/final-finale/'+names[reveal]+'.png'});
    checks.push(await p.evaluate(()=>{
     const controls=document.querySelector('.presenter-control').getBoundingClientRect(),s=document.querySelector('#stage').getBoundingClientRect();
     return {reveal:document.querySelector('#stage').dataset.reveal,size:[innerWidth,innerHeight],overflow:document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight,clipped:[...document.querySelectorAll('#stage h1,#stage h2,#stage p,#stage th,#stage td,#stage strong')].filter(e=>e.checkVisibility()).filter(e=>{const r=e.getBoundingClientRect();return r.left<s.left||r.right>s.right||r.bottom>controls.top||r.top<s.top}).map(e=>e.innerText)};
    }));
   }
   if(reveal==='final-question') {
    await p.waitForTimeout(1100);await p.keyboard.press('ArrowRight');
    if(await p.locator('#stage').getAttribute('data-reveal')!==reveal)throw Error('Final question advanced');
    if(!await p.locator('#nextButton').isDisabled())throw Error('Final Next enabled');
    await p.keyboard.press('ArrowLeft');const back=await p.locator('#stage').getAttribute('data-reveal');
    if(back!=='due-diligence')throw Error('Back did not return to recap');
    await p.keyboard.press('ArrowRight');await p.locator('#replayButton').click();
    if(await p.locator('#stage').getAttribute('data-reveal')!=='final-question')throw Error('Replay moved final');
    return {visited,checks,finalStable:true,nextDisabled:true,back,replay:true,errors};
   }
   if(reveal==='causal-explanation')await p.locator('[data-action="check-source"]').click();
   else if(reveal==='policy-question')await p.locator('[data-action="check-policy"]').click();
   else await p.keyboard.press('ArrowRight');
  }
  throw Error('Final question not reached');
 } finally {await browser.close();}
}
