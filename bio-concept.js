(()=>{
'use strict';
const $=s=>document.querySelector(s), mobile=matchMedia('(max-width:640px)').matches, reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const p=$('#pathogenVisual');
if(!p)return;

p.classList.add('concept-bio');
p.innerHTML=`<svg class="bio-cell" viewBox="0 0 120 120" aria-hidden="true">
<defs>
  <radialGradient id="bioMembrane" cx="38%" cy="34%" r="72%"><stop offset="0" stop-color="#8eff91" stop-opacity=".42"/><stop offset=".38" stop-color="#2e7445" stop-opacity=".72"/><stop offset=".74" stop-color="#123520" stop-opacity=".92"/><stop offset="1" stop-color="#09180f"/></radialGradient>
  <radialGradient id="bioCore" cx="48%" cy="46%" r="56%"><stop offset="0" stop-color="#f4ff9a"/><stop offset=".18" stop-color="#cbff62"/><stop offset=".52" stop-color="#6bf175"/><stop offset="1" stop-color="#1b5a2e" stop-opacity=".08"/></radialGradient>
</defs>
<g class="bio-tendrils">
  <path class="bio-tendril" d="M42 34 C29 22 27 13 24 8"/><circle class="bio-tip" cx="24" cy="8" r="3"/>
  <path class="bio-tendril" d="M67 28 C72 15 76 11 79 7"/><circle class="bio-tip t2" cx="79" cy="7" r="2.5"/>
  <path class="bio-tendril" d="M84 39 C96 30 105 28 112 27"/><circle class="bio-tip t3" cx="112" cy="27" r="3"/>
  <path class="bio-tendril" d="M89 67 C101 69 108 75 114 80"/><circle class="bio-tip t4" cx="114" cy="80" r="2.7"/>
  <path class="bio-tendril" d="M70 88 C77 100 79 108 80 114"/><circle class="bio-tip t5" cx="80" cy="114" r="3"/>
  <path class="bio-tendril" d="M39 84 C27 93 20 100 15 107"/><circle class="bio-tip t6" cx="15" cy="107" r="2.6"/>
  <g class="bio-stage-extra"><path class="bio-tendril" d="M30 56 C17 55 11 50 6 45"/><circle class="bio-tip t2" cx="6" cy="45" r="2.5"/><path class="bio-tendril" d="M56 31 C53 17 49 10 45 5"/><circle class="bio-tip t4" cx="45" cy="5" r="2.3"/><path class="bio-tendril" d="M86 52 C101 47 107 42 115 39"/><circle class="bio-tip t6" cx="115" cy="39" r="2.4"/></g>
</g>
<g class="bio-body">
  <path class="bio-membrane" d="M61 24 C73 23 85 29 91 39 C98 50 97 63 91 75 C85 87 73 96 59 96 C44 96 31 89 25 77 C18 64 20 50 27 39 C35 29 47 24 61 24 Z"/>
  <path class="bio-inner" d="M43 31 C33 40 29 51 31 63 C34 78 45 88 60 89 C76 89 87 78 90 63 C92 51 87 39 77 32"/>
  <g class="bio-veins"><path d="M34 62 C44 57 48 51 55 43"/><path d="M58 88 C58 73 61 63 70 52"/><path d="M85 69 C75 67 69 64 61 58"/><path d="M42 38 C50 44 54 49 58 56"/></g>
  <circle class="bio-nucleus" cx="60" cy="59" r="18"/><circle class="bio-hot" cx="60" cy="59" r="6.5"/>
</g>
<g class="bio-spores"><circle class="bio-spore" cx="19" cy="31" r="2.2"/><circle class="bio-spore" cx="102" cy="61" r="1.8"/><circle class="bio-spore" cx="35" cy="104" r="2.1"/></g>
</svg>`;

function ensureDoubleRings(){
  document.querySelectorAll('#nodes .node').forEach(n=>{
    if(!n.querySelector('.infection-ring'))return;
    if(!n.querySelector('.infection-ring.r2')){
      const c=document.createElementNS('http://www.w3.org/2000/svg','circle');c.setAttribute('class','infection-ring r2');c.setAttribute('r','8.5');n.insertBefore(c,n.firstChild);
    }
  });
}
ensureDoubleRings();
const nodes=$('#nodes');if(nodes)new MutationObserver(ensureDoubleRings).observe(nodes,{childList:true});

const fx=document.querySelector('.game-fx-layer')||(()=>{const d=document.createElement('div');d.className='game-fx-layer';document.body.appendChild(d);return d})();
function flyDNA(x,y){
  if(reduced)return;
  const target=$('.metric.dna');if(!target)return;const r=target.getBoundingClientRect(),tx=r.left+r.width*.64,ty=r.top+r.height*.5;
  const f=document.createElement('i');f.className='bio-dna-fly';f.style.setProperty('--sx',x+'px');f.style.setProperty('--sy',y+'px');f.style.setProperty('--tx',tx+'px');f.style.setProperty('--ty',ty+'px');f.style.setProperty('--mx',((tx-x)*.43+30)+'px');f.style.setProperty('--my',((ty-y)*.43-34)+'px');fx.appendChild(f);
  if(!mobile){for(let i=0;i<3;i++){const t=document.createElement('i');t.className='bio-dna-tail';t.style.setProperty('--sx',(x+(Math.random()-.5)*10)+'px');t.style.setProperty('--sy',(y+(Math.random()-.5)*10)+'px');t.style.setProperty('--tx',(tx+(Math.random()-.5)*12)+'px');t.style.setProperty('--ty',(ty+(Math.random()-.5)*12)+'px');fx.appendChild(t);setTimeout(()=>t.remove(),650)}}
  p.classList.remove('bio-fed');void p.offsetWidth;p.classList.add('bio-fed');setTimeout(()=>p.classList.remove('bio-fed'),600);setTimeout(()=>f.remove(),760);
}
document.addEventListener('pointerdown',e=>{if(e.target.closest?.('.dna-pop'))flyDNA(e.clientX,e.clientY)},{capture:true,passive:true});

document.addEventListener('click',e=>{
  const btn=e.target.closest?.('.upgrade');if(!btn||btn.disabled||btn.classList.contains('owned'))return;
  const r=btn.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+Math.min(r.height/2,62);
  const h=document.createElement('i');h.className='bio-mutation-halo';h.style.setProperty('--x',x+'px');h.style.setProperty('--y',y+'px');fx.appendChild(h);setTimeout(()=>h.remove(),850);
  p.classList.remove('concept-mutate');void p.offsetWidth;p.classList.add('concept-mutate');setTimeout(()=>p.classList.remove('concept-mutate'),760);
},{capture:true});
})();