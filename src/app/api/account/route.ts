import {sessionEmail} from '@/lib/auth';
import {accountFor} from '@/lib/account';
import {db} from '@/lib/db';
import {sameOrigin,failure} from '@/lib/http';
import {z} from 'zod';
export async function PATCH(req:Request){
 if(!sameOrigin(req))return new Response('Forbidden',{status:403});
 const email=sessionEmail();if(!email)return new Response('Unauthorized',{status:401});
 try{const data=z.object({displayName:z.string().trim().min(2).max(50)}).parse(await req.json());const user=await accountFor(email);await db.user.update({where:{id:user.id},data});return Response.json({ok:true});}catch(e){return failure(e);}
}
