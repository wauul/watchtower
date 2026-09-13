import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
const g=globalThis as unknown as {prisma?:PrismaClient};
export const db=g.prisma ?? new PrismaClient({adapter:new PrismaPg({connectionString:process.env.DATABASE_URL,max:3,connectionTimeoutMillis:10000})});
if(process.env.NODE_ENV!=='production') g.prisma=db;
