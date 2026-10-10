import type { Metadata } from "next";
import { Provider } from "@/components/provider";
import { Header,Footer,CompareBar } from "@/components/shell";
import "./globals.css";
export const metadata:Metadata={title:{default:"여행이지 · TripEasy | 부모님 여행, 이제 고민하지 마세요",template:"%s | 여행이지 · TripEasy"},description:"자녀가 부모님의 선호와 이동 조건에 맞는 일본 패키지여행을 비교하고 함께 결정하는 서비스"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body><Provider><a href="#main" className="skip-link">본문 바로가기</a><Header/><main id="main">{children}</main><Footer/><CompareBar/></Provider></body></html>;}
