/**
 * ProseMirror plugin for Milkdown that handles image drag-and-drop and paste.
 *
 * When an image file is dropped onto or pasted into the editor, the plugin:
 * 1. Converts it to a base64 data URL
 * 2. Creates a ProseMirror image node using Milkdown's commonmark schema
 * 3. Inserts it at the drop position or current cursor position
 */
import { $prose } from "@milkdown/kit/utils";
import { Plugin, PluginKey } from "@milkdown/kit/prose/state";
import { imageSchema } from "@milkdown/kit/preset/commonmark";
import { fileToDataUrl, isImageFile } from "./image-upload.js";

import type { Ctx } from "@milkdown/kit/ctx";
import type { EditorView } from "@milkdown/kit/prose/view";
import type { Slice } from "@milkdown/kit/prose/model";

const imageDropPluginKey = new PluginKey("image-drop-paste");

/**
 * Extract image files from a DataTransfer object (used by both drop and paste).
 */
function getImageFiles(dataTransfer: DataTransfer | null): File[] {
  if (!dataTransfer) return [];
  const files: File[] = [];
  for (let i = 0; i < dataTransfer.files.length; i++) {
    const file = dataTransfer.files[i];
    if (file && isImageFile(file)) {
      files.push(file);
    }
  }
  return files;
}

/**
 * Insert an image node into the editor at the given position.
 */
function insertImageNode(
  view: EditorView,
  ctx: Ctx,
  src: string,
  pos: number,
  alt: string = "",
  title: string = "",
): void {
  const { state } = view;
  const nodeType = imageSchema.type(ctx);
  const node = nodeType.create({ src, alt, title });
  const tr = state.tr.insert(pos, node);
  view.dispatch(tr);
}

/**
 * Handle image files by converting them to data URLs and inserting into the editor.
 */
async function handleImageFiles(
  view: EditorView,
  ctx: Ctx,
  files: File[],
  pos: number,
): Promise<void> {
  for (const file of files) {
    try {
      const dataUrl = await fileToDataUrl(file);
      insertImageNode(view, ctx, dataUrl, pos, file.name);
    } catch (err) {
      console.error("Failed to read image file:", err);
    }
  }
}

export const imageDropPlugin = $prose((ctx: Ctx) => {
  return new Plugin({
    key: imageDropPluginKey,
    props: {
      handleDrop(view: EditorView, event: DragEvent, _slice: Slice, _moved: boolean): boolean | void {
        const files = getImageFiles(event.dataTransfer);
        if (files.length === 0) return false;

        event.preventDefault();

        // Determine drop position from coordinates
        const coordinates = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });
        const pos = coordinates ? coordinates.pos : view.state.selection.from;

        void handleImageFiles(view, ctx, files, pos);
        return true;
      },

      handlePaste(view: EditorView, event: ClipboardEvent, _slice: Slice): boolean | void {
        const files = getImageFiles(event.clipboardData);
        if (files.length === 0) return false;

        event.preventDefault();

        // Insert at current cursor position
        const pos = view.state.selection.from;
        void handleImageFiles(view, ctx, files, pos);
        return true;
      },
    },
  });
});
