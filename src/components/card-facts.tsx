"use client";
import { useEffect,useState,useRef } from "react";
import { Utensils,CalendarDays } from "lucide-react";
import type { Trip } from "@/lib/types";
import { cardWeatherContext,mealSummary,demoTemperature,cardForecastSchema,forecastCardSummary,type CardForecast,type CardWeatherContext } from "@/lib/card-facts";
import { weatherCities } from "@/lib/forecast";
const forecasts=new Map<string,{expires:number;promise:Promise<CardForecast>}>();
function getForecast(c:CardWeatherContext){
 if(!c.city||!c.date||!c.days)return Promise.reject(Error());
 const city=c.city,date=c.date,days=c.days,key=`${city}:${date}:${days}`,cached=forecasts.get(key);
 if(cached&&cached.expires>Date.now())return cached.promise;
 const promise=(async()=>{const res=await fetch(`/api/weather?${new URLSearchParams({city,date,days:String(days)})}`,{signal:AbortSignal.timeout(9000)});if(!res.ok)throw Error();const parsed=cardForecastSchema.parse(await res.json());
 if(parsed.city!==weatherCities[city].name||parsed.daily.length!==days||parsed.daily.some((d,i)=>d.date!==new Date(Date.parse(date+"T00:00:00Z")+i*86400000).toISOString().slice(0,10)))throw Error();return parsed;})();
 forecasts.set(key,{expires:Date.now()+5*60*1000,promise});void promise.catch(()=>{forecasts.delete(key);});return promise;
}
export function CardWeather({trip:t,compact=false}:{trip:Trip;compact?:boolean}){
 const [data,setData]=useState<CardForecast|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const context=cardWeatherContext(t),demo=demoTemperature(t),key=`${t.id}:${t.departureDate}:${t.days}:${context.city}:${context.status}`;
 const request=useRef(0);
 async function load(){const c=cardWeatherContext(t);if(c.status!=="available")return;const requestId=++request.current;setBusy(true);setError("");try{const forecast=await getForecast(c);if(requestId===request.current)setData(forecast);}catch{if(requestId===request.current)setError("실제 예보 조회 불가");}finally{if(requestId===request.current)setBusy(false);}}
 useEffect(()=>{request.current++;setData(null);setError("");setBusy(false);if(context.status==="available")void load();return()=>{request.current++;};},[key]);
 const actual=context.status==="available"&&data&&data.daily.every(d=>d.low!==null&&d.high!==null)?data:null;
 if(compact){const location=actual?`${actual.city} ${Number(context.date!.slice(5,7))}월`:demo?.location;const summary=actual?forecastCardSummary(actual).split(" · ")[0]:demo?.summary;
 return <div className="card-weather-compact">{location&&summary?<><span className="weather-location">{location}</span><span className="fact-separator" aria-hidden="true"> · </span><span className="weather-temperature">{summary}</span></>:<span>{context.label}</span>}{busy&&<small>날씨 확인 중…</small>}{error&&<button className="text-button card-weather-load" type="button" onClick={()=>void load()}>예보 다시 확인</button>}</div>;}
 return <div className="card-weather">{actual?<><span className="card-weather-city">{actual.city} · 실제 예보</span><span>{forecastCardSummary(actual)}</span><small><a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a></small><details><summary>예보 기준</summary><p>여행 기간 중 일별 최저·최고기온의 범위와 일별 강수확률 최댓값입니다. 첫 번째로 확인된 지원 방문 도시 기준이며 다른 방문지와 다를 수 있습니다.</p><p>조회 {new Date(actual.checkedAt).toLocaleString("ko-KR")} · 예보는 변경될 수 있습니다.</p></details></>:demo?<><span className="card-weather-city">{demo.location}</span><span className="card-demo-temperature">{demo.summary}</span><small className="demo-weather-label">{demo.label}</small></>:<span className="card-weather-state">{context.label}</span>}{!actual&&context.status!=="available"&&demo&&<small>{context.label}</small>}{busy&&<small>실제 예보 확인 중…</small>}{!busy&&context.status==="available"&&(!actual||error)&&<small>{error||"기온 정보 미확인"} · <button className="text-button card-weather-load" type="button" onClick={()=>void load()}>예보 다시 조회</button></small>}</div>;
}
export function CardFacts({trip:t}:{trip:Trip}){const parts=mealSummary(t,true).split(" · ");return <><div className="trip-fact fact-meal"><Utensils aria-hidden="true"/><span className="fact-label">식사</span><div className="fact-value meal-parts">{parts.map((part,i)=><span key={part}>{i>0&&<span className="fact-separator" aria-hidden="true"> · </span>}<span className="meal-part">{part}</span></span>)}</div></div><div className="trip-fact fact-weather"><CalendarDays aria-hidden="true"/><span className="fact-label">날씨</span><div className="fact-value"><CardWeather trip={t} compact/></div></div></>;}
