import {env} from 'cloudflare:workers';
export const store=()=>{if(!env.DB||!env.BUCKET)throw new Error('Sharing unavailable');return {db:env.DB,bucket:env.BUCKET};};
export const hash=async(s:string)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),x=>x.toString(16).padStart(2,'0')).join('');
export const validId=(s:string)=>/^[a-f0-9-]{36}$/.test(s);
export function fail(message:string,status=400){return Response.json({error:message},{status,headers:{'Cache-Control':'no-store'}});}
export function sameOrigin(r:Request){const origin=r.headers.get('Origin');return !!origin&&origin===new URL(r.url).origin;}
