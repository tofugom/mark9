/**
 * Zustand store for Git state management.
 *
 * Provides reactive state for the Git panel UI, including file statuses,
 * branch info, commit log, and actions for staging/unstaging/committing.
 */
import { create } from "zustand";
import type { FileStatusEntry, CommitEntry, AuthorInfo } from "./git-operations.js";
import * as gitOps from "./git-operations.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GitState {
  /** Whether the current working directory is a git repository */
  isGitRepo: boolean;
  /** Current branch name */
  currentBranch: string;
  /** All file statuses (only changed files) */
  fileStatuses: FileStatusEntry[];
  /** Commit history */
  commitLog: CommitEntry[];
  /** List of local branches */
  branches: string[];
  /** Whether an async operation is in progress */
  isLoading: boolean;
  /** Last error message, if any */
  error: string | null;
  /** The repository directory path */
  repoDir: string;
  /** Default author for commits */
  author: AuthorInfo;

  // -- Actions ----------------------------------------------------------------

  /** Set the repository directory and refresh all state */
  setRepoDir: (dir: string) => Promise<void>;
  /** Initialize a new git repo in the current directory */
  initRepo: () => Promise<void>;
  /** Refresh file statuses and branch info */
  refreshStatus: () => Promise<void>;
  /** Stage a file */
  stageFile: (path: string) => Promise<void>;
  /** Unstage a file */
  unstageFile: (path: string) => Promise<void>;
  /** Stage all changed files */
  stageAll: () => Promise<void>;
  /** Unstage all staged files */
  unstageAll: () => Promise<void>;
  /** Create a commit with the given message */
  commit: (message: string) => Promise<void>;
  /** Refresh the commit log */
  refreshLog: () => Promise<void>;
  /** Refresh the branch list */
  refreshBranches: () => Promise<void>;
  /** Create a new branch */
  createBranch: (name: string) => Promise<void>;
  /** Checkout a branch */
  checkoutBranch: (name: string) => Promise<void>;
  /** Set the default author */
  setAuthor: (author: AuthorInfo) => void;
  /** Clear any error */
  clearError: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useGitStore = create<GitState>((set, get) => ({
  isGitRepo: false,
  currentBranch: "main",
  fileStatuses: [],
  commitLog: [],
  branches: [],
  isLoading: false,
  error: null,
  repoDir: "/",
  author: { name: "Mark9 User", email: "user@mark9.local" },

  setRepoDir: async (dir: string) => {
    set({ repoDir: dir, isLoading: true, error: null });
    try {
      // Check if it's a git repo by trying to get the current branch
      const branch = await gitOps.getCurrentBranch(dir);
      set({ isGitRepo: true, currentBranch: branch });
      // Refresh statuses and log
      await get().refreshStatus();
      await get().refreshLog();
      await get().refreshBranches();
    } catch {
      set({ isGitRepo: false, isLoading: false });
    }
  },

  initRepo: async () => {
    const { repoDir } = get();
    set({ isLoading: true, error: null });
    try {
      await gitOps.initRepo(repoDir);
      set({ isGitRepo: true, currentBranch: "main" });
      await get().refreshStatus();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Failed to init repo", isLoading: false });
    }
  },

  refreshStatus: async () => {
    const { repoDir, isGitRepo } = get();
    if (!isGitRepo) return;

    set({ isLoading: true, error: null });
    try {
      const [statuses, branch] = await Promise.all([
        gitOps.getStatus(repoDir),
        gitOps.getCurrentBranch(repoDir),
      ]);
      set({ fileStatuses: statuses, currentBranch: branch, isLoading: false });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Failed to refresh status",
        isLoading: false,
      });
    }
  },

  stageFile: async (path: string) => {
    const { repoDir } = get();
    set({ error: null });
    try {
      await gitOps.stageFile(repoDir, path);
      await get().refreshStatus();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Failed to stage file" });
    }
  },

  unstageFile: async (path: string) => {
    const { repoDir } = get();
    set({ error: null });
    try {
      await gitOps.unstageFile(repoDir, path);
      await get().refreshStatus();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Failed to unstage file" });
    }
  },

  stageAll: async () => {
    const { repoDir, fileStatuses } = get();
    set({ error: null });
    try {
      const unstaged = fileStatuses.filter((f) => !f.staged);
      await Promise.all(unstaged.map((f) => gitOps.stageFile(repoDir, f.filepath)));
      await get().refreshStatus();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Failed to stage all files" });
    }
  },

  unstageAll: async () => {
    const { repoDir, fileStatuses } = get();
    set({ error: null });
    try {
      const staged = fileStatuses.filter((f) => f.staged);
      await Promise.all(staged.map((f) => gitOps.unstageFile(repoDir, f.filepath)));
      await get().refreshStatus();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Failed to unstage all files" });
    }
  },

  commit: async (message: string) => {
    const { repoDir, author } = get();
    const trimmed = message.trim();
    if (!trimmed || trimmed.length > 10_000) {
      set({ error: "Commit message must be 1–10,000 characters" });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      await gitOps.commit(repoDir, trimmed, author);
      await get().refreshStatus();
      await get().refreshLog();
      set({ isLoading: false });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Failed to commit",
        isLoading: false,
      });
    }
  },

  refreshLog: async () => {
    const { repoDir, isGitRepo } = get();
    if (!isGitRepo) return;

    try {
      const log = await gitOps.getLog(repoDir, 50);
      set({ commitLog: log });
    } catch {
      // Silently fail - likely no commits yet
      set({ commitLog: [] });
    }
  },

  refreshBranches: async () => {
    const { repoDir, isGitRepo } = get();
    if (!isGitRepo) return;

    try {
      const branches = await gitOps.getBranches(repoDir);
      set({ branches });
    } catch {
      set({ branches: [] });
    }
  },

  createBranch: async (name: string) => {
    const { repoDir } = get();
    if (!/^[a-zA-Z0-9._\-/]+$/.test(name) || name.length > 255) {
      set({ error: "Invalid branch name" });
      return;
    }
    set({ error: null });
    try {
      await gitOps.createBranch(repoDir, name);
      await get().refreshBranches();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Failed to create branch" });
    }
  },

  checkoutBranch: async (name: string) => {
    const { repoDir } = get();
    set({ isLoading: true, error: null });
    try {
      await gitOps.checkoutBranch(repoDir, name);
      set({ currentBranch: name });
      await get().refreshStatus();
      await get().refreshLog();
      set({ isLoading: false });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Failed to checkout branch",
        isLoading: false,
      });
    }
  },

  setAuthor: (author: AuthorInfo) => {
    set({ author });
  },

  clearError: () => {
    set({ error: null });
  },
}));
