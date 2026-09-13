export function money(value:number,currency:string){return new Intl.NumberFormat('en',{style:'currency',currency,maximumFractionDigits:2}).format(value);}
