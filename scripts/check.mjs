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
// Exercise inquiry transitions without contacting any external service or mail app.
class Element{constructor(){this.hidden=false;this.textContent='';this.handlers={};this.focused=false;}addEventListener(type,fn){this.handlers[type]=fn;}focus(){this.focused=true;}}
const elements=Object.fromEntries(['#inquiry-form','#email-review','#inquiry-preview','#email-draft','#copy-status','#edit-inquiry','#copy-inquiry'].map(k=>[k,new Element()]));
const values={name:'Review Guest',email:'guest@example.com',date:'2027-05-15',guests:'125',venue:'Example Venue',message:'A wedding & celebration <review>'};
const form=elements['#inquiry-form'];let valid=true;form.reportValidity=()=>valid;const input=new Element();form.querySelector=()=>input;
let clipboard='';const context={document:{querySelector:key=>elements[key]},FormData:class{get(key){return values[key];}},navigator:{clipboard:{async writeText(text){clipboard=text;}}},encodeURIComponent};
vm.runInNewContext(await readFile('public/app.js','utf8'),context);
valid=false;form.handlers.submit({preventDefault(){}});assert(!form.hidden,'Invalid form must remain editable');
valid=true;form.handlers.submit({preventDefault(){}});assert(form.hidden);assert(!elements['#email-review'].hidden);assert(elements['#email-review'].focused);
assert(elements['#inquiry-preview'].textContent.includes(values.message));
const mail=elements['#email-draft'].href;assert(mail.startsWith('mailto:Buckeyebartendingohio@gmail.com?'));assert(decodeURIComponent(mail).includes('Event date: 2027-05-15'));
await elements['#copy-inquiry'].handlers.click();assert.equal(clipboard,elements['#inquiry-preview'].textContent);
context.navigator.clipboard.writeText=async()=>{throw Error('Unavailable');};await elements['#copy-inquiry'].handlers.click();assert(elements['#copy-status'].textContent.includes('manually'));
elements['#edit-inquiry'].handlers.click();assert(!form.hidden);assert(elements['#email-review'].hidden);assert(input.focused);
// WCAG relative luminance check for the actual body, muted copy, and button colors.
const luminance=hex=>{const rgb=hex.match(/\w\w/g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
const contrast=(a,b)=>{const values=[luminance(a),luminance(b)].sort((a,b)=>b-a);return(values[0]+.05)/(values[1]+.05);};
for(const [a,b] of [['061d37','F8F4EC'],['d9e0e6','061d37'],['2A201B','F8F4EC'],['62574f','eee6db'],['d3c5b8','2A201B'],['71645a','F8F4EC']])assert(contrast(a,b)>=4.5,`Contrast ${a}/${b}`);
console.log(`Passed: ${pages.length} pages, local links and anchors, photo variants, alt text, inquiry validation/review/edit/copy/failure behavior, and text contrast. No live inquiry sent.`);
