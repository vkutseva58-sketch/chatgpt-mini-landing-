(()=>{'use strict';
const box=document.querySelector('#events');if(!box)return;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const tails=[' Ну всё, пиздец приехал.',' Мир опять делает вид, что всё под контролем. Ага, блядь.',' Отлично, сука. Просто охуенно.',' Ситуация официально летит к хуям.',' Планета держится на соплях и панике.'];
function spice(text){const t=(text||'').trim();if(!t)return{text:t,tone:'normal'};
if(/первые случаи|начал|нулев/i.test(t))return{text:`НУЛЕВОЙ ДЕНЬ, БЛЯДЬ: ${t} Поехали нахуй.`,tone:'hot'};
if(/новая цепочка|распростран|первые случаи|новая вспышка/i.test(t))return{text:`БЛЯДЬ, ПРОРВАЛО: ${t}.${pick(tails)}`,tone:'critical'};
if(/закры|огранич|аэропорт|порт|границ/i.test(t))return{text:`МИР ПСИХАНУЛ: ${t}. Закрываются к хуям и надеются на лучшее.`,tone:'warning'};
if(/лекарств|исследован|вакцин|лечение/i.test(t))return{text:`УЧЁНЫЕ НЕ СПЯТ, СУКИ: ${t}. Вот теперь реально становится стрёмно.`,tone:'cure'};
if(/обнаруж|угроз|служб|официально/i.test(t))return{text:`НАС СПАЛИЛИ, БЛЯДЬ: ${t}. Тихая жизнь закончилась.`,tone:'warning'};
if(/спонтан|мутац/i.test(t))return{text:`ПАТОГЕН САМ ОХУЕЛ И МУТИРОВАЛ: ${t}. Никто этого не заказывал.`,tone:'mutation'};
if(/эволюц|развит|адаптац|передач/i.test(t))return{text:`ПРОКАЧКА, СУКА: ${t}. Теперь эта дрянь стала ещё неприятнее.`,tone:'mutation'};
if(/днк|◈/i.test(t))return{text:`ДНК ПОДНЯТА: ${t}. Копим очки на следующий пиздец.`,tone:'dna'};
if(/погиб|смерт|коллапс|кризис/i.test(t))return{text:`ПИЗДЕЦ НАБИРАЕТ ОБОРОТЫ: ${t}. Хороших новостей не завезли.`,tone:'critical'};
if(/саммит|коалиц|рынк|новост|медик|клиник|турист/i.test(t))return{text:`МИРОВОЙ ЭФИР: ${t}.${pick(tails)}`,tone:'normal'};
return{text:`${t}.${pick([' Ну и нахуй нам спокойная жизнь.',' Стабильность, блядь.',' Всё идёт по плану. По какому — хуй знает.'])}`,tone:'normal'};
}
function process(row){if(!row||row.nodeType!==1||!row.classList.contains('event')||row.dataset.spiced)return;const span=row.querySelector('span');if(!span)return;row.dataset.spiced='1';const out=spice(span.textContent);span.textContent=out.text;row.classList.add('feed-'+out.tone);const stamp=document.createElement('i');stamp.className='feed-signal';stamp.textContent=out.tone==='critical'?'BREAKING':out.tone==='cure'?'CURE ALERT':out.tone==='mutation'?'MUTATION':out.tone==='warning'?'ALERT':out.tone==='dna'?'DNA':'LIVE';row.insertBefore(stamp,span);row.classList.add('feed-enter');setTimeout(()=>row.classList.remove('feed-enter'),700)}
[...box.children].forEach(process);
new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(process))).observe(box,{childList:true});
})();