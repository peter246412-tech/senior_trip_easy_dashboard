import { getTrips } from "@/lib/db";
import { Home } from "@/components/home";
export const dynamic="force-dynamic";
export default async function Page(){return <Home trips={await getTrips()}/>;}
