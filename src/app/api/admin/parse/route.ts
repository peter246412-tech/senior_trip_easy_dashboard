import { NextResponse } from "next/server";
export async function POST(){return NextResponse.json({error:"발표용 사이트에서는 상품을 수정할 수 없습니다."},{status:403});}
