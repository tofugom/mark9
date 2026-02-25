import React, { useState, useRef, useEffect } from "react";
import { Menu, FileUp, FolderOpen, Save, SaveAll } from "lucide-react";
import { useLayoutStore } from "../stores/layout-store.js";
import { useFileStore } from "../stores/file-store.js";
import { useFileActions } from "../hooks/useFileActions.js";

function FileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}): React.ReactElement | null {
  const menuRef = useRef<HTMLDivElement>(null);
  const { handleOpenFile, handleOpenFolder, handleSave, handleSaveAs } =
    useFileActions();

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  const items = [
    {
      label: "Open File",
      icon: <FileUp size={14} />,
      shortcut: "Ctrl+O",
      action: handleOpenFile,
    },
    {
      label: "Open Folder",
      icon: <FolderOpen size={14} />,
      shortcut: "",
      action: handleOpenFolder,
    },
    { type: "separator" as const },
    {
      label: "Save",
      icon: <Save size={14} />,
      shortcut: "Ctrl+S",
      action: handleSave,
    },
    {
      label: "Save As...",
      icon: <SaveAll size={14} />,
      shortcut: "Ctrl+Shift+S",
      action: handleSaveAs,
    },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute top-full left-0 mt-1 w-56 bg-gray-800 border border-gray-700 rounded-md shadow-xl z-50 py-1"
    >
      {items.map((item, i) => {
        if ("type" in item && item.type === "separator") {
          return (
            <div
              key={`sep-${i}`}
              className="my-1 border-t border-gray-700"
            />
          );
        }

        const menuItem = item as {
          label: string;
          icon: React.ReactElement;
          shortcut: string;
          action: () => void;
        };

        return (
          <button
            key={menuItem.label}
            type="button"
            className="w-full flex items-center gap-3 px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
            onClick={() => {
              menuItem.action();
              onClose();
            }}
          >
            {menuItem.icon}
            <span className="flex-1 text-left">{menuItem.label}</span>
            {menuItem.shortcut && (
              <span className="text-xs text-gray-500">{menuItem.shortcut}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function TitleBar(): React.ReactElement {
  const toggleSidebar = useLayoutStore((s) => s.toggleSidebar);
  const activeFile = useFileStore((s) => s.activeFile);
  const dirty = useFileStore((s) => s.dirty);
  const [menuOpen, setMenuOpen] = useState(false);

  const fileName = activeFile
    ? activeFile.split("/").pop() ?? "Untitled"
    : "Untitled";

  return (
    <div className="bg-gray-900 text-white h-10 flex items-center px-4 select-none shrink-0">
      <div className="relative flex items-center gap-1">
        <button
          type="button"
          className="p-1 rounded hover:bg-gray-700 transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="File menu"
        >
          <Menu size={18} />
        </button>

        <FileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

        <button
          type="button"
          className="p-1 rounded hover:bg-gray-700 transition-colors text-xs text-gray-400"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          title="Toggle sidebar (Ctrl+Shift+E)"
        >
          |||
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center gap-2 text-sm">
        <span className="font-semibold tracking-wide">Mark9</span>
        <span className="text-gray-400">/</span>
        <span className="text-gray-300">
          {fileName}
          {dirty && (
            <span className="inline-block ml-1 w-2 h-2 rounded-full bg-orange-400 align-middle" />
          )}
        </span>
      </div>

      {/* Spacer to balance the left side */}
      <div className="w-[60px]" />
    </div>
  );
}
