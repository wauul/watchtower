export function money(value:number,currency:string,locale='en-GB'){return new Intl.NumberFormat(locale,{style:'currency',currency,maximumFractionDigits:2}).format(value);}
