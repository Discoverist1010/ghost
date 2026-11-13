async (page) => {
 const sizes=[[1920,1080],[1600,900]];
 const results=[];
 for(const [width,height] of sizes) {
  const browser=await page.context().browser().browserType().launch({headless:true,channel:'chrome',args:[`--screen-info={${width}x${height}}`,`--window-size=${width},${height}`]});
  try {
   for(const mode of ['windowed','fullscreen']) {
    const context=await browser.newContext({viewport:null});await context.setOffline(true);
    const p=await context.newPage(),errors=[],requests=[],visited=[],issues=[],captures=[];
    p.on('pageerror',e=>errors.push(String(e)));p.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});
    await p.emulateMedia({reducedMotion:'reduce'});
    await p.goto('file:///Users/macbookpro18/Desktop/CODE/active/ghost/dist/demo.html');
    if(mode==='fullscreen'){
     const session=await context.newCDPSession(p),win=await session.send('Browser.getWindowForTarget');
     await session.send('Browser.setWindowBounds',{windowId:win.windowId,bounds:{windowState:'fullscreen'}});
     await p.keyboard.press('f');
     await p.waitForFunction(()=>innerWidth===screen.width&&innerHeight===screen.height);
    }
    let drawerCount=0,blockedChecks=0,externalLinks=0;
    const viewport=await p.evaluate(()=>({width:innerWidth,height:innerHeight,fullscreen:!!document.fullscreenElement,screen:[screen.width,screen.height]}));
    for(let i=0;i<51;i++) {
     const reveal=await p.locator('#stage').getAttribute('data-reveal');visited.push(reveal);
     const geom=await p.evaluate(()=>{
      const frame=document.querySelector('.app-shell'),s=frame.getBoundingClientRect(),scale=s.width/1920,bad=[];
      for(const e of document.querySelectorAll('#stage h1,#stage h2,#stage p,#stage button,#stage th,#stage td,.presenter-control,.context-button,.narrative-indicator,.opening-disclosure')){
       const st=getComputedStyle(e);if(st.display==='none'||st.visibility==='hidden')continue;const r=e.getBoundingClientRect();if(!r.width||!r.height)continue;
       if(r.left<s.left-1||r.right>s.right+1||r.top<s.top-1||r.bottom>s.bottom+1)bad.push({text:e.textContent.slice(0,75),bounds:[r.x,r.y,r.width,r.height]});
      }
      return {stage:[s.x,s.y,s.width,s.height],scale,reference:[frame.offsetWidth,frame.offsetHeight],noScroll:document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight,inside:s.left>=-.1&&s.top>=-.1&&s.right<=innerWidth+.1&&s.bottom<=innerHeight+.1,bad};
     });
     if(Math.abs(geom.stage[2]/geom.stage[3]-16/9)>.0001||geom.reference[0]!==1920||geom.reference[1]!==1080||!geom.noScroll||!geom.inside||geom.bad.length)issues.push({reveal,...geom});
     if(['opening-question','nav-adaptation','system-changed','due-diligence','final-question'].includes(reveal)){
      const name=`chrome-${width}x${height}-${mode}-${reveal}.png`;
      await p.screenshot({path:'/Users/macbookpro18/Desktop/CODE/active/ghost/artifacts/conference-readiness/'+name});captures.push(name);
     }
     await p.keyboard.press('e');
     if(await p.locator('#drawer').isVisible()){
      drawerCount++;
      const checked=await p.locator('#drawerBody a[href^="http"]').evaluateAll(es=>es.map(e=>({title:e.title,label:e.getAttribute('aria-label')})));
      externalLinks+=checked.length;
      if(checked.some(e=>!e.title.includes('internet required')||!e.label.includes('external source')))issues.push({reveal,error:'External reference not distinguished'});
      const dialog=await p.locator('.drawer').boundingBox();if(dialog.x<-.5||dialog.y<-.5||dialog.x+dialog.width>viewport.width+.5||dialog.y+dialog.height>viewport.height+.5)issues.push({reveal,error:'Drawer outside viewport',dialog});
      if(reveal==='sdlc'&&width===1280){await p.locator('#drawerBody').getByRole('heading',{name:'Practical application to the missing business rule'}).scrollIntoViewIfNeeded();await p.screenshot({path:`/Users/macbookpro18/Desktop/CODE/active/ghost/artifacts/conference-readiness/chrome-${width}x${height}-${mode}-evidence.png`});}
      // Exercise the close button as well as Escape, without following external links.
      if(i%2)await p.locator('[data-action="close-drawer"]').click();else await p.keyboard.press('Escape');
     }
     if(reveal==='final-question'){
      await p.keyboard.press('ArrowRight');if(await p.locator('#stage').getAttribute('data-reveal')!==reveal||!await p.locator('#nextButton').isDisabled())issues.push({error:'Final did not hold'});
      await p.locator('#previousButton').click();if(await p.locator('#stage').getAttribute('data-reveal')!=='due-diligence')issues.push({error:'Back failed'});
      await p.locator('#nextButton').click();await p.locator('#replayButton').click();if(await p.locator('#stage').getAttribute('data-reveal')!==reveal)issues.push({error:'Replay failed'});
      await p.keyboard.press('Home');if(await p.locator('#stage').getAttribute('data-reveal')!=='opening-question')issues.push({error:'Reset failed'});
      break;
     }
     if(reveal==='causal-explanation'||reveal==='policy-question'){
      await p.keyboard.press('ArrowRight');if(await p.locator('#stage').getAttribute('data-reveal')!==reveal)issues.push({reveal,error:'Human action bypassed'});else blockedChecks++;
      await p.locator(reveal==='causal-explanation'?'[data-action="check-source"]':'[data-action="check-policy"]').click();
     } else if(i%2)await p.locator('#nextButton').click();else await p.keyboard.press('ArrowRight');
    }
    results.push({browser:await browser.version(),display:[width,height],mode,viewport,states:visited.length,beats:8,drawers:drawerCount,humanGates:blockedChecks,externalLinks,issues,errors,httpRequests:requests,captures});
    await context.close();
   }
  }finally{await browser.close();}
 }
 return results;
}
