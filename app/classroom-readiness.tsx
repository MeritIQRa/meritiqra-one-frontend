'use client';
import {useEffect,useRef,useState} from 'react';
import {Camera,Mic,Square,ShieldCheck,CalendarDays,Users,BookOpen,ArrowRight} from 'lucide-react';
import type {ReportRow} from './performance-report';
import styles from './classroom-readiness.module.css';

type Props={rows:Record<string,ReportRow[]>;onNavigate?:(key:string)=>void};
/** Local device preflight only. No room, provider, recording, upload or attendance side effects. */
export function ClassroomReadiness({rows,onNavigate}:Props){
 const [schoolId,setSchool]=useState(''),[message,setMessage]=useState('Devices are off. Choose a check when you are ready.'),[error,setError]=useState(''),[busy,setBusy]=useState(false),[active,setActive]=useState<'camera'|'microphone'|null>(null);
 const stream=useRef<MediaStream|null>(null),video=useRef<HTMLVideoElement|null>(null),generation=useRef(0);
 function release(){generation.current++;stream.current?.getTracks().forEach(track=>track.stop());stream.current=null;if(video.current)video.current.srcObject=null;}
 function stop(){release();setBusy(false);setActive(null);setError('');setMessage('Device check stopped. Camera and microphone are off.');}
 useEffect(()=>()=>release(),[]);
 async function check(kind:'camera'|'microphone'){
  release();const requestId=generation.current;setBusy(true);setActive(null);setError('');
  if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia){setBusy(false);setError('This browser cannot run device checks here. Use a supported browser on HTTPS.');return;}
  setMessage(`Waiting for your ${kind} permission. You may decline.`);
  try{
   const captured=await navigator.mediaDevices.getUserMedia({video:kind==='camera',audio:kind==='microphone'});
   if(requestId!==generation.current){captured.getTracks().forEach(track=>track.stop());return;}
   stream.current=captured;setActive(kind);setBusy(false);
   if(video.current&&kind==='camera'){video.current.srcObject=captured;void video.current.play().catch(()=>{});}
   captured.getTracks().forEach(track=>{track.onended=()=>{if(requestId===generation.current){release();setActive(null);setMessage('Device access ended. Run the check again when ready.');}};});
   setMessage(kind==='camera'?'Camera preview is local to this browser. You are not broadcasting or recording.':'Microphone access granted locally. Audio is not played, recorded or transmitted. Audio quality is not yet verified.');
  }catch(e){if(requestId!==generation.current)return;setBusy(false);setActive(null);const name=(e as DOMException).name;setError(name==='NotAllowedError'?'Permission was declined. You can continue without this device check or allow access in browser settings.':name==='NotFoundError'?'No matching device was found. Connect a camera or microphone and try again.':name==='NotReadableError'?'The device may be busy in another application. Close that use and retry.':'The device check could not start. Check browser permissions and device availability.');setMessage('Devices are off.');}
 }
 const school=rows.schools?.find(s=>s.id===schoolId);
 const staff=(rows.staff||[]).filter(s=>s.schoolId===schoolId),classes=(rows.classes||[]).filter(c=>c.schoolId===schoolId),timetable=(rows.timetable||[]).filter(t=>t.schoolId===schoolId),subjects=(rows.subjects||[]).filter(s=>s.schoolId===schoolId);
 const missingTeachers=timetable.filter(t=>!staff.some(s=>s.id===t.staffId)).length;
 return <section className={styles.workspace}>
  <div className={styles.hero}><div><span className={styles.eyebrow}>CLASSROOM PREPARATION</span><h2>Prepare for your next lesson</h2><p>Review campus setup and check devices before a live class. These checks do not join a room or mark attendance.</p></div><ShieldCheck size={32} aria-hidden="true"/></div>
  <div className={styles.notice}><strong>Live classroom integration is not enabled in One yet.</strong><span>School live sessions and recordings are not connected yet. You can review campus setup and check your devices here.</span></div>
  <div className="panel"><div className="panel-head"><div><h3>Campus preparation</h3><p>Counts below come from saved ERP records, not provider readiness.</p></div><label>Campus<select aria-label="Classroom readiness campus" value={schoolId} onChange={e=>setSchool(e.target.value)}><option value="">Choose campus</option>{(rows.schools||[]).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label></div>
   {school?<><div className={styles.metrics}>{[{label:'Staff records',value:staff.length,Icon:Users},{label:'Class sections',value:classes.length,Icon:BookOpen},{label:'Subject records',value:subjects.length,Icon:BookOpen},{label:'Timetable entries',value:timetable.length,Icon:CalendarDays}].map(({label,value,Icon})=><article key={label}><Icon size={18} aria-hidden="true"/><strong>{value}</strong><span>{label}</span></article>)}</div><p className={styles.explanation}>{missingTeachers?`${missingTeachers} timetable entries do not reference a current staff record. Review the teaching assignments.`:'Teacher account identities and Core host permissions must be checked separately from these staff records.'}</p>{onNavigate&&<div className={styles.actions}><button className="secondary-btn" onClick={()=>onNavigate('staff')}>Manage faculty <ArrowRight size={14} aria-hidden="true"/></button><button className="secondary-btn" onClick={()=>onNavigate('timetable')}>Review timetable <ArrowRight size={14} aria-hidden="true"/></button></div>}</>:<p className={styles.explanation}>Choose a campus to review its saved teaching setup.</p>}
  </div>
  <div className={styles.deviceGrid}><article className="panel"><div className="panel-head"><div><h3>Private device check</h3><p>Each button asks permission for only the selected device.</p></div></div><div className={styles.preview}><video ref={video} muted autoPlay playsInline aria-label="Local camera preview" hidden={active!=='camera'}/>{active!=='camera'&&<div><Camera size={32} aria-hidden="true"/><span>{active==='microphone'?'Microphone access check active':'Camera is off'}</span></div>}</div><div className={styles.actions}><button className="secondary-btn" disabled={busy} onClick={()=>void check('camera')}><Camera size={16} aria-hidden="true"/> Check camera</button><button className="secondary-btn" disabled={busy} onClick={()=>void check('microphone')}><Mic size={16} aria-hidden="true"/> Check microphone</button><button className="secondary-btn" disabled={!busy&&!active} onClick={stop}><Square size={14} aria-hidden="true"/> Stop device check</button></div><p className={styles.explanation} role="status">{message}</p>{error&&<p className={styles.error} role="alert">{error}</p>}</article>
   <article className="panel"><div className="panel-head"><div><h3>Before the first class</h3><p>Operational checks still required</p></div></div><ol className={styles.checklist}><li>Assign a teacher and confirm their Google account and class access.</li><li>Verify the Core program and school-scoped classroom connection.</li><li>Test two authorised devices for audio, screen sharing and reconnect.</li><li>Explain any recording policy before learners join.</li><li>Keep recordings unavailable until processing and review are complete.</li></ol><p className={styles.explanation}>A successful local preview does not verify network quality, provider capacity, live audio or a recording.</p></article></div>
 </section>;
}
