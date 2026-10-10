export type CollectionPolicy = { agency:string; url:string; robotsReviewed:boolean; termsReviewed:boolean; reusePermission:boolean; reviewedAt:string|null };
export interface ProductCollector { collect(policy:CollectionPolicy):Promise<unknown[]> }
// 기본 거부. 로그인, CAPTCHA, 차단 우회 기능 없음. 자동 스케줄러도 연결하지 않음.
export const disabledCollector:ProductCollector={async collect(policy){if(!policy.robotsReviewed||!policy.termsReviewed||!policy.reusePermission)throw new Error("수집 정책과 데이터 이용 권한 검토 전 자동 수집은 비활성화됩니다");throw new Error("승인된 공급자 어댑터 미연결");}};
