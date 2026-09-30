'use client';
import {useState} from 'react';
import {ShoppingBag} from 'lucide-react';
export function ProductImage({src,name}:{src:string|null;name:string}){
 const [failed,setFailed]=useState<string|null>(null);
 return src&&failed!==src?<img src={src} alt={name} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={()=>setFailed(src)}/>:<span role="img" aria-label={'Image unavailable for '+name} title="Retailer image unavailable"><ShoppingBag size={34} aria-hidden="true"/></span>;
}
