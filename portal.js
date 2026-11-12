'use strict';
(() => {
const $ = s => document.querySelector(s);
const games = [
{title:'Мост через туман',tag:'Инженерия',category:'engineering',url:'/mist-bridge.html',description:'Построй мост, укрепи конструкцию и проведи поезд через ущелье.',image:'/assets/mist-valley.webp'},
{title:'Пепельное сердце',tag:'Приключение',category:'adventure',url:'/ember.html',description:'Отправляйся навстречу неизвестному в мире пепла и огня.',symbol:'✦',glow:'#77301d',ink:'#ffc58c'},
{title:'Пепельный разлом',tag:'Приключение',category:'adventure',url:'/rift.html',description:'Шагни за границу знакомого мира. Твой путь начинается здесь.',symbol:'⟡',glow:'#3e285b',ink:'#cfb1ff'},
{title:'OUTBREAK // ZERO',tag:'Стратегия',category:'strategy',url:'/game.html',description:'Погрузись в мир эпидемии, где каждое решение меняет ход событий.',symbol:'◉',glow:'#284e35',ink:'#b9f78f'},
{title:'QUARANTINE // CONTROL',tag:'Стратегия',category:'strategy',url:'/quarantine.html',description:'Возьми карантин под контроль. Наблюдай, проверяй, принимай решения.',symbol:'⌖',glow:'#605123',ink:'#f2d485'}
];
function renderGames(filter='all') {
$('#world-grid').replaceChildren();
games.forEach((g,i)=>{if(filter!=='all'&&g.category!==filter)return;const a=document.createElement('a');a.className='feature-card world-'+i;a.href=g.url;a.innerHTML=(g.image?`<img src="${g.image}" alt="Горная долина" loading="lazy">`:`<div class="abstract-art" aria-hidden="true" style="--glow:${g.glow};--ink:${g.ink}"><span>${g.symbol}</span></div>`)+`<div class="card-top"><span class="pill">${g.tag.toUpperCase()}</span><span class="circle-arrow"><svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></span></div><div class="card-copy"><small>МИР / 0${i+1}</small><h3>${g.title}</h3><p>${g.description}</p></div>`;$('#world-grid').append(a);});
}
renderGames();
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b));});renderGames(b.dataset.filter);}));
function navigate(){let page=location.hash.slice(1)||'home';if(page==='discover')page='home';if(!['home','worlds','nova'].includes(page))page='home';document.querySelectorAll('.page').forEach(p=>{p.hidden=p.id!==page;p.classList.toggle('active',p.id===page);});document.querySelectorAll('[data-page]').forEach(a=>{a.classList.toggle('active',a.dataset.page===page);if(a.dataset.page===page)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});if(location.hash!=='#discover')window.scrollTo(0,0);else requestAnimationFrame(()=>$('#discover').scrollIntoView());if(page==='home')resize();}
window.addEventListener('hashchange',navigate);
let history=[];let pending=null;
try{const data=JSON.parse(localStorage.getItem('portal-nova-v1')||'[]');if(Array.isArray(data))history=data.filter(x=>x&&['user','assistant'].includes(x.role)&&typeof x.text==='string').slice(-40).map(x=>({role:x.role,text:x.text.slice(0,3000),links:Array.isArray(x.links)?x.links.filter(n=>Number.isInteger(n)&&n>=0&&n<games.length):[]}));}catch{}
function save(){try{localStorage.setItem('portal-nova-v1',JSON.stringify(history.slice(-40)));}catch{}}
function bubble(m){const el=document.createElement('div');el.className='message '+m.role;const label=document.createElement('small');label.textContent=m.role==='user'?'ТЫ':'NOVA / ПРОВОДНИК';const p=document.createElement('p');p.textContent=m.text;el.append(label,p);(m.links||[]).forEach(i=>{const a=document.createElement('a');a.href=games[i].url;a.textContent='Открыть '+games[i].title+' →';p.append(document.createElement('br'),a);});$('#messages').append(el);$('#messages').scrollTop=$('#messages').scrollHeight;return el;}
function welcome(){history=[{role:'assistant',text:'Привет, путешественник ✳\nЯ NOVA. Помогу найти твой следующий мир.\n\nЧто тебе ближе: строить, исследовать или принимать непростые решения?'}];}
if(!history.length)welcome();history.forEach(bubble);
function answer(text){const t=text.toLowerCase();if(/мост|стро|инженер|поезд/.test(t))return{text:'Тогда тебе в «Мост через туман». Строй дорогу между берегами, добавляй балки и тросы, затем запускай поезд.\n\nСовет: треугольные конструкции помогают распределять нагрузку. Если мост рушится, начни с укрепления самых длинных пролётов.',links:[0]};if(/карантин|quarantine|провер|контрол/.test(t))return{text:'Попробуй QUARANTINE // CONTROL. Здесь важны наблюдательность и решения. Изучай информацию на экране и не спеши с выводами.',links:[4]};if(/эпидем|вирус|outbreak|стратег/.test(t))return{text:'Для стратегического настроения есть два мира: OUTBREAK // ZERO и QUARANTINE // CONTROL. Начни с первого, если интересна тема эпидемии, или со второго — если хочется взять ситуацию под контроль.',links:[3,4]};if(/разлом|rift/.test(t))return{text:'«Пепельный разлом» ждёт. Открой игру и исследуй её мир — лучшее знакомство начинается с первого шага.',links:[2]};if(/приключ|исслед|сердц|огонь|пепел/.test(t))return{text:'Твоё настроение — приключение. Советую «Пепельное сердце» или «Пепельный разлом»: два отдельных мира, в которые можно отправиться прямо из браузера.',links:[1,2]};if(/умеешь|кто ты|ии|настоящ|модель/.test(t))return{text:'Я NOVA — демо-помощник TEST 01. Отвечаю по готовым сценариям: советую игры, объясняю навигацию и подсказываю, с чего начать.\n\nБольшая языковая модель ко мне не подключена, поэтому произвольные вопросы могу не понять. Попробуй: «хочу строить» или «посоветуй стратегию».'};if(/привет|здравств|добрый/.test(t))return{text:'Привет ✳ Рада видеть тебя по эту сторону портала. Какое сегодня настроение: спокойное строительство, приключение или стратегия?'};if(/спасибо|благодар/.test(t))return{text:'Всегда рядом ✳ Удачного путешествия. Когда захочешь сменить мир — возвращайся.'};if(/посовет|игр|скуч|выбрать|начать/.test(t))return{text:'Мой выбор для первого знакомства — «Мост через туман»: понятная цель и простор для экспериментов.\n\nХочется другой атмосферы? Напиши «приключение» или «стратегия», и я подберу альтернативу.',links:[0]};if(/сайт|назад|навига|вернуть/.test(t))return{text:'«Обзор» — главная страница TEST 01. «Миры» — все пять игр с фильтрами. NOVA — наш разговор.\n\nСсылка «На основной сайт» вверху вернёт тебя на исходную главную.'};return{text:'Пока не знаю, как ответить на это. Я ориентируюсь только в играх этого сайта.\n\nСпроси про «Мост через туман», приключения или стратегию — помогу выбрать и дам ссылку.'};}
function send(text){text=text.trim().slice(0,600);if(!text||pending)return;const m={role:'user',text};history.push(m);bubble(m);$('#chat-input').value='';save();document.body.classList.add('nova-thinking');const typing=bubble({role:'assistant',text:'Подбираю ответ…'});typing.classList.add('typing');pending=setTimeout(()=>{typing.remove();document.body.classList.remove('nova-thinking');const result={role:'assistant',...answer(text)};history.push(result);history=history.slice(-40);bubble(result);save();pending=null;},650);}
$('#chat-form').addEventListener('submit',e=>{e.preventDefault();send($('#chat-input').value);});document.querySelectorAll('[data-prompt]').forEach(b=>b.addEventListener('click',()=>send(b.dataset.prompt)));$('#clear-chat').addEventListener('click',()=>{clearTimeout(pending);pending=null;document.body.classList.remove('nova-thinking');welcome();save();$('#messages').replaceChildren();history.forEach(bubble);});
const canvas=$('#portal-art'),ctx=canvas.getContext('2d');const reduce=matchMedia('(prefers-reduced-motion: reduce)');let animate=!reduce.matches;try{if(localStorage.getItem('portal-motion')==='off')animate=false;}catch{}let w=1,h=1,frame=0,pointer={x:0,y:0};
function resize(){const rect=canvas.getBoundingClientRect();if(!rect.width)return;w=rect.width;h=rect.height;const dpr=Math.min(devicePixelRatio||1,1.75);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw(performance.now());}
// Deterministic dust field: generated once, never allocated inside animation frames.
const dust=Array.from({length:1800},(_,i)=>{const hash=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};return {r:hash(i+1),a:hash(i+41),z:hash(i+93)-.5,size:hash(i+127),arm:i%3};});
function draw(time){
 if(!ctx)return;
 ctx.clearRect(0,0,w,h);
 const mobile=w<701,cx=mobile?w*.52:w*.76,cy=mobile?h*.735:h*.47;
 const R=mobile?w*.36:Math.min(w*.21,h*.37),t=animate?time*.00013:0;
 ctx.save();ctx.translate(cx+pointer.x*9,cy+pointer.y*7);ctx.rotate(-.48+Math.sin(t*.35)*.04);
 // Broad nebula glow, with an asymmetric cyan rim to separate the layers.
 const haze=ctx.createRadialGradient(0,0,0,0,0,R*1.45);
 haze.addColorStop(0,'#ebffc632');haze.addColorStop(.22,'#c4ff6125');haze.addColorStop(.55,'#6aa94812');haze.addColorStop(1,'#193c3400');
 ctx.fillStyle=haze;ctx.fillRect(-R*1.5,-R*1.5,R*3,R*3);
 ctx.globalCompositeOperation='lighter';
 // Three flowing spiral arms rather than a closed torus. Perspective flattens
 // the distant side, while the raised crests make the plasma feel volumetric.
 for(let arm=0;arm<3;arm++){
  for(let band=0;band<(mobile?12:18);band++){
   ctx.beginPath();
   for(let k=0;k<=95;k++){
    const q=k/95,r=R*(.11+q*.99),a=arm*Math.PI*2/3+q*4.7-t+band*.014;
    const ripple=Math.sin(q*13-t*2+arm)*.018*R*q;
    const x=Math.cos(a)*(r+ripple),y=Math.sin(a)*(r+ripple)*.63+Math.sin(a*2+t)*R*.045*q;
    if(k===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
   }
   ctx.lineWidth=band%4===0?1.3:.65;
   const ribbon=ctx.createLinearGradient(-R,-R*.5,R,R*.5);
   ribbon.addColorStop(0,'#66c5c204');ribbon.addColorStop(.35,'#a6fbbf28');ribbon.addColorStop(.55,'#e4ffb957');ribbon.addColorStop(.75,'#c3f96a25');ribbon.addColorStop(1,'#a9da6500');
   ctx.strokeStyle=ribbon;ctx.stroke();
  }
 }
 // Thousands of tiny stars follow curved trajectories with differential rotation.
 const count=mobile?1050:dust.length;
 for(let i=0;i<count;i++){
  const d=dust[i],q=Math.pow(d.r,.7),r=R*(.1+q*1.06);
  const a=d.arm*Math.PI*2/3+q*4.7-t+(d.a-.5)*(.13+q*.8);
  const x=Math.cos(a)*r,y=Math.sin(a)*r*.63+d.z*R*.16*q;
  const alpha=(.18+d.size*.65)*(1-q*.55),sz=(mobile?.45:.5)+d.size*(q<.3?.8:1.05);
  ctx.fillStyle=i%5===0?`rgba(134,230,218,${alpha})`:`rgba(221,255,173,${alpha})`;
  ctx.fillRect(x,y,sz,sz);
 }
 // White-hot lens, surrounded by a soft corona. No expensive per-star shadows.
 const corona=ctx.createRadialGradient(0,0,R*.015,0,0,R*.31);
 corona.addColorStop(0,'#ffffeaff');corona.addColorStop(.12,'#f4ffd9cc');corona.addColorStop(.3,'#dbff8e70');corona.addColorStop(.62,'#b6f76918');corona.addColorStop(1,'#b6f76900');
 ctx.fillStyle=corona;ctx.fillRect(-R*.32,-R*.32,R*.64,R*.64);
 ctx.save();ctx.scale(1,.25);
 const flare=ctx.createRadialGradient(0,0,0,0,0,R*.7);flare.addColorStop(0,'#f7ffeaaa');flare.addColorStop(.13,'#eaffaf66');flare.addColorStop(.45,'#b0f5ba15');flare.addColorStop(1,'#a0f5ba00');ctx.fillStyle=flare;ctx.fillRect(-R*.7,-R*.7,R*1.4,R*1.4);ctx.restore();
 // Satellite stars drift beyond the arms, with fine optical cross highlights.
 for(let i=0;i<22;i++){
  const d=dust[i*17],a=d.a*6.28+t*.08,r=R*(.8+d.r*.55),x=Math.cos(a)*r,y=Math.sin(a)*r*.8;
  const shimmer=.35+(Math.sin(t*3+i)*.5+.5)*.45;
  ctx.fillStyle=`rgba(222,255,210,${shimmer})`;ctx.beginPath();ctx.arc(x,y,i%6===0?1.3:.65,0,Math.PI*2);ctx.fill();
  if(i%6===0){ctx.strokeStyle=`rgba(206,255,212,${shimmer*.4})`;ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(x-4,y);ctx.lineTo(x+4,y);ctx.moveTo(x,y-4);ctx.lineTo(x,y+4);ctx.stroke();}
 }
 ctx.restore();
}
let heroVisible=true,lastFrame=0;new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;},{threshold:0}).observe($('.hero'));
function loop(t){if(!document.hidden&&heroVisible&&!$('#home').hidden&&animate&&t-lastFrame>32){draw(t);lastFrame=t;}frame=requestAnimationFrame(loop);}window.addEventListener('resize',resize);$('.hero').addEventListener('pointermove',e=>{if(!animate)return;pointer.x=e.clientX/w-.5;pointer.y=(e.clientY-$('.hero').getBoundingClientRect().top)/h-.5;});function setMotion(value){animate=value;document.body.classList.toggle('motion-off',!animate);$('#motion').setAttribute('aria-pressed',String(animate));$('#motion').setAttribute('aria-label',animate?'Выключить анимацию':'Включить анимацию');$('#motion').textContent=animate?'Ⅱ Анимация':'▷ Анимация';draw(performance.now());}$('#motion').addEventListener('click',()=>{setMotion(!animate);try{localStorage.setItem('portal-motion',animate?'on':'off');}catch{}});reduce.addEventListener('change',e=>setMotion(!e.matches));setMotion(animate);navigate();requestAnimationFrame(loop);
const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');reveal.unobserve(e.target);}}),{threshold:.08});document.querySelectorAll('.dimension-lab,.discovery .section-head,.featured,.nova-banner').forEach(el=>{el.classList.add('reveal');reveal.observe(el);});
if(matchMedia('(hover:hover) and (pointer:fine)').matches){document.addEventListener('pointermove',e=>{const card=e.target.closest('.feature-card,.nova-banner');if(!card||!animate)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.style.setProperty('--mx',x*100+'%');card.style.setProperty('--my',y*100+'%');card.style.setProperty('--rx',(y-.5)*-4+'deg');card.style.setProperty('--ry',(x-.5)*5+'deg');});document.addEventListener('pointerout',e=>{const card=e.target.closest('.feature-card,.nova-banner');if(card&&!card.contains(e.relatedTarget)){card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg');}});}


const dimensions={signal:{accent:'#c5f96a',hue:'0deg',description:'Зелёное свечение. Тихая энергия неизвестного.'},nebula:{accent:'#c4a1ff',hue:'160deg',description:'Фиолетовая дымка. Где заканчивается карта, начинается космос.'},solar:{accent:'#ffc280',hue:'-55deg',description:'Янтарный свет. Почувствуй тепло далёкой звезды.'}};
function chooseDimension(key){const d=dimensions[key];if(!d)return;document.documentElement.style.setProperty('--acid',d.accent);document.documentElement.style.setProperty('--portal-hue',d.hue);document.body.dataset.dimension=key;$('#dimension-description').textContent=d.description;document.querySelectorAll('button[data-dimension]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.dimension===key)));try{localStorage.setItem('portal-dimension',key);}catch{}}
document.querySelectorAll('button[data-dimension]').forEach(b=>b.addEventListener('click',()=>chooseDimension(b.dataset.dimension)));try{chooseDimension(localStorage.getItem('portal-dimension')||'signal');}catch{chooseDimension('signal');}
let departure=null;function cancelDeparture(){clearTimeout(departure);departure=null;document.body.classList.remove('departing');}
document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target||!animate||reduce.matches)return;const game=games.find(g=>new URL(a.href,location.href).pathname===g.url);if(!game||new URL(a.href).origin!==location.origin)return;e.preventDefault();if(departure)return;$('#jump-title').textContent=game.title;document.body.classList.add('departing');departure=setTimeout(()=>{location.assign(a.href);},480);});window.addEventListener('pageshow',cancelDeparture);document.addEventListener('keydown',e=>{if(e.key==='Escape')cancelDeparture();});
})();
