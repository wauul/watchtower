import { z } from 'zod';
import { ask } from './ai';
import { db } from './db';
import { safeUrl } from './scrape';
const schema=z.object({results:z.array(z.object({retailer:z.string().max(150),price:z.number().positive().nullable(),url:z.string().url(),shipsToUser:z.enum(['yes','unverified','no'])})).max(3)});
export async function alternatives(name:string,country:string,currency:string){
 if(!process.env.GOOGLE_CSE_API_KEY||!process.env.GOOGLE_CSE_ENGINE_ID)return [];
 // Atomic daily budget is shared by all serverless invocations. No paid overage is requested.
 const key='search:'+new Date().toISOString().slice(0,10);
 const budget=await db.rateLimit.upsert({where:{key},create:{key},update:{count:{increment:1}}});if(budget.count>95)return [];
 const url=new URL('https://www.googleapis.com/customsearch/v1');url.search=new URLSearchParams({key:process.env.GOOGLE_CSE_API_KEY,cx:process.env.GOOGLE_CSE_ENGINE_ID,q:`${name} buy ${country}`,num:'8'}).toString();
 const res=await fetch(url,{signal:AbortSignal.timeout(8000)});if(!res.ok)throw new Error('Alternative search is unavailable');
 const body=await res.json();const items=(body.items||[]).map((i:any)=>({title:i.title,snippet:i.snippet,url:i.link}));
 // Snippets cannot establish shipping guarantees. Keep prices only in the tracked currency;
 // permit only URLs returned by Google so model output cannot introduce arbitrary destinations.
 const result=await ask('Identify same-product retail listings, excluding reviews, forums, accessories, different sizes/models and used items unless the product is used. Return {results:[{retailer,price:number|null,url,shipsToUser:"yes"|"unverified"|"no"}]}, max 3. Price must be explicitly visible in the supplied snippet and in requested currency, otherwise null. Shipping yes/no requires explicit evidence; a country domain alone is insufficient: mark unverified. Do not guess shipping or currency conversions.',{name,country,currency,items},schema);
 return result.results.filter(r=>items.some((i:any)=>i.url===r.url)&&r.shipsToUser!=='no').filter(r=>{try{safeUrl(r.url);return true;}catch{return false;}}).sort((a,b)=>(a.price??Infinity)-(b.price??Infinity));
}
