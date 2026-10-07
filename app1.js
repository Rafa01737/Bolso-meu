const CATS={out:["Moradia","Mercado","Transporte","Lazer","Saúde","Contas","Outros"],in:["Salário","Extra","Outros"]};
const KEY="meubolso:v1";
const EMO={Moradia:"🏠",Mercado:"🛒",Transporte:"🚌",Lazer:"🎮",Saúde:"💊",Contas:"🧾",Outros:"✨",Salário:"💼",Extra:"🎁"};
let tx=[],tipo="out",hoje=new Date(),mes=hoje.getFullYear()+"-"+String(hoje.getMonth()+1).padStart(2,"0");
try{tx=JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){tx=[]}
const $=id=>document.getElementById(id);
const brl=n=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
function salvar(){try{localStorage.setItem(KEY,JSON.stringify(tx))}catch(e){}}
function render(){
const [y,m]=mes.split("-").map(Number);
$("mes").textContent=new Date(y,m-1,1).toLocaleDateString("pt-BR",{month:"long",year:"numeric"});
const L=tx.filter(t=>t.date.startsWith(mes)).sort((a,b)=>b.date.localeCompare(a.date));
const ent=L.filter(t=>t.t=="in").reduce((s,t)=>s+t.v,0),sai=L.filter(t=>t.t=="out").reduce((s,t)=>s+t.v,0);
$("saldo").textContent=brl(ent-sai);$("saldo").className="big "+(ent-sai<0?"out":"");
$("ent").textContent=brl(ent);$("sai").textContent=brl(sai);
$("mood").textContent=!L.length?"👋":ent-sai<0?"😬":(ent>0&&ent-sai>ent*.3?"🤑":"😎");
const by={};L.filter(t=>t.t=="out").forEach(t=>by[t.c]=(by[t.c]||0)+t.v);
const cats=$("cats");cats.innerHTML="";
const ks=Object.keys(by).sort((a,b)=>by[b]-by[a]);
if(!ks.length){cats.innerHTML='<p class="empty">Nenhuma saída neste mês.</p>'}
ks.forEach(k=>{const d=document.createElement("div");d.className="cat";
d.innerHTML='<div class="l"><span></span><span>'+brl(by[k])+'</span></div><div class="bar"><i style="width:'+Math.round(by[k]/sai*100)+'%"></i></div>';
d.querySelector("span").textContent=(EMO[k]||"✨")+" "+k;cats.appendChild(d)});
const lista=$("lista");lista.innerHTML="";
if(!L.length){lista.innerHTML='<p class="empty">Toque em “Novo lançamento” para começar.</p>'}
L.forEach(t=>{const d=document.createElement("div");d.className="tx";
d.innerHTML='<i class="ic">'+(EMO[t.c]||"✨")+'</i><div class="m"><b></b><span></span></div><strong class="'+t.t+'">'+(t.t=="out"?"− ":"+ ")+brl(t.v)+'</strong><button aria-label="Apagar">×</button>';
d.querySelector("b").textContent=t.d;
d.querySelector("span").textContent=t.c+" · "+t.date.split("-").reverse().slice(0,2).join("/");
d.querySelector("button").onclick=()=>{tx=tx.filter(x=>x.id!==t.id);salvar();render()};
lista.appendChild(d)});
grafico();
}
function grafico(){
const [y,m]=mes.split("-").map(Number);
const soma=(k,t,ate)=>tx.filter(x=>x.date.startsWith(k)&&x.t==t&&(!ate||+x.date.slice(8,10)<=ate)).reduce((s,x)=>s+x.v,0);
const ms=[];
for(let i=5;i>=0;i--){const d=new Date(y,m-1-i,1),k=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0");
const e=soma(k,"in"),s=soma(k,"out");
ms.push({k,l:d.toLocaleDateString("pt-BR",{month:"short"}).replace(".",""),v:e-s,tem:e+s>0})}
const max=Math.max(1,...ms.map(x=>Math.abs(x.v))),H=52,base=72;
const fmt=v=>(v<0?"−":"")+(Math.abs(v)>=1000?(Math.abs(v)/1000).toFixed(1).replace(".",",")+"k":Math.round(Math.abs(v)));
let s='<line x1="0" x2="300" y1="'+base+'" y2="'+base+'" stroke="var(--line)"/>';
ms.forEach((x,i)=>{const cx=25+i*50,sel=x.k===mes;
s+='<text x="'+cx+'" y="144" text-anchor="middle"'+(sel?' style="font-weight:700;fill:var(--ink)"':'')+'>'+x.l+'</text>';
if(!x.tem){s+='<text x="'+cx+'" y="'+(base-4)+'" text-anchor="middle">–</text>';return}
const h=Math.max(3,Math.abs(x.v)/max*H),pos=x.v>=0;
s+='<rect x="'+(cx-14)+'" y="'+(pos?base-h:base)+'" width="28" height="'+h+'" rx="4" style="fill:var('+(pos?"--in":"--out")+');opacity:'+(sel?1:.5)+'"/>';
s+='<text x="'+cx+'" y="'+(pos?base-h-4:base+h+12)+'" text-anchor="middle">'+fmt(x.v)+'</text>'});
$("chart").innerHTML=s;
const p=$("pace"),hoje2=new Date(),rk=hoje2.getFullYear()+"-"+String(hoje2.getMonth()+1).padStart(2,"0");
p.className="";
if(mes<rk){const v=ms[5].v;p.className=v>=0?"good":"bad";p.textContent=ms[5].tem?(v>=0?"Mês fechado no azul: sobraram ":"Mês fechado no vermelho: faltaram ")+brl(Math.abs(v))+".":"Sem lançamentos neste mês.";return}
if(mes>rk){p.textContent="Este mês ainda não começou.";return}
const dia=hoje2.getDate(),gasto=soma(mes,"out",dia);
const ant=ms.slice(0,5).filter(x=>soma(x.k,"out")>0);
if(!ant.length){p.textContent="Ainda não há meses anteriores para comparar o seu ritmo. Até o dia "+dia+" você gastou "+brl(gasto)+".";return}
const med=ant.reduce((s,x)=>s+soma(x.k,"out",dia),0)/ant.length;
const base2="Até o dia "+dia+" você gastou "+brl(gasto)+". Nos meses anteriores, nesta altura, a média era "+brl(med)+". ";
if(med<=0){p.textContent=base2;return}
const r=gasto/med,pc=Math.round(Math.abs(1-r)*100);
if(r<.9){p.className="good";p.textContent=base2+"Você começou bem: "+pc+"% abaixo do normal."}
else if(r>1.1){p.className="bad";p.textContent=base2+"Você começou acima do normal: "+pc+"% a mais. Vale segurar os gastos."}
else p.textContent=base2+"Você está no ritmo de sempre."
}
