import {db} from '@/lib/db';
import {sessionEmail} from '@/lib/auth';
import {accountFor} from '@/lib/account';
import {sameOrigin,failure} from '@/lib/http';
import {z} from 'zod';
export async function POST(req:Request,{params}:{params:{id:string}}){
 if(!sameOrigin(req))return new Response('Forbidden',{status:403});
 const email=sessionEmail();if(!email)return new Response('Unauthorized',{status:401});
 try{
 const input=z.object({note:z.string().trim().max(500),published:z.boolean()}).parse(await req.json());
 const product=await db.product.findFirst({where:{id:params.id,email},include:{history:{orderBy:{checkedAt:'desc'},take:1}}});
 if(!product)return new Response('Not found',{status:404});
 if(!input.published){await db.sharedFind.updateMany({where:{productId:product.id},data:{published:false}});return Response.json({ok:true});}
 if(!product.history[0])return Response.json({error:'A recorded price is needed before sharing.'},{status:422});
 const user=await accountFor(email);
 // Publish only an explicit snapshot. Email, target price and private history never enter the feed.
 const data={userId:user.id,name:product.name,url:product.url,imageUrl:product.imageUrl,price:product.history[0].price,currency:product.currency,note:input.note,published:true};
 await db.sharedFind.upsert({where:{productId:product.id},create:{...data,productId:product.id},update:data});
 return Response.json({ok:true});
 }catch(e){return failure(e);}
}
