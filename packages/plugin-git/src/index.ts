// @mark9/plugin-git - Git integration plugin using isomorphic-git

// Components
export { GitPanel } from "./components/index.js";

// Store
export { useGitStore } from "./git-store.js";
export type { GitState } from "./git-store.js";

// Git operations
export {
  initRepo,
  getStatus,
  stageFile,
  unstageFile,
  commit,
  getLog,
  getBranches,
  getCurrentBranch,
  createBranch,
  checkoutBranch,
  getDiff,
  cloneRepo,
  push,
  pull,
  getFs,
  setFs,
} from "./git-operations.js";

export type {
  FileStatusEntry,
  FileStatusCode,
  CommitEntry,
  AuthorInfo,
  RemoteConfig,
} from "./git-operations.js";
