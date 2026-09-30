'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Search,LoaderCircle} from 'lucide-react';
export function SearchButton({id}:{id:string}){
 const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[ok,setOk]=useState(false);const router=useRouter();
 return <div className="search-action"><button className="secondary" disabled={busy} onClick={async()=>{setBusy(true);setMessage('');try{const r=await fetch('/api/products/'+id+'/search',{method:'POST'});const d=await r.json();if(!r.ok)throw new Error(d.error||'Could not search right now.');setOk(true);setMessage(d.count?'Saved '+d.count+' possible alternative listings.':'No matching listings found this time.');router.refresh();}catch(e){setOk(false);setMessage(e instanceof Error?e.message:'Search failed. Please try again.');}finally{setBusy(false);}}}>{busy?<LoaderCircle size={17} className="spin" aria-hidden="true"/>:<Search size={17} aria-hidden="true"/>}{busy?'Searching retailers…':'Compare retailers'}</button>{message&&<p role={ok?'status':'alert'} className={ok?'subtle':'error'}>{message}</p>}</div>;
}
