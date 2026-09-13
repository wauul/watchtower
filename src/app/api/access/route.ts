import { z } from 'zod';
import { db } from '@/lib/db';
import { sendAccess } from '@/lib/email';
import { failure,sameOrigin } from '@/lib/http';
export async function POST(req:Request){try{if(!sameOrigin(req))return new Response('Forbidden',{status:403});const {email}=z.object({email:z.string().email().transform(s=>s.toLowerCase().trim())}).parse(await req.json());const key=`access:${email}:${new Date().toISOString().slice(0,13)}`;const limit=await db.rateLimit.upsert({where:{key},create:{key},update:{count:{increment:1}}});if(limit.count>3)return Response.json({error:'Please wait an hour before requesting another link.'},{status:429});if(!process.env.ALLOWED_EMAIL||email===process.env.ALLOWED_EMAIL)await sendAccess(email);return Response.json({message:'If delivery is enabled for this email, your link is on its way.'});}catch(e){return failure(e);}}
