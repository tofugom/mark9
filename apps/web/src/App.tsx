import { useEffect, useMemo, useRef, useState } from "react";
import { useThemeStore } from "@mark9/ui";
import {
  Mark9Viewer,
  Mark9ViewerApp,
  type DocumentLoader,
} from "@mark9/viewer";
import {
  JsonSidecarAdapter,
  type SidecarStorage,
} from "@mark9/comments";
import { getFs } from "@mark9/plugin-git";

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

/**
 * DocumentLoader backed by the project's LightningFS instance — the same
 * virtual filesystem the git plugin uses. The MD files live as real entries
 * in the FS, persisted in IndexedDB. `save` writes back so live edits are
 * picked up on the next load.
 */
class LightningFsLoader implements DocumentLoader {
  async load(path: string): Promise<string> {
    const buf = await getFs().promises.readFile(path, "utf8");
    return typeof buf === "string" ? buf : new TextDecoder().decode(buf);
  }

  async save(path: string, content: string): Promise<void> {
    await getFs().promises.writeFile(path, content, "utf8");
  }
}

/**
 * SidecarStorage that writes `<doc>.md.comments.json` next to each markdown
 * file in the same LightningFS instance. This is the closest in-browser
 * representation of the on-disk sidecar pattern from PRD §14.
 */
class LightningFsSidecarStorage implements SidecarStorage {
  async read(path: string): Promise<string | null> {
    try {
      const buf = await getFs().promises.readFile(path, "utf8");
      return typeof buf === "string" ? buf : new TextDecoder().decode(buf);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "ENOENT") return null;
      throw err;
    }
  }

  async write(path: string, content: string): Promise<void> {
    await getFs().promises.writeFile(path, content, "utf8");
  }
}

type DemoMode = "app" | "embed";

function App() {
  useThemeStore();

  const [mode, setMode] = useState<DemoMode>("app");
  const [fsReady, setFsReady] = useState(false);

  // Seed the virtual FS with the demo MD files. We only write a file if it
  // doesn't already exist, so user edits / saved comments survive a refresh.
  useEffect(() => {
    (async () => {
      const fs = getFs();
      await fs.promises.mkdir("/docs").catch(() => {});
      for (const [path, content] of Object.entries(MOCK_FILES)) {
        try {
          await fs.promises.stat(path);
        } catch {
          await fs.promises.writeFile(path, content, "utf8");
        }
      }
      setFsReady(true);
    })().catch((err) => {
      console.error("[demo] failed to seed LightningFS", err);
      setFsReady(true);
    });
  }, []);

  const loader = useMemo(() => new LightningFsLoader(), []);
  const commentsAdapter = useMemo(
    () => new JsonSidecarAdapter({ storage: new LightningFsSidecarStorage() }),
    [],
  );

  if (!fsReady) {
    return (
      <div className="h-screen w-screen flex items-center justify-center text-[var(--text-secondary)]">
        Initializing virtual filesystem…
      </div>
    );
  }

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
            loader={loader}
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
      <span className="text-[var(--text-secondary)]">demo (LightningFS)</span>
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
  loader,
  commentsAdapter,
}: {
  loader: DocumentLoader;
  commentsAdapter: JsonSidecarAdapter;
}) {
  const [path, setPath] = useState<string>("/docs/README.md");
  const [content, setContent] = useState<string>("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    loader.load(path).then((md) => {
      if (!cancelled) setContent(md);
    });
    return () => {
      cancelled = true;
    };
  }, [path, loader]);

  const handleChange = (md: string) => {
    setContent(md);
    if (!loader.save) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void loader.save!(path, md);
    }, 600);
  };

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
            onClick={() => setPath(p)}
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
        markdown={content}
        commentsAdapter={commentsAdapter}
        author="demo-user"
        editable
        onChange={handleChange}
        className="overflow-y-auto p-6"
      />
    </div>
  );
}

export default App;
