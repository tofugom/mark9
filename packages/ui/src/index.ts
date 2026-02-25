// @mark9/ui - Shared UI components
export {
  Mark9Editor,
  SourceEditor,
  DualEditor,
  AppLayout,
  EditorArea,
  Outline,
  Sidebar,
  StatusBar,
  TitleBar,
} from "./components/index.js";

export type {
  Mark9EditorProps,
  SourceEditorProps,
  DualEditorProps,
} from "./components/index.js";

export { useKeyboardShortcuts, useFileActions } from "./hooks/index.js";

export {
  useLayoutStore,
  useFileStore,
  useEditorStore,
} from "./stores/index.js";

export type {
  LayoutState,
  FileState,
  FileNode,
  EditorState,
  EditorMode,
} from "./stores/index.js";
