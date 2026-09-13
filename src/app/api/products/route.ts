import { z } from 'zod';
import { db } from '@/lib/db';
import { scrape,safeUrl } from '@/lib/scrape';
import { sendAccess } from '@/lib/email';
import { failure,sameOrigin } from '@/lib/http';
export const maxDuration=60;
export async function POST(req:Request){try{
 if(!sameOrigin(req))return new Response('Forbidden',{status:403});
 const input=z.object({url:z.string().url().max(2000),email:z.string().email().transform(s=>s.trim().toLowerCase()),country:z.string().min(2).max(80),targetPrice:z.number().positive().max(999999999).nullable().optional()}).parse(await req.json());input.url=safeUrl(input.url).href;
 if(process.env.ALLOWED_EMAIL&&input.email!==process.env.ALLOWED_EMAIL)return Response.json({error:'This private instance currently accepts only its owner’s email. A verified sending domain is required to invite others.'},{status:403});
 const count=await db.product.count({where:{email:input.email}});if(count>=10)return Response.json({error:'Free instance limit: 10 tracked products.'},{status:429});
 const key=`create:${input.email}:${new Date().toISOString().slice(0,10)}`;const limit=await db.rateLimit.upsert({where:{key},create:{key},update:{count:{increment:1}}});if(limit.count>20)return Response.json({error:'Daily tracking request limit reached.'},{status:429});
 if(await db.product.findUnique({where:{email_url:{email:input.email,url:input.url}}}))return Response.json({error:'You already track this product. Request your dashboard link to view it.'},{status:409});
 const p=await scrape(input.url);const product=await db.product.create({data:{...input,name:p.name,imageUrl:p.imageUrl,currency:p.currency,stock:p.stock,lastCheckedAt:new Date(),history:{create:{price:p.price,stock:p.stock}}}});
 let emailSent=true;try{await sendAccess(input.email);}catch{emailSent=false;}
 return Response.json({name:product.name,emailSent,message:emailSent?'Product added. Check your email for your private dashboard.':'Product saved, but email delivery failed. Request a new dashboard link after checking email configuration.'},{status:201});
 }catch(e){return failure(e);}}
