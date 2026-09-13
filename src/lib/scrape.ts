import * as cheerio from 'cheerio';
import https from 'node:https';
import { lookup } from 'node:dns/promises';
import ipaddr from 'ipaddr.js';
import { z } from 'zod';
import { ask } from './ai';
export function publicAddress(address:string){try{return ipaddr.process(address).range()==='unicast';}catch{return false;}}
export function safeUrl(raw:string){const u=new URL(raw);if(u.protocol!=='https:'||u.username||u.password||(u.port&&u.port!=='443'))throw new Error('Use a public HTTPS product URL');return u;}
async function page(raw:string,depth=0):Promise<string>{
 if(depth>3)throw new Error('Too many redirects');const u=safeUrl(raw);
 const addresses=await lookup(u.hostname,{all:true});if(!addresses.length||addresses.some(a=>!publicAddress(a.address)))throw new Error('Private network URLs are not allowed');
 // Pin the validated DNS address to the actual socket. Recheck every redirect to prevent SSRF/rebinding.
 const address=addresses[0];
 return new Promise((resolve,reject)=>{const req=https.get(u,{lookup:((_h:string,options:any,cb:any)=>options.all?cb(null,[address]):cb(null,address.address,address.family)) as any,headers:{'User-Agent':'Watchtower/1.0 (personal price tracker)','Accept':'text/html'}},res=>{
 if(res.statusCode&&res.statusCode>=300&&res.statusCode<400&&res.headers.location){res.resume();resolve(page(new URL(res.headers.location,u).href,depth+1));return;}
 if(res.statusCode!==200){res.resume();reject(new Error(`Retailer returned HTTP ${res.statusCode}`));return;}
 if(!res.headers['content-type']?.includes('text/html')){res.resume();reject(new Error('Product page must be HTML'));return;}
 const chunks:Buffer[]=[];let size=0;res.on('data',c=>{size+=c.length;if(size>2000000){res.destroy();reject(new Error('Product page is too large'));}else chunks.push(c);});res.on('end',()=>resolve(Buffer.concat(chunks).toString()));res.on('error',reject);
 });req.setTimeout(10000,()=>req.destroy(new Error('Retailer timed out')));req.on('error',reject);});
}
export function parsePrice(value:unknown):number|null{if(typeof value==='number')return Number.isFinite(value)&&value>0?value:null;if(typeof value!=='string')return null;let s=value.replace(/[^\d.,]/g,'');if(s.includes(',')&&s.includes('.'))s=s.lastIndexOf(',')>s.lastIndexOf('.')?s.replace(/\./g,'').replace(',','.'):s.replace(/,/g,'');else if(/,\d{2}$/.test(s))s=s.replace(',','.');else s=s.replace(/,/g,'');const n=Number(s);return n>0&&n<1e10?n:null;}
export function extract(html:string,url:string){
 const $=cheerio.load(html);let product:any;const walk=(x:any)=>{if(!x||typeof x!=='object')return;if([x['@type']].flat().includes('Product')&&!product)product=x;for(const v of Object.values(x))if(v&&typeof v==='object'){if(Array.isArray(v))v.forEach(walk);else walk(v);}};
 $('script[type="application/ld+json"]').each((_,el)=>{try{walk(JSON.parse($(el).text()));}catch{}});
 const offer=Array.isArray(product?.offers)?product.offers[0]:product?.offers;
 const name=product?.name||$('meta[property="og:title"]').attr('content')||$('h1').first().text().trim();
 const price=parsePrice(offer?.price??$('meta[property="product:price:amount"]').attr('content')??$('[itemprop="price"]').attr('content')??$('.price_color, .a-price .a-offscreen, [itemprop="price"]').first().text());
 const currency=offer?.priceCurrency||$('meta[property="product:price:currency"]').attr('content')||($('body').text().includes('£')?'GBP':null);
 const availability=String(offer?.availability||$('[itemprop="availability"]').attr('href')||$('.availability').text());
 const stock=/OutOfStock|SoldOut|out of stock/i.test(availability)?'out_of_stock':/InStock|in stock/i.test(availability)?'in_stock':'unknown';
 let image=Array.isArray(product?.image)?product.image[0]:product?.image;image=typeof image==='object'?image?.url:image;image=image||$('meta[property="og:image"]').attr('content')||$('.product_main img, .thumbnail img').first().attr('src');
 let imageUrl:string|null=null;try{imageUrl=image?safeUrl(new URL(image,url).href).href:null;}catch{}
 $('script,style,noscript,nav,footer').remove();return {name:String(name||'').slice(0,300),price,currency,stock,imageUrl,text:$('body').text().replace(/\s+/g,' ').slice(0,18000)};
}
export async function scrape(url:string){const p=extract(await page(url),url);if(!p.price||!p.name){
 // Cheerio first, bounded visible-text extraction only when structured selectors fail.
 const fallback=await ask('Extract {productName:string,price:number|null,imageUrl:string|null}. Use the current sale price, not an installment, discount amount, or crossed-out price. Null if uncertain.',p.text,z.object({productName:z.string(),price:z.number().positive().nullable(),imageUrl:z.string().nullable()}));p.name=p.name||fallback.productName;p.price=p.price||fallback.price;
 if(!p.imageUrl&&fallback.imageUrl){try{p.imageUrl=safeUrl(fallback.imageUrl).href;}catch{}}
 }if(!p.price)throw new Error('Could not find a reliable price on this page');if(!p.currency||!(/^[A-Z]{3}$/.test(p.currency)))throw new Error('Could not identify the product currency reliably');return {...p,price:p.price,currency:String(p.currency)};}

