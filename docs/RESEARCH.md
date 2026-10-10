# 일본 여행상품 조사 기록

조사 날짜: 2026-10-10 (Asia/Seoul). 웹 검색과 공식 공개 페이지 열람으로 최소한의 상품 기본정보를 확인했습니다. 상세 설명과 여행사 사진을 복제하지 않았습니다. 외부 사이트의 현재 가격이 항상 앱과 일치한다고 보증하지 않습니다.

| 저장 ID | 여행사 | 상품 / 지역 | 저장 가격 | 조건과 출처 |
| --- | --- | --- | ---: | --- |
| real-hana-kyushu | 하나투어 | 규슈/후쿠오카 3일 · 온천1박·시내1박 | 649,900원 | [공식 상세](https://www.hanatour.com/trp/pkg/CHPC0PKG0200M200?pkgCd=JKP130261102TWH)의 검색 색인상 성인 회원 표시가. 재열람 시 주요 일정·가격이 빈 템플릿으로 표시됨. 출발일은 URL로 추정하지 않고 미확인 처리 |
| real-yb-osaka | 노랑풍선 | 부산출발 오사카 3일 · 교토·고베·아라시야마 | 936,400원 | [공식 상세](https://prdt.ybtour.co.kr/product/detailPackage?dspSid=AAJE003&evCd=JOP1275-270209LJ00&menu=PKG)의 검색 색인상 2027-02-09 출발 성인 가격. 진에어·쇼핑1회·최소4명. 직접 재열람 시 본문 없음 |
| real-easy-921 | 여행이지 | JKP921 · 전통온천호텔1박+시내호텔1박, 규슈3일 | 729,000원~ | [공식 목록](https://www.kyowontour.com/display/masterMain?menuCode=M55010801) 직접 열람. 부산출발·에어부산·최소6명. 출발일별 가격 미확인 |
| real-easy-986 | 여행이지 | JKP986 · 품격큐슈3일 · 온천호텔2박 | 789,000원~ | 같은 [공식 목록](https://www.kyowontour.com/display/masterMain?menuCode=M55010801) 직접 열람. 부산출발·에어부산. 유후인·벳부·아소·야나가와. 상세 시간 미확인 |
| real-vgt-025 | 참좋은여행 | JPP025 · 북해도/비에이4일 · 도카치가와 모르온천 | 1,099,000원~ | [공식 목록](https://www.verygoodtour.com/Home/PackageMain) 직접 열람. 팁 포함. 날짜별 가격·항공·쇼핑·상세 일정은 미확인 |
| real-vgt-6690 | 참좋은여행 | JPP6690 · 오사카 핵심4일 · 히노데 시내 온천3연박 | 999,000원~ | 같은 [공식 목록](https://www.verygoodtour.com/Home/PackageMain) 직접 열람. 팁 포함, 교토·고베·나라. 상세 일정과 정량 휴식 정보 미확인 |

상품명은 표시 공간을 고려해 사실적 핵심명으로 축약했습니다. 원래 상품 코드와 이름의 주요 내용은 출처 링크 및 메모에서 확인할 수 있습니다. 부산출발은 출발 공항을 김해로 정규화했으며 이 정규화와 색인 기반 자료의 제한을 메모에 남겼습니다.

모두투어의 [공식 기획전](https://www.modetour.com/promotion/1103)에서는 북해도 품격온천4일 등의 범주를 찾았지만 단일 상품 가격·날짜를 충분히 확인하지 못해 DB에 실상품으로 등록하지 않았습니다. 과거 PDF 상품은 현재 판매 상품으로 사용하지 않았습니다.

모든 실제 상품의 보행 거리·차량 시간·휴식 시간·계단 부담은 근거 부족으로 null/unknown입니다. 온천 포함과 숙박 연박 사실을 정량 휴식시간으로 바꾸지 않았습니다. 확인되지 않은 쇼핑·선택관광·취소조건도 비워두었습니다.

## 자동 수집 상태

하나투어·모두투어·노랑풍선·참좋은여행·여행이지의 robots.txt를 웹 도구로 확인하려 했으나 오류가 반환되었습니다. 약관상 자동 수집 및 재사용 허용 여부도 검증 완료하지 못했습니다. 따라서 직접 HTML 다운로드/Playwright 크롤러, 정기 수집, 접근제어 우회를 실행하지 않았습니다. 검색 색인과 공식 공개 페이지 열람을 통한 제한적인 사실 조사를 수동 시드로 정리했습니다.

자동 수집 모듈은 승인된 공식 API 또는 제휴 공급자 어댑터가 연결되기 전 비활성화됩니다. 정책과 권한을 확인한 후에만 수집 구현을 추가할 수 있습니다.

## DEMO

별도로 12개 가상 상품을 생성했습니다. 모든 카드·상세·비교·부모님 화면에 DEMO 표시를 적용했습니다. 가격, 숙박, 항공, 이동 수치와 일정은 시연용 가정이며 예약할 수 없습니다. 실제 상품과 DEMO를 같이 선택하면 비교 화면에서 경고합니다.


## 항공·날씨 (2026-10-10)
- ANA 좌석 안내: https://www.ana.co.jp/en/jp/guide/flight_service_info/int-service/y/seat/ — 기종/구성별 사양이며 한 기종의 좌석을 전체 상품에 적용하지 않음. 실제 상품의 기종/좌석은 미확인.
- JMA Fukuoka monthly normals: https://www.data.jma.go.jp/stats/etrn/view/nml_sfc_ym.php?prec_no=82&block_no=47807&year=&month=&day=&view=
- JMA Osaka: https://www.data.jma.go.jp/stats/etrn/view/nml_sfc_ym.php?prec_no=62&block_no=47772&year=&month=&day=&view=
- JMA Sapporo: https://www.data.jma.go.jp/stats/etrn/view/nml_sfc_ym.php?prec_no=14&block_no=47412&year=&month=&day=&view=
- Open-Meteo forecast API: https://open-meteo.com/en/docs ; terms: https://open-meteo.com/en/terms — forecast_days=16, Asia/Tokyo, non-commercial demo free API, CC BY 4.0 attribution.
