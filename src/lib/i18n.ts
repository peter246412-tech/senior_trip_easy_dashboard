export const localeConfig={locale:"ko-KR",currency:"KRW",country:"JP",originCountry:"KR",timeZone:"Asia/Seoul"};
export const ko={brand:"easyTrip",tagline:"부모님 여행, 이제 고민하지 마세요.",unknown:"정보 확인 필요",match:"조건 일치 점수"};
export function localDate(value:string){return new Intl.DateTimeFormat(localeConfig.locale,{dateStyle:"medium",timeZone:localeConfig.timeZone}).format(new Date(value));}
