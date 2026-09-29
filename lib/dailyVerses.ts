import data from "@/content/daily-verses.json";

export type DailyVerse = { date: string; slot: "morning" | "evening"; ref: string; text: string; cheer?: string };

type Raw = { text: string; ref: string; cheer?: string };
const D = data as { translation: string; start: string; morning: Raw[]; evening: Raw[] };

export const DAILY_TRANSLATION = D.translation;

const SLOT_TIME = { morning: "05:56", evening: "21:56" } as const;

function addDays(iso: string, n: number) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Verses whose send time (Asia/Seoul) has already passed, newest first. */
export function sentVerses(now = new Date()): DailyVerse[] {
  const kst = new Date(now.getTime() + 9 * 3600 * 1000).toISOString(); // YYYY-MM-DDTHH:MM
  const today = kst.slice(0, 10);
  const hhmm = kst.slice(11, 16);
  const out: DailyVerse[] = [];
  const n = Math.max(D.morning.length, D.evening.length);
  for (let i = 0; i < n; i++) {
    const date = addDays(D.start, i);
    if (date > today) break;
    for (const slot of ["morning", "evening"] as const) {
      const v = D[slot][i];
      if (!v) continue;
      if (date === today && hhmm < SLOT_TIME[slot]) continue;
      out.push({ date, slot, ref: v.ref, text: v.text, cheer: v.cheer });
    }
  }
  return out.reverse();
}
