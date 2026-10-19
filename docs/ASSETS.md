# 이미지 출처

2026-10-15: 홈페이지·상품 카드·비교·상세·부모님 공유·서비스 소개에 실제 일본 여행지 사진을 적용했습니다.

사진은 지역 참고용이며 개별 여행상품의 숙소·제공 시설·여행 시기의 모습이라는 의미는 아닙니다. 여행사 사진이나 AI 생성 이미지를 현재 여행 화면에 사용하지 않습니다.

웹용 파일은 원본 사진을 축소·WebP 변환했습니다. 화면에서는 기존 object-fit 비율에 따라 잘라 보입니다. 합성·생성·장면 변경은 하지 않았습니다.

## 현재 적용 사진

- `public/images/japan/yufuin-lake.webp`: 유후인 긴린호수 · Suicasmo · [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) · [원본](https://commons.wikimedia.org/wiki/File:Lake_Kinrin_20221022-1.jpg)
- `public/images/japan/yufuin-autumn.webp`: 유후인 긴린호수와 마을 · STA3816 · [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) · [원본](https://commons.wikimedia.org/wiki/File:Lake_Kinrin_October_2011_01.jpg)
- `public/images/japan/osaka-castle.webp`: 오사카성과 벚꽃 · Tom Purves · [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) · [원본](https://commons.wikimedia.org/wiki/File:Osaka_castle_and_cherry_blossoms_2006.jpg)
- `public/images/japan/biei-blue-pond.webp`: 홋카이도 비에이 청의 호수 · Noriyoshi Emura · [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) · [원본](https://commons.wikimedia.org/wiki/File:Shirogane_Blue_Pond_2015-09-15.jpg)
- `public/images/japan/otaru-canal.webp`: 홋카이도 오타루 운하 · Suicasmo · [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) · [원본](https://commons.wikimedia.org/wiki/File:Otaru_Canal_20140817.jpg)

사진 출처·작가·라이선스·변환 내역은 `/about#photos`에서 공개하며 모든 화면의 푸터에서 연결합니다. 각 변환 사진에는 해당 원본과 같은 라이선스를 적용합니다. 사진 라이선스는 사이트 전체 소프트웨어에 대한 라이선스 선언이 아닙니다.

## 기존 파일

`public/images/onsen.png`는 이전 AI 생성 이미지로 현재 화면에서 사용하지 않습니다. 이전 상품 데이터의 이미지 경로는 `src/lib/travel-photos.ts`에서 실제 사진으로 연결합니다. 나머지 기존 jpg도 현재 여행 화면에서 새 사진으로 연결합니다. 원래 데이터와 추천 계산은 변경하지 않았습니다.

- 여행이지 / TripEasy 브랜드 심볼: 자체 제작 SVG (`public/brand/tripeasy-mark.svg`).
- 로고 전용 Jua 한글 폰트: [Google Fonts 공식 저장소](https://github.com/google/fonts/tree/main/ofl/jua), TTF·OFL 라이선스는 `public/fonts/`에 포함.
