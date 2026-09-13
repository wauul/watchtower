import { appUrl,tokenFor } from './auth';
export async function email(to:string,subject:string,text:string,idempotencyKey?:string){
 if(!process.env.RESEND_API_KEY)throw new Error('Email delivery is not configured');
 const res=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json',...(idempotencyKey?{'Idempotency-Key':idempotencyKey}:{})},body:JSON.stringify({from:process.env.EMAIL_FROM||'Watchtower <onboarding@resend.dev>',to:[to],subject,text}),signal:AbortSignal.timeout(10000)});
 if(!res.ok)throw new Error(`Email delivery failed (${res.status})`);
}
export function dashboardLink(to:string){return `${appUrl()}/api/auth?token=${encodeURIComponent(tokenFor(to))}`;}
export async function sendAccess(to:string){await email(to,'Your Watchtower dashboard — eyes on the price',`Your private dashboard is ready. This link grants access to your tracked products; keep it private. It expires in 30 days.\n\n${dashboardLink(to)}\n\nGood things come to those who watch.\nWatchtower`);}
