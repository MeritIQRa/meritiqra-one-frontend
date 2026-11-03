"use client";
import { PlatformOperations } from "./platform-operations";
import { FormEvent, useEffect, useState } from "react";
import { Building2, LogOut, ShieldCheck } from "lucide-react";
import type { AccountProfile } from "./auth-screen";
import { FeatureSettings } from "./feature-settings";
import { CoreProgramAccess } from "./core-program-access";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
type Created = { organizationName: string; organizationSlug: string; institutionType: string; superAdminEmail: string; superAdminRole: string };
export function PlatformOnboarding({ profile, onSignOut }: { profile: AccountProfile; onSignOut: () => void }) {
  const [googleOnly,setGoogleOnly]=useState(true);
  useEffect(()=>{fetch(`${API}/api/v1/auth/google/config`,{credentials:"include"}).then(r=>r.json()).then(c=>setGoogleOnly(c.googleOnlySchools)).catch(()=>{})},[]);
  const [organizations,setOrganizations]=useState<Array<{id:string;name:string;slug:string;status:string;institutionType:string}>>([]);
  const [directoryError,setDirectoryError]=useState("");
  useEffect(()=>{fetch(`${API}/api/v1/platform/organizations/features`,{credentials:"include"}).then(async response=>{if(!response.ok)throw new Error(`Organization directory unavailable (${response.status})`);return response.json()}).then(setOrganizations).catch(cause=>setDirectoryError(cause.message));},[]);
  const [screen,setScreen]=useState<"onboarding"|"features"|"core-programs">("onboarding");
  const [form, setForm] = useState({ organizationName: "", institutionType: "SCHOOL", adminFullName: "", adminEmail: "", adminPassword: "" });
  const [created, setCreated] = useState<Created | null>(null); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function openSchool(slug:string){
    setError("");setBusy(true);
    try{const response=await fetch(`${API}/api/v1/auth/logout`,{method:"POST",credentials:"include"});if(!response.ok)throw Error("Could not end the current session; try again");window.location.assign(`/?workspace=${encodeURIComponent(slug)}`)}
    catch(cause){setError(cause instanceof Error?cause.message:"Could not open school");setBusy(false)}
  }
  async function submit(event: FormEvent) { event.preventDefault(); setBusy(true); setError(""); setCreated(null);
    try { const response = await fetch(`${API}/api/v1/platform/organizations`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.message || body.detail || `Onboarding failed (${response.status})`); }
      setCreated(await response.json()); setForm({ organizationName: "", institutionType: "SCHOOL", adminFullName: "", adminEmail: "", adminPassword: "" });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not provision institution"); } finally { setBusy(false); }
  }
  if(screen==="features")return <FeatureSettings profile={profile} onBack={()=>setScreen("onboarding")}/>;
  if(screen==="core-programs")return <CoreProgramAccess profile={profile} onBack={()=>setScreen("onboarding")}/>;
  return <main className="role-admin"><header><div><strong>MeritIQRa Platform</strong><span>{profile.fullName} · Platform administrator</span></div><button className="secondary-btn" onClick={()=>setScreen("core-programs")}><BookOpenIcon/> Core exam programs</button><button className="secondary-btn" onClick={()=>setScreen("features")}><ShieldCheck size={15}/> Feature access</button><button className="secondary-btn" onClick={onSignOut}><LogOut size={15}/> Sign out</button></header>
    <section className="role-card"><h1>Platform command center</h1><p>Manage institution onboarding, licensed features and Core program access across MeritIQRa One.</p>{directoryError&&<p role="alert" className="auth-error">{directoryError}</p>}<div className="role-fields"><article><h2>{organizations.length}</h2><p>Institutions</p></article><article><h2>{organizations.filter(org=>org.status==="ACTIVE").length}</h2><p>Active workspaces</p></article></div><h2>Organization directory</h2><p>Open a school and sign in again with Google. Only the configured master identity receives school super-admin access; other accounts still require school membership.</p><div style={{overflowX:"auto"}}><table><thead><tr><th>Institution</th><th>Type</th><th>Status</th><th>Workspace</th></tr></thead><tbody>{organizations.map((org,index)=><tr key={org.id??index}><td>{org.name}</td><td>{org.institutionType}</td><td>{org.status}</td><td><button className="secondary-btn" disabled={busy||!["ACTIVE","ONBOARDING"].includes(org.status)} onClick={()=>void openSchool(org.slug)}>Open school workspace</button></td></tr>)}</tbody></table></div>{!directoryError&&organizations.length===0&&<p>No institutions loaded. Provision an institution below to begin.</p>}</section>
    <section className="role-card"><div className="role-title"><Building2/><div><h1>Institution onboarding</h1><p>Provision a private school or college workspace and its first super administrator.</p></div></div>
      {error&&<div role="alert" className="auth-error">{error}</div>}{created&&<div className="synthetic-banner"><strong>{created.organizationName} is provisioned</strong><span>Workspace code: <b>{created.organizationSlug}</b> · Initial role: {created.superAdminRole} · Account: {created.superAdminEmail}. Use the provisioned Google email and workspace code to sign in when Google-only school access is enabled.</span></div>}
      <form className="role-form" onSubmit={submit}><h2><ShieldCheck size={18}/> New institution</h2><div className="role-fields">
        <label>School or college name<input required maxLength={180} value={form.organizationName} onChange={e=>setForm({...form,organizationName:e.target.value})}/></label>
        <label>Institution type<select value={form.institutionType} onChange={e=>setForm({...form,institutionType:e.target.value})}><option value="SCHOOL">School</option><option value="COLLEGE">College</option></select></label>
        <label>Super administrator name<input required maxLength={140} value={form.adminFullName} onChange={e=>setForm({...form,adminFullName:e.target.value})}/></label>
        <label>Super administrator email<input required type="email" maxLength={254} value={form.adminEmail} onChange={e=>setForm({...form,adminEmail:e.target.value})}/></label>
        {googleOnly?<p>This account signs in using its provisioned Gmail or Google Workspace identity. No ERP password is issued.</p>:<label>Initial password<input required type="password" minLength={12} maxLength={72} value={form.adminPassword} onChange={e=>setForm({...form,adminPassword:e.target.value})}/></label>}
      </div><button className="auth-submit" disabled={busy}>{busy?"Provisioning…":"Provision institution"}</button></form>
      <p className="role-footnote">Each school or college receives a separate organization ID and workspace code. Its super admin can manage that institution’s own accounts and roles; platform access does not expose institution student records through the school workspace APIs.</p>
    </section><PlatformOperations/></main>;
}
function BookOpenIcon(){return <Building2 size={15}/>}
