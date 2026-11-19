(async () => {
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const shared = fs.readFileSync('menu-state.js', 'utf8');
const inline = file => fs.readFileSync(file, 'utf8').split('<script>')[1].split('</script>')[0];
let raw = null, blocked = false;
const storage = {getItem:()=>raw,setItem:(key,value)=>{if(blocked)throw Error('blocked');raw=value;}};
function page(file) {
  const nodes = {}, events = {};
  const ctx = { structuredClone, console:{warn(){}}, localStorage:storage,
    document:{hidden:false,addEventListener(){},getElementById(id){return nodes[id] ||= {dataset:{},value:id==='availabilityFilter'?'all':'',innerHTML:'',textContent:'',open:false,showModal(){this.open=true;},close(){this.open=false;},addEventListener(){},querySelectorAll(){return []}};}},
    setInterval(){},alert(){},addEventListener(name,handler){events[name]=handler;}};
  ctx.FondaCloud={info:{authorized:true,ready:true,connected:true,empty:false},async publish(changes,initial){
    const latest=ctx.FondaMenu.load();
    for(const change of changes)latest[change.key].find(x=>x.id===change.id)[change.field]=change.value;
    if(!ctx.FondaMenu.save(latest))throw Error('No se pudo guardar');
    return latest;
  }};
  ctx.window=ctx;vm.createContext(ctx);vm.runInContext(shared,ctx);vm.runInContext(inline(file),ctx);
  return {ctx,nodes,events,run:code=>vm.runInContext(code,ctx)};
}
const admin=page('admin.html'), tv=page('index.html');
assert.equal(admin.ctx.FondaMenu.load().dishes.find(d=>d.id==='pozole_pollo').price,110);
// Multiple actions remain a draft with no interruption until the top save button.
admin.run("toggleDish('pollo_verde');setVariant('puerco_verde','Con Calabacitas');toggleDessert('flan')");
assert(!admin.nodes.saveModal.open);
assert.equal(admin.run('pendingChanges().length'),3);
admin.run('openSaveModal()');assert(admin.nodes.saveModal.open);
assert(admin.nodes.changeSummary.innerHTML.includes('Con Calabacitas'));
admin.run('discardChanges()');
console.log('OK: varias selecciones sin modal; confirmación solo desde Guardar cambios');
const was=admin.ctx.FondaMenu.load().dishes[0].active;
admin.run("toggleDish('puerco_verde')");
assert(!admin.nodes.saveModal.open, 'Una selección no debe abrir el modal');
admin.run('openSaveModal()');
assert(admin.nodes.saveModal.open);
assert.equal(admin.ctx.FondaMenu.load().dishes[0].active,was,'Draft must not publish');
admin.run('discardChanges()');
assert.equal(admin.run('pendingChanges().length'),0);
await admin.run("toggleDish('puerco_verde'); confirmSave()");
assert.equal(admin.ctx.FondaMenu.load().dishes[0].active,!was);
tv.events.storage({key:'fonda_menu_state_v1'});
assert(!tv.nodes.tvSlideContent.innerHTML.includes('<h2 class="font-display">Puerco en Salsa Verde'));
console.log('OK: confirmar/descartar y actualización de pantalla tras guardar');
admin.run("editPrice('dishes','pozole_pollo','price',{value:'110.50',setCustomValidity(){},reportValidity(){}})");
await admin.run('confirmSave()');
assert.equal(admin.ctx.FondaMenu.load().dishes.find(d=>d.id==='pozole_pollo').price,110.5);
// Reopen the app: catalog hydration must retain edited prices.
const reopened=page('admin.html');
assert.equal(reopened.ctx.FondaMenu.load().dishes.find(d=>d.id==='pozole_pollo').price,110.5);
let state=reopened.ctx.FondaMenu.load();state.dishes.forEach(d=>d.active=d.id==='pozole_pollo');reopened.ctx.FondaMenu.save(state);
tv.events.storage({key:'fonda_menu_state_v1'});
assert(tv.nodes.tvSlideContent.innerHTML.replace(/<[^>]*>/g, '').includes('$110.50'));
assert(tv.nodes.tvSlideContent.innerHTML.includes('tacosdorados.png'));
console.log('OK: precio editable persiste y se muestra con centavos');
await admin.run("editPrice('dishes','pozole_pollo','price',{value:'110',setCustomValidity(){},reportValidity(){}});confirmSave()");
assert.equal(admin.ctx.FondaMenu.load().dishes.find(d=>d.id==='pozole_pollo').price,110);
const before=raw;
admin.run("toggleDish('pollo_verde')");admin.run('openSaveModal()');blocked=true;await admin.run('confirmSave()');
assert.equal(raw,before);assert(admin.nodes.saveModal.open);assert(admin.nodes.saveError.textContent.includes('No se pudo guardar'));
blocked=false;admin.run('discardChanges()');
console.log('OK: fallo de almacenamiento mantiene borrador y muestra error');
admin.nodes.searchDishInput.value='POZOLE';admin.run('renderAdmin()');
assert(admin.nodes.adminDishesList.innerHTML.includes('Pozole de Pollo'));assert(!admin.nodes.adminDishesList.innerHTML.includes('Arrachera Asada'));
admin.nodes.searchDishInput.value='higado';admin.run('renderAdmin()');assert(admin.nodes.adminDishesList.innerHTML.includes('Hígado'));
admin.nodes.searchDishInput.value='';admin.run("selectedCategory='Paquetes';renderAdmin()");assert(!admin.nodes.adminDishesList.innerHTML.includes('Arrachera Asada'));
admin.nodes.availabilityFilter.value='active';admin.run('renderAdmin()');assert(!admin.nodes.adminDishesList.innerHTML.includes('Pozole de Puerco'));
console.log('OK: buscador sin acentos, categorías y filtro de disponibilidad');
// A separate admin updates another field while this page has a draft.
admin.run("toggleDish('pollo_verde')");
const other=page('admin.html');await other.run("editPrice('dishes','arrachera','price',{value:'160',setCustomValidity(){},reportValidity(){}});confirmSave()");
admin.events.storage({key:'fonda_menu_state_v1'});assert(admin.run('pendingChanges().length')>0);await admin.run('confirmSave()');
assert.equal(admin.ctx.FondaMenu.load().dishes.find(d=>d.id==='arrachera').price,160);
console.log('OK: cambios de otra pestaña se combinan sin perder el borrador');
const crypto=require('node:crypto');
for(const page of ['admin.html','index.html']) {
  const html=fs.readFileSync(page,'utf8');
  for(const asset of ['menu-state.js','firebase-sync.js']) {
    const hash=crypto.createHash('sha256').update(fs.readFileSync(asset)).digest('hex').slice(0,12);
    assert(html.includes(`${asset}?v=${hash}`), `Actualizar versión del script ${asset} en ${page}`);
  }
}
assert.equal(typeof admin.ctx.FondaMenu.normalize,'function');
console.log('OK: normalize exportado y scripts con versiones correspondientes a su contenido');

})().catch(error=>{console.error(error);process.exitCode=1;});
