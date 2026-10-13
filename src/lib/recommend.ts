import { metricState, readableMetric, metricValue, dataLabels } from "./data-state";
import { Trip, Preference } from "./types";
import { flightTiming, mustVisitStatus, weatherFor } from "./travel-info";
import { recommendationConfig as c } from "./recommendation-config";
export function recommend(t: Trip, p: Preference) {
 const factors: {key:string;label:string;weight:number;fit:number;confidence:number;reason:string}[]=[];
 const warnings:string[]=[];
 function add(key:string,label:string,fit:number|null,confidence:number,reason:string) { const index=p.priorities.indexOf(key); const weight=c.weights[key as keyof typeof c.weights] * (index < 0 ? 1 : c.priorityBoost[index]); factors.push({key,label,weight,fit:fit??0,confidence:fit===null?0:confidence,reason}); if (fit===null) warnings.push(reason); else if(fit<0.75) warnings.push(`${label} 조건 차이 · ${reason}`); }
 function assess(key: "walking"|"rest"|"vehicle"|"stairs",label:string,fit:(v:number)=>number) {
 const m=readableMetric(t,key), state=metricState(t,key);
 const limits={walking:p.walking==="short"?2:p.walking==="medium"?4:7,rest:p.enoughRest?120:60,vehicle:p.avoidLongVehicle?180:360,stairs:p.stairs==="avoid"?0:1};
 const unit=key==="walking"?"km/일":key==="stairs"?"단계":"분/일";
 const matches=m.value!==null&&(key==="rest"?m.value>=limits[key]:m.value<=limits[key]);
 if(m.value!==null&&!matches)warnings.push(`${label} 선호 기준과 다름 · ${m.value}${unit}`);
 add(key,label,m.value===null?null:fit(m.value),state==="confirmed"?1:state==="unknown"?0:c.estimateConfidence,
 m.value===null?`${label} 정보 없음 · 조건에 맞는지 판단할 수 없습니다`:`${label} ${m.value}${unit} · 선호 기준 ${limits[key]}${unit} ${matches?(key==="rest"?"이상":"이하"):(key==="rest"?"미만":"초과")} (${dataLabels[state]})`);
 }
 if(p.walking!=="unknown") assess("walking","보행 부담",v=>v<=({short:2,medium:4,long:7}[p.walking as "short"|"medium"|"long"])?1:Math.max(0,1-(v-({short:2,medium:4,long:7}[p.walking as "short"|"medium"|"long"]))/4));
 if(p.stairs!=="unknown"&&p.stairs!=="any") assess("stairs","계단·경사",v=>v<= (p.stairs==="avoid"?0:1)?1:0);
 assess("rest","휴식 시간",v=>Math.min(1,v/(p.enoughRest?120:60)));
 add("style","여행 스타일",t.styles.length? p.styles.filter(s=>t.styles.includes(s)).length/p.styles.length:null,1,t.styles.length?`선호 스타일 ${p.styles.filter(s=>t.styles.includes(s)).length}/${p.styles.length}개 일치`:"여행 스타일 정보 확인 필요");
 add("budget","예산",t.price===null?null:Math.max(0,Math.min(1,p.budget/t.price)),1,t.price===null?"가격 정보 확인 필요":t.price<=p.budget?"1인당 예산 조건 충족":"입력한 1인당 예산 초과");
 assess("vehicle","차량 이동",v=>Math.max(0,Math.min(1,(p.avoidLongVehicle?180:360)/Math.max(1,v))));
 add("shopping","쇼핑 일정",t.shopping===null?null:Math.max(0,1-t.shopping/3),1,t.shopping===null?"쇼핑 횟수 정보 확인 필요":`쇼핑 ${t.shopping}회`);
 if(p.days) add("duration","여행 기간",t.days===p.days?1:Math.max(0,1-Math.abs(t.days-p.days)/3),1,t.days===p.days?"희망 여행 기간과 일치":"희망 여행 기간과 다름");
 if(p.priorities.includes("density")) add("density","관광 일정",t.places.length?Math.min(1,t.places.length/t.days/2):null,1,t.places.length?`주요 관광지 ${t.places.length}곳 / ${t.days}일`:"관광 일정 정보 확인 필요");
 if(t.price!==null&&t.price>p.budget)warnings.push(`1인 예산 ${(t.price-p.budget).toLocaleString("ko-KR")}원 초과`);
 if(p.days&&t.days!==p.days)warnings.push(`희망 ${p.days}일과 다름 · 상품 ${t.days}일`);
 const missingStyles=p.styles.filter(s=>!t.styles.includes(s));if(missingStyles.length)warnings.push(`선호 스타일 불일치: ${missingStyles.join(" · ")}`);
 const timing=flightTiming(t);
 if(p.avoidEveningFlights)add("flightTime","항공 시간",timing==="unknown"?null:timing==="day"?1:0,1,timing==="unknown"?"왕복 항공 시간 확인 필요":timing==="night"?"저녁·심야 출발 또는 도착 포함 (18:00~05:59)":"왕복 낮 시간 출발·도착");
 if(p.preferWideBody){const f=t.flights??[];const known=f.some(x=>x.direction==="outbound")&&f.some(x=>x.direction==="return")&&f.every(x=>x.body!=="unknown");add("aircraft","광동체 선호",known?(f.every(x=>x.body==="wide")?1:0):null,1,known?(f.every(x=>x.body==="wide")?"왕복 광동체 선호와 일치 · 좌석 편안함은 별도 확인":"광동체 선호와 다름 · 협동체 항공편 포함"):"왕복 기종·기체 크기 확인 필요");}
 if(p.considerWeather){const w=weatherFor(t,p.month);if(w?.risks.length)warnings.push(...w.risks.map(x=>`${w.city} ${w.month}월 평년: ${x}`));add("weather","여행 시기 날씨",w?(w.risks.length?0.5:1):null,0.7,w?`${w.city} ${w.month}월 평년 기준 · ${w.risks.join(" · ")||"기온·강수 주의 기준 없음"} (예보 아님)`:"여행 시기 날씨 확인 필요");}
 const places=mustVisitStatus(t,p.mustVisit??[]);if(places.missing.length)warnings.push(`필수 장소 ${t.placeListComplete?"미포함":"포함 확인 필요"}: ${places.missing.join(" · ")}`);
 if(timing==="night"&&p.avoidEveningFlights)warnings.push("저녁·심야 항공편이 포함되어 있습니다");
 if(!t.departureDate) warnings.push("출발일 정보 확인 필요"); else if(p.month&&!t.departureDate.startsWith(p.month)) warnings.push("희망 출발 시기와 다름");
 if(!t.airport) warnings.push("출발 공항 정보 확인 필요"); else if(p.airport!=="상관없음"&&p.airport!==t.airport) warnings.push("희망 출발 공항과 다름");
 if(p.country&&p.country!=="ANY"&&t.country!==p.country)warnings.push("희망 여행 국가와 다름");
 if(p.region!=="상관없음"&&t.region!==p.region)warnings.push("희망 여행 지역과 다름");
 if(t.peopleMin&&p.people<t.peopleMin) warnings.push(`최소 출발 ${t.peopleMin}명 · 동행 인원만으로 출발 보장 불가`);
 const total=factors.reduce((s,f)=>s+f.weight,0);
 return {score:Math.round(factors.reduce((s,f)=>s+f.weight*f.fit,0)/total*100),coverage:Math.round(factors.reduce((s,f)=>s+f.weight*f.confidence,0)/total*100),factors,reasons:factors.filter(f=>f.fit>=0.75&&f.confidence>0).sort((a,b)=>b.weight-a.weight).map(f=>f.reason).slice(0,3),warnings:[...new Set(warnings)]};
}
export function comparisonSummary(trips:Trip[]) {
 if(trips.length<2)return[];
 const a=trips[0];return trips.slice(1).flatMap(b=>{
 const lines:string[]=[];
 if(a.price!==null&&b.price!==null){const delta=b.price-a.price;lines.push(delta===0?`${a.name}과 ${b.name}의 표시 가격은 같습니다.`:`${a.name}과 비교해 ${b.name}은 ${Math.abs(delta).toLocaleString("ko-KR")}원 ${delta>0?"더 비쌉니다":"더 저렴합니다"}.`);}
 for(const [kind,label,unit] of [["walking","걷는 거리","km"],["rest","휴식 시간","분"],["vehicle","차량 이동","분"]] as const){
 const av=metricValue(a,kind),bv=metricValue(b,kind);
 if(av===null||bv===null){lines.push(`${av===null?a.name:b.name}은 ${label}를 비교할 정보가 부족합니다.`);continue;}
 const difference=Number(Math.abs(bv-av).toFixed(1));
 lines.push(`${b.name}의 하루 ${label}는 ${bv}${unit}, ${a.name}과 ${difference}${unit} 차이입니다${a.isDemo||b.isDemo?" (DEMO 예시 기준)":""}.`);
 }
 return lines;
 });
}
