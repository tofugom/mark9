import React from "react";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { Editor, rootCtx, defaultValueCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { gfm } from "@milkdown/kit/preset/gfm";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { nord } from "@milkdown/theme-nord";

import type { Ctx } from "@milkdown/kit/ctx";

export interface Mark9EditorProps {
  /** Initial markdown content. */
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
  useEditor(
    (root: HTMLElement) => {
      return Editor.make()
        .config(nord)
        .config((ctx: Ctx) => {
          ctx.set(rootCtx, root);
          if (defaultValue) {
            ctx.set(defaultValueCtx, defaultValue);
          }
          if (onChange) {
            ctx
              .get(listenerCtx)
              .markdownUpdated(
                (_ctx: Ctx, markdown: string, prevMarkdown: string) => {
                  if (markdown !== prevMarkdown) {
                    onChange(markdown);
                  }
                },
              );
          }
        })
        .use(commonmark)
        .use(gfm)
        .use(listener);
    },
    [defaultValue, onChange],
  );

  return <Milkdown />;
}

/**
 * Mark9Editor - A WYSIWYG Markdown editor component backed by Milkdown.
 *
 * Provides commonmark editing with the Nord theme and optional change callbacks.
 */
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
