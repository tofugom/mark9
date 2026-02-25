import React from "react";
import { GitBranch } from "lucide-react";
import { useEditorStore } from "../stores/editor-store.js";

export function StatusBar(): React.ReactElement {
  const cursorLine = useEditorStore((s) => s.cursorLine);
  const cursorCol = useEditorStore((s) => s.cursorCol);
  const mode = useEditorStore((s) => s.mode);

  return (
    <div className="bg-blue-600 text-white h-6 text-xs flex items-center justify-between px-4 select-none shrink-0">
      <div className="flex items-center gap-2">
        <GitBranch size={12} />
        <span>main</span>
      </div>

      <div className="flex items-center gap-3">
        <span>
          Ln {cursorLine}, Col {cursorCol}
        </span>
        <span className="text-blue-200">|</span>
        <span>UTF-8</span>
        <span className="text-blue-200">|</span>
        <span className="bg-blue-500 px-1.5 py-0.5 rounded text-[10px] uppercase font-medium">
          {mode}
        </span>
        <span className="text-blue-200">|</span>
        <span>GFM</span>
      </div>
    </div>
  );
}
