import React, { useCallback, useEffect, useRef, useState } from "react";
import { Check, Loader2, MessageSquare, Moon, Sun } from "lucide-react";
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
  /** Resolves a file path to markdown content. Provide `loader.save` to enable editing. */
  loader: DocumentLoader;
  /** Optional comments adapter — when provided, comment authoring is enabled. */
  commentsAdapter?: CommentsAdapter | null;
  /** Author name attached to new comments. */
  author?: string;
  /** Path to open by default. If omitted, the first file in the tree is shown. */
  initialPath?: string;
  /**
   * Allow editing when the loader supports `save`. Defaults to true; pass false
   * to force a strict read-only viewer even when `save` is available.
   */
  allowEditing?: boolean;
  /** Debounce window for autosave in editable mode. Default 600ms. */
  autoSaveMs?: number;
}

type SaveState = "idle" | "saving" | "saved" | "error";

export function Mark9ViewerApp({
  files,
  loader,
  commentsAdapter,
  author = "anonymous",
  initialPath,
  allowEditing = true,
  autoSaveMs = 600,
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
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const editable = allowEditing && typeof loader.save === "function";

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
    setSaveState("idle");
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

  // Debounced autosave on edits.
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleEdit = useCallback(
    (markdown: string) => {
      setContent(markdown);
      if (!editable || !loader.save || !activeFile) return;
      setSaveState("saving");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        try {
          await loader.save!(activeFile, markdown);
          setSaveState("saved");
          setTimeout(
            () =>
              setSaveState((s) => (s === "saved" ? "idle" : s)),
            1500,
          );
        } catch (err) {
          console.error("[mark9/viewer] save failed:", err);
          setSaveState("error");
        }
      }, autoSaveMs);
    },
    [editable, loader, activeFile, autoSaveMs],
  );

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

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
        <ViewerToolbar
          saveState={saveState}
          showCommentsButton={!!commentsAdapter && !commentsPanelOpen}
          threadCount={threadCount}
          onToggleComments={toggleCommentsPanel}
          editable={editable}
          activePath={activeFile}
        />

        {loadError ? (
          <div className="p-6 text-[13px] text-red-500">{loadError}</div>
        ) : activeFile ? (
          <Mark9Viewer
            documentPath={activeFile}
            markdown={content}
            commentsAdapter={commentsAdapter}
            author={author}
            editable={editable}
            onChange={handleEdit}
            className="flex-1 min-h-0 overflow-y-auto"
          />
        ) : (
          <div className="p-6 text-[13px] text-[var(--text-secondary)]">
            Select a file from the sidebar to preview.
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function ViewerToolbar({
  saveState,
  showCommentsButton,
  threadCount,
  onToggleComments,
  editable,
  activePath,
}: {
  saveState: SaveState;
  showCommentsButton: boolean;
  threadCount: number;
  onToggleComments(): void;
  editable: boolean;
  activePath: string | null;
}) {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const isDark = theme === "dark";

  return (
    <div className="h-9 flex items-center gap-2 px-3 border-b border-[var(--border-primary)] bg-[var(--bg-toolbar)] text-[12px] shrink-0">
      <span className="text-[var(--text-secondary)] truncate flex-1 min-w-0">
        {activePath ?? ""}
        {editable && activePath && (
          <span className="ml-2 text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">
            edit mode
          </span>
        )}
      </span>

      {saveState === "saving" && (
        <span className="flex items-center gap-1 text-[var(--text-secondary)]">
          <Loader2 size={12} className="animate-spin" />
          Saving…
        </span>
      )}
      {saveState === "saved" && (
        <span className="flex items-center gap-1 text-green-600">
          <Check size={12} />
          Saved
        </span>
      )}
      {saveState === "error" && (
        <span className="text-red-500">Save failed</span>
      )}

      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="flex items-center gap-1 px-2 h-7 rounded border border-[var(--border-primary)] hover:bg-[var(--bg-hover)] cursor-pointer"
        title={isDark ? "Switch to light theme" : "Switch to dark theme"}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={13} /> : <Moon size={13} />}
        <span>{isDark ? "Light" : "Dark"}</span>
      </button>

      {showCommentsButton && (
        <button
          type="button"
          onClick={onToggleComments}
          className="flex items-center gap-1 px-2 h-7 rounded border border-[var(--border-primary)] hover:bg-[var(--bg-hover)] cursor-pointer"
          title="Show comments panel"
        >
          <MessageSquare size={13} />
          <span>Comments {threadCount > 0 ? `(${threadCount})` : ""}</span>
        </button>
      )}
    </div>
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
