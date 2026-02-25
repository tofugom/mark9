import React, { useState } from "react";
import {
  Files,
  GitBranch,
  Settings,
  ChevronRight,
  ChevronDown,
  FileText,
  Folder,
} from "lucide-react";
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
  const [expanded, setExpanded] = useState(depth === 0);
  const activeFile = useFileStore((s) => s.activeFile);

  const isActive = node.type === "file" && node.path === activeFile;
  const indent = 8 + depth * 16;

  if (node.type === "folder") {
    return (
      <div>
        <button
          type="button"
          className="w-full flex items-center gap-1.5 h-[26px] text-[13px] text-gray-300 hover:bg-[#2a2d2e] cursor-pointer"
          style={{ paddingLeft: indent }}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? (
            <ChevronDown size={16} className="shrink-0 text-gray-500" />
          ) : (
            <ChevronRight size={16} className="shrink-0 text-gray-500" />
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
          ? "bg-[#094771] text-white"
          : "text-gray-300 hover:bg-[#2a2d2e]"
      }`}
      style={{ paddingLeft: indent + 22 }}
      onClick={() => onFileClick(node.path)}
    >
      <FileText
        size={16}
        className={`shrink-0 ${isActive ? "text-white" : "text-[#519aba]"}`}
      />
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
    { tab: "settings", icon: <Settings size={24} />, label: "Settings" },
  ];

  return (
    <div className="w-[48px] bg-[#333333] flex flex-col items-center pt-1 shrink-0 h-full">
      {items.map((item) => (
        <button
          key={item.tab}
          type="button"
          className={`w-[48px] h-[48px] flex items-center justify-center transition-colors ${
            activeTab === item.tab
              ? "text-white border-l-2 border-white"
              : "text-[#858585] hover:text-white border-l-2 border-transparent"
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
    <div className="flex h-full shrink-0">
      <ActivityBar activeTab={activeTab} onTabChange={setActiveTab} />

      <div
        className="bg-[#252526] border-r border-[#1e1e1e] overflow-y-auto h-full"
        style={{ width: sidebarWidth }}
      >
        <div className="h-[35px] flex items-center px-5 text-[11px] font-semibold text-[#bbbbbb] uppercase tracking-widest">
          {activeTab === "files" && "Explorer"}
          {activeTab === "git" && "Source Control"}
          {activeTab === "settings" && "Settings"}
        </div>

        {activeTab === "files" && (
          <div className="pb-2">
            {fileTree.length === 0 ? (
              <div className="px-5 py-3 text-[13px] text-[#858585]">
                No folder opened
              </div>
            ) : (
              fileTree.map((node) => (
                <FileTreeItem
                  key={node.path}
                  node={node}
                  depth={0}
                  onFileClick={handleFileTreeClick}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "git" && (
          <div className="px-5 py-3 text-[13px] text-[#858585]">
            No changes detected
          </div>
        )}

        {activeTab === "settings" && (
          <div className="px-5 py-3 text-[13px] text-[#858585]">
            Settings
          </div>
        )}
      </div>
    </div>
  );
}
