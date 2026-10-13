import {test,expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {defaultPreference} from "../../src/lib/types";
const publicBase="http://127.0.0.1:3002";
test.use({baseURL:publicBase});
test("60-90 second demo preserves normal conditions and compares three products",async({page})=>{
 const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto("/");await page.evaluate(p=>localStorage.setItem("easytrip-preference",JSON.stringify(p)),{...defaultPreference,budget:1600000});await page.reload();
 await expect(page.locator(".hero-copy")).toContainText("국내외");
 await page.getByRole("link",{name:"발표 시연 시작하기 →",exact:true}).click();await expect(page.locator(".presentation-banner")).toBeVisible();
 for(let i=0;i<3;i++)await page.getByRole("button",{name:"다음",exact:true}).click();
 await page.getByRole("button",{name:"부모님께 맞는 여행 추천받기"}).click();
 await expect(page).toHaveURL(/recommended=1&demo=1/);await expect(page.locator(".top-results .trip-card")).toHaveCount(3);
 await expect(page.locator(".top-results")).not.toContainText("근거 신뢰");await expect(page.locator(".top-results")).toContainText("데모 예시");
 await page.getByRole("link",{name:"추천 3개 한눈에 비교하기 →"}).click();await expect(page.locator(".compare-card")).toHaveCount(3);
 await expect(page.locator(".comparison-page")).toHaveClass(/projector-mode/);await expect(page.locator(".comparison-mobility-row")).toHaveCount(3);
 await expect(page.locator(".compare-reasons")).toHaveCount(3);await expect(page.locator(".compare-cautions")).toHaveCount(3);
 await page.evaluate(()=>{window.scrollTo(0,0);(document.activeElement as HTMLElement)?.blur();});await page.screenshot({path:"docs/global-compare-desktop.png",fullPage:true});
 await page.reload();await expect(page.locator(".presentation-banner")).toBeVisible();
 await page.getByRole("link",{name:"시연 종료 · 내 조건 복원"}).click();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem("easytrip-preference")!).budget)).toBe(1600000);await expect(page.locator(".presentation-banner")).toHaveCount(0);expect(errors).toEqual([]);
});
test("quick result URL, unknown real data and mixed comparison remain honest",async({page,request})=>{
 await page.goto("/trips?recommended=1&demo=1");await expect(page.locator(".top-results .trip-card")).toHaveCount(3);
 await page.goto("/compare?ids=demo-01,real-easy-921&demo=1");await expect(page.locator(".warning-box")).toContainText("실제 조사 상품과 데모 예시");
 await expect(page.locator(".comparison-mobility")).toContainText("정보 없음");await expect(page.locator(".comparison-mobility")).not.toContainText("지도 기반 추정");
 await page.goto("/trips/real-easy-921");await expect(page.locator(".detail-metrics")).toContainText("정보 없음");await expect(page.locator(".detail-metrics .metric-state.confirmed")).toHaveCount(0);
 expect((await request.post(`${publicBase}/api/trips`,{data:{}})).status()).toBe(403);
 expect((await request.post(`${publicBase}/api/comparisons`,{headers:{Origin:publicBase},data:{ids:["demo-01","not-a-product"]}})).status()).toBe(400);
});
test("mobile layout, extra-large text and presentation accessibility",async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const path of ["/","/preferences?demo=1","/trips?recommended=1&demo=1","/compare?ids=demo-01,demo-02,demo-03&demo=1","/trips/demo-01","/booking/demo-01","/parents/demo-01","/about"]){
 await page.goto(path);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),path).toBeTruthy();
 const scan=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze();expect(scan.violations.map(v=>`${v.id}: ${v.nodes.map(n=>n.target).join()}`),path).toEqual([]);
 }
 await page.goto("/compare?ids=demo-01,demo-02,demo-03&demo=1");await page.evaluate(()=>{window.scrollTo(0,0);(document.activeElement as HTMLElement)?.blur();});await page.screenshot({path:"docs/global-compare-mobile.png",fullPage:true});
 await page.getByRole("button",{name:"메뉴 열기"}).click();await page.getByRole("button",{name:/큰 글씨/}).click();
 expect(await page.locator("html").evaluate(el=>parseFloat(getComputedStyle(el).fontSize))).toBe(24);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
});
