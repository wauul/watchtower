import {getTranslator} from '@/lib/i18n/server';
import {faqs} from '@/lib/site-content';
import {CodeSnippet} from '@/components/code-snippet';
import {FaqList} from '@/components/ui';
export function generateMetadata(){const t=getTranslator();return {title:t('Help & FAQ')};}
export default function Help(){
 const t=getTranslator();return <main className="dashboard prose-page"><h1>{t("A clearer picture")}<br/>{t("of how tracking works")}</h1><p>{t("What we observe, how alerts are judged, and where to check the details yourself.")}</p><FaqList items={faqs}/><section className="read-section"><h2>{t("For contributors")}</h2><p>{t("Install dependencies and configure your environment using the repository README before starting Watchtower locally.")}</p><CodeSnippet code={'npm ci\nnpm run dev'}/></section></main>;}
