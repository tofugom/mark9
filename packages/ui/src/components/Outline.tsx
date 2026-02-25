import React, { useMemo } from "react";
import { useLayoutStore } from "../stores/layout-store.js";
import { useFileStore } from "../stores/file-store.js";
import { extractHeadings } from "../utils/extract-headings.js";

import type { HeadingItem } from "../utils/extract-headings.js";

/**
 * Indentation in pixels per heading level.
 * H1 = 0px indent, H2 = 12px, H3 = 24px, etc.
 */
const INDENT_PX_PER_LEVEL = 12;

/**
 * Attempt to scroll the Milkdown editor to a heading matching the given item.
 *
 * This works by finding heading elements in the rendered ProseMirror DOM and
 * matching by sequential index across all headings in document order.
 */
function scrollToHeading(item: HeadingItem): void {
  const editorEl = document.querySelector(".milkdown .ProseMirror");
  if (!editorEl) return;

  const headings = editorEl.querySelectorAll("h1, h2, h3, h4, h5, h6");

  // The heading id encodes the sequential index across all headings
  const targetIndex = parseInt(item.id.replace("heading-", ""), 10);
  if (targetIndex >= 0 && targetIndex < headings.length) {
    headings[targetIndex].scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // Fallback: match by tag name and text content
  const tagName = `H${item.level}`;
  for (const heading of headings) {
    if (
      heading.tagName === tagName &&
      heading.textContent?.trim() === item.text
    ) {
      heading.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
  }
}

export function Outline(): React.ReactElement | null {
  const outlineOpen = useLayoutStore((s) => s.outlineOpen);
  const currentContent = useFileStore((s) => s.currentContent);

  const headings = useMemo(
    () => extractHeadings(currentContent),
    [currentContent],
  );

  if (!outlineOpen) {
    return null;
  }

  return (
    <div className="w-52 bg-[var(--bg-toolbar)] border-l border-[var(--border-primary)] p-4 overflow-y-auto shrink-0">
      <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
        Outline
      </h3>
      <ul className="space-y-0.5 text-sm text-[var(--text-secondary)]">
        {headings.length === 0 ? (
          <li className="py-0.5 text-[var(--text-secondary)] italic">No headings found</li>
        ) : (
          headings.map((item: HeadingItem) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => scrollToHeading(item)}
                className="w-full text-left py-0.5 px-1 rounded hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors truncate"
                style={{ paddingLeft: `${(item.level - 1) * INDENT_PX_PER_LEVEL + 4}px` }}
                title={item.text}
              >
                {item.text}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
