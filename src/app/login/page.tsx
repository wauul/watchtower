import {getTranslator} from '@/lib/i18n/server';
import {redirect} from 'next/navigation';
import {sessionEmail} from '@/lib/auth';
import {AccessForm} from '@/components/forms';
import {PasswordForm} from '@/components/password-form';
import {ChevronDown} from 'lucide-react';
import {GoogleSignIn} from '@/components/google-sign-in';
import {googleConfigured,googleMessages,GoogleErrorCode} from '@/lib/google-auth';
export function generateMetadata(){const t=getTranslator();return {title:t('Sign in')};}
export default function Login({searchParams}:{searchParams:{error?:string}}){
 const t=getTranslator();if(sessionEmail())redirect(searchParams.error?'/account?error='+encodeURIComponent(searchParams.error):'/account');const message=searchParams.error&&Object.prototype.hasOwnProperty.call(googleMessages,searchParams.error)?googleMessages[searchParams.error as GoogleErrorCode]:undefined;return <main className="access"><div className="access-intro"><h1>{t("Return to your watchlist")}</h1><p>{t("Use Google, a password, or a private email link.")}</p></div>{message&&<p role="alert" className="error sign-in-feedback">{t(message)}</p>}{googleConfigured()&&<><GoogleSignIn/><div className="sign-in-divider"><span>{t("Or sign in with email")}</span></div></>}<PasswordForm/><details className="login-alternative"><summary><span>{t("New here or need an email link?")}</span><ChevronDown size={20} aria-hidden="true"/></summary><p>{t("An email link verifies your address and opens your account. You can set or reset a password there.")}</p><AccessForm/></details><p className="section-note">{t("Your watchlist is private. Sharing a find is always your choice.")}</p></main>;}
