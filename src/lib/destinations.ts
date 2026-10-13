import type { Trip } from "./types";
export const countryNames: Record<string,string> = {KR:"대한민국",JP:"일본",TW:"대만",VN:"베트남",FR:"프랑스",IT:"이탈리아",ES:"스페인",DE:"독일",GB:"영국"};
export const countryName = (code:string) => countryNames[code] ?? code;
export function availableCountries(trips:Trip[]) { return [...new Set(trips.map(t=>t.country))]; }
export function availableRegions(trips:Trip[],country="ANY") { return [...new Set(trips.filter(t=>country==="ANY"||t.country===country).map(t=>t.region))]; }
