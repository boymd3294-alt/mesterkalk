'use strict';

/* =========================================================
   MESTERKALK 150+
   A számítások böngészőben, helyben történnek.
   ========================================================= */

const U={
 length:[['mm','mm'],['cm','cm'],['dm','dm'],['m','m'],['km','km']],
 area:[['mm2','mm²'],['cm2','cm²'],['dm2','dm²'],['m2','m²'],['km2','km²'],['ha','ha']],
 volume:[['mm3','mm³'],['cm3','cm³'],['dm3','dm³'],['l','liter'],['m3','m³']],
 mass:[['mg','mg'],['g','g'],['kg','kg'],['t','t']],
 time:[['sec','mp'],['min','perc'],['h','óra'],['day','nap']]
};
const T={
 length:{mm:.001,cm:.01,dm:.1,m:1,km:1000},
 area:{mm2:1e-6,cm2:1e-4,dm2:.01,m2:1,km2:1e6,ha:1e4},
 volume:{mm3:1e-9,cm3:1e-6,dm3:.001,l:.001,m3:1},
 mass:{mg:1e-6,g:.001,kg:1,t:1000},
 time:{sec:1/3600,min:1/60,h:1,day:24}
};
const L={length:{mm:'mm',cm:'cm',dm:'dm',m:'m',km:'km'},area:{mm2:'mm²',cm2:'cm²',dm2:'dm²',m2:'m²',km2:'km²',ha:'ha'},volume:{mm3:'mm³',cm3:'cm³',dm3:'dm³',l:'liter',m3:'m³'},mass:{mg:'mg',g:'g',kg:'kg',t:'t'}};

const C={};
const categories=[];

function addCat(id,name,icon,items){
  categories.push({id,name,icon,calculators:items});
}
function add(id,name,icon,fields,formula,result_type,help='',warning=''){
  C[id]={id,name,icon,fields,formula,result_type,help,warning};
}
const F=(id,label,unit,def='')=>({id,label,unit,default:def});
const LU=(id,label,defUnit='m',def='')=>({id,label,unit_type:'length',default_unit:defUnit,default:def});
const AU=(id,label,defUnit='m2',def='')=>({id,label,unit_type:'area',default_unit:defUnit,default:def});
const VU=(id,label,defUnit='m3',def='')=>({id,label,unit_type:'volume',default_unit:defUnit,default:def});
const MU=(id,label,defUnit='kg',def='')=>({id,label,unit_type:'mass',default_unit:defUnit,default:def});
const TU=(id,label,defUnit='h',def='')=>({id,label,unit_type:'time',default_unit:defUnit,default:def});

/* ---------- KŐMŰVES ---------- */
addCat('komuves','Kőműves','🧱',['beton','betonalap','savalap','alapagerenda','pillér','koszoru','betonpumpa','cement','homok','kavics','soder','fold','tegla','falazat','zsaluko','betonacel','betonhalo','habarcs','vakolat','aljzatbeton','esztrich','lepcso','betonlepcso','fodem','tetoalap']);
add('beton','Beton','🧱',[LU('hossz','Hosszúság'),LU('szelesseg','Szélesség'),LU('vastagsag','Vastagság','cm'),F('rahagyas','Ráhagyás','%',5)],'volumeAdd','volume','Beton térfogata ráhagyással.');
add('betonalap','Betonalap','🏗️',[LU('hossz','Alap hossza'),LU('szelesseg','Alap szélessége'),LU('vastagsag','Alap vastagsága','cm'),F('rahagyas','Ráhagyás','%',5)],'volumeAdd','volume');
add('savalap','Sávalap beton','🏗️',[LU('hossz','Teljes alap hossza'),LU('szelesseg','Alap szélessége','cm'),LU('magassag','Alap magassága','cm'),F('rahagyas','Ráhagyás','%',5)],'volume3','volume');
add('alapagerenda','Alapárok','⛏️',[LU('hossz','Árok hossza'),LU('szelesseg','Árok szélessége','cm'),LU('melyseg','Árok mélysége','cm'),F('rahagyas','Ráhagyás','%',10)],'volume3','volume');
add('pillér','Betonpillér','🏛️',[F('db','Pillérek száma','db',1),LU('szelesseg','Pillér szélessége','cm'),LU('melyseg','Pillér mélysége','cm'),LU('magassag','Pillér magassága','m'),F('rahagyas','Ráhagyás','%',5)],'pillar','volume');
add('koszoru','Koszorú beton','🏗️',[LU('hossz','Koszorú hossza'),LU('szelesseg','Koszorú szélessége','cm'),LU('magassag','Koszorú magassága','cm'),F('rahagyas','Ráhagyás','%',5)],'volume3','volume');
add('betonpumpa','Betonpumpa / mixer mennyiség','🚚',[VU('beton','Szükséges beton','m3'),F('mixer','Egy mixer kapacitása','m³',7)],'loads','mixed');
add('cement','Cement mennyiség betonhoz','🪣',[VU('beton','Beton térfogata','m3'),F('cement_m3','Cementigény','kg/m³',300),F('zsak','Egy zsák tömege','kg',25),F('rahagyas','Ráhagyás','%',5)],'cement','mass');
add('homok','Homok mennyisége','🏖️',[VU('anyag','Kész beton / habarcs térfogata','m3'),F('anyagigeny','Homokigény','kg/m³',700),F('rahagyas','Ráhagyás','%',5)],'massNeed','mass');
add('kavics','Kavics mennyisége','🪨',[VU('anyag','Kész beton térfogata','m3'),F('anyagigeny','Kavicsigény','kg/m³',1000),F('rahagyas','Ráhagyás','%',5)],'massNeed','mass');
add('soder','Sóder köbméterből tonna','🪨',[VU('terfogat','Sóder térfogata','m3'),F('suruseg','Ömlesztett sűrűség','kg/m³',1700)],'density','mass');
add('fold','Földkitermelés','⛏️',[LU('hossz','Hossz'),LU('szelesseg','Szélesség'),LU('melyseg','Mélység','cm'),F('lazitas','Lazulás','%',20)],'earth','volume');
add('tegla','Tégla darabszám','🧱',[LU('fal_hossz','Fal hossza'),LU('fal_magassag','Fal magassága'),LU('tegla_hossz','Tégla hossza','cm'),LU('tegla_szelesseg','Tégla szélessége','cm'),LU('fuga','Fuga vastagsága','cm',1),F('rahagyas','Ráhagyás','%',5)],'brick','count');
add('falazat','Falazat térfogata','🧱',[LU('hossz','Fal hossza'),LU('magassag','Fal magassága'),LU('vastagsag','Falvastagság','cm')],'volume3','volume');
add('zsaluko','Zsalukő darabszám','🧱',[LU('fal_hossz','Fal hossza'),LU('fal_magassag','Fal magassága'),LU('elem_hossz','Elem hossza','cm',50),LU('elem_magassag','Elem magassága','cm',20),F('rahagyas','Ráhagyás','%',5)],'block','count');
add('betonacel','Betonacél tömege','🔩',[LU('szal_hossz','Egy szál hossza','m',6),F('szal_db','Szálak száma','db',1),F('kg_meter','Tömeg méterenként','kg/m'),F('rahagyas','Ráhagyás','%',5)],'steel','mass');
add('betonhalo','Betonháló darabszám','▦',[AU('terulet','Burkolandó / betonozandó felület'),F('halo_hossz','Egy háló hossza','m',5),F('halo_szelesseg','Egy háló szélessége','m',2),F('rahagyas','Ráhagyás','%',10)],'mesh','count');
add('habarcs','Habarcs mennyiség','🪣',[AU('terulet','Falazat felülete'),F('anyagigeny','Anyagigény','l/m²',25),F('rahagyas','Ráhagyás','%',5)],'litersArea','volume');
add('vakolat','Vakolat tömege','🧱',[AU('terulet','Felület'),LU('reteg','Rétegvastagság','mm',15),F('suruseg','Anyag sűrűsége','kg/m³',1600),F('rahagyas','Ráhagyás','%',5)],'plaster','mass');
add('aljzatbeton','Aljzatbeton','🏗️',[AU('terulet','Felület'),LU('vastagsag','Vastagság','cm',6),F('rahagyas','Ráhagyás','%',5)],'areaThick','volume');
add('esztrich','Esztrich anyag','🏗️',[AU('terulet','Felület'),LU('vastagsag','Rétegvastagság','mm',50),F('anyagigeny','Anyagigény','kg/m²/mm',1.8),F('rahagyas','Ráhagyás','%',5)],'screed','mass');
add('lepcso','Lépcső fokszám','🪜',[LU('szintmagassag','Szintmagasság','cm'),LU('fokmagassag','Tervezett fokmagasság','cm',17),LU('fokmelyseg','Fokmélység','cm',28),LU('szelesseg','Lépcső szélessége','cm',100)],'stairs','mixed');
add('betonlepcso','Betonlépcső térfogata','🪜',[F('fok','Fokok száma','db'),LU('magassag','Fokmagasság','cm',17),LU('melyseg','Fokmélység','cm',28),LU('szelesseg','Szélesség','cm',100)],'stepConcrete','volume');
add('fodem','Födém beton','🏗️',[AU('terulet','Födém felülete'),LU('vastagsag','Födém vastagsága','cm',15),F('rahagyas','Ráhagyás','%',5)],'areaThick','volume');
add('tetoalap','Alapozási beton költség','🏗️',[VU('beton','Beton mennyisége','m3'),F('ar','Beton egységára','Ft/m³')],'cost','money');

/* ---------- VILLANY ---------- */
addCat('villany','Villanyszerelő','⚡',['ohm','teljesitmeny','haromfazis','aramfelvetel','fogyasztas','kwh','kabelhossz','feszultsegeses','vezetékellenallas','biztositek','vezetekveszteseg','napiFogyasztas','haviFogyasztas','evesFogyasztas','kabelDob','wattAmper','amperWatt','ellenallasSor','ellenallasParhuzam']);
add('ohm','Ohm-törvény','⚡',[F('feszultseg','Feszültség','V'),F('aram','Áramerősség','A'),F('ellenallas','Ellenállás','Ω')],'ohm','mixed','Pontosan 2 értéket adj meg.');
C.ohm.exact_two=true;
add('teljesitmeny','Teljesítmény','⚡',[F('feszultseg','Feszültség','V'),F('aram','Áramerősség','A')],'power','power');
add('haromfazis','Háromfázisú teljesítmény','⚡',[F('feszultseg','Fázisfeszültség','V',230),F('aram','Áramerősség','A'),F('cosphi','Teljesítménytényező cosφ','',0.9)],'threePower','power');
add('aramfelvetel','Áramfelvétel','🔌',[F('teljesitmeny','Teljesítmény','W'),F('feszultseg','Feszültség','V',230)],'current','mixed');
add('fogyasztas','Fogyasztás költsége','💡',[F('teljesitmeny','Teljesítmény','kW'),TU('ido','Üzemidő','h',1),F('ar','Villamos energia ára','Ft/kWh')],'energyCost','money');
add('kwh','Energiafogyasztás','🔋',[F('teljesitmeny','Teljesítmény','W'),TU('ido','Idő','h',1)],'kwh','energy');
add('kabelhossz','Kábelhossz ráhagyással','🔌',[LU('nyomvonal','Nyomvonal'),F('rahagyas','Ráhagyás','%',10)],'cable','length');
add('feszultsegeses','Feszültségesés','⚡',[F('aram','Áramerősség','A'),LU('hossz','Vezeték hossza'),F('ellenallas','Ellenállás','Ω/m')],'drop','mixed','','Egyszerűsített számítás; a valós méretezéshez a vezeték keresztmetszete, anyaga, hőmérséklet, szerelési mód és előírások is szükségesek.');
add('vezetékellenallas','Vezeték ellenállása','🔌',[F('ro','Anyag fajlagos ellenállása','Ω·mm²/m',0.0175),LU('hossz','Vezeték hossza','m'),F('keresztmetszet','Keresztmetszet','mm²',2.5)],'wireR','mixed');
add('biztositek','Biztosító becsült terhelése','🧯',[F('teljesitmeny','Terhelés','W'),F('feszultseg','Feszültség','V',230)],'fuse','mixed','','Ez csak terhelési áram számítás; a védelmi eszköz kiválasztása villamos tervezési feladat.');
add('vezetekveszteseg','Vezeték teljesítményveszteség','⚡',[F('aram','Áramerősség','A'),F('ellenallas','Vezeték ellenállása','Ω')],'loss','power');
add('napiFogyasztas','Napi fogyasztás','🔋',[F('teljesitmeny','Teljesítmény','W'),TU('ido','Napi üzemidő','h',1)],'kwh','energy');
add('haviFogyasztas','Havi fogyasztás','🔋',[F('teljesitmeny','Teljesítmény','W'),TU('ido','Napi üzemidő','h',1),F('nap','Napok száma','db',30)],'monthlyKwh','energy');
add('evesFogyasztas','Éves fogyasztás','🔋',[F('teljesitmeny','Teljesítmény','W'),TU('ido','Napi üzemidő','h',1),F('nap','Napok száma','db',365)],'yearlyKwh','energy');
add('kabelDob','Kábeltekercs darabszám','🔌',[LU('hossz','Szükséges kábelhossz'),F('tekercs','Egy tekercs hossza','m',100),F('rahagyas','Ráhagyás','%',5)],'rolls','count');
add('wattAmper','Watt → Amper','⚡',[F('watt','Teljesítmény','W'),F('volt','Feszültség','V',230)],'current','mixed');
add('amperWatt','Amper → Watt','⚡',[F('amper','Áramerősség','A'),F('volt','Feszültség','V',230)],'watt','power');
add('ellenallasSor','Ellenállások sorosan','🔗',[F('r1','R1','Ω'),F('r2','R2','Ω'),F('r3','R3','Ω',0)],'seriesR','mixed');
add('ellenallasParhuzam','Ellenállások párhuzamosan','🔗',[F('r1','R1','Ω'),F('r2','R2','Ω'),F('r3','R3','Ω',0)],'parallelR','mixed');

/* ---------- FESTŐ ---------- */
addCat('festo','Festő','🎨',['falfelulet','mennyezet','festek','alapozo','glett','glettzsak','csiszolo','festesKoltseg','alapozasKoltseg','szalag','festoFolia','ajtoFestek','radiatorFestek','keritesFestek']);
add('falfelulet','Falfelület','🎨',[LU('hossz','Fal hossza'),LU('magassag','Fal magassága'),AU('nyilasok','Ajtók/ablakok összesen','m2',0)],'wall','area');
add('mennyezet','Mennyezet','⬜',[LU('hossz','Hosszúság'),LU('szelesseg','Szélesség')],'area2','area');
add('festek','Festék mennyisége','🎨',[AU('terulet','Festendő felület'),F('reteg','Rétegek','db',2),F('fedokepesseg','Fedőképesség','m²/l',10),F('rahagyas','Ráhagyás','%',10)],'paint','volume');
add('alapozo','Alapozó','🪣',[AU('terulet','Felület'),F('fedokepesseg','Fedőképesség','m²/l',8),F('rahagyas','Ráhagyás','%',10)],'primer','volume');
add('glett','Glett anyag','🪣',[AU('terulet','Felület'),LU('reteg','Átlagos rétegvastagság','mm',2),F('suruseg','Sűrűség','kg/m³',900),F('rahagyas','Ráhagyás','%',10)],'plaster','mass');
add('glettzsak','Glett zsákok','🪣',[F('kg','Szükséges anyag','kg'),F('zsak','Zsák tömege','kg',20),F('rahagyas','Ráhagyás','%',5)],'bags','count');
add('csiszolo','Csiszolópapír darabszám','🧽',[AU('terulet','Felület'),F('fed','Egy lap lefedése','m²',2),F('reteg','Csiszolási körök','db',2),F('rahagyas','Ráhagyás','%',10)],'sanding','count');
add('festesKoltseg','Festés anyagköltség','💰',[AU('terulet','Felület'),F('liter','Festékigény','l/m²',0.1),F('ar','Festék ára','Ft/l'),F('munkadij','Munkadíj','Ft/m²',0)],'paintCost','money');
add('alapozasKoltseg','Alapozás költsége','💰',[AU('terulet','Felület'),F('liter','Alapozóigény','l/m²',0.12),F('ar','Alapozó ára','Ft/l')],'primerCost','money');
add('szalag','Maszkolószalag','📏',[LU('hossz','Maszkolandó hossz'),F('tekercs','Egy tekercs hossza','m',50),F('rahagyas','Ráhagyás','%',10)],'rolls','count');
add('festoFolia','Festőfólia','🧻',[AU('terulet','Védendő felület'),F('meret','Egy fólia csomag lefedése','m²',20),F('rahagyas','Ráhagyás','%',10)],'packsArea','count');
add('ajtoFestek','Ajtó festék','🚪',[F('db','Ajtók száma','db',1),F('liter','Egy ajtóra szükséges festék','l',0.3),F('reteg','Rétegek','db',2),F('rahagyas','Ráhagyás','%',10)],'simpleLiters','volume');
add('radiatorFestek','Radiátorfesték','♨️',[F('db','Radiátorok száma','db',1),F('liter','Festék radiátoronként','l',0.2),F('reteg','Rétegek','db',2),F('rahagyas','Ráhagyás','%',10)],'simpleLiters','volume');
add('keritesFestek','Kerítésfesték','🚧',[AU('terulet','Kerítés felülete'),F('liter','Festékigény','l/m²',0.12),F('reteg','Rétegek','db',2),F('rahagyas','Ráhagyás','%',10)],'simpleAreaLiters','volume');

/* ---------- BURKOLÓ ---------- */
addCat('burkolo','Burkoló','▦',['csempe','fuga','ragaszto','labazat','szegely','szintezo','terkő','terkőHomok','terasz','diagonal','lapDoboz','ragasztoZsak','fugaZsak','burkolasKoltseg','szegelyKoltseg','lepcsoBurkolas']);
add('csempe','Csempe / járólap','▦',[AU('terulet','Burkolandó felület'),LU('lap_hossz','Lap hossza','cm'),LU('lap_szelesseg','Lap szélessége','cm'),F('rahagyas','Vágási ráhagyás','%',10)],'tile','count');
add('fuga','Fugázóanyag','▦',[AU('terulet','Felület'),F('anyagigeny','Anyagigény','kg/m²',1),F('rahagyas','Ráhagyás','%',10)],'material','mass');
add('ragaszto','Csemperagasztó','🪣',[AU('terulet','Felület'),F('anyagigeny','Anyagigény','kg/m²',4),F('rahagyas','Ráhagyás','%',10)],'material','mass');
add('labazat','Lábazat elem','📏',[LU('hossz','Összes hossz'),LU('elem','Egy elem hossza','cm',60),F('rahagyas','Ráhagyás','%',5)],'piecesLength','count');
add('szegely','Szegélyléc','📏',[LU('hossz','Összes hossz'),LU('elem','Egy elem hossza','m',2.5),F('rahagyas','Ráhagyás','%',10)],'piecesLength','count');
add('szintezo','Burkolási szintező','▦',[AU('terulet','Burkolandó felület'),F('lap','Egy lap területe','m²',0.09),F('db','Szintező szükséglet / lap','db',4),F('rahagyas','Ráhagyás','%',5)],'leveling','count');
add('terkő','Térkő darabszám','🧱',[AU('terulet','Burkolandó felület'),F('db_m2','Térkő igény','db/m²',40),F('rahagyas','Ráhagyás','%',7)],'areaPieces','count');
add('terkőHomok','Térkő ágyazóanyag','🏖️',[AU('terulet','Felület'),LU('vastagsag','Ágyazat vastagsága','cm',4),F('rahagyas','Ráhagyás','%',10)],'areaThick','volume');
add('terasz','Terasz burkolat','▦',[LU('hossz','Terasz hossza'),LU('szelesseg','Terasz szélessége'),F('rahagyas','Ráhagyás','%',10)],'areaWaste','area');
add('diagonal','Diagonál burkolás ráhagyása','📐',[AU('terulet','Felület'),F('rahagyas','Extra ráhagyás','%',15)],'waste','area');
add('lapDoboz','Lap dobozok','📦',[AU('terulet','Burkolandó felület'),F('doboz','Egy doboz lefedése','m²',1.44),F('rahagyas','Ráhagyás','%',10)],'boxesArea','count');
add('ragasztoZsak','Ragasztó zsákok','🪣',[F('kg','Szükséges ragasztó','kg'),F('zsak','Zsák tömege','kg',25),F('rahagyas','Ráhagyás','%',5)],'bags','count');
add('fugaZsak','Fugázó zsákok','🪣',[F('kg','Szükséges fugázó','kg'),F('zsak','Zsák tömege','kg',5),F('rahagyas','Ráhagyás','%',5)],'bags','count');
add('burkolasKoltseg','Burkolás költsége','💰',[AU('terulet','Burkolandó felület'),F('anyag','Anyagköltség','Ft/m²'),F('munkadij','Munkadíj','Ft/m²')],'areaCost','money');
add('szegelyKoltseg','Szegélyezés költsége','💰',[LU('hossz','Szegély hossza'),F('anyag','Anyagár','Ft/m'),F('munkadij','Munkadíj','Ft/m')],'lengthCost','money');
add('lepcsoBurkolas','Lépcső burkolási terület','🪜',[F('fok','Fokok száma','db'),LU('szelesseg','Lépcső szélessége','cm',100),LU('fokmelyseg','Fokmélység','cm',28),LU('fokmagassag','Fokmagasság','cm',17)],'stairArea','area');

/* ---------- ÁCS / TETŐ ---------- */
addCat('acs','Ács / Tető','🪚',['tetofelulet','hajlasszog','szarufa','lecezes','faanyag','cserep','ellenlec','tetofolia','osb','gerenda','faSuly','tetőCsavar','eresz','csatorna','oromfal','tetőKoltseg','szigetelesTető','deszka']);
add('tetofelulet','Tetőfelület','🏠',[LU('tetohossz','Tető hossza'),LU('fel_szelesseg','Fél tetőszélesség / vízszintes vetület'),F('szog','Tető hajlásszöge','°')],'roof','area');
add('hajlasszog','Tető hajlásszöge','📐',[LU('magassag','Emelkedés'),LU('futas','Vízszintes futás')],'angle','angle');
add('szarufa','Szarufa','🪚',[LU('magassag','Emelkedés'),LU('futas','Vízszintes futás'),LU('tetohossz','Tető hossza'),LU('osztas','Szarufa osztás','cm',80)],'rafter','mixed');
add('lecezes','Lécezés','🪚',[LU('tetohossz','Tető hossza'),LU('tetosik','Tetősík hossza'),LU('osztas','Lécosztás','cm',35)],'lath','length');
add('faanyag','Faanyag köbméter','🪵',[LU('hossz','Hosszúság'),LU('szelesseg','Szélesség','cm'),LU('vastagsag','Vastagság','cm'),F('darab','Darabszám','db',1)],'timber','volume');
add('cserep','Cserép','🏠',[AU('terulet','Tetőfelület'),F('db_m2','Cserépigény','db/m²',12),F('rahagyas','Ráhagyás','%',10)],'areaPieces','count');
add('ellenlec','Ellenléc','🪚',[LU('sor','Tetősík hossza'),LU('tetohossz','Tető hossza'),F('rahagyas','Ráhagyás','%',10)],'counterbatten','length');
add('tetofolia','Tetőfólia','🧻',[AU('terulet','Tetőfelület'),F('tekercs','Egy tekercs lefedése','m²',75),F('rahagyas','Ráhagyás','%',10)],'boxesArea','count');
add('osb','OSB lap darabszám','🪵',[AU('terulet','Burkolandó felület'),F('lap_hossz','OSB lap hossza','m',2.5),F('lap_szelesseg','OSB lap szélessége','m',1.25),F('rahagyas','Ráhagyás','%',10)],'sheet','count');
add('gerenda','Gerenda köbméter','🪵',[LU('hossz','Gerenda hossza'),LU('szelesseg','Szélesség','cm'),LU('magassag','Magasság','cm'),F('db','Darabszám','db',1)],'timber3','volume');
add('faSuly','Faanyag tömege','⚖️',[VU('terfogat','Faanyag térfogata','m3'),F('suruseg','Sűrűség','kg/m³',500)],'density','mass');
add('tetőCsavar','Tetőcsavar','🔩',[AU('terulet','Tetőfelület'),F('db_m2','Csavarigény','db/m²',8),F('rahagyas','Ráhagyás','%',10)],'areaPieces','count');
add('eresz','Eresz hossza','📏',[LU('hossz','Ereszszakasz 1'),LU('hossz2','Ereszszakasz 2','m',0),F('rahagyas','Ráhagyás','%',5)],'twoLength','length');
add('csatorna','Csatorna elemek','🚿',[LU('hossz','Csatorna teljes hossza'),F('elem','Egy elem hossza','m',4),F('rahagyas','Ráhagyás','%',5)],'piecesLength','count');
add('oromfal','Oromfal felülete','🏠',[LU('szelesseg','Oromfal szélessége'),LU('magassag','Oromfal magassága'),F('forma','Tetőforma','',1)],'triangle','area');
add('tetőKoltseg','Tető anyagköltség','💰',[AU('terulet','Tetőfelület'),F('anyag','Anyagköltség','Ft/m²'),F('munkadij','Munkadíj','Ft/m²')],'areaCost','money');
add('szigetelesTető','Tetőszigetelés','🧊',[AU('terulet','Szigetelendő felület'),LU('vastagsag','Szigetelés vastagsága','cm',20)],'insulationVol','volume');
add('deszka','Deszka darabszám','🪵',[LU('hossz','Deszka hossza'),F('szelesseg','Deszka szélessége','m',0.1),F('osztas','Elhelyezési osztás','m',0.4),F('rahagyas','Ráhagyás','%',10)],'boards','count');

/* ---------- AUTÓ ---------- */
addCat('auto','Autó','🚗',['uzemanyag','hatotav','utkoltseg','olaj','kerekfordulat','attetel','fekut','gyorsulas','fordulatszam','sebessegAtetel','gumikerulet','guminyomas','szerviz','utIdo','co2','akkumulator','akkuToltes','fékenergia']);
add('uzemanyag','Üzemanyagköltség','⛽',[LU('tavolsag','Távolság','km'),F('fogyasztas','Fogyasztás','l/100 km'),F('ar','Üzemanyag ára','Ft/l')],'fuel','money');
add('hatotav','Hatótáv','⛽',[VU('uzemanyag','Üzemanyag mennyisége','l'),F('fogyasztas','Fogyasztás','l/100 km')],'range','length');
add('utkoltseg','Útiköltség','🚗',[LU('tavolsag','Távolság','km'),F('fogyasztas','Fogyasztás','l/100 km'),F('ar','Üzemanyag ára','Ft/l')],'fuel','money');
add('olaj','Olajcsere költsége','🛢️',[VU('mennyiseg','Olaj mennyisége','l'),F('ar','Olaj ára','Ft/l')],'oil','money');
add('kerekfordulat','Kerékfordulat','⭕',[LU('atmero','Kerék átmérője'),LU('tavolsag','Megtett távolság')],'wheel','count');
add('attetel','Áttétel','⚙️',[F('bemenet','Bemeneti fordulatszám','1/min'),F('kimenet','Kimeneti fordulatszám','1/min')],'ratio','ratio');
add('fekut','Elméleti fékút','🛑',[F('sebesseg','Sebesség','km/h'),F('tapadas','Tapadási tényező μ','',0.7)],'brake','length','','Egyszerűsített elméleti becslés; a valós fékút függ az úttól, gumitól, ABS-től és reakcióidőtől.');
add('gyorsulas','Gyorsulás','🏁',[F('v1','Kezdő sebesség','km/h',0),F('v2','Végsebesség','km/h'),F('ido','Idő','s')],'accel','mixed');
add('fordulatszam','Motorfordulat áttétellel','⚙️',[F('kerék','Kerékfordulat','1/min'),F('attetel','Összáttétel','',4),F('differencial','Differenciál áttétel','',3.5)],'rpm','mixed');
add('sebessegAtetel','Sebesség kerékfordulatból','🚗',[F('rpm','Kerék fordulatszám','1/min'),LU('atmero','Kerék átmérője'),F('valt','Váltó/áttétel','',1)],'speed','length');
add('gumikerulet','Gumi kerülete','⭕',[LU('atmero','Kerék átmérője')],'circumference','length');
add('guminyomas','Gumi nyomás terhelési összegzés','🛞',[F('elso','Első tengely nyomása','bar'),F('hatso','Hátsó tengely nyomása','bar')],'pressureSum','mixed');
add('szerviz','Szervizköltség','🔧',[F('anyag','Anyagköltség','Ft'),F('munkadij','Munkadíj','Ft'),F('egyeb','Egyéb költség','Ft',0)],'sum3','money');
add('utIdo','Utazási idő','🕐',[LU('tavolsag','Távolság','km'),F('sebesseg','Átlagsebesség','km/h')],'travelTime','time');
add('co2','CO₂-kibocsátás becslése','🌱',[LU('tavolsag','Távolság','km'),F('fogyasztas','Fogyasztás','l/100 km'),F('co2','CO₂ / liter','kg/l',2.31)],'co2','mass');
add('akkumulator','Akkumulátor kapacitás','🔋',[F('ah','Kapacitás','Ah'),F('volt','Feszültség','V',12)],'batteryEnergy','energy');
add('akkuToltes','Akkumulátor töltési idő','🔋',[F('ah','Kapacitás','Ah'),F('tolt','Töltőáram','A'),F('veszteseg','Veszteség','%',15)],'chargeTime','time');
add('fékenergia','Fékezési mozgási energia','🛑',[F('tomeg','Jármű tömege','kg'),F('sebesseg','Sebesség','km/h')],'kinetic','energy');

/* ---------- OTTHON ---------- */
addCat('otthon','Otthon','🏠',['terulet','terfogat','kerulet','szazalek','afa','kedvezmeny','egysegar','haromszog','kor','korulet','trapez','pitagorasz','atvaltasHossz','atvaltasTerulet','atvaltasTerfogat','atvaltasTomeg','atvaltasIdo','anyagKoltseg','munkadij','haszonkulcs','arres','bruttoNetto','nettoBrutto','futes','legkobmeter','ablakTerulet','szobaFestek','helyiseg']);
add('terulet','Terület','📐',[LU('hossz','Hosszúság'),LU('szelesseg','Szélesség')],'area2','area');
add('terfogat','Térfogat','📦',[LU('hossz','Hosszúság'),LU('szelesseg','Szélesség'),LU('magassag','Magasság')],'volume3','volume');
add('kerulet','Téglalap kerülete','📐',[LU('hossz','Hosszúság'),LU('szelesseg','Szélesség')],'perimeter','length');
add('szazalek','Százalék értéke','%',[F('ertek','Alapérték',''),F('szazalek','Százalék','%')],'percent','number');
add('afa','ÁFA hozzáadása','💰',[F('osszeg','Nettó összeg','Ft'),F('afa','ÁFA','%',27)],'vat','money');
add('kedvezmeny','Kedvezmény','🏷️',[F('ar','Eredeti ár','Ft'),F('kedvezmeny','Kedvezmény','%')],'discount','money');
add('egysegar','Egységár','💵',[F('ar','Összes ár','Ft'),F('mennyiseg','Mennyiség','db')],'unit','money');
add('haromszog','Háromszög területe','🔺',[LU('alap','Alap'),LU('magassag','Magasság')],'triangleArea','area');
add('kor','Kör területe','⭕',[LU('sugar','Sugár')],'circleArea','area');
add('korulet','Kör kerülete','⭕',[LU('sugar','Sugár')],'circlePerimeter','length');
add('trapez','Trapéz területe','📐',[LU('a','Alsó alap'),LU('b','Felső alap'),LU('magassag','Magasság')],'trapezoid','area');
add('pitagorasz','Pitagorasz-tétel','📐',[LU('a','Befogó a'),LU('b','Befogó b')],'pythagoras','length');
add('atvaltasHossz','Hossz átváltása','↔️',[F('ertek','Érték',''),F('egyseg','Forrás egység','m'),F('cel','Cél egység','cm')],'convertLength','mixed');
add('atvaltasTerulet','Terület átváltása','↔️',[F('ertek','Érték',''),F('egyseg','Forrás egység','m2'),F('cel','Cél egység','cm2')],'convertArea','mixed');
add('atvaltasTerfogat','Térfogat átváltása','↔️',[F('ertek','Érték',''),F('egyseg','Forrás egység','m3'),F('cel','Cél egység','l')],'convertVolume','mixed');
add('atvaltasTomeg','Tömeg átváltása','↔️',[F('ertek','Érték',''),F('egyseg','Forrás egység','kg'),F('cel','Cél egység','g')],'convertMass','mixed');
add('atvaltasIdo','Idő átváltása','↔️',[F('ertek','Érték',''),F('egyseg','Forrás egység','h'),F('cel','Cél egység','min')],'convertTime','mixed');
add('anyagKoltseg','Anyagköltség','💰',[F('mennyiseg','Mennyiség','db'),F('ar','Egységár','Ft')],'unit','money');
add('munkadij','Munkadíj','👷',[F('ora','Munkaóra','h'),F('oradij','Óradíj','Ft/h')],'hourCost','money');
add('haszonkulcs','Haszonkulcsos ár','📈',[F('koltseg','Bekerülési költség','Ft'),F('haszon','Haszonkulcs','%',20)],'markup','money');
add('arres','Árrés','📈',[F('beszerzes','Beszerzési ár','Ft'),F('eladas','Eladási ár','Ft')],'margin','mixed');
add('bruttoNetto','Bruttó → nettó','💰',[F('brutto','Bruttó ár','Ft'),F('afa','ÁFA','%',27)],'grossNet','money');
add('nettoBrutto','Nettó → bruttó','💰',[F('netto','Nettó ár','Ft'),F('afa','ÁFA','%',27)],'netGross','money');
add('futes','Egyszerű fűtési hőigény','🔥',[AU('terulet','Fűtött alapterület'),F('magassag','Belmagasság','m',2.7),F('igeny','Hőigény','W/m³',35)],'heat','power');
add('legkobmeter','Légköbméter','💨',[AU('terulet','Alapterület'),F('magassag','Belmagasság','m',2.7)],'airVolume','volume');
add('ablakTerulet','Ablakfelület','🪟',[F('db','Ablakok száma','db',1),LU('szelesseg','Ablak szélessége','cm'),LU('magassag','Ablak magassága','cm')],'windowArea','area');
add('szobaFestek','Szoba festendő felülete','🎨',[LU('hossz','Szoba hossza'),LU('szelesseg','Szoba szélessége'),LU('magassag','Belmagasság','m',2.7),AU('nyilasok','Nyílások összesen','m2',0)],'roomPaintArea','area');
add('helyiseg','Helyiség térfogata','📦',[LU('hossz','Hossz'),LU('szelesseg','Szélesség'),LU('magassag','Magasság')],'volume3','volume');

/* ---------- KERT ---------- */
addCat('kert','Kert / Térkő','🌳',['termofold','mulcs','kavicsKert','fuMag','mutragya','ontozes','kerites','keritesOszlop','keritesBeton','medence','medenceViz','komposzt','talajcsere','agyas','geotextil','tuzifa','tuzifaTomeg']);
add('termofold','Termőföld mennyiség','🌱',[AU('terulet','Terület'),LU('vastagsag','Terítési vastagság','cm',10),F('rahagyas','Ráhagyás','%',10)],'areaThick','volume');
add('mulcs','Mulcs mennyiség','🍂',[AU('terulet','Mulcsozandó terület'),LU('vastagsag','Mulcsvastagság','cm',5),F('rahagyas','Ráhagyás','%',10)],'areaThick','volume');
add('kavicsKert','Kerti kavics','🪨',[AU('terulet','Kavicsolandó terület'),LU('vastagsag','Rétegvastagság','cm',5),F('suruseg','Sűrűség','kg/m³',1600),F('rahagyas','Ráhagyás','%',10)],'gardenStone','mass');
add('fuMag','Fűmag mennyiség','🌱',[AU('terulet','Füvesítendő terület'),F('kg_m2','Vetőmag igény','kg/m²',0.03),F('rahagyas','Ráhagyás','%',10)],'areaMaterial','mass');
add('mutragya','Műtrágya mennyiség','🌱',[AU('terulet','Kezelendő terület'),F('kg_m2','Adagolás','kg/m²',0.03),F('rahagyas','Ráhagyás','%',5)],'areaMaterial','mass');
add('ontozes','Öntözővíz','💧',[AU('terulet','Terület'),F('mm','Vízréteg','mm',5)],'rainwater','volume');
add('kerites','Kerítés hossza','🚧',[LU('oldal1','Kerítés 1'),LU('oldal2','Kerítés 2','m',0),LU('oldal3','Kerítés 3','m',0),LU('oldal4','Kerítés 4','m',0)],'fourLength','length');
add('keritesOszlop','Kerítésoszlopok','🚧',[LU('hossz','Kerítés hossza'),LU('osztas','Oszloptávolság','m',2.5),F('rahagyas','Ráhagyás','%',0)],'fencePosts','count');
add('keritesBeton','Kerítésoszlop beton','🏗️',[F('db','Oszlopok száma','db'),LU('atmero','Furat átmérője','cm',20),LU('melyseg','Furat mélysége','cm',70)],'postConcrete','volume');
add('medence','Medence térfogata','🏊',[LU('hossz','Hossz'),LU('szelesseg','Szélesség'),LU('melyseg','Átlagos mélység','m',1.5)],'volume3','volume');
add('medenceViz','Medence vízmennyiség','💧',[VU('terfogat','Medence térfogata','m3')],'liters','volume');
add('komposzt','Komposzt mennyiség','♻️',[AU('terulet','Terület'),LU('vastagsag','Rétegvastagság','cm',5)],'areaThick','volume');
add('talajcsere','Talajcsere','⛏️',[AU('terulet','Terület'),LU('melyseg','Talajcsere mélysége','cm',20),F('rahagyas','Ráhagyás','%',10)],'areaDepth','volume');
add('agyas','Kerti ágyás szegély','🌿',[LU('hossz','Ágyás hossza'),F('elem','Egy elem hossza','m',1),F('rahagyas','Ráhagyás','%',5)],'piecesLength','count');
add('geotextil','Geotextil','🧻',[AU('terulet','Lefedendő terület'),F('tekercs','Tekercs lefedése','m²',50),F('rahagyas','Ráhagyás','%',10)],'boxesArea','count');
add('tuzifa','Tűzifa köbméter','🪵',[LU('hossz','Rakás hossza'),LU('magassag','Rakás magassága'),LU('melyseg','Rakás mélysége')],'volume3','volume');
add('tuzifaTomeg','Tűzifa tömege','⚖️',[VU('terfogat','Tűzifa térfogata','m3'),F('suruseg','Sűrűség','kg/m³',500)],'density','mass');

/* ---------- FŰTÉS / VÍZ ---------- */
addCat('epulet','Fűtés / Víz / Gépészet','🔥',['radiator','radiatorDarab','futesiViz','tartaly','csőViz','csőHossz','szivattyu','hőveszteseg','padlofutes','padloCső','bojler','bojlerKoltseg','vizfogyasztas','esoviz','csatornaViz','szigeteles']);
add('radiator','Radiátor becsült hőleadás','♨️',[F('terulet','Helyiség alapterülete','m²'),F('magassag','Belmagasság','m',2.7),F('igeny','Hőigény','W/m³',40)],'heat','power');
add('radiatorDarab','Radiátor darabszám','♨️',[F('igeny','Szükséges hőteljesítmény','W'),F('radiator','Egy radiátor teljesítménye','W',1500)],'piecesPower','count');
add('futesiViz','Fűtési rendszer víztérfogata','💧',[F('cső','Csőben lévő víz','l'),F('radiator','Radiátorok víztartalma','l'),F('kazán','Kazán/váltó víztartalma','l')],'sum3','volume');
add('tartaly','Tartály térfogata','🛢️',[LU('atmero','Tartály átmérője','cm'),LU('magassag','Tartály magassága','cm')],'cylinder','volume');
add('csőViz','Csőben lévő víz','💧',[LU('atmero','Belső átmérő','mm'),LU('hossz','Csőhossz')],'pipeVolume','volume');
add('csőHossz','Csőhossz térfogatból','💧',[VU('viz','Víz térfogata','l'),LU('atmero','Belső átmérő','mm')],'pipeLength','length');
add('szivattyu','Szivattyú szállítási idő','💧',[VU('terfogat','Víz mennyisége','l'),F('hozam','Szivattyú hozama','l/min')],'pumpTime','time');
add('hőveszteseg','Egyszerű hőveszteség','🔥',[AU('terulet','Szerkezet felülete'),F('u','U-érték','W/m²K',0.3),F('dt','Hőmérsékletkülönbség','K',30)],'heatLoss','power');
add('padlofutes','Padlófűtési hőigény','🔥',[AU('terulet','Fűtött terület'),F('igeny','Hőigény','W/m²',60)],'areaMaterial','power');
add('padloCső','Padlófűtési csőhossz','🔥',[AU('terulet','Fűtött terület'),F('osztas','Csőosztás','cm',15),F('rahagyas','Ráhagyás','%',10)],'floorPipe','length');
add('bojler','Bojler felfűtési idő','♨️',[VU('viz','Víz mennyisége','l'),F('dt','Hőmérséklet-emelés','°C',40),F('power','Fűtőteljesítmény','kW',2)],'boilerTime','time');
add('bojlerKoltseg','Bojler energiaigénye','♨️',[VU('viz','Víz mennyisége','l'),F('dt','Hőmérséklet-emelés','°C',40),F('ar','Villamos energia ára','Ft/kWh')],'waterEnergyCost','money');
add('vizfogyasztas','Vízfogyasztás költsége','🚿',[VU('viz','Vízfogyasztás','m3'),F('ar','Víz+csatorna egységár','Ft/m³')],'cost','money');
add('esoviz','Esővíz mennyisége','🌧️',[AU('tető','Gyűjtőfelület'),F('eso','Csapadék','mm'),F('hatasfok','Begyűjtési hatásfok','%',80)],'rainCollection','volume');
add('csatornaViz','Csapadékvíz térfogat','🌧️',[AU('terulet','Tető/vízgyűjtő terület'),F('eso','Csapadék','mm')],'rainwater','volume');
add('szigeteles','Szigetelőanyag térfogata','🧊',[AU('terulet','Szigetelendő felület'),LU('vastagsag','Szigetelés vastagsága','cm',10)],'insulationVol','volume');

/* ---------- MUNKADÍJ / ANYAG ---------- */
addCat('munka','Munkadíj / Költségvetés','💰',['m2Munkadij','fmMunkadij','dbMunkadij','oraMunkadij','anyagPluszMunka','arajanlat','afaMunkadij','utazasiDij','gepiMunka','minimalDij','rezsioradij','vallalkozoiAr']);
add('m2Munkadij','m² munkadíj','👷',[AU('terulet','Munkaterület'),F('dij','Munkadíj','Ft/m²')],'areaCostOne','money');
add('fmMunkadij','Folyóméter munkadíj','👷',[LU('hossz','Munkahossz'),F('dij','Munkadíj','Ft/m')],'lengthCostOne','money');
add('dbMunkadij','Darabáras munkadíj','👷',[F('db','Darabszám','db'),F('dij','Díj / db','Ft')],'piecesCost','money');
add('oraMunkadij','Óradíjas munka','👷',[F('ora','Munkaóra','h'),F('dij','Óradíj','Ft/h')],'hourCost','money');
add('anyagPluszMunka','Anyag + munkadíj','💰',[F('anyag','Anyagköltség','Ft'),F('munka','Munkadíj','Ft'),F('egyeb','Egyéb','Ft',0)],'sum3','money');
add('arajanlat','Ajánlati ár tartalékkal','📋',[F('anyag','Anyagköltség','Ft'),F('munka','Munkadíj','Ft'),F('tartalek','Tartalék','%',10)],'quote','money');
add('afaMunkadij','Munkadíj ÁFÁ-val','💰',[F('dij','Nettó munkadíj','Ft'),F('afa','ÁFA','%',27)],'netGross','money');
add('utazasiDij','Kiszállási díj','🚗',[F('km','Távolság oda-vissza','km'),F('dij','Kilométerdíj','Ft/km'),F('alap','Alap kiszállási díj','Ft',0)],'travelCost','money');
add('gepiMunka','Gépi munkadíj','🚜',[F('ora','Gépidő','h'),F('dij','Óradíj','Ft/h'),F('szallitas','Szállítás','Ft',0)],'sum3Time','money');
add('minimalDij','Minimum munkadíj','💰',[F('szamolt','Számolt munkadíj','Ft'),F('minimum','Minimum díj','Ft')],'max','money');
add('rezsioradij','Rezsióradíj','🧾',[F('ber','Órabér','Ft/h'),F('jarulek','Járulék és teher','%',30),F('rezsi','Rezsi / óra','Ft/h',2000)],'overhead','money');
add('vallalkozoiAr','Vállalkozói ár','📋',[F('koltseg','Bekerülési költség','Ft'),F('rezsi','Rezsi','%',10),F('haszon','Haszon','%',15)],'businessPrice','money');

/* ---------- EXTRA ÁTVÁLTÁSOK / ÁLTALÁNOS ---------- */
addCat('extra','Átváltás / Egyéb','🧮',['kgTon','tonKg','literM3','m3Liter','kwW','wKw','hpKw','kwHp','kmhMs','msKmh','barKpa','kpaBar','celsiusFahrenheit','fahrenheitCelsius','napOra','oraPerc','percMasodperc','hektarM2','m2Hektar']);
add('kgTon','kg → tonna','⚖️',[F('ertek','Kilogramm','kg')],'kgTon','mass');
add('tonKg','tonna → kg','⚖️',[F('ertek','Tonna','t')],'tonKg','mass');
add('literM3','liter → m³','💧',[F('ertek','Liter','l')],'literM3','volume');
add('m3Liter','m³ → liter','💧',[F('ertek','Köbméter','m³')],'m3Liter','volume');
add('kwW','kW → W','⚡',[F('ertek','Kilowatt','kW')],'kwW','power');
add('wKw','W → kW','⚡',[F('ertek','Watt','W')],'wKw','power');
add('hpKw','LE → kW','🏎️',[F('ertek','Lóerő','LE')],'hpKw','power');
add('kwHp','kW → LE','🏎️',[F('ertek','Kilowatt','kW')],'kwHp','power');
add('kmhMs','km/h → m/s','🏃',[F('ertek','Sebesség','km/h')],'kmhMs','speed');
add('msKmh','m/s → km/h','🏃',[F('ertek','Sebesség','m/s')],'msKmh','speed');
add('barKpa','bar → kPa','📏',[F('ertek','Nyomás','bar')],'barKpa','pressure');
add('kpaBar','kPa → bar','📏',[F('ertek','Nyomás','kPa')],'kpaBar','pressure');
add('celsiusFahrenheit','°C → °F','🌡️',[F('ertek','Celsius','°C')],'cToF','temperature');
add('fahrenheitCelsius','°F → °C','🌡️',[F('ertek','Fahrenheit','°F')],'fToC','temperature');
add('napOra','nap → óra','🕐',[F('ertek','Nap','nap')],'dayHour','time');
add('oraPerc','óra → perc','🕐',[F('ertek','Óra','h')],'hourMin','time');
add('percMasodperc','perc → másodperc','🕐',[F('ertek','Perc','min')],'minSec','time');
add('hektarM2','hektár → m²','🌾',[F('ertek','Hektár','ha')],'haM2','area');
add('m2Hektar','m² → hektár','🌾',[F('ertek','Négyzetméter','m²')],'m2Ha','area');

/* ---------- számítási motor ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
let currentCategory=null,currentCalc=null,deferredInstallPrompt=null;

function n(d,k){const x=Number(d[k]);if(!Number.isFinite(x))throw new Error('Hiányzó vagy hibás adat: '+k);return x}
function cv(d,k,type){const unit=d[k+'_unit']||U[type][0][0];return n(d,k)*(T[type][unit]??1)}
function fmt(x,d=2){if(!Number.isFinite(x))return '—';return new Intl.NumberFormat('hu-HU',{maximumFractionDigits:d}).format(x)}
function outUnit(type,d,defaultUnit){
  const u=d.result_unit||defaultUnit||U[type][0][0];
  return `${fmt(d.__raw/T[type][u],type==='volume'?3:2)} ${L[type][u]}`;
}
function unitOptions(type,selected){return U[type].map(([v,l])=>`<option value="${v}" ${v===selected?'selected':''}>${l}</option>`).join('')}
function fieldHtml(f){
  const v=f.default??'';
  if(f.unit_type){
    const def=f.default_unit||U[f.unit_type][0][0];
    return `<div class="field"><label>${esc(f.label)}</label><div class="input-row"><input name="${f.id}" type="number" step="any" value="${v}" placeholder="Írd be az értéket"><select name="${f.id}_unit">${unitOptions(f.unit_type,def)}</select></div></div>`;
  }
  return `<div class="field"><label>${esc(f.label)}</label><div class="input-row"><input name="${f.id}" type="number" step="any" value="${v}" placeholder="Írd be az értéket"><span class="unit">${esc(f.unit||'')}</span></div></div>`;
}
function outputType(c){return ['volume','area','mass','length'].includes(c.result_type)?c.result_type:null}
function renderResult(raw,type,d,mainUnit){
  d.__raw=raw;
  if(type==='volume'||type==='area'||type==='mass'||type==='length')return outUnit(type,d,mainUnit);
  return fmt(raw,2);
}
function show(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));$('#'+id).classList.add('active');window.scrollTo({top:0,behavior:'smooth'})}

function calc(id,d){
  const f=C[id].formula;
  const lm=k=>cv(d,k,'length'), am=k=>cv(d,k,'area'), vm=k=>cv(d,k,'volume'), tm=k=>n(d,k)*(T.time[d[k+'_unit']||'h']||1);
  let r,details=[];
  switch(f){
    case 'volumeAdd': r=lm('hossz')*lm('szelesseg')*lm('vastagsag')*(1+n(d,'rahagyas')/100);break;
    case 'volume3': r=lm('hossz')*lm('szelesseg')*lm('magassag');break;
    case 'pillar': r=n(d,'db')*lm('szelesseg')*lm('melyseg')*lm('magassag')*(1+n(d,'rahagyas')/100);break;
    case 'loads': r=Math.ceil(vm('beton')/n(d,'mixer'));details=[`Becsült mixerek száma: ${r} db`];return [`${r} db`,details];
    case 'cement': {const kg=vm('beton')*n(d,'cement_m3')*(1+n(d,'rahagyas')/100);return [`${fmt(kg)} kg`,[`Kb. ${Math.ceil(kg/n(d,'zsak'))} zsák`]]}
    case 'massNeed': r=vm('anyag')*n(d,'anyagigeny')*(1+n(d,'rahagyas')/100);break;
    case 'density': r=vm('terfogat')*n(d,'suruseg');break;
    case 'earth': r=lm('hossz')*lm('szelesseg')*lm('melyseg')*(1+n(d,'lazitas')/100);break;
    case 'brick': {const wall=lm('fal_hossz')*lm('fal_magassag'), brick=(lm('tegla_hossz')+lm('fuga'))*(lm('tegla_szelesseg')+lm('fuga'));r=Math.ceil(wall/brick*(1+n(d,'rahagyas')/100));details=[`Fal felülete: ${fmt(wall)} m²`];return [`${r} db`,details]}
    case 'block': r=Math.ceil(lm('fal_hossz')*lm('fal_magassag')/(lm('elem_hossz')*lm('elem_magassag'))*(1+n(d,'rahagyas')/100));return [`${r} db`,[]];
    case 'steel': r=lm('szal_hossz')*n(d,'szal_db')*n(d,'kg_meter')*(1+n(d,'rahagyas')/100);break;
    case 'mesh': r=Math.ceil(am('terulet')/(n(d,'halo_hossz')*n(d,'halo_szelesseg'))*(1+n(d,'rahagyas')/100));return [`${r} db`,[]];
    case 'litersArea': r=am('terulet')*n(d,'anyagigeny')*(1+n(d,'rahagyas')/100)/1000;break;
    case 'plaster': r=am('terulet')*lm('reteg')*n(d,'suruseg')*(1+n(d,'rahagyas')/100);break;
    case 'areaThick': r=am('terulet')*lm('vastagsag')*(1+n(d,'rahagyas')/100);break;
    case 'screed': r=am('terulet')*lm('vastagsag')/1000*n(d,'anyagigeny')*(1+n(d,'rahagyas')/100);break;
    case 'stairs': {const h=lm('szintmagassag'), count=Math.max(1,Math.round(h/lm('fokmagassag'))),actual=h/count,run=count*lm('fokmelyseg');return [`${count} db`,[`Valós fokmagasság: ${fmt(actual*100,1)} cm`,`Vízszintes hossz: ${fmt(run,2)} m`]]}
    case 'stepConcrete': r=n(d,'fok')*lm('magassag')*lm('melyseg')*lm('szelesseg')/2;break;
    case 'cost': r=vm('beton')*n(d,'ar');return [`${fmt(r,0)} Ft`,[]];
    case 'ohm': {
      const a=['feszultseg','aram','ellenallas'].map(k=>d[k]===''?null:Number(d[k]));
      if(a.filter(x=>x!==null&&!Number.isNaN(x)).length!==2)throw new Error('Az Ohm-törvénynél pontosan 2 értéket adj meg.');
      if(a[2]===null)return [`Ellenállás: ${fmt(a[0]/a[1],4)} Ω`,[]];
      if(a[1]===null)return [`Áramerősség: ${fmt(a[0]/a[2],4)} A`,[]];
      return [`Feszültség: ${fmt(a[1]*a[2],4)} V`,[]];
    }
    case 'power': return [`${fmt(n(d,'feszultseg')*n(d,'aram'))} W`,[]];
    case 'threePower': return [`${fmt(3*n(d,'feszultseg')*n(d,'aram')*n(d,'cosphi'))} W`,[]];
    case 'current': return [`${fmt(n(d,'teljesitmeny')/n(d,'feszultseg'),3)} A`,[]];
    case 'energyCost': {const e=n(d,'teljesitmeny')*tm('ido'),cost=e*n(d,'ar');return [`${fmt(cost,0)} Ft`,[`Energia: ${fmt(e,2)} kWh`]]}
    case 'kwh': return [`${fmt(n(d,'teljesitmeny')*tm('ido')/1000,3)} kWh`,[]];
    case 'cable': r=lm('nyomvonal')*(1+n(d,'rahagyas')/100);break;
    case 'drop': return [`${fmt(n(d,'aram')*lm('hossz')*n(d,'ellenallas'),3)} V`,[]];
    case 'wireR': return [`${fmt(n(d,'ro')*lm('hossz')/n(d,'keresztmetszet'),5)} Ω`,[]];
    case 'fuse': return [`${fmt(n(d,'teljesitmeny')/n(d,'feszultseg'),2)} A`,[]];
    case 'loss': return [`${fmt(n(d,'aram')**2*n(d,'ellenallas'),2)} W`,[]];
    case 'monthlyKwh': r=n(d,'teljesitmeny')*n(d,'ido')*n(d,'nap')/1000;return [`${fmt(r,2)} kWh`,[]];
    case 'yearlyKwh': r=n(d,'teljesitmeny')*n(d,'ido')*n(d,'nap')/1000;return [`${fmt(r,2)} kWh`,[]];
    case 'rolls': r=Math.ceil(lm('hossz')/n(d,'tekercs')*(1+n(d,'rahagyas')/100));return [`${r} db`,[]];
    case 'watt': return [`${fmt(n(d,'amper')*n(d,'volt'),2)} W`,[]];
    case 'seriesR': return [`${fmt(n(d,'r1')+n(d,'r2')+n(d,'r3'),3)} Ω`,[]];
    case 'parallelR': {const vals=[n(d,'r1'),n(d,'r2'),n(d,'r3')].filter(x=>x>0);return [`${fmt(1/vals.reduce((s,x)=>s+1/x,0),3)} Ω`,[]]}
    case 'wall': r=lm('hossz')*lm('magassag')-am('nyilasok');break;
    case 'area2': r=lm('hossz')*lm('szelesseg');break;
    case 'paint': r=am('terulet')*n(d,'reteg')/n(d,'fedokepesseg')*(1+n(d,'rahagyas')/100)/1000;break;
    case 'primer': r=am('terulet')/n(d,'fedokepesseg')*(1+n(d,'rahagyas')/100)/1000;break;
    case 'bags': r=Math.ceil(n(d,'kg')/n(d,'zsak')*(1+n(d,'rahagyas')/100));return [`${r} zsák`,[]];
    case 'sanding': r=Math.ceil(am('terulet')/n(d,'fed')*n(d,'reteg')*(1+n(d,'rahagyas')/100));return [`${r} db`,[]];
    case 'paintCost': r=am('terulet')*n(d,'liter')*n(d,'ar')+am('terulet')*n(d,'munkadij');return [`${fmt(r,0)} Ft`,[]];
    case 'primerCost': r=am('terulet')*n(d,'liter')*n(d,'ar');return [`${fmt(r,0)} Ft`,[]];
    case 'simpleLiters': r=n(d,'db')*n(d,'liter')*n(d,'reteg')*(1+n(d,'rahagyas')/100);break;
    case 'simpleAreaLiters': r=am('terulet')*n(d,'liter')*n(d,'reteg')*(1+n(d,'rahagyas')/100);break;
    case 'tile': r=Math.ceil(am('terulet')/(lm('lap_hossz')*lm('lap_szelesseg'))*(1+n(d,'rahagyas')/100));return [`${r} db`,[]];
    case 'material': r=am('terulet')*n(d,'anyagigeny')*(1+n(d,'rahagyas')/100);break;
    case 'piecesLength': r=Math.ceil(lm('hossz')/lm('elem')*(1+n(d,'rahagyas')/100));return [`${r} db`,[]];
    case 'leveling': r=Math.ceil(am('terulet')/n(d,'lap')*n(d,'db')*(1+n(d,'rahagyas')/100));return [`${r} db`,[]];
    case 'areaPieces': r=Math.ceil(am('terulet')*n(d,'db_m2')*(1+n(d,'rahagyas')/100));return [`${r} db`,[]];
    case 'boxesArea': r=Math.ceil(am('terulet')/n(d,'doboz')*(1+n(d,'rahagyas')/100));return [`${r} db`,[]];
    case 'areaWaste': r=lm('hossz')*lm('szelesseg')*(1+n(d,'rahagyas')/100);break;
    case 'waste': r=am('terulet')*(1+n(d,'rahagyas')/100);break;
    case 'areaCost': r=am('terulet')*(n(d,'anyag')+n(d,'munkadij'));return [`${fmt(r,0)} Ft`,[]];
    case 'lengthCost': r=lm('hossz')*(n(d,'anyag')+n(d,'munkadij'));return [`${fmt(r,0)} Ft`,[]];
    case 'lengthCostOne': r=lm('hossz')*n(d,'dij');return [`${fmt(r,0)} Ft`,[]];
    case 'areaCostOne': r=am('terulet')*n(d,'dij');return [`${fmt(r,0)} Ft`,[]];
    case 'piecesCost': r=n(d,'db')*n(d,'dij');return [`${fmt(r,0)} Ft`,[]];
    case 'hourCost': r=n(d,'ora')*n(d,'dij');return [`${fmt(r,0)} Ft`,[]];
    case 'areaCost': r=am('terulet')*(n(d,'anyag')+n(d,'munkadij'));return [`${fmt(r,0)} Ft`,[]];
    case 'roof': r=lm('tetohossz')*lm('fel_szelesseg')/Math.cos(n(d,'szog')*Math.PI/180)*2;break;
    case 'angle': return [`${fmt(Math.atan2(lm('magassag'),lm('futas'))*180/Math.PI)}°`,[]];
    case 'rafter': {const len=Math.hypot(lm('magassag'),lm('futas')),num=Math.ceil(lm('tetohossz')/lm('osztas'))+1;return [`${fmt(len)} m / db`,[`Becsült darabszám: ${num} db`]]}
    case 'lath': {const rows=Math.ceil(lm('tetosik')/lm('osztas'))+1;r=rows*lm('tetohossz');details=[`Lécek sora: ${rows} db`];break}
    case 'timber': r=lm('hossz')*lm('szelesseg')*lm('vastagsag')*n(d,'darab');break;
    case 'timber3': r=lm('hossz')*lm('szelesseg')*lm('magassag')*n(d,'db');break;
    case 'counterbatten': r=lm('sor')*Math.ceil(lm('tetohossz')/lm('sor'))*(1+n(d,'rahagyas')/100);break;
    case 'sheet': r=Math.ceil(am('terulet')/(n(d,'lap_hossz')*n(d,'lap_szelesseg'))*(1+n(d,'rahagyas')/100));return [`${r} db`,[]];
    case 'twoLength': r=(lm('hossz')+lm('hossz2'))*(1+n(d,'rahagyas')/100);break;
    case 'triangle': r=lm('szelesseg')*lm('magassag')/2;break;
    case 'triangleArea': r=lm('alap')*lm('magassag')/2;break;
    case 'fuel': {const km=lm('tavolsag')/1000,liters=km*n(d,'fogyasztas')/100,cost=liters*n(d,'ar');return [`${fmt(cost,0)} Ft`,[`Üzemanyag: ${fmt(liters,2)} l`]]}
    case 'range': r=vm('uzemanyag')*1000/n(d,'fogyasztas')*100;break;
    case 'oil': r=vm('mennyiseg')*1000*n(d,'ar');return [`${fmt(r,0)} Ft`,[]];
    case 'wheel': return [`${fmt(lm('tavolsag')/(Math.PI*lm('atmero')),0)} fordulat`,[]];
    case 'ratio': return [`${fmt(n(d,'bemenet')/n(d,'kimenet'),3)}:1`,[]];
    case 'brake': r=(n(d,'sebesseg')/3.6)**2/(2*n(d,'tapadas')*9.81);break;
    case 'accel': return [`${fmt((n(d,'v2')-n(d,'v1'))/3.6/n(d,'ido'),3)} m/s²`,[]];
    case 'rpm': return [`${fmt(n(d,'kerék')*n(d,'attetel')*n(d,'differencial'),0)} 1/min`,[]];
    case 'speed': return [`${fmt(n(d,'rpm')*Math.PI*lm('atmero')*60/1000/n(d,'valt'),2)} km/h`,[]];
    case 'circumference': r=Math.PI*lm('atmero');break;
    case 'pressureSum': return [`${fmt(n(d,'elso')+n(d,'hatso'),2)} bar`,[]];
    case 'sum3': r=n(d,'anyag')+n(d,'munkadij')+n(d,'egyeb');break;
    case 'travelTime': {const hours=(lm('tavolsag')/1000)/n(d,'sebesseg');return [`${fmt(hours,2)} óra`,[`Kb. ${fmt(hours*60,0)} perc`]]}
    case 'co2': r=(lm('tavolsag')/1000)*n(d,'fogyasztas')/100*n(d,'co2');break;
    case 'batteryEnergy': r=n(d,'ah')*n(d,'volt');return [`${fmt(r/1000,2)} kWh`,[]];
    case 'chargeTime': r=n(d,'ah')/n(d,'tolt')*(1+n(d,'veszteseg')/100);break;
    case 'kinetic': r=.5*n(d,'tomeg')*(n(d,'sebesseg')/3.6)**2;break;
    case 'percent': return [fmt(n(d,'ertek')*n(d,'szazalek')/100),[]];
    case 'vat': {const tax=n(d,'osszeg')*n(d,'afa')/100;return [`${fmt(n(d,'osszeg')+tax,0)} Ft`,[`ÁFA: ${fmt(tax,0)} Ft`]]}
    case 'discount': return [`${fmt(n(d,'ar')*(1-n(d,'kedvezmeny')/100),0)} Ft`,[]];
    case 'unit': return [`${fmt(n(d,'ar')/n(d,'mennyiseg'),2)} Ft/db`,[]];
    case 'perimeter': r=2*(lm('hossz')+lm('szelesseg'));break;
    case 'circleArea': r=Math.PI*lm('sugar')**2;break;
    case 'circlePerimeter': r=2*Math.PI*lm('sugar');break;
    case 'trapezoid': r=(lm('a')+lm('b'))*lm('magassag')/2;break;
    case 'pythagoras': r=Math.hypot(lm('a'),lm('b'));break;
    case 'convertLength': return [`${fmt(n(d,'ertek')*T.length[d.egyseg]/T.length[d.cel],6)} ${d.cel}`,[]];
    case 'convertArea': return [`${fmt(n(d,'ertek')*T.area[d.egyseg]/T.area[d.cel],6)} ${d.cel}`,[]];
    case 'convertVolume': return [`${fmt(n(d,'ertek')*T.volume[d.egyseg]/T.volume[d.cel],6)} ${d.cel}`,[]];
    case 'convertMass': return [`${fmt(n(d,'ertek')*T.mass[d.egyseg]/T.mass[d.cel],6)} ${d.cel}`,[]];
    case 'convertTime': return [`${fmt(n(d,'ertek')*T.time[d.egyseg]/T.time[d.cel],6)} ${d.cel}`,[]];
    case 'hourCost': r=n(d,'ora')*n(d,'dij');break;
    case 'markup': r=n(d,'koltseg')*(1+n(d,'haszon')/100);break;
    case 'margin': {const profit=n(d,'eladas')-n(d,'beszerzes');return [`${fmt(profit,0)} Ft`,[`Árrés az eladási árhoz képest: ${fmt(profit/n(d,'eladas')*100,2)} %`]]}
    case 'grossNet': r=n(d,'brutto')/(1+n(d,'afa')/100);break;
    case 'netGross': r=n(d,'netto')*(1+n(d,'afa')/100);break;
    case 'heat': r=am('terulet')*n(d,'magassag')*n(d,'igeny');break;
    case 'airVolume': r=am('terulet')*n(d,'magassag');break;
    case 'windowArea': r=n(d,'db')*lm('szelesseg')*lm('magassag');break;
    case 'roomPaintArea': r=2*(lm('hossz')+lm('szelesseg'))*lm('magassag')-am('nyilasok');break;
    case 'gardenStone': r=am('terulet')*lm('vastagsag')*n(d,'suruseg')*(1+n(d,'rahagyas')/100);break;
    case 'areaMaterial': r=am('terulet')*n(d,'kg_m2')*(1+n(d,'rahagyas')/100);break;
    case 'rainwater': r=am('terulet')*n(d,'mm')/1000;break;
    case 'rainCollection': r=am('tető')*n(d,'eso')/1000*n(d,'hatasfok')/100;break;
    case 'fourLength': r=lm('oldal1')+lm('oldal2')+lm('oldal3')+lm('oldal4');break;
    case 'fencePosts': r=Math.ceil(lm('hossz')/lm('osztas'))+1;return [`${r} db`,[]];
    case 'postConcrete': r=n(d,'db')*Math.PI*(lm('atmero')/2)**2*lm('melyseg');break;
    case 'liters': r=vm('terfogat');break;
    case 'areaDepth': r=am('terulet')*lm('melyseg')*(1+n(d,'rahagyas')/100);break;
    case 'insulationVol': r=am('terulet')*lm('vastagsag');break;
    case 'cylinder': r=Math.PI*(lm('atmero')/2)**2*lm('magassag');break;
    case 'pipeVolume': r=Math.PI*(lm('atmero')/2)**2*lm('hossz');break;
    case 'pipeLength': r=vm('viz')/(Math.PI*(lm('atmero')/2)**2);break;
    case 'pumpTime': r=vm('terfogat')/0.001/n(d,'hozam');break;
    case 'heatLoss': r=am('terulet')*n(d,'u')*n(d,'dt');break;
    case 'floorPipe': r=am('terulet')/(n(d,'osztas')/100)*(1+n(d,'rahagyas')/100);break;
    case 'boilerTime': {const kWh=vm('viz')*1000*4.186*n(d,'dt')/3600000; r=kWh/n(d,'power');break}
    case 'waterEnergyCost': {const kWh=vm('viz')*1000*4.186*n(d,'dt')/3600000;return [`${fmt(kWh*n(d,'ar'),0)} Ft`,[`Energiaigény: ${fmt(kWh,2)} kWh`]]}
    case 'quote': r=(n(d,'anyag')+n(d,'munka'))*(1+n(d,'tartalek')/100);break;
    case 'sum3Time': r=n(d,'ora')*n(d,'dij')+n(d,'szallitas');break;
    case 'max': r=Math.max(n(d,'szamolt'),n(d,'minimum'));break;
    case 'overhead': r=n(d,'ber')*(1+n(d,'jarulek')/100)+n(d,'rezsi');break;
    case 'businessPrice': r=n(d,'koltseg')*(1+n(d,'rezsi')/100)*(1+n(d,'haszon')/100);break;
    case 'kgTon': return [`${fmt(n(d,'ertek')/1000,4)} t`,[]];
    case 'tonKg': return [`${fmt(n(d,'ertek')*1000,2)} kg`,[]];
    case 'literM3': return [`${fmt(n(d,'ertek')/1000,4)} m³`,[]];
    case 'm3Liter': return [`${fmt(n(d,'ertek')*1000,2)} l`,[]];
    case 'kwW': return [`${fmt(n(d,'ertek')*1000,2)} W`,[]];
    case 'wKw': return [`${fmt(n(d,'ertek')/1000,4)} kW`,[]];
    case 'hpKw': return [`${fmt(n(d,'ertek')*0.73549875,3)} kW`,[]];
    case 'kwHp': return [`${fmt(n(d,'ertek')/0.73549875,3)} LE`,[]];
    case 'kmhMs': return [`${fmt(n(d,'ertek')/3.6,3)} m/s`,[]];
    case 'msKmh': return [`${fmt(n(d,'ertek')*3.6,3)} km/h`,[]];
    case 'barKpa': return [`${fmt(n(d,'ertek')*100,3)} kPa`,[]];
    case 'kpaBar': return [`${fmt(n(d,'ertek')/100,4)} bar`,[]];
    case 'cToF': return [`${fmt(n(d,'ertek')*9/5+32,2)} °F`,[]];
    case 'fToC': return [`${fmt((n(d,'ertek')-32)*5/9,2)} °C`,[]];
    case 'dayHour': return [`${fmt(n(d,'ertek')*24,2)} óra`,[]];
    case 'hourMin': return [`${fmt(n(d,'ertek')*60,2)} perc`,[]];
    case 'minSec': return [`${fmt(n(d,'ertek')*60,2)} mp`,[]];
    case 'haM2': return [`${fmt(n(d,'ertek')*10000,2)} m²`,[]];
    case 'm2Ha': return [`${fmt(n(d,'ertek')/10000,4)} ha`,[]];
    default: throw new Error('Ismeretlen számítás: '+f);
  }
  const c=C[id];
  return [renderResult(r,c.result_type,d,c.result_type==='volume'?'m3':c.result_type==='area'?'m2':c.result_type==='mass'?'kg':c.result_type==='length'?'m':null),details];
}

/* ---------- UI ---------- */
function openCategory(id){
  currentCategory=id;
  const c=categories.find(x=>x.id===id);
  $('#categoryHeader').innerHTML=`<div class="eyebrow">KATEGÓRIA</div><h1>${c.icon} ${esc(c.name)}</h1><p>Válassz egy számolást a kategóriából.</p>`;
  $('#calculators').innerHTML=c.calculators.map(cid=>{
    const x=C[cid];
    return `<button class="calc-card" data-id="${cid}" type="button"><span>${x.icon}</span><strong>${esc(x.name)}</strong><small>${esc(x.help||'Add meg az adatokat és számold ki az eredményt.')}</small></button>`;
  }).join('');
  document.querySelectorAll('.calc-card').forEach(b=>b.onclick=()=>openCalculator(b.dataset.id));
  show('category');
}
function openCalculator(id){
  currentCalc=id;const c=C[id];
  $('#calcHeader').innerHTML=`<div class="eyebrow">SZÁMOLÓ</div><h1>${c.icon} ${esc(c.name)}</h1><p>${esc(c.help||'Add meg az adatokat.')}</p>`;
  $('#fields').innerHTML=c.fields.map(fieldHtml).join('');
  const type=outputType(c);
  if(type){
    const def=type==='volume'?'m3':type==='area'?'m2':type==='mass'?'kg':'m';
    $('#fields').insertAdjacentHTML('beforeend',`<div class="field"><label>Eredmény mértékegysége</label><div class="input-row"><select name="result_unit">${unitOptions(type,def)}</select></div></div>`);
  }
  if(c.exact_two)$('#fields').insertAdjacentHTML('beforeend','<div class="hint">Ohm-törvény: pontosan 2 értéket adj meg, a harmadikat az alkalmazás kiszámolja.</div>');
  if(c.warning)$('#fields').insertAdjacentHTML('beforeend',`<div class="warning">⚠️ ${esc(c.warning)}</div>`);
  $('#result').classList.add('hidden');show('calculator');
}
function formData(){
  const o={};new FormData($('#calcForm')).forEach((v,k)=>o[k]=v);return o;
}

function renderHome(){
  $('#categories').innerHTML=categories.map(c=>`<button class="category" data-id="${c.id}" type="button"><span>${c.icon}</span><strong>${esc(c.name)}</strong><small>${c.calculators.length} számoló</small></button>`).join('');
  document.querySelectorAll('.category').forEach(b=>b.onclick=()=>openCategory(b.dataset.id));
}
function search(q){
  q=q.trim().toLowerCase();
  if(!q){$('#categories').classList.remove('hidden');$('#searchResults').classList.add('hidden');return}
  const arr=Object.values(C).filter(c=>(c.name+' '+c.help+' '+c.id).toLowerCase().includes(q));
  $('#categories').classList.add('hidden');$('#searchResults').classList.remove('hidden');
  $('#searchResults').innerHTML=arr.length?arr.map(x=>`<button class="calc-card" data-id="${x.id}" type="button"><span>${x.icon}</span><strong>${esc(x.name)}</strong><small>${esc(x.help||'Kalkulátor')}</small></button>`).join(''):`<div class="card"><strong>Nincs találat.</strong><p>Próbáld például: beton, tető, festék, kábel, autó, költség.</p></div>`;
  document.querySelectorAll('#searchResults .calc-card').forEach(b=>b.onclick=()=>openCalculator(b.dataset.id));
}

renderHome();
$('#search').addEventListener('input',e=>search(e.target.value));
$('#calcForm').onsubmit=e=>{
  e.preventDefault();
  const c=C[currentCalc],d=formData(),btn=e.submitter;
  btn.disabled=true;btn.textContent='Számolás…';
  try{
    const [main,details]=calc(currentCalc,d);
    $('#resultMain').textContent=main;
    $('#resultDetails').innerHTML=(details||[]).map(x=>`<div>${esc(x)}</div>`).join('');
    $('#result').classList.remove('hidden');
  }catch(err){alert(err.message||'Hiba történt a számítás során.')}
  finally{btn.disabled=false;btn.textContent='🧮 Számolás'}
};
$('#again').onclick=()=>openCalculator(currentCalc);
$('#backCalc').onclick=()=>openCategory(currentCategory);
$('#backCategory').onclick=()=>show('home');
$('#homeBtn').onclick=()=>{ $('#search').value='';search('');show('home'); };

window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();deferredInstallPrompt=e;$('#installBtn').classList.remove('hidden');
});
$('#installBtn').onclick=async()=>{
  if(!deferredInstallPrompt)return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt=null;$('#installBtn').classList.add('hidden');
};
window.addEventListener('appinstalled',()=>$('#installBtn').classList.add('hidden'));
