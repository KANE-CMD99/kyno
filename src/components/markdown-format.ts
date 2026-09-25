export type FormatAction =
  | "bold" | "italic" | "h2" | "h3" | "ul" | "ol" | "quote" | "link" | "image";

export interface FormatResult {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

/** 多行前缀类操作（列表/引用/标题）作用于光标或选区覆盖的每一行。 */
function mapLines(
  value: string,
  start: number,
  end: number,
  prefix: (index: number) => string
): FormatResult {
  // start === 0 必须单独处理：`lastIndexOf("\n", -1)` 按规范会被钳到 0，
  // 于是文档开头那个换行会被误当成「光标前的那一行」的分隔符，把前缀加到第二行上。
  const lineStart = start === 0 ? 0 : value.lastIndexOf("\n", start - 1) + 1;
  const lineEndIdx = value.indexOf("\n", end);
  const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;
  const block = value.slice(lineStart, lineEnd);
  const next = block
    .split("\n")
    .map((line, i) => `${prefix(i)}${line}`)
    .join("\n");
  return {
    value: value.slice(0, lineStart) + next + value.slice(lineEnd),
    selectionStart: lineStart,
    selectionEnd: lineStart + next.length,
  };
}

export function applyFormat(
  value: string,
  start: number,
  end: number,
  action: FormatAction,
  url = ""
): FormatResult {
  // 反向选择（从右往左拖）在浏览器里会出现 start > end。
  const [from, to] = start > end ? [end, start] : [start, end];
  const selected = value.slice(from, to);

  const wrap = (token: string, placeholder: string): FormatResult => {
    const body = selected || placeholder;
    const next = `${value.slice(0, from)}${token}${body}${token}${value.slice(to)}`;
    const s = from + token.length;
    return { value: next, selectionStart: s, selectionEnd: s + body.length };
  };

  switch (action) {
    case "bold":
      return wrap("**", "bold text");
    case "italic":
      return wrap("*", "italic text");
    case "h2":
      return mapLines(value, from, to, () => "## ");
    case "h3":
      return mapLines(value, from, to, () => "### ");
    case "ul":
      return mapLines(value, from, to, () => "- ");
    case "ol":
      return mapLines(value, from, to, (i) => `${i + 1}. `);
    case "quote":
      return mapLines(value, from, to, () => "> ");
    case "link": {
      const body = selected || "link text";
      const next = `${value.slice(0, from)}[${body}](${url || "https://"})${value.slice(to)}`;
      const s = from + 1;
      return { value: next, selectionStart: s, selectionEnd: s + body.length };
    }
    case "image": {
      const next = `${value.slice(0, from)}![](${url})${value.slice(to)}`;
      return { value: next, selectionStart: from, selectionEnd: from };
    }
  }
}
