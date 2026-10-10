import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sameOrigin,sessionId } from "@/lib/auth";
export async function POST(req:Request){if(!sameOrigin(req))return NextResponse.json({error:"잘못된 출처"},{status:403});try{const {ids}=z.object({ids:z.array(z.string().max(80)).min(2).max(3).refine(a=>new Set(a).size===a.length)}).parse(await req.json());if(await db.travelProduct.count({where:{id:{in:ids}}})!==ids.length)throw new Error();const id=await sessionId();await db.comparisonHistory.deleteMany({where:{OR:[{sessionId:id},{expiresAt:{lt:new Date()}}]}});await db.comparisonHistory.create({data:{sessionId:id,productIds:ids,expiresAt:new Date(Date.now()+30*86400000)}});return NextResponse.json({ok:true});}catch{return NextResponse.json({error:"상품 2~3개를 선택해주세요"},{status:400});}}
