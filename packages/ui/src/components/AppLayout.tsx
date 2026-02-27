import React, { useEffect } from "react";
import { TitleBar } from "./TitleBar.js";
import { Sidebar } from "./Sidebar.js";
import { EditorArea } from "./EditorArea.js";
import { Outline } from "./Outline.js";
import { StatusBar } from "./StatusBar.js";
import { CommandPalette } from "./CommandPalette.js";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts.js";
import { useCommandStore } from "../stores/command-store.js";

export interface AppLayoutProps {
  children: React.ReactNode;
  /** Optional custom Git panel passed through to the Sidebar */
  gitPanel?: React.ReactNode;
  /** Optional custom Collab panel passed through to the Sidebar */
  collabPanel?: React.ReactNode;
  /** Optional collab connection status for the StatusBar */
  collabStatus?: React.ReactNode;
  /** Current git branch name */
  branch?: string;
  /** Git file statuses for file tree badges */
  gitFileStatuses?: { filepath: string; status: string }[];
}

export function AppLayout({
  children,
  gitPanel,
  collabPanel,
  collabStatus,
  branch,
  gitFileStatuses,
}: AppLayoutProps): React.ReactElement {
  useKeyboardShortcuts();
  const togglePalette = useCommandStore((s) => s.toggle);

  // Cmd+Shift+P / Ctrl+Shift+P to open command palette
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.shiftKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        togglePalette();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePalette]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[var(--bg-app)]">
      <TitleBar />

      <div className="flex flex-row flex-1 overflow-hidden">
        <Sidebar gitPanel={gitPanel} collabPanel={collabPanel} gitFileStatuses={gitFileStatuses} />
        <EditorArea>{children}</EditorArea>
        <Outline />
      </div>

      <StatusBar collabStatus={collabStatus} branch={branch} />
      <CommandPalette />
    </div>
  );
}
