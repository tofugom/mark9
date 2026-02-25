/**
 * @mark9/desktop - Native git operations
 *
 * Wraps isomorphic-git with Bun's native filesystem for real git
 * operations. Unlike browser-based git (which needs a virtual FS),
 * this uses the actual filesystem, making it compatible with the
 * system's git repositories.
 *
 * All operations are registered as RPC request handlers so the
 * webview renderer can call them through the typed RPC bridge.
 */

import git from "isomorphic-git";
import * as fs from "node:fs";
import http from "isomorphic-git/http/node";
import type {
  FileStatus,
  Author,
  GitAuth,
  CommitEntry,
} from "../rpc/index.js";

// ─── Repository queries ──────────────────────────────────────────────

/**
 * Check if a directory is a git repository.
 */
export async function isRepo(params: { dir: string }): Promise<boolean> {
  try {
    await git.findRoot({ fs, filepath: params.dir });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the status of all files in a git repository.
 */
export async function getStatus(params: {
  dir: string;
}): Promise<FileStatus[]> {
  const matrix = await git.statusMatrix({ fs, dir: params.dir });

  return matrix.map(([filepath, head, workdir, stage]) => ({
    filepath,
    head,
    workdir,
    stage,
  }));
}

/**
 * Get the current branch name.
 */
export async function currentBranch(params: {
  dir: string;
}): Promise<string> {
  const branch = await git.currentBranch({
    fs,
    dir: params.dir,
    fullname: false,
  });
  return branch ?? "HEAD";
}

/**
 * List all local branches.
 */
export async function branches(params: {
  dir: string;
}): Promise<string[]> {
  return await git.listBranches({ fs, dir: params.dir });
}

/**
 * Get the commit log for a repository.
 */
export async function log(params: {
  dir: string;
  depth?: number;
}): Promise<CommitEntry[]> {
  const commits = await git.log({
    fs,
    dir: params.dir,
    depth: params.depth ?? 50,
  });

  return commits.map((entry) => ({
    oid: entry.oid,
    message: entry.commit.message,
    author: {
      name: entry.commit.author.name,
      email: entry.commit.author.email,
      timestamp: entry.commit.author.timestamp,
    },
    parent: entry.commit.parent,
  }));
}

// ─── Staging & committing ────────────────────────────────────────────

/**
 * Stage a file for commit.
 */
export async function stage(params: {
  dir: string;
  filepath: string;
}): Promise<void> {
  await git.add({
    fs,
    dir: params.dir,
    filepath: params.filepath,
  });
}

/**
 * Create a new commit with the staged changes.
 */
export async function commit(params: {
  dir: string;
  message: string;
  author: Author;
}): Promise<string> {
  const oid = await git.commit({
    fs,
    dir: params.dir,
    message: params.message,
    author: {
      name: params.author.name,
      email: params.author.email,
    },
  });
  return oid;
}

// ─── Remote operations ───────────────────────────────────────────────

/**
 * Build isomorphic-git auth handler from GitAuth params.
 * Credentials are kept in-memory only for the duration of the operation
 * and never logged or persisted.
 */
function makeAuth(auth: GitAuth): {
  onAuth: () => { username: string; password: string };
} {
  return {
    onAuth: () => ({
      username: auth.username ?? (auth.token ? "oauth2" : ""),
      password: auth.password ?? auth.token ?? "",
    }),
  };
}

/**
 * Push commits to a remote repository.
 */
export async function push(params: {
  dir: string;
  remote: string;
  branch: string;
  auth: GitAuth;
}): Promise<void> {
  await git.push({
    fs,
    http,
    dir: params.dir,
    remote: params.remote,
    ref: params.branch,
    ...makeAuth(params.auth),
  });
}

/**
 * Pull changes from a remote repository.
 */
export async function pull(params: {
  dir: string;
  remote: string;
  branch: string;
  auth: GitAuth;
}): Promise<void> {
  await git.pull({
    fs,
    http,
    dir: params.dir,
    remote: params.remote,
    ref: params.branch,
    author: {
      name: "Mark9",
      email: "mark9@local",
    },
    ...makeAuth(params.auth),
  });
}
