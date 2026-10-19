"use client";
import { tripPhoto } from "@/lib/travel-photos";
import { CardFacts } from "./card-facts";
import { metricDisplay } from "@/lib/data-state";
import { countryName } from "@/lib/destinations";
import { flightSummary } from "@/lib/travel-info";
import { conciseCopy } from "@/lib/presentation-copy";
import Link from "next/link";
import { Footprints,Bus,Armchair,ArrowUpRight,Plus,Check,Crown,ArrowRight } from "lucide-react";
import { Trip,money } from "@/lib/types";
import { recommend,tiedScoreDifferences } from "@/lib/recommend";
import { useTripContext } from "./provider";
export function TripCard({trip:t,rank,premium=false,tiedPeers=[]}:{trip:Trip;rank?:number;premium?:boolean;tiedPeers?:Trip[]}){
 const ctx=useTripContext(),r=recommend(t,ctx.preference),selected=ctx.ids.includes(t.id);
 return <article className={`trip-card polished-card ${selected?"selected":""} ${premium?"premium":""}`}>
  <div className={premium?"premium-ribbon":"standard-ribbon"}>{premium?<><Crown size={18}/><span>가장 잘 맞는 여행</span></>:<span>{rank?`추천 ${rank}`:"부모님 맞춤 여행"}</span>}</div>
  <div className="trip-image"><img src={tripPhoto(t).src} alt={tripPhoto(t).alt} loading="lazy"/><span className="data-badge trip-style-badge">{t.styles[0]??"여행상품"}</span><button className={`compare-add ${selected?"added":""}`} aria-label={`${t.name} ${selected?"비교 빼기":"비교 담기"}`} aria-pressed={selected} onClick={()=>ctx.toggle(t.id)}>{selected?<Check size={20}/>:<Plus size={20}/>}</button></div>
  <div className="trip-body"><div className="trip-meta">{countryName(t.country)} · {t.region} · {t.days-1}박 {t.days}일</div><Link href={`/trips/${t.id}`} className="trip-name">{t.name}</Link>
   <div className="trip-facts" aria-label="핵심 여행 정보">{([{kind:"walking",label:"걷기",Icon:Footprints},{kind:"rest",label:"휴식",Icon:Armchair},{kind:"vehicle",label:"차량",Icon:Bus}] as const).map(({kind,label,Icon})=><div className={`trip-fact fact-${kind}`} key={kind}><Icon aria-hidden="true"/><span className="fact-label">{label}</span><strong className="fact-value">{metricDisplay(t,kind).split(" · ")[0]}</strong></div>)}<CardFacts trip={t}/></div>
   <div className={`match-row ${r.score>=80?"high-match":""}`}><span>조건 일치 점수 <strong>{r.score}<small>/100</small></strong></span><span className="subtle">{r.score>=90?"아주 잘 맞아요":r.score>=80?"잘 맞아요":"조건을 비교해보세요"}</span></div>
   <p className="card-reason">{conciseCopy(r.reasons[0]??"판단에 필요한 정보가 부족합니다")}</p>
   <details className="card-details"><summary>추천 이유 · 확인할 조건</summary><ul>{r.reasons.slice(1).map(x=><li key={x}>{conciseCopy(x)}</li>)}</ul>{tiedPeers.length>1&&<div className="tie-differences" aria-label="동점 상품 조건 차이"><strong>동점 {r.score}점 · 조건의 차이</strong><ul>{tiedScoreDifferences(t,tiedPeers).map(x=><li key={x}>{x}</li>)}</ul></div>}<p>{conciseCopy(r.warnings.join(" · ")||"출발 전 최신 일정을 확인해주세요.")}</p><p className="travel-card-info">{conciseCopy(flightSummary(t))} · 쇼핑 {t.shopping===null?"정보 없음":`${t.shopping}회`}</p><Link className="text-link" href={`/trips/${t.id}`}>일정과 상세 정보 보기 →</Link></details>
   <div className="trip-bottom"><div><span>성인 1인 기준</span><strong>{money(t.price)}</strong></div><Link className="detail-link" href={`/trips/${t.id}`}>상세 보기 <ArrowUpRight size={19}/></Link></div>
   {t.isDemo?<Link href={`/booking/${t.id}`} className="button booking-cta">이 여행 선택하기 <ArrowRight size={18}/></Link>:t.sourceUrl?<a href={t.sourceUrl} target="_blank" rel="noopener noreferrer" className="button booking-cta">여행사에서 예약하기 <ArrowUpRight size={18}/></a>:null}
   <div className="card-actions"><button className="text-button" onClick={()=>ctx.toggle(t.id)}>{selected?"비교 빼기":"비교 담기"}</button>{t.sourceUrl?<a href={t.sourceUrl} target="_blank" rel="noopener noreferrer">원본 상품 확인 ↗</a>:<Link href={`/parents/${t.id}`}>부모님께 보여드리기</Link>}</div>
  </div>
 </article>;
}
