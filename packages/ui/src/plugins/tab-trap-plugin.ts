/**
 * Keep focus inside the editor when the user presses Tab / Shift-Tab.
 *
 * Default browser behaviour moves focus to the next/previous focusable
 * element, which means the comments panel, sidebar buttons, etc. start
 * stealing focus mid-edit. This plugin consumes Tab so the caret stays put.
 *
 * The plugin is registered *after* the commonmark preset, so list-related
 * Tab commands (sinkListItem / liftListItem) still get first crack — only
 * non-list Tab presses fall through to this trap.
 */
import { $prose } from "@milkdown/kit/utils";
import { keymap } from "@milkdown/kit/prose/keymap";

export const tabTrapPlugin = $prose(() =>
  keymap({
    Tab: () => true,
    "Shift-Tab": () => true,
  }),
);
