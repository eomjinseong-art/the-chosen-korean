import art from "@/content/character-art.json";

export type Art = { src: string; title: string; artist: string; year: string; source: string; license: string; w: number; h: number };

const MAP = art as Record<string, Art>;

/** Public-domain painting (Wikimedia Commons) for a character slug, if one fits. */
export function artFor(slug?: string): Art | undefined {
  return slug ? MAP[slug] : undefined;
}
