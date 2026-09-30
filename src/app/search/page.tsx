import {getLanguage,getTranslator} from '@/lib/i18n/server';
import {localeFor} from '@/lib/i18n';
import Link from 'next/link';
import {db} from '@/lib/db';
import {sessionEmail} from '@/lib/auth';
import {pages,faqs} from '@/lib/site-content';
import {outbound} from '@/lib/outbound';
import {money} from '@/lib/format';
import {Search} from 'lucide-react';
import {FaqList,ExternalCue} from '@/components/ui';
export const dynamic='force-dynamic';export function generateMetadata(){const t=getTranslator();return {title:t('Search')};}
export default async function SearchPage({searchParams}:{searchParams:{q?:string}}){
 const t=getTranslator(),locale=localeFor(getLanguage());
 const q=(typeof searchParams.q==='string'?searchParams.q:'').trim().slice(0,100),email=sessionEmail();
 const matches=q?pages.filter(p=>(t(p.title)+' '+t(p.description)).toLowerCase().includes(q.toLowerCase())):[],answers=q?faqs.filter(f=>f.map(text=>t(text)).join(' ').toLowerCase().includes(q.toLowerCase())):[];
 const [finds,products]=q?await Promise.all([db.sharedFind.findMany({where:{published:true,OR:[{name:{contains:q,mode:'insensitive'}},{note:{contains:q,mode:'insensitive'}}]},select:{id:true,name:true,url:true,price:true,currency:true,updatedAt:true},take:30,orderBy:{updatedAt:'desc'}}),email?db.product.findMany({where:{email,name:{contains:q,mode:'insensitive'}},select:{id:true,name:true},take:30}):Promise.resolve([])]):[[],[]];
 const count=matches.length+answers.length+finds.length+products.length;
 return <main className="dashboard prose-page"><h1>{t("Find your way")}<br/>{t("around the lookout")}</h1><form action="/search" className="site-search" role="search"><label htmlFor="site-query">{t("Search finds, help and your watchlist")}</label><div className="newsletter-input"><input id="site-query" type="search" name="q" defaultValue={q} maxLength={100} placeholder={t("A product name or question")} required aria-describedby="search-help"/><button className="primary"><Search size={18} aria-hidden="true"/>{t("Search")}</button></div><small id="search-help">{email?t('Your private products are included only for you.'):t('Sign in to include your private watchlist.')}</small></form>{q?<><p role="status" className="subtle">{count?count+t(' results shown for “')+q+'”':t('No matches for “')+q+t('”. Try a product name or a broader term.')} {t("Up to 30 matches per product section.")}</p>{matches.length>0&&<section className="search-section"><h2>{t("Site pages")}</h2>{matches.map(p=><Link className="search-result" href={p.url} key={p.url}><strong>{t(p.title)}</strong><p>{t(p.description)}</p></Link>)}</section>}{products.length>0&&<section className="search-section"><h2>{t("Your private watchlist")}</h2>{products.map(p=><Link className="search-result" href={'/product/'+p.id} key={p.id}>{p.name}</Link>)}</section>}{finds.length>0&&<section className="search-section"><h2>{t("Public finds")}</h2>{finds.map(f=><a className="search-result" href={outbound(f.url)} target="_blank" rel="noopener noreferrer" key={f.id}><strong>{f.name} <ExternalCue/></strong><p>{money(Number(f.price),f.currency,locale)} {t("when shared · Updated")} <time dateTime={f.updatedAt.toISOString()}>{f.updatedAt.toLocaleDateString(locale,{timeZone:'UTC'})}</time></p></a>)}</section>}{answers.length>0&&<section className="search-section"><h2>{t("Help answers")}</h2><FaqList items={answers}/></section>}</>:<p className="subtle">{t("Look up a public find, get a help answer, or find a page. Your private results are visible only after you sign in.")}</p>}</main>;
}
