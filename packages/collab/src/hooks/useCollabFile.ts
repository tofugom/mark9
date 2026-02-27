import { useEffect } from "react";
import { getWorkspaceManager } from "../stores/collab-store.js";
import { useCollabStore } from "../stores/collab-store.js";
import type { CollabConfig } from "../types.js";

/**
 * Binds the collab session to a specific file path.
 *
 * Returns a CollabConfig (xmlFragment + awareness) when collab is active
 * for the given file, or null when collab is inactive.
 *
 * Automatically updates the awareness "currentFile" field so other users
 * can see which file this user is editing.
 */
export function useCollabFile(filePath: string | null): CollabConfig | null {
  const isActive = useCollabStore((s) => s.isActive);
  const synced = useCollabStore((s) => s.synced);

  // Update awareness when the active file changes
  useEffect(() => {
    if (!isActive) return;
    const manager = getWorkspaceManager();
    manager?.setCurrentFile(filePath);
  }, [filePath, isActive]);

  // Don't return config until initial sync is complete (prevents joiners
  // from mounting the editor with an empty fragment)
  if (!isActive || !synced || !filePath) return null;

  const manager = getWorkspaceManager();
  if (!manager) return null;

  const awareness = manager.getAwareness();
  if (!awareness) return null;

  const xmlFragment = manager.getFragment(filePath);

  return { xmlFragment, awareness };
}
