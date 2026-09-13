import {redirect} from 'next/navigation';
import {sessionEmail} from '@/lib/auth';
import {AccessForm} from '@/components/forms';
export default function Login(){if(sessionEmail())redirect('/account');return <main className="access"><span className="eyebrow">YOUR WATCHTOWER ACCOUNT</span><h1>Welcome to your lookout.</h1><p>Sign in or create an account with your email. We’ll send a private sign-in link—no password to remember.</p><AccessForm/><p className="subtle">Your watchlist stays private. Share a find only when you choose.</p></main>;}
