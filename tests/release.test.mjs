import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
test('release includes all declared icons and a consistent editor destination',()=>{
 const root=new URL('../extension/',import.meta.url);
 const manifest=JSON.parse(readFileSync(new URL('manifest.json',root)));
 for(const path of Object.values(manifest.icons))assert.ok(existsSync(new URL(path,root)));
 const bg=readFileSync(new URL('background.js',root),'utf8');const popup=readFileSync(new URL('popup.js',root),'utf8');
 assert.equal(bg.match(/const ORIGIN='([^']+)'/)[1],popup.match(/const ORIGIN='([^']+)'/)[1]);
});
