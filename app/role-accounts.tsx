"use client";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, UserPlus, ShieldCheck, UserX, UserCheck, RefreshCw } from "lucide-react";
import type { AccountProfile } from "./auth-screen";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8081";
type ManagedAccount = { userId: string; fullName: string; email: string; role: string; active: boolean; studentIds: string[] };
type Student = { id: string; name: string; admissionNumber: string };
const sharedRoles = ["PRINCIPAL", "TEACHER", "STUDENT", "PARENT", "ACCOUNTANT", "ADMISSIONS_OFFICER", "HR_MANAGER", "LIBRARIAN", "TRANSPORT_MANAGER", "ATTENDANCE_OFFICER", "EXAM_COORDINATOR", "STAFF", "DRIVER", "BIOMETRIC_AGENT"];

export function RoleAccounts({ profile, onBack, onSignOut }: { profile: AccountProfile; onBack: () => void; onSignOut: () => void }) {
  const [accounts, setAccounts] = useState<ManagedAccount[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "TEACHER", studentIds: [] as string[] });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const superRole = profile.institutionType === "COLLEGE" ? "COLLEGE_SUPER_ADMIN" : "SCHOOL_SUPER_ADMIN";
  const adminRole = profile.institutionType === "COLLEGE" ? "COLLEGE_ADMIN" : "SCHOOL_ADMIN";
  const roles = [superRole, adminRole, ...sharedRoles];
  const assignableRoles = sharedRoles;
  async function call(path: string, init?: RequestInit) {
    const response = await fetch(`${API}/api/v1${path}`, { ...init, credentials: "include", headers: { ...(init?.body ? { "Content-Type": "application/json" } : {}), ...init?.headers } });
    if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.message || body.detail || `Request failed (${response.status})`); }
    return response.status === 204 ? null : response.json();
  }
  async function refresh() { setError(""); try { const [nextAccounts,nextStudents] = await Promise.all([call("/auth/accounts"),call("/students")]); setAccounts(nextAccounts); setStudents(nextStudents); } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load accounts"); } }
  useEffect(() => { void refresh(); }, []);
  async function create(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try { await call("/auth/accounts", { method: "POST", body: JSON.stringify(form) }); setForm({ fullName: "", email: "", password: "", role: "TEACHER", studentIds: [] }); await refresh(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not create account"); }
    finally { setBusy(false); }
  }
  async function update(id: string, path: "role" | "active", body: object) {
    setError(""); try { await call(`/auth/accounts/${id}/${path}`, { method: "PATCH", body: JSON.stringify(body) }); await refresh(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not update account"); }
  }
  return <main className="role-admin"><header><button className="secondary-btn" onClick={onBack}><ArrowLeft size={16}/> Workspace</button><div><strong>{profile.organizationName}</strong><span>{profile.role} · {profile.organizationSlug}</span></div><button className="secondary-btn" onClick={onSignOut}>Sign out</button></header>
    <section className="role-card"><div className="role-title"><ShieldCheck/><div><h1>People & roles</h1><p>Accounts and permissions belong only to this institution.</p></div></div>{error&&<div role="alert" className="auth-error">{error}</div>}
      <form className="role-form" onSubmit={create}><h2><UserPlus size={18}/> Create an institution account</h2><div className="role-fields"><label>Name<input required maxLength={140} value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})}/></label><label>Email<input type="email" required maxLength={254} value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Role<select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>{assignableRoles.map(role=><option key={role}>{role}</option>)}</select></label><label>Initial password<input type="password" required minLength={12} maxLength={72} value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>{(form.role==="STUDENT"||form.role==="PARENT")&&<label>Linked student record{form.role==="PARENT"?"s":""}<select multiple required value={form.studentIds} onChange={e=>setForm({...form,studentIds:Array.from(e.target.selectedOptions,o=>o.value)})}>{students.map(student=><option key={student.id} value={student.id}>{student.name} · {student.admissionNumber}</option>)}</select><small>Select exactly one student for a student account; parents may link multiple children.</small></label>}</div><button className="auth-submit" disabled={busy}>{busy?"Creating…":"Create account"}</button></form>
      <div className="role-table-title"><div><h2>Institution accounts</h2><p>{accounts.length} accounts in this school</p></div><button className="secondary-btn" onClick={()=>void refresh()}><RefreshCw size={15}/> Refresh</button></div>
      <div className="role-table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Access</th></tr></thead><tbody>{accounts.map(account=><tr key={account.userId}><td>{account.fullName}</td><td>{account.email}</td><td><select aria-label={`Role for ${account.fullName}`} value={account.role} disabled={account.role.endsWith("_SUPER_ADMIN")||account.role.endsWith("_ADMIN")} onChange={e=>void update(account.userId,"role",{role:e.target.value,studentIds:account.studentIds})}>{(account.role.endsWith("_ADMIN")||account.role.endsWith("_SUPER_ADMIN")?[account.role,...sharedRoles]:assignableRoles).map(role=><option key={role}>{role}</option>)}</select></td><td>{account.active?"Active":"Disabled"}</td><td><button className="secondary-btn" onClick={()=>void update(account.userId,"active",{active:!account.active})}>{account.active?<><UserX size={15}/> Disable</>:<><UserCheck size={15}/> Enable</>}</button></td></tr>)}</tbody></table></div>
      <p className="role-footnote">A user must sign in with this school’s workspace code. The same email can have a separate account in another institution; permissions and records do not cross between them.</p>
    </section>
  </main>;
}
