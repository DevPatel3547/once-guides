import type { Guide } from './model';
let connection:Promise<IDBDatabase>|undefined;
function db(){return connection??=new Promise<IDBDatabase>((resolve,reject)=>{const r=indexedDB.open('once-guides',1);r.onupgradeneeded=()=>r.result.createObjectStore('guides',{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>{connection=undefined;reject(new Error('Local storage is unavailable. Export your guide to keep a copy.'));};});}
async function transact<T>(mode:IDBTransactionMode,action:(s:IDBObjectStore)=>IDBRequest<T>){const d=await db();return new Promise<T>((resolve,reject)=>{const t=d.transaction('guides',mode);const r=action(t.objectStore('guides'));t.oncomplete=()=>resolve(r.result);t.onerror=()=>reject(new Error('Could not save locally. Your browser storage may be full; export a backup.'));t.onabort=()=>reject(new Error('Local save was interrupted. Export a backup.'));});}
export const listGuides=()=>transact('readonly',s=>s.getAll()) as Promise<Guide[]>;
export const saveGuide=(g:Guide)=>transact('readwrite',s=>s.put(g));
export const removeGuide=(id:string)=>transact('readwrite',s=>s.delete(id));
