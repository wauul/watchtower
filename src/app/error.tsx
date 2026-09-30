'use client';
import {useLanguage} from '@/components/language-provider';
import {AlertCircle} from 'lucide-react';
export default function ErrorPage({reset}:{reset:()=>void}){
 const {t}=useLanguage();return <main className="dashboard error-page"><AlertCircle size={36} aria-hidden="true"/><h1>{t("We couldn’t load this page")}</h1><p>{t("Your connection or one of our services may be unavailable. Try loading the page again.")}</p><div className="community-actions"><button className="primary" onClick={reset}>{t("Try again")}</button></div></main>;}
