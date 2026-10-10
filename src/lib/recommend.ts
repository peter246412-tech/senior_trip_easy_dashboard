import { Trip, Preference } from "./types";
import { flightTiming, mustVisitStatus, weatherFor } from "./travel-info";
import { recommendationConfig as c } from "./recommendation-config";
export function recommend(t: Trip, p: Preference) {
 const factors: {key:string;label:string;weight:number;fit:number;confidence:number;reason:string}[]=[];
 const warnings:string[]=[];
 function add(key:string,label:string,fit:number|null,confidence:number,reason:string) { const index=p.priorities.indexOf(key); const weight=c.weights[key as keyof typeof c.weights] * (index < 0 ? 1 : c.priorityBoost[index]); factors.push({key,label,weight,fit:fit??0,confidence:fit===null?0:confidence,reason}); if (fit===null) warnings.push(reason); }
 function assess(key: "walking"|"rest"|"vehicle"|"stairs",label:string,fit:(v:number)=>number) {const m=t[key];add(key,label,m.value===null||m.status==="unknown"?null:fit(m.value),m.status==="estimated"?c.estimateConfidence:1,m.value===null||m.status==="unknown"?`${label} 정보 확인 필요`:`${label}: ${m.value}${key==="walking"?"km/일":key==="stairs"?"단계":"분/일"} (${m.status==="estimated"?"추정됨":"확인됨"}${t.isDemo?" · DEMO 가정":""})`);}
 if(p.walking!=="unknown") assess("walking","보행 부담",v=>v<=({short:2,medium:4,long:7}[p.walking as "short"|"medium"|"long"])?1:Math.max(0,1-(v-({short:2,medium:4,long:7}[p.walking as "short"|"medium"|"long"]))/4));
 if(p.stairs!=="unknown"&&p.stairs!=="any") assess("stairs","계단·경사",v=>v<= (p.stairs==="avoid"?0:1)?1:0);
 assess("rest","휴식 시간",v=>Math.min(1,v/(p.enoughRest?120:60)));
 add("style","여행 스타일",t.styles.length? p.styles.filter(s=>t.styles.includes(s)).length/p.styles.length:null,1,t.styles.length?`선호 스타일 ${p.styles.filter(s=>t.styles.includes(s)).length}/${p.styles.length}개 일치`:"여행 스타일 정보 확인 필요");
 add("budget","예산",t.price===null?null:Math.max(0,Math.min(1,p.budget/t.price)),1,t.price===null?"가격 정보 확인 필요":t.price<=p.budget?"1인당 예산 조건 충족":"입력한 1인당 예산 초과");
 assess("vehicle","차량 이동",v=>Math.max(0,Math.min(1,(p.avoidLongVehicle?180:360)/Math.max(1,v))));
 add("shopping","쇼핑 일정",t.shopping===null?null:Math.max(0,1-t.shopping/3),1,t.shopping===null?"쇼핑 횟수 정보 확인 필요":`쇼핑 ${t.shopping}회`);
 if(p.days) add("duration","여행 기간",t.days===p.days?1:Math.max(0,1-Math.abs(t.days-p.days)/3),1,t.days===p.days?"희망 여행 기간과 일치":"희망 여행 기간과 다름");
 if(p.priorities.includes("density")) add("density","관광 일정",t.places.length?Math.min(1,t.places.length/t.days/2):null,1,t.places.length?`주요 관광지 ${t.places.length}곳 / ${t.days}일`:"관광 일정 정보 확인 필요");
 const timing=flightTiming(t);
 if(p.avoidEveningFlights)add("flightTime","항공 시간",timing==="unknown"?null:timing==="day"?1:0,1,timing==="unknown"?"왕복 항공 시간 확인 필요":timing==="night"?"저녁·심야 출발 또는 도착 포함 (18:00~05:59)":"왕복 낮 시간 출발·도착");
 if(p.preferWideBody){const f=t.flights??[];const known=f.some(x=>x.direction==="outbound")&&f.some(x=>x.direction==="return")&&f.every(x=>x.body!=="unknown");add("aircraft","광동체 선호",known?(f.every(x=>x.body==="wide")?1:0):null,1,known?"기체 분류 기준 · 좌석 편안함은 별도 확인":"왕복 기종·기체 크기 확인 필요");}
 if(p.considerWeather){const w=weatherFor(t,p.month);if(w?.risks.length)warnings.push(...w.risks.map(x=>`${w.city} ${w.month}월 평년: ${x}`));add("weather","여행 시기 날씨",w?(w.risks.length?0.5:1):null,0.7,w?`${w.city} ${w.month}월 평년 기준 · ${w.risks.join(" · ")||"기온·강수 주의 기준 없음"} (예보 아님)`:"여행 시기 날씨 확인 필요");}
 const places=mustVisitStatus(t,p.mustVisit??[]);if(places.missing.length)warnings.push(`필수 장소 ${t.placeListComplete?"미포함":"포함 확인 필요"}: ${places.missing.join(" · ")}`);
 if(timing==="night"&&p.avoidEveningFlights)warnings.push("저녁·심야 항공편이 포함되어 있습니다");
 if(!t.departureDate) warnings.push("출발일 정보 확인 필요"); else if(p.month&&!t.departureDate.startsWith(p.month)) warnings.push("희망 출발 시기와 다름");
 if(!t.airport) warnings.push("출발 공항 정보 확인 필요"); else if(p.airport!=="상관없음"&&p.airport!==t.airport) warnings.push("희망 출발 공항과 다름");
 if(t.peopleMin&&p.people<t.peopleMin) warnings.push(`최소 출발 ${t.peopleMin}명 · 동행 인원만으로 출발 보장 불가`);
 const total=factors.reduce((s,f)=>s+f.weight,0);
 return {score:Math.round(factors.reduce((s,f)=>s+f.weight*f.fit,0)/total*100),coverage:Math.round(factors.reduce((s,f)=>s+f.weight*f.confidence,0)/total*100),factors,reasons:factors.filter(f=>f.fit>=0.75&&f.confidence>0).sort((a,b)=>b.weight-a.weight).map(f=>f.reason).slice(0,3),warnings};
}
export function comparisonSummary(trips:Trip[]) { if(trips.length<2)return[];const a=trips[0];return trips.slice(1).flatMap(b=>{const lines:string[]=[]; if(a.price!==null&&b.price!==null)lines.push(`${a.name}과 비교해 ${b.name}은 ${Math.abs(b.price-a.price).toLocaleString("ko-KR")}원 ${b.price>a.price?"더 비쌉니다":b.price<a.price?"더 저렴합니다":"차이가 없습니다"}.`);if(a.rest.value!==null&&b.rest.value!==null)lines.push(`${b.name}의 하루 휴식 시간은 ${b.rest.value}분으로, ${a.name}보다 ${Math.abs(b.rest.value-a.rest.value)}분 ${b.rest.value>a.rest.value?"많습니다":b.rest.value<a.rest.value?"적습니다":"차이가 없습니다"}${a.isDemo||b.isDemo?" (DEMO 가정 기준)":a.rest.status==="estimated"||b.rest.status==="estimated"?" (추정 기준)":""}.`);if(b.walking.value===null) lines.push(`${b.name}은 보행 부담을 비교할 정보가 부족합니다.`);return lines;}); }
