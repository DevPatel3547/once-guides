// Prepare the documented Cloudflare direct-upload inputs; contains no credentials.
import {readdirSync,readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join,relative,extname} from 'node:path';
import {createHash} from 'node:crypto';
const walk=p=>readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(p,e.name)):[join(p,e.name)]);
const config=JSON.parse(readFileSync('dist/server/wrangler.json','utf8'));
if(config.d1_databases.length||config.r2_buckets.length)throw Error('This upload helper is for the storage-disabled beta only.');
const manifest={};const files={};
for(const path of walk('dist/client')){
 const name='/'+relative('dist/client',path);if(name==='/_headers'||name==='/_redirects'||name==='/.assetsignore'||name.startsWith('/.vite/')||name==='/wrangler.json'||name==='/.dev.vars')continue;if(name.endsWith('.map')||name.includes('/.'))throw Error('Unexpected public asset: '+name);
 const body=readFileSync(path);const hash=createHash('sha256').update(body.toString('base64')+extname(path).slice(1)).digest('hex').slice(0,32);
 manifest[name]={hash,size:body.length};files[hash]={path,type:({'.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.zip':'application/zip','.html':'text/html','.json':'application/json'})[extname(path)]||'application/octet-stream'};
}
const modules=walk('dist/server').filter(p=>p.endsWith('.js')).map(path=>({name:relative('dist/server',path),content:readFileSync(path,'utf8')}));
mkdirSync('.sites-runtime/upload',{recursive:true});
for(const [name,data] of Object.entries({manifest,files,modules}))writeFileSync('.sites-runtime/upload/'+name+'.json',JSON.stringify(data));
console.log(JSON.stringify({assets:Object.keys(manifest).length,modules:modules.length,moduleBytes:JSON.stringify(modules).length}));
