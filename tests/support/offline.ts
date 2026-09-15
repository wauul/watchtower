import {beforeEach,afterEach,vi} from 'vitest';
import http from 'node:http';
import https from 'node:https';
// Fail closed: a forgotten mock must fail locally and in CI, never contact a retailer/API.
for(const key of ['GROQ_API_KEY','TAVILY_API_KEY','GOOGLE_CSE_API_KEY','GOOGLE_CSE_ENGINE_ID','RESEND_API_KEY','ALLOWED_EMAIL'])delete process.env[key];
process.env.DATABASE_URL='postgresql://unused:unused@127.0.0.1:1/offline';
process.env.AUTH_SECRET='test-only-auth-secret';
process.env.CRON_SECRET='test-only-cron-secret';
process.env.APP_URL='https://watchtower.test';
beforeEach(()=>{
 const blocked=()=>{throw new Error('Unexpected network access: mock this dependency in the test');};
 vi.stubGlobal('fetch',vi.fn(blocked));
 for(const transport of [http,https]){vi.spyOn(transport,'get').mockImplementation(blocked);vi.spyOn(transport,'request').mockImplementation(blocked);}
});
afterEach(()=>{vi.restoreAllMocks();vi.unstubAllGlobals();vi.unstubAllEnvs();vi.useRealTimers();});
