import React, { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import {
  AppLayout,
  useFileStore,
  useLayoutStore,
  useThemeStore,
  type FileNode,
} from "@mark9/ui";
import {
  CommentSidePanel,
  useCommentsStore,
  type CommentsAdapter,
} from "@mark9/comments";
import { Mark9Viewer } from "./Mark9Viewer.js";
import type { DocumentLoader } from "./adapters/fetch-loader.js";

export interface Mark9ViewerAppProps {
  /** File tree shown in the sidebar. Each leaf node's `path` is passed to the loader. */
  files: FileNode[];
  /** Resolves a file path to markdown content. */
  loader: DocumentLoader;
  /** Optional comments adapter — when provided, comment authoring is enabled. */
  commentsAdapter?: CommentsAdapter | null;
  /** Author name attached to new comments. */
  author?: string;
  /** Path to open by default. If omitted, the first file in the tree is shown. */
  initialPath?: string;
}

/**
 * Full app shell that wraps `<Mark9Viewer>` with a sidebar (file tree),
 * a right-hand comments panel, and a status bar — matching the layout the
 * editor uses, but read-only.
 */
export function Mark9ViewerApp({
  files,
  loader,
  commentsAdapter,
  author = "anonymous",
  initialPath,
}: Mark9ViewerAppProps): React.ReactElement {
  useThemeStore();

  const setFileTree = useFileStore((s) => s.setFileTree);
  const setActiveFile = useFileStore((s) => s.setActiveFile);
  const activeFile = useFileStore((s) => s.activeFile);

  const commentsPanelOpen = useLayoutStore((s) => s.commentsPanelOpen);
  const toggleCommentsPanel = useLayoutStore((s) => s.toggleCommentsPanel);
  const threadCount = useCommentsStore((s) => s.threads.length);

  const [content, setContent] = useState<string>("");
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setFileTree(files);
    if (!useFileStore.getState().activeFile) {
      const start = initialPath ?? findFirstFile(files);
      if (start) setActiveFile(start);
    }
  }, [files, initialPath, setFileTree, setActiveFile]);

  useEffect(() => {
    if (!activeFile) {
      setContent("");
      return;
    }
    let cancelled = false;
    setLoadError(null);
    loader
      .load(activeFile)
      .then((md) => {
        if (!cancelled) setContent(md);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : String(err));
          setContent("");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [activeFile, loader]);

  const showCommentsPanel = !!commentsAdapter && commentsPanelOpen;

  return (
    <AppLayout
      rightPanel={
        showCommentsPanel ? (
          <div className="w-[320px] border-l border-[var(--border-primary)] bg-[var(--bg-app)] overflow-y-auto h-full">
            <CommentSidePanel author={author} onClose={toggleCommentsPanel} />
          </div>
        ) : undefined
      }
    >
      <div className="relative flex-1 min-h-0 flex flex-col">
        {loadError ? (
          <div className="p-6 text-[13px] text-red-500">{loadError}</div>
        ) : activeFile ? (
          <Mark9Viewer
            documentPath={activeFile}
            markdown={content}
            commentsAdapter={commentsAdapter}
            author={author}
            className="flex-1 min-h-0 overflow-y-auto"
          />
        ) : (
          <div className="p-6 text-[13px] text-[var(--text-secondary)]">
            Select a file from the sidebar to preview.
          </div>
        )}

        {commentsAdapter && !commentsPanelOpen && (
          <button
            type="button"
            onClick={toggleCommentsPanel}
            className="absolute top-2 right-2 z-20 flex items-center gap-1 px-2 h-7 rounded border border-[var(--border-primary)] bg-[var(--bg-app)] text-[12px] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] cursor-pointer shadow-sm"
            title="Show comments panel"
          >
            <MessageSquare size={13} />
            <span>Comments {threadCount > 0 ? `(${threadCount})` : ""}</span>
          </button>
        )}
      </div>
    </AppLayout>
  );
}

function findFirstFile(nodes: FileNode[]): string | null {
  for (const n of nodes) {
    if (n.type === "file") return n.path;
    if (n.children) {
      const found = findFirstFile(n.children);
      if (found) return found;
    }
  }
  return null;
}
