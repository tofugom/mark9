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
import { ExportDialog } from "@mark9/plugin-export";

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
  useThemeStore();
  useAutoSave();

  const setFileTree = useFileStore((s) => s.setFileTree);
  const setActiveFile = useFileStore((s) => s.setActiveFile);
  const setDirty = useFileStore((s) => s.setDirty);
  const activeFile = useFileStore((s) => s.activeFile);
  const currentContent = useFileStore((s) => s.currentContent);
  const setCurrentContent = useFileStore((s) => s.setCurrentContent);
  const { handleSave, handleOpenFile } = useFileActions();

  const gitBranch = useGitStore((s) => s.currentBranch);
  const gitFileStatuses = useGitStore((s) => s.fileStatuses);

  const [fileContents, setFileContents] = useState<Record<string, string>>(MOCK_FILES);
  const [showExportDialog, setShowExportDialog] = useState(false);

  useEffect(() => {
    setFileTree(mockFileTree);
    setActiveFile("/docs/README.md");
    setCurrentContent(MOCK_FILES["/docs/README.md"]);

    (async () => {
      try {
        const fs = getFs();
        const pfs = fs.promises;
        await pfs.mkdir("/docs").catch(() => {});
        for (const [path, content] of Object.entries(MOCK_FILES)) {
          await pfs.writeFile(path, content, "utf8");
        }
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

  useEffect(() => {
    if (activeFile && currentContent && !fileContents[activeFile]) {
      setFileContents((prev) => ({ ...prev, [activeFile]: currentContent }));
    }
  }, [activeFile, currentContent, fileContents]);

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

  useEffect(() => {
    const editorStore = useEditorStore.getState();
    const layoutStore = useLayoutStore.getState();
    const themeStore = useThemeStore.getState();
    const gitStore = useGitStore.getState();

    useCommandStore.getState().registerCommands([
      {
        id: "editor.toggleMode",
        label: "Toggle WYSIWYG / Source",
        category: "Editor",
        shortcut: "Ctrl+/",
        execute: () => editorStore.toggleMode(),
      },
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
      {
        id: "view.toggleSidebar",
        label: "Toggle Sidebar",
        category: "View",
        shortcut: "Ctrl+Shift+E",
        execute: () => layoutStore.toggleSidebar(),
      },
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
      {
        id: "export.dialog",
        label: "Export Document...",
        category: "Export",
        execute: () => setShowExportDialog(true),
      },
    ]);
  }, [handleSave, handleOpenFile]);

  const writeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (markdown: string) => {
      if (activeFile) {
        setFileContents((prev) => ({ ...prev, [activeFile]: markdown }));

        if (writeTimerRef.current) clearTimeout(writeTimerRef.current);
        writeTimerRef.current = setTimeout(() => {
          const fs = getFs();
          fs.promises
            .writeFile(activeFile, markdown, "utf8")
            .then(() => {
              useGitStore.getState().refreshStatus();
            })
            .catch(() => {});
        }, 1000);
      }
      setCurrentContent(markdown);
      setDirty(true);
    },
    [activeFile, setCurrentContent, setDirty],
  );

  const editorContent = activeFile ? (fileContents[activeFile] ?? "") : "";

  return (
    <>
      <AppLayout
        gitPanel={<GitPanel />}
        branch={gitBranch}
        gitFileStatuses={gitFileStatuses}
      >
        <div className="flex flex-col h-full">
          <EditorToolbar onSave={handleSave} />
          <DualEditor
            key={activeFile ?? "default"}
            defaultValue={editorContent}
            onChange={handleChange}
            className="flex-1 min-h-0"
          />
        </div>
      </AppLayout>

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
