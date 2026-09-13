import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
export function tokenFor(email:string) {
 const secret=process.env.AUTH_SECRET; if(!secret) throw new Error('Authentication is not configured');
 const payload=Buffer.from(JSON.stringify({email,exp:Date.now()+30*86400000})).toString('base64url');
 return payload+'.'+createHmac('sha256',secret).update(payload).digest('base64url');
}
export function verifyToken(token:string):string|null {
 try { const [p,s]=token.split('.'); const expected=createHmac('sha256',process.env.AUTH_SECRET!).update(p).digest(); const actual=Buffer.from(s,'base64url'); if(actual.length!==expected.length||!timingSafeEqual(actual,expected))return null; const data=JSON.parse(Buffer.from(p,'base64url').toString()); return data.exp>Date.now()&&typeof data.email==='string'?data.email:null; }catch{return null;}
}
export function sessionEmail(){return verifyToken(cookies().get('watchtower')?.value||'');}
export function appUrl(){return process.env.APP_URL||(process.env.VERCEL_PROJECT_PRODUCTION_URL?`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`:'http://localhost:3000');}
