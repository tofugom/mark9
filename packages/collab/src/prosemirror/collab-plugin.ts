import { $prose } from "@milkdown/kit/utils";
import { ySyncPlugin, yCursorPlugin, yUndoPlugin } from "y-prosemirror";
import type * as Y from "yjs";
import type { Awareness } from "y-protocols/awareness";

/**
 * Milkdown-compatible wrapper for y-prosemirror's sync plugin.
 * Binds a ProseMirror editor to a shared Y.XmlFragment.
 */
export const ySyncMilkdownPlugin = (fragment: Y.XmlFragment) =>
  $prose(() => ySyncPlugin(fragment));

/**
 * Milkdown-compatible wrapper for y-prosemirror's cursor plugin.
 * Renders remote users' cursors and selections.
 */
export const yCursorMilkdownPlugin = (awareness: Awareness) =>
  $prose(() => yCursorPlugin(awareness));

/**
 * Milkdown-compatible wrapper for y-prosemirror's undo plugin.
 * Replaces ProseMirror's default undo/redo with Yjs-aware undo.
 */
export const yUndoMilkdownPlugin = () =>
  $prose(() => yUndoPlugin());
