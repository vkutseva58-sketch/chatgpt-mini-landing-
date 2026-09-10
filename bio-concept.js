(()=>{
'use strict';
const $=s=>document.querySelector(s),mobile=matchMedia('(max-width:640px)').matches;
const p=$('#pathogenVisual');if(!p)return;
p.classList.add('concept-bio');
p.innerHTML=`<svg class="bio-cell" viewBox="0 0 220 220" aria-hidden="true">
<defs>
 <radialGradient id="bioMembrane" cx="36%" cy="30%" r="78%"><stop offset="0" stop-color="#ecffd3" stop-opacity=".42"/><stop offset=".16" stop-color="#8cf59c" stop-opacity=".36"/><stop offset=".43" stop-color="#296b3e" stop-opacity=".72"/><stop offset=".76" stop-color="#0b2a18" stop-opacity=".95"/><stop offset="1" stop-color="#020704"/></radialGradient>
 <linearGradient id="bioEdge" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f2ffe1"/><stop offset=".35" stop-color="#92ff94"/><stop offset=".72" stop-color="#46b66a"/><stop offset="1" stop-color="#d7ffa5"/></linearGradient>
 <radialGradient id="bioSurface" cx="70%" cy="30%" r="70%"><stop stop-color="#ffffff" stop-opacity=".62"/><stop offset=".2" stop-color="#bcff9f" stop-opacity=".18"/><stop offset=".7" stop-color="#4eff7e" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
 <radialGradient id="bioCore" cx="48%" cy="44%" r="56%"><stop offset="0" stop-color="#ffffd4"/><stop offset=".12" stop-color="#efff82"/><stop offset=".32" stop-color="#c9ff55"/><stop offset=".58" stop-color="#64f66e"/><stop offset="1" stop-color="#123f22" stop-opacity=".04"/></radialGradient>
 <radialGradient id="bioHalo"><stop stop-color="#dfff78" stop-opacity=".55"/><stop offset=".35" stop-color="#7fff77" stop-opacity=".22"/><stop offset="1" stop-color="#45ff7a" stop-opacity="0"/></radialGradient>
 <linearGradient id="bioVein" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eaff91"/><stop offset=".4" stop-color="#7dff70"/><stop offset="1" stop-color="#55ffd1"/></linearGradient>
 <linearGradient id="bioTendril" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#efffce"/><stop offset=".42" stop-color="#a5e998"/><stop offset="1" stop-color="#4da563"/></linearGradient>
 <radialGradient id="bioDrop" cx="35%" cy="30%" r="70%"><stop stop-color="#fff"/><stop offset=".13" stop-color="#f1ffac"/><stop offset=".36" stop-color="#baff5d"/><stop offset=".72" stop-color="#397332"/><stop offset="1" stop-color="#0e2816"/></radialGradient>
 <radialGradient id="bioBubble" cx="32%" cy="28%" r="70%"><stop stop-color="#fff" stop-opacity=".8"/><stop offset=".18" stop-color="#dfff99" stop-opacity=".45"/><stop offset=".58" stop-color="#64ff9b" stop-opacity=".1"/><stop offset="1" stop-color="#0a1a10" stop-opacity=".15"/></radialGradient>
 <filter id="bioGlow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <filter id="bioHotGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <filter id="bioSoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation=".5"/></filter>
 <filter id="bioTexture" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".028 .045" numOctaves="3" seed="8" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="B"/></filter>
 <filter id="bioGlass" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".014 .023" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="4"/><feGaussianBlur stdDeviation=".18"/></filter>
</defs>
<g class="bio-hud"><circle cx="110" cy="110" r="92"/><circle cx="110" cy="110" r="82"/></g><g class="bio-hud r2"><circle cx="110" cy="110" r="98"/><circle cx="110" cy="110" r="72"/></g>
<g class="bio-aura"><circle cx="110" cy="110" r="73"/><circle cx="110" cy="110" r="86"/></g>
<g class="bio-spores"><circle class="bio-spore" cx="48" cy="36" r="2.7"/><circle class="bio-spore" cx="183" cy="67" r="2.2"/><circle class="bio-spore" cx="178" cy="168" r="2.5"/><circle class="bio-spore" cx="55" cy="183" r="1.8"/><circle class="bio-spore" cx="26" cy="109" r="2.1"/></g>
<circle class="bio-bubble" cx="32" cy="68" r="9"/><circle class="bio-bubble b2" cx="188" cy="126" r="7"/><circle class="bio-bubble b3" cx="153" cy="29" r="5.5"/>
<g class="bio-tendrils">
 <path class="bio-tendril" d="M83 58 C69 39 63 24 61 8"/><circle class="bio-tip" cx="61" cy="8" r="5.3"/>
 <path class="bio-tendril" d="M112 48 C115 29 121 18 127 5"/><circle class="bio-tip t2" cx="127" cy="5" r="4.2"/>
 <path class="bio-tendril" d="M143 58 C159 41 172 32 187 27"/><circle class="bio-tip t3" cx="187" cy="27" r="4.7"/>
 <path class="bio-tendril" d="M157 82 C180 75 193 74 211 76"/><circle class="bio-tip t4" cx="211" cy="76" r="5.6"/>
 <path class="bio-tendril" d="M161 121 C181 128 194 137 208 150"/><circle class="bio-tip t5" cx="208" cy="150" r="4.9"/>
 <path class="bio-tendril" d="M142 153 C155 174 161 188 163 211"/><circle class="bio-tip t6" cx="163" cy="211" r="5.4"/>
 <path class="bio-tendril" d="M102 162 C94 181 88 193 80 213"/><circle class="bio-tip t7" cx="80" cy="213" r="4.7"/>
 <path class="bio-tendril" d="M69 147 C49 161 38 174 25 190"/><circle class="bio-tip t8" cx="25" cy="190" r="5.1"/>
 <path class="bio-tendril" d="M57 115 C36 118 21 119 7 116"/><circle class="bio-tip t3" cx="7" cy="116" r="4.5"/>
 <path class="bio-tendril" d="M63 84 C47 72 34 61 20 49"/><circle class="bio-tip t5" cx="20" cy="49" r="5"/>
 <g class="bio-stage-extra"><path class="bio-tendril" d="M92 52 C83 34 80 19 81 3"/><circle class="bio-tip t6" cx="81" cy="3" r="3.9"/><path class="bio-tendril" d="M151 68 C173 55 190 51 214 51"/><circle class="bio-tip t7" cx="214" cy="51" r="4.2"/><path class="bio-tendril" d="M151 142 C173 158 185 174 195 195"/><circle class="bio-tip t2" cx="195" cy="195" r="4.4"/><path class="bio-tendril fine" d="M72 136 C49 145 35 151 14 154"/><circle class="bio-tip t4" cx="14" cy="154" r="3.8"/></g>
 <g class="bio-stage-max"><path class="bio-tendril" d="M126 49 C139 27 146 16 153 2"/><circle class="bio-tip t5" cx="153" cy="2" r="4.6"/><path class="bio-tendril" d="M159 101 C183 99 200 104 218 113"/><circle class="bio-tip t8" cx="218" cy="113" r="4.3"/><path class="bio-tendril" d="M121 162 C127 187 129 199 129 219"/><circle class="bio-tip t3" cx="129" cy="219" r="4.2"/></g>
</g>
<g class="bio-organism">
 <path class="bio-shell-shadow" d="M110 49 C132 46 151 57 162 74 C174 92 176 114 166 135 C155 157 136 171 111 171 C85 171 64 159 53 138 C42 118 43 94 54 75 C65 57 86 48 110 49Z"/>
 <path class="bio-membrane" d="M108 45 C126 43 145 49 158 61 C171 73 178 91 174 108 C177 126 168 146 153 158 C138 171 119 177 100 172 C80 175 61 163 51 146 C39 130 39 109 44 92 C44 73 59 57 77 51 C87 47 98 44 108 45Z"/>
 <path class="bio-membrane-2" d="M82 55 C62 68 52 86 51 105 C49 129 61 149 80 160 C97 170 121 170 139 160 C159 150 170 129 168 108 C168 86 156 68 137 57 C122 48 99 47 82 55Z"/>
 <path class="bio-surface" d="M66 71 C87 54 124 50 151 71 C143 68 132 69 122 77 C109 87 105 101 107 117 C94 104 84 93 68 91 C61 86 61 78 66 71Z"/>
 <g class="bio-veins"><path d="M59 112 C76 106 89 96 101 82 C111 70 120 61 137 58"/><path d="M81 157 C86 141 94 125 108 113 C123 100 136 90 158 86"/><path d="M158 133 C142 128 129 120 116 109 C102 96 91 81 79 63"/><path d="M69 83 C84 89 95 98 104 111 C113 124 119 140 121 166"/><path d="M52 130 C72 127 90 130 105 139 C118 147 131 154 149 157"/><path d="M96 51 C98 68 104 82 114 94 C125 107 139 114 169 115"/></g>
 <circle class="bio-core-halo" cx="118" cy="111" r="45"/><circle class="bio-nucleus" cx="118" cy="111" r="27"/><circle class="bio-hot" cx="118" cy="111" r="9"/>
</g>
</svg>`;

function ensureDoubleRings(){document.querySelectorAll('#nodes .node').forEach(n=>{if(!n.querySelector('.infection-ring'))return;if(!n.querySelector('.infection-ring.r2')){const c=document.createElementNS('http://www.w3.org/2000/svg','circle');c.setAttribute('class','infection-ring r2');c.setAttribute('r','8.5');n.insertBefore(c,n.firstChild)}})}
ensureDoubleRings();const nodes=$('#nodes');if(nodes)new MutationObserver(ensureDoubleRings).observe(nodes,{childList:true});
const fx=document.querySelector('.game-fx-layer')||(()=>{const d=document.createElement('div');d.className='game-fx-layer';document.body.appendChild(d);return d})();
function flyDNA(x,y){const target=$('.metric.dna');if(!target)return;const r=target.getBoundingClientRect(),tx=r.left+r.width*.64,ty=r.top+r.height*.5;const f=document.createElement('i');f.className='bio-dna-fly';f.style.setProperty('--sx',x+'px');f.style.setProperty('--sy',y+'px');f.style.setProperty('--tx',tx+'px');f.style.setProperty('--ty',ty+'px');f.style.setProperty('--mx',((tx-x)*.42+42)+'px');f.style.setProperty('--my',((ty-y)*.42-48)+'px');fx.appendChild(f);for(let i=0;i<5;i++){const t=document.createElement('i');t.className='bio-dna-tail';t.style.setProperty('--sx',(x+(Math.random()-.5)*14)+'px');t.style.setProperty('--sy',(y+(Math.random()-.5)*14)+'px');t.style.setProperty('--tx',(tx+(Math.random()-.5)*15)+'px');t.style.setProperty('--ty',(ty+(Math.random()-.5)*15)+'px');fx.appendChild(t);setTimeout(()=>t.remove(),760)}p.classList.remove('bio-fed');void p.offsetWidth;p.classList.add('bio-fed');setTimeout(()=>p.classList.remove('bio-fed'),680);setTimeout(()=>f.remove(),820)}
document.addEventListener('pointerdown',e=>{if(e.target.closest?.('.dna-pop'))flyDNA(e.clientX,e.clientY)},{capture:true,passive:true});
document.addEventListener('click',e=>{const btn=e.target.closest?.('.upgrade');if(!btn||btn.disabled||btn.classList.contains('owned'))return;const r=btn.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+Math.min(r.height/2,62);for(let i=0;i<2;i++){const h=document.createElement('i');h.className='bio-mutation-halo';h.style.setProperty('--x',x+'px');h.style.setProperty('--y',y+'px');h.style.animationDelay=(i*.09)+'s';fx.appendChild(h);setTimeout(()=>h.remove(),1050)}p.classList.remove('concept-mutate');void p.offsetWidth;p.classList.add('concept-mutate');setTimeout(()=>p.classList.remove('concept-mutate'),1020)},{capture:true});
if(!mobile){p.addEventListener('pointermove',e=>{const r=p.getBoundingClientRect(),dx=(e.clientX-r.left-r.width/2)/r.width,dy=(e.clientY-r.top-r.height/2)/r.height;p.style.setProperty('--look-x',(dx*7).toFixed(1)+'px');p.style.setProperty('--look-y',(dy*7).toFixed(1)+'px')},{passive:true});p.addEventListener('pointerleave',()=>{p.style.setProperty('--look-x','0px');p.style.setProperty('--look-y','0px')},{passive:true})}
})();