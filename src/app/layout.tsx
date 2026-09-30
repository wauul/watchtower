import {sessionEmail} from '@/lib/auth';
import type {Metadata} from 'next';
import {Header,Footer,SiteTools} from '@/components/site-shell';
import {Analytics} from '@vercel/analytics/next';
import {SpeedInsights} from '@vercel/speed-insights/next';
import './globals.css';
export const metadata:Metadata={title:{default:'Watchtower | Observe the price. Make your own call.',template:'%s | Watchtower'},description:'Follow prices and stock, understand changes, and discover finds shared by other shoppers.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:"try{var t=localStorage.getItem('watchtower-theme');document.documentElement.dataset.theme=t==='dark'||t==='light'?t:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}"}}/></head><body><a className="skip-link" href="#content">Skip to content</a><Header signedIn={!!sessionEmail()}/><div id="content" tabIndex={-1}>{children}</div><SiteTools/><Footer/><Analytics/><SpeedInsights/></body></html>;}
