import { NextResponse } from "next/server";
import { checkPassword,login,logout,sameOrigin } from "@/lib/auth";
import { z } from "zod";
const attempts=new Map<string,{count:number;since:number}>();
export async function POST(req:Request){if(!sameOrigin(req))return NextResponse.json({error:"잘못된 출처"},{status:403});const key=new URL(req.url).hostname;let a=attempts.get(key);if(!a||Date.now()-a.since>900000){a={count:0,since:Date.now()};attempts.set(key,a);}if(a.count>=10)return NextResponse.json({error:"15분 후 다시 시도해주세요"},{status:429});try{const {password}=z.object({password:z.string().max(200)}).parse(await req.json());a.count++;if(!checkPassword(password))return NextResponse.json({error:"비밀번호를 확인해주세요"},{status:401});await login();attempts.delete(key);return NextResponse.json({ok:true});}catch{return NextResponse.json({error:"로그인 입력 확인 필요"},{status:400});}}
export async function DELETE(req:Request){if(!sameOrigin(req))return NextResponse.json({error:"잘못된 출처"},{status:403});await logout();return NextResponse.json({ok:true});}
