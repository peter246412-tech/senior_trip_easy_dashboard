export const localeConfig={locale:"ko-KR",currency:"KRW",country:"ANY",originCountry:"KR",timeZone:"Asia/Seoul"};
export const ko={brand:"TripEasy",tagline:"부모님 여행, 이제 고민하지 마세요.",unknown:"정보 없음",match:"조건 일치 점수"};
export function localDate(value:string){return new Intl.DateTimeFormat(localeConfig.locale,{dateStyle:"medium",timeZone:localeConfig.timeZone}).format(new Date(value));}
