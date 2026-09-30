'use client';
import {useLanguage} from '@/components/language-provider';
import {useState} from 'react';
import Link from 'next/link';
export function NewsletterConfirm({token,unsubscribe}:{token:string;unsubscribe:boolean}){
 const {t}=useLanguage();
 const [message,setMessage]=useState(''),[busy,setBusy]=useState(false),[done,setDone]=useState(false);
 return <><p className="subtle">{unsubscribe?t('Stop newsletter emails without changing your Watchtower account.'):t('Confirm that you’d like occasional Watchtower news and selected finds.')}</p>{!done&&<button className="primary newsletter-confirm-button" disabled={busy} onClick={async()=>{setBusy(true);setMessage('');try{const r=await fetch('/api/newsletter/confirm',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,unsubscribe})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Could not save your preference.');setMessage(unsubscribe?'You’re unsubscribed. Your account is unchanged.':'Subscription confirmed. You’re on the list.');setDone(true);}catch(e){setMessage(e instanceof Error?e.message:'Please try again.');}finally{setBusy(false);}}}>{busy?t('Saving…'):unsubscribe?t('Unsubscribe'):t('Confirm subscription')}</button>}{message&&<p role={done?'status':'alert'} className={done?'notice':'error'}>{t(message)}</p>}{done&&<Link className="text-link" href="/">{t("Browse community finds")}</Link>}</>;
}
