'use client';
import {AlertCircle} from 'lucide-react';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="dashboard error-page"><AlertCircle size={36} aria-hidden="true"/><h1>We couldn’t load this page</h1><p>Your connection or one of our services may be unavailable. Try loading the page again.</p><div className="community-actions"><button className="primary" onClick={reset}>Try again</button></div></main>;}
