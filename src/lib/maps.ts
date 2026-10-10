export type RouteInput = {originPlaceId:string;destinationPlaceId:string;mode:"DRIVE"|"WALK";explicitWalkingSegment:boolean};
export interface MobilityProvider { route(input:RouteInput):Promise<{status:"unknown"|"estimated";distanceMeters:number|null;durationSeconds:number|null;evidence:string}> }
// API 결과의 영구 저장은 비활성화. 관광지 내부 동선 및 승하차 위치는 별도 확인.
export const mobilityProvider:MobilityProvider={async route(input) { return {status:"unknown",distanceMeters:null,durationSeconds:null,evidence: input.mode==="WALK"&&!input.explicitWalkingSegment?"명확한 도보 구간이 확인되지 않아 계산하지 않습니다":"Google Places/Routes 공급자 미연결 · 정보 확인 필요"}; }};
