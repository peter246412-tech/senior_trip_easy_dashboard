import { NextResponse } from "next/server";
import { sameOrigin } from "@/lib/auth";
import { preferenceSchema } from "@/lib/validation";
export async function POST(req:Request){if(!sameOrigin(req))return NextResponse.json({error:"잘못된 출처"},{status:403});try{preferenceSchema.parse(await req.json());return NextResponse.json({ok:true,storage:"browser"});}catch{return NextResponse.json({error:"여행 조건을 확인해주세요"},{status:400});}}
