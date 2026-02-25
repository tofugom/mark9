import { useEffect } from "react";
import { useLayoutStore } from "../stores/layout-store.js";
import { useEditorStore } from "../stores/editor-store.js";

export function useKeyboardShortcuts(): void {
  const toggleSidebar = useLayoutStore((s) => s.toggleSidebar);
  const toggleOutline = useLayoutStore((s) => s.toggleOutline);
  const toggleMode = useEditorStore((s) => s.toggleMode);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      const mod = e.metaKey || e.ctrlKey;

      // Ctrl/Cmd + Shift + E -> toggle sidebar
      if (mod && e.shiftKey && e.key === "E") {
        e.preventDefault();
        toggleSidebar();
        return;
      }

      // Ctrl/Cmd + Shift + O -> toggle outline
      if (mod && e.shiftKey && e.key === "O") {
        e.preventDefault();
        toggleOutline();
        return;
      }

      // Ctrl/Cmd + / -> toggle editor mode
      if (mod && e.key === "/") {
        e.preventDefault();
        toggleMode();
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleSidebar, toggleOutline, toggleMode]);
}
