"use client";

import { FormEvent, useState } from "react";
import { GraduationCap, ShieldCheck, Sparkles } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export type AccountProfile = {
  userId: string;
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  institutionType: "SCHOOL" | "COLLEGE" | "PLATFORM";
  fullName: string;
  email: string;
  role: string;
  sampleData: boolean;
};

export function AuthScreen({ onAuthenticated }: { onAuthenticated: (profile: AccountProfile) => void }) {
  const [organizationSlug, setOrganizationSlug] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      const response = await fetch(`${API}/api/v1/auth/login`, { method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationSlug, email, password }) });
      if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.message || body.detail || "Workspace code, email or password is incorrect"); }
      onAuthenticated(await response.json());
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not connect to MeritIQRa One"); }
    finally { setBusy(false); }
  }

  return <main className="auth-shell">
    <section className="auth-story"><div className="auth-brand"><div className="mark">✦</div><div>MeritIQRa <span>One</span><small>THE CONNECTED CAMPUS</small></div></div>
      <div className="auth-story-copy"><div className="eyebrow"><Sparkles size={14}/> ONE WORKSPACE FOR EDUCATION</div><h1>Every campus operation, <span>in sync.</span></h1>
        <p>Securely access your own school or college workspace, with role-specific access for administrators, teachers, students, parents and staff.</p>
        <div className="auth-feature"><GraduationCap size={20}/><div><strong>One private workspace per institution</strong><small>School records and permissions never cross institutions.</small></div></div>
        <div className="auth-feature"><ShieldCheck size={20}/><div><strong>Managed institution access</strong><small>Your platform administrator provisions schools and their first super admin.</small></div></div></div>
      <div className="auth-story-foot">MeritIQRa One · Education ERP</div></section>
    <section className="auth-main"><div className="auth-card"><div className="auth-eyebrow">WELCOME</div><h2>Sign in to your workspace</h2>
      <p className="auth-subtitle">Use the workspace code and account assigned to you by your institution.</p>
      <form className="auth-form" onSubmit={submit}>
        <label>School, college, or platform workspace code<input required maxLength={100} autoComplete="organization" value={organizationSlug} onChange={event => setOrganizationSlug(event.target.value)} placeholder="e.g. northview-school-a1b2c3d4"/></label>
        <label>Work email<input type="email" required maxLength={254} autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@institution.edu"/></label>
        <label>Password<input type="password" required maxLength={72} autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Your password"/></label>
        {error && <div role="alert" className="auth-error">{error}</div>}
        <button className="auth-submit" disabled={busy}>{busy ? "Please wait…" : "Sign in securely"}</button>
      </form><div className="auth-security"><ShieldCheck size={15}/> Your session uses an HttpOnly account cookie scoped to your institution.</div>
    </div><div className="auth-help">New institution or account? Contact your MeritIQRa platform or school super administrator.</div></section>
  </main>;
}
