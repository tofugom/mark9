import type { CommentThread, CommentsAdapter } from "../types.js";

/**
 * Storage backend for the sidecar adapter. Implementations decide whether
 * threads live in LightningFS, the host filesystem, fetch(), or memory.
 */
export interface SidecarStorage {
  read(path: string): Promise<string | null>;
  write(path: string, content: string): Promise<void>;
}

export interface JsonSidecarAdapterOptions {
  storage: SidecarStorage;
  /** Override the sidecar path computation. Default: `${documentPath}.comments.json`. */
  pathFor?(documentPath: string): string;
}

/**
 * Stores comment threads in `<doc>.md.comments.json` files alongside the
 * documents. The shape on disk is `{ version: 1, threads: CommentThread[] }`.
 */
export class JsonSidecarAdapter implements CommentsAdapter {
  private readonly storage: SidecarStorage;
  private readonly pathFor: (documentPath: string) => string;
  private cache = new Map<string, CommentThread[]>();

  constructor(options: JsonSidecarAdapterOptions) {
    this.storage = options.storage;
    this.pathFor =
      options.pathFor ?? ((documentPath) => `${documentPath}.comments.json`);
  }

  async list(documentPath: string): Promise<CommentThread[]> {
    if (this.cache.has(documentPath)) {
      return [...this.cache.get(documentPath)!];
    }
    const raw = await this.storage.read(this.pathFor(documentPath));
    if (!raw) {
      this.cache.set(documentPath, []);
      return [];
    }
    try {
      const parsed = JSON.parse(raw) as { threads?: CommentThread[] };
      const threads = parsed.threads ?? [];
      this.cache.set(documentPath, threads);
      return [...threads];
    } catch {
      this.cache.set(documentPath, []);
      return [];
    }
  }

  async create(
    documentPath: string,
    thread: Omit<CommentThread, "id" | "createdAt" | "updatedAt">,
  ): Promise<CommentThread> {
    const existing = await this.list(documentPath);
    const now = new Date().toISOString();
    const created: CommentThread = {
      ...thread,
      id: makeId(),
      createdAt: now,
      updatedAt: now,
    };
    const next = [...existing, created];
    await this.persist(documentPath, next);
    return created;
  }

  async update(
    threadId: string,
    patch: Partial<CommentThread>,
  ): Promise<CommentThread> {
    const docPath = this.findDocPath(threadId);
    if (!docPath) {
      throw new Error(`[mark9/comments] unknown thread id: ${threadId}`);
    }
    const existing = await this.list(docPath);
    const idx = existing.findIndex((t) => t.id === threadId);
    if (idx === -1) {
      throw new Error(`[mark9/comments] thread not found: ${threadId}`);
    }
    const updated: CommentThread = {
      ...existing[idx]!,
      ...patch,
      id: existing[idx]!.id,
      documentPath: existing[idx]!.documentPath,
      createdAt: existing[idx]!.createdAt,
      updatedAt: new Date().toISOString(),
    };
    const next = [...existing];
    next[idx] = updated;
    await this.persist(docPath, next);
    return updated;
  }

  async delete(threadId: string): Promise<void> {
    const docPath = this.findDocPath(threadId);
    if (!docPath) return;
    const existing = await this.list(docPath);
    const next = existing.filter((t) => t.id !== threadId);
    await this.persist(docPath, next);
  }

  private findDocPath(threadId: string): string | null {
    for (const [docPath, threads] of this.cache) {
      if (threads.some((t) => t.id === threadId)) return docPath;
    }
    return null;
  }

  private async persist(
    documentPath: string,
    threads: CommentThread[],
  ): Promise<void> {
    this.cache.set(documentPath, threads);
    const payload = JSON.stringify({ version: 1, threads }, null, 2);
    await this.storage.write(this.pathFor(documentPath), payload);
  }
}

function makeId(): string {
  // RFC4122-ish; not cryptographically strong, fine for thread ids.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `c-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

/**
 * Convenience: an in-memory storage useful for the demo app and tests where
 * files are mock objects.
 */
export class InMemorySidecarStorage implements SidecarStorage {
  private readonly files = new Map<string, string>();

  constructor(seed?: Record<string, string>) {
    if (seed) {
      for (const [k, v] of Object.entries(seed)) this.files.set(k, v);
    }
  }

  async read(path: string): Promise<string | null> {
    return this.files.get(path) ?? null;
  }

  async write(path: string, content: string): Promise<void> {
    this.files.set(path, content);
  }

  /** For tests/demo introspection. */
  snapshot(): Record<string, string> {
    return Object.fromEntries(this.files);
  }
}
