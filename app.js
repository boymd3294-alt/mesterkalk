'use strict';
const D=window.MESTERKALK_DATA;
if(!D){document.body.innerHTML='<main style="font-family:Arial,sans-serif;padding:30px"><h1>MesterKalk betöltési hiba</h1><p>A js/data.js fájl nem töltődött be. Ellenőrizd, hogy a <b>js</b> mappa az index.html mellett van-e.</p></main>';throw new Error('MESTERKALK_DATA is missing');}
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
let currentCategory=null,currentCalc=null,deferredInstallPrompt=null;
const tables={length:{mm:.001,cm:.01,dm:.1,m:1,km:1000},area:{mm2:1e-6,cm2:1e-4,dm2:.01,m2:1,km2:1e6,ha:1e4},volume:{mm3:1e-9,cm3:1e-6,dm3:.001,l:.001,m3:1},mass:{mg:1e-6,g:.001,kg:1,t:1000},time:{sec:1/3600,min:1/60,h:1,day:24}};
const labels={length:{mm:'mm',cm:'cm',dm:'dm',m:'m',km:'km'},area:{mm2:'mm²',cm2:'cm²',dm2:'dm²',m2:'m²',km2:'km²',ha:'ha'},volume:{mm3:'mm³',cm3:'cm³',dm3:'dm³',l:'liter',m3:'m³'},mass:{mg:'mg',g:'g',kg:'kg',t:'t'}};
function show(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));$('#'+id).classList.add('active');window.scrollTo({top:0,behavior:'smooth'});}
function findCalc(id){return D.CALCULATORS[id]}
function val(d,k){const n=Number(d[k]);if(!Number.isFinite(n))throw new Error('Hiányzó vagy hibás adat: '+k);return n}
function conv(d,k,type){return val(d,k)*(tables[type][d[k+'_unit']||Object.keys(tables[type])[0]])}
function unitOptions(type,selected){return D.UNITS[type].map(([v,l])=>`<option value="${v}" ${v===selected?'selected':''}>${l}</option>`).join('')}
function outputOptions(type,selected){const u=D.UNITS[type]||[];return u.map(([v,l])=>`<option value="${v}" ${v===selected?'selected':''}>${l}</option>`).join('')}
function outputType(c){if(['volume','area','mass','length'].includes(c.result_type))return c.result_type;if(c.formula==='paint'||c.formula==='primer')return 'volume';return null}
function fieldHtml(f){const v=f.default??'';if(f.unit_type){const def=f.default_unit||D.UNITS[f.unit_type][0][0];return `<div class="field"><label>${esc(f.label)}</label><div class="input-row"><input name="${f.id}" type="number" step="any" value="${v}" placeholder="Írd be az értéket"><select name="${f.id}_unit">${unitOptions(f.unit_type,def)}</select></div></div>`}return `<div class="field"><label>${esc(f.label)}</label><div class="input-row"><input name="${f.id}" type="number" step="any" value="${v}" placeholder="Írd be az értéket"><span class="unit">${esc(f.unit||'')}</span></div></div>`}
function openCategory(id){currentCategory=id;const c=D.CATEGORIES.find(x=>x.id===id);$('#categoryHeader').innerHTML=`<div class="eyebrow">KATEGÓRIA</div><h1>${c.icon} ${esc(c.name)}</h1><p>Válassz egy számolást.</p>`;$('#calculators').innerHTML=c.calculators.map(id=>{const x=findCalc(id);return `<button class="calc-card" data-id="${id}" type="button"><span>${x.icon}</span><strong>${esc(x.name)}</strong><small>${x.help||'Add meg az adatokat és számold ki az eredményt.'}</small></button>`}).join('');document.querySelectorAll('.calc-card').forEach(b=>b.onclick=()=>openCalculator(b.dataset.id));show('category')}
function openCalculator(id){currentCalc=id;const c=findCalc(id);$('#calcHeader').innerHTML=`<div class="eyebrow">SZÁMOLÓ</div><h1>${c.icon} ${esc(c.name)}</h1><p>${esc(c.help||'Add meg az adatokat.')}</p>`;$('#fields').innerHTML=c.fields.map(fieldHtml).join('');const type=outputType(c);if(type){const def=type==='volume'?'m3':type==='area'?'m2':type==='mass'?'kg':'m';$('#fields').insertAdjacentHTML('beforeend',`<div class="field"><label>Eredmény mértékegysége</label><div class="input-row"><select name="result_unit">${outputOptions(type,def)}</select></div></div>`)}if(c.exact_two)$('#fields').insertAdjacentHTML('beforeend','<div class="hint">Ohm-törvény: pontosan 2 értéket adj meg, a harmadikat az alkalmazás kiszámolja.</div>');$('#result').classList.add('hidden');show('calculator')}
function formData(){const o={};new FormData($('#calcForm')).forEach((v,k)=>o[k]=v);return o}
function fmt(n,d=2){return new Intl.NumberFormat('hu-HU',{maximumFractionDigits:d}).format(n)}
function result(r,type,d){const unit=d.result_unit; if(type==='volume'||type==='area'||type==='mass'||type==='length'){const v=r/tables[type][unit];return `${fmt(v, type==='volume'?3:2)} ${labels[type][unit]}`}return `${fmt(r,2)}`}
function calculate(id,d){const f=findCalc(id).formula;let r,details=[];const lm=(k)=>conv(d,k,'length'),am=(k)=>conv(d,k,'area'),vm=(k)=>conv(d,k,'volume'),th=(k)=>val(d,k)*(tables.time[d[k+'_unit']||'h']);
if(f==='beton')r=lm('hossz')*lm('szelesseg')*lm('vastagsag')*(1+val(d,'rahagyas')/100);
else if(f==='tegla'){const wall=lm('fal_hossz')*lm('fal_magassag'),brick=(lm('tegla_hossz')+lm('fuga'))*(lm('tegla_szelesseg')+lm('fuga'));r=wall/brick*(1+val(d,'rahagyas')/100);details.push(`Fal felülete: ${fmt(wall)} m²`)}
else if(f==='habarcs')r=am('terulet')*val(d,'anyagigeny')*(1+val(d,'rahagyas')/100)/1000;
else if(f==='vakolat')r=am('terulet')*lm('reteg')*val(d,'suruseg')*(1+val(d,'rahagyas')/100);
else if(f==='aljzat')r=am('terulet')*lm('vastagsag')*(1+val(d,'rahagyas')/100);
else if(f==='zsaluko')r=(lm('fal_hossz')*lm('fal_magassag'))/(lm('elem_hossz')*lm('elem_magassag'))*(1+val(d,'rahagyas')/100);
else if(f==='betonacel')r=lm('szal_hossz')*val(d,'szal_db')*val(d,'kg_meter')*(1+val(d,'rahagyas')/100);
else if(f==='lepcso'){const h=lm('szintmagassag'),n=Math.max(1,Math.round(h/lm('fokmagassag'))),actual=h/n,run=n*lm('fokmelyseg');r=n;details=[`Kiszámított fokmagasság: ${fmt(actual*100,1)} cm`,`Vízszintes hossz: ${fmt(run,2)} m`];return [`${Math.ceil(r)} db`,details]}
else if(f==='ohm'){const u=d.feszultseg===''?null:Number(d.feszultseg),i=d.aram===''?null:Number(d.aram),z=d.ellenallas===''?null:Number(d.ellenallas);if([u,i,z].filter(x=>x!==null&&!Number.isNaN(x)).length!==2)throw new Error('Az Ohm-törvénynél pontosan 2 értéket adj meg.');if(z===null) return [`Ellenállás: ${fmt(u/i,4)} Ω`,[]];if(i===null)return [`Áramerősség: ${fmt(u/z,4)} A`,[]];return [`Feszültség: ${fmt(i*z,4)} V`,[]]}
else if(f==='power')return [`${fmt(val(d,'feszultseg')*val(d,'aram'))} W`,[]];
else if(f==='fogyasztas'){const e=val(d,'teljesitmeny')*th('ido'),cost=e*val(d,'ar');return [`${fmt(cost,0)} Ft`,[`Energia: ${fmt(e,2)} kWh`]]}
else if(f==='kwh')return [`${fmt(val(d,'teljesitmeny')*th('ido')/1000,3)} kWh`,[]];
else if(f==='kabel')return [`${fmt(lm('nyomvonal')*(1+val(d,'rahagyas')/100))} m`,[]];
else if(f==='drop')return [`${fmt(val(d,'aram')*lm('hossz')*val(d,'ellenallas'),3)} V`,[]];
else if(f==='wall')r=lm('hossz')*lm('magassag')-am('nyilasok');
else if(f==='ceiling')r=lm('hossz')*lm('szelesseg');
else if(f==='paint')r=am('terulet')*val(d,'reteg')/val(d,'fedokepesseg')*(1+val(d,'rahagyas')/100)*0.001;
else if(f==='primer')r=am('terulet')/val(d,'fedokepesseg')*(1+val(d,'rahagyas')/100)*0.001;
else if(f==='tile')r=am('terulet')/(lm('lap_hossz')*lm('lap_szelesseg'))*(1+val(d,'rahagyas')/100),details.push(`Elméleti mennyiség: ${fmt(r)} db`),r=Math.ceil(r);
else if(f==='material')r=am('terulet')*val(d,'anyagigeny')*(1+val(d,'rahagyas')/100);
else if(f==='skirting')r=lm('hossz')/lm('elem')*(1+val(d,'rahagyas')/100),r=Math.ceil(r);
else if(f==='roof')r=lm('tetohossz')*lm('fel_szelesseg')/Math.cos(val(d,'szog')*Math.PI/180);
else if(f==='angle')return [`${fmt(Math.atan2(lm('magassag'),lm('futas'))*180/Math.PI)}°`,[]];
else if(f==='rafter'){const l=Math.hypot(lm('magassag'),lm('futas')),n=Math.ceil(lm('tetohossz')/lm('osztas'))+1;return [`${fmt(l)} m / db`,[`Becsült darabszám: ${n} db`]]}
else if(f==='lath'){const rows=Math.ceil(lm('tetosik')/lm('osztas'))+1;return [`${fmt(rows*lm('tetohossz'))} m`,[`Lécek sora: ${rows} db`]]}
else if(f==='timber')r=lm('hossz')*lm('szelesseg')*lm('vastagsag')*val(d,'darab');
else if(f==='tiles')r=am('terulet')*val(d,'db_m2')*(1+val(d,'rahagyas')/100),r=Math.ceil(r);
else if(f==='fuel'){const km=lm('tavolsag')/1000,liters=km*val(d,'fogyasztas')/100,cost=liters*val(d,'ar');return [`${fmt(cost,0)} Ft`,[`Üzemanyag: ${fmt(liters)} l`]]}
else if(f==='range')r=vm('uzemanyag')*1000/val(d,'fogyasztas')*100;
else if(f==='oil')return [`${fmt(vm('mennyiseg')*1000*val(d,'ar'),0)} Ft`,[]];
else if(f==='wheel')return [`${fmt(lm('tavolsag')/(Math.PI*lm('atmero')),0)} fordulat`,[]];
else if(f==='ratio')return [`${fmt(val(d,'bemenet')/val(d,'kimenet'),3)}:1`,[]];
else if(f==='brake')r=(val(d,'sebesseg')/3.6)**2/(2*val(d,'tapadas')*9.81);
else if(f==='area')r=lm('hossz')*lm('szelesseg');
else if(f==='volume')r=lm('hossz')*lm('szelesseg')*lm('magassag');
else if(f==='percent')return [fmt(val(d,'ertek')*val(d,'szazalek')/100),[]];
else if(f==='vat'){const tax=val(d,'osszeg')*val(d,'afa')/100;return [`${fmt(val(d,'osszeg')+tax,0)} Ft`,[`ÁFA összege: ${fmt(tax,0)} Ft`]]}
else if(f==='discount')return [`${fmt(val(d,'ar')*(1-val(d,'kedvezmeny')/100),0)} Ft`,[]];
else if(f==='unit')return [`${fmt(val(d,'ar')/val(d,'mennyiseg'))} Ft/db`,[]];
else throw new Error('Ismeretlen számítás.');
const c=findCalc(id);return [result(r,c.result_type,d),details]}
$('#categories').innerHTML=D.CATEGORIES.map(c=>`<button class="category" data-id="${c.id}" type="button"><span>${c.icon}</span><strong>${esc(c.name)}</strong><small>${c.calculators.length} számoló</small></button>`).join('');
document.querySelectorAll('.category').forEach(b=>b.onclick=()=>openCategory(b.dataset.id));
$('#calcForm').onsubmit=e=>{e.preventDefault();const c=findCalc(currentCalc),d=formData();const values=Object.entries(d).filter(([k,v])=>!k.endsWith('_unit')&&k!=='result_unit'&&v!=='');if(c.exact_two&&values.length!==2){alert('Az Ohm-törvénynél pontosan 2 értéket adj meg.');return}const btn=e.submitter;btn.disabled=true;btn.textContent='Számolás…';try{const [main,details]=calculate(currentCalc,d);$('#resultMain').textContent=main;$('#resultDetails').innerHTML=(details||[]).map(x=>`<div>${esc(x)}</div>`).join('')+(c.warning?`<div class="warning">⚠️ ${esc(c.warning)}</div>`:'');$('#result').classList.remove('hidden')}catch(err){alert(err.message)}finally{btn.disabled=false;btn.textContent='🧮 Számolás'}};
$('#again').onclick=()=>openCalculator(currentCalc);$('#backCalc').onclick=()=>openCategory(currentCategory);$('#backCategory').onclick=()=>show('home');$('#homeBtn').onclick=()=>show('home');
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;$('#installBtn').classList.remove('hidden')});
$('#installBtn').onclick=async()=>{if(deferredInstallPrompt){deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;$('#installBtn').classList.add('hidden')}};
window.addEventListener('appinstalled',()=>$('#installBtn').classList.add('hidden'));
if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
