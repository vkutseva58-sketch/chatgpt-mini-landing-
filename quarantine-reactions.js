/* Presentation-only effects driven by public game events. */
(()=>{'use strict';
function init(){
 const windowEl=document.querySelector('.qc-window'),person=document.getElementById('personCard');
 if(!windowEl||!person||windowEl.querySelector('.qc-atmo-alert'))return;
 const alert=document.createElement('div'),pass=document.createElement('div');
 alert.className='qc-atmo-alert';alert.setAttribute('aria-hidden','true');
 alert.innerHTML='<span class="qc-atmo-label">ПРОТОКОЛ // ВНИМАНИЕ</span>';
 pass.className='qc-atmo-pass';pass.setAttribute('aria-hidden','true');
 windowEl.append(alert,pass);
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 const timers=new Map();
 function pulse(el){el.classList.remove('show');void el.offsetWidth;el.classList.add('show');clearTimeout(timers.get(el));timers.set(el,setTimeout(()=>el.classList.remove('show'),950))}
 function character(cls){person.classList.remove('qc-atmo-arrive','qc-atmo-leave');if(reduce.matches)return;void person.offsetWidth;person.classList.add(cls);clearTimeout(timers.get(person));timers.set(person,setTimeout(()=>person.classList.remove(cls),600))}
 window.addEventListener('qc:person',()=>character('qc-atmo-arrive'));
 window.addEventListener('qc:decision',event=>{
  const detail=event.detail||{};
  pulse(detail.ok===false?alert:pass);
  character('qc-atmo-leave');
 });
 window.addEventListener('pagehide',()=>{timers.forEach(clearTimeout);timers.clear()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
