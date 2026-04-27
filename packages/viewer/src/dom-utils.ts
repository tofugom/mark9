/**
 * Build a DOM `Range` covering the given plain-text offsets within `root`.
 * Returns null if the offsets fall outside the rendered text.
 */
export function rangeFromOffsets(
  root: HTMLElement,
  start: number,
  end: number,
): Range | null {
  const range = document.createRange();
  const startPos = nodeAtOffset(root, start);
  const endPos = nodeAtOffset(root, end);
  if (!startPos || !endPos) return null;
  try {
    range.setStart(startPos.node, startPos.offset);
    range.setEnd(endPos.node, endPos.offset);
  } catch {
    return null;
  }
  return range;
}

function nodeAtOffset(
  root: HTMLElement,
  offset: number,
): { node: Node; offset: number } | null {
  let remaining = offset;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  let current = walker.nextNode();
  let last: Node | null = null;
  while (current) {
    const len = current.textContent?.length ?? 0;
    if (remaining <= len) {
      return { node: current, offset: remaining };
    }
    remaining -= len;
    last = current;
    current = walker.nextNode();
  }
  if (last) {
    return { node: last, offset: last.textContent?.length ?? 0 };
  }
  return null;
}

const BLOCK_TAGS = new Set([
  "P",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "BLOCKQUOTE",
  "PRE",
  "LI",
  "TABLE",
  "TR",
  "UL",
  "OL",
  "HR",
  "FIGURE",
  "DIV",
]);

/**
 * Walk up from `node` until we find a block-level element living inside
 * `bounded`. Returns null if no such ancestor exists.
 */
export function closestBlock(node: Node, bounded: HTMLElement): HTMLElement | null {
  let cur: Node | null = node;
  while (cur && cur !== bounded) {
    if (cur instanceof HTMLElement && BLOCK_TAGS.has(cur.tagName)) {
      return cur;
    }
    cur = cur.parentNode;
  }
  return null;
}
