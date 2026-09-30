'use client';
import {useLanguage} from '@/components/language-provider';
import {useState} from 'react';
import {ShoppingBag} from 'lucide-react';
export function ProductImage({src,name}:{src:string|null;name:string}){
 const {t}=useLanguage();
 const [failed,setFailed]=useState<string|null>(null);
 return src&&failed!==src?<img src={src} alt={name} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={()=>setFailed(src)}/>:<span role="img" aria-label={t('Image unavailable for ')+name} title={t("Retailer image unavailable")}><ShoppingBag size={34} aria-hidden="true"/></span>;
}
