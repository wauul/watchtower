import {db} from './db';
export function accountFor(email:string){return db.user.upsert({where:{email},create:{email},update:{}});}
