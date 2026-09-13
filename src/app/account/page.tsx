import Link from 'next/link';
import {redirect} from 'next/navigation';
import {sessionEmail} from '@/lib/auth';
import {accountFor} from '@/lib/account';
import {db} from '@/lib/db';
import {AccountForm} from '@/components/account-form';
export const dynamic='force-dynamic';
export default async function Account(){const email=sessionEmail();if(!email)redirect('/login');const user=await accountFor(email);const finds=await db.sharedFind.findMany({where:{userId:user.id,published:true},select:{id:true,productId:true,name:true}});return <main className="dashboard"><div className="page-heading"><div><span className="eyebrow">YOUR ACCOUNT</span><h1>Make yourself at home.</h1><p>Signed in as {email}</p></div><form action="/api/logout" method="POST"><button className="secondary">Sign out</button></form></div><div className="detail-grid"><section className="panel"><AccountForm name={user.displayName}/></section><section className="panel"><h2>Your shared finds</h2>{finds.length?finds.map(f=><Link className="alternative" key={f.id} href={`/product/${f.productId}`}>{f.name} →</Link>):<p className="subtle">Nothing shared yet. Open a tracked product to publish your first find.</p>}<Link className="text-link" href="/dashboard">Open your private watchlist →</Link></section></div></main>;}
