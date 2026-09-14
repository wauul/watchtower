import {db} from '@/lib/db';
import {sessionEmail} from '@/lib/auth';
import {sameOrigin} from '@/lib/http';
import {alternatives} from '@/lib/search';
export const maxDuration=60;
export async function POST(req:Request,{params}:{params:{id:string}}){
 if(!sameOrigin(req))return new Response('Forbidden',{status:403});
 const email=sessionEmail();if(!email)return new Response('Unauthorized',{status:401});
 try{
 const p=await db.product.findFirst({where:{id:params.id,email},include:{history:true,analyses:{orderBy:{createdAt:'desc'},take:1}}});
 if(!p)return new Response('Not found',{status:404});
 const key=`manual-search:${p.id}:${new Date().toISOString().slice(0,13)}`;
 const rate=await db.rateLimit.upsert({where:{key},create:{key},update:{count:{increment:1}}});
 if(rate.count>3)return Response.json({error:'Please wait an hour before searching again.'},{status:429});
 const results=await alternatives(p.name,p.country,p.currency,p.url);
 const a=p.analyses[0];
 // Manual search does not send an alert or invent a new price observation.
 await db.dealAnalysis.create({data:{productId:p.id,verdict:a?.verdict||'wait it out',reasoning:a?.reasoning||'More price observations are needed to judge this deal.',historicalLow:a?.historicalLow||Math.min(...p.history.map(h=>Number(h.price))),confidence:a?.confidence||'low',worthNotifying:false,alternatives:{create:results.map(r=>({...r,productId:p.id}))}}});
 return Response.json({count:results.length});
 }catch(e){console.error('Alternative search failed',e instanceof Error?e.message:'unknown');return Response.json({error:e instanceof Error&&/^(Alternative search|Free search quota)/.test(e.message)?e.message:'Could not search right now. Please try again shortly.'},{status:503});}
}
