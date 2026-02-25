import { useEffect, useCallback, useState } from "react";
import {
  AppLayout,
  DualEditor,
  EditorToolbar,
  useFileStore,
  useFileActions,
  useThemeStore,
  useAutoSave,
} from "@mark9/ui";
import { GitPanel } from "@mark9/plugin-git";

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

  // Per-file content map: preserves edits when switching between files
  const [fileContents, setFileContents] = useState<Record<string, string>>(MOCK_FILES);

  // Initialize mock file tree
  useEffect(() => {
    setFileTree(mockFileTree);
    setActiveFile("/docs/README.md");
    setCurrentContent(MOCK_FILES["/docs/README.md"]);
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

  // On edit: update both the per-file map and the store
  const handleChange = useCallback(
    (markdown: string) => {
      if (activeFile) {
        setFileContents((prev) => ({ ...prev, [activeFile]: markdown }));
      }
      setCurrentContent(markdown);
      setDirty(true);
    },
    [activeFile, setCurrentContent, setDirty],
  );

  // Content for current file — read directly from local map (synchronous, no lag)
  const editorContent = activeFile ? fileContents[activeFile] ?? "" : "";

  return (
    <AppLayout gitPanel={<GitPanel />}>
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
  );
}

export default App;
