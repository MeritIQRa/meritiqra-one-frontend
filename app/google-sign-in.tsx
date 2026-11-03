"use client";
import {useRef,useState} from "react";
import type {AccountProfile} from "./auth-screen";
type IdentityApi={initialize:(options:{client_id:string;nonce:string;auto_select:boolean;callback:(response:{credential:string})=>void})=>void;renderButton:(element:HTMLElement,options:{theme:string;size:string;text:string;width:number})=>void;cancel:()=>void};
export function GoogleSignIn({workspace,onAuthenticated}:{workspace:string;onAuthenticated:(profile:AccountProfile)=>void}){
 const container=useRef<HTMLDivElement>(null);const [error,setError]=useState(""),[busy,setBusy]=useState(false),[prepared,setPrepared]=useState(false);
 const API=process.env.NEXT_PUBLIC_API_BASE_URL??"";
 async function prepare(){setError("");setBusy(true);try{
  const slug=workspace.trim();if(!slug)throw Error("Enter your institution workspace code first");
  const response=await fetch(API+"/api/v1/auth/google/challenge",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({organizationSlug:slug})});const challenge=await response.json();if(!response.ok)throw Error(challenge.detail||challenge.message||"Google sign-in is not configured");
  const win=window as unknown as {google?:{accounts:{id:IdentityApi}}};
  if(!win.google)await new Promise<void>((resolve,reject)=>{const script=document.createElement("script");script.src="https://accounts.google.com/gsi/client";script.async=true;script.onload=()=>resolve();script.onerror=()=>reject(Error("Google sign-in could not load. Check your network and browser settings."));document.head.appendChild(script)});
  if(!win.google||!container.current)throw Error("Google sign-in unavailable");
  win.google.accounts.id.initialize({client_id:challenge.clientId,nonce:challenge.nonce,auto_select:false,callback:async({credential})=>{setBusy(true);setError("");try{const result=await fetch(API+"/api/v1/auth/google/login",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({organizationSlug:slug,credential})});const body=await result.json();if(!result.ok)throw Error(body.detail||body.message||"Google membership verification failed");onAuthenticated(body)}catch(e){setError(e instanceof Error?e.message:"Sign-in failed");setPrepared(false)}finally{setBusy(false)}}});
  container.current.replaceChildren();win.google.accounts.id.renderButton(container.current,{theme:"outline",size:"large",text:"continue_with",width:300});setPrepared(true);
 }catch(e){setError(e instanceof Error?e.message:"Sign-in failed")}finally{setBusy(false)}}
 return <div className="auth-form"><p>Use the Gmail or Google Workspace identity provisioned by your institution. Google sign-in does not grant access to other schools.</p><button type="button" className="auth-submit" disabled={busy||!workspace.trim()} onClick={()=>void prepare()}>{busy?"Verifying…":prepared?"Restart Google sign-in":"Choose Google account"}</button><div ref={container} aria-label="Continue with Google"/>{error&&<div className="auth-error" role="alert">{error}</div>}</div>
}
