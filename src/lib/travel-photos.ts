import type { Trip } from "./types";

// Real destination photography, separate from package data and recommendation inputs.
export const travelPhotos = {
  yufuin: {
    src: "/images/japan/yufuin-lake.webp", title: "유후인 긴린호수",
    alt: "일본 유후인 긴린호수와 산자락의 실제 풍경 사진",
    author: "Suicasmo", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lake_Kinrin_20221022-1.jpg",
  },
  yufuinAutumn: {
    src: "/images/japan/yufuin-autumn.webp", title: "유후인 긴린호수와 마을",
    alt: "일본 유후인 긴린호수와 호숫가 마을의 실제 풍경 사진",
    author: "STA3816", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lake_Kinrin_October_2011_01.jpg",
  },
  osaka: {
    src: "/images/japan/osaka-castle.webp", title: "오사카성과 벚꽃",
    alt: "일본 오사카성과 벚꽃의 실제 풍경 사진",
    author: "Tom Purves", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Osaka_castle_and_cherry_blossoms_2006.jpg",
  },
  biei: {
    src: "/images/japan/biei-blue-pond.webp", title: "홋카이도 비에이 청의 호수",
    alt: "일본 홋카이도 비에이 청의 호수의 실제 풍경 사진",
    author: "Noriyoshi Emura", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Shirogane_Blue_Pond_2015-09-15.jpg",
  },
  otaru: {
    src: "/images/japan/otaru-canal.webp", title: "홋카이도 오타루 운하",
    alt: "일본 홋카이도 오타루 운하와 창고 거리의 실제 풍경 사진",
    author: "Suicasmo", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Otaru_Canal_20140817.jpg",
  },
} as const;

export const heroPhoto = travelPhotos.yufuin;

export function tripPhoto(trip: Pick<Trip, "id" | "image" | "places">) {
  // Resolve legacy asset paths without changing stored products or scores.
  switch (trip.image) {
    case "/images/onsen.png":
    case "/images/kyushu.jpg":
      return trip.id === "demo-02" || trip.id === "real-easy-986"
        ? travelPhotos.yufuinAutumn : travelPhotos.yufuin;
    case "/images/kyoto.jpg":
      return travelPhotos.osaka;
    case "/images/hokkaido.jpg":
    case "/images/hokkaido-lake.jpg":
      return trip.places.some(place => place.includes("비에이"))
        ? travelPhotos.biei : travelPhotos.otaru;
    default:
      return { src: trip.image, alt: "여행지 참고 사진" };
  }
}
