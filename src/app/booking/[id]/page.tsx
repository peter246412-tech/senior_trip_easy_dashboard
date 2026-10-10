import { notFound } from "next/navigation";
import Link from "next/link";
import { getTrip } from "@/lib/db";
import { DemoBooking } from "@/components/demo-booking";
export const dynamic="force-dynamic";
export const metadata={title:"여행 예약 시연"};
export default async function Page({params}:{params:Promise<{id:string}>}){const t=await getTrip((await params).id);if(!t)notFound();if(!t.isDemo)return <section className="container page-section"><div className="panel"><h1>여행사에서 최신 조건을 확인하고 예약하세요</h1><p>실제 상품의 예약·결제는 여행사에서 진행합니다.</p>{t.sourceUrl&&<a className="button button-primary" href={t.sourceUrl} target="_blank" rel="noopener noreferrer">여행사 예약 페이지 열기 ↗</a>}<Link className="text-link" href={`/trips/${t.id}`}>상품 상세로 돌아가기</Link></div></section>;return <DemoBooking trip={t}/>;}
