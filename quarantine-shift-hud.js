/* Decorative progress HUD. Reads existing counters; never changes game state. */
(()=>{'use strict';
function init(){
 const booth=document.querySelector('.qc-booth'),bulletin=document.querySelector('.qc-bulletin'),counter=document.getElementById('processedNow'),clock=document.getElementById('clock');
 if(!booth||!bulletin||!counter||!clock||document.getElementById('qcShiftProgress'))return;
 const bar=document.createElement('div');bar.id='qcShiftProgress';bar.className='qc-shift-progress';bar.setAttribute('role','group');bar.setAttribute('aria-label','Прогресс смены');
 bar.innerHTML='<span>ПРОГРЕСС СМЕНЫ</span><div class="qc-shift-track"><div class="qc-shift-fill"></div></div><span class="qc-shift-count">0 / 0</span>';
 bulletin.insertAdjacentElement('afterend',bar);
 const fill=bar.querySelector('.qc-shift-fill'),label=bar.querySelector('.qc-shift-count');
 function update(){
  const match=(counter.textContent||'').match(/(\d+)\s*\/\s*(\d+)/),done=match?Number(match[1]):0,total=match?Number(match[2]):0;
  const pct=total?Math.min(100,Math.max(0,done/total*100)):0;
  fill.style.width=pct+'%';label.textContent=done+' / '+total;
  const time=(clock.textContent||'').match(/(\d+):(\d+)/),seconds=time?Number(time[1])*60+Number(time[2]):Infinity;
  bar.classList.toggle('urgent',seconds<=25&&pct<100);
  bar.classList.toggle('complete',total>0&&done>=total);
  bar.setAttribute('aria-label','Прогресс смены: '+done+' из '+total);
 }
 new MutationObserver(update).observe(counter,{childList:true,characterData:true,subtree:true});
 new MutationObserver(update).observe(clock,{childList:true,characterData:true,subtree:true});
 update();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
