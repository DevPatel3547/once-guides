const ORIGIN='http://localhost:5173';
let queue=Promise.resolve();let lastCapture=0;
const read=async()=> (await chrome.storage.local.get('once')).once||{};
const write=state=>chrome.storage.local.set({once:state});
async function badge(text){await chrome.action.setBadgeText({text});await chrome.action.setBadgeBackgroundColor({color:'#146344'});}
async function stop(){const state=await read();state.recording=false;state.paused=false;await write(state);await badge('');return state;}
async function imageFor(message,tab){
 const active=await chrome.tabs.query({active:true,windowId:tab.windowId});if(active[0]?.id!==tab.id)return undefined;
 if(Date.now()-lastCapture<600)return undefined;lastCapture=Date.now();
 // A click commonly opens a menu or changes a React view. Use fresh masks
 // after that update, rather than requiring the pre-click DOM to survive.
 await new Promise(resolve=>setTimeout(resolve,120));
 const before=await chrome.tabs.sendMessage(tab.id,{type:'ONCE_SCREENSHOT_STATE'},{frameId:0});
 if(!validPage(before)||before.href!==message.href)return undefined;
 const selected=await chrome.tabs.query({active:true,windowId:tab.windowId});if(selected[0]?.id!==tab.id)return undefined;
 const data=await chrome.tabs.captureVisibleTab(tab.windowId,{format:'jpeg',quality:78});
 const afterPage=await chrome.tabs.sendMessage(tab.id,{type:'ONCE_SCREENSHOT_STATE'},{frameId:0});
 if(!stablePage(before,afterPage))return undefined;
 const after=await chrome.tabs.get(tab.id);const current=await chrome.tabs.query({active:true,windowId:tab.windowId});
 if(after.url!==message.href||current[0]?.id!==tab.id)return undefined;
 const bitmap=await createImageBitmap(await (await fetch(data)).blob());const scale=Math.min(1,1400/bitmap.width);const canvas=new OffscreenCanvas(Math.round(bitmap.width*scale),Math.round(bitmap.height*scale));const ctx=canvas.getContext('2d');ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
 const sx=canvas.width/before.width,sy=canvas.height/before.height;
 ctx.fillStyle='#17261d';for(const r of before.masks){ctx.fillRect(Math.floor(r.x*sx)-2,Math.floor(r.y*sy)-2,Math.ceil(r.w*sx)+4,Math.ceil(r.h*sy)+4);}
 // The old click coordinates can point at another control after a view change.
 if(stablePage(message,before)){ctx.beginPath();ctx.arc(message.x*sx,message.y*sy,15,0,Math.PI*2);ctx.strokeStyle='#fff';ctx.lineWidth=6;ctx.stroke();ctx.strokeStyle='#168451';ctx.lineWidth=3;ctx.stroke();}
 const blob=await canvas.convertToBlob({type:'image/jpeg',quality:.82});const bytes=new Uint8Array(await blob.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=16384)binary+=String.fromCharCode(...bytes.subarray(i,i+16384));return 'data:image/jpeg;base64,'+btoa(binary);
}
function validPage(p){return !!p&&!p.unsafeMasking&&Number.isFinite(p.revision)&&typeof p.href==='string'&&Number.isFinite(p.width)&&Number.isFinite(p.height)&&p.width>0&&p.height>0&&Array.isArray(p.masks)&&p.masks.length<=250&&p.masks.every(r=>r&&[r.x,r.y,r.w,r.h].every(Number.isFinite)&&r.w>=0&&r.h>=0);}
function stablePage(a,b){return validPage(a)&&validPage(b)&&a.revision===b.revision&&a.href===b.href&&a.width===b.width&&a.height===b.height&&JSON.stringify(a.masks)===JSON.stringify(b.masks);}
async function capture(m,sender){
 const state=await read();if(!state.recording||state.paused||sender.tab?.id!==state.tabId||sender.frameId!==0||new URL(sender.url).origin!==state.origin)return;
 if(!Number.isFinite(m.width)||!Number.isFinite(m.height)||m.width<1||m.height<1||!Array.isArray(m.masks)||m.masks.length>250||typeof m.title!=='string')return;
 if(state.guide.steps.length>=100){await stop();return;}
 const safeGeometry=[m.x,m.y].every(Number.isFinite)&&m.masks.every(r=>r&&[r.x,r.y,r.w,r.h].every(Number.isFinite)&&r.w>=0&&r.h>=0);
 let image;let reason='The page changed during capture, the tab lost focus, or clicks were too close together. Try again with a short pause between clicks.';
 if(m.unsafeMasking)reason='This page contains components whose private fields cannot be safely masked. This step was saved without a screenshot.';
 else if(safeGeometry){try{image=await imageFor(m,sender.tab);}catch{reason='Chrome could not capture this page. Return to the recorded tab and start recording from the Once toolbar icon again.';}}
 state.guide.steps.push({id:crypto.randomUUID(),title:m.title.slice(0,120),note:image?'':'Screenshot unavailable. '+reason,image,url:state.origin});state.guide.updated=Date.now();
 if(JSON.stringify(state).length>8500000){state.guide.steps.at(-1).image=undefined;state.guide.steps.at(-1).note='Capture storage limit reached. Export this guide and start a new one.';state.recording=false;}
 await write(state);await badge(state.recording?String(state.guide.steps.length):'');
}
async function command(m,sender){
 if(!m||typeof m.type!=='string')return {error:'Invalid command'};
 if(m.type==='CAPTURE'){await capture(m,sender);return {ok:true};}
 if(m.type==='PAGE_STATUS'){const s=await read();return {recording:!!s.recording&&sender.tab?.id===s.tabId&&sender.frameId===0,paused:!!s.paused,origin:s.origin,steps:s.guide?.steps?.length||0};}
 if(m.type==='PAGE_CONTROL'){
  const s=await read();if(!s.recording||sender.tab?.id!==s.tabId||sender.frameId!==0||new URL(sender.url).origin!==s.origin)return {error:'Not allowed'};
  if(m.action==='stop')return stop();
  if(m.action==='pause'){s.paused=!s.paused;await write(s);await badge(s.paused?'II':'REC');return {ok:true};}
  return {error:'Unknown control'};
 }
 if(sender.url!==chrome.runtime.getURL('popup.html'))return {error:'Not allowed'};
 if(m.type==='STATUS')return read();
 if(m.type==='START'){
  const tab=await chrome.tabs.get(m.tabId);if(!tab.active||new URL(tab.url).origin!==m.origin)return {error:'The active website changed. Try again.'};
  if(!await chrome.permissions.contains({origins:[m.origin+'/*']}))return {error:'Website permission is required'};
  await chrome.scripting.executeScript({target:{tabId:m.tabId},files:['content.js']});
  const now=Date.now();const state={recording:true,tabId:m.tabId,origin:m.origin,guide:{version:1,id:crypto.randomUUID(),title:'Workflow on '+new URL(m.origin).hostname,description:'',created:now,updated:now,steps:[]}};await write(state);await badge('REC');return {ok:true};
 }
 if(m.type==='STOP')return stop();
 if(m.type==='PAUSE'){const s=await read();if(!s.recording)return {error:'Start recording first.'};s.paused=!s.paused;await write(s);await badge(s.paused?'II':'REC');return {ok:true};}
 if(m.type==='CLEAR'){await chrome.storage.local.remove('once');await badge('');return {ok:true};}
 if(m.type==='EDITOR'){
  const state=await read();if(!state.guide||state.recording)return {error:'Stop recording first.'};
  const tab=await chrome.tabs.create({url:ORIGIN+'/?capture=1'});
  await chrome.storage.session.set({oncePending:{tabId:tab.id,guide:state.guide,transferId:crypto.randomUUID()}});
  await deliverPending(tab.id);return {ok:true};
 }
 return {error:'Unknown command'};
}
chrome.runtime.onMessage.addListener((m,sender,respond)=>{queue=queue.then(()=>command(m,sender)).then(respond).catch(e=>respond({error:e.message||'Capture failed'}));return true;});
chrome.tabs.onUpdated.addListener((id,info)=>{if(info.status!=='complete')return;queue=queue.then(async()=>{
 const state=await read();if(state.recording&&state.tabId===id){const tab=await chrome.tabs.get(id);if(new URL(tab.url).origin!==state.origin){await stop();}else{await chrome.scripting.executeScript({target:{tabId:id},files:['content.js']});}}
 await deliverPending(id);
 }).catch(()=>{});});
chrome.tabs.onRemoved.addListener(id=>{queue=queue.then(async()=>{const s=await read();if(s.tabId===id)await stop();}).catch(()=>{});});
chrome.runtime.onStartup.addListener(()=>{void stop();});

// Injection returning successfully is not a delivery acknowledgement. Keep the
// pending transfer on timeout/navigation and always retain the local recording.
async function deliverPending(id){
 const {oncePending:p}=await chrome.storage.session.get('oncePending');
 if(p?.tabId!==id)return;
 try{
  const tab=await chrome.tabs.get(id);if(new URL(tab.url).origin!==ORIGIN)return;
  const results=await chrome.scripting.executeScript({target:{tabId:id},func:deliverCapture,args:[p.guide,p.transferId]});
  if(results.some(r=>r.frameId===0&&r.result===p.transferId))await chrome.storage.session.remove('oncePending');
 }catch{/* Popup retry and JSON backup remain available. */}
}
function deliverCapture(guide,transferId){
 return new Promise(resolve=>{
  let attempts=0;let timer;
  const finish=value=>{clearInterval(timer);window.removeEventListener('message',receive);resolve(value);};
  const receive=e=>{if(e.source===window&&e.origin===location.origin&&e.data?.type==='ONCE_CAPTURE_RECEIVED'&&e.data.transferId===transferId)finish(transferId);};
  window.addEventListener('message',receive);
  timer=setInterval(()=>{
   if(++attempts>60){finish(null);return;}
   if(document.documentElement.dataset.onceReady==='true')window.postMessage({type:'ONCE_CAPTURE',guide,transferId},location.origin);
  },500);
 });
}
