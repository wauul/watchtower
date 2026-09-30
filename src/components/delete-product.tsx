'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Trash2} from 'lucide-react';
import {ConfirmButton} from './confirm-button';
export function DeleteProduct({id,name}:{id:string;name:string}){
 const [busy,setBusy]=useState(false),[error,setError]=useState('');const router=useRouter();
 async function remove(){setBusy(true);setError('');try{const r=await fetch('/api/products/'+id,{method:'DELETE'});if(!r.ok&&r.status!==404)throw new Error('Could not delete this product. Please try again.');router.replace('/dashboard');router.refresh();}catch(e){setError(e instanceof Error?e.message:'Could not delete this product.');setBusy(false);}}
 return <div className="delete-product"><ConfirmButton title="Delete this product?" description={'Permanently delete “'+name+'” and its history, analyses, public find and reactions. Tracking ends immediately. This cannot be undone.'} confirmLabel="Delete product" destructive disabled={busy} onConfirm={remove}><Trash2 size={15} aria-hidden="true"/>{busy?'Deleting…':'Delete product'}</ConfirmButton>{error&&<p role="alert" className="error">{error}</p>}</div>;
}
