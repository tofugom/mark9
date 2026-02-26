import React, { useRef } from "react";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { Editor, rootCtx, defaultValueCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { gfm } from "@milkdown/kit/preset/gfm";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { nord } from "@milkdown/theme-nord";
import { mermaidPlugin } from "../plugins/mermaid-plugin.js";
import { imageDropPlugin } from "../plugins/image-drop-plugin.js";
import {
  ySyncMilkdownPlugin,
  yCursorMilkdownPlugin,
  yUndoMilkdownPlugin,
} from "@mark9/collab";

import type { Ctx } from "@milkdown/kit/ctx";
import type { CollabConfig } from "@mark9/collab";

export interface Mark9EditorProps {
  /** Initial markdown content (only used on mount, ignored in collab mode). */
  defaultValue?: string;
  /** Called whenever the markdown content changes. */
  onChange?: (markdown: string) => void;
  /** Additional CSS class name for the editor wrapper. */
  className?: string;
  /** When provided, enables collaborative editing via Yjs. */
  collabConfig?: CollabConfig | null;
}

function MilkdownEditor({
  defaultValue,
  onChange,
  collabConfig,
}: Omit<Mark9EditorProps, "className">): React.ReactElement {
  // Use refs so the editor doesn't reinitialize on prop changes
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const defaultValueRef = useRef(defaultValue);

  useEditor(
    (root: HTMLElement) => {
      const editor = Editor.make()
        .config(nord)
        .config((ctx: Ctx) => {
          ctx.set(rootCtx, root);
          if (collabConfig) {
            // Collab mode: set defaultValue only when fragment is empty (host
            // initializing). ySyncPlugin will sync the ProseMirror content into
            // the fragment. For joiners, the fragment arrives via Yjs sync and
            // ySyncPlugin populates the editor from it — defaultValue is skipped.
            if (
              collabConfig.xmlFragment.length === 0 &&
              defaultValueRef.current
            ) {
              ctx.set(defaultValueCtx, defaultValueRef.current);
            }
          } else if (defaultValueRef.current) {
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

      // Add Yjs collab plugins synchronously when collab is active
      if (collabConfig) {
        editor
          .use(ySyncMilkdownPlugin(collabConfig.xmlFragment))
          .use(yCursorMilkdownPlugin(collabConfig.awareness))
          .use(yUndoMilkdownPlugin());
      }

      return editor;
    },
    [], // Editor is recreated via key-based remount, not via deps
  );

  return <Milkdown />;
}

export function Mark9Editor({
  defaultValue,
  onChange,
  className,
  collabConfig,
}: Mark9EditorProps): React.ReactElement {
  // Key includes collab state so the entire editor remounts when collab starts/stops
  const collabKey = collabConfig ? "collab" : "solo";

  return (
    <MilkdownProvider key={collabKey}>
      <div className={className}>
        <MilkdownEditor
          defaultValue={defaultValue}
          onChange={onChange}
          collabConfig={collabConfig}
        />
      </div>
    </MilkdownProvider>
  );
}
