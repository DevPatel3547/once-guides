// Consumes the short-lived upload session returned by the Cloudflare connector.
// Never prints or commits upload/completion credentials.
import {readFileSync,writeFileSync,unlinkSync} from 'node:fs';
const root='.sites-runtime/upload/';
const session=JSON.parse(readFileSync(root+'session.json','utf8'));
const files=JSON.parse(readFileSync(root+'files.json','utf8'));
let completion=session.buckets.length?null:session.jwt;
for(const hashes of session.buckets){
 const form=new FormData();
 for(const hash of hashes){const file=files[hash];form.append(hash,new Blob([readFileSync(file.path).toString('base64')],{type:file.type}),hash);}
 const response=await fetch('https://api.cloudflare.com/client/v4/accounts/8368a32b3285f0f1b9a5b4f7096a7b9f/workers/assets/upload?base64=true',{method:'POST',headers:{Authorization:'Bearer '+session.jwt},body:form});
 const data=await response.json();if(!response.ok||!data.success)throw Error('Asset upload failed: '+response.status+' '+JSON.stringify(data.errors));
 if(data.result?.jwt)completion=data.result.jwt;
 console.log('Uploaded '+hashes.length+' assets.');
}
if(!completion)throw Error('Missing completion token');
writeFileSync(root+'completion.json',JSON.stringify({jwt:completion}),{mode:0o600});unlinkSync(root+'session.json');
console.log('Asset upload complete.');
