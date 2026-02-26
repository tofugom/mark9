import { getWorkspaceManager } from "../stores/collab-store.js";
import { useCollabStore } from "../stores/collab-store.js";
import type { CollabUser } from "../types.js";

/**
 * Subscribe to awareness changes and return the list of connected users.
 * Includes the local user.
 */
export function useAwareness(): CollabUser[] {
  const isActive = useCollabStore((s) => s.isActive);
  const localUserName = useCollabStore((s) => s.localUserName);
  const localUserColor = useCollabStore((s) => s.localUserColor);
  const remoteUsers = useCollabStore((s) => s.users);

  // Build the full user list (local + remote)
  if (!isActive) return [];

  const manager = getWorkspaceManager();
  const localClientId = manager?.doc.clientID ?? 0;

  const localUser: CollabUser = {
    clientId: localClientId,
    name: localUserName,
    color: localUserColor,
    currentFile: null, // filled by the awareness state
  };

  return [localUser, ...remoteUsers];
}
