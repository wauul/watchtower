import {expect,test} from 'vitest';
import {migrationUrl} from '../../scripts/migration-url.mjs';

test('Neon migrations bypass pooling while preserving credentials, database, port and TLS',()=>{
 const runtime='postgresql://owner:p%40ss@ep-example-pooler.c-2.us-east-2.aws.neon.tech:5432/neondb?sslmode=require&channel_binding=require&pgbouncer=true';
 const direct=new URL(migrationUrl(runtime));
 expect(direct.hostname).toBe('ep-example.c-2.us-east-2.aws.neon.tech');
 expect(direct.username).toBe('owner');expect(direct.password).toBe('p%40ss');
 expect(direct.port).toBe('5432');expect(direct.pathname).toBe('/neondb');
 expect(direct.searchParams.get('sslmode')).toBe('require');expect(direct.searchParams.get('channel_binding')).toBe('require');
 expect(direct.searchParams.has('pgbouncer')).toBe(false);
 expect(runtime).toContain('-pooler.');
});
test('an explicit direct connection overrides the runtime connection',()=>{
 const direct='postgresql://migration:pass@direct.example/db?sslmode=require';
 expect(migrationUrl('postgresql://runtime:pass@pool.example/db',direct)).toBe(direct);
});
test('non-Neon runtime URLs are preserved without guessing another provider endpoint',()=>{
 const url='postgresql://owner:pass@db-pooler.example/db?sslmode=require';
 expect(migrationUrl(url)).toBe(url);
});
test('an already direct Neon connection is unchanged',()=>{
 const url='postgresql://owner:pass@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require';
 expect(migrationUrl(url)).toBe(url);
});
test('missing, malformed and non-Postgres URLs fail without exposing credentials',()=>{
 for(const value of [undefined,'private-credential-invalid','https://owner:private-credential@db.example']){
  expect(()=>migrationUrl(value)).toThrow(/migration database/);
  try{migrationUrl(value);}catch(error){expect((error as Error).message).not.toContain('private-credential');}
 }
});
