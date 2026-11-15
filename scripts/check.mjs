import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
async function walk(dir){const files=[];for(const entry of await readdir(dir,{withFileTypes:true})){const name=path.join(dir,entry.name);if(entry.isDirectory())files.push(...await walk(name));else files.push(name);}return files;}
const files=await walk('public');const pages=files.filter(p=>p.endsWith('.html'));
for(const page of pages){
 const html=await readFile(page,'utf8');
 assert(html.includes('name="viewport"'),`${page}: viewport`);
 assert(html.includes('<title>'),`${page}: title`);
 assert(!/<photo\b|{{|Purement|#(?:[89ab][0-9a-f]){3}/i.test(html),`${page}: template artifact`);
 for(const match of html.matchAll(/(?:href|src)="([^"?]+)(?:\?[^\"]*)?"/g)){
  const url=match[1];if(!url.startsWith('/')&&!url.startsWith('#'))continue;
  const [route,hash]=url.split('#');const pathname=route||('/'+path.relative('public',page).replaceAll('\\','/'));
  let file=path.join('public',pathname);if((await stat(file)).isDirectory())file=path.join(file,'index.html');
  await stat(file);
  if(hash){const target=await readFile(file,'utf8');assert(target.includes(`id="${hash}"`),`${page}: missing ${url}`);}
 }
 for(const match of html.matchAll(/<img\b([^>]+)>/g)){assert(/alt="[^"]+"/.test(match[1]),`${page}: image alt`);assert(/width=/.test(match[1])&&/height=/.test(match[1]),`${page}: image dimensions`);}
}
const photos=JSON.parse(await readFile('src/photos.json','utf8'));
for(const photo of Object.values(photos))for(const width of photo.widths)await stat(`public/assets/${photo.file}-${width}.webp`);
// Exercise Netlify submission states with mocked responses only; never send test inquiries.
const home = await readFile('public/index.html', 'utf8');
assert(/<form[^>]*name="bar-inquiry"[^>]*method="POST"[^>]*action="\/thank-you\/"[^>]*data-netlify="true"[^>]*netlify-honeypot="bot-field"/.test(home));
assert(!/<form[^>]* hidden/.test(home), 'Native POST fallback must be visible without JavaScript');
for (const name of ['form-name','bot-field','name','email','date','guests','venue','message']) assert(home.includes(`name="${name}"`));
assert(home.includes('value="bar-inquiry"'));
const app = await readFile('public/app.js','utf8');
class Element {
 constructor(){this.textContent='';this.handlers={};this.dataset={};this.attrs={};this.disabled=false;this.focused=false;}
 addEventListener(type,fn){this.handlers[type]=fn;}
 focus(){this.focused=true;}
 setAttribute(name,value){this.attrs[name]=value;}
 removeAttribute(name){delete this.attrs[name];}
}
function fixture(hostname='review.netlify.app') {
 const form=new Element(),result=new Element(),button=new Element();
 let valid=true,resets=0;
 const calls=[];
 const values={'form-name':'bar-inquiry','bot-field':'',name:'Review Guest',email:'guest@example.com',date:'2027-05-15',guests:'125',venue:'Example Venue',message:'A wedding & celebration <review>'};
 form.action='https://'+hostname+'/thank-you/';
 form.reportValidity=()=>valid;
 form.querySelector=()=>button;
 form.reset=()=>{resets++;};
 const context={document:{querySelector:key=>key==='#inquiry-form'?form:result},location:{hostname},URLSearchParams,FormData:class{*[Symbol.iterator](){yield* Object.entries(values);}},fetch:(...args)=>{calls.push(args);return context.respond();}};
 context.respond=async()=>({ok:true});
 vm.runInNewContext(app,context);
 return {form,result,button,calls,values,context,setValid:value=>{valid=value;},resets:()=>resets,send:()=>form.handlers.submit({preventDefault(){}})};
}
let f=fixture();f.setValid(false);await f.send();assert.equal(f.calls.length,0);
f=fixture('localhost');await f.send();assert.equal(f.calls.length,0);assert.equal(f.result.dataset.state,'error');assert(f.result.textContent.includes('Nothing has been sent'));
f=fixture();let finish;f.context.respond=()=>new Promise(resolve=>{finish=resolve;});const pending=f.send();
assert(f.button.disabled);assert.equal(f.form.attrs['aria-busy'],'true');assert.equal(f.result.dataset.state,'pending');
await f.send();assert.equal(f.calls.length,1,'Duplicate submit blocked');
const [url,options]=f.calls[0];assert(url.endsWith('/thank-you/'));assert.equal(options.method,'POST');assert.equal(options.headers['Content-Type'],'application/x-www-form-urlencoded');
const payload=new URLSearchParams(options.body);for(const [key,value] of Object.entries(f.values))assert.equal(payload.get(key),value);
finish({ok:true});await pending;assert.equal(f.result.dataset.state,'success');assert.equal(f.resets(),1);assert(!f.button.disabled);assert(!('aria-busy' in f.form.attrs));assert(f.result.focused);
for(const respond of [async()=>({ok:false}),async()=>{throw Error('Offline');}]){
 f=fixture();f.context.respond=respond;await f.send();assert.equal(f.result.dataset.state,'error');assert.equal(f.resets(),0);assert(!f.button.disabled);assert(f.result.textContent.includes('Your details are still here'));
 f.context.respond=async()=>({ok:true});await f.send();assert.equal(f.result.dataset.state,'success');
}
// WCAG relative luminance check for the actual body, muted copy, and button colors.
const luminance=hex=>{const rgb=hex.match(/\w\w/g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
const contrast=(a,b)=>{const values=[luminance(a),luminance(b)].sort((a,b)=>b-a);return(values[0]+.05)/(values[1]+.05);};
for(const [a,b] of [['061d37','F8F4EC'],['d9e0e6','061d37'],['2A201B','F8F4EC'],['62574f','eee6db'],['d3c5b8','2A201B'],['71645a','F8F4EC']])assert(contrast(a,b)>=4.5,`Contrast ${a}/${b}`);
console.log(`Passed: ${pages.length} pages, local links and anchors, photo variants, alt text, Netlify form detection markup, inquiry validation/local/pending/duplicate/success/error/retry behavior, and text contrast. No live inquiry sent.`);
