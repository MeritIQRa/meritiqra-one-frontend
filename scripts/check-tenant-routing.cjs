const fs=require('fs'),ts=require('typescript'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync('app/api/v1/[...path]/route.ts','utf8');
const moduleObject={exports:{}};let called;
const context={exports:moduleObject.exports,module:moduleObject,require,Response,Headers,process:{env:{BACKEND_URL:'https://main.invalid',TENANT_BACKEND_ROUTES:JSON.stringify({'vaidyaedu-group':'https://vaidya.invalid'})}},fetch:async(url,init)=>{called={url,init};return new Response('{}',{status:200,headers:{'set-cookie':'MERITIQRA_SESSION=opaque; HttpOnly'}})}};
vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,context);
function request(path,workspace,method='GET',body){return {method,nextUrl:{pathname:path,search:'',protocol:'https:'},cookies:{get:()=>workspace?{value:workspace}:undefined},headers:new Headers({'cookie':'MERITIQRA_SESSION=opaque'}),clone:()=>({json:async()=>body}),arrayBuffer:async()=>new TextEncoder().encode(JSON.stringify(body)).buffer}}
(async()=>{
 const response=await moduleObject.exports.POST(request('/api/v1/auth/google/challenge','demo','POST',{organizationSlug:'vaidyaedu-group'}));
 assert.equal(called.url,'https://vaidya.invalid/api/v1/auth/google/challenge');assert.match(response.headers.get('set-cookie'),/MERITIQRA_WORKSPACE=vaidyaedu-group/);assert.match(response.headers.get('set-cookie'),/HttpOnly/);
 await moduleObject.exports.GET(request('/api/v1/auth/me','vaidyaedu-group'));assert.equal(called.url,'https://vaidya.invalid/api/v1/auth/me');
 await moduleObject.exports.GET(request('/api/v1/auth/me','unknown-school'));assert.equal(called.url,'https://main.invalid/api/v1/auth/me');
 const invalid=await moduleObject.exports.POST(request('/api/v1/auth/login','','POST',{organizationSlug:'https://attacker.invalid'}));assert.equal(invalid.status,400);
 console.log('PASS: allowlisted tenant routing, persisted workspace, unchanged session forwarding and invalid destination rejection');
})().catch(e=>{console.error(e);process.exit(1)});
