import React from "react";
import { TitleBar } from "./TitleBar.js";
import { Sidebar } from "./Sidebar.js";
import { EditorArea } from "./EditorArea.js";
import { Outline } from "./Outline.js";
import { StatusBar } from "./StatusBar.js";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts.js";

export function AppLayout({
  children,
}: React.PropsWithChildren): React.ReactElement {
  useKeyboardShortcuts();

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <TitleBar />

      <div className="flex flex-row flex-1 overflow-hidden">
        <Sidebar />
        <EditorArea>{children}</EditorArea>
        <Outline />
      </div>

      <StatusBar />
    </div>
  );
}
