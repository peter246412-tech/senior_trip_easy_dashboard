import { NextResponse } from "next/server";
import { z } from "zod";
import { getTrips } from "@/lib/db";
import { sameOrigin } from "@/lib/auth";
export async function POST(req:Request){if(!sameOrigin(req))return NextResponse.json({error:"잘못된 출처"},{status:403});try{const {ids}=z.object({ids:z.array(z.string().max(80)).min(2).max(3).refine(a=>new Set(a).size===a.length)}).parse(await req.json());const trips=await getTrips();if(!ids.every(id=>trips.some(t=>t.id===id)))throw Error();return NextResponse.json({ok:true,storage:"browser"});}catch{return NextResponse.json({error:"상품 2~3개를 선택해주세요"},{status:400});}}
