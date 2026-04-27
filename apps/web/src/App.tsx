import { useMemo, useState } from "react";
import { useThemeStore } from "@mark9/ui";
import {
  Mark9Viewer,
  Mark9ViewerApp,
  MemoryLoader,
} from "@mark9/viewer";
import {
  JsonSidecarAdapter,
  InMemorySidecarStorage,
} from "@mark9/comments";

const MOCK_FILES: Record<string, string> = {
  "/docs/README.md": `# Welcome to Mark9 Viewer

This is a **read-only** Markdown preview powered by \`@mark9/viewer\`.

## Try Commenting

Select any text in this document — a *comment bubble* will appear at the
end of your selection. Type a comment, hit **Comment**, and the thread will
show up in the right-hand panel with the selected text rendered as a quote.

> Comments anchor to the surrounding context, not just character positions,
> so they survive most edits to the document body.

### Mermaid

\`\`\`mermaid
graph LR
  A[Select text] --> B[Add comment]
  B --> C[Thread in side panel]
  C --> D[Anchor stays put]
\`\`\`

### GFM

| Feature | Status |
|---------|--------|
| Tables | yes |
| Task lists | yes |
| Strikethrough | yes |
| Math | yes |

Inline math: $E = mc^2$.
`,
  "/docs/guide.md": `# How comments work

A comment carries **multiple selectors**:

1. **TextQuote** — the exact selected text plus 32 characters of prefix
   and suffix context.
2. **TextPosition** — the character offsets at creation time.
3. **Block** — *(future)* a stable ProseMirror block id.

When the document is reloaded the resolver tries them in order and falls
back gracefully. Anchors that no one can match are kept as **orphans**
in the sidebar — they never silently vanish.

## Why a sidecar JSON?

The comment data lives in \`<doc>.md.comments.json\`. That keeps
versioning of the prose itself clean, while still letting the comments
travel with the documents in a single repo.
`,
  "/notes.md": `# Personal notes

Use this file to try editing-after-the-fact:

- Add a comment to **this** sentence.
- Then go to the source toggle and lightly modify the surrounding text.
- Reload — the comment should still attach to the right place because the
  TextQuote selector matches on prefix/suffix even after small edits.
`,
};

const MOCK_FILE_TREE = [
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
];

type DemoMode = "app" | "embed";

function App() {
  useThemeStore();

  const [mode, setMode] = useState<DemoMode>("app");

  // Persistent for the lifetime of the page so comments survive mode switches.
  const commentsAdapter = useMemo(
    () =>
      new JsonSidecarAdapter({
        storage: new InMemorySidecarStorage(),
      }),
    [],
  );
  const loader = useMemo(() => new MemoryLoader(MOCK_FILES), []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <DemoModeBar mode={mode} onChange={setMode} />
      <div className="flex-1 min-h-0">
        {mode === "app" ? (
          <Mark9ViewerApp
            files={MOCK_FILE_TREE}
            loader={loader}
            commentsAdapter={commentsAdapter}
            author="demo-user"
            initialPath="/docs/README.md"
          />
        ) : (
          <EmbedDemo
            commentsAdapter={commentsAdapter}
          />
        )}
      </div>
    </div>
  );
}

function DemoModeBar({
  mode,
  onChange,
}: {
  mode: DemoMode;
  onChange(mode: DemoMode): void;
}) {
  return (
    <div className="h-9 flex items-center gap-2 px-3 border-b border-[var(--border-primary)] bg-[var(--bg-toolbar)] text-[12px]">
      <span className="font-semibold text-[var(--text-primary)]">Mark9 Viewer</span>
      <span className="text-[var(--text-secondary)]">demo</span>
      <div className="flex-1" />
      <span className="text-[var(--text-secondary)]">Mode:</span>
      <button
        type="button"
        onClick={() => onChange("app")}
        className={`px-2 h-[24px] rounded ${
          mode === "app"
            ? "bg-[var(--toolbar-btn-active-bg)] text-[var(--toolbar-btn-active-text)] border border-[var(--toolbar-btn-active-border)]"
            : "text-[var(--toolbar-btn-inactive-text)] hover:bg-[var(--toolbar-btn-hover-bg)]"
        }`}
      >
        Full app shell
      </button>
      <button
        type="button"
        onClick={() => onChange("embed")}
        className={`px-2 h-[24px] rounded ${
          mode === "embed"
            ? "bg-[var(--toolbar-btn-active-bg)] text-[var(--toolbar-btn-active-text)] border border-[var(--toolbar-btn-active-border)]"
            : "text-[var(--toolbar-btn-inactive-text)] hover:bg-[var(--toolbar-btn-hover-bg)]"
        }`}
      >
        Embedded component
      </button>
    </div>
  );
}

/**
 * Standalone-component demo: shows what host apps see when they drop
 * `<Mark9Viewer>` into their own layout.
 */
function EmbedDemo({
  commentsAdapter,
}: {
  commentsAdapter: JsonSidecarAdapter;
}) {
  const [path, setPath] = useState<keyof typeof MOCK_FILES>("/docs/README.md");

  return (
    <div className="h-full grid grid-cols-[200px_1fr] bg-[var(--bg-app)]">
      <aside className="border-r border-[var(--border-primary)] p-3 flex flex-col gap-1">
        <div className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)] mb-1">
          Files
        </div>
        {Object.keys(MOCK_FILES).map((p) => (
          <button
            type="button"
            key={p}
            onClick={() => setPath(p as keyof typeof MOCK_FILES)}
            className={`text-left text-[13px] px-2 py-1 rounded ${
              p === path
                ? "bg-[var(--bg-active)] text-white"
                : "text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
            }`}
          >
            {p}
          </button>
        ))}
      </aside>
      <Mark9Viewer
        documentPath={path}
        markdown={MOCK_FILES[path]!}
        commentsAdapter={commentsAdapter}
        author="demo-user"
        className="overflow-y-auto p-6"
      />
    </div>
  );
}

export default App;
