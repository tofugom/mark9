import React, { useRef } from "react";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { Editor, rootCtx, defaultValueCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { gfm } from "@milkdown/kit/preset/gfm";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { nord } from "@milkdown/theme-nord";
import { mermaidPlugin } from "../plugins/mermaid-plugin.js";
import { imageDropPlugin } from "../plugins/image-drop-plugin.js";

import type { Ctx } from "@milkdown/kit/ctx";

export interface Mark9EditorProps {
  /** Initial markdown content (only used on mount). */
  defaultValue?: string;
  /** Called whenever the markdown content changes. */
  onChange?: (markdown: string) => void;
  /** Additional CSS class name for the editor wrapper. */
  className?: string;
}

function MilkdownEditor({
  defaultValue,
  onChange,
}: Omit<Mark9EditorProps, "className">): React.ReactElement {
  // Use refs so the editor doesn't reinitialize on prop changes
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const defaultValueRef = useRef(defaultValue);

  useEditor(
    (root: HTMLElement) => {
      return Editor.make()
        .config(nord)
        .config((ctx: Ctx) => {
          ctx.set(rootCtx, root);
          if (defaultValueRef.current) {
            ctx.set(defaultValueCtx, defaultValueRef.current);
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
        .use(imageDropPlugin);
    },
    [],
  );

  return <Milkdown />;
}

export function Mark9Editor({
  defaultValue,
  onChange,
  className,
}: Mark9EditorProps): React.ReactElement {
  return (
    <MilkdownProvider>
      <div className={className}>
        <MilkdownEditor defaultValue={defaultValue} onChange={onChange} />
      </div>
    </MilkdownProvider>
  );
}
