import {accountFor} from '@/lib/account';
import { NextRequest,NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
export async function GET(req:NextRequest){const token=req.nextUrl.searchParams.get('token')||'';if(!verifyToken(token))return NextResponse.redirect(new URL('/dashboard?expired=1',req.url));await accountFor(verifyToken(token)!);const res=NextResponse.redirect(new URL('/dashboard',req.url));res.cookies.set('watchtower',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',maxAge:30*86400,path:'/'});res.headers.set('Cache-Control','no-store');return res;}
