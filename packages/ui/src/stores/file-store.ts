import { create } from "zustand";

export interface FileNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileNode[];
  handle?: FileSystemFileHandle | FileSystemDirectoryHandle;
}

export interface FileState {
  fileTree: FileNode[];
  activeFile: string | null;
  openFiles: string[];
  dirty: boolean;
  currentContent: string;
  fileHandles: Map<string, FileSystemFileHandle>;
  directoryHandle: FileSystemDirectoryHandle | null;
  setFileTree: (tree: FileNode[]) => void;
  setActiveFile: (path: string | null) => void;
  openFile: (path: string) => void;
  closeFile: (path: string) => void;
  setDirty: (dirty: boolean) => void;
  setCurrentContent: (content: string) => void;
  setFileHandle: (path: string, handle: FileSystemFileHandle) => void;
  setDirectoryHandle: (handle: FileSystemDirectoryHandle | null) => void;
}

export const useFileStore = create<FileState>((set) => ({
  fileTree: [],
  activeFile: null,
  openFiles: [],
  dirty: false,
  currentContent: "",
  fileHandles: new Map(),
  directoryHandle: null,
  setFileTree: (tree: FileNode[]) => set({ fileTree: tree }),
  setActiveFile: (path: string | null) => set({ activeFile: path }),
  openFile: (path: string) =>
    set((s) => ({
      activeFile: path,
      openFiles: s.openFiles.includes(path)
        ? s.openFiles
        : [...s.openFiles, path],
    })),
  closeFile: (path: string) =>
    set((s) => ({
      openFiles: s.openFiles.filter((f) => f !== path),
      activeFile:
        s.activeFile === path
          ? s.openFiles.find((f) => f !== path) ?? null
          : s.activeFile,
    })),
  setDirty: (dirty: boolean) => set({ dirty }),
  setCurrentContent: (content: string) => set({ currentContent: content }),
  setFileHandle: (path: string, handle: FileSystemFileHandle) =>
    set((s) => {
      const newHandles = new Map(s.fileHandles);
      newHandles.set(path, handle);
      return { fileHandles: newHandles };
    }),
  setDirectoryHandle: (handle: FileSystemDirectoryHandle | null) =>
    set({ directoryHandle: handle }),
}));
