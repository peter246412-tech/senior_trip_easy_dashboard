import { Metric, Trip, metricText } from "./types";
export type MetricKind = "walking" | "rest" | "vehicle" | "stairs";
export type DataState = "confirmed" | "map_estimated" | "demo" | "unknown";
export const dataLabels: Record<DataState,string> = {confirmed:"확인된 정보",map_estimated:"지도 기반 추정",demo:"데모 예시",unknown:"정보 없음"};
export function metricState(t:Trip,key:MetricKind):DataState {
 const m=t[key];
 if(m.value===null||m.status==="unknown")return "unknown";
 if(t.isDemo)return "demo";
 if(m.status==="confirmed"&&m.sourceUrl&&m.checkedAt&&m.evidence.trim())return "confirmed";
 if(m.status==="map_estimated"&&m.provider&&m.sourceUrl&&m.checkedAt&&m.evidence.trim())return "map_estimated";
 return "unknown";
}
export function readableMetric(t:Trip,key:MetricKind):Metric {const state=metricState(t,key);return state==="unknown"?{value:null,status:"unknown",evidence:t[key].evidence}:t[key];}
export function metricValue(t:Trip,key:MetricKind) {return readableMetric(t,key).value;}
export function metricDisplay(t:Trip,key:MetricKind) {return metricText(readableMetric(t,key),key);}
export function dataSummary(t:Trip) {const states=(["walking","rest","vehicle"] as MetricKind[]).map(k=>metricState(t,k));if(states.every(s=>s==="demo"))return "이동·휴식: 데모 예시";const known=states.filter(s=>s!=="unknown").length;return known===0?"이동·휴식 정보 없음":known===3?"이동·휴식 근거 있음":"이동·휴식 일부 정보 없음";}
