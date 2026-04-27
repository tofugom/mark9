import React, { useState } from "react";
import { Check, Trash2, CornerDownRight, AlertTriangle } from "lucide-react";
import type { CommentThread } from "../types.js";

export interface CommentThreadViewProps {
  thread: CommentThread;
  /** False when anchor resolution failed — the thread is "orphaned". */
  resolved?: boolean;
  active?: boolean;
  onActivate?(): void;
  onReply(body: string): void | Promise<void>;
  onResolve?(): void | Promise<void>;
  onDelete?(): void | Promise<void>;
}

/**
 * Renders one comment thread: quoted source text + chronological messages +
 * reply box. Slack canvas-style — the quote sits at the top as a blockquote and
 * the messages appear underneath.
 */
export function CommentThreadView({
  thread,
  resolved = true,
  active,
  onActivate,
  onReply,
  onResolve,
  onDelete,
}: CommentThreadViewProps): React.ReactElement {
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleReply() {
    if (!reply.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onReply(reply.trim());
      setReply("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className={`border rounded-md p-3 flex flex-col gap-2 cursor-pointer transition-colors ${
        active
          ? "border-[var(--accent)] bg-[var(--bg-hover)]"
          : "border-[var(--border-primary)] hover:bg-[var(--bg-hover)]"
      } ${thread.status === "resolved" ? "opacity-60" : ""}`}
      onClick={onActivate}
    >
      {!resolved && (
        <div className="flex items-center gap-1 text-[11px] text-amber-500">
          <AlertTriangle size={12} />
          <span>Anchor not found in current document</span>
        </div>
      )}

      <blockquote className="border-l-2 border-[var(--accent)] pl-2 text-[12px] text-[var(--text-secondary)] line-clamp-3">
        {thread.quotedText}
      </blockquote>

      <div className="flex flex-col gap-2">
        {thread.messages.map((msg) => (
          <div key={msg.id} className="flex flex-col gap-0.5">
            <div className="text-[11px] text-[var(--text-secondary)]">
              <span className="font-medium text-[var(--text-primary)]">
                {msg.author}
              </span>
              {" · "}
              {formatTime(msg.createdAt)}
            </div>
            <div className="text-[13px] text-[var(--text-primary)] whitespace-pre-wrap">
              {msg.body}
            </div>
          </div>
        ))}
      </div>

      {thread.status !== "resolved" && (
        <div className="flex items-end gap-1 mt-1" onClick={(e) => e.stopPropagation()}>
          <CornerDownRight size={14} className="text-[var(--text-secondary)] mt-2" />
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Reply…"
            className="flex-1 text-[13px] p-1.5 rounded border border-[var(--border-primary)] bg-[var(--bg-app)] text-[var(--text-primary)] resize-none focus:outline-none focus:border-[var(--accent)]"
            rows={1}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                void handleReply();
              }
            }}
          />
          <button
            type="button"
            className="px-2 py-1 text-[12px] rounded bg-[var(--accent)] text-white disabled:opacity-50"
            onClick={() => void handleReply()}
            disabled={!reply.trim() || submitting}
          >
            Send
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 pt-1 text-[11px] text-[var(--text-secondary)]" onClick={(e) => e.stopPropagation()}>
        {onResolve && thread.status !== "resolved" && (
          <button
            type="button"
            className="flex items-center gap-1 hover:text-[var(--text-primary)]"
            onClick={() => void onResolve()}
          >
            <Check size={12} />
            Resolve
          </button>
        )}
        {thread.status === "resolved" && (
          <span className="text-green-600">Resolved</span>
        )}
        {onDelete && (
          <button
            type="button"
            className="flex items-center gap-1 hover:text-red-500 ml-auto"
            onClick={() => void onDelete()}
          >
            <Trash2 size={12} />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = Date.now();
  const diff = (now - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString();
}
