import Link from "next/link";
export const metadata={title:"발표용 사이트 안내",robots:{index:false,follow:false}};
export default function Page(){return <section className="container section"><div className="panel"><h1>발표용 사이트입니다</h1><p>상품 추천, 비교와 예약 과정을 체험할 수 있어요. 상품 수정 기능은 원본 프로젝트에서 이용할 수 있습니다.</p><Link className="button button-primary" href="/trips">여행 상품 둘러보기</Link></div></section>;}
