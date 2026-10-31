/* Decorative scene and bounded motion. No gameplay state, timers or randomness are changed. */
(()=>{'use strict';
const $=s=>document.querySelector(s),reduced=matchMedia('(prefers-reduced-motion: reduce)');
const scene=`<svg viewBox="0 0 1600 360" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
<linearGradient id="qcSky" x2="0" y2="1"><stop stop-color="#102c3b"/><stop offset=".65" stop-color="#4a706d"/><stop offset="1" stop-color="#98a187"/></linearGradient>
<linearGradient id="qcRoad" x2="0" y2="1"><stop stop-color="#152d35"/><stop offset="1" stop-color="#203b42"/></linearGradient>
<linearGradient id="qcFog"><stop stop-color="#7da9a0" stop-opacity="0"/><stop offset=".55" stop-color="#9cb7a0" stop-opacity=".24"/><stop offset="1" stop-color="#aac1aa" stop-opacity="0"/></linearGradient>
<linearGradient id="qcBeam" x2="0" y2="1"><stop stop-color="#f6d9a4" stop-opacity=".3"/><stop offset="1" stop-color="#ead29f" stop-opacity="0"/></linearGradient>
<pattern id="qcFence" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M0 11L11 0 22 11 11 22Z" fill="none" stroke="#88a99c" stroke-opacity=".22" stroke-width=".7"/></pattern>
<pattern id="qcWindows" width="26" height="22" patternUnits="userSpaceOnUse"><path d="M7 5h5v7H7z" fill="#a8bc91" opacity=".3"/><path d="M19 5h3v7h-3z" fill="#deb87c" opacity=".4"/></pattern>
</defs><path fill="url(#qcSky)" d="M0 0h1600v360H0z"/>
<circle cx="1120" cy="57" r="28" fill="#c3c9a2" opacity=".25"/><path d="M0 118L120 118 120 66 202 66 202 145 248 145 248 45 302 45 302 126 370 126 370 94 438 94 438 156 536 156 536 81 578 81 578 130 650 130 650 68 738 68 738 140 850 140 850 78 903 78 903 125 975 125 975 95 1051 95 1051 140 1180 140 1180 50 1226 50 1226 120 1320 120 1320 76 1376 76 1376 123 1450 123 1450 55 1530 55 1530 110 1600 110V290H0Z" fill="#1c3a46" opacity=".6"/>
<path d="M0 180h130v-56h142v90h109v-58h147v81h130v-100h94v94h113v-83h135v63h168v-78h94v70h138v-81h130v58h170v160H0Z" fill="#183540"/>
<path d="M130 130h136v91H130zM390 163h130v80H390zM661 143h80v88h-80zM871 155h118v76H871zM1174 140h80v88h-80zM1397 132h120v94h-120z" fill="url(#qcWindows)" opacity=".6"/>
<path d="M0 238h1600v122H0z" fill="url(#qcRoad)"/><path d="M824 241L670 360M960 241l210 119" stroke="#bdc2a0" stroke-opacity=".12" stroke-width="4"/>
<path d="M0 222h1600v60H0z" fill="url(#qcFog)"/>
<path d="M0 154h570v140H0zM1090 145h510v150h-510z" fill="url(#qcFence)"/>
<g stroke="#182f35" stroke-width="9"><path d="M30 141v168M175 145v161M320 145v158M465 145v154M1110 137v168M1255 137v174M1400 137v178M1545 137v180"/></g>
<path d="M559 259V55h493v204" fill="none" stroke="#0b232e" stroke-width="23"/><path d="M559 55h493" stroke="#657d72" stroke-opacity=".7" stroke-width="2"/>
<path d="M561 75h489v29H561z" fill="#112b35"/><text x="805" y="95" text-anchor="middle" fill="#d0d0a3" font-size="15" letter-spacing="7" font-family="monospace">QUARANTINE SECTOR 07</text>
<path d="M577 108l-90 190h200L608 108zM994 108l-90 190h200l-79-190z" fill="url(#qcBeam)"/><path d="M577 106h31M994 106h31" stroke="#e6d6a8" stroke-width="4"/>
<path d="M1130 207h211v57h-211z" fill="#0d2933"/><path d="M1139 216h47v24h-47zM1197 216h47v24h-47zM1255 216h72v24h-72z" fill="#8d9e82" opacity=".45"/>
<g class="qc-beacon"><circle cx="1320" cy="201" r="4" fill="#e6b47a"/><circle cx="1320" cy="201" r="12" fill="#e6b47a" opacity=".12"/></g>
<path d="M601 271h405v7H601z" fill="#c3b48a"/><path d="M615 271h22l-7 7h-22zm48 0h22l-7 7h-22zm48 0h22l-7 7h-22zm48 0h22l-7 7h-22zm48 0h22l-7 7h-22zm48 0h22l-7 7h-22zm48 0h22l-7 7h-22zm48 0h22l-7 7h-22z" fill="#2c3f3c"/>
<path d="M595 264h12v48h-12zM1001 264h12v48h-12z" fill="#122d37"/><g opacity=".3" fill="#d6bd88"><path d="M576 310h55l29 3h-96zM1001 309h42l38 3h-90zM1135 285h191l33 2h-201zM1257 294h80l38 2h-141z"/></g>
<g fill="#0d2731"><path d="M150 360v-28q0-16 10-16t10 16v28z"/><circle cx="160" cy="308" r="6"/><path d="M187 360v-24q0-13 9-13t9 13v24z"/><circle cx="196" cy="316" r="5"/></g>
<path d="M0 345h1600v15H0z" fill="#09202a" opacity=".35"/>
</svg>`;
function environment(){const el=document.createElement('div');el.className='qc-perimeter';el.setAttribute('aria-hidden','true');el.innerHTML=scene;const rain=document.createElement('div');rain.className='qc-rain';el.append(rain);return el}
const active=new Map();
function motion(el,key,frames,options={}){if(!el||reduced.matches||document.hidden)return;active.get(key)?.cancel();const a=el.animate(frames,{duration:350,easing:'cubic-bezier(.22,.7,.28,1)',...options});active.set(key,a);a.onfinish=()=>{if(active.get(key)===a)active.delete(key)};}
function burst(el,cls,duration){if(!el||reduced.matches)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);clearTimeout(el['_'+cls]);el['_'+cls]=setTimeout(()=>el.classList.remove(cls),duration)}
function init(){
 document.body.classList.add('qc-cinema');
 const windowEl=$('.qc-window');windowEl.prepend(environment());
 const scan=document.createElement('div');scan.className='qc-scan-line';scan.setAttribute('aria-hidden','true');windowEl.append(scan);
 const seal=document.createElement('div');seal.className='qc-verdict-seal';seal.setAttribute('aria-hidden','true');$('.qc-desk').append(seal);
 ['approveBtn','denyBtn'].forEach(id=>$('#'+id).addEventListener('click',()=>{if(!$('#'+id).disabled)return;const approved=id==='approveBtn';seal.classList.toggle('denied',!approved);seal.innerHTML=(approved?'ДОПУЩЕНО':'ОТКАЗАНО')+'<small>TERMINAL 07 // CONTROL</small>';motion(seal,'seal',[{opacity:0,transform:'translate(-50%,-50%) rotate(-13deg) scale(1.65)'},{opacity:.95,transform:'translate(-50%,-50%) rotate(-8deg) scale(.96)',offset:.2},{opacity:.9,transform:'translate(-50%,-50%) rotate(-9deg) scale(1)',offset:.68},{opacity:0,transform:'translate(-50%,-50%) rotate(-9deg) scale(1)'}],{duration:760,delay:100});motion($('.qc-doc-stack'),'paper',[{transform:'translateY(0)'},{transform:'translateY(4px)',offset:.25},{transform:'translateY(-1px)',offset:.6},{transform:'translateY(0)'}],{duration:330,delay:105})}));
 const label=document.createElement('span');label.className='qc-scan-label';label.textContent='BIO SCAN // 07';label.setAttribute('aria-hidden','true');windowEl.append(label);
 const art=document.createElement('div');art.className='qc-intro-art';art.setAttribute('aria-hidden','true');art.append(environment());$('#startOverlay .qc-modal').prepend(art);
 window.addEventListener('qc:person',()=>{
  motion($('#personCard'),'person',[{opacity:0,transform:'translateX(26px)'},{opacity:1,transform:'translateX(-2px)',offset:.8},{opacity:1,transform:'translateX(0)'}],{duration:580});
  motion($('.qc-doc-stack'),'paper',[{opacity:.2,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:440,delay:90});
 });
 window.addEventListener('qc:decision',e=>{
  motion($('#personCard'),'person',[{opacity:1,transform:'translateX(0)'},{opacity:0,transform:`translateX(${e.detail.approve?38:-30}px)`}],{duration:270});
  motion(windowEl,'verdict',[{boxShadow:`inset 0 0 50px ${e.detail.approve?'#8fddb345':'#e0a27d40'}`},{boxShadow:'inset 0 0 0 transparent'}],{duration:600});
 });
 document.querySelectorAll('.qc-doc-tabs button').forEach(b=>b.addEventListener('click',()=>motion($('.qc-doc-stack'),'paper',[{opacity:.45,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:260})));
 $('#inspectBtn').addEventListener('click',()=>{if($('#inspectBtn').disabled&&$('#dialogue').textContent.startsWith('СКАНЕР:'))burst(windowEl,'is-scanning',1250)});
 $('#questionBtn').addEventListener('click',()=>{if($('#questionBtn').disabled)burst(windowEl,'is-speaking',1400)});
 const dialogue=$('#dialogue');new MutationObserver(()=>motion(dialogue,'dialogue',[{opacity:.25},{opacity:1}],{duration:300})).observe(dialogue,{childList:true,characterData:true,subtree:true});
 ['startOverlay','shiftOverlay','rulesOverlay','caseOverlay','qcNightOverlay','dossierOverlay'].forEach(id=>{
  const overlay=$('#'+id);if(!overlay)return;
  new MutationObserver(()=>{const visible=overlay.classList.contains('show')||overlay.classList.contains('qc-overlay')&&!overlay.classList.contains('hidden');if(!visible)return;motion(overlay.firstElementChild,'modal-'+id,[{opacity:.4,transform:'translateY(16px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:420})}).observe(overlay,{attributes:true,attributeFilter:['class']});
 });
 function cancel(){active.forEach(a=>a.cancel());active.clear();windowEl.classList.remove('is-scanning','is-speaking')}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel()});reduced.addEventListener('change',()=>{if(reduced.matches)cancel()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
