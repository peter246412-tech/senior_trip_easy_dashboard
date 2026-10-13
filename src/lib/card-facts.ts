import { z } from "zod";
import { mealSchema,presentationDemoSchema } from "./validation";
import type { Trip } from "./types";
import { weatherCities, forecastWindow, tokyoToday } from "./forecast";

function mealRecord(t:Trip){const parsed=mealSchema.safeParse(t.meals);if(parsed.success){const m=parsed.data;if(m.status!=="unknown"&&m.evidence.trim()&&(t.isDemo||m.status==="confirmed"&&m.sourceUrl&&m.checkedAt))return {counts:m,label:t.isDemo?"데모 예시":"출처 확인"};}const demo=presentationDemoSchema.safeParse(t.presentationDemo);return demo.success?{counts:demo.data.meals,label:"데모 예시"}:null;}
export function mealSummary(t:Trip,compact=false) {
 const record=mealRecord(t);if(!record)return "식사 정보 미확인";
 const types=compact?([['korean','한식'],['local','현지식']] as const):([['korean','한식'],['local','현지식'],['free','자유식']] as const);
 const parts=types.flatMap(([key,label])=>record.counts[key]===null?[]:[`${label} ${record.counts[key]}회`]);return parts.length?parts.join(" · "):"식사 정보 미확인";
}
export function mealDataLabel(t:Trip){return mealRecord(t)?.label??null;}
export function demoTemperature(t:Trip){const demo=presentationDemoSchema.safeParse(t.presentationDemo);if(!demo.success)return null;const w=demo.data.weather;return {summary:`${w.low}~${w.high}°C`,location:`${w.city} ${w.month}월`,label:"데모 예시 기온 · 실제 예보 아님"};}
export type CardWeatherContext={status:"available"|"date_undecided"|"invalid_date"|"out_of_range"|"missing_city";label:string;city?:keyof typeof weatherCities;date?:string;days?:number};
export function cardWeatherContext(t:Trip,now=new Date()):CardWeatherContext {
 if(!t.departureDate)return {status:"date_undecided",label:"여행 날짜 미정"};
 const date=t.departureDate,start=Date.parse(date+"T00:00:00Z");
 if(!Number.isFinite(start)||new Date(start).toISOString().slice(0,10)!==date)return {status:"invalid_date",label:"여행 날짜 확인 필요"};
 if(!forecastWindow(date,t.days,now))return {status:"out_of_range",label:date<tokyoToday(now)?"지난 여행 날짜":"예보 가능 기간 밖"};
 if(t.country!=="JP")return {status:"missing_city",label:"지원 예보 도시 없음"};
 const places=new Set([...t.places,...t.itinerary.flatMap(d=>d.stops)].map(p=>p.normalize("NFKC").replace(/\s+/g,"")));
 const city=(Object.keys(weatherCities) as (keyof typeof weatherCities)[]).find(key=>places.has(weatherCities[key].name)||key==="beppu"&&places.has("벳부"));
 if(!city)return {status:"missing_city",label:"방문 도시 미확인"};
 return {status:"available",label:"실제 예보 조회",city,date,days:t.days};
}
const weatherValue=z.number().finite().nullable();
export const cardForecastSchema=z.object({city:z.string().min(1),checkedAt:z.string().datetime(),daily:z.array(z.object({date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),low:weatherValue,high:weatherValue,rainChance:z.number().min(0).max(100).nullable()})).min(1).max(15)});
export type CardForecast=z.infer<typeof cardForecastSchema>;
export function forecastCardSummary(data:CardForecast){
 const lows=data.daily.map(d=>d.low),highs=data.daily.map(d=>d.high),rain=data.daily.map(d=>d.rainChance);
 const temperature=lows.every((v):v is number=>v!==null)&&highs.every((v):v is number=>v!==null)?`${Math.min(...lows)}~${Math.max(...highs)}°C`:"기온 정보 미확인";
 return `${temperature}${rain.every((v):v is number=>v!==null)?` · 비 최대 ${Math.max(...rain)}%`:""}`;
}
