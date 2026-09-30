'use client';
import {useLanguage} from '@/components/language-provider';
import {ChevronDown, Radar, ExternalLink} from 'lucide-react';
import Link from 'next/link';

export function Brand({footer=false}:{footer?:boolean}) {
 const {t}=useLanguage();
 return <Link className="brand" href="/" aria-label={t("Watchtower home")}><span className="brand-mark"><Radar size={footer?23:27} aria-hidden="true"/></span><span>watchtower</span></Link>;
}
export function PageHeading({title,description,action}:{title:string;description?:React.ReactNode;action?:React.ReactNode}) {
 const {t}=useLanguage();
 return <div className="page-heading"><div><h1>{t(title)}</h1>{description&&<p>{t(description)}</p>}</div>{action}</div>;
}
export function EmptyState({title,children,action}:{title:string;children:React.ReactNode;action?:React.ReactNode}) {
 const {t}=useLanguage();
 return <section className="empty"><Radar size={32} aria-hidden="true"/><div><h2>{t(title)}</h2><p>{t(children)}</p>{action}</div></section>;
}
export function FaqList({items}:{items:readonly (readonly string[])[]}) {
 const {t}=useLanguage();
 return <div className="faq-list">{items.map(([q,a])=><details key={q}><summary><span>{t(q)}</span><ChevronDown size={20} aria-hidden="true"/></summary><p>{t(a)}</p></details>)}</div>;
}
export function ExternalCue(){return <ExternalLink size={15} aria-hidden="true"/>;}
export function StateLabel({children,tone='neutral'}:{children:React.ReactNode;tone?:'neutral'|'success'|'warning'|'error'}){
 const {t}=useLanguage();
 return <span className={'state-label '+tone}><span className="observation-dot" aria-hidden="true"/>{children}</span>;
}
