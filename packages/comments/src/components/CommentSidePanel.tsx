import React from "react";
import { X } from "lucide-react";
import { useCommentsStore } from "../stores/comments-store.js";
import { CommentThreadView } from "./CommentThreadView.js";

export interface CommentSidePanelProps {
  /** Author name attached to new comments. Host app injects this. */
  author: string;
  className?: string;
  emptyMessage?: React.ReactNode;
  /** Optional close handler — when provided, an X button appears in the header. */
  onClose?(): void;
}

/**
 * Right-side panel listing all threads for the current document. Threads are
 * ordered by anchor position in the document; orphans (anchors that no longer
 * resolve) sink to the bottom but are not removed.
 */
export function CommentSidePanel({
  author,
  className,
  emptyMessage,
  onClose,
}: CommentSidePanelProps): React.ReactElement {
  const resolved = useCommentsStore((s) => s.resolved);
  const activeThreadId = useCommentsStore((s) => s.activeThreadId);
  const setActiveThread = useCommentsStore((s) => s.setActiveThread);
  const addReply = useCommentsStore((s) => s.addReply);
  const setStatus = useCommentsStore((s) => s.setStatus);
  const removeThread = useCommentsStore((s) => s.removeThread);

  const sorted = [...resolved].sort((a, b) => {
    if (!a.resolution && !b.resolution) return 0;
    if (!a.resolution) return 1;
    if (!b.resolution) return -1;
    return a.resolution.range.start - b.resolution.range.start;
  });
  const orphans = sorted.filter((r) => !r.resolution).length;

  return (
    <div className={className}>
      <div className="px-4 py-2 border-b border-[var(--border-primary)] text-[11px] uppercase tracking-widest text-[var(--text-secondary)] flex items-center gap-2">
        <span>Comments ({sorted.length})</span>
        {orphans > 0 && (
          <span className="text-amber-500 normal-case tracking-normal text-[11px]">
            {orphans} orphaned
          </span>
        )}
        <span className="flex-1" />
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
            aria-label="Close comments panel"
            title="Close comments panel"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="px-4 py-6 text-[13px] text-[var(--text-secondary)]">
          {emptyMessage ??
            "No comments yet. Select text in the document to add one."}
        </div>
      ) : (
        <div className="flex flex-col gap-2 p-3 overflow-y-auto">
          {sorted.map(({ thread, resolution }) => (
            <CommentThreadView
              key={thread.id}
              thread={thread}
              resolved={resolution !== null}
              active={thread.id === activeThreadId}
              onActivate={() => setActiveThread(thread.id)}
              onReply={(body) => addReply(thread.id, body, author)}
              onResolve={() => setStatus(thread.id, "resolved")}
              onDelete={() => removeThread(thread.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
