import {NextRequest} from "next/server";

export const dynamic="force-dynamic";
export const runtime="nodejs";

async function forward(request:NextRequest){
  const base=(process.env.BACKEND_URL||"http://127.0.0.1:8081").replace(/\/$/,"");
  const destination=`${base}${request.nextUrl.pathname}${request.nextUrl.search}`;
  const headers=new Headers();
  for(const name of ["accept","content-type","cookie","x-requested-with"]){const value=request.headers.get(name);if(value)headers.set(name,value)}
  const init:RequestInit={method:request.method,headers,cache:"no-store",redirect:"manual"};
  if(!["GET","HEAD"].includes(request.method))init.body=await request.arrayBuffer();
  const response=await fetch(destination,init);
  const responseHeaders=new Headers();
  for(const name of ["content-type","cache-control","set-cookie"]){const value=response.headers.get(name);if(value)responseHeaders.set(name,value)}
  return new Response(response.body,{status:response.status,statusText:response.statusText,headers:responseHeaders});
}

export const GET=forward;
export const POST=forward;
export const PUT=forward;
export const PATCH=forward;
export const DELETE=forward;
