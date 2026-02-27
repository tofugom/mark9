import { create } from "zustand";
import type { CollabState, CollabUser, ConnectionState } from "../types.js";
import { WorkspaceManager } from "../yjs/workspace-manager.js";
import { generateRoomCode } from "../utils/room-code.js";
import { assignColor } from "../utils/colors.js";

const USERNAME_STORAGE_KEY = "mark9-collab-username";

function loadUserName(): string {
  try {
    return localStorage.getItem(USERNAME_STORAGE_KEY) || "Anonymous";
  } catch {
    return "Anonymous";
  }
}

function saveUserName(name: string): void {
  try {
    localStorage.setItem(USERNAME_STORAGE_KEY, name);
  } catch {
    // localStorage unavailable (e.g. incognito with quota exceeded)
  }
}

let manager: WorkspaceManager | null = null;

/** Get the current WorkspaceManager instance (null when not in a session). */
export function getWorkspaceManager(): WorkspaceManager | null {
  return manager;
}

export const useCollabStore = create<CollabState>((set, get) => ({
  isActive: false,
  roomId: null,
  connectionState: "disconnected" as ConnectionState,
  isHost: false,
  users: [],
  localUserName: loadUserName(),
  localUserColor: assignColor(loadUserName()),
  synced: false,

  startSession: (serverUrl: string, userName: string): string => {
    try {
      // Clean up any existing session
      manager?.destroy();

      const roomId = generateRoomCode();
      const color = assignColor(userName);

      console.log(`[collab] Starting session: room=${roomId}, server=${serverUrl}, user=${userName}`);

      manager = new WorkspaceManager();
      manager.connect(serverUrl, roomId, userName, color);
      manager.setHost();

      setupConnectionListeners(set);

      set({
        isActive: true,
        roomId,
        connectionState: "connecting",
        isHost: true,
        synced: true, // Host is the data source — always "synced"
        localUserName: userName,
        localUserColor: color,
      });

      saveUserName(userName);
      console.log(`[collab] Session started successfully: ${roomId}`);
      return roomId;
    } catch (err) {
      console.error("[collab] Failed to start session:", err);
      // Clean up on failure
      manager?.destroy();
      manager = null;
      return "";
    }
  },

  joinSession: (serverUrl: string, roomId: string, userName: string): void => {
    try {
      manager?.destroy();

      const color = assignColor(userName);

      console.log(`[collab] Joining session: room=${roomId}, server=${serverUrl}, user=${userName}`);

      manager = new WorkspaceManager();
      manager.connect(serverUrl, roomId, userName, color);

      setupConnectionListeners(set);

      set({
        isActive: true,
        roomId,
        connectionState: "connecting",
        isHost: false,
        synced: false, // Joiner must wait for Yjs sync
        localUserName: userName,
        localUserColor: color,
      });

      saveUserName(userName);
      console.log(`[collab] Joined session successfully: ${roomId}`);
    } catch (err) {
      console.error("[collab] Failed to join session:", err);
      manager?.destroy();
      manager = null;
    }
  },

  leaveSession: (): void => {
    manager?.destroy();
    manager = null;

    set({
      isActive: false,
      roomId: null,
      connectionState: "disconnected",
      isHost: false,
      synced: false,
      users: [],
    });
  },

  kickUser: (clientId: number): void => {
    if (!get().isHost || !manager) return;

    // Send a kick message through awareness — the target client will
    // observe its own clientId in the "kicked" field and disconnect.
    const awareness = manager.getAwareness();
    if (awareness) {
      awareness.setLocalStateField("kick", clientId);
      // Clear after a tick so it doesn't persist
      setTimeout(() => {
        awareness.setLocalStateField("kick", null);
      }, 500);
    }
  },

  regenerateSession: (): string => {
    const { localUserName } = get();
    const serverUrl = manager?.provider?.url ?? "ws://localhost:4444";

    // Destroy existing session (kicks everyone)
    manager?.destroy();
    manager = null;

    // Start a fresh session with a new code
    const newRoomId = get().startSession(serverUrl, localUserName);
    return newRoomId;
  },

  setLocalUserName: (name: string): void => {
    set({ localUserName: name, localUserColor: assignColor(name) });
    saveUserName(name);

    // Update awareness if connected
    const awareness = manager?.getAwareness();
    if (awareness) {
      awareness.setLocalStateField("user", {
        name,
        color: assignColor(name),
      });
    }
  },
}));

// ── Internal helpers ───────────────────────────────────────

type SetFn = (partial: Partial<CollabState>) => void;

function setupConnectionListeners(set: SetFn): void {
  if (!manager?.provider) return;

  const provider = manager.provider;

  provider.on("status", ({ status }: { status: string }) => {
    set({
      connectionState:
        status === "connected" ? "connected" : "connecting",
    });
  });

  // Track initial document sync (important for joiners)
  provider.on("sync", (isSynced: boolean) => {
    if (isSynced) {
      console.log("[collab] Initial document sync complete");
      set({ synced: true });
    }
  });

  // Track connected users via awareness
  const awareness = provider.awareness;
  const updateUsers = () => {
    const users: CollabUser[] = [];
    awareness.getStates().forEach((state, clientId) => {
      if (clientId === awareness.clientID) return; // skip self
      const user = state.user as
        | { name: string; color: string }
        | undefined;
      if (user) {
        users.push({
          clientId,
          name: user.name,
          color: user.color,
          currentFile: (state.currentFile as string) ?? null,
        });
      }
    });
    set({ users });
  };

  awareness.on("change", updateUsers);

  // Handle being kicked
  awareness.on(
    "change",
    (
      _changes: unknown,
      _origin: unknown,
    ) => {
      const states = awareness.getStates();
      for (const [, state] of states) {
        if (
          (state as Record<string, unknown>).kick === awareness.clientID
        ) {
          // We've been kicked — disconnect gracefully
          useCollabStore.getState().leaveSession();
          break;
        }
      }
    },
  );
}
