import { Editor, defaultValueCtx, rootCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { gfm } from "@milkdown/kit/preset/gfm";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { nord } from "@milkdown/theme-nord";

import type { Ctx } from "@milkdown/kit/ctx";

/**
 * Options for configuring the Milkdown editor instance.
 */
export interface EditorSetupOptions {
  /** The root DOM element to mount the editor into. */
  root: HTMLElement;
  /** The initial markdown content for the editor. */
  defaultValue?: string;
  /** Called whenever the markdown content changes. */
  onChange?: (markdown: string) => void;
}

/**
 * Creates and configures a Milkdown editor instance with commonmark and GFM
 * support, the nord theme, and a change listener.
 *
 * @returns A promise that resolves to the created Editor instance.
 */
export function createEditor(options: EditorSetupOptions): Promise<Editor> {
  const { root, defaultValue = "", onChange } = options;

  return Editor.make()
    .config(nord)
    .config((ctx: Ctx) => {
      ctx.set(rootCtx, root);
      ctx.set(defaultValueCtx, defaultValue);

      if (onChange) {
        ctx
          .get(listenerCtx)
          .markdownUpdated((_ctx: Ctx, markdown: string, prevMarkdown: string) => {
            if (markdown !== prevMarkdown) {
              onChange(markdown);
            }
          });
      }
    })
    .use(commonmark)
    .use(gfm)
    .use(listener)
    .create();
}

export { Editor, defaultValueCtx, rootCtx } from "@milkdown/kit/core";
export { commonmark } from "@milkdown/kit/preset/commonmark";
export { gfm } from "@milkdown/kit/preset/gfm";
export { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
export { nord } from "@milkdown/theme-nord";
