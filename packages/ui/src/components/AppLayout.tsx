import React from "react";
import { TitleBar } from "./TitleBar.js";
import { Sidebar } from "./Sidebar.js";
import { EditorArea } from "./EditorArea.js";
import { Outline } from "./Outline.js";
import { StatusBar } from "./StatusBar.js";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts.js";

export interface AppLayoutProps {
  children: React.ReactNode;
  /** Optional custom Git panel passed through to the Sidebar */
  gitPanel?: React.ReactNode;
}

export function AppLayout({
  children,
  gitPanel,
}: AppLayoutProps): React.ReactElement {
  useKeyboardShortcuts();

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[var(--bg-app)]">
      <TitleBar />

      <div className="flex flex-row flex-1 overflow-hidden">
        <Sidebar gitPanel={gitPanel} />
        <EditorArea>{children}</EditorArea>
        <Outline />
      </div>

      <StatusBar />
    </div>
  );
}
