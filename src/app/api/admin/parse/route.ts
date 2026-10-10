import { NextResponse } from "next/server";
import { isAdmin,sameOrigin } from "@/lib/auth";
import { itineraryParser } from "@/lib/parser";
import { z } from "zod";
export async function POST(req:Request){if(!sameOrigin(req)||!await isAdmin())return NextResponse.json({error:"관리자 인증 필요"},{status:403});try{const {text}=z.object({text:z.string().min(1).max(10000)}).parse(await req.json());return NextResponse.json(await itineraryParser.parse(text));}catch{return NextResponse.json({error:"1~10,000자 일정표를 입력해주세요"},{status:400});}}
