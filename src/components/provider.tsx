"use client";
import { createContext,useContext,useEffect,useState,ReactNode } from "react";
import { Preference,defaultPreference } from "@/lib/types";
import { preferenceSchema } from "@/lib/validation";
import { presentationPreference } from "@/lib/presentation";
type Ctx={ids:string[];toggle:(id:string)=>void;clear:()=>void;preference:Preference;setPreference:(p:Preference)=>void;large:boolean;toggleLarge:()=>void;notice:string;ready:boolean;demoMode:boolean;startDemo:()=>void;endDemo:()=>void};
const Context=createContext<Ctx|null>(null);
export function Provider({children}:{children:ReactNode}){
 const [ids,setIds]=useState<string[]>([]),[preference,setPref]=useState(defaultPreference),[large,setLarge]=useState(false),[notice,setNotice]=useState(""),[ready,setReady]=useState(false),[demoMode,setDemoMode]=useState(false);
 function restoreNormal(){try{const p=preferenceSchema.safeParse(JSON.parse(localStorage.getItem("easytrip-preference")??"null"));setPref(p.success?p.data:defaultPreference);const items=JSON.parse(localStorage.getItem("easytrip-compare")??"[]");setIds(Array.isArray(items)?items.filter((x:unknown)=>typeof x==="string").slice(0,3):[]);}catch{setPref(defaultPreference);setIds([]);}}
 useEffect(()=>{restoreNormal();try{setLarge(localStorage.getItem("easytrip-large")==="true");if(sessionStorage.getItem("easytrip-demo")==="true"){const p=preferenceSchema.safeParse(JSON.parse(sessionStorage.getItem("easytrip-demo-pref")??"null"));setPref(p.success?p.data:presentationPreference);const saved=JSON.parse(sessionStorage.getItem("easytrip-demo-ids")??"[]");setIds(Array.isArray(saved)?saved.filter((x:unknown)=>typeof x==="string").slice(0,3):[]);setDemoMode(true);}}catch{}setReady(true);},[]);
 useEffect(()=>{if(ready){try{if(demoMode){sessionStorage.setItem("easytrip-demo","true");sessionStorage.setItem("easytrip-demo-pref",JSON.stringify(preference));sessionStorage.setItem("easytrip-demo-ids",JSON.stringify(ids));}else{localStorage.setItem("easytrip-compare",JSON.stringify(ids));localStorage.setItem("easytrip-preference",JSON.stringify(preference));}localStorage.setItem("easytrip-large",String(large));}catch{}document.documentElement.classList.toggle("large-text",large);}},[ids,preference,large,ready,demoMode]);
 useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(""),3500);return()=>clearTimeout(timer);},[notice]);
 function toggle(id:string){if(ids.includes(id)){setIds(ids.filter(x=>x!==id));setNotice("비교함에서 뺐습니다");}else if(ids.length>=3)setNotice("최대 3개까지 비교할 수 있습니다. 기존 상품을 먼저 빼주세요.");else{setIds([...ids,id]);setNotice("비교함에 담았습니다");}}
 function startDemo(){setPref(structuredClone(presentationPreference));setIds([]);setDemoMode(true);}
 function endDemo(){restoreNormal();setDemoMode(false);try{sessionStorage.removeItem("easytrip-demo");sessionStorage.removeItem("easytrip-demo-pref");sessionStorage.removeItem("easytrip-demo-ids");}catch{}}
 return <Context.Provider value={{ids,toggle,clear:()=>setIds([]),preference,setPreference:setPref,large,toggleLarge:()=>setLarge(!large),notice,ready,demoMode,startDemo,endDemo}}>{children}<div className={`toast ${notice?"visible":""}`} role="status" aria-live="polite">{notice}</div></Context.Provider>;
}
export function useTripContext(){const ctx=useContext(Context);if(!ctx)throw new Error("Provider missing");return ctx;}
