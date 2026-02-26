import React from "react";
import { Code, Eye, Save, Check } from "lucide-react";
import { useEditorStore } from "../stores/editor-store.js";
import { useFileStore } from "../stores/file-store.js";

export interface EditorToolbarProps {
  onSave?: () => void;
  /** Optional user avatars element for collab mode. */
  collabAvatars?: React.ReactNode;
}

export function EditorToolbar({
  onSave,
  collabAvatars,
}: EditorToolbarProps): React.ReactElement {
  const mode = useEditorStore((s) => s.mode);
  const toggleMode = useEditorStore((s) => s.toggleMode);
  const dirty = useFileStore((s) => s.dirty);
  const saveMessage = useFileStore((s) => s.saveMessage);

  return (
    <div className="h-[36px] bg-[var(--bg-toolbar)] border-b border-[var(--border-primary)] flex items-center px-2 gap-1 shrink-0">
      {/* Mode toggle */}
      <button
        type="button"
        onClick={toggleMode}
        className={`flex items-center gap-1.5 px-2.5 h-[26px] rounded text-[12px] font-medium transition-colors ${
          mode === "wysiwyg"
            ? "bg-[var(--toolbar-btn-active-bg)] text-[var(--toolbar-btn-active-text)] shadow-sm border border-[var(--toolbar-btn-active-border)]"
            : "text-[var(--toolbar-btn-inactive-text)] hover:bg-[var(--toolbar-btn-hover-bg)]"
        }`}
        title="WYSIWYG mode"
      >
        <Eye size={14} />
        Preview
      </button>
      <button
        type="button"
        onClick={toggleMode}
        className={`flex items-center gap-1.5 px-2.5 h-[26px] rounded text-[12px] font-medium transition-colors ${
          mode === "source"
            ? "bg-[var(--toolbar-btn-active-bg)] text-[var(--toolbar-btn-active-text)] shadow-sm border border-[var(--toolbar-btn-active-border)]"
            : "text-[var(--toolbar-btn-inactive-text)] hover:bg-[var(--toolbar-btn-hover-bg)]"
        }`}
        title="Source code mode (Ctrl+/)"
      >
        <Code size={14} />
        Source
      </button>

      <div className="flex-1" />

      {/* Collab avatars */}
      {collabAvatars}

      {/* Save button */}
      {onSave && (
        <button
          type="button"
          onClick={onSave}
          className={`flex items-center gap-1.5 px-2.5 h-[26px] rounded text-[12px] font-medium transition-all duration-100 ${
            dirty
              ? "bg-[var(--accent)] text-white hover:opacity-90 active:scale-90 active:opacity-75 cursor-pointer"
              : "text-[var(--toolbar-btn-inactive-text)] bg-[var(--toolbar-btn-hover-bg)] cursor-default"
          }`}
          title="Save (Ctrl+S)"
        >
          <Save size={14} />
          Save
        </button>
      )}
      {saveMessage && (
        <div className="flex items-center gap-1 text-[12px] text-green-600 font-medium transition-opacity">
          <Check size={14} />
          <span>{saveMessage}</span>
        </div>
      )}
    </div>
  );
}
