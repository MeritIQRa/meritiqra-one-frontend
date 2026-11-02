"use client";
import { useEffect, useState } from "react";
import { BookOpen, CalendarDays, LogOut, Wallet } from "lucide-react";
import type { AccountProfile } from "./auth-screen";
const API=process.env.NEXT_PUBLIC_API_BASE_URL||"http://127.0.0.1:8081";
type PortalData={organizationName:string;role:string;students:Record<string,string>[];records:Record<string,Record<string,string>[]>};
const labels:Record<string,string>={attendance:"Attendance", "fee-invoices":"Fee invoices",assignments:"Assignments",timetable:"Timetable", "exam-requests":"Examinations",notices:"Announcements"};
export function StudentPortal({profile,onSignOut}:{profile:AccountProfile;onSignOut:()=>void}){
 const [data,setData]=useState<PortalData|null>(null);const [error,setError]=useState("");
 useEffect(()=>{fetch(`${API}/api/v1/portal/me`,{credentials:"include"}).then(async r=>{if(!r.ok)throw new Error("Your school administrator must link your student record before portal access is available.");return r.json()}).then(setData).catch(e=>setError(e.message))},[]);
 return <main className="role-admin"><header><div><strong>{profile.organizationName}</strong><span>{profile.role} · {profile.fullName}</span></div><button className="secondary-btn" onClick={onSignOut}><LogOut size={15}/> Sign out</button></header><section className="role-card"><div className="role-title"><BookOpen/><div><h1>{profile.role==="PARENT"?"Family portal":"Student portal"}</h1><p>Your linked records in this institution only.</p></div></div>{error&&<div role="alert" className="auth-error">{error}</div>}{data&&<><div className="portal-students">{data.students.map(student=><article key={student.id}><strong>{student.name}</strong><span>{student.admissionNumber} · {student.classId}</span></article>)}</div><div className="portal-grid">{Object.entries(data.records).map(([module,records])=><section key={module} className="role-form"><h2>{module.includes("fee")?<Wallet size={17}/>:module==="attendance"?<CalendarDays size={17}/>:<BookOpen size={17}/>} {labels[module]||module}</h2>{records.length?<ul>{records.map(record=><li key={record.id}>{record.title||record.status||record.name||record.date||record.examDate||"Record"} {record.status&&`· ${record.status}`}</li>)}</ul>:<p>No records currently available.</p>}</section>)}</div></>}</section></main>;
}
