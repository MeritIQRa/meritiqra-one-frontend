const {JSDOM}=require('jsdom');
const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'http://localhost'});
global.window=dom.window;global.document=dom.window.document;global.HTMLElement=dom.window.HTMLElement;Object.defineProperty(global,'navigator',{value:dom.window.navigator,configurable:true});global.IS_REACT_ACT_ENVIRONMENT=true;
const React=require('react'),{render,screen,fireEvent,waitFor,cleanup}=require('@testing-library/react'),assert=require('node:assert/strict'),fs=require('fs'),ts=require('typescript');
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(module,path)=>module._compile(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020}}).outputText,path);
const Component=require('../app/academic-entry.tsx').AcademicEntry;
const base={schools:[{id:'s',name:'Westbridge'}],years:[{id:'y',schoolId:'s',name:'2026-27'}],classes:[{id:'c',schoolId:'s',yearId:'y',name:'Class X',section:'A'}],students:[{id:'a',schoolId:'s',classId:'c',name:'Aarav',admissionNumber:'001'},{id:'b',schoolId:'s',classId:'c',name:'Meera',admissionNumber:'002'}],subjects:[{id:'math',schoolId:'s',yearId:'y',name:'Mathematics'}],'exam-requests':[{id:'e',schoolId:'s',yearId:'y',academicYear:'2026-27',classId:'c',title:'Annual',examType:'Annual Examination',mode:'OFFLINE'}],'exam-results':[]};
function select(){for(const [label,v] of [['1. Academic year','y'],['2. Class / section','c'],['3. Examination','e'],['4. Subject','math']])fireEvent.change(screen.getByLabelText(label),{target:{value:v}});}
(async()=>{
 let calls=[];render(React.createElement(Component,{rows:base,role:'TEACHER',request:async(p,o)=>{calls.push({p,...JSON.parse(o.body)});},onSaved:async()=>{}}));select();
 assert.equal(screen.queryByText('Publish register'),null);
 fireEvent.change(screen.getByLabelText('Marks for Aarav'),{target:{value:'101'}});fireEvent.click(screen.getByText('Save changes for review'));
 assert.match(screen.getByRole('status').textContent,/0 to 100/);assert.equal(calls.length,0);
 fireEvent.change(screen.getByLabelText('Marks for Aarav'),{target:{value:'0'}});fireEvent.change(screen.getByLabelText('Outcome for Meera'),{target:{value:'ABSENT'}});
 fireEvent.click(screen.getByText('Save changes for review'));await waitFor(()=>assert.equal(calls.length,2));await waitFor(()=>assert.match(screen.getByRole('status').textContent,/2 records saved/));
 assert.equal(calls[0].marksObtained,'0');assert.equal(calls[1].resultStatus,'ABSENT');assert.equal(calls[1].publicationStatus,'MARKS_ENTRY');cleanup();
 render(React.createElement(Component,{rows:{...base,'exam-results':[{id:'r',examId:'e',subjectId:'math',studentId:'a',marksObtained:'70',maximumMarks:'80',publicationStatus:'PUBLISHED'}]},role:'TEACHER',request:async()=>{},onSaved:async()=>{}}));select();assert.equal(screen.getByLabelText('Marks for Aarav').disabled,true);cleanup();
 let count=0;render(React.createElement(Component,{rows:base,role:'TEACHER',request:async()=>{if(++count===2)throw Error('Network unavailable');},onSaved:async()=>{}}));select();for(const name of ['Aarav','Meera'])fireEvent.change(screen.getByLabelText('Marks for '+name),{target:{value:'77'}});fireEvent.click(screen.getByText('Save changes for review'));await waitFor(()=>assert.match(screen.getByRole('status').textContent,/1 saved/));assert.equal(screen.getByLabelText('Marks for Meera').value,'77');cleanup();
 calls=[];window.confirm=()=>true;render(React.createElement(Component,{rows:base,role:'EXAM_COORDINATOR',request:async(p,o)=>calls.push(JSON.parse(o.body)),onSaved:async()=>{}}));select();fireEvent.change(screen.getByLabelText('Marks for Aarav'),{target:{value:'88'}});fireEvent.click(screen.getByText('Publish register'));await waitFor(()=>assert.equal(calls.length,1));assert.equal(calls[0].publicationStatus,'PUBLISHED');cleanup();
 console.log('PASS: register validation, zero versus absent, teacher publication restriction, published lock, partial-failure retention, administrator publishing.');
})().catch(e=>{console.error(e);process.exitCode=1;});
