'use client';
import {useState} from 'react';
export function LogoutButton(){
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 async function logout(){setBusy(true);setError('');try{const response=await fetch('/api/logout',{method:'POST'});if(!response.ok)throw new Error();window.location.assign('/login');}catch{setBusy(false);setError('Could not sign out. Please try again.');}}
 return <div><button type="button" className="secondary" disabled={busy} onClick={logout}>{busy?'Signing out…':'Sign out'}</button>{error&&<p className="error" role="alert">{error}</p>}</div>;
}
