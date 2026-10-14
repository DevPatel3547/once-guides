export type Step = { id: string; title: string; note: string; image?: string; url?: string };
export type Guide = { version: 1; id: string; title: string; description: string; created: number; updated: number; steps: Step[]; share?: {id:string; url:string; token:string; expires:number} };
export const uid = () => {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  // Local editing also works in HTTP previews, where randomUUID may be absent.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
};
export const newGuide = (): Guide => ({version:1,id:uid(),title:'Untitled guide',description:'',created:Date.now(),updated:Date.now(),steps:[]});
export function validateGuide(input: unknown): Guide {
  if(!input || typeof input !== 'object') throw new Error('This is not a Once guide.');
  const g = input as Record<string,unknown>;
  if(g.version !== 1 || typeof g.title !== 'string' || g.title.length>300 || !Array.isArray(g.steps) || g.steps.length>100) throw new Error('Invalid guide format (maximum 100 steps).');
  const steps = g.steps.map((value):Step=>{
    if(!value || typeof value!=='object') throw new Error('Invalid step.');
    const s=value as Record<string,unknown>;
    if(typeof s.title!=='string'||s.title.length>1000||typeof s.note!=='string'||s.note.length>10000) throw new Error('Invalid step text.');
    if(s.image!==undefined && (typeof s.image!=='string'|| !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(s.image)||s.image.length>4000000)) throw new Error('Unsupported screenshot.');
    let url:string|undefined;
    if(typeof s.url==='string') {try {const u=new URL(s.url); if(['https:','http:'].includes(u.protocol))url=u.origin+u.pathname;}catch{}}
    return {id:uid(),title:s.title,note:s.note,image:s.image as string|undefined,url};
  });
  return {version:1,id:uid(),title:g.title,description:typeof g.description==='string'?g.description.slice(0,5000):'',created:Date.now(),updated:Date.now(),steps};
}
export const escapeHtml = (s:string) => s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function toHtml(g:Guide) {
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(g.title)}</title><style>body{font:16px/1.6 system-ui;color:#17241f;max-width:850px;margin:50px auto;padding:0 24px}header{border-bottom:2px solid #176d50;margin-bottom:40px}h1{font-size:36px;line-height:1.2}h2{font-size:21px}section{break-inside:avoid;margin:32px 0}img{max-width:100%;border:1px solid #ddd;border-radius:10px}p{white-space:pre-wrap}small{color:#647069}@media print{body{margin:0;max-width:none}section{break-inside:avoid}}@page{margin:18mm}</style></head><body><header><small>ONCE / WORKFLOW GUIDE</small><h1>${escapeHtml(g.title)}</h1><p>${escapeHtml(g.description)}</p><p>${g.steps.length} steps</p></header>${g.steps.map((s,i)=>`<section><h2>${i+1}. ${escapeHtml(s.title)}</h2>${s.note?`<p>${escapeHtml(s.note)}</p>`:''}${s.image?`<img alt="Screenshot for step ${i+1}" src="${s.image}">`:''}</section>`).join('')}</body></html>`;
}
const mdEscape=(s:string)=>s.replace(/[\\`*_{}\[\]<>#]/g,'\\$&');
export function toMarkdown(g:Guide) {return `# ${mdEscape(g.title)}\n\n${mdEscape(g.description)}\n\n`+g.steps.map((s,i)=>`## ${i+1}. ${mdEscape(s.title)}\n\n${mdEscape(s.note)}\n\n${s.image?`![Step ${i+1}](${s.image})\n\n`:''}`).join('');}
export function download(body:BlobPart,name:string,type:string){const url=URL.createObjectURL(new Blob([body],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
export function filename(g:Guide){return g.title.replace(/[^a-zA-Z0-9 -]/g,'').trim().slice(0,70)||'once-guide';}
