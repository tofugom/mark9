/**
 * @mark9/desktop - Typed RPC schema definitions
 *
 * Defines the typed RPC contract between the Bun main process and the
 * webview renderer. Electrobun's RPC system provides end-to-end type
 * safety across the process boundary.
 *
 * The schema is split into two sides:
 * - `bun`: Requests/messages the Bun process handles (called FROM webview)
 * - `webview`: Requests/messages the webview handles (called FROM Bun)
 */
import type { ElectrobunRPCSchema } from "electrobun";

// ─── Filesystem types ────────────────────────────────────────────────

export interface DirEntry {
  name: string;
  path: string;
  isDirectory: boolean;
  isFile: boolean;
  isSymlink: boolean;
}

export interface FileStat {
  size: number;
  isDirectory: boolean;
  isFile: boolean;
  isSymlink: boolean;
  createdAt: number;
  modifiedAt: number;
  accessedAt: number;
}

export interface FSEvent {
  type: "create" | "modify" | "delete" | "rename";
  path: string;
}

// ─── Git types ───────────────────────────────────────────────────────

export interface FileStatus {
  filepath: string;
  /** HEAD status: absent=0, identical=1, different=2 */
  head: number;
  /** Workdir status: absent=0, identical=1, different=2 */
  workdir: number;
  /** Stage status: absent=0, identical=1, different=2, added=3 */
  stage: number;
}

export interface Author {
  name: string;
  email: string;
}

export interface GitAuth {
  username?: string;
  password?: string;
  token?: string;
}

export interface CommitEntry {
  oid: string;
  message: string;
  author: Author & { timestamp: number };
  parent: string[];
}

// ─── Dialog types ────────────────────────────────────────────────────

export interface OpenDialogOptions {
  title?: string;
  defaultPath?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
  multiple?: boolean;
  directory?: boolean;
}

export interface SaveDialogOptions {
  title?: string;
  defaultPath?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
}

// ─── RPC Schema ──────────────────────────────────────────────────────

/**
 * The combined RPC schema for the Mark9 desktop app.
 *
 * - `bun.requests`: What the Bun process handles (webview calls these)
 * - `bun.messages`: What the Bun process receives (webview sends these)
 * - `webview.requests`: What the webview handles (Bun calls these)
 * - `webview.messages`: What the webview receives (Bun sends these)
 *
 * Usage in Bun (main.ts):
 *   defineElectrobunRPC<Mark9RPCSchema>("bun", { handlers: { ... } })
 *
 * Usage in webview (renderer):
 *   Electroview.defineRPC<Mark9RPCSchema>({ handlers: { ... } })
 */
export interface Mark9RPCSchema extends ElectrobunRPCSchema {
  bun: {
    requests: {
      // Filesystem operations
      "fs:readFile": {
        params: { path: string; encoding?: string };
        response: string;
      };
      "fs:writeFile": {
        params: { path: string; content: string };
        response: void;
      };
      "fs:readDir": {
        params: { path: string };
        response: DirEntry[];
      };
      "fs:exists": {
        params: { path: string };
        response: boolean;
      };
      "fs:mkdir": {
        params: { path: string; recursive?: boolean };
        response: void;
      };
      "fs:stat": {
        params: { path: string };
        response: FileStat;
      };
      "fs:remove": {
        params: { path: string; recursive?: boolean };
        response: void;
      };
      "fs:rename": {
        params: { oldPath: string; newPath: string };
        response: void;
      };

      // Git operations
      "git:isRepo": {
        params: { dir: string };
        response: boolean;
      };
      "git:status": {
        params: { dir: string };
        response: FileStatus[];
      };
      "git:stage": {
        params: { dir: string; filepath: string };
        response: void;
      };
      "git:commit": {
        params: { dir: string; message: string; author: Author };
        response: string;
      };
      "git:push": {
        params: { dir: string; remote: string; branch: string; auth: GitAuth };
        response: void;
      };
      "git:pull": {
        params: { dir: string; remote: string; branch: string; auth: GitAuth };
        response: void;
      };
      "git:log": {
        params: { dir: string; depth?: number };
        response: CommitEntry[];
      };
      "git:branches": {
        params: { dir: string };
        response: string[];
      };
      "git:currentBranch": {
        params: { dir: string };
        response: string;
      };

      // Dialog operations
      "dialog:openFile": {
        params: OpenDialogOptions;
        response: string[] | null;
      };
      "dialog:saveFile": {
        params: SaveDialogOptions;
        response: string | null;
      };

      // Window operations
      "window:setTitle": {
        params: { title: string };
        response: void;
      };
      "window:minimize": {
        params: undefined;
        response: void;
      };
      "window:maximize": {
        params: undefined;
        response: void;
      };
      "window:close": {
        params: undefined;
        response: void;
      };
      "window:toggleFullscreen": {
        params: undefined;
        response: void;
      };
    };
    messages: {
      /** Webview notifies Bun that editor content changed */
      "editor:contentChanged": { isDirty: boolean };
      /** Webview notifies Bun that the editor is initialized */
      "editor:ready": void;
    };
  };
  webview: {
    requests: {
      /** Bun asks webview for current editor content */
      "editor:getContent": {
        params: undefined;
        response: string;
      };
      /** Bun tells webview to replace editor content */
      "editor:setContent": {
        params: { content: string };
        response: void;
      };
      /** Bun asks webview if there are unsaved changes */
      "editor:isDirty": {
        params: undefined;
        response: boolean;
      };
    };
    messages: {
      /** Bun forwards filesystem watcher events to webview */
      "fs:watch": FSEvent;
      /** Bun forwards menu action clicks to webview */
      "menu:action": { action: string };
      /** Bun notifies webview that window gained focus */
      "window:focus": void;
      /** Bun notifies webview that window lost focus */
      "window:blur": void;
    };
  };
}
