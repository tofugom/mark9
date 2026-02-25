# @mark9/desktop

Desktop shell for the Mark9 WYSIWYG markdown editor, built with [Electrobun](https://electrobun.dev/).

Electrobun uses Bun as the main process runtime and the system webview for rendering, producing tiny (~12 MB) cross-platform desktop apps with TypeScript.

## Prerequisites

- [Bun](https://bun.sh/) >= 1.1 (Electrobun requires the Bun runtime)
- macOS 14+, Windows 11+, or Ubuntu 22.04+ (Linux needs gtk3 + webkit2gtk-4.1)
- The web app must be built first: `pnpm --filter @mark9/web build`

## Project Structure

```
apps/desktop/
├── electrobun.config.ts   # Electrobun build & app configuration
├── src/
│   ├── main.ts            # Bun main process entry point
│   ├── rpc/
│   │   └── index.ts       # Typed RPC schema (bun <-> webview)
│   └── platform/
│       ├── fs.ts           # Native filesystem operations
│       └── git.ts          # Native git operations (isomorphic-git)
├── package.json
├── tsconfig.json
└── README.md
```

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Bun Main Process (src/main.ts)                     │
│  ┌───────────────┐  ┌──────────────┐               │
│  │  platform/fs   │  │ platform/git │               │
│  └───────┬───────┘  └──────┬───────┘               │
│          │                  │                        │
│          └──────┬───────────┘                        │
│                 │ RPC handlers                       │
│          ┌──────┴──────┐                             │
│          │  rpc/index  │  Typed RPC schema           │
│          └──────┬──────┘                             │
│                 │ Electrobun WebSocket RPC            │
├─────────────────┼───────────────────────────────────┤
│                 │                                    │
│  System Webview (loads @mark9/web)                   │
│  ┌──────────────────────────────────────────┐       │
│  │  React 19 + Milkdown + Tailwind CSS 4    │       │
│  │  (Same UI as apps/web)                    │       │
│  └──────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
```

## Development

### Type-checking only (works without Bun)

```bash
# From monorepo root
pnpm --filter @mark9/desktop typecheck

# Or from this directory
pnpm typecheck
```

### Full development (requires Bun)

```bash
# Install dependencies
bun install

# Start development mode (builds + opens app with hot reload)
bun run dev
```

### Building for distribution

```bash
# Build the app bundle
bun run build:app
```

## RPC Bridge

The desktop app exposes native capabilities to the web renderer via a typed RPC bridge. The schema is defined in `src/rpc/index.ts`.

### Available RPC methods

**Filesystem** (`fs:*`): readFile, writeFile, readDir, exists, mkdir, stat, remove, rename

**Git** (`git:*`): isRepo, status, stage, commit, push, pull, log, branches, currentBranch

**Dialogs** (`dialog:*`): openFile, saveFile

**Window** (`window:*`): setTitle, minimize, maximize, close, toggleFullscreen

### Messages (fire-and-forget)

**Bun to Webview**: `fs:watch`, `menu:action`, `window:focus`, `window:blur`

**Webview to Bun**: `editor:contentChanged`, `editor:ready`

## Calling RPC from the webview

In the web app renderer, use the Electrobun browser API:

```typescript
import { Electroview } from "electrobun/view";
import type { Mark9RPCSchema } from "@mark9/desktop/src/rpc";

const rpc = Electroview.defineRPC<Mark9RPCSchema>({
  handlers: {
    requests: {
      "editor:getContent": () => editor.getContent(),
      "editor:setContent": ({ content }) => editor.setContent(content),
      "editor:isDirty": () => editor.isDirty(),
    },
    messages: {
      "fs:watch": (event) => fileTree.refresh(),
      "menu:action": ({ action }) => handleMenuAction(action),
    },
  },
});

// Call native filesystem from the renderer
const content = await rpc.request["fs:readFile"]({ path: "/path/to/file.md" });
```

## Fallback: Tauri v2

If Electrobun is not suitable for your environment, the PRD's ADR-004 specifies Tauri v2 as a fallback. The RPC schema and platform abstractions in this package are designed to be framework-agnostic at the type level, making migration straightforward.
