import { NextResponse } from "next/server";
import { db,getTrip,saveTrip } from "@/lib/db";
import { isAdmin,sameOrigin } from "@/lib/auth";
import { tripSchema } from "@/lib/validation";
type Context={params:Promise<{id:string}>};
export async function GET(_req:Request,c:Context){const t=await getTrip((await c.params).id);return t?NextResponse.json(t):NextResponse.json({error:"상품 없음"},{status:404});}
export async function PUT(req:Request,c:Context){if(!sameOrigin(req)||!await isAdmin())return NextResponse.json({error:"관리자 인증 필요"},{status:403});try{const id=(await c.params).id;if(!await getTrip(id))return NextResponse.json({error:"상품 없음"},{status:404});const t=tripSchema.parse({...await req.json(),id});await db.$transaction(tx=>saveTrip(t,tx));return NextResponse.json({id});}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"입력 오류"},{status:400});}}
export async function DELETE(req:Request,c:Context){if(!sameOrigin(req)||!await isAdmin())return NextResponse.json({error:"관리자 인증 필요"},{status:403});const id=(await c.params).id;await db.travelProduct.deleteMany({where:{id}});return NextResponse.json({deleted:id});}
