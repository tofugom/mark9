import { useEffect, useRef } from "react";
import { saveFile } from "@mark9/core";
import { useFileStore } from "../stores/file-store.js";
import { useSettingsStore } from "../stores/settings-store.js";
import type { AutoSaveInterval } from "../stores/settings-store.js";

function intervalToMs(interval: AutoSaveInterval): number | null {
  switch (interval) {
    case "1s":
      return 1000;
    case "5s":
      return 5000;
    case "30s":
      return 30000;
    case "off":
    default:
      return null;
  }
}

/**
 * Auto-save hook. When enabled, saves the current file after the configured
 * delay whenever the dirty flag is true.
 */
export function useAutoSave(): void {
  const autoSave = useSettingsStore((s) => s.autoSave);
  const dirty = useFileStore((s) => s.dirty);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear any pending timer when settings or dirty state changes
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const delayMs = intervalToMs(autoSave);
    if (delayMs === null || !dirty) return;

    timerRef.current = setTimeout(() => {
      const state = useFileStore.getState();
      const { activeFile, fileHandles, currentContent } = state;

      if (activeFile && fileHandles.has(activeFile)) {
        const handle = fileHandles.get(activeFile)!;
        void saveFile(handle, currentContent).then(() => {
          useFileStore.getState().setDirty(false);
        });
      }
    }, delayMs);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [autoSave, dirty]);
}
