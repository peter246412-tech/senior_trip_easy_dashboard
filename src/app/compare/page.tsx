import { getTrips } from "@/lib/db";
import { Compare } from "@/components/compare";
export const dynamic="force-dynamic";
export const metadata={title:"여행상품 비교"};
export default async function Page({searchParams}:{searchParams:Promise<{ids?:string}>}){const raw=(await searchParams).ids??"";return <Compare trips={await getTrips()} initialIds={[...new Set(raw.split(",").filter(Boolean))].slice(0,3)}/>;}
