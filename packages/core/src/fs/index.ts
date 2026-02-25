export {
  openFile,
  saveFile,
  saveFileAs,
  openDirectory,
  readFileHandle,
  isFileSystemAccessSupported,
} from "./file-system.js";

export type {
  OpenFileResult,
  OpenDirectoryResult,
  FileTreeNode,
} from "./file-system.js";

export { FileWatcher } from "./file-watcher.js";
export type { FileChange } from "./file-watcher.js";
