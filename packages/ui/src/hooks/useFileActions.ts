import { useCallback } from "react";
import {
  openFile,
  saveFile,
  saveFileAs,
  openDirectory,
  readFileHandle,
} from "@mark9/core";
import type { FileTreeNode } from "@mark9/core";
import { useFileStore } from "../stores/file-store.js";
import type { FileNode } from "../stores/file-store.js";

/**
 * Convert core FileTreeNode[] (which may have handles) into store-friendly FileNode[].
 * The handles are registered in the file store separately.
 */
function toFileNodes(
  nodes: FileTreeNode[],
  registerHandle: (path: string, handle: FileSystemFileHandle) => void,
): FileNode[] {
  return nodes.map((node) => {
    if (node.type === "file" && node.handle) {
      registerHandle(node.path, node.handle as FileSystemFileHandle);
    }

    const fileNode: FileNode = {
      name: node.name,
      path: node.path,
      type: node.type,
    };

    if (node.children) {
      fileNode.children = toFileNodes(node.children, registerHandle);
    }

    return fileNode;
  });
}

/**
 * Provides high-level file operations that connect the store with the
 * File System Access API.
 */
export function useFileActions() {
  const setActiveFile = useFileStore((s) => s.setActiveFile);
  const storeOpenFile = useFileStore((s) => s.openFile);
  const setDirty = useFileStore((s) => s.setDirty);
  const setCurrentContent = useFileStore((s) => s.setCurrentContent);
  const setFileHandle = useFileStore((s) => s.setFileHandle);
  const setDirectoryHandle = useFileStore((s) => s.setDirectoryHandle);
  const setFileTree = useFileStore((s) => s.setFileTree);

  /**
   * Opens the file picker, loads the selected .md file content into the editor.
   */
  const handleOpenFile = useCallback(async () => {
    const result = await openFile();
    if (!result) return;

    setFileHandle(result.path, result.handle);
    setCurrentContent(result.content);
    storeOpenFile(result.path);
    setActiveFile(result.path);
    setDirty(false);
  }, [setFileHandle, setCurrentContent, storeOpenFile, setActiveFile, setDirty]);

  /**
   * Opens the directory picker and populates the sidebar file tree.
   */
  const handleOpenFolder = useCallback(async () => {
    const result = await openDirectory();
    if (!result) return;

    const tree = toFileNodes(result.tree, setFileHandle);
    setFileTree(tree);
    setDirectoryHandle(result.handle);
  }, [setFileHandle, setFileTree, setDirectoryHandle]);

  /**
   * Saves the current file. If the current file has a handle, saves to it directly.
   * Otherwise, calls handleSaveAs.
   */
  const showSaveMessage = useFileStore((s) => s.showSaveMessage);

  const handleSave = useCallback(async () => {
    const state = useFileStore.getState();
    const { activeFile, fileHandles, currentContent } = state;

    if (activeFile && fileHandles.has(activeFile)) {
      const handle = fileHandles.get(activeFile)!;
      await saveFile(handle, currentContent);
      setDirty(false);
      showSaveMessage("Saved");
    } else {
      // No existing handle — fall through to Save As
      const fileName = activeFile?.split("/").pop() ?? "untitled.md";
      const handle = await saveFileAs(currentContent, fileName);
      if (handle) {
        const name = handle.name;
        const path = `/${name}`;
        setFileHandle(path, handle);
        storeOpenFile(path);
        setActiveFile(path);
        setDirty(false);
        showSaveMessage("Saved");
      }
    }
  }, [setDirty, setFileHandle, storeOpenFile, setActiveFile, showSaveMessage]);

  /**
   * Opens Save As picker regardless of whether a handle exists.
   */
  const handleSaveAs = useCallback(async () => {
    const state = useFileStore.getState();
    const { activeFile, currentContent } = state;
    const fileName = activeFile?.split("/").pop() ?? "untitled.md";

    const handle = await saveFileAs(currentContent, fileName);
    if (handle) {
      const name = handle.name;
      const path = `/${name}`;
      setFileHandle(path, handle);
      storeOpenFile(path);
      setActiveFile(path);
      setDirty(false);
    }
  }, [setFileHandle, storeOpenFile, setActiveFile, setDirty]);

  /**
   * When clicking a file in the sidebar, load its content into the editor.
   */
  const handleFileTreeClick = useCallback(
    async (path: string) => {
      const state = useFileStore.getState();
      const handle = state.fileHandles.get(path);

      if (handle) {
        const content = await readFileHandle(handle);
        setCurrentContent(content);
        storeOpenFile(path);
        setActiveFile(path);
        setDirty(false);
      } else {
        // No handle available (mock file tree) — just switch the active file
        storeOpenFile(path);
        setActiveFile(path);
      }
    },
    [setCurrentContent, storeOpenFile, setActiveFile, setDirty],
  );

  return {
    handleOpenFile,
    handleOpenFolder,
    handleSave,
    handleSaveAs,
    handleFileTreeClick,
  };
}
