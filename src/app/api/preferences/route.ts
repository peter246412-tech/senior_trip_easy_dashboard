import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sameOrigin,sessionId } from "@/lib/auth";
import { preferenceSchema } from "@/lib/validation";
export async function POST(req:Request){if(!sameOrigin(req))return NextResponse.json({error:"잘못된 출처"},{status:403});try{const data=preferenceSchema.parse(await req.json());const id=await sessionId();await db.userPreference.deleteMany({where:{OR:[{sessionId:id},{expiresAt:{lt:new Date()}}]}});await db.userPreference.create({data:{sessionId:id,data,expiresAt:new Date(Date.now()+30*86400000)}});return NextResponse.json({ok:true});}catch{return NextResponse.json({error:"여행 조건을 확인해주세요"},{status:400});}}
