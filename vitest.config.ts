import {defineConfig} from 'vitest/config';
import {fileURLToPath} from 'node:url';
const alias={'@':fileURLToPath(new URL('./src',import.meta.url))};
export default defineConfig({
 resolve:{alias},
 test:{
  fileParallelism:false,maxWorkers:2,coverage:{provider:'v8',include:['src/lib/{scrape,ai,check,search,auth,http,format}.ts','src/app/api/products/**/*.ts','src/app/api/cron/check-prices/route.ts'],reporter:['text','html','lcov'],reportsDirectory:'coverage'},
  projects:[
   {resolve:{alias},test:{name:'unit',include:['tests/unit/**/*.test.ts'],setupFiles:['tests/support/offline.ts'],clearMocks:true}},
   {resolve:{alias},test:{name:'integration',include:['tests/integration/**/*.test.ts'],globalSetup:['tests/support/postgres.ts'],setupFiles:['tests/support/offline.ts','tests/support/database-env.ts'],hookTimeout:120000,testTimeout:15000}}
  ]
 }
});

