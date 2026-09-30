import {redirect} from 'next/navigation';
import {sessionEmail} from '@/lib/auth';
import {AccessForm} from '@/components/forms';
import {PasswordForm} from '@/components/password-form';
import {ChevronDown} from 'lucide-react';
import {GoogleSignIn} from '@/components/google-sign-in';
import {googleConfigured,googleMessages,GoogleErrorCode} from '@/lib/google-auth';
export const metadata={title:'Sign in'};
export default function Login({searchParams}:{searchParams:{error?:string}}){if(sessionEmail())redirect(searchParams.error?'/account?error='+encodeURIComponent(searchParams.error):'/account');const message=searchParams.error&&Object.prototype.hasOwnProperty.call(googleMessages,searchParams.error)?googleMessages[searchParams.error as GoogleErrorCode]:undefined;return <main className="access"><div className="access-intro"><h1>Return to your watchlist</h1><p>Use Google, a password, or a private email link.</p></div>{message&&<p role="alert" className="error sign-in-feedback">{message}</p>}{googleConfigured()&&<><GoogleSignIn/><div className="sign-in-divider"><span>Or sign in with email</span></div></>}<PasswordForm/><details className="login-alternative"><summary><span>New here or need an email link?</span><ChevronDown size={20} aria-hidden="true"/></summary><p>An email link verifies your address and opens your account. You can set or reset a password there.</p><AccessForm/></details><p className="section-note">Your watchlist is private. Sharing a find is always your choice.</p></main>;}
