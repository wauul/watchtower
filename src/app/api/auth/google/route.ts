import {NextRequest,NextResponse} from 'next/server';
import {sessionEmail} from '@/lib/auth';
import {beginGoogleSignIn,googleCookie,googleCookieOptions,googleOrigin} from '@/lib/google-auth';
export const runtime='nodejs';
export async function GET(req:NextRequest){
 try{
  const origin=googleOrigin();
  if(req.nextUrl.origin!==origin)return NextResponse.redirect(new URL('/api/auth/google',origin));
  const {url,cookie}=beginGoogleSignIn(sessionEmail()||undefined),response=NextResponse.redirect(url);
  response.cookies.set(googleCookie,cookie,googleCookieOptions);
  response.headers.set('Cache-Control','no-store');return response;
 }catch{return NextResponse.redirect(new URL('/login?error=google-unavailable',req.url));}
}
