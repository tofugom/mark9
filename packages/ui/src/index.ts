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
  EditorToolbar,
  SettingsPanel,
} from "./components/index.js";

export type {
  Mark9EditorProps,
  SourceEditorProps,
  DualEditorProps,
  EditorToolbarProps,
  SidebarProps,
  AppLayoutProps,
} from "./components/index.js";

export { useKeyboardShortcuts, useFileActions, useAutoSave } from "./hooks/index.js";

export {
  useLayoutStore,
  useFileStore,
  useEditorStore,
  useThemeStore,
  useSettingsStore,
  useRecentFilesStore,
} from "./stores/index.js";

export type {
  LayoutState,
  FileState,
  FileNode,
  EditorState,
  EditorMode,
  ThemeState,
  ThemeName,
  SettingsState,
  AutoSaveInterval,
  RecentFilesState,
  RecentFileEntry,
} from "./stores/index.js";

export {
  imageDropPlugin,
  mermaidPlugin,
  fileToDataUrl,
  isImageFile,
} from "./plugins/index.js";

export { extractHeadings } from "./utils/index.js";
export type { HeadingItem } from "./utils/index.js";
