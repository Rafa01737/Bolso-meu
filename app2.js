function setTipo(t){tipo=t;$("tOut").className=t=="out"?"on":"";$("tIn").className=t=="in"?"on":"";
$("c").innerHTML=CATS[t].map(c=>'<option value="'+c+'">'+(EMO[c]||"")+" "+c+"</option>").join("")}
function mover(n){const [y,m]=mes.split("-").map(Number);const d=new Date(y,m-1+n,1);
mes=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0");render()}
$("prev").onclick=()=>mover(-1);$("next").onclick=()=>mover(1);
$("tOut").onclick=()=>setTipo("out");$("tIn").onclick=()=>setTipo("in");
$("abrir").onclick=()=>{setTipo("out");$("f").reset();
const n=new Date(),p2=x=>String(x).padStart(2,"0");
$("dt").value=n.getFullYear()+"-"+p2(n.getMonth()+1)+"-"+p2(n.getDate());
$("dtTxt").textContent="Hoje, "+n.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"});
$("dt").style.display="none";$("dtInfo").style.display="flex";
$("sheet").classList.add("open");$("v").focus()};
const fechar=()=>$("sheet").classList.remove("open");
$("fechar").onclick=fechar;
$("dtMud").onclick=()=>{$("dtInfo").style.display="none";$("dt").style.display="block";$("dt").focus()};
$("sheet").onclick=e=>{if(e.target.id=="sheet")fechar()};
$("f").onsubmit=e=>{e.preventDefault();
const v=parseFloat($("v").value.replace(/\./g,"").replace(",","."));
if(!(v>0)){$("v").setCustomValidity("Digite um valor maior que zero");$("v").reportValidity();return}
$("v").setCustomValidity("");
tx.push({id:Date.now(),t:tipo,v:v,d:$("d").value.trim(),c:$("c").value,date:$("dt").value});
salvar();mes=$("dt").value.slice(0,7);fechar();render()};
$("v").oninput=()=>$("v").setCustomValidity("");
const TEMAS=[["Roxo",265,60,"#C6F432","#6B3FD4"],["Azul",215,70,"#FFD23F","#2F6FDE"],["Ciano",185,75,"#FF8A5B","#14A3B8"],["Verde",145,55,"#FFE14D","#2E9E5B"],["Amarelo",45,90,"#7B5CFF","#F2B705","#fff"],["Laranja",24,90,"#3DD6C6","#F26B1D"],["Vermelho",355,70,"#FFD23F","#D6303F"],["Rosa",330,75,"#C6F432","#E8509B"],["Marrom",25,45,"#FFC857","#8B5A3C"],["Preto",0,0,"#C6F432","#2A2A2A"]];
function tema(i){const t=TEMAS[i],r=document.documentElement.style;
r.setProperty("--h",t[1]);r.setProperty("--s",t[2]);r.setProperty("--pop",t[3]);r.setProperty("--btnt",t[5]||"#1B1033");
document.querySelectorAll("#cores button").forEach((b,j)=>{b.className=j==i?"on":"";b.setAttribute("aria-checked",j==i)});
try{localStorage.setItem("meubolso:cor",i)}catch(e){}}
TEMAS.forEach((t,i)=>{const b=document.createElement("button");b.type="button";b.style.background=t[4];b.title=t[0];
b.setAttribute("role","radio");b.setAttribute("aria-label","Cor "+t[0]);b.onclick=()=>tema(i);$("cores").appendChild(b)});
let cor=0;try{cor=+localStorage.getItem("meubolso:cor")||0}catch(e){}
tema(TEMAS[cor]?cor:0);
setTipo("out");render();
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(function(){});
