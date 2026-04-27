import { create } from "zustand";
import type {
  AnchorResolution,
  CommentAnchor,
  CommentThread,
  CommentsAdapter,
} from "../types.js";
import { resolveAnchor } from "../anchor/resolve.js";

export interface ResolvedThread {
  thread: CommentThread;
  resolution: AnchorResolution | null;
}

interface CommentsState {
  adapter: CommentsAdapter | null;
  documentPath: string | null;
  /** The plain-text projection of the current document (for anchor resolution). */
  documentText: string;
  threads: CommentThread[];
  resolved: ResolvedThread[];
  activeThreadId: string | null;
  loading: boolean;
  error: string | null;

  setAdapter(adapter: CommentsAdapter | null): void;
  loadFor(documentPath: string, documentText: string): Promise<void>;
  setDocumentText(text: string): void;
  setActiveThread(id: string | null): void;
  addThread(input: {
    anchor: CommentAnchor;
    quotedText: string;
    body: string;
    author: string;
  }): Promise<CommentThread | null>;
  addReply(threadId: string, body: string, author: string): Promise<void>;
  setStatus(threadId: string, status: CommentThread["status"]): Promise<void>;
  removeThread(threadId: string): Promise<void>;
}

export const useCommentsStore = create<CommentsState>((set, get) => ({
  adapter: null,
  documentPath: null,
  documentText: "",
  threads: [],
  resolved: [],
  activeThreadId: null,
  loading: false,
  error: null,

  setAdapter(adapter) {
    set({ adapter, threads: [], resolved: [], activeThreadId: null });
  },

  async loadFor(documentPath, documentText) {
    const { adapter } = get();
    set({ documentPath, documentText, loading: true, error: null });
    if (!adapter) {
      set({ threads: [], resolved: [], loading: false });
      return;
    }
    try {
      const threads = await adapter.list(documentPath);
      const resolved = resolveAll(threads, documentText);
      set({ threads, resolved, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  },

  setDocumentText(text) {
    const { threads } = get();
    set({ documentText: text, resolved: resolveAll(threads, text) });
  },

  setActiveThread(id) {
    set({ activeThreadId: id });
  },

  async addThread({ anchor, quotedText, body, author }) {
    const { adapter, documentPath, documentText } = get();
    if (!adapter || !documentPath) return null;
    const now = new Date().toISOString();
    const created = await adapter.create(documentPath, {
      documentPath,
      anchor,
      quotedText,
      status: "open",
      messages: [
        {
          id: `m-${Math.random().toString(36).slice(2, 10)}`,
          author,
          body,
          createdAt: now,
        },
      ],
    });
    const next = [...get().threads, created];
    set({
      threads: next,
      resolved: resolveAll(next, documentText),
      activeThreadId: created.id,
    });
    return created;
  },

  async addReply(threadId, body, author) {
    const { adapter, threads, documentText } = get();
    if (!adapter) return;
    const target = threads.find((t) => t.id === threadId);
    if (!target) return;
    const updated = await adapter.update(threadId, {
      messages: [
        ...target.messages,
        {
          id: `m-${Math.random().toString(36).slice(2, 10)}`,
          author,
          body,
          createdAt: new Date().toISOString(),
        },
      ],
    });
    const next = threads.map((t) => (t.id === threadId ? updated : t));
    set({ threads: next, resolved: resolveAll(next, documentText) });
  },

  async setStatus(threadId, status) {
    const { adapter, threads, documentText } = get();
    if (!adapter) return;
    const updated = await adapter.update(threadId, { status });
    const next = threads.map((t) => (t.id === threadId ? updated : t));
    set({ threads: next, resolved: resolveAll(next, documentText) });
  },

  async removeThread(threadId) {
    const { adapter, threads, documentText, activeThreadId } = get();
    if (!adapter) return;
    await adapter.delete(threadId);
    const next = threads.filter((t) => t.id !== threadId);
    set({
      threads: next,
      resolved: resolveAll(next, documentText),
      activeThreadId: activeThreadId === threadId ? null : activeThreadId,
    });
  },
}));

function resolveAll(
  threads: CommentThread[],
  text: string,
): ResolvedThread[] {
  return threads.map((thread) => ({
    thread,
    resolution: resolveAnchor(text, thread.anchor),
  }));
}
