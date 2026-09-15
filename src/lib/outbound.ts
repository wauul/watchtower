/** Keep attribution on navigation only; never modify the URL used by the scraper. */
export function outbound(url:string){try{const u=new URL(url);if(!['https:','http:'].includes(u.protocol))return url;u.searchParams.set('utm_source','watchtower');u.searchParams.set('utm_medium','referral');u.searchParams.set('utm_campaign','community');return u.toString();}catch{return url;}}
