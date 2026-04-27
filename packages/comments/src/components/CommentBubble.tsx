import React, { useState } from "react";
import { MessageSquarePlus } from "lucide-react";

export interface CommentBubbleProps {
  /** Anchor position in viewport coords (top of the selection). */
  x: number;
  y: number;
  /** The currently selected text — shown as a hint inside the popover. */
  selectedText: string;
  onSubmit(body: string): void | Promise<void>;
  onCancel(): void;
}

/**
 * Floating popover that appears next to a text selection. Click "Add comment"
 * to expand the input, type a comment, submit. Submitting calls `onSubmit`;
 * `onCancel` closes without saving.
 */
export function CommentBubble({
  x,
  y,
  selectedText,
  onSubmit,
  onCancel,
}: CommentBubbleProps): React.ReactElement {
  const [expanded, setExpanded] = useState(false);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!body.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(body.trim());
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="absolute z-50 bg-[var(--bg-app)] border border-[var(--border-primary)] rounded-md shadow-lg"
      style={{ left: x, top: y, minWidth: 280 }}
      role="dialog"
      aria-label="Add comment"
    >
      {!expanded ? (
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-2 text-[13px] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] w-full"
          onClick={() => setExpanded(true)}
        >
          <MessageSquarePlus size={14} />
          Add comment
        </button>
      ) : (
        <div className="p-2 flex flex-col gap-2">
          <div className="border-l-2 border-[var(--accent)] pl-2 text-[12px] text-[var(--text-secondary)] line-clamp-2">
            {selectedText}
          </div>
          <textarea
            autoFocus
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write a comment…"
            className="w-full text-[13px] p-2 rounded border border-[var(--border-primary)] bg-[var(--bg-app)] text-[var(--text-primary)] resize-none focus:outline-none focus:border-[var(--accent)]"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Escape") onCancel();
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                void handleSubmit();
              }
            }}
          />
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              className="px-2 py-1 text-[12px] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-3 py-1 text-[12px] rounded bg-[var(--accent)] text-white disabled:opacity-50"
              onClick={() => void handleSubmit()}
              disabled={!body.trim() || submitting}
            >
              {submitting ? "Saving…" : "Comment"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
