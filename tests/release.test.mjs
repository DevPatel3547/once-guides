import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
test('release includes all declared icons and a consistent editor destination',()=>{
 const root=new URL('../extension/',import.meta.url);
 const manifest=JSON.parse(readFileSync(new URL('manifest.json',root)));
 for(const path of Object.values(manifest.icons))assert.ok(existsSync(new URL(path,root)));
 // Compiled entry points referenced by the manifest and popup must exist (pnpm build:extension).
 assert.ok(existsSync(new URL(manifest.background.service_worker,root)));
 const popupScript=readFileSync(new URL(manifest.action.default_popup,root),'utf8').match(/<script src="([^"]+)"/)[1];
 assert.ok(existsSync(new URL(popupScript,root)));
 const bg=readFileSync(new URL(manifest.background.service_worker,root),'utf8');const popup=readFileSync(new URL(popupScript,root),'utf8');
 const origin=/const ORIGIN\s*=\s*'([^']+)'/;
 assert.equal(bg.match(origin)[1],popup.match(origin)[1]);
 assert.equal(readFileSync(new URL('src/background.ts',root),'utf8').match(origin)[1],bg.match(origin)[1]);
});
