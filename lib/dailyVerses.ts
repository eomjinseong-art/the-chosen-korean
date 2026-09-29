import data from "@/content/daily-verses.json";

export type DailyVerse = { slot: "morning" | "evening"; ref: string; text: string; cheer?: string };

type Raw = { text: string; ref: string; cheer?: string };
const D = data as { translation: string; morning: Raw[]; evening: Raw[] };

export const DAILY_TRANSLATION = D.translation;

/** All verses, grouped by slot. */
export function allVerses() {
  const map = (slot: DailyVerse["slot"]) => D[slot].map((v) => ({ slot, ref: v.ref, text: v.text, cheer: v.cheer }));
  return { morning: map("morning"), evening: map("evening") };
}
