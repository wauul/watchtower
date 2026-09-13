import { db } from './db';
import { scrape } from './scrape';
import { analyze } from './ai';
import { alternatives } from './search';
import { email,dashboardLink } from './email';
export async function checkProduct(id:string){
 const product=await db.product.findUniqueOrThrow({where:{id},include:{history:{orderBy:{checkedAt:'asc'}},analyses:{where:{notifiedAt:{not:null}},orderBy:{createdAt:'desc'},take:1}}});
 const current=await scrape(product.url);if(current.currency!==product.currency)throw new Error('Retailer currency changed; check the listing');
 await db.product.update({where:{id},data:{stock:current.stock,imageUrl:current.imageUrl,lastCheckedAt:new Date(),lastError:null,history:{create:{price:current.price,stock:current.stock}}}});
 const history=[...product.history.map(h=>({price:Number(h.price),checkedAt:h.checkedAt.toISOString()})),{price:current.price,checkedAt:new Date().toISOString()}];
 const judgment=await analyze({name:product.name,history,currentPrice:current.price,targetPrice:product.targetPrice?Number(product.targetPrice):null,stock:current.stock,previousStock:product.stock});
 const previous=product.history.at(-1);const restock=product.stock==='out_of_stock'&&current.stock==='in_stock';
 const targetCrossed=product.targetPrice&&current.price<=Number(product.targetPrice)&&previous&&Number(previous.price)>Number(product.targetPrice);
 const drop=previous&&current.price<Number(previous.price)*0.97;
 const recent=product.analyses[0]?.notifiedAt && Date.now()-product.analyses[0].notifiedAt.getTime()<86400000;
 judgment.worthNotifying=judgment.worthNotifying&&Boolean(restock||targetCrossed||drop)&&!recent;
 const analysis=await db.dealAnalysis.create({data:{productId:id,...judgment}});
 if(judgment.worthNotifying){
 let options:Awaited<ReturnType<typeof alternatives>>=[];let searchNote='';
 try{options=await alternatives(product.name,product.country,product.currency);if(!process.env.TAVILY_API_KEY&&!process.env.GOOGLE_CSE_API_KEY)searchNote='Alternative search is not configured.';}catch{searchNote='Alternative search was unavailable for this check.';}
 if(options.length)await db.alternativeDeal.createMany({data:options.map(o=>({...o,productId:id,dealAnalysisId:analysis.id}))});
 const cheaper=options.filter(o=>o.price!==null&&o.price<current.price).length;
 await email(product.email,`${judgment.verdict==='great deal'?'🟢':'🔎'} ${judgment.verdict} on ${product.name}${cheaper?` — plus ${cheaper} cheaper options`:''}`,`${judgment.verdict.toUpperCase()}\n${product.name}: ${current.price} ${product.currency}\n\n${judgment.reasoning}\nConfidence: ${judgment.confidence}\n\n${options.map(o=>`${o.retailer} — ${o.price===null?'Price unavailable':o.price+' '+product.currency}\n${o.url}\n${o.shipsToUser==='yes'?'Shipping indicated by search snippet; confirm at checkout.':'Unverified — check at checkout'}`).join('\n\n')}\n${searchNote}\n\nYour dashboard: ${dashboardLink(product.email)}\n\nWe watch the price. You make the call.`,analysis.id);
 await db.dealAnalysis.update({where:{id:analysis.id},data:{notifiedAt:new Date()}});
 }
 return {id,verdict:judgment.verdict,notified:judgment.worthNotifying};
}
