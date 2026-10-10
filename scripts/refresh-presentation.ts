import "dotenv/config";
import { db,saveTrip } from "../src/lib/db";
import { tripSchema } from "../src/lib/validation";
import seed from "../prisma/seed-data.json";
// Explicitly requested fictional presentation refresh; preserve all real and admin-created records.
async function main(){let count=0;for(const raw of seed.filter(x=>x.isDemo)){const t=tripSchema.parse(raw);const current=await db.travelProduct.findUnique({where:{id:t.id}});if(current?.isDemo){await db.$transaction(tx=>saveTrip(t,tx));count++;}}console.log(`가상 시연 상품 ${count}개 업데이트. 실제 상품은 유지했습니다.`);}
main().finally(()=>db.$disconnect());
