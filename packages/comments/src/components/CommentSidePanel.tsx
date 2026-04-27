import React from "react";
import { useCommentsStore } from "../stores/comments-store.js";
import { CommentThreadView } from "./CommentThreadView.js";

export interface CommentSidePanelProps {
  /** Author name attached to new comments. Host app injects this. */
  author: string;
  className?: string;
  emptyMessage?: React.ReactNode;
}

/**
 * Right-side panel listing all threads for the current document. Open threads
 * first, then resolved, then orphaned (anchor unresolved).
 */
export function CommentSidePanel({
  author,
  className,
  emptyMessage,
}: CommentSidePanelProps): React.ReactElement {
  const resolved = useCommentsStore((s) => s.resolved);
  const activeThreadId = useCommentsStore((s) => s.activeThreadId);
  const setActiveThread = useCommentsStore((s) => s.setActiveThread);
  const addReply = useCommentsStore((s) => s.addReply);
  const setStatus = useCommentsStore((s) => s.setStatus);
  const removeThread = useCommentsStore((s) => s.removeThread);

  const sorted = [...resolved].sort((a, b) => statusRank(a) - statusRank(b));
  const orphans = sorted.filter((r) => !r.resolution).length;

  if (sorted.length === 0) {
    return (
      <div className={className}>
        <div className="px-4 py-6 text-[13px] text-[var(--text-secondary)]">
          {emptyMessage ?? "No comments yet. Select text in the document to add one."}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="px-4 py-2 border-b border-[var(--border-primary)] text-[11px] uppercase tracking-widest text-[var(--text-secondary)] flex items-center justify-between">
        <span>Comments ({sorted.length})</span>
        {orphans > 0 && (
          <span className="text-amber-500 normal-case tracking-normal text-[11px]">
            {orphans} orphaned
          </span>
        )}
      </div>
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
    </div>
  );
}

function statusRank(r: { thread: { status: string }; resolution: unknown }): number {
  if (!r.resolution) return 2;
  if (r.thread.status === "resolved") return 1;
  return 0;
}
