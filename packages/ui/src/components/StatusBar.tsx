import React from "react";
import { GitBranch } from "lucide-react";
import { useEditorStore } from "../stores/editor-store.js";

export function StatusBar(): React.ReactElement {
  const cursorLine = useEditorStore((s) => s.cursorLine);
  const cursorCol = useEditorStore((s) => s.cursorCol);
  const mode = useEditorStore((s) => s.mode);

  return (
    <div className="bg-[#007acc] text-white h-[22px] text-[12px] flex items-center justify-between px-2.5 select-none shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <GitBranch size={12} />
          <span>main</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span>
          Ln {cursorLine}, Col {cursorCol}
        </span>
        <span>UTF-8</span>
        <span className="uppercase">{mode}</span>
        <span>GFM</span>
      </div>
    </div>
  );
}
