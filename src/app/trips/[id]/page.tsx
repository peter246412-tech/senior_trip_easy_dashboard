import { notFound } from "next/navigation";
import { getTrip } from "@/lib/db";
import { TripDetail } from "@/components/trip-detail";
export const dynamic="force-dynamic";
export default async function Page({params}:{params:Promise<{id:string}>}){const t=await getTrip((await params).id);if(!t)notFound();return <TripDetail trip={t}/>;}
