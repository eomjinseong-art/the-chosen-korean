/** Tiny inline markdown renderer for text coming from content/the-chosen-guide.md */
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function mdInline(s: string, opts: { refs?: boolean } = {}) {
  let h = esc(s)
    .replace(/&lt;br\s*\/?&gt;/gi, "<br>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[성경 기반\]/g, '<span class="tag tag-bible">📖 성경 기반</span>')
    .replace(/\[드라마 창작\]/g, '<span class="tag tag-drama">🎬 드라마 창작</span>');
  if (opts.refs) h = h.replace(/\(([^()]*\d[^()]*)\)/g, '<span class="ref">($1)</span>');
  return h;
}

export function Md({ text, as = "span", className, refs }: { text: string; as?: "span" | "p" | "div" | "li"; className?: string; refs?: boolean }) {
  const Tag = as;
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: mdInline(text, { refs }) }} />;
}

export function MdTable({
  header,
  rows,
  renderCell,
  className,
}: {
  header: string[];
  rows: string[][];
  renderCell?: (cell: string, col: number, row: string[]) => React.ReactNode;
  className?: string;
}) {
  return (
    <div className="table-wrap">
      <table className={className}>
        <thead>
          <tr>
            {header.map((h, i) => (
              <th key={i}>
                <Md text={h} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              {r.map((c, ci) => (
                <td key={ci}>{renderCell ? renderCell(c, ci, r) : <Md text={c} />}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
