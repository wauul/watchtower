'use client';
import {useState} from 'react';
import {ShoppingBag} from 'lucide-react';
export function ProductImage({src,name}:{src:string|null;name:string}){const [failed,setFailed]=useState<string|null>(null);return src&&failed!==src?<img src={src} alt={name} loading="lazy" referrerPolicy="no-referrer" onError={()=>setFailed(src)}/>:<span title="Retailer image unavailable"><ShoppingBag size={34}/></span>;}
