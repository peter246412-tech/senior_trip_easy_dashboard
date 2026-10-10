import { cookies } from "next/headers";
import { createHmac,randomBytes,timingSafeEqual,scryptSync } from "node:crypto";
const cookieName="easytrip_admin";
function secret(){const s=process.env.AUTH_SECRET;if(!s||s.length<32)throw new Error("AUTH_SECRET을 32자 이상으로 설정해주세요");return s;}
function sign(s:string){return createHmac("sha256",secret()).update(s).digest("hex");}
export function checkPassword(value:string){const password=process.env.ADMIN_PASSWORD;if(!password||password.length<12)return false;const salt="easytrip-admin-v1";return timingSafeEqual(scryptSync(value,salt,32),scryptSync(password,salt,32));}
export async function isAdmin(){const token=(await cookies()).get(cookieName)?.value;if(!token)return false;const [expires,nonce,sig]=token.split(".");if(!expires||!nonce||!sig||Number(expires)<Date.now())return false;const expected=sign(`${expires}.${nonce}`);return sig.length===expected.length&&timingSafeEqual(Buffer.from(sig),Buffer.from(expected));}
export async function login(){const payload=`${Date.now()+8*60*60*1000}.${randomBytes(16).toString("hex")}`;(await cookies()).set(cookieName,`${payload}.${sign(payload)}`,{httpOnly:true,sameSite:"strict",secure:process.env.NODE_ENV==="production"&&process.env.COOKIE_SECURE==="true",path:"/",maxAge:28800});}
export async function logout(){(await cookies()).delete(cookieName);}
export function sameOrigin(request:Request){const origin=request.headers.get("origin");if(!origin)return false;try{const parsed=new URL(origin);if(process.env.APP_ORIGIN)return parsed.origin===new URL(process.env.APP_ORIGIN).origin;const requestUrl=new URL(request.url);const host=request.headers.get("host")??requestUrl.host;return parsed.host===host&&parsed.protocol===requestUrl.protocol;}catch{return false;}}
export async function sessionId(){const jar=await cookies();let id=jar.get("easytrip_session")?.value;if(!id||!/^[a-f0-9]{32}$/.test(id)){id=randomBytes(16).toString("hex");jar.set("easytrip_session",id,{httpOnly:true,sameSite:"lax",path:"/",maxAge:86400*30,secure:process.env.COOKIE_SECURE==="true"});}return id;}
