'use strict';
const $=id=>document.getElementById(id), KEY='gb-edulaw-checks-v02';
let category='전체', current=null, state={};
try{const saved=JSON.parse(localStorage.getItem(KEY)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))state=saved;}catch{$('storage-status').textContent='브라우저 저장소를 사용할 수 없어 이번 화면에서만 체크합니다.';}
function say(text){$('message').textContent=text;}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{$('storage-status').textContent='체크 저장에 실패했습니다. 이번 화면에서만 유지됩니다.';}}
function catalog(){const rows=findWorkflows($('search').value,category);$('cards').replaceChildren();$('count').textContent=`${rows.length}개 업무`;for(const w of rows){const b=document.createElement('button');b.className='card';b.innerHTML=`<span class="card-number">${w.icon} <span>↗</span></span><small>${w.category}</small><h3>${w.title}</h3><p>${w.summary}</p><span class="card-bottom">검토 시작하기 →</span>`;b.onclick=()=>openWorkflow(w);$('cards').append(b);}if(!rows.length){const p=document.createElement('p');p.textContent='일치하는 업무가 없습니다. 질병휴직, 명예퇴직, 징계, 학교폭력, 안전사고, 운영위원회로 검색해 보세요.';$('cards').append(p);}}
function renderChecks(){const w=current;$('checks').replaceChildren();w.checks.forEach((t,i)=>{const l=document.createElement('label');l.className='check';const input=document.createElement('input');input.type='checkbox';input.checked=state[`${w.id}:${i}`]===true;input.onchange=()=>{state[`${w.id}:${i}`]=input.checked;persist();progress();};l.append(input,document.createTextNode(t));$('checks').append(l);});progress();}
function progress(){$('progress').textContent=`${current.checks.filter((_,i)=>state[`${current.id}:${i}`]===true).length} / ${current.checks.length} 완료`;}
function openWorkflow(w){current=w;$('catalog').hidden=true;$('detail').hidden=false;$('detail-title').textContent=w.title;$('detail-category').textContent=w.category;$('detail-summary').textContent=w.summary;$('steps').replaceChildren(...w.steps.map(t=>{const li=document.createElement('li');li.textContent=t;return li;}));$('draft').value=`[검토용 예시 · 공식 검증 전]\n${w.title} 검토 메모\n\n1. 검토 목적\n[개인정보 없이 작성]\n\n2. 확인된 사항\n[확인 내용]\n\n3. 공식 근거 확인\n- 자료명: [확인 필요]\n- 조문 / 시행일: [확인 필요]\n- 원문 주소 / 확인일: [확인 필요]\n\n4. 담당 부서 확인사항\n[질의 및 확인 내용]\n\n5. 후속 검토\n[담당자 역할 / 일정]\n\n※ AI 생성 문서가 아닌 고정 서식입니다. 실제 공문으로 사용하기 전 검토하세요.`;renderChecks();$('detail-title').focus();}
$('search-form').onsubmit=e=>{e.preventDefault();$('detail').hidden=true;$('catalog').hidden=false;catalog();};
$('search').oninput=()=>{if(!$('catalog').hidden)catalog();};
document.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{category=b.dataset.category;document.querySelectorAll('[data-category]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('detail').hidden=true;$('catalog').hidden=false;catalog();});
$('back').onclick=()=>{$('detail').hidden=true;$('catalog').hidden=false;catalog();$('search').focus();};
$('reset').onclick=()=>{current.checks.forEach((_,i)=>delete state[`${current.id}:${i}`]);persist();renderChecks();};
$('clear').onclick=()=>{if(!confirm('모든 업무의 체크 상태를 삭제할까요?'))return;state={};persist();if(current)renderChecks();say('저장된 체크를 삭제했습니다.');};
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText($('draft').value);say('초안을 복사했습니다.');}catch{$('draft').focus();$('draft').select();say('자동 복사가 지원되지 않습니다. 선택된 초안을 ⌘C 또는 Ctrl+C로 복사하세요.');}};
$('download').onclick=()=>{const url=URL.createObjectURL(new Blob(['\ufeff'+$('draft').value],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`${current.title}-검토메모.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);say('초안 내려받기를 요청했습니다.');};
$('print').onclick=()=>{let p=document.getElementById('print-draft');if(!p){p=document.createElement('pre');p.id='print-draft';$('detail').append(p);}p.textContent=$('draft').value;window.print();};
catalog();
