/**
 * Keep focus inside the editor when the user presses Tab / Shift-Tab.
 *
 * - Inside a list item: indent (Tab) or outdent (Shift-Tab) via the standard
 *   prosemirror-schema-list commands.
 * - Anywhere else: consume the key so the browser can't shift focus to the
 *   sidebar / comments panel mid-edit.
 *
 * We delegate to `sinkListItem` / `liftListItem` directly rather than relying
 * on commonmark's keymap, because in Milkdown's plugin chain the order makes
 * commonmark's Tab binding race against ours and lose. Calling the commands
 * here means list indent works deterministically regardless of plugin order.
 */
import { $prose } from "@milkdown/kit/utils";
import { keymap } from "@milkdown/kit/prose/keymap";
import { sinkListItem, liftListItem } from "@milkdown/kit/prose/schema-list";

export const tabTrapPlugin = $prose(() =>
  keymap({
    Tab: (state, dispatch) => {
      const listItem = state.schema.nodes.list_item;
      if (listItem && sinkListItem(listItem)(state, dispatch)) {
        return true;
      }
      // Not in a list — still consume so focus stays in the editor.
      return true;
    },
    "Shift-Tab": (state, dispatch) => {
      const listItem = state.schema.nodes.list_item;
      if (listItem && liftListItem(listItem)(state, dispatch)) {
        return true;
      }
      return true;
    },
  }),
);
