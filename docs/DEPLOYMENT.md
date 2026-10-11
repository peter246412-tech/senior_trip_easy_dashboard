# 무료 공개 배포 준비 상태

대상: Vercel Hobby의 개인·비상업용 발표 시연 + Neon Free.
계정 연결 및 실제 공개 URL 발급은 아직 완료되지 않았습니다.

## 환경 변수 (Vercel Production에만 설정)

- DATABASE_URL: Neon의 pooled PostgreSQL 연결 URL
- DIRECT_URL: 동일 DB의 unpooled PostgreSQL 연결 URL
- ADMIN_PASSWORD: 12자 이상의 별도 관리자 비밀번호
- AUTH_SECRET: 최소 32자의 무작위 비밀 값
- COOKIE_SECURE: true
- APP_ORIGIN: 배포 후 확정된 https://프로젝트명.vercel.app 주소 (마지막 / 제외)

비밀 값은 GitHub에 커밋하거나 대화에 붙여넣지 않습니다.

## 배포 절차

1. GitHub 계정 인증 후 이 저장소를 새 저장소에 업로드합니다.
2. Neon 무료 프로젝트와 DB를 생성합니다.
3. Vercel Hobby에 GitHub 저장소를 연결하고 환경 변수를 Production에 설정합니다.
4. Build Command는 vercel.json의 npm run vercel-build를 사용합니다.
5. 확정 URL을 APP_ORIGIN에 설정한 후 다시 배포합니다.
6. 외부 브라우저에서 홈, 상품 상세, 선호 조건 저장, 비교, 시연 예약, 관리자 로그인 검증 후 URL을 전달합니다.

PostgreSQL 스키마와 최초 마이그레이션은 prisma/postgres/에 있습니다.
빌드는 Prisma 생성 → 마이그레이션 적용 → 없는 상품만 시드 추가 → Next.js 빌드 순서입니다.
기존 상품을 덮어쓰지 않습니다. 로컬 SQLite 설정은 prisma/schema.prisma를 계속 사용합니다.
공개 배포용 Prisma Client를 로컬에서 생성했다면 npm run db:generate로 SQLite Client를 복원합니다.

Preview 환경에서는 Production DB 공유를 방지하기 위해 빌드를 중단합니다.
별도 Preview DB를 연결하는 구성이 마련되기 전에는 Production만 배포합니다.
실제 카드 결제·예약은 제공하지 않으며 기존 DEMO 표시를 유지합니다.
무료 사용량 초과 시 사이트나 DB가 일시 제한될 수 있습니다. 유료 전환은 하지 않습니다.
