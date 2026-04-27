/**
 * ProseMirror plugin that surfaces Markdown delimiter syntax (e.g. `**`, `*`,
 * `` ` ``, `~~`) as inline hint widgets at the boundaries of a styled range
 * **only when the cursor is inside that range**.
 *
 * The intent is the Obsidian / Typora "live preview" UX: the rendered content
 * stays rendered, but as soon as your caret enters a bold span the
 * surrounding `**…**` markers fade in so you can see exactly which part is
 * styled and adjust the boundary by deleting/inserting characters.
 *
 * Decorations are pure overlays — they don't affect the underlying document
 * model, so Milkdown's existing input rules (`**foo**` → bold, etc.) keep
 * working as before.
 */
import { $prose } from "@milkdown/kit/utils";
import { Plugin, PluginKey } from "@milkdown/kit/prose/state";
import { Decoration, DecorationSet } from "@milkdown/kit/prose/view";

import type { EditorState } from "@milkdown/kit/prose/state";
import type { MarkType, Node as PMNode } from "@milkdown/kit/prose/model";

const KEY = new PluginKey("mark9-syntax-hint");

/** Mark name (Milkdown / GFM schema) → [open delim, close delim]. */
const MARK_DELIMITERS: Record<string, [string, string]> = {
  strong: ["**", "**"],
  em: ["*", "*"],
  code: ["`", "`"],
  // GFM strikethrough — Milkdown registers it as `strike_through`.
  strike_through: ["~~", "~~"],
};

/**
 * Find the contiguous run of children of `pos`'s parent textblock that all
 * carry `markType` and that contains `pos`. Returns absolute document
 * coordinates, or null if `pos` isn't inside such a run.
 */
function findMarkRange(
  doc: PMNode,
  pos: number,
  markType: MarkType,
): { from: number; to: number } | null {
  const $pos = doc.resolve(pos);
  if (!$pos.parent.isTextblock) return null;

  const blockStart = $pos.start();
  const parent = $pos.parent;

  let runStart = -1;
  let runEnd = -1;
  let pointer = blockStart;

  for (let i = 0; i < parent.childCount; i++) {
    const child = parent.child(i);
    const childStart = pointer;
    const childEnd = pointer + child.nodeSize;
    const has = child.isText && !!markType.isInSet(child.marks);

    if (has) {
      if (runStart === -1) runStart = childStart;
      runEnd = childEnd;
    } else if (runStart !== -1) {
      if (pos >= runStart && pos <= runEnd) {
        return { from: runStart, to: runEnd };
      }
      runStart = -1;
      runEnd = -1;
    }
    pointer = childEnd;
  }

  if (runStart !== -1 && pos >= runStart && pos <= runEnd) {
    return { from: runStart, to: runEnd };
  }
  return null;
}

function makeWidget(text: string): HTMLElement {
  const span = document.createElement("span");
  span.className = "mark9-syntax-hint";
  span.textContent = text;
  span.contentEditable = "false";
  return span;
}

function buildDecorations(state: EditorState): DecorationSet {
  const { selection, doc, schema } = state;
  if (!selection.empty) return DecorationSet.empty;

  const cursor = selection.from;
  const decos: Decoration[] = [];

  for (const [markName, [open, close]] of Object.entries(MARK_DELIMITERS)) {
    const markType = schema.marks[markName];
    if (!markType) continue;

    const range = findMarkRange(doc, cursor, markType);
    if (!range) continue;

    decos.push(
      Decoration.widget(range.from, () => makeWidget(open), { side: -1 }),
      Decoration.widget(range.to, () => makeWidget(close), { side: 1 }),
    );
  }

  return DecorationSet.create(doc, decos);
}

export const syntaxHintPlugin = $prose(() =>
  new Plugin({
    key: KEY,
    state: {
      init: (_config, state) => buildDecorations(state),
      apply: (_tr, _value, _oldState, newState) => buildDecorations(newState),
    },
    props: {
      decorations(state) {
        return KEY.getState(state) as DecorationSet | undefined;
      },
    },
  }),
);
