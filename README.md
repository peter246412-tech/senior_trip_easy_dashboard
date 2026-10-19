# 여행이지 / TripEasy 글로벌 비즈니스 발표용 MVP

## GitHub 브랜치 안내

현재 브랜치는 `presentation`이며 공개 시연용 읽기 전용 소스입니다. 기말에 업그레이드할 전체 개발 원본(SQLite·관리자 기능)은 [`main`](https://github.com/peter246412-tech/senior_trip_easy_dashboard/tree/main)에 보관합니다.

Vercel Git 연결 시 Production Branch를 `presentation`, Build Command를 `npm run build`로 설정합니다. 이 브랜치는 별도 DB나 비밀 환경변수 없이 빌드됩니다. 현재 공개 사이트는 아래 URL이며, GitHub 푸시만으로 기존 Vercel Drop 배포가 자동 갱신되지는 않습니다.

발표 대본: [docs/PRESENTATION_SCRIPT.md](docs/PRESENTATION_SCRIPT.md). AI·지도 자동 분석 등 향후 개발 계획은 현재 구현과 구분합니다.

국내외 패키지여행 비교 플랫폼입니다. 현재 일본 상품으로 시연합니다.
실제 조사 6개 + 가상 상품 12개. AI 자동 분석·지도 거리 계산·실제 결제·제휴는 미구현입니다.

## 기존 공개 사이트 갱신

1. https://vercel.com/trip-easy/tripeasy 열기
2. 기존 프로젝트 화면에 이 폴더를 드래그앤드롭해 Production Deployment 갱신
3. Framework Next.js / Build Command npm run build / 추가 환경 변수 없음
4. Ready 확인 후 Visit과 시크릿 창에서 확인

현재 주소: https://tripeasy-three.vercel.app/
재배포 후 시연: /preferences?demo=1
빠른 추천: /trips?recommended=1&demo=1
비교: /compare?ids=demo-01,demo-02,demo-03&demo=1

홈 → 발표 시연 시작하기 → 다음 3회 → 추천받기 → 추천 3개 한눈에 비교하기.
시연 조건은 일반 조건과 별도로 저장하며 시연 종료 시 기존 조건을 복원합니다.
공개 버전은 브라우저에만 조건을 저장하고 서버에서 상품을 수정하지 않습니다.
원본 프로젝트의 관리자·DB 기능은 별도로 유지됩니다.

타입 검사·빌드 및 테스트 결과와 데이터 출처는 함께 제공한 결과 보고서를 확인하세요.
로컬 확인: npm ci → npm run build → npm start.

## 식사·날씨 업데이트

prisma/presentation-demo.json에 18개 상품의 가상 식사·기온을 분리했습니다. 실제 예보가 유효하면 데모 기온을 대체합니다. 최신 결과는 docs/MEAL_WEATHER_REPORT.md를 확인하세요.
