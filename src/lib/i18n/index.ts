import french from './fr.json';

export type Language='en'|'fr';
export const languageCookie='watchtower-language';
export function normalizeLanguage(value:unknown):Language{return value==='fr'?'fr':'en';}
export function localeFor(language:Language){return language==='fr'?'fr-FR':'en-GB';}
export function translator(language:Language){
 return function t<T>(value:T):T{
  if(language!=='fr'||typeof value!=='string')return value;
  const dictionary:Record<string,string>=french;
  if(Object.prototype.hasOwnProperty.call(dictionary,value))return dictionary[value] as T;
  const trimmed=value.trim();
  if(Object.prototype.hasOwnProperty.call(dictionary,trimmed))return value.replace(trimmed,dictionary[trimmed]) as T;
  // These messages contain API-supplied counts/status codes rather than UI copy.
  const patterns:[RegExp,(match:RegExpMatchArray)=>string][]=[
   [/^Saved (\d+) possible alternative listings\.$/,match=>`${match[1]} offres alternatives possibles enregistrées.`],
   [/^Retailer returned HTTP (\d+)$/,match=>`Le marchand a renvoyé le code HTTP ${match[1]}`],
   [/^AI service returned (\d+)$/,match=>`Le service d’IA a renvoyé le code ${match[1]}`],
   [/^Email delivery failed \((\d+)\)$/,match=>`Échec de l’envoi de l’e-mail (${match[1]})`],
  ];
  for(const [pattern,format] of patterns){const match=value.match(pattern);if(match)return format(match) as T;}
  return value;
 };
}
