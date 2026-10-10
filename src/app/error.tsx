"use client";
export default function Error({reset}:{reset:()=>void}){return <section className="container empty"><h1>화면을 불러오지 못했어요</h1><p>잠시 후 다시 시도해주세요. 로컬 DB 초기화 여부도 확인해주세요.</p><button className="button button-primary" onClick={reset}>다시 시도</button></section>;}
