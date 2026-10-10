import Link from "next/link";
export default function NotFound(){return <section className="container empty"><h1>페이지를 찾을 수 없어요</h1><p>삭제되었거나 주소가 바뀐 여행상품일 수 있습니다.</p><Link className="button button-primary" href="/trips">여행상품 찾아보기</Link></section>;}
