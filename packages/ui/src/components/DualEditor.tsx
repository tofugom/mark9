import React, { useState, useCallback, useRef, useEffect } from "react";
import { Mark9Editor } from "./Mark9Editor.js";
import { SourceEditor } from "./SourceEditor.js";
import { useEditorStore } from "../stores/editor-store.js";

export interface DualEditorProps {
  /** Initial markdown content. */
  defaultValue?: string;
  /** Called whenever the markdown content changes. */
  onChange?: (markdown: string) => void;
  /** Additional CSS class name for the editor wrapper. */
  className?: string;
}

/**
 * DualEditor switches between WYSIWYG (Milkdown) and Source (CodeMirror) mode.
 *
 * It maintains internal markdown state so content is preserved when toggling modes.
 */
export function DualEditor({
  defaultValue = "",
  onChange,
  className,
}: DualEditorProps): React.ReactElement {
  const mode = useEditorStore((s) => s.mode);

  // Internal markdown state shared between both editors.
  const [markdown, setMarkdown] = useState(defaultValue);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const handleChange = useCallback((newMarkdown: string) => {
    setMarkdown(newMarkdown);
    onChangeRef.current?.(newMarkdown);
  }, []);

  // Use a key that changes with mode so the WYSIWYG editor re-mounts with fresh content
  // when switching back from source mode.
  return (
    <div className={className}>
      {mode === "wysiwyg" ? (
        <Mark9Editor
          key={`wysiwyg-${mode}`}
          defaultValue={markdown}
          onChange={handleChange}
          className="h-full"
        />
      ) : (
        <SourceEditor
          key={`source-${mode}`}
          value={markdown}
          onChange={handleChange}
          className="h-full"
        />
      )}
    </div>
  );
}
