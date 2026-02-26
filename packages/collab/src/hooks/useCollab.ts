import { useEffect, useCallback, useRef } from "react";
import { useCollabStore, getWorkspaceManager } from "../stores/collab-store.js";
import type { CollabFileNode } from "../types.js";

interface FileContentMap {
  [filePath: string]: string;
}

/**
 * Top-level hook for managing collab session lifecycle.
 *
 * Call `initWorkspace()` after starting a session as host to load the
 * current file tree and file contents into the shared Yjs document.
 *
 * For joiners, use `onFileTreeSync` to receive the file tree from the host.
 */
export function useCollab(options?: {
  /** Called when the shared file tree is updated (for joiners to sync). */
  onFileTreeSync?: (tree: CollabFileNode[]) => void;
}) {
  const isActive = useCollabStore((s) => s.isActive);
  const roomId = useCollabStore((s) => s.roomId);
  const connectionState = useCollabStore((s) => s.connectionState);
  const isHost = useCollabStore((s) => s.isHost);
  const startSession = useCollabStore((s) => s.startSession);
  const joinSession = useCollabStore((s) => s.joinSession);
  const leaveSession = useCollabStore((s) => s.leaveSession);

  const onFileTreeSyncRef = useRef(options?.onFileTreeSync);
  onFileTreeSyncRef.current = options?.onFileTreeSync;

  // Subscribe to file tree changes from the Yjs workspace (for joiners)
  useEffect(() => {
    if (!isActive) return;
    const manager = getWorkspaceManager();
    if (!manager) return;

    // Initial sync — if there's already a file tree (joiner connecting to existing session)
    const existingTree = manager.getFileTree();
    if (existingTree.length > 0) {
      onFileTreeSyncRef.current?.(existingTree);
    }

    // Listen for ongoing changes
    const unsub = manager.onFileTreeChange((tree) => {
      onFileTreeSyncRef.current?.(tree);
    });

    return unsub;
  }, [isActive, connectionState]);

  /**
   * Host calls this after starting a session to load the workspace into Yjs.
   * Pushes the file tree and all file contents into the shared Y.Doc.
   */
  const initWorkspace = useCallback(
    (fileTree: CollabFileNode[], fileContents: FileContentMap) => {
      const manager = getWorkspaceManager();
      if (!manager) {
        console.warn("[collab] initWorkspace called but no manager");
        return;
      }

      console.log("[collab] Initializing workspace with", Object.keys(fileContents).length, "files");

      // Set the shared file tree
      manager.setFileTree(fileTree);

      // Pre-create fragments for each file (the content will sync via y-prosemirror
      // when the editor mounts, but we need fragments to exist)
      for (const filePath of Object.keys(fileContents)) {
        manager.getFragment(filePath);
      }
    },
    [],
  );

  return {
    isActive,
    roomId,
    connectionState,
    isHost,
    startSession,
    joinSession,
    leaveSession,
    initWorkspace,
    getManager: getWorkspaceManager,
  };
}
