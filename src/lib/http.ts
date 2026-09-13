import { ZodError } from 'zod';
export function failure(e:unknown){console.error(e instanceof Error?e.message:'Request failed');return Response.json({error:e instanceof ZodError?'Please check the form fields.':e instanceof Error?e.message:'Request failed'},{status:400});}
export function sameOrigin(r:Request){const origin=r.headers.get('origin');return !!origin&&origin===new URL(r.url).origin;}
export const privateHeaders={'Cache-Control':'no-store'};
