'use client';

import {createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react';
import {useRouter} from 'next/navigation';
import {Language,languageCookie,localeFor,normalizeLanguage,translator} from '@/lib/i18n';

const LanguageContext=createContext({language:'en' as Language,locale:'en-GB',t:translator('en'),setLanguage:(_language:Language)=>{}});

export function LanguageProvider({initialLanguage,children}:{initialLanguage:Language;children:React.ReactNode}){
 const [language,updateLanguage]=useState(initialLanguage);
 const router=useRouter();
 useEffect(()=>updateLanguage(initialLanguage),[initialLanguage]);
 const setLanguage=useCallback((next:Language)=>{
  document.cookie=`${languageCookie}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol==='https:'?'; Secure':''}`;
  try{localStorage.setItem(languageCookie,next);}catch{}
  document.documentElement.lang=next;
  updateLanguage(next);
  router.refresh();
 },[router]);
 useEffect(()=>{
  document.documentElement.lang=language;
 },[language]);
 useEffect(()=>{
  function sync(event:StorageEvent){if(event.key===languageCookie)setLanguage(normalizeLanguage(event.newValue));}
  window.addEventListener('storage',sync);
  return()=>window.removeEventListener('storage',sync);
 },[setLanguage]);
 const value=useMemo(()=>({language,locale:localeFor(language),t:translator(language),setLanguage}),[language,setLanguage]);
 return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(){return useContext(LanguageContext);}
