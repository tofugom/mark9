// @mark9/core - Core markdown editor logic
export {
  createEditor,
  Editor,
  defaultValueCtx,
  rootCtx,
  commonmark,
  listener,
  listenerCtx,
  nord,
} from "./editor/index.js";

export type { EditorSetupOptions } from "./editor/index.js";

export {
  openFile,
  saveFile,
  saveFileAs,
  openDirectory,
  readFileHandle,
  isFileSystemAccessSupported,
} from "./fs/index.js";

export type {
  OpenFileResult,
  OpenDirectoryResult,
  FileTreeNode,
} from "./fs/index.js";
