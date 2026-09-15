import {sessionEmail} from '@/lib/auth';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Radar,ArrowUpRight } from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
export const metadata:Metadata={title:'Watchtower — Buy at the right time',description:'A quieter way to track prices, spot real deals, and find your next good buy.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><header className="nav"><Link href="/" className="brand"><span className="brand-icon"><Radar size={23}/></span>watchtower<span className="beta">BETA</span></Link><nav><Link href="/">Community</Link><Link href="/track">Track a product</Link><Link href={sessionEmail()?"/account":"/login"}>{sessionEmail()?"Account":"Sign in"}</Link><Link className="nav-dashboard" href="/dashboard">My watchlist <ArrowUpRight size={16}/></Link></nav></header>{children}<footer><Link href="/" className="brand"><Radar size={19}/> watchtower</Link><span>A little patience. A better price.</span><span>Built for thoughtful buying.</span></footer><SpeedInsights /></body></html>;}
