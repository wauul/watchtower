import {Prisma} from '@prisma/client';
import {db} from './db';
export type DealSort='recent'|'liked'|'discount';
export function dealSort(value:unknown):DealSort{return value==='liked'||value==='discount'?value:'recent';}
export function discountSnapshot(prices:number[]){const first=prices[0],current=prices.at(-1);if(prices.length<2||!first||first<=0||current===undefined||!Number.isFinite(first)||!Number.isFinite(current))return {referencePrice:null,discountPercent:null};return {referencePrice:first,discountPercent:Math.max(0,Math.round((first-current)/first*10000)/100)};}
export async function dealFeed(sort:DealSort,userId?:string){
 // Ranking happens across all published finds before limiting, not just the newest page.
 const ranked=await db.$queryRaw<{id:string;likes:number;dislikes:number}[]>(Prisma.sql`SELECT f.id, COUNT(v.id) FILTER (WHERE v.value=1)::int AS likes, COUNT(v.id) FILTER (WHERE v.value=-1)::int AS dislikes FROM "SharedFind" f LEFT JOIN "DealVote" v ON v."findId"=f.id WHERE f.published=true GROUP BY f.id ORDER BY ${sort==='liked'?Prisma.sql`COUNT(v.id) FILTER (WHERE v.value=1) DESC,`:sort==='discount'?Prisma.sql`f."discountPercent" DESC NULLS LAST,`:Prisma.empty} f."createdAt" DESC, f.id DESC LIMIT 60`);
 const finds=await db.sharedFind.findMany({where:{published:true,id:{in:ranked.map(r=>r.id)}},select:{id:true,name:true,url:true,imageUrl:true,price:true,currency:true,note:true,createdAt:true,updatedAt:true,referencePrice:true,discountPercent:true,user:{select:{displayName:true}},votes:{where:{userId:userId||''},select:{value:true}}}});
 const byId=new Map(finds.map(f=>[f.id,f]));return ranked.flatMap(r=>{const f=byId.get(r.id);return f?[{...f,likes:r.likes,dislikes:r.dislikes,myVote:f.votes[0]?.value||0}]:[];});
}
