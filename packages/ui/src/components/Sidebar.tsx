import React, { useState } from "react";
import { Files, GitBranch, Settings, ChevronRight, ChevronDown, FileText, Folder } from "lucide-react";
import { useLayoutStore } from "../stores/layout-store.js";
import { useFileStore } from "../stores/file-store.js";
import { useFileActions } from "../hooks/useFileActions.js";
import type { FileNode } from "../stores/file-store.js";

type ActivityTab = "files" | "git" | "settings";

function FileTreeItem({
  node,
  depth,
  onFileClick,
}: {
  node: FileNode;
  depth: number;
  onFileClick: (path: string) => void;
}): React.ReactElement {
  const [expanded, setExpanded] = useState(false);
  const activeFile = useFileStore((s) => s.activeFile);

  const isActive = node.type === "file" && node.path === activeFile;
  const paddingLeft = 12 + depth * 16;

  if (node.type === "folder") {
    return (
      <div>
        <button
          type="button"
          className="w-full flex items-center gap-1 py-0.5 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
          style={{ paddingLeft }}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <Folder size={14} className="text-gray-500" />
          <span className="truncate">{node.name}</span>
        </button>
        {expanded &&
          node.children?.map((child) => (
            <FileTreeItem key={child.path} node={child} depth={depth + 1} onFileClick={onFileClick} />
          ))}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`w-full flex items-center gap-1 py-0.5 text-sm transition-colors ${
        isActive
          ? "bg-blue-100 text-blue-700"
          : "text-gray-700 hover:bg-gray-200"
      }`}
      style={{ paddingLeft: paddingLeft + 18 }}
      onClick={() => onFileClick(node.path)}
    >
      <FileText size={14} className={isActive ? "text-blue-500" : "text-gray-400"} />
      <span className="truncate">{node.name}</span>
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
  const items: { tab: ActivityTab; icon: React.ReactElement; label: string }[] = [
    { tab: "files", icon: <Files size={20} />, label: "Explorer" },
    { tab: "git", icon: <GitBranch size={20} />, label: "Source Control" },
    { tab: "settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <div className="w-12 bg-gray-900 flex flex-col items-center py-2 gap-2 shrink-0">
      {items.map((item) => (
        <button
          key={item.tab}
          type="button"
          className={`p-2 rounded transition-colors ${
            activeTab === item.tab
              ? "text-white bg-gray-700"
              : "text-gray-400 hover:text-white"
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

export function Sidebar(): React.ReactElement | null {
  const sidebarOpen = useLayoutStore((s) => s.sidebarOpen);
  const sidebarWidth = useLayoutStore((s) => s.sidebarWidth);
  const fileTree = useFileStore((s) => s.fileTree);
  const [activeTab, setActiveTab] = useState<ActivityTab>("files");
  const { handleFileTreeClick } = useFileActions();

  if (!sidebarOpen) {
    return null;
  }

  return (
    <div className="flex shrink-0" style={{ width: sidebarWidth + 48 }}>
      <ActivityBar activeTab={activeTab} onTabChange={setActiveTab} />

      <div
        className="bg-gray-50 border-r border-gray-200 overflow-y-auto"
        style={{ width: sidebarWidth }}
      >
        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {activeTab === "files" && "Explorer"}
          {activeTab === "git" && "Source Control"}
          {activeTab === "settings" && "Settings"}
        </div>

        {activeTab === "files" && (
          <div>
            {fileTree.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-400">
                No files open
              </div>
            ) : (
              fileTree.map((node) => (
                <FileTreeItem key={node.path} node={node} depth={0} onFileClick={handleFileTreeClick} />
              ))
            )}
          </div>
        )}

        {activeTab === "git" && (
          <div className="px-4 py-2 text-sm text-gray-400">
            No changes detected
          </div>
        )}

        {activeTab === "settings" && (
          <div className="px-4 py-2 text-sm text-gray-400">
            Settings panel
          </div>
        )}
      </div>
    </div>
  );
}
