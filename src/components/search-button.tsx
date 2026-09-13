'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
export function SearchButton({id}:{id:string}){
 const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');const router=useRouter();
 return <div><button className="secondary" disabled={busy} onClick={async()=>{setBusy(true);setMessage('');try{const r=await fetch(`/api/products/${id}/search`,{method:'POST'});const d=await r.json();if(!r.ok)throw new Error(d.error);setMessage(d.count?`Found ${d.count} possible alternative listings.`:'No matching listings found this time.');router.refresh();}catch(e){setMessage(e instanceof Error?e.message:'Search failed.');}finally{setBusy(false);}}}>{busy?'Searching retailers…':'Search for better prices'}</button>{message&&<p role="status" className="subtle">{message}</p>}</div>;
}
