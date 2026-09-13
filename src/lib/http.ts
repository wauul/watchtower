import { ZodError } from 'zod';
export function failure(e:unknown){
 console.error(e instanceof Error?e.message:'Request failed');
 if(e instanceof ZodError)return Response.json({error:'Please check the form fields.'},{status:400});
 const message=e instanceof Error?e.message:'';
 const expected=/^(Retailer |Could not find|Could not identify|Use a public|Private network|Product page|Too many redirects|AI service|Email delivery|Authentication is not configured)/.test(message);
 return Response.json({error:expected?message:'Watchtower could not complete this request. Please try again shortly.'},{status:expected?422:503});
}
export function sameOrigin(r:Request){const origin=r.headers.get('origin');return !!origin&&origin===new URL(r.url).origin;}
export const privateHeaders={'Cache-Control':'no-store'};
