const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let raw=null,requested=[],scheduled=[],events=0;const status={textContent:''};
const ctx={console,Date,localStorage:{getItem:()=>raw,setItem:(k,v)=>raw=v},document:{getElementById:()=>status,addEventListener(){},createEvent:()=>({initEvent(){}})},dispatchEvent:()=>events++,addEventListener(){},setTimeout:(cb,delay)=>{scheduled.push({cb,delay});return scheduled.length;},clearTimeout(){},XMLHttpRequest:function(){requested.push(this);this.open=(method,url)=>{assert.equal(method,'GET');assert(url.includes('/documents/menus/principal'));};this.send=()=>{};}};
ctx.window=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync('menu-state.js','utf8'),ctx);vm.runInContext(fs.readFileSync('tv-sync.js','utf8'),ctx);
function encode(v){if(v===null)return{nullValue:null};if(typeof v==='boolean')return{booleanValue:v};if(typeof v==='number')return{doubleValue:v};if(typeof v==='string')return{stringValue:v};if(Array.isArray(v))return{arrayValue:{values:v.map(encode)}};return{mapValue:{fields:Object.fromEntries(Object.entries(v).map(([k,v])=>[k,encode(v)]))}};}
function check(){scheduled.at(-1).cb();return requested.at(-1);}
function respond(req,state){req.status=200;req.responseText=JSON.stringify({fields:{state:encode(state)}});req.onload();}
const initial=ctx.FondaMenu.load();let remote=structuredClone(initial);remote.dishes[0].active=false;
respond(check(),remote);assert(!ctx.FondaMenu.load().dishes[0].active);assert.equal(events,1);assert.equal(scheduled.at(-1).delay,10000);assert(ctx.FondaTvSync.info.connected);
respond(check(),remote);assert.equal(events,1,'Sin cambios no reinicia el carrusel');
console.log('OK: actualización sin SDK de Firebase y sin reinicio cuando el menú no cambia');
const original=raw;let req=check();req.ontimeout();assert.equal(raw,original);assert(status.textContent.includes('Sin conexión'));req=check();req.status=403;req.onload();assert(status.textContent.includes('reglas'));assert.equal(raw,original);
respond(check(),remote);assert.equal(status.textContent,'');assert(ctx.FondaTvSync.info.connected);
req=check();req.status=200;req.responseText='{broken';req.onload();assert.equal(raw,original);
console.log('OK: timeout, permisos, respuesta inválida y recuperación sin perder el último menú');
req=check();const newer=structuredClone(remote);newer.dishes[0].price=111;ctx.FondaMenu.save(newer);respond(req,remote);assert.equal(ctx.FondaMenu.load().dishes[0].price,111);
console.log('OK: una respuesta lenta no sobrescribe una actualización más reciente');
