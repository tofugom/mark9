import React, { useState, useRef, useEffect } from "react";
import { Menu, FileUp, FolderOpen, Save, SaveAll } from "lucide-react";
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
      className="absolute top-full left-0 mt-1 w-56 bg-[#252526] border border-[#454545] rounded shadow-xl z-50 py-1"
    >
      {items.map((item, i) => {
        if ("type" in item && item.type === "separator") {
          return (
            <div key={`sep-${i}`} className="my-1 border-t border-[#454545]" />
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
            className="w-full flex items-center gap-3 px-3 py-1.5 text-[13px] text-[#cccccc] hover:bg-[#094771] transition-colors"
            onClick={() => {
              menuItem.action();
              onClose();
            }}
          >
            {menuItem.icon}
            <span className="flex-1 text-left">{menuItem.label}</span>
            {menuItem.shortcut && (
              <span className="text-[11px] text-[#858585]">
                {menuItem.shortcut}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function TitleBar(): React.ReactElement {
  const activeFile = useFileStore((s) => s.activeFile);
  const dirty = useFileStore((s) => s.dirty);
  const [menuOpen, setMenuOpen] = useState(false);

  const fileName = activeFile
    ? activeFile.split("/").pop() ?? "Untitled"
    : "Untitled";

  return (
    <div className="bg-[#3c3c3c] text-[#cccccc] h-[30px] flex items-center select-none shrink-0 border-b border-[#252526]">
      {/* Left: menu + sidebar toggle */}
      <div className="relative flex items-center">
        <button
          type="button"
          className="h-[30px] w-[46px] flex items-center justify-center hover:bg-[#505050] transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="File menu"
        >
          <Menu size={16} />
        </button>
        <FileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>

      {/* Center: app name + file name */}
      <div className="flex-1 flex items-center justify-center gap-1.5 text-[13px]">
        <span className="text-[#cccccc]">
          {fileName}
          {dirty && <span className="ml-1 text-white">&bull;</span>}
        </span>
        <span className="text-[#858585]">—</span>
        <span className="text-[#858585]">Mark9</span>
      </div>

      {/* Right: window controls placeholder */}
      <div className="w-[46px]" />
    </div>
  );
}
