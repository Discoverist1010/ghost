async(page) => {
 const b=await page.context().browser().browserType().launch({headless:true,channel:'chrome'});
 try {
  const c=await b.newContext({viewport:{width:1920,height:1080}}),p=await c.newPage(),errors=[],screens=[];
  p.on('pageerror',e=>errors.push(String(e)));await p.emulateMedia({reducedMotion:'reduce'});await p.goto('http://127.0.0.1:4173/');
  const wanted=['cognitive-limits','sdlc','retrospective-question','system-assurance','nav-grounding','system-pressure','system-changed'];
  for(let i=0;i<51;i++){
   const id=await p.locator('#stage').getAttribute('data-reveal');
   if(wanted.includes(id)){
    await p.screenshot({path:'/Users/macbookpro18/Desktop/CODE/active/ghost/artifacts/reference-consistency/main-'+id+'-1920x1080.png'});
    const refs=await p.locator('.stage-reference').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect(),style=getComputedStyle(e);const forbidden=[...document.querySelectorAll('#stage h1,#stage h2,.arc2-design-punch,.presenter-control,.case-controls')];return {text:e.textContent,font:style.fontSize,lineHeight:style.lineHeight,color:style.color,labelColor:getComputedStyle(e.querySelector('strong')).color,bounds:[r.x,r.y,r.width,r.height],overlaps:forbidden.filter(f=>{const b=f.getBoundingClientRect();return Math.min(r.right,b.right)-Math.max(r.left,b.left)>1&&Math.min(r.bottom,b.bottom)-Math.max(r.top,b.top)>1}).map(f=>f.className||f.tagName)};}));
    screens.push({id,refs});
   }
   if(['cognitive-limits','sdlc','system-changed'].includes(id)){
    await p.keyboard.press('e');const html=await p.locator('#drawerBody').innerHTML();
    if(id==='cognitive-limits'&&html.indexOf('HKMA ·')>html.indexOf('Objective'))throw Error('HKMA source order');
    await p.screenshot({path:'/Users/macbookpro18/Desktop/CODE/active/ghost/artifacts/reference-consistency/main-'+id+'-drawer-1920x1080.png'});await p.keyboard.press('Escape');
   }
   if(id==='final-question')break;
   if(id==='causal-explanation')await p.locator('[data-action="check-source"]').click();else if(id==='policy-question')await p.locator('[data-action="check-policy"]').click();else await p.keyboard.press('ArrowRight');
  }
  return {screens,errors};
 }finally{await b.close();}
}
