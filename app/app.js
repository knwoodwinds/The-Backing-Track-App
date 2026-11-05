(function(){
'use strict';
var $=function(s){return document.querySelector(s)};
var rnd=function(a){return a[Math.floor(Math.random()*a.length)]};
var NOTE=['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];
var OFF={concert:0,bb:2,eb:9,f:7};

/* chord qualities: sym = display, t = chord tones (bass), v = piano voicing intervals */
var Q={
  maj7:{sym:'maj7',t:[0,4,7,11],v:[4,7,11,14]},
  '6':{sym:'6',t:[0,4,7,9],v:[4,7,9,14]},
  '7':{sym:'7',t:[0,4,7,10],v:[4,10,14,21]},
  m7:{sym:'m7',t:[0,3,7,10],v:[3,7,10,14]},
  m7b5:{sym:'m7♭5',t:[0,3,6,10],v:[3,6,10,17]},
  dim7:{sym:'°7',t:[0,3,6,9],v:[3,6,9,12]},
  m6:{sym:'m6',t:[0,3,7,9],v:[3,7,9,14]},
  '7b9':{sym:'7♭9',t:[0,4,7,10],v:[4,10,13,21]},
  maj:{sym:'',t:[0,4,7],v:[4,7,12,16]},
  m:{sym:'m',t:[0,3,7],v:[3,7,12,15]},
  sus:{sym:'sus',t:[0,5,7,10],v:[5,7,10,14]},
  '7alt':{sym:'7alt',t:[0,4,8,10],v:[4,10,13,20]}
};

/* tunes: chords are [degree in semitones above the tonic, quality] */
var B=function(){return Array.prototype.slice.call(arguments)};
var T=function(d,q){return [d,q]};
var rcA=[B(T(0,'maj7'),T(9,'m7')),B(T(2,'m7'),T(7,'7')),B(T(4,'m7'),T(9,'7')),B(T(2,'m7'),T(7,'7')),
         B(T(0,'maj7'),T(0,'7')),B(T(5,'maj7'),T(5,'m7')),B(T(0,'maj7'),T(9,'m7')),B(T(2,'m7'),T(7,'7'))];
var rcB=[B(T(4,'7')),B(T(4,'7')),B(T(9,'7')),B(T(9,'7')),B(T(2,'7')),B(T(2,'7')),B(T(7,'7')),B(T(7,'7'))];
var chA1=[B(T(0,'6')),B(T(0,'6')),B(T(7,'m7')),B(T(0,'7')),B(T(5,'maj7')),B(T(5,'maj7')),B(T(10,'7')),B(T(10,'7')),
         B(T(0,'6')),B(T(0,'6')),B(T(2,'7')),B(T(2,'7')),B(T(2,'m7')),B(T(7,'7b9')),B(T(2,'m7')),B(T(7,'7alt'))];
var chA2=chA1.slice(0,8).concat([B(T(0,'6')),B(T(0,'6')),B(T(2,'7')),B(T(2,'7')),B(T(2,'m7')),B(T(7,'7')),B(T(0,'6')),B(T(0,'6'))]);
var chB=[B(T(2,'m7')),B(T(7,'7')),B(T(0,'maj7')),B(T(0,'maj7')),
         B(T(0,'m7')),B(T(5,'7')),B(T(10,'maj7')),B(T(10,'maj7')),
         B(T(11,'m7')),B(T(4,'7')),B(T(9,'maj7')),B(T(9,'maj7')),
         B(T(9,'m7')),B(T(2,'7')),B(T(2,'m7')),B(T(7,'7alt'))];
var TUNES=[
  {name:'Medium Blues',form:'12-bar jazz blues',style:'swing',tempo:132,key:5,bars:[
    B(T(0,'7')),B(T(5,'7')),B(T(0,'7')),B(T(7,'m7'),T(0,'7')),
    B(T(5,'7')),B(T(6,'dim7')),B(T(0,'7')),B(T(4,'m7b5'),T(9,'7')),
    B(T(2,'m7')),B(T(7,'7')),B(T(0,'7'),T(9,'7')),B(T(2,'m7'),T(7,'7'))]},
  {name:'Minor Blues',form:'12-bar minor blues',style:'swing',tempo:118,key:0,bars:[
    B(T(0,'m7')),B(T(0,'m7')),B(T(0,'m7')),B(T(0,'m7')),
    B(T(5,'m7')),B(T(5,'m7')),B(T(0,'m7')),B(T(0,'m7')),
    B(T(8,'7')),B(T(7,'7b9')),B(T(0,'m7')),B(T(7,'7b9'))]},
  {name:'Rhythm Changes',form:'32-bar AABA',style:'swing',tempo:176,key:10,marks:{0:'A',8:'A',16:'B',24:'A'},
    bars:rcA.concat(rcA,rcB,rcA)},
  {name:'Cherokee',form:'64-bar AABA',style:'swing',tempo:200,key:10,marks:{0:'A',16:'A',32:'B',48:'A'},
    bars:chA1.concat(chA2,chB,chA2)},
  {name:'In the Still of the Night',form:'40 bars, simplified changes',style:'ballad',tempo:70,key:3,marks:{0:'A',16:'B'},bars:[
    B(T(0,'6')),B(T(0,'m6')),B(T(0,'6')),B(T(0,'m6')),
    B(T(2,'m7'),T(7,'7')),B(T(4,'m7'),T(9,'7b9')),B(T(2,'m7'),T(7,'7')),B(T(7,'7alt')),
    B(T(0,'6')),B(T(0,'m6')),B(T(0,'6')),B(T(0,'m6'),T(11,'7')),
    B(T(4,'m')),B(T(11,'7')),B(T(4,'m')),B(T(7,'7')),
    B(T(0,'6')),B(T(5,'maj')),B(T(2,'m6'),T(7,'7')),B(T(0,'6')),
    B(T(0,'6'),T(5,'maj')),B(T(7,'7')),B(T(4,'m7b5')),B(T(9,'7')),
    B(T(4,'m7'),T(9,'7')),B(T(2,'m')),B(T(5,'m6')),B(T(0,'6')),
    B(T(6,'dim7'),T(7,'7')),B(T(0,'6'),T(3,'dim7')),
    B(T(2,'m7'),T(7,'7')),B(T(0,'6')),
    B(T(9,'7')),B(T(2,'m')),B(T(5,'m6')),B(T(0,'6')),
    B(T(6,'dim7'),T(7,'7')),B(T(0,'6'),T(3,'dim7')),
    B(T(2,'m7'),T(7,'7')),B(T(0,'6'),T(0,'m6'))]},
  {name:'ii–V–I Major',form:'8-bar workout',style:'swing',tempo:120,key:0,bars:[
    B(T(2,'m7')),B(T(7,'7')),B(T(0,'maj7')),B(T(0,'maj7')),
    B(T(2,'m7')),B(T(7,'7')),B(T(0,'maj7')),B(T(0,'maj7'),T(9,'7b9'))]},
  {name:'Minor ii–V–i',form:'8-bar workout',style:'swing',tempo:112,key:2,bars:[
    B(T(2,'m7b5')),B(T(7,'7b9')),B(T(0,'m6')),B(T(0,'m6')),
    B(T(5,'m7')),B(T(10,'7')),B(T(2,'m7b5'),T(7,'7b9')),B(T(0,'m6'))]},
  {name:'Bossa Loop',form:'8-bar minor bossa',style:'bossa',tempo:128,key:9,bars:[
    B(T(0,'m7')),B(T(2,'m7b5'),T(7,'7b9')),B(T(0,'m7')),B(T(2,'m7b5'),T(7,'7b9')),
    B(T(5,'m7')),B(T(10,'7')),B(T(3,'maj7')),B(T(2,'m7b5'),T(7,'7b9'))]},
  {name:'Ballad Turnarounds',form:'16-bar ballad',style:'ballad',tempo:62,key:3,bars:[
    B(T(0,'maj7')),B(T(9,'m7')),B(T(2,'m7')),B(T(7,'7')),
    B(T(4,'m7')),B(T(9,'7b9')),B(T(2,'m7')),B(T(7,'7')),
    B(T(0,'maj7')),B(T(0,'7')),B(T(5,'maj7')),B(T(5,'m6')),
    B(T(0,'maj7'),T(9,'m7')),B(T(2,'m7'),T(7,'7')),B(T(0,'maj7'),T(9,'m7')),B(T(2,'m7'),T(7,'7'))]},
  {name:'Dorian Vamp',form:'8-bar modal',style:'swing',tempo:138,key:2,bars:[
    B(T(0,'m7')),B(T(0,'m7')),B(T(0,'m7')),B(T(0,'m7')),
    B(T(2,'m7')),B(T(2,'m7')),B(T(0,'m7')),B(T(0,'m7'))]}
];

/* custom chart parser */
var SUF={'':'maj','maj':'maj','M':'maj','m':'m','min':'m','-':'m','7':'7','maj7':'maj7','M7':'maj7','ma7':'maj7','Δ':'maj7','Δ7':'maj7',
 'm7':'m7','min7':'m7','-7':'m7','m7b5':'m7b5','ø':'m7b5','ø7':'m7b5','m7♭5':'m7b5','dim':'dim7','dim7':'dim7','o7':'dim7','°7':'dim7','°':'dim7',
 '6':'6','69':'6','6/9':'6','m6':'m6','min6':'m6','7b9':'7b9','7♭9':'7b9','7alt':'7alt','alt':'7alt','sus':'sus','sus4':'sus','7sus':'sus','7sus4':'sus',
 '9':'7','11':'7','13':'7','m9':'m7','m11':'m7','maj9':'maj7'};
var LET={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
function parseChord(s){
  var m=/^([A-Ga-g])([#b♯♭]?)(.*)$/.exec(s); if(!m) return null;
  var pc=LET[m[1].toUpperCase()];
  if(m[2]==='#'||m[2]==='♯') pc+=1; else if(m[2]==='b'||m[2]==='♭') pc-=1;
  var q=SUF[m[3]]; if(!q) return null;
  return [((pc%12)+12)%12,q];
}
function parseChart(text){
  var segs=text.replace(/\r/g,'').split(/[|\n]/).map(function(s){return s.trim()}).filter(Boolean);
  if(!segs.length) return {error:'Type at least one bar of chords.'};
  if(segs.length>64) return {error:'That is more than 64 bars. Try a shorter form.'};
  var abs=[];
  for(var i=0;i<segs.length;i++){
    var toks=segs[i].split(/[\s,]+/).filter(Boolean);
    if(toks.length>2) return {error:'Bar '+(i+1)+' has more than two chords.'};
    var bar=[];
    for(var j=0;j<toks.length;j++){
      var c=parseChord(toks[j]);
      if(!c) return {error:'Could not read "'+toks[j]+'" in bar '+(i+1)+'.'};
      bar.push(c);
    }
    abs.push(bar);
  }
  var tonic=abs[0][0][0];
  return {tonic:tonic,bars:abs.map(function(b){return b.map(function(c){return [((c[0]-tonic)+12)%12,c[1]]})})};
}
var DEFAULT_TEXT='Dm7 G7 | Cmaj7 A7 | Dm7 G7 | Cmaj7 |\nEm7b5 A7 | Dm7 | Gm7 C7 | Fmaj7';
var first=parseChart(DEFAULT_TEXT);
TUNES.push({name:'Your changes',form:'Type any progression',style:'swing',tempo:120,key:first.tonic,bars:first.bars,custom:true});

/* state */
var S={ti:0,bars:[],key:5,tempo:130,inst:'concert',style:'swing',swing:0.667,
  vol:{piano:0.8,bass:0.85,drums:0.7},mute:{piano:false,bass:false,drums:false},
  countIn:true,choruses:0,look:'system',loop:null,cursor:0,playing:false,pick:false};
try{
  var saved=JSON.parse(localStorage.getItem('backingtrackapp')||'null');
  if(saved){ ['inst','countIn','choruses','look'].forEach(function(k){ if(saved[k]!==undefined) S[k]=saved[k] });
    if(saved.vol) S.vol=Object.assign(S.vol,saved.vol); if(saved.mute) S.mute=Object.assign(S.mute,saved.mute); }
}catch(e){}
function save(){ try{ localStorage.setItem('backingtrackapp',JSON.stringify({inst:S.inst,countIn:S.countIn,choruses:S.choruses,look:S.look,vol:S.vol,mute:S.mute})) }catch(e){} }

function absRoot(ch){return (ch[0]+S.key)%12}
function chordHTML(ch){
  var pc=(ch[0]+S.key+OFF[S.inst])%12;
  return '<span class="ch"><b>'+NOTE[pc]+'</b>'+(Q[ch[1]].sym?'<sup>'+Q[ch[1]].sym+'</sup>':'')+'</span>';
}

/* ---------- audio ---------- */
var ctx=null,comp=null,NB=null,EP=null,SESS=null,BUS=null;
function ensureAudio(){
  if(ctx) return;
  ctx=new (window.AudioContext||window.webkitAudioContext)();
  comp=ctx.createDynamicsCompressor();
  comp.threshold.value=-14; comp.ratio.value=3; comp.attack.value=0.01; comp.release.value=0.2;
  var out=ctx.createGain(); out.gain.value=0.9; comp.connect(out); out.connect(ctx.destination);
  NB=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);
  var d=NB.getChannelData(0); for(var i=0;i<d.length;i++) d[i]=Math.random()*2-1;
  var im=new Float32Array([0,1,0.5,0.28,0.14,0.08,0.04]);
  EP=ctx.createPeriodicWave(new Float32Array(im.length),im);
}
function newSession(){
  if(SESS){ var old=SESS; old.gain.setTargetAtTime(0,ctx.currentTime,0.02); setTimeout(function(){try{old.disconnect()}catch(e){}},600); }
  SESS=ctx.createGain(); SESS.connect(comp); BUS={};
  var pans={piano:-0.25,bass:0,drums:0.25,click:0};
  Object.keys(pans).forEach(function(k){
    var g=ctx.createGain(); var node=g;
    if(ctx.createStereoPanner){ var p=ctx.createStereoPanner(); p.pan.value=pans[k]; g.connect(p); node=p; }
    node.connect(SESS); BUS[k]=g;
  });
  applyMix();
}
function applyMix(){
  if(!BUS) return;
  ['piano','bass','drums'].forEach(function(k){ BUS[k].gain.value=S.mute[k]?0:S.vol[k]; });
  BUS.click.gain.value=1;
}
function mf(m){return 440*Math.pow(2,(m-69)/12)}
function tone(type,f,t,dur,peak,bus){
  var o=ctx.createOscillator(); o.type=type; o.frequency.value=f;
  var g=ctx.createGain(); g.gain.setValueAtTime(0.0001,t);
  g.gain.exponentialRampToValueAtTime(Math.max(peak,0.0002),t+0.002);
  g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(g); g.connect(bus); o.start(t); o.stop(t+dur+0.05);
}
function noise(t,dur,peak,type,f,q,bus){
  var s=ctx.createBufferSource(); s.buffer=NB;
  var fl=ctx.createBiquadFilter(); fl.type=type; fl.frequency.value=f; fl.Q.value=q;
  var g=ctx.createGain(); g.gain.setValueAtTime(0.0001,t);
  g.gain.exponentialRampToValueAtTime(Math.max(peak,0.0002),t+0.002);
  g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  s.connect(fl); fl.connect(g); g.connect(bus); s.start(t,Math.random()*1.5,dur+0.05);
}
function ride(t,v){ noise(t,0.5,v*0.16,'highpass',6500,0.7,BUS.drums); noise(t,0.14,v*0.12,'bandpass',9500,1,BUS.drums); tone('sine',4700,t,0.22,v*0.02,BUS.drums); }
function hat(t,v){ noise(t,0.045,v*0.22,'highpass',8000,0.7,BUS.drums); }
function hatFoot(t,v){ noise(t,0.06,v*0.3,'highpass',6500,0.8,BUS.drums); tone('sine',420,t,0.04,v*0.08,BUS.drums); }
function brush(t,dur,v){ noise(t,dur,v*0.22,'bandpass',3200,0.5,BUS.drums); }
function rim(t,v){ tone('triangle',1650,t,0.03,v*0.12,BUS.drums); noise(t,0.03,v*0.14,'bandpass',2600,4,BUS.drums); }
function kick(t,v){
  var o=ctx.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(110,t); o.frequency.exponentialRampToValueAtTime(48,t+0.1);
  var g=ctx.createGain(); g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(v*0.9,t+0.004); g.gain.exponentialRampToValueAtTime(0.0001,t+0.22);
  o.connect(g); g.connect(BUS.drums); o.start(t); o.stop(t+0.25);
}
function click(t,accent){ tone('sine',accent?1500:1000,t,0.05,0.4,BUS.click); }
function bassNote(m,t,dur,vel){
  var f=mf(m), peak=vel*0.55;
  var o=ctx.createOscillator(); o.type='triangle'; o.frequency.value=f;
  var o2=ctx.createOscillator(); o2.type='sine'; o2.frequency.value=f;
  var fl=ctx.createBiquadFilter(); fl.type='lowpass'; fl.frequency.setValueAtTime(1000,t); fl.frequency.exponentialRampToValueAtTime(280,t+0.25);
  var g=ctx.createGain(); g.gain.setValueAtTime(0.0001,t);
  g.gain.exponentialRampToValueAtTime(peak,t+0.008);
  g.gain.exponentialRampToValueAtTime(peak*0.45,t+Math.max(dur*0.8,0.02));
  g.gain.exponentialRampToValueAtTime(0.0001,t+dur+0.05);
  o.connect(fl); o2.connect(fl); fl.connect(g); g.connect(BUS.bass);
  o.start(t); o2.start(t); o.stop(t+dur+0.1); o2.stop(t+dur+0.1);
}
function key(m,t,dur,vel){
  var peak=vel*0.065;
  var o=ctx.createOscillator(); o.setPeriodicWave(EP); o.frequency.value=mf(m);
  var fl=ctx.createBiquadFilter(); fl.type='lowpass'; fl.frequency.setValueAtTime(3800,t); fl.frequency.exponentialRampToValueAtTime(1100,t+0.5);
  var g=ctx.createGain(); g.gain.setValueAtTime(0.0001,t);
  g.gain.exponentialRampToValueAtTime(peak,t+0.005);
  g.gain.setTargetAtTime(peak*0.25,t+0.01,Math.max(0.15,dur*0.6));
  g.gain.setTargetAtTime(0,t+dur,0.05);
  o.connect(fl); fl.connect(g); g.connect(BUS.piano);
  o.start(t); o.stop(t+dur+0.5);
}

/* ---------- band logic ---------- */
function voicing(ch){
  var base=48+absRoot(ch), out=[], v=Q[ch[1]].v;
  for(var i=0;i<v.length;i++){
    var m=base+v[i]; while(m>70) m-=12; while(m<54) m+=12;
    if(out.indexOf(m)<0) out.push(m);
  }
  return out;
}
var lastBass=36;
function bassNear(pc,prev){
  var m=28+(((pc-28)%12)+12)%12, best=m;
  for(; m<=47; m+=12){ if(Math.abs(m-prev)<Math.abs(best-prev)) best=m; }
  return best;
}
function loopBounds(){ return S.loop?[S.loop.lo,S.loop.hi]:[0,S.bars.length-1]; }
function nextChord(bar,seg){
  var cs=S.bars[bar]; if(seg+1<cs.length) return cs[seg+1];
  var b=loopBounds(), nb=bar+1>b[1]?b[0]:bar+1;
  return S.bars[nb][0];
}
function walk(ch,nxt,len){
  var r=absRoot(ch), t=Q[ch[1]].t.map(function(x){return (r+x)%12});
  var out=[], p=lastBass;
  function add(pc){ var m=bassNear(pc,p); out.push(m); p=m; }
  add(r);
  if(len===4){ add(rnd([t[1],t[2]])); add(rnd([t[2],t[3]!==undefined?t[3]:r])); }
  var tr=absRoot(nxt); add((tr+(Math.random()<0.5?1:11))%12);
  lastBass=p; return out;
}
var PAT_SWING=[[0,3],[3],[3,6],[1,5],[0,5],[2,7],[3,5],[0,3,6]];
var CLAVE=[0,1.5,3,5,6];
function makePlan(bar){
  var cs=S.bars[bar], two=cs.length>1, st=S.style, off=(st==='swing')?S.swing:0.5;
  var P={bar:bar,comp:[],bass:[]};
  var pos=function(i){return (i%2)?Math.floor(i/2)+off:i/2};
  var idxs;
  if(st==='swing') idxs=two?rnd([[0,4],[0,3,4],[0,4,7]]):rnd(PAT_SWING);
  else if(st==='bossa') idxs=two?[0,4]:[0,3,4,7];
  else idxs=two?[0,4]:rnd([[0],[0,5]]);
  idxs.forEach(function(i,n){
    var p=pos(i), ci=(two&&p>=2)?1:0, dur, vel=(n===0?0.9:0.7)*(0.9+Math.random()*0.15);
    if(st==='swing') dur=0.45; else if(st==='bossa') dur=0.4;
    else dur=two?1.8:(idxs.length>1?2.4:3.6);
    P.comp.push({pos:p,notes:voicing(cs[ci]),dur:dur,vel:vel});
  });
  cs.forEach(function(ch,seg){
    var base=two?seg*2:0, r=absRoot(ch), f=(r+Q[ch[1]].t[2])%12;
    if(st==='swing'){
      walk(ch,nextChord(bar,seg),two?2:4).forEach(function(m,k){
        P.bass.push({pos:base+k,m:m,dur:0.92,vel:k===0?0.9:0.75});
      });
    }else if(st==='bossa'){
      var ev=two?[[base,r],[base+1.5,f]]:[[0,r],[1.5,f],[2,r],[3.5,f]];
      ev.forEach(function(e){ var m=bassNear(e[1],lastBass); lastBass=m;
        P.bass.push({pos:e[0],m:m,dur:(e[0]%1===0)?1.3:0.4,vel:0.8}); });
    }else{
      var ev2=two?[[base,r]]:[[0,r],[2,rnd([f,r])]];
      ev2.forEach(function(e){ var m=bassNear(e[1],lastBass); lastBass=m;
        P.bass.push({pos:e[0],m:m,dur:1.8,vel:0.8}); });
    }
  });
  return P;
}
function drums(t,bar,beat,spb){
  var st=S.style;
  if(st==='swing'){
    var off=S.swing*spb;
    ride(t,beat===0?0.8:0.62);
    if(beat%2){ ride(t+off,0.4); hatFoot(t,0.6); }
    kick(t,0.11+Math.random()*0.05);
    if(Math.random()<0.2) brush(t+off,0.08,0.3);
  }else if(st==='bossa'){
    hat(t,0.3); hat(t+0.5*spb,0.18);
    if(beat%2===0) kick(t,0.2); else kick(t+0.5*spb,0.14);
    var cyc=(bar%2)*4+beat;
    for(var i=0;i<CLAVE.length;i++){ if(Math.floor(CLAVE[i])===cyc) rim(t+(CLAVE[i]-cyc)*spb,0.6); }
  }else{
    brush(t,0.24,beat%2?0.32:0.22);
    if(beat%2===0) kick(t,0.1); else hatFoot(t,0.4);
  }
}
function playBeat(t,beat,spb){
  var i,e;
  for(i=0;i<plan.comp.length;i++){ e=plan.comp[i];
    if(Math.floor(e.pos)===beat){ var tt=t+(e.pos-beat)*spb;
      for(var n=0;n<e.notes.length;n++) key(e.notes[n],tt+n*0.006,e.dur*spb,e.vel); } }
  for(i=0;i<plan.bass.length;i++){ e=plan.bass[i];
    if(Math.floor(e.pos)===beat) bassNote(e.m,t+(e.pos-beat)*spb,e.dur*spb,e.vel); }
  drums(t,plan.bar,beat,spb);
}

/* ---------- scheduler ---------- */
var timer=null,nextT=0,cur={bar:0,beat:0,chorus:1},plan=null,evQ=[],counting=0,finishing=false,jump=null;
function step(){
  var spb=60/S.tempo;
  if(counting>0){ click(nextT,counting===4); evQ.push({t:nextT,count:5-counting}); counting--; nextT+=spb; return; }
  if(jump!==null){ cur.bar=Math.min(jump,S.bars.length-1); cur.beat=0; jump=null; }
  if(cur.beat===0||!plan||plan.bar!==cur.bar) plan=makePlan(cur.bar);
  evQ.push({t:nextT,bar:cur.bar,beat:cur.beat,chorus:cur.chorus});
  playBeat(nextT,cur.beat,spb);
  nextT+=spb; cur.beat++;
  if(cur.beat>3){
    cur.beat=0; cur.bar++;
    var b=loopBounds();
    if(cur.bar>b[1]){ cur.bar=b[0]; cur.chorus++;
      if(S.choruses&&cur.chorus>S.choruses){ finishing=true; evQ.push({t:nextT,end:true}); } }
  }
}
function pump(){ while(!finishing&&nextT<ctx.currentTime+0.15) step(); }
function start(){
  ensureAudio(); ctx.resume(); newSession();
  cur={bar:Math.min(S.cursor,S.bars.length-1),beat:0,chorus:1};
  jump=null; counting=S.countIn?4:0; finishing=false; evQ.length=0; lastBass=36; plan=null;
  nextT=ctx.currentTime+0.12; S.playing=true;
  timer=setInterval(pump,25); pump(); paintTransport(); paintMarks();
}
function stop(){
  if(!S.playing) return;
  S.playing=false; clearInterval(timer); timer=null; evQ.length=0;
  if(SESS) SESS.gain.setTargetAtTime(0,ctx.currentTime,0.02);
  clearNow(); paintTransport(); paintMarks();
}

/* ---------- UI ---------- */
var chart=$('#chart'),nowEl=null,drag=null,pickStart=null,lastEv=null;
function clearNow(){ if(nowEl){ nowEl.classList.remove('now'); nowEl.removeAttribute('data-beat'); nowEl=null; } }
function setNow(bar,beat){
  var el=chart.children[bar]; if(!el) return;
  if(nowEl&&nowEl!==el){ nowEl.classList.remove('now'); nowEl.removeAttribute('data-beat'); }
  el.classList.add('now'); el.setAttribute('data-beat',beat); nowEl=el;
}
function renderChart(){
  var marks=TUNES[S.ti].marks||{};
  chart.innerHTML=S.bars.map(function(cs,i){
    return '<button type="button" class="bar'+(cs.length>1?' two':'')+'" data-i="'+i+'" aria-label="Bar '+(i+1)+'">'+
      (marks[i]?'<span class="mk">'+marks[i]+'</span>':'')+'<span class="num">'+(i+1)+'</span>'+
      '<span class="chs">'+cs.map(chordHTML).join('')+'</span><span class="dots"><i></i><i></i><i></i><i></i></span></button>';
  }).join('');
  nowEl=null; paintMarks();
}
function paintMarks(){
  var lo=-1,hi=-1; if(drag&&drag.a!==drag.b){ lo=Math.min(drag.a,drag.b); hi=Math.max(drag.a,drag.b); }
  for(var i=0;i<chart.children.length;i++){
    var el=chart.children[i];
    el.classList.toggle('inloop',!!(S.loop&&i>=S.loop.lo&&i<=S.loop.hi));
    el.classList.toggle('cursor',!S.playing&&i===S.cursor);
    el.classList.toggle('sel',i>=lo&&i<=hi);
  }
  $('#clearloop').hidden=!S.loop;
}
function paintTransport(){
  var p=$('#play'); p.classList.toggle('on',S.playing); p.setAttribute('aria-label',S.playing?'Stop':'Play');
}
function setPos(main,sub){ $('#pos').innerHTML=main+'<small>'+sub+'</small>'; }
function writtenKeyName(){ return NOTE[(S.key+OFF[S.inst])%12]; }
function paintMeta(){
  var t=TUNES[S.ti], names={swing:'Swing',bossa:'Bossa',ballad:'Ballad'};
  $('#title').textContent=t.name;
  var s=S.bars.length+' bars · '+names[S.style]+' · concert key '+NOTE[S.key];
  if(S.inst!=='concert') s+=' · you read '+writtenKeyName();
  $('#meta').textContent=s;
  $('#written').textContent=S.inst==='concert'?'Chart is shown at concert pitch.':'Concert '+NOTE[S.key]+' is '+writtenKeyName()+' on your instrument.';
  $('#bpm').innerHTML=S.tempo+'<small>bpm</small>'; $('#tempo').value=S.tempo;
  var kb=$('#keys').children; for(var i=0;i<kb.length;i++) kb[i].setAttribute('aria-pressed',String(i===S.key));
  var ib=$('#inst').children; for(i=0;i<ib.length;i++) ib[i].setAttribute('aria-pressed',String(ib[i].dataset.v===S.inst));
  var fb=$('#feel').children; for(i=0;i<fb.length;i++) fb[i].setAttribute('aria-pressed',String(fb[i].dataset.v===S.style));
  $('#swingrow').hidden=S.style!=='swing';
  $('#swing').value=Math.round(S.swing*100); $('#swingval').textContent=Math.round(S.swing*100)+'%';
  var tb=$('#tunes').children; for(i=0;i<tb.length;i++) tb[i].setAttribute('aria-pressed',String(i===S.ti));
  $('#custom').hidden=!TUNES[S.ti].custom;
  $('#charthint').textContent=S.pick?(pickStart===null?'Tap the first bar of the section to loop.':'Now tap the last bar of the section.'):'Click a bar to start from it. Drag across bars, or hold Shift and click, to loop a section.';
  $('#pick').setAttribute('aria-pressed',String(S.pick));
}
function loadTune(i){
  stop(); var t=TUNES[i]; S.ti=i; S.bars=t.bars; S.key=t.key; S.tempo=t.tempo; S.style=t.style;
  S.loop=null; S.cursor=0; S.pick=false; pickStart=null;
  renderChart(); paintMeta(); setPos('Ready','Space starts and stops');
}
function setLoop(a,b){ S.loop={lo:Math.min(a,b),hi:Math.max(a,b)}; if(!S.playing) S.cursor=S.loop.lo; S.pick=false; pickStart=null; paintMarks(); paintMeta(); }
function jumpTo(i){ if(S.playing) jump=i; else S.cursor=i; paintMarks(); }

/* build static controls */
(function(){
  var tn=$('#tunes');
  TUNES.forEach(function(t,i){
    var b=document.createElement('button'); b.type='button'; b.className='tune';
    b.innerHTML='<b>'+t.name+'</b><span>'+t.form+'</span>';
    b.addEventListener('click',function(){loadTune(i)}); tn.appendChild(b);
  });
  var kb=$('#keys');
  NOTE.forEach(function(n,i){
    var b=document.createElement('button'); b.type='button'; b.textContent=n;
    b.addEventListener('click',function(){S.key=i;renderChart();paintMeta();}); kb.appendChild(b);
  });
  $('#chordtext').value=DEFAULT_TEXT;
})();

$('#inst').addEventListener('click',function(e){var b=e.target.closest('button'); if(!b)return; S.inst=b.dataset.v; save(); renderChart(); paintMeta();});
$('#feel').addEventListener('click',function(e){var b=e.target.closest('button'); if(!b)return; S.style=b.dataset.v; plan=null; paintMeta();});
$('#swing').addEventListener('input',function(e){S.swing=e.target.value/100; paintMeta();});
$('#tempo').addEventListener('input',function(e){S.tempo=+e.target.value; paintMeta();});
$('#slower').addEventListener('click',function(){S.tempo=Math.max(40,S.tempo-4);paintMeta();});
$('#faster').addEventListener('click',function(){S.tempo=Math.min(260,S.tempo+4);paintMeta();});
$('#countin').checked=S.countIn;
$('#countin').addEventListener('change',function(e){S.countIn=e.target.checked;save();});
$('#choruses').value=String(S.choruses);
$('#choruses').addEventListener('change',function(e){S.choruses=+e.target.value;save();});
document.querySelectorAll('[data-vol]').forEach(function(el){
  el.value=S.vol[el.dataset.vol];
  el.addEventListener('input',function(){S.vol[el.dataset.vol]=+el.value;applyMix();save();});
});
document.querySelectorAll('[data-mute]').forEach(function(el){
  var k=el.dataset.mute; el.setAttribute('aria-pressed',String(S.mute[k]));
  el.addEventListener('click',function(){S.mute[k]=!S.mute[k];el.setAttribute('aria-pressed',String(S.mute[k]));applyMix();save();});
});
$('#play').addEventListener('click',function(){ S.playing?stop():start(); });
$('#restart').addEventListener('click',function(){ var lo=S.loop?S.loop.lo:0; if(S.playing) jump=lo; else S.cursor=lo; paintMarks(); });
$('#pick').addEventListener('click',function(){ S.pick=!S.pick; pickStart=null; paintMeta(); });
$('#clearloop').addEventListener('click',function(){ S.loop=null; paintMarks(); paintMeta(); });
$('#applychords').addEventListener('click',function(){
  var r=parseChart($('#chordtext').value);
  if(r.error){ $('#err').textContent=r.error; return; }
  $('#err').textContent='';
  var t=TUNES[TUNES.length-1]; t.bars=r.bars; t.key=r.tonic;
  loadTune(TUNES.length-1);
});

chart.addEventListener('pointerdown',function(e){
  var el=e.target.closest('.bar'); if(!el) return;
  var i=+el.dataset.i; drag={a:i,b:i,shift:e.shiftKey};
});
chart.addEventListener('pointermove',function(e){
  if(!drag) return;
  var el=document.elementFromPoint(e.clientX,e.clientY), b=el&&el.closest?el.closest('.bar'):null;
  if(b&&chart.contains(b)&&+b.dataset.i!==drag.b){ drag.b=+b.dataset.i; paintMarks(); }
});
window.addEventListener('pointerup',function(){
  if(!drag) return; var d=drag; drag=null;
  if(d.a!==d.b){ setLoop(d.a,d.b); return; }
  if(S.pick){
    if(pickStart===null){ pickStart=d.a; paintMeta(); paintMarks(); }
    else setLoop(pickStart,d.a);
    return;
  }
  if(d.shift){ setLoop(S.cursor,d.a); return; }
  jumpTo(d.a);
});
window.addEventListener('pointercancel',function(){ drag=null; paintMarks(); });
window.addEventListener('keydown',function(e){
  var tag=(e.target.tagName||'').toLowerCase();
  if(tag==='textarea'||tag==='input'||tag==='select') return;
  if(e.code==='Space'){ e.preventDefault(); S.playing?stop():start(); }
  else if(e.code==='ArrowUp'){ e.preventDefault(); S.tempo=Math.min(260,S.tempo+2); paintMeta(); }
  else if(e.code==='ArrowDown'){ e.preventDefault(); S.tempo=Math.max(40,S.tempo-2); paintMeta(); }
});

function frame(){
  if(S.playing&&ctx){
    var now=ctx.currentTime, ev=null;
    while(evQ.length&&evQ[0].t<=now){ ev=evQ.shift(); if(ev.end){ stop(); S.cursor=S.loop?S.loop.lo:0; paintMarks(); setPos('Done','Press play to go again'); ev=null; break; } lastEv=ev; }
    if(S.playing&&ev){
      if(ev.count){ setPos('Count-in '+ev.count,'Get ready'); }
      else{
        setNow(ev.bar,ev.beat);
        setPos('Bar '+(ev.bar+1)+' of '+S.bars.length,'Chorus '+ev.chorus+(S.choruses?' of '+S.choruses:'')+' · beat '+(ev.beat+1));
      }
    }
  }
  requestAnimationFrame(frame);
}
var LOOKS=[
  {id:'system',name:'System',sw:['#E8ECEF','#1F4FFF','#0D1318']},
  {id:'midnight',name:'Midnight',sw:['#0A1030','#4DA3FF','#FFC53D']},
  {id:'smoky',name:'Smoky club',sw:['#17110D','#E8A23A','#FF7A59']},
  {id:'forest',name:'Forest',sw:['#0E1A14','#5BD68A','#FFD166']},
  {id:'paper',name:'Chart paper',sw:['#ECE8DC','#8A2BE2','#FFD84D']},
  {id:'contrast',name:'High contrast',sw:['#000000','#FFEB3B','#FFFFFF']}
];
function applyLook(){
  var root=document.documentElement;
  if(S.look==='system') root.removeAttribute('data-look'); else root.setAttribute('data-look',S.look);
  var bs=$('#looks').children; for(var i=0;i<bs.length;i++) bs[i].setAttribute('aria-pressed',String(LOOKS[i].id===S.look));
}
(function(){
  if(!LOOKS.some(function(l){return l.id===S.look})) S.look='system';
  var box=$('#looks');
  LOOKS.forEach(function(l){
    var b=document.createElement('button'); b.type='button'; b.className='look';
    b.innerHTML='<span class="sw"><i style="background:'+l.sw[0]+'"></i><i style="background:'+l.sw[1]+'"></i><i style="background:'+l.sw[2]+'"></i></span><span class="nm">'+l.name+'</span>';
    b.addEventListener('click',function(){S.look=l.id;save();applyLook();}); box.appendChild(b);
  });
  applyLook();
})();
loadTune(0);
paintTransport();
requestAnimationFrame(frame);
})();
