import { db } from '@/lib/db';
import { sessionEmail } from '@/lib/auth';
import { privateHeaders } from '@/lib/http';
export const dynamic='force-dynamic';
export async function GET(_r:Request,{params}:{params:{email:string}}){const email=sessionEmail();if(!email||email!==params.email.toLowerCase())return new Response('Unauthorized',{status:401});const products=await db.product.findMany({where:{email},include:{history:{orderBy:{checkedAt:'asc'}},analyses:{orderBy:{createdAt:'desc'},take:1}},orderBy:{createdAt:'desc'}});return Response.json(products,{headers:privateHeaders});}
