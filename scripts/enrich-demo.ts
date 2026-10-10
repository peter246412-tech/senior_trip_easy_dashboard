import { PrismaClient } from "@prisma/client";
import seed from "../prisma/seed-data.json";
const db=new PrismaClient();
async function main(){let count=0;for(const t of seed.filter(x=>x.isDemo)){const current=await db.travelProduct.findUnique({where:{id:t.id}});if(current&&current.flights===null){await db.travelProduct.update({where:{id:t.id},data:{flights:t.flights,placeListComplete:true}});count++;}}console.log(`항공 시연 정보 추가: ${count}개 (기존 입력 정보 유지)`);}
main().finally(()=>db.$disconnect());
