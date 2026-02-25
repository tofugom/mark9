export interface HeadingItem {
  level: number; // 1-6
  text: string;
  id: string; // unique id for scrolling
}

/**
 * Extract headings from markdown text.
 * Parses lines starting with # to build the outline.
 */
export function extractHeadings(markdown: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  const lines = markdown.split("\n");
  let counter = 0;

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = `heading-${counter++}`;
      headings.push({ level, text, id });
    }
  }

  return headings;
}
