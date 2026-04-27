import React, { useRef, useEffect, useCallback } from "react";
import { EditorState, Compartment } from "@codemirror/state";
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
} from "@codemirror/view";
import { markdown } from "@codemirror/lang-markdown";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
  bracketMatching,
} from "@codemirror/language";
import { useSettingsStore } from "../stores/settings-store.js";

export interface SourceEditorProps {
  /** Current markdown content. */
  value: string;
  /** Called on content change. */
  onChange: (value: string) => void;
  /** Additional CSS class name. */
  className?: string;
  /** When true, the editor is read-only. */
  readOnly?: boolean;
}

/**
 * A CodeMirror 6 based markdown source editor with syntax highlighting.
 *
 * Reacts live to changes in `useSettingsStore`: fontSize, tabSize, wordWrap,
 * and showLineNumbers all reconfigure the existing EditorView through
 * Compartments rather than tearing it down.
 */
export function SourceEditor({
  value,
  onChange,
  className,
  readOnly = false,
}: SourceEditorProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);

  const wrapCompartment = useRef(new Compartment());
  const lineNumbersCompartment = useRef(new Compartment());
  const tabSizeCompartment = useRef(new Compartment());
  const themeCompartment = useRef(new Compartment());

  const fontSize = useSettingsStore((s) => s.fontSize);
  const tabSize = useSettingsStore((s) => s.tabSize);
  const wordWrap = useSettingsStore((s) => s.wordWrap);
  const showLineNumbers = useSettingsStore((s) => s.showLineNumbers);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const handleUpdate = useCallback(
    (update: { docChanged: boolean; state: EditorState }) => {
      if (update.docChanged) {
        onChangeRef.current(update.state.doc.toString());
      }
    },
    [],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbersCompartment.current.of(showLineNumbers ? lineNumbers() : []),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        bracketMatching(),
        markdown(),
        syntaxHighlighting(defaultHighlightStyle),
        themeCompartment.current.of(buildTheme(fontSize)),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        EditorView.updateListener.of(handleUpdate),
        wrapCompartment.current.of(wordWrap ? EditorView.lineWrapping : []),
        tabSizeCompartment.current.of(EditorState.tabSize.of(tabSize)),
        EditorState.readOnly.of(readOnly),
      ],
    });

    const view = new EditorView({ state, parent: containerRef.current });
    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Settings are reconfigured via the effects below; readOnly is fixed at mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleUpdate]);

  // Sync external value changes (e.g. when switching modes).
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const currentDoc = view.state.doc.toString();
    if (currentDoc !== value) {
      view.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: value },
      });
    }
  }, [value]);

  // Reconfigure compartments when individual settings change.
  useEffect(() => {
    viewRef.current?.dispatch({
      effects: wrapCompartment.current.reconfigure(
        wordWrap ? EditorView.lineWrapping : [],
      ),
    });
  }, [wordWrap]);

  useEffect(() => {
    viewRef.current?.dispatch({
      effects: lineNumbersCompartment.current.reconfigure(
        showLineNumbers ? lineNumbers() : [],
      ),
    });
  }, [showLineNumbers]);

  useEffect(() => {
    viewRef.current?.dispatch({
      effects: tabSizeCompartment.current.reconfigure(
        EditorState.tabSize.of(tabSize),
      ),
    });
  }, [tabSize]);

  useEffect(() => {
    viewRef.current?.dispatch({
      effects: themeCompartment.current.reconfigure(buildTheme(fontSize)),
    });
  }, [fontSize]);

  return (
    <div ref={containerRef} className={className} style={{ overflow: "auto" }} />
  );
}

function buildTheme(fontSize: number) {
  return EditorView.theme({
    "&": {
      backgroundColor: "#ffffff",
      color: "#1f2937",
      fontSize: `${fontSize}px`,
    },
    ".cm-content": { caretColor: "#1f2937" },
    ".cm-cursor": { borderLeftColor: "#1f2937" },
    ".cm-activeLine": { backgroundColor: "#f3f4f6" },
    ".cm-activeLineGutter": { backgroundColor: "#f3f4f6" },
    ".cm-gutters": {
      backgroundColor: "#f9fafb",
      color: "#9ca3af",
      borderRight: "1px solid #e5e7eb",
    },
    ".cm-selectionBackground": { backgroundColor: "#dbeafe !important" },
    "&.cm-focused .cm-selectionBackground": {
      backgroundColor: "#bfdbfe !important",
    },
  });
}
