import { NextResponse } from "next/server";
import { getTrips,saveTrip,db } from "@/lib/db";
import { isAdmin,sameOrigin } from "@/lib/auth";
import { tripSchema } from "@/lib/validation";
export const dynamic="force-dynamic";
export async function GET(){return NextResponse.json(await getTrips(),{headers:{"Cache-Control":"no-store"}});}
export async function POST(req:Request){if(!sameOrigin(req)||!await isAdmin())return NextResponse.json({error:"관리자 인증 필요"},{status:403});try{const data=tripSchema.parse(await req.json());if(await db.travelProduct.findUnique({where:{id:data.id}}))return NextResponse.json({error:"이미 사용 중인 ID"},{status:409});await db.$transaction(tx=>saveTrip(data,tx));return NextResponse.json({id:data.id},{status:201});}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"입력 오류"},{status:400});}}
