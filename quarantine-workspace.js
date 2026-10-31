/* Compact workspace navigation. Gameplay remains owned by quarantine.js. */
(()=>{'use strict';
function init(){
 const side=document.querySelector('.qc-side'),top=document.querySelector('.qc-top-actions');
 const open=document.createElement('button');open.type='button';open.className='qc-summary-toggle';open.textContent='Сводка';open.setAttribute('aria-expanded','false');open.setAttribute('aria-controls','postSummary');side.id='postSummary';top.append(open);
 const media=matchMedia('(max-width:1199px)');
 const movable=[...document.querySelectorAll('.qc-mission-bar,.qc-ethics-strip,#soundToggle')].map(el=>{const mark=document.createComment('workspace anchor');el.before(mark);return {el,mark}});
 function arrange(){movable.forEach(({el,mark})=>media.matches?side.append(el):mark.after(el));if(!media.matches)side.classList.remove('mobile-open')}
 media.addEventListener('change',arrange);arrange();
 const close=document.createElement('button');close.type='button';close.className='qc-summary-close';close.textContent='← Вернуться к документам';side.prepend(close);
 function hide(){side.classList.remove('mobile-open');open.setAttribute('aria-expanded','false');open.focus()}
 open.onclick=()=>{side.classList.add('mobile-open');open.setAttribute('aria-expanded','true');close.focus()};close.onclick=hide;
 document.addEventListener('keydown',e=>{if(e.code==='Escape'&&side.classList.contains('mobile-open')){e.preventDefault();hide()}});
 const tabs=[...document.querySelectorAll('.qc-doc-tabs button')];
 function sync(){tabs.forEach(b=>{b.setAttribute('aria-pressed',String(b.classList.contains('active')))});document.querySelector('.qc-doc-stack').scrollTop=0}
 tabs.forEach(b=>b.addEventListener('click',sync));window.addEventListener('qc:person',sync);sync();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
