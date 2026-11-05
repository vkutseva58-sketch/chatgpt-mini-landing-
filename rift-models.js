/* Faceted 3D meshes, projected by the arena's isometric camera. No external assets. */
(()=>{'use strict';
const TAU=Math.PI*2, palette={
 ember:{steel:'#394b55',edge:'#95aaa8',cloth:'#963e31',dark:'#251f2a',gold:'#dba763',light:'#ffd38a',energy:'#ff873e'},
 void:{steel:'#454157',edge:'#b4a7cb',cloth:'#594573',dark:'#211e35',gold:'#a49bc4',light:'#e7caff',energy:'#b181ff'}
};
const shades=new Map();
function shade(hex,k){k=Math.round(k*100)/100;const key=hex+':'+k;if(shades.has(key))return shades.get(key);const n=parseInt(hex.slice(1),16);const color=`rgb(${[n>>16,(n>>8)&255,n&255].map(v=>Math.min(255,Math.round(v*k))).join(',')})`;shades.set(key,color);return color;}
function model(ctx,project,x,y,angle=0,size=1,flash=false){
 const faces=[],cs=Math.cos(angle),sn=Math.sin(angle);
 const world=v=>[x+(v[0]*cs-v[1]*sn)*size,y+(v[0]*sn+v[1]*cs)*size,v[2]*size];
 function face(v,color,emissive=false){const a=world(v[0]),b=world(v[1]),d=world(v[2]);const u=b.map((n,i)=>n-a[i]),w=d.map((n,i)=>n-a[i]);const normal=[u[1]*w[2]-u[2]*w[1],u[2]*w[0]-u[0]*w[2],u[0]*w[1]-u[1]*w[0]],len=Math.hypot(...normal)||1;
 // Double-sided cloth and small armor plates share a soft directional light.
 const light=emissive?1: .57+.43*Math.abs((normal[0]*-.35+normal[1]*-.45+normal[2]*.82)/len);
 const pts=v.map(world),depth=pts.reduce((s,p)=>s-p[0]*.46+p[1]*.9+p[2]*.614,0)/v.length;
 faces.push({pts:pts.map(p=>project(...p)),color:flash?'#fff0c8':emissive?color:shade(color,light),depth,emissive});}
 function prism(cx,cy,z,rx,ry,h,color,n=6,rotation=0,taper=1){const lo=[],hi=[];for(let i=0;i<n;i++){const a=i/n*TAU+rotation;lo.push([cx+Math.cos(a)*rx,cy+Math.sin(a)*ry,z]);hi.push([cx+Math.cos(a)*rx*taper,cy+Math.sin(a)*ry*taper,z+h]);}for(let i=0;i<n;i++)face([lo[i],lo[(i+1)%n],hi[(i+1)%n],hi[i]],color);face(hi,color);}
 function crystal(cx,cy,z,r,h,color,n=5){for(let i=0;i<n;i++){const a=i/n*TAU,b=(i+1)/n*TAU,p=[cx+Math.cos(a)*r,cy+Math.sin(a)*r,z+h*.42],q=[cx+Math.cos(b)*r,cy+Math.sin(b)*r,z+h*.42];face([[cx,cy,z],q,p],shade(color,.62+(i%3)*.14),true);face([p,q,[cx,cy,z+h]],shade(color,.82+(i%3)*.17),true);}}
 function beam(a,b,r,color,n=5){const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],len=Math.hypot(dx,dy,dz)||1,dir=[dx/len,dy/len,dz/len],side=Math.abs(dir[2])>.9?[1,0,0]:[-dir[1],dir[0],0],sl=Math.hypot(...side);side.forEach((v,i)=>side[i]=v/sl);const up=[dir[1]*side[2]-dir[2]*side[1],dir[2]*side[0]-dir[0]*side[2],dir[0]*side[1]-dir[1]*side[0]],lo=[],hi=[];for(let i=0;i<n;i++){const aa=i/n*TAU,off=side.map((v,j)=>r*(v*Math.cos(aa)+up[j]*Math.sin(aa)));lo.push(a.map((v,j)=>v+off[j]));hi.push(b.map((v,j)=>v+off[j]));}for(let i=0;i<n;i++)face([lo[i],lo[(i+1)%n],hi[(i+1)%n],hi[i]],color);face(hi,color);}
 return {face,prism,crystal,beam,point:v=>project(...world(v)),draw(){faces.sort((a,b)=>a.depth-b.depth);ctx.lineWidth=.65;ctx.lineJoin='round';for(const f of faces){ctx.beginPath();f.pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=f.color;ctx.fill();ctx.strokeStyle=f.emissive?f.color:'rgba(8,17,25,.25)';ctx.stroke();}}};
}
function rune(ctx,p,rx,ry,color,time){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(p.x,p.y,rx,ry,0,0,TAU);ctx.stroke();for(let i=0;i<8;i++){const a=i/8*TAU+time*.12;const x=p.x+Math.cos(a)*rx,y=p.y+Math.sin(a)*ry;ctx.beginPath();ctx.moveTo(x-2,y-3);ctx.lineTo(x+2,y);ctx.lineTo(x-2,y+3);ctx.stroke();}ctx.restore();}
// Hero-specific sculpt: broad fire monk, layered lacquer armor and a molten glaive.
function fireChampion({c,project,scale,t,u,glow,oval,hpbar}){
 const base=project(u.x,u.y),s=1.28,step=Math.sin(u.walk)*u.walkSpeed,z=Math.abs(step)*1.5;
 oval(base.x,base.y,34*scale,17*scale,'#030c16b0');rune(c,base,36*scale,19*scale,'#ffc77980',t);
 const m=model(c,project,u.x,u.y,u.face>0?1.05:Math.PI+1.05,s,u.flash>0),red='#a93d32',gold='#e7bb70',dark='#302b36',skin='#e4a170',steel='#536574';
 // Wind-swept shoulder mantle and two long embroidered skirt panels.
 for(const side of [-1,1]){const sway=Math.sin(t*4)*3;
 m.face([[-8,side*12,59+z],[-13,side*24,54+z],[-29+sway,side*25,15+z],[-32+sway,side*8,9+z]],red);
 m.beam([-13,side*24,54+z],[-29+sway,side*25,15+z],1.3,gold);
 const stride=side*step*7;
 m.beam([0,side*10,30+z],[stride,side*13,14],6,dark);
 m.prism(stride+3,side*13,3,11,7,9,dark,6);m.prism(stride,side*13,11,7,7,12,steel,6,0,.85);
 m.face([[stride+7,side*13-5,24],[stride+10,side*13,17],[stride+7,side*13+5,24]],gold);
 m.face([[9,side*3,34+z],[8,side*17,34+z],[11+stride*.3,side*20,17+z],[15+stride*.3,side*7,13+z]],red);
 m.beam([8,side*17,34+z],[11+stride*.3,side*20,17+z],1,gold);
 }
 m.prism(0,0,28+z,13,16,10,dark,8,0,.85);m.prism(0,0,38+z,14,18,20,red,8,0,1.2);
 m.prism(0,0,33+z,15,18,5,gold,8);m.crystal(16,0,33+z,5,10,'#ffbd5a',6);
 // Curved overlapping breast plates, bright upper body and dark lower silhouette.
 for(let i=0;i<3;i++)m.face([[14,-13,53-i*5+z],[19,0,56-i*5+z],[14,13,53-i*5+z],[16,0,47-i*5+z]],i===0?gold:steel);
 for(const side of [-1,1]){
 m.prism(-1,side*21,50+z,14,12,12,red,8,0,.72);m.prism(-1,side*21,61+z,11,9,3,gold,8);
 for(let i=0;i<3;i++)m.face([[-9+i*5,side*22,61+z],[-14+i*5,side*33,73-i*3+z],[-2+i*5,side*28,58+z]],gold);
 const reach=u.recoil>0?10:0;
 m.beam([4,side*20,51+z],[12+reach,side*27,39+z],6,skin);
 m.beam([12+reach,side*27,39+z],[19+reach,side*25,42+z],6,dark);
 m.prism(15+reach,side*25,36+z,7,7,10,red,6);m.prism(15+reach,side*25,44+z,7,7,3,gold,6);
 }
 // Exposed face, pronounced brow, beard and swept-back flame hair.
 m.prism(0,0,58+z,6,7,7,skin,8);m.prism(1,0,64+z,10,10,16,skin,8,0,.8);
 m.face([[10,-7,73+z],[14,0,69+z],[10,7,73+z],[11,0,64+z]],skin);
 m.beam([10,-7,76+z],[12,-2,75+z],1.8,dark);m.beam([12,2,75+z],[10,7,76+z],1.8,dark);
 m.beam([12,-6,73+z],[13,-2,73+z],.8,'#fff1b1');m.beam([13,2,73+z],[12,6,73+z],.8,'#fff1b1');
 m.face([[11,-8,68+z],[15,0,65+z],[11,8,68+z],[5,0,57+z]],'#752b29');
 m.prism(-2,0,77+z,10,10,5,'#a73d29',8);
 for(let i=0;i<5;i++){const y=(i-2)*4;m.face([[5,y-3,80+z],[-3,y+3,81+z],[-18-Math.sin(t*6+i)*2,y,92-Math.abs(i-2)*3+z],[-10,y-3,77+z]],i%2? '#ffb64e':'#ed7035');}
 m.beam([6,-9,78+z],[10,0,80+z],1.5,gold);m.beam([10,0,80+z],[6,9,78+z],1.5,gold);
 // Oversized crescent glaive with a glowing cutting edge.
 const h=19+(u.recoil>0?10:0);
 m.beam([h,-26,12+z],[h,-26,88+z],2.5,dark);for(const zz of [24,42,68,82])m.prism(h,-26,zz+z,4,4,3,gold,6);
 m.face([[h,-26,66+z],[h+10,-26,82+z],[h+7,-26,103+z],[h+24,-26,91+z],[h+25,-26,76+z],[h+14,-26,62+z]],gold);
 m.face([[h+7,-26,103+z],[h+24,-26,91+z],[h+25,-26,76+z],[h+31,-26,86+z],[h+25,-26,103+z],[h+8,-26,112+z]],'#ff9945',true);
 m.draw();const q=m.point([h+22,-26,91+z]);glow(q.x,q.y,24*scale,'#ff8a344d');hpbar(u,151,58);
}

function character({c,project,scale,t,u,hero,glow,oval,hpbar}){
 if(u.hp<=0)return;if(u===hero){fireChampion({c,project,scale,t,u,glow,oval,hpbar});return;}const champion=u.type==='hero'||u.type==='bot',ranged=u.type==='ranged',p=palette[u.team?'void':'ember'],base=project(u.x,u.y),size=champion?1.2:.78;
 if(base.x < -180*scale||base.x > c.canvas.clientWidth+180*scale||base.y < -30*scale||base.y > c.canvas.clientHeight+180*scale)return;
 oval(base.x,base.y,(champion?26:18)*scale,(champion?13:9)*scale,'#030c16a6');
 if(u===hero)rune(c,base,30*scale,16*scale,'#ffc77980',t);
 const m=model(c,project,u.x,u.y,u.face>0?0:Math.PI,size,u.flash>0),step=Math.sin(u.walk)*u.walkSpeed,bob=Math.abs(Math.sin(u.walk))*u.walkSpeed*1.4,z=bob;
 // Trailing split cape: an actual folded surface with a moving hem.
 if(champion){const sway=Math.sin(t*4+u.x)*3+step*2;for(const sy of [-1,1]){m.face([[-9,sy*2,52+z],[-10,sy*15,48+z],[-19+sway,sy*18,13+z],[-24+sway,sy*3,18+z]],p.cloth);m.face([[-10,sy*15,48+z],[-15,sy*20,34+z],[-19+sway,sy*18,13+z]],p.dark);m.beam([-10,sy*15,48+z],[-19+sway,sy*18,13+z],.7,p.gold);}}
 for(const sy of [-1,1]){const stride=step*sy*5,foot=[stride+3,sy*7,4];m.prism(...foot,9,5,6,p.dark,4,Math.PI/4);m.beam([stride,sy*7,9],[0,sy*7,23+z],4.2,p.steel);m.prism(stride,sy*7,11,5.5,5,11,p.steel,5,0,.7);m.crystal(stride+3,sy*7,18,3,7,p.gold,4);}
 m.prism(0,0,23+z,11,12,11,p.dark,6,0,.8);m.prism(0,0,33+z,11,13,20,p.steel,6,0,1.15);m.prism(0,0,30+z,12,13,3,p.gold,6);m.face([[11,-9,48+z],[15,0,49+z],[11,9,48+z],[12,0,35+z]],p.gold);m.crystal(15,0,40+z,champion?4:2.5,champion?10:6,p.energy,4);
 for(const sy of [-1,1]){m.prism(-1,sy*15,46+z,10,7,9,p.steel,5,0,.6);m.beam([-4,sy*15,51+z],[-10,sy*20,champion?64:56],2.5,p.gold);const reach=u.recoil>0?8:0;m.beam([2,sy*14,45+z],[9+reach,sy*19,34+z],4,p.dark);m.prism(9+reach,sy*19,32+z,5,5,7,p.steel,5);}
 // Faceted closed helmet, glowing slit and asymmetric crown.
 m.prism(0,0,53+z,8,8,15,p.steel,6,0,.72);m.face([[7,-7,61+z],[10,0,59+z],[7,7,61+z],[10,0,53+z]],p.dark);m.beam([8,-5,61+z],[10,0,60+z],.9,p.light);m.beam([10,0,60+z],[8,5,61+z],.9,p.light);
 if(champion){for(const sy of [-1,1]){m.beam([-3,sy*6,65+z],[-7,sy*13,76+z],2.7,p.gold);m.beam([-7,sy*13,76+z],[u.team?1:-5,sy*12,84+z],1.2,p.gold);}m.crystal(0,0,65+z,4,15,p.energy,5);}
 const hand=9+(u.recoil>0?8:0);
 if(champion){m.beam([hand,-20,9+z],[hand,-20,80+z],1.8,p.gold);m.prism(hand,-20,65+z,6,6,4,p.gold,5);m.crystal(hand,-20,73+z,7,23,p.energy);for(const sy of [-1,1])m.beam([hand, -20+sy*5,72+z],[hand,-20+sy*10,87+z],1.2,p.edge);}
 else if(ranged){m.beam([3,-23,38+z],[25,-23,38+z],2.2,p.gold);m.beam([13,-34,39+z],[19,-23,40+z],2,p.edge);m.beam([19,-23,40+z],[13,-12,39+z],2,p.edge);m.beam([13,-34,39+z],[13,-12,39+z],.55,p.light);m.crystal(26,-23,36+z,3,7,p.energy,4);}
 else {m.beam([hand,-20,25+z],[hand+3,-20,62+z],1.8,p.gold);m.face([[hand,-22,44+z],[hand+7,-20,71+z],[hand+4,-18,43+z]],p.edge);m.beam([hand-4,-20,43+z],[hand+8,-20,43+z],1.8,p.gold);m.face([[12,13,48+z],[17,23,44+z],[17,24,31+z],[13,18,23+z],[10,11,32+z]],p.steel);m.beam([12,13,48+z],[13,18,23+z],1.1,p.gold);m.crystal(18,19,35+z,3,7,p.energy,4);}
 m.draw();if(champion){const q=m.point([hand,-20,86+z]);glow(q.x,q.y,22*scale,u.team?'#b181ff66':'#ff873e66');const flame=Math.sin(t*9+u.x)*2;const f=model(c,project,u.x,u.y,0,size);f.crystal(0,0,78+z+flame,3,13,p.light,4);f.draw();}hpbar(u,champion?118:75,champion?53:32);
}
function building({c,project,scale,t,b,glow,oval,hpbar}){
 const p=palette[b.team?'void':'ember'],base=project(b.x,b.y),m=model(c,project,b.x,b.y,0,1,b.flash>0);
 if(b.hp<=0){for(let i=0;i<7;i++)m.prism((i-3)*12,Math.sin(i*7)*26,0,12,10,6+(i%3)*7,p.steel,5,i);m.draw();return;}
 const tower=b.type==='tower';oval(base.x,base.y,62*scale,30*scale,'#030d17a6');rune(c,base,(tower?53:65)*scale,(tower?28:34)*scale,b.team?'#b896ee66':'#ffbd7766',t);
 m.prism(0,0,0,tower?47:58,tower?43:53,10,'#34434e',8,Math.PI/8);m.prism(0,0,10,tower?40:50,tower?36:45,7,p.gold,8,Math.PI/8);m.prism(0,0,17,tower?35:43,tower?31:38,9,p.steel,8,Math.PI/8);
 if(tower){m.prism(0,0,26,23,23,58,p.steel,6,0,.8);m.prism(0,0,50,25,25,5,p.gold,6);m.prism(0,0,81,31,31,10,p.steel,6);m.prism(0,0,91,32,32,4,p.gold,6);
 for(let i=0;i<4;i++){const a=i/4*TAU+Math.PI/4,x=Math.cos(a)*27,y=Math.sin(a)*27;m.beam([x*1.35,y*1.35,20],[x,y,83],7,p.steel);m.beam([x,y,92],[x*1.2,y*1.2,117],4,p.gold);m.crystal(x*1.2,y*1.2,114,4,17,p.edge,4);}
 for(let i=0;i<3;i++){const z=36+i*13;m.face([[21,-7,z],[24,0,z+5],[21,7,z],[24,0,z-5]],p.energy,true);}
 const z=101+Math.sin(t*2)*3;m.crystal(0,0,z,16,48,p.energy,6);m.crystal(-2,-2,z+12,5,27,p.light,4);
 }else{for(let i=0;i<5;i++){const a=i/5*TAU,x=Math.cos(a)*35,y=Math.sin(a)*35;m.prism(x,y,25,9,9,14,p.steel,5);m.beam([x,y,34],[x*1.12,y*1.12,66],3,p.gold);m.crystal(x*1.12,y*1.12,64,5,19,p.energy,4);}
 const z=40+Math.sin(t*1.7+b.x)*5,rot=t*.3;const crystalModel=model(c,project,b.x,b.y,rot,1,b.flash>0);crystalModel.crystal(0,0,z,24,78,p.energy,6);crystalModel.crystal(-2,-3,z+20,9,47,p.light,5);m.draw();crystalModel.draw();
 // Orbiting shards make the core distinct from a tower's mounted focus.
 for(let i=0;i<3;i++){const a=t*.6+i*TAU/3,shard=model(c,project,b.x,b.y,0);shard.crystal(Math.cos(a)*39,Math.sin(a)*39,72+Math.sin(a)*8,5,18,p.gold,4);shard.draw();}
 }
 if(tower)m.draw();const q=project(b.x,b.y,tower?124:82);glow(q.x,q.y,55*scale,b.team?'#b181ff3a':'#ff873e3a');hpbar(b,tower?165:145,86);
}
window.RiftModels={character,building};
})();
