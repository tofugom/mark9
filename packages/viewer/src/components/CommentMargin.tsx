import React, { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import type { ResolvedThread } from "@mark9/comments";
import { rangeFromOffsets, closestBlock } from "../dom-utils.js";

interface MarginBadge {
  /** Top offset within the scroll-content coordinate space. */
  top: number;
  count: number;
  threadIds: string[];
  active: boolean;
}

export interface CommentMarginProps {
  containerRef: React.RefObject<HTMLElement | null>;
  resolved: ResolvedThread[];
  activeThreadId: string | null;
  onSelect(threadId: string): void;
}

/**
 * Renders a small speech-bubble badge in the right margin of every block that
 * has at least one comment. Threads on the same block are grouped — clicking a
 * badge activates the first thread of that block in the side panel.
 */
export function CommentMargin({
  containerRef,
  resolved,
  activeThreadId,
  onSelect,
}: CommentMarginProps): React.ReactElement | null {
  const [badges, setBadges] = useState<MarginBadge[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function compute() {
      if (!container) return;
      const byBlock = new Map<HTMLElement, ResolvedThread[]>();

      for (const r of resolved) {
        if (!r.resolution) continue;
        const range = rangeFromOffsets(
          container,
          r.resolution.range.start,
          r.resolution.range.end,
        );
        if (!range) continue;
        const block = closestBlock(range.startContainer, container);
        if (!block) continue;
        const list = byBlock.get(block);
        if (list) {
          list.push(r);
        } else {
          byBlock.set(block, [r]);
        }
      }

      const containerRect = container.getBoundingClientRect();
      const next: MarginBadge[] = [];
      for (const [block, threads] of byBlock) {
        const blockRect = block.getBoundingClientRect();
        // Convert viewport coords to scroll-content coords.
        const top =
          blockRect.top - containerRect.top + container.scrollTop + 4;
        next.push({
          top,
          count: threads.length,
          threadIds: threads.map((t) => t.thread.id),
          active: threads.some((t) => t.thread.id === activeThreadId),
        });
      }

      next.sort((a, b) => a.top - b.top);
      setBadges(next);
    }

    compute();

    const ro = new ResizeObserver(compute);
    ro.observe(container);
    const mo = new MutationObserver(compute);
    mo.observe(container, {
      subtree: true,
      childList: true,
      characterData: true,
    });

    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [containerRef, resolved, activeThreadId]);

  if (badges.length === 0) return null;

  return (
    <>
      {badges.map((b) => (
        <button
          key={b.threadIds[0]}
          type="button"
          onClick={() => onSelect(b.threadIds[0]!)}
          className={`absolute z-10 flex items-center gap-1 px-1.5 h-5 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
            b.active
              ? "bg-[var(--accent)] text-white border-[var(--accent)]"
              : "bg-[var(--bg-app)] text-[var(--text-secondary)] border-[var(--border-primary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
          }`}
          style={{ top: b.top, right: 4 }}
          title={`${b.count} comment${b.count === 1 ? "" : "s"}`}
        >
          <MessageSquare size={11} />
          <span>{b.count}</span>
        </button>
      ))}
    </>
  );
}
