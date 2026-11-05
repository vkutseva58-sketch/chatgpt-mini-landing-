from playwright.sync_api import sync_playwright
from pathlib import Path
import os, shutil, tempfile
# Run: pip install playwright; playwright install chromium; python tests/mist-bridge-construction.py
ROOT=Path(__file__).resolve().parents[1]
SHOTS=Path(tempfile.mkdtemp(prefix='mist-bridge-tests-'))
CHROMIUM=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium')
from urllib.parse import urlparse
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,args=['--no-sandbox']);errors=[]
 for w,h in [(360,800),(390,844),(430,932),(844,390),(1440,900)]:
  page=b.new_page(viewport={'width':w,'height':h},has_touch=True);page.add_init_script('window.requestAnimationFrame=()=>0');page.on('pageerror',lambda e:errors.append(str(e)))
  def route(r):
   f=ROOT/urlparse(r.request.url).path.lstrip('/');r.fulfill(path=str(f)) if f.is_file() else r.fulfill(status=200,body='')
  page.route('**/*',route);page.goto('http://localhost/mist-bridge.html')
  def tap(i):
   pt=page.evaluate('(i)=>bridgeTest.screen(i)',i);page.touchscreen.tap(pt['x'],pt['y'])
  # Drawing a long road creates a continuous path and a single undo entry.
  tap(7);tap(13)
  assert page.evaluate('bridgeTest.state().roadPath.length')==6
  assert page.evaluate('bridgeTest.state().members.every(m=>m.type==="road")')
  page.click('#undo');assert page.evaluate('bridgeTest.state().members.length')==0
  # Native touch adds a new point off the old lattice.
  page.click('[data-material="node"]')
  p0=page.evaluate('bridgeTest.screen(7)');p1=page.evaluate('bridgeTest.screen(13)');scl=(p1['x']-p0['x'])/480
  page.touchscreen.tap(p0['x']+160*scl,p0['y']-80*scl)
  assert page.evaluate('bridgeTest.nodes.length')==22
  assert page.evaluate('bridgeTest.nodes[21].fixed')==False
  page.click('[data-material="steel"]');tap(0);tap(21)
  assert page.evaluate('bridgeTest.state().members.length')>=1
  draft=page.evaluate('JSON.stringify({nodes:bridgeTest.nodes,members:bridgeTest.state().members})')
  page.select_option('#route','1');assert page.evaluate('bridgeTest.state().members.length')==0
  page.select_option('#route','0');assert page.evaluate('JSON.stringify({nodes:bridgeTest.nodes,members:bridgeTest.state().members})')==draft
  page.click('#undo');assert page.evaluate('bridgeTest.state().members.length')==0
  page.click('#undo');assert page.evaluate('bridgeTest.nodes.length')==21
  # A bare steel line is not a road; no launch.
  page.evaluate("bridgeTest.addMember(7,13,'steel')");page.click('#run');assert page.evaluate('bridgeTest.state().mode')=='build'
  page.evaluate('bridgeTest.reset(true)');page.click('[data-material="road"]');tap(7);tap(13)
  page.click('#survey');assert page.evaluate('bridgeTest.state().survey')
  page.click('#run');assert page.locator('#route').is_disabled();page.click('#pause');before=page.evaluate('bridgeTest.state().time');page.evaluate('for(let i=0;i<100;i++)bridgeTest.tick(1/60)');assert page.evaluate('bridgeTest.state().time')==before;page.click('#continue')
  page.evaluate('for(let i=0;i<700;i++)bridgeTest.tick(1/60)');assert page.evaluate('bridgeTest.state().mode')=='lost'
  assert page.evaluate('bridgeTest.state().wreck.every(car=>[car.rear,car.front].every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)))')
  page.click('#continue');assert page.evaluate('bridgeTest.state().members.length')==6
  for level in range(3):
   page.select_option('#route',str(level));page.evaluate('bridgeTest.draw()');page.screenshot(path=str(SHOTS/f'free-{w}-{level}.png'))
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   for sel in ['#run','[data-material="road"]','[data-material="node"]','[data-material="erase"]','#route']:
    box=page.locator(sel).bounding_box();assert box and box['x']>=0 and box['x']+box['width']<=w+1 and box['y']+box['height']<=h+1,(w,sel,box)
  print(w,h,'PASS touch drawing, custom nodes, draft, undo, road validation, survey, pause, collapse, layout')
  page.close()
 # Structural edge cases through debug API, with exact assertions.
 page=b.new_page();page.add_init_script('window.requestAnimationFrame=()=>0');page.route('**/*',route);page.goto('http://localhost/mist-bridge.html')
 result=page.evaluate('''()=>{const t=bridgeTest; t.addMember(7,8,'road');t.addMember(7,8,'steel');if(t.state().members.length!==2)throw Error('layers');const spent=t.state().spent;const n=t.addNode({x:400,y:350});if(t.state().members.length!==4||t.state().spent!==spent)throw Error('split');if(t.nodes[n].fixed)throw Error('floating anchor');if(t.addMember(0,7,'road'))throw Error('vertical road');t.reset(true);t.material('road');if(t.connectPoints({id:7}, {x:440,y:190}))throw Error('steep road');if(t.nodes.length!==21||t.state().members.length)throw Error('atomic rollback');t.addMember(7,9,'road');t.addMember(10,13,'road');t.run();if(t.state().mode!=='build')throw Error('gap accepted');return 'PASS layers, splitting without charge, floating nodes, steep road rejection, rollback and disconnected path'}''')
 print(result)
 for level in range(3):
  page.select_option('#route',str(level))
  for weather in [False,True]:
   page.evaluate('bridgeTest.reset(true)')
   if page.evaluate('bridgeTest.state().storm')!=weather:page.click('#weather')
   page.evaluate("bridgeTest.addMember(7,13,'road');for(let i=0;i<6;i++){bridgeTest.addMember(14+i,15+i,'steel');bridgeTest.addMember(7+i,15+i,'steel')}for(let i=1;i<6;i++)bridgeTest.addMember(7+i,14+i,'steel')")
   if level==1:page.evaluate("for(let i=0;i<6;i++){bridgeTest.addMember(i,i+1,'steel');bridgeTest.addMember(i,8+i,'steel')}for(let i=1;i<6;i++)bridgeTest.addMember(i,7+i,'steel')")
   page.click('#run');page.evaluate('for(let i=0;i<1300;i++)bridgeTest.tick(1/60)')
   assert page.evaluate('bridgeTest.state().mode')=='won',(level,weather)
   page.click('#retry')
 print('PASS all three routes with road and steel trusses, calm and storm')
 assert not errors,errors
 print('Screenshots:',SHOTS)
 b.close()
