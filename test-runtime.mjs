import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as THREE from './three.module.js';
const elements=new Map();function el(key){if(!elements.has(key))elements.set(key,{hidden:false,textContent:'',innerHTML:'',style:{},addEventListener(){},getContext(){return {fillRect(){},fillText(){}}}});return elements.get(key)}
globalThis.document={querySelector:el,querySelectorAll:()=>[],createElement:()=>el('texture')};Object.assign(globalThis,{innerWidth:1280,innerHeight:720,devicePixelRatio:1,addEventListener(){},matchMedia:()=>({matches:false}),requestAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}}});
let source=fs.readFileSync(new URL('./game.js',import.meta.url),'utf8').replace("import * as THREE from './three.module.js';",'');
source=source.replace(/let renderer;try\{[\s\S]*?throw e\}/,`let renderer={setPixelRatio(){},shadowMap:{},setClearColor(){},setSize(){},render(){}};`);
source+=`\nreturn {start:resetRace,tick:update,player,ai,path,setKeys:k=>keys=k,state:()=>state,pause,elapsed:()=>elapsed,rank,reset:resetBoat,elements:$,wallPhysics,bodyCollision,routePoint,routes,nearest,length};`;
const game=new Function('THREE',source)(THREE);
game.start();assert.equal(game.state(),'countdown');assert.equal(game.rank(),4,'starting grid position accounts for boats ahead');for(let i=0;i<90;i++)game.tick(.04);assert.equal(game.state(),'race');
game.setKeys({w:true});for(let i=0;i<80;i++)game.tick(.025);assert.ok(game.player.vel.length()>7,'throttle accelerates the boat');
const speed=game.player.vel.length();game.setKeys({s:true});for(let i=0;i<20;i++)game.tick(.025);assert.ok(game.player.vel.length()<speed,'braking slows the boat');
game.pause();let time=game.elapsed();game.tick(1);assert.equal(game.elapsed(),time,'pause freezes race clock');game.pause();
game.setKeys({});game.player.vel.set(0,0,0);game.player.pos.copy(game.path(.51));game.tick(.001);assert.equal(game.player.lap,0,'cannot skip checkpoints');
game.start();for(let i=0;i<90;i++)game.tick(.04);game.setKeys({});
for(let lap=0;lap<3;lap++){for(let t of [.25,.5,.75,0]){game.player.pos.copy(game.path(t));game.player.vel.set(0,0,0);game.tick(.016)}assert.equal(game.player.lap,lap+1)}
assert.equal(game.state(),'results','three ordered laps finish race');assert.ok(game.elements('#result-time').textContent.includes('Race time'));
game.start();assert.equal(game.player.lap,0);assert.equal(game.player.boost,1);assert.equal(game.elapsed(),0,'restart clears race clock');
game.ai[0].finishTime=12;game.player.lap=3;game.tick(13);assert.ok(game.rank()>=2,'opponent finish order affects result');
game.start();for(let i=0;i<90;i++)game.tick(.04);game.player.pos.copy(game.path(.1));game.player.heading=0;game.player.vel.set(0,0,200);game.setKeys({w:true,' ':true});game.tick(.001);assert.ok(game.player.vel.length()>200,'no hard speed cap');
function tap(){let t=.2,c=game.path(t),tangent=game.path(t+.0001).sub(c).normalize(),normal=new THREE.Vector3(-tangent.z,0,tangent.x);game.player.pos.copy(c);game.wallPhysics(game.player,.4,true);game.player.pos.copy(c).addScaledVector(normal,12);game.player.vel.copy(tangent).multiplyScalar(40).addScaledVector(normal,10);game.wallPhysics(game.player,.01,true)}
game.player.surge=0;tap();assert.equal(game.player.surge,1);tap();assert.equal(game.player.surge,2,'distinct wall taps stack surge');game.wallPhysics(game.player,.01,true);assert.equal(game.player.surge,2,'continuous wall contact cannot farm surge');
function hit(stack,key){let a={pos:new THREE.Vector3(),vel:new THREE.Vector3(10,0,0),surge:stack},b={pos:new THREE.Vector3(2,0,0),vel:new THREE.Vector3(),surge:0};game.bodyCollision(a,b,key);assert.equal(a.surge,0,'hit spends surge');return b.vel.length()}
assert.ok(hit(5,'high')>hit(1,'low')*2,'surge stacks increase knockback');
for(let r of game.routes)for(let j=1;j<20;j++){let t=r.start+(r.end-r.start)*j/20,point=game.routePoint(t,r.route),n=game.nearest(point,r.route);assert.ok(Math.abs(n.point.y-point.y)<.25,'correct elevated surface '+JSON.stringify({route:r.route,t,y:point.y,selected:n.route,sy:n.point.y}));assert.equal(n.route,r.route,'route separation does not snap to lower road');let body={pos:point.clone(),vel:new THREE.Vector3(0,0,15),route:r.route,surge:0};game.wallPhysics(body,.01,false);assert.ok(Math.abs(body.pos.y-point.y)<.25,'boat follows actual route elevation')}
console.log('PASS: all branching trails, vertical route separation, driveable route heights. Main circuit '+Math.round(game.length)+' meters.');
console.log('PASS: uncapped speed, wall tap stacking, contact farming prevention, surge consumption, scalable knockback.');
console.log('PASS: starting grid, acceleration, braking, pause, checkpoint order, three-lap finish, restart, opponent finish order.');

