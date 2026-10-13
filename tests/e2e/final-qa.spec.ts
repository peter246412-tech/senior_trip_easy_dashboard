import {test,expect} from "@playwright/test";
test.use({baseURL:"http://127.0.0.1:3002"});
test("normal and recommended cards consistently display provenance without confidence percentages",async({page})=>{
 for(const path of ["/trips","/trips?recommended=1","/trips?recommended=1&demo=1"]){
 await page.goto(path);await expect(page.locator(".trip-card").first()).toBeVisible();
 await expect(page.locator("body")).not.toContainText("근거 신뢰");await expect(page.locator("body")).not.toContainText("추정됨");
 for(const card of await page.locator(".trip-card").all()) {await expect(card.locator(".data-summary")).toHaveText("이동·휴식: 데모 예시");await expect(card.locator(".trip-metrics .metric-state.demo")).toHaveCount(3);}
 }
 await expect(page.locator(".tie-differences").first()).toContainText("조건의 차이");
});
test("two and three product comparisons use readable differences and original scores",async({page})=>{
 for(const ids of ["demo-01,demo-02","demo-01,demo-02,demo-03"]){
 await page.goto(`/compare?ids=${ids}`);await expect(page.locator(".compare-card")).toHaveCount(ids.split(",").length);
 const insights=page.locator(".comparison-insights");await expect(insights).toContainText("B 상품은 A 상품보다 가격이 10만 원 저렴하지만");
 await expect(insights).toContainText("하루 보행 거리는 0.6km 길고 휴식 시간은 30분 짧고 차량 이동 시간은 30분 깁니다");
 for(const term of ["휴식 시간는","차량 이동는","온천 쉼표과","추정됨","근거 신뢰"])await expect(page.locator("body")).not.toContainText(term);
 await expect(page.locator(".compare-card").nth(0).locator(".match-row")).toContainText("100/100");await expect(page.locator(".compare-card").nth(1).locator(".match-row")).toContainText("100/100");
 }
});
test("recommended result to detail and parent share completes the normal flow",async({page,context})=>{
 await context.grantPermissions(["clipboard-read","clipboard-write"]);
 await page.goto("/trips?recommended=1");await page.locator(".top-results .trip-card").first().getByRole("link",{name:"상세 보기"}).click();
 await expect(page.locator(".detail-metrics .metric-state.demo")).toHaveCount(3);await page.getByRole("link",{name:"부모님께 보여드리기"}).click();
 await expect(page).toHaveURL(/parents\/demo-/);await page.getByRole("button",{name:"링크 복사",exact:true}).click();await expect(page.getByRole("status").first()).toContainText("링크를 복사했어요");
 expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain("/parents/demo-");
});
