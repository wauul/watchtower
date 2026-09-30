import {ChevronDown, Radar, ExternalLink} from 'lucide-react';
import Link from 'next/link';

export function Brand({footer=false}:{footer?:boolean}) {
 return <Link className="brand" href="/" aria-label="Watchtower home"><span className="brand-mark"><Radar size={footer?23:27} aria-hidden="true"/></span><span>watchtower</span></Link>;
}
export function PageHeading({title,description,action}:{title:string;description?:React.ReactNode;action?:React.ReactNode}) {
 return <div className="page-heading"><div><h1>{title}</h1>{description&&<p>{description}</p>}</div>{action}</div>;
}
export function EmptyState({title,children,action}:{title:string;children:React.ReactNode;action?:React.ReactNode}) {
 return <section className="empty"><Radar size={32} aria-hidden="true"/><div><h2>{title}</h2><p>{children}</p>{action}</div></section>;
}
export function FaqList({items}:{items:readonly (readonly string[])[]}) {
 return <div className="faq-list">{items.map(([q,a])=><details key={q}><summary><span>{q}</span><ChevronDown size={20} aria-hidden="true"/></summary><p>{a}</p></details>)}</div>;
}
export function ExternalCue(){return <ExternalLink size={15} aria-hidden="true"/>;}
export function StateLabel({children,tone='neutral'}:{children:React.ReactNode;tone?:'neutral'|'success'|'warning'|'error'}){
 return <span className={'state-label '+tone}><span className="observation-dot" aria-hidden="true"/>{children}</span>;
}
