import { existsSync,writeFileSync,mkdirSync } from "node:fs";
import { randomBytes } from "node:crypto";
mkdirSync("prisma",{recursive:true});
// Some Prisma SQLite engine versions require the target file to exist before db push.
if(!existsSync("prisma/dev.db"))writeFileSync("prisma/dev.db","");
if(!existsSync(".env")){
 const password=randomBytes(18).toString("base64url");
 writeFileSync(".env",`DATABASE_URL="file:./dev.db"\nADMIN_PASSWORD="${password}"\nAUTH_SECRET="${randomBytes(32).toString("hex")}"\n`,{mode:0o600});
 writeFileSync("local-admin.txt",`Local administrator: /admin\nPassword: ${password}\n`,{mode:0o600});
 console.log("Created local environment; administrator password is in local-admin.txt.");
}else console.log("Existing .env preserved.");
