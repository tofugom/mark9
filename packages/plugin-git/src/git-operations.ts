/**
 * Git operations using isomorphic-git with lightning-fs for browser environments.
 *
 * All operations are local-only. Push/pull to remote requires a CORS proxy
 * and authentication tokens which must be configured separately.
 */
import git from "isomorphic-git";
import http from "isomorphic-git/http/web";
import LightningFS from "@isomorphic-git/lightning-fs";

// ---------------------------------------------------------------------------
// Filesystem singleton
// ---------------------------------------------------------------------------

let _fs: LightningFS | null = null;

/**
 * Returns the shared LightningFS instance.  Creates one on first call.
 * The same instance must be reused across all git operations so that the
 * in-browser IndexedDB-backed store stays consistent.
 */
export function getFs(): LightningFS {
  if (!_fs) {
    _fs = new LightningFS("mark9-git");
  }
  return _fs;
}

/**
 * Replace the filesystem instance (useful for tests or custom backends).
 */
export function setFs(fs: LightningFS): void {
  _fs = fs;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FileStatusCode =
  | "unmodified"
  | "modified"
  | "added"
  | "deleted"
  | "untracked"
  | "absent"
  | "ignored"
  | "*modified"   // unstaged modification
  | "*deleted"    // unstaged deletion
  | "*added"      // staged addition
  | "*unmodified" // staged but unmodified in workdir
  | "*absent";

export interface FileStatusEntry {
  filepath: string;
  /** HEAD vs staging area status */
  headStatus: number;
  /** Staging area vs workdir status */
  workdirStatus: number;
  /** Staging area vs workdir status */
  stageStatus: number;
  /** Human-readable overall status */
  status: "modified" | "added" | "deleted" | "untracked" | "unmodified" | "ignored" | "unknown";
  /** Whether the file has staged changes */
  staged: boolean;
}

export interface CommitEntry {
  oid: string;
  message: string;
  author: {
    name: string;
    email: string;
    timestamp: number;
  };
  /** ISO date string */
  date: string;
}

export interface AuthorInfo {
  name: string;
  email: string;
}

export interface RemoteConfig {
  corsProxy?: string;
  url: string;
  token?: string;
}

// ---------------------------------------------------------------------------
// Status matrix helpers
// ---------------------------------------------------------------------------

/**
 * Translate isomorphic-git's statusMatrix row into a human-readable status.
 *
 * statusMatrix returns rows of [filepath, HEAD, WORKDIR, STAGE]:
 *   HEAD:    0 = absent,  1 = present
 *   WORKDIR: 0 = absent,  1 = identical to HEAD,  2 = different from HEAD
 *   STAGE:   0 = absent,  1 = identical to HEAD,  2 = different from HEAD (staged), 3 = different from STAGE (unstaged edits after staging)
 */
function interpretStatus(row: [string, number, number, number]): FileStatusEntry {
  const [filepath, head, workdir, stage] = row;

  let status: FileStatusEntry["status"] = "unknown";
  let staged = false;

  // Untracked: not in HEAD, present in workdir, not staged
  if (head === 0 && workdir === 2 && stage === 0) {
    status = "untracked";
  }
  // Untracked but staged (new file added)
  else if (head === 0 && workdir === 2 && stage === 2) {
    status = "added";
    staged = true;
  }
  // Staged new file, absent in workdir (added then deleted)
  else if (head === 0 && workdir === 0 && stage === 2) {
    status = "added";
    staged = true;
  }
  // Staged new file, identical in workdir
  else if (head === 0 && workdir === 2 && stage === 3) {
    status = "added";
    staged = true;
  }
  // Unmodified
  else if (head === 1 && workdir === 1 && stage === 1) {
    status = "unmodified";
  }
  // Modified but not staged
  else if (head === 1 && workdir === 2 && stage === 1) {
    status = "modified";
  }
  // Modified and staged
  else if (head === 1 && workdir === 2 && stage === 2) {
    status = "modified";
    staged = true;
  }
  // Modified, staged, then modified again in workdir
  else if (head === 1 && workdir === 2 && stage === 3) {
    status = "modified";
    staged = true; // partially staged
  }
  // Deleted in workdir, not staged
  else if (head === 1 && workdir === 0 && stage === 1) {
    status = "deleted";
  }
  // Deleted and staged
  else if (head === 1 && workdir === 0 && stage === 0) {
    status = "deleted";
    staged = true;
  }
  // Ignored or absent
  else if (head === 0 && workdir === 0 && stage === 0) {
    status = "ignored";
  }

  return {
    filepath,
    headStatus: head,
    workdirStatus: workdir,
    stageStatus: stage,
    status,
    staged,
  };
}

// ---------------------------------------------------------------------------
// Git operations
// ---------------------------------------------------------------------------

/**
 * Initialize a new git repository.
 */
export async function initRepo(dir: string): Promise<void> {
  const fs = getFs();
  await git.init({ fs, dir });
}

/**
 * Get the status of all files in the repository.
 * Returns only files that are not "unmodified" (i.e. have changes).
 */
export async function getStatus(dir: string): Promise<FileStatusEntry[]> {
  const fs = getFs();
  const matrix = await git.statusMatrix({ fs, dir });
  return matrix
    .map(interpretStatus)
    .filter((entry) => entry.status !== "unmodified" && entry.status !== "ignored");
}

/**
 * Stage a file for commit.
 */
export async function stageFile(dir: string, filepath: string): Promise<void> {
  const fs = getFs();

  // Check if the file exists in the workdir
  try {
    await fs.promises.stat(`${dir}/${filepath}`);
    await git.add({ fs, dir, filepath });
  } catch {
    // File doesn't exist - it was deleted, stage the removal
    await git.remove({ fs, dir, filepath });
  }
}

/**
 * Unstage a file (reset it in the index to match HEAD).
 */
export async function unstageFile(dir: string, filepath: string): Promise<void> {
  const fs = getFs();

  try {
    // Try to restore the file in the index from HEAD
    await git.resetIndex({ fs, dir, filepath });
  } catch {
    // If the file is new (not in HEAD), remove it from the index
    await git.remove({ fs, dir, filepath });
  }
}

/**
 * Create a commit with the currently staged changes.
 */
export async function commit(
  dir: string,
  message: string,
  author: AuthorInfo,
): Promise<string> {
  const fs = getFs();
  const oid = await git.commit({
    fs,
    dir,
    message,
    author: {
      name: author.name,
      email: author.email,
    },
  });
  return oid;
}

/**
 * Get the commit log.
 */
export async function getLog(
  dir: string,
  depth: number = 50,
): Promise<CommitEntry[]> {
  const fs = getFs();
  try {
    const commits = await git.log({ fs, dir, depth });
    return commits.map((entry) => ({
      oid: entry.oid,
      message: entry.commit.message,
      author: {
        name: entry.commit.author.name,
        email: entry.commit.author.email,
        timestamp: entry.commit.author.timestamp,
      },
      date: new Date(entry.commit.author.timestamp * 1000).toISOString(),
    }));
  } catch {
    // No commits yet
    return [];
  }
}

/**
 * List all local branches.
 */
export async function getBranches(dir: string): Promise<string[]> {
  const fs = getFs();
  try {
    return await git.listBranches({ fs, dir });
  } catch {
    return [];
  }
}

/**
 * Get the current branch name.
 */
export async function getCurrentBranch(dir: string): Promise<string> {
  const fs = getFs();
  try {
    const branch = await git.currentBranch({ fs, dir });
    return branch ?? "HEAD (detached)";
  } catch {
    return "main";
  }
}

/**
 * Create a new branch at the current HEAD.
 */
export async function createBranch(
  dir: string,
  name: string,
): Promise<void> {
  const fs = getFs();
  await git.branch({ fs, dir, ref: name });
}

/**
 * Checkout a branch.
 */
export async function checkoutBranch(
  dir: string,
  name: string,
): Promise<void> {
  const fs = getFs();
  await git.checkout({ fs, dir, ref: name });
}

/**
 * Get a simple diff for a file by comparing the HEAD version with the workdir version.
 * Returns an object with the old content and new content.
 * For a richer diff display, consumers should use a diff library on these strings.
 */
export async function getDiff(
  dir: string,
  filepath: string,
): Promise<{ oldContent: string; newContent: string }> {
  const fs = getFs();

  let oldContent = "";
  let newContent = "";

  // Try to read HEAD version
  try {
    const oid = await git.resolveRef({ fs, dir, ref: "HEAD" });
    const { blob } = await git.readBlob({
      fs,
      dir,
      oid,
      filepath,
    });
    oldContent = new TextDecoder().decode(blob);
  } catch {
    // File not in HEAD (new file)
    oldContent = "";
  }

  // Try to read workdir version
  try {
    const content = await fs.promises.readFile(`${dir}/${filepath}`, {
      encoding: "utf8",
    });
    newContent = typeof content === "string" ? content : new TextDecoder().decode(content as Uint8Array);
  } catch {
    // File deleted in workdir
    newContent = "";
  }

  return { oldContent, newContent };
}

// ---------------------------------------------------------------------------
// Remote operations (require configuration)
// ---------------------------------------------------------------------------

/**
 * Clone a remote repository.
 *
 * NOTE: Requires a CORS proxy for browser environments.
 * Configure `corsProxy` in RemoteConfig with a self-hosted proxy URL.
 */
export async function cloneRepo(
  dir: string,
  remote: RemoteConfig,
): Promise<void> {
  const fs = getFs();
  await git.clone({
    fs,
    http,
    dir,
    url: remote.url,
    corsProxy: remote.corsProxy,
    onAuth: remote.token ? () => ({ username: remote.token! }) : undefined,
    singleBranch: true,
    depth: 10,
  });
}

/**
 * Push to a remote repository.
 *
 * NOTE: Requires CORS proxy and authentication token.
 * This function is provided for completeness but will not work without
 * proper remote configuration.
 */
export async function push(
  dir: string,
  remote: RemoteConfig,
  branch?: string,
): Promise<void> {
  const fs = getFs();
  const ref = branch ?? (await getCurrentBranch(dir));
  await git.push({
    fs,
    http,
    dir,
    ref,
    remote: "origin",
    corsProxy: remote.corsProxy,
    onAuth: remote.token ? () => ({ username: remote.token! }) : undefined,
  });
}

/**
 * Pull from a remote repository.
 *
 * NOTE: Requires CORS proxy and authentication token.
 * This function is provided for completeness but will not work without
 * proper remote configuration.
 */
export async function pull(
  dir: string,
  remote: RemoteConfig,
  branch?: string,
): Promise<void> {
  const fs = getFs();
  const ref = branch ?? (await getCurrentBranch(dir));
  await git.pull({
    fs,
    http,
    dir,
    ref,
    singleBranch: true,
    author: { name: "Mark9", email: "mark9@local" },
    corsProxy: remote.corsProxy,
    onAuth: remote.token ? () => ({ username: remote.token! }) : undefined,
  });
}
