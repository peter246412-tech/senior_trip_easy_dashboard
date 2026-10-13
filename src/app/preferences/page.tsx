import { getTrips } from "@/lib/db";
import { PreferenceForm } from "@/components/preference-form";
export const metadata={title:"부모님 맞춤 여행 찾기"};
export default async function Page({searchParams}:{searchParams:Promise<{demo?:string}>}){return <PreferenceForm presentation={(await searchParams).demo==="1"} trips={await getTrips()}/>;}
