import {LanguageProvider} from '@/components/language-provider';
import {getLanguage,getTranslator} from '@/lib/i18n/server';
import {sessionEmail} from '@/lib/auth';
import type {Metadata} from 'next';
import {Header,Footer,SiteTools} from '@/components/site-shell';
import {Analytics} from '@vercel/analytics/next';
import {SpeedInsights} from '@vercel/speed-insights/next';
import './globals.css';
export function generateMetadata():Metadata{const t=getTranslator();return {title:{default:'Watchtower | '+t('Observe the price.')+' '+t('Make your own call.'),template:'%s | Watchtower'},description:t('Follow prices and stock, understand changes, and discover finds shared by other shoppers.')};}
export default function Layout({children}:{children:React.ReactNode}){const language=getLanguage(),t=getTranslator();return <html lang={language} suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:"try{var t=localStorage.getItem('watchtower-theme');document.documentElement.dataset.theme=t==='dark'||t==='light'?t:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}"}}/></head><body><LanguageProvider initialLanguage={language}><a className="skip-link" href="#content">{t("Skip to content")}</a><Header signedIn={!!sessionEmail()}/><div id="content" tabIndex={-1}>{children}</div><SiteTools/><Footer/><Analytics/><SpeedInsights/></LanguageProvider></body></html>;}
