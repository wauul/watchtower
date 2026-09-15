import {randomBytes,scrypt as derive,timingSafeEqual} from 'node:crypto';
function scrypt(password:string,salt:string):Promise<Buffer>{return new Promise((resolve,reject)=>derive(password,salt,64,{N:16384,r:8,p:1},(error,key)=>error?reject(error):resolve(key)));}
export async function hashPassword(password:string){const salt=randomBytes(16).toString('hex');return 'scrypt:'+salt+':'+(await scrypt(password,salt)).toString('hex');}
export async function checkPassword(password:string,encoded:string){const [kind,salt,hash]=encoded.split(':');if(kind!=='scrypt'||!salt||!hash)return false;const actual=await scrypt(password,salt);const expected=Buffer.from(hash,'hex');return actual.length===expected.length&&timingSafeEqual(actual,expected);}
// Nonexistent accounts still perform the same expensive derivation.
export const dummyHash='scrypt:00000000000000000000000000000000:'+ '00'.repeat(64);
