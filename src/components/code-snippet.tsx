'use client';
import {useState} from 'react';
export function CodeSnippet({code}:{code:string}){const [status,setStatus]=useState('');return <div className="code-snippet"><pre><code>{code}</code></pre><button className="secondary" onClick={async()=>{try{await navigator.clipboard.writeText(code);setStatus('Copied!');}catch{setStatus('Copy unavailable. Select the text to copy it.');}}}>Copy code</button><span role="status">{status}</span></div>;}
