import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function setup(){
 const sql=new DatabaseSync(':memory:');for(const file of readdirSync(new URL('../drizzle/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort())sql.exec(readFileSync(new URL('../drizzle/'+file,import.meta.url),'utf8'));
 const objects=new Map();
 const db={
  prepare(query){
   return {bind(...args){
    const st=sql.prepare(query);
    return {async first(){return st.get(...args)||null;},async run(){return st.run(...args);},async all(){return {results:st.all(...args)};}};
   }};
  }
 };
 const bucket={async put(id,bytes){objects.set(id,new Uint8Array(bytes));},async get(id){return objects.has(id)?{body:objects.get(id)}:null;},async delete(id){objects.delete(id);}};
 const load=(path,imports)=>{const source=ts.transpileModule(readFileSync(new URL(path,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const loaded={exports:{}};vm.runInNewContext(source,{exports:loaded.exports,require:s=>{if(!(s in imports))throw Error('Unexpected import '+s);return imports[s];},Response,Request,URL,crypto,TextEncoder,Uint8Array,Date,console});return loaded.exports;};
 const helper=load('../lib/sharing-server.ts',{'cloudflare:workers':{env:{DB:db,BUCKET:bucket}}});
 return {sql,objects,create:load('../app/api/shares/route.ts',{'@/lib/sharing-server':helper}),item:load('../app/api/shares/[id]/route.ts',{'@/lib/sharing-server':helper})};
}
const root='https://once.example';
function request(token,extra={}){return new Request(root+'/api/shares',{method:'POST',headers:{Origin:root,'X-Delete-Token':token,'CF-Connecting-IP':'203.0.113.10',...extra},body:new Uint8Array(100)});}
test('share creation, ciphertext retrieval, incorrect-key rejection, and revocation',async()=>{
 const s=setup(),token=crypto.randomUUID();const r=await s.create.POST(request(token));assert.equal(r.status,201);const {id}=await r.json();const c={params:Promise.resolve({id})};
 const get=await s.item.GET(new Request(root+'/api/shares/'+id),c);assert.equal(get.status,200);assert.equal((await get.arrayBuffer()).byteLength,100);assert.equal(get.headers.get('cache-control'),'no-store');
 let del=await s.item.DELETE(new Request(root+'/api/shares/'+id,{method:'DELETE',headers:{Origin:root,'X-Delete-Token':crypto.randomUUID()}}),c);assert.equal(del.status,403);assert.equal(s.objects.size,1);
 del=await s.item.DELETE(new Request(root+'/api/shares/'+id,{method:'DELETE',headers:{Origin:root,'X-Delete-Token':token}}),c);assert.equal(del.status,204);assert.equal(s.objects.size,0);assert.equal((await s.item.GET(new Request(root),c)).status,404);s.sql.close();
});
test('cross-origin writes and oversize uploads fail before storage; daily limits persist',async()=>{
 const s=setup();assert.equal((await s.create.POST(request(crypto.randomUUID(),{Origin:'https://evil.example'}))).status,403);
 assert.equal((await s.create.POST(request(crypto.randomUUID(),{'Content-Length':'9000000'}))).status,413);assert.equal(s.objects.size,0);
 for(let i=0;i<10;i++)assert.equal((await s.create.POST(request(crypto.randomUUID()))).status,201);
 assert.equal((await s.create.POST(request(crypto.randomUUID()))).status,429);assert.equal(s.objects.size,10);s.sql.close();
});
test('expired links are never served and remove expired ciphertext on access',async()=>{
 const s=setup();const r=await s.create.POST(request(crypto.randomUUID()));const {id}=await r.json();s.sql.prepare('UPDATE shares SET expires=0 WHERE id=?').run(id);assert.equal((await s.item.GET(new Request(root),{params:Promise.resolve({id})})).status,410);assert.equal(s.objects.size,0);s.sql.close();
});
test('new shares clean expired objects and stale counters; global capacity is bounded',async()=>{
 const s=setup();const r=await s.create.POST(request(crypto.randomUUID()));const {id}=await r.json();
 s.sql.prepare('UPDATE shares SET expires=0 WHERE id=?').run(id);
 s.sql.prepare('INSERT INTO share_limits(id,count,day) VALUES (?,1,0)').run('old');
 assert.equal((await s.create.POST(request(crypto.randomUUID()))).status,201);
 assert.equal(s.objects.has(id),false);assert.equal(s.sql.prepare('SELECT id FROM share_limits WHERE id=?').get('old'),undefined);
 const day=Math.floor(Date.now()/86400000);s.sql.prepare('UPDATE share_limits SET count=200 WHERE id=?').run(`global:${day}`);
 assert.equal((await s.create.POST(request(crypto.randomUUID()))).status,429);assert.equal(s.objects.size,1);s.sql.close();
});

test('a blocked network cannot consume the global sharing budget',async()=>{
 const s=setup();
 for(let i=0;i<10;i++)assert.equal((await s.create.POST(request(crypto.randomUUID()))).status,201);
 for(let i=0;i<210;i++)assert.equal((await s.create.POST(request(crypto.randomUUID()))).status,429);
 const day=Math.floor(Date.now()/86400000);
 assert.equal(s.sql.prepare('SELECT count FROM share_limits WHERE id=?').get(`global:${day}`).count,10);
 assert.equal((await s.create.POST(request(crypto.randomUUID(),{'CF-Connecting-IP':'203.0.113.11'}))).status,201);
 s.sql.close();
});
