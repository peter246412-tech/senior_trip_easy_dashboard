import {test,expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test.use({baseURL:"http://127.0.0.1:3002"});
for(const width of [1440,1024,390])test(`final card rendering at ${width}px`,async({page})=>{
 const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));await page.setViewportSize({width,height:1000});await page.goto("/trips?recommended=1&demo=1");await page.evaluate(()=>document.fonts.ready);
 const cards=page.locator(".top-results .trip-card");await expect(cards).toHaveCount(3);const heights:number[]=[];
 for(const card of await cards.all()){
 await expect(card.locator(".trip-fact")).toHaveCount(5);await expect(card.locator(".fact-meal")).toContainText("한식");await expect(card.locator(".fact-weather")).toContainText("후쿠오카 11월");
 for(const term of ["DEMO","데모 예시","시연용"])await expect(card).not.toContainText(term);
 const bounds=await card.evaluate(el=>{
 const card=el.getBoundingClientRect();const rows=[...el.querySelectorAll('.trip-fact')].map(row=>{const icon=row.querySelector('svg')!.getBoundingClientRect(),label=row.querySelector('.fact-label')!.getBoundingClientRect(),value=row.querySelector('.fact-value')!.getBoundingClientRect();return {iconRight:icon.right,labelLeft:label.left,labelRight:label.right,valueLeft:value.left,valueRight:value.right,cardRight:card.right};});
 const words=[...el.querySelectorAll('.meal-part,.weather-location,.weather-temperature')].map(node=>{const range=document.createRange();range.selectNodeContents(node);return [...range.getClientRects()].filter(r=>r.width>0&&r.height>0).map(r=>({top:r.top,right:r.right}));});return {height:card.height,rows,words};});
 heights.push(bounds.height);for(const row of bounds.rows){expect(row.iconRight).toBeLessThanOrEqual(row.labelLeft-4);expect(row.labelRight).toBeLessThanOrEqual(row.valueLeft-4);expect(row.valueRight).toBeLessThanOrEqual(row.cardRight-12);}for(const rects of bounds.words){expect(new Set(rects.map(r=>Math.round(r.top))).size).toBe(1);}
 }
 if(width>=1024)expect(Math.max(...heights)-Math.min(...heights)).toBeLessThanOrEqual(2);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
 await page.evaluate(()=>{window.scrollTo(0,0);(document.activeElement as HTMLElement)?.blur();});await page.locator(".top-results").screenshot({path:`docs/final-cards-${width}.png`,style:".header,.skip-link{visibility:hidden!important}"});
 const scan=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze();expect(scan.violations.map(v=>v.id)).toEqual([]);
 await page.getByRole("link",{name:"추천 3개 한눈에 비교하기 →"}).click();await expect(page.locator(".compare-card")).toHaveCount(3);for(const term of ["DEMO","데모 예시","시연용"])expect(await page.locator(".comparison-page").innerText()).not.toContain(term);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
 expect(errors).toEqual([]);
});
