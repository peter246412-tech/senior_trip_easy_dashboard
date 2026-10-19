import { NextResponse } from "next/server";
import { getTrips } from "@/lib/db";
export async function GET(){return NextResponse.json(await getTrips());}
export async function POST(){return NextResponse.json({error:"발표용 사이트는 읽기 전용입니다."},{status:403});}
