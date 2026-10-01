import { mdInline } from "./Md";

/** mdInline + [합의]/[논쟁]/[믿음] 표시 + [글자](https://링크) 지원. content/together.json 전용 */
export function togetherHtml(s: string) {
  return mdInline(s)
    .replace(/\[합의\]/g, '<span class="tag tag-fact">🏛️ 합의</span>')
    .replace(/\[논쟁\]/g, '<span class="tag tag-debate">⚖️ 논쟁</span>')
    .replace(/\[믿음\]/g, '<span class="tag tag-faith">🙏 믿음</span>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

export function TMd({ text, as = "span", className }: { text: string; as?: "span" | "p" | "div" | "li"; className?: string }) {
  const Tag = as;
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: togetherHtml(text) }} />;
}
