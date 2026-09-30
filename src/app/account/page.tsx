import {getTranslator} from '@/lib/i18n/server';
import {LogoutButton} from '@/components/logout-button';
import {PasswordForm} from '@/components/password-form';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {sessionEmail} from '@/lib/auth';
import {accountFor} from '@/lib/account';
import {db} from '@/lib/db';
import {AccountForm} from '@/components/account-form';
import {PageHeading} from '@/components/ui';
import {GoogleSignIn} from '@/components/google-sign-in';
import {googleConfigured,googleMessages,GoogleErrorCode} from '@/lib/google-auth';
export const dynamic='force-dynamic';
export function generateMetadata(){const t=getTranslator();return {title:t('Account')};}
export default async function Account({searchParams}:{searchParams:{google?:string;error?:string}}){
 const t=getTranslator();
 const email=sessionEmail();if(!email)redirect('/login');const user=await accountFor(email);const finds=await db.sharedFind.findMany({where:{userId:user.id,published:true},select:{id:true,productId:true,name:true}});
 const message=searchParams.error&&Object.prototype.hasOwnProperty.call(googleMessages,searchParams.error)?googleMessages[searchParams.error as GoogleErrorCode]:undefined;
 return <main className="dashboard account-page"><PageHeading title={t("Your account")} description={<>{t("Signed in as")} <strong>{email}</strong></>} action={<LogoutButton/>}/>{message&&<p role="alert" className="error sign-in-feedback">{t(message)}</p>}<div className="settings-layout"><div><section className="settings-section"><div><h2>{t("Public profile")}</h2><p>{t("Your name accompanies the finds you choose to share.")}</p></div><AccountForm name={user.displayName}/></section><section className="settings-section"><div><h2>{t("Google sign-in")}</h2><p>{t("Connect Google to open this same account and watchlist. Passwords and email links remain available.")}</p></div><div>{user.googleSubject?<p role={searchParams.google==='connected'?'status':undefined} className="notice">{t("Google is connected to your account.")}</p>:googleConfigured()?<GoogleSignIn connecting/>:<p className="subtle">{t("Google sign-in is unavailable right now.")}</p>}</div></section><section className="settings-section"><div><h2>{t("Password")}</h2><p>{t("Set or reset a password using your verified session. Email links remain available.")}</p></div><PasswordForm setting/></section></div><aside className="shared-list"><h2>{t("Your public finds")}</h2><p className="subtle">{t("Manage each snapshot from its product page.")}</p>{finds.length?<ul>{finds.map(f=><li key={f.id}><Link href={'/product/'+f.productId}>{f.name}</Link></li>)}</ul>:<div className="inline-empty"><p>{t("No published finds")}</p><span>{t("Your products stay private until you choose to share.")}</span></div>}<Link className="text-link" href="/dashboard">{t("Open your watchlist")}</Link></aside></div></main>;
}
