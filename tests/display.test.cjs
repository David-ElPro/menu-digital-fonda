const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let stored=null;const nodes={};
const ctx={console,localStorage:{getItem:()=>stored,setItem:(k,v)=>stored=v},document:{hidden:false,addEventListener(){},getElementById:id=>nodes[id]||={innerHTML:'',textContent:'',dataset:{},style:{setProperty(){}}}},addEventListener(){},setInterval(){}};
ctx.window=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync('menu-state.js','utf8'),ctx);
vm.runInContext(fs.readFileSync('index.html','utf8').split('<script>')[1].split('</script>')[0],ctx);
assert.equal(nodes.tvScreen.dataset.theme,'gold');
vm.runInContext('nextSlide()',ctx);assert.equal(nodes.tvScreen.dataset.theme,'sunset');
const state=ctx.FondaMenu.load();const count=state.dishes.filter(x=>x.active).length;
vm.runInContext(`goToSlide(${count})`,ctx);
let html=nodes.tvSlideContent.innerHTML;
assert.equal(nodes.tvScreen.dataset.theme,'sweets');assert.equal((html.match(/class="dessert-card"/g)||[]).length,3);
for(const name of ['Plátanos fritos con lechera','Gelatina','Flan de leche'])assert(html.includes(name));
for(const photo of ['platanosfritos.png','gelatina.png','flandeleche.png']) {assert(html.includes(`src="img/${photo}"`));assert(fs.existsSync('img/'+photo));}
assert(html.includes('$35<small>.00'));assert(html.includes('$20<small>.00'));
assert.equal(nodes.extrasFooter.hidden,true);assert(!html.includes('steam-particle'));
vm.runInContext('nextSlide()',ctx);assert.equal(nodes.tvScreen.dataset.theme,'gold');
console.log('OK: fondos alternos, 3 postres juntos con precios, sin humo ni banner y retorno al menú');
state.desserts.find(x=>x.id==='gelatina').active=false;state.desserts.find(x=>x.id==='flan').price=24.5;ctx.FondaMenu.save(state);
vm.runInContext(`goToSlide(${count})`,ctx);html=nodes.tvSlideContent.innerHTML;
assert.equal((html.match(/class="dessert-card"/g)||[]).length,2);assert(!html.includes('<h3>Gelatina</h3>'));assert(html.includes('$24<small>.50'));
state.dishes.forEach(x=>x.active=false);ctx.FondaMenu.save(state);vm.runInContext('renderTvSlide()',ctx);assert.equal(nodes.tvScreen.dataset.kind,'desserts');
state.desserts.forEach(x=>x.active=false);ctx.FondaMenu.save(state);vm.runInContext('renderTvSlide()',ctx);assert(nodes.tvSlideContent.innerHTML.includes('Esperando platillos activos'));
console.log('OK: disponibilidad y precios del admin, solo postres y menú completamente vacío');

state.dishes.forEach(x=>x.active=x.id==='pancita');ctx.FondaMenu.save(state);vm.runInContext('goToSlide(0)',ctx);
html=nodes.tvSlideContent.innerHTML;
assert(html.includes('img/pancita.png'));assert(html.includes('Sin entrada ni bebida'));assert(!html.includes('Entrada a elegir'));assert(!html.includes('Agua del día (1 litro)'));
const crema=ctx.FondaMenu.load().dishes.find(d=>d.id==='pollo_crema');assert.equal(crema.img,'img/polloencrema.png');assert.equal(crema.variants.length,0);assert(fs.existsSync(crema.img));
console.log('OK: pancita sin entrada ni agua y pollo en crema con foto sin variantes');
