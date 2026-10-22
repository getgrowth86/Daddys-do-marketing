(function(){
var C=window.CONFIG||{};
var $=function(s){return document.querySelector(s)};
function nowB(){return new Date(new Date().toLocaleString('en-US',{timeZone:'Europe/Berlin'}))}
function next(){var n=nowB(),t=new Date(n);t.setHours(C.hour,C.minute,0,0);var add=(C.weekday-n.getDay()+7)%7;t.setDate(n.getDate()+add);if(t<=n)t.setDate(t.getDate()+7);return t}
var days=['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];
var mon=['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
function hh(){return String(C.hour).padStart(2,'0')+':'+String(C.minute).padStart(2,'0')}
window.nextSession=next;
var wd=$('#wd');if(wd)wd.textContent=days[C.weekday].toUpperCase();
var tm=$('#tm');if(tm)tm.textContent=hh();
var seats=$('#seats');if(seats)seats.textContent=C.seats;
var bonus=$('#bonus');if(bonus){if(C.bonus){bonus.querySelector('span').textContent=C.bonus}else{bonus.classList.add('hide')}}
var tu=$('#tuev');if(tu&&C.tuev&&C.tuev.image){tu.querySelector('img').src=C.tuev.image;tu.querySelector('p').textContent=C.tuev.caption||'';tu.classList.remove('hide')}
var res=$('#results');if(res&&C.results&&C.results.length){var car=res.querySelector('.car');C.results.forEach(function(u){var i=new Image();i.src=u;i.loading='lazy';i.alt='Ergebnis eines Teilnehmers';car.appendChild(i)});res.classList.remove('hide')}
var pc=$('#podcast');if(pc&&C.podcastUrl){pc.href=C.podcastUrl;pc.classList.remove('hide')}
var nb=$('#nickbio');if(nb&&C.nickBio)nb.textContent=C.nickBio;
function tick(){var t=next(),d=t-nowB();if(d<0)d=0;var s=Math.floor(d/1000),p=function(x){return String(x).padStart(2,'0')};var e=$('#cd');if(e){e.querySelector('[data-d]').textContent=p(Math.floor(s/86400));e.querySelector('[data-h]').textContent=p(Math.floor(s%86400/3600));e.querySelector('[data-m]').textContent=p(Math.floor(s%3600/60));e.querySelector('[data-s]').textContent=p(s%60)}var w=$('#when');if(w)w.textContent=days[t.getDay()]+', '+t.getDate()+'. '+mon[t.getMonth()]+' · '+hh()+' Uhr'}
if($('#cd')){tick();setInterval(tick,1000)}
document.querySelectorAll('[data-go]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();var f=$('#form');f.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(function(){var i=f.querySelector('input,textarea');i&&i.focus({preventScroll:true})},500)})});
var form=$('#form');if(!form)return;
/* A/B/C Headline Test */
var AB={variant:'A',preview:false,track:function(){}};window.AB=AB;
var h1=$('#h1');
if(h1){
var st={g:function(k){try{return localStorage.getItem(k)}catch(e){return null}},s:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
var vid=st.g('vid');if(!vid){vid=Math.random().toString(36).slice(2)+Date.now().toString(36);st.s('vid',vid)}
var forced=new URLSearchParams(location.search).get('ab');
var esc=function(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/[*](.+?)[*]/g,'<u>$1</u>')};
var pick=function(w){var ks=['A','B','C'],sum=0,i;for(i=0;i<3;i++)sum+=Number(w[ks[i]])||0;if(!sum)return 'A';var r=Math.random()*sum,a=0;for(i=0;i<3;i++){a+=Number(w[ks[i]])||0;if(r<a)return ks[i]}return 'A'};
var go=function(cfg){var w=cfg.weights||{},hl=cfg.headlines||{};var v=(forced&&hl[forced])?forced:st.g('ab_variant');if(!v||!hl[v]||(!forced&&!(Number(w[v])>0)))v=pick(w);if(!forced)st.s('ab_variant',v);AB.variant=v;AB.preview=!!forced;if(hl[v])h1.innerHTML=esc(hl[v]);document.documentElement.classList.remove('ab-wait');AB.track=function(t){if(AB.preview)return;var b=JSON.stringify({v:v,t:t,vid:vid});try{if(navigator.sendBeacon&&navigator.sendBeacon('/api/track',new Blob([b],{type:'application/json'})))return}catch(e){}try{fetch('/api/track',{method:'POST',headers:{'Content-Type':'application/json'},body:b,keepalive:true})}catch(e){}};if(st.g('ab_seen')!==v){st.s('ab_seen',v);AB.track('view')}};
var done=false,fin=function(c){if(!done){done=true;go(c)}};var base=C.ab||{weights:{A:100},headlines:{}};
var ctl=window.AbortController?new AbortController():null;var to=setTimeout(function(){if(ctl)ctl.abort();fin(base)},600);
fetch('/api/config',ctl?{signal:ctl.signal}:{}).then(function(r){return r.json()}).then(function(c){clearTimeout(to);fin({weights:c.weights||base.weights,headlines:Object.assign({},base.headlines,c.headlines)})},function(){clearTimeout(to);fin(base)});
}
var step=1,steps=form.querySelectorAll('.s'),bar=form.querySelector('.bar i'),lab=form.querySelector('.step-l'),btn=form.querySelector('.btn'),q=new URLSearchParams(location.search);
function show(){steps.forEach(function(s,i){s.classList.toggle('hide',i!==step-1)});bar.style.width=(step*33.3)+'%';lab.textContent='SCHRITT '+step+' VON 3';btn.textContent=step<3?'Weiter →':'Platz in der Sprechstunde sichern';var f=steps[step-1].querySelector('input,textarea');if(f&&step>1)setTimeout(function(){f.focus({preventScroll:true})},50)}
function err(m){steps[step-1].querySelector('.err').textContent=m||''}
function ok(){var v=steps[step-1].querySelector('input,textarea').value.trim();if(step===1&&v.length<2){err('Bitte gib deinen Vornamen ein.');return false}if(step===2&&!/^[^ @]+@[^ @]+[.][^ @]{2,}$/.test(v)){err('Bitte gib eine gültige E-Mail Adresse ein.');return false}err('');return true}
form.addEventListener('submit',function(e){e.preventDefault();if(!ok())return;if(step<3){step++;show();return}
btn.disabled=true;btn.textContent='Einen Moment …';var t=next(),p=function(x){return String(x).padStart(2,'0')};
var data={vorname:form.vorname.value.trim(),email:form.email.value.trim(),wachstumsproblem:form.problem.value.trim(),variant:AB.variant,session:t.getFullYear()+'-'+p(t.getMonth()+1)+'-'+p(t.getDate())+' '+hh(),utm_source:q.get('utm_source')||'',utm_medium:q.get('utm_medium')||'',utm_campaign:q.get('utm_campaign')||'',utm_content:q.get('utm_content')||''};
try{sessionStorage.setItem('vorname',data.vorname)}catch(x){}
AB.track('lead');
var done=false,fin=function(){if(done)return;done=true;if(window.fbq)try{fbq('track','Lead',{variant:AB.variant})}catch(x){}location.href='/danke'};
setTimeout(fin,4000);
fetch('/api/anmeldung',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),keepalive:true}).then(fin,fin)});
show();
})();
