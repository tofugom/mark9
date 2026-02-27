import React, { useState } from "react";
import {
  Files,
  GitBranch,
  Settings,
  Users,
  ChevronRight,
  ChevronDown,
  FileText,
  Folder,
} from "lucide-react";
import { useLayoutStore } from "../stores/layout-store.js";
import { useFileStore } from "../stores/file-store.js";
import { useFileActions } from "../hooks/useFileActions.js";
import { SettingsPanel } from "./SettingsPanel.js";
import type { FileNode } from "../stores/file-store.js";

type ActivityTab = "files" | "git" | "collab" | "settings";

/** Git status badge colors */
const GIT_STATUS_COLORS: Record<string, { text: string; label: string }> = {
  modified: { text: "text-yellow-500", label: "M" },
  added: { text: "text-green-500", label: "A" },
  deleted: { text: "text-red-500", label: "D" },
  untracked: { text: "text-green-400", label: "U" },
};

function FileTreeItem({
  node,
  depth,
  onFileClick,
  gitStatus,
  gitStatusMap,
}: {
  node: FileNode;
  depth: number;
  onFileClick: (path: string) => void;
  gitStatus?: string;
  gitStatusMap?: Map<string, string>;
}): React.ReactElement {
  const [expanded, setExpanded] = useState(depth === 0);
  const activeFile = useFileStore((s) => s.activeFile);

  const isActive = node.type === "file" && node.path === activeFile;
  const indent = 8 + depth * 16;

  if (node.type === "folder") {
    return (
      <div>
        <button
          type="button"
          className="w-full flex items-center gap-1.5 h-[26px] text-[13px] text-[var(--text-sidebar)] hover:bg-[var(--bg-hover)] cursor-pointer"
          style={{ paddingLeft: indent }}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? (
            <ChevronDown size={16} className="shrink-0 text-[var(--text-secondary)]" />
          ) : (
            <ChevronRight size={16} className="shrink-0 text-[var(--text-secondary)]" />
          )}
          <Folder size={16} className="shrink-0 text-[#dcb67a]" />
          <span className="truncate">{node.name}</span>
        </button>
        {expanded &&
          node.children?.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              onFileClick={onFileClick}
              gitStatus={gitStatusMap?.get(child.path)}
              gitStatusMap={gitStatusMap}
            />
          ))}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`w-full flex items-center gap-1.5 h-[26px] text-[13px] cursor-pointer ${
        isActive
          ? "bg-[var(--bg-active)] text-white"
          : "text-[var(--text-sidebar)] hover:bg-[var(--bg-hover)]"
      }`}
      style={{ paddingLeft: indent + 22 }}
      onClick={() => onFileClick(node.path)}
    >
      <FileText
        size={16}
        className={`shrink-0 ${isActive ? "text-white" : "text-[#519aba]"}`}
      />
      <span className={`truncate flex-1 ${gitStatus && GIT_STATUS_COLORS[gitStatus] ? GIT_STATUS_COLORS[gitStatus].text : ""}`}>
        {node.name}
      </span>
      {gitStatus && GIT_STATUS_COLORS[gitStatus] && (
        <span className={`text-[11px] font-medium mr-2 ${GIT_STATUS_COLORS[gitStatus].text}`}>
          {GIT_STATUS_COLORS[gitStatus].label}
        </span>
      )}
    </button>
  );
}

function ActivityBar({
  activeTab,
  onTabChange,
}: {
  activeTab: ActivityTab;
  onTabChange: (tab: ActivityTab) => void;
}): React.ReactElement {
  const items: {
    tab: ActivityTab;
    icon: React.ReactElement;
    label: string;
  }[] = [
    { tab: "files", icon: <Files size={24} />, label: "Explorer" },
    {
      tab: "git",
      icon: <GitBranch size={24} />,
      label: "Source Control",
    },
    { tab: "collab", icon: <Users size={24} />, label: "Collaboration" },
    { tab: "settings", icon: <Settings size={24} />, label: "Settings" },
  ];

  return (
    <div className="w-[48px] bg-[var(--bg-activity)] flex flex-col items-center pt-1 shrink-0 h-full">
      {items.map((item) => (
        <button
          key={item.tab}
          type="button"
          className={`w-[48px] h-[48px] flex items-center justify-center transition-colors ${
            activeTab === item.tab
              ? "text-[var(--accent)] border-l-2 border-[var(--accent)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-l-2 border-transparent"
          }`}
          onClick={() => onTabChange(item.tab)}
          aria-label={item.label}
          title={item.label}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
}

export interface SidebarProps {
  /** Optional custom Git panel to render when the "git" tab is active */
  gitPanel?: React.ReactNode;
  /** Optional custom Collab panel to render when the "collab" tab is active */
  collabPanel?: React.ReactNode;
  /** Git file statuses for showing badges on file tree items */
  gitFileStatuses?: { filepath: string; status: string }[];
}

export function Sidebar({ gitPanel, collabPanel, gitFileStatuses }: SidebarProps = {}): React.ReactElement | null {
  const sidebarOpen = useLayoutStore((s) => s.sidebarOpen);
  const sidebarWidth = useLayoutStore((s) => s.sidebarWidth);
  const fileTree = useFileStore((s) => s.fileTree);
  const [activeTab, setActiveTab] = useState<ActivityTab>("files");
  const { handleFileTreeClick } = useFileActions();

  // Build a map of filepath -> status for quick lookup
  const gitStatusMap = React.useMemo(() => {
    const map = new Map<string, string>();
    gitFileStatuses?.forEach((entry) => {
      // Normalize path: add leading "/" if missing
      const path = entry.filepath.startsWith("/") ? entry.filepath : `/${entry.filepath}`;
      map.set(path, entry.status);
    });
    return map;
  }, [gitFileStatuses]);

  if (!sidebarOpen) {
    return null;
  }

  return (
    <div className="flex h-full shrink-0">
      <ActivityBar activeTab={activeTab} onTabChange={setActiveTab} />

      <div
        className="bg-[var(--bg-sidebar)] border-r border-[var(--border-sidebar)] overflow-y-auto h-full"
        style={{ width: sidebarWidth }}
      >
        <div className="h-[35px] flex items-center px-5 text-[11px] font-semibold text-[var(--text-sidebar)] uppercase tracking-widest">
          {activeTab === "files" && "Explorer"}
          {activeTab === "git" && "Source Control"}
          {activeTab === "collab" && "Collaboration"}
          {activeTab === "settings" && "Settings"}
        </div>

        {activeTab === "files" && (
          <div className="pb-2">
            {fileTree.length === 0 ? (
              <div className="px-5 py-3 text-[13px] text-[var(--text-secondary)]">
                No folder opened
              </div>
            ) : (
              fileTree.map((node) => (
                <FileTreeItem
                  key={node.path}
                  node={node}
                  depth={0}
                  onFileClick={handleFileTreeClick}
                  gitStatus={gitStatusMap.get(node.path)}
                  gitStatusMap={gitStatusMap}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "git" && (
          gitPanel ?? (
            <div className="px-5 py-3 text-[13px] text-[var(--text-secondary)]">
              No changes detected
            </div>
          )
        )}

        {activeTab === "collab" && (
          collabPanel ?? (
            <div className="px-5 py-3 text-[13px] text-[var(--text-secondary)]">
              Start or join a collaboration session
            </div>
          )
        )}

        {activeTab === "settings" && <SettingsPanel />}
      </div>
    </div>
  );
}
