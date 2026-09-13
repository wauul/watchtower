'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export function BoughtButton({id,bought}:{id:string;bought:boolean}){const [busy,setBusy]=useState(false);const [error,setError]=useState('');const router=useRouter();return <div><button className="secondary" disabled={busy} onClick={async()=>{setBusy(true);try{const r=await fetch(`/api/products/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({bought:!bought})});if(!r.ok)throw new Error();router.refresh();}catch{setError('Could not update purchase status.');}finally{setBusy(false);}}}>{busy?'Saving…':bought?'Undo purchase':'Mark as bought'}</button>{error&&<p role="alert">{error}</p>}</div>;}
