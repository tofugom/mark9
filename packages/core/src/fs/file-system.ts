// Utilities for Web File System Access API

export interface OpenFileResult {
  name: string;
  path: string;
  content: string;
  handle: FileSystemFileHandle;
}

export interface OpenDirectoryResult {
  name: string;
  handle: FileSystemDirectoryHandle;
  tree: FileTreeNode[];
}

export interface FileTreeNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileTreeNode[];
  handle?: FileSystemFileHandle | FileSystemDirectoryHandle;
}

/**
 * Check whether the File System Access API is available in this browser.
 */
export function isFileSystemAccessSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "showOpenFilePicker" in window &&
    "showSaveFilePicker" in window &&
    "showDirectoryPicker" in window
  );
}

/**
 * Open a single .md file via showOpenFilePicker.
 * Returns null if the user cancels the picker.
 */
export async function openFile(): Promise<OpenFileResult | null> {
  try {
    const [handle] = await window.showOpenFilePicker({
      types: [
        {
          description: "Markdown files",
          accept: { "text/markdown": [".md", ".mdx", ".markdown"] },
        },
      ],
      multiple: false,
    });

    const file = await handle.getFile();
    const content = await file.text();

    return {
      name: file.name,
      path: `/${file.name}`,
      content,
      handle,
    };
  } catch {
    // User cancelled or API not supported
    return null;
  }
}

/**
 * Save content to an existing file handle.
 */
export async function saveFile(
  handle: FileSystemFileHandle,
  content: string,
): Promise<void> {
  const writable = await handle.createWritable();
  await writable.write(content);
  await writable.close();
}

/**
 * Save content to a new file via showSaveFilePicker.
 * Returns the new file handle, or null if the user cancels.
 */
export async function saveFileAs(
  content: string,
  suggestedName?: string,
): Promise<FileSystemFileHandle | null> {
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: suggestedName ?? "untitled.md",
      types: [
        {
          description: "Markdown files",
          accept: { "text/markdown": [".md"] },
        },
      ],
    });

    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();

    return handle;
  } catch {
    // User cancelled
    return null;
  }
}

/**
 * Read a file's text content from a FileSystemFileHandle.
 */
export async function readFileHandle(
  handle: FileSystemFileHandle,
): Promise<string> {
  const file = await handle.getFile();
  return file.text();
}

/**
 * Open a directory via showDirectoryPicker and build a filtered file tree.
 * Only .md files and directories containing .md files are included.
 * Returns null if the user cancels.
 */
export async function openDirectory(): Promise<OpenDirectoryResult | null> {
  try {
    const handle = await window.showDirectoryPicker({ mode: "readwrite" });
    const tree = await scanDirectory(handle, `/${handle.name}`);

    return {
      name: handle.name,
      handle,
      tree,
    };
  } catch {
    // User cancelled
    return null;
  }
}

/**
 * Recursively scan a directory handle and build a FileTreeNode array.
 * Only includes .md files and folders that (recursively) contain .md files.
 */
async function scanDirectory(
  dirHandle: FileSystemDirectoryHandle,
  basePath: string,
): Promise<FileTreeNode[]> {
  const entries: FileTreeNode[] = [];

  for await (const entry of dirHandle.values()) {
    const entryPath = `${basePath}/${entry.name}`;

    if (entry.kind === "file") {
      if (isMarkdownFile(entry.name)) {
        entries.push({
          name: entry.name,
          path: entryPath,
          type: "file",
          handle: entry as FileSystemFileHandle,
        });
      }
    } else if (entry.kind === "directory") {
      const children = await scanDirectory(
        entry as FileSystemDirectoryHandle,
        entryPath,
      );
      // Only include directories that contain markdown files (directly or nested)
      if (children.length > 0) {
        entries.push({
          name: entry.name,
          path: entryPath,
          type: "folder",
          children,
          handle: entry as FileSystemDirectoryHandle,
        });
      }
    }
  }

  // Sort: folders first, then files, alphabetically within each group
  entries.sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return entries;
}

function isMarkdownFile(name: string): boolean {
  const lower = name.toLowerCase();
  return lower.endsWith(".md") || lower.endsWith(".mdx") || lower.endsWith(".markdown");
}
