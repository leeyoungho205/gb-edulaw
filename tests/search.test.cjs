const {test}=require('node:test');
const assert=require('node:assert/strict');
const {WORKFLOWS,findWorkflows}=require('../docs/data.js');
test('all six workflows and distinct IDs',()=>{assert.equal(WORKFLOWS.length,6);assert.equal(new Set(WORKFLOWS.map(w=>w.id)).size,6);});
test('Korean sentence and aliases',()=>{assert.deepEqual(findWorkflows('교사가 질병휴직을 신청했어요').map(w=>w.id),['leave']);assert.equal(findWorkflows('학폭')[0].id,'violence');assert.equal(findWorkflows('명퇴')[0].id,'retirement');});
test('category and empty search',()=>{assert.equal(findWorkflows('','교원 인사').length,3);assert.equal(findWorkflows('휴직','학생 안전').length,0);assert.equal(findWorkflows('  ').length,6);});
test('unknown and markup input does not match',()=>{assert.equal(findWorkflows('급식예산').length,0);assert.equal(findWorkflows('<script>alert(1)</script>').length,0);});
test('original workflow-specific drafts and reference laws survive integration',()=>{
 const fs=require('node:fs'),vm=require('node:vm');
 const html=fs.readFileSync(require('node:path').join(__dirname,'../archive/v0.1/index.html'),'utf8');
 const literal=html.slice(html.indexOf('const data=')+11,html.indexOf('\nconst cats=')).replace(/;\s*$/,'');
 const original=vm.runInNewContext('('+literal+')',{}, {timeout:1000});
 for(const w of WORKFLOWS){const old=original.find(o=>o.id===(w.id==='retirement'?'retire':w.id));assert.equal(w.draft,old.draft);assert.deepEqual(w.laws,Array.from(old.laws));for(const k of old.keys)assert.ok(w.keywords.includes(k));}
});
