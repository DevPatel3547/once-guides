import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {extname} from 'node:path';
import {createHash} from 'node:crypto';
const origin=process.env.ONCE_PUBLIC_ORIGIN||'https://once-guide.once-guides.workers.dev';
const manifest=JSON.parse(readFileSync('release/deployed-assets.json'));
for(const path of ['/','/privacy','/practice','/support']){
 const r=await fetch(origin+path);assert.equal(r.status,200,path);const html=await r.text();
 assert.ok(!/DevPatel3547|onceguide-devp|diave|\/Users\/overse|dev\.patel2436/i.test(html),path);
 if(path==='/support')assert.ok(html.includes('thefool3547@gmail.com'));
}
for(const [path,item] of Object.entries(manifest)){
 const r=await fetch(origin+path);assert.equal(r.status,200,path);const body=Buffer.from(await r.arrayBuffer());
 const extension=extname(path).slice(1);if(item.hash)assert.equal(createHash('sha256').update(body.toString('base64')+extension).digest('hex').slice(0,32),item.hash,path);
}
const blocked=await fetch(origin+'/api/shares',{method:'POST',headers:{Origin:origin,'X-Delete-Token':crypto.randomUUID()},body:new Uint8Array(100)});assert.equal(blocked.status,503);
const cross=await fetch(origin+'/api/shares',{method:'POST',headers:{Origin:'https://example.invalid','X-Delete-Token':crypto.randomUUID()},body:new Uint8Array(100)});assert.equal(cross.status,403);
const result={checkedAt:new Date().toISOString(),origin,pages:4,reachableAssets:Object.keys(manifest).length,hashVerifiedAssets:Object.values(manifest).filter(v=>v.hash).length,sharingDisabled:true,crossOriginWritesRejected:true};
writeFileSync('.sites-runtime/public-smoke.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
