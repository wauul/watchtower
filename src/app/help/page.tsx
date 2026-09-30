import {faqs} from '@/lib/site-content';
import {CodeSnippet} from '@/components/code-snippet';
import {FaqList} from '@/components/ui';
export const metadata={title:'Help & FAQ'};
export default function Help(){return <main className="dashboard prose-page"><h1>A clearer picture<br/>of how tracking works</h1><p>What we observe, how alerts are judged, and where to check the details yourself.</p><FaqList items={faqs}/><section className="read-section"><h2>For contributors</h2><p>Install dependencies and configure your environment using the repository README before starting Watchtower locally.</p><CodeSnippet code={'npm ci\nnpm run dev'}/></section></main>;}
