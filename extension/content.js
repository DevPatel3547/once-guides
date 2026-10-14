(()=>{
 if(window.__onceCaptureInstalled)return;window.__onceCaptureInstalled=true;
 let last=0;let recording=false;let paused=false;
 const host=document.createElement('div');host.setAttribute('data-once-ignore','');host.style.cssText='position:fixed;bottom:20px;right:20px;z-index:2147483647';
 const shadow=host.attachShadow({mode:'closed'});
 const panel=document.createElement('div');panel.style.cssText='display:flex;align-items:center;gap:10px;padding:12px 16px;background:#123d2b;color:white;border:1px solid #93c9a4;border-radius:14px;font:14px system-ui;box-shadow:0 4px 24px #0005';
 const label=document.createElement('span');label.setAttribute('role','status');
 const pause=document.createElement('button');const stop=document.createElement('button');stop.textContent='Stop';
 for(const button of [pause,stop])button.style.cssText='font:inherit;padding:6px 10px;border-radius:8px;border:1px solid #abc;background:white;color:#123d2b;cursor:pointer';
 panel.append(label,pause,stop);shadow.append(panel);document.documentElement.append(host);
 function render(s){recording=!!s?.recording&&s.origin===location.origin;paused=!!s?.paused;host.hidden=!recording;label.textContent=paused?'Once · paused':`Once · recording · ${s?.steps||0} steps`;pause.textContent=paused?'Resume':'Pause';}
 const control=action=>chrome.runtime.sendMessage({type:'PAGE_CONTROL',action}).catch(()=>{host.hidden=true;recording=false;});
 pause.onclick=e=>{if(e.isTrusted)void control('pause');};stop.onclick=e=>{if(e.isTrusted)void control('stop');};
 function refresh(){chrome.runtime.sendMessage({type:'PAGE_STATUS'}).then(render).catch(()=>render(null));}
 refresh();chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes.once)refresh();});
 function clean(s){return String(s||'').replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g,'[email]').replace(/\d{5,}/g,'[number]').replace(/\s+/g,' ').trim().slice(0,100);}
 function rect(el){const r=el.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};}
 let revision=0;
 new MutationObserver(records=>{if(records.some(r=>r.target!==host&&!host.contains(r.target)))revision++;}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,characterData:true});
 addEventListener('scroll',()=>revision++,true);addEventListener('resize',()=>revision++);
 function screenshotState(){
  const masks=[...document.querySelectorAll('input,textarea,select,[contenteditable],iframe,[data-private],[data-sensitive]')].map(rect).filter(r=>r.w>0&&r.h>0&&r.y<innerHeight&&r.x<innerWidth&&r.y+r.h>0&&r.x+r.w>0);
  masks.push(rect(host));
  const unsafeMasking=masks.length>250||[...document.querySelectorAll('*')].some(el=>el.shadowRoot||el.tagName.includes('-'));
  return {href:location.href,width:innerWidth,height:innerHeight,masks:masks.slice(0,250),unsafeMasking,revision};
 }
 chrome.runtime.onMessage.addListener((message,sender,respond)=>{
  if(message?.type==='ONCE_SCREENSHOT_STATE'&&sender.id===chrome.runtime.id)respond(screenshotState());
 });
 document.addEventListener('pointerdown',event=>{
  if(!recording||paused||!event.isTrusted||event.button!==0||document.visibilityState!=='visible'||Date.now()-last<150)return;
  const t=event.target;if(!(t instanceof Element))return;
  const el=t.closest('button,a,input,select,textarea,[role="button"],[role="tab"],[role="menuitem"],summary')||t;
  if(el.closest('[data-once-ignore]'))return;
  last=Date.now();
  const isField=el.matches('input,textarea,select,[contenteditable]');
  const label=clean(el.getAttribute('aria-label')||(isField?el.getAttribute('placeholder'):el.textContent)||el.getAttribute('title')||el.tagName.toLowerCase());
  chrome.runtime.sendMessage({type:'CAPTURE',title:(isField?'Select the ':'Click ')+(label||'control'),url:location.origin,...screenshotState(),x:event.clientX,y:event.clientY}).catch(()=>{});
 },true);
})();
