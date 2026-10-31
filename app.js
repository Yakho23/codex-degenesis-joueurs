/* Codex Degenesis – version joueur. Dérivé du Codex du MJ : sans données de campagne du MJ, PNJ, bestiaire ni générateurs. */
(function(){
"use strict";
/* ───────── utilitaires ───────── */
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const DG=s=>String(s).normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[’']/g," ").toUpperCase(); // police titre : A–Z sans accents
const norm=s=>String(s??"").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[’‘`´ʼ]/g,"'").replace(/[«»“”]/g,'"').replace(/[‐-―]/g,"-").replace(/\u00a0|\u202f/g," ").toLowerCase();
const rnd=n=>Math.floor(Math.random()*n);
const pick=a=>a[rnd(a.length)];
const store={get(k,d){try{const v=localStorage.getItem("codexj."+k);return v==null?d:JSON.parse(v)}catch(e){return d}},
             set(k,v){try{localStorage.setItem("codexj."+k,JSON.stringify(v))}catch(e){}}};
function toast(t){const d=document.createElement("div");d.className="toast";d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),1800)}
async function copy(t){try{await navigator.clipboard.writeText(t);toast("Copié")}catch(e){toast("Copie impossible ici")}}

const CULT_ICON={"Spitaliers":"SPITALIANS","Chroniqueurs":"CHRONICLERS","Hellvétiques":"HELLVETICS","Juges":"JUDGES","Clanistes":"CLANNERS","Ferrailleurs":"SCRAPPERS","Néolibyens":"NEOLIBYANS","Fléaux":"SCOURGERS","Anubiens":"ANUBIANS","Jehammétans":"JEHAMMEDANS","Apocalyptiques":"APOCALYPTICS","Anabaptistes":"ANABAPTISTS","Blafards":"PALERS",
 "Borca":"BORCA","Franka":"FRANKA","Pollen":"POLLEN","Balkhans":"BALKHAN","Hybrispanie":"HYBRISPANIA","Purgare":"PURGARE","Afrika":"AFRICA"};
const icon=name=>(window.ICONS&&ICONS[CULT_ICON[name]])||"";

const I={ /* icônes de trait */
 regles:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><path d="M24 12c-5-3-11-3-16-1v26c5-2 11-2 16 1 5-3 11-3 16-1V11c-5-2-11-2-16 1z"/><path d="M24 12v26"/></svg>',
 bazar:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="M24 8v32M14 40h20M10 14h28"/><path d="M10 14l-6 13h12zM38 14l-6 13h12z"/></svg>',
 des:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="32" height="32" rx="4"/><g fill="currentColor" stroke="none"><circle cx="16.5" cy="16" r="2.4"/><circle cx="31.5" cy="16" r="2.4"/><circle cx="16.5" cy="24" r="2.4"/><circle cx="31.5" cy="24" r="2.4"/><circle cx="16.5" cy="32" r="2.4"/><circle cx="31.5" cy="32" r="2.4"/></g></svg>',
 personnage:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><circle cx="24" cy="15" r="7"/><path d="M10 42c0-9 6-15 14-15s14 6 14 15"/><path d="M24 27v6"/></svg>',
 lore:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="M4 24c6-9 13-13 20-13s14 4 20 13c-6 9-13 13-20 13S10 33 4 24z"/><circle cx="24" cy="24" r="6"/><path d="M24 4v4M24 40v4"/></svg>',
 campagne:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="M6 11l11-4 14 4 11-4v30l-11 4-14-4-11 4z"/><path d="M17 7v30M31 11v30"/></svg>',
 back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
 search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
 grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7.5" height="7.5"/><rect x="13.5" y="3" width="7.5" height="7.5"/><rect x="3" y="13.5" width="7.5" height="7.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5"/></svg>',
 hive:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.5l4 2.3v4.6l-4 2.3-4-2.3V4.8zM7 11.2l4 2.3v4.6l-4 2.3-4-2.3v-4.6zM17 11.2l4 2.3v4.6l-4 2.3-4-2.3v-4.6z"/></svg>'
};
const EMBLEM='<svg viewBox="272.4 -2 54.8 54.8" width="60" height="60" fill="#0b0b0b" aria-hidden="true"><polygon points="311.1,18.6 319.8,27.3 325.2,27.3 312.7,14.8 306.6,14.8 306.6,23.5 301.7,23.5 301.7,21.3 301.7,21.3 301.7,18.6 303.7,18.6 303.7,14.8 301.7,14.8 301.7,7.6 297.9,11.4 297.9,14.8 293,14.8 293,14.1 301.7,5.4 301.7,0 289.2,12.5 289.2,18.6 297.9,18.6 297.9,23.5 295.7,23.5 295.7,23.5 293,23.5 293,21.5 289.2,21.5 289.2,23.5 282,23.5 285.8,27.3 289.2,27.3 289.2,32.2 288.5,32.2 279.8,23.5 274.4,23.5 286.9,36 293,36 293,27.3 297.9,27.3 297.9,29.5 297.9,29.5 297.9,32.1 295.9,32.1 295.9,36 297.9,36 297.9,43.1 301.7,39.3 301.7,36 306.6,36 306.6,36.7 297.9,45.4 297.9,50.8 310.4,38.3 310.4,32.1 301.7,32.1 301.7,27.3 303.9,27.3 303.9,27.3 306.6,27.3 306.6,29.3 310.4,29.3 310.4,27.3 317.6,27.3 313.8,23.5 310.4,23.5 310.4,18.6"/></svg>';

const SECTIONS=[
 {id:"personnage",n:"I",t:"Personnage",s:"Ta fiche",pos:[58,0]},
 {id:"lore",n:"II",t:"Lore",s:"Monde, régions, cultes",pos:[174,0]},
 {id:"regles",n:"III",t:"Règles",s:"Combat, blessures, Ego",pos:[232,100]},
 {id:"bazar",n:"IV",t:"Bazar",s:"Armes, armures, matériel",pos:[174,201]},
 {id:"des",n:"V",t:"Dés",s:"Réserve, déclencheurs, échecs",pos:[58,201]},
 {id:"campagne",n:"VI",t:"Campagne",s:"Cartes",pos:[0,100]}];

/* ───────── clés des fiches (recherche globale) ───────── */
const KEY=new Map(),kk=o=>KEY.get(o)||"",dk=o=>{const k=kk(o);return k?` data-k="${k}"`:""};
LORE.tabs.forEach(t=>{(t.items||[]).forEach((it,i)=>KEY.set(it,"lo-"+t.id+"-"+i));(t.timeline||[]).forEach((r,i)=>KEY.set(r,"lt-"+t.id+"-"+i));(t.gloss||[]).forEach((r,i)=>KEY.set(r,"lg-"+t.id+"-"+i))});
REGLES.forEach((r,i)=>KEY.set(r,"re-"+i));
Object.keys(POTENTIELS).forEach((c,j)=>POTENTIELS[c].forEach((p,i)=>KEY.set(p,"po-"+j+"-"+i)));
BAZAR.forEach((r,i)=>KEY.set(r,"bz-"+i));

/* ───────── état ───────── */
const S={view:"home",layout:store.get("layout","ruche"),
 regCat:"Tous",regQ:"",potCult:"Communs",
 bzGrp:"armes",bzCat:"Tout",bzCulte:"",bzQ:"",
 dice:Object.assign({va:6,diff:2},store.get("dice",{}),{ego:0,mod:0}),diceMode:"simple",diceB:{va:6,ego:0,mod:0},last:null,hist:store.get("hist",[]),
 loreTab:(LORE.tabs[0]||{}).id,loreQ:"",homeQ:"",focus:null,
 pid:null,pTab:"combat",pEdit:false,pBz:null,pConf:null,pArch:false,pRoll:null,pUndo:[]};
if(!(S.dice.diff>=1&&S.dice.diff<=10))S.dice.diff=2;

/* ───────── navigation ───────── */
function go(v,push=true){S.view=v;render();window.scrollTo(0,0);if(push){try{history.replaceState(null,"",v==="home"?"#":"#"+v)}catch(e){try{location.hash=v==="home"?"":v}catch(_){}}}}
window.addEventListener("hashchange",()=>{const h=(location.hash||"").slice(1);const v=SECTIONS.some(s=>s.id===h)?h:"home";if(v!==S.view)go(v,false)});

/* ───────── rendu ───────── */
const app=$("#app");
function render(){
  const keep={};app.querySelectorAll(".tabs").forEach(t=>keep[t.getAttribute("aria-label")]=t.scrollLeft);
  app.innerHTML=S.view==="home"?home():section();
  app.querySelectorAll(".tabs").forEach(t=>{const k=t.getAttribute("aria-label");if(k in keep)t.scrollLeft=keep[k];
    const c=t.querySelector('[aria-pressed="true"]');if(!c)return;const l=c.offsetLeft-t.offsetLeft,r=l+c.offsetWidth;
    if(l<t.scrollLeft)t.scrollLeft=l-12;else if(r>t.scrollLeft+t.clientWidth)t.scrollLeft=r-t.clientWidth+12;});
  if(S.view==="home"&&S._focusQ){const q=$("#hq");if(q){q.focus();q.setSelectionRange(q.value.length,q.value.length)}S._focusQ=false}
  if(S.focus){const k=S.focus;S.focus=null;const el=app.querySelector(`[data-k="${k}"]`);if(el){if(el.tagName==="DETAILS")el.open=true;
    requestAnimationFrame(()=>{const top=$(".top"),off=(top?top.offsetHeight:0)+10;window.scrollTo(0,el.getBoundingClientRect().top+window.scrollY-off);el.classList.add("flash");setTimeout(()=>el.classList.remove("flash"),1600)})}}
  pWake(S.view==="personnage"&&!!pCur()&&S.pTab==="combat");
  if(S._pShowRes){S._pShowRes=false;pShowResult()}
  if(S._pFocus){const el=app.querySelector(S._pFocus);if(el){el.focus();const n=el.value.length;try{el.setSelectionRange(n,n)}catch(e){}}S._pFocus=null}
  if(S.view==="bazar"||S.view==="regles"||S.view==="lore"){const q=$("#q");if(q&&S._focusQ){q.focus();q.setSelectionRange(q.value.length,q.value.length);S._focusQ=false}}
}
function home(){
  const ruche=S.layout==="ruche";
  const hive=`<nav class="hive" aria-label="Menu principal">
    <div class="hex core" style="left:116px;top:100px" aria-hidden="true"><span class="in">${EMBLEM}</span></div>
    ${SECTIONS.map(s=>`<button class="hex" data-go="${s.id}" style="left:${s.pos[0]}px;top:${s.pos[1]}px" aria-label="${esc(s.t)}"><span class="in"><span class="num dg">${s.n}</span>${I[s.id]}<span class="lab dg" ${s.id==="personnage"?'style="font-size:11px;letter-spacing:.03em"':""}>${DG(s.t)}</span></span></button>`).join("")}
  </nav>`;
  const grid=`<nav class="grid6" aria-label="Menu principal">${SECTIONS.map(s=>`<button class="tile" data-go="${s.id}"><span class="num dg">${s.n}</span>${I[s.id]}<span><span class="lab dg" >${DG(s.t)}</span><small>${esc(s.s)}</small></span></button>`).join("")}</nav>`;
  return `<section class="home wrap">
    <button class="switch" data-act="layout" aria-label="${ruche?"Affichage en grille":"Affichage en ruche"}">${ruche?I.grid:I.hive}</button>
    <header><img src="assets/logo-clean.svg" alt="Degenesis"><p class="dg">CODEX</p></header>
    <div class="hmain${ruche?" ruche":""}"><label class="search hsearch">${I.search}<input id="hq" data-in="homeq" type="search" placeholder="Chercher dans tout le Codex…" value="${esc(S.homeQ)}" autocomplete="off">${S.homeQ?`<button class="qclr" data-act="qclear" data-v="homeQ" aria-label="Effacer la recherche">×</button>`:""}</label>
    ${norm(S.homeQ).trim().length>=2?globalResults():(ruche?hive:grid)}</div>
    <footer><i></i><span class="dg">PRIMAL PUNK</span><i></i></footer></section>`;
}
/* ───────── recherche globale (accueil) ───────── */
let GIDX=null,HITS=[];
function gIndex(){
  if(GIDX)return GIDX;const L=[],add=(g,t,sub,txt,j)=>L.push({g,t,sub,tn:norm(t),x:norm(t+" "+sub+" "+txt),j});
  LORE.tabs.forEach(tab=>{
    (tab.items||[]).forEach(it=>add("Lore",it.t,tab.t+(it.sub?" · "+it.sub:""),stripTags(it.h),{v:"lore",s:{loreTab:tab.id,loreQ:""},k:kk(it)}));
    (tab.timeline||[]).forEach(r=>add("Lore",r[0],tab.t+" · "+r[1].slice(0,70),r[1],{v:"lore",s:{loreTab:tab.id,loreQ:""},k:kk(r)}));
    (tab.gloss||[]).forEach(r=>add("Lore",r[0],tab.t,r[1],{v:"lore",s:{loreTab:tab.id,loreQ:""},k:kk(r)}))});
  REGLES.forEach(r=>add("Règles",r.t,r.cat,r.tags+" "+stripTags(r.h),{v:"regles",s:{regCat:r.cat,regQ:""},k:kk(r)}));
  POT_CULTS.forEach(c=>POTENTIELS[c].forEach(p=>add("Potentiels",p.t,c,(p.c||"")+" "+(p.e||"")+" "+(p.r||""),{v:"regles",s:{regCat:"Potentiels",potCult:c,regQ:""},k:kk(p)})));
  BAZAR.forEach(r=>add("Bazar",r.Nom,r._cat+(r.Culte?" · "+r.Culte:""),Object.values(r).join(" "),{v:"bazar",s:{bzGrp:r._grp,bzCat:r._cat,bzCulte:"",bzQ:""},k:kk(r)}));
  return GIDX=L;
}
const G_ORDER=["Lore","Règles","Potentiels","Bazar"];
function globalResults(){
  const q=norm(S.homeQ).trim(),words=q.split(/\s+/).filter(Boolean);
  let hits=gIndex().filter(e=>words.every(w=>e.x.includes(w)));
  hits.forEach(h=>h.sc=h.tn.startsWith(q)?0:h.tn.includes(q)?1:words.every(w=>h.tn.includes(w))?2:3);
  HITS=[];let out="";
  const best=g=>Math.min(9,...hits.filter(h=>h.g===g).map(h=>h.sc));
  [...G_ORDER].sort((a,b)=>best(a)-best(b)||G_ORDER.indexOf(a)-G_ORDER.indexOf(b)).forEach(g=>{const L=hits.filter(h=>h.g===g).sort((a,b)=>a.sc-b.sc||a.t.localeCompare(b.t,"fr"));if(!L.length)return;
    const max=S.gAll===g?L.length:6;
    out+=`<div class="gres"><div class="gtitle">${esc(g)} <span class="gn">${L.length}</span></div>${L.slice(0,max).map(h=>{HITS.push(h);return `<button class="hit" data-act="hit" data-v="${HITS.length-1}"><span class="ht">${esc(h.t)}</span><span class="hs">${esc(h.sub)}</span></button>`}).join("")}${L.length>max?`<button class="btn more" data-act="gall" data-v="${esc(g)}">Voir les ${L.length} résultats</button>`:""}</div>`});
  return `<div class="gsearch">${out?`<div class="count">${hits.length} résultat${hits.length>1?"s":""}</div>${out}`:`<p class="empty">Rien trouvé dans le Codex.</p>`}</div>`;
}
function jump(h){
  const j=h.j;Object.assign(S,j.s);
  S.focus=j.k||null;S.view=j.v;window.scrollTo(0,0);render();
  try{history.replaceState(null,"","#"+j.v)}catch(e){}
}

function section(){
  const s=SECTIONS.find(x=>x.id===S.view);
  const tabs={personnage:()=>pTabs(),lore:loreTabs,regles:regTabs,bazar:bzTabs}[s.id];
  return `<div class="top"><div class="wrap"><div class="bar"><button class="back" data-go="home" aria-label="Retour à l’accueil">${I.back}</button><h1 class="dg">${DG(s.t)}</h1><span class="roman dg">${s.n}</span></div>${tabs?tabs():""}</div></div>
  <main class="wrap">${({personnage:personnage,lore:lore,regles:regles,bazar:bazar,des:des,campagne:campagne})[s.id]()}</main>`;
}
const chips=(list,cur,act,label)=>`<div class="tabs" role="toolbar" aria-label="${esc(label)}">${list.map(x=>{const v=Array.isArray(x)?x[0]:x,l=Array.isArray(x)?x[1]:x;return `<button class="chip" data-act="${act}" data-v="${esc(v)}" aria-pressed="${v===cur}">${l}</button>`}).join("")}</div>`;

/* ───────── I. PERSONNAGE ───────── */
/* Fiches enregistrées sur le téléphone (stockage du navigateur, clé codexj.persos). Aucune règle imposée : ce que le joueur saisit fait foi. */
const P_ATTR=[
 ["PHY","Physique",["Athlétisme","Corps à corps","Force","Lutte","Résistance","Vigueur"]],
 ["AGI","Agilité",["Armes à projectiles","Artisanat","Dextérité","Furtivité","Mobilité","Navigation"]],
 ["CHA","Charisme",["Art","Commandement","Considération","Expression","Négociation","Séduction"]],
 ["INT","Intellect",["Concentration","Conn. des artefacts","Légendes","Médecine","Science","Technologie"]],
 ["PSY","Psyché",["Domination","Foi","Réactivité","Ruse","Tromperie","Volonté"]],
 ["INS","Instinct",["Dressage","Empathie","Orientation","Perception","Pulsions","Survie"]]];
const P_ORIG=["Alliés","Autorité","Renommée","Réseau","Ressources","Secrets"];
const P_PISTES=[["ego","Ego",24],["spo","Sporulations",24],["bles","Blessures superficielles",24],["trau","Traumatismes",12]];
/* Maximums (Katharsys, Touches finales) : Égo = (INT+Concentration)×2 ou (INS+Pulsions)×2 ; Sporulations = (PSY+Foi/Volonté)×2 ;
   Blessures superficielles = (PHY+Résistance)×2 ; Traumatismes = PHY+PSY. Concentration/Pulsions et Foi/Volonté s’excluent : on prend celle qui est remplie. */
function pFormule(p,k){
  const A=x=>+p.a[x]||0,K=x=>+p.k[x]||0,alt=(a1,s1,a2,s2)=>K(s2)>K(s1)?[a2,s2]:[a1,s1];
  if(k==="ego"){const [a,c]=alt("INT","Concentration","INS","Pulsions");return {t:`(${a} ${A(a)} + ${c} ${K(c)}) × 2`,v:(A(a)+K(c))*2}}
  if(k==="spo"){const [a,c]=alt("PSY","Foi","PSY","Volonté");return {t:`(PSY ${A(a)} + ${c} ${K(c)}) × 2`,v:(A(a)+K(c))*2}}
  if(k==="bles")return {t:`(PHY ${A("PHY")} + Résistance ${K("Résistance")}) × 2`,v:(A("PHY")+K("Résistance"))*2};
  return {t:`PHY ${A("PHY")} + PSY ${A("PSY")}`,v:A("PHY")+A("PSY")};
}
const P_CULTURES=["Borca","Franka","Pollen","Balkhans","Hybrispanie","Purgare","Afrika"];
const P_CULTES=Object.keys(POTENTIELS).filter(c=>c!=="Communs");
const P_NOMS=window.NOMS||{cultures:{},concepts:[]},P_HER=window.HERITAGES||[];
const P_SEL={sexe:["Masculin","Féminin"],culture:P_CULTURES,concept:P_NOMS.concepts,culte:P_CULTES};
const P_ID=[["nom","Nom"],["age","Âge"],["rang","Rang"],["xp","Expérience"],["sexe","Sexe"],["taille","Taille"],["poids","Poids"],["lc","LC / dinars"],["culture","Culture"],["concept","Concept"],["culte","Culte"]];
const herFind=n=>{const q=norm(n).trim();return q?P_HER.find(h=>norm(h.n)===q)||P_HER.find(h=>q.startsWith(norm(h.n)+" ")||q.startsWith(norm(h.n)+"(")):null};
const P_LISTS={
 armes:{t:"Armes",f:[["nom","Nom"],["comp","Compétence d’attaque"],["man","Maniement"],["portee","Portée"],["deg","Dégâts"],["charg","Chargeur"],["cal","Calibre","c"],["cur","Balles dans l’arme","n"],["agent","Agent chargé","a"],["qte","Grenades possédées","n"],["prop","Propriétés"],["enc","Enc."],["tech","Tech"],["empl","Empl."],["fam","Type d’arme (mods)","s"]],bz:r=>r._grp==="armes"&&r._cat!=="Munitions"&&!/^Modifications/.test(r._cat||"")},
 armures:{t:"Armures",f:[["nom","Nom"],["va","Valeur d’armure"],["prop","Propriétés"],["enc","Enc."],["tech","Tech"],["empl","Empl."]],bz:r=>r._grp==="protection"&&!/^Modifications/.test(r._cat||"")},
 mun:{t:"Munitions",f:[["nom","Calibre ou type"],["chargeurs","Chargeurs (indicatif)","n"],["balles","Balles (total, armes comprises)","n"],["deg","Dégâts"],["effet","Effet (agent chimique)"]],bz:r=>r._cat==="Munitions"},
 equip:{t:"Équipement et consommables",f:[["nom","Nom"],["qte","Quantité","n"],["enc","Enc."],["effet","Effet ou note"],["combat","À portée de main en combat","b"]],bz:r=>["equipement","medical"].includes(r._grp)},
};
/* calibres : les variantes d’écriture d’un même calibre du Bazar (5.56x45mm / 5,56×45 mm…) sont ramenées à une seule entrée */
const P_CALALIAS=[[/5[.,]56\s*[x×]\s*45/i,"5.56x45 mm"],[/^(calibre\s*12|12\s*mm)/i,"Calibre 12"],[/e-?cube/i,"E-Cube"],[/^14\s*mm/i,"14 mm"]];
const pCalCanon=c=>{c=String(c||"").trim();const a=P_CALALIAS.find(([r])=>r.test(c));return a?a[1]:c};
const P_CALS=[...new Set(BAZAR.filter(r=>r._grp==="armes"&&r._cat!=="Grenades"&&r._cat!=="Explosifs"&&r["Cal."]&&!/^(–|Spécial|Grenades|Missile|Cartouches?)$|Charbon/.test(r["Cal."])).map(r=>pCalCanon(r["Cal."])))].sort((a,b)=>a.localeCompare(b,"fr"));
const P_FROMBZ={
 armes:r=>Object.assign({nom:r.Nom,comp:r._skill||"",man:r["Man."],portee:r["Portée"],deg:r["Dégâts"],charg:r["Charg."],cal:pCalCanon(r["Cal."]),prop:r["Propriétés"],enc:r["Enc."],tech:r.Tech,empl:r["Empl."],cat:r._cat||""},/d[ée]viation/i.test(r["Propriétés"]||"")?{qte:1}:{}),
 armures:r=>({nom:r.Nom,va:r["Valeur d’armure"]||(r["Défense"]?"Défense "+r["Défense"]+(r.Attaque&&r.Attaque!=="–"?" · Attaque "+r.Attaque:""):""),prop:r["Propriétés"],enc:r["Enc."],tech:r.Tech,empl:r["Empl."]}),
 mun:r=>Object.assign({nom:r.Nom,chargeurs:0,balles:0,deg:r["Dégâts"]},r.Agent?{balles:1,agent:r.Agent,effet:r.Effet||""}:{}),
 equip:r=>({nom:r.Nom,qte:1,enc:r["Enc."],effet:r.Effet||r["Propriétés"]||"",combat:false})};
const P_POTS=Object.keys(POTENTIELS).flatMap(c=>POTENTIELS[c].map(p=>({p,c})));
const potFind=n=>{const q=norm(n).trim();return q?P_POTS.find(x=>norm(x.p.t)===q):null};

let PERSOS=store.get("persos",[]);if(!Array.isArray(PERSOS))PERSOS=[];
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
function pBlank(){return {id:uid(),v:1,cree:Date.now(),maj:Date.now(),arch:false,
  nom:"",age:"",rang:"",xp:"",sexe:"",taille:"",poids:"",lc:"",culture:"",concept:"",culte:"",her:["","",""],
  a:{},priv:{},k:{},o:{},pots:[],stats:{init:"",defm:"",armure:""},modif:"",compl:"",
  pistes:{ego:{max:24,v:0},spo:{max:24,v:0},bles:{max:24,v:0},trau:{max:12,v:0}},
  armes:[],armures:[],mun:[],equip:[],artef:[],mods:"",notes:""}}
function pNorm(x){const b=pBlank(),p=Object.assign(b,x||{});
  ["a","priv","k","o","stats","pistes"].forEach(k=>{if(typeof p[k]!=="object"||!p[k]||Array.isArray(p[k]))p[k]=b[k]});
  ["her","pots","armes","armures","mun","equip","artef","etats"].forEach(k=>{if(!Array.isArray(p[k]))p[k]=[]});
  while(p.her.length<3)p.her.push("");
  p.armes.forEach(w=>{if(w&&/d[ée]viation/i.test(String(w.prop||""))&&w.qte==null)w.qte=1}); /* grenades déjà présentes : 1 en stock */
  P_PISTES.forEach(([k,,m])=>{const t=p.pistes[k];p.pistes[k]={max:Math.max(1,Math.min(60,+(t&&t.max)||m)),v:Math.max(0,+(t&&t.v)||0)};if(k==="spo")p.pistes[k].perm=Math.max(0,+(t&&t.perm)||0)});
  return p}
PERSOS=PERSOS.map(pNorm);
let pTimer=null;
const pSave=(now)=>{clearTimeout(pTimer);const f=()=>store.set("persos",PERSOS);if(now)f();else pTimer=setTimeout(f,300)};
const pCur=()=>PERSOS.find(p=>p.id===S.pid)||null;
const BAD=new Set(["__proto__","constructor","prototype"]);
const pGet=(o,path)=>path.split(".").reduce((x,k)=>x==null?x:x[k],o);
function pSet(o,path,v){const ks=path.split(".");if(ks.some(k=>BAD.has(k)))return;let x=o;for(let i=0;i<ks.length-1;i++){if(x[ks[i]]==null||typeof x[ks[i]]!=="object")x[ks[i]]=/^\d+$/.test(ks[i+1])?[]:{};x=x[ks[i]]}x[ks[ks.length-1]]=v}
const nb=v=>{const m=String(v??"").replace(",",".").match(/-?\d+(\.\d+)?/);return m?+m[0]:0};
const dash=v=>v==null||v==="–"||v==="-"?"":String(v);
function cultIcon(c){c=String(c||"").trim();if(!c)return "";const cap=c.charAt(0).toUpperCase()+c.slice(1).toLowerCase();return icon(c)||icon(c+"s")||icon(cap)||icon(cap+"s")||icon(cap.replace(/s$/,""))||""}
const conceptIcon=c=>{const i=(P_NOMS.concepts||[]).indexOf(c);return i>=0&&window.CONCEPT_ICONS&&CONCEPT_ICONS[i]||""};
/* Emblèmes d’identité : Culture, Concept, Culte (hexagone + icône + nom) */
function pEmblems(p,all){const T=[["Culture",p.culture,cultIcon(p.culture)],["Concept",p.concept,conceptIcon(p.concept)],["Culte",p.culte,cultIcon(p.culte)]].filter(t=>all||t[1]);
  return T.length?`<div class="pembs">${T.map(([l,v,ic])=>`<div class="pemb${v?"":" vide"}"><span class="peh"><span class="pehx">${ic||""}</span></span><span class="pel">${l}</span><span class="pev">${esc(v||"—")}</span></div>`).join("")}</div>`:""}
/* Parcours : Rang, Expérience, LC / dinars — champs directement modifiables, même en lecture */
const P_PARC=[["rang","Rang",'<path d="M4 7l8-4 8 4M4 12.5l8-4 8 4M4 18l8-4 8 4"/>',""],
  ["xp","Expérience",'<path d="M12 2.5l2.6 6.9 6.9 2.6-6.9 2.6L12 21.5l-2.6-6.9L2.5 12l6.9-2.6z"/>',"points"],
  ["lc","LC / dinars",'<circle cx="12" cy="12" r="9"/><path d="M12 6.5v11M9.2 9.2h4.1a1.6 1.6 0 010 3.2h-2.6a1.6 1.6 0 000 3.2h4.2"/>',""]];
const pParcours=p=>`<div class="pparc">${P_PARC.map(([k,l,svg])=>`<label class="ppc"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${svg}</svg><span>${l}</span>${pIn(k,p[k],"—")}</label>`).join("")}</div>`;
const P_FRAME='<svg class="pfr" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="currentColor" vector-effect="non-scaling-stroke"><path stroke-width="1" opacity=".55" d="M9 .8h82l8.2 8.2v82L91 99.2H9L.8 91V9z"/><path stroke-width="1" opacity=".35" d="M13 5.2h74l7.8 7.8v74L87 94.8H13L5.2 87V13z"/><path stroke-width="2.4" stroke-linecap="square" d="M.8 26V9L9 .8h17M74 .8h17l8.2 8.2v17M99.2 74v17L91 99.2H74M26 99.2H9L.8 91V74"/></g></svg>';
function pAvatar(p,cls){const ic=cultIcon(p.culte)||cultIcon(p.culture),ok=/^assets\/[\w\/.-]+\.(jpe?g|png|webp)$/i.test(p.portrait||"");
  return `<span class="pav pport ${cls||""}">${ok?`<img class="pimg" src="${esc(p.portrait)}" alt="">`:`<span class="pimg pph">${ic||`<b>${esc(DG((p.nom||"?").charAt(0)))}</b>`}</span>`}${P_FRAME}</span>`}
/* ───── Modifications (mods) des armes et des armures : liste à choisir, emplacements (Empl.) comptés ───── */
/* familles : c = corps à corps, a = projectiles archaïques, e = énergétiques, f = armes à feu modernes, r = armures ; "w" = toutes les armes
   fx : effets calculés (deg, man = dés de Maniement, enc, arm = armure, cap = chargeur/charges, mul = multiplicateur de charges) */
const P_MODS=[
 {id:"aff",n:"Affûtage",c:1,fam:"c",fx:{deg:1},t:"+1 dégât"},
 {id:"all",n:"Allègement",c:1,fam:"c",fx:{deg:-1,man:1,enc:-1},once:1,ok:x=>nb(x.enc)>=2?"":"Enc. 2 minimum",t:"−1 dégât, Maniabilité +1D, Enc. −1 (une seule fois, arme d’Enc. 2 minimum)"},
 {id:"equ",n:"Équilibrage",c:1,fam:"c",fx:{man:1},t:"Maniabilité +1D"},
 {id:"vis",n:"Appareil de visée",c:1,fam:"a",fx:{man:1},t:"Maniabilité +1D"},
 {id:"str",n:"Structure renforcée",c:1,fam:"a",fx:{deg:1,enc:1},t:"+1 dégât, Portée +25 %, Enc. +1"},
 {id:"cir",n:"Circuits en série",c:1,fam:"e",fx:{deg:1,cap:-2},t:"+1 dégât, charges −2"},
 {id:"eff",n:"Efficacité",c:1,fam:"e",fx:{cap:2},t:"+2 charges"},
 {id:"rgp",n:"Regroupement",c:2,fam:"e",fx:{mul:2,enc:1},once:1,ok:x=>/e-?cube/.test(norm(x.cal||""))?"":"Condition : E-Cube",t:"Nombre de charges ×2, Enc. +1 (condition : E-Cube)"},
 {id:"agr",n:"Agrandissement du chargeur",c:1,fam:"f",fx:{capAgr:1},t:"Chargeur standard de 9 ou moins : +1 ; plus grand : +3"},
 {id:"cac",pp:{flag:"Apte au corps à corps"},n:"Apte au corps à corps",c:1,fam:"f",once:1,t:"L’arme peut s’utiliser au Corps à corps (dégâts du couteau, sans propriétés de l’arme à feu)"},
 {id:"can",n:"Changement de canon",c:1,fam:"f",once:1,t:"Nouveau calibre au choix (modifie le champ Calibre ; munitions adaptées). Une seule fois. Les .50 GL gagnent « Coup de tonnerre »"},
 {id:"lun",n:"Lunette de visée",c:1,fam:"f",fx:{man:1},t:"Maniabilité +1D"},
 {id:"cam",pp:{n:"Camouflage",d:2},pw:"Camouflage (diff.) : arme discrète ; INS+Perception (diff.) pour la repérer.",pr:`Camouflage (diff.) : INS+Perception (diff.) pour repérer le porteur.`,n:"Camouflage (2)",c:2,fam:"cfr",once:1,t:"Propriété Camouflage (2)"},
 {id:"cam+",pp:{n:"Camouflage",d:1},n:"Camouflage +1",c:1,fam:"cfr",rep:1,req:"cam",t:"+1 point de Camouflage"},
 {id:"con",pp:{flag:"Contondant"},pw:"Contondant : efficace contre les armures Massives.",n:"Contondant",c:1,fam:"c",once:1,t:"Propriété Contondant"},
 {id:"rg3",pp:{n:"Régularité",d:3,suf:"DC"},pw:"Régularité (DC) : avec ce nombre de DC, nouvelle attaque immédiate à −2D (cumulable).",n:"Régulier (3DC)",c:2,fam:"cf",once:1,t:"Propriété Régulier (3DC)"},
 {id:"rg-",pp:{n:"Régularité",d:-1,suf:"DC"},n:"Régulier −1DC",c:2,fam:"cf",rep:1,req:"rg3",t:"−1DC pour la Régularité"},
 {id:"ter",pp:{n:"Terrifiant",d:2},pw:"Terrifiant (diff.) : PSY+Foi/Volonté (diff.) ou −2D à la prochaine action.",pr:`Terrifiant (diff.) : qui attaque le porteur fait un test de PSY+Foi/Volonté (diff.) ; en cas d’échec, −2D à ses attaques contre lui. Une fois la peur vaincue, immunisé pour le reste du combat.`,n:"Terrifiant (2)",c:1,fam:"cfr",once:1,t:"Propriété Terrifiant (2)"},
 {id:"ter+",pp:{n:"Terrifiant",d:1},n:"Terrifiant +1",c:1,fam:"cfr",rep:1,req:"ter",t:"+1 point de Terrifiant"},
 {id:"dbl",pp:{flag:"Double canon"},pw:"Double canon : tirer les deux canons ensemble double les dégâts.",n:"Double canon",c:3,fam:"f",once:1,t:"Double canon"},
 {id:"enl",n:"Enlever une propriété",c:2,fam:"f",t:"Retire une propriété de l’arme (à noter sur la fiche)"},
 {id:"eff1",pp:{n:"Effroyable",d:1},pw:"Effroyable (niveau) : ajoute (niveau) déclencheur(s) bonus quand l’arme cause une Complication (au moins un déclencheur doit d’abord être dépensé pour infliger la Complication).",n:"Effroyable +1",c:1,fam:"w",rep:1,t:"Propriété Effroyable : un emplacement pour +1"},
 {id:"ass1",pp:{n:"Assommement",d:1},pw:"Assommement (niveau) : la cible subit la Complication Désorientation, à un niveau égal à celui de la propriété.",n:"Assommement +1",c:1,fam:"w",rep:1,t:"Propriété Assommement : un emplacement pour +1"},
 {id:"pan3",pp:{n:"Panique",d:3},pw:"Panique (niveau) : quiconque voit l’arme exercer ses ravages fait un jet de Défense mentale dont la difficulté égale le niveau ; en cas d’échec, la cible subit la Complication Obusite.",n:"Panique +3",c:2,fam:"w",rep:1,t:"Propriété Panique : deux emplacements pour +3"},
 {id:"dra",pp:{flag:"Dragonne"},n:"Dragonne",c:1,fam:"w",once:1,t:"Difficulté +2 aux tentatives de désarmement, ou +4D pour garder un objet en main"},
 {id:"ren",n:"Renforcement",c:1,fam:"r",rep:1,fx:{arm:1,enc:1},t:"Armure +1, Encombrement +1"},
 {id:"hem",pp:{n:"Hermétique",d:1,pre:"+",suf:"S"},pr:`Hermétique (+XS) : succès automatiques contre gaz, spores et toxines inhalés.`,n:"Hermétique (+1S)",c:2,fam:"r",once:1,t:"Propriété Hermétique (+1S)"},
 {id:"hem+",pp:{n:"Hermétique",d:1,pre:"+",suf:"S"},n:"Hermétique +1S",c:1,fam:"r",rep:1,req:"hem",t:"+1S"},
 {id:"ign",pp:{n:"Ignifugé",d:3},pr:`Ignifugé (X) : protège du feu et ne s’enflamme pas.`,n:"Ignifugé (+3 à l’armure)",c:2,fam:"r",once:1,t:"Propriété Ignifugé : +3 à l’armure contre le feu"},
 {id:"ign+",pp:{n:"Ignifugé",d:1},n:"Ignifugé +1 Armure",c:1,fam:"r",rep:1,req:"ign",t:"+1 Armure (feu)"},
 {id:"iso",pp:{flag:"Isolant"},pr:`Isolant : protège entièrement des décharges électriques ; tout dégât d’électricité est réduit à zéro.`,n:"Isolant",c:2,fam:"r",once:1,t:"Propriété Isolant"},
 {id:"mas",pp:{n:"Massif",d:2},pr:`Massif (X) : contre lames et armes pointues, l’armure vaut X. Les armes contondantes qui dépassent la valeur normale blessent quand même.`,n:"Massif (+2 à l’armure)",c:3,fam:"r",once:1,t:"Propriété Massif : +2 à l’armure"},
 {id:"mas+",pp:{n:"Massif",d:1},n:"Massif +1 Armure",c:1,fam:"r",rep:1,req:"mas",t:"+1 Armure (Massif)"},
 {id:"pab",pp:{n:"Pare-balles",d:3},pr:`Pare-balles (X) : contre les armes à feu, l’armure vaut X.`,n:"Pare-balles (+3 à l’armure)",c:3,fam:"r",once:1,t:"Propriété Pare-balles : +3 à l’armure contre les balles"},
 {id:"pab+",pp:{n:"Pare-balles",d:1},n:"Pare-balles +1 Armure",c:1,fam:"r",rep:1,req:"pab",t:"+1 Armure (balles)"}
];
const P_MODID=Object.fromEntries(P_MODS.map(m=>[m.id,m]));
const P_FAMN={c:"Corps à corps",a:"Projectiles archaïques",e:"Énergétique",f:"Arme à feu moderne"};
const P_FAMBYNAME=Object.fromEntries(Object.entries(P_FAMN).map(([k,v])=>[v,k]));
/* famille d’une arme : choix manuel (champ « Type d’arme »), sinon d’après la catégorie du Bazar, sinon d’après ses caractéristiques */
function pModFam(x,key){
  if(key==="armures")return "r";
  if(P_FAMBYNAME[x.fam])return P_FAMBYNAME[x.fam];
  if(/d[ée]viation/i.test(String(x.prop||"")))return "";            /* grenades : pas de mods */
  const c=norm(x.cat||""),cmp=norm(x.comp||""),cal=norm(x.cal||"");
  if(/e-?cube|energ/.test(cal)||c==="armes soniques")return "e";
  if(c==="lutte"||c==="corps a corps")return "c";
  if(c==="arcs & arbalettes"||c==="armes de jet")return "a";
  if(c==="armes de poing"||c==="fusils"||c==="armes lourdes")return "f";
  if(/corps a corps|lutte/.test(cmp))return "c";
  if(/fleche|carreau|harpon|clou|jet/.test(cal))return "a";
  return (Math.floor(nb(x.charg))>0||cal)?"f":"a";
}
/* mods posés : texte libre (anciennes fiches) = 1 emplacement ; {m:id} = mod de la liste */
function pModsOf(x){return (Array.isArray(x.mods)?x.mods:[]).map((m,i)=>{
  if(m&&typeof m==="object"){const d=P_MODID[m.m];return {i,id:m.m,c:d?d.c:1,n:d?d.n:String(m.m),d}}
  const t=String(m??"").trim();return t?{i,id:null,c:1,n:t,d:null}:null}).filter(Boolean)}
const pModSlots=(x,key)=>(key==="armes"||key==="armures")?Math.max(0,Math.min(12,Math.floor(nb(x.empl)))):0;
const pModUsed=x=>pModsOf(x).reduce((s,m)=>s+m.c,0);
/* effets « de secours » : ceux qu’on ne peut pas écrire dans les champs de l’arme (ex. −1 dégât sur une formule F/3), + anciennes fiches */
function pModFx(x,key){
  const f={deg:0,man:0,enc:0,arm:0,cap:0,mul:1};
  if(!x||!Array.isArray(x.mods))return f;
  const base=Math.floor(nb(x.charg));
  pModsOf(x).forEach(m=>{if(!m.d)return;const raw=x.mods[m.i],e=raw&&raw.ap?(raw.fb||{}):(m.d.fx||{});
    f.deg+=e.deg||0;f.man+=e.man||0;f.enc+=e.enc||0;f.arm+=e.arm||0;f.cap+=e.cap||0;f.mul*=e.mul||1;
    if(e.capAgr)f.cap+=base<=9?1:3});
  return f}
/* ── pose / retrait d’un mod : les champs de l’arme (Man., Dégâts, Chargeur, Enc., Armure, Propriétés) sont modifiés pour de vrai ── */
const pRx=t=>String(t).replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const pTidy=t=>String(t).replace(/\s*[,;]\s*(?=[,;])/g,"").replace(/^[\s,;]+|[\s,;]+$/g,"").replace(/\s*[,;]\s*/g,", ");
function pPropBump(x,sp,d){ /* niveau d’une propriété « Nom (n) » : +d ; retirée si ≤ 0 ; ajoutée si absente */
  const pr=String(x.prop||"").replace(/^[–-]$/,""),re=new RegExp(pRx(sp.n)+"\\s*\\(\\s*(\\+?)(\\d+)\\s*([A-Za-z]*)\\s*\\)","i"),m=pr.match(re);
  if(m){const n=+m[2]+d;x.prop=pTidy(pr.replace(re,n>0?`${sp.n} (${m[1]}${n}${m[3]})`:""))}
  else if(d>0)x.prop=pTidy((pr?pr+", ":"")+`${sp.n} (${sp.pre||""}${d}${sp.suf||""})`)}
function pPropFlag(x,name,on){
  const pr=String(x.prop||"").replace(/^[–-]$/,""),re=new RegExp("(^|[,;]\\s*)"+pRx(name)+"(?=\\s*([,;]|$))","i");
  if(on&&!re.test(pr))x.prop=pTidy((pr?pr+", ":"")+name);
  else if(!on&&re.test(pr))x.prop=pTidy(pr.replace(re,"$1"))}
function pDegAdd(x,d){ /* → true si la formule de dégâts a pu être ajustée */
  const t=String(x.deg||"").trim().replace(/\s+/g,"");
  if(/^\d+$/.test(t)){const v=+t+d;if(v<0)return false;x.deg=String(v);return true}
  const m=t.match(/^(?:(\d+)\+)?F(?:\/(\d+))?(?:\+(\d+))?$/i);if(!m)return false;
  const e=(+m[3]||0)+d;if(e<0)return false;
  x.deg=(m[1]?m[1]+"+":"")+(m[2]?"F/"+m[2]:"F")+(e?"+"+e:"");return true}
const pNumAdd=(x,f,d)=>{const c=nb(x[f]),n=Math.max(0,Math.round((c+d)*10)/10);x[f]=String(n);return n-c};
function pManAdd(x,d){const t=String(x.man||"").replace(/[\u2212\u2013\u2014\u2012]/g,"-").match(/([+\-])?\s*(\d+)/),c=t?(t[1]==="-"?-1:1)*(+t[2]):0,v=c+d;x.man=(v>=0?"+":"-")+Math.abs(v)+"D"}
function pModApply(x,key,m,extra){
  const fx=m.fx||{},ap=[],fb={};
  if(fx.deg){if(pDegAdd(x,fx.deg))ap.push({f:"deg",d:fx.deg});else fb.deg=fx.deg}
  if(fx.man){pManAdd(x,fx.man);ap.push({f:"man",d:fx.man})}
  if(fx.enc){const r=pNumAdd(x,"enc",fx.enc);if(r)ap.push({f:"enc",d:r})}
  if(fx.arm){if(/^\d+$/.test(String(x.va||"").trim())){pNumAdd(x,"va",fx.arm);ap.push({f:"va",d:fx.arm})}else fb.arm=fx.arm}
  const n=Math.floor(nb(x.charg));
  if(n>0&&(fx.cap||fx.capAgr||fx.mul)){let d=(fx.cap||0)+(fx.capAgr?(n<=9?1:3):0);if(fx.mul)d+=n*(fx.mul-1);if(d){pNumAdd(x,"charg",d);ap.push({f:"charg",d})}}
  if(m.pp){if(m.pp.flag){pPropFlag(x,m.pp.flag,true);ap.push({f:"flag",n:m.pp.flag})}else{pPropBump(x,m.pp,m.pp.d);ap.push({f:"prop",sp:m.pp,d:m.pp.d})}}
  if(extra&&extra.cal){ap.push({f:"cal",old:x.cal||"",nw:extra.cal});x.cal=extra.cal;if(/\.50/.test(extra.cal)){pPropFlag(x,"Coup de tonnerre",true);ap.push({f:"flag",n:"Coup de tonnerre"})}}
  if(key==="armes"&&x.cur!=null)x.cur=Math.min(+x.cur||0,pCap(x));
  return {m:m.id,ap,fb}}
function pModRevert(x,key,e){
  if(!e||!e.ap)return;
  e.ap.slice().reverse().forEach(a=>{
    if(a.f==="deg")pDegAdd(x,-a.d);else if(a.f==="man")pManAdd(x,-a.d);else if(a.f==="enc"||a.f==="va"||a.f==="charg")pNumAdd(x,a.f,-a.d);
    else if(a.f==="prop")pPropBump(x,a.sp,-a.d);else if(a.f==="flag")pPropFlag(x,a.n,false);
    else if(a.f==="cal"&&x.cal===a.nw)x.cal=a.old});
  if(key==="armes"&&x.cur!=null)x.cur=Math.min(+x.cur||0,pCap(x))}
const pModAvail=(x,key,m)=>{ /* → "" si le mod peut être posé, sinon la raison */
  const fam=pModFam(x,key),used=pModUsed(x),free=pModSlots(x,key)-used,have=pModsOf(x).map(y=>y.id);
  if(!(m.fam==="w"?(key==="armes"&&fam):m.fam.includes(fam)))return "autre type d’équipement";
  if(m.once&&have.includes(m.id))return "déjà posé";
  if(m.req&&!have.includes(m.req))return "nécessite "+P_MODID[m.req].n;
  if(m.c>free)return m.c+" empl. nécessaires";
  if(m.ok){const r=m.ok(x);if(r)return r}
  return ""};
function pEnc(p){return p.armes.reduce((s,x)=>s+nb(x.enc)+pModFx(x,"armes").enc,0)+p.armures.reduce((s,x)=>s+nb(x.enc)+pModFx(x,"armures").enc,0)+p.equip.reduce((s,x)=>s+nb(x.enc)*Math.max(1,nb(x.qte)||0),0)}
const boxes=(path,v,n,edit)=>`<span class="bxs${edit?" ed":""}">${Array.from({length:n},(_,i)=>edit?`<button class="bx${i<v?" on":""}" data-pa="box" data-k="${path}" data-v="${i+1}" aria-label="${i+1}"></button>`:`<i class="bx${i<v?" on":""}"></i>`).join("")}</span>`;
const pIn=(path,val,ph,list,type)=>`<input class="pin" data-pf="${path}" value="${esc(val)}"${ph?` placeholder="${esc(ph)}"`:""}${list?` list="${list}"`:""}${type==="n"?` inputmode="numeric"`:""} autocomplete="off">`;
const pSel=(path,val,opts,ph)=>{val=String(val??"");const L=val&&!opts.includes(val)?[val,...opts]:opts;return `<select class="pin psel" data-pf="${path}"><option value="">${esc(ph||"—")}</option>${L.map(o=>`<option${o===val?" selected":""}>${esc(o)}</option>`).join("")}</select>`};
const pTa=(path,val,ph)=>`<textarea class="pin pta" data-pf="${path}" placeholder="${esc(ph||"")}">${esc(val)}</textarea>`;
const pStep=(path,v)=>`<span class="pstep"><button data-pa="inc" data-k="${path}" data-d="-1" aria-label="Moins">−</button><output>${v}</output><button data-pa="inc" data-k="${path}" data-d="1" aria-label="Plus">+</button></span>`;
const pConfBtn=(key,label,cls)=>`<button class="btn ${cls||""}${S.pConf===key?" red":""}" data-pa="conf" data-k="${key}">${S.pConf===key?"Confirmer ?":label}</button>`;
const DATALISTS="";
/* Potentiels proposés : communs + ceux du culte choisi ; tous les cultes si aucun culte n’est choisi */
function potCulte(c){c=String(c||"").trim();if(!c)return null;const K=Object.keys(POTENTIELS).filter(k=>k!=="Communs");const n=norm(c);return K.find(k=>norm(k)===n||norm(k)===n+"s"||norm(k).replace(/s$/,"")===n)||null}
function potSelect(path,val,culte){
  val=String(val??"");const ck=potCulte(culte);
  const groups=[["Communs",POTENTIELS.Communs||[]],...(ck?[[ck,POTENTIELS[ck]]]:Object.keys(POTENTIELS).filter(k=>k!=="Communs").map(k=>[k,POTENTIELS[k]]))];
  const all=groups.flatMap(([,L])=>L.map(x=>x.t));
  const extra=val&&!all.includes(val)?`<option selected>${esc(val)}</option>`:"";
  return `<select class="pin psel" data-pf="${path}"><option value="">— Choisir un Potentiel —</option>${extra}${groups.map(([g,L])=>`<optgroup label="${esc(g)}">${[...L].sort((a,b)=>a.t.localeCompare(b.t,"fr")).map(x=>`<option${x.t===val?" selected":""}>${esc(x.t)}</option>`).join("")}</optgroup>`).join("")}</select>`;
}

const IC_GRENADE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><ellipse cx="11" cy="15" rx="6" ry="6.5"/><path d="M8.5 9.6V7h5v2.6M8.5 7.5h7.5l2-2.2M16.5 5.3l2.8.4M5.5 13.5h11M5.5 16.5h11M11 8.5v13"/><circle cx="19.5" cy="9" r="1.6"/></svg>';
const pGrenade=w=>/d[ée]viation/i.test(String(w&&w.prop||""))&&!pAgentW(w); /* le lance-cartouches suit le modèle des agents chimiques (cartouches en stock), pas celui des grenades */
const IC_BALL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M9 21V9c0-3 1.3-5.5 3-7 1.7 1.5 3 4 3 7v12z"/><path d="M8 21h8M9 12h6"/></svg>';
const IC_SONIC='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9.5v5h3.5L11 18.5v-13L6.5 9.5z"/><path d="M14.5 9a4 4 0 010 6"/><path d="M17.5 6.5a8 8 0 010 11"/><path d="M20.5 4a11.5 11.5 0 010 16" opacity=".6"/></svg>';
/* armes soniques (Raccordeur, Vocodeur) : jet Technologie puis jet Domination, dégâts 1 + DC Technologie + DC Domination */
const pSonic=w=>!!w&&/technologie/.test(norm(w.comp))&&/domination/.test(norm(w.comp));
const pSonicEgo=w=>/vocodeur/.test(norm(w.nom||""))||(/ego/.test(norm(w.deg||""))&&!/trauma/.test(norm(w.deg||"")));
const pSonicDeg=w=>pSonicEgo(w)?["d’Ego","Ego"]:["de Traumatisme","Traumatisme"];
const IC_KNIFE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="M20 3L9.5 13.5l1.8 1.8C17 12 19.5 7.5 20 3z"/><path d="M9.5 13.5L7 16"/><path d="M5.2 14.6l4.2 4.2"/><path d="M7.3 16.7L4 20"/></svg>';
const IC_PARRY='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="M12 2l8 3v6c0 5.3-3.4 9.3-8 11-4.6-1.7-8-5.7-8-11V5z"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/></svg>';
const IC_DODGE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><circle cx="14" cy="4.5" r="2"/><path d="M13 8l-3 4 3 3-1 6"/><path d="M10 12l-4 1M13 15l4 2"/><path d="M3 7h4M2 10h3" opacity=".6"/></svg>';
const IC_OTHER='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.3" fill="currentColor"/><circle cx="15" cy="15" r="1.3" fill="currentColor"/><circle cx="15" cy="9" r="1.3" fill="currentColor"/><circle cx="9" cy="15" r="1.3" fill="currentColor"/></svg>';
/* actions du round : null = pas de limite (hors combat) ; sinon nombre d’actions restantes */
function pActLeft(p){const c=p.combat;if(!c||!c.on)return null;if(c.init==null)return 0;return Math.max(0,(c.act||1)-(c.used||0))}
const pActDis=p=>{const n=pActLeft(p);return n!==null&&n<=0?" disabled":""};
const NEXT='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4v5h-5"/><path d="M10 9l3 3-3 3"/></svg>';
function pCombatBar(p){const c=p.combat;if(!c||!c.on||S.pTab!=="combat")return "";
  return `<div class="pcbar"><span class="pcr">Round <b>${c.round}</b></span>${c.init==null?`<span class="pcw">Initiative à lancer</span>`:`<span>Initiative <b>${c.init}</b></span><span class="${pActLeft(p)<=0?"pcz":""}">Actions <b>${pActLeft(p)}</b>/${c.act}</span>${c.ego&&!c.egoUsed?`<span class="pce">+${c.ego}D 1<sup>re</sup> action</span>`:""}`}<button class="pcend${S.pConf==="cend"?" on":""}" data-pa="conf" data-k="cend">${S.pConf==="cend"?"Confirmer ?":"Fin"}</button><button class="pcnext" data-pa="cnext" aria-label="Round suivant" title="Round suivant">${NEXT}</button></div>`}
function pTabs(){const p=pCur();return p?chips([["combat","Combat"],["fiche","Fiche"],["inventaire","Inventaire"],["notes","Notes"]],S.pTab,"ptab","Fiche du personnage")+pCombatBar(p):""}
function personnage(){const p=pCur();return p?pFiche(p):pList()}

/* Personnages prétirés : liste fournie par data/pretires.js (window.PRETIRES = [fiches complètes, même format qu’une fiche exportée]) */
function pPretires(){
  const L=Array.isArray(window.PRETIRES)?window.PRETIRES:[];
  return `<section class="psec ppre"><div class="pst">Personnages prétirés</div>${L.length?L.map((x,i)=>`<div class="pcard">${pAvatar(pNorm(x))}<div class="pcmain"><span class="pn">${esc(x.nom||"Sans nom")}</span><span class="pm">${esc([x.culte,x.rang].filter(Boolean).join(" · "))}</span><span class="pm2">${esc([x.culture,x.concept].filter(Boolean).join(" · "))}</span></div><button class="btn sm" data-pa="preadd" data-k="${i}">Ajouter</button></div>`).join(""):`<p class="pnone">Aucun personnage prétiré disponible pour l’instant.</p>`}</section>`}
function pList(){
  const act=PERSOS.filter(p=>!p.arch),arch=PERSOS.filter(p=>p.arch);
  const card=p=>`<div class="pcard">${pAvatar(p)}<button class="pcmain" data-pa="open" data-k="${p.id}"><span class="pn">${esc(p.nom||"Sans nom")}</span><span class="pm">${esc([p.culte,p.rang].filter(Boolean).join(" · "))}</span><span class="pm2">${esc([p.culture,p.concept].filter(Boolean).join(" · "))}</span></button>${p.arch?`<button class="btn sm" data-pa="unarch" data-k="${p.id}">Restaurer</button>`:""}<span class="pcacts"><button class="pcdel pcdl" data-pa="expc" data-k="${p.id}" aria-label="Enregistrer la fiche de ${esc(p.nom||"ce personnage")}" title="Enregistrer la fiche"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19h14"/></svg></button><button class="pcdel${S.pConf==="delc:"+p.id?" on":""}" data-pa="conf" data-k="delc:${p.id}" aria-label="Supprimer ${esc(p.nom||"ce personnage")}">${S.pConf==="delc:"+p.id?"Sûr ?":'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>'}</button></span></div>`;
  return `<div class="stack">
   <div class="btnrow"><button class="btn red" data-pa="new">+ Nouveau personnage</button></div>
   <div class="btnrow"><label class="btn file">Importer une fiche<input type="file" accept=".json,application/json" data-pfile="1" hidden></label><button class="btn gold${S.pPre?" on":""}" data-pa="pre" aria-pressed="${!!S.pPre}">Pré-tirés</button></div>
   ${S.pPre?pPretires():""}
   ${act.length?act.map(card).join(""):`<p class="empty">Aucun personnage sur ce téléphone. Crée ta fiche ou importe un fichier exporté.</p>`}
   ${arch.length?`<button class="chip" data-pa="showarch" aria-pressed="${!!S.pArch}">Archivés (${arch.length})</button>${S.pArch?arch.map(card).join(""):""}`:""}
   <p class="note">Les fiches sont enregistrées sur ce téléphone uniquement. Exporte-les de temps en temps pour les sauvegarder.</p></div>`;
}

function pFiche(p){
  const head=`<div class="phead">${pAvatar(p,"big")}<div class="phi"><div class="phn">${esc(p.nom||"Sans nom")}</div><div class="phm">${esc([p.rang&&("Rang "+p.rang.replace(/^rang\s*/i,"")),p.culture,p.concept,p.culte].filter(Boolean).join(" · "))}</div></div></div>
   <div class="pbar"><button class="btn sm" data-pa="list">‹ Personnages</button>${S.pTab==="fiche"||S.pTab==="inventaire"?`<button class="btn sm${S.pEdit?" red":""}" data-pa="edit">${S.pEdit?"Sauvegarder":"Modifier"}</button>`:""}</div>`;
  const body={combat:pCombat,fiche:pSheet,inventaire:pInv,notes:pNotes}[S.pTab]||pSheet;
  const foot=S.pEdit&&(S.pTab==="fiche"||S.pTab==="inventaire")?`<button class="roll pdone" data-pa="edit" data-v="bas">SAUVEGARDER</button><p class="note">Les modifications sont enregistrées au fur et à mesure ; « Sauvegarder » repasse la fiche en lecture.</p>`:"";
  return `<div class="stack perso">${head}${body(p)}${foot}${DATALISTS}</div>`;
}
/* ───── Écran Combat ───── */
/* Ego : la piste stocke les points DÉPENSÉS (0 = Ego au maximum) ; affichage = points restants.
   Blessures, Traumatismes, Sporulations : la piste stocke les cases cochées. */
const P_ABBR={PHY:"PHY",AGI:"AGI",CHA:"CHA",INT:"INT",PSY:"PSY",INS:"INS"};
/* Maniement : bonus ou malus en D aux jets d’attaque et de défense avec l’arme (+1, +1d, +1 D, −2…) */
function pMan(w){const fx=w?pModFx(w,"armes").man:0,s=String(w&&w.man||"").replace(/[\u2212\u2013\u2014\u2012]/g,"-").trim();const m=s.match(/([+\-])?\s*(\d+)\s*(?:d\b|d$)?/i);if(!m)return fx;return (m[1]==="-"?-1:1)*(+m[2])+fx}
const pManTxt=n=>n?` ${n>0?"+":"−"} Maniement ${Math.abs(n)}`:"";
function pWV(p,w){const va=pVA(p,w.comp),n=pMan(w);if(!va)return null;return {v:Math.max(0,va.v+n),m:n,t:va.t+pManTxt(n)}}
function pVA(p,comp){
  const m=String(comp||"").match(/^\s*([A-Za-zÉé]{3})\s*\+\s*(.+?)\s*$/);if(!m)return null;
  const at=m[1].toUpperCase().replace("É","E"),A=P_ATTR.find(x=>x[0]===at);if(!A)return null;
  const sk=A[2].find(s=>norm(s)===norm(m[2]))||P_ATTR.flatMap(x=>x[2]).find(s=>norm(s)===norm(m[2]));if(!sk)return null;
  return {t:`${A[1]} ${+p.a[at]||0} + ${sk} ${+p.k[sk]||0}`,v:(+p.a[at]||0)+(+p.k[sk]||0)};
}
/* Rafale (X) : jusqu’à X balles en 1 action, chaque balle +1D et +1 dégât (Katharsys, propriétés des armes) */
const pRafale=w=>{const m=String(w&&w.prop||"").match(/rafales?\s*\((\d+)\)/i);return m?+m[1]:0};
/* Agents chimiques (Katharsys) : le fusil fongicide et le lance-cartouches tirent des cartouches, le pistolet à injection une dose.
   Fusil fongicide : 1 cartouche = 10 utilisations. Lance-cartouches et pistolet à injection : 1 cartouche (ou dose) par tir.
   Le stock est dans les Munitions (cartouche de l’agent, quantité = champ « balles ») ; l’agent chargé est noté sur l’arme (champ « agent »). */
const P_AGENTS=BAZAR.filter(r=>r._cat==="Munitions"&&r.Agent);
const pAgentFind=n=>{const q=norm(n).trim();return q?P_AGENTS.find(r=>norm(r.Agent)===q||norm(r.Nom)===q):null};
const pInject=w=>/injection/i.test(w&&w.nom||"");
const pAgentW=w=>!!w&&(pInject(w)||/^cartouches?$/i.test(String(w.cal||"").trim()));
const pAgentFull=w=>/fongicide/i.test(w&&w.nom||"");
const pAgentOf=x=>pAgentFind(x.agent)||P_AGENTS.find(r=>norm(x.nom).includes(norm(r.Agent)));
const pAgentStock=(p,w)=>p.mun.map((x,i)=>({x,i,a:pAgentOf(x)})).filter(o=>o.a&&(+o.x.balles||0)>0&&(!pInject(w)||o.a.Injecteur==="oui")&&(pAgentFull(w)||!o.x.uses)); /* cartouche entamée (champ « uses » = utilisations restantes) : réservée au fusil fongicide */
const pAgentSel=(p,w,i)=>{const st=pAgentStock(p,w),v=S.pAgSel&&S.pAgSel[p.id+":"+i];return st.some(o=>norm(o.x.nom)===norm(v))?v:(st[0]?st[0].x.nom:"")};
const pRanged=(p,w)=>(pCap(w)>0&&!pInject(w))||/projectile|jet/i.test(norm(w.comp));
const pMelee=(p,w)=>!pRanged(p,w)&&/corps a corps|lutte/.test(norm(w.comp)||"corps a corps");
const pCap=w=>{let n=Math.floor(nb(w.charg));if(n<=0&&pAgentW(w))n=pInject(w)?1:10;if(n<=0)return 0;const f=pModFx(w,"armes");return Math.max(0,Math.round((n+f.cap)*f.mul))};
const pLoaded=w=>Math.max(0,Math.min(pCap(w),+w.cur||0)); /* balles réellement dans l’arme : saisies dans l’Inventaire (0 par défaut) */
const calKey=s=>norm(String(s||"").replace(/×/g,"x")).replace(/[^a-z0-9]/g,"");
function pAmmoFor(p,w){const c=calKey(w.cal);if(!c)return [];return p.mun.filter(m=>{const n=!m.agent&&calKey(m.nom);return n&&(n.includes(c)||c.includes(n))})}
function pTrauMalus(p){return +p.pistes.trau.v||0}
function trackBoxes(n,on,cls,perm){return `<span class="tbx ${cls}">${Array.from({length:n},(_,i)=>`<i class="${i<perm?"on perm":i<on?"on":""}"></i>`).join("")}</span>`}
/* Sporulation permanente (Katharsys, Porteur du Germe) : points notés sur l’échelle, qu’aucun EX ne peut effacer ; 50 % du maximum = Léperos */
const pSpoPerm=p=>Math.max(0,+p.pistes.spo.perm||0);
const pSpoStep=p=>`<span class="pstep"><button data-pa="perm" data-d="-1" aria-label="Moins un point permanent">−</button><output>${pSpoPerm(p)}</output><button data-pa="perm" data-d="1" aria-label="Plus un point permanent">+</button></span>`;
const pSpoLep=p=>pSpoPerm(p)*2>=p.pistes.spo.max?"Points permanents à 50 % ou plus de l’échelle : le PJ devient un Léperos (Katharsys).":"";
const pSpoFail=p=>{const R=S.pRoll;return !!(R&&R.at==="spo"&&R.pid===p.id&&R.res&&!R.permDone&&!R.res.some(r=>r.n>0&&r.succ>=R.resDiff))};
const P_TIC={
 ego:'<path d="M13.5 2.5L5 13.5h6l-1 8 8.5-11h-6z"/>',
 spo:'<circle cx="12" cy="12" r="3"/><circle cx="12" cy="3.8" r="1.5"/><circle cx="12" cy="20.2" r="1.5"/><circle cx="4.9" cy="7.9" r="1.5"/><circle cx="19.1" cy="7.9" r="1.5"/><circle cx="4.9" cy="16.1" r="1.5"/><circle cx="19.1" cy="16.1" r="1.5"/><path d="M12 9V5.3M12 15v3.7M9.4 10.5L6.2 8.6M14.6 10.5l3.2-1.9M9.4 13.5l-3.2 1.9M14.6 13.5l3.2 1.9"/>',
 bles:'<path d="M12 3s6.2 6.6 6.2 11.2a6.2 6.2 0 01-12.4 0C5.8 9.6 12 3 12 3z"/><path d="M9 14.5a3 3 0 003 3"/>',
 trau:'<path d="M12 3a8 8 0 00-5 14.2V20.5h10v-3.3A8 8 0 0012 3z"/><circle cx="9" cy="12" r="1.7"/><circle cx="15" cy="12" r="1.7"/><path d="M10 20.5v-2.2M14 20.5v-2.2"/>'};
const pTicon=k=>`<span class="ptri ${k}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P_TIC[k]||""}</svg></span>`;
function pTrack(p,k,l){
  const t=p.pistes[k],ego=k==="ego",val=ego?t.max-t.v:t.v;
  let warn="";
  if(ego&&val<=0)warn="Ego à 0 : le personnage s’écroule (test PSY+Foi/Volonté (2) pour un dernier effort).";
  if(k==="bles"&&val>=t.max)warn="Blessures au maximum : les dégâts suivants deviennent des Traumatismes.";
  if(k==="trau"&&val>0)warn=val>=t.max?"Traumatismes au maximum : le personnage ne peut plus être sauvé.":`Malus général : −${val}D à toutes les actions.`;
  if(k==="spo"&&val===t.max)warn="Sporulations au maximum : un point de plus et le PJ doit résister à l’Amorce.";
  let spo="";
  if(k==="spo"){const ex=val-t.max,pm=pSpoPerm(p);
    spo=`<div class="pperm"><span class="ppl">Sporulation permanente<small>aucun EX ne peut l’effacer</small></span>${pSpoStep(p)}</div>`
      +(pSpoLep(p)?`<div class="ptrw">${esc(pSpoLep(p))}</div>`:"")
      +(ex>0?`<div class="ptrw">Excédent de ${ex} : test PSY + Foi/Volonté, difficulté ${ex}. En cas d’échec, le PJ note 1 point de Sporulation permanente.</div><button class="btn sm" data-pa="spotest">Lancer le test (difficulté ${ex})</button>`:"")
      +pRollPanel(p,"spo")
      +(pSpoFail(p)?`<div class="ptrw">Test raté : le Germe s’installe.</div><button class="btn red" data-pa="spoadd">Ajouter 1 point permanent</button>`:"");}
  return `<div class="ptrk ${k}${ego?" ego":""}"><div class="ptrh">${pTicon(k)}<span class="ptrl">${l}</span><b class="ptrv">${val}<small> / ${t.max}</small>${k==="spo"&&val>t.max?`<small class="pex"> +${val-t.max} en excédent</small>`:""}</b></div>
   <div class="ptrb"><button class="tbtn" data-pa="trk" data-k="${k}" data-d="-1" aria-label="${ego?"Dépenser 1 point d’Ego":"Retirer 1"}">−</button>${trackBoxes(t.max,Math.min(val,t.max),ego?"ego":k,k==="spo"?Math.min(pSpoPerm(p),t.max):0)}<button class="tbtn" data-pa="trk" data-k="${k}" data-d="1" aria-label="${ego?"Récupérer 1 point d’Ego":"Ajouter 1"}">+</button></div>
   ${warn?`<div class="ptrw">${esc(warn)}</div>`:""}${spo}</div>`;
}
/* Rafale (X) : jusqu’à X balles en 1 action, +1D et +1 dégât par balle ; plusieurs cibles : dés partagés à parts égales,
   un jet par cible, dégâts de rafale divisés (arrondi inférieur), pas plus de cibles que de balles.
   Régularité (nDC) : avec n déclencheurs, nouvelle attaque immédiate à −2D (cumulatif). (Katharsys, propriétés des armes) */
const pRegul=w=>{const m=String(w&&w.prop||"").match(/r[ée]gularit[ée]\s*\((\d+)\s*DC\)/i);return m?+m[1]:0};
/* distance de tir : normale, longue (−4D) ou extrême (−8D) — armes à distance et grenades seulement */
const pRngOk=(p,w)=>!!w&&(pRanged(p,w)||pGrenade(w));
const pRngMal=(p,R,w)=>R.kind==="att"&&pRngOk(p,w)?(+R.rng||0):0;
function pPlan(p,R){
  const w=R.w!=null?p.armes[R.w]:null,cap=w&&R.sonic!==2?pCap(w):0,rx=w&&cap?pRafale(w):0,raf=rx?R.raf:0;
  const cib=raf?Math.max(1,Math.min(R.cib||1,raf)):1;
  const c=p.combat||{},egoInit=c.on&&c.ego&&!c.egoUsed&&R.kind!=="init"&&R.at!=="spo"&&R.at!=="def:mentale"&&R.sonic!==2&&!R.regul?c.ego:0; /* Ego dépensé à l’Initiative : +nD à la 1re action du round */
  const pool=Math.max(0,R.base-pTrauMalus(p)+R.mod+(R.kind==="init"?R.ego:0)+egoInit+raf-2*(R.regul||0)-4*pRngMal(p,R,w));
  /* dés partagés entre les cibles ; le reste de la division va aux premières cibles (1 dé chacune) */
  const per=Math.floor(pool/cib),rem=pool%cib,dice=Array.from({length:cib},(_,i)=>per+(i<rem?1:0));
  /* balles réparties comme les dés : le reste va aux premières cibles (3 balles sur 2 cibles : 2 + 1) ; +1 dégât par balle reçue */
  const bl=raf?Array.from({length:cib},(_,i)=>Math.floor(raf/cib)+(i<raf%cib?1:0)):[0];
  return {w,cap,rx,raf,cib,pool,per,dice,egoInit,balls:bl,rafDmg:bl[0]};
}
/* dégâts de l’arme : nombre, ou formule avec F = PHY+Force (F/2, F/3 arrondis au supérieur), ex. « 2+F/3 » */
/* dégâts de l’arme : nombre, ou formule avec F = PHY+Force (F/2, F/3 arrondis au supérieur), ex. « 2+F/3 » */
function pDmgBase(p,d,w){
  const fx=w?pModFx(w,"armes").deg:0;d=String(d||"").trim().replace(/\s+/g,"");if(/^\d+$/.test(d))return {v:Math.max(0,+d+fx),plain:true,mod:fx};
  const m=d.match(/^(?:(\d+)\+)?F(?:\/(\d+))?(?:\+(\d+))?$/i);if(!m||!p)return null;
  const PH=+p.a.PHY||0,FO=+p.k.Force||0,F=PH+FO,n=m[2]?+m[2]:0,fv=n?Math.ceil(F/n):F,v=Math.max(0,(+m[1]||0)+fv+(+m[3]||0)+fx);
  const expr=[m[1],n?"F/"+n:"F",m[3]].filter(Boolean).join(" + "),vals=[m[1],fv,m[3]].filter(x=>x!==undefined&&x!=="").join(" + ");
  const why=`F = PHY ${PH} + Force ${FO} = ${F}`+(n?` ; ${F}/${n} ${F%n?"arrondi à":"="} ${fv}`:"");
  return {v,mod:fx,html:`${esc(expr)} → ${vals.includes("+")?esc(vals)+" = ":""}<b>${v}</b> <small>(${esc(why)}${fx?" ; mods "+(fx>0?"+":"")+fx:""})</small>`};
}
function pDmgVal(w,rafDmg,trig,p){const b=pDmgBase(p,String(w&&w.deg||"").trim(),w);return b?b.v+rafDmg+trig:null}
/* résumé d’une attaque déjà lancée (enchaînement de Régularité) */
const pRd=(rd,i)=>(Array.isArray(rd)?rd[i]:rd)||0;
function pChainLine(c,w,p){
  return `<div class="prchain"><b>Attaque ${c.n}</b>${c.res.map((r,i)=>{const ok=r.n>0&&r.succ>=c.diff,dv=ok?pDmgVal(w,pRd(c.rafDmg,i),r.trig,p):null;
    return `<span>${c.res.length>1?`Cible ${i+1} : `:""}${ok?"réussite":r.ones>r.succ?"échec critique":"échec"} · ${r.succ} S · ${r.trig} DC${ok?` · dégâts <b>${dv!=null?dv:esc(String(w&&w.deg||"?"))+(r.trig?" + "+r.trig+" DC":"")}</b>`:""}</span>`}).join("")}</div>`;
}
function pDmg(w,rafDmg,trig,p){
  const d=String(w&&w.deg||"").trim();if(!d)return "";const b=pDmgBase(p,d,w);
  if(!b)return [esc(d),rafDmg&&rafDmg+" (rafale)",trig&&trig+" DC"].filter(Boolean).join(" + ");
  const extra=[rafDmg&&rafDmg+" (rafale)",trig&&trig+" DC"].filter(Boolean);
  const first=b.plain?(extra.length?String(b.v):`<b>${b.v}</b>`)+(b.mod?` <small>(mods ${b.mod>0?"+":""}${b.mod})</small>`:""):b.html;
  return extra.length?`${first} + ${extra.join(" + ")} = <b>${b.v+rafDmg+trig}</b>`:first;
}
function pOneRes(r,dif,kind,w,rafDmg,title,p){
  const ok=r.n>0&&r.succ>=dif;const verdict=r.n<=0?"Échec automatique":ok?"Réussite"+(r.trig?" · "+qual(r.trig):""):(r.ones>r.succ?"Échec critique":"Échec");
  return `<div class="prres">${title?`<div class="prt">${esc(title)}</div>`:""}<div class="verdict"><span class="big ${ok?"ok":"ko"}">${DG(verdict)}</span><span class="note">${r.n}D · difficulté ${dif}</span></div>
   <div class="tally"><span><b>${r.succ}</b>succès</span><span><b>${r.trig}</b>déclencheurs</span><span><b>${r.ones}</b>× 1</span></div>${diceView(r)}
   ${ok&&kind==="att"&&w&&w.deg?`<div class="prdmg">Dégâts : ${pDmg(w,rafDmg,r.trig,p)}</div>`:""}</div>`;
}
function pRollPanel(p,at){
  const R=S.pRoll;if(!R||R.at!==at||R.pid!==p.id)return "";
  const tm=pTrauMalus(p),egoLeft=p.pistes.ego.max-p.pistes.ego.v,P=pPlan(p,R),ld=P.w?pLoaded(P.w):0;
  let res="";
  if(R.res&&R.kind==="def"){const r=R.res[0];
    res=`<div class="prres"><div class="verdict"><span class="big ${r.succ?"ok":"ko"}">${DG(r.succ+" succès")}</span><span class="note">${r.n}D · à comparer aux succès de l’attaquant</span></div>
     <div class="tally"><span><b>${r.succ}</b>succès</span><span><b>${r.trig}</b>déclencheurs</span><span><b>${r.ones}</b>× 1</span></div>${diceView(r)}${r.ones>r.succ?`<div class="crit">Plus de 1 que de succès : échec critique.</div>`:""}</div>`}
  else if(R.res&&R.kind==="init"){const r=R.res[0];
    res=`<div class="prres"><div class="verdict"><span class="big ok">${DG("Initiative "+r.succ)}</span><span class="note">${r.n}D</span></div>
     <div class="tally"><span><b>${r.succ}</b>succès</span><span><b>${r.trig}</b>déclencheurs</span><span><b>${1+Math.floor(r.trig/2)}</b>action${r.trig>=2?"s":""}</span></div>${diceView(r)}
     <div class="note">${r.succ?`Score d’Initiative ${r.succ}`:"Aucun succès : une action à Initiative 0"} · ${1+Math.floor(r.trig/2)} action${r.trig>=2?"s":""} ce round (1 + 1 par tranche de 2 déclencheurs).</div></div>`}
  else if(R.res&&R.sonic){const r=R.res[0],w=P.w,d=pSonicDeg(w),t=(R.tech||{}).trig||0;
    if(R.sonic===1){const ok=r.n>0&&r.succ>=1;
      res=pOneRes(r,1,"sonic",w,0,"Réglage · INT + Technologie",p)+(ok?`<div class="prson"><div class="note"><b>${r.trig}</b> déclencheur${r.trig>1?"s":""} de Technologie reportés dans les dégâts (ils ne comptent pas comme succès pour la Domination).</div><button class="btn red pib" data-pa="rson">${IC_SONIC}Jet de Domination</button></div>`:`<div class="ptrw">Réglage raté : l’attaque échoue.</div>`)}
    else{const tot=1+t+r.trig;
      res=pOneRes(r,1,"sonic",w,0,"Domination · PSY + Domination",p).replace(/ · difficulté 1/,"")+(r.succ>0?`<div class="prson"><div class="prdmg"><b>Défense de la cible</b> : PSY + Foi/Volonté, difficulté <b>${r.succ}</b>.</div><div class="prdmg">Dégâts : 1 + ${t} (DC Technologie) + ${r.trig} (DC Domination) = <b>${tot}</b> point${tot>1?"s":""} ${d[0]}</div></div>`:`<div class="ptrw">Aucun succès en Domination : la cible n’est pas touchée.</div>`)}}
  else if(R.res){
    const n=R.res.length;
    res=(R.chain&&R.chain.length?`<div class="prchains">${R.chain.map(c=>pChainLine(c,P.w,p)).join("")}</div>`:"")+(R.resInfo?`<div class="prinfo">${esc(R.resInfo)}</div>`:"")+R.res.map((r,i)=>pOneRes(r,R.resDiff,R.kind,P.w,pRd(R.resRafDmg,i),n>1?"Cible "+(i+1):"",p)).join("")+(R.dev?pDevView(R.dev):"");
    const rg=P.w?pRegul(P.w):0;
    if(R.kind==="att"&&rg&&R.res.some(r=>r.succ>=R.resDiff&&r.trig>=rg)){
      const can=!P.cap||pLoaded(P.w)>=(R.resRaf||1);
      res+=`<div class="prregul"><div class="note">Régularité (${rg}DC) atteinte : nouvelle attaque immédiate à −${2*((R.regul||0)+1)}D.</div>${can?`<button class="btn red" data-pa="rregul">Attaquer encore (−${2*((R.regul||0)+1)}D)</button>`:`<div class="ptrw">Plus assez de balles pour attaquer encore.</div>`}</div>`}
  }
  /* mode de tir */
  let mode="";
  if(P.rx){const opts=[0];for(let i=2;i<=P.rx;i++)opts.push(i);
    mode=`<div class="prmode">${opts.map(v=>`<button class="chip" data-pa="rraf" data-v="${v}" aria-pressed="${P.raf===v}"${v>ld?" disabled":""}>${v?(opts.length>3?"Raf. ":"Rafale ")+v:(opts.length>3?"Coup/coup":"Coup par coup")}</button>`).join("")}</div>`;
    if(P.raf)mode+=`<div class="prrow"><span>Cibles <small>(1 à ${P.raf})</small></span>${pStep2("rcib",P.cib)}</div>`;}
  const split=P.cib>1?(P.pool%P.cib?P.dice.map(d=>d+"D").join(" + "):`${P.cib} × ${P.per}D`):`${P.pool}D`;
  const recap=[R.calc,tm?`Traumatismes −${tm}D`:"",P.egoInit?`Ego de l’Initiative +${P.egoInit}D (1re action)`:"",P.raf?`Rafale +${P.raf}D`:"",pRngMal(p,R,P.w)?`Portée ${R.rng===1?"longue":"extrême"} −${4*R.rng}D`:"",R.regul?`Régularité −${2*R.regul}D`:""].filter(Boolean).join(" · ");
  const dmgPrev=P.w&&P.w.deg?(P.cib>1&&P.raf?P.balls.map((b,i)=>`<div class="prdmg">Dégâts cible ${i+1} (${b} balle${b>1?"s":""}) : ${pDmg(P.w,b,0,p)} + déclencheurs</div>`).join(""):`<div class="prdmg">Dégâts : ${pDmg(P.w,P.rafDmg,0,p)} + déclencheurs</div>`):"";
  return `<div class="proll"><div class="prh"><span>${esc(R.label)}${R.regul?` · attaque ${R.regul+1}`:""}</span><button class="prx" data-pa="rollx" aria-label="Fermer">×</button></div>
   <div class="prcalc">${esc(recap)}</div>
   ${mode}
   ${R.kind==="att"&&pRngOk(p,P.w)?`<div class="prmode prrng" role="group" aria-label="Distance de tir">${[["Normale",0],["Longue −4D",1],["Extrême −8D",2]].map(([l,v])=>`<button class="chip" data-pa="rrng" data-v="${v}" aria-pressed="${(+R.rng||0)===v}">${l}</button>`).join("")}</div>`:""}
   <div class="prrow"><span>Modificateur</span>${pStep2("rmod",R.mod>0?"+"+R.mod:R.mod)}</div>
   ${R.kind!=="init"?"":`<div class="prrow"><span>Ego dépensé <small>(+1D, max 3 · reste ${egoLeft})</small></span>${pStep2("rego",R.ego)}</div>`}
   ${R.kind==="init"||R.kind==="def"||R.kind==="sonic"?"":`<div class="prdifw"><span>Difficulté</span><div class="diffs prdif">${[1,2,3,4,5,6,7,8,9,10].map(d=>`<button class="chip" data-pa="rdiff" data-v="${d}" aria-pressed="${R.diff===d}">${d}</button>`).join("")}</div></div>`}
   ${R.kind==="att"&&P.cap?`<div class="note">Chargeur ${ld}/${P.cap} · ${P.raf||1} balle${(P.raf||1)>1?"s":""} par tir</div>`:""}${R.kind==="att"?dmgPrev:""}${R.kind==="sonic"?`<div class="prdmg">${R.sonic===2?"Domination : succès = difficulté de la défense · ":""}Dégâts : 1 + DC Technologie${R.sonic===2?` (${(R.tech||{}).trig||0})`:""} + DC Domination → ${pSonicDeg(P.w)[1]}</div>`:""}
   ${P.cap&&ld<(P.raf||1)?`<div class="ptrw">${ld?"Pas assez de balles pour ce mode.":"Arme vide : recharge avant de tirer."}</div>`:R.kind!=="init"&&R.sonic!==2&&pActLeft(p)!==null&&pActLeft(p)<=0&&!R.res?`<div class="ptrw">${(p.combat||{}).init==null?"Lance d’abord l’Initiative.":"Plus d’action ce round."}</div>`:(R.kind!=="init"&&R.sonic!==2&&pActLeft(p)!==null&&pActLeft(p)<=0)||(R.sonic===2&&R.res)?"":`<button class="roll" data-pa="rgo">LANCER ${split}</button>`}${res}</div>`;
}
/* exécute le jet (premier tir ou attaque de Régularité) */
function pDevView(v){
  return `<div class="pdev"><span class="pdevi">${IC_GRENADE}</span><div><div class="pdevv"><b>${v.m}</b> m <small>d’écart</small></div><div class="note">${v.ok?`Réussite : 1D − DC = ${v.d[0]} − ${v.dc}${v.d[0]<v.dc?" (minimum 0)":""}`:`Échec : 2D = ${v.d[0]} + ${v.d[1]}`}. Mesuré à partir de la cible visée.</div></div></div>`}
function pDoRoll(p){
  const R=S.pRoll;if(!R)return;const P=pPlan(p,R);
  const counts=R.kind!=="init"&&R.at!=="spo"&&R.at!=="def:mentale"&&R.sonic!==2&&!R.regul&&p.combat&&p.combat.on;
  if(counts&&pActLeft(p)<=0){toast(p.combat.init==null?"Lance d’abord l’Initiative":"Plus d’action ce round");return}
  if(P.cap&&pLoaded(P.w)<(P.raf||1))return;
  const gren=R.kind==="att"&&P.w&&pGrenade(P.w);
  if(gren&&(+P.w.qte||0)<=0){toast("Plus de grenade « "+(P.w.nom||"")+" »");return}
  const egoSpent=R.kind==="init"?R.ego:0;
  if(egoSpent||P.cap||P.egoInit||gren)pSnap(p,R.label+(R.regul?" (Régularité)":""));
  if(P.egoInit&&p.combat)p.combat.egoUsed=true;
  if(counts){if(!P.cap&&!P.egoInit&&!gren)pSnap(p,R.label);p.combat.used=(p.combat.used||0)+1}
  if(egoSpent)p.pistes.ego.v=Math.min(p.pistes.ego.max,p.pistes.ego.v+R.ego);
  if(P.cap)P.w.cur=pLoaded(P.w)-(P.raf||1);
  if(gren)P.w.qte=(+P.w.qte||0)-1;
  const res=P.dice.map(n=>rollPool(n));
  R.res=res;R.resDiff=R.diff;R.resRaf=P.raf;R.resRafDmg=P.balls;
  if(R.kind==="init"&&p.combat&&p.combat.on){const r=res[0];p.combat.init=r.succ;p.combat.act=1+Math.floor(r.trig/2);p.combat.ego=egoSpent;p.combat.egoUsed=false;p.combat.used=0}
  /* grenade (propriété Déviation) : réussite → 1D − DC mètres d’écart ; échec → 2D mètres */
  R.dev=null;
  if(R.kind==="att"&&P.w&&pGrenade(P.w)&&res[0]){const r=res[0],ok=r.succ>=R.diff,d=[1+rnd(6)];if(!ok)d.push(1+rnd(6));
    R.dev={ok,d,dc:ok?r.trig:0,m:ok?Math.max(0,d[0]-r.trig):d[0]+d[1]}}
  R.resInfo=R.kind==="att"?[P.cap?`${P.raf||1} balle${(P.raf||1)>1?"s":""} tirée${(P.raf||1)>1?"s":""}`:"",P.raf&&P.cib>1?`rafale de ${P.raf} sur ${P.cib} cibles : ${P.balls.map((b,i)=>`cible ${i+1} ${P.dice[i]}D, ${b} balle${b>1?"s":""} (+${b} dégât${b>1?"s":""})`).join(" · ")}`:P.raf?`rafale de ${P.raf} : +${P.raf}D et +${P.raf} dégâts`:"",R.regul?`Régularité −${2*R.regul}D`:""].filter(Boolean).join(" · "):"";
  if(!R.regul)R.ego=0;
  if(P.cap&&R.raf>pLoaded(P.w)){const m=Math.min(P.rx,pLoaded(P.w));R.raf=m<2?0:m}
  if(R.sonic){const r=res[0],w=P.w,d=pSonicDeg(w);
    if(R.sonic===1){R.tech={succ:r.succ,trig:r.trig};pushHist(`${w.nom||"Arme sonique"} · réglage Technologie ${r.n}D (diff. 1)`,`${r.succ} S · ${r.trig} DC${r.succ>=1?" · réglé":" · raté"}`)}
    else{const t=(R.tech||{}).trig||0;pushHist(`${w.nom||"Arme sonique"} · Domination ${r.n}D`,r.succ>0?`${r.succ} S → défense diff. ${r.succ} · ${1+t+r.trig} pt${1+t+r.trig>1?"s":""} ${d[0]}`:"0 S · échec")}
    return}
  res.forEach((r,i)=>{if(R.kind==="init")pushHist(`Initiative ${r.n}D`,`${r.succ} S · ${r.trig} DC · ${1+Math.floor(r.trig/2)} action(s)`);
    else pushHist(`${R.label}${res.length>1?" · cible "+(i+1):""} ${r.n}D (diff. ${R.diff})`,`${r.succ} S · ${r.trig} DC${r.succ>=R.diff?" · réussite":r.ones>r.succ?" · échec critique":" · échec"}`)});
}
const pStep2=(k,v)=>`<span class="pstep"><button data-pa="rstep" data-k="${k}" data-d="-1" aria-label="Moins">−</button><output>${v}</output><button data-pa="rstep" data-k="${k}" data-d="1" aria-label="Plus">+</button></span>`;
const SHIELD='<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="M24 4l16 6v12c0 10.5-6.8 18.6-16 22C14.8 40.6 8 32.5 8 22V10z"/><path d="M24 4v40"/><path d="M8 22h32"/><path d="M15 13l4 4M33 13l-4 4" opacity=".7"/></svg>';
/* Bloc armure : armures de l’Inventaire (portées par défaut), total des valeurs numériques, propriétés et mods */
const BRAIN='<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 00-6 6 6 6 0 00-4 6c0 2.4 1 4.2 2.6 5.4A6.5 6.5 0 0012 32a6 6 0 006 6h1V8zM30 8a6 6 0 016 6 6 6 0 014 6c0 2.4-1 4.2-2.6 5.4A6.5 6.5 0 0136 32a6 6 0 01-6 6h-1V8z"/><path d="M24 8v32M13 17h6M29 17h6M13 27h6M29 27h6"/></svg>';
const pMental=p=>{const A=+p.a.PSY||0,K=x=>+p.k[x]||0,c=K("Volonté")>K("Foi")?"Volonté":"Foi";return {c,v:A+K(c),t:`PSY ${A} + ${c} ${K(c)}`}};
/* Défense mentale (Katharsys) : PSY + Foi ou Volonté, contre les influences mentales (Domination, Commandement…) */
function pMentalBlock(p){const M=pMental(p);
  return `<section class="psec parm pment"><div class="pst">Défense mentale</div>
   <div class="parh"><span class="paric">${BRAIN}</span><div><div class="parv">${M.v}<small> D</small></div><div class="pil">${esc(M.t)}</div></div><button class="btn" data-pa="defroll" data-k="mentale">Jet de défense</button></div>
   ${pRollPanel(p,"def:mentale")}</section>`}
/* Potentiels qui ajoutent de l’armure : Cuir d’éléphant (+1 par niveau), Dur à cuire (armure additionnelle Carapace = niveau) */
function pArmorPots(p){const lv=n=>p.pots.filter(x=>norm(String(x.n||"")).replace(/[^a-z]/g,"")===n).reduce((s,x)=>s+Math.max(0,+x.lvl||0),0);
  return [["Cuir d’éléphant",lv("cuirdelephant")],["Carapace (Dur à cuire)",lv("duracuire")]].filter(x=>x[1]>0)}
function pArmorBlock(p){
  const L=p.armures.map((x,i)=>[x,i]),bon=pArmorPots(p),bt=bon.reduce((s,x)=>s+x[1],0);
  const worn=L.filter(([x])=>x.porte!==false),tot=worn.reduce((s,[x])=>s+nb(x.va)+pModFx(x,"armures").arm,0)+bt;
  const props=[...new Set(worn.flatMap(([x])=>String(x.prop||"").split(/[,;]/).map(t=>t.trim()).filter(Boolean)))];
  const chips=bon.map(([n,v])=>`<span class="bon">${esc(n)} +${v}</span>`).concat(props.map(t=>`<span>${esc(t)}</span>`));
  return `<section class="psec parm"><div class="pst">Armure</div>
   <div class="parh"><span class="paric${tot||L.length?"":" off"}">${SHIELD}</span><div><div class="parv">${tot}<small> armure</small>${worn.length?`<span class="parnm">${esc(worn.map(([x])=>x.nom||"Armure").join(" · "))}</span>`:""}</div>${chips.length?`<div class="parp">${chips.join("")}</div>`:(L.length?"":`<div class="pil">Aucune armure dans l’Inventaire.</div>`)}</div></div></section>`;
}
function pCombat(p){
  const c=p.combat||{};
  if(c.on&&c.init==null&&(!S.pRoll||S.pRoll.at!=="init"||S.pRoll.pid!==p.id))pOpenRoll(p,"init",pInitOpts(p));
  let h=(c.on?(S.pRoll&&S.pRoll.at==="init"&&S.pRoll.pid===p.id?`<section class="psec"><div class="pst">Round ${c.round} : initiative</div>${pRollPanel(p,"init")}</section>`:""):`<button class="roll pstart" data-pa="cstart">COMMENCER LE COMBAT</button>`)
   +pArmorBlock(p)+pMentalBlock(p)+`<section class="psec"><div class="pst">Condition</div>${P_PISTES.map(([k,l])=>pTrack(p,k,l)).join("")}
   </section>`;
  /* défense et autres actions */
  const al=pActLeft(p),dis=pActDis(p);
  h+=`<section class="psec"><div class="pst">Défense et autres actions</div>
   ${al!==null&&al<=0?`<div class="ptrw">${(p.combat||{}).init==null?"Lance l’Initiative pour agir.":"Plus d’action ce round : passe au round suivant."}</div>`:""}
   <div class="pdef"><button class="btn" data-pa="defroll" data-k="parade"${dis}>${IC_PARRY}<span>Parade</span><small>PHY+Lutte</small></button><button class="btn" data-pa="defroll" data-k="esquive"${dis}>${IC_DODGE}<span>Esquive</span><small>AGI+Mobilité</small></button><button class="btn${S.pOther?" red":""}" data-pa="other"${dis}>${IC_OTHER}<span>Autre</span><small>compétence</small></button></div>
   ${S.pOther&&!dis?`<label class="pl"><span>Choisir une compétence</span><select class="pin psel" data-pother="1"><option value="">—</option>${P_ATTR.map(([id,n,sk])=>`<optgroup label="${n} ${+p.a[id]||0}">${sk.map(x=>`<option value="${id}|${esc(x)}">${esc(x)} · ${(+p.a[id]||0)+(+p.k[x]||0)}D</option>`).join("")}</optgroup>`).join("")}</select></label>`:""}
   ${pRollPanel(p,"def:parade")}${pRollPanel(p,"def:esquive")}${pRollPanel(p,"def:autre")}</section>`;
  /* armes */
  h+=`<section class="psec"><div class="pst">Armes</div>${p.armes.length?p.armes.map((w,i)=>{
    const va=pWV(p,w),cap=pCap(w),ld=pLoaded(w),am=pAmmoFor(p,w);
    const stock=am.reduce((s,m)=>({c:s.c+(+m.chargeurs||0),b:s.b+(+m.balles||0)}),{c:0,b:0});
    return `<div class="pwpn"><div class="pwh"><span class="pwn">${esc(w.nom||"Arme")}</span>${va?`<span class="pwva">${va.v}D</span>`:""}</div>
     <div class="pil">${esc([w.deg&&"Dégâts "+pDegTxt(w),w.portee&&"Portée "+w.portee,va?va.t:pSonic(w)?"INT + Technologie, puis PSY + Domination":(w.comp?w.comp+" (compétence non reconnue)":"Compétence d’attaque à renseigner")].filter(Boolean).join(" · "))}</div>
     ${w.prop?`<div class="pil pml">${esc(w.prop)}</div>`:""}${pGrenade(w)?`<div class="pammo pgren">${(+w.qte||0)>0?`<span class="pgi">${Array.from({length:Math.min(+w.qte||0,12)},()=>IC_GRENADE).join("")}</span>`:`<span class="pil">Plus de grenade</span>`}<span class="pamt">${+w.qte||0}</span></div>`:""}
     ${cap&&pAgentW(w)?pAgentUI(p,w,i,cap,ld):cap?`<div class="pammo">${trackBoxes(cap,ld,"ammo")}<span class="pamt">${ld}/${cap}</span></div>
       <div class="pil">${w.cal?`Réserve ${esc(w.cal)} : ${stock.b} balle${stock.b>1?"s":""}${stock.c?` (${stock.c} chargeur${stock.c>1?"s":""})`:""}`:"Indique le calibre de l’arme dans l’Inventaire pour recharger depuis la réserve."}</div>`:""}
     <div class="btnrow"><button class="btn red pib" data-pa="attack" data-k="${i}"${pActDis(p)||(pGrenade(w)&&(+w.qte||0)<=0?" disabled":"")}>${pSonic(w)?IC_SONIC:pGrenade(w)?IC_GRENADE:pRanged(p,w)?IC_BALL:IC_KNIFE}${pGrenade(w)?"Lancer":"Attaquer"}</button>${pMelee(p,w)?`<button class="btn pib" data-pa="wparry" data-k="${i}"${pActDis(p)}>${IC_PARRY}Parer</button>`:""}${cap?`<button class="btn" data-pa="reload" data-k="${i}"${(pAgentW(w)?!pAgentCan(p,w,i):ld>=cap)?" disabled":""}>Recharger</button>`:""}</div>${pRollPanel(p,"w:"+i)}${pRollPanel(p,"wp:"+i)}</div>`}).join(""):`<p class="pnone">Aucune arme. Ajoute-les dans l’Inventaire.</p>`}</section>`;
  /* à portée de main */
  const cons=p.equip.map((x,i)=>[x,i]).filter(([x])=>x.combat);
  h+=`<section class="psec"><div class="pst">À portée de main</div>${cons.length?cons.map(([x,i])=>`<div class="pcons"><div class="pih"><span class="pin2">${esc(x.nom||"—")}</span><span class="pq${(+x.qte||0)<=0?" low":""}">${pStep("equip."+i+".qte",+x.qte||0)}</span><button class="btn sm red" data-pa="use" data-k="${i}"${(+x.qte||0)<=0?" disabled":""}>Utiliser</button></div>${x.effet?`<div class="pil">${esc(x.effet)}</div>`:""}</div>`).join(""):`<p class="pnone">Coche « À portée de main en combat » sur un objet de l’Inventaire pour le retrouver ici.</p>`}</section>`;
  /* annuler */
  const U=(S.pUndo||[]).filter(u=>u.id===p.id);
  if(U.length)h+=`<button class="btn pundo" data-pa="undo">↶ Annuler : ${esc(U[U.length-1].label)}</button>`;
  return h;
}
function pAgentUI(p,w,i,cap,ld){const a=pAgentFind(w.agent),st=pAgentStock(p,w),sel=pAgentSel(p,w,i);
  return `<div class="pammo">${trackBoxes(cap,ld,"ammo")}<span class="pamt">${ld}/${cap}</span></div>
  <div class="pil pagent">${a?`<b>${esc(a.Agent)}</b>${ld?"":" (vide)"} · ${esc(a.Effet||"")}`:"Aucun agent chargé."}</div>
  ${st.length?`<select class="pin psel pagsel" data-pagsel="${i}">${st.map(o=>`<option value="${esc(o.x.nom)}"${norm(o.x.nom)===norm(sel)?" selected":""}>${esc(o.x.nom)} · ${+o.x.balles||0} en stock</option>`).join("")}</select>`:`<div class="pil">${pInject(w)?"Aucune dose en stock (agents « Injecteur : oui » dans les Munitions).":"Aucune cartouche en stock : ajoute une cartouche d’agent dans les Munitions."}</div>`}`}
/* retire l’agent chargé : cartouche entamée gardée en stock avec ses utilisations restantes (fusil), ou cartouches rendues au stock (lance-cartouches, pistolet) */
function pAgentUnload(p,w){const ld=pLoaded(w),a=pAgentFind(w.agent);if(!a||ld<=0)return;
  const mk=(nom,n,u)=>{const m=p.mun.find(x=>x.nom===nom);if(m)m.balles=(+m.balles||0)+n;else p.mun.push(Object.assign({nom,chargeurs:0,balles:n,deg:"–",agent:a.Agent,effet:a.Effet||""},u?{uses:u}:{}))};
  if(pAgentFull(w)){const cap=pCap(w);if(ld>=cap)mk(a.Nom,1,0);else mk(a.Nom+" (entamée, "+ld+"/"+cap+")",1,ld)}
  else mk(a.Nom,ld,0);
  w.cur=0}
const pAgentPick=(p,w,i)=>{const st=pAgentStock(p,w),n=pAgentSel(p,w,i);return st.find(o=>norm(o.x.nom)===norm(n))||st[0]||null};
function pAgentCan(p,w,i){const o=pAgentPick(p,w,i);if(!o)return true;const cap=pCap(w),ld=pLoaded(w);return !(norm(w.agent)===norm(o.a.Agent)&&ld>=cap&&!o.x.uses)}
function pAgentReload(p,w,i){const cap=pCap(w),ld=pLoaded(w),o=pAgentPick(p,w,i);
  if(!o){toast(pInject(w)?"Aucune dose en stock":"Aucune cartouche en stock");return true}
  const full=pAgentFull(w),same=norm(w.agent)===norm(o.a.Agent);
  if(!pAgentCan(p,w,i)){toast("Déjà chargé : "+o.a.Agent);return true}
  pSnap(p,"Recharger "+(w.nom||""));let msg;
  if(full){const part=+o.x.uses||0,keep=ld>0&&ld<cap;pAgentUnload(p,w);o.x.balles=(+o.x.balles||0)-1;w.agent=o.a.Agent;w.cur=part||cap;msg="Cartouche « "+o.a.Agent+" » chargée · "+w.cur+" utilisation"+(w.cur>1?"s":"")+(keep?" (l’ancienne cartouche entamée reste en stock)":"")}
  else{if(!same)pAgentUnload(p,w);const have=same?ld:0,t=Math.min(cap-have,+o.x.balles||0);o.x.balles=(+o.x.balles||0)-t;w.agent=o.a.Agent;w.cur=have+t;msg=t+" × « "+o.a.Agent+" » chargé"+(t>1?"s":"")+(w.cur<cap?" (stock épuisé)":"")}
  p.mun=p.mun.filter(x=>!(x.uses&&(+x.balles||0)<=0));toast(msg);return true}
function pSnap(p,label){S.pUndo=(S.pUndo||[]).concat({id:p.id,label,json:JSON.stringify(p)}).slice(-10)}
let pWakeLock=null;
async function pWake(on){try{if(on&&!pWakeLock&&navigator.wakeLock){pWakeLock=await navigator.wakeLock.request("screen");pWakeLock.addEventListener("release",()=>{pWakeLock=null})}else if(!on&&pWakeLock){await pWakeLock.release();pWakeLock=null}}catch(e){}}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")pWake(S.view==="personnage"&&!!pCur()&&S.pTab==="combat")});
const pInitOpts=p=>({kind:"init",label:"Initiative"+(p.combat&&p.combat.on?" · round "+p.combat.round:""),calc:`PSY ${+p.a.PSY||0} + Réactivité ${+p.k["Réactivité"]||0}`,base:(+p.a.PSY||0)+(+p.k["Réactivité"]||0),diff:1});
/* après un jet : faire défiler pour que le bloc de résultat soit entièrement visible sous l’en-tête collant */
function pShowResult(){requestAnimationFrame(()=>{
  const box=app.querySelector(".proll"),res=box&&[...box.querySelectorAll(".prres")];if(!res||!res.length)return;
  const first=box.querySelector(".prchains")||box.querySelector(".prinfo")||res[0],last=box.querySelector(".prregul")||res[res.length-1];
  const top=$(".top"),head=(top?top.getBoundingClientRect().bottom:0)+8,vh=window.innerHeight-8;
  const a=first.getBoundingClientRect().top,b=last.getBoundingClientRect().bottom;
  let dy=0;if(b-a<=vh-head){if(a<head)dy=a-head;else if(b>vh)dy=b-vh}else dy=a-head;
  if(dy)window.scrollBy({top:dy,behavior:"smooth"})})}
function pOpenRoll(p,at,o){S.pRoll=Object.assign({pid:p.id,at,mod:0,ego:0,diff:2,raf:0,cib:1,regul:0,res:null},o)}
function pCombatAction(act,a,p){
  const k=a.dataset.k;
  switch(act){
    case "trk":{const t=p.pistes[k],d=+a.dataset.d;const lab={ego:"Ego",spo:"Sporulations",bles:"Blessures",trau:"Traumatismes"}[k];
      if(k==="ego"){const nv=Math.max(0,Math.min(t.max,t.v-d));if(nv===t.v)return true;pSnap(p,(d<0?"Ego −1":"Ego +1"));t.v=nv;return true}
      if(k==="bles"&&d>0&&t.v>=t.max){const tr=p.pistes.trau;if(tr.v<tr.max){pSnap(p,"Traumatisme +1");tr.v++;toast("Blessures au maximum : +1 Traumatisme")}return true}
      const nv=Math.max(0,Math.min(k==="spo"?t.max+30:t.max,t.v+d));if(nv===t.v)return true;pSnap(p,lab+(d>0?" +1":" −1"));t.v=nv;if(k==="spo"&&t.perm>nv)t.perm=nv;return true}
    case "perm":{const t=p.pistes.spo,d=+a.dataset.d,np=Math.max(0,Math.min(t.max+30,pSpoPerm(p)+d));if(np===pSpoPerm(p))return true;pSnap(p,"Sporulation permanente "+(d>0?"+1":"−1"));t.perm=np;if(t.v<np)t.v=np;return true}
    case "spoadd":{const t=p.pistes.spo;pSnap(p,"Sporulation permanente +1");t.perm=pSpoPerm(p)+1;if(t.v<t.perm)t.v=t.perm;if(S.pRoll)S.pRoll.permDone=true;return true}
    case "spotest":{const t=p.pistes.spo,ex=Math.max(1,t.v-t.max),A=x=>+p.a[x]||0,K=x=>+p.k[x]||0,c=K("Volonté")>K("Foi")?"Volonté":"Foi";
      pOpenRoll(p,"spo",{kind:"sk",label:"Résister à l’Amorce",calc:`Psyché ${A("PSY")} + ${c} ${K(c)}`,base:A("PSY")+K(c),diff:Math.min(10,ex)});return true}
    case "armor":{const x=p.armures[+k];if(x){pSnap(p,(x.porte===false?"Porter ":"Ranger ")+(x.nom||"armure"));x.porte=x.porte===false}return true}
    case "egomax":pSnap(p,"Ego au maximum");p.pistes.ego.v=0;return true;
    case "cstart":pSnap(p,"Commencer le combat");p.combat={on:true,round:1,init:null,act:null,ego:0};pOpenRoll(p,"init",pInitOpts(p));window.scrollTo(0,0);return true;
    case "cnext":{const c=p.combat;if(!c||!c.on)return true;pSnap(p,"Round suivant");c.round++;c.init=null;c.act=null;c.ego=0;c.used=0;S.pOther=false;pOpenRoll(p,"init",pInitOpts(p));window.scrollTo(0,0);return true}
    case "attack":{const w=p.armes[+k];
      if(pSonic(w)){const A=+p.a.INT||0,T=+p.k.Technologie||0;pOpenRoll(p,"w:"+k,{kind:"sonic",sonic:1,w:+k,label:"Attaque sonique · "+(w.nom||"arme")+" · réglage",calc:`INT ${A} + Technologie ${T}`,base:A+T,diff:1});return true}
      const va=pWV(p,w);pOpenRoll(p,"w:"+k,{kind:"att",w:+k,label:"Attaque · "+(w.nom||"arme"),calc:va?va.t:"Compétence non reconnue : règle avec le modificateur",base:va?va.v:0});return true}
    case "defroll":{const D={parade:["PHY","Lutte","Parade"],esquive:["AGI","Mobilité","Esquive"],mentale:["PSY",pMental(p).c,"Défense mentale"]}[k];if(!D)return true;S.pOther=false;
      pOpenRoll(p,"def:"+k,{kind:"def",label:D[2],calc:`${P_ATTR.find(x=>x[0]===D[0])[1]} ${+p.a[D[0]]||0} + ${D[1]} ${+p.k[D[1]]||0}`,base:(+p.a[D[0]]||0)+(+p.k[D[1]]||0)});return true}
    case "wparry":{const w=p.armes[+k];pOpenRoll(p,"wp:"+k,{kind:"def",label:"Parade · "+(w.nom||"arme"),calc:`Physique ${+p.a.PHY||0} + Corps à corps ${+p.k["Corps à corps"]||0}`+pManTxt(pMan(w)),base:Math.max(0,(+p.a.PHY||0)+(+p.k["Corps à corps"]||0)+pMan(w))});return true}
    case "other":S.pOther=!S.pOther;if(!S.pOther&&S.pRoll&&S.pRoll.at==="def:autre")S.pRoll=null;return true;
    case "skroll":{const at=a.dataset.v,A=P_ATTR.find(x=>x[0]===at);pOpenRoll(p,"k:"+k,{kind:"sk",label:A[1]+" + "+k,calc:`${A[1]} ${+p.a[at]||0} + ${k} ${+p.k[k]||0}`,base:(+p.a[at]||0)+(+p.k[k]||0)});return true}
    case "rollx":S.pRoll=null;return true;
    case "rdiff":if(S.pRoll){S.pRoll.diff=+a.dataset.v;S.pRoll.res=null;S.pRoll.regul=0}return true;
    case "rstep":{const R=S.pRoll;if(!R)return true;const d=+a.dataset.d;R.res=null;R.regul=0;
      if(k==="rmod")R.mod=Math.max(-12,Math.min(12,R.mod+d));
      if(k==="rego")R.ego=Math.max(0,Math.min(3,p.pistes.ego.max-p.pistes.ego.v,R.ego+d));
      if(k==="rcib")R.cib=Math.max(1,Math.min(R.raf||1,(R.cib||1)+d));
      return true}
    case "rson":{const R=S.pRoll;if(!R||!R.tech)return true;const A=+p.a.PSY||0,T=+p.k.Domination||0;
      Object.assign(R,{sonic:2,res:null,mod:0,ego:0,base:A+T,calc:`PSY ${A} + Domination ${T}`,label:"Attaque sonique · "+(p.armes[R.w].nom||"arme")+" · Domination"});return true}
    case "rgo":if(S.pRoll){S.pRoll.regul=0;S.pRoll.chain=[];pDoRoll(p);S._pShowRes=true}return true;
    case "rregul":if(S.pRoll){S._pShowRes=true;const R=S.pRoll;if(R.res)(R.chain=R.chain||[]).push({n:(R.regul||0)+1,res:R.res,diff:R.resDiff,rafDmg:R.resRafDmg||0});S.pRoll.regul=(S.pRoll.regul||0)+1;S.pRoll.raf=Math.min(S.pRoll.raf,S.pRoll.resRaf||0);pDoRoll(p)}return true;
    case "rrng":{const R=S.pRoll;if(!R)return true;R.rng=+a.dataset.v||0;R.res=null;R.regul=0;return true}
    case "rraf":{const R=S.pRoll;if(!R)return true;R.raf=+a.dataset.v||0;R.cib=Math.min(R.cib||1,R.raf||1);R.res=null;R.regul=0;return true}
    case "reload":{const w=p.armes[+k],cap=pCap(w),ld=pLoaded(w);if(pAgentW(w)&&cap)return pAgentReload(p,w,+k);if(ld>=cap)return true;
      const am=pAmmoFor(p,w);if(!w.cal||!am.length){toast(w.cal?"Aucune munition « "+w.cal+" » dans l’Inventaire":"Calibre de l’arme non renseigné");return true}
      /* seules les balles comptent : on complète l’arme avec les balles de la réserve ; le nombre de chargeurs reste indicatif */
      const tot=am.reduce((s,m)=>s+(+m.balles||0),0);if(!tot){toast("Plus de balles « "+w.cal+" »");return true}
      pSnap(p,"Recharger "+(w.nom||""));let need=cap-ld,n=0;for(const m of am){const t=Math.min(need,+m.balles||0);m.balles=(+m.balles||0)-t;need-=t;n+=t;if(!need)break}
      w.cur=ld+n;toast(n+" balle"+(n>1?"s":"")+" chargée"+(n>1?"s":"")+(w.cur<cap?" (réserve épuisée)":""));return true}
    case "use":{const x=p.equip[+k];if(!x||(+x.qte||0)<=0)return true;pSnap(p,"Utiliser "+(x.nom||""));x.qte=(+x.qte||0)-1;toast("Utilisé : "+(x.nom||"objet")+" · reste "+x.qte);return true}
    case "undo":{const U=S.pUndo||[];for(let i=U.length-1;i>=0;i--)if(U[i].id===p.id){const o=pNorm(JSON.parse(U[i].json));const j=PERSOS.findIndex(x=>x.id===p.id);if(j>=0)PERSOS[j]=o;U.splice(i,1);toast("Annulé : "+(o?"dernière action":""));break}S.pRoll=null;return true}
  }
  return false;
}
const pSvg=b=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${b}</svg>`;
const P_SIC={
 "Parcours":pSvg('<path d="M4 7l8-4 8 4M4 12.5l8-4 8 4M4 18l8-4 8 4"/>'),
 "Identité":pSvg('<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M5.8 16.5c.6-2 4.8-2 5.4 0M14 10h4M14 13.5h4"/>'),
 "Attributs et compétences":pSvg('<path d="M12 2.5l8 4.6v9.8l-8 4.6-8-4.6V7.1z"/><circle cx="12" cy="12" r="2.6"/>'),
 "Origines":pSvg('<circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="12" cy="18" r="2.4"/><path d="M8 7.5l3 8M16 7.5l-3 8M8.4 6h7.2"/>'),
 "Potentiels":pSvg('<path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z"/>'),
 "Condition":pSvg('<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0112 7.2 4.3 4.3 0 0119.5 10c0 5.4-7.5 10-7.5 10z"/>'),
 "Modificateurs":pSvg('<path d="M4 7h8M18 7h2M4 17h2M12 17h8"/><circle cx="15" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/>'),
 "Complications":pSvg('<path d="M12 3.2l9.6 16.6H2.4z"/><path d="M12 10v4.5M12 17.4v.3"/>'),
 "Fiche":pSvg('<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>')};
const P_AIC={
 PHY:pSvg('<path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12"/>'),
 AGI:pSvg('<path d="M4 20c4-1 12-5 16-16-9 2-13 8-16 16zM9 15l5-5"/>'),
 CHA:pSvg('<path d="M4 5h16v11H11l-5 4v-4H4z"/>'),
 INT:pSvg('<path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z"/>'),
 PSY:pSvg('<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
 INS:pSvg('<circle cx="12" cy="12" r="9"/><path d="M12 7l3 8-3-2-3 2z"/>')};
function pSheet(p){
  const E=S.pEdit,sec=(t,h)=>`<section class="psec pfs"><div class="pst"><span class="psti">${P_SIC[t]||""}</span>${t}</div>${h}</section>`;
  let h="";
  /* identité */
  h+=sec("Parcours",pParcours(p));
  if(E){h+=sec("Identité",`${pEmblems(p,true)}<div class="pgrid">${P_ID.filter(([k])=>!["rang","xp","lc"].includes(k)).map(([k,l])=>`<label class="pl${k==="nom"?" wide":""}"><span>${l}</span>${k==="nom"?`<div class="pnom">${pIn(k,p[k])}<button class="pdice" data-pa="genname" aria-label="Générer un nom" title="Générer un nom${P_NOMS.cultures[p.culture]?" ("+esc(p.culture)+")":""}">${I.des}</button></div>`:P_SEL[k]?pSel(k,p[k],P_SEL[k]):pIn(k,p[k])}</label>`).join("")}</div>
     <div class="plbl">Héritages (3 au maximum)</div>${p.her.map((v,i)=>pSel("her."+i,v,P_HER.map(x=>x.n),"— Aucun —")).join("")}${p.her.some(v=>herFind(v))?`<p class="note">Le détail de chaque Héritage s’affiche sur la fiche en lecture.</p>`:""}`)}
  else{const L=P_ID.filter(([k])=>k!=="nom"&&!["rang","xp","lc"].includes(k)&&p[k]);const L2=L.filter(([k])=>!["culture","concept","culte"].includes(k));const her=p.her.filter(Boolean);
    h+=sec("Identité",pEmblems(p)+(L2.length?`<div class="pidg">${L2.map(([k,l])=>`<div><span>${l}</span><b>${esc(p[k])}</b></div>`).join("")}</div>`:"")+(her.length?`<div class="plbl">Héritages</div>${her.map(x=>{const f=herFind(x);return f?`<details class="card pot ppotc"><summary><span class="t">${esc(x)}<span class="pc">Bonus : ${esc(f.b||"—")}</span></span></summary><div class="body">${f.c?`<p><span class="k">Condition</span>${esc(f.c)}</p>`:""}${f.h?`<p><span class="k">Héritage</span>${esc(f.h)}</p>`:""}${f.i?`<p><span class="k">Inconvénient</span>${esc(f.i)}</p>`:""}</div></details>`:`<div class="ppot"><span>${esc(x)}</span></div>`}).join("")}`:"")+(!L.length&&!her.length?`<p class="pnone">Touche « Modifier » pour remplir la fiche.</p>`:""))}
  /* attributs */
  h+=`<section class="psec pfs"><div class="pst"><span class="psti">${P_SIC["Attributs et compétences"]}</span>Attributs et compétences</div>${E?`<p class="note">Touche une case pour régler la valeur, retouche la dernière pour l’enlever. ◆ marque un attribut privilégié.</p>`:""}<div class="pattrs">${P_ATTR.map(([id,n,sk])=>{
    const v=+p.a[id]||0,pr=!!p.priv[id];
    return `<div class="pattr"><div class="pah">${E?`<button class="pmk${pr?" on":""}" data-pa="priv" data-k="${id}" aria-label="Attribut privilégié">${pr?"◆":"›"}</button>`:`<span class="pmk${pr?" on":""}">${pr?"◆":"›"}</span>`}<span class="pani">${P_AIC[id]||""}</span><span class="pan">${n}</span>${boxes("a."+id,v,6,E)}</div>
      ${sk.map(s=>E?`<div class="psk"><span>${s}</span>${boxes("k."+s,+p.k[s]||0,6,E)}</div>`:`<button class="psk pskb" data-pa="skroll" data-k="${s}" data-v="${id}"><span>${s}</span>${boxes("k."+s,+p.k[s]||0,6,false)}</button>${pRollPanel(p,"k:"+s)}`).join("")}</div>`}).join("")}</div>${E?"":`<p class="note">Touche une compétence pour lancer les dés (attribut + compétence).</p>`}</section>`;
  /* origines */
  h+=sec("Origines",P_ORIG.map(o=>`<div class="psk"><span>${o}</span>${boxes("o."+o,+p.o[o]||0,6,E)}</div>`).join(""));
  /* potentiels */
  if(E)h+=sec("Potentiels",`<p class="note">${potCulte(p.culte)?"Liste : Potentiels communs et "+esc(potCulte(p.culte))+".":"Aucun culte choisi : tous les Potentiels sont proposés."}</p>`+p.pots.map((x,i)=>`<div class="ppot ed">${potSelect("pots."+i+".n",x.n,p.culte)}${boxes("pots."+i+".lvl",+x.lvl||0,3,true)}${pConfBtn("del:pots."+i,"✕","sm")}</div>`).join("")+`<button class="btn sm" data-pa="addpot">+ Ajouter un Potentiel</button>`);
  else h+=sec("Potentiels",p.pots.length?p.pots.map(x=>{const f=potFind(x.n);const lv=boxes("",+x.lvl||0,3,false);
    return f?`<details class="card pot ppotc"><summary><span class="t">${esc(x.n)}<span class="pc">${esc(f.c)} · Condition : ${esc(f.p.c||"—")}</span></span>${lv}</summary><div class="body">${f.p.e?`<p><span class="k">Effet</span>${esc(f.p.e)}</p>`:""}${f.p.r?`<p><span class="k">Règles</span>${esc(f.p.r)}</p>`:""}</div></details>`
      :`<div class="ppot"><span>${esc(x.n||"—")}</span>${lv}</div>`}).join(""):`<p class="pnone">Aucun Potentiel.</p>`);
  /* condition : maximum réglé + formule de calcul */
  h+=sec("Condition",P_PISTES.map(([k,l])=>{const f=pFormule(p,k),mx=p.pistes[k].max;
    return `<div class="prow pcond pcc ${k}">${pTicon(k)}<span class="pcl">${l}<small>${esc(f.t)} = <b>${f.v}</b>${f.v!==mx?` · réglé : ${mx}`:""}</small></span>${E?`<span class="pmx">${pStep("pistes."+k+".max",mx)}${f.v>0&&f.v!==mx?`<button class="btn sm" data-pa="setmax" data-k="${k}" data-v="${f.v}">= ${f.v}</button>`:""}</span>`:`<b class="pcmx">${mx}<small> cases</small></b>`}</div>`+(k==="spo"?`<div class="prow pcond pperm2"><span class="pcl">Sporulation permanente<small>aucun EX ne peut l’effacer · 50 % du maximum = Léperos</small></span>${pSpoStep(p)}</div>`+(pSpoLep(p)?`<div class="ptrw">${esc(pSpoLep(p))}</div>`:""):"")}).join("")+(E?`<p class="note">Le calcul ne tient pas compte des bonus d’Héritage ou de Potentiel (Impitoyable : Égo +6…) : règle le maximum avec + / −.</p>`:""));
  /* stats, modificateurs, complications */
  if(E)h+=sec("Modificateurs",pTa("modif",p.modif,"Un modificateur par ligne"))+sec("Complications",pTa("compl",p.compl,"Une complication par ligne"));
  else{
    if(p.modif.trim())h+=sec("Modificateurs",`<p class="ptxt">${esc(p.modif)}</p>`);if(p.compl.trim())h+=sec("Complications",`<p class="ptxt">${esc(p.compl)}</p>`)}
  /* outils */
  h+=`<section class="psec pfs"><div class="pst"><span class="psti">${P_SIC["Fiche"]}</span>Fiche</div><div class="btnrow"><button class="btn" data-pa="export">Exporter</button><button class="btn" data-pa="dup">Dupliquer</button><button class="btn" data-pa="arch">${p.arch?"Désarchiver":"Archiver"}</button>${pConfBtn("delp","Supprimer")}</div><p class="note">Exporter crée un fichier à garder en sauvegarde ou à importer sur un autre téléphone.</p></section>`;
  return h;
}
/* balles chargées dans les armes du même calibre que la ligne de munitions */
function pMunLoaded(p,x){const c=calKey(x.nom);if(!p||!c||x.agent)return 0;return p.armes.filter(w=>pCap(w)&&calKey(w.cal)&&(calKey(w.cal).includes(c)||c.includes(calKey(w.cal)))).reduce((s,w)=>s+pLoaded(w),0)}
/* valeur affichée d’un compteur : pour les munitions, le total (réserve + balles chargées) ; les + / − modifient la réserve */
const pQtyShow=(p,key,f,x)=>key==="mun"&&f==="balles"?(+x.balles||0)+pMunLoaded(p,x):+x[f]||0;
/* valeurs affichées d’une arme / armure, mods compris */
const pSgn=n=>(n<0?"−":"+")+Math.abs(n);
function pManVal(w){const f=pModFx(w,"armes").man;return f?pSgn(pMan(w))+"D":w.man}
function pDegTxt(w){const f=pModFx(w,"armes").deg,d=String(w.deg||"").trim();return !f||!d?w.deg:/^\d+$/.test(d)?String(Math.max(0,+d+f)):d+pSgn(f)}
function pEncTxt(x,key){const f=pModFx(x,key).enc;return f&&nb(x.enc)+f>=0?String(nb(x.enc)+f):x.enc}
function pVaTxt(x){const f=pModFx(x,"armures").arm,v=String(x.va||"").trim();return !f?x.va:/^\d+$/.test(v)?String(+v+f):(v?v+" ":"")+pSgn(f)}
function pItemLine(key,x){
  if(key==="armes")return [x.deg&&"Dég. "+pDegTxt(x),x.portee&&"Portée "+x.portee,x.charg&&(pCap(x)?"Chargée "+pLoaded(x)+"/"+pCap(x):"Charg. "+x.charg),x.cal&&"Cal. "+x.cal,pAgentW(x)&&x.agent&&"Agent : "+x.agent,(x.man||pModFx(x,"armes").man)&&"Man. "+pManVal(x),pModFx(x,"armes").enc&&"Enc. "+pEncTxt(x,"armes")].filter(Boolean);
  if(key==="armures")return [(x.va||pModFx(x,"armures").arm)&&"Armure "+pVaTxt(x),(x.enc||pModFx(x,"armures").enc)&&"Enc. "+pEncTxt(x,"armures")].filter(Boolean);
  if(key==="mun")return [x.agent?x.effet:x.deg&&"Dég. "+x.deg].filter(Boolean);
  if(key==="equip")return [x.enc&&"Enc. "+x.enc,x.combat&&"combat"].filter(Boolean);
  return [x.act&&"Activation : "+x.act].filter(Boolean);
}
const P_LIC={
 armes:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="7.5"/><path d="M12 2v6M12 16v6M2 12h6M16 12h6"/></svg>',
 armures:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.5l8 3v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6z"/></svg>',
 mun:IC_BALL,
 equip:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="M8 7V5.5A2.5 2.5 0 0110.5 3h3A2.5 2.5 0 0116 5.5V7"/><rect x="4.5" y="7" width="15" height="14" rx="3"/><path d="M4.5 13h15M10 13v2h4v-2"/></svg>'};
const P_WGT='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="M7 8h10l3 12H4z"/><circle cx="12" cy="5.5" r="2.5"/></svg>';
/* Emplacements de mods : cases cliquables ; une case vide ouvre la liste des mods compatibles */
function pModsUI(p,key,x,base){
  const nm=pModSlots(x,key);if(!nm)return "";
  const ms=pModsOf(x),used=pModUsed(x),ed=!!S.pEdit,open=ed&&S.pModOpen===base,TR='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>';
  let rows="",free="";
  ms.forEach(m=>{const k="dm:"+base+":"+m.i,on=S.pConf===k,ik=base+":"+m.i,info=(S.pModInfo||{})[ik];
    rows+=`<div class="pmrow"><button class="pmbody${info?" open":""}" data-pa="modinfo" data-k="${ik}"><b>${esc(m.n)}</b><small>${m.c} empl.</small></button>${ed?`<button class="pdelx pmdel${on?" on":""}" data-pa="conf" data-k="${k}" aria-label="Retirer ${esc(m.n)}">${on?"Retirer ?":TR}</button>`:""}</div>${info?`<div class="pminfo">${esc(m.d?m.d.t:"Mod libre (texte saisi par le joueur).")}${m.d&&(key==="armures"?m.d.pr:m.d.pw)?`<span class="pmprop">${esc(key==="armures"?m.d.pr:m.d.pw)}</span>`:""}<small>Coût : ${m.c} emplacement${m.c>1?"s":""}${m.d&&m.d.req?" · nécessite "+esc(P_MODID[m.d.req].n):""}</small></div>`:""}`});
  for(let j=used;j<nm;j++)free+=ed?`<button class="pslot${open&&j===used?" on":""}" data-pa="modopen" data-k="${base}" aria-label="Ajouter un mod"><b>+</b><small>libre</small></button>`:"";
  let pick="";
  if(open){const fam=pModFam(x,key),opts=P_MODS.filter(m=>m.fam==="w"?key==="armes"&&fam:m.fam.includes(fam));
    pick=`<div class="pmodpick">${fam||key==="armures"?"":`<p class="pnone">Ce type d’arme n’a pas de mods (choisis « Type d’arme » dans la fiche).</p>`}`+
      opts.map(m=>{const why=pModAvail(x,key,m);return `<button class="pbzr pmo" data-pa="modadd" data-k="${base}" data-v="${m.id}"${why?" disabled":""}><span>${esc(m.n)}</span><small>${esc(why||m.c+" empl.")}</small></button>${m.id==="can"&&S.pModCan===base&&!why?`<div class="pmodtxt"><select class="pin psel" id="pmodcal"><option value="">Nouveau calibre…</option>${P_CALS.map(c=>`<option>${esc(c)}</option>`).join("")}</select><button class="btn sm" data-pa="modcan" data-k="${base}">Valider</button></div>`:""}`}).join("")+
      `<div class="pmodtxt"><input class="pin" id="pmodtxt" placeholder="Autre mod (texte libre, 1 empl.)" autocomplete="off"><button class="btn sm" data-pa="modtxt" data-k="${base}">Ajouter</button></div></div>`}
  return `<div class="pmods"><div class="plbl wide">Mods · ${used}/${nm} emplacement${nm>1?"s":""}</div>${rows}${free?`<div class="pslots">${free}</div>`:""}${pick}</div>`}
function pInv(p){
  const E=S.pEdit;let h=`<div class="penc"><span class="penci">${P_WGT}</span><span class="pencl">Encombrement total</span><b>${String(Math.round(pEnc(p)*10)/10).replace(".",",")}</b></div>`;
  Object.entries(P_LISTS).forEach(([key,L])=>{
    const rows=p[key].map((x,i)=>{const base=key+"."+i;
      const nm=(key==="armes"||key==="armures")?Math.max(0,Math.min(12,Math.floor(nb(x.empl)))):0,mods=Array.isArray(x.mods)?x.mods:[];
      const modsEd=nm?pModsUI(p,key,x,base):"",modsRd=[];
      const okey=p.id+":"+base,Lf=L.f.filter(([f])=>!(key==="armes"&&f==="cur"&&!pCap(x))&&!(key==="armes"&&f==="qte"&&!pGrenade(x))&&!(f==="fam"&&!(key==="armes"&&nm&&!pGrenade(x)))&&!(f==="agent"&&!(key==="armes"&&pAgentW(x)))&&!(key==="mun"&&((f==="chargeurs"||f==="deg"||f==="nom"&&false)&&x.agent||f==="effet"&&!x.agent)));
      if(E&&!(S.pOpen||{})[okey]){const sum=pItemLine(key,x).concat(nm?[nm+" mod"+(nm>1?"s":"")]:[]);const q=Lf.filter(([f,,t])=>t==="n"&&!(key==="armes"&&f==="cur")).map(([f,l])=>(key==="mun"?(f==="chargeurs"?"charg. ":"balles "):"×")+pQtyShow(p,key,f,x));
        const cf=S.pConf==="del:"+base;return `<div class="pitem pcol pcw"><button class="pcopen" data-pa="itemopen" data-k="${okey}"><span class="pcoln"><span class="pin2">${esc(x.nom||"Sans nom")}</span>${sum.length||q.length?`<small>${esc(q.concat(sum).join(" · "))}</small>`:""}</span><span class="pcolm">Modifier ›</span></button>${(key==="armes"||key==="armures")&&p[key].length>1?`<span class="pmv"><button data-pa="mv" data-k="${base}" data-d="-1" aria-label="Monter ${esc(x.nom||"")}"${i===0?" disabled":""}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg></button><button data-pa="mv" data-k="${base}" data-d="1" aria-label="Descendre ${esc(x.nom||"")}"${i===p[key].length-1?" disabled":""}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button></span>`:""}<button class="pdelx${cf?" on":""}" data-pa="conf" data-k="del:${base}" aria-label="Retirer ${esc(x.nom||"")}" title="Retirer">${cf?"Retirer ?":'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>'}</button></div>`}
      if(E)return `<div class="pitem ed"><button class="btn sm pfold" data-pa="itemopen" data-k="${okey}">‹ Replier ${esc(x.nom||"")}</button><div class="pgrid">${Lf.map(([f,l,t])=>t==="b"?`<label class="pchk"><input type="checkbox" data-pf="${base}.${f}"${x[f]?" checked":""}> ${l}</label>`:t==="n"?`<label class="pl"><span>${l}</span>${pStep(base+"."+f,pQtyShow(p,key,f,x))}</label>`:t==="c"?`<label class="pl"><span>${l}</span>${pSel(base+"."+f,pCalCanon(x[f]),P_CALS,"—")}</label>`:t==="a"?`<label class="pl wide"><span>${l}</span>${pSel(base+"."+f,x[f]||"",P_AGENTS.map(r=>r.Agent),"—")}</label>`:t==="s"?`<label class="pl wide"><span>${l}</span>${pSel(base+"."+f,x[f]||"",Object.values(P_FAMN),"Auto : "+(P_FAMN[pModFam(Object.assign({},x,{fam:""}),key)]||"aucun"))}</label>`:`<label class="pl${f==="nom"||f==="prop"||f==="effet"||f==="fonc"?" wide":""}"><span>${l}</span>${f==="prop"||f==="effet"||f==="fonc"?pTa(base+"."+f,x[f]||""):pIn(base+"."+f,x[f]||"")}</label>`).join("")}</div>${modsEd}<div class="btnrow">${pConfBtn("del:"+base,"Retirer","sm")}</div></div>`;
      const q=Lf.filter(([f,,t])=>t==="n"&&!(key==="armes"&&f==="cur"));const det=key==="mun"?[]:Lf.filter(([f,,t])=>f!=="nom"&&f!=="fam"&&t!=="n"&&t!=="b"&&t!=="a"&&x[f]);
      return `<div class="pitem ${key}"><div class="pih${key==="mun"?" mun":""}"><span class="pin2">${esc(x.nom||"—")}</span>${q.map(([f,l])=>`<span class="pq${pQtyShow(p,key,f,x)<=0?" low":""}" title="${l}">${pStep(base+"."+f,pQtyShow(p,key,f,x))}<small>${key==="mun"?(f==="chargeurs"?"charg.":x.agent?"cartouches":"balles au total"):key==="armes"?(f==="qte"?"":"/ "+pCap(x)+" dans l’arme"):""}</small></span>`).join("")}</div>${pItemLine(key,x).length?`<div class="pchips">${pItemLine(key,x).map(t=>`<span>${esc(t)}</span>`).join("")}</div>`:""}${pModsUI(p,key,x,base)}${det.length?`<details class="pdet"><summary>Détails</summary><dl class="statl">${det.map(([f,l])=>`<dt>${l}</dt><dd>${esc(x[f])}</dd>`).join("")}</dl></details>`:""}</div>`}).join("");
    const bz=S.pBz&&S.pBz.list===key?pBzPanel(key):"";
    h+=`<section class="psec pinvs ${key}"><div class="pst"><span class="psti">${P_LIC[key]||""}</span>${L.t}</div>${rows||`<p class="pnone">Rien pour l’instant.</p>`}${E?`<div class="btnrow"><button class="btn sm" data-pa="add" data-k="${key}">+ Ajouter</button><button class="btn sm${bz?" red":""}" data-pa="bz" data-k="${key}">${bz?"Fermer le Bazar":"+ Depuis le Bazar"}</button></div>${bz}`:""}</section>`;
  });
  return h;
}
function pBzPanel(key){
  const q=norm(S.pBz.q).trim(),L=P_LISTS[key];
  const res=BAZAR.filter(r=>L.bz(r)&&(!q||norm(r.Nom+" "+r._cat).includes(q))).slice(0,40);
  return `<div class="pbz"><label class="search">${I.search}<input id="pbzq" data-pbzq="1" type="search" placeholder="Chercher dans le Bazar…" value="${esc(S.pBz.q)}" autocomplete="off"></label>
   ${res.map(r=>`<button class="pbzr" data-pa="bzadd" data-k="${key}" data-v="${BAZAR.indexOf(r)}"><span>${esc(r.Nom)}</span><small>${esc(r._cat)}${r.Culte?" · "+esc(r.Culte):""}</small></button>`).join("")||`<p class="pnone">Rien trouvé.</p>`}</div>`;
}
function pNotes(p){return `<section class="psec"><div class="pst">Notes</div>${pTa("notes",p.notes,"Indices, PNJ rencontrés, objectifs…")}<p class="note">Tes notes restent sur ce téléphone : elles ne seront jamais envoyées au MJ.</p></section>`}

function pExport(p){
  const data=JSON.stringify({format:"codexj-perso",v:1,perso:p},null,1);
  const name=(norm(p.nom||"personnage").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"personnage")+".json";
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data],{type:"application/json"}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);toast("Fiche exportée : "+name);
}
function pImport(file){
  const r=new FileReader();
  r.onload=()=>{try{const j=JSON.parse(r.result);const x=j&&j.format==="codexj-perso"?j.perso:null;if(!x||typeof x!=="object")throw 0;
      const p=pNorm(x);const i=PERSOS.findIndex(o=>o.id===p.id);if(i>=0){PERSOS[i]=p;toast("Fiche mise à jour : "+(p.nom||"sans nom"))}else{PERSOS.push(p);toast("Fiche importée : "+(p.nom||"sans nom"))}
      pSave(true);render()}catch(e){toast("Ce fichier n’est pas une fiche du Codex")}};
  r.readAsText(file);
}
function pAction(a){
  const act=a.dataset.pa,k=a.dataset.k,p=pCur();
  if(act!=="conf")S.pConf=null;
  if(p&&pCombatAction(act,a,p)){p.maj=Date.now();pSave(true);render();return}
  switch(act){
    case "new":{const n=pBlank();PERSOS.push(n);pSave(true);S.pid=n.id;S.pTab="fiche";S.pEdit=true;window.scrollTo(0,0);break}
    case "open":S.pid=k;S.pTab="combat";S.pRoll=null;S.pEdit=false;S.pBz=null;window.scrollTo(0,0);break;
    case "list":S.pid=null;S.pEdit=false;S.pBz=null;window.scrollTo(0,0);break;
    case "edit":S.pEdit=!S.pEdit;S.pBz=null;if(a.dataset.v==="bas"){pSave(true);window.scrollTo(0,0);toast("Fiche enregistrée")}break;
    case "showarch":S.pArch=!S.pArch;break;
    case "unarch":{const x=PERSOS.find(o=>o.id===k);if(x){x.arch=false;pSave(true)}break}
    case "box":{const v=+a.dataset.v,cur=+pGet(p,k)||0;pSet(p,k,cur===v?v-1:v);break}
    case "priv":p.priv[k]=!p.priv[k];break;
    case "inc":{const mm=k.match(/^mun\.(\d+)\.balles$/);
      if(mm){const x=p.mun[+mm[1]];if(x){const T=pQtyShow(p,"mun","balles",x),T2=Math.max(0,Math.min(9999,T+(+a.dataset.d)));if(T2===T)break;
        /* le total ne dépend pas du chargeur : en dessous des balles chargées, on retire aussi des balles dans les armes du même calibre */
        const ld=pMunLoaded(p,x);let cut=Math.max(0,ld-T2);x.balles=Math.max(0,T2-ld);
        if(cut&&!x.agent){const c=calKey(x.nom);p.armes.forEach(w=>{if(!cut||!pCap(w)||!calKey(w.cal)||!(calKey(w.cal).includes(c)||c.includes(calKey(w.cal))))return;const t=Math.min(cut,pLoaded(w));w.cur=pLoaded(w)-t;cut-=t})}}
        break}
      const cur=+pGet(p,k)||0;let v=cur+(+a.dataset.d);v=Math.max(k.endsWith(".max")?1:0,Math.min(k.endsWith(".max")?60:9999,v));
      if(/^armes\.\d+\.cur$/.test(k))v=Math.min(v,pCap(pGet(p,k.replace(/\.cur$/,""))));pSet(p,k,v);
      if(k.startsWith("pistes.")&&k.endsWith(".max")){const t=pGet(p,k.replace(/\.max$/,""));t.v=Math.min(t.v,t.max)}break}
    case "genname":{const C=P_NOMS.cultures,ks=Object.keys(C);if(!ks.length)break;const c=C[p.culture]?p.culture:pick(ks),sx=p.sexe==="Masculin"?"h":p.sexe==="Féminin"?"f":pick(["h","f"]);p.nom=pick(C[c][sx])+" "+pick(C[c].n);break}
    case "setmax":{const t=p.pistes[k];t.max=Math.max(1,Math.min(60,+a.dataset.v||1));t.v=Math.min(t.v,t.max);break}
    case "addpot":p.pots.push({n:"",lvl:1});break;
    case "add":p[k].push({});S.pOpen=S.pOpen||{};S.pOpen[p.id+":"+k+"."+(p[k].length-1)]=true;break;
    case "mv":{const path=k.split("."),i=+path.pop(),arr=pGet(p,path.join(".")),j=i+(+a.dataset.d||0);if(Array.isArray(arr)&&j>=0&&j<arr.length){[arr[i],arr[j]]=[arr[j],arr[i]];S.pOpen={};S.pModOpen=null;S.pConf=null}break}
    case "modinfo":S.pModInfo=S.pModInfo||{};S.pModInfo[k]=!S.pModInfo[k];break;
    case "modopen":S.pModOpen=S.pModOpen===k?null:k;S.pModCan=null;S.pConf=null;break;
    case "modadd":{const x=pGet(p,k),key=k.split(".")[0],m=P_MODID[a.dataset.v];if(x&&m&&!pModAvail(x,key,m)){if(m.id==="can"){S.pModCan=k;break}if(!Array.isArray(x.mods))x.mods=[];x.mods.push(pModApply(x,key,m));S.pModOpen=null;toast("Mod posé : "+m.n)}break}
    case "modcan":{const x=pGet(p,k),m=P_MODID.can,v=(document.getElementById("pmodcal")||{}).value;if(x&&v&&!pModAvail(x,"armes",m)){if(!Array.isArray(x.mods))x.mods=[];x.mods.push(pModApply(x,"armes",m,{cal:v}));S.pModOpen=null;S.pModCan=null;toast("Nouveau calibre : "+v)}break}
    case "modtxt":{const x=pGet(p,k),t=(document.getElementById("pmodtxt")||{}).value;if(x&&t&&t.trim()&&pModUsed(x)<pModSlots(x,k.split(".")[0])){if(!Array.isArray(x.mods))x.mods=[];x.mods.push(t.trim());S.pModOpen=null}break}
    case "itemopen":S.pOpen=S.pOpen||{};S.pOpen[k]=!S.pOpen[k];break;
    case "bz":S.pBz=S.pBz&&S.pBz.list===k?null:{list:k,q:""};if(S.pBz)S._pFocus="#pbzq";break;
    case "bzadd":{const r=BAZAR[+a.dataset.v];if(r){const o=P_FROMBZ[k](r);Object.keys(o).forEach(f=>{if(typeof o[f]==="string"||o[f]==null)o[f]=dash(o[f])});p[k].push(o);toast("Ajouté : "+r.Nom)}S.pBz=null;break}
    case "pre":S.pPre=!S.pPre;render();return;
    case "preadd":{const L=Array.isArray(window.PRETIRES)?window.PRETIRES:[],src=L[+k];if(!src)return;const c=pNorm(JSON.parse(JSON.stringify(src)));c.id=uid();c.cree=Date.now();c.maj=Date.now();c.arch=false;PERSOS.push(c);pSave(true);S.pPre=false;toast("Ajouté : "+(c.nom||"personnage prétiré"));render();return}
    case "expc":{const q=PERSOS.find(o=>o.id===k);if(q)pExport(q);return}
    case "export":pExport(p);return;
    case "dup":{const c=pNorm(JSON.parse(JSON.stringify(p)));c.id=uid();c.nom=(p.nom||"Sans nom")+" (copie)";c.cree=Date.now();PERSOS.push(c);S.pid=c.id;toast("Copie créée");window.scrollTo(0,0);break}
    case "arch":p.arch=!p.arch;if(p.arch){S.pid=null;toast("Personnage archivé")}break;
    case "conf":{if(S.pConf!==k){S.pConf=k;break}S.pConf=null;
      if(k==="cend"){pSnap(p,"Terminer le combat");p.combat={on:false};S.pRoll=null;window.scrollTo(0,0)}
      else if(k==="delp"){PERSOS=PERSOS.filter(o=>o.id!==p.id);S.pid=null;toast("Personnage supprimé")}
      else if(k.startsWith("delc:")){const id=k.slice(5),q=PERSOS.find(o=>o.id===id);PERSOS=PERSOS.filter(o=>o.id!==id);toast("Personnage supprimé"+(q&&q.nom?" : "+q.nom:""))}
      else if(k.startsWith("dm:")){S.pModInfo={};const [,path,i]=k.split(":"),x=pGet(p,path),key=path.split(".")[0];if(x&&Array.isArray(x.mods)){const e=x.mods[+i],id=e&&e.m;pModRevert(x,key,e);x.mods.splice(+i,1);
        /* un mod retiré emporte ceux qui en dépendent (leurs effets sont annulés aussi) */
        if(id&&!x.mods.some(y=>y&&y.m===id))for(let j=x.mods.length-1;j>=0;j--){const d=P_MODID[x.mods[j]&&x.mods[j].m];if(d&&d.req===id){pModRevert(x,key,x.mods[j]);x.mods.splice(j,1)}}}}
      else if(k.startsWith("del:")){const path=k.slice(4).split("."),i=+path.pop(),arr=pGet(p,path.join("."));if(Array.isArray(arr)){arr.splice(i,1);S.pOpen={}}}
      break}
  }
  if(p)p.maj=Date.now();pSave(true);render();
}
app.addEventListener("click",e=>{const a=e.target.closest("[data-pa]");if(!a||!app.contains(a))return;e.preventDefault();pAction(a)});
app.addEventListener("input",e=>{const t=e.target;
  if(t.dataset.pbzq){S.pBz.q=t.value;S._pFocus="#pbzq";render();return}
  const k=t.dataset.pf;if(!k||t.type==="checkbox")return;const p=pCur();if(!p)return;pSet(p,k,t.value);p.maj=Date.now();pSave();
  if(k==="nom"||k==="culte"||k==="culture"||k==="rang"||k==="concept"){const n=app.querySelector(".phn"),m=app.querySelector(".phm");if(n)n.textContent=p.nom||"Sans nom";if(m)m.textContent=[p.rang&&("Rang "+p.rang.replace(/^rang\s*/i,"")),p.culture,p.concept,p.culte].filter(Boolean).join(" · ")}});
/* re-dessine sans perdre le champ où le joueur vient de passer (le « change » part quand on quitte un champ) */
function pRenderKeep(){setTimeout(()=>{const f=document.activeElement&&document.activeElement.dataset&&document.activeElement.dataset.pf;render();
  if(f){const el=app.querySelector(`[data-pf="${f}"]`);if(el){el.focus();try{const n=el.value.length;el.setSelectionRange(n,n)}catch(e){}}}},0)}
app.addEventListener("change",e=>{const t=e.target;
  if(t.dataset.pother){const [at,sk]=t.value.split("|"),p=pCur();if(p&&at){const A=P_ATTR.find(x=>x[0]===at);pOpenRoll(p,"def:autre",{kind:"sk",label:A[1]+" + "+sk,calc:`${A[1]} ${+p.a[at]||0} + ${sk} ${+p.k[sk]||0}`,base:(+p.a[at]||0)+(+p.k[sk]||0)});render()}return}
  if(t.dataset.pagsel!=null&&t.dataset.pagsel!==""){const p=pCur();if(p){(S.pAgSel=S.pAgSel||{})[p.id+":"+t.dataset.pagsel]=t.value;render()}return}
  if(t.dataset.pfile&&t.files&&t.files[0]){pImport(t.files[0]);t.value="";return}
  const k=t.dataset.pf,p=pCur();if(!k||!p)return;
  if(t.type==="checkbox"){pSet(p,k,t.checked);p.maj=Date.now();pSave(true);render()}
  else if(/\.(empl|charg)$/.test(k)){pRenderKeep()}
  else if(t.tagName==="SELECT"){pSet(p,k,t.value);p.maj=Date.now();pSave(true);render()}});

/* ───────── VI. CAMPAGNE ───────── */
/* Cartes : visionneuse zoom + déplacement (doigts, souris, molette), sans filtre ni interaction */
const MAPS=[{id:"monde",t:"Monde",src:"assets/cartes/monde.jpg",w:3517,h:4970,cap:"Carte du monde · Primal Punk"}];
const MAPV={id:"monde",x:0,y:0,k:0,fit:0};
function campagne(){
  const m=MAPS.find(x=>x.id===MAPV.id)||MAPS[0];
  return `<div class="stack">${MAPS.length>1?chips(MAPS.map(x=>[x.id,x.t]),m.id,"mapsel","Cartes"):""}
   <div class="mapv" id="mapv"><img src="${m.src}" alt="${esc(m.cap)}" width="${m.w}" height="${m.h}" draggable="false"${MAPV.k?` style="transform:translate(${MAPV.x}px,${MAPV.y}px) scale(${MAPV.k})"`:' style="visibility:hidden"'}>
    <div class="mapb"><button data-map="in" aria-label="Zoom avant">+</button><button data-map="out" aria-label="Zoom arrière">−</button><button data-map="fit" aria-label="Carte entière">⤢</button></div></div>
   <p class="mapcap">${esc(m.cap)} · pince ou molette pour zoomer, glisse pour te déplacer, double-tap pour agrandir</p></div>`;
}
function mapBox(){const v=$("#mapv"),m=MAPS.find(x=>x.id===MAPV.id)||MAPS[0];return v?{v,img:v.querySelector("img"),W:v.clientWidth,H:v.clientHeight,m}:null}
function mapApply(b){const{W,H,m}=b,w=m.w*MAPV.k,h=m.h*MAPV.k;
  MAPV.x=w<=W?(W-w)/2:Math.min(0,Math.max(W-w,MAPV.x));MAPV.y=h<=H?(H-h)/2:Math.min(0,Math.max(H-h,MAPV.y));
  b.img.style.visibility="";b.img.style.transform=`translate(${MAPV.x}px,${MAPV.y}px) scale(${MAPV.k})`}
function mapFit(){const b=mapBox();if(!b)return;MAPV.fit=Math.min(b.W/b.m.w,b.H/b.m.h);MAPV.k=MAPV.fit;MAPV.x=MAPV.y=0;mapApply(b)}
function mapZoom(f,cx,cy){const b=mapBox();if(!b||!MAPV.k)return;const k0=MAPV.k,k=Math.max(MAPV.fit,Math.min(1.6,k0*f));if(k===k0)return;
  cx=cx==null?b.W/2:cx;cy=cy==null?b.H/2:cy;MAPV.x=cx-(cx-MAPV.x)*k/k0;MAPV.y=cy-(cy-MAPV.y)*k/k0;MAPV.k=k;mapApply(b)}
(function(){const P=new Map();let d0=0,drag=null;
  const rel=(e,v)=>{const r=v.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
  app.addEventListener("load",e=>{if(e.target.matches&&e.target.matches(".mapv img")){MAPV.k?mapApply(mapBox()):mapFit()}},true);
  window.addEventListener("resize",()=>{if(S.view==="campagne"&&MAPV.k){const k=MAPV.k===MAPV.fit;const b=mapBox();if(!b)return;MAPV.fit=Math.min(b.W/b.m.w,b.H/b.m.h);if(k||MAPV.k<MAPV.fit)MAPV.k=MAPV.fit;mapApply(b)}});
  app.addEventListener("click",e=>{const a=e.target.closest("[data-map]");if(!a)return;const t=a.dataset.map;t==="in"?mapZoom(1.5):t==="out"?mapZoom(1/1.5):mapFit()});
  app.addEventListener("pointerdown",e=>{const v=e.target.closest&&e.target.closest(".mapv");if(!v||e.target.closest(".mapb"))return;
    v.setPointerCapture&&v.setPointerCapture(e.pointerId);P.set(e.pointerId,[e.clientX,e.clientY]);
    if(P.size===2){const[a,b]=[...P.values()];d0=Math.hypot(a[0]-b[0],a[1]-b[1]);drag=null}else drag={x:e.clientX,y:e.clientY,ox:MAPV.x,oy:MAPV.y}});
  app.addEventListener("pointermove",e=>{if(!P.has(e.pointerId))return;const v=$("#mapv");if(!v)return;P.set(e.pointerId,[e.clientX,e.clientY]);
    if(P.size===2){const[a,b]=[...P.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]),r=v.getBoundingClientRect();if(d0)mapZoom(d/d0,(a[0]+b[0])/2-r.left,(a[1]+b[1])/2-r.top);d0=d}
    else if(drag){const bx=mapBox();if(!bx)return;MAPV.x=drag.ox+e.clientX-drag.x;MAPV.y=drag.oy+e.clientY-drag.y;mapApply(bx)}});
  let tp=null;
  const up=e=>{const v=e.target.closest&&e.target.closest(".mapv");
    if(e.type==="pointerup"&&P.size===1&&drag&&v&&!e.target.closest(".mapb")&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<8){const t=Date.now();
      if(tp&&t-tp.t<320&&Math.hypot(e.clientX-tp.x,e.clientY-tp.y)<30){const[x,y]=rel(e,v);tp=null;MAPV.k>MAPV.fit*1.05?mapFit():mapZoom(2.5,x,y)}else tp={t,x:e.clientX,y:e.clientY}}
    P.delete(e.pointerId);d0=0;drag=null;if(P.size===1){const[p]=[...P.values()];drag={x:p[0],y:p[1],ox:MAPV.x,oy:MAPV.y}}};
  app.addEventListener("pointerup",up);app.addEventListener("pointercancel",up);
  app.addEventListener("wheel",e=>{const v=e.target.closest&&e.target.closest(".mapv");if(!v)return;e.preventDefault();const[x,y]=rel(e,v);mapZoom(e.deltaY<0?1.2:1/1.2,x,y)},{passive:false});
})();
/* ───────── II. LORE ───────── */
function loreTabs(){return chips(LORE.tabs.map(t=>[t.id,t.t]),S.loreTab,"loretab","Rubriques du lore")}
const stripTags=h=>String(h).replace(/<[^>]+>/g," ");
function loreCard(it,open){
  const ic=it.icon?icon(it.icon):"";
  const thumb=it.sym?`<img class="lsym" src="${it.sym}" alt="">`:it.img?`<img class="lthumb" src="${it.img}" alt="" loading="lazy">`:"";
  return `<details class="card lore"${dk(it)}${open?" open":""}><summary>${thumb}<span class="lt"><span class="t">${ic?`<span class="lic">${ic}</span>`:""}${esc(it.t)}</span>${it.sub?`<span class="lsub">${esc(it.sub)}</span>`:""}</span>${it.ref?`<span class="ref">${esc(it.ref)}</span>`:""}</summary><div class="body">${it.img?`<button class="lhero" data-act="zoom" data-src="${it.img}" aria-label="Agrandir l’illustration"><img src="${it.img}" alt="" loading="lazy"></button>`:""}${it.h}${it.gal?`<div class="lgal">${it.gal.map(([src,c])=>`<button data-act="zoom" data-src="${src}" aria-label="Agrandir : ${esc(c)}"><img src="${src}" alt="" loading="lazy"><span>${esc(c)}</span></button>`).join("")}</div>`:""}</div></details>`;
}
const tlList=l=>`<ol class="timeline">${l.map(r=>{const [y,x]=r;return `<li${dk(r)}><b>${esc(y)}</b><span>${esc(x)}</span></li>`}).join("")}</ol>`;
const glList=l=>`<dl class="gloss">${l.map(r=>{const [k,x]=r;return `<div${dk(r)}><dt>${esc(k)}</dt><dd>${esc(x)}</dd></div>`}).join("")}</dl>`;
const LORE_SRC=(()=>{const N=[["PP","Primal Punk"],["K","Katharsys"],["A","Artefacts"],["ETS","En Ton Sang"],["JdM","Jeu de Massacre"],["BA","Black Atlantic"],["Apo","Apocrypha (ouvrage de fans)"]];
  const refs=LORE.tabs.flatMap(t=>(t.items||[]).map(i=>i.ref||"")).join(" ");
  return N.filter(([k])=>new RegExp("\\b"+k+"\\b").test(refs)).map(([k,n])=>`${k} <i>${n}</i>`).join(" · ")})();
function lore(){
  const q=norm(S.loreQ).trim();
  const search=`<label class="search">${I.search}<input id="q" data-in="loreq" type="search" placeholder="Chercher : Brûlure, Juges, Pandora…" value="${esc(S.loreQ)}" autocomplete="off">${S.loreQ?`<button class="qclr" data-act="qclear" data-v="loreQ" aria-label="Effacer la recherche">×</button>`:""}</label>`;
  const foot=`<p class="note">Sources : ${LORE_SRC}.</p>`;
  if(q){
    let cards=[],tl=[],gl=[];
    LORE.tabs.forEach(tab=>{
      (tab.items||[]).forEach(it=>{if(norm(it.t+" "+(it.sub||"")+" "+stripTags(it.h)).includes(q))cards.push(loreCard(it,false))});
      (tab.timeline||[]).forEach(r=>{if(norm(r.join(" ")).includes(q))tl.push(r)});
      (tab.gloss||[]).forEach(r=>{if(norm(r.join(" ")).includes(q))gl.push(r)});
    });
    const n=cards.length+tl.length+gl.length;
    return `<div class="stack">${search}<div class="count">${n} résultat${n>1?"s":""} dans tout le lore</div>${cards.join("")}${gl.length?`<div class="sec-title dg">GLOSSAIRE</div>`+glList(gl):""}${tl.length?`<div class="sec-title dg">CHRONOLOGIE</div>`+tlList(tl):""}${n?"":`<p class="empty">Rien trouvé.</p>`}</div>`;
  }
  const tab=LORE.tabs.find(t=>t.id===S.loreTab)||LORE.tabs[0];
  let b="";
  if(tab.items)b=tab.items.map((it,i)=>(it.sec?`<div class="sec-title dg">${esc(it.sec.toUpperCase())}</div>`:"")+loreCard(it,tab.id==="monde"&&it.t==="Primal Punk en bref")).join("");
  if(tab.timeline)b=tlList(tab.timeline);
  if(tab.gloss)b=glList(tab.gloss);
  return `<div class="stack">${search}${b}${foot}</div>`;
}

/* ───────── III. RÈGLES ───────── */
const REG_CATS=(()=>{const S3=["Poisons","Maladies","Troubles mentaux"],c=[...new Set(REGLES.map(r=>r.cat))].filter(x=>!S3.includes(x)),i=c.indexOf("Blessures & soins")+1;c.splice(i,0,...S3);return ["Tous",...c,"Potentiels"]})();
const POT_CULTS=Object.keys(POTENTIELS);
function potCard(p,cult,open,showCult){
  const f=(k,l)=>p[k]?`<p><span class="k">${l}</span>${esc(p[k])}</p>`:"";
  return `<details class="card pot"${dk(p)}${open?" open":""}><summary><span class="t"><span class="pn">${esc(p.n)}.</span> ${esc(p.t)}<span class="pc">Condition : ${esc(p.c||"—")}</span></span>${showCult?`<span class="cult">${icon(cult)}${esc(cult)}</span>`:""}</summary><div class="body">${f("e","Effet")}${f("r","Règles")}</div></details>`;
}
function regTabs(){return chips(REG_CATS,S.regCat,"regcat","Catégories de règles")}
function regles(){
  const q=norm(S.regQ).trim();
  const search=`<label class="search">${I.search}<input id="q" data-in="regq" type="search" placeholder="Chercher : initiative, feu, hémorragie…" value="${esc(S.regQ)}" autocomplete="off">${S.regQ?`<button class="qclr" data-act="qclear" data-v="regQ" aria-label="Effacer la recherche">×</button>`:""}</label>`;
  if(S.regCat==="Potentiels"&&!q){
    const L=POTENTIELS[S.potCult]||[];
    return `<div class="stack">${search}${chips(POT_CULTS,S.potCult,"potcult","Cultes")}<div class="count">${L.length} Potentiels · ${esc(S.potCult)}</div>${L.map(p=>potCard(p,S.potCult,false,false)).join("")}</div>`;
  }
  const list=S.regCat==="Potentiels"?[]:REGLES.filter(r=>(S.regCat==="Tous"||r.cat===S.regCat)&&(!q||norm(r.t+" "+r.tags+" "+r.h.replace(/<[^>]+>/g," ")).includes(q)));
  const pots=q&&(S.regCat==="Tous"||S.regCat==="Potentiels")?POT_CULTS.flatMap(c=>POTENTIELS[c].filter(p=>norm(p.t+" "+(p.c||"")+" "+(p.e||"")+" "+(p.r||"")).includes(q)).map(p=>[p,c])):[];
  if(q&&pots.length){const n=list.length+pots.length;
    return `<div class="stack">${search}<div class="count">${n} résultat${n>1?"s":""}</div>${list.map(r=>`<details class="card"${dk(r)}><summary><span class="t">${esc(r.t)}</span><span class="ref">${esc(r.ref)}</span></summary><div class="body"><div class="catline">${esc(r.cat)}</div>${r.h}</div></details>`).join("")}<div class="sec-title dg">POTENTIELS</div>${pots.slice(0,60).map(([p,c])=>potCard(p,c,false,true)).join("")}</div>`;}
  return `<div class="stack">
   ${search}
   <div class="count">${list.length} fiche${list.length>1?"s":""}</div>
   ${list.map(r=>`<details class="card"${dk(r)}${q&&list.length<=3?" open":""}><summary><span class="t">${esc(r.t)}</span><span class="ref">${esc(r.ref)}</span></summary><div class="body">${S.regCat==="Tous"?`<div class="catline">${esc(r.cat)}</div>`:""}${r.h}</div></details>`).join("")||`<p class="empty">Aucune fiche ne correspond. Essayez un autre mot.</p>`}</div>`;
}

/* ───────── IV. BAZAR ───────── */
const BZ_GRP=[["armes","Armes"],["protection","Protection"],["equipement","Équipement"],["medical","Médical"],["vehicules","Véhicules"]];
function bzTabs(){return chips(BZ_GRP,S.bzGrp,"bzgrp","Familles d’objets")}
function bazar(){
  const inGrp=BAZAR.filter(r=>r._grp===S.bzGrp);
  const cats=["Tout",...new Set(inGrp.map(r=>r._cat))];
  const cultes=[...new Set(BAZAR.map(r=>r.Culte).filter(Boolean))].sort();
  const q=norm(S.bzQ).trim();
  const list=(q?BAZAR:inGrp).filter(r=>(q||S.bzCat==="Tout"||r._cat===S.bzCat)&&(!S.bzCulte||r.Culte===S.bzCulte)&&(!q||norm(Object.values(r).join(" ")).includes(q)));
  return `<div class="stack">
   <label class="search">${I.search}<input id="q" data-in="bzq" type="search" placeholder="Chercher dans tout le Bazar…" value="${esc(S.bzQ)}" autocomplete="off">${S.bzQ?`<button class="qclr" data-act="qclear" data-v="bzQ" aria-label="Effacer la recherche">×</button>`:""}</label>
   ${q?"":chips(cats,S.bzCat,"bzcat","Catégories")}
   <div class="selrow"><select class="sel" id="bzculte" data-in="bzculte" aria-label="Filtrer par Culte"><option value="">Tous les Cultes</option>${cultes.map(c=>`<option ${c===S.bzCulte?"selected":""}>${esc(c)}</option>`).join("")}</select></div>
   <div class="count">${list.length} objet${list.length>1?"s":""}${q?" · recherche dans toutes les familles":""}</div>
   ${list.map(item).join("")||`<p class="empty">Rien dans le Bazar avec ces filtres.</p>`}
   <p class="note">Valeurs en Lettres de Change (LC). Ress. = Ressources nécessaires dans le Culte.</p></div>`;
}
function stat(k,v){return v&&v!=="–"?`<span>${k} <b>${esc(v)}</b></span>`:""}
function item(r){
  const g=r._grp;let line="";
  if(r._cat==="Munitions") line=stat("Dégâts",r["Dégâts"])+stat("Tech",r.Tech)+stat("Prix",r.Valeur);
  else if(g==="armes"&&r["Dégâts"]!==undefined) line=stat("Dég.",r["Dégâts"])+stat("Man.",r["Man."])+stat("Portée",r["Portée"])+stat("Cal.",r["Cal."]);
  else if(r["Valeur d’armure"]) line=stat("Armure",r["Valeur d’armure"])+stat("Enc.",r["Enc."]);
  else if(r["Défense"]) line=stat("Déf.",r["Défense"])+stat("Att.",r["Attaque"]);
  else if(r["Vit. Max."]) line=stat("Vit.",r["Vit. Max."])+stat("Armure",r.Armure)+stat(r.Blessures?"Bless.":"Carross.",r.Blessures||r.Carrosserie);
  else line=r.Effet?`<span>${esc(r.Effet)}</span>`:r["Propriétés"]&&g==="artefacts"?`<span>${esc(r["Propriétés"])}</span>`:"";
  const skip=new Set(["Nom","_cat","_grp","_skill","Culte","_desc"]);
  const kv=Object.entries(r).filter(([k,v])=>!skip.has(k)&&v&&v!=="–").map(([k,v])=>`<dt>${esc(k.replace("Man.","Maniabilité").replace("Charg.","Chargeur").replace("Enc.","Encombrement").replace("Empl.","Emplacements").replace("Ress.","Ressources").replace("Cal.","Calibre"))}</dt><dd>${esc(k==="Valeur"?v+" LC":v)}</dd>`).join("");
  return `<details class="card item"${dk(r)}><summary><span class="t">${esc(r.Nom)}</span>${r.Culte?`<span class="cult">${icon(r.Culte)}${esc(r.Culte)}</span>`:""}<span class="stats">${line}</span></summary><div class="body"><div class="catline">${esc(r._cat)}${r._skill?" · "+esc(r._skill):""}</div><dl class="kv">${kv}</dl>${r._desc?`<div class="desc">${r._desc.map(x=>`<p>${esc(x)}</p>`).join("")}</div>`:""}</div></details>`;
}

/* ───────── V. DÉS ───────── */
function rollPool(n){
  const dice=[],k=Math.max(0,Math.min(12,n)),auto=Math.max(0,n-12);
  for(let i=0;i<k;i++)dice.push(1+rnd(6));
  const succ=dice.filter(d=>d>=4).length+auto, trig=dice.filter(d=>d===6).length, ones=dice.filter(d=>d===1).length;
  return {n,dice,auto,succ,trig,ones};
}
const QUAL=["","Bien","Remarquable","Excellent","Brillant","Exceptionnel","Légendaire"];
const qual=t=>t<=0?"":QUAL[Math.min(6,t)];
function dieSvg(v,cls){return `<span class="die ${cls}" role="img" aria-label="${v}"><img src="assets/dice/d${v}.png" alt=""></span>`}
function diceView(r,mark){return `<div class="dice">${r.dice.map(v=>dieSvg(v,v===6?"t":v>=4?"s":v===1?"o":"f")).join("")}</div>${r.auto?`<div class="note">+${r.auto} succès automatique${r.auto>1?"s":""} (au-delà de 12 dés)</div>`:""}`}
function stepper(id,val,min,max,sm){return `<div class="stepper${sm?" sm":""}"><button data-act="step" data-k="${id}" data-d="-1" aria-label="Moins">−</button><output aria-live="polite">${val}</output><button data-act="step" data-k="${id}" data-d="1" aria-label="Plus">+</button></div>`}
function des(){
  const d=S.dice,conf=S.diceMode==="conf";
  const pool=d.va;
  let res="";
  if(S.last){
    const L=S.last;
    if(L.mode==="simple"){
      const r=L.a,dif=L.diff;let verdict,cls;
      if(r.n<=0){verdict="Échec automatique";cls="ko"}
      else if(dif>0){const ok=r.succ>=dif;verdict=ok?("Réussite"+(r.trig?" · "+qual(r.trig):"")):(r.ones>r.succ?"Échec critique":"Échec");cls=ok?"ok":"ko"}
      else {verdict=r.succ?("Succès"+(r.trig?" · "+qual(r.trig):"")):(r.ones>0?"Aucun succès · "+r.ones+"×1":"Aucun succès");cls=r.succ?"ok":"ko"}
      res=`<div class="dice-panel result" aria-live="polite"><div class="verdict"><span class="big ${cls}">${DG(verdict)}</span>${dif>0?`<span class="note">difficulté ${dif}</span>`:""}</div>
        ${dif>0&&r.succ<dif&&r.ones>r.succ?`<div class="crit">Plus de 1 (${r.ones}) que de succès (${r.succ}) : échec critique.</div>`:""}
        <div class="tally"><span><b>${r.succ}</b>succès</span><span><b>${r.trig}</b>déclencheurs</span><span><b>${r.ones}</b>× 1</span></div>${diceView(r)}
        ${dif>0&&r.succ>=dif&&r.trig?`<div class="note">Actions en combat (Initiative) : ${1+Math.floor(r.trig/2)} · Dégâts +${r.trig} DC</div>`:""}</div>`;
    } else {
      const A=L.a,B=L.b;let w;
      if(A.succ!==B.succ)w=A.succ>B.succ?"A":"B";else if(A.trig!==B.trig)w=A.trig>B.trig?"A":"B";else w="=";
      res=`<div class="dice-panel result" aria-live="polite"><div class="verdict"><span class="big ${w==="="?"ko":"ok"}">${w==="="?"EGALITE":"VICTOIRE "+w}</span>${w==="="?`<span class="note">S’il faut un vainqueur, celui qui a pris l’initiative perd.</span>`:""}</div>
        <div class="lbl">A · ${A.succ} succès · ${A.trig} DC${w==="B"&&A.ones>A.succ?` · <span class="critx">échec critique</span>`:""}</div>${diceView(A)}<div class="lbl">B · ${B.succ} succès · ${B.trig} DC${w==="A"&&B.ones>B.succ?` · <span class="critx">échec critique</span>`:""}</div>${diceView(B)}</div>`;
    }
  }
  return `<div class="stack">
   ${chips([["simple","Jet simple"],["conf","Confrontation"]],S.diceMode,"dmode","Mode")}
   <div class="dice-panel">
     <div class="lbl">${conf?"Camp A · ":""}Valeur d’action (attribut + compétence + ego + modificateurs)</div>${stepper("va",d.va,0,30)}
     ${conf?`<div class="lbl">Camp B · Valeur d’action (attribut + compétence + ego + modificateurs)</div>${stepper("vb",S.diceB.va,0,30)}`:`<div><div class="lbl">Difficulté</div><div class="diffs" role="toolbar" aria-label="Difficulté">${[1,2,3,4,5,6,7,8,9,10].map(v=>[v,String(v)]).map(([v,l])=>`<button class="chip" data-act="diff" data-v="${v}" aria-pressed="${d.diff===v}">${l}</button>`).join("")}</div></div>`}
     <button class="roll" data-act="roll">LANCER ${conf?"":pool+"D"}</button>
   </div>
   ${res}
   ${S.hist.length?`<div><div class="sec-title dg">HISTORIQUE</div><div class="hist">${S.hist.map(h=>`<div><span>${esc(h.t)}</span><span>${esc(h.r)}</span></div>`).join("")}</div></div>`:""}
  </div>`;
}
function pushHist(t,r){S.hist.unshift({t,r});S.hist=S.hist.slice(0,10);store.set("hist",S.hist)}

/* ───────── événements ───────── */
app.addEventListener("click",e=>{
  const g=e.target.closest("[data-go]");if(g){go(g.dataset.go);return}
  const a=e.target.closest("[data-act]");if(!a)return;
  const act=a.dataset.act,v=a.dataset.v;
  switch(act){
    case "ptab":S.pTab=v;S.pEdit=false;S.pBz=null;S.pConf=null;S.pRoll=null;render();window.scrollTo(0,0);break;
    case "layout":S.layout=S.layout==="ruche"?"grille":"ruche";store.set("layout",S.layout);render();break;
    case "regcat":S.regCat=v;render();break;
    case "potcult":S.potCult=v;render();window.scrollTo(0,0);break;
    case "bzgrp":S.bzGrp=v;S.bzCat="Tout";render();break;
    case "bzcat":S.bzCat=v;render();break;
    case "dmode":S.diceMode=v;S.last=null;render();break;
    case "diff":S.dice.diff=+v;store.set("dice",S.dice);render();break;
    case "step":{const k=a.dataset.k,d=+a.dataset.d;
      if(k==="vb")S.diceB.va=Math.max(0,Math.min(30,S.diceB.va+d));
      else{const lim={va:[0,30],ego:[0,3],mod:[-12,12]}[k];S.dice[k]=Math.max(lim[0],Math.min(lim[1],S.dice[k]+d));store.set("dice",S.dice)}
      render();break;}
    case "roll":{const d=S.dice;
      if(S.diceMode==="simple"){const r=rollPool(d.va);S.last={mode:"simple",a:r,diff:d.diff};pushHist(`${r.n}D${d.diff?" (diff. "+d.diff+")":""}`,`${r.succ} S · ${r.trig} DC${d.diff?(r.succ>=d.diff?" · réussite":r.ones>r.succ?" · échec critique":" · échec"):""}`)}
      else{const A=rollPool(d.va),B=rollPool(S.diceB.va);S.last={mode:"conf",a:A,b:B};pushHist(`Confrontation ${A.n}D / ${B.n}D`,`${A.succ}-${B.succ} S · ${A.trig}-${B.trig} DC`)}
      render();break;}
    case "hit":{const h=HITS[+v];if(h)jump(h);break}
    case "gall":S.gAll=v;render();break;
    case "qclear":S[v]="";if(v==="homeQ")S.gAll=null;S._focusQ=true;render();if(v!=="homeQ"){const q=$("#q");if(q)q.focus()}break;
    case "mapsel":MAPV.id=v;MAPV.k=0;render();break;
    case "loretab":S.loreTab=v;S.loreQ="";render();break;
    case "zoom":{const z=document.createElement("div");z.className="zoom"+(a.dataset.wide?" wide":"");z.innerHTML=`<img src="${a.dataset.src}" alt=""><button class="x" aria-label="Fermer">×</button>`;z.addEventListener("click",ev=>{if(ev.target.closest(".x")||ev.target===z)z.remove()});document.body.appendChild(z);break;}
  }
});
app.addEventListener("input",e=>{
  const k=e.target.dataset.in;if(!k)return;const v=e.target.value;
  if(k==="homeq"){S.homeQ=v;S.gAll=null;S._focusQ=true;render()}
  if(k==="regq"){S.regQ=v;S._focusQ=true;render()}
  if(k==="bzq"){S.bzQ=v;S._focusQ=true;render()}
  if(k==="loreq"){S.loreQ=v;S._focusQ=true;render()}
});
app.addEventListener("change",e=>{
  const k=e.target.dataset.in;if(!k)return;const v=e.target.value;
  if(k==="bzculte"){S.bzCulte=v;render()}
});

/* démarrage */
const h=(location.hash||"").slice(1);
S.view=SECTIONS.some(s=>s.id===h)?h:"home";
render();
})();
