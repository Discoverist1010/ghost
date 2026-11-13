async (page) => {
 const browser=await page.context().browser().browserType().launch({headless:true,channel:'chrome',args:['--screen-info={1280x800}','--window-size=1280,800']});
 try {
  const context=await browser.newContext({viewport:null});await context.setOffline(true);
  const p=await context.newPage();await p.emulateMedia({reducedMotion:'reduce'});
  await p.goto('file:///Users/macbookpro18/Desktop/CODE/active/ghost/dist/demo.html');
  const states=[];
  for(let i=0;i<51;i++) {
   const reveal=await p.locator('#stage').getAttribute('data-reveal');
   const result=await p.evaluate(()=>{
    const shell=document.querySelector('.app-shell').getBoundingClientRect(),bad=[];
    for(const e of document.querySelectorAll('#stage h1,#stage h2,#stage p,#stage button,#stage th,#stage td,.presenter-control,.context-button,.narrative-indicator,.opening-disclosure')){
     const style=getComputedStyle(e);if(style.display==='none'||style.visibility==='hidden')continue;const r=e.getBoundingClientRect();if(!r.width||!r.height)continue;
     if(r.left<shell.left-1||r.right>shell.right+1||r.top<shell.top-1||r.bottom>shell.bottom+1)bad.push({text:e.textContent.slice(0,90),box:{x:r.x,y:r.y,w:r.width,h:r.height}});
    }
    return {viewport:[innerWidth,innerHeight],shell:{x:shell.x,y:shell.y,w:shell.width,h:shell.height},bad};
   });
   if(result.bad.length||['nav-adaptation','due-diligence','system-changed'].includes(reveal))states.push({reveal,...result});
   if(reveal==='due-diligence')await p.screenshot({path:'/Users/macbookpro18/Desktop/CODE/active/ghost/artifacts/conference-readiness/after-1280x800-recap.png'});
   if(reveal==='final-question')break;
   if(reveal==='causal-explanation')await p.locator('[data-action="check-source"]').click();else if(reveal==='policy-question')await p.locator('[data-action="check-policy"]').click();else await p.keyboard.press('ArrowRight');
  }
  return states;
 }finally{await browser.close();}
}
