export async function isAdmin(){return false;}
export function sameOrigin(request:Request){
 const origin=request.headers.get("origin");if(!origin)return false;
 try{const parsed=new URL(origin);const url=new URL(request.url);const host=request.headers.get("host")??url.host;
 return parsed.host===host && (parsed.protocol===url.protocol || (process.env.VERCEL === "1" && parsed.protocol === "https:"));
 }catch{return false;}
}
