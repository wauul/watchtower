import {getTranslator} from '@/lib/i18n/server';
export function GoogleSignIn({connecting=false}:{connecting?:boolean}){
 const t=getTranslator();
 return <a href="/api/auth/google" className="google-sign-in"><span className="google-logo" aria-hidden="true"><img src="/google-sign-in-icon.png" width="40" height="40" alt=""/></span><span>{connecting?t('Connect Google'):t('Continue with Google')}</span></a>;
}
