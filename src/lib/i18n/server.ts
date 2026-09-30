import {cookies} from 'next/headers';
import {languageCookie,normalizeLanguage,translator} from './index';

export function getLanguage(){return normalizeLanguage(cookies().get(languageCookie)?.value);}
export function getTranslator(){return translator(getLanguage());}
