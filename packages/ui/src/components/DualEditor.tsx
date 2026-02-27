import React, { useCallback, useRef } from "react";
import { Mark9Editor } from "./Mark9Editor.js";
import { SourceEditor } from "./SourceEditor.js";
import { useEditorStore } from "../stores/editor-store.js";
import type { CollabConfig } from "@mark9/collab";

export interface DualEditorProps {
  /** Initial markdown content. */
  defaultValue?: string;
  /** Called whenever the markdown content changes. */
  onChange?: (markdown: string) => void;
  /** Additional CSS class name for the editor wrapper. */
  className?: string;
  /** When provided, enables collaborative editing (WYSIWYG mode only). */
  collabConfig?: CollabConfig | null;
}

/**
 * DualEditor switches between WYSIWYG (Milkdown) and Source (CodeMirror) mode.
 * Content is tracked via a ref so the correct value is passed when switching modes.
 *
 * In collab mode, only WYSIWYG is collaborative. Source mode uses a local snapshot.
 */
export function DualEditor({
  defaultValue = "",
  onChange,
  className,
  collabConfig,
}: DualEditorProps): React.ReactElement {
  const mode = useEditorStore((s) => s.mode);

  // Track latest markdown via ref (no re-render on edit)
  const markdownRef = useRef(defaultValue);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const handleChange = useCallback((newMarkdown: string) => {
    markdownRef.current = newMarkdown;
    onChangeRef.current?.(newMarkdown);
  }, []);

  // Key includes collab state so editor remounts when collab starts/stops
  const collabKey = collabConfig ? "collab" : "solo";

  return (
    <div className={className}>
      {mode === "wysiwyg" ? (
        <Mark9Editor
          key={`wysiwyg-${mode}-${collabKey}`}
          defaultValue={markdownRef.current}
          onChange={handleChange}
          className="h-full"
          collabConfig={collabConfig}
        />
      ) : (
        <SourceEditor
          key={`source-${mode}`}
          value={markdownRef.current}
          onChange={handleChange}
          className="h-full"
          readOnly={!!collabConfig}
        />
      )}
    </div>
  );
}
