import {getTranslator} from '@/lib/i18n/server';
import Link from 'next/link';
import {Radar} from 'lucide-react';
export default function NotFound(){
 const t=getTranslator();return <main className="dashboard not-found"><Radar size={44} aria-hidden="true"/><p className="error-code">{t("404 / Page unavailable")}</p><h1>{t("Nothing to observe here")}</h1><p>{t("The page may have moved, or this product may not belong to your account. Return to the community or search for something else.")}</p><div className="community-actions"><Link className="primary" href="/">{t("Browse community finds")}</Link><Link className="secondary" href="/search">{t("Search Watchtower")}</Link></div></main>;}
