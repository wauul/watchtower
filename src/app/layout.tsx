import {sessionEmail} from '@/lib/auth';
import type {Metadata} from 'next';
import {Header,Footer,SiteTools} from '@/components/site-shell';
import {Analytics} from '@vercel/analytics/next';
import {SpeedInsights} from '@vercel/speed-insights/next';
import './globals.css';
export const metadata:Metadata={title:{default:'Watchtower — Buy at the right time',template:'%s | Watchtower'},description:'Track prices, discover community finds, and buy at the right time.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:"try{var t=localStorage.getItem('watchtower-theme');document.documentElement.dataset.theme=t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){}"}}/></head><body><a className="skip-link" href="#content">Skip to content</a><Header signedIn={!!sessionEmail()}/><div id="content" tabIndex={-1}>{children}</div><Footer/><SiteTools/><Analytics/><SpeedInsights/></body></html>;}
