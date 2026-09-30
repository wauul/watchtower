import {getTranslator} from '@/lib/i18n/server';
import {NewsletterConfirm} from '@/components/newsletter-confirm';
export function generateMetadata(){const t=getTranslator();return {title:t('Newsletter'),referrer:'no-referrer' as const,robots:{index:false,follow:false}};}
export default function Page({searchParams}:{searchParams:{token?:string;unsubscribe?:string}}){
 const t=getTranslator();return <main className="access"><div className="access-intro"><h1>{searchParams.unsubscribe?t('Manage your subscription'):t('Confirm your subscription')}</h1></div>{searchParams.token?<NewsletterConfirm token={searchParams.token} unsubscribe={searchParams.unsubscribe==='1'}/>:<p>{t("Open the confirmation or unsubscribe link in your Watchtower email to manage your subscription.")}</p>}</main>;}
