# Mark9

A WYSIWYG Markdown editor with native Mermaid diagrams and cross-platform support.

## Features

- **WYSIWYG Editing** — Edit rendered documents directly, Typora-style
- **GFM Support** — Tables, task lists, strikethrough, autolinks
- **Mermaid Diagrams** — Live-rendered diagrams with inline code editing
- **Code Blocks** — Syntax highlighting (35+ languages), language autocomplete, copy button
- **Source View** — Toggle between WYSIWYG and raw Markdown (`Ctrl+/`)
- **Themes** — Light, Dark, Sepia (GitHub-style)
- **Desktop App** — Native macOS app via Electrobun
- **File Management** — Open/save files and folders with File System Access API

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Editor Engine | Milkdown (ProseMirror) |
| Frontend | React 19 + TypeScript |
| Build | Vite + Turborepo + pnpm |
| Styling | Tailwind CSS 4 |
| State | Zustand |
| Desktop | Electrobun |
| Testing | Playwright |

## Project Structure

```
mark9/
├── apps/
│   ├── web/            # Web app (Vite + React)
│   └── desktop/        # Desktop app (Electrobun)
├── packages/
│   ├── core/           # Editor core, file system abstractions
│   ├── ui/             # Shared components, plugins, stores
│   └── plugin-git/     # Git integration (planned)
├── docs/
│   ├── Mark9-PRD.md
│   ├── DEVELOPMENT-PLAN.md
│   ├── worklog.md
│   └── test-scenario/  # Playwright E2E tests
└── playwright.config.ts
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+

### Install & Run

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build all packages
pnpm build

# Run E2E tests
pnpm exec playwright test
```

The web app runs at `http://localhost:5173`.

### Desktop App

```bash
cd apps/desktop
npx electrobun build
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Save |
| `Ctrl+/` | Toggle WYSIWYG / Source |
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+K` | Link |

## Roadmap

- **Phase 1** — GFM WYSIWYG + file management (done)
- **Phase 2** — Mermaid + themes + code blocks (done)
- **Phase 3** — Git integration + desktop app
- **Phase 4** — Plugin API, export (PDF/HTML), KaTeX

## License

Private

---

*Built by tofu9*
