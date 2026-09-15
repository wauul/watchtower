import {PostgreSqlContainer} from '@testcontainers/postgresql';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import type {TestProject} from 'vitest/node';
export default async function setup(project:TestProject){
 // No env-provided DB URL is accepted; migrations can target only this disposable container.
 const container=await new PostgreSqlContainer('postgres:18-alpine').withDatabase('watchtower_test').withUsername('watchtower').withPassword('test-only-password').start();
 try{const url=container.getConnectionUri();execFileSync(process.execPath,[resolve('node_modules/prisma/build/index.js'),'migrate','deploy'],{env:{...process.env,DATABASE_URL:url},stdio:'pipe'});project.provide('databaseUrl',url);}
 catch(error){await container.stop();throw error;}
 return async()=>{await container.stop();};
}
