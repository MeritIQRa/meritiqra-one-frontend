const assert=require('node:assert/strict'),fs=require('fs'),ts=require('typescript');
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,p);
const {attendanceTable}=require('../app/attendance-report-data.ts');
const rows={students:[{id:'s',name:'Meera',admissionNumber:'001'}],classes:[{id:'c',name:'NEET',section:'G-1'}]};const entries=['PRESENT','ABSENT','LATE','EXCUSED','NOT_MARKED'].map((status,i)=>({studentId:'s',classId:'c',date:'2026-11-0'+(i+1),session:'DAILY',status}));
let t=attendanceTable(entries,rows,{status:'',search:'001',view:'student'});assert.equal(t.entries,5);assert.equal(t.rows[0].at(-1),'66.7');assert.equal(t.rows[0][1],'001');
t=attendanceTable(entries,rows,{status:'ABSENT',search:'meera',view:'detail'});assert.equal(t.entries,1);assert.equal(t.rows[0][5],'ABSENT');
assert.equal(attendanceTable(entries,rows,{status:'',search:'no match',view:'class'}).rows.length,0);
assert.equal(attendanceTable(entries.filter(e=>e.status==='EXCUSED'),rows,{status:'',search:'',view:'student'}).rows[0].at(-1),'N/A');
console.log('PASS attendance reports: search, status filter, leading-zero admissions, session denominator and empty results.');
