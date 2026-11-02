"use client";
import { FormEvent, useState } from "react";
import { Building2, LogOut, ShieldCheck } from "lucide-react";
import type { AccountProfile } from "./auth-screen";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8081";
type Created = { organizationName: string; organizationSlug: string; institutionType: string; superAdminEmail: string; superAdminRole: string };
export function PlatformOnboarding({ profile, onSignOut }: { profile: AccountProfile; onSignOut: () => void }) {
  const [form, setForm] = useState({ organizationName: "", institutionType: "SCHOOL", adminFullName: "", adminEmail: "", adminPassword: "" });
  const [created, setCreated] = useState<Created | null>(null); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); setBusy(true); setError(""); setCreated(null);
    try { const response = await fetch(`${API}/api/v1/platform/organizations`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.message || body.detail || `Onboarding failed (${response.status})`); }
      setCreated(await response.json()); setForm({ organizationName: "", institutionType: "SCHOOL", adminFullName: "", adminEmail: "", adminPassword: "" });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not provision institution"); } finally { setBusy(false); }
  }
  return <main className="role-admin"><header><div><strong>MeritIQRa Platform</strong><span>{profile.fullName} · Platform administrator</span></div><button className="secondary-btn" onClick={onSignOut}><LogOut size={15}/> Sign out</button></header>
    <section className="role-card"><div className="role-title"><Building2/><div><h1>Institution onboarding</h1><p>Provision a private school or college workspace and its first super administrator.</p></div></div>
      {error&&<div role="alert" className="auth-error">{error}</div>}{created&&<div className="sample-banner"><strong>{created.organizationName} is provisioned</strong><span>Workspace code: <b>{created.organizationSlug}</b> · Initial role: {created.superAdminRole} · Account: {created.superAdminEmail}. Share the workspace code and initial password with the super administrator through your approved secure channel.</span></div>}
      <form className="role-form" onSubmit={submit}><h2><ShieldCheck size={18}/> New institution</h2><div className="role-fields">
        <label>School or college name<input required maxLength={180} value={form.organizationName} onChange={e=>setForm({...form,organizationName:e.target.value})}/></label>
        <label>Institution type<select value={form.institutionType} onChange={e=>setForm({...form,institutionType:e.target.value})}><option value="SCHOOL">School</option><option value="COLLEGE">College</option></select></label>
        <label>Super administrator name<input required maxLength={140} value={form.adminFullName} onChange={e=>setForm({...form,adminFullName:e.target.value})}/></label>
        <label>Super administrator email<input required type="email" maxLength={254} value={form.adminEmail} onChange={e=>setForm({...form,adminEmail:e.target.value})}/></label>
        <label>Initial password<input required type="password" minLength={12} maxLength={72} value={form.adminPassword} onChange={e=>setForm({...form,adminPassword:e.target.value})}/></label>
      </div><button className="auth-submit" disabled={busy}>{busy?"Provisioning…":"Provision institution"}</button></form>
      <p className="role-footnote">Each school or college receives a separate organization ID and workspace code. Its super admin can manage that institution’s own accounts and roles; platform access does not expose institution student records through the school workspace APIs.</p>
    </section></main>;
}
