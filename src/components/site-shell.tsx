'use client';
import {useLanguage} from '@/components/language-provider';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {usePathname} from 'next/navigation';
import {Menu,X,Sun,Moon,Search,ArrowUp,ExternalLink} from 'lucide-react';
import {outbound} from '@/lib/outbound';
import {Brand} from './ui';
import {LanguageSelector} from './language-selector';

export function Header({signedIn}:{signedIn:boolean}){
 const {t}=useLanguage();
 const [open,setOpen]=useState(false),[dark,setDark]=useState(false);
 const path=usePathname();const menu=useRef<HTMLButtonElement>(null);const header=useRef<HTMLElement>(null);
 useEffect(()=>{
  const query=matchMedia('(prefers-color-scheme: dark)');
  setDark(document.documentElement.dataset.theme==='dark');
  function sync(){let override:string|null=null;try{override=localStorage.getItem('watchtower-theme');}catch{}if(override!=='light'&&override!=='dark'){document.documentElement.dataset.theme=query.matches?'dark':'light';setDark(query.matches);}}
  query.addEventListener('change',sync);return()=>query.removeEventListener('change',sync);
 },[]);
 useEffect(()=>setOpen(false),[path]);
 useEffect(()=>{
  function escape(e:KeyboardEvent){if(e.key==='Escape'&&open){setOpen(false);menu.current?.focus();}}
  function outside(e:PointerEvent){if(open&&!header.current?.contains(e.target as Node))setOpen(false);}
  document.addEventListener('keydown',escape);document.addEventListener('pointerdown',outside);
  return()=>{document.removeEventListener('keydown',escape);document.removeEventListener('pointerdown',outside);};
 },[open]);
 function toggle(){const next=!dark;setDark(next);document.documentElement.dataset.theme=next?'dark':'light';try{localStorage.setItem('watchtower-theme',next?'dark':'light');}catch{}}
 return <header className="site-header" ref={header}><div className="nav"><Brand/><nav id="main-navigation" aria-label={t("Main navigation")} className={open?'is-open':''} onClick={()=>setOpen(false)}>{[['/',t('Community')],['/track',t('Track a product')],['/dashboard',t('My watchlist')],[signedIn?'/account':'/login',signedIn?t('Account'):t('Sign in')]].map(([href,label])=><Link key={href} href={href} aria-current={path===href?'page':undefined}>{t(label)}</Link>)}</nav><div className="header-tools"><LanguageSelector/><Link className="icon-button" href={path==='/search'?'/':'/search'} aria-label={path==='/search'?t('Close search'):t('Search Watchtower')}>{path==='/search'?<X size={20}/>:<Search size={20}/>}</Link><button type="button" className="icon-button" onClick={toggle} aria-label={dark?t('Switch to light mode'):t('Switch to dark mode')} aria-pressed={dark}>{dark?<Sun size={20}/>:<Moon size={20}/>}</button><button type="button" ref={menu} className="icon-button menu-toggle" aria-label={open?t('Close menu'):t('Open menu')} aria-expanded={open} aria-controls="main-navigation" onClick={()=>setOpen(!open)}>{open?<X size={20}/>:<Menu size={20}/>}</button></div></div></header>;
}
export function SiteTools(){
 const {t}=useLanguage();
 const [showTop,setShowTop]=useState(false),[showNotice,setShowNotice]=useState(false);
 useEffect(()=>{try{setShowNotice(!localStorage.getItem('watchtower-cookie-notice'));}catch{setShowNotice(true);}const update=()=>setShowTop(scrollY>600);update();addEventListener('scroll',update,{passive:true});return()=>removeEventListener('scroll',update);},[]);
 return <>{showNotice&&<aside className="storage-notice" aria-label={t("Browser storage information")}><p>{t("We use a sign-in cookie and save your theme and language on this device.")} <Link href="/privacy">{t("Privacy & storage")}</Link></p><button className="quiet-button" type="button" onClick={()=>{try{localStorage.setItem('watchtower-cookie-notice','seen');}catch{}setShowNotice(false);}}>{t("Dismiss notice")}</button></aside>}{showTop&&<button className="icon-button back-to-top" aria-label={t("Back to top")} onClick={()=>{window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.getElementById('content')?.focus({preventScroll:true});}}><ArrowUp size={20}/></button>}</>;
}
export function Footer(){
 const {t}=useLanguage();return <footer className="site-footer"><div className="footer-main"><Brand footer/><p>{t("Observe the price.")}<br/>{t("Make your own call.")}</p><nav aria-label={t("Footer")}><Link href="/help">{t("Help & FAQ")}</Link><Link href="/privacy">{t("Privacy")}</Link><Link href="/contact">Contact</Link><a href={outbound('https://github.com/wauul/watchtower')} target="_blank" rel="noopener noreferrer">{t("Source")} <ExternalLink size={14} aria-hidden="true"/></a></nav></div><div className="footer-note"><span>{t("A little patience. A better-informed purchase.")}</span><span>{t("Prices are observations, not promises.")}</span></div></footer>;}
