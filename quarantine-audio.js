(()=>{'use strict';
const $=s=>document.querySelector(s);let ctx=null,master=null,ambGain=null,hum1=null,hum2=null,enabled=localStorage.getItem('qc_sound')!=='off',unlocked=false,lastClock='';
function ensure(){if(!enabled)return null;if(!ctx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;ctx=new AC();master=ctx.createGain();master.gain.value=.42;master.connect(ctx.destination);ambGain=ctx.createGain();ambGain.gain.value=0;ambGain.connect(master)}if(ctx.state==='suspended')ctx.resume();unlocked=true;return ctx}
function osc(freq=440,dur=.08,type='sine',vol=.08,delay=0,slide=null){const c=ensure();if(!c)return;const t=c.currentTime+delay,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(20,slide),t+dur);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,vol),t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.03)}
function noise(dur=.08,vol=.05,filter=900,delay=0){const c=ensure();if(!c)return;const len=Math.max(1,Math.floor(c.sampleRate*dur)),b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain(),t=c.currentTime+delay;s.buffer=b;f.type='lowpass';f.frequency.value=filter;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(master);s.start(t)}
function startAmbience(){if(!enabled)return;const c=ensure();if(!c)return;if(!hum1){hum1=c.createOscillator();hum2=c.createOscillator();hum1.type='sine';hum2.type='triangle';hum1.frequency.value=54;hum2.frequency.value=108;hum1.connect(ambGain);hum2.connect(ambGain);hum1.start();hum2.start()}ambGain.gain.cancelScheduledValues(c.currentTime);ambGain.gain.linearRampToValueAtTime(.028,c.currentTime+.5)}
function stopAmbience(fast=false){if(!ctx||!ambGain)return;ambGain.gain.cancelScheduledValues(ctx.currentTime);ambGain.gain.linearRampToValueAtTime(0,ctx.currentTime+(fast?.08:.35));if(fast&&ctx.state==='running')setTimeout(()=>ctx?.suspend(),120)}
const S={
 click(){osc(410,.035,'square',.018);osc(620,.025,'square',.012,.015)},
 paper(){noise(.055,.022,2400);osc(180,.04,'triangle',.014)},
 stamp(ok){noise(.12,.12,520,.095);osc(ok?92:78,.16,'sine',.16,.1,ok?58:48);osc(ok?650:185,.09,'square',.035,.24,ok?820:125)},
 scanner(){osc(540,.07,'sine',.045);osc(710,.07,'sine',.045,.07);osc(910,.09,'sine',.04,.14);noise(.15,.018,4200)},
 question(){osc(310,.05,'square',.025);osc(260,.08,'triangle',.025,.06)},
 good(){osc(560,.07,'sine',.035);osc(760,.11,'sine',.04,.07)},
 bad(){osc(190,.09,'sawtooth',.04);osc(132,.18,'sawtooth',.045,.08)},
 alert(){for(let i=0;i<3;i++){osc(760,.11,'square',.055,i*.24,620);osc(380,.11,'square',.025,i*.24)}noise(.7,.012,2500)},
 shift(){osc(330,.1,'sine',.03);osc(440,.1,'sine',.03,.12);osc(660,.2,'sine',.035,.24)},
 arrive(){osc(250,.025,'square',.012);osc(350,.025,'square',.009,.03)},
 tick(){osc(950,.018,'square',.012);noise(.018,.006,5000)}
};
function updateButton(){const b=$('#soundToggle');if(!b)return;b.classList.toggle('on',enabled);b.classList.toggle('off',!enabled);b.setAttribute('aria-pressed',enabled?'true':'false');b.innerHTML=enabled?'ЗВУК <span class="sound-word">ON</span>':'ЗВУК <span class="sound-word">OFF</span>'}
function bind(){const toggle=$('#soundToggle');if(toggle){toggle.addEventListener('click',e=>{e.preventDefault();enabled=!enabled;localStorage.setItem('qc_sound',enabled?'on':'off');if(enabled){ensure();startAmbience();S.click()}else stopAmbience(true);updateButton();toggle.classList.remove('pulse');void toggle.offsetWidth;toggle.classList.add('pulse')})}
document.addEventListener('pointerdown',()=>{if(enabled){ensure();if(!$('#startOverlay')?.classList.contains('hidden'))return;startAmbience()}},{once:true,capture:true});
$('#startBtn')?.addEventListener('click',()=>{if(enabled){ensure();startAmbience();S.click()}});
$('#rulesBtn')?.addEventListener('click',()=>S.paper());$('#closeRules')?.addEventListener('click',()=>S.paper());
document.querySelectorAll('.qc-doc-tabs button').forEach(b=>b.addEventListener('click',()=>S.paper()));
$('#inspectBtn')?.addEventListener('click',()=>S.scanner());$('#questionBtn')?.addEventListener('click',()=>S.question());
$('#approveBtn')?.addEventListener('click',()=>S.stamp(true));$('#denyBtn')?.addEventListener('click',()=>S.stamp(false));
const alert=$('#emergencyAlert');if(alert)new MutationObserver(()=>{if(alert.classList.contains('show'))S.alert()}).observe(alert,{attributes:true,attributeFilter:['class']});
const log=$('#log');if(log)new MutationObserver(muts=>{for(const m of muts)for(const n of m.addedNodes){if(!(n instanceof HTMLElement))continue;if(n.classList.contains('bad'))S.bad();else if(n.classList.contains('good'))S.good()}}).observe(log,{childList:true});
const person=$('#personName');if(person)new MutationObserver(()=>{if(person.textContent.trim()&&person.textContent.trim()!=='—')S.arrive()}).observe(person,{childList:true,characterData:true,subtree:true});
const shift=$('#shiftOverlay');if(shift)new MutationObserver(()=>{if(!shift.classList.contains('hidden'))S.shift()}).observe(shift,{attributes:true,attributeFilter:['class']});
const clock=$('#clock');if(clock)new MutationObserver(()=>{const text=clock.textContent.trim();if(text===lastClock)return;lastClock=text;const parts=text.split(':').map(Number);const sec=(parts[0]||0)*60+(parts[1]||0);if(sec>0&&sec<=30&&!document.hidden)S.tick()}).observe(clock,{childList:true,characterData:true,subtree:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAmbience(true);else if(enabled&&unlocked){ensure();startAmbience()}});updateButton()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();