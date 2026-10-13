import { getTrips } from "@/lib/db";
import { TripsDashboard } from "@/components/trips-dashboard";
export const dynamic="force-dynamic";
export const metadata={title:"국내외 여행상품 찾기"};
export default async function Page({searchParams}:{searchParams:Promise<{recommended?:string;demo?:string}>}){return <TripsDashboard trips={await getTrips()} recommended={(await searchParams).recommended==="1"} presentation={(await searchParams).demo==="1"}/>;}
