import React from "react";
import { GitBranch, Sun, Moon, Coffee, Check } from "lucide-react";
import { useEditorStore } from "../stores/editor-store.js";
import { useFileStore } from "../stores/file-store.js";
import { useThemeStore } from "../stores/theme-store.js";

export interface StatusBarProps {
  /** Optional collab connection status element. */
  collabStatus?: React.ReactNode;
  /** Current git branch name (defaults to "main"). */
  branch?: string;
}

export function StatusBar({ collabStatus, branch }: StatusBarProps = {}): React.ReactElement {
  const cursorLine = useEditorStore((s) => s.cursorLine);
  const cursorCol = useEditorStore((s) => s.cursorCol);
  const mode = useEditorStore((s) => s.mode);
  const saveMessage = useFileStore((s) => s.saveMessage);
  const theme = useThemeStore((s) => s.theme);
  const cycleTheme = useThemeStore((s) => s.cycleTheme);

  const themeIcon =
    theme === "light" ? (
      <Sun size={12} />
    ) : theme === "dark" ? (
      <Moon size={12} />
    ) : (
      <Coffee size={12} />
    );

  const themeLabel =
    theme === "light" ? "Light" : theme === "dark" ? "Dark" : "Sepia";

  return (
    <div className="bg-[var(--bg-statusbar)] text-[var(--text-status)] h-[22px] text-[12px] flex items-center justify-between px-2.5 select-none shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <GitBranch size={12} />
          <span>{branch || "main"}</span>
        </div>
        {saveMessage && (
          <div className="flex items-center gap-1 animate-fade-in">
            <Check size={12} />
            <span>{saveMessage}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span>
          Ln {cursorLine}, Col {cursorCol}
        </span>
        <span>UTF-8</span>
        <span className="uppercase">{mode}</span>
        <button
          type="button"
          onClick={cycleTheme}
          className="flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer"
          title={`Theme: ${themeLabel} (click to cycle)`}
        >
          {themeIcon}
          <span>{themeLabel}</span>
        </button>
        <span>GFM</span>
        {collabStatus}
      </div>
    </div>
  );
}
