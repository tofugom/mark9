/**
 * Typed RPC client for the Electrobun renderer (webview) side.
 *
 * Wraps the global `electrobun.rpc` object injected by the desktop runtime.
 * Falls back to no-ops in web browser environments.
 */

// Simplified RPC interface matching Electrobun's injected API
interface ElectrobunRPC {
  request: Record<string, (params: unknown) => Promise<unknown>>;
  send: Record<string, (params: unknown) => void>;
  on: (event: string, handler: (data: unknown) => void) => void;
}

declare global {
  interface Window {
    electrobun?: {
      rpc: ElectrobunRPC;
    };
  }
}

function getRpc(): ElectrobunRPC | null {
  if (typeof window === "undefined") return null;
  return window.electrobun?.rpc ?? null;
}

// ── Filesystem operations ─────────────────────────────────────

export async function readFile(path: string): Promise<string | null> {
  const rpc = getRpc();
  if (!rpc) return null;
  return rpc.request["fs:readFile"]({ path }) as Promise<string | null>;
}

export async function writeFile(path: string, content: string): Promise<void> {
  const rpc = getRpc();
  if (!rpc) return;
  await rpc.request["fs:writeFile"]({ path, content });
}

export async function readDir(path: string) {
  const rpc = getRpc();
  if (!rpc) return [];
  return rpc.request["fs:readDir"]({ path }) as Promise<
    { name: string; path: string; isDirectory: boolean; isFile: boolean }[]
  >;
}

export async function exists(path: string): Promise<boolean> {
  const rpc = getRpc();
  if (!rpc) return false;
  return rpc.request["fs:exists"]({ path }) as Promise<boolean>;
}

export async function mkdir(path: string, recursive = true): Promise<void> {
  const rpc = getRpc();
  if (!rpc) return;
  await rpc.request["fs:mkdir"]({ path, recursive });
}

// ── Git operations ────────────────────────────────────────────

export async function gitIsRepo(dir: string): Promise<boolean> {
  const rpc = getRpc();
  if (!rpc) return false;
  return rpc.request["git:isRepo"]({ dir }) as Promise<boolean>;
}

export async function gitStatus(dir: string) {
  const rpc = getRpc();
  if (!rpc) return [];
  return rpc.request["git:status"]({ dir });
}

export async function gitCurrentBranch(dir: string): Promise<string> {
  const rpc = getRpc();
  if (!rpc) return "main";
  return rpc.request["git:currentBranch"]({ dir }) as Promise<string>;
}

export async function gitLog(dir: string, depth = 50) {
  const rpc = getRpc();
  if (!rpc) return [];
  return rpc.request["git:log"]({ dir, depth });
}

export async function gitStage(dir: string, filepath: string): Promise<void> {
  const rpc = getRpc();
  if (!rpc) return;
  await rpc.request["git:stage"]({ dir, filepath });
}

export async function gitCommit(
  dir: string,
  message: string,
  author: { name: string; email: string },
): Promise<string> {
  const rpc = getRpc();
  if (!rpc) return "";
  return rpc.request["git:commit"]({ dir, message, author }) as Promise<string>;
}

// ── Window operations ─────────────────────────────────────────

export function setWindowTitle(title: string): void {
  const rpc = getRpc();
  if (!rpc) return;
  void rpc.request["window:setTitle"]({ title });
}

// ── Menu action listener ──────────────────────────────────────

export type MenuActionHandler = (action: string) => void;

let menuHandler: MenuActionHandler | null = null;

export function onMenuAction(handler: MenuActionHandler): () => void {
  menuHandler = handler;

  const rpc = getRpc();
  if (rpc) {
    rpc.on("menu:action", (data: unknown) => {
      const { action } = data as { action: string };
      menuHandler?.(action);
    });
  }

  return () => {
    menuHandler = null;
  };
}

// ── Filesystem watch listener ─────────────────────────────────

export type FSWatchHandler = (event: { type: string; path: string }) => void;

export function onFSWatch(handler: FSWatchHandler): () => void {
  const rpc = getRpc();
  if (!rpc) return () => {};

  rpc.on("fs:watch", (data: unknown) => {
    handler(data as { type: string; path: string });
  });

  return () => {};
}

// ── Editor state notifications ────────────────────────────────

export function notifyEditorReady(): void {
  const rpc = getRpc();
  if (!rpc) return;
  rpc.send["editor:ready"]({});
}

export function notifyContentChanged(dirty: boolean): void {
  const rpc = getRpc();
  if (!rpc) return;
  rpc.send["editor:contentChanged"]({ isDirty: dirty });
}
