import { useEffect, useCallback } from "react";
import { AppLayout, DualEditor, useFileStore, useFileActions } from "@mark9/ui";

const SAMPLE_MARKDOWN = `# Welcome to Mark9

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

## GFM Features

### Table

| Feature | Status |
|---------|--------|
| Bold | Supported |
| Tables | Supported |
| Task Lists | Supported |

### Task List

- [x] Set up monorepo
- [x] Integrate Milkdown editor
- [ ] Add GFM support
- [ ] Add source code view

### Strikethrough

This is ~~deleted text~~ and this is normal text.

---

Start editing to see the **WYSIWYG** magic!
`;

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
  const setFileTree = useFileStore((s) => s.setFileTree);
  const setActiveFile = useFileStore((s) => s.setActiveFile);
  const setDirty = useFileStore((s) => s.setDirty);
  const currentContent = useFileStore((s) => s.currentContent);
  const setCurrentContent = useFileStore((s) => s.setCurrentContent);
  const { handleSave, handleOpenFile } = useFileActions();

  // Initialize with mock file tree and sample content if nothing is loaded
  useEffect(() => {
    const state = useFileStore.getState();
    if (state.fileTree.length === 0) {
      setFileTree(mockFileTree);
      setActiveFile("/docs/README.md");
    }
    if (!state.currentContent) {
      setCurrentContent(SAMPLE_MARKDOWN);
    }
  }, [setFileTree, setActiveFile, setCurrentContent]);

  // Keyboard shortcuts: Ctrl+S to save, Ctrl+O to open file
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;

      if (mod && e.key === "s") {
        e.preventDefault();
        handleSave();
        return;
      }

      if (mod && e.key === "o") {
        e.preventDefault();
        handleOpenFile();
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSave, handleOpenFile]);

  const handleChange = useCallback(
    (markdown: string) => {
      setCurrentContent(markdown);
      setDirty(true);
    },
    [setCurrentContent, setDirty],
  );

  // Use currentContent for the editor; fall back to sample if empty
  const editorContent = currentContent || SAMPLE_MARKDOWN;

  return (
    <AppLayout>
      <DualEditor
        key={editorContent}
        defaultValue={editorContent}
        onChange={handleChange}
        className="h-full"
      />
    </AppLayout>
  );
}

export default App;
