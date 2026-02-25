/**
 * @mark9/desktop - Native filesystem operations
 *
 * Provides real filesystem access via Bun's native APIs.
 * These handlers are registered as RPC request handlers so the
 * webview renderer can call them through the typed RPC bridge.
 *
 * Unlike the browser File System Access API, these operations:
 * - Work without user prompts (no permission dialogs)
 * - Support watching for file changes
 * - Can access any path on disk
 * - Support recursive directory operations
 */

import path from "node:path";
import type { DirEntry, FileStat, FSEvent } from "../rpc/index.js";

// ─── Workspace sandbox ──────────────────────────────────────────────

let allowedRoot: string | null = null;

/**
 * Set the allowed workspace root directory.
 * All filesystem operations will be restricted to paths within this directory.
 */
export function setAllowedRoot(root: string): void {
  allowedRoot = path.resolve(root);
}

/**
 * Validate that a path resolves within the allowed workspace root.
 * Throws if the path escapes the sandbox or no root is set.
 */
function validatePath(inputPath: string): string {
  const resolved = path.resolve(inputPath);
  if (!allowedRoot) {
    throw new Error("No workspace root set. Open a folder first.");
  }
  if (resolved !== allowedRoot && !resolved.startsWith(allowedRoot + path.sep)) {
    throw new Error(`Access denied: path outside workspace — ${inputPath}`);
  }
  return resolved;
}

/**
 * Read a file and return its contents as a string.
 */
export async function readFile(params: {
  path: string;
  encoding?: string;
}): Promise<string> {
  const safePath = validatePath(params.path);
  const file = Bun.file(safePath);
  return await file.text();
}

/**
 * Write string content to a file, creating it if it does not exist.
 */
export async function writeFile(params: {
  path: string;
  content: string;
}): Promise<void> {
  const safePath = validatePath(params.path);
  await Bun.write(safePath, params.content);
}

/**
 * Read the contents of a directory and return entry metadata.
 */
export async function readDir(params: {
  path: string;
}): Promise<DirEntry[]> {
  const safePath = validatePath(params.path);
  const fs = await import("node:fs/promises");
  const entries = await fs.readdir(safePath, { withFileTypes: true });

  return entries.map((entry) => ({
    name: entry.name,
    path: `${safePath}/${entry.name}`,
    isDirectory: entry.isDirectory(),
    isFile: entry.isFile(),
    isSymlink: entry.isSymbolicLink(),
  }));
}

/**
 * Check whether a file or directory exists at the given path.
 */
export async function exists(params: { path: string }): Promise<boolean> {
  const safePath = validatePath(params.path);
  const file = Bun.file(safePath);
  return await file.exists();
}

/**
 * Create a directory, optionally creating parent directories.
 */
export async function mkdir(params: {
  path: string;
  recursive?: boolean;
}): Promise<void> {
  const safePath = validatePath(params.path);
  const fs = await import("node:fs/promises");
  await fs.mkdir(safePath, { recursive: params.recursive ?? true });
}

/**
 * Get metadata about a file or directory.
 */
export async function fileStat(params: {
  path: string;
}): Promise<FileStat> {
  const safePath = validatePath(params.path);
  const fs = await import("node:fs/promises");
  const s = await fs.stat(safePath);

  return {
    size: s.size,
    isDirectory: s.isDirectory(),
    isFile: s.isFile(),
    isSymlink: s.isSymbolicLink(),
    createdAt: s.birthtimeMs,
    modifiedAt: s.mtimeMs,
    accessedAt: s.atimeMs,
  };
}

/**
 * Remove a file or directory.
 */
export async function remove(params: {
  path: string;
  recursive?: boolean;
}): Promise<void> {
  const safePath = validatePath(params.path);
  const fs = await import("node:fs/promises");
  await fs.rm(safePath, { recursive: params.recursive ?? false });
}

/**
 * Rename or move a file or directory.
 */
export async function rename(params: {
  oldPath: string;
  newPath: string;
}): Promise<void> {
  const safeOldPath = validatePath(params.oldPath);
  const safeNewPath = validatePath(params.newPath);
  const fs = await import("node:fs/promises");
  await fs.rename(safeOldPath, safeNewPath);
}

// ─── File watcher ────────────────────────────────────────────────────

type WatchCallback = (event: FSEvent) => void;
const activeWatchers = new Map<string, { close: () => void }>();

/**
 * Start watching a file or directory for changes.
 * Returns a cleanup function that stops the watcher.
 *
 * Note: This is called from the main process, not directly via RPC.
 * The main process forwards FSEvent messages to the webview via RPC messages.
 */
export async function watch(
  path: string,
  callback: WatchCallback,
): Promise<() => void> {
  const fs = await import("node:fs");

  const watcher = fs.watch(path, { recursive: true }, (eventType, filename) => {
    if (!filename) return;

    const fullPath = `${path}/${filename}`;
    const fsEvent: FSEvent = {
      type: eventType === "rename" ? "rename" : "modify",
      path: fullPath,
    };
    callback(fsEvent);
  });

  const cleanup = () => {
    watcher.close();
    activeWatchers.delete(path);
  };

  activeWatchers.set(path, { close: cleanup });
  return cleanup;
}

/**
 * Stop all active file watchers. Called during app shutdown.
 */
export function stopAllWatchers(): void {
  for (const [, watcher] of activeWatchers) {
    watcher.close();
  }
  activeWatchers.clear();
}
