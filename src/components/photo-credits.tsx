import { travelPhotos } from "@/lib/travel-photos";

export function PhotoCredits() {
  return <section id="photos" className="panel">
    <h2>여행 사진 출처</h2>
    <p>실제 일본 여행지에서 촬영된 사진입니다. 지역을 소개하기 위한 참고 사진이며, 개별 상품의 숙소나 여행 시기의 모습을 보장하지 않습니다.</p>
    <dl className="info-list">{Object.values(travelPhotos).map(photo => <div key={photo.src}>
      <dt>{photo.title}</dt>
      <dd>{photo.author} · <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer">Wikimedia Commons 원본 ↗</a><br/>
        <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer">{photo.license}</a> · 크기·형식 변환 및 화면 비율에 따른 잘라보기
      </dd>
    </div>)}</dl>
  </section>;
}
