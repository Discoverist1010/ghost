async(page) => { const checkFlow=async(page,url,offline) => {
 const b=await page.context().browser().browserType().launch({headless:true,channel:'chrome',args:['--screen-info={1920x1080}','--window-size=1920,1080']});
 const check=(value,message)=>{if(!value)throw Error(message)};
 try {
  const c=await b.newContext({viewport:null});await c.setOffline(offline);
  const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));
  await p.goto(url);
  const reveal=()=>p.locator('#stage').getAttribute('data-reveal');
  await p.locator('#playButton').click();await p.waitForTimeout(700);check(await reveal()==='answers-to-actions','Animation completion advanced narrative');
  await p.keyboard.press('Home');for(let i=0;i<8;i++)await p.keyboard.press('ArrowRight');check(await reveal()==='event-flood','Flood not reached');
  await p.waitForTimeout(250);await p.locator('#pauseButton').click();
  const frozen=await p.locator('#floodLines').evaluate(e=>e.children.length);await p.waitForTimeout(250);check(await p.locator('#floodLines').evaluate(e=>e.children.length)===frozen,'Pause did not hold telemetry');
  await p.locator('#playButton').click();await p.waitForTimeout(250);check(await p.locator('#floodLines').evaluate(e=>e.children.length)>frozen,'Play did not resume');
  await p.keyboard.press('p');check(await p.locator('#stage').evaluate(e=>e.classList.contains('is-paused')),'P did not pause');await p.keyboard.press('p');
  const beforeResize=await reveal();await p.setViewportSize({width:1280,height:800});await p.waitForTimeout(80);check(await reveal()===beforeResize,'Resize changed reveal');
  await p.setViewportSize({width:1920,height:1080});
  const other=await c.newPage();await p.bringToFront();check(await reveal()===beforeResize,'Tab switch changed reveal');await other.close();
  await p.keyboard.press('r');check(await reveal()===beforeResize,'R changed reveal');
  const beforeFullscreen=await reveal();await p.keyboard.press('f');await p.waitForFunction(()=>!!document.fullscreenElement);check(await reveal()===beforeFullscreen,'Fullscreen changed reveal');await p.keyboard.press('f');await p.waitForFunction(()=>!document.fullscreenElement);check(await reveal()===beforeFullscreen,'Fullscreen exit changed reveal');
  const checks=[];
  for(let i=0;i<60;i++){
   const r=await reveal();
   if(r==='causal-explanation'||r==='policy-question'){
    await p.evaluate(()=>document.activeElement?.blur());await p.keyboard.press('Space');check(await reveal()===r,'Space bypassed deliberate check');
    await p.locator(r==='causal-explanation'?'[data-action="check-source"]':'[data-action="check-policy"]').click();checks.push(r);continue;
   }
   if(r==='final-question')break;
   await p.keyboard.press('ArrowRight');
  }
  check(checks.length===2,'Both human gates not tested');await p.waitForTimeout(1700);check(await reveal()==='final-question','Final auto-advanced');
  await p.keyboard.press('ArrowLeft');check(await reveal()==='due-diligence','Left failed');await p.keyboard.press('ArrowRight');await p.locator('#replayButton').click();check(await reveal()==='final-question','Replay failed');
  await p.keyboard.press('Home');for(let i=0;i<6;i++)await p.keyboard.press('ArrowRight');await p.keyboard.press('e');
  check(await p.locator('#drawer').isVisible(),'E failed');await p.getByRole('button',{name:'Reset presentation',exact:true}).click();check(await reveal()==='opening-question','Reset button failed');
  check(errors.length===0,'Browser errors');return{browser:await b.version(),offline,normalMotion:true,pausePlay:true,pShortcut:true,replayShortcut:true,spaceCannotBypassHumanChecks:true,fullscreenEnterExit:true,resizeAndTabSwitchStable:true,animationCompletionDoesNotAdvance:true,finalHolds:true,backNextReplay:true,evidenceResetButton:true,browserErrors:errors};
 }finally{await b.close();}
}; const [main,standalone]=await Promise.all([checkFlow(page,'http://127.0.0.1:4173/',false),checkFlow(page,'file:///Users/macbookpro18/Desktop/CODE/active/ghost/dist/demo.html',true)]); return {main,standalone}; }
