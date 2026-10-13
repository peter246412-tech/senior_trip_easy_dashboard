// View-only formatting. Stored provenance and recommendation inputs stay intact.
export function conciseCopy(text:string){return text.replace(/\s*\([^)]*(?:데모|DEMO|시연)[^)]*\)/gi,"").replace(/\bDEMO[ -]*/gi,"").replace(/데모\s*(?:예시|가정)?/g,"").replace(/시연용|시연/g,"").trim();}
