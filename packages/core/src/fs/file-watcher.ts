/**
 * Polling-based file watcher for the Web environment.
 *
 * Uses the File System Access API to periodically check a directory for
 * added, modified, or deleted markdown files.
 */

export interface FileChange {
  type: "added" | "modified" | "deleted";
  path: string;
}

interface FileSnapshot {
  path: string;
  lastModified: number;
}

type ChangeCallback = (changes: FileChange[]) => void;

const DEFAULT_INTERVAL = 3000; // 3 seconds

function isMarkdownFile(name: string): boolean {
  const lower = name.toLowerCase();
  return (
    lower.endsWith(".md") ||
    lower.endsWith(".mdx") ||
    lower.endsWith(".markdown")
  );
}

/**
 * Recursively scan a directory handle and collect file snapshots
 * (path + lastModified) for all markdown files.
 */
async function collectSnapshots(
  dirHandle: FileSystemDirectoryHandle,
  basePath: string,
): Promise<Map<string, FileSnapshot>> {
  const snapshots = new Map<string, FileSnapshot>();

  for await (const entry of dirHandle.values()) {
    const entryPath = `${basePath}/${entry.name}`;

    if (entry.kind === "file") {
      if (isMarkdownFile(entry.name)) {
        try {
          const fileHandle = entry as FileSystemFileHandle;
          const file = await fileHandle.getFile();
          snapshots.set(entryPath, {
            path: entryPath,
            lastModified: file.lastModified,
          });
        } catch {
          // File may have been removed between listing and reading
        }
      }
    } else if (entry.kind === "directory") {
      const childSnapshots = await collectSnapshots(
        entry as FileSystemDirectoryHandle,
        entryPath,
      );
      for (const [key, value] of childSnapshots) {
        snapshots.set(key, value);
      }
    }
  }

  return snapshots;
}

/**
 * Compare two snapshots and return a list of changes.
 */
function diffSnapshots(
  previous: Map<string, FileSnapshot>,
  current: Map<string, FileSnapshot>,
): FileChange[] {
  const changes: FileChange[] = [];

  // Check for added and modified files
  for (const [path, snapshot] of current) {
    const prev = previous.get(path);
    if (!prev) {
      changes.push({ type: "added", path });
    } else if (prev.lastModified !== snapshot.lastModified) {
      changes.push({ type: "modified", path });
    }
  }

  // Check for deleted files
  for (const path of previous.keys()) {
    if (!current.has(path)) {
      changes.push({ type: "deleted", path });
    }
  }

  return changes;
}

export class FileWatcher {
  private directoryHandle: FileSystemDirectoryHandle;
  private interval: number;
  private timerId: ReturnType<typeof setInterval> | null = null;
  private callbacks: Set<ChangeCallback> = new Set();
  private previousSnapshots: Map<string, FileSnapshot> = new Map();
  private polling = false;

  constructor(
    directoryHandle: FileSystemDirectoryHandle,
    interval?: number,
  ) {
    this.directoryHandle = directoryHandle;
    this.interval = interval ?? DEFAULT_INTERVAL;
  }

  /**
   * Start polling for file changes.
   */
  start(): void {
    if (this.timerId !== null) return; // Already running

    // Take initial snapshot immediately, then start polling
    void this.poll();

    this.timerId = setInterval(() => {
      void this.poll();
    }, this.interval);
  }

  /**
   * Stop polling for file changes.
   */
  stop(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  /**
   * Register a callback for file changes. Returns an unsubscribe function.
   */
  onChanged(callback: ChangeCallback): () => void {
    this.callbacks.add(callback);
    return () => {
      this.callbacks.delete(callback);
    };
  }

  private async poll(): Promise<void> {
    // Prevent overlapping polls
    if (this.polling) return;
    this.polling = true;

    try {
      const basePath = `/${this.directoryHandle.name}`;
      const currentSnapshots = await collectSnapshots(
        this.directoryHandle,
        basePath,
      );

      // On first poll, just record the snapshot without emitting changes
      if (this.previousSnapshots.size > 0 || currentSnapshots.size > 0) {
        if (this.previousSnapshots.size > 0) {
          const changes = diffSnapshots(this.previousSnapshots, currentSnapshots);
          if (changes.length > 0) {
            for (const cb of this.callbacks) {
              try {
                cb(changes);
              } catch {
                // Don't let a failing callback break the watcher
              }
            }
          }
        }
      }

      this.previousSnapshots = currentSnapshots;
    } catch {
      // Directory may have become inaccessible — keep polling
    } finally {
      this.polling = false;
    }
  }
}
