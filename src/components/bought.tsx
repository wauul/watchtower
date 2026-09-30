'use client';
import {useLanguage} from '@/components/language-provider';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {ConfirmButton} from './confirm-button';
export function BoughtButton({id,bought}:{id:string;bought:boolean}){
 const {t}=useLanguage();
 const [busy,setBusy]=useState(false),[error,setError]=useState('');const router=useRouter();
 async function save(){setBusy(true);setError('');try{const r=await fetch('/api/products/'+id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({bought:!bought})});if(!r.ok)throw new Error();router.refresh();}catch{setError('Could not update purchase status. Please try again.');}finally{setBusy(false);}}
 return <div><ConfirmButton disabled={busy} title={bought?t('Resume tracking?'):t('Record this purchase?')} description={bought?t('This removes the recorded purchase from your savings and resumes price checks.'):t('We’ll record the latest observed price as your purchase price and pause checks. You can undo this later.')} confirmLabel={bought?t('Resume tracking'):t('Mark as bought')} onConfirm={save}>{busy?t('Saving…'):bought?t('Resume tracking'):t('Mark as bought')}</ConfirmButton>{error&&<p role="alert" className="error">{t(error)}</p>}</div>;
}
