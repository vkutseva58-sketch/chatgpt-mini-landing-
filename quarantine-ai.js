(()=>{'use strict';
const $=s=>document.querySelector(s);
const qbtn=$('#questionBtn'),nameEl=$('#personName'),dialogue=$('#dialogue'),tools=$('.qc-tools');
if(!qbtn||!nameEl||!dialogue||!tools)return;
let activeName='',usedFor='',busy=false;

function text(sel){return ($(sel)?.textContent||'').trim()}
function context(){return{
  day:text('#dayLabel'),directive:text('#bulletinTitle'),name:text('#personName'),nation:text('#passportNation'),purpose:text('#purpose'),route:text('#route'),passportName:text('#passportName'),passportNo:text('#passportNo'),passportExpiry:text('#passportExpiry'),healthName:text('#healthName'),test:text('#testResult'),testAge:text('#testAge'),temperature:text('#temperature'),permitName:text('#permitName'),permitType:text('#permitType'),stay:text('#stay'),openingStatement:text('#dialogue')
}}
function fallback(c,q){const l=q.toLowerCase();if(c.healthName&&c.passportName&&c.healthName!==c.passportName)return'Я уже сказал всё, что знаю. Наверное, в медпункте ошиблись при оформлении имени.';if(c.permitName==='НЕТ ДОКУМЕНТА'||c.permitType==='ОТСУТСТВУЕТ')return'Мне сказали, что разрешение можно будет подтвердить уже здесь. Других бумаг у меня нет.';if(c.test&&c.test!=='ОТРИЦАТЕЛЬНЫЙ')return'В лаборатории сказали, что результат ещё перепроверяют. Я думал, этого хватит для прохода.';if((parseInt(c.testAge)||0)>72)return'Анализ сдавал заранее из-за дороги. Я не думал, что несколько часов будут иметь значение.';if((parseFloat((c.temperature||'').replace(',','.'))||0)>37.4)return'Я долго стоял в очереди и очень нервничаю. Обычно такой температуры у меня нет.';if(l.includes('маршрут')||l.includes('откуда'))return`Я еду по маршруту ${c.route||'из указанного в документах пункта'}. Всё записано в разрешении.`;if(l.includes('цель')||l.includes('зачем'))return`Цель поездки — ${c.purpose||'та, что указана в документах'}. Больше мне добавить нечего.`;return'Все сведения уже есть в документах. Если есть конкретное несоответствие — скажите, что именно вас смущает.'}

const ai=document.createElement('button');ai.type='button';ai.id='aiQuestionBtn';ai.className='question qc-ai-btn';ai.innerHTML='Живой допрос <span>−3 сек</span>';qbtn.insertAdjacentElement('afterend',ai);
const live=document.createElement('span');live.className='qc-ai-live';live.textContent='OPENAI';

const panel=document.createElement('div');panel.className='qc-ai-panel';panel.id='qcAiPanel';panel.innerHTML=`<div class="qc-ai-card" role="dialog" aria-modal="true" aria-labelledby="qcAiTitle"><div class="qc-ai-head"><div><small>СЛУЖЕБНЫЙ КАНАЛ // DYNAMIC INTERROGATION</small><b id="qcAiTitle">Свободный вопрос пассажиру</b></div><button class="qc-ai-close" type="button" aria-label="Закрыть">×</button></div><div class="qc-ai-body"><div class="qc-ai-subject"><span id="qcAiSubject">—</span><i>ОДИН ВОПРОС НА ДЕЛО</i></div><textarea class="qc-ai-input" id="qcAiInput" maxlength="240" placeholder="Например: Почему имя в медпропуске отличается от паспорта?"></textarea><div class="qc-ai-foot"><span class="qc-ai-hint">Пассажир отвечает по своему досье. Ответ не гарантирует, что он говорит правду.</span><button class="qc-ai-send" id="qcAiSend" type="button">ЗАДАТЬ ВОПРОС</button></div><div class="qc-ai-state" id="qcAiState"></div></div></div>`;document.body.appendChild(panel);
const input=$('#qcAiInput'),send=$('#qcAiSend'),state=$('#qcAiState'),subject=$('#qcAiSubject');

function refresh(){const n=text('#personName');activeName=n;const valid=n&&n!=='—';ai.disabled=!valid||qbtn.disabled||usedFor===n||busy;if(valid&&!live.isConnected){const h=$('#personName');h?.appendChild(live)}if(!valid&&live.isConnected)live.remove()}
function open(){refresh();if(ai.disabled)return;subject.textContent=`${text('#personName')} // ${text('#passportNation')} // ${text('#purpose')}`;input.value='';state.className='qc-ai-state';state.textContent='';panel.classList.add('show');setTimeout(()=>input.focus(),40)}
function close(){if(!busy)panel.classList.remove('show')}
function setState(msg,error=false){state.textContent=msg;state.className='qc-ai-state show'+(error?' error':'')}
async function ask(){const question=input.value.trim();const c=context();if(busy||question.length<2||!c.name||c.name==='—')return;if(qbtn.disabled){setState('Этот пассажир уже был допрошен.',true);refresh();return}
 busy=true;send.disabled=true;ai.disabled=true;usedFor=c.name;setState('Пассажир думает над ответом…');
 qbtn.click();dialogue.textContent='— …';
 try{
  const r=await fetch('/api/interrogate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,context:c})});
  const data=await r.json().catch(()=>({}));
  let answer='';
  if(r.ok&&data.answer)answer=String(data.answer).trim();
  else if(data.error==='AI_NOT_CONFIGURED'){answer=fallback(c,question);setState('AI-канал ещё не привязан к серверному ключу. Сейчас используется локальный резервный ответ.',true)}
  else if(r.status===429){answer=fallback(c,question);setState('Канал временно перегружен. Использован резервный ответ.',true)}
  else{answer=fallback(c,question);setState('Сервер AI не ответил. Использован резервный ответ.',true)}
  if(text('#personName')===c.name){dialogue.textContent='— '+answer;$('#interviewBox')?.classList.add('alert');if(navigator.vibrate)navigator.vibrate(12)}
  if(r.ok)setState('Ответ получен через AI-канал.');
  setTimeout(()=>{if(panel.classList.contains('show'))panel.classList.remove('show')},r.ok?650:1150);
 }catch(e){if(text('#personName')===c.name)dialogue.textContent='— '+fallback(c,question);setState('Нет связи с AI-каналом. Использован резервный ответ.',true);setTimeout(()=>panel.classList.remove('show'),1150)}
 finally{busy=false;send.disabled=false;refresh()}
}

ai.addEventListener('click',open);send.addEventListener('click',ask);panel.querySelector('.qc-ai-close').addEventListener('click',close);panel.addEventListener('click',e=>{if(e.target===panel)close()});input.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter')ask();if(e.key==='Escape')close()});
new MutationObserver(()=>{const n=text('#personName');if(n!==activeName){activeName=n;panel.classList.remove('show')}refresh()}).observe(nameEl,{childList:true,characterData:true,subtree:true});
new MutationObserver(refresh).observe(qbtn,{attributes:true,attributeFilter:['disabled']});
refresh();
})();