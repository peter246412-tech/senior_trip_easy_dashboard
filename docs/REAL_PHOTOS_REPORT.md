# 실제 일본 사진 적용 결과

2026-10-15

- 적용: 홈페이지, 일반 목록·추천 결과 카드, 상품 비교, 상품 상세, 부모님 공유, 서비스 소개.
- 실제 사진 5장: 유후인 긴린호수 2장, 오사카성과 벚꽃, 홋카이도 오타루 운하, 비에이 청의 호수.
- 출처: Wikimedia Commons의 개별 사진 설명과 라이선스를 확인하고 다운로드. 작가·원본·라이선스·웹용 변환 내역은 docs/ASSETS.md와 /about#photos에서 확인 가능.
- 사진은 지역 참고 사진이며 개별 상품의 숙소·시설이나 출발 시기의 모습을 보증하는 사진이 아닙니다.
- 화면에 겹쳤던 일본 시연 사례 / AI 생성 이미지 배너는 제거한 상태 유지.
- 사진을 로컬 정적 WebP 파일로 제공하므로 열람 시 외부 사진 서버에 연결하지 않습니다. 총 5개 파일 약 1.72MB.
- 기존 상품 경로는 화면 표시 함수에서 실제 사진으로 연결합니다. 상품 데이터·가격·일정·식사·날씨·추천 함수는 변경하지 않았습니다.

## 수정한 파일

- src/lib/travel-photos.ts (신규): 실제 사진 목록, 출처, 이전 상품 이미지 경로 연결.
- src/components/photo-credits.tsx (신규): 작가·원본·라이선스 표시.
- src/components/home.tsx
- src/components/trip-card.tsx
- src/components/compare.tsx
- src/components/trip-detail.tsx
- src/components/parents.tsx
- src/components/shell.tsx
- src/app/about/page.tsx
- public/images/japan/*.webp (신규 5장)
- docs/ASSETS.md
- docs/REAL_PHOTOS_RESULTS.json 및 docs/real-photos-*.png (검증 결과·미리보기)

## 검증

- 원본 프로젝트: 타입 검사와 프로덕션 빌드 통과.
- 공개 업로드 프로젝트: 타입 검사와 프로덕션 빌드 통과.
- 기존 단위 테스트 29개 통과.
- 기존 브라우저 테스트 6개 통과: 카드 3개 높이·간격, 한글 줄바꿈, 모바일 접근성, 조건 입력 4단계 → 추천 → 비교, 발표 조건 복원.
- 별도 브라우저 검사: 1440px / 1024px / 390px에서 9개 경로씩 총 27개 화면의 실제 사진 로딩·대체 텍스트·가로 넘침 확인. 이미지 실패, 페이지 오류, 가로 넘침 0개.
- 홈페이지와 추천 결과의 데스크톱·태블릿·모바일 스크린샷을 실제로 확인.
- seed-data.json, presentation-demo.json, recommend.ts, recommendation-config.ts는 현재 커밋 및 공개 폴더와 바이트 단위로 동일함을 확인.
- 현재 작업은 사진 교체입니다. AI 자동 일정/거리 계산, 지도 API, 여행사 공식 제휴, 실제 예약·결제를 새로 구현하지 않았습니다.

## 배포

공개 사이트 https://tripeasy-three.vercel.app/ 는 이 작업에서 직접 재배포하지 않았습니다. 수정된 TripEasy-공개배포 폴더를 기존 Vercel 프로젝트 https://vercel.com/trip-easy/tripeasy 에 다시 올린 후 Ready 상태에서 확인하세요.
