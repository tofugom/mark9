import React, { useRef, useEffect, useCallback } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from "@codemirror/view";
import { markdown } from "@codemirror/lang-markdown";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching } from "@codemirror/language";

export interface SourceEditorProps {
  /** Current markdown content. */
  value: string;
  /** Called on content change. */
  onChange: (value: string) => void;
  /** Additional CSS class name. */
  className?: string;
}

/**
 * A CodeMirror 6 based markdown source editor with syntax highlighting.
 */
export function SourceEditor({
  value,
  onChange,
  className,
}: SourceEditorProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);

  // Keep the callback ref up to date without re-creating the editor.
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Stable dispatch callback for CodeMirror update listener.
  const handleUpdate = useCallback((update: { docChanged: boolean; state: EditorState }) => {
    if (update.docChanged) {
      const doc = update.state.doc.toString();
      onChangeRef.current(doc);
    }
  }, []);

  // Create the CodeMirror EditorView on mount; destroy on unmount.
  useEffect(() => {
    if (!containerRef.current) return;

    const lightTheme = EditorView.theme({
      "&": {
        backgroundColor: "#ffffff",
        color: "#1f2937",
      },
      ".cm-content": {
        caretColor: "#1f2937",
      },
      ".cm-cursor": {
        borderLeftColor: "#1f2937",
      },
      ".cm-activeLine": {
        backgroundColor: "#f3f4f6",
      },
      ".cm-activeLineGutter": {
        backgroundColor: "#f3f4f6",
      },
      ".cm-gutters": {
        backgroundColor: "#f9fafb",
        color: "#9ca3af",
        borderRight: "1px solid #e5e7eb",
      },
      ".cm-selectionBackground": {
        backgroundColor: "#dbeafe !important",
      },
      "&.cm-focused .cm-selectionBackground": {
        backgroundColor: "#bfdbfe !important",
      },
    });

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        bracketMatching(),
        markdown(),
        syntaxHighlighting(defaultHighlightStyle),
        lightTheme,
        keymap.of([...defaultKeymap, ...historyKeymap]),
        EditorView.updateListener.of(handleUpdate),
        EditorView.lineWrapping,
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Only run on mount/unmount. value is handled by the sync effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleUpdate]);

  // Sync external value changes into the editor (e.g. when switching modes).
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const currentDoc = view.state.doc.toString();
    if (currentDoc !== value) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentDoc.length,
          insert: value,
        },
      });
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ overflow: "auto" }}
    />
  );
}
