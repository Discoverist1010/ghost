async(page) => {
 const b=await page.context().browser().browserType().launch({headless:true,channel:'chrome',args:['--screen-info={1920x1080}','--window-size=1920,1080']});
 const check=(x,m)=>{if(!x)throw Error(m)};
 try {
  const devContext=await b.newContext({viewport:{width:1920,height:1080}}),offlineContext=await b.newContext({viewport:{width:1920,height:1080}});
  await offlineContext.setOffline(true);
  const dev=await devContext.newPage(),off=await offlineContext.newPage();
  await dev.emulateMedia({reducedMotion:'reduce'});await off.emulateMedia({reducedMotion:'reduce'});
  await dev.goto('http://127.0.0.1:4173/');await off.goto('file:///Users/macbookpro18/Desktop/CODE/active/ghost/dist/demo.html');
  const differences=[],drawers=[],states=[];
  const content=p=>p.locator('#stage').evaluate(e=>({reveal:e.dataset.reveal,html:e.innerHTML}));
  for(let i=0;i<51;i++){
   const a=await content(dev),z=await content(off);states.push(a.reveal);
   if(JSON.stringify(a)!==JSON.stringify(z))differences.push({state:a.reveal,kind:'stage'});
   for(const p of [dev,off])await p.keyboard.press('e');
   if(await dev.locator('#drawer').isVisible()){
    const d=await dev.locator('#drawerBody').innerHTML(),o=await off.locator('#drawerBody').innerHTML();
    if(d!==o)differences.push({state:a.reveal,kind:'evidence'});drawers.push(a.reveal);
    for(const p of [dev,off])await p.keyboard.press('Escape');
   }
   if(a.reveal==='final-question')break;
   for(const p of [dev,off]){
    if(a.reveal==='causal-explanation')await p.locator('[data-action="check-source"]').click();else if(a.reveal==='policy-question')await p.locator('[data-action="check-policy"]').click();else await p.keyboard.press('ArrowRight');
   }
  }
  check(differences.length===0,'Export differs from development: '+JSON.stringify(differences));
  return {stageComparisons:states.length,evidenceComparisons:drawers.length,differences,allEightBeats:true,offlineFile:'file:///Users/macbookpro18/Desktop/CODE/active/ghost/dist/demo.html',development:'http://127.0.0.1:4173/'};
 }finally{await b.close();}
}
