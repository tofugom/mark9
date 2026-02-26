import type * as Y from "yjs";
import type { Awareness } from "y-protocols/awareness";

/** A connected collaborator. */
export interface CollabUser {
  /** Yjs client ID (unique per connection). */
  clientId: number;
  /** Display name chosen by the user. */
  name: string;
  /** Deterministic hex color based on the name. */
  color: string;
  /** File path the user is currently editing (null if idle). */
  currentFile: string | null;
}

/** WebSocket connection lifecycle states. */
export type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected";

/** Configuration passed to the editor when collab is active. */
export interface CollabConfig {
  /** ProseMirror XML fragment for the active file. */
  xmlFragment: Y.XmlFragment;
  /** Shared awareness instance. */
  awareness: Awareness;
}

/** Options to start or join a collaboration session. */
export interface CollabSessionOptions {
  /** WebSocket server URL, e.g. "ws://localhost:4444". */
  serverUrl: string;
  /** Room identifier (6-char code). */
  roomId: string;
  /** Local user display name. */
  userName: string;
}

/** Zustand store interface for collaboration state. */
export interface CollabState {
  /** Whether a collab session is active. */
  isActive: boolean;
  /** Current room ID (null when disconnected). */
  roomId: string | null;
  /** WebSocket connection state. */
  connectionState: ConnectionState;
  /** Whether this client is the session host. */
  isHost: boolean;
  /** List of connected users (from awareness). */
  users: CollabUser[];
  /** Local user display name (persisted in localStorage). */
  localUserName: string;
  /** Local user color (derived from name). */
  localUserColor: string;

  // ── Actions ──────────────────────────────────────────────

  /** Create a new collab session and return the room code. */
  startSession: (serverUrl: string, userName: string) => string;
  /** Join an existing session by room code. */
  joinSession: (serverUrl: string, roomId: string, userName: string) => void;
  /** Leave the current session. */
  leaveSession: () => void;
  /** Kick a user by their client ID (host only). */
  kickUser: (clientId: number) => void;
  /** End the current session and start a new one with a fresh code. */
  regenerateSession: () => string;
  /** Update the local display name. */
  setLocalUserName: (name: string) => void;
}

/** Serialised file tree node synced via Y.Map("fileTree"). */
export interface CollabFileNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: CollabFileNode[];
}
