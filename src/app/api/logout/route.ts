import {NextResponse} from 'next/server';
import {sameOrigin} from '@/lib/http';
export async function POST(req:Request){if(!sameOrigin(req))return new Response('Forbidden',{status:403});const res=NextResponse.redirect(new URL('/login',req.url),303);res.cookies.set('watchtower','',{maxAge:0,path:'/'});return res;}
