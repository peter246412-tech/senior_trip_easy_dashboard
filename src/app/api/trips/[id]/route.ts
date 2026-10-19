import { NextResponse } from "next/server";
import { getTrip } from "@/lib/db";
export async function GET(_req:Request,c:{params:Promise<{id:string}>}){const t=await getTrip((await c.params).id);return t?NextResponse.json(t):NextResponse.json({error:"상품 없음"},{status:404});}
export async function PUT(){return NextResponse.json({error:"발표용 사이트는 읽기 전용입니다."},{status:403});}
export const DELETE=PUT;
