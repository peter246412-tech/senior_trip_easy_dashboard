import { notFound } from "next/navigation";
import { getTrip } from "@/lib/db";
import { Parents } from "@/components/parents";
export const dynamic="force-dynamic";
export const metadata={title:"부모님께 보여드리기"};
export default async function Page({params}:{params:Promise<{id:string}>}){const t=await getTrip((await params).id);if(!t)notFound();return <Parents trip={t}/>;}
