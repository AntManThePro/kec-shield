const N={g:'#00ff87',c:'#60efff',p:'#ff0080',y:'#ffcc00',k:'#050812'};
const CATS={
  attendance:{name:'Attendance Violations',risk:'HIGH',color:N.p,docs:['Attendance records','Written warnings','Policy acknowledgment'],examples:['Excessive tardiness','No-call/no-show','Unexcused absence','Left early without auth']},
  insubordination:{name:'Insubordination',risk:'CRITICAL',color:N.p,docs:['Witness statements','Written warnings','Incident details'],examples:['Refused direct instruction','Disrespectful conduct','Hung up on manager']},
  safety:{name:'Safety Violations',risk:'CRITICAL',color:N.y,docs:['Safety policies','Training records','Photos/videos','Witness statements'],examples:['No PPE used','Unsafe ladder use','Chemical violation','Equipment misuse']},
  jobAbandon:{name:'Job Abandonment',risk:'CRITICAL',color:N.p,docs:['Communication logs','Schedule records','Attendance records'],examples:['Stopped reporting','Missed multiple shifts','No response to contact']},
  policy:{name:'Policy Violations',risk:'HIGH',color:N.c,docs:['Written policies','Signed acknowledgments','Prior warnings'],examples:['Procedure failure','Improper checkout','Missing reports','Unauthorized asset use']},
  dishonesty:{name:'Theft or Dishonesty',risk:'CRITICAL',color:N.p,docs:['Investigation records','Witness statements','Photos/videos','Receipts'],examples:['Theft','Falsified records','Timecard fraud','Expense fraud']},
  harassment:{name:'Harassment or Conduct',risk:'CRITICAL',color:N.p,docs:['Complaints','Investigation','Witness statements'],examples:['Threats','Harassment','Fighting','Discrimination']},
  drug:{name:'Drug or Alcohol',risk:'CRITICAL',color:N.y,docs:['Written policy','Test results','Chain-of-custody'],examples:['Positive test','Refusal to test','Possession at work','Working impaired']},
  performance:{name:'Excessive Performance Issues',risk:'MEDIUM',color:N.c,docs:['Performance records','Coaching sessions','Prior warnings'],examples:['Repeated mistakes','Failed to meet standards','Low productivity']},
  voluntary:{name:'Voluntary Quit',risk:'MEDIUM',color:N.g,docs:['Resignation letter','Offered accommodations','Work availability docs'],examples:['Unsafe complaint','Medical','Family emergency','Hours reduced']}
};
function load(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}}
function save(k,v){localStorage.setItem(k,JSON.stringify(v))}
let incidents=load('kec_incidents',[]);
let crews=load('kec_crews',['Crew A','Crew B','Crew C','Crew D']);
function blank(){const n=new Date();return{date:n.toISOString().slice(0,10),time:n.toTimeString().slice(0,5),category:'attendance',crew:crews[0]||'Crew A',employee:'',description:'',witnesses:'',evidence:[]}}
const S={tab:'dash',q:'',open:null,log:false,form:blank(),pending:null};
function score(inc){const cat=CATS[inc.category];const req=cat.docs.length;const got=cat.docs.filter(d=>inc.docStatus&&inc.docStatus[d]).length;return{got,req,pct:req?Math.round(got/req*100):0}}
function ready(){if(!incidents.length)return 0;return Math.round(incidents.reduce((a,i)=>a+score(i).pct,0)/incidents.length)}
function ping(msg,err){const t=document.getElementById('toast');t.textContent=msg;t.className='toast'+(err?' err':'');clearTimeout(t._x);t._x=setTimeout(()=>t.classList.add('hidden'),2600)}
function download(name,text,mime){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:mime||'text/plain'}));a.download=name;a.click();URL.revokeObjectURL(a.href)}
function esc(s){return String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function render(){
  document.getElementById('readyHead').textContent='READINESS '+ready()+'%';
  document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.tab===S.tab&&!S.log&&!S.open));
  const app=document.getElementById('app');
  if(S.log){app.innerHTML=logger();bindLogger();return}
  if(S.open){app.innerHTML=details();bindDetails();return}
  if(S.tab==='cats'){app.innerHTML=cats();return}
  if(S.tab==='sys'){app.innerHTML=sys();bindSys();return}
  app.innerHTML=dash();bindDash();
}
function dash(){
  const today=new Date();
  const stats={total:incidents.length,critical:incidents.filter(i=>CATS[i.category]?.risk==='CRITICAL').length,week:incidents.filter(i=>(today-new Date(i.date))/86400000<=7).length,docs:incidents.filter(i=>Object.values(i.docStatus||{}).some(Boolean)).length,ready:ready()};
  const q=S.q.trim().toLowerCase();
  const list=incidents.filter(i=>!q||[i.employee,i.crew,i.description,CATS[i.category]?.name].join(' ').toLowerCase().includes(q));
  const counts=Object.fromEntries(Object.keys(CATS).map(k=>[k,list.filter(i=>i.category===k).length]));
  const max=Math.max(1,...Object.values(counts));
  return `<div class="grid stats">${[['Total Incidents',stats.total,N.c],['Critical Risk',stats.critical,N.p],['This Week',stats.week,N.y],['Documented',stats.docs,N.g],['Readiness',stats.ready+'%',N.g]].map(([l,v,c])=>`<div class="card" style="border-color:${c}"><div class="lbl" style="color:${c}">${l}</div><div class="num" style="color:${c}">${v}</div></div>`).join('')}</div><div style="margin:16px 0"><input id="q" placeholder="Search employee, crew, category..." value="${esc(S.q)}"></div><div class="card"><div style="color:var(--g);font-weight:800;margin-bottom:10px">INCIDENTS BY CATEGORY</div>${Object.entries(counts).map(([k,n])=>`<div class="row"><span>${esc(CATS[k].name)}</span><div class="row" style="margin:0"><div class="bar"><i style="width:${n/max*100}%;background:${CATS[k].color}"></i></div><b style="color:${CATS[k].color};width:18px;text-align:right">${n}</b></div></div>`).join('')}</div><h3 style="color:var(--g)">RECENT INCIDENTS</h3><div class="list">${list.length?list.slice(0,20).map(i=>{const cat=CATS[i.category],sc=score(i);return `<button class="inc" data-id="${i.id}" style="border-color:${cat.color};background:${cat.color}14"><div class="row" style="margin:0"><div><b style="color:${cat.color}">${esc(cat.name)}</b><div style="font-size:12px">${esc(i.employee)} • ${esc(i.date)} • ${esc(i.crew)} • docs ${sc.got}/${sc.req}</div></div><span style="color:var(--y);font-size:11px">${cat.risk}</span></div></button>`}).join(''):'<p>No incidents in the packet yet. Log the first one before memory fades.</p>'}</div><button class="btn btn-g" id="newInc" style="width:100%;margin-top:16px">+ NEW INCIDENT</button>`;
}
function logger(){
  const cat=CATS[S.form.category];
  return `<h2 style="color:var(--g)">INCIDENT DOCUMENTATION</h2><div class="grid two"><label><span>INCIDENT CATEGORY</span><select id="fCat">${Object.entries(CATS).map(([k,v])=>`<option value="${k}" ${S.form.category===k?'selected':''}>${esc(v.name)}</option>`).join('')}</select></label><label><span>CREW</span><select id="fCrew">${crews.map(c=>`<option ${S.form.crew===c?'selected':''}>${esc(c)}</option>`).join('')}</select></label><label><span>DATE</span><input type="date" id="fDate" value="${S.form.date}"></label><label><span>TIME</span><input type="time" id="fTime" value="${S.form.time}"></label></div><label><span>EMPLOYEE NAME</span><input id="fEmp" value="${esc(S.form.employee)}" placeholder="Full name"></label><label><span>INCIDENT DESCRIPTION</span><textarea id="fDesc" placeholder="Detailed description of what happened...">${esc(S.form.description)}</textarea></label><label><span>WITNESSES (OPTIONAL)</span><input id="fWit" value="${esc(S.form.witnesses)}" placeholder="Names, comma-separated"></label><div class="card" style="border-color:${cat.color}"><b style="color:${cat.color}">${esc(cat.name).toUpperCase()} — Risk ${cat.risk}</b><div style="margin-top:8px;font-size:12px">Documentation Required:<br>${cat.docs.map(d=>'• '+esc(d)).join('<br>')}</div><div style="margin-top:8px;font-size:12px;color:var(--y)">Examples:<br>${cat.examples.map(d=>'• '+esc(d)).join('<br>')}</div></div><div class="row"><button class="btn btn-g" id="saveInc" style="flex:1">LOG INCIDENT</button><button class="btn btn-ghost" id="cancelLog" style="flex:1">CANCEL</button></div>`;
}
function details(){
  const inc=incidents.find(i=>i.id===S.open); if(!inc) return '';
  const cat=CATS[inc.category], sc=score(inc);
  return `<button class="btn btn-ghost" id="back">← Back to list</button><div class="card" style="border-color:${cat.color};margin-top:12px"><div class="row"><div><b style="color:${cat.color}">${esc(cat.name)}</b><div style="font-size:12px;margin-top:8px">Employee: <span style="color:var(--g)">${esc(inc.employee)}</span><br>Crew: <span style="color:var(--g)">${esc(inc.crew)}</span><br>Date/Time: <span style="color:var(--g)">${esc(inc.date)} ${esc(inc.time)}</span><br>Docs ready: <span style="color:var(--y)">${sc.pct}%</span></div></div><span class="btn" style="background:${cat.color};color:var(--k);padding:6px 10px">${cat.risk}</span></div></div><h3 style="color:var(--g)">DESCRIPTION</h3><div class="card">${esc(inc.description)}</div>${inc.witnesses?`<h3 style="color:var(--g)">WITNESSES</h3><p>${esc(inc.witnesses)}</p>`:''}<h3 style="color:var(--g)">DOCUMENTATION STATUS</h3>${cat.docs.map(d=>{const on=!!(inc.docStatus&&inc.docStatus[d]);return `<div class="row card" style="border-color:${on?N.g:N.c}"><span>${esc(d)}</span><button class="btn ${on?'btn-g':'btn-p'}" data-doc="${esc(d)}">${on?'DONE':'NEED'}</button></div>`}).join('')}<button class="btn btn-p" id="delInc" style="width:100%;margin-top:16px">DELETE INCIDENT</button>`;
}
function cats(){
  return `<h2 style="color:var(--g)">TWC VIOLATION CATEGORIES & DEFENSE GUIDE</h2>${Object.values(CATS).map(cat=>`<details style="border:1px solid ${cat.color};background:${cat.color}14"><summary><b style="color:${cat.color}">${esc(cat.name)}</b> <span style="color:var(--y);font-size:12px">Risk: ${cat.risk}</span></summary><div style="font-size:12px;margin-top:10px"><b style="color:var(--g)">DOCUMENTATION REQUIRED</b><br>${cat.docs.map(d=>'✓ '+esc(d)).join('<br>')}</div><div style="font-size:12px;margin-top:10px"><b style="color:var(--g)">COMMON EXAMPLES</b><br>${cat.examples.map(d=>'• '+esc(d)).join('<br>')}</div><div class="card" style="margin-top:10px;border-left:3px solid ${cat.color}">Defense Strategy: Document immediately. Get witness statements in writing. Enforce the same rule across every crew. Keep signed policies on file.</div></details>`).join('')}<div class="card" style="border-color:var(--g);margin-top:16px"><b style="color:var(--g)">TOP 5 WAYS TO WIN AT TWC</b><ol style="font-size:12px"><li>Clear written policy — signed by employee</li><li>Employee signed acknowledgment — keep on file</li><li>Prior warnings documented — per policy</li><li>Consistent enforcement — same rules for all crews</li><li>Detailed incident documentation — date, time, witnesses, description</li></ol><p style="font-size:11px;opacity:.8">Operations aid. Not legal advice.</p></div>`;
}
function sys(){
  return `<h2 style="color:var(--g)">SYSTEM / CREWS / BACKUP</h2><p>Data lives in this browser only. Export a JSON backup before you wipe a device.</p><div class="card">${crews.map(c=>`<div class="row"><span>${esc(c)}</span><button class="btn btn-p" data-rm="${esc(c)}" ${crews.length===1?'disabled':''}>remove</button></div>`).join('')}<div class="row"><input id="newCrew" placeholder="New crew name"><button class="btn btn-g" id="addCrew">ADD</button></div></div><div class="grid two" style="margin-top:12px"><button class="btn btn-c" id="expJson">EXPORT JSON BACKUP</button><button class="btn btn-ghost" id="impJson">IMPORT JSON BACKUP</button></div><input id="impFile" type="file" accept="application/json" class="hidden">`;
}
function bindDash(){
  document.getElementById('q').oninput=e=>{S.q=e.target.value;render()};
  document.getElementById('newInc').onclick=()=>{S.form=blank();S.log=true;render()};
  document.querySelectorAll('.inc').forEach(b=>b.onclick=()=>{S.open=Number(b.dataset.id);render()});
}
function grabForm(){S.form={...S.form,category:fCat.value,crew:fCrew.value,date:fDate.value,time:fTime.value,employee:fEmp.value,description:fDesc.value,witnesses:fWit.value}}
function bindLogger(){
  ['fCat','fCrew','fDate','fTime','fEmp','fDesc','fWit'].forEach(id=>document.getElementById(id).onchange=grabForm);
  fCat.onchange=()=>{grabForm();render()};
  saveInc.onclick=()=>{
    grabForm();
    if(!S.form.employee.trim()||!S.form.description.trim()){ping('Employee name and description required',1);return}
    const cat=CATS[S.form.category];
    incidents=[{id:Date.now(),...S.form,employee:S.form.employee.trim(),description:S.form.description.trim(),docStatus:Object.fromEntries(cat.docs.map(d=>[d,false]))},...incidents];
    save('kec_incidents',incidents);S.log=false;S.tab='dash';ping('Incident locked into the packet');render();
  };
  cancelLog.onclick=()=>{S.log=false;render()};
}
function bindDetails(){
  back.onclick=()=>{S.open=null;render()};
  document.querySelectorAll('[data-doc]').forEach(b=>b.onclick=()=>{
    incidents=incidents.map(i=>i.id!==S.open?i:{...i,docStatus:{...i.docStatus,[b.dataset.doc]:!i.docStatus?.[b.dataset.doc]}});
    save('kec_incidents',incidents);render();
  });
  delInc.onclick=()=>{if(!confirm('Delete incident? This cannot be undone.'))return;incidents=incidents.filter(i=>i.id!==S.open);save('kec_incidents',incidents);S.open=null;ping('Incident purged');render()};
}
function bindSys(){
  addCrew.onclick=()=>{const n=newCrew.value.trim();if(!n)return;if(crews.includes(n)){ping('Crew already exists',1);return}crews=[...crews,n];save('kec_crews',crews);newCrew.value='';ping('Crew '+n+' online');render()};
  document.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{crews=crews.filter(c=>c!==b.dataset.rm);save('kec_crews',crews);render()});
  expJson.onclick=()=>{download('kec-shield-backup.json',JSON.stringify({version:1,exportedAt:new Date().toISOString(),crews,incidents},null,2),'application/json');ping('JSON backup downloaded')};
  impJson.onclick=()=>impFile.click();
  impFile.onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(!Array.isArray(d.incidents))throw 0;incidents=d.incidents;if(Array.isArray(d.crews)&&d.crews.length)crews=d.crews;save('kec_incidents',incidents);save('kec_crews',crews);ping('Imported '+incidents.length+' incidents');render()}catch{ping('Backup file unreadable',1)}};r.readAsText(f)};
}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{S.tab=b.dataset.tab;S.log=false;S.open=null;render()});
exportTxt.onclick=()=>{
  const body=incidents.map(inc=>{const cat=CATS[inc.category],sc=score(inc);return `INCIDENT #${inc.id}\nDate: ${inc.date} Time: ${inc.time}\nCategory: ${cat.name}\nRisk: ${cat.risk}\nEmployee: ${inc.employee}\nCrew: ${inc.crew}\nDescription: ${inc.description}\nWitnesses: ${inc.witnesses||'None documented'}\nDocumentation: ${sc.got}/${sc.req} (${sc.pct}%)\n--------------------------------`}).join('\n\n');
  download('TWC_Report.txt',`KEC SHIELD /// TWC DEFENSE PACKET\nGenerated: ${new Date().toISOString()}\nIncidents: ${incidents.length}\nThis packet is an operations aid. It is not legal advice.\n================================================\n\n${body||'No incidents logged.'}\n`);
  ping('TWC packet exported');
};
(function particles(){
  const c=document.getElementById('fx'),x=c.getContext('2d');
  const ps=Array.from({length:40},()=>({x:Math.random(),y:Math.random(),vx:(Math.random()-.5)*0.0004,vy:-0.0002-Math.random()*0.0004,r:.7+Math.random()*1.6,c:[N.g,N.c,N.p,N.y][Math.floor(Math.random()*4)]}));
  function rs(){c.width=innerWidth*devicePixelRatio;c.height=innerHeight*devicePixelRatio}
  addEventListener('resize',rs);rs();
  (function tick(){x.clearRect(0,0,c.width,c.height);ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.y<0)p.y=1;if(p.x<0)p.x=1;if(p.x>1)p.x=0;x.beginPath();x.fillStyle=p.c;x.shadowBlur=10;x.shadowColor=p.c;x.arc(p.x*c.width,p.y*c.height,p.r*devicePixelRatio,0,Math.PI*2);x.fill()});requestAnimationFrame(tick)})();
})();
render();
