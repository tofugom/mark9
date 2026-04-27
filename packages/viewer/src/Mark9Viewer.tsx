import React, { useEffect, useRef, useState } from "react";
import { Mark9Editor } from "@mark9/ui";
import {
  CommentBubble,
  computeAnchor,
  useCommentsStore,
  type CommentsAdapter,
} from "@mark9/comments";
import { useTextSelection } from "./hooks/useTextSelection.js";
import { useCommentHighlights } from "./hooks/useCommentHighlights.js";

export interface Mark9ViewerProps {
  /** Path identifier for the document. Used as the comments key. */
  documentPath: string;
  /** Markdown source. The viewer always renders this read-only. */
  markdown: string;
  /** Optional adapter — when provided, comment authoring is enabled. */
  commentsAdapter?: CommentsAdapter | null;
  /** Author name attached to new comments. */
  author?: string;
  className?: string;
}

/**
 * Read-only Markdown preview component. Drop into any React app:
 *
 *   <Mark9Viewer documentPath="/docs/foo.md" markdown={text} />
 *
 * Supply `commentsAdapter` to enable Slack-canvas-style commenting on the
 * rendered output (text selection -> "Add comment" bubble -> threads in the
 * side panel exposed via `<CommentSidePanel>` from `@mark9/comments`).
 */
export function Mark9Viewer({
  documentPath,
  markdown,
  commentsAdapter,
  author = "anonymous",
  className,
}: Mark9ViewerProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);

  const setAdapter = useCommentsStore((s) => s.setAdapter);
  const loadFor = useCommentsStore((s) => s.loadFor);
  const addThread = useCommentsStore((s) => s.addThread);
  const resolved = useCommentsStore((s) => s.resolved);
  const activeThreadId = useCommentsStore((s) => s.activeThreadId);

  // Wire the adapter into the store.
  useEffect(() => {
    setAdapter(commentsAdapter ?? null);
  }, [commentsAdapter, setAdapter]);

  // (Re)load threads whenever the document changes.
  useEffect(() => {
    if (!commentsAdapter) return;
    // Use textContent of the rendered preview as the "document text" for
    // anchoring so offsets line up with what the user actually selects.
    const text = containerRef.current?.textContent ?? markdown;
    void loadFor(documentPath, text);
  }, [documentPath, markdown, commentsAdapter, loadFor]);

  const { selection, clear } = useTextSelection(containerRef);
  useCommentHighlights(containerRef, resolved, activeThreadId);

  const [bubblePos, setBubblePos] = useState<{ x: number; y: number } | null>(null);

  // Position the comment bubble near the selection rect.
  useEffect(() => {
    if (!commentsAdapter || !selection || !containerRef.current) {
      setBubblePos(null);
      return;
    }
    const containerRect = containerRef.current.getBoundingClientRect();
    setBubblePos({
      x: selection.rect.right - containerRect.left + 8,
      y: selection.rect.top - containerRect.top,
    });
  }, [selection, commentsAdapter]);

  async function handleSubmitComment(body: string) {
    if (!selection) return;
    const text = containerRef.current?.textContent ?? markdown;
    const anchor = computeAnchor(text, selection.start, selection.end);
    await addThread({
      anchor,
      quotedText: selection.text,
      body,
      author,
    });
    clear();
    window.getSelection()?.removeAllRanges();
  }

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      <style>{HIGHLIGHT_STYLES}</style>
      <Mark9Editor
        key={documentPath}
        defaultValue={markdown}
        readOnly
        className="h-full"
      />
      {bubblePos && selection && commentsAdapter && (
        <CommentBubble
          x={bubblePos.x}
          y={bubblePos.y}
          selectedText={selection.text}
          onSubmit={handleSubmitComment}
          onCancel={() => {
            clear();
            window.getSelection()?.removeAllRanges();
          }}
        />
      )}
    </div>
  );
}

const HIGHLIGHT_STYLES = `
::highlight(mark9-comment) {
  background-color: rgba(255, 213, 79, 0.35);
}
::highlight(mark9-comment-active) {
  background-color: rgba(255, 152, 0, 0.5);
}
`;
