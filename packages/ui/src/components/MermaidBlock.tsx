import React, { useCallback, useEffect, useRef, useState } from "react";
import { mermaid, MERMAID_MAX_SIZE } from "../utils/mermaid-init.js";
import DOMPurify from "dompurify";

// Unique counter for generating mermaid element IDs
let mermaidIdCounter = 0;

export interface MermaidBlockProps {
  /** The mermaid diagram source code. */
  code: string;
  /** Called when the user edits the mermaid code. */
  onCodeChange?: (newCode: string) => void;
}

/**
 * Renders a Mermaid diagram from code.
 * - Shows the rendered SVG when not focused.
 * - Shows an editable code textarea when double-clicked.
 * - Keeps the last valid SVG visible during errors; shows error message inline.
 */
export function MermaidBlock({
  code,
  onCodeChange,
}: MermaidBlockProps): React.ReactElement {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(code);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const idRef = useRef<string>(`mermaid-${++mermaidIdCounter}`);

  // Render the mermaid diagram whenever the code changes
  useEffect(() => {
    let cancelled = false;

    async function render() {
      const trimmed = code.trim();
      if (!trimmed) {
        setSvg("");
        setError(null);
        return;
      }

      if (trimmed.length > MERMAID_MAX_SIZE) {
        if (!cancelled) {
          setError(`Diagram too large (${trimmed.length} chars, max ${MERMAID_MAX_SIZE})`);
        }
        return;
      }

      try {
        // Validate first — mermaid.parse throws on invalid syntax
        await mermaid.parse(trimmed);
        const { svg: renderedSvg } = await mermaid.render(
          idRef.current,
          trimmed,
        );
        if (!cancelled) {
          const cleanSvg = DOMPurify.sanitize(renderedSvg, {
            USE_PROFILES: { svg: true, svgFilters: true },
            ADD_TAGS: ["foreignObject"],
          });
          setSvg(cleanSvg);
          setError(null);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Invalid mermaid syntax";
          setError(message);
          // Keep the last valid SVG — do NOT clear svg here
        }
      }
    }

    void render();

    return () => {
      cancelled = true;
    };
  }, [code]);

  // Sync editValue when code prop changes while not editing
  useEffect(() => {
    if (!editing) {
      setEditValue(code);
    }
  }, [code, editing]);

  // Focus textarea when entering edit mode
  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editing]);

  const handleDoubleClick = useCallback(() => {
    setEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setEditing(false);
    if (editValue !== code) {
      onCodeChange?.(editValue);
    }
  }, [editValue, code, onCodeChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Escape exits editing
      if (e.key === "Escape") {
        e.preventDefault();
        setEditing(false);
        if (editValue !== code) {
          onCodeChange?.(editValue);
        }
      }
    },
    [editValue, code, onCodeChange],
  );

  if (editing) {
    return (
      <div className="mermaid-container mermaid-editing">
        <textarea
          ref={textareaRef}
          className="mermaid-textarea"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          spellCheck={false}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-container"
      onDoubleClick={handleDoubleClick}
      title="Double-click to edit"
    >
      {svg ? (
        <div
          className="mermaid-svg"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : !error ? (
        <div className="mermaid-placeholder">Loading diagram...</div>
      ) : null}
      {error && <div className="mermaid-error">{error}</div>}
    </div>
  );
}
