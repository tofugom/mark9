import { useEffect } from "react";
import type { ResolvedThread } from "@mark9/comments";

declare global {
  interface Window {
    Highlight?: typeof Highlight;
  }
}

/**
 * Paint highlight ranges over the viewer container for every resolved thread.
 *
 * Uses the CSS Custom Highlight API where available (Chromium 105+, Safari 17+)
 * because it doesn't mutate the DOM and survives ProseMirror re-renders. On
 * unsupported browsers we silently skip — the side panel is still useful and
 * clicking a thread can scroll into view via separate logic.
 */
export function useCommentHighlights(
  containerRef: React.RefObject<HTMLElement | null>,
  resolved: ResolvedThread[],
  activeThreadId: string | null,
): void {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (typeof CSS === "undefined" || !("highlights" in CSS)) return;
    const HighlightCtor = window.Highlight;
    if (!HighlightCtor) return;

    const ranges: Range[] = [];
    const activeRanges: Range[] = [];

    for (const { thread, resolution } of resolved) {
      if (!resolution) continue;
      const range = rangeFromOffsets(
        container,
        resolution.range.start,
        resolution.range.end,
      );
      if (!range) continue;
      if (thread.id === activeThreadId) {
        activeRanges.push(range);
      } else {
        ranges.push(range);
      }
    }

    const highlight = new HighlightCtor(...ranges);
    const activeHighlight = new HighlightCtor(...activeRanges);
    CSS.highlights.set("mark9-comment", highlight);
    CSS.highlights.set("mark9-comment-active", activeHighlight);

    return () => {
      CSS.highlights.delete("mark9-comment");
      CSS.highlights.delete("mark9-comment-active");
    };
  }, [containerRef, resolved, activeThreadId]);
}

function rangeFromOffsets(
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
