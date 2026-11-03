import {NextRequest} from "next/server";

export const dynamic="force-dynamic";
export const runtime="nodejs";

async function forward(request:NextRequest){
  // Routing chooses a deployment, never authorization. Each database validates its own session.
  let workspace=request.cookies.get("MERITIQRA_WORKSPACE")?.value||"";
  const isLogin=request.method==="POST"&&["/api/v1/auth/login","/api/v1/auth/google/challenge","/api/v1/auth/google/login"].includes(request.nextUrl.pathname);
  if(isLogin){try{const input=await request.clone().json();workspace=String(input.organizationSlug||"").trim().toLowerCase();}catch{return Response.json({message:"Invalid sign-in request"},{status:400})}}
  if(workspace&&!/^[a-z0-9-]{1,100}$/.test(workspace))return Response.json({message:"Invalid workspace code"},{status:400});
  const routes:Record<string,string>=JSON.parse(process.env.TENANT_BACKEND_ROUTES||"{}");
  const base=(routes[workspace]||process.env.BACKEND_URL||"http://127.0.0.1:8081").replace(/\/$/,"");
  const destination=`${base}${request.nextUrl.pathname}${request.nextUrl.search}`;
  const headers=new Headers();
  for(const name of ["accept","content-type","cookie","x-requested-with"]){const value=request.headers.get(name);if(value)headers.set(name,value)}
  const init:RequestInit={method:request.method,headers,cache:"no-store",redirect:"manual"};
  if(!["GET","HEAD"].includes(request.method))init.body=await request.arrayBuffer();
  const response=await fetch(destination,init);
  const responseHeaders=new Headers();
  for(const name of ["content-type","cache-control","set-cookie"]){const value=response.headers.get(name);if(value)responseHeaders.set(name,value)}
  if(isLogin&&response.ok)responseHeaders.append("set-cookie",`MERITIQRA_WORKSPACE=${workspace}; Path=/; HttpOnly; SameSite=Strict; Max-Age=43200${request.nextUrl.protocol==="https:"?"; Secure":""}`);
  return new Response(response.body,{status:response.status,statusText:response.statusText,headers:responseHeaders});
}

export const GET=forward;
export const POST=forward;
export const PUT=forward;
export const PATCH=forward;
export const DELETE=forward;
