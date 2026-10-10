import "dotenv/config";
import { db,saveTrip } from "../src/lib/db";
import { tripSchema } from "../src/lib/validation";
import data from "./seed-data.json";
async function main(){let added=0;for(const item of data){const trip=tripSchema.parse(item);if(!await db.travelProduct.findUnique({where:{id:trip.id}})){await db.$transaction(tx=>saveTrip(trip,tx));added++;}}console.log(`Seed: ${added} added; existing records preserved.`);}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>db.$disconnect());
