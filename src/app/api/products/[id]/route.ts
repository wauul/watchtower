import { db } from '@/lib/db';
import { sessionEmail } from '@/lib/auth';
import { failure,privateHeaders,sameOrigin } from '@/lib/http';
import { z } from 'zod';
export const dynamic='force-dynamic';
export async function GET(_r:Request,{params}:{params:{id:string}}){const email=sessionEmail();if(!email)return new Response('Unauthorized',{status:401});const p=await db.product.findFirst({where:{id:params.id,email},include:{history:{orderBy:{checkedAt:'asc'}},analyses:{orderBy:{createdAt:'desc'},take:1,include:{alternatives:true}}}});return p?Response.json(p,{headers:privateHeaders}):new Response('Not found',{status:404});}
export async function PATCH(req:Request,{params}:{params:{id:string}}){try{if(!sameOrigin(req))return new Response('Forbidden',{status:403});const email=sessionEmail();if(!email)return new Response('Unauthorized',{status:401});const data=z.object({bought:z.boolean()}).parse(await req.json());const p=await db.product.findFirst({where:{id:params.id,email},include:{history:{orderBy:{checkedAt:'desc'},take:1}}});if(!p)return new Response('Not found',{status:404});await db.product.update({where:{id:p.id},data:{boughtAt:data.bought?new Date():null,boughtPrice:data.bought?p.history[0]?.price:null}});return Response.json({ok:true});}catch(e){return failure(e);}}
