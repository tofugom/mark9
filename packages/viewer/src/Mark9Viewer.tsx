import React, { useEffect, useRef, useState } from "react";
import { Mark9Editor } from "@mark9/ui";
import {
  CommentBubble,
  computeAnchor,
  useCommentsStore,
  type CommentsAdapter,
} from "@mark9/comments";
import { useTextSelection, type TextSelection } from "./hooks/useTextSelection.js";
import { useCommentHighlights } from "./hooks/useCommentHighlights.js";
import { CommentMargin } from "./components/CommentMargin.js";

export interface Mark9ViewerProps {
  /** Path identifier for the document. Used as the comments key. */
  documentPath: string;
  /** Markdown source. */
  markdown: string;
  /** Optional adapter — when provided, comment authoring is enabled. */
  commentsAdapter?: CommentsAdapter | null;
  /** Author name attached to new comments. */
  author?: string;
  /**
   * When true, the rendered preview is editable (WYSIWYG). The host receives
   * edits via `onChange`. Defaults to false (true read-only viewer).
   */
  editable?: boolean;
  /**
   * Fired when the markdown changes in editable mode. The host is responsible
   * for persisting (debounced save, autosave, etc).
   */
  onChange?(markdown: string): void;
  className?: string;
}

/**
 * Markdown preview component — defaults to read-only, opt-in to live WYSIWYG
 * editing via `editable + onChange`. Drop into any React app:
 *
 *   <Mark9Viewer documentPath="/docs/foo.md" markdown={text} />
 *
 *   <Mark9Viewer documentPath="..." markdown={...}
 *                editable onChange={save} />
 *
 * Supply `commentsAdapter` to enable Slack-canvas-style commenting (text
 * selection -> "Add comment" bubble -> threads in the side panel exposed via
 * `<CommentSidePanel>` from `@mark9/comments`).
 */
export function Mark9Viewer({
  documentPath,
  markdown,
  commentsAdapter,
  author = "anonymous",
  editable = false,
  onChange,
  className,
}: Mark9ViewerProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);

  const setAdapter = useCommentsStore((s) => s.setAdapter);
  const loadFor = useCommentsStore((s) => s.loadFor);
  const setDocumentText = useCommentsStore((s) => s.setDocumentText);
  const addThread = useCommentsStore((s) => s.addThread);
  const resolved = useCommentsStore((s) => s.resolved);
  const activeThreadId = useCommentsStore((s) => s.activeThreadId);
  const setActiveThread = useCommentsStore((s) => s.setActiveThread);

  // Wire the adapter into the store.
  useEffect(() => {
    setAdapter(commentsAdapter ?? null);
  }, [commentsAdapter, setAdapter]);

  // (Re)load threads when the document changes. We *intentionally* don't
  // depend on `markdown` here — re-running this on every keystroke would
  // hammer the adapter and (worse, when content was in the deps) thrash any
  // downstream UI. The MutationObserver below keeps the store's
  // `documentText` fresh during edits.
  useEffect(() => {
    if (!commentsAdapter) return;
    void loadFor(documentPath, markdown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentPath, commentsAdapter, loadFor]);

  // Keep the comments store in sync with the rendered preview's plain text,
  // so selection offsets line up with what the user actually sees. The
  // observer is tied to the container only — markdown changes don't restart
  // it, which would otherwise churn during fast typing.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !commentsAdapter) return;
    const sync = () => setDocumentText(container.textContent ?? "");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(container, {
      subtree: true,
      childList: true,
      characterData: true,
    });
    return () => observer.disconnect();
  }, [commentsAdapter, setDocumentText]);

  // Track which document we've already fed into the editor. Once non-empty
  // markdown arrives for `documentPath`, we mount the editor and *never*
  // re-mount it for further edits within the same document. This is what
  // protects in-progress typing (and IME composition for languages like
  // Korean) from being wiped by a key-driven remount.
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  useEffect(() => {
    setLoadedFor(null);
  }, [documentPath]);
  useEffect(() => {
    if (markdown && loadedFor !== documentPath) {
      setLoadedFor(documentPath);
    }
  }, [markdown, documentPath, loadedFor]);
  const editorMounted = loadedFor === documentPath;

  const { selection, clear } = useTextSelection(containerRef);
  useCommentHighlights(containerRef, resolved, activeThreadId);

  // Pin the selection at the moment a bubble first appears so submission no
  // longer depends on the live native selection (which the browser collapses
  // when focus moves to the bubble's textarea or its Comment button).
  const [snap, setSnap] = useState<TextSelection | null>(null);
  const [bubblePos, setBubblePos] = useState<{ x: number; y: number } | null>(null);

  // Whenever the user makes a fresh selection, capture it. We never auto-clear
  // `snap` from this effect — only `closeBubble` does.
  useEffect(() => {
    if (!commentsAdapter) return;
    if (!selection) return;
    setSnap(selection);
  }, [selection, commentsAdapter]);

  // Reset the bubble when the document changes.
  useEffect(() => {
    setSnap(null);
    setBubblePos(null);
  }, [documentPath]);

  // Position the bubble using the snapshot so it stays pinned even after the
  // live selection collapses.
  useEffect(() => {
    if (!commentsAdapter || !snap || !containerRef.current) {
      setBubblePos(null);
      return;
    }
    const containerRect = containerRef.current.getBoundingClientRect();
    setBubblePos({
      x: snap.rect.right - containerRect.left + 8,
      y: snap.rect.top - containerRect.top,
    });
  }, [snap, commentsAdapter]);

  function closeBubble() {
    setSnap(null);
    clear();
    window.getSelection()?.removeAllRanges();
  }

  async function handleSubmitComment(body: string) {
    if (!snap) return;
    const text = containerRef.current?.textContent ?? markdown;
    const anchor = computeAnchor(text, snap.start, snap.end);
    await addThread({
      anchor,
      quotedText: snap.text,
      body,
      author,
    });
    closeBubble();
  }

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      <style>{HIGHLIGHT_STYLES}</style>
      {editorMounted ? (
        <Mark9Editor
          // Stable key per document + editable mode. We deliberately do *not*
          // include `markdown` in the key — Milkdown owns its own state once
          // mounted and a remount would clobber the user's cursor/selection
          // and abort active IME composition.
          key={`${documentPath}:${editable ? "edit" : "ro"}`}
          defaultValue={markdown}
          readOnly={!editable}
          onChange={editable ? onChange : undefined}
          className="h-full"
        />
      ) : (
        <div className="p-6 text-[13px] text-[var(--text-secondary)]">
          Loading…
        </div>
      )}
      {commentsAdapter && (
        <CommentMargin
          containerRef={containerRef}
          resolved={resolved}
          activeThreadId={activeThreadId}
          onSelect={setActiveThread}
        />
      )}
      {bubblePos && snap && commentsAdapter && (
        <CommentBubble
          x={bubblePos.x}
          y={bubblePos.y}
          selectedText={snap.text}
          onSubmit={handleSubmitComment}
          onCancel={closeBubble}
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
