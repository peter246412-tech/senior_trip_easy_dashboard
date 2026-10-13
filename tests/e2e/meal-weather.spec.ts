import {test,expect} from "@playwright/test";
import {readFileSync} from "node:fs";
import seed from "../../prisma/seed-data.json";
import examples from "../../prisma/presentation-demo.json";
test("cards and comparison are concise while detail retains data provenance",async({page})=>{
 await page.goto("http://127.0.0.1:3002/trips?recommended=1&demo=1");
 const card=page.locator(".top-results .trip-card").first();await expect(card.locator(".fact-meal .fact-value")).toContainText("한식");await expect(card.locator(".fact-meal .fact-value")).not.toContainText("자유식");await expect(card.locator(".demo-meal-label,.demo-weather-label")).toHaveCount(0);await expect(card.locator(".card-weather-compact")).toContainText("10~18°C");await expect(card.locator(".trip-fact")).toHaveCount(5);
 await page.getByRole("link",{name:"추천 3개 한눈에 비교하기 →"}).click();await expect(page.locator(".comparison-table")).toContainText("자유식");await expect(page.locator(".comparison-table")).not.toContainText("데모 예시");
 await page.getByRole("link",{name:"상세·원본 확인"}).first().click();await expect(page.locator(".info-list").first()).toContainText("자유식");await expect(page.locator(".info-list").first()).toContainText("데모 예시");
 await page.setViewportSize({width:390,height:844});await page.goto("http://127.0.0.1:3002/trips?recommended=1&demo=1");expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();await expect(page.locator(".fact-meal").first()).toBeVisible();
});
test("valid API forecast replaces demo temperature; failed API keeps explicit demo label",async({page,request})=>{
 const origin="http://127.0.0.1:3004",password=readFileSync(".env","utf8").match(/ADMIN_PASSWORD="([^"]+)"/)![1];
 const today=new Intl.DateTimeFormat("sv-SE",{timeZone:"Asia/Tokyo",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
 const source=seed.find(t=>t.id==="demo-01")!,id=`e2e-weather-${Date.now()}`;
 const trip={...source,id,name:"TEST 날씨 우선순위",departureDate:today,places:["후쿠오카"],presentationDemo:examples["demo-01"]};
 expect((await request.post(origin+"/api/admin/login",{headers:{Origin:origin},data:{password}})).ok()).toBeTruthy();
 expect((await request.post(origin+"/api/trips",{headers:{Origin:origin},data:trip})).status()).toBe(201);
 try{
 await page.route("**/api/weather?*",route=>route.fulfill({json:{city:"후쿠오카",checkedAt:new Date().toISOString(),daily:Array.from({length:3},(_,i)=>({date:new Date(Date.parse(today+"T00:00:00Z")+i*86400000).toISOString().slice(0,10),low:5,high:15,rainChance:20,rainMm:1,wind:10}))}}));
 await page.goto(origin+`/compare?ids=${id},demo-01`);const weather=page.locator(".comparison-row").filter({has:page.locator(".row-label",{hasText:"날씨"})}).locator(".comparison-value").first();
 await expect(weather).toContainText("후쿠오카");await expect(weather).toContainText("5~15°C");await expect(weather.locator(".demo-weather-label")).toHaveCount(0);
 await page.unroute("**/api/weather?*");await page.route("**/api/weather?*",route=>route.fulfill({status:502,json:{error:"TEST API failure"}}));await page.reload();await expect(weather).toContainText("10~18°C");await expect(weather.locator(".card-weather-load")).toBeVisible();
 }finally{expect((await request.delete(origin+`/api/trips/${id}`,{headers:{Origin:origin}})).ok()).toBeTruthy();}
});
