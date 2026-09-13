import {createGunzip,createBrotliDecompress,createInflate} from 'node:zlib';
import * as cheerio from 'cheerio';
import https from 'node:https';
import { lookup } from 'node:dns/promises';
import ipaddr from 'ipaddr.js';
import { z } from 'zod';
import { ask } from './ai';
export function publicAddress(address:string){try{return ipaddr.process(address).range()==='unicast';}catch{return false;}}
export function safeUrl(raw:string){const u=new URL(raw);if(u.protocol!=='https:'||u.username||u.password||(u.port&&u.port!=='443'))throw new Error('Use a public HTTPS product URL');return u;}
export async function resource(raw:string,kind:"html"|"image"="html",depth=0):Promise<Buffer>{
 if(depth>3)throw new Error('Too many redirects');const u=safeUrl(raw);
 const addresses=await lookup(u.hostname,{all:true});if(!addresses.length||addresses.some(a=>!publicAddress(a.address)))throw new Error('Private network URLs are not allowed');
 // Pin the validated DNS address to the actual socket. Recheck every redirect to prevent SSRF/rebinding.
 const address=addresses[0];
 return new Promise((resolve,reject)=>{const req=https.get(u,{lookup:((_h:string,options:any,cb:any)=>options.all?cb(null,[address]):cb(null,address.address,address.family)) as any,headers:{'User-Agent':'Watchtower/1.0 (personal price tracker)','Accept':kind==='html'?'text/html':'image/avif,image/webp,image/*'}},res=>{
 if(res.statusCode&&res.statusCode>=300&&res.statusCode<400&&res.headers.location){res.resume();resolve(resource(new URL(res.headers.location,u).href,kind,depth+1));return;}
 if(res.statusCode!==200){res.resume();reject(new Error(`Retailer returned HTTP ${res.statusCode}`));return;}
 if(kind==='html'?!res.headers['content-type']?.includes('text/html'):!/^image\/(jpeg|png|webp|gif|avif)(;|$)/i.test(res.headers['content-type']||'')){res.resume();reject(new Error('Product page must be HTML'));return;}
 // Decode transport compression before parsing and enforce the limit on decoded bytes.
 const encoding=res.headers['content-encoding'];const stream=encoding==='gzip'?res.pipe(createGunzip()):encoding==='br'?res.pipe(createBrotliDecompress()):encoding==='deflate'?res.pipe(createInflate()):res;
 const chunks:Buffer[]=[];let size=0;stream.on('data',c=>{size+=c.length;if(size>(kind==='html'?16000000:5000000)){stream.destroy();res.destroy();reject(new Error('Product page exceeds the 16 MB processing limit'));}else chunks.push(c);});stream.on('end',()=>resolve(Buffer.concat(chunks)));stream.on('error',reject);res.on('error',reject);
 });const deadline=setTimeout(()=>req.destroy(new Error('Retailer timed out')),kind==='html'?15000:3000);req.on('close',()=>clearTimeout(deadline));req.on('error',reject);});
}
export function parsePrice(value:unknown):number|null{if(typeof value==='number')return Number.isFinite(value)&&value>0?value:null;if(typeof value!=='string')return null;let s=value.replace(/[^\d.,]/g,'');if(s.includes(',')&&s.includes('.'))s=s.lastIndexOf(',')>s.lastIndexOf('.')?s.replace(/\./g,'').replace(',','.'):s.replace(/,/g,'');else if(/,\d{2}$/.test(s))s=s.replace(',','.');else s=s.replace(/,/g,'');const n=Number(s);return n>0&&n<1e10?n:null;}
export function extract(html:string,url:string){
 const $=cheerio.load(html);if($('form[action*="validateCaptcha"], #captchacharacters').length)throw new Error('Retailer requires a browser verification; this page cannot be tracked automatically right now');let product:any;const walk=(x:any)=>{if(!x||typeof x!=='object')return;if([x['@type']].flat().includes('Product')&&!product)product=x;for(const v of Object.values(x))if(v&&typeof v==='object'){if(Array.isArray(v))v.forEach(walk);else walk(v);}};
 $('script[type="application/ld+json"]').each((_,el)=>{try{walk(JSON.parse($(el).text()));}catch{}});
 const offer=Array.isArray(product?.offers)?product.offers[0]:product?.offers;
 const name=product?.name||$('#productTitle').text().trim()||$('meta[property="og:title"]').attr('content')||$('h1').first().text().trim();
 const price=parsePrice(offer?.price??$('meta[property="product:price:amount"]').attr('content')??$('[itemprop="price"]').attr('content')??($('#corePriceDisplay_desktop_feature_div .a-price .a-offscreen, #corePrice_feature_div .a-price .a-offscreen').first().text()||$('.price_color, .a-price .a-offscreen, [itemprop="price"]').first().text()));
 const currency=offer?.priceCurrency||$('meta[property="product:price:currency"]').attr('content')||$('[itemprop="priceCurrency"]').attr('content')||($('#corePriceDisplay_desktop_feature_div, #corePrice_feature_div').text().includes('€')?'EUR':$('#corePriceDisplay_desktop_feature_div, #corePrice_feature_div').text().includes('£')?'GBP':$('body').text().includes('£')?'GBP':null);
 const availability=String(offer?.availability||$('[itemprop="availability"]').attr('href')||$('.availability, #availability').text());
 const stock=/OutOfStock|SoldOut|out of stock/i.test(availability)?'out_of_stock':/InStock|in stock/i.test(availability)?'in_stock':'unknown';
 let image=Array.isArray(product?.image)?product.image[0]:product?.image;image=typeof image==='object'?image?.url:image;image=image||$('meta[property="og:image"]').attr('content')||$('.product_main img, .thumbnail img').first().attr('src');
 const candidates:unknown[]=[image,$('meta[name="twitter:image"]').attr('content'),$('#landingImage').attr('data-old-hires'),$('#landingImage').attr('src')];
 // Retailer metadata may be stale. Include the actual product gallery and matching alt text.
 $('img').each((_,el)=>{const img=$(el);const alt=(img.attr('alt')||'').toLowerCase();if((name&&alt.includes(String(name).toLowerCase()))||img.is('[itemprop="image"], .product_main img, .product-image img'))candidates.push(img.attr('data-src'),img.attr('src'));});
 const imageCandidates=[...new Set(candidates.flatMap(value=>{try{return typeof value==='string'?[safeUrl(new URL(value,url).href).href]:[];}catch{return [];}}))].slice(0,8);
 const imageUrl=imageCandidates[0]||null;
 $('script,style,noscript,nav,footer').remove();return {name:String(name||'').slice(0,300),price,currency,stock,imageUrl,imageCandidates,text:$('body').text().replace(/\s+/g,' ').slice(0,18000)};
}
export async function scrape(url:string){const p=extract((await resource(url)).toString(),url);if(!p.price||!p.name){
 // Cheerio first, bounded visible-text extraction only when structured selectors fail.
 const fallback=await ask('Extract {productName:string,price:number|null,imageUrl:string|null}. Use the current sale price, not an installment, discount amount, or crossed-out price. Null if uncertain.',p.text,z.object({productName:z.string(),price:z.number().positive().nullable(),imageUrl:z.string().nullable()}));p.name=p.name||fallback.productName;p.price=p.price||fallback.price;
 if(!p.imageUrl&&fallback.imageUrl){try{p.imageCandidates.push(safeUrl(fallback.imageUrl).href);}catch{}}
 }
 // Do not persist a broken metadata URL: verify candidates against the actual image server.
 p.imageUrl=null;for(const candidate of p.imageCandidates){try{await resource(candidate,'image');p.imageUrl=candidate;break;}catch{}}
 if(!p.price)throw new Error('Could not find a reliable price on this page');if(!p.currency||!(/^[A-Z]{3}$/.test(p.currency)))throw new Error('Could not identify the product currency reliably');return {...p,price:p.price,currency:String(p.currency)};}

