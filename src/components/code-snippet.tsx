'use client';
import {useLanguage} from '@/components/language-provider';
import {useState} from 'react';
export function CodeSnippet({code}:{code:string}){
 const {t}=useLanguage();const [status,setStatus]=useState('');return <div className="code-snippet"><pre><code>{t(code)}</code></pre><button className="secondary" onClick={async()=>{try{await navigator.clipboard.writeText(code);setStatus('Copied!');}catch{setStatus('Copy unavailable. Select the text to copy it.');}}}>{t("Copy code")}</button><span role="status">{t(status)}</span></div>;}
