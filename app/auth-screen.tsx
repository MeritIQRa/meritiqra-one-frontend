"use client";

import { FormEvent, useState } from "react";
import { GraduationCap, ShieldCheck, Sparkles } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8081";

export type AccountProfile = {
  userId: string;
  organizationId: string;
  organizationName: string;
  institutionType: "SCHOOL" | "COLLEGE";
  fullName: string;
  email: string;
  role: string;
  sampleData: boolean;
};

export function AuthScreen({ onAuthenticated }: { onAuthenticated: (profile: AccountProfile) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [organizationName, setOrganizationName] = useState("");
  const [institutionType, setInstitutionType] = useState<"SCHOOL" | "COLLEGE">("SCHOOL");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const payload = mode === "login"
        ? { email, password }
        : { organizationName, institutionType, fullName, email, password };
      const response = await fetch(`${API}/api/v1/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.detail || (response.status === 401 ? "Email or password is incorrect" : "Could not create your session"));
      }
      onAuthenticated(await response.json());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not connect to MeritIQRa One");
    } finally {
      setBusy(false);
    }
  }

  return <main className="auth-shell">
    <section className="auth-story">
      <div className="auth-brand"><div className="mark">✦</div><div>MeritIQRa <span>One</span><small>THE CONNECTED CAMPUS</small></div></div>
      <div className="auth-story-copy">
        <div className="eyebrow"><Sparkles size={14}/> ONE WORKSPACE FOR EDUCATION</div>
        <h1>Every campus operation, <span>in sync.</span></h1>
        <p>Bring admissions, learning, people, finance, and examinations together in one secure workspace for your institution.</p>
        <div className="auth-feature"><GraduationCap size={20}/><div><strong>Made for schools and colleges</strong><small>Your institution gets its own private workspace.</small></div></div>
        <div className="auth-feature"><ShieldCheck size={20}/><div><strong>Account based access</strong><small>Sign in securely to see only your organization’s records.</small></div></div>
      </div>
      <div className="auth-story-foot">MeritIQRa One · Education ERP</div>
    </section>
    <section className="auth-main">
      <div className="auth-card">
        <div className="auth-eyebrow">{mode === "login" ? "WELCOME BACK" : "GET STARTED"}</div>
        <h2>{mode === "login" ? "Sign in to your workspace" : "Create your institution workspace"}</h2>
        <p className="auth-subtitle">{mode === "login" ? "Use your school or college administrator account." : "Set up your school or college and its first administrator account."}</p>
        <div className="auth-switch" role="tablist" aria-label="Account access">
          <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "selected" : ""} onClick={() => { setMode("login"); setError(""); }}>Sign in</button>
          <button type="button" role="tab" aria-selected={mode === "register"} className={mode === "register" ? "selected" : ""} onClick={() => { setMode("register"); setError(""); }}>Create workspace</button>
        </div>
        <form className="auth-form" onSubmit={submit}>
          {mode === "register" && <>
            <label>Institution name<input required maxLength={180} autoComplete="organization" value={organizationName} onChange={event => setOrganizationName(event.target.value)} placeholder="e.g. Northview Public School"/></label>
            <label>Institution type<select value={institutionType} onChange={event => setInstitutionType(event.target.value as "SCHOOL" | "COLLEGE")}><option value="SCHOOL">School</option><option value="COLLEGE">College</option></select></label>
            <label>Administrator name<input required maxLength={140} autoComplete="name" value={fullName} onChange={event => setFullName(event.target.value)} placeholder="Your full name"/></label>
          </>}
          <label>Work email<input type="email" required maxLength={254} autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@institution.edu"/></label>
          <label>Password<input type="password" required minLength={mode === "register" ? 12 : 1} maxLength={72} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={event => setPassword(event.target.value)} placeholder={mode === "register" ? "At least 12 characters" : "Your password"}/></label>
          {error && <div role="alert" className="auth-error">{error}</div>}
          <button className="auth-submit" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in securely" : "Create workspace"}</button>
        </form>
        <div className="auth-security"><ShieldCheck size={15}/> Your session is protected with an HttpOnly, secure-by-default account cookie.</div>
      </div>
      <div className="auth-help">Need access for your institution? Ask its MeritIQRa One administrator.</div>
    </section>
  </main>;
}
