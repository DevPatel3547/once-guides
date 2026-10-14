import {store,hash,fail,sameOrigin} from '@/lib/sharing-server';
export async function POST(r:Request){
 if(!sameOrigin(r))return fail('Origin not allowed',403);
 const token=r.headers.get('X-Delete-Token');
 if(!token||!/^[a-f0-9-]{36}$/.test(token))return fail('Missing deletion key');
 const max=8*1024*1024;
 if(Number(r.headers.get('content-length')||0)>max)return fail('Sharing supports guides up to 8 MB. Use HTML export for larger guides.',413);
 try {
  const {db,bucket}=store();
  const day=Math.floor(Date.now()/86400000);
  // Bounded, retryable cleanup. Expiry always blocks reads, even before physical cleanup.
  const expired=await db.prepare('SELECT id FROM shares WHERE expires<=? LIMIT 20').bind(Date.now()).all<{id:string}>();
  for(const row of expired.results){await bucket.delete(row.id);await db.prepare('DELETE FROM shares WHERE id=? AND expires<=?').bind(row.id,Date.now()).run();}
  await db.prepare('DELETE FROM share_limits WHERE day<?').bind(day-1).run();
  const identity=await hash(`${day}:${r.headers.get('cf-connecting-ip')||'unknown'}`);
  const limit=await db.prepare('INSERT INTO share_limits (id,count,day) VALUES (?,1,?) ON CONFLICT(id) DO UPDATE SET count=count+1 WHERE count<10 RETURNING count').bind(identity,day).first();
  if(!limit)return fail('Daily sharing limit reached. Local exports are unlimited; try sharing tomorrow.',429);
  const global=await db.prepare('INSERT INTO share_limits (id,count,day) VALUES (?,1,?) ON CONFLICT(id) DO UPDATE SET count=count+1 WHERE count<200 RETURNING count').bind(`global:${day}`,day).first();
  if(!global)return fail('Hosted sharing is at capacity today. Your local guides and exports still work.',429);
  const reader=r.body?.getReader();if(!reader)return fail('Empty guide');
  const chunks:Uint8Array[]=[];let size=0;
  for(;;){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();return fail('Guide exceeds 8 MB',413);}chunks.push(value);}
  if(size<30)return fail('Invalid encrypted guide');
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  const id=crypto.randomUUID();const expires=Date.now()+7*86400000;
  await bucket.put(id,bytes,{httpMetadata:{contentType:'application/octet-stream'}});
  try{await db.prepare('INSERT INTO shares (id,delete_hash,expires) VALUES (?,?,?)').bind(id,await hash(token),expires).run();}catch(e){await bucket.delete(id);throw e;}
  return Response.json({id,expires},{status:201,headers:{'Cache-Control':'no-store'}});
 }catch{console.error('Share creation failed');return fail('Sharing is temporarily unavailable. Your local guide is safe.',503);}
}
