// ── Types ──────────────────────────────────────────────────
export type {
  CollabUser,
  ConnectionState,
  CollabConfig,
  CollabSessionOptions,
  CollabState,
  CollabFileNode,
} from "./types.js";

// ── Yjs core ───────────────────────────────────────────────
export { WorkspaceManager } from "./yjs/workspace-manager.js";

// ── ProseMirror plugins ────────────────────────────────────
export {
  ySyncMilkdownPlugin,
  yCursorMilkdownPlugin,
  yUndoMilkdownPlugin,
} from "./prosemirror/collab-plugin.js";

// ── Zustand store ──────────────────────────────────────────
export { useCollabStore, getWorkspaceManager } from "./stores/collab-store.js";

// ── React hooks ────────────────────────────────────────────
export { useCollab } from "./hooks/useCollab.js";
export { useAwareness } from "./hooks/useAwareness.js";
export { useCollabFile } from "./hooks/useCollabFile.js";

// ── React components ───────────────────────────────────────
export { CollabToolbar } from "./components/CollabToolbar.js";
export { UserList } from "./components/UserList.js";
export { UserAvatars } from "./components/UserAvatars.js";
export { ConnectionStatus } from "./components/ConnectionStatus.js";
export { JoinDialog } from "./components/JoinDialog.js";

// ── Utilities ──────────────────────────────────────────────
export { generateRoomCode } from "./utils/room-code.js";
export { assignColor } from "./utils/colors.js";
