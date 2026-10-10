import { isAdmin } from "@/lib/auth";
import { getTrips } from "@/lib/db";
import { Admin,AdminLogin } from "@/components/admin";
export const dynamic="force-dynamic";
export const metadata={title:"관리자",robots:{index:false,follow:false}};
export default async function Page(){return await isAdmin()?<Admin initialTrips={await getTrips()}/>:<AdminLogin/>;}
