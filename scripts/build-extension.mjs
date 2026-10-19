// Compile the extension's TypeScript entry points into extension/dist.
// Each entry point is a separate program because Chrome loads them as separate
// classic scripts (service worker, injected content script, popup page).
// Pass --check to type-check without emitting.
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
const tsc=createRequire(import.meta.url).resolve('typescript/lib/tsc.js');
const check=process.argv.includes('--check');
for(const entry of ['background','content','popup']){
 const r=spawnSync(process.execPath,[tsc,'-p',`extension/tsconfig.${entry}.json`,...(check?['--noEmit']:[])],{stdio:'inherit'});
 if(r.status!==0)process.exit(r.status??1);
}
