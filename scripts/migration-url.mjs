/** @param {string | undefined} runtimeUrl @param {string | undefined} [directUrl] */
export function migrationUrl(runtimeUrl,directUrl){
 const source=directUrl||runtimeUrl;
 if(!source)throw new Error('A migration database URL is required');
 let url;
 try{url=new URL(source);}catch{throw new Error('Invalid migration database URL');}
 if(!['postgres:','postgresql:'].includes(url.protocol))throw new Error('Invalid migration database protocol');
 // Neon exposes its direct endpoint by removing the pooler suffix. Runtime
 // traffic continues using the original pooled URL; only migrations use this.
 if(url.hostname.endsWith('.neon.tech')){
  url.hostname=url.hostname.replace(/-pooler(?=\.)/,'');
  url.searchParams.delete('pgbouncer');
  return url.toString();
 }
 return source;
}
