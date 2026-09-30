import {NextRequest,NextResponse} from 'next/server';
import {sessionEmail,tokenFor} from '@/lib/auth';
import {accountForGoogle,exchangeGoogleCode,googleCookie,googleCookieOptions,googleOrigin,GoogleSignInError,readGoogleTransaction} from '@/lib/google-auth';
export const runtime='nodejs';
export async function GET(req:NextRequest){
 let response:NextResponse;
 try{
  const origin=googleOrigin();
  if(req.nextUrl.origin!==origin)throw new GoogleSignInError('google-expired');
  const transaction=readGoogleTransaction(req.cookies.get(googleCookie)?.value||'',req.nextUrl.searchParams.get('state')||'');
  if(transaction.linkEmail&&sessionEmail()!==transaction.linkEmail)throw new GoogleSignInError('google-expired');
  if(req.nextUrl.searchParams.has('error'))throw new GoogleSignInError(req.nextUrl.searchParams.get('error')==='access_denied'?'google-cancelled':'google-failed');
  const profile=await exchangeGoogleCode(req.nextUrl.searchParams.get('code')||'',transaction);
  const user=await accountForGoogle(profile,transaction.linkEmail);
  response=NextResponse.redirect(new URL(transaction.linkEmail?'/account?google=connected':'/dashboard',origin));
  response.cookies.set('watchtower',tokenFor(user.email),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',maxAge:30*86400,path:'/'});
 }catch(error){
  const code=error instanceof GoogleSignInError?error.code:'google-failed';
  // Do not log OAuth codes, tokens, credentials or Google's error response.
  response=NextResponse.redirect(new URL('/login?error='+code,req.url));
 }
 response.cookies.set(googleCookie,'',{...googleCookieOptions,maxAge:0});
 response.headers.set('Cache-Control','no-store');return response;
}
