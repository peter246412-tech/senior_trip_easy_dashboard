import { PrismaClient, Prisma } from "@prisma/client";
import type { Trip } from "./types";
import { presentationDemos } from "./presentation-data";
import { parseItinerary } from "./parser";
const globalForPrisma=globalThis as unknown as {prisma:PrismaClient};
export const db=globalForPrisma.prisma??new PrismaClient();
if(process.env.NODE_ENV!=="production")globalForPrisma.prisma=db;
const include={agency:true,departures:true,itinerary:{include:{stops:true},orderBy:{day:"asc" as const}},mobility:true,sources:{orderBy:{checkedAt:"desc" as const}}};
type Row = Prisma.TravelProductGetPayload<{include:typeof include}>;
function toTrip(r:Row):Trip { const d=r.departures[0],s=r.sources[0];const empty={value:null,status:"unknown" as const,evidence:""};return {id:r.id,name:r.name,agency:r.agency.name,country:r.country,originCountry:r.originCountry,currency:r.currency,region:r.region,days:r.days,price:r.price,priceBasis:r.priceBasis,priceCheckedAt:r.priceCheckedAt.toISOString(),departureDate:d?.departureDate??null,airport:d?.airport??null,peopleMin:d?.peopleMin??null,sourceUrl:r.sourceUrl,checkedAt:s?.checkedAt.toISOString()??r.updatedAt.toISOString(),sourceNote:s?.note??"",verified:r.verified,isDemo:r.isDemo,image:r.image,styles:r.styles as string[],places:r.places as string[],presentationDemo:(r.presentationDemo??presentationDemos[r.id]??null) as unknown as Trip["presentationDemo"],meals:r.meals as unknown as Trip["meals"],flights:(r.flights??[]) as unknown as Trip["flights"],placeListComplete:r.placeListComplete,hotel:r.hotel,airline:r.airline,onsen:r.onsen,onsenEvidence:r.onsenEvidence,shopping:r.shopping,optionalCost:r.optionalCost,included:r.included,excluded:r.excluded,cancellation:r.cancellation,walking:(r.mobility?.walking??empty) as unknown as Trip["walking"],vehicle:(r.mobility?.vehicle??empty) as unknown as Trip["vehicle"],rest:(r.mobility?.rest??empty) as unknown as Trip["rest"],stairs:(r.mobility?.stairs??empty) as unknown as Trip["stairs"],itinerary:r.itinerary.map(d=>({day:d.day,text:d.text,stops:d.stops.sort((a,b)=>a.order-b.order).map(s=>s.name)})),updatedAt:r.updatedAt.toISOString()}; }
export async function getTrips(){return (await db.travelProduct.findMany({include,orderBy:{isDemo:"asc"}})).map(toTrip);}
export async function getTrip(id:string){const row=await db.travelProduct.findUnique({where:{id},include});return row?toTrip(row):null;}
export async function saveTrip(t:Trip,tx:Prisma.TransactionClient=db){const {id,agency,walking,vehicle,rest,stairs,itinerary,departureDate,airport,peopleMin,checkedAt,sourceNote,updatedAt,meals,presentationDemo,...data}=t;void updatedAt;
 const mealData={...(meals===undefined?{}:{meals:meals===null?Prisma.DbNull:meals}),...(presentationDemo===undefined?{}:{presentationDemo:presentationDemo===null?Prisma.DbNull:presentationDemo})};
 const a=await tx.travelAgency.upsert({where:{name:agency},create:{name:agency},update:{}});
 await tx.travelProduct.upsert({where:{id},create:{id,...data,...mealData,flights:data.flights??[],placeListComplete:data.placeListComplete??false,priceCheckedAt:new Date(data.priceCheckedAt),agencyId:a.id},update:{...data,...mealData,flights:data.flights??[],placeListComplete:data.placeListComplete??false,priceCheckedAt:new Date(data.priceCheckedAt),agencyId:a.id}});
 await tx.departureOption.deleteMany({where:{productId:id}});await tx.itineraryDay.deleteMany({where:{productId:id}});await tx.dataSource.deleteMany({where:{productId:id}});
 await tx.departureOption.create({data:{productId:id,departureDate,airport,peopleMin,price:t.price}});
 await tx.mobilityAssessment.upsert({where:{productId:id},create:{productId:id,walking,vehicle,rest,stairs},update:{walking,vehicle,rest,stairs}});
 await tx.dataSource.create({data:{productId:id,url:t.sourceUrl,checkedAt:new Date(checkedAt),note:sourceNote,collectionMethod:t.isDemo?"demo":"manual-research"}});
 for(const d of itinerary){const analysis=parseItinerary(d.text);await tx.itineraryDay.create({data:{productId:id,day:d.day,text:d.text,analysis,stops:{create:d.stops.map((name,order)=>({name,order,evidence:d.text,confidence:0.9,status:t.isDemo?"demo":"confirmed"}))}}});}
 return id;
}
