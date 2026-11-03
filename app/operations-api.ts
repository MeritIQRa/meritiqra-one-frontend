export async function operationsApi<T=Record<string,unknown>>(path:string,method="GET",body?:unknown):Promise<T>{
 const r=await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL??""}/api/v1${path}`,{method,credentials:"include",headers:body?{"Content-Type":"application/json"}:{},body:body?JSON.stringify(body):undefined,cache:"no-store"});
 if(!r.ok){let message=`Request failed (${r.status})`;try{const data=await r.json();message=data.detail||data.message||message}catch{}throw new Error(message)}return r.status===204?undefined as T:await r.text().then(text=>text?JSON.parse(text):undefined);
}
