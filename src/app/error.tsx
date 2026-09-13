'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="access"><h1>A brief interruption.</h1><p>We couldn’t load this page. Please try again.</p><button className="primary" onClick={reset}>Try again</button></main>;}
