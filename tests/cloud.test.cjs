(async () => {
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const shared=fs.readFileSync('menu-state.js','utf8');
const sync=fs.readFileSync('firebase-sync.js','utf8').replace(/import\('https:\/\/www\.gstatic\.com\/firebasejs\/13\.4\.0\/firebase-(app|auth|firestore)\.js'\)/g, (_,name)=>`Promise.resolve(modules.${name})`);
const clientUIDs=fs.readFileSync('firebase-sync.js','utf8').match(/ADMIN_UIDS = \[(.*?)\]/s)[1].match(/'([^']+)'/g).map(x=>x.slice(1,-1));
const rulesUIDs=fs.readFileSync('firestore.rules','utf8').match(/request.auth.uid in \[(.*?)\]/s)[1].match(/'([^']+)'/g).map(x=>x.slice(1,-1));
assert.deepEqual(clientUIDs.sort(), rulesUIDs.sort(), 'Los UID del panel y las reglas deben coincidir');
let remote=null, deny=false; const listeners=[];
const snapshot=()=>({metadata:{hasPendingWrites:false,fromCache:false},exists:()=>!!remote,data:()=>structuredClone(remote)});
function device(uid) {
 const events={},cache={}; let authCallback;
 const auth={currentUser:null};
 const modules={app:{initializeApp:()=>({})},auth:{getAuth:()=>auth,onAuthStateChanged:(a,cb)=>{authCallback=cb;cb(null);},signInWithEmailAndPassword:async()=>{auth.currentUser={uid,email:'admin@example.test'};authCallback(auth.currentUser);},signOut:async()=>{auth.currentUser=null;authCallback(null);}},firestore:{getFirestore:()=>({}),doc:()=>({}),serverTimestamp:()=>123,onSnapshot:(ref,opts,ok,error)=>{listeners.push({ok,error});ok(snapshot());},runTransaction:async(db,fn)=>{
   if(deny){const error=Error('denied');error.code='permission-denied';throw error;}
   let next;
   const state=await fn({get:async()=>snapshot(),set:(ref,value)=>next=value});
   remote=structuredClone(next);listeners.forEach(l=>l.ok(snapshot()));return state;
 }}};
 const ctx={modules,console:{warn(){}},navigator:{onLine:true},CustomEvent:class{constructor(type,opts){this.type=type;this.detail=opts.detail}},Event:class{constructor(type){this.type=type}},localStorage:{getItem:k=>cache[k]||null,setItem:(k,v)=>cache[k]=v},addEventListener:(name,cb)=>(events[name]||=[]).push(cb),dispatchEvent:event=>(events[event.type]||[]).forEach(cb=>cb(event))};
 ctx.window=ctx;vm.createContext(ctx);vm.runInContext(shared,ctx);vm.runInContext(sync,ctx);
 return {ctx,cache,events};
}
const me=device('cI41h5DZGURJgjNAkhBK5SEfLL33'),dad=device('tNm9qnzrcicgyc4Oj6rmcdlAIE83'),third=device('uII1zdgYFjVldt9z6CmgOr6V8El2'),tv=device('other');
await new Promise(resolve=>setImmediate(resolve));
assert(me.ctx.FondaCloud.info.empty);assert(tv.ctx.FondaCloud.info.ready);
await assert.rejects(()=>tv.ctx.FondaCloud.publish([],tv.ctx.FondaMenu.load()),/autorizada/);
for(const d of [me,dad,third]){await d.ctx.FondaCloud.login('admin@example.test','test');assert(d.ctx.FondaCloud.info.authorized);}
await me.ctx.FondaCloud.publish([],me.ctx.FondaMenu.load());
assert(!tv.ctx.FondaCloud.info.empty);
await dad.ctx.FondaCloud.publish([{key:'dishes',id:'pozole_pollo',field:'active',value:true},{key:'dishes',id:'pozole_pollo',field:'price',value:110}],dad.ctx.FondaMenu.load());
assert(tv.ctx.FondaMenu.load().dishes.find(d=>d.id==='pozole_pollo').active);
await me.ctx.FondaCloud.publish([{key:'dishes',id:'puerco_verde',field:'active',value:false}],me.ctx.FondaMenu.load());
assert(!tv.ctx.FondaMenu.load().dishes.find(d=>d.id==='puerco_verde').active);
assert(tv.ctx.FondaMenu.load().dishes.find(d=>d.id==='pozole_pollo').active);
console.log('OK: tres UID autorizados, pantalla sin sesión y almacenamiento separado por dispositivo');
me.ctx.navigator.onLine=false;
await assert.rejects(()=>me.ctx.FondaCloud.publish([],me.ctx.FondaMenu.load()),/conexión/);me.ctx.navigator.onLine=true;
deny=true;const before=JSON.stringify(remote);
await assert.rejects(()=>me.ctx.FondaCloud.publish([{key:'dishes',id:'pozole_pollo',field:'price',value:1}],me.ctx.FondaMenu.load()),/reglas/);
assert.equal(JSON.stringify(remote),before);assert(!me.ctx.FondaCloud.info.saving);deny=false;
await tv.ctx.FondaCloud.login('other@example.test','test');assert(!tv.ctx.FondaCloud.info.authorized);
await assert.rejects(()=>tv.ctx.FondaCloud.publish([],tv.ctx.FondaMenu.load()),/autorizada/);
console.log('OK: sin red o sin permisos no publica, y no anuncia éxito antes de confirmar');
await assert.rejects(()=>me.ctx.FondaCloud.publish([{key:'dishes',id:'pozole_pollo',field:'price',value:-10}],me.ctx.FondaMenu.load()),/Precio inválido/);
await me.ctx.FondaCloud.publish([{key:'display',field:'brightness',value:4},{key:'display',field:'textSize',value:1.3}],me.ctx.FondaMenu.load());
assert.equal(dad.ctx.FondaMenu.load().display.brightness,4);
assert.equal(tv.ctx.FondaMenu.load().display.textSize,1.3);
await assert.rejects(()=>me.ctx.FondaCloud.publish([{key:'display',field:'brightness',value:99}],me.ctx.FondaMenu.load()),/inválido/);
console.log('OK: brillo y textos compartidos entre dispositivos y valores inválidos rechazados');
await me.ctx.FondaCloud.logout();assert(!me.ctx.FondaCloud.info.authorized);
console.log('OK: validación de precios y cierre de sesión');
})().catch(error=>{console.error(error);process.exitCode=1;});
