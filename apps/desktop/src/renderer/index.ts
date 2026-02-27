/**
 * Desktop renderer entry point.
 *
 * This module initializes the desktop-specific integrations:
 * - Listens for menu actions from the Bun main process
 * - Routes them to the appropriate store/action in the React app
 * - Notifies the main process when the editor is ready
 *
 * Import this module from the web app's main.tsx when running in desktop mode.
 */
export {
  onMenuAction,
  onFSWatch,
  notifyEditorReady,
  notifyContentChanged,
  setWindowTitle,
  readFile,
  writeFile,
  readDir,
  exists,
  mkdir,
  gitIsRepo,
  gitStatus,
  gitCurrentBranch,
  gitLog,
  gitStage,
  gitCommit,
} from "./rpc-client.js";

export type { MenuActionHandler, FSWatchHandler } from "./rpc-client.js";
