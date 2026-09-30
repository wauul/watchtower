import {createHash,createHmac,randomBytes,timingSafeEqual} from 'node:crypto';
import {OAuth2Client,CodeChallengeMethod} from 'google-auth-library';
import {z} from 'zod';
import {appUrl} from './auth';
import {db} from './db';

export const googleCookie='watchtower-google';
export const googleCookieOptions={httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax' as const,path:'/api/auth/google',maxAge:600};
export type GoogleErrorCode='google-unavailable'|'google-cancelled'|'google-expired'|'google-failed'|'google-link-required'|'google-connected-elsewhere';
export class GoogleSignInError extends Error{
 constructor(public code:GoogleErrorCode){super(code);}
}
export function googleConfigured(){return !!(process.env.GOOGLE_CLIENT_ID&&process.env.GOOGLE_CLIENT_SECRET&&process.env.AUTH_SECRET);}
export function googleOrigin(){
 const url=new URL(appUrl());
 if(url.protocol!=='https:'&&!(url.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(url.hostname)))throw new GoogleSignInError('google-unavailable');
 return url.origin;
}
function client(){
 if(!googleConfigured())throw new GoogleSignInError('google-unavailable');
 return new OAuth2Client({clientId:process.env.GOOGLE_CLIENT_ID,clientSecret:process.env.GOOGLE_CLIENT_SECRET,redirectUri:googleOrigin()+'/api/auth/google/callback',transporterOptions:{timeout:10000,retry:false}});
}
const transactionSchema=z.object({state:z.string().length(43),nonce:z.string().length(43),verifier:z.string().length(43),exp:z.number().int(),linkEmail:z.string().email().max(254).optional()});
type GoogleTransaction=z.infer<typeof transactionSchema>;
function signature(payload:string){
 if(!process.env.AUTH_SECRET)throw new GoogleSignInError('google-unavailable');
 return createHmac('sha256',process.env.AUTH_SECRET).update('google-oauth:'+payload).digest();
}
export function beginGoogleSignIn(linkEmail?:string){
 const oauth=client(),state=randomBytes(32).toString('base64url'),nonce=randomBytes(32).toString('base64url'),verifier=randomBytes(32).toString('base64url');
 const transaction=transactionSchema.parse({state,nonce,verifier,exp:Date.now()+600000,...(linkEmail?{linkEmail}:{})});
 const payload=Buffer.from(JSON.stringify(transaction)).toString('base64url');
 const url=oauth.generateAuthUrl({scope:['openid','email','profile'],access_type:'online',prompt:'select_account',state,nonce,code_challenge:createHash('sha256').update(verifier).digest('base64url'),code_challenge_method:CodeChallengeMethod.S256});
 return {url,cookie:payload+'.'+signature(payload).toString('base64url')};
}
export function readGoogleTransaction(cookie:string,state:string):GoogleTransaction{
 try{
  if(cookie.length>4096||!state)throw new Error();
  const parts=cookie.split('.');if(parts.length!==2)throw new Error();
  const [payload,mac]=parts,expected=signature(payload),actual=Buffer.from(mac,'base64url');
  if(actual.length!==expected.length||!timingSafeEqual(actual,expected))throw new Error();
  const result=transactionSchema.parse(JSON.parse(Buffer.from(payload,'base64url').toString()));
  if(result.exp<=Date.now()||result.exp>Date.now()+600000||result.state!==state)throw new Error();
  return result;
 }catch{throw new GoogleSignInError('google-expired');}
}
const profileSchema=z.object({sub:z.string().min(1).max(255),email:z.string().email().max(254).transform(s=>s.trim().toLowerCase()),email_verified:z.literal(true),name:z.string().max(300).optional(),hd:z.string().min(1).optional()});
export type GoogleProfile=z.infer<typeof profileSchema>;
export async function exchangeGoogleCode(code:string,transaction:GoogleTransaction):Promise<GoogleProfile>{
 if(!code||code.length>4096)throw new GoogleSignInError('google-failed');
 const oauth=client();
 const {tokens}=await oauth.getToken({code,codeVerifier:transaction.verifier});
 if(!tokens.id_token)throw new GoogleSignInError('google-failed');
 const ticket=await oauth.verifyIdToken({idToken:tokens.id_token,audience:process.env.GOOGLE_CLIENT_ID});
 const payload=ticket.getPayload();
 // The library verifies signature, issuer, audience and expiry. Bind the ID token
 // to this browser's login, and reject tokens whose email is not verified.
 if(!payload||!('nonce' in payload)||payload.nonce!==transaction.nonce||payload.exp*1000<=Date.now()||payload.azp&&payload.azp!==process.env.GOOGLE_CLIENT_ID)throw new GoogleSignInError('google-failed');
 const parsed=profileSchema.safeParse(payload);if(!parsed.success)throw new GoogleSignInError('google-failed');
 return parsed.data;
}
export async function accountForGoogle(profile:GoogleProfile,linkEmail?:string){
 return db.$transaction(async tx=>{
  const connected=await tx.user.findUnique({where:{googleSubject:profile.sub}});
  if(connected){if(linkEmail&&connected.email!==linkEmail)throw new GoogleSignInError('google-connected-elsewhere');return connected;}
  // Google is authoritative for Gmail and Workspace addresses. Other Google
  // accounts must first prove ownership through Watchtower's existing sign-in.
  if(!linkEmail&&!profile.email.endsWith('@gmail.com')&&!profile.hd)throw new GoogleSignInError('google-link-required');
  const email=linkEmail||profile.email;
  const user=await tx.user.upsert({where:{email},create:{email,googleSubject:profile.sub,...(profile.name?.trim()?{displayName:profile.name.trim().slice(0,50)}:{})},update:{}});
  if(user.googleSubject&&user.googleSubject!==profile.sub)throw new GoogleSignInError('google-connected-elsewhere');
  if(!user.googleSubject){const linked=await tx.user.updateMany({where:{id:user.id,googleSubject:null},data:{googleSubject:profile.sub}});if(linked.count!==1)throw new GoogleSignInError('google-connected-elsewhere');}
  return user;
 });
}
export const googleMessages:Record<GoogleErrorCode,string>={
 'google-unavailable':'Google sign-in is unavailable right now. Use your password or an email link.',
 'google-cancelled':'Google sign-in was cancelled. Try again or use another sign-in method.',
 'google-expired':'This Google sign-in attempt expired or could not be verified. Please start again.',
 'google-failed':'Could not complete Google sign-in. Please try again or use an email link.',
 'google-link-required':'Sign in with your password or email link first, then connect Google in Account. This verifies ownership of your non-Gmail email address.',
 'google-connected-elsewhere':'This Google account is already connected to another Watchtower account, or your account has a different Google sign-in. Use your password or email link.'
};
