'use client';

import {useEffect,useId,useRef,useState} from 'react';
import {Check,ChevronDown,Languages} from 'lucide-react';
import {usePathname} from 'next/navigation';
import {useLanguage} from './language-provider';

const languages=[{code:'en',label:'English'},{code:'fr',label:'Français'}] as const;
type Language=typeof languages[number]['code'];

export function LanguageSelector(){
 const {language,setLanguage,t}=useLanguage();
 const [open,setOpen]=useState(false);
 const root=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null);
 const options=useRef<(HTMLButtonElement|null)[]>([]);
 const id=useId(),path=usePathname();

 useEffect(()=>setOpen(false),[path]);
 useEffect(()=>{
  if(!open)return;
  options.current[languages.findIndex(item=>item.code===language)]?.focus();
  function outside(event:PointerEvent){if(!root.current?.contains(event.target as Node))setOpen(false);}
  document.addEventListener('pointerdown',outside);
  return()=>document.removeEventListener('pointerdown',outside);
 },[open,language]);

 function choose(code:Language){
  setLanguage(code);
  setOpen(false);trigger.current?.focus();
 }

 return <div className="language-selector" ref={root} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))setOpen(false);}} onKeyDown={event=>{
  if(event.key==='Escape'&&open){event.preventDefault();event.stopPropagation();setOpen(false);trigger.current?.focus();}
 }}>
  <button ref={trigger} type="button" className="language-trigger" aria-label={`${t('Language')}: ${languages.find(item=>item.code===language)?.label}`} aria-haspopup="menu" aria-expanded={open} aria-controls={open?id:undefined} onClick={()=>setOpen(!open)} onKeyDown={event=>{
   if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();setOpen(true);}
  }}><Languages size={18} aria-hidden="true"/><span>{language.toUpperCase()}</span><ChevronDown className="language-chevron" size={14} aria-hidden="true"/></button>
  {open&&<div id={id} className="language-menu" role="menu" aria-label={t('Language')} onKeyDown={event=>{
   const index=options.current.indexOf(document.activeElement as HTMLButtonElement);
   let next:number|undefined;
   if(event.key==='ArrowDown')next=(index+1)%languages.length;
   if(event.key==='ArrowUp')next=(index+languages.length-1)%languages.length;
   if(event.key==='Home')next=0;
   if(event.key==='End')next=languages.length-1;
   if(next!==undefined){event.preventDefault();options.current[next]?.focus();}
   const match=languages.findIndex(item=>item.label.toLowerCase().startsWith(event.key.toLowerCase()));
   if(event.key.length===1&&match!==-1){event.preventDefault();options.current[match]?.focus();}
  }}>
   {languages.map((item,index)=><button key={item.code} ref={element=>{options.current[index]=element;}} type="button" role="menuitemradio" aria-checked={language===item.code} tabIndex={-1} className="language-option" onClick={()=>choose(item.code)}><span lang={item.code}>{item.label}</span><span className="language-option-code" aria-hidden="true">{item.code.toUpperCase()}</span>{language===item.code&&<Check size={16} aria-hidden="true"/>}</button>)}
  </div>}
 </div>;
}
