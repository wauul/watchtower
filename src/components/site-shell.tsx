'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {usePathname} from 'next/navigation';
import {Menu,X,Sun,Moon,Search,ArrowUp,ExternalLink} from 'lucide-react';
import {outbound} from '@/lib/outbound';
import {Brand} from './ui';

export function Header({signedIn}:{signedIn:boolean}){
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
 return <header className="site-header" ref={header}><div className="nav"><Brand/><nav id="main-navigation" aria-label="Main navigation" className={open?'is-open':''} onClick={()=>setOpen(false)}>{[['/','Community'],['/track','Track a product'],['/dashboard','My watchlist'],[signedIn?'/account':'/login',signedIn?'Account':'Sign in']].map(([href,label])=><Link key={href} href={href} aria-current={path===href?'page':undefined}>{label}</Link>)}</nav><div className="header-tools"><Link className="icon-button" href={path==='/search'?'/':'/search'} aria-label={path==='/search'?'Close search':'Search Watchtower'}>{path==='/search'?<X size={20}/>:<Search size={20}/>}</Link><button type="button" className="icon-button" onClick={toggle} aria-label={dark?'Switch to light mode':'Switch to dark mode'} aria-pressed={dark}>{dark?<Sun size={20}/>:<Moon size={20}/>}</button><button type="button" ref={menu} className="icon-button menu-toggle" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} aria-controls="main-navigation" onClick={()=>setOpen(!open)}>{open?<X size={20}/>:<Menu size={20}/>}</button></div></div></header>;
}
export function SiteTools(){
 const [showTop,setShowTop]=useState(false),[showNotice,setShowNotice]=useState(false);
 useEffect(()=>{try{setShowNotice(!localStorage.getItem('watchtower-cookie-notice'));}catch{setShowNotice(true);}const update=()=>setShowTop(scrollY>600);update();addEventListener('scroll',update,{passive:true});return()=>removeEventListener('scroll',update);},[]);
 return <>{showNotice&&<aside className="storage-notice" aria-label="Browser storage information"><p>We use a sign-in cookie and save your theme on this device. <Link href="/privacy">Privacy & storage</Link></p><button className="quiet-button" type="button" onClick={()=>{try{localStorage.setItem('watchtower-cookie-notice','seen');}catch{}setShowNotice(false);}}>Dismiss notice</button></aside>}{showTop&&<button className="icon-button back-to-top" aria-label="Back to top" onClick={()=>{window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.getElementById('content')?.focus({preventScroll:true});}}><ArrowUp size={20}/></button>}</>;
}
export function Footer(){return <footer className="site-footer"><div className="footer-main"><Brand footer/><p>Observe the price.<br/>Make your own call.</p><nav aria-label="Footer"><Link href="/help">Help & FAQ</Link><Link href="/privacy">Privacy</Link><Link href="/contact">Contact</Link><a href={outbound('https://github.com/wauul/watchtower')} target="_blank" rel="noopener noreferrer">Source <ExternalLink size={14} aria-hidden="true"/></a></nav></div><div className="footer-note"><span>A little patience. A better-informed purchase.</span><span>Prices are observations, not promises.</span></div></footer>;}
