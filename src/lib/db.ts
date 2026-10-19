import { presentationDemos } from "./presentation-data";
import data from "../../prisma/seed-data.json";
import { tripSchema } from "./validation";
import type { Trip } from "./types";
// Read-only presentation data. No database, credentials or server writes.
const trips: Trip[] = data.map(item => tripSchema.parse({...item,presentationDemo:presentationDemos[item.id]??null}));
export async function getTrips(): Promise<Trip[]> { return structuredClone(trips); }
export async function getTrip(id: string): Promise<Trip | null> { const t = trips.find(t => t.id === id); return t ? structuredClone(t) : null; }
