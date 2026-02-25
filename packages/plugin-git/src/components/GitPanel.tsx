/**
 * VS Code-style Git panel component for the sidebar.
 *
 * Shows current branch, staged/unstaged changes, commit input,
 * and a simple commit history list.
 */
import React, { useState, useCallback } from "react";
import {
  GitBranch,
  GitCommit,
  Plus,
  Minus,
  Check,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  FileText,
  FilePlus2,
  FileX2,
  AlertCircle,
  X,
} from "lucide-react";
import { useGitStore } from "../git-store.js";
import type { FileStatusEntry } from "../git-operations.js";

// ---------------------------------------------------------------------------
// Status badge component
// ---------------------------------------------------------------------------

function StatusBadge({ entry }: { entry: FileStatusEntry }): React.ReactElement {
  let label: string;
  let colorClass: string;

  switch (entry.status) {
    case "added":
      label = "A";
      colorClass = "bg-green-600 text-white";
      break;
    case "modified":
      label = "M";
      colorClass = entry.staged
        ? "bg-green-600 text-white"
        : "bg-amber-500 text-white";
      break;
    case "deleted":
      label = "D";
      colorClass = entry.staged
        ? "bg-green-600 text-white"
        : "bg-red-500 text-white";
      break;
    case "untracked":
      label = "U";
      colorClass = "bg-amber-500 text-white";
      break;
    default:
      label = "?";
      colorClass = "bg-gray-500 text-white";
  }

  return (
    <span
      className={`inline-flex items-center justify-center w-[18px] h-[18px] rounded text-[10px] font-bold shrink-0 ${colorClass}`}
    >
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// File status icon
// ---------------------------------------------------------------------------

function FileStatusIcon({ entry }: { entry: FileStatusEntry }): React.ReactElement {
  switch (entry.status) {
    case "added":
    case "untracked":
      return <FilePlus2 size={14} className="shrink-0 text-green-400" />;
    case "deleted":
      return <FileX2 size={14} className="shrink-0 text-red-400" />;
    default:
      return <FileText size={14} className="shrink-0 text-[var(--text-secondary)]" />;
  }
}

// ---------------------------------------------------------------------------
// File list item
// ---------------------------------------------------------------------------

function FileItem({
  entry,
  onStage,
  onUnstage,
}: {
  entry: FileStatusEntry;
  onStage: (path: string) => void;
  onUnstage: (path: string) => void;
}): React.ReactElement {
  const filename = entry.filepath.split("/").pop() ?? entry.filepath;
  const directory = entry.filepath.includes("/")
    ? entry.filepath.substring(0, entry.filepath.lastIndexOf("/"))
    : "";

  return (
    <div className="flex items-center gap-1.5 h-[26px] px-3 text-[12px] text-[var(--text-sidebar)] hover:bg-[var(--bg-hover)] group cursor-default">
      <FileStatusIcon entry={entry} />
      <span className="truncate flex-1" title={entry.filepath}>
        {filename}
        {directory && (
          <span className="text-[var(--text-secondary)] ml-1">{directory}</span>
        )}
      </span>
      <StatusBadge entry={entry} />
      {entry.staged ? (
        <button
          type="button"
          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-[var(--bg-active)] rounded transition-opacity"
          onClick={() => onUnstage(entry.filepath)}
          title="Unstage"
        >
          <Minus size={14} />
        </button>
      ) : (
        <button
          type="button"
          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-[var(--bg-active)] rounded transition-opacity"
          onClick={() => onStage(entry.filepath)}
          title="Stage"
        >
          <Plus size={14} />
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Collapsible section
// ---------------------------------------------------------------------------

function Section({
  title,
  count,
  defaultOpen = true,
  action,
  children,
}: {
  title: string;
  count: number;
  defaultOpen?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
}): React.ReactElement {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        className="w-full flex items-center gap-1 h-[26px] px-3 text-[11px] font-semibold text-[var(--text-sidebar)] uppercase tracking-wider hover:bg-[var(--bg-hover)] cursor-pointer"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <span className="flex-1 text-left">
          {title}
          {count > 0 && (
            <span className="ml-1.5 text-[10px] font-normal text-[var(--text-secondary)]">
              ({count})
            </span>
          )}
        </span>
        {action && (
          <span
            className="opacity-0 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            {action}
          </span>
        )}
      </button>
      {open && children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Commit history item
// ---------------------------------------------------------------------------

function CommitItem({
  oid,
  message,
  date,
  authorName,
}: {
  oid: string;
  message: string;
  date: string;
  authorName: string;
}): React.ReactElement {
  const shortOid = oid.substring(0, 7);
  const relativeDate = formatRelativeDate(date);
  const firstLine = message.split("\n")[0];

  return (
    <div className="flex items-start gap-2 px-3 py-1.5 text-[12px] text-[var(--text-sidebar)] hover:bg-[var(--bg-hover)] cursor-default">
      <GitCommit size={14} className="shrink-0 mt-0.5 text-[var(--text-secondary)]" />
      <div className="flex-1 min-w-0">
        <div className="truncate">{firstLine}</div>
        <div className="text-[10px] text-[var(--text-secondary)] flex gap-2">
          <span className="font-mono">{shortOid}</span>
          <span>{authorName}</span>
          <span>{relativeDate}</span>
        </div>
      </div>
    </div>
  );
}

function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// ---------------------------------------------------------------------------
// No-repo placeholder
// ---------------------------------------------------------------------------

function NoRepoView(): React.ReactElement {
  const initRepo = useGitStore((s) => s.initRepo);
  const isLoading = useGitStore((s) => s.isLoading);

  return (
    <div className="px-4 py-6 text-center">
      <GitBranch size={32} className="mx-auto mb-3 text-[var(--text-secondary)]" />
      <p className="text-[13px] text-[var(--text-secondary)] mb-4">
        No Git repository detected.
      </p>
      <button
        type="button"
        className="px-3 py-1.5 text-[12px] bg-[var(--accent)] text-white rounded hover:opacity-90 transition-opacity disabled:opacity-50"
        onClick={() => void initRepo()}
        disabled={isLoading}
      >
        Initialize Repository
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main GitPanel component
// ---------------------------------------------------------------------------

export function GitPanel(): React.ReactElement {
  const isGitRepo = useGitStore((s) => s.isGitRepo);
  const currentBranch = useGitStore((s) => s.currentBranch);
  const fileStatuses = useGitStore((s) => s.fileStatuses);
  const commitLog = useGitStore((s) => s.commitLog);
  const isLoading = useGitStore((s) => s.isLoading);
  const error = useGitStore((s) => s.error);
  const stageFile = useGitStore((s) => s.stageFile);
  const unstageFile = useGitStore((s) => s.unstageFile);
  const stageAll = useGitStore((s) => s.stageAll);
  const unstageAll = useGitStore((s) => s.unstageAll);
  const commitAction = useGitStore((s) => s.commit);
  const refreshStatus = useGitStore((s) => s.refreshStatus);
  const clearError = useGitStore((s) => s.clearError);

  const [commitMessage, setCommitMessage] = useState("");

  const stagedFiles = fileStatuses.filter((f) => f.staged);
  const unstagedFiles = fileStatuses.filter((f) => !f.staged);

  const handleCommit = useCallback(async () => {
    if (!commitMessage.trim()) return;
    await commitAction(commitMessage.trim());
    setCommitMessage("");
  }, [commitMessage, commitAction]);

  const handleStage = useCallback(
    (path: string) => {
      void stageFile(path);
    },
    [stageFile],
  );

  const handleUnstage = useCallback(
    (path: string) => {
      void unstageFile(path);
    },
    [unstageFile],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        void handleCommit();
      }
    },
    [handleCommit],
  );

  if (!isGitRepo) {
    return <NoRepoView />;
  }

  return (
    <div className="flex flex-col h-full text-[var(--text-sidebar)]">
      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-900/30 text-red-300 text-[11px]">
          <AlertCircle size={14} className="shrink-0" />
          <span className="flex-1 truncate">{error}</span>
          <button
            type="button"
            className="shrink-0 hover:text-white"
            onClick={clearError}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Branch indicator + refresh */}
      <div className="flex items-center gap-2 px-3 h-[32px] border-b border-[var(--border-sidebar)]">
        <GitBranch size={14} className="shrink-0 text-[var(--accent)]" />
        <span className="text-[12px] font-medium truncate flex-1">
          {currentBranch}
        </span>
        <button
          type="button"
          className={`p-1 rounded hover:bg-[var(--bg-hover)] transition-colors ${isLoading ? "animate-spin" : ""}`}
          onClick={() => void refreshStatus()}
          title="Refresh"
          disabled={isLoading}
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Commit message input */}
      <div className="px-3 py-2 border-b border-[var(--border-sidebar)]">
        <textarea
          className="w-full bg-[var(--bg-hover)] text-[var(--text-primary)] text-[12px] rounded px-2 py-1.5 resize-none outline-none focus:ring-1 focus:ring-[var(--accent)] placeholder:text-[var(--text-secondary)]"
          rows={3}
          placeholder="Commit message (Ctrl+Enter to commit)"
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="w-full mt-1.5 flex items-center justify-center gap-1.5 h-[28px] text-[12px] font-medium bg-[var(--accent)] text-white rounded hover:opacity-90 transition-opacity disabled:opacity-50"
          onClick={() => void handleCommit()}
          disabled={stagedFiles.length === 0 || !commitMessage.trim() || isLoading}
        >
          <Check size={14} />
          Commit
        </button>
      </div>

      {/* File changes */}
      <div className="flex-1 overflow-y-auto">
        {/* Staged changes */}
        <Section
          title="Staged Changes"
          count={stagedFiles.length}
          action={
            stagedFiles.length > 0 && (
              <button
                type="button"
                className="p-0.5 hover:bg-[var(--bg-active)] rounded"
                onClick={() => void unstageAll()}
                title="Unstage All"
              >
                <Minus size={14} />
              </button>
            )
          }
        >
          {stagedFiles.length === 0 ? (
            <div className="px-3 py-1 text-[11px] text-[var(--text-secondary)]">
              No staged changes
            </div>
          ) : (
            stagedFiles.map((entry) => (
              <FileItem
                key={entry.filepath}
                entry={entry}
                onStage={handleStage}
                onUnstage={handleUnstage}
              />
            ))
          )}
        </Section>

        {/* Unstaged changes */}
        <Section
          title="Changes"
          count={unstagedFiles.length}
          action={
            unstagedFiles.length > 0 && (
              <button
                type="button"
                className="p-0.5 hover:bg-[var(--bg-active)] rounded"
                onClick={() => void stageAll()}
                title="Stage All"
              >
                <Plus size={14} />
              </button>
            )
          }
        >
          {unstagedFiles.length === 0 ? (
            <div className="px-3 py-1 text-[11px] text-[var(--text-secondary)]">
              No changes
            </div>
          ) : (
            unstagedFiles.map((entry) => (
              <FileItem
                key={entry.filepath}
                entry={entry}
                onStage={handleStage}
                onUnstage={handleUnstage}
              />
            ))
          )}
        </Section>

        {/* Commit history */}
        <Section title="Commit History" count={commitLog.length} defaultOpen={commitLog.length > 0}>
          {commitLog.length === 0 ? (
            <div className="px-3 py-1 text-[11px] text-[var(--text-secondary)]">
              No commits yet
            </div>
          ) : (
            commitLog.slice(0, 20).map((entry) => (
              <CommitItem
                key={entry.oid}
                oid={entry.oid}
                message={entry.message}
                date={entry.date}
                authorName={entry.author.name}
              />
            ))
          )}
        </Section>
      </div>
    </div>
  );
}
