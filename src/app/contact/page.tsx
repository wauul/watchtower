import {getTranslator} from '@/lib/i18n/server';
import {outbound} from '@/lib/outbound';
import {ExternalCue} from '@/components/ui';
export function generateMetadata(){const t=getTranslator();return {title:t('Contact')};}
export default function Contact(){
 const t=getTranslator();return <main className="dashboard prose-page"><h1>{t("Help us improve")}<br/>{t("the lookout")}</h1><p>{t("Report a problem or suggest a feature on our public GitHub repository. You’ll need a GitHub account.")}</p><a className="primary" href={outbound('https://github.com/wauul/watchtower/issues/new')} target="_blank" rel="noopener noreferrer">{t("Open a GitHub issue")} <ExternalCue/></a><section className="read-section contact-guidance"><h2>{t("Give us a clear observation")}</h2><ul><li>{t("The Watchtower page you were using")}</li><li>{t("What you expected to happen")}</li><li>{t("What happened instead, including any error message")}</li></ul><p>{t("Issues are public. Leave out passwords, sign-in links, API keys and personal information.")}</p></section></main>;}
