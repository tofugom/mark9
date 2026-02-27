import { useEffect, useCallback, useState, useRef } from "react";
import {
  AppLayout,
  DualEditor,
  EditorToolbar,
  useFileStore,
  useFileActions,
  useThemeStore,
  useAutoSave,
  useEditorStore,
  useLayoutStore,
  useCommandStore,
} from "@mark9/ui";
import { GitPanel, useGitStore, getFs } from "@mark9/plugin-git";
import {
  useCollab,
  useCollabFile,
  CollabToolbar,
  UserList,
  UserAvatars,
  ConnectionStatus,
  JoinDialog,
} from "@mark9/collab";
import { ExportDialog } from "@mark9/plugin-export";

const COLLAB_SERVER_URL = "ws://localhost:4444";

/** Find the first file node in a tree (depth-first). */
function findFirstFile(
  nodes: { name: string; path: string; type: string; children?: unknown[] }[],
): string | null {
  for (const n of nodes) {
    if (n.type === "file") return n.path;
    if (n.children) {
      const found = findFirstFile(
        n.children as typeof nodes,
      );
      if (found) return found;
    }
  }
  return null;
}

const MOCK_FILES: Record<string, string> = {
  "/docs/README.md": `# Welcome to Mark9

A **WYSIWYG** Markdown editor by *tofu9*.

## Features

- Bold, italic, and ~~strikethrough~~
- Headings (H1 through H6)
- Blockquotes and code blocks

> This is a blockquote. Mark9 renders it beautifully in WYSIWYG mode.

### Code Example

\`\`\`javascript
console.log("Hello, Mark9!");
\`\`\`

### Lists

1. First item
2. Second item
3. Third item

- Unordered item A
- Unordered item B

---

## Architecture

\`\`\`mermaid
graph TD
    A[Markdown Input] --> B[Milkdown Parser]
    B --> C[ProseMirror State]
    C --> D[WYSIWYG View]
    C --> E[Source View]
\`\`\`

## Math Support

Inline math: $E = mc^2$ and $\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$.

Block math:

$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

Start editing to see the **WYSIWYG** magic!
`,
  "/docs/guide.md": `# Mark9 User Guide

## Getting Started

Mark9 is a WYSIWYG Markdown editor. Just start typing!

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+B | **Bold** |
| Ctrl+I | *Italic* |
| Ctrl+/ | Toggle Source View |
| Ctrl+S | Save |
| Ctrl+O | Open File |
| Ctrl+Shift+E | Toggle Sidebar |

## GFM Support

Mark9 supports GitHub Flavored Markdown including:

- [x] Tables
- [x] Task lists
- [x] Strikethrough
- [ ] Footnotes (coming soon)
`,
  "/notes.md": `# Notes

## Ideas

- Explore Mermaid.js diagram support
- Add dark theme and sepia theme
- Implement Git sync plugin

## References

> The best writing tool is the one that gets out of your way.

---

*Last updated: 2026-02-25*
`,
  "/todo.md": `# TODO

## Phase 1 — MVP
- [x] Set up monorepo (Turborepo + pnpm)
- [x] Integrate Milkdown editor
- [x] Add GFM support (tables, task lists, strikethrough)
- [x] Source code view toggle (CodeMirror 6)
- [x] UI shell (sidebar, title bar, status bar)
- [x] File open/save

## Phase 2 — Mermaid + Themes
- [ ] Mermaid.js integration
- [ ] Diagram inline editing UX
- [ ] Light / Dark / Sepia themes
- [ ] Image handling (drag & drop, paste)
- [ ] Outline panel

## Phase 3 — Git + Desktop
- [ ] Git plugin (isomorphic-git)
- [ ] Electrobun desktop app
- [ ] Native filesystem integration
`,
};

const mockFileTree = [
  {
    name: "docs",
    path: "/docs",
    type: "folder" as const,
    children: [
      { name: "README.md", path: "/docs/README.md", type: "file" as const },
      { name: "guide.md", path: "/docs/guide.md", type: "file" as const },
    ],
  },
  { name: "notes.md", path: "/notes.md", type: "file" as const },
  { name: "todo.md", path: "/todo.md", type: "file" as const },
];

function App() {
  useThemeStore(); // Initialize theme from localStorage
  useAutoSave(); // Auto-save based on settings

  const setFileTree = useFileStore((s) => s.setFileTree);
  const setActiveFile = useFileStore((s) => s.setActiveFile);
  const setDirty = useFileStore((s) => s.setDirty);
  const activeFile = useFileStore((s) => s.activeFile);
  const currentContent = useFileStore((s) => s.currentContent);
  const setCurrentContent = useFileStore((s) => s.setCurrentContent);
  const { handleSave, handleOpenFile } = useFileActions();

  // Git state for StatusBar and file tree badges
  const gitBranch = useGitStore((s) => s.currentBranch);
  const gitFileStatuses = useGitStore((s) => s.fileStatuses);

  // Per-file content map: preserves edits when switching between files
  const [fileContents, setFileContents] = useState<Record<string, string>>(MOCK_FILES);

  // Collab state
  const fileContentsRef = useRef(fileContents);
  fileContentsRef.current = fileContents;

  const {
    isActive: collabActive,
    initWorkspace,
  } = useCollab({
    onFileTreeSync: useCallback(
      (tree) => {
        // Joiner: update sidebar file tree from the host's shared data
        const mapped = tree.map((n) => ({
          ...n,
          children: n.children?.map((c) => ({ ...c })),
        }));
        setFileTree(mapped);

        // Auto-select first file if nothing is active yet
        const current = useFileStore.getState().activeFile;
        if (!current) {
          const first = findFirstFile(mapped);
          if (first) {
            setActiveFile(first);
          }
        }
      },
      [setFileTree, setActiveFile],
    ),
  });
  const collabConfig = useCollabFile(activeFile);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Host: push workspace into Yjs after starting a session
  const handleSessionStarted = useCallback(() => {
    const tree = mockFileTree.map((n) => ({
      name: n.name,
      path: n.path,
      type: n.type,
      children: n.children?.map((c) => ({
        name: c.name,
        path: c.path,
        type: c.type,
      })),
    }));
    initWorkspace(tree, fileContentsRef.current);
  }, [initWorkspace]);

  // Initialize mock file tree + git repo
  useEffect(() => {
    setFileTree(mockFileTree);
    setActiveFile("/docs/README.md");
    setCurrentContent(MOCK_FILES["/docs/README.md"]);

    // Write mock files to LightningFS and initialize git repo
    (async () => {
      try {
        const fs = getFs();
        const pfs = fs.promises;
        // Create directories
        await pfs.mkdir("/docs").catch(() => {});
        // Write files
        for (const [path, content] of Object.entries(MOCK_FILES)) {
          await pfs.writeFile(path, content, "utf8");
        }
        // Initialize git and make initial commit
        const gitStore = useGitStore.getState();
        await gitStore.setRepoDir("/");
        if (!useGitStore.getState().isGitRepo) {
          await gitStore.initRepo();
          await gitStore.stageAll();
          await gitStore.commit("Initial commit");
        }
        await gitStore.refreshStatus();
        await gitStore.refreshLog();
      } catch (err) {
        console.warn("[git] Failed to initialize git repo:", err);
      }
    })();
  }, [setFileTree, setActiveFile, setCurrentContent]);

  // Sync real file content (from File System Access API) into local map
  useEffect(() => {
    if (activeFile && currentContent && !fileContents[activeFile]) {
      setFileContents((prev) => ({ ...prev, [activeFile]: currentContent }));
    }
  }, [activeFile, currentContent, fileContents]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      if (mod && e.key === "o") {
        e.preventDefault();
        handleOpenFile();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, handleOpenFile]);

  // Register commands for the command palette
  useEffect(() => {
    const editorStore = useEditorStore.getState();
    const layoutStore = useLayoutStore.getState();
    const themeStore = useThemeStore.getState();
    const gitStore = useGitStore.getState();

    useCommandStore.getState().registerCommands([
      // Editor commands
      {
        id: "editor.toggleMode",
        label: "Toggle WYSIWYG / Source",
        category: "Editor",
        shortcut: "Ctrl+/",
        execute: () => editorStore.toggleMode(),
      },
      // File commands
      {
        id: "file.open",
        label: "Open File",
        category: "File",
        shortcut: "Ctrl+O",
        execute: () => handleOpenFile(),
      },
      {
        id: "file.save",
        label: "Save",
        category: "File",
        shortcut: "Ctrl+S",
        execute: () => handleSave(),
      },
      // View commands
      {
        id: "view.toggleSidebar",
        label: "Toggle Sidebar",
        category: "View",
        shortcut: "Ctrl+Shift+E",
        execute: () => layoutStore.toggleSidebar(),
      },
      // Theme commands
      {
        id: "theme.light",
        label: "Switch to Light Theme",
        category: "Theme",
        execute: () => useThemeStore.getState().setTheme("light"),
      },
      {
        id: "theme.dark",
        label: "Switch to Dark Theme",
        category: "Theme",
        execute: () => useThemeStore.getState().setTheme("dark"),
      },
      {
        id: "theme.sepia",
        label: "Switch to Sepia Theme",
        category: "Theme",
        execute: () => useThemeStore.getState().setTheme("sepia"),
      },
      {
        id: "theme.cycle",
        label: "Cycle Theme",
        category: "Theme",
        execute: () => themeStore.cycleTheme(),
      },
      // Git commands
      {
        id: "git.stageAll",
        label: "Stage All Changes",
        category: "Git",
        execute: () => void gitStore.stageAll(),
      },
      {
        id: "git.commit",
        label: "Commit Staged Changes",
        category: "Git",
        execute: () => {
          const msg = prompt("Commit message:");
          if (msg) void gitStore.commit(msg);
        },
      },
      {
        id: "git.refresh",
        label: "Refresh Git Status",
        category: "Git",
        execute: () => void gitStore.refreshStatus(),
      },
      // Export commands
      {
        id: "export.dialog",
        label: "Export Document...",
        category: "Export",
        execute: () => setShowExportDialog(true),
      },
    ]);
  }, [handleSave, handleOpenFile]);

  // Debounced write to LightningFS so git can detect changes
  const writeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // On edit: update both the per-file map and the store
  const handleChange = useCallback(
    (markdown: string) => {
      if (activeFile) {
        setFileContents((prev) => ({ ...prev, [activeFile]: markdown }));

        // Debounced write to LightningFS for git tracking
        if (writeTimerRef.current) clearTimeout(writeTimerRef.current);
        writeTimerRef.current = setTimeout(() => {
          const fs = getFs();
          fs.promises.writeFile(activeFile, markdown, "utf8").then(() => {
            useGitStore.getState().refreshStatus();
          }).catch(() => {});
        }, 1000);
      }
      setCurrentContent(markdown);
      setDirty(true);
    },
    [activeFile, setCurrentContent, setDirty],
  );

  // Content for current file — read directly from local map (synchronous, no lag)
  const editorContent = activeFile ? fileContents[activeFile] ?? "" : "";

  // Collab panels
  const collabPanel = (
    <div>
      <CollabToolbar
        serverUrl={COLLAB_SERVER_URL}
        onJoinClick={() => setShowJoinDialog(true)}
        onSessionStarted={handleSessionStarted}
      />
      {collabActive && <UserList />}
    </div>
  );

  return (
    <>
      <AppLayout
        gitPanel={<GitPanel />}
        collabPanel={collabPanel}
        collabStatus={<ConnectionStatus />}
        branch={gitBranch}
        gitFileStatuses={gitFileStatuses}
      >
        <div className="flex flex-col h-full">
          <EditorToolbar
            onSave={handleSave}
            collabAvatars={
              collabActive ? <UserAvatars currentFile={activeFile} /> : undefined
            }
          />
          <DualEditor
            key={activeFile ?? "default"}
            defaultValue={editorContent}
            onChange={handleChange}
            className="flex-1 min-h-0"
            collabConfig={collabConfig}
          />
        </div>
      </AppLayout>

      {showJoinDialog && (
        <JoinDialog
          serverUrl={COLLAB_SERVER_URL}
          onClose={() => setShowJoinDialog(false)}
        />
      )}

      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        markdown={currentContent}
        fileName={activeFile?.split("/").pop() ?? "document.md"}
      />
    </>
  );
}

export default App;
