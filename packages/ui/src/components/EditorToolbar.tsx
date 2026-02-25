import React from "react";
import { Code, Eye, Save } from "lucide-react";
import { useEditorStore } from "../stores/editor-store.js";
import { useFileStore } from "../stores/file-store.js";

export interface EditorToolbarProps {
  onSave?: () => void;
}

export function EditorToolbar({
  onSave,
}: EditorToolbarProps): React.ReactElement {
  const mode = useEditorStore((s) => s.mode);
  const toggleMode = useEditorStore((s) => s.toggleMode);
  const dirty = useFileStore((s) => s.dirty);

  return (
    <div className="h-[36px] bg-[#f3f3f3] border-b border-[#e0e0e0] flex items-center px-2 gap-1 shrink-0">
      {/* Mode toggle */}
      <button
        type="button"
        onClick={toggleMode}
        className={`flex items-center gap-1.5 px-2.5 h-[26px] rounded text-[12px] font-medium transition-colors ${
          mode === "wysiwyg"
            ? "bg-white text-gray-800 shadow-sm border border-gray-200"
            : "text-gray-500 hover:bg-gray-200"
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
            ? "bg-white text-gray-800 shadow-sm border border-gray-200"
            : "text-gray-500 hover:bg-gray-200"
        }`}
        title="Source code mode (Ctrl+/)"
      >
        <Code size={14} />
        Source
      </button>

      <div className="flex-1" />

      {/* Save button */}
      {onSave && (
        <button
          type="button"
          onClick={onSave}
          className={`flex items-center gap-1.5 px-2.5 h-[26px] rounded text-[12px] font-medium transition-colors ${
            dirty
              ? "bg-[#007acc] text-white hover:bg-[#006bb3]"
              : "text-gray-400 bg-gray-100 cursor-default"
          }`}
          title="Save (Ctrl+S)"
        >
          <Save size={14} />
          Save
        </button>
      )}
    </div>
  );
}
