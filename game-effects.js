(()=>{
'use strict';
const $=s=>document.querySelector(s), mobile=matchMedia('(max-width:640px)').matches, reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fx=document.createElement('div');fx.className='game-fx-layer';document.body.appendChild(fx);

function ensureInfectionRings(){
  document.querySelectorAll('#nodes .node').forEach(n=>{
    if(n.querySelector('.infection-ring'))return;
    const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('class','infection-ring');c.setAttribute('r','8.5');
    n.insertBefore(c,n.firstChild);
  });
}
ensureInfectionRings();
const nodes=document.querySelector('#nodes');
if(nodes)new MutationObserver(ensureInfectionRings).observe(nodes,{childList:true});

function burst(x,y,type='dna',label=''){
  if(reduced)return;
  const wrap=document.createElement('div');wrap.className='fx-burst '+type;wrap.style.left=x+'px';wrap.style.top=y+'px';
  const count=mobile?6:10;
  let html='<i class="fx-core"></i><i class="fx-ring"></i>';
  for(let i=0;i<count;i++){
    const a=(Math.PI*2/count)*i+(Math.random()-.5)*.3,d=(mobile?24:34)+Math.random()*(mobile?16:24);
    html+=`<i class="fx-particle" style="--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;--delay:${i*12}ms"></i>`;
  }
  if(label)html+=`<b class="fx-label">${label}</b>`;
  wrap.innerHTML=html;fx.appendChild(wrap);setTimeout(()=>wrap.remove(),950);
}

function dnaPickup(e){
  const orb=e.target.closest?.('.dna-pop');if(!orb)return;
  burst(e.clientX,e.clientY,'dna','+ ДНК');
  const metric=$('.metric.dna');if(metric){metric.classList.remove('dna-flash');void metric.offsetWidth;metric.classList.add('dna-flash');setTimeout(()=>metric.classList.remove('dna-flash'),520)}
}
document.addEventListener('pointerdown',dnaPickup,{passive:true,capture:true});

function mutationFx(btn){
  const r=btn.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+Math.min(r.height/2,70);
  burst(x,y,'mutation','МУТАЦИЯ');
  document.body.classList.remove('mutation-flash');void document.body.offsetWidth;document.body.classList.add('mutation-flash');
  const p=$('#pathogenVisual');if(p){p.classList.remove('mutating');void p.offsetWidth;p.classList.add('mutating');const stage=Math.min(4,(+p.dataset.stage||0)+1);p.dataset.stage=stage;setTimeout(()=>p.classList.remove('mutating'),760)}
  setTimeout(()=>document.body.classList.remove('mutation-flash'),650);
}
document.addEventListener('click',e=>{
  const btn=e.target.closest?.('.upgrade');
  if(!btn||btn.disabled||btn.classList.contains('owned'))return;
  mutationFx(btn);
},{capture:true});

function breathePathogen(){
  const p=$('#pathogenVisual');if(!p||reduced)return;
  let raf=0;
  const move=e=>{
    if(mobile||raf)return;
    raf=requestAnimationFrame(()=>{
      raf=0;const r=p.getBoundingClientRect(),dx=(e.clientX-(r.left+r.width/2))/r.width,dy=(e.clientY-(r.top+r.height/2))/r.height;
      p.style.setProperty('--look-x',(dx*3).toFixed(2)+'px');p.style.setProperty('--look-y',(dy*3).toFixed(2)+'px');
    });
  };
  p.addEventListener('pointermove',move,{passive:true});
  p.addEventListener('pointerleave',()=>{p.style.setProperty('--look-x','0px');p.style.setProperty('--look-y','0px')},{passive:true});
}
breathePathogen();

const bioCss=document.createElement('link');bioCss.rel='stylesheet';bioCss.href='/bio-concept.css?v=1';document.head.appendChild(bioCss);
const bioScript=document.createElement('script');bioScript.src='/bio-concept.js?v=1';bioScript.defer=true;document.body.appendChild(bioScript);
})();