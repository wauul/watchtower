import {expect,test,vi} from 'vitest';
import {localeFor,normalizeLanguage,translator} from '../../src/lib/i18n';
import {money} from '../../src/lib/format';
const preference=vi.hoisted(()=>({value:undefined as string|undefined}));
vi.mock('next/headers',()=>({cookies:()=>({get:()=>preference.value===undefined?undefined:{value:preference.value}})}));
import {getLanguage,getTranslator} from '../../src/lib/i18n/server';

test('only supported languages are accepted from stored preferences',()=>{
 expect(normalizeLanguage('fr')).toBe('fr');
 for(const value of ['en','de','FR','',null,undefined,'<script>'])expect(normalizeLanguage(value)).toBe('en');
});

test('French translates interface text and preserves unknown shopper content',()=>{
 const t=translator('fr');
 expect(t('Track a product')).toBe('Suivre un produit');
 expect(t('Your watchlist')).toBe('Votre liste');
 expect(t(' Sign in ')).toBe(' Se connecter ');
 expect(t('A shopper’s personal product note')).toBe('A shopper’s personal product note');
 expect(t('toString')).toBe('toString');
 expect(t(120)).toBe(120);
 expect(t('Could not find a reliable price on this page')).toBe('Impossible de trouver un prix fiable sur cette page');
 expect(t('Retailer returned HTTP 429')).toBe('Le marchand a renvoyé le code HTTP 429');
 expect(t('Saved 3 possible alternative listings.')).toBe('3 offres alternatives possibles enregistrées.');
});

test('English preserves source copy and both locales format currency correctly',()=>{
 expect(translator('en')('Track a product')).toBe('Track a product');
 expect(localeFor('en')).toBe('en-GB');
 expect(localeFor('fr')).toBe('fr-FR');
 expect(money(1234.5,'EUR',localeFor('fr'))).toBe(new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(1234.5));
 expect(money(1234.5,'EUR',localeFor('en'))).not.toBe(money(1234.5,'EUR',localeFor('fr')));
});

test('server translations follow the current request cookie without sharing locale state',()=>{
 preference.value='fr';
 expect(getLanguage()).toBe('fr');
 expect(getTranslator()('Sign in')).toBe('Se connecter');
 preference.value='en';
 expect(getTranslator()('Sign in')).toBe('Sign in');
 preference.value='unsupported';
 expect(getLanguage()).toBe('en');
 preference.value=undefined;
 expect(getLanguage()).toBe('en');
});
