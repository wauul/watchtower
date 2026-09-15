import {inject} from 'vitest';
process.env.DATABASE_URL=inject('databaseUrl');
declare module 'vitest' { export interface ProvidedContext { databaseUrl:string } }
