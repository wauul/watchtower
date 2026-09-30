'use client';
import {useState} from 'react';
export function AccountForm({name}:{name:string}){
 const [message,setMessage]=useState(''),[busy,setBusy]=useState(false),[ok,setOk]=useState(false);
 return <form aria-busy={busy} onSubmit={async e=>{e.preventDefault();const data=new FormData(e.currentTarget);setBusy(true);setMessage('');try{const r=await fetch('/api/account',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({displayName:data.get('displayName')})});if(!r.ok)throw new Error();setOk(true);setMessage('Display name saved.');}catch{setOk(false);setMessage('Could not save your display name. Please try again.');}finally{setBusy(false);}}}><label htmlFor="displayName">Display name</label><input id="displayName" name="displayName" defaultValue={name} minLength={2} maxLength={50} required autoComplete="nickname" aria-describedby="name-help"/><small id="name-help">2–50 characters. Shown next to your public finds.</small><button className="primary" disabled={busy}>{busy?'Saving…':'Save display name'}</button>{message&&<p role={ok?'status':'alert'} className={ok?'notice':'error'}>{message}</p>}</form>;
}
