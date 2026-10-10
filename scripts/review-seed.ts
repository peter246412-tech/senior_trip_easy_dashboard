import "dotenv/config";
import { db,saveTrip } from "../src/lib/db";
import { tripSchema } from "../src/lib/validation";
import seed from "../prisma/seed-data.json";
// Apply factual source corrections only to researched seed IDs; preserve admin-created records.
async function main(){for(const raw of seed){if(raw.id.startsWith("real-")||raw.id.startsWith("demo-")){const t=tripSchema.parse(raw);await db.$transaction(tx=>saveTrip(t,tx));}}console.log("Reviewed source annotations and image paths applied.");}
main().finally(()=>db.$disconnect());
