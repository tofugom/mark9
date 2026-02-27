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
  CommandPalette,
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
  useCommandStore,
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
  CommandState,
  Command,
} from "./stores/index.js";

export {
  imageDropPlugin,
  mermaidPlugin,
  mathPlugin,
  fileToDataUrl,
  isImageFile,
} from "./plugins/index.js";

export { extractHeadings } from "./utils/index.js";
export type { HeadingItem } from "./utils/index.js";
