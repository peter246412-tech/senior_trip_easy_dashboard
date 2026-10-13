import values from "../../prisma/presentation-demo.json";
import { presentationDemoSchema } from "./validation";
import type { PresentationDemo } from "./types";
export const presentationDemos:Record<string,PresentationDemo>=Object.fromEntries(Object.entries(values).map(([id,value])=>[id,presentationDemoSchema.parse(value)]));
