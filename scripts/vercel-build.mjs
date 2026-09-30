import {spawnSync} from 'node:child_process';
import {migrationUrl} from './migration-url.mjs';

function run(script,args,env=process.env){
 const result=spawnSync(process.execPath,[script,...args],{stdio:'inherit',env});
 if(result.error){console.error(result.error.message);process.exit(1);}
 if(result.status!==0)process.exit(result.status??1);
}

// Production migrations use Vercel's secret store. Preview builds never migrate
// the shared database. A failed migration prevents production promotion.
if(process.env.VERCEL_ENV==='production'){
 for(const key of ['DATABASE_URL','AUTH_SECRET']){
  if(!process.env[key]){console.error(`Production requires ${key}`);process.exit(1);}
 }
 let directUrl;
 try{directUrl=migrationUrl(process.env.DATABASE_URL,process.env.DIRECT_DATABASE_URL);}catch(error){console.error(error.message);process.exit(1);}
 run('node_modules/prisma/build/index.js',['migrate','deploy'],{...process.env,DATABASE_URL:directUrl});
}
run('node_modules/prisma/build/index.js',['generate']);
run('node_modules/next/dist/bin/next',['build']);
