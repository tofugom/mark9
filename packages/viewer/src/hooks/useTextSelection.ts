import { useEffect, useState, useCallback } from "react";

export interface TextSelection {
  /** Text content of the selection. */
  text: string;
  /** Start offset within the container's plain-text projection. */
  start: number;
  /** End offset within the container's plain-text projection. */
  end: number;
  /** Bounding rect of the selection (viewport coords). */
  rect: DOMRect;
}

/**
 * Track selections inside `containerRef`. When the user releases the mouse
 * after selecting non-empty text inside the container, `selection` becomes
 * populated. Clearing the selection (or selecting outside) resets it to null.
 *
 * Offsets are computed against the container's `textContent`, so they line up
 * with the document text used by `@mark9/comments` anchor resolution.
 */
export function useTextSelection(
  containerRef: React.RefObject<HTMLElement | null>,
): {
  selection: TextSelection | null;
  clear: () => void;
} {
  const [selection, setSelection] = useState<TextSelection | null>(null);

  const clear = useCallback(() => setSelection(null), []);

  useEffect(() => {
    function handleSelectionChange() {
      const container = containerRef.current;
      if (!container) return;

      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
        setSelection(null);
        return;
      }

      const range = sel.getRangeAt(0);
      if (
        !container.contains(range.startContainer) ||
        !container.contains(range.endContainer)
      ) {
        setSelection(null);
        return;
      }

      const text = sel.toString();
      if (!text.trim()) {
        setSelection(null);
        return;
      }

      const start = offsetWithin(container, range.startContainer, range.startOffset);
      const end = offsetWithin(container, range.endContainer, range.endOffset);
      const rect = range.getBoundingClientRect();

      setSelection({
        text,
        start: Math.min(start, end),
        end: Math.max(start, end),
        rect,
      });
    }

    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, [containerRef]);

  return { selection, clear };
}

/**
 * Walk the DOM until we reach `target` and accumulate the visible text length.
 * For text nodes the offset is added directly; for element nodes we walk into
 * children up to the given child index.
 */
function offsetWithin(
  root: HTMLElement,
  target: Node,
  offsetInTarget: number,
): number {
  let total = 0;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);

  if (target.nodeType === Node.TEXT_NODE) {
    let current = walker.nextNode();
    while (current) {
      if (current === target) {
        return total + offsetInTarget;
      }
      total += current.textContent?.length ?? 0;
      current = walker.nextNode();
    }
    return total;
  }

  // Element node: walk into all text descendants up to (but not including)
  // the child at `offsetInTarget`.
  const sentinel = target.childNodes[offsetInTarget] ?? null;
  let current = walker.nextNode();
  while (current) {
    if (sentinel && (current === sentinel || sentinel.contains(current))) {
      return total;
    }
    total += current.textContent?.length ?? 0;
    current = walker.nextNode();
  }
  return total;
}
