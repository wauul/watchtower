import { timingSafeEqual } from 'node:crypto';
import { db } from '@/lib/db';
import { checkProduct } from '@/lib/check';
export const dynamic='force-dynamic';
export const maxDuration=60;
export async function GET(req:Request){
 // Vercel and the free GitHub scheduler both send this secret as a Bearer header.
 const secret=process.env.CRON_SECRET;const provided=Buffer.from(req.headers.get('authorization')||'');const expected=Buffer.from(`Bearer ${secret}`);
 if(!secret||provided.length!==expected.length||!timingSafeEqual(provided,expected))return Response.json({error:'Unauthorized'},{status:401});
 const now=new Date();await db.jobLock.deleteMany({where:{key:'check',expiresAt:{lt:now}}});
 try{await db.jobLock.create({data:{key:'check',expiresAt:new Date(Date.now()+90000)}});}catch{return Response.json({skipped:'A check is already running'});}
 try{const products=await db.product.findMany({where:{boughtAt:null,OR:[{lastCheckedAt:null},{lastCheckedAt:{lt:new Date(Date.now()-5*3600000)}}]},orderBy:{lastCheckedAt:'asc'},take:10});const results=[];const start=Date.now();
 for(const p of products){if(Date.now()-start>30000)break;try{results.push(await checkProduct(p.id));}catch(e){const message=e instanceof Error?e.message:'Check failed';await db.product.update({where:{id:p.id},data:{lastError:message,lastCheckedAt:new Date()}});results.push({id:p.id,error:message});}}
 return Response.json({checked:results.length,remaining:products.length-results.length,results});
 }finally{await db.jobLock.deleteMany({where:{key:'check'}});}
}
