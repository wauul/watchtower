import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePrice,publicAddress,safeUrl,extract } from '../src/lib/scrape';
import { tokenFor,verifyToken } from '../src/lib/auth';
test('localized prices and missing prices',()=>{assert.equal(parsePrice('£1,234.56'),1234.56);assert.equal(parsePrice('1.234,56 €'),1234.56);assert.equal(parsePrice('Unavailable'),null);assert.equal(parsePrice('0'),null);});
test('blocks private and mapped IP destinations',()=>{for(const ip of ['127.0.0.1','10.0.0.1','169.254.169.254','::1','::ffff:127.0.0.1','192.168.1.1'])assert.equal(publicAddress(ip),false);assert.equal(publicAddress('8.8.8.8'),true);assert.throws(()=>safeUrl('http://example.com'));assert.throws(()=>safeUrl('https://user:pass@example.com'));});
test('JSON-LD keeps sale price, currency, and availability together',()=>{const p=extract('<script type="application/ld+json">{"@graph":[{"@type":"Product","name":"Test camera","offers":{"price":"399.95","priceCurrency":"EUR","availability":"https://schema.org/OutOfStock"}}]}</script>','https://example.com');assert.equal(p.price,399.95);assert.equal(p.currency,'EUR');assert.equal(p.stock,'out_of_stock');});
test('tampered magic links fail closed',()=>{process.env.AUTH_SECRET='unit-test-secret-not-for-production';const t=tokenFor('one@example.com');assert.equal(verifyToken(t),'one@example.com');assert.equal(verifyToken(t.slice(0,-5)+'xxxxx'),null);assert.equal(verifyToken('invalid'),null);});
