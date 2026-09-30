export function GoogleSignIn({connecting=false}:{connecting?:boolean}){
 return <a href="/api/auth/google" className="google-sign-in"><span className="google-logo" aria-hidden="true"><img src="/google-sign-in-icon.png" width="40" height="40" alt=""/></span><span>{connecting?'Connect Google':'Continue with Google'}</span></a>;
}
