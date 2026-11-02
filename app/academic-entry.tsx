'use client';
import {useEffect,useState} from 'react';
import type {ReportRow} from './performance-report';
type Draft={marks:string;status:string;grade:string;remarks:string};
type Props={rows:Record<string,ReportRow[]>;role:string;request:(path:string,opts?:RequestInit)=>Promise<any>;onSaved:()=>Promise<void>};
export function AcademicEntry({rows,role,request,onSaved}:Props){
 const [yearId,setYear]=useState(''),[classId,setClass]=useState(''),[examId,setExam]=useState(''),[subjectId,setSubject]=useState('');
 const [maximum,setMaximum]=useState('100'),[drafts,setDrafts]=useState<Record<string,Draft>>({}),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[search,setSearch]=useState('');
 const canPublish=role!=='TEACHER';
 const exam=rows['exam-requests']?.find(e=>e.id===examId);
 const students=(rows.students||[]).filter(s=>exam&&s.schoolId===exam.schoolId&&s.classId===exam.classId).sort((a,b)=>String(a.name).localeCompare(String(b.name)));
 const subjects=(rows.subjects||[]).filter(s=>exam&&s.schoolId===exam.schoolId&&(!s.yearId||s.yearId===exam.yearId));
 const records=(rows['exam-results']||[]).filter(r=>r.examId===examId&&r.subjectId===subjectId);
 const existing=(id:string)=>records.find(r=>r.studentId===id);
 const value=(id:string):Draft=>{const r=existing(id);return drafts[id]||{marks:r?String(r.marksObtained):'',status:r?.resultStatus||'RECORDED',grade:r?.grade||'',remarks:r?.remarks||''};};
 const dirty=Object.keys(drafts).length>0;
 useEffect(()=>{if(!dirty)return;const warn=(e:BeforeUnloadEvent)=>{e.preventDefault();};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);
 function changeContext(action:()=>void){if(dirty&&!window.confirm('Discard unsaved marks in this register?'))return;action();setDrafts({});setMessage('');setSearch('');}
 function edit(id:string,field:keyof Draft,v:string){setDrafts(d=>({...d,[id]:{...value(id),[field]:v}}));}
 async function save(publish=false){
  if(!exam||!subjectId)return;
  const selected=students.filter(s=>publish?(drafts[s.id]||existing(s.id)&&existing(s.id)?.publicationStatus!=='PUBLISHED'):drafts[s.id]);
  if(!selected.length){setMessage(publish?'No unpublished records to publish.':'Enter or revise marks before saving.');return;}
  const max=Number(maximum);
  if(!Number.isFinite(max)||max<=0){setMessage('Maximum marks must be greater than zero.');return;}
  for(const s of selected){const d=value(s.id),r=existing(s.id),limit=r?Number(r.maximumMarks):max;if(d.status!=='ABSENT'&&(d.marks.trim()===''||!Number.isFinite(Number(d.marks))||Number(d.marks)<0||Number(d.marks)>limit)){setMessage(`${s.name}: enter marks from 0 to ${limit}, or choose Absent.`);return;}}
  if(publish&&!window.confirm(`Publish ${selected.length} student result records? These will appear on annual performance cards.`))return;
  setBusy(true);setMessage('');let saved=0;const remaining={...drafts};
  try{for(const student of selected){const d=value(student.id),r=existing(student.id);if(!canPublish&&r?.publicationStatus==='PUBLISHED')throw Error('Published results are locked for teacher editing.');const maxForRow=r?Number(r.maximumMarks):max;
   const payload={...r,schoolId:exam.schoolId,yearId:exam.yearId,academicYear:exam.academicYear,examId,examType:exam.examType,classId:exam.classId,studentId:student.id,subjectId,marksObtained:d.status==='ABSENT'?'0':d.marks,maximumMarks:String(maxForRow),resultStatus:d.status,grade:d.status==='ABSENT'?'':d.grade,publicationStatus:publish?'PUBLISHED':'MARKS_ENTRY',remarks:d.remarks};
   await request('/exam-results'+(r?'/'+r.id:''),{method:r?'PUT':'POST',body:JSON.stringify(payload)});saved++;delete remaining[student.id];setDrafts({...remaining});
  }setMessage(`${saved} records ${publish?'published and available for PTM cards':'saved for review'}.`);}catch(e){setMessage(`${saved} saved. ${String(e)} Unsaved entries remain in the register.`);}finally{try{await onSaved();}finally{setBusy(false);}}
 }
 const visible=students.filter(s=>`${s.name} ${s.admissionNumber}`.toLowerCase().includes(search.toLowerCase()));
 return <section className="panel marks-entry" aria-label="Academic result entry"><div className="panel-head"><div><h3>Teacher marks register</h3><p>Choose the class and examination, enter marks, then save for review. Published results feed the PTM performance card.</p></div><span className="table-meta">{records.length} recorded · {Object.keys(drafts).length} unsaved</span></div>
 <div className="academic-filter-row"><label>1. Academic year<select disabled={busy} value={yearId} onChange={e=>changeContext(()=>{setYear(e.target.value);setClass('');setExam('');setSubject('');})}><option value="">Choose year / school</option>{(rows.years||[]).map(y=><option key={y.id} value={y.id}>{y.name} · {rows.schools?.find(s=>s.id===y.schoolId)?.name}</option>)}</select></label>
 <label>2. Class / section<select disabled={busy||!yearId} value={classId} onChange={e=>changeContext(()=>{setClass(e.target.value);setExam('');setSubject('');})}><option value="">Choose class</option>{(rows.classes||[]).filter(c=>c.yearId===yearId).map(c=><option key={c.id} value={c.id}>{c.name} · {c.section}</option>)}</select></label>
 <label>3. Examination<select disabled={busy||!classId} value={examId} onChange={e=>changeContext(()=>{setExam(e.target.value);setSubject('');})}><option value="">Choose examination</option>{(rows['exam-requests']||[]).filter(e=>e.yearId===yearId&&e.classId===classId).map(e=><option key={e.id} value={e.id}>{e.title} · {e.mode}</option>)}</select></label>
 <label>4. Subject<select disabled={busy||!examId} value={subjectId} onChange={e=>changeContext(()=>setSubject(e.target.value))}><option value="">Choose subject</option>{subjects.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label></div>
 {classId&&!(rows['exam-requests']||[]).some(e=>e.classId===classId&&e.yearId===yearId)&&<p className="empty-state">No academic exams are configured for this class and year. Ask your examination coordinator to create the exam first.</p>}
 {subjectId&&<><div className="table-toolbar"><label>Maximum for new records <input aria-label="Maximum marks for new records" disabled={busy} type="number" min="0.01" step="any" value={maximum} onChange={e=>setMaximum(e.target.value)}/></label><label>Find student <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Name or admission number"/></label></div><p className="marks-help">Use Tab to move between fields. Blank is not zero. Choose Absent for a missed exam. Existing maximum marks are preserved. Grades and pass/fail follow your institution policy.</p>
 <div className="marks-scroll"><table><thead><tr><th>Student</th><th>Outcome</th><th>Marks / max</th><th>Grade</th><th>PTM observation</th><th>Review status</th></tr></thead><tbody>{visible.map(s=>{const d=value(s.id),r=existing(s.id),locked=busy||!canPublish&&r?.publicationStatus==='PUBLISHED';return <tr key={s.id}><td><strong>{s.name}</strong><small>{s.admissionNumber}</small></td><td><select aria-label={`Outcome for ${s.name}`} disabled={locked} value={d.status} onChange={e=>edit(s.id,'status',e.target.value)}>{['RECORDED','PASS','FAIL','ABSENT','WITHHELD'].map(v=><option key={v} value={v}>{v==='RECORDED'?'Not graded':v.toLowerCase()}</option>)}</select></td><td><input aria-label={`Marks for ${s.name}`} disabled={locked||d.status==='ABSENT'} type="number" min="0" max={r?.maximumMarks||maximum} step="any" value={d.status==='ABSENT'?'':d.marks} placeholder={d.status==='ABSENT'?'Absent':'Marks'} onChange={e=>edit(s.id,'marks',e.target.value)}/><small> / {r?.maximumMarks||maximum}</small></td><td><input aria-label={`Grade for ${s.name}`} disabled={locked||d.status==='ABSENT'} maxLength={20} value={d.grade} onChange={e=>edit(s.id,'grade',e.target.value)}/></td><td><input aria-label={`PTM observation for ${s.name}`} disabled={locked} value={d.remarks} maxLength={1000} placeholder="Strength, concern or next step" onChange={e=>edit(s.id,'remarks',e.target.value)}/></td><td>{drafts[s.id]?'Unsaved':r?.publicationStatus||'Not entered'}</td></tr>;})}</tbody></table></div>
 <div className="table-toolbar"><button className="submit" disabled={busy||!dirty} onClick={()=>void save()}>{busy?'Saving…':'Save changes for review'}</button>{canPublish&&<button className="secondary-btn" disabled={busy} onClick={()=>void save(true)}>Publish register</button>}<span>Teachers save; examination administrators publish.</span></div></>}
 <p role="status" aria-live="polite">{message}</p></section>;
}
