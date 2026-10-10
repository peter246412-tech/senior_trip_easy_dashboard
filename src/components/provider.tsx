"use client";
import { createContext,useContext,useEffect,useState,ReactNode } from "react";
import { Preference,defaultPreference } from "@/lib/types";
import { preferenceSchema } from "@/lib/validation";
type Ctx={ids:string[];toggle:(id:string)=>void;clear:()=>void;preference:Preference;setPreference:(p:Preference)=>void;large:boolean;toggleLarge:()=>void;notice:string;ready:boolean};
const Context=createContext<Ctx|null>(null);
export function Provider({children}:{children:ReactNode}){const [ids,setIds]=useState<string[]>([]),[preference,setPref]=useState(defaultPreference),[large,setLarge]=useState(false),[notice,setNotice]=useState(""),[ready,setReady]=useState(false);
 useEffect(()=>{try{const items=JSON.parse(localStorage.getItem("easytrip-compare")??"[]");if(Array.isArray(items))setIds(items.filter((x:unknown)=>typeof x==="string").slice(0,3));const p=preferenceSchema.safeParse(JSON.parse(localStorage.getItem("easytrip-preference")??"null"));if(p.success)setPref(p.data);setLarge(localStorage.getItem("easytrip-large")==="true");}catch{}setReady(true);},[]);
 useEffect(()=>{if(ready){localStorage.setItem("easytrip-compare",JSON.stringify(ids));localStorage.setItem("easytrip-preference",JSON.stringify(preference));localStorage.setItem("easytrip-large",String(large));document.documentElement.classList.toggle("large-text",large);}},[ids,preference,large,ready]);
 useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(""),3500);return()=>clearTimeout(timer);},[notice]);
 function toggle(id:string){if(ids.includes(id)){setIds(ids.filter(x=>x!==id));setNotice("비교함에서 뺐습니다");}else if(ids.length>=3)setNotice("최대 3개까지 비교할 수 있습니다. 기존 상품을 먼저 빼주세요.");else{setIds([...ids,id]);setNotice("비교함에 담았습니다");}}
 return <Context.Provider value={{ids,toggle,clear:()=>setIds([]),preference,setPreference:setPref,large,toggleLarge:()=>setLarge(!large),notice,ready}}>{children}<div className={`toast ${notice?"visible":""}`} role="status" aria-live="polite">{notice}</div></Context.Provider>;
}
export function useTripContext(){const ctx=useContext(Context);if(!ctx)throw new Error("Provider missing");return ctx;}
