import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';

// This command builds only. It never creates resources, uploads, or spends money.
const {ONCE_PUBLIC_ORIGIN,ONCE_DATABASE_ID,ONCE_BUCKET_NAME}=process.env;
if(!ONCE_PUBLIC_ORIGIN||!ONCE_DATABASE_ID||!ONCE_BUCKET_NAME)throw Error('Set ONCE_PUBLIC_ORIGIN, ONCE_DATABASE_ID and ONCE_BUCKET_NAME for the target account.');
if(!/^[a-f0-9-]{36}$/.test(ONCE_DATABASE_ID)||ONCE_DATABASE_ID==='00000000-0000-4000-8000-000000000000')throw Error('A real target D1 database ID is required.');
if(!/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(ONCE_BUCKET_NAME))throw Error('Invalid R2 bucket name.');
const run=(cmd,args)=>{const r=spawnSync(cmd,args,{stdio:'inherit',env:process.env});if(r.error)throw r.error;if(r.status!==0)process.exit(r.status??1);};
run('pnpm',['test']);run('pnpm',['typecheck']);run('pnpm',['lint']);
run('python3',['scripts/package-extension.py','--origin',ONCE_PUBLIC_ORIGIN]);
run('pnpm',['build']);
const config=JSON.parse(readFileSync('dist/server/wrangler.json','utf8'));
if(config.d1_databases?.[0]?.database_id!==ONCE_DATABASE_ID||config.r2_buckets?.[0]?.bucket_name!==ONCE_BUCKET_NAME)throw Error('Build bindings do not match the requested deployment.');
console.log('Release prepared. Apply target database migrations, review the resource plan, then deploy dist/server/wrangler.json. No deployment was performed.');
