import { create } from "zustand";

export type EditorMode = "wysiwyg" | "source";

export interface EditorState {
  mode: EditorMode;
  cursorLine: number;
  cursorCol: number;
  toggleMode: () => void;
  setCursorPosition: (line: number, col: number) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  mode: "wysiwyg",
  cursorLine: 1,
  cursorCol: 1,
  toggleMode: () =>
    set((s) => ({
      mode: s.mode === "wysiwyg" ? "source" : "wysiwyg",
    })),
  setCursorPosition: (line: number, col: number) =>
    set({ cursorLine: line, cursorCol: col }),
}));
