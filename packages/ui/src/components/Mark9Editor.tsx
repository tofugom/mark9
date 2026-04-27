import React, { useRef } from "react";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import {
  Editor,
  rootCtx,
  defaultValueCtx,
  editorViewOptionsCtx,
} from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { gfm } from "@milkdown/kit/preset/gfm";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { nord } from "@milkdown/theme-nord";
import { mermaidPlugin } from "../plugins/mermaid-plugin.js";
import { imageDropPlugin } from "../plugins/image-drop-plugin.js";
import { mathPlugin } from "../plugins/math-plugin.js";
import { useSettingsStore } from "../stores/settings-store.js";

import type { Ctx } from "@milkdown/kit/ctx";

export interface Mark9EditorProps {
  /** Initial markdown content. */
  defaultValue?: string;
  /** Called whenever the markdown content changes. */
  onChange?: (markdown: string) => void;
  /** Additional CSS class name for the editor wrapper. */
  className?: string;
  /** When true, the editor renders read-only (preview / viewer mode). */
  readOnly?: boolean;
}

function MilkdownEditor({
  defaultValue,
  onChange,
  readOnly,
}: Omit<Mark9EditorProps, "className">): React.ReactElement {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const defaultValueRef = useRef(defaultValue);
  const readOnlyRef = useRef(readOnly);

  useEditor(
    (root: HTMLElement) =>
      Editor.make()
        .config(nord)
        .config((ctx: Ctx) => {
          ctx.set(rootCtx, root);
          if (defaultValueRef.current) {
            ctx.set(defaultValueCtx, defaultValueRef.current);
          }
          if (readOnlyRef.current) {
            ctx.update(editorViewOptionsCtx, (prev) => ({
              ...prev,
              editable: () => false,
            }));
          }
          ctx
            .get(listenerCtx)
            .markdownUpdated(
              (_ctx: Ctx, markdown: string, prevMarkdown: string) => {
                if (markdown !== prevMarkdown) {
                  onChangeRef.current?.(markdown);
                }
              },
            );
        })
        .use(commonmark)
        .use(gfm)
        .use(listener)
        .use(mermaidPlugin)
        .use(imageDropPlugin)
        .use(mathPlugin),
    [],
  );

  return <Milkdown />;
}

export function Mark9Editor({
  defaultValue,
  onChange,
  className,
  readOnly,
}: Mark9EditorProps): React.ReactElement {
  const fontSize = useSettingsStore((s) => s.fontSize);

  return (
    <MilkdownProvider>
      <div className={className} style={{ fontSize: `${fontSize}px` }}>
        <MilkdownEditor
          defaultValue={defaultValue}
          onChange={onChange}
          readOnly={readOnly}
        />
      </div>
    </MilkdownProvider>
  );
}
